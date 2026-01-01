# 🍎 2026 Apple 账号全球共享系统 (Pro Max 版)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.x-green.svg)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

这是一款基于 **全栈 JavaScript** 开发的 Apple ID 账号自动化分享与管理系统。项目集成了强大的自动化抓取、完善的用户体系以及金融级的安全配置，专为公益分享及账号分发场景量身打造。

---

## ✨ 核心特性

- **🚀 全栈 JS 架构**：后端 Node.js + Express，前端 Tailwind CSS，代码逻辑清晰，极致轻量。
- **📊 智能数据中心**：
    - 支持无限个上游 API 数据源配置，定时自动同步。
    - 后台实时显示用户数、今日复制、历史趋势图表。
- **👤 完善用户体系**：
    - 支持邮箱验证码注册/登录。
    - 深度集成 **Linux.do 快捷登录**。
    - 登录用户可查看领号历史记录。
- **🛡️ 安全与风控**：
    - 敏感数据（密码、邮箱、ID）全量 **SHA-256 哈希加密**。
    - 内置 Turnstile、hCaptcha、极验 4.0 三重人机验证。
- **🎨 极致视觉定制**：
    - 内置 2026 新春版视觉主题。
    - 支持在后台直接编写自定义 CSS 及注入 Head/Body 代码。
- **📢 商业化集成**：
    - 预置 5+ 主流广告位（Google AdSense, Media.net 等）。
    - 支持易支付（Yipay）配置，满足打赏场景。

---

## 🛠️ 技术栈

- **后端**: Node.js, Express, MySQL
- **前端**: JavaScript (ES6+), Tailwind CSS, SweetAlert2
- **认证**: OAuth 2.0 (Linux.do)
- **邮件**: Nodemailer

---

## 🚀 快速部署

请参考详细的部署文档：[部署教程 (DEPLOY.md)](./DEPLOY.md)

1. **环境准备**: 安装 Node.js (v16+) 和 MySQL。
2. **源码下载**: 克隆或下载本项目到服务器。
3. **数据库配置**: 修改 `core/config.js` 中的 `dbConfig` 连接信息。
4. **启动程序**: 运行 `npm install` 后，使用 `pm2 start server.js` 启动。
5. **进入后台**: 访问 `/admin`（默认账号 `admin/123456`）完善后续配置。

---

## 📝 API 规范

如果您需要为本系统提供账号源 API，请遵循以下返回格式：

```json
{
  "accounts": [
    {
      "username": "apple-id@example.com",
      "password": "Password123",
      "status": 1, 
      "region_display": "🇺🇸 美国",
      "frontend_remark": "站长推荐"
    }
  ]
}
```

---

---

## ⚖️ 免责声明

本系统仅供技术交流与研究使用，严禁用于任何商业牟利行为。因使用本系统产生的任何纠纷，项目作者概不负责。

**如果您觉得项目不错，请给个 Star ⭐！**

