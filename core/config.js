const crypto = require('crypto');

module.exports = {
    dbConfig: {
        host: 'localhost',
        user: '替换为你的数据库用户名',          
        password: '替换为你的数据库密码', 
        database: '替换为你的数据库名',      
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    // 建议在环境变量中设置这些密钥
    ENCRYPTION_KEY: crypto.scryptSync(process.env.ENCRYPTION_SECRET || 'default-secret-key-change-me', 'salt', 32),
    IV_LENGTH: 16,
    LINUXDO: {
        CLIENT_ID: '',
        CLIENT_SECRET: '',
        REDIRECT_URI: ''
    },
    DEFAULT_DB: {
        admin: { 
            user: 'admin', 
            pass: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', // 默认密码 123456
            linuxdo_id: null,
            linuxdo_username: null
        },
        settings: {
            theme: 'newYear',
            totalCopyCount: 0,
            workerUrl: '', 
            yipay: {
                api_url: '',
                pid: '',
                key: '',
                notify_url: '',
                return_url: ''
            },
            turnstile: { SITE_KEY: '', SECRET_KEY: '', enabled: false },
            hcaptcha: { SITE_KEY: '', SECRET_KEY: '', enabled: false },
            geetest: { CAPTCHA_ID: '', CAPTCHA_KEY: '', enabled: false },
            linuxdo: { CLIENT_ID: '', CLIENT_SECRET: '', REDIRECT_URI: '', enabled: false },
            email: {
                host: '',
                port: 465,
                secure: true,
                user: '',
                pass: ''
            }
        },
        siteConfig: {
            title: "Apple 账号共享系统",
            keywords: "AppleID,共享",
            description: "免费提供 Apple ID 账号共享服务",
            bg_desktop: "",
            bg_mobile: "",
            notice_banner: "欢迎使用 Apple 账号免费共享系统！",
            notice_popup: "",
            notice_popup_mode: "once_per_day",
            notice_popup_minutes: 30,
            music_url: "",
            snow_enabled: true,
            custom_head: "",
            custom_body: "",
            custom_theme_css: "",
            disclaimer_public: "公益声明：本站为非营利性平台，仅供临时使用，严禁倒卖商用！",
            disclaimer_title: "严禁在手机【设置/iCloud】中登录！",
            disclaimer_warning: "⚠️ 仅限 App Store 使用！",
            disclaimer_detail: "擅自在设置登录可能导致手机被锁死无法退出。由此产生的一切后果，本站概不负责！",
            sponsor_enabled: false,
            google_ads_html: "",
            ads_medianet_html: "",
            ads_adsterra_html: "",
            ads_aads_html: "",
            ads_popads_html: "",
            ads_custom_html: ""
        },
        sources: [],
        fixedAccounts: []
    }
};
