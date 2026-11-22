/* ═══════════════════════════ 锈岛求生 3.0 · 猜数字热身 + 裸写 Web 服务器支线 ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ══════════ 猜数字:圣经 ch2 的传家宝项目 ══════════ */
R.registerChapter({
  key: "guess", order: 13, part: 1, icon: "🎲", title: "热身 · 猜数字",
  eyebrow: "基础岛毕业礼 · 徽章待领:🎲 读心神探",
  bonus: 30,

  html: `
  <p class="lead">通过了基础篇毕业考?先别急着进群岛——<b>官方书第二章的项目</b>在这里等你:猜数字游戏。程序生成 1~100 的随机数,你来猜,它提示「大了/小了」。这是<b>全课唯一一处</b>动真格的键盘输入:程序终于长出耳朵了。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · 猜数字 CLI</h4>
    <p><b>成品:</b>终端里跑的小游戏,键盘输数字,程序回「大了/小了/猜对了」。</p>
    <p><b>难度:</b><span class="stars">★★☆☆☆</span> · <b>规模:</b>~30 行 · <b>环境:</b>本地运行(键盘输入)</p>
    <div class="prereq">
      <span>前置:ch3 函数</span><span>ch4 控制流</span><span>ch9 match</span><span>ch10 Option</span><span>ch11 Result + ?</span>
    </div>
  </div>

  <div class="local-note">💻 官方 Playground 不支持键盘输入——这个项目请<b>本地运行</b>:<code class="ic">cargo new guessing_game &amp;&amp; cd guessing_game</code> → 加依赖(见第一步)→ 贴代码 → <code class="ic">cargo run</code> 开猜。</div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">📦 第一个玩伴 crate:rand</div>
    <p class="ms-goal">目标:装上随机数工具箱,Cargo.toml 里第一次出现依赖。</p>
    <p>人话提示:<code class="ic">cargo add rand@0.8</code> 一条命令搞定(Cargo 会自动写进 Cargo.toml 并下载)。或者手动在 <code class="ic">[dependencies]</code> 下加 <code class="ic">rand = "0.8"</code>——第一条外部依赖,纪念一下。</p>
    <details class="ref-impl"><summary>📖 Cargo.toml 关键行</summary>
      <div class="code-box">
        <div class="code-lang"><span>📦 Cargo.toml</span></div>
<pre><code data-lang="rust">[dependencies]
rand = "0.8"</code></pre>
      </div>
    </details>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">🎲 生成神秘数字</div>
    <p class="ms-goal">目标:程序生成 1~100 的随机整数。</p>
    <p>人话提示:<code class="ic">rand::thread_rng().gen_range(1..=100)</code>——thread_rng 是「这根线程的摇号机」,gen_range(1..=100) 摇出 1 到 100(含两头)。</p>
    <details class="ref-impl"><summary>📖 参考实现</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs 开头</span></div>
<pre><code data-lang="rust">use rand::Rng;                          // 注意:要 use 才能用 gen_range

fn main() {
    let secret = rand::thread_rng().gen_range(1..=100);
    println!("神秘数字已生成(1~100)…");
}</code></pre>
      </div>
    </details>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">👂 程序长出耳朵:读键盘</div>
    <p class="ms-goal">目标:把玩家敲的数字读进程序。</p>
    <p>人话提示:三步咒语——<b>①造空 String → ②read_line 往里灌 → ③trim + parse 变数字</b>。read_line 返回 Result(可能失败),parse 也返回 Result(玩家可能输入"abc"!),正好把 ch11 的 <code class="ic">?</code> 和 expect 用真:</p>
    <details class="ref-impl"><summary>📖 读入的核心三行</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 读入并转数字</span></div>
<pre><code data-lang="rust">use std::io;                            // 标准库的输入/输出工具箱

let mut guess = String::new();          // ① 造一个空 String 装输入
io::stdin()
    .read_line(&amp;mut guess)              // ② 借给它写:键盘敲的灌进来
    .expect("读入失败");                 //    read_line 返回 Result,expect 签收

let guess: u32 = guess.trim()          // ③ 掐头去尾(去掉回车)
    .parse()                           //    文字 → 数字
    .expect("请输入数字");              //    parse 也返回 Result!</code></pre>
      </div>
    </details>
    <p class="compare-note">这四行是 Rust CLI 世界的「读入标准姿势」,值得默写三遍。</p>
  </div>

  <div class="ms-card" data-no="第 4 步">
    <div class="ms-title">🔁 主循环 + match 提示</div>
    <p class="ms-goal">目标:loop 循环猜,match 对比提示「大了/小了」,猜中 break。</p>
    <details class="ref-impl"><summary>📖 完整参考实现(~30 行)</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs 完整版</span></div>
<pre><code data-lang="rust">use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    let secret = rand::thread_rng().gen_range(1..=100);
    println!("猜数字(1~100)!");

    loop {
        println!("请输入你的猜测:");

        let mut guess = String::new();
        if io::stdin().read_line(&amp;mut guess).expect("读入失败") == 0 {
            break; // 输入流结束
        }

        let guess: u32 = match guess.trim().parse() {
            Ok(n) =&gt; n,
            Err(_) =&gt; {
                println!("请输入一个数字!");
                continue;               // 输错了就重来
            }
        };

        match guess.cmp(&amp;secret) {
            Ordering::Less    =&gt; println!("小了!"),
            Ordering::Greater =&gt; println!("大了!"),
            Ordering::Equal   =&gt; {
                println!("猜对了!答案是 {secret}");
                break;
            }
        }
    }
}</code></pre>
      </div>
    </details>
    <p class="compare-note">看这两处 match:parse 的 Ok/Err 处理(错误输入 continue 重来),cmp 的三路分支——两个第 9/11 章的老朋友在真实项目里会师。</p>
  </div>

  <div class="tip">🦀 <b>为什么官方书把这个放第 2 章?</b>因为它让你<b>第一个程序就用真输入、真依赖、真错误处理</b>——磕磕绊绊没关系,后面每一站都会回过头把每个细节讲透。现在你已经通读基础岛,这 30 行对你只是复习拼盘。</div>`,

  quiz: [
    {
      q: "猜数字项目的核心机制是什么?",
      opts: ["std::io 读入 + rand 随机数 + match 对比", "网络请求 + 数据库", "文件读写", "多线程计算"],
      ans: 0,
      exp: "stdin 读键盘、rand 生成神秘数、match Ordering 三路提示——圣经 ch2 的传家宝三件套。",
    },
    {
      q: "read_line 之后为什么要 trim()?",
      opts: ["去掉末尾的换行符,不然 parse 会失败", "格式美观", "释放内存", "编译器要求"],
      ans: 0,
      exp: "你按下回车,输入里带着换行符——不掐掉,\"42\\n\" 永远 parse 不了。trim 是读入的固定搭档。",
    },
    {
      q: "玩家输入了 \"abc\",程序应该?",
      opts: ["match parse 的 Err 分支,提示后 continue 重来", "panic 崩溃", "当 0 处理", "退出程序"],
      ans: 0,
      exp: "真实程序要体面处理坏输入:match Ok/Err,Err 打一句「请输入数字」,continue 继续等——错误处理的实战首秀。",
    },
  ],
});

