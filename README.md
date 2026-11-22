# Hhuua 的自习室

[打开专题书架](https://blog.hhuua.xyz/)。这是书架首页和五门互动课程的独立源码仓库。网站使用静态 HTML、CSS 和 JavaScript，修改页面后刷新即可预览。

## 本地预览

在项目根目录运行以下命令，然后打开 <http://127.0.0.1:8765/>。

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory public
```

| 课程 | 源码目录 | 站内入口 |
|---|---|---|
| 架构生长实验室 | `public/architecture/` | `/architecture/`，专题讲义位于 `/architecture/blog/` |
| 锈岛求生 | `public/rust/` | `/rust/` |
| 文电训练营 | `public/gongwen/` | `/gongwen/` |
| 炼丹修行录 | `public/alchemy/` | `/alchemy/` |
| Go 训练场 | `public/go/` | `/go/` |

首页位于 `public/index.html`，站点图标位于 `public/assets/`。Rust 和 Go 练习中的在线运行功能需要联网，执行时会向相应语言的官方 Playground 发送代码。

## 维护与发布

修改架构课程后，在项目根目录运行 `node tools/architecture/export-handbook.cjs` 可重新生成静态讲义。课程维护资料位于 [架构课程说明](docs/architecture.md) 和 [讲义编写约定](docs/handbook-editorial.md)。

发布网站时，将 `public/` 的内容部署到域名根路径。首页和课程导航使用以 `/` 开头的链接。源码推送到 GitHub 和更新线上站点是两项独立操作。
