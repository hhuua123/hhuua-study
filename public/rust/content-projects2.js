/* ═══════════════════════════ 锈岛求生 2.0 · 实战大陆(P3~P5 + 支线 + 终极毕业) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════════ Playground 代码池(真·可跑) ════════════ */
R.registerPlay({

"p1-args": `use std::env;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    println!("收到的参数: {args:?}");
}
`,

"p1-parse": `use std::env;

#[derive(Debug)]
enum Command {
    List,
    Add(String),
    Done(usize),
}

fn parse(args: &[String]) -> Command {
    match args {
        [cmd, title] if cmd == "add" => Command::Add(title.clone()),
        [cmd, n] if cmd == "done" => Command::Done(n.parse().unwrap_or(0)),
        _ => Command::List,
    }
}

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    println!("{:?}", parse(&args));
}
`,

"p1-crud": `use std::env;

#[derive(Debug)]
struct Task {
    title: String,
    done: bool,
}

#[derive(Debug)]
enum Command {
    List,
    Add(String),
    Done(usize),
}

fn parse(args: &[String]) -> Command {
    match args {
        [cmd, title] if cmd == "add" => Command::Add(title.clone()),
        [cmd, n] if cmd == "done" => Command::Done(n.parse().unwrap_or(0)),
        _ => Command::List,
    }
}

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let mut tasks: Vec<Task> = vec![
        Task { title: String::from("学完锈岛第一部"), done: true },
    ];

    match parse(&args) {
        Command::List => {
            if tasks.is_empty() {
                println!("没有任务,先 add 一条吧!");
            }
            for (i, t) in tasks.iter().enumerate() {
                println!("{}. [{}] {}", i + 1, if t.done { "✅" } else { "·" }, t.title);
            }
        }
        Command::Add(title) => {
            tasks.push(Task { title, done: false });
            println!("已添加: {}", tasks.last().unwrap().title);
        }
        Command::Done(n) => {
            if n == 0 {
                println!("用法: todo done <编号>");
            } else {
                match tasks.get_mut(n - 1) {
                    Some(t) => {
                        t.done = true;
                        println!("完成: {}", t.title);
                    }
                    None => println!("没有第 {n} 号任务"),
                }
            }
        }
    }
}
`,

"p2-read": `use std::fs;

fn load_text(path: &str) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}

fn main() {
    match load_text("article.txt") {
        Ok(text) => println!("读到 {} 字节", text.len()),
        Err(e) => println!("打不开: {e}"),
    }
}
`,

"p2-freq": `use std::collections::HashMap;

fn word_freq(text: &str) -> Vec<(String, i32)> {
    let mut counts: HashMap<&str, i32> = HashMap::new();
    for w in text.split_whitespace() {
        *counts.entry(w).or_insert(0) += 1;
    }
    let mut pairs: Vec<(String, i32)> = counts
        .iter()
        .map(|(w, c)| ((*w).to_string(), *c))
        .collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1));
    pairs
}

fn main() {
    let text = "螃蟹 螃蟹 螃蟹 鱼 鱼 贝壳";
    for (w, c) in word_freq(text).iter().take(3) {
        println!("{w}: {c}");
    }
}
`,

"p2-report": `use std::collections::HashMap;

fn word_freq(text: &str) -> Vec<(String, i32)> {
    let mut counts: HashMap<&str, i32> = HashMap::new();
    for w in text.split_whitespace() {
        *counts.entry(w).or_insert(0) += 1;
    }
    let mut pairs: Vec<(String, i32)> = counts
        .iter()
        .map(|(w, c)| ((*w).to_string(), *c))
        .collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1));
    pairs
}

struct Report {
    pairs: Vec<(String, i32)>,
}

impl Report {
    fn render(&self, mode: &str) -> String {
        match mode {
            "csv" => self.pairs.iter()
                .map(|(w, c)| format!("{w},{c}"))
                .collect::<Vec<_>>()
                .join("\\n"),
            "json" => {
                let items: Vec<String> = self.pairs.iter()
                    .map(|(w, c)| format!("\\"{w}\\": {c}"))
                    .collect();
                format!("{{{}}}", items.join(", "))
            }
            _ => self.pairs.iter()
                .map(|(w, c)| format!("{w:<6} {}", "▍".repeat(*c as usize)))
                .collect::<Vec<_>>()
                .join("\\n"),
        }
    }
}

fn main() {
    let report = Report { pairs: word_freq("螃蟹 螃蟹 螃蟹 鱼 鱼 贝壳") };
    println!("{}", report.render("text"));
    println!("---");
    println!("{}", report.render("csv"));
    println!("---");
    println!("{}", report.render("json"));
}
`,

"p4-hello": `fn hello() -> &'static str {
    "短链服务在线!"
}

fn main() {
    println!("{}", hello());
}
`,

"p5-calc": `use std::collections::HashMap;

#[derive(Debug, Clone)]
enum Token {
    Num(f64),
    Ident(String),
    Op(char),
    LParen,
    RParen,
}

fn lex(src: &str) -> Vec<Token> {
    let mut tokens = vec![];
    let mut chars = src.chars().peekable();
    while let Some(&c) = chars.peek() {
        match c {
            ' ' => { chars.next(); }
            '0'..='9' | '.' => {
                let mut num = String::new();
                while let Some(&d) = chars.peek() {
                    if d.is_ascii_digit() || d == '.' {
                        num.push(d);
                        chars.next();
                    } else { break; }
                }
                tokens.push(Token::Num(num.parse().unwrap()));
            }
            c if c.is_alphabetic() => {
                let mut ident = String::new();
                while let Some(&d) = chars.peek() {
                    if d.is_alphanumeric() || d == '_' {
                        ident.push(d);
                        chars.next();
                    } else { break; }
                }
                tokens.push(Token::Ident(ident));
            }
            '+' | '-' | '*' | '/' => { tokens.push(Token::Op(c)); chars.next(); }
            '(' => { tokens.push(Token::LParen); chars.next(); }
            ')' => { tokens.push(Token::RParen); chars.next(); }
            other => panic!("不认识的字符: {other}"),
        }
    }
    tokens
}

#[derive(Debug)]
enum Expr {
    Num(f64),
    Var(String),
    Bin(char, Box<Expr>, Box<Expr>),
}

struct Parser {
    tokens: Vec<Token>,
    pos: usize,
}

impl Parser {
    fn new(tokens: Vec<Token>) -> Self {
        Parser { tokens, pos: 0 }
    }

    fn peek(&self) -> Option<&Token> {
        self.tokens.get(self.pos)
    }

    fn eat(&mut self) -> Token {
        let t = self.tokens[self.pos].clone();
        self.pos += 1;
        t
    }

    // expr 层:处理 + 和 -(最低优先级)
    fn expr(&mut self) -> Expr {
        let mut left = self.term();
        loop {
            match self.peek() {
                Some(Token::Op('+')) | Some(Token::Op('-')) => {
                    let Token::Op(op) = self.eat() else { break };
                    let right = self.term();
                    left = Expr::Bin(op, Box::new(left), Box::new(right));
                }
                _ => break,
            }
        }
        left
    }

    // term 层:处理 * 和 /(更高优先级)
    fn term(&mut self) -> Expr {
        let mut left = self.factor();
        loop {
            match self.peek() {
                Some(Token::Op('*')) | Some(Token::Op('/')) => {
                    let Token::Op(op) = self.eat() else { break };
                    let right = self.factor();
                    left = Expr::Bin(op, Box::new(left), Box::new(right));
                }
                _ => break,
            }
        }
        left
    }

    // factor 层:数字、变量、括号(最高优先级)
    fn factor(&mut self) -> Expr {
        match self.eat() {
            Token::Num(n) => Expr::Num(n),
            Token::Ident(name) => Expr::Var(name),
            Token::LParen => {
                let e = self.expr();
                self.eat();   // 吃掉右括号(信任输入版)
                e
            }
            t => panic!("意料之外的 token: {t:?}"),
        }
    }
}

fn eval(e: &Expr, env: &HashMap<String, f64>) -> f64 {
    match e {
        Expr::Num(n) => *n,
        Expr::Var(name) => *env.get(name).unwrap_or(&f64::NAN),
        Expr::Bin(op, l, r) => {
            let (l, r) = (eval(l, env), eval(r, env));
            match op {
                '+' => l + r,
                '-' => l - r,
                '*' => l * r,
                '/' => l / r,
                _ => panic!("未知运算符 {op}"),
            }
        }
    }
}

fn run_line(line: &str, env: &mut HashMap<String, f64>) {
    let line = line.trim();
    if line.is_empty() { return; }
    if let Some(rest) = line.strip_prefix("let ") {
        if let Some((name, expr)) = rest.split_once('=') {
            let value = eval(&Parser::new(lex(expr.trim())).expr(), env);
            env.insert(name.trim().to_string(), value);
            println!("{:?} = {}", name.trim(), value);
            return;
        }
    }
    let value = eval(&Parser::new(lex(line)).expr(), env);
    println!("{value}");
}

fn main() {
    let mut env: HashMap<String, f64> = HashMap::new();
    run_line("1 + 2 * 3", &mut env);
    run_line("(1 + 2) * 3", &mut env);
    run_line("let a = 2", &mut env);
    run_line("a * (a + 8)", &mut env);
}
`,
});