/* ══════════ 裸写 Web 服务器:圣经 ch21 最终项目(支线) ══════════ */
R.registerChapter({
  key: "httpd", order: 45.5, part: 3, icon: "🕸", title: "支线 · 裸写 Web 服务器",
  eyebrow: "隐藏支线 · 徽章待领:🕸 裸写铁匠",
  req: "p5",
  bonus: 50,

  html: `
  <p class="lead">P4 用 axum 框架一步到位——但你有没有好奇过:<b>没有框架的时候,Web 服务器是怎么从零长出来的?</b>官方书的压轴大项目(ch21)就是它:用 TcpListener 裸写 HTTP,从单线程到多线程再到优雅关闭。硬核,值得。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · 裸写 HTTP 服务器</h4>
    <p><b>成品:</b>纯标准库实现的 Web 服务器:浏览器访问 <code>localhost:7878</code> 返回问候页;并发可服务多个请求。</p>
    <p><b>难度:</b><span class="stars">★★★★★</span> · <b>规模:</b>~120 行核心 · <b>环境:</b>本地运行</p>
    <div class="prereq">
      <span>前置:ch7 集合</span><span>ch11 错误处理</span><span>ch16 多线程</span><span>P3 聊天室(思想同源)</span>
    </div>
  </div>

  <div class="local-note">💻 本地运行:<code class="ic">cargo new httpd &amp;&amp; cd httpd</code> → 将示例放入 src/main.rs 并执行 cargo run → 浏览器打开 <code>http://127.0.0.1:7878</code>。想多开几个标签页同时访问——这就是并发的现场。</div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">🔌 监听端口:Web 服务器的第一口气</div>
    <p class="ms-goal">目标:监听 7878 端口,向浏览器返回一行问候。</p>
    <details class="ref-impl"><summary>📖 参考实现(TcpListener + 单线程)</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs · 单线程版</span></div>
<pre><code data-lang="rust">use std::io::prelude::*;
use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("服务已启动: http://127.0.0.1:7878");

    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        let mut buffer = [0; 1024];       // 读进来的 HTTP 请求先放这
        stream.read(&amp;mut buffer).unwrap();

        let response = "HTTP/1.1 200 OK\\r\\nContent-Type: text/plain; charset=utf-8\\r\\nConnection: close\\r\\n\\r\\n你好,裸写的世界!";
        stream.write_all(response.as_bytes()).unwrap();
    }
}</code></pre>
      </div>
    </details>
    <p class="compare-note">这就已经是一个真的 HTTP 服务器了——浏览器能打开它。<code class="ic">\\r\\n\\r\\n</code> 是 HTTP 协议规定空行,响应头和内容的分界,一个字符都不能少。</p>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">🧵 多线程:每个连接一根地鼠</div>
    <p class="ms-goal">目标:一个浏览器请求没答完,另一个也能同时进——for 循环里 spawn。</p>
    <details class="ref-impl"><summary>📖 并发版(与 P3 聊天室同思想)</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 for 循环里发车</span></div>
<pre><code data-lang="rust">use std::{io::prelude::*, net::{TcpListener, TcpStream}, thread};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    for stream in listener.incoming().flatten() {
        let mut stream = stream;

        thread::spawn(move || { let _ = handle_connection(&amp;mut stream); });
    }
}

fn handle_connection(stream: &amp;mut TcpStream) -&gt; std::io::Result&lt;()&gt; {
    let mut buffer = [0; 1024];
    stream.read(&amp;mut buffer)?;

    let response = "HTTP/1.1 200 OK\\r\\nContent-Type: text/plain; charset=utf-8\\r\\nConnection: close\\r\\n\\r\\n你好,多线程的世界!";
    stream.write_all(response.as_bytes())
}</code></pre>
      </div>
    </details>
    <p class="compare-note">这是本机演示版，每个连接都会创建线程。官方书随后用固定数量的工作线程限制并发。一个慢连接(比如有人 sleep 10 秒)再也卡不住别人:这就是圣经标题里「Fearless」的含义。</p>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">🚪 优雅关闭:等待工作线程收尾</div>
    <p class="ms-goal">目标:停止接收连接后，等待已经接手的请求处理完毕。</p>
    <p>人话提示:官方书第 21.3 节用 <code>incoming().take(2)</code> 演示接收两个连接后停止监听。线程池在 <code>Drop</code> 中先释放任务发送端，让工作线程处理完队列再退出，然后逐个 <code>join()</code> 等待收尾。<a href="https://doc.rust-lang.org/book/ch21-03-graceful-shutdown-and-cleanup.html" target="_blank" rel="noopener">阅读完整实现</a>。</p>
    <p class="compare-note">三步连起来:监听 → 并发 → 收摊——一部微型服务器进化史。axum 底下做的正是这三件事的豪华版,你现在看穿了它的底牌。</p>
  </div>

  <div class="tip">🦀 想加路由?在 handle_connection 里 <code class="ic">match buffer 内容</code>——GET / 就返回首页,GET /api 返回 JSON。第 9 章 match 的威力,在服务器里再次应验。</div>`,

  quiz: [
    {
      q: "裸写服务器监听端口用什么?",
      opts: ["std::net::TcpListener::bind", "std::http::listen", "TcpStream::connect", "net::Server::new"],
      ans: 0,
      exp: "TcpListener::bind(\"127.0.0.1:7878\") 把端口绑上,incoming() 迭代每个进来的连接——标准库就够,零依赖。",
    },
    {
      q: "HTTP 响应里的 \\r\\n\\r\\n 是什么?",
      opts: ["响应头与内容之间的空行(HTTP 协议规定)", "装饰", "编码标记", "可选的"],
      ans: 0,
      exp: "HTTP 协议规定:头部之后必须一个空行,才是内容主体。少一个字符,浏览器就不认——协议是硬规矩。",
    },
    {
      q: "每个连接 spawn 一根线程,解决的痛点是?",
      opts: ["慢连接卡住所有人", "代码更长", "内存占用", "编译速度"],
      ans: 0,
      exp: "单线程版:一个请求没答完,下一个进不来——最古老的「一个慢用户堵死全场」。spawn 之后人人生而并发,ch16 落地。",
    },
  ],
});

})();
