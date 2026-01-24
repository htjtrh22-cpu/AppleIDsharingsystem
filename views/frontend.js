function getHtmlContent(keys) {
    const theme = keys.theme || 'newYear';
    const cfg = keys.siteConfig;
    const user = keys.user || {};
    const bgDesktop = cfg.bg_desktop || "https://img.api.aa1.cn/2025/01/01/5e73e2187652c.jpg";
    const bgMobile = cfg.bg_mobile || bgDesktop;
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="referrer" content="no-referrer">
  <title>${cfg.title || 'Apple 账号共享'}</title>
  <meta name="keywords" content="${cfg.keywords || ''}">
  <meta name="description" content="${cfg.description || ''}">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Ccircle cx='128' cy='128' r='120' fill='%23b91c1c'/%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='140' fill='%23fcd34d'%3E福%3C/text%3E%3C/svg%3E">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
  
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
  <script src="https://static.geetest.com/v4/gt4.js"></script>

  ${cfg.custom_head || ''}
  ${cfg.google_ads_html || ''}
  ${theme === 'custom' && cfg.custom_theme_css ? `<style>${cfg.custom_theme_css}</style>` : ''}

  <style>
    :root {
      --bg-start: #ef4444; --bg-mid: #b45309; --bg-end: #991b1b;
      --glass-bg: rgba(255, 255, 255, 0.92);
      --text-primary: #450a0a; --text-secondary: #7f1d1d;
      --accent-color: #ef4444;
    }
    [data-theme="ocean"] { --bg-start: #0ea5e9; --bg-mid: #0369a1; --bg-end: #0c4a6e; --text-primary: #082f49; --text-secondary: #0369a1; --accent-color: #0ea5e9; }
    [data-theme="forest"] { --bg-start: #10b981; --bg-mid: #059669; --bg-end: #064e3b; --text-primary: #064e3b; --text-secondary: #065f46; --accent-color: #10b981; }
    [data-theme="cyber"] { --bg-start: #8b5cf6; --bg-mid: #6d28d9; --bg-end: #111827; --text-primary: #f3f4f6; --text-secondary: #e5e7eb; --glass-bg: rgba(17, 24, 39, 0.85); --accent-color: #a855f7; }

    body.dark-mode {
      --bg-start: #450a0a; --bg-mid: #2a0505; --bg-end: #000000;
      --glass-bg: rgba(20, 20, 20, 0.85);
      --text-primary: #f3f4f6; --text-secondary: #d1d5db;
      --accent-color: #fbbf24;
    }
    body.dark-mode[data-theme="ocean"] { --bg-start: #0c4a6e; --bg-mid: #082f49; --bg-end: #0f172a; --text-primary: #e0f2fe; --accent-color: #38bdf8; }
    body.dark-mode[data-theme="forest"] { --bg-start: #064e3b; --bg-mid: #022c22; --bg-end: #000000; --text-primary: #ecfdf5; --accent-color: #34d399; }
    body.dark-mode[data-theme="cyber"] { --bg-start: #4c1d95; --bg-mid: #2e1065; --bg-end: #000000; --text-primary: #f3e8ff; --accent-color: #c084fc; }

    body {
      font-family: 'Noto Sans SC', system-ui, sans-serif;
      background-color: var(--bg-end);
      background-image: url('${bgDesktop}');
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      color: var(--text-primary);
      min-height: 100vh;
      padding-top: 60px;
      overflow-x: hidden;
      transition: all 0.5s ease;
    }
    @media (max-width: 768px) {
        body { background-image: url('${bgMobile}'); background-attachment: scroll; }
    }
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
    }

    /* === 滚动公告 === */
    .festive-banner { 
        position: fixed; top: 0; left: 0; width: 100%; height: 44px; 
        background: linear-gradient(90deg, var(--bg-end), var(--bg-mid), var(--bg-start), var(--bg-end)); 
        background-size: 200% 100%; 
        animation: flowGold 8s linear infinite; 
        color: #fef3c7; 
        display: flex; align-items: center; 
        z-index: 40; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.2); 
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
    }
    .marquee-content {
        display: inline-block;
        white-space: nowrap;
        padding-left: 100%; 
        animation: marquee 20s linear infinite; 
        font-weight: 700;
        font-size: 15px;
    }
    @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
    @keyframes flowGold { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }

    /* === 顶部用户区域 (移动到内容区) === */
    .content-user-area {
        position: absolute; top: 20px; right: 20px; z-index: 30;
        display: flex; align-items: center; gap: 10px;
    }
    @media (max-width: 768px) {
        .content-user-area { position: static; justify-content: center; margin-bottom: 20px; width: 100%; }
    }
    .user-avatar {
        width: 36px; height: 36px; border-radius: 50%; background: var(--accent-color);
        color: white; display: flex; align-items: center; justify-content: center;
        font-weight: bold; cursor: pointer; border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s;
    }
    .user-avatar:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
    
    .auth-btn-group { display: flex; gap: 8px; }
    .auth-btn {
        font-size: 13px; font-weight: bold; color: var(--text-primary); cursor: pointer;
        padding: 6px 16px; border-radius: 12px; background: rgba(0,0,0,0.05);
        transition: all 0.2s; border: 1px solid rgba(0,0,0,0.05);
    }
    .auth-btn:hover { background: var(--accent-color); color: white; border-color: transparent; }

    /* === 子比主题风格登录框 === */
    .zib-auth-modal { font-family: 'Noto Sans SC', sans-serif; width: 95% !important; max-width: 400px !important; }
    .zib-auth-header { display: flex; justify-content: center; gap: 30px; margin-bottom: 25px; border-bottom: 2px solid #f3f4f6; position: relative; }
    @media (max-width: 480px) {
        .zib-auth-header { gap: 20px; margin-bottom: 20px; }
        .zib-auth-tab { font-size: 16px !important; }
        .zib-auth-input-group { margin-bottom: 15px !important; }
        .zib-auth-input { padding: 10px !important; font-size: 13px !important; }
        .zib-auth-submit { padding: 12px !important; font-size: 15px !important; }
        .swal2-html-container { padding: 0 5px !important; }
    }
    .zib-auth-tab { font-size: 18px; font-weight: 700; color: #9ca3af; cursor: pointer; padding-bottom: 12px; transition: all 0.3s; border-bottom: 3px solid transparent; margin-bottom: -2px; }
    .zib-auth-tab.active { color: var(--accent-color); border-bottom-color: var(--accent-color); }
    
    .zib-auth-input-group { margin-bottom: 20px; text-align: left; }
    .zib-auth-input-group label { display: block; font-size: 13px; font-weight: 700; color: #4b5563; margin-bottom: 8px; margin-left: 4px; }
    .zib-auth-input-wrapper { position: relative; }
    .zib-auth-input-wrapper i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 16px; }
    .zib-auth-input { width: 100%; background: #f9fafb; border: 2px solid #f3f4f6; border-radius: 14px; padding: 12px 15px; font-size: 14px; transition: all 0.3s; outline: none; }
    .zib-auth-input:focus { border-color: var(--accent-color); background: white; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
    
    .zib-auth-submit { width: 100%; background: var(--accent-color); color: white; border: none; border-radius: 14px; padding: 14px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-top: 10px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
    .zib-auth-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3); opacity: 0.9; }
    .zib-auth-submit:disabled { background: #d1d5db; cursor: not-allowed; box-shadow: none; }

    .zib-auth-social { margin-top: 30px; pt-30px; border-top: 1px solid #f3f4f6; text-align: center; }
    .zib-auth-social-title { font-size: 12px; color: #9ca3af; margin-top: -10px; background: white; display: inline-block; padding: 0 15px; margin-bottom: 20px; font-weight: 600; }
    .zib-auth-social-btns { display: flex; justify-content: center; gap: 15px; }
    .zib-auth-social-btn { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f3f4f6; transition: all 0.3s; cursor: pointer; text-decoration: none; }
    .zib-auth-social-btn:hover { background: #e5e7eb; transform: scale(1.1); }
    
    .zib-verify-group { display: flex; gap: 10px; }
    .zib-verify-btn { background: #f3f4f6; border: none; border-radius: 12px; padding: 0 15px; font-size: 12px; font-weight: 700; color: #4b5563; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .zib-verify-btn:hover { background: #e5e7eb; }

    .glass-panel { background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 14px 50px -20px rgba(15, 23, 42, 0.45); border-radius: 24px; position: relative; z-index: 10; padding: 2rem; width: 100%; max-width: 1200px; margin-top: 1rem; transition: background 0.5s ease, transform 0.3s ease; opacity: 1 !important; }
    .glass-table th { background: rgba(0,0,0,0.05); color: var(--text-primary); letter-spacing: 0.05em; }
    .glass-table td { color: var(--text-primary); border-bottom: 1px solid rgba(0,0,0,0.05); }
    .glass-table tr:hover td { background: rgba(0,0,0,0.02); }
    .glass-table tr:hover td { transform: translateZ(0); }

    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }
    .badge-green { background: rgba(16, 185, 129, 0.15); color: #065f46; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-red { background: rgba(239, 68, 68, 0.15); color: #991b1b; border: 1px solid rgba(239, 68, 68, 0.3); }

    .btn-primary { background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(249, 115, 22, 0.95)); color: #fff; border: 1px solid rgba(239, 68, 68, 0.4); box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(239, 68, 68, 0.35); }

    .welfare-badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 999px; font-weight: 600; background: rgba(255, 255, 255, 0.75); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12); color: var(--text-primary); }

    .account-grid { content-visibility: auto; contain-intrinsic-size: 1px 800px; }
    .account-card { position: relative; overflow: hidden; }
    .account-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0)); opacity: 0; transition: opacity 0.3s ease; }
    .account-card:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -24px rgba(15, 23, 42, 0.5); }
    .account-card:hover::before { opacity: 1; }

    .btn-vip { background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); color: #78350f; border: 1px solid #fef3c7; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4); transition: all 0.3s ease; font-weight: 700; border-radius: 99px; padding: 8px 20px; }
    .btn-vip:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(251, 191, 36, 0.6); }
    .btn-ghost { background: var(--glass-bg); border: 1px solid rgba(0,0,0,0.1); color: var(--text-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.2s; font-weight: 600; padding-top: 6px; }
    .btn-ghost:hover { background-color: rgba(255,255,255,0.8); color: var(--accent-color); transform: translateY(-1px); }

    .greetings-container { margin-top: 1rem; background: linear-gradient(90deg, var(--bg-end), var(--bg-mid), var(--bg-start), var(--bg-end)); background-size: 200% 100%; animation: flowGold 8s linear infinite; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 12px 20px; text-align: center; color: #fff; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; overflow: hidden; }

    .sensitive-data { filter: blur(4px); transition: filter 0.3s; cursor: pointer; }
    .sensitive-data:hover { filter: blur(3px); }
    .sensitive-data.revealed { filter: blur(0); cursor: text; }
    
    .zib-opt { border: 1px solid #e5e7eb; background: #f9fafb; border-radius: 8px; padding: 10px 0; font-size: 14px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; text-align: center; }
    .zib-opt.active { background: #fee2e2; border-color: #ef4444; color: #ef4444; }
    .zib-opt.active::after { content: '✔'; position: absolute; bottom: 0; right: 0; font-size: 10px; line-height: 1; padding: 2px 4px; background: #ef4444; color: #fff; border-radius: 4px 0 0 0; }
    .zib-method { border: 1px solid #e5e7eb; background: #fff; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; color: #374151; position: relative; }
    .zib-method.active { border-color: #ef4444; background: #fef2f2; color: #ef4444; }

    #musicControl { position: fixed; bottom: 20px; left: 20px; z-index: 100; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); padding: 10px; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.2); cursor: pointer; transition: all 0.3s; ${cfg.music_url ? '' : 'display:none;'} }
    #musicControl:hover { transform: scale(1.1) rotate(15deg); }
    .music-spin { animation: spin 4s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* [修改] 提示框 CSS 补全 */
    .my-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 12px 24px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-weight: 600; color: #333; opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 9999; border: 1px solid rgba(255,255,255,0.5); }
    .my-toast.active { transform: translateX(-50%) translateY(0); opacity: 1; }

    /* [修改] VIP 输入框移动端适配 */
    .vip-input-wrapper { 
        display: flex; 
        gap: 8px; 
        margin-top: 0; 
        width: 100%; 
        max-width: 320px; 
    }
    .vip-input-wrapper input { 
        flex: 1; 
        padding: 8px 12px; 
        border-radius: 8px; 
        border: 1px solid rgba(0,0,0,0.1); 
        background: rgba(255,255,255,0.6); 
        font-size: 14px; 
        min-width: 0; 
        transition: all 0.3s ease;
    }
    .vip-input-wrapper input:focus { 
        outline: none; 
        border-color: var(--accent-color); 
        background: rgba(255,255,255,0.8);
        box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb, 239, 68, 68), 0.1);
    }
    .vip-input-wrapper button { 
        padding: 8px 16px; 
        border-radius: 8px; 
        background: var(--accent-color); 
        color: #fff; 
        border: none; 
        font-size: 14px; 
        font-weight: bold; 
        cursor: pointer; 
        transition: all 0.2s ease; 
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .vip-input-wrapper button:hover { 
        opacity: 0.9; 
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .vip-input-wrapper button:active { 
        transform: translateY(0);
    }
    
    @media (max-width: 640px) {
        .vip-input-wrapper { 
            max-width: 100%; 
            margin-top: 0;
            gap: 8px;
            background: rgba(255,255,255,0.3);
            padding: 8px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        #statsContainer .mt-4 {
            margin-top: 16px;
            width: 100%;
        }
        .vip-input-wrapper input { 
            padding: 10px 14px; 
            font-size: 15px;
            border-radius: 10px;
            background: rgba(255,255,255,0.85);
            border: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .vip-input-wrapper input:focus { 
            background: rgba(255,255,255,0.95);
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb, 239, 68, 68), 0.15);
        }
        .vip-input-wrapper button { 
            padding: 10px 20px; 
            font-size: 15px;
            border-radius: 10px;
            min-width: 75px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        }
        .festive-banner { font-size: 13px; }
        
        /* 移动端优化：让输入框更融入卡片，减少突兀感 */
        #statsContainer {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
        }
        #statsContainer .flex.items-center.gap-4 {
            width: 100%;
            justify-content: space-between;
        }
        #statsContainer .flex.items-center.gap-3 {
            flex-wrap: wrap;
            gap: 8px;
        }
        #statsContainer .vip-input-wrapper {
            margin-top: 0;
            width: 100%;
        }
    }
    
    #vipStatus { display: none; margin-top: 6px; font-size: 12px; font-weight: bold; color: #16a34a; }
    
    /* 左右灯笼装饰 */
    .lantern-left, .lantern-right {
        position: fixed;
        top: 0;
        z-index: 50;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        pointer-events: none;
    }
    .lantern-left {
        left: 20px;
        animation: lanternSway 3s ease-in-out infinite;
        animation-delay: 0s;
    }
    .lantern-right {
        right: 20px;
        animation: lanternSway 3s ease-in-out infinite;
        animation-delay: 1.5s;
    }
    .lantern-rope {
        position: relative;
        width: 4px;
        height: 60px;
        margin-bottom: 0;
        background: linear-gradient(to bottom, 
            #d4a574 0%,
            #b8864a 20%,
            #8b6f47 40%,
            #6b5237 60%,
            #8b6f47 80%,
            #b8864a 100%
        );
        border-radius: 2px;
        box-shadow: 
            inset 0 0 2px rgba(0,0,0,0.3),
            0 1px 3px rgba(0,0,0,0.4),
            0 0 1px rgba(255,255,255,0.2);
        overflow: hidden;
    }
    .lantern-rope::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(139, 111, 71, 0.4) 1px,
            rgba(139, 111, 71, 0.4) 2px
        );
        animation: ropeTexture 0.5s linear infinite;
    }
    .lantern-rope::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom,
            rgba(255,255,255,0.3) 0%,
            transparent 50%,
            rgba(0,0,0,0.2) 100%
        );
    }
    @keyframes ropeTexture {
        0% { transform: translateY(0); }
        100% { transform: translateY(4px); }
    }
    .lantern-body {
        font-size: 48px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        line-height: 1;
    }
    .lantern-text {
        font-size: 18px;
        font-weight: bold;
        color: #fef3c7;
        text-shadow: 
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 2px 4px rgba(0,0,0,0.5);
        white-space: nowrap;
        letter-spacing: 2px;
        background: linear-gradient(135deg, #ff6b6b, #feca57, #ff6b6b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 200% 100%;
        animation: textGlow 2s ease-in-out infinite;
    }
    @keyframes lanternSway {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
    }
    @keyframes textGlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    @media (max-width: 768px) {
        .lantern-left, .lantern-right {
            top: 0;
        }
        .lantern-left { left: 10px; }
        .lantern-right { right: 10px; }
        .lantern-rope {
            height: 55px;
            width: 5px;
        }
        .lantern-body {
            font-size: 56px;
        }
        .lantern-text {
            font-size: 16px;
            letter-spacing: 1px;
        }
    }
    @media (max-width: 480px) {
        .lantern-left, .lantern-right {
            top: 0;
        }
        .lantern-left { left: 5px; }
        .lantern-right { right: 5px; }
        .lantern-rope {
            height: 60px;
            width: 6px;
        }
        .lantern-body {
            font-size: 64px;
        }
        .lantern-text {
            font-size: 15px;
            letter-spacing: 1px;
        }
    }
  </style>
</head>
<body class="flex flex-col items-center min-h-screen py-6 px-4 sm:px-6 lg:px-8" data-theme="${theme}">

  ${theme === 'newYear' ? `
  <!-- 左右灯笼装饰 (仅新春主题显示) -->
  <div class="lantern-left">
    <div class="lantern-rope"></div>
    <div class="lantern-body">🏮</div>
    <span class="lantern-text">元旦快乐</span>
  </div>
  <div class="lantern-right">
    <div class="lantern-rope"></div>
    <div class="lantern-body">🏮</div>
    <span class="lantern-text">元旦快乐</span>
  </div>
  ` : ''}

  <div class="festive-banner">
    <div class="marquee-content">
        <span class="mr-2">${theme === 'cyber' ? '🔮' : (theme === 'forest' ? '🍃' : (theme === 'ocean' ? '🌊' : '🐎'))}</span> 
        ${cfg.notice_banner || '2026 Apple 账号免费共享 · 严禁商用'}
    </div>
  </div>

  <audio id="bgMusic" loop preload="none" src="${cfg.music_url}"></audio>
  <div id="musicControl" onclick="toggleMusic()" title="点击播放/暂停"><span style="font-size: 24px;">🎵</span></div>

  <div id="pageWrapper" class="glass-panel animate-fade-in-up">
    
    <!-- 用户区域 (移动到内容块右上角) -->
    <div class="content-user-area">
        ${user.userId ? `
            <div class="flex items-center gap-3">
                <div class="auth-btn" onclick="globalAppInstance.showCopyHistory()">📋 复制记录</div>
                <div class="user-avatar" onclick="globalAppInstance.showUserMenu()" title="${user.userDisplay}">
                    ${(user.userDisplay || 'U')[0].toUpperCase()}
                </div>
            </div>
        ` : `
            <div class="auth-btn-group">
                <div class="auth-btn" onclick="globalAppInstance.showAuthModal('login')">登录</div>
                <div class="auth-btn" onclick="globalAppInstance.showAuthModal('register')">注册</div>
            </div>
        `}
    </div>

    <div class="text-center mb-6">
        <div class="welfare-badge">
            <span class="text-lg mr-2">🕊️</span>
            <span>${cfg.disclaimer_public || '公益声明：本站为非营利性平台，仅供临时下载使用，严禁倒卖商用！'}</span>
        </div>
    </div>

    <header class="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
      <div class="text-center md:text-left w-full md:w-3/4">
        <div class="flex items-center justify-center md:justify-start gap-3 mb-4">
          <span class="text-4xl animate-bounce">${theme === 'newYear' ? '🧧' : '🍎'}</span>
          <h1 id="titleMain" class="text-2xl md:text-3xl font-bold tracking-tight leading-tight" style="color:var(--text-secondary)">${cfg.disclaimer_title || '严禁在手机【设置/iCloud】中登录！'}</h1>
        </div>
        <div id="subtitle" class="text-left text-sm md:text-base space-y-2 leading-relaxed bg-white/50 p-5 rounded-xl border border-white/60 shadow-sm backdrop-blur-sm" style="color:var(--text-primary)">
          <p class="font-bold text-lg">${cfg.disclaimer_warning || '⚠️ 仅限 App Store 使用！'}</p>
          <p class="font-medium opacity-80">${cfg.disclaimer_detail || '擅自在设置登录可能导致手机被锁死无法退出。由此产生的一切后果，本站概不负责！'}</p>
        </div>
      </div>
      <div class="flex gap-3 w-full md:w-auto justify-center md:justify-end">
        ${cfg.sponsor_enabled !== false ? '<button id="vipBtnHeader" class="btn-vip flex items-center gap-2"><span>💎</span> 打赏</button>' : ''}
        <button id="manualRefreshBtn" class="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>立即刷新
        </button>
        <button id="langToggleBtn" class="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold">繁體</button>
        <button id="themeToggleBtn" class="btn-ghost px-3 py-2 rounded-xl text-lg font-semibold" title="切换模式">🌗</button>
      </div>
    </header>

    <main class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        <div id="internetStatusMessage" class="md:col-span-12 glass-panel !bg-white/60 border-0 flex items-center justify-center p-4 rounded-2xl hidden">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-3" style="color:var(--accent-color)"></div>
          <span id="statusText" class="font-medium text-sm" style="color:var(--text-primary)">正在初始化...</span>
        </div>

        <div id="statsContainer" class="md:col-span-12 glass-panel !bg-white/60 border-0 flex flex-col md:flex-row items-start md:items-center justify-between p-4 px-6 rounded-2xl transition-all duration-300 gap-4">
            <div class="flex items-center gap-4 w-full md:w-auto">
                <div class="p-3 bg-white/50 rounded-full shrink-0" style="color:var(--accent-color)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold uppercase tracking-wider opacity-70 whitespace-nowrap" style="color:var(--text-primary)">平台累计服务：</span>
                    <span id="totalCopyCountDisplay" class="text-2xl font-black font-mono tracking-tight" style="color:var(--text-secondary)">Loading...</span>
                </div>
            </div>
            
            <div class="flex-1 w-full md:w-auto">
                <div class="vip-input-wrapper">
                    <input type="text" id="vipKeyInput" placeholder="输入卡密免验证..." autocomplete="off">
                    <button id="vipVerifyBtn">验证</button>
                </div>
                <div id="vipStatus" class="mt-2">✨ VIP特权已激活：免验证码模式</div>
            </div>
            
            <div class="text-right hidden sm:block shrink-0">
                <span class="text-xs opacity-60" style="color:var(--text-primary)">实时更新中...</span>
            </div>
        </div>

        <div id="greetingsBanner" class="md:col-span-12 greetings-container">
            <span class="greeting-icon">💬</span><span id="greetingText">祝您2026年万事如意，心想事成！</span>
        </div>
      </div>

      <div id="internetResultsTableContainer" class="hidden animate-fade-in-up">
        <div class="overflow-hidden rounded-2xl border border-white/20 shadow-sm bg-white/40 backdrop-blur-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/20 glass-table">
              <thead><tr><th id="thRegion" class="px-6 py-4 text-left text-xs font-bold uppercase">🌍 区域</th><th id="thAccount" class="px-6 py-4 text-left text-xs font-bold uppercase">👤 账号</th><th id="thStatus" class="px-6 py-4 text-left text-xs font-bold uppercase">📊 状态</th><th id="thRemark" class="px-6 py-4 text-left text-xs font-bold uppercase">💬 备注</th><th id="thAction" class="px-6 py-4 text-right text-xs font-bold uppercase">🚀 操作</th></tr></thead>
              <tbody id="internetAccountsTableBody" class="divide-y divide-white/10"></tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="internetResultsMobileContainer" class="hidden md:hidden space-y-4"><div id="internetAccountsMobileList" class="grid grid-cols-1 gap-4 account-grid"></div></div>
    </main>

    <footer class="mt-10 text-center text-xs opacity-60" style="color:var(--text-primary)"><p>© 2026 Apple Share System</p></footer>
  </div>

  ${cfg.custom_body || ''}

  <script>
    const VERIFY_CONFIG = {
        turnstile: { key: '${keys.turnstile.key}', enabled: !!${keys.turnstile.enabled} },
        hcaptcha: { key: '${keys.hcaptcha.key}', enabled: !!${keys.hcaptcha.enabled} },
        geetest: { id: '${keys.geetest.id}', enabled: !!${keys.geetest.enabled} },
        linuxdo: { enabled: !!${keys.linuxdo.enabled} }
    };
    const USER_DATA = {
        userId: ${JSON.stringify(user.userId)},
        userDisplay: ${JSON.stringify(user.userDisplay)}
    };
    const CF_WORKER_URL = '${keys.workerUrl}';
    
    // 动态获取验证时长，默认 2 分钟，如果是 linux.do 登录则为 10 分钟
    const getVerifyDuration = () => {
        return parseInt(localStorage.getItem('verify_duration')) || (2 * 60 * 1000);
    };
    
    const CUSTOM_NOTICE = \`${(cfg.notice_popup || '').replace(/\`/g, '\\`').replace(/\$/g, '\\$')}\`;
    const NOTICE_POPUP_MODE = '${cfg.notice_popup_mode || 'once_per_day'}';
    const NOTICE_POPUP_MINUTES = parseInt('${cfg.notice_popup_minutes}') || 30;

    // VIP 全局变量
    let isVipActive = false;
    let globalAppInstance = null; // 保存 app 实例以便在 VIP 验证后移除蒙版

    // [修改] 修复提示框显示
    function showGlobalToast(message, isError = false) {
       const old = document.querySelector('.my-toast');
       if(old) old.remove();
       const toast = document.createElement('div');
       toast.className = 'my-toast';
       const icon = isError ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" stroke-width="2" stroke="#ef4444"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" stroke-width="2.5" stroke="#fbbf24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';
       toast.innerHTML = icon + '<span>' + message + '</span>';
       document.body.appendChild(toast);
       // 强制重绘以触发动画
       requestAnimationFrame(() => { 
           setTimeout(() => toast.classList.add('active'), 10);
       });
       setTimeout(() => { 
           toast.classList.remove('active'); 
           setTimeout(() => toast.remove(), 500); 
       }, 2000);
    }

    function toggleMusic() {
        const audio = document.getElementById('bgMusic');
        const btn = document.getElementById('musicControl');
        if (audio.paused) {
            audio.play().then(() => {
                btn.classList.add('music-spin');
                showGlobalToast('🎶 音乐已开始播放');
            }).catch(() => showGlobalToast('无法自动播放，请检查浏览器设置', true));
        } else {
            audio.pause();
            btn.classList.remove('music-spin');
            showGlobalToast('⏸️ 音乐已暂停');
        }
    }

    // 弹窗公告显示逻辑
    function checkAndShowNotice() {
        if (!CUSTOM_NOTICE || CUSTOM_NOTICE.trim() === '') return;
        
        let shouldShow = false;
        const now = Date.now();
        
        if (NOTICE_POPUP_MODE === 'every_visit') {
            // 每次访问都弹出
            shouldShow = true;
        } else if (NOTICE_POPUP_MODE === 'once_per_day') {
            // 一天只弹出一次
            const today = new Date().toISOString().split('T')[0];
            const lastShown = localStorage.getItem('notice_date');
            if (lastShown !== today) {
                shouldShow = true;
            }
        } else if (NOTICE_POPUP_MODE === 'custom_minutes') {
            // 自定义多少分钟弹出一次
            const lastShownTime = localStorage.getItem('notice_timestamp');
            if (!lastShownTime) {
                shouldShow = true;
            } else {
                const elapsed = now - parseInt(lastShownTime, 10);
                const minutesElapsed = elapsed / (1000 * 60);
                if (minutesElapsed >= NOTICE_POPUP_MINUTES) {
                    shouldShow = true;
                }
            }
        }
        
        if (shouldShow) {
            Swal.fire({
                title: '📢 网站公告',
                html: CUSTOM_NOTICE,
                confirmButtonText: '我知道了',
                confirmButtonColor: '#ef4444',
                background: 'rgba(255,255,255,0.95)',
                backdrop: 'rgba(0,0,0,0.4)',
                willClose: () => {
                    // 根据模式保存不同的时间戳
                    if (NOTICE_POPUP_MODE === 'once_per_day') {
                        const today = new Date().toISOString().split('T')[0];
                        localStorage.setItem('notice_date', today);
                    } else if (NOTICE_POPUP_MODE === 'custom_minutes') {
                        localStorage.setItem('notice_timestamp', now.toString());
                    }
                    // every_visit 模式不需要保存，因为每次都要显示
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        checkVipStatus();
        document.getElementById('vipVerifyBtn').addEventListener('click', verifyVipKey);
        
        // 检查并显示弹窗公告
        checkAndShowNotice();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment_success') === 'true') {
             window.history.replaceState({}, document.title, window.location.pathname);
             Swal.fire({ icon: 'success', title: '🎉 感谢您的支持！', text: '您的打赏是我们更新的最大动力！', confirmButtonText: '收下祝福', confirmButtonColor: '#dc2626', });
        }
        const app = new AppleAccountApp(USER_DATA);
        globalAppInstance = app; // 保存到全局变量
        const vipBtnHeader = document.getElementById('vipBtnHeader');
        if (vipBtnHeader) { vipBtnHeader.addEventListener('click', () => { app.handleSponsorClick(); }); }
        
        document.body.addEventListener('click', () => {
            const audio = document.getElementById('bgMusic');
            if(audio && audio.paused && audio.getAttribute('src')) {
                // audio.play().catch(e=>{});
            }
        }, {once:true});
    });

    // [修改] VIP 验证逻辑 - 增加后端二次校验
    async function verifyVipKey() {
        const input = document.getElementById('vipKeyInput');
        const btn = document.getElementById('vipVerifyBtn');
        const key = input.value.trim();
        
        if(!key) return showGlobalToast('请输入卡密', true);
        
        const originalText = btn.innerText;
        btn.innerText = '...';
        btn.disabled = true;
        
        try {
            const res = await fetch('/api/verify-vip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            const data = await res.json();
            
            if (data.success) {
                isVipActive = true;
                localStorage.setItem('vip_key', key);
                updateVipUI(true);
                // 移除信息蒙版
                if (globalAppInstance) {
                    globalAppInstance.isHumanVerified = true;
                    globalAppInstance.unblurAllData();
                }
                showGlobalToast('✨ VIP 特权激活成功！免验证复制');
            } else {
                localStorage.removeItem('vip_key');
                isVipActive = false;
                updateVipUI(false);
                showGlobalToast(data.msg || '验证失败', true);
            }
        } catch (e) {
            showGlobalToast('网络错误，请重试', true);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
    
    // [新增] 页面加载时校验 VIP 有效性 (修复后端封禁后前端不刷新问题)
    async function checkVipStatus() {
        const key = localStorage.getItem('vip_key');
        if (key) {
            // 静默验证
            try {
                const res = await fetch('/api/verify-vip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key })
                });
                const data = await res.json();
                if (data.success) {
                    isVipActive = true;
                    updateVipUI(true);
                    // 移除信息蒙版
                    if (globalAppInstance) {
                        globalAppInstance.isHumanVerified = true;
                        globalAppInstance.unblurAllData();
                    }
                    console.log('VIP Status: Active');
                } else {
                    console.log('VIP Status: Expired/Banned');
                    localStorage.removeItem('vip_key');
                    isVipActive = false;
                    updateVipUI(false);
                    // 显示提示信息
                    showGlobalToast('当前卡密已失效或被封禁', true);
                }
            } catch (e) {
                // 网络错误时保留状态，或根据需求强制失效
                console.error('VIP Check Failed:', e);
            }
        }
    }
    
    function updateVipUI(isActive) {
        const inputWrapper = document.querySelector('.vip-input-wrapper');
        const statusEl = document.getElementById('vipStatus');
        
        if (isActive) {
            inputWrapper.style.display = 'none';
            statusEl.style.display = 'block';
        } else {
            inputWrapper.style.display = 'flex';
            statusEl.style.display = 'none';
        }
    }

    let newYearGreetings = ["世界和平，人类大同！", "祝您好运挡不住，财源滚滚来！", "祝您一帆风顺，二龙腾飞！", "祝您心想事成，万事大吉！"];

    async function fetchGreetings() {
        if (!CF_WORKER_URL) return;
        try {
            const res = await fetch(CF_WORKER_URL);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) newYearGreetings = data;
        } catch (e) {}
    }

    function startGreetingsRotation() {
      const el = document.getElementById('greetingText');
      if (!el) return;
      fetchGreetings().then(() => {
          let index = 0;
          if (newYearGreetings.length > 0) el.textContent = newYearGreetings[0];
          setInterval(() => {
            index = (index + 1) % newYearGreetings.length;
            el.style.opacity = '0';
            setTimeout(() => { el.textContent = newYearGreetings[index]; el.style.opacity = '1'; }, 500);
          }, 6000);
      });
    }

    class AppleAccountApp {
      constructor(userData) {
        this.copyListenerRoots = new WeakSet();
        this.isHumanVerified = false;
        this.isLoggedIn = !!userData.userId;
        this.userId = userData.userId;
        this.userDisplay = userData.userDisplay || '';
        this.I18N = {
          'app.title': { 'zh-CN': 'APPLE共享', 'zh-TW': 'APPLE共享' },
          'status.connecting': { 'zh-CN': '🔄 连接中...', 'zh-TW': '🔄 連接中...' },
          'status.done': { 'zh-CN': '✅ 同步完成！获取 {count} 个账号', 'zh-TW': '✅ 同步完成！獲取 {count} 個帳號' },
          'status.failed': { 'zh-CN': '❌ 网络超时', 'zh-TW': '❌ 網路超時' },
          'th.action': { 'zh-CN': '🚀 操作', 'zh-TW': '🚀 操作' },
          'th.account': { 'zh-CN': '👤 账号信息', 'zh-TW': '👤 帳號資訊' },
          'th.region': { 'zh-CN': '🌍 区域', 'zh-TW': '🌍 區域' },
          'th.status': { 'zh-CN': '状态', 'zh-TW': '狀態' },
          'th.remark': { 'zh-CN': '备注', 'zh-TW': '備註' }
        };
        this.init();
      }

      initTheme() {
          this.themeToggleBtn = document.getElementById('themeToggleBtn');
          if (this.themeToggleBtn) {
              this.themeToggleBtn.addEventListener('click', () => {
                  document.body.classList.toggle('dark-mode');
                  const isDark = document.body.classList.contains('dark-mode');
                  this.themeToggleBtn.textContent = isDark ? '🌞' : '🌗';
                  localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
              });
          }
          const savedTheme = localStorage.getItem('theme_preference');
          if (savedTheme) {
              if (savedTheme === 'dark') {
                  document.body.classList.add('dark-mode');
                  if (this.themeToggleBtn) this.themeToggleBtn.textContent = '🌞';
              }
          } else {
              const d = new Date();
              if (d.getHours() >= 18 || d.getHours() < 6) {
                  document.body.classList.add('dark-mode');
                  if (this.themeToggleBtn) this.themeToggleBtn.textContent = '🌞';
              }
          }
      }

      showNativeToast(message, isError = false) { showGlobalToast(message, isError); }

      getElements() {
        this.pageWrapper = document.getElementById('pageWrapper');
        this.langToggleBtn = document.getElementById('langToggleBtn');
        this.statusTextElement = document.getElementById('statusText');
        this.internetStatusMessage = document.getElementById('internetStatusMessage');
        this.internetResultsTableContainer = document.getElementById('internetResultsTableContainer');
        this.internetAccountsTableBody = document.getElementById('internetAccountsTableBody');
        this.internetResultsMobileContainer = document.getElementById('internetResultsMobileContainer');
        this.internetAccountsMobileList = document.getElementById('internetAccountsMobileList');
        this.manualRefreshBtn = document.getElementById('manualRefreshBtn');
        this.totalCopyCountDisplay = document.getElementById('totalCopyCountDisplay');
        this.thAction = document.getElementById('thAction');
        this.thAccount = document.getElementById('thAccount');
        this.thRegion = document.getElementById('thRegion');
        this.thStatus = document.getElementById('thStatus');
        this.thRemark = document.getElementById('thRemark');
      }

      getLang() {
        try { const saved = localStorage.getItem('lang'); if (saved === 'zh-TW' || saved === 'zh-CN') return saved; } catch (e) {}
        const nav = (navigator.language || '').toLowerCase();
        return nav.includes('zh-tw') || nav.includes('zh-hk') ? 'zh-TW' : 'zh-CN';
      }

      setLang(lang) {
        this.lang = (lang === 'zh-TW') ? 'zh-TW' : 'zh-CN';
        try { localStorage.setItem('lang', this.lang); } catch (e) {}
        this.applyLocale();
      }

      t(key, vars) {
        const pack = this.I18N[key] || { 'zh-CN': key, 'zh-TW': key };
        let str = pack[this.lang] || pack['zh-CN'] || key;
        if (vars && typeof vars === 'object') { Object.keys(vars).forEach(k => { str = str.replace(new RegExp('\\\\{' + k + '\\\\}', 'g'), String(vars[k])); }); }
        return str;
      }

      applyLocale() {
        try {
          const lang = this.lang || this.getLang();
          document.documentElement.setAttribute('lang', lang);
          if (this.langToggleBtn) this.langToggleBtn.textContent = (lang === 'zh-TW') ? '简体' : '繁體';
          if (this.thAction) this.thAction.textContent = this.t('th.action');
          if (this.thAccount) this.thAccount.textContent = this.t('th.account');
          if (this.thRegion) this.thRegion.textContent = this.t('th.region');
          if (this.thStatus) this.thStatus.textContent = this.t('th.status');
          if (this.thRemark) this.thRemark.textContent = this.t('th.remark');
          this.filterAndRenderByRegion();
        } catch (e) {}
      }

      setupAntiDebug() {
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('keydown', (e) => {
           const key = e.key || ''; const ctrl = e.ctrlKey || e.metaKey; const shift = e.shiftKey;
           if (key === 'F12' || (ctrl && shift && ['I','J','C'].includes(key.toUpperCase())) || (ctrl && ['U','S','P'].includes(key.toUpperCase()))) { e.preventDefault(); return false; }
        }, { capture: true });
      }

      async handleSponsorClick() {
        const zibHtml = '<div class="zib-donate-box"><div class="zib-title-area"><div class="zib-title"><span style="color:var(--accent-color)">❤️</span> 感谢您的支持</div><div class="zib-desc">您的打赏是我们更新的最大动力</div></div><div class="zib-label">选择打赏金额</div><div class="zib-grid-amounts"><div class="zib-opt active" data-price="1.00">1元</div><div class="zib-opt" data-price="2.00">2元</div><div class="zib-opt" data-price="5.00">5元</div><div class="zib-opt" data-price="10.00">10元</div></div><div class="zib-input-group"><span class="zib-currency">￥</span><input type="number" id="zibCustomAmount" class="zib-input" value="1.00" placeholder="自定义金额"></div><div class="zib-label">选择支付方式</div><div class="zib-pay-methods"><div class="zib-method active" data-type="alipay">支付宝</div><div class="zib-method" data-type="wxpay">微信支付</div></div></div>';
        
        const result = await Swal.fire({
            html: zibHtml, 
            showCloseButton: true, 
            showConfirmButton: true, 
            confirmButtonText: '立即支付 ￥1.00', 
            confirmButtonColor: '#ef4444', 
            width: '420px', 
            customClass: { popup: 'rounded-2xl' },
            didOpen: () => {
                const popup = Swal.getHtmlContainer();
                const amountOpts = popup.querySelectorAll('.zib-opt'); 
                const customInput = popup.querySelector('#zibCustomAmount'); 
                const methodOpts = popup.querySelectorAll('.zib-method'); 
                const confirmBtn = Swal.getConfirmButton();
                
                let currentAmount = 1.00;
                const updateBtnText = () => { confirmBtn.textContent = '立即支付 ￥' + parseFloat(currentAmount).toFixed(2); };
                
                amountOpts.forEach(opt => { 
                    opt.addEventListener('click', () => { 
                        amountOpts.forEach(o => o.classList.remove('active')); 
                        opt.classList.add('active'); 
                        currentAmount = opt.dataset.price; 
                        customInput.value = currentAmount; 
                        updateBtnText(); 
                    }); 
                });
                customInput.addEventListener('input', (e) => { 
                    amountOpts.forEach(o => o.classList.remove('active')); 
                    let val = parseFloat(e.target.value); 
                    if (val && val >= 0.02) { currentAmount = val; updateBtnText(); } 
                });
                methodOpts.forEach(opt => { 
                    opt.addEventListener('click', () => { methodOpts.forEach(o => o.classList.remove('active')); opt.classList.add('active'); }); 
                });
            },
            preConfirm: () => {
                const popup = Swal.getHtmlContainer(); 
                const amount = popup.querySelector('#zibCustomAmount').value; 
                const activeMethodEl = popup.querySelector('.zib-method.active');
                if (!activeMethodEl) { Swal.showValidationMessage('请选择支付方式'); return false; }
                if (!amount || parseFloat(amount) < 0.02) { Swal.showValidationMessage('最低打赏金额为 0.02 元'); return false; }
                return { amount, type: activeMethodEl.dataset.type };
            }
        });
        
        if (result.isConfirmed && result.value) {
            const { amount, type } = result.value;
            this.initiatePayment(type, amount); 
        }
      }

      async initiatePayment(type, money) {
        try { 
            const res = await fetch('/api/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: type, money: money }) }); 
            const data = await res.json(); 
            if (data.code === 1) { 
                window.location.href = data.url; 
            } else { 
                Swal.fire('创建订单失败', '', 'error'); 
            } 
        } catch (e) { 
            console.error(e); 
            Swal.fire('网络错误', '', 'error'); 
        }
      }

      async fetchAndRenderInternetAccounts() {
        if (!this.internetStatusMessage) return;
        this.internetStatusMessage.classList.remove('hidden'); 
        this.internetStatusMessage.classList.add('flex'); 
        this.statusTextElement.textContent = this.t('status.connecting');
        if (this.manualRefreshBtn) { 
            this.manualRefreshBtn.disabled = true; 
            this.manualRefreshBtn.innerHTML = '<span class="animate-spin mr-2">🔄</span> 刷新中...'; 
        }
        try {
            const response = await fetch('/api/share/data?t=' + Date.now()); 
            const json = await response.json();
            if (json.code === 200 && json.data) {
                this.allInternetAccounts = Array.isArray(json.data) ? json.data : []; 
                this.statusTextElement.textContent = this.t('status.done', { count: this.allInternetAccounts.length });
                if (json.copy_count !== undefined && this.totalCopyCountDisplay) { 
                    const current = parseInt(this.totalCopyCountDisplay.innerText.replace(/,/g, '')) || 0;
                    this.animateValue(this.totalCopyCountDisplay, current, json.copy_count, 1000); 
                }
                this.filterAndRenderByRegion();
                if (this.internetResultsTableContainer) this.internetResultsTableContainer.classList.remove('hidden');
                if (window.innerWidth < 768 && this.internetResultsMobileContainer) {
                    this.internetResultsMobileContainer.classList.remove('hidden');
                }
            } else { 
                throw new Error('API Error'); 
            }
        } catch (error) { 
            console.error('Fetch error:', error);
            if (this.statusTextElement) this.statusTextElement.textContent = this.t('status.failed'); 
            this.showNativeToast('数据同步失败，请重试', true); 
        } finally { 
            setTimeout(() => { 
                if (this.internetStatusMessage) {
                    this.internetStatusMessage.classList.add('hidden'); 
                    this.internetStatusMessage.classList.remove('flex'); 
                }
            }, 1500); 
            if (this.manualRefreshBtn) { 
                this.manualRefreshBtn.disabled = false; 
                this.manualRefreshBtn.innerHTML = '立即刷新'; 
            } 
        }
      }

      animateValue(obj, start, end, duration) {
          if (start === end) return; 
          let startTimestamp = null;
          const step = (timestamp) => { 
              if (!startTimestamp) startTimestamp = timestamp; 
              const progress = Math.min((timestamp - startTimestamp) / duration, 1); 
              obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString(); 
              if (progress < 1) { 
                  window.requestAnimationFrame(step); 
              } else { 
                  obj.innerHTML = end.toLocaleString(); 
              } 
          };
          window.requestAnimationFrame(step);
      }

      filterAndRenderByRegion() {
        const source = this.allInternetAccounts || [];
        if (this.isMobile()) {
            this.updateMobileList(this.internetAccountsMobileList, source);
        } else {
            this.updateTable(this.internetAccountsTableBody, source);
        }
      }

      isMobile() { return window.innerWidth < 768; }
      
      updateMobileList(listEl, accounts) {
        if (!listEl) return;
        const fragment = document.createDocumentFragment(); 
        listEl.innerHTML = '';
        accounts.forEach(acc => {
          const card = document.createElement('div'); 
          card.className = 'glass-panel account-card rounded-2xl p-5 border border-white/20 relative overflow-hidden';
          const statusBadge = acc.status ? '<span class="badge badge-green">正常</span>' : '<span class="badge badge-red">异常</span>';
          const blurClass = this.isHumanVerified ? 'sensitive-data revealed' : 'sensitive-data';
          
          const safeUser = acc.username.replace(/"/g, '&quot;');
          const safePass = acc.password.replace(/"/g, '&quot;');
          
          card.innerHTML = \`
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-2">
                    <span class="text-xl">🌍</span>
                    <span class="font-bold" style="color:var(--text-secondary)">\${acc.region_display || '未知'}</span>
                </div>
                \${statusBadge}
            </div>
            <div class="space-y-3">
                <div class="bg-white/50 rounded-xl p-3 flex justify-between items-center border border-white/20">
                    <div class="flex flex-col overflow-hidden mr-2">
                        <span class="text-xs uppercase tracking-wider opacity-60" style="color:var(--text-primary)">账号</span>
                        <span class="font-mono text-sm font-semibold truncate \${blurClass} copy-username-btn" style="color:var(--text-primary)" data-username="\${safeUser}">\${acc.username}</span>
                    </div>
                    <button class="btn-copy btn-ghost px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 copy-username-btn" data-username="\${safeUser}">复制</button>
                </div>
                <div class="bg-white/50 rounded-xl p-3 flex justify-between items-center border border-white/20">
                    <div class="flex flex-col overflow-hidden mr-2">
                        <span class="text-xs uppercase tracking-wider opacity-60" style="color:var(--text-primary)">密码</span>
                        <span class="font-mono text-sm font-semibold truncate \${blurClass} copy-password-btn" style="color:var(--text-primary)" data-password="\${safePass}">\${acc.password}</span>
                    </div>
                    <button class="btn-copy btn-primary px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 copy-password-btn" data-password="\${safePass}">复制</button>
                </div>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs opacity-70" style="color:var(--text-primary)">
                <span>\${acc.frontend_remark || '无备注'}</span>
                <span>⏰ \${acc.last_check || '-'}</span>
            </div>\`;
          
          fragment.appendChild(card);
        });
        listEl.appendChild(fragment); 
        this.addCopyButtonListeners(listEl);
      }

      updateTable(tableBody, accounts) {
        const fragment = document.createDocumentFragment(); 
        tableBody.innerHTML = '';
        accounts.forEach(acc => {
          const row = document.createElement('tr'); 
          row.className = 'transition-colors duration-150 group';
          const statusBadge = acc.status ? '<span class="badge badge-green">正常</span>' : '<span class="badge badge-red">异常</span>';
          const blurClass = this.isHumanVerified ? 'sensitive-data revealed' : 'sensitive-data';
          
          const safeUser = acc.username.replace(/"/g, '&quot;');
          const safePass = acc.password.replace(/"/g, '&quot;');

          row.innerHTML = \`
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" style="color:var(--text-secondary)">\${acc.region_display || '未知'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                    <span class="text-sm font-mono font-semibold \${blurClass} copy-username-btn" style="color:var(--text-primary)" data-username="\${safeUser}">\${acc.username}</span>
                    <span class="text-xs font-mono mt-0.5 opacity-60 \${blurClass} copy-password-btn" style="color:var(--text-primary)" data-password="\${safePass}">\${acc.password}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">\${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate" style="color:var(--text-primary)">\${acc.frontend_remark || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <button class="copy-username-btn btn-ghost px-3 py-1.5 rounded-lg text-xs font-bold" data-username="\${safeUser}">账号</button>
                <button class="copy-password-btn btn-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm" data-password="\${safePass}">密码</button>
            </td>\`;
          
          fragment.appendChild(row);
        });
        tableBody.appendChild(fragment); 
        this.addCopyButtonListeners(tableBody);
      }

      checkVerificationStatus() {
        if (isVipActive) {
            this.isHumanVerified = true;
            this.unblurAllData();
            return;
        }

        const stored = localStorage.getItem('verify_timestamp');
        if (stored) { 
            const duration = getVerifyDuration();
            const elapsed = Date.now() - parseInt(stored, 10); 
            if (elapsed < duration) { 
                this.isHumanVerified = true; 
                this.unblurAllData(); 
                const remaining = duration - elapsed; 
                setTimeout(() => this.expireVerification(), remaining); 
            } else { 
                this.expireVerification(); 
            } 
        }
      }

      expireVerification() {
        if (isVipActive) return; // VIP 永不过期
        this.isHumanVerified = false; 
        localStorage.removeItem('verify_timestamp'); 
        localStorage.removeItem('verify_duration'); // 清理时长
        document.querySelectorAll('.sensitive-data').forEach(el => { el.classList.remove('revealed'); });
      }

      async handleSecurityVerification(onSuccess) {
          if (isVipActive || this.isHumanVerified) { 
              onSuccess(); 
              return; 
          }
          
          const turnstileContainerId = 'turnstile-container-' + Math.random().toString(36).substr(2, 9);
          const hcaptchaContainerId = 'hcaptcha-container-' + Math.random().toString(36).substr(2, 9);
          const geetestContainerId = 'geetest-btn-' + Math.random().toString(36).substr(2, 9);

          let swalHtml = '<div class="text-left space-y-4">' +
                '<div class="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200 mb-2">' +
                    '<p class="text-yellow-800 font-bold text-base">👇 请完成人机验证 👇</p>' +
                    '<p class="text-red-600 text-xs font-bold mt-1">⚠️ 验证通过后可获取全部信息</p>' +
                '</div>';

          if (VERIFY_CONFIG.linuxdo.enabled && !this.isLoggedIn) {
              swalHtml += '<div class="grid grid-cols-1 gap-3">' +
                    '<button id="linuxdoLoginBtn" class="w-full flex items-center justify-center gap-3 bg-[#222] hover:bg-black text-white py-3 px-4 rounded-xl font-bold transition duration-300 shadow-md">' +
                        '<span class="text-xl">🐧</span>' + 
                        '<span>使用 linux.do 账号登录 (免验证)</span>' +
                    '</button>' +
                '</div>' +
                '<div class="relative flex py-1 items-center"><div class="flex-grow border-t border-gray-300"></div><span class="flex-shrink-0 mx-3 text-gray-400 text-xs font-bold">OR 人机验证</span><div class="flex-grow border-t border-gray-300"></div></div>';
          }

          if (VERIFY_CONFIG.turnstile.enabled) {
              swalHtml += '<div class="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center"><div id="' + turnstileContainerId + '" class="min-h-[65px]"></div></div>';
          }
          if (VERIFY_CONFIG.hcaptcha.enabled) {
              swalHtml += '<div class="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center"><div id="' + hcaptchaContainerId + '" class="min-h-[78px]"></div></div>';
          }
          if (VERIFY_CONFIG.geetest.enabled) {
              swalHtml += '<div class="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center"><div id="' + geetestContainerId + '" class="w-full flex justify-center"></div></div>';
          }

          swalHtml += '</div>';

          await Swal.fire({
              title: '安全验证',
              html: swalHtml,
              showConfirmButton: false,
              showCloseButton: true,
              width: '450px',
              didOpen: () => {
                  const linuxdoBtn = document.getElementById('linuxdoLoginBtn');
                  if (linuxdoBtn) {
                      linuxdoBtn.onclick = () => { window.location.href = '/api/auth/linuxdo'; };
                  }

                  if (VERIFY_CONFIG.turnstile.enabled && typeof turnstile !== 'undefined') {
                      try { 
                          turnstile.render('#' + turnstileContainerId, { sitekey: VERIFY_CONFIG.turnstile.key, callback: async (token) => {
                              try {
                                  const response = await fetch('/api/verify-human', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
                                  const data = await response.json();
                                  if (data.success) {
                                      localStorage.removeItem('verify_duration');
                                      this.verifySuccess(onSuccess);
                                  } else { Swal.showValidationMessage('Turnstile 验证失败'); }
                              } catch (err) { Swal.showValidationMessage('网络请求错误'); }
                          }}); 
                      } catch(e) {}
                  }
                  if (VERIFY_CONFIG.hcaptcha.enabled && typeof hcaptcha !== 'undefined') {
                      try { 
                          hcaptcha.render(hcaptchaContainerId, { sitekey: VERIFY_CONFIG.hcaptcha.key, callback: async (token) => {
                              try {
                                  const response = await fetch('/api/verify-hcaptcha', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
                                  const data = await response.json();
                                  if (data.success) {
                                      localStorage.removeItem('verify_duration');
                                      this.verifySuccess(onSuccess);
                                  } else { Swal.showValidationMessage('hCaptcha 验证失败'); }
                              } catch (err) { Swal.showValidationMessage('网络请求错误'); }
                          }}); 
                      } catch(e) {}
                  }
                  if (VERIFY_CONFIG.geetest.enabled && typeof initGeetest4 !== 'undefined') {
                      initGeetest4({ captchaId: VERIFY_CONFIG.geetest.id }, (captcha) => {
                          captcha.appendTo("#" + geetestContainerId);
                          captcha.onSuccess(async () => {
                              try {
                                  const response = await fetch('/api/verify-geetest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(captcha.getValidate()) });
                                  const data = await response.json();
                                  if (data.success) {
                                      localStorage.removeItem('verify_duration');
                                      this.verifySuccess(onSuccess);
                                  } else { Swal.showValidationMessage('极验验证失败: ' + data.msg); captcha.reset(); }
                              } catch(err) { Swal.showValidationMessage('网络请求错误'); }
                          });
                      });
                  }
              }
          });
      }

      verifySuccess(callback) {
          this.isHumanVerified = true;
          const duration = getVerifyDuration();
          localStorage.setItem('verify_timestamp', Date.now());
          Swal.close(); 
          this.unblurAllData();
          this.showNativeToast('验证通过！');
          setTimeout(() => this.expireVerification(), duration);
          if (callback) callback();
      }

      unblurAllData() { document.querySelectorAll('.sensitive-data').forEach(el => { el.classList.add('revealed'); }); }

      async copyAndToast(text, accountName = '') {
        try {
           if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
           else { const t = document.createElement('textarea'); t.value=text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
           this.showNativeToast('复制成功');
           
           // 记录复制日志 (VIP/普通)
           fetch('/api/report/copy', { method: 'POST' })
               .then(res => res.json())
               .then(data => { if(data.success && this.totalCopyCountDisplay) { this.totalCopyCountDisplay.innerText = data.count.toLocaleString(); } })
               .catch(err => console.error(err));
           
           // 如果用户已登录，记录到个人历史
           if (this.isLoggedIn && accountName) {
               fetch('/api/user/record-copy', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ account: accountName })
               }).catch(e => console.error('Record copy error:', e));
           }
        } catch { this.showNativeToast('复制失败，请手动长按复制', true); }
      }

      showAuthModal(type = 'login') {
        Swal.fire({
            showConfirmButton: false,
            showCloseButton: true,
            background: '#fff',
            customClass: { popup: 'zib-auth-modal rounded-3xl overflow-hidden' },
            html: \`
                <div class="zib-auth-header">
                    <div id="tab-login" class="zib-auth-tab \${type === 'login' ? 'active' : ''}" onclick="globalAppInstance.switchAuthTab('login')">登录</div>
                    <div id="tab-register" class="zib-auth-tab \${type === 'register' ? 'active' : ''}" onclick="globalAppInstance.switchAuthTab('register')">注册</div>
                </div>
                
                <div id="auth-content-login" class="\${type === 'login' ? '' : 'hidden'}">
                    <div class="zib-auth-input-group">
                        <label>账号</label>
                        <div class="zib-auth-input-wrapper">
                            <input id="login-account" class="zib-auth-input" placeholder="用户名或邮箱">
                        </div>
                    </div>
                    <div class="zib-auth-input-group">
                        <label>密码</label>
                        <div class="zib-auth-input-wrapper">
                            <input id="login-password" type="password" class="zib-auth-input" placeholder="请输入密码">
                        </div>
                    </div>
                    <button class="zib-auth-submit" onclick="globalAppInstance.submitLogin()">立即登录</button>
                </div>

                <div id="auth-content-register" class="\${type === 'register' ? '' : 'hidden'}">
                    <div class="zib-auth-input-group">
                        <label>用户名</label>
                        <input id="reg-username" class="zib-auth-input" placeholder="设置你的用户名">
                    </div>
                    <div class="zib-auth-input-group">
                        <label>邮箱</label>
                        <div class="zib-verify-group">
                            <input id="reg-email" type="email" class="zib-auth-input" placeholder="用于找回密码或验证">
                            <button id="send-code-btn" class="zib-verify-btn" onclick="globalAppInstance.sendEmailCode()">获取验证码</button>
                        </div>
                    </div>
                    <div class="zib-auth-input-group">
                        <label>验证码</label>
                        <input id="reg-code" class="zib-auth-input" placeholder="6位数字验证码">
                    </div>
                    <div class="zib-auth-input-group">
                        <label>密码</label>
                        <input id="reg-password" type="password" class="zib-auth-input" placeholder="设置登录密码">
                    </div>
                    \${VERIFY_CONFIG.hcaptcha.enabled ? \`<div id="hcaptcha-register-container" class="my-4"></div>\` : ''}
                    <button id="reg-submit-btn" class="zib-auth-submit" onclick="globalAppInstance.submitRegister()" \${VERIFY_CONFIG.hcaptcha.enabled ? 'disabled' : ''}>立即注册</button>
                </div>

                <div class="zib-auth-social">
                    <span class="zib-auth-social-title">或者使用社交账号</span>
                    <a href="/api/auth/linuxdo" class="flex items-center justify-center gap-2 bg-[#222] hover:bg-black text-white py-3 rounded-xl font-bold transition text-sm mt-2">
                        <span>🐧</span> Linux.do 快捷登录/注册
                    </a>
                </div>
            \`,
            didOpen: () => {
                if (VERIFY_CONFIG.hcaptcha.enabled && type === 'register') {
                    this.renderRegisterCaptcha();
                }
            }
        });
      }

      switchAuthTab(type) {
          const loginTab = document.getElementById('tab-login');
          const regTab = document.getElementById('tab-register');
          const loginContent = document.getElementById('auth-content-login');
          const regContent = document.getElementById('auth-content-register');
          
          if (type === 'login') {
              loginTab.classList.add('active');
              regTab.classList.remove('active');
              loginContent.classList.remove('hidden');
              regContent.classList.add('hidden');
          } else {
              loginTab.classList.remove('active');
              regTab.classList.add('active');
              loginContent.classList.add('hidden');
              regContent.classList.remove('hidden');
              if (VERIFY_CONFIG.hcaptcha.enabled) {
                  this.renderRegisterCaptcha();
              }
          }
      }

      renderRegisterCaptcha() {
          const container = document.getElementById('hcaptcha-register-container');
          if (container && !container.hasChildNodes()) {
              hcaptcha.render('hcaptcha-register-container', {
                  sitekey: VERIFY_CONFIG.hcaptcha.key,
                  callback: (token) => {
                      this.regHcaptchaToken = token;
                      document.getElementById('reg-submit-btn').disabled = false;
                  }
              });
          }
      }

      async submitLogin() {
          const account = document.getElementById('login-account').value;
          const password = document.getElementById('login-password').value;
          if (!account || !password) return this.showNativeToast('请填写账号和密码', true);
          
          this.handleLogin({ account, password });
      }

      async submitRegister() {
          const username = document.getElementById('reg-username').value;
          const email = document.getElementById('reg-email').value;
          const code = document.getElementById('reg-code').value;
          const password = document.getElementById('reg-password').value;
          
          if (!username || !email || !code || !password) return this.showNativeToast('请填写完整注册信息', true);
          
          this.handleRegister({ 
              username, email, code, password, 
              hcaptcha_token: this.regHcaptchaToken 
          });
      }

      async sendEmailCode() {
          const email = document.getElementById('reg-email').value;
          if (!email || !email.includes('@')) return this.showNativeToast('请输入有效邮箱', true);
          
          const btn = document.getElementById('send-code-btn');
          const oldText = btn.innerText;
          btn.disabled = true;
          
          try {
              const res = await fetch('/api/auth/send-code', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
              });
              const data = await res.json();
              this.showNativeToast(data.msg, !data.success);
              
              if (data.success) {
                  let countdown = 60;
                  const timer = setInterval(() => {
                      countdown--;
                      btn.innerText = countdown + 's';
                      if (countdown <= 0) {
                          clearInterval(timer);
                          btn.innerText = oldText;
                          btn.disabled = false;
                      }
                  }, 1000);
              } else {
                  btn.disabled = false;
              }
          } catch (e) {
              this.showNativeToast('发送失败', true);
              btn.disabled = false;
          }
      }

      async handleLogin(payload) {
          try {
              const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });
              const data = await res.json();
              if (data.success) {
                  this.showNativeToast('登录成功！正在跳转...');
                  setTimeout(() => window.location.reload(), 1000);
              } else {
                  this.showNativeToast(data.msg, true);
              }
          } catch (e) {
              this.showNativeToast('登录错误', true);
          }
      }

      async handleRegister(payload) {
          try {
              const res = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });
              const data = await res.json();
              if (data.success) {
                  Swal.fire('注册成功', data.msg, 'success').then(() => this.showAuthModal('login'));
              } else {
                  this.showNativeToast(data.msg, true);
              }
          } catch (e) {
              this.showNativeToast('注册错误', true);
          }
      }

      showUserMenu() {
          Swal.fire({
              title: this.userDisplay,
              html: \`
                <div class="flex flex-col gap-3">
                    <button onclick="globalAppInstance.showCopyHistory()" class="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl flex items-center justify-between transition">
                        <span class="font-bold">📋 复制记录</span>
                        <span>➡️</span>
                    </button>
                    <button onclick="globalAppInstance.handleLogout()" class="bg-rose-50 hover:bg-rose-100 text-rose-600 p-3 rounded-xl font-bold transition">退出登录</button>
                </div>
              \`,
              showConfirmButton: false,
              showCloseButton: true,
              width: '320px'
          });
      }

      async handleLogout() {
          await fetch('/api/auth/logout');
          window.location.reload();
      }

      async showCopyHistory() {
          Swal.fire({
              title: '我的复制记录',
              width: '400px',
              html: '<div id="history-list" class="text-left max-h-80 overflow-y-auto">加载中...</div>',
              didOpen: async () => {
                  try {
                      const res = await fetch('/api/user/copy-records');
                      const data = await res.json();
                      const container = document.getElementById('history-list');
                      if (data.success && data.records.length > 0) {
                          container.innerHTML = data.records.map(r => \`
                            <div class="border-b border-gray-100 py-3">
                                <div class="font-bold text-gray-700">\${r.account_username}</div>
                                <div class="text-xs text-gray-400 mt-1">\${new Date(r.copied_at).toLocaleString()}</div>
                            </div>
                          \`).join('');
                      } else {
                          container.innerHTML = '<div class="text-center py-8 text-gray-400">暂无复制记录</div>';
                      }
                  } catch (e) {
                      document.getElementById('history-list').innerHTML = '加载失败';
                  }
              }
          });
      }

      addCopyButtonListeners(root) {
        if (this.copyListenerRoots.has(root)) return;
        root.addEventListener('click', async (ev) => {
          const btn = ev.target.closest('.copy-username-btn, .copy-password-btn');
          if (!btn) return;
          ev.preventDefault(); ev.stopPropagation();
          
          // 获取账号名用于记录历史
          let accountName = btn.dataset.username || '';
          if (!accountName) {
              const row = btn.closest('tr') || btn.closest('.glass-panel');
              if (row) {
                  const nameEl = row.querySelector('.copy-username-btn');
                  if (nameEl) accountName = nameEl.dataset.username || '';
              }
          }

          this.handleSecurityVerification(async () => {
              const text = btn.dataset.username || btn.dataset.password || '';
              if (localStorage.getItem('copy_steps_done') !== '1') await this.ensureCopyStepsDone();
              await this.copyAndToast(text, accountName);
          });
        }, { passive: false });
        this.copyListenerRoots.add(root);
      }

      setupSecurityListeners() {
          const preventAction = (e) => {
              const el = e.target.closest('.sensitive-data');
              if (el && !el.classList.contains('revealed')) { e.preventDefault(); e.stopPropagation(); return false; }
          };
          document.addEventListener('contextmenu', preventAction, true);
          document.addEventListener('copy', preventAction, true);
      }

      init() {
        this.getElements();
        this.setupAntiDebug();
        this.setupSecurityListeners();
        
        // 优先处理 Linux.do 登录成功的提示和状态
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth_success') === '1') {
            this.isHumanVerified = true;
            localStorage.setItem('verify_timestamp', Date.now().toString());
            // 立即移除模糊，确保用户体验
            this.unblurAllData();
            // 清除 URL 参数
            window.history.replaceState({}, document.title, window.location.pathname);
            // 弹出提示（类似复制成功的 Toast）
            setTimeout(() => {
                this.showNativeToast('✨ linux.do 登录成功');
            }, 300);
        } else if (urlParams.get('auth_error')) {
            const errorMsg = urlParams.get('auth_error');
            let displayMsg = '登录失败，请重试';
            if (errorMsg === 'state_mismatch') displayMsg = '验证失效，请重新登录';
            if (errorMsg === 'no_user') displayMsg = '无法获取用户信息';
            
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => {
                this.showNativeToast(displayMsg, true);
            }, 300);
        }

        this.checkVerificationStatus(); 
        this.initTheme();
        startGreetingsRotation();
        if (this.manualRefreshBtn) this.manualRefreshBtn.addEventListener('click', () => this.fetchAndRenderInternetAccounts());
        if (this.langToggleBtn) this.langToggleBtn.addEventListener('click', () => { this.setLang(this.lang === 'zh-TW' ? 'zh-CN' : 'zh-TW'); });
        window.addEventListener('resize', () => { if (this.isMobile() && this.internetResultsMobileContainer.classList.contains('hidden')) { this.filterAndRenderByRegion(); } });
        this.applyLocale();
        this.fetchAndRenderInternetAccounts();
        setInterval(() => { if (!document.hidden) this.fetchAndRenderInternetAccounts(); }, 600000);
      }
    }
  </script>
</body>
</html>`;
}

module.exports = { getHtmlContent };