/* ════════════ P3 · 多人聊天室 ════════════ */
R.registerChapter({
  key: "p3", order: 42, part: 3, icon: "📡", title: "P3 聊天室",
  eyebrow: "实战 3 · 徽章待领：📡 信号台长",
  bonus: 50,

  html: `
  <p class="lead">第三个项目：<b>多人终端聊天室</b>。纯标准库，不装任何依赖——用第 16 章的线程、channel 思想、Arc&lt;Mutex&gt;，搭一个真正「多人同时在线」的服务。这项目在 Python 里也能写，但在 Rust 里写完你会体验到「跑起来就是对的」的魔力。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · 聊天室</h4>
    <p><b>成品：</b><code class="ic">cargo run</code> 启动服务器，另开几个终端 <code class="ic">nc 127.0.0.1 7878</code> 即可互聊，支持 /nick 改名、/quit 下线。</p>
    <p><b>难度：</b><span class="stars">★★★☆☆</span> · <b>规模：</b>~100 行核心 · <b>环境：</b><b>本地运行</b>(Playground 沙箱禁止监听端口)</p>
    <div class="prereq">
      <span>前置：ch16 多线程</span><span>ch7 HashMap</span><span>ch11 Result</span><span>ch9 match</span>
    </div>
  </div>

  <div class="local-note">💻 运行方法：<code class="ic">cargo new chatroom &amp;&amp; cd chatroom</code> → 贴代码 → <code class="ic">cargo run</code> → 再开 2 个终端，各自 <code class="ic">nc 127.0.0.1 7878</code>（macOS/Linux 自带 nc；Windows 用 telnet 或 PowerShell 的 Test-NetConnection 也行）。</div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">🔌 Echo 服务器：先让一个人能说话</div>
    <p class="ms-goal">目标：客户端连上后发什么，服务器原样回什么。</p>
    <p>人话提示：<code class="ic">TcpListener::bind</code> 拿到「接线总机」，<code class="ic">incoming()</code> 每次铃响给一条 <code class="ic">TcpStream</code>（一根电话线）。先 read 再 write_all 原样喊回去——就是 Echo。</p>
    <details class="ref-impl"><summary>📖 参考实现（echo 版）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use std::io::{Read, Write};
use std::net::TcpListener;

fn main() -&gt; std::io::Result&lt;()&gt; {
    let listener = TcpListener::bind("127.0.0.1:7878")?;
    println!("echo 服务器已启动: nc 127.0.0.1 7878");

    for stream in listener.incoming() {
        let mut stream = stream?;
        let mut buf = [0u8; 1024];
        let n = stream.read(&amp;mut buf)?;       // 读客户端发来的字节
        stream.write_all(&amp;buf[..n])?;          // 原样回敬
    }
    Ok(())
}</code></pre>
      </div>
    </details>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">🧵 一人一根线程：从单间到大厅</div>
    <p class="ms-goal">目标：多个人能同时连上、同时说话。</p>
    <p>人话提示：read 是<b>阻塞的</b>——一个人不说话，整个 for 循环就卡住等他，别人连门都进不来。解法：每来一条连接就 <code class="ic">thread::spawn</code> 发一根线程去陪聊，主循环专心接客（第 16 章）。注意闭包要 <code class="ic">move</code>，把 stream 带走。</p>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">📢 共享名单 + 广播：信号台的核心</div>
    <p class="ms-goal">目标：任何人的消息，所有在线的人都能看到。</p>
    <p>人话提示：需要一张「在线名单」：名字 → 写入口。名单被所有线程共用，所以 <code class="ic">Arc&lt;Mutex&lt;HashMap&gt;&gt;</code>。有个精妙细节：TcpStream 要<b>一份读（自己收）、一份写（存进名单给别人群发）</b>——用 <code class="ic">try_clone()</code> 复制句柄。</p>
  </div>

  <div class="ms-card" data-no="第 4 步">
    <div class="ms-title">💬 协议与断线：match + let-else</div>
    <p class="ms-goal">目标：/quit 下线、/nick 改名、普通消息广播；对方断开时清名单并广播下线。</p>
    <p>人话提示：<code class="ic">let Ok(line) = line else { break };</code> 是 Rust 1.65 的 let-else 神器——读流结束（断线）就 break 走清理逻辑。⚠️ 最经典的坑：<b>改完名字想广播，必须先 drop(map) 释放锁</b>——broadcast 内部还要拿锁，Mutex 不支持同一个人重复拿（会死锁）。这也是自查第 6 关的考点。</p>
    <p class="compare-note">体验一下真实聊天节奏（模拟控制台）：</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 终端剧场</span><button class="btn-run" data-run="p3-theater">▶ 播放</button></div>
<pre><code data-lang="rust">[游客0] 大家好!
[游客1] 你好呀 🦀
[游客0] /nick 蟹老板
[游客0] /quit</code></pre>
      <div class="console" hidden></div>
    </div>
    <details class="ref-impl"><summary>📖 完整参考实现（~100 行,全 std）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use std::collections::HashMap;
use std::io::{self, BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::{Arc, Mutex};
use std::thread;

type Clients = Arc&lt;Mutex&lt;HashMap&lt;String, TcpStream&gt;&gt;&gt;;

fn broadcast(clients: &amp;Clients, msg: &amp;str) {
    let mut map = clients.lock().unwrap();
    for w in map.values_mut() {
        let _ = writeln!(w, "{msg}");   // 给每个人群发一行
    }
}

fn handle(reader: TcpStream, clients: Clients, id: usize) {
    // 同一条连接拆两份:reader 自己收,writer 存进名单供群发
    let writer = match reader.try_clone() {
        Ok(w) =&gt; w,
        Err(_) =&gt; return,
    };
    let name = format!("游客{id}");
    clients.lock().unwrap().insert(name.clone(), writer);
    broadcast(clients, &amp;format!("[{name}] 上线"));

    let mut current = name;
    for line in BufReader::new(reader).lines() {
        let Ok(line) = line else { break };   // let-else:断线自动走清理
        let line = line.trim_end().to_string();

        match line.as_str() {
            "/quit" =&gt; break,
            s if s.starts_with("/nick ") =&gt; {
                let new = s[6..].trim().to_string();
                let mut map = clients.lock().unwrap();
                if let Some(w) = map.remove(&amp;current) {
                    map.insert(new.clone(), w);
                    drop(map);   // ⚠️ 先还锁再广播,不然死锁!
                    broadcast(clients, &amp;format!("[{current}] 改名为 [{new}]"));
                    current = new;
                }
            }
            s =&gt; broadcast(clients, &amp;format!("[{current}] {s}")),
        }
    }

    clients.lock().unwrap().remove(&amp;current);
    broadcast(clients, &amp;format!("[{current}] 下线"));
}

fn main() -&gt; io::Result&lt;()&gt; {
    let clients: Clients = Arc::new(Mutex::new(HashMap::new()));
    let listener = TcpListener::bind("127.0.0.1:7878")?;
    println!("聊天室已开张: nc 127.0.0.1 7878 (多开几个终端试试)");

    for (id, stream) in listener.incoming().enumerate() {
        let Ok(stream) = stream else { continue };
        let clients = Arc::clone(&amp;clients);
        thread::spawn(move || handle(stream, clients, id));
    }
    Ok(())
}</code></pre>
      </div>
    </details>
  </div>

  <div class="ms-card" data-no="第 5 步">
    <div class="ms-title">🏁 联调 + 改造清单</div>
    <p class="ms-goal">目标：开 3 个终端互聊一次，然后挑一个改造。</p>
    <p>改造清单（按难度排序）：① /list 列出在线名单 → ② 服务器启动播报欢迎语 → ③ 断线重连保留名字 → ④ 私聊 /msg → ⑤ 消息加时间戳。每个都是 10~30 行的小改动，改完记得 cargo clippy。</p>
  </div>`,

  quiz: [
    {
      q: "accept 循环里拿到的 stream 是什么？",
      opts: ["TcpStream:与某个客户端的连接", "TcpListener", "对方发来的字符串", "IP 地址"],
      ans: 0,
      exp: "listener 是接线总机，stream 是一根根电话线。读它 = 听对方说话，写它 = 对着对方喊话。",
    },
    {
      q: "为什么每条连接都要 thread::spawn 一根新线程？",
      opts: ["规定如此", "read 是阻塞的,不 spawn 就只能一次服务一个人", "线程更省内存", "编译器强制"],
      ans: 1,
      exp: "第 16 章的知识点：阻塞式 read 会把循环卡死在「等第一个人开口」。一人一根线程，谁说话谁那根线程等着，互不耽误。",
    },
    {
      q: "clients 名单为什么是 Arc<Mutex<HashMap<...>>>？",
      opts: ["多线程共享(Arc)+ 防止同时写坏(Mutex)", "加密通信", "网络协议要求", "其实没必要,普通 HashMap 就行"],
      ans: 0,
      exp: "每个连接一根线程，大家都要查名单、改名单：Arc 让大家都拿得到，Mutex 保证一次只有一根线程在改。少一个都是编译错误——这就是「跑起来就是对的」。",
    },
    {
      q: "try_clone() 出来的 writer 是干嘛的？",
      opts: ["同一条连接拆两份:一份自己读消息,一份存进名单用来群发", "备份防丢", "关闭连接用", "计数用"],
      ans: 0,
      exp: "一条 TcpStream 同时读和写完全可以，但要存进名单给别人群发，就得复制一份句柄。try_clone 是操作系统的「复制电话听筒」。",
    },
    {
      q: "read 返回 Ok(0)（或 lines 结束）意味着？",
      opts: ["对方断线了:该把 TA 移出名单并广播下线", "网络卡了,重试", "服务器要重启", "收到空消息"],
      ans: 0,
      exp: "读到 0 字节 = 对端关闭了连接。代码里 let Ok(line) = line else { break } 会带你走「清理 + 广播下线」的流程——断线也是生活的一部分。",
    },
    {
      q: "/nick 改名分支里 drop(map) 之后才 broadcast，不 drop 会怎样？",
      opts: ["死锁:broadcast 想拿锁,但锁还在自己手里", "内存泄漏", "消息丢失", "没有任何影响"],
      ans: 0,
      exp: "Mutex 不可重入：同一个线程拿两次锁就互相等对方——程序卡死。这是多线程最经典的坑，建议亲手注释掉 drop 试一次，卡住后 Ctrl+C 的教训最深刻。",
    },
  ],

  run: {
    "p3-theater": [
      "[游客0] 上线",
      "[游客0] 大家好!",
      "[游客1] 上线",
      "[游客1] 你好呀 🦀",
      "[游客0] 改名为 [蟹老板]",
      "[蟹老板] 从此这就是我的聊天室了",
      "[蟹老板] 下线",
    ],
  },
});

