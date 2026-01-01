/**
 * ====================================================================
 * 2026 新春版 Apple 账号共享系统 - Ultimate Fix V2 (Modular)
 * ====================================================================
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');

// 导入自定义模块
const config = require('./core/config');
const utils = require('./core/utils');
const database = require('./core/database');
const sync = require('./core/sync');
const adminViews = require('./views/admin');
const frontendViews = require('./views/frontend');
const nodemailer = require('nodemailer');

// 邮件传输器创建函数
function createTransporter() {
    const conf = global.DB.settings.email;
    if (!conf) return null;
    
    // 如果是 QQ 邮箱且没有指定 host，可以使用 service 模式
    if (conf.user.endsWith('@qq.com') && !conf.host) {
        return nodemailer.createTransport({
            service: 'qq',
            auth: { user: conf.user, pass: conf.pass }
        });
    }

    // 通用 SMTP 配置
    return nodemailer.createTransport({
        host: conf.host,
        port: parseInt(conf.port),
        secure: conf.secure,
        auth: { user: conf.user, pass: conf.pass },
        tls: {
            rejectUnauthorized: false
        }
    });
}

// 兼容 node-fetch v2 和 v3 的动态导入写法
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

// 中间件配置
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', true); 
app.use(session({
    secret: process.env.SESSION_SECRET || 'apple-share-default-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// 管理员权限验证中间件
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// ==========================================
// 1. 后台管理路由
// ==========================================

app.get('/admin', (req, res) => res.redirect('/admin/dashboard'));

app.get('/admin/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin/dashboard');
    res.send(adminViews.getLoginHtml());
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const inputHash = utils.hashToken(password);
    
    if (username === global.DB.admin.user && inputHash === global.DB.admin.pass) {
        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send(`
            <script>
                window.onload = function() {
                    if (typeof showGlobalToast === 'function') {
                        showGlobalToast("笨蛋！账号或密码错啦~", true);
                        setTimeout(function() {
                            window.location.href = "/admin/login";
                        }, 2000);
                    } else {
                        alert("笨蛋！账号或密码错啦~");
                        window.location.href = "/admin/login";
                    }
                };
            </script>
        `);
    }
});

// 验证码缓存 (生产环境建议用 Redis)
const emailVerifyCodes = new Map();

// API: 发送邮件验证码
app.post('/api/auth/send-code', async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.json({ success: false, msg: '请输入有效邮箱' });
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailVerifyCodes.set(email, { code, time: Date.now() });

    try {
        const transporter = createTransporter();
        if (!transporter) throw new Error('邮件服务未配置');
        
        await transporter.sendMail({
            from: `"Apple 共享系统" <${global.DB.settings.email.user}>`,
            to: email,
            subject: '【Apple 共享系统】您的注册验证码',
            text: `您的注册验证码是：${code}。验证码 5 分钟内有效。`,
            html: `<p>您的注册验证码是：<b>${code}</b></p><p>验证码 5 分钟内有效。</p>`
        });
        res.json({ success: true, msg: '验证码已发送至您的邮箱' });
    } catch (e) {
        console.error('Send mail error:', e);
        res.json({ success: false, msg: '发送失败，请稍后再试' });
    }
});

// API: 用户注册
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password, code, hcaptcha_token } = req.body;
    
    // 1. 验证 hCaptcha (假设后端已配置 SECRET)
    const hcaptcha_secret = global.DB.settings?.hcaptcha?.SECRET_KEY;
    if (global.DB.settings?.hcaptcha?.enabled) {
        if (!hcaptcha_token) return res.json({ success: false, msg: '请先完成人机验证' });
        const hres = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ response: hcaptcha_token, secret: hcaptcha_secret })
        });
        const hdata = await hres.json();
        if (!hdata.success) return res.json({ success: false, msg: '人机验证未通过' });
    }

    // 2. 验证码校验
    const cached = emailVerifyCodes.get(email);
    if (!cached || cached.code !== code || (Date.now() - cached.time) > 5 * 60 * 1000) {
        return res.json({ success: false, msg: '验证码错误或已过期' });
    }
    emailVerifyCodes.delete(email);

    // 3. 存储用户信息 (哈希处理)
    try {
        const uHash = utils.hashToken(username);
        const eHash = utils.hashToken(email);
        const pHash = utils.hashToken(password);

        await database.getPool().query(
            'INSERT INTO users (username_hash, email_hash, password_hash, username_display, email_display) VALUES (?, ?, ?, ?, ?)',
            [uHash, eHash, pHash, username, email]
        );
        res.json({ success: true, msg: '注册成功！请登录' });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') return res.json({ success: false, msg: '用户名或邮箱已存在' });
        console.error('Register error:', e);
        res.json({ success: false, msg: '注册失败，请稍后再试' });
    }
});

// API: 用户登录
app.post('/api/auth/login', async (req, res) => {
    const { account, password, hcaptcha_token } = req.body;

    if (global.DB.settings?.hcaptcha?.enabled) {
        if (!hcaptcha_token) return res.json({ success: false, msg: '请先完成人机验证' });
    }

    try {
        const aHash = utils.hashToken(account);
        const pHash = utils.hashToken(password);

        const [rows] = await database.getPool().query(
            'SELECT * FROM users WHERE (username_hash = ? OR email_hash = ?) AND password_hash = ?',
            [aHash, aHash, pHash]
        );

        if (rows.length > 0) {
            req.session.userId = rows[0].id;
            req.session.userDisplay = rows[0].username_display;
            res.json({ success: true, msg: '登录成功' });
        } else {
            res.json({ success: false, msg: '账号或密码错误' });
        }
    } catch (e) {
        res.json({ success: false, msg: '服务器错误' });
    }
});

// API: 获取复制记录
app.get('/api/user/copy-records', async (req, res) => {
    if (!req.session.userId) return res.json({ success: false, msg: '未登录' });
    try {
        const [rows] = await database.getPool().query(
            'SELECT account_username, copied_at FROM copy_records WHERE user_id = ? ORDER BY copied_at DESC LIMIT 50',
            [req.session.userId]
        );
        res.json({ success: true, records: rows });
    } catch (e) {
        res.json({ success: false });
    }
});

// API: 用户登出
app.get('/api/auth/logout', (req, res) => {
    req.session.userId = null;
    req.session.userDisplay = null;
    res.json({ success: true });
});

// 记录复制行为
app.post('/api/user/record-copy', async (req, res) => {
    const { account } = req.body;
    if (req.session.userId && account) {
        await database.getPool().query(
            'INSERT INTO copy_records (user_id, account_username) VALUES (?, ?)',
            [req.session.userId, account]
        );
    }
    res.json({ success: true });
});

// 后台 API: 实时用户数
app.get('/admin/api/stats', async (req, res) => {
    const [uRows] = await database.getPool().query('SELECT COUNT(*) as count FROM users');
    const [cRows] = await database.getPool().query('SELECT COUNT(*) as count FROM copy_records');
    res.json({ userCount: uRows[0].count, copyCount: cRows[0].count });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin Linux.do Binding & Login
app.get('/admin/auth/linuxdo', requireAdmin, (req, res) => {
    req.session.isBindingAdmin = true;
    res.redirect('/api/auth/linuxdo');
});

app.get('/admin/auth/linuxdo/unbind', requireAdmin, async (req, res) => {
    global.DB.admin.linuxdo_id = null;
    global.DB.admin.linuxdo_username = null;
    await database.saveDB();
    res.redirect('/admin/dashboard?tab=admin&saved=1');
});

app.get('/admin/login/linuxdo', (req, res) => {
    req.session.isAdminLogin = true;
    res.redirect('/api/auth/linuxdo');
});

app.get('/admin/dashboard', requireAdmin, (req, res) => {
    res.send(adminViews.getDashboardHtml(global.DB, sync.cachedData, config.DEFAULT_DB));
});

// 后台 API
app.get('/admin/api/keys', requireAdmin, async (req, res) => {
    try {
        const [rows] = await database.pool.query('SELECT * FROM vip_keys ORDER BY created_at DESC');
        const displayRows = rows.map(r => ({
            ...r,
            code_display: r.code || '🔒 (旧数据无明文)',
            status_text: r.is_banned ? '已封禁' : (r.type === 'count' && r.current_usage >= r.val_limit ? '已耗尽' : (r.type === 'time' && new Date(r.expire_at) < new Date() ? '已过期' : '正常'))
        }));
        res.json(displayRows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/admin/api/keys/generate', requireAdmin, async (req, res) => {
    const { type, value, amount } = req.body;
    const count = parseInt(amount) || 1;
    const val = parseInt(value) || 1;
    const generatedKeys = [];
    
    try {
        for (let i = 0; i < count; i++) {
            const rawCode = 'VIP' + crypto.randomBytes(4).toString('hex').toUpperCase() + new Date().getTime().toString().slice(-4);
            const hashedCode = utils.hashToken(rawCode);
            
            let expireAt = null;
            let limit = 0;
            
            if (type === 'time') {
                const d = new Date();
                d.setDate(d.getDate() + val);
                expireAt = d;
            } else {
                limit = val;
            }
            
            await database.pool.query('INSERT INTO vip_keys (code, encrypted_code, type, val_limit, expire_at) VALUES (?, ?, ?, ?, ?)', [rawCode, hashedCode, type, limit, expireAt]);
            generatedKeys.push(rawCode);
        }
        res.json({ success: true, keys: generatedKeys });
    } catch (e) { res.json({ success: false, msg: e.message }); }
});

app.post('/admin/api/keys/ban', requireAdmin, async (req, res) => {
    const { id, is_banned } = req.body;
    await database.pool.query('UPDATE vip_keys SET is_banned = ? WHERE id = ?', [is_banned, id]);
    res.json({ success: true });
});

app.post('/admin/api/keys/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    await database.pool.query('DELETE FROM vip_keys WHERE id = ?', [id]);
    await database.pool.query('DELETE FROM vip_logs WHERE key_id = ?', [id]);
    res.json({ success: true });
});

app.get('/admin/api/logs/:keyId', requireAdmin, async (req, res) => {
    const [rows] = await database.pool.query('SELECT * FROM vip_logs WHERE key_id = ? ORDER BY used_at DESC LIMIT 50', [req.params.keyId]);
    res.json(rows);
});

app.post('/admin/save', requireAdmin, async (req, res) => {
    const b = req.body;
    const db = global.DB;
    
    db.admin.user = b.admin_user;
    if (b.admin_pass && b.admin_pass.trim() !== '') {
        db.admin.pass = utils.hashToken(b.admin_pass);
    }
    
    db.settings.theme = b.site_theme || 'newYear';
    db.settings.totalCopyCount = parseInt(b.total_copy) || db.settings.totalCopyCount;
    db.settings.workerUrl = b.worker_url;
    
    db.settings.yipay = { api_url: b.pay_api, pid: b.pay_pid, key: b.pay_key, notify_url: b.pay_notify, return_url: b.pay_return };
    db.settings.turnstile = { SITE_KEY: b.turn_site, SECRET_KEY: b.turn_secret, enabled: b.turn_enabled === '1' };
    db.settings.hcaptcha = { SITE_KEY: b.hcap_site, SECRET_KEY: b.hcap_secret, enabled: b.hcap_enabled === '1' };
    db.settings.geetest = { CAPTCHA_ID: b.gee_id, CAPTCHA_KEY: b.gee_key, enabled: b.gee_enabled === '1' };
    db.settings.linuxdo = { CLIENT_ID: b.linuxdo_id, CLIENT_SECRET: b.linuxdo_secret, REDIRECT_URI: b.linuxdo_uri, enabled: b.linuxdo_enabled === '1' };
    db.settings.email = {
        host: b.mail_host,
        port: b.mail_port,
        secure: b.mail_secure === '1',
        user: b.mail_user,
        pass: b.mail_pass
    };

    db.siteConfig = {
        title: b.cfg_title,
        keywords: b.cfg_keywords,
        description: b.cfg_description,
        bg_desktop: b.cfg_bg_desktop,
        bg_mobile: b.cfg_bg_mobile,
        notice_banner: b.cfg_notice_banner,
        notice_popup: b.cfg_notice_popup,
        notice_popup_mode: b.cfg_notice_popup_mode || 'once_per_day',
        notice_popup_minutes: parseInt(b.cfg_notice_popup_minutes) || 30,
        music_url: b.cfg_music,
        snow_enabled: b.cfg_snow === '1',
        custom_head: b.cfg_custom_head,
        custom_body: b.cfg_custom_body,
        custom_theme_css: b.cfg_custom_css,
        disclaimer_public: b.cfg_disclaimer_public || '公益声明：本站为非营利性平台，仅供临时下载使用，严禁倒卖商用！',
        disclaimer_title: b.cfg_disclaimer_title || '严禁在手机【设置/iCloud】中登录！',
        disclaimer_warning: b.cfg_disclaimer_warning || '⚠️ 仅限 App Store 使用！',
        disclaimer_detail: b.cfg_disclaimer_detail || '擅自在设置登录可能导致手机被锁死无法退出。由此产生的一切后果，本站概不负责！',
        sponsor_enabled: b.cfg_sponsor_enabled === '1',
        google_ads_html: b.cfg_google_ads,
        ads_medianet_html: b.cfg_ads_medianet,
        ads_adsterra_html: b.cfg_ads_adsterra,
        ads_aads_html: b.cfg_ads_aads,
        ads_popads_html: b.cfg_ads_popads,
        ads_custom_html: b.cfg_ads_custom
    };

    const fixUsers = [].concat(b.fixed_user || []);
    const fixPasss = [].concat(b.fixed_pass || []);
    const fixRemarks = [].concat(b.fixed_remark || []);
    const fixRegions = [].concat(b.fixed_region || []);
    const fixStatus = [].concat(b.fixed_status || []);

    db.fixedAccounts = [];
    fixUsers.forEach((u, i) => {
        if (u && u.trim() !== '') {
            db.fixedAccounts.push({
                username: u, password: fixPasss[i], remark: fixRemarks[i], region: fixRegions[i], status: fixStatus[i] == '1'
            });
        }
    });

    const srcNames = [].concat(b.src_name || []);
    const srcUrls = [].concat(b.src_url || []);
    const srcCounts = [].concat(b.src_count || []);

    db.sources = [];
    srcNames.forEach((name, i) => {
        if (name && srcUrls[i]) {
            db.sources.push({ source: name, url: srcUrls[i], fetchCount: parseInt(srcCounts[i]) || 1 });
        }
    });

    await database.saveDB();
    console.log('⚙️ 后台配置已保存 (含装修数据)，正在后台重新抓取...');
    sync.fetchAllAccounts().catch(e => console.error('后台抓取失败:', e));
    
    const currentTab = b.current_tab || 'dashboard';
    res.redirect('/admin/dashboard?tab=' + currentTab + '&saved=1');
});

// ==========================================
// 2. 前端 API 接口
// ==========================================

app.get('/api/share/data', async (req, res) => {
    if (sync.cachedData.accounts.length === 0) {
        await sync.fetchAllAccounts();
    }
    res.json({
        code: 200,
        msg: 'success',
        server_time: Date.now(),
        data_time: sync.cachedData.lastUpdated,
        count: sync.cachedData.accounts.length,
        copy_count: global.DB.settings.totalCopyCount,
        data: sync.cachedData.accounts
    });
});

app.post('/api/report/copy', async (req, res) => {
    global.DB.settings.totalCopyCount++;
    database.saveDB().catch(e => console.error('报告复制失败:', e));
    res.json({ success: true, count: global.DB.settings.totalCopyCount });
});

app.post('/api/verify-vip', async (req, res) => {
    const { key } = req.body;
    if (!key) return res.json({ success: false, msg: '请输入卡密' });
    
    try {
        const hashedKey = utils.hashToken(key);
        const [rows] = await database.pool.query('SELECT * FROM vip_keys WHERE encrypted_code = ?', [hashedKey]);
        
        if (rows.length === 0) return res.json({ success: false, msg: '无效的卡密' });
        const vip = rows[0];
        
        if (vip.is_banned) return res.json({ success: false, msg: '此卡密已被封禁' });
        
        let valid = false;
        if (vip.type === 'time') {
            if (new Date(vip.expire_at) > new Date()) valid = true;
            else return res.json({ success: false, msg: '卡密已过期' });
        } else {
            if (vip.current_usage < vip.val_limit) valid = true;
            else return res.json({ success: false, msg: '卡密次数已耗尽' });
        }

        if (valid) {
            await database.pool.query('INSERT INTO vip_logs (key_id, ip_address, action) VALUES (?, ?, ?)', [vip.id, req.ip, 'verify_success']);
            if (vip.type === 'count') {
                await database.pool.query('UPDATE vip_keys SET current_usage = current_usage + 1 WHERE id = ?', [vip.id]);
            }
            return res.json({ success: true, token: 'VIP_ACCESS_' + Date.now(), msg: '验证成功！' });
        }
    } catch (e) {
        console.error(e);
        res.json({ success: false, msg: '验证服务异常' });
    }
});

app.post('/api/pay', async (req, res) => {
    try {
        const conf = global.DB.settings.yipay;
        const order_id = new Date().getTime() + '' + Math.floor(Math.random() * 1000);
        let money = parseFloat(req.body.money);
        if (isNaN(money) || money < 0.02) money = 0.02;
        money = money.toFixed(2);
        
        const params = {
            pid: conf.pid, 
            type: req.body.type || 'alipay', 
            out_trade_no: order_id, 
            notify_url: conf.notify_url, 
            return_url: `${conf.return_url}${conf.return_url.includes('?') ? '&' : '?'}payment_success=true`, 
            name: '网站打赏', 
            money: money
        };
        
        params.sign = utils.generateSign(params, conf.key);
        const query = new URLSearchParams(params).toString();
        
        res.json({ code: 1, url: `${conf.api_url}/submit.php?${query}`, order_id: order_id });
    } catch (e) { 
        res.json({ code: 0, msg: '创建订单失败' }); 
    }
});

app.get('/api/notify', (req, res) => {
    const params = req.query;
    if (!params || !params.sign) return res.send('fail');
    const verifyParams = { ...params };
    delete verifyParams.sign;
    delete verifyParams.sign_type;
    if (utils.generateSign(verifyParams, global.DB.settings.yipay.key) === params.sign) {
        if (params.trade_status === 'TRADE_SUCCESS') { 
            console.log(`[支付成功] 订单: ${params.out_trade_no} | 金额: ${params.money}`); 
        }
        res.send('success');
    } else { res.send('fail'); }
});

app.post('/api/verify-human', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.json({ success: false });
    try {
        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: global.DB.settings.turnstile.SECRET_KEY, response: token }) });
        const data = await result.json();
        res.json({ success: data.success });
    } catch (e) { res.json({ success: false }); }
});

app.post('/api/verify-hcaptcha', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.json({ success: false });
    try {
        const result = await fetch('https://api.hcaptcha.com/siteverify', { method: 'POST', body: new URLSearchParams({ secret: global.DB.settings.hcaptcha.SECRET_KEY, response: token }) });
        const data = await result.json();
        res.json({ success: data.success });
    } catch (e) { res.json({ success: false }); }
});

app.post('/api/verify-geetest', async (req, res) => {
    const { lot_number, captcha_output, pass_token, gen_time } = req.body;
    if (!lot_number) return res.json({ success: false });
    try {
        const conf = global.DB.settings.geetest;
        const signToken = crypto.createHmac('sha256', conf.CAPTCHA_KEY).update(lot_number, 'utf8').digest('hex');
        const formData = new URLSearchParams({ lot_number, captcha_output, pass_token, gen_time, sign_token: signToken });
        const result = await fetch(`http://gcaptcha4.geetest.com/validate?captcha_id=${conf.CAPTCHA_ID}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData });
        const data = await result.json();
        res.json({ success: data.result === 'success', msg: data.reason });
    } catch (e) { res.json({ success: false }); }
});

// ==========================================
// Linux.do OAuth2 登录逻辑
// ==========================================

app.get('/api/auth/linuxdo', (req, res) => {
    const conf = global.DB.settings.linuxdo;
    if (!conf || !conf.enabled) return res.redirect('/?error=linuxdo_disabled');
    
    const clientId = conf.CLIENT_ID;
    const redirectUri = encodeURIComponent(conf.REDIRECT_URI);
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;
    
    const authUrl = `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&scope=user`;
    res.redirect(authUrl);
});

app.get('/api/auth/linuxdo/callback', async (req, res) => {
    const { code, state } = req.query;
    const conf = global.DB.settings.linuxdo;
    
    if (!code || state !== req.session.oauthState) {
        return res.send('<script>window.location.href = "/?auth_error=state_mismatch";</script>');
    }
    
    try {
        // 1. 换取 Access Token (使用官方 TOKEN_URL)
        const tokenRes = await fetch('https://connect.linux.do/oauth2/token', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                client_id: conf.CLIENT_ID,
                client_secret: conf.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: conf.REDIRECT_URI
            })
        });
        const tokenData = await tokenRes.json();
        
        if (!tokenData.access_token) {
            console.error('Token Error:', tokenData);
            throw new Error('Token 获取失败');
        }
        
        // 2. 获取用户信息确认身份 (使用官方 USER_INFO_URL)
        const userRes = await fetch('https://connect.linux.do/api/user', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();
        
        // 官方接口返回的用户信息中通常包含 id 或 username
        if (userData && (userData.id || userData.username || userData.name)) {
            const linuxdoId = String(userData.id);
            const linuxdoName = userData.username || userData.name || linuxdoId;

            // 情况 0: 用户快捷注册/登录
            if (!req.session.isBindingAdmin && !req.session.isAdminLogin) {
                const lIdHash = utils.hashToken(linuxdoId);
                const [users] = await database.getPool().query('SELECT * FROM users WHERE linuxdo_id_hash = ?', [lIdHash]);
                
                if (users.length > 0) {
                    // 已注册，执行登录
                    req.session.userId = users[0].id;
                    req.session.userDisplay = users[0].username_display;
                    return res.send('<script>window.location.href = "/?auth_success=linuxdo_login";</script>');
                } else {
                    // 未注册，自动创建账户 (用户名使用 linuxdoName)
                    try {
                        const uHash = utils.hashToken(linuxdoName + '_' + linuxdoId); // 避免重复
                        const eHash = utils.hashToken('linuxdo_' + linuxdoId + '@linux.do');
                        const pHash = utils.hashToken('linuxdo_auth_no_pwd'); 
                        
                        const [result] = await database.getPool().query(
                            'INSERT INTO users (username_hash, email_hash, password_hash, username_display, email_display, linuxdo_id_hash, linuxdo_username) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [uHash, eHash, pHash, linuxdoName, '快捷注册用户', lIdHash, linuxdoName]
                        );
                        req.session.userId = result.insertId;
                        req.session.userDisplay = linuxdoName;
                        return res.send('<script>window.location.href = "/?auth_success=linuxdo_reg";</script>');
                    } catch (e) {
                        console.error('Linux.do auto reg error:', e);
                        return res.send('<script>window.location.href = "/?auth_error=linuxdo_reg_fail";</script>');
                    }
                }
            }

            // 情况 1: 管理员绑定
            if (req.session.isBindingAdmin) {
                delete req.session.isBindingAdmin;
                global.DB.admin.linuxdo_id = utils.hashToken(linuxdoId); // 使用哈希值存储
                global.DB.admin.linuxdo_username = linuxdoName;
                await database.saveDB();
                return res.send(`
                    <script>
                        window.onload = function() {
                            if (typeof showGlobalToast === 'function') {
                                showGlobalToast("✅ 成功绑定 Linux.do 账号: ${linuxdoName}");
                                setTimeout(function() {
                                    window.location.href = '/admin/dashboard?tab=admin';
                                }, 1500);
                            } else {
                                alert("✅ 成功绑定 Linux.do 账号: ${linuxdoName}");
                                window.location.href = '/admin/dashboard?tab=admin';
                            }
                        };
                    </script>
                `);
            }

            // 情况 2: 管理员登录
            if (req.session.isAdminLogin) {
                delete req.session.isAdminLogin;
                const hashedIncomingId = utils.hashToken(linuxdoId);
                if (global.DB.admin.linuxdo_id && global.DB.admin.linuxdo_id === hashedIncomingId) {
                    req.session.isAdmin = true;
                    return res.send(`
                        <script>
                            window.onload = function() {
                                if (typeof showGlobalToast === 'function') {
                                    showGlobalToast("🚀 登录成功，欢迎回来！");
                                    setTimeout(function() {
                                        window.location.href = '/admin/dashboard';
                                    }, 1000);
                                } else {
                                    window.location.href = '/admin/dashboard';
                                }
                            };
                        </script>
                    `);
                } else {
                    return res.send(`
                        <script>
                            window.onload = function() {
                                if (typeof showGlobalToast === 'function') {
                                    showGlobalToast("❌ 登录失败：该 Linux.do 账号未绑定管理员权限！", true);
                                    setTimeout(function() {
                                        window.location.href = '/admin/login';
                                    }, 2000);
                                } else {
                                    alert("❌ 登录失败：该 Linux.do 账号未绑定管理员权限！");
                                    window.location.href = '/admin/login';
                                }
                            };
                        </script>
                    `);
                }
            }

            // 情况 3: 普通用户人机验证 (保持原逻辑)
            const twoMinutes = 2 * 60 * 1000;
            res.send(`
                <script>
                    localStorage.setItem('verify_timestamp', Date.now().toString());
                    localStorage.setItem('verify_duration', '${twoMinutes}');
                    // 立即跳转，不弹 alert
                    window.location.href = '/?auth_success=1';
                </script>
            `);
        } else {
            console.error('User Info Error:', userData);
            res.send('<script>window.location.href = "/?auth_error=no_user";</script>');
        }
    } catch (e) {
        console.error('Linux.do Auth Error:', e);
        res.send('<script>window.location.href = "/?auth_error=server_error";</script>');
    }
});

// ==========================================
// 3. 首页渲染与启动
// ==========================================

app.get('/', (req, res) => {
    const keys = {
        theme: (global.DB.settings && global.DB.settings.theme) || 'newYear',
        turnstile: { 
            key: global.DB.settings?.turnstile?.SITE_KEY || '', 
            enabled: !!global.DB.settings?.turnstile?.enabled 
        },
        hcaptcha: { 
            key: global.DB.settings?.hcaptcha?.SITE_KEY || '', 
            enabled: !!global.DB.settings?.hcaptcha?.enabled 
        },
        geetest: { 
            id: global.DB.settings?.geetest?.CAPTCHA_ID || '', 
            enabled: !!global.DB.settings?.geetest?.enabled 
        },
        linuxdo: { 
            enabled: !!global.DB.settings?.linuxdo?.enabled 
        },
        workerUrl: global.DB.settings?.workerUrl || '',
        siteConfig: global.DB.siteConfig || config.DEFAULT_DB.siteConfig,
        user: {
            userId: req.session.userId || null,
            userDisplay: req.session.userDisplay || null
        }
    };
    res.send(frontendViews.getHtmlContent(keys));
});

app.get('/health', (req, res) => res.send('ok'));

database.initDB().then(() => {
    app.listen(port, async () => {
        console.log(`=================================================`);
        console.log(`🚀 服务已启动: http://localhost:${port}`);
        console.log(`🔐 管理后台:   http://localhost:${port}/admin`);
        console.log(`=================================================`);
        await sync.fetchAllAccounts();
    });
});
