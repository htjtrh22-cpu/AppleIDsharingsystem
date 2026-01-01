function getLoginHtml() {
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <title>后台管理 - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Quicksand', 'Ma Shan Zheng', sans-serif;
                background-image: url('https://img.api.aa1.cn/2025/01/01/5e73e2187652c.jpg');
                background-size: cover; background-position: center;
            }
            .glass-card {
                background: rgba(255, 255, 255, 0.75);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            /* Toast 样式 */
            .my-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 12px 24px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-weight: 600; color: #333; opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 9999; border: 1px solid rgba(255,255,255,0.5); }
            .my-toast.active { transform: translateX(-50%) translateY(0); opacity: 1; }
        </style>
    </head>
    <body class="flex items-center justify-center min-h-screen p-4">
        <div class="glass-card p-10 rounded-3xl w-full max-w-md transform transition hover:scale-[1.01] duration-500">
            <div class="text-center mb-8">
                <div class="text-6xl mb-4">🌸</div>
                <h2 class="text-3xl font-bold text-pink-600">管理员登录</h2>
                <p class="text-gray-500 mt-2 text-sm">Welcome back, Master!</p>
            </div>
            <form action="/admin/login" method="POST" class="space-y-6">
                <div>
                    <label class="block text-gray-600 text-sm font-bold mb-2 ml-1">账号 (User)</label>
                    <input type="text" name="username" class="w-full px-5 py-3 rounded-2xl bg-white/60 border border-pink-200 text-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all placeholder-pink-200" placeholder="Username" required>
                </div>
                <div>
                    <label class="block text-gray-600 text-sm font-bold mb-2 ml-1">密码 (Password)</label>
                    <input type="password" name="password" class="w-full px-5 py-3 rounded-2xl bg-white/60 border border-pink-200 text-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all placeholder-pink-200" placeholder="••••••" required>
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-pink-200 transform hover:-translate-y-1 transition duration-300">
                    立即进入
                </button>
            </form>
            
            <div class="mt-8 border-t border-pink-100 pt-6">
                <a href="/admin/login/linuxdo" class="w-full flex items-center justify-center gap-3 bg-[#222] hover:bg-black text-white py-3.5 rounded-2xl font-bold transition duration-300 shadow-lg transform hover:-translate-y-1">
                    <span class="text-xl">🐧</span>
                    <span>Linux.do 快捷登录</span>
                </a>
            </div>
        </div>
    </body>
    </html>
    `;
}

function getDashboardHtml(db, cachedData, DEFAULT_DB) {
    const cfg = db.siteConfig || DEFAULT_DB.siteConfig;
    const regions = ['🇨🇳 中国', '🇺🇸 美国', '🇯🇵 日本', '🇰🇷 韩国', '🇭🇰 香港', '🇹🇼 台湾', '🇬🇧 英国', '🇦🇺 澳洲', '🇨🇦 加拿大', '🌍 全球/其他', '🚀 固定/SVIP'];

    const fixedAccountRows = (db.fixedAccounts || []).map((acc, index) => {
        const regionOptions = regions.map(r => 
            `<option value="${r}" ${acc.region === r ? 'selected' : ''}>${r}</option>`
        ).join('');
        const safeUser = (acc.username || '').replace(/"/g, '&quot;');
        const safePass = (acc.password || '').replace(/"/g, '&quot;');
        const safeRemark = (acc.remark || '').replace(/"/g, '&quot;');
        return `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 p-4 bg-white/50 rounded-2xl border border-pink-100 items-center hover:bg-white/80 transition-colors shadow-sm">
            <div class="md:col-span-3"><input type="text" name="fixed_user[]" value="${safeUser}" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none" placeholder="账号"></div>
            <div class="md:col-span-3"><input type="text" name="fixed_pass[]" value="${safePass}" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none" placeholder="密码"></div>
            <div class="md:col-span-2"><select name="fixed_region[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none appearance-none cursor-pointer">${regionOptions}</select></div>
            <div class="md:col-span-2"><input type="text" name="fixed_remark[]" value="${safeRemark}" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none" placeholder="备注"></div>
            <div class="md:col-span-1"><select name="fixed_status[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none"><option value="1" ${acc.status ? 'selected' : ''}>正常</option><option value="0" ${!acc.status ? 'selected' : ''}>异常</option></select></div>
            <div class="md:col-span-1 text-center"><button type="button" onclick="this.closest('.grid').remove()" class="text-rose-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition">🗑️</button></div>
        </div>
    `}).join('');

    const sourceRows = (db.sources || []).map((src, index) => {
        const safeName = (src.source || '').replace(/"/g, '&quot;');
        const safeUrl = (src.url || '').replace(/"/g, '&quot;');
        return `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 p-4 bg-white/50 rounded-2xl border border-blue-100 items-center hover:bg-white/80 transition-colors shadow-sm">
            <div class="md:col-span-3"><input type="text" name="src_name[]" value="${safeName}" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-blue-100 focus:border-blue-400 focus:outline-none" placeholder="名称"></div>
            <div class="md:col-span-7"><input type="text" name="src_url[]" value="${safeUrl}" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-blue-100 focus:border-blue-400 focus:outline-none" placeholder="API 地址"></div>
            <div class="md:col-span-1"><input type="number" name="src_count[]" value="${src.fetchCount || 1}" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-blue-100 focus:border-blue-400 focus:outline-none text-center" placeholder="次数"></div>
            <div class="md:col-span-1 text-center"><button type="button" onclick="this.closest('.grid').remove()" class="text-rose-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition">🗑️</button></div>
        </div>
    `}).join('');

    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <title>控制台 - Apple 共享系统 (Pro Max)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
        <style>
            body { 
                font-family: 'Quicksand', sans-serif; 
                background-image: url('${cfg.bg_desktop || "https://img.api.aa1.cn/2025/01/01/5e73e2187652c.jpg"}');
                background-size: cover; background-position: center; background-attachment: fixed;
            }
            .glass-panel { background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.6); }
            .glass-sidebar { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.5); }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #f472b6; }
            .nav-item { border-radius: 12px; margin: 0 10px; transition: all 0.3s; }
            .nav-item.active { background-color: #fff; color: #db2777; box-shadow: 0 4px 15px rgba(219, 39, 119, 0.15); font-weight: bold; }
            .nav-item:hover:not(.active) { background-color: rgba(255,255,255,0.5); color: #db2777; }
            .content-section { display: none; animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            .content-section.active { display: block; }
            @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            textarea { min-height: 100px; font-family: monospace; font-size: 13px; }
            
            /* 菜单分类样式 */
            .menu-category { margin: 15px 15px 5px 15px; }
            .category-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-radius: 12px; cursor: pointer; transition: all 0.3s; background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.5); }
            .category-header:hover { background: rgba(255,255,255,0.6); }
            .category-header.active { background: #fff; border-color: #db2777; color: #db2777; font-weight: bold; }
            .category-title { font-size: 14px; font-weight: 700; color: #4b5563; }
            .category-header.active .category-title { color: #db2777; }
            .category-icon { transition: transform 0.3s; color: #9ca3af; }
            .category-header.open .category-icon { transform: rotate(90deg); }
            .category-items { display: none; margin-top: 5px; padding-left: 10px; border-left: 2px solid rgba(219, 39, 119, 0.1); }
            .category-items.open { display: block; }
            .nav-item { margin: 2px 0 !important; font-size: 13px; padding: 8px 15px !important; }
            
            /* Toast 样式 */
            .my-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 12px 24px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-weight: 600; color: #333; opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 9999; border: 1px solid rgba(255,255,255,0.5); }
            .my-toast.active { transform: translateX(-50%) translateY(0); opacity: 1; }
        </style>
    </head>
    <body class="text-gray-700 h-screen overflow-hidden flex">
        <aside class="w-64 glass-sidebar flex flex-col shadow-xl z-20">
            <div class="h-20 flex items-center justify-center border-b border-pink-100">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">🌸 Apple Admin</span>
            </div>
            <nav class="flex-1 overflow-y-auto py-6 space-y-4">
                <!-- 系统设置分类 -->
                <div class="menu-category">
                    <div class="category-header open" onclick="toggleCategory(this)">
                        <span class="category-title">⚙️ 系统设置</span>
                        <span class="category-icon">▶</span>
                    </div>
                    <div class="category-items open">
                        <a href="#" onclick="switchTab('dashboard')" id="nav-dashboard" class="nav-item active flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">📊</span> 概览与基础</a>
                        <a href="#" onclick="switchTab('keys')" id="nav-keys" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">🔑</span> 卡密管理</a>
                        <a href="#" onclick="switchTab('design')" id="nav-design" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">🎨</span> 个性化装修</a>
                    </div>
                </div>

                <!-- 账号设置分类 -->
                <div class="menu-category">
                    <div class="category-header" onclick="toggleCategory(this)">
                        <span class="category-title">👤 账号设置</span>
                        <span class="category-icon">▶</span>
                    </div>
                    <div class="category-items">
                        <a href="#" onclick="switchTab('fixed')" id="nav-fixed" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">📌</span> 固定账号</a>
                        <a href="#" onclick="switchTab('sources')" id="nav-sources" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">🌐</span> 数据源配置</a>
                    </div>
                </div>

                <!-- 支付和安全设置分类 -->
                <div class="menu-category">
                    <div class="category-header" onclick="toggleCategory(this)">
                        <span class="category-title">🔒 支付与安全</span>
                        <span class="category-icon">▶</span>
                    </div>
                    <div class="category-items">
                        <a href="#" onclick="switchTab('payment')" id="nav-payment" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">💳</span> 支付接口</a>
                        <a href="#" onclick="switchTab('security')" id="nav-security" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">🛡️</span> 安全验证</a>
                        <a href="#" onclick="switchTab('ads')" id="nav-ads" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">📢</span> 广告管理</a>
                    </div>
                </div>

                <!-- 其他 -->
                <div class="menu-category">
                    <div class="category-header" onclick="toggleCategory(this)">
                        <span class="category-title">🛠️ 管理员选项</span>
                        <span class="category-icon">▶</span>
                    </div>
                    <div class="category-items">
                        <a href="#" onclick="switchTab('admin')" id="nav-admin" class="nav-item flex items-center px-4 py-3 text-gray-600"><span class="mr-3 text-xl">👤</span> 账号设置</a>
                    </div>
                </div>
            </nav>
            <div class="p-6 border-t border-pink-100">
                <a href="/" target="_blank" class="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg shadow-blue-200 transition mb-3">👁️ 预览前台</a>
                <a href="/admin/logout" class="flex items-center justify-center w-full px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-500 rounded-xl transition text-sm font-bold">🏃 退出登录</a>
            </div>
        </aside>
        <main class="flex-1 flex flex-col h-full relative overflow-hidden">
            <form action="/admin/save" method="POST" class="h-full flex flex-col" id="adminSaveForm">
                <input type="hidden" name="current_tab" id="currentTabInput" value="dashboard">
                <header class="h-20 glass-panel border-b-0 flex items-center justify-between px-8 sticky top-0 z-10 m-4 mb-0 rounded-2xl shadow-sm">
                    <h2 id="page-title" class="text-xl font-bold text-gray-800">控制台概览</h2>
                    <button type="submit" class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-2.5 rounded-full shadow-lg shadow-pink-200 transform hover:-translate-y-0.5 transition duration-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                        保存所有配置 (Save)
                    </button>
                </header>
                <div class="flex-1 overflow-y-auto p-4 scroll-smooth">
                    
                    <div id="section-dashboard" class="content-section active space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div class="glass-panel p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center">
                                <div class="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl mr-4">👥</div>
                                <div><div class="text-xs text-gray-500 font-bold uppercase tracking-wider">实时用户总数</div><div class="text-2xl font-bold text-gray-800" id="stat-users">...</div></div>
                            </div>
                            <div class="glass-panel p-6 rounded-3xl border border-blue-100 shadow-sm flex items-center">
                                <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mr-4">📋</div>
                                <div><div class="text-xs text-gray-500 font-bold uppercase tracking-wider">累计复制记录</div><div class="text-2xl font-bold text-gray-800" id="stat-copies">...</div></div>
                            </div>
                            <div class="glass-panel p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center">
                                <div class="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl mr-4">📅</div>
                                <div><div class="text-xs text-gray-500 font-bold uppercase tracking-wider">运行天数</div><div class="text-2xl font-bold text-gray-800">${Math.floor((Date.now() - new Date('2025-01-01').getTime()) / 86400000)}天</div></div>
                            </div>
                            <div class="glass-panel p-6 rounded-3xl border border-yellow-100 shadow-sm flex items-center">
                                <div class="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl mr-4">✨</div>
                                <div><div class="text-xs text-gray-500 font-bold uppercase tracking-wider">版本信息</div><div class="text-2xl font-bold text-gray-800">Pro V2</div></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="glass-panel p-6 rounded-3xl"><div class="text-gray-500 text-xs font-bold uppercase tracking-wider">当前账号总数</div><div class="text-4xl font-extrabold text-gray-800 mt-2">${cachedData.accounts.length} <span class="text-base text-gray-400 font-normal">个</span></div></div>
                            <div class="glass-panel p-6 rounded-3xl"><div class="text-gray-500 text-xs font-bold uppercase tracking-wider">累计服务次数</div><div class="text-4xl font-extrabold text-pink-500 mt-2">${db.settings.totalCopyCount}</div></div>
                            <div class="glass-panel p-6 rounded-3xl"><div class="text-gray-500 text-xs font-bold uppercase tracking-wider">数据源数量</div><div class="text-4xl font-extrabold text-blue-500 mt-2">${db.sources.length} <span class="text-base text-gray-400 font-normal">APIs</span></div></div>
                        </div>
                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center"><span class="mr-2">⚙️</span> 基础设置</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">手动修改累计次数</label><input type="number" name="total_copy" value="${db.settings.totalCopyCount}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:ring-2 focus:ring-pink-300"></div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">Worker 祝福语 API</label><input type="text" name="worker_url" value="${db.settings.workerUrl || ''}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="https://..."></div>
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">主题颜色</label>
                                        <select name="site_theme" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700">
                                            <option value="newYear" ${db.settings.theme === 'newYear' ? 'selected' : ''}>🧧 新春贺岁</option>
                                            <option value="ocean" ${db.settings.theme === 'ocean' ? 'selected' : ''}>🌊 深海极光</option>
                                            <option value="forest" ${db.settings.theme === 'forest' ? 'selected' : ''}>🍃 森之物语</option>
                                            <option value="cyber" ${db.settings.theme === 'cyber' ? 'selected' : ''}>🔮 赛博霓虹</option>
                                            <option value="custom" ${db.settings.theme === 'custom' ? 'selected' : ''}>🎨 自定义主题</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="section-keys" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8 mb-6">
                            <h3 class="text-lg font-bold text-violet-600 mb-4">✨ 生成新卡密 (一次性显示)</h3>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div><label class="block text-xs font-bold text-gray-500 mb-1">类型</label><select id="gen_type" class="w-full p-3 rounded-xl border border-gray-200"><option value="count">按次数限制</option><option value="time">按时间限制(天)</option></select></div>
                                <div><label class="block text-xs font-bold text-gray-500 mb-1">值 (次数或天数)</label><input type="number" id="gen_val" class="w-full p-3 rounded-xl border border-gray-200" value="10"></div>
                                <div><label class="block text-xs font-bold text-gray-500 mb-1">生成数量</label><input type="number" id="gen_amount" class="w-full p-3 rounded-xl border border-gray-200" value="1"></div>
                                <div><button type="button" onclick="generateKeys()" class="w-full bg-violet-500 text-white font-bold p-3 rounded-xl hover:bg-violet-600 transition">⚡ 生成并显示</button></div>
                            </div>
                        </div>
                        <div class="glass-panel rounded-3xl p-8">
                            <div class="flex justify-between items-center mb-6"><h3 class="text-lg font-bold text-gray-800">卡密列表 (哈希存储)</h3><button type="button" onclick="loadKeys()" class="text-sm text-blue-500 hover:text-blue-700">🔄 刷新列表</button></div>
                            <div class="overflow-x-auto"><table class="w-full text-sm text-left"><thead class="bg-gray-100 text-gray-600 uppercase"><tr><th class="p-4 rounded-l-xl">ID</th><th class="p-4">卡密 (Key)</th><th class="p-4">类型</th><th class="p-4">状态/限制</th><th class="p-4">创建时间</th><th class="p-4 rounded-r-xl">操作</th></tr></thead><tbody id="keys-table-body" class="divide-y divide-gray-100"></tbody></table></div>
                        </div>
                    </div>

                    <div id="section-design" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-pink-600 mb-6 flex items-center"><span class="mr-2">🌐</span> SEO 与 基础信息</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">网站标题 (Title)</label><input type="text" name="cfg_title" value="${cfg.title}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="例如：Apple 账号免费共享"></div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">SEO 关键词 (Keywords)</label><input type="text" name="cfg_keywords" value="${cfg.keywords}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="多个关键词用逗号分隔"></div>
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">SEO 描述 (Description)</label><input type="text" name="cfg_description" value="${cfg.description}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                </div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-purple-600 mb-6 flex items-center"><span class="mr-2">🖼️</span> 背景与视觉</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">电脑端背景图 URL</label><input type="text" name="cfg_bg_desktop" value="${cfg.bg_desktop}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="https://..."></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">手机端背景图 URL (留空则同电脑)</label><input type="text" name="cfg_bg_mobile" value="${cfg.bg_mobile}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="https://..."></div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <input type="checkbox" name="cfg_snow" value="1" ${cfg.snow_enabled ? 'checked' : ''} class="w-5 h-5 text-pink-600 rounded focus:ring-pink-500">
                                        <span class="text-gray-700 font-bold">开启雪花/花瓣飘落特效</span>
                                    </div>
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">背景音乐 MP3 链接</label><input type="text" name="cfg_music" value="${cfg.music_url}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="https://.../song.mp3 (留空关闭)"></div>
                                </div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-orange-500 mb-6 flex items-center"><span class="mr-2">📢</span> 公告与通知</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">顶部滚动公告文字 (跑马灯)</label><input type="text" name="cfg_notice_banner" value="${cfg.notice_banner}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">弹窗公告内容 (支持 HTML, 留空不显示)</label><textarea name="cfg_notice_popup" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="<p style='color:red'>这里写公告...</p>">${cfg.notice_popup}</textarea></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">弹窗显示频率</label>
                                    <select name="cfg_notice_popup_mode" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700">
                                        <option value="once_per_day" ${cfg.notice_popup_mode === 'once_per_day' ? 'selected' : ''}>一天只弹出一次</option>
                                        <option value="custom_minutes" ${cfg.notice_popup_mode === 'custom_minutes' ? 'selected' : ''}>自定义多少分钟弹出一次</option>
                                        <option value="every_visit" ${cfg.notice_popup_mode === 'every_visit' ? 'selected' : ''}>每次访问都弹出</option>
                                    </select>
                                </div>
                                <div id="customMinutesWrapper" style="display: ${cfg.notice_popup_mode === 'custom_minutes' ? 'block' : 'none'};">
                                    <label class="block text-sm font-bold text-gray-500 mb-2">自定义分钟数 (多少分钟后再次弹出)</label>
                                    <input type="number" name="cfg_notice_popup_minutes" value="${cfg.notice_popup_minutes || 30}" min="1" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="30">
                                </div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-indigo-500 mb-6 flex items-center"><span class="mr-2">🎨</span> 自定义主题文件</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-gray-500 mb-2">上传主题文件 (.css 或 .txt)</label>
                                    <div class="flex items-center gap-4">
                                        <input type="file" id="themeFile" accept=".css,.txt" class="hidden" onchange="uploadThemeFile(this)">
                                        <button type="button" onclick="document.getElementById('themeFile').click()" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                                            <span>📤</span> 选择并上传文件
                                        </button>
                                        <span id="uploadStatus" class="text-xs text-gray-400">支持 .css 或 .txt 文件内容读取</span>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-500 mb-2">自定义主题内容 (CSS)</label>
                                    <textarea name="cfg_custom_css" id="customCssArea" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此输入自定义 CSS 代码或通过上方上传文件读取内容...">${cfg.custom_theme_css || ''}</textarea>
                                    <p class="text-xs text-gray-400 mt-2">提示：选择"自定义主题"模式后，此处填写的 CSS 将会被应用到前台。</p>
                                </div>
                            </div>
                        </div>
                        <script>
                            function uploadThemeFile(input) {
                                const file = input.files[0];
                                if (!file) return;
                                
                                const reader = new FileReader();
                                const status = document.getElementById('uploadStatus');
                                status.innerText = '正在读取文件: ' + file.name + '...';
                                
                                reader.onload = function(e) {
                                    const content = e.target.result;
                                    document.getElementById('customCssArea').value = content;
                                    status.innerText = '✅ ' + file.name + ' 内容已成功加载到下方文本框';
                                    status.classList.add('text-green-500');
                                    setTimeout(() => status.classList.remove('text-green-500'), 3000);
                                };
                                
                                reader.onerror = function() {
                                    status.innerText = '❌ 文件读取失败';
                                    status.classList.add('text-red-500');
                                };
                                
                                reader.readAsText(file);
                            }
                        </script>
                        <script>
                            document.addEventListener('DOMContentLoaded', function() {
                                const modeSelect = document.querySelector('select[name="cfg_notice_popup_mode"]');
                                const minutesWrapper = document.getElementById('customMinutesWrapper');
                                if (modeSelect && minutesWrapper) {
                                    modeSelect.addEventListener('change', function() {
                                        minutesWrapper.style.display = this.value === 'custom_minutes' ? 'block' : 'none';
                                    });
                                }
                            });
                        </script>

                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-red-500 mb-6 flex items-center"><span class="mr-2">⚠️</span> 声明文字配置</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">公益声明文字</label><input type="text" name="cfg_disclaimer_public" value="${cfg.disclaimer_public || '公益声明：本站为非营利性平台，仅供临时下载使用，严禁倒卖商用！'}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="公益声明：本站为非营利性平台..."></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">主标题文字</label><input type="text" name="cfg_disclaimer_title" value="${cfg.disclaimer_title || '严禁在手机【设置/iCloud】中登录！'}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="严禁在手机【设置/iCloud】中登录！"></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">警告提示文字</label><input type="text" name="cfg_disclaimer_warning" value="${cfg.disclaimer_warning || '⚠️ 仅限 App Store 使用！'}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="⚠️ 仅限 App Store 使用！"></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">详细说明文字</label><textarea name="cfg_disclaimer_detail" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="擅自在设置登录可能导致手机被锁死无法退出...">${cfg.disclaimer_detail || '擅自在设置登录可能导致手机被锁死无法退出。由此产生的一切后果，本站概不负责！'}</textarea></div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-yellow-500 mb-6 flex items-center"><span class="mr-2">💎</span> 功能开关</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <input type="checkbox" name="cfg_sponsor_enabled" value="1" ${cfg.sponsor_enabled !== false ? 'checked' : ''} class="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500">
                                    <span class="text-gray-700 font-bold">开启打赏功能（显示打赏按钮）</span>
                                </div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-blue-500 mb-6 flex items-center"><span class="mr-2">💻</span> 高级代码注入</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">Head 区域代码 (CSS/统计)</label><textarea name="cfg_custom_head" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="<script>...</script>">${cfg.custom_head}</textarea></div>
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">Body 底部代码 (JS/广告)</label><textarea name="cfg_custom_body" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700" placeholder="<script>...</script>">${cfg.custom_body}</textarea></div>
                            </div>
                        </div>
                    </div>

                    <div id="section-fixed" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8">
                            <div class="flex justify-between items-center mb-6"><div><h3 class="text-lg font-bold text-pink-600 flex items-center"><span class="mr-2">📌</span> 固定账号列表</h3><p class="text-xs text-gray-400 mt-1">这里的账号永远不会消失哦~</p></div><button type="button" onclick="addFixedRow()" class="bg-pink-100 hover:bg-pink-200 text-pink-600 px-5 py-2 rounded-xl text-sm font-bold transition flex items-center">+ 新增账号</button></div>
                            <div id="fixed-container">${fixedAccountRows}</div>
                        </div>
                    </div>

                    <div id="section-sources" class="content-section space-y-6">
                         <div class="glass-panel rounded-3xl p-8">
                            <div class="flex justify-between items-center mb-6"><div><h3 class="text-lg font-bold text-blue-500 flex items-center"><span class="mr-2">🌐</span> 抓取数据源</h3><p class="text-xs text-gray-400 mt-1">配置上游 API，系统会勤劳地搬运数据。</p></div><button type="button" onclick="addSourceRow()" class="bg-blue-100 hover:bg-blue-200 text-blue-600 px-5 py-2 rounded-xl text-sm font-bold transition flex items-center">+ 新增源</button></div>
                            <div id="source-container">${sourceRows}</div>
                        </div>
                    </div>

                    <div id="section-payment" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center"><span class="mr-2">💳</span> 易支付 (Yipay) 配置</h3>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">API 接口地址</label><input type="text" name="pay_api" value="${db.settings.yipay.api_url}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">商户 ID (PID)</label><input type="text" name="pay_pid" value="${db.settings.yipay.pid}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">商户密钥 (Key)</label><input type="text" name="pay_key" value="${db.settings.yipay.key}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">异步通知 URL</label><input type="text" name="pay_notify" value="${db.settings.yipay.notify_url}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                    <div><label class="block text-sm font-bold text-gray-500 mb-2">跳转返回 URL</label><input type="text" name="pay_return" value="${db.settings.yipay.return_url}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="section-security" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8 mb-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-bold text-violet-500">Cloudflare Turnstile</h3>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="turn_enabled" value="1" ${db.settings?.turnstile?.enabled ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-violet-600"></div>
                                    <span class="ml-3 text-sm font-medium text-gray-600">启用该方式</span>
                                </label>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Site Key</label><input type="text" name="turn_site" value="${db.settings?.turnstile?.SITE_KEY || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Secret Key</label><input type="text" name="turn_secret" value="${db.settings?.turnstile?.SECRET_KEY || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8 mb-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-bold text-violet-500">hCaptcha</h3>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="hcap_enabled" value="1" ${db.settings?.hcaptcha?.enabled ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-violet-600"></div>
                                    <span class="ml-3 text-sm font-medium text-gray-600">启用该方式</span>
                                </label>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Site Key</label><input type="text" name="hcap_site" value="${db.settings?.hcaptcha?.SITE_KEY || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Secret Key</label><input type="text" name="hcap_secret" value="${db.settings?.hcaptcha?.SECRET_KEY || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8 mb-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-bold text-violet-500">Geetest 极验 4.0</h3>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="gee_enabled" value="1" ${db.settings?.geetest?.enabled ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-violet-600"></div>
                                    <span class="ml-3 text-sm font-medium text-gray-600">启用该方式</span>
                                </label>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Captcha ID</label><input type="text" name="gee_id" value="${db.settings?.geetest?.CAPTCHA_ID || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Captcha Key</label><input type="text" name="gee_key" value="${db.settings?.geetest?.CAPTCHA_KEY || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-bold text-blue-500">Linux.do 登录配置</h3>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="linuxdo_enabled" value="1" ${db.settings?.linuxdo?.enabled ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span class="ml-3 text-sm font-medium text-gray-600">启用该方式</span>
                                </label>
                            </div>
                            <div class="grid grid-cols-1 gap-6">
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Client ID</label><input type="text" name="linuxdo_id" value="${db.settings?.linuxdo?.CLIENT_ID || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Client Secret</label><input type="text" name="linuxdo_secret" value="${db.settings?.linuxdo?.CLIENT_SECRET || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">Redirect URI</label><input type="text" name="linuxdo_uri" value="${db.settings?.linuxdo?.REDIRECT_URI || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                            </div>
                        </div>

                        <div class="glass-panel rounded-3xl p-8 mt-6">
                            <h3 class="text-lg font-bold text-green-500 mb-6 flex items-center"><span class="mr-2">📧</span> 邮件服务配置 (SMTP)</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label class="text-gray-400 text-xs uppercase font-bold">SMTP 服务器</label><input type="text" name="mail_host" value="${db.settings?.email?.host || ''}" placeholder="例如: smtp.qq.com" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">端口</label><input type="number" name="mail_port" value="${db.settings?.email?.port || 465}" placeholder="例如: 465 或 587" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div><label class="text-gray-400 text-xs uppercase font-bold">登录账户 (邮箱)</label><input type="text" name="mail_user" value="${db.settings?.email?.user || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                                <div><label class="text-gray-400 text-xs uppercase font-bold">登录密码 (或授权码)</label><input type="password" name="mail_pass" value="${db.settings?.email?.pass || ''}" class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700"></div>
                            </div>
                            <div class="mt-6 flex items-center">
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="mail_secure" value="1" ${db.settings?.email?.secure ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-green-600"></div>
                                    <span class="ml-3 text-sm font-medium text-gray-600">使用 SSL/TLS (通常 465 端口需开启)</span>
                                </label>
                            </div>
                            <p class="text-xs text-gray-400 mt-4 italic">* 提示：如果是 QQ 邮箱，SMTP 服务器留空将自动使用 service 模式发送。修改后请点击下方保存并测试。</p>
                        </div>
                    </div>

                    <div id="section-ads" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8">
                            <h3 class="text-lg font-bold text-orange-500 mb-6 flex items-center"><span class="mr-2">📢</span> 广告管理 (Ad Management)</h3>
                            <p class="text-xs text-gray-400 mb-6">在此配置各主流广告平台的对接代码，代码将被注入到前台页面的适当位置。</p>
                            
                            <div class="grid grid-cols-1 gap-8">
                                <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <img src="https://www.google.com/favicon.ico" class="w-4 h-4 mr-2"> 谷歌广告 (Google AdSense)
                                    </label>
                                    <textarea name="cfg_google_ads" class="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此粘贴 Google AdSense 代码...">${cfg.google_ads_html || ''}</textarea>
                                </div>

                                <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <span class="mr-2">Ⓜ️</span> Media.net (Yahoo! Bing)
                                    </label>
                                    <textarea name="cfg_ads_medianet" class="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此粘贴 Media.net 广告代码...">${cfg.ads_medianet_html || ''}</textarea>
                                </div>

                                <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <span class="mr-2">🌟</span> Adsterra
                                    </label>
                                    <textarea name="cfg_ads_adsterra" class="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此粘贴 Adsterra 代码...">${cfg.ads_adsterra_html || ''}</textarea>
                                </div>

                                <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <span class="mr-2">🅰️</span> A-Ads (Anonymous Ads)
                                    </label>
                                    <textarea name="cfg_ads_aads" class="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此粘贴 A-Ads 代码...">${cfg.ads_aads_html || ''}</textarea>
                                </div>

                                <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <span class="mr-2">💥</span> PopAds
                                    </label>
                                    <textarea name="cfg_ads_popads" class="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此粘贴 PopAds 代码...">${cfg.ads_popads_html || ''}</textarea>
                                </div>

                                <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <span class="mr-2">🛠️</span> 自定义广告/统计代码
                                    </label>
                                    <textarea name="cfg_ads_custom" class="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-mono text-xs" placeholder="在此粘贴任何其他广告平台或统计分析代码...">${cfg.ads_custom_html || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="section-admin" class="content-section space-y-6">
                        <div class="glass-panel rounded-3xl p-8 max-w-2xl">
                            <h3 class="text-lg font-bold text-yellow-500 mb-6 flex items-center">
                                <span class="mr-2">👤</span> 管理员账号设置
                            </h3>
                            <div class="space-y-6">
                                <div><label class="block text-sm font-bold text-gray-500 mb-2">后台用户名</label><input type="text" name="admin_user" value="${db.admin.user}" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:ring-2 focus:ring-yellow-400 transition"></div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-500 mb-2">后台密码 (留空则不修改)</label>
                                    <input type="password" name="admin_pass" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:ring-2 focus:ring-yellow-400 transition" placeholder="输入新密码以修改...">
                                    <p class="text-xs text-gray-400 mt-1">* 密码将以 SHA-256 哈希值安全存储</p>
                                </div>
                                
                                <div class="pt-6 border-t border-gray-100">
                                    <label class="block text-sm font-bold text-gray-500 mb-4">Linux.do 快捷登录绑定</label>
                                    ${db.admin.linuxdo_id ? `
                                        <div class="flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                            <div class="flex items-center gap-3">
                                                <span class="text-2xl">✅</span>
                                                <div>
                                                    <div class="text-blue-800 font-bold text-sm">已绑定 Linux.do</div>
                                                    <div class="text-blue-600 text-xs mt-0.5">ID: ${db.admin.linuxdo_username || db.admin.linuxdo_id}</div>
                                                </div>
                                            </div>
                                            <a href="/admin/auth/linuxdo/unbind" onclick="return confirm('确定要解除绑定吗？解除后将无法使用 Linux.do 快捷登录。')" class="bg-white hover:bg-rose-50 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold border border-rose-100 transition shadow-sm">解除绑定</a>
                                        </div>
                                    ` : `
                                        <a href="/admin/auth/linuxdo" class="flex items-center justify-center gap-3 bg-[#222] hover:bg-black text-white py-3.5 rounded-2xl font-bold transition duration-300 shadow-md">
                                            <span class="text-xl">🐧</span>
                                            <span>绑定 Linux.do 账号</span>
                                        </a>
                                        <p class="text-xs text-gray-400 mt-3 text-center">绑定后，您可以使用 Linux.do 账号一键登录管理后台</p>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </main>
        <script>
            async function loadStats() {
                try {
                    const res = await fetch('/admin/api/stats');
                    const data = await res.json();
                    if(document.getElementById('stat-users')) document.getElementById('stat-users').textContent = data.userCount || 0;
                    if(document.getElementById('stat-copies')) document.getElementById('stat-copies').textContent = data.copyCount || 0;
                } catch (e) {}
            }

            if(window.location.pathname.includes('/admin/dashboard')) {
                setInterval(loadStats, 5000);
                setTimeout(loadStats, 500);
            }

            function toggleCategory(header) {
                const items = header.nextElementSibling;
                if (!items) return;
                const isOpen = header.classList.toggle('open');
                if (isOpen) {
                    items.classList.add('open');
                } else {
                    items.classList.remove('open');
                }
            }

            function switchTab(tabId) {
                try {
                    const navEl = document.getElementById('nav-' + tabId);
                    const sectionEl = document.getElementById('section-' + tabId);
                    
                    if (!navEl || !sectionEl) {
                        console.error('Tab or section not found:', tabId);
                        return;
                    }

                    // 激活并展开父分类
                    const categoryItems = navEl.closest('.category-items');
                    if (categoryItems) {
                        const header = categoryItems.previousElementSibling;
                        if (header) {
                            categoryItems.classList.add('open');
                            header.classList.add('open');
                            
                            // 高亮当前分类
                            document.querySelectorAll('.category-header').forEach(h => h.classList.remove('active'));
                            header.classList.add('active');
                        }
                    }

                    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                    navEl.classList.add('active');
                    
                    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
                    sectionEl.classList.add('active');
                    
                    const titles = { 
                        'dashboard': '📊 概览与基础', 
                        'design': '🎨 个性化装修', 
                        'fixed': '📌 固定账号管理', 
                        'sources': '🌐 数据源配置', 
                        'payment': '💳 支付接口配置', 
                        'security': '🛡️ 安全验证配置', 
                        'admin': '👤 管理员设置', 
                        'keys': '🔑 卡密管理',
                        'ads': '📢 广告管理集成'
                    };
                    document.getElementById('page-title').innerText = titles[tabId] || '控制台';
                    
                    const currentTabInput = document.getElementById('currentTabInput');
                    if (currentTabInput) currentTabInput.value = tabId;

                    if(tabId === 'keys') loadKeys().catch(console.error);
                } catch (e) {
                    console.error('switchTab error:', e);
                }
            }
            
            // 页面加载时恢复标签
            (function() {
                const urlParams = new URLSearchParams(window.location.search);
                const savedTab = urlParams.get('tab') || 'dashboard';
                const saved = urlParams.get('saved');
                
                if (savedTab) {
                    setTimeout(() => switchTab(savedTab), 100);
                }
                
                if (saved === '1') {
                    setTimeout(() => {
                        if (typeof showGlobalToast === 'function') {
                            showGlobalToast("✅ 配置保存成功！");
                        }
                        const newUrl = window.location.pathname + (savedTab && savedTab !== 'dashboard' ? '?tab=' + savedTab : '');
                        window.history.replaceState({}, document.title, newUrl);
                    }, 200);
                }
            })();

            function addFixedRow() {
                const container = document.getElementById('fixed-container');
                if (!container) return;
                const div = document.createElement('div');
                div.className = "grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 p-4 bg-white/50 rounded-2xl border border-pink-100 items-center hover:bg-white/80 transition-colors shadow-sm animate-[slideIn_0.3s_ease-out]";
                const regionOptions = '<option value="🇨🇳 中国">🇨🇳 中国</option><option value="🇺🇸 美国">🇺🇸 美国</option><option value="🇯🇵 日本">🇯🇵 日本</option><option value="🇰🇷 韩国">🇰🇷 韩国</option><option value="🇭🇰 香港">🇭🇰 香港</option><option value="🇹🇼 台湾">🇹🇼 台湾</option><option value="🇬🇧 英国">🇬🇧 英国</option><option value="🇦🇺 澳洲">🇦🇺 澳洲</option><option value="🇨🇦 加拿大">🇨🇦 加拿大</option><option value="🌍 全球/其他">🌍 全球/其他</option><option value="🚀 固定/SVIP">🚀 固定/SVIP</option>';
                div.innerHTML = \`<div class="md:col-span-3"><input type="text" name="fixed_user[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none" placeholder="账号"></div><div class="md:col-span-3"><input type="text" name="fixed_pass[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none" placeholder="密码"></div><div class="md:col-span-2"><select name="fixed_region[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none cursor-pointer">\${regionOptions}</select></div><div class="md:col-span-2"><input type="text" name="fixed_remark[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none" placeholder="备注"></div><div class="md:col-span-1"><select name="fixed_status[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none"><option value="1">正常</option><option value="0">异常</option></select></div><div class="md:col-span-1 text-center"><button type="button" onclick="this.closest('.grid').remove()" class="text-rose-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition">🗑️</button></div>\`;
                container.appendChild(div);
            }

            function addSourceRow() {
                const container = document.getElementById('source-container');
                if (!container) return;
                const div = document.createElement('div');
                div.className = "grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 p-4 bg-white/50 rounded-2xl border border-blue-100 items-center hover:bg-white/80 transition-colors shadow-sm animate-[slideIn_0.3s_ease-out]";
                div.innerHTML = \`<div class="md:col-span-3"><input type="text" name="src_name[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-blue-100 focus:border-blue-400 focus:outline-none" placeholder="名称"></div><div class="md:col-span-7"><input type="text" name="src_url[]" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-blue-100 focus:border-blue-400 focus:outline-none" placeholder="API 地址"></div><div class="md:col-span-1"><input type="number" name="src_count[]" value="1" class="w-full bg-white/60 text-gray-700 px-3 py-2 rounded-xl border border-blue-100 focus:border-blue-400 focus:outline-none text-center" placeholder="次数"></div><div class="md:col-span-1 text-center"><button type="button" onclick="this.closest('.grid').remove()" class="text-rose-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition">🗑️</button></div>\`;
                container.appendChild(div);
            }

            async function loadKeys() {
                try {
                    const res = await fetch('/admin/api/keys');
                    const data = await res.json();
                    if (!Array.isArray(data)) return;
                    const tbody = document.getElementById('keys-table-body');
                    if (!tbody) return;
                    
                    tbody.innerHTML = data.map(k => {
                        const limitText = k.type==='time' ? (new Date(k.expire_at).toLocaleDateString()+' 到期') : (k.current_usage + ' / ' + k.val_limit + ' 次');
                        const btnClass = k.is_banned ? 'text-green-500' : 'text-orange-500';
                        const btnText = k.is_banned ? '解封' : '封禁';
                        const banAction = 'banKey(' + k.id + ', ' + (k.is_banned ? 0 : 1) + ')';
                        return '<tr class="border-b border-gray-100 hover:bg-violet-50 transition"><td class="p-4">' + k.id + '</td><td class="p-4 font-mono font-bold text-violet-600">' + k.code_display + '</td><td class="p-4">' + (k.type==='count'?'按次数':'按天数') + '</td><td class="p-4">' + k.status_text + '<div class="text-xs text-gray-400 mt-1">' + limitText + '</div></td><td class="p-4 text-xs text-gray-500">' + new Date(k.created_at).toLocaleString() + '</td><td class="p-4 space-x-2"><button onclick="' + banAction + '" class="' + btnClass + ' hover:underline">' + btnText + '</button><button onclick="viewLogs(' + k.id + ')" class="text-blue-500 hover:underline">日志</button><button onclick="delKey(' + k.id + ')" class="text-red-500 hover:underline">删</button></td></tr>';
                    }).join('');
                } catch (e) { console.error('loadKeys error:', e); }
            }

            async function generateKeys() {
                const type = document.getElementById('gen_type').value;
                const val = document.getElementById('gen_val').value;
                const amount = document.getElementById('gen_amount').value;
                const res = await fetch('/admin/api/keys/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type, value:val, amount}) });
                const d = await res.json();
                if(d.success) { 
                    showGlobalToast('✅ 生成成功！卡密已添加到列表。'); 
                    loadKeys(); 
                } else { showGlobalToast('❌ 失败:' + d.msg, true); }
            }

            async function banKey(id, is_banned) {
                await fetch('/admin/api/keys/ban', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, is_banned}) });
                loadKeys();
            }

            async function delKey(id) {
                if(!confirm('确定删除?')) return;
                await fetch('/admin/api/keys/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) });
                loadKeys();
            }

            async function viewLogs(id) {
                const res = await fetch('/admin/api/logs/'+id);
                const logs = await res.json();
                const msg = logs.length ? logs.map(l => new Date(l.used_at).toLocaleString() + ' | IP: ' + l.ip_address).join('\\n') : '暂无日志';
                Swal.fire({
                    title: '使用记录',
                    text: msg,
                    confirmButtonText: '确定',
                    confirmButtonColor: '#db2777',
                    customClass: { popup: 'rounded-3xl' }
                });
            }

            function showGlobalToast(message, isError = false) {
                const old = document.querySelector('.my-toast');
                if(old) old.remove();
                const toast = document.createElement('div');
                toast.className = 'my-toast';
                const successIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" stroke-width="2.5" stroke="#fbbf24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';
                const errorIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" stroke-width="2" stroke="#ef4444"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>';
                toast.innerHTML = (isError ? errorIcon : successIcon) + '<span>' + message + '</span>';
                document.body.appendChild(toast);
                setTimeout(() => toast.classList.add('active'), 10);
                setTimeout(() => { 
                    toast.classList.remove('active'); 
                    setTimeout(() => toast.remove(), 500); 
                }, 2000);
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = {
    getLoginHtml,
    getDashboardHtml
};
