# 🍎 Apple 账号共享系统 - 部署详细教程

本教程将引导您从零开始，在 Linux 服务器（推荐 CentOS 7.x 或 Ubuntu 20.04+）上部署本系统。

---

## 🛠️ 一、 环境准备

在开始之前，请确保您的服务器已安装以下软件：

1.  **Node.js**: 建议版本 `v16.x` 或更高。
2.  **MySQL**: 建议版本 `5.7` 或 `8.0`。
3.  **PM2**: 用于进程守护（后台持续运行）。

### 1. 安装 Node.js (以 Ubuntu 为例)
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 安装 PM2
```bash
npm install pm2 -g
```

---

## 📦 二、 获取源码与安装依赖

1.  将源码上传至服务器目录（如 `/www/wwwroot/apple-share`）。
2.  进入项目目录执行：
```bash
npm install
```

---

## 🗄️ 三、 数据库配置

1.  **创建数据库**: 在 MySQL 中创建一个新的数据库（例如命名为 `apple_db`），字符集选择 `utf8mb4`。
2.  **修改配置文件**: 打开 `core/config.js`，修改 `dbConfig` 部分：
```javascript
dbConfig: {
    host: 'localhost',       // 数据库地址
    user: '你的用户名',       // 数据库用户名
    password: '你的密码',     // 数据库密码
    database: 'apple_db',    // 数据库名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}
```
*注：系统启动时会自动创建所需的表结构，您无需手动导入 SQL 文件。*

---

## 🚀 四、 启动项目

### 1. 测试运行
执行以下命令，观察控制台是否有报错：
```bash
node server.js
```
如果看到 `✅ 从 MySQL 数据库加载配置成功` 或 `⚠️ 数据库为空，正在初始化...`，说明连接成功。

### 2. 使用 PM2 后台运行
```bash
pm2 start server.js --name "apple-share"
pm2 save
pm2 startup
```

---

## ⚙️ 五、 完善后台配置 (非常重要)

部署完成后，通过浏览器访问 `http://你的服务器IP:3000/admin` 进入管理后台。

1.  **初始凭据**:
    *   用户名: `admin`
    *   密码: `123456`
    *   *请登录后第一时间在“管理员选项”中修改密码！*

2.  **必填设置项**:
    *   **支付与安全 -> 邮件服务**: 配置 SMTP（发件人、授权码），否则用户无法注册。
    *   **支付与安全 -> 安全验证**: 配置 Turnstile 或 hCaptcha 密钥，开启人机验证防止恶意注册。
    *   **账号设置 -> 数据源配置**: 添加您的 Apple ID 抓取接口。

---

## ❓ 六、 常见问题 (FAQ)

**Q: 为什么页面打不开？**
A: 请检查服务器防火墙是否放行了 `3000` 端口。

**Q: 如何绑定域名？**
A: 建议使用 Nginx 进行反向代理，将 `80/443` 端口请求转发到 `3000` 端口。

**Q: 修改了 `config.js` 里的默认值为什么没生效？**
A: 系统首次启动后，配置会持久化到数据库中。之后的任何修改都必须在 **后台管理页面** 进行，直接改代码里的 `DEFAULT_DB` 是无效的。

**Q: 如何更新程序？**
A: 拉取新代码后执行 `npm install`，然后执行 `pm2 restart apple-share` 即可。

---

## ⚠️ 安全建议

*   **定期备份**: 请定期备份 MySQL 数据库中的 `app_config` 表（存储了您的所有设置）和 `users` 表。
*   **环境变量**: 对于 `ENCRYPTION_SECRET`，建议在 PM2 配置文件或系统变量中设置，不要直接硬编码。

---

祝您的项目运行愉快！如有问题请在社区或 GitHub 提交 Issue。

