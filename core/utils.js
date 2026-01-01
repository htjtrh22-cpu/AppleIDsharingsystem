const crypto = require('crypto');
const config = require('./config');
const md5 = require('md5');

function encrypt(text) {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(config.IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', config.ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(String(text));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        console.error('Encryption error:', e);
        return text;
    }
}

function decrypt(text) {
    if (!text || !String(text).includes(':')) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', config.ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return text;
    }
}

function hashToken(text) {
    if (!text) return '';
    return crypto.createHash('sha256').update(String(text).trim()).digest('hex');
}

function parseTimestamp(t) {
    if (!t) return 0;
    if (typeof t === 'number') return t;
    return new Date(t).getTime() || 0;
}

// 处理数据的加密/解密遍历
function processData(data, action) {
    const d = JSON.parse(JSON.stringify(data)); // 深拷贝
    const func = action === 'encrypt' ? encrypt : decrypt;

    if (d.settings && d.settings.yipay && d.settings.yipay.key) d.settings.yipay.key = func(d.settings.yipay.key);
    if (d.settings && d.settings.turnstile) d.settings.turnstile.SECRET_KEY = func(d.settings.turnstile.SECRET_KEY);
    if (d.settings && d.settings.hcaptcha) d.settings.hcaptcha.SECRET_KEY = func(d.settings.hcaptcha.SECRET_KEY);
    if (d.settings && d.settings.geetest) d.settings.geetest.CAPTCHA_KEY = func(d.settings.geetest.CAPTCHA_KEY);
    if (d.settings && d.settings.linuxdo) d.settings.linuxdo.CLIENT_SECRET = func(d.settings.linuxdo.CLIENT_SECRET);

    if (d.fixedAccounts && Array.isArray(d.fixedAccounts)) {
        d.fixedAccounts.forEach(acc => {
            if (acc.password) acc.password = func(acc.password);
        });
    }

    return d;
}

function generateSign(params, key) {
    const sortedKeys = Object.keys(params).sort();
    let str = '';
    for (const k of sortedKeys) { 
        if (params[k] !== '' && params[k] !== undefined && params[k] !== null) { 
            str += `${k}=${params[k]}&`; 
        } 
    }
    return md5(str.substring(0, str.length - 1) + key);
}

module.exports = {
    encrypt,
    decrypt,
    hashToken,
    parseTimestamp,
    processData,
    generateSign
};