/* ════════════ P4 · 短链 Web 服务 ════════════ */
R.registerChapter({
  key: "p4", order: 43, part: 3, icon: "🔗", title: "P4 短链服务",
  eyebrow: "实战 4 · 徽章待领：🔗 链接骑士",
  bonus: 50,

  html: `
  <p class="lead">第四个项目：<b>短链接 Web API</b>——你职业生涯最可能真用到的那种。用 axum（Rust 最流行的 Web 框架之一）+ tokio 写一个「POST 长链接 → 得短码 → 访问短码 → 307 跳转」的完整服务。对照 Flask/FastAPI 学，概念无缝平移，性能高一档。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · 短链服务</h4>
    <p><b>成品：</b><code class="ic">curl -X POST localhost:3000/shorten -H 'Content-Type: application/json' -d '{"url":"..."}'</code> 拿短码；浏览器访问短码跳转原文；不存在的短码返回 404。</p>
    <p><b>难度：</b><span class="stars">★★★★☆</span> · <b>规模：</b>~120 行 · <b>环境：</b>本地运行（Playground 可运行问候函数）</p>
    <div class="prereq">
      <span>前置：ch17 async</span><span>ch8 struct</span><span>ch14 derive</span><span>ch16 Arc/Mutex</span><span>ch11 Result</span>
    </div>
  </div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">👋 Hello axum：三层套娃启动</div>
    <p class="ms-goal">目标：服务器跑起来，访问 localhost:3000 显示一行字。</p>
    <p>人话提示：axum 的启动公式 = Router（路由表）+ TcpListener（接线员）+ <code class="ic">#[tokio::main]</code>（第 17 章的 runtime 管家上岗）。对照 Flask：<code class="ic">@app.route("/")</code> 变成了 <code class="ic">Router::new().route("/", get(...))</code>。</p>
    <p>先在 Playground 调用问候函数，观察输出。要从浏览器访问 localhost:3000，请在自己的电脑上运行下方完整 Cargo 项目。</p>
    <div class="pg-wrap" data-pg="p4-hello"></div>
    <div class="local-note">💻 Cargo.toml 先加依赖（本地）：</div>
    <div class="code-box">
      <div class="code-lang"><span>📦 Cargo.toml</span></div>
<pre><code data-lang="rust">[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"</code></pre>
    </div>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">✂️ POST /shorten：JSON 进，短码出</div>
    <p class="ms-goal">目标：发 <code class="ic">{"url":"长链接"}</code>，返回 <code class="ic">{"short":"localhost:3000/xxxx"}</code>。</p>
    <p>人话提示：两个新玩具——<b>提取器</b>：<code class="ic">Json&lt;ShortenReq&gt;</code> 自动把请求体 JSON 解析成 struct（serde 派生）；<b>状态</b>：<code class="ic">State&lt;Db&gt;</code> 拿到全局共享的短码→长链接表（Arc&lt;Mutex&gt;，第 16 章原班人马）。短码生成用「纳秒时间戳的 16 进制」——仅作本地演示，可能重复。</p>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">↪️ GET /:code：307 跳转 + 404</div>
    <p class="ms-goal">目标：访问存在的短码跳原文；不存在的给 404。</p>
    <p>人话提示：路径参数用 <code class="ic">Path&lt;String&gt;</code> 提取（≈ Flask 的 &lt;code&gt;）。返回类型写 <code class="ic">Result&lt;Redirect, StatusCode&gt;</code>——Ok 是 307 跳转，Err 变 404，<b>框架自动翻译</b>，不用手写错误响应。第 11 章的 Result 在 HTTP 世界的新工作。</p>
    <p class="compare-note">跑通后的完整体验（模拟控制台）：</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 终端剧场</span><button class="btn-run" data-run="p4-theater">▶ 播放</button></div>
<pre><code data-lang="rust">$ curl -X POST localhost:3000/shorten -H 'Content-Type: application/json' -d '{"url":"https://kaisery.github.io/trpl-zh-cn/"}'
$ curl -i localhost:3000/1f0c3a2b
$ curl -i localhost:3000/NoSuchCode</code></pre>
      <div class="console" hidden></div>
    </div>
    <details class="ref-impl"><summary>📖 完整参考实现（~120 行）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Redirect,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

type Db = Arc&lt;Mutex&lt;HashMap&lt;String, String&gt;&gt;&gt;;

#[derive(Deserialize)]
struct ShortenReq {
    url: String,
}

#[derive(Serialize)]
struct ShortenResp {
    short: String,
}

async fn hello() -&gt; &amp;'static str {
    "短链服务在线!"
}

async fn shorten(State(db): State&lt;Db&gt;, Json(req): Json&lt;ShortenReq&gt;) -&gt; Json&lt;ShortenResp&gt; {
    // 纳秒时间戳的 16 进制当短码:本地示例，可能重复
    let code = nanos_code();
    db.lock().unwrap().insert(code.clone(), req.url);
    Json(ShortenResp { short: format!("http://localhost:3000/{code}") })
}

async fn redirect(State(db): State&lt;Db&gt;, Path(code): Path&lt;String&gt;) -&gt; Result&lt;Redirect, StatusCode&gt; {
    let target = db.lock().unwrap().get(&amp;code).cloned();
    match target {
        Some(url) =&gt; Ok(Redirect::temporary(&amp;url)),
        None =&gt; Err(StatusCode::NOT_FOUND),   // 框架自动变成 404 响应
    }
}

fn nanos_code() -&gt; String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let n = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .subsec_nanos();
    format!("{n:x}")
}

#[tokio::main]
async fn main() {
    let db: Db = Arc::new(Mutex::new(HashMap::new()));
    let app = Router::new()
        .route("/", get(hello))
        .route("/shorten", post(shorten))
        .route("/:code", get(redirect))
        .with_state(db);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("短链服务已启动: http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 1、2、3、4、5 关。</p>
  </div>

  <div class="ms-card" data-no="第 4 步">
    <div class="ms-title">🚀 部署 + 改造清单</div>
    <p class="ms-goal">目标：把服务真的放到公网上（可选）。</p>
    <p>人话提示：编译产物是单个二进制：<code class="ic">cargo build --release</code>，拷到任何 Linux 服务器就能跑——没有解释器、没有虚拟环境，这就是 Rust 部署的快乐。免费平台可试 <a href="https://fly.io" target="_blank" rel="noopener">fly.io</a> / <a href="https://render.com" target="_blank" rel="noopener">Render</a>。</p>
    <p>改造清单：① 短码冲突检测 → ② 点击计数 → ③ 数据落盘（重启不丢）→ ④ 换 sled/sqlite 存储 → ⑤ 加 /stats 页面。做完 ①② 就够你写进简历了。</p>
  </div>`,

  quiz: [
    {
      q: "with_state(db) 的作用是？",
      opts: ["把共享数据递给所有 handler 使用", "数据库迁移", "保存日志", "开启调试模式"],
      ans: 0,
      exp: "注册一份全局状态，handler 用 State<Db> 提取器接收——≈ Flask 的 app.config 全局对象，但类型安全、按需注入。",
    },
    {
      q: "参数写 Json<ShortenReq> 是干嘛的？",
      opts: ["自动把请求体 JSON 解析成 struct,字段不对直接 422", "返回 JSON 响应", "加密请求", "校验登录 token"],
      ans: 0,
      exp: "提取器模式：进来的是 HTTP 请求，axum + serde 自动拆包成你的 struct。等于 Flask 里 request.get_json() + 一堆字段校验，一行全办。",
    },
    {
      q: "redirect 返回 Result<Redirect, StatusCode>，Err 那边谁处理？",
      opts: ["axum 自动翻译成 HTTP 404 响应", "panic 崩溃", "被忽略", "要自己在 main 里处理"],
      ans: 0,
      exp: "Result 是 axum 认识的类型：Ok → 正常响应，Err(StatusCode) → 对应的错误响应。第 11 章「错误是返回值」在 HTTP 层无缝衔接。",
    },
    {
      q: "POST /shorten 带 {\"url\":\"x\"} 的响应是？",
      opts: ['{"short":"http://localhost:3000/某短码"}', '{"url":"x"}', "404", "空响应"],
      ans: 0,
      exp: "handler 返回 Json<ShortenResp>：serde 把 struct 序列化成 JSON 发回去。请求进来是 JSON、响应出去是 JSON——serde 一行注解全包。",
    },
    {
      q: "#[tokio::main] 这行注解是干嘛的？",
      opts: ["启动 async 运行时,让 main 变 async fn", "声明主文件", "生成测试", "编译优化开关"],
      ans: 0,
      exp: "runtime 管家上岗（第 17 章）：把你的 async main 交给 tokio 调度。没有它，.await 就没有发动机。",
    },
  ],

  run: {
    "p4-theater": [
      '$ curl -X POST localhost:3000/shorten -H "Content-Type: application/json" -d \'{"url":"https://kaisery.github.io/trpl-zh-cn/"}\'',
      '{"short":"http://localhost:3000/1f0c3a2b"}',
      "$ curl -i localhost:3000/1f0c3a2b",
      "HTTP/1.1 307 Temporary Redirect",
      "location: https://kaisery.github.io/trpl-zh-cn/",
      "$ curl -i localhost:3000/NoSuchCode",
      "HTTP/1.1 404 Not Found",
    ],
  },
});

