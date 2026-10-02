# 将 kanbox.io 绑定到 GitHub Pages

当前先使用 https://sexyfeifan.github.io/kanbox-site/ 。仓库名称可保持 `kanbox-site`，只有希望使用用户站点根地址 `sexyfeifan.github.io` 时才需要 `<用户名>.github.io` 专用仓库。独立域名不要求这种名称。

域名技术上可绑定，但这份文档不代表 `kanbox.io` 仍可注册或已归你所有；需先在注册商查询并购买。域名注册费用由注册商决定，GitHub Pages 不提供域名注册。

## 购买后操作

1. 在 GitHub 个人 Settings → Pages 添加并验证 `kanbox.io`。按 GitHub 当前显示的内容，在注册商 DNS 中添加 TXT 记录；验证值与账号相关，不能预先猜测。
2. 在本仓库 Settings → Pages → Custom domain 填入 `kanbox.io` 并保存。先在 GitHub 关联域名，再添加下面的解析记录。
3. 在域名 DNS 添加四条根域 A 记录和一条 `www` CNAME：

| 类型 | 主机记录 | 值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | sexyfeifan.github.io |

`www` 的 CNAME 不包含 `https://` 或 `/kanbox-site/`。处理根域已有的冲突记录，不添加通配符。主机记录格式以你的注册商界面为准。

4. 等待 GitHub 的 DNS 检查与证书签发，勾选 Enforce HTTPS。DNS 生效及 HTTPS 可用可能需要最多 24 小时。
5. 在 Actions → Publish Kanbox website → Run workflow 重新运行。构建会读取新域名，更新 canonical、sitemap 和 robots。此项目使用自定义 GitHub Actions 部署，不需要手动添加 CNAME 文件；域名以 Pages 设置为准。
6. 检查 `https://kanbox.io/`、`https://www.kanbox.io/`、隐私页、手机布局与安装咨询链接。检查原 GitHub Pages 地址的跳转。

## 官方资料

- 域名与 DNS：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- 验证域名：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
