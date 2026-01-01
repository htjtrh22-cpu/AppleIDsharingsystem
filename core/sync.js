const config = require('./config');
const utils = require('./utils');
const database = require('./database');

// 兼容 node-fetch v2 和 v3 的动态导入写法
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 全局缓存数据
const cachedData = {
    accounts: [],
    lastUpdated: 0
};

// 抓取状态标识，防止重复触发
let isFetching = false;

async function fetchAllAccounts() {
    if (isFetching) {
        console.log('⏳ 已有抓取任务在运行中，跳过本次请求');
        return;
    }
    isFetching = true;

    if (!global.DB.sources || global.DB.sources.length === 0) {
         global.DB.sources = config.DEFAULT_DB.sources;
         database.saveDB().catch(e => {});
    }

    const accountMap = new Map();
    const sources = global.DB.sources;
    
    console.log(`🚀 开始从 ${sources.length} 个源同步数据...`);

    // 分批抓取，避免瞬间并发过高导致阻塞
    const BATCH_SIZE = 5; 
    const allSourcesExtended = [];
    sources.forEach(src => {
        const count = src.fetchCount || 1;
        for (let i = 0; i < count; i++) {
            allSourcesExtended.push(src);
        }
    });

    try {
        for (let i = 0; i < allSourcesExtended.length; i += BATCH_SIZE) {
            const batch = allSourcesExtended.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(batch.map(src => 
                fetch(src.url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    timeout: 8000 
                }).then(res => res.ok ? res.json() : null).catch(err => null)
            ));

            results.forEach(data => {
                if (data && Array.isArray(data.accounts)) {
                    data.accounts.forEach(acc => {
                        if (acc.username && acc.password) {
                            const key = String(acc.username).trim();
                            const existing = accountMap.get(key);
                            if (!existing) {
                                accountMap.set(key, acc);
                            } else {
                                const timeA = utils.parseTimestamp(existing.last_check || existing.check_time);
                                const timeB = utils.parseTimestamp(acc.last_check || acc.check_time);
                                if ((!!acc.status && !existing.status) || (!!acc.status === !!existing.status && timeB > timeA)) {
                                    accountMap.set(key, acc);
                                }
                            }
                        }
                    });
                }
            });
        }

        if (global.DB.fixedAccounts && Array.isArray(global.DB.fixedAccounts)) {
            global.DB.fixedAccounts.forEach(fixed => {
                if (fixed.username && fixed.password) {
                    accountMap.set(fixed.username.trim(), {
                        username: fixed.username,
                        password: fixed.password,
                        status: fixed.status ? 1 : 0,
                        frontend_remark: fixed.remark || '站长推荐',
                        region_display: fixed.region || '固定/SVIP', 
                        last_check: Date.now()
                    });
                }
            });
        }

        const sortedAccounts = Array.from(accountMap.values()).sort((a, b) => {
            const statusA = !!a.status;
            const statusB = !!b.status;
            if (statusA !== statusB) return statusA ? -1 : 1;
            return utils.parseTimestamp(b.last_check || b.check_time) - utils.parseTimestamp(a.last_check || a.check_time);
        });

        if (sortedAccounts.length > 0) {
            cachedData.accounts = sortedAccounts;
            cachedData.lastUpdated = Date.now();
        }
        return sortedAccounts;
    } catch (e) {
        console.error('❌ 更新过程发生致命错误:', e);
        return [];
    } finally {
        isFetching = false;
    }
}

// 自动同步
setInterval(fetchAllAccounts, 10 * 60 * 1000);

module.exports = {
    cachedData,
    fetchAllAccounts
};

