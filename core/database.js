const mysql = require('mysql2/promise');
const config = require('./config');
const utils = require('./utils');

const pool = mysql.createPool(config.dbConfig);

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app_config (
                id INT PRIMARY KEY DEFAULT 1,
                config_json LONGTEXT NOT NULL
            )
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vip_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(255) NULL,
                encrypted_code VARCHAR(255) NOT NULL UNIQUE, 
                type ENUM('count', 'time') NOT NULL DEFAULT 'count',
                val_limit INT NOT NULL DEFAULT 1,
                current_usage INT DEFAULT 0,
                expire_at DATETIME NULL,
                is_banned TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        try {
            await pool.query('ALTER TABLE vip_keys ADD COLUMN code VARCHAR(255) NULL AFTER id');
        } catch (e) {
            if (e.errno !== 1060) console.log('⚠️ 数据库迁移提示:', e.message);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS vip_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                key_id INT NOT NULL,
                ip_address VARCHAR(45),
                action VARCHAR(50),
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (key_id)
            )
        `);

        // 新增用户表
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username_hash VARCHAR(64) NOT NULL UNIQUE,
                email_hash VARCHAR(64) NOT NULL UNIQUE,
                password_hash VARCHAR(64) NOT NULL,
                username_display VARCHAR(255) NOT NULL,
                email_display VARCHAR(255) NOT NULL,
                linuxdo_id_hash VARCHAR(64) NULL UNIQUE,
                linuxdo_username VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 新增用户复制记录表
        await pool.query(`
            CREATE TABLE IF NOT EXISTS copy_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                account_username VARCHAR(255) NOT NULL,
                copied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (user_id)
            )
        `);
        
        const [rows] = await pool.query('SELECT config_json FROM app_config WHERE id = 1');

        if (rows.length > 0) {
            console.log('✅ 从 MySQL 数据库加载配置成功');
            try {
                const rawData = JSON.parse(rows[0].config_json);
                global.DB = utils.processData(rawData, 'decrypt');
                
                // 确保新版本的配置项存在
                if (!global.DB.settings) global.DB.settings = JSON.parse(JSON.stringify(config.DEFAULT_DB.settings));
                if (!global.DB.settings.linuxdo) global.DB.settings.linuxdo = JSON.parse(JSON.stringify(config.DEFAULT_DB.settings.linuxdo));
                if (!global.DB.settings.geetest) global.DB.settings.geetest = JSON.parse(JSON.stringify(config.DEFAULT_DB.settings.geetest));
                if (!global.DB.settings.turnstile) global.DB.settings.turnstile = JSON.parse(JSON.stringify(config.DEFAULT_DB.settings.turnstile));
                if (!global.DB.settings.hcaptcha) global.DB.settings.hcaptcha = JSON.parse(JSON.stringify(config.DEFAULT_DB.settings.hcaptcha));
                
                if (global.DB.admin.pass && global.DB.admin.pass.length !== 64) {
                    console.log('⚠️ 检测到旧版管理员密码，已自动重置为默认: 123456');
                    global.DB.admin.pass = config.DEFAULT_DB.admin.pass;
                    await saveDB();
                }

                if (!global.DB.siteConfig) {
                    global.DB.siteConfig = config.DEFAULT_DB.siteConfig;
                }
                
            } catch (parseErr) {
                console.error('❌ 配置文件解析失败，将使用默认配置:', parseErr);
                global.DB = JSON.parse(JSON.stringify(config.DEFAULT_DB));
            }
        } else {
            console.log('⚠️ 数据库为空，正在初始化默认配置...');
            const encryptedDB = utils.processData(config.DEFAULT_DB, 'encrypt');
            await pool.query('INSERT INTO app_config (id, config_json) VALUES (1, ?)', [JSON.stringify(encryptedDB)]);
            global.DB = JSON.parse(JSON.stringify(config.DEFAULT_DB));
        }
    } catch (e) {
        console.error('❌ 数据库连接或初始化失败:', e);
        process.exit(1);
    }
}

async function saveDB() {
    try {
        const encryptedDB = utils.processData(global.DB, 'encrypt');
        const jsonStr = JSON.stringify(encryptedDB);
        await pool.query('UPDATE app_config SET config_json = ? WHERE id = 1', [jsonStr]);
    } catch (e) {
        console.error('❌ 保存数据库失败:', e);
    }
}

function getPool() {
    return pool;
}

module.exports = {
    pool,
    initDB,
    saveDB,
    getPool
};