/* ════════════ P5 · 迷你解释器 ════════════ */
R.registerChapter({
  key: "p5", order: 44, part: 3, icon: "🧠", title: "P5 迷你解释器",
  eyebrow: "实战 5 · 徽章待领：🧠 语言建筑师",
  bonus: 50,

  html: `
  <p class="lead">毕业项目：<b>亲手写一个编程语言</b>。从字符流到词法、语法、求值——四则运算、括号优先级、变量赋值，全部自己实现。这一篇综合调用前面<b>所有</b>知识：enum（token 和表达式树）、match（分拣）、Box（递归封底）、Result 思想、HashMap（环境）。写完，你对「语言如何工作」的理解上一个台阶。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · 迷你解释器 calc</h4>
    <p><b>成品：</b>输入 <code class="ic">1 + 2 * 3</code> → 7；<code class="ic">(1 + 2) * 3</code> → 9；<code class="ic">let a = 2</code>、<code class="ic">a * (a + 8)</code> → 20。</p>
    <p><b>难度：</b><span class="stars">★★★★★</span> · <b>规模：</b>~200 行 · <b>环境：</b>Playground 全程可跑 🎉</p>
    <div class="prereq">
      <span>前置：ch9 enum/match</span><span>ch15 Box/递归</span><span>ch7 HashMap</span><span>ch13 迭代器</span>
    </div>
  </div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">🔤 词法分析：字符流 → Token 流</div>
    <p class="ms-goal">目标："1 + 2" 变成 [Num(1), Op('+'), Num(2)]。</p>
    <p>人话提示：用 <code class="ic">chars().peekable()</code> 一个个看字符，数字凑成 Num、字母凑成 Ident、符号变 Op。enum 当分拣箱——第 9 章的「带行李的枚举」在这里就是生产工具。peekable ≈ Python 的迭代器 + next() 预看。</p>
    <details class="ref-impl"><summary>📖 参考实现（lex）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 token 与 lex</span></div>
<pre><code data-lang="rust">#[derive(Debug, Clone)]
enum Token {
    Num(f64),          // 数字
    Ident(String),      // 标识符(变量名)
    Op(char),           // + - * /
    LParen, RParen,     // ( )
}

fn lex(src: &amp;str) -&gt; Vec&lt;Token&gt; {
    let mut tokens = vec![];
    let mut chars = src.chars().peekable();
    while let Some(&amp;c) = chars.peek() {
        match c {
            ' ' =&gt; { chars.next(); }
            '0'..='9' | '.' =&gt; {
                let mut num = String::new();
                while let Some(&amp;d) = chars.peek() {
                    if d.is_ascii_digit() || d == '.' {
                        num.push(d);
                        chars.next();
                    } else { break; }
                }
                tokens.push(Token::Num(num.parse().unwrap()));
            }
            c if c.is_alphabetic() =&gt; {
                let mut ident = String::new();
                while let Some(&amp;d) = chars.peek() {
                    if d.is_alphanumeric() || d == '_' {
                        ident.push(d);
                        chars.next();
                    } else { break; }
                }
                tokens.push(Token::Ident(ident));
            }
            '+' | '-' | '*' | '/' =&gt; { tokens.push(Token::Op(c)); chars.next(); }
            '(' =&gt; { tokens.push(Token::LParen); chars.next(); }
            ')' =&gt; { tokens.push(Token::RParen); chars.next(); }
            other =&gt; panic!("不认识的字符: {other}"),
        }
    }
    tokens
}</code></pre>
      </div>
    </details>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">🌳 语法分析：递归下降，让优先级自动正确</div>
    <p class="ms-goal">目标：Token 流 → 表达式树。1 + 2 * 3 必须长成 1 + (2 * 3)，而不是 (1 + 2) * 3。</p>
    <p>人话提示：三层函数层层委托：<code class="ic">expr</code>（管加减）→ <code class="ic">term</code>（管乘除）→ <code class="ic">factor</code>（管数字/括号）。<b>因为 term 先被调用、把乘除先消化掉，加减只能「包在外面」——优先级就这样天然成立</b>，一行特判都不用写。树的节点递归引用自己？<code class="ic">Box::new</code> 封底（第 15 章）。</p>
    <details class="ref-impl"><summary>📖 参考实现（Expr + Parser）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 语法树与递归下降</span></div>
<pre><code data-lang="rust">#[derive(Debug)]
enum Expr {
    Num(f64),
    Var(String),
    Bin(char, Box&lt;Expr&gt;, Box&lt;Expr&gt;),   // Box:递归类型必须封底
}

struct Parser {
    tokens: Vec&lt;Token&gt;,
    pos: usize,
}

impl Parser {
    fn new(tokens: Vec&lt;Token&gt;) -&gt; Self {
        Parser { tokens, pos: 0 }
    }

    fn peek(&amp;self) -&gt; Option&lt;&amp;Token&gt; {
        self.tokens.get(self.pos)
    }

    fn eat(&amp;mut self) -&gt; Token {
        let t = self.tokens[self.pos].clone();
        self.pos += 1;
        t
    }

    fn expr(&amp;mut self) -&gt; Expr {          // 加减层:最低优先级
        let mut left = self.term();
        loop {
            match self.peek() {
                Some(Token::Op('+')) | Some(Token::Op('-')) =&gt; {
                    let Token::Op(op) = self.eat() else { break };
                    let right = self.term();
                    left = Expr::Bin(op, Box::new(left), Box::new(right));
                }
                _ =&gt; break,
            }
        }
        left
    }

    fn term(&amp;mut self) -&gt; Expr {          // 乘除层:更高优先级
        let mut left = self.factor();
        loop {
            match self.peek() {
                Some(Token::Op('*')) | Some(Token::Op('/')) =&gt; {
                    let Token::Op(op) = self.eat() else { break };
                    let right = self.factor();
                    left = Expr::Bin(op, Box::new(left), Box::new(right));
                }
                _ =&gt; break,
            }
        }
        left
    }

    fn factor(&amp;mut self) -&gt; Expr {         // 数字/变量/括号:最高优先级
        match self.eat() {
            Token::Num(n) =&gt; Expr::Num(n),
            Token::Ident(name) =&gt; Expr::Var(name),
            Token::LParen =&gt; {
                let e = self.expr();   // 括号里重新走一遍完整规则
                self.eat();            // 吃掉右括号(信任输入版)
                e
            }
            t =&gt; panic!("意料之外的 token: {t:?}"),
        }
    }
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 1、2、4、5 关。</p>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">🧮 求值：match 走树</div>
    <p class="ms-goal">目标：表达式树 → 一个数字。</p>
    <p>人话提示：递归 eval——Num 直接给数，Bin 把左右算好再按运算符合并。变量查 env（HashMap），查不到给 NAN（学第 10 章的 unwrap_or 用法）。</p>
    <details class="ref-impl"><summary>📖 参考实现（eval + run_line）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 eval + 变量支持</span></div>
<pre><code data-lang="rust">use std::collections::HashMap;

fn eval(e: &amp;Expr, env: &amp;HashMap&lt;String, f64&gt;) -&gt; f64 {
    match e {
        Expr::Num(n) =&gt; *n,
        Expr::Var(name) =&gt; *env.get(name).unwrap_or(&amp;f64::NAN),
        Expr::Bin(op, l, r) =&gt; {
            let (l, r) = (eval(l, env), eval(r, env));
            match op {
                '+' =&gt; l + r,
                '-' =&gt; l - r,
                '*' =&gt; l * r,
                '/' =&gt; l / r,
                _ =&gt; panic!("未知运算符 {op}"),
            }
        }
    }
}

fn run_line(line: &amp;str, env: &amp;mut HashMap&lt;String, f64&gt;) {
    let line = line.trim();
    if line.is_empty() { return; }
    if let Some(rest) = line.strip_prefix("let ") {          // let a = 2
        if let Some((name, expr)) = rest.split_once('=') {
            let value = eval(&amp;Parser::new(lex(expr.trim())).expr(), env);
            env.insert(name.trim().to_string(), value);
            println!("{:?} = {}", name.trim(), value);
            return;
        }
    }
    println!("{}", eval(&amp;Parser::new(lex(line)).expr(), env));  // 普通表达式
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 3、6、7 关。</p>
  </div>

  <div class="ms-card" data-no="第 4 步">
    <div class="ms-title">🚀 整装试跑（Playground 真跑版）</div>
    <p class="ms-goal">目标：完整程序跑起来，亲眼看到 7、9、2、20。</p>
    <div class="pg-wrap" data-pg="p5-calc"></div>
    <p class="compare-note">预期输出（模拟控制台也有）：</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 终端剧场</span><button class="btn-run" data-run="p5-theater">▶ 播放</button></div>
<pre><code data-lang="rust">$ cargo run
1 + 2 * 3
(1 + 2) * 3
let a = 2
a * (a + 8)</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>

  <div class="ms-card" data-no="第 5 步">
    <div class="ms-title">🧪 测试与下一步</div>
    <p class="ms-goal">目标：给优先级、变量写断言；再给自己留一张改造清单。</p>
    <p>人话提示：lex/parser/eval 全是纯函数——测试就是「喂输入、断输出」。改造清单（每一条都是下一等级的语言特性）：① 比较与 bool → ② if 表达式 → ③ 函数定义 let f(x) = ... → ④ 把 panic! 换成 Result（真语言的错误处理）→ ⑤ 读《Crafting Interpreters》继续造。你已经一只脚踩进「语言实现」的门口了。</p>
    <details class="ref-impl"><summary>📖 参考实现（测试）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 #[cfg(test)]</span></div>
<pre><code data-lang="rust">#[cfg(test)]
mod tests {
    use super::*;

    fn calc(src: &amp;str) -&gt; f64 {
        let mut env = HashMap::new();
        eval(&amp;Parser::new(lex(src)).expr(), &amp;mut env)
    }

    #[test]
    fn priority() {
        assert_eq!(calc("1 + 2 * 3"), 7.0);      // 先乘除
        assert_eq!(calc("(1 + 2) * 3"), 9.0);   // 括号压过一切
    }

    #[test]
    fn variables() {
        let mut env = HashMap::new();
        env.insert("a".to_string(), 2.0);
        assert_eq!(eval(&amp;Parser::new(lex("a * (a + 8)")).expr(), &amp;mut env), 20.0);
    }
}</code></pre>
      </div>
    </details>
  </div>`,

  quiz: [
    {
      q: "为什么 1 + 2 * 3 自动解析成 1 + (2 * 3)？",
      opts: ["expr 层先把加减消化掉,乘除下放给 term 层先处理", "运气好", "lexer 里排过序", "乘法写在语法前面"],
      ans: 0,
      exp: "递归下降的魔法：expr 调 term，term 调 factor——越先被调用的层优先级越高。乘除在 term 层先组装完毕，加减只能把它们当「已完成的项」用。优先级是架构给的，不是特判给的。",
    },
    {
      q: "Expr 枚举为什么必须用 Box？",
      opts: ["递归类型要 Box 封底,否则大小无限算不出来", "Box 更快", "惯例而已", "为了能 clone"],
      ans: 0,
      exp: "Expr 里装着 Expr，套娃无底——编译器算不出大小直接 E0072。Box<Expr> 把子节点放堆上，栈里只留固定大小的门牌。第 15 章的知识点在真实项目里出现。",
    },
    {
      q: "预测：eval 解析后的 (1 + 2) * 3 等于？",
      opts: ["7", "9", "12", "编译错误"],
      ans: 1,
      exp: "括号在 factor 层重新调用完整 expr，整段 (1+2) 先算成 3，再 * 3 = 9。同一个引擎，两种括号写法两个答案——优先级实现正确的铁证。",
    },
    {
      q: "「递归下降」的思路是？",
      opts: ["从最外层语法规则(expr)开始,层层调用更细的规则(term/factor)", "从最后一个字符倒着读", "用正则一把梭", "随机选择分支"],
      ans: 0,
      exp: "每层函数管一种优先级的运算，遇到更细粒度的就递归下放。语法规则的层级 = 函数调用的层级——这是全业界编译器/解释器的标配思路，Python 解释器也这么干。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "let e = Expr::Bin('+', Box::new(Expr::Num(1.0)), Box::new(Expr::Num(2.0)));",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 0,
      exp: "标准姿势：子节点都用 Box::new 包起来递归挂树上。match 取值时用 Expr::Bin(op, l, r) 拆包，l、r 自动是 &Box<Expr>，再递归 eval。",
    },
    {
      q: "env: HashMap<String, f64> 在解释器里存的是什么？",
      opts: ["变量名 → 值 的映射(let a = 2 就写进去)", "环境变量", "报错日志", "输入缓存"],
      ans: 0,
      exp: "「环境」= 当前作用域里所有变量的档案柜。eval 遇到 Var(name) 就来查表；查不到给 NAN——真实语言会报「未定义变量」，改造清单第 4 项就是把它换成优雅的 Result 错误。",
    },
    {
      q: "预测：let a = 2 之后执行 a * (a + 8) 输出？",
      opts: ["8", "10", "20", "24"],
      ans: 2,
      exp: "a = 2：2 * (2 + 8) = 20。恭喜——如果你的实现也输出 20，说明你的语言已经支持变量了。🧠",
    },
  ],

  run: {
    "p5-theater": ["$ cargo run", "7", "9", "\"a\" = 2", "20"],
  },
});

