<img src="public/assets/logo.png" width="64" height="64" alt="">

# Hhuua 的自习室

一个中文互动学习网站。你可以跟着一家小店学习服务器架构，用熟悉的 Python 对照 Rust，在浏览器里写 Go 程序，也可以动手探索语言模型或练习公文写作。五门课程独立成篇，可以直接从感兴趣的专题开始。

**[进入自习室](https://blog.hhuua.xyz/)** · [阅读架构讲义](https://blog.hhuua.xyz/architecture/blog/) · [反馈问题](https://github.com/hhuua123/hhuua-study/issues)

## 项目简介

自习室把抽象概念放进可以操作的例子里。比如，打开架构课的第一阶段，调高每秒请求数，就能逐秒看到一台服务器上的任务怎样积压，再调低流量，观察队列何时消退。学到后面的阶段，还可以沿着一次请求查看缓存、数据库和容器各自承担的工作。

编程课程则把讲解、编辑器和练习放在同一页。Rust 课面向已有 Python 经验的读者，Go 课从第一行程序开始。点击在线运行时，练习代码会提交到对应语言的官方 Playground 执行。

## 课程目录

| 专题 | 你会做什么 |
| --- | --- |
| [架构生长实验室](https://blog.hhuua.xyz/architecture/) | 跟着虚构的「青屿小店」走过 15 个阶段，从单机到 Kubernetes。追踪一次请求，调整部署配置，比较每次改造的收益和月费用。 |
| [锈岛求生](https://blog.hhuua.xyz/rust/) | 从 Python 过渡到 Rust，用猜数字游戏练习输入与控制流，在项目里理解所有权、借用和错误处理，最后可以挑战用标准库编写 Web 服务器。 |
| [Go 训练场](https://blog.hhuua.xyz/go/) | 通过 24 关、150 道练习，从函数和文件读写走到测试与并发。动手做词频统计器、JSON 学生库和并发流水线。 |
| [炼丹修行录](https://blog.hhuua.xyz/alchemy/) | 从单个神经元出发，亲手切分词元、查看注意力如何分配，再调节采样温度，观察模型选择下一个词元的方式。 |
| [文电训练营](https://blog.hhuua.xyz/gongwen/) | 在 13 章实训中使用 DeepSeek DSH，练习通知、请示、会议纪要等六类公文，从整理写作要素到逐句审校成稿。 |

## 本地运行

准备好 Git 和 Python 3，在终端执行以下命令。站点使用原生 HTML、CSS 和 JavaScript，可直接通过静态文件服务器运行。

```sh
git clone https://github.com/hhuua123/hhuua-study.git
cd hhuua-study
python3 -m http.server 8765 --bind 127.0.0.1 --directory public
```

打开 [本地自习室](http://127.0.0.1:8765/)。修改课程文件后刷新页面即可预览，按 `Ctrl+C` 停止服务。部署到其他服务器时，将 `public/` 设为站点根目录，以保留课程导航和资源路径。

## 项目结构

```text
public/
├── index.html        专题书架首页
├── assets/           站点图标等共用资源
├── architecture/     架构互动课程及可独立阅读的 HTML 讲义
├── rust/             锈岛求生
├── go/               Go 训练场
├── alchemy/          炼丹修行录
└── gongwen/          文电训练营
docs/                 课程设计与讲义编写说明
tools/architecture/   架构讲义导出工具
```

## 参与贡献

发现知识点有误、练习结果异常或页面显示问题，欢迎提交 [Issue](https://github.com/hhuua123/hhuua-study/issues)。请附上课程名和章节链接；如果涉及代码练习，一小段能复现问题的代码、实际输出和预期结果最有帮助。

修改课程时，在 `public/` 下找到对应目录，启动本地站点并走一遍改动涉及的练习，再提交 Pull Request。如果修改了架构讲义源文件，请在项目根目录运行以下命令，并一并提交重新生成的 `public/architecture/blog/` 页面。导出工具使用 Node.js。

```sh
node tools/architecture/export-handbook.cjs
```

架构课程的内容组织与编辑要求见[课程说明](docs/architecture.md)和[讲义编写约定](docs/handbook-editorial.md)。
