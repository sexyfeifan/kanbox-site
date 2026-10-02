# Kanbox 介绍网站

公开网站：https://sexyfeifan.github.io/kanbox-site/

独立静态网站仓库，展示 Kanbox iOS / iPadOS App。网站仓库公开不代表 iOS 工程已开源，也不包含 App 安装包或签名信息。

## 内容与实现

- 炭黑、暖白与梅红配色；首屏、收集、整理、媒体、回顾、隐私、FAQ 与安装说明。
- 独立预计收费标准页：免费版 ¥0、Pro 月度 ¥18、年度 ¥128、永久 ¥198；明确标注拟定价格、购买与限制尚未启用。
- 手机和桌面适配；减少动态效果；键盘可操作的分类标签；原生 FAQ 折叠。
- 使用项目已有 App 引导页截图（2026-10-01 模拟器截图），没有用第三方媒体摄影或封面作为网站宣传素材。其余卡片文字与 CSS 图形为原创示例，明确标注功能示意。
- 页面内三个互动只使用内存状态，不解析用户链接，不持久保存，也不联网提交数据。
- 当前没有公开 App Store / TestFlight 下载入口；安装咨询链接进入本仓库 Issue 创建页面。得到有效公开下载链接后再替换，勿公开包含设备资料的签名安装包。

## 本地预览

无需 npm 安装，Python 3 与 Node.js（仅用于语法检查）即可。

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check site/app.js
python3 -m http.server 4173 --bind 127.0.0.1 --directory _site
```

打开 http://127.0.0.1:4173/ 。页面源文件位于 `site/`；`_site/` 为忽略的构建目录。站内链接使用相对路径，可以在项目子路径或独立域名下工作。

## 发布

仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。

提交至 `main` 后，`.github/workflows/pages.yml` 自动构建、检查并部署。工作流从 `configure-pages` 读取实际网站 URL，自动生成 canonical、sitemap 和 robots；今后绑定域名后重新运行一次部署即可更新这些元数据。

GitHub 官方自定义工作流：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 维护

修改介绍文字：`site/index.html`；配色与排版：`site/styles.css`；互动示例：`site/app.js`；隐私：`site/privacy.html`；拟定收费方案：`site/pricing.html`。App 功能或数据处理变化后，核对并更新网站文字。新增真实截图前检查示例内容与公开使用权。

绑定 `kanbox.io` 无需修改仓库名，详见 [域名配置说明](DOMAIN_SETUP.md)。当前尚未绑定未购买的域名。