/* ════════════ 支线 · 终端贪吃蛇 ════════════ */
R.registerChapter({
  key: "snake", order: 45, part: 3, icon: "🕹", title: "支线贪吃蛇",
  eyebrow: "隐藏支线 · 徽章待领：🕹 藏镜人",
  req: "p5",
  bonus: 50,

  html: `
  <p class="lead">隐藏关卡解锁！<b>终端贪吃蛇</b>——趣味支线，不做也毕业，做了加冕 🕹 藏镜人。Ferris 当蛇头，贝壳当食物。你将学到「游戏循环」这个万金油架构：读输入 → 更新状态 → 渲染，写什么游戏都这三板斧。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · rust-snake</h4>
    <p><b>成品：</b>终端里的贪吃蛇，wasd 移动、q 退出、吃 🐚 得分、蛇头是 🦀。</p>
    <p><b>难度：</b><span class="stars">★★★★☆</span> · <b>规模：</b>~90 行 · <b>环境：</b><b>本地运行</b>（Playground 里没有真终端）</p>
    <div class="prereq">
      <span>前置：ch8 struct</span><span>ch16 线程思想</span><span>ch7 Vec</span>
    </div>
  </div>

  <div class="local-note">💻 运行方法：<code class="ic">cargo new snake &amp;&amp; cd snake</code> → Cargo.toml 加 <code class="ic">crossterm = "0.27"</code> 和 <code class="ic">rand = "0.8"</code> → 贴代码 → <code class="ic">cargo run</code> 开玩。</div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">🎮 游戏状态：先想清楚「数据长什么样」</div>
    <p class="ms-goal">目标：定义蛇、方向、食物、分数、存活状态。</p>
    <p>人话提示：蛇 = <code class="ic">Vec&lt;(i16, i16)&gt;</code> 坐标列表（头在下标 0）；方向 = (dx, dy)；食物随机落在不压到蛇身的地方。先定数据、再写逻辑——Rust 的 struct 会逼你把「状态」想清楚，这是写游戏最大的美德。</p>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">🔄 主循环：输入 → 更新 → 渲染</div>
    <p class="ms-goal">目标：一秒钟约 8 帧的循环跑起来。</p>
    <p>人话提示：<code class="ic">event::poll(Duration::from_millis(120))</code> 是精髓——最多等 120ms 看有没有按键，没有就继续跑（这同时就是帧率）。渲染用 crossterm 的 <code class="ic">MoveTo + Print</code> 在指定坐标画字，每帧全屏重画（90 行的游戏不讲究）。</p>
    <p class="compare-note">玩起来的感觉（模拟控制台）：</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 终端剧场</span><button class="btn-run" data-run="snake-theater">▶ 播放</button></div>
<pre><code data-lang="rust">$ cargo run
[游戏画面省略… 螃蟹吃得很欢]
[游戏结束]</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">💀 判定：撞墙、咬自己、吃食物</div>
    <p class="ms-goal">目标：新头算出来之后，三种命运都处理对。</p>
    <p>人话提示：出界或 <code class="ic">snake.contains(&amp;head)</code> 咬到自己 → 游戏结束；头 == 食物 → 分数 +1 且不 pop（尾巴变长）；其余 → pop 尾巴保持长度。反向守卫（<code class="ic">if dir.1 == 0</code>）防止 180 度掉头咬脖子。</p>
    <details class="ref-impl"><summary>📖 完整参考实现（~90 行）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use crossterm::{
    cursor::{Hide, MoveTo, Show},
    event::{self, Event, KeyCode},
    execute,
    style::Print,
    terminal::{self, Clear, ClearType},
};
use rand::Rng;
use std::io::{stdout, Write};
use std::time::Duration;

const W: i16 = 24;
const H: i16 = 16;

fn random_food(snake: &amp;[(i16, i16)]) -&gt; (i16, i16) {
    let mut rng = rand::thread_rng();
    loop {
        let f = (rng.gen_range(0..W), rng.gen_range(0..H));
        if !snake.contains(&amp;f) {
            return f;   // 不压到蛇身才算数
        }
    }
}

fn main() {
    let mut out = stdout();
    terminal::enable_raw_mode().unwrap();
    execute!(out, Hide, Clear(ClearType::All)).unwrap();

    let mut snake = vec![(5i16, 5i16)];
    let mut dir = (1i16, 0i16);
    let mut food = random_food(&amp;snake);
    let mut score: u32 = 0;
    let mut alive = true;

    'game: while alive {
        // 1. 输入:最多等 120ms
        if event::poll(Duration::from_millis(120)).unwrap() {
            if let Ok(Event::Key(k)) = event::read() {
                match k.code {
                    KeyCode::Char('w') if dir.1 == 0 =&gt; dir = (0, -1),
                    KeyCode::Char('s') if dir.1 == 0 =&gt; dir = (0, 1),
                    KeyCode::Char('a') if dir.0 == 0 =&gt; dir = (-1, 0),
                    KeyCode::Char('d') if dir.0 == 0 =&gt; dir = (1, 0),
                    KeyCode::Char('q') | KeyCode::Esc =&gt; break 'game,
                    _ =&gt; {}
                }
            }
        }

        // 2. 更新
        let head = (snake[0].0 + dir.0, snake[0].1 + dir.1);
        if head.0 &lt; 0 || head.0 &gt;= W || head.1 &lt; 0 || head.1 &gt;= H || snake.contains(&amp;head) {
            alive = false;
            break;
        }
        snake.insert(0, head);
        if head == food {
            score += 1;
            food = random_food(&amp;snake);   // 吃到:不 pop 尾巴 = 变长
        } else {
            snake.pop();
        }

        // 3. 渲染
        execute!(out, Clear(ClearType::All), MoveTo(0, 0)).unwrap();
        for (i, seg) in snake.iter().enumerate() {
            let ch = if i == 0 { "🦀" } else { "▪" };
            execute!(out, MoveTo(seg.0 as u16 * 2, seg.1 as u16), Print(ch)).unwrap();
        }
        execute!(out, MoveTo(food.0 as u16 * 2, food.1 as u16), Print("🐚")).unwrap();
        execute!(
            out,
            MoveTo(0, H as u16),
            Print(format!("分数: {score}  (wasd 移动, q 退出)")),
            MoveTo(0, 0)
        ).unwrap();
        out.flush().unwrap();
    }

    execute!(out, MoveTo(0, H as u16 + 2), Show, Print(format!("游戏结束! 最终分数: {score}"))).unwrap();
    terminal::disable_raw_mode().unwrap();
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验全部 5 关。改造清单：穿墙模式 → 蛇身变色 → 随长度加速 → 高分榜存文件。</p>
  </div>`,

  quiz: [
    {
      q: "游戏主循环每一帧依次做哪三件事？",
      opts: ["读输入 → 更新状态 → 渲染画面", "渲染 → 输入 → 存档", "更新 → 渲染 → 输入", "顺序无所谓"],
      ans: 0,
      exp: "这三板斧是所有游戏的骨架（Python 的 pygame 也一样）。本课把它拆在三个注释块里——对着看一遍，以后写什么游戏都是它。",
    },
    {
      q: "新蛇头算出后，snake.contains(&head) 判定的是？",
      opts: ["是否撞到自己身体", "是否吃到食物", "是否撞墙", "是否到边界"],
      ans: 0,
      exp: "撞墙在前面用坐标范围判过；自撞用 contains 查新头是否压在身体上。Vec::contains 和 Python 的 `in` 一个意思。",
    },
    {
      q: "event::poll(Duration::from_millis(120)) 的作用是？",
      opts: ["最多等 120ms 看有没有按键,没有就继续 → 顺便当帧率", "固定睡 120ms", "超时就报错", "网络延迟检测"],
      ans: 0,
      exp: "非阻塞输入的精髓：有按键立刻处理，没按键就当这一帧过了——120ms 一帧 ≈ 每秒 8 帧。想加速把数字调小。",
    },
    {
      q: "为什么蛇头不能直接 180 度反向？",
      opts: ["会瞬间穿过自己的脖子,判定不公平 → 用 if dir.x == 0 守卫挡住", "反向会头晕", "编译器禁止", "没有原因,纯粹习惯"],
      ans: 0,
      exp: "反向 = 新头直接咬中原来的脖子。守卫条件（当前方向没有横向分量才允许改横向）是贪吃蛇的祖传代码。",
    },
    {
      q: "rand 这个 crate 在项目里负责什么？",
      opts: ["生成不与蛇身重叠的随机食物坐标", "让游戏更快", "画图", "存档"],
      ans: 0,
      exp: "thread_rng().gen_range(0..W) 随机一个坐标，如果压到蛇身就重摇。crates.io 的一亿下载量选手，你的第二个外部依赖。",
    },
  ],

  run: {
    "snake-theater": [
      "$ cargo run",
      "[游戏画面… 螃蟹吃得很欢]",
      "分数: 12  (wasd 移动, q 退出)",
      "",
      "游戏结束! 最终分数: 12 🦀",
    ],
  },
});

/* ════════════ 终极毕业 ════════════ */
R.registerChapter({
  key: "grand", order: 46, part: 3, icon: "🏆", title: "终极毕业",
  eyebrow: "终极关卡 · 徽章待领：🏆 Rustacean",
  req: "p5",
  bonus: 100,

  html: `
  <p class="lead">5 个主线项目全部交付——你写过的 Rust 代码量，已经超过了大多数自称「学过 Rust」的人。这是最后一步：领取属于你的名字与称号。</p>

  <div class="cert">
    <div class="cert-icon">🏆</div>
    <div class="cert-title">锈岛终极毕业证书</div>
    <div class="cert-body">
      兹证明 <input id="gdName" class="cert-name" placeholder="点这里写下你的名字"> ，<br>
      走完岛上三部曲的主线、亲手完成 5 个真项目，<br>
      以 <b id="gdXp">0</b> XP 的战绩、一发命中率 <b id="gdAcc">0%</b>，加冕：
    </div>
    <div class="cert-rank big">「 Rustacean 🦀 」</div>
    <div class="cert-badges" id="gdBadges"></div>
    <button class="btn gd-claim" data-claim="grand">领取终极毕业证书</button>
    <div class="cert-foot">锈岛求生 · Rust for Pythonistas · 全岛通关纪念</div>
  </div>

  <p class="grand-tip">支线 🕹 终端贪吃蛇、🕸 裸写 Web 服务器仍在等你（可选，不影响毕业）。</p>

  <div class="card next-steps" style="margin-top:22px">
    <h3 class="sec-title">📖 全书 ↔ 官方书对照表</h3>
    <p>锈岛是练兵场，官方书是藏书阁——把这张表收好，每读一章原文，功力再进一层：</p>
    <table class="cmp-table">
      <tr><th>锈岛站点</th><th>官方书章节</th></tr>
      <tr><td>序章 / 变量 / 类型 / 函数 / 控制流</td><td><a href="https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html" target="_blank" rel="noopener">第 3 章 Common Concepts</a></td></tr>
      <tr><td>所有权</td><td><a href="https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html" target="_blank" rel="noopener">第 4 章 Ownership</a>（含 4.2 引用借用 / 4.3 切片）</td></tr>
      <tr><td>热身 · 猜数字</td><td><a href="https://doc.rust-lang.org/book/ch02-00-guessing-game-tutorial.html" target="_blank" rel="noopener">第 2 章 Guessing Game</a></td></tr>
      <tr><td>struct 数据公民</td><td><a href="https://doc.rust-lang.org/book/ch05-00-structs.html" target="_blank" rel="noopener">第 5 章 Using Structs</a></td></tr>
      <tr><td>enum + match / Option</td><td><a href="https://doc.rust-lang.org/book/ch06-00-enums.html" target="_blank" rel="noopener">第 6 章 Enums and Pattern Matching</a></td></tr>
      <tr><td>Cargo 工程化</td><td><a href="https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html" target="_blank" rel="noopener">第 7 章 Packages, Crates, Modules</a> + <a href="https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html" target="_blank" rel="noopener">第 14 章 More Cargo</a></td></tr>
      <tr><td>字符串真相 / 集合背包</td><td><a href="https://doc.rust-lang.org/book/ch08-00-common-collections.html" target="_blank" rel="noopener">第 8 章 Common Collections</a></td></tr>
      <tr><td>Result 错误处理</td><td><a href="https://doc.rust-lang.org/book/ch09-00-error-handling.html" target="_blank" rel="noopener">第 9 章 Error Handling</a></td></tr>
      <tr><td>trait 与泛型 / 智能指针</td><td><a href="https://doc.rust-lang.org/book/ch10-00-generics.html" target="_blank" rel="noopener">第 10 章 Generics, Traits, Lifetimes</a> + <a href="https://doc.rust-lang.org/book/ch15-00-smart-pointers.html" target="_blank" rel="noopener">第 15 章 Smart Pointers</a></td></tr>
      <tr><td>测试之道（Cargo 18.4~18.7）</td><td><a href="https://doc.rust-lang.org/book/ch11-00-testing.html" target="_blank" rel="noopener">第 11 章 Writing Automated Tests</a></td></tr>
      <tr><td>闭包 / 迭代器</td><td><a href="https://doc.rust-lang.org/book/ch13-00-functional-features.html" target="_blank" rel="noopener">第 13 章 Iterators and Closures</a></td></tr>
      <tr><td>多线程 / async</td><td><a href="https://doc.rust-lang.org/book/ch16-00-concurrency.html" target="_blank" rel="noopener">第 16 章 Fearless Concurrency</a> + <a href="https://doc.rust-lang.org/book/ch17-00-async-await.html" target="_blank" rel="noopener">第 17 章 Async and Await</a></td></tr>
      <tr><td>P1 / P2 实战</td><td><a href="https://doc.rust-lang.org/book/ch12-00-an-io-project.html" target="_blank" rel="noopener">第 12 章 I/O Project (minigrep)</a></td></tr>
      <tr><td>支线 · 裸写 Web 服务器</td><td><a href="https://doc.rust-lang.org/book/ch21-00-final-project-a-web-server.html" target="_blank" rel="noopener">第 21 章 Final Project (Web Server)</a></td></tr>
    </table>
    <p style="margin-top:14px;font-size:13.5px;color:var(--muted)">进阶路线图：第 18 章 <a href="https://doc.rust-lang.org/book/ch18-00-oop.html" target="_blank" rel="noopener">OOP 与状态模式</a> · 第 19 章 <a href="https://doc.rust-lang.org/book/ch19-00-patterns.html" target="_blank" rel="noopener">Patterns and Matching 全解</a> · 第 20 章 <a href="https://doc.rust-lang.org/book/ch20-00-advanced-features.html" target="_blank" rel="noopener">Advanced Features（unsafe / macros）</a> ——锈岛教前置，这三章是下一段山路。</p>
  </div>

  <div class="card next-steps">
    <h3 class="sec-title">🧭 Rustacean 的下一程（真实世界入口）</h3>
    <ul class="points">
      <li><b>读透官方书：</b><a href="https://kaisery.github.io/trpl-zh-cn/" target="_blank" rel="noopener">《Rust 程序设计语言》中文版</a> — 你已具备读懂它的一切前置知识</li>
      <li><b>刷完 rustlings：</b><a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">rustlings</a> — 官方小练习集，补肌肉记忆</li>
      <li><b>作品集：</b>把 P1~P5 传上 GitHub，README 写清楚「为什么用 Rust」——5 个项目比任何证书都有说服力</li>
      <li><b>读好代码：</b>看你天天用的库的源码（serde、axum、ripgrep），Rust 的公开代码质量是出了名的高</li>
      <li><b>开源第一步：</b>找 rust 生态里带 <code class="ic">good first issue</code> 标签的任务下手</li>
    </ul>
    <p class="card-note">这门课教的不是 Rust 的全部，而是「读懂剩下那部分的全部前置」。从今天起，遇到任何 Rust 代码，你都有能力看懂、修改、掌控。锈途愉快，Rustacean。🦀</p>
  </div>`,

  onComplete() {
    fillGrand();
    window.RUST_ISLAND.confetti(200);
    setTimeout(() => window.RUST_ISLAND.confetti(120), 800);
    window.RUST_ISLAND.ferrisSay("全岛通关！欢迎加入 Rustacean 大家族 🦀🏆");
  },
  onRestore() { fillGrand(); },
});

/* ─────────── 终极证书逻辑 ─────────── */
function fillGrand() {
  const s = window.RUST_ISLAND.stats();
  document.getElementById("gdXp").textContent = s.xp;
  document.getElementById("gdAcc").textContent = s.total ? Math.round((s.hits / s.total) * 100) + "%" : "0%";
  document.getElementById("gdBadges").textContent = `🏅 ${s.badges} / ${s.badgeTotal} 枚徽章`;
  const btn = document.querySelector("#grand .gd-claim");
  if (window.RUST_ISLAND.isDone("grand")) {
    btn.textContent = "✅ 证书已领取";
    btn.disabled = true;
    btn.style.opacity = ".55";
  }
  const nameInput = document.getElementById("gdName");
  if (s.name && !nameInput.value) nameInput.value = s.name;
}

/* 名字输入:事件委托(动态生成的 DOM) */
document.addEventListener("input", (e) => {
  if (e.target && e.target.id === "gdName") {
    window.RUST_ISLAND.setName(e.target.value);
  }
});

})();
