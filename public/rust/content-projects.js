/* ═══════════════════════════ 锈岛求生 2.0 · 第三部 实战大陆(P1~P2) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════════ P1 · 待办清单 CLI ════════════ */
R.registerChapter({
  key: "p1", order: 40, part: 3, partTitle: "第三部 · 实战大陆", icon: "🔧", title: "P1 待办清单",
  eyebrow: "实战 1 · 徽章待领：🔧 青铜工兵",
  bonus: 50,

  html: `
  <p class="lead">热身项目：<b>命令行待办清单 todo-rs</b>。别小看它——一个项目里把 enum 分发、struct、Vec、Option、错误处理全部串起来，还教你加第一个外部依赖。做完它，你就「会写 Rust 程序」了。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · todo-rs</h4>
    <p><b>成品：</b><code class="ic">cargo run -- add 买蟹粮 / list / done 1</code> 的命令行工具，数据持久化到文件。</p>
    <p><b>难度：</b><span class="stars">★★☆☆☆</span> · <b>规模：</b>~250 行 · <b>环境：</b>支持 Playground 试跑（持久化部分需本地）</p>
    <div class="prereq">
      <span>前置：ch8 struct</span><span>ch9 enum/match</span><span>ch7 Vec</span><span>ch10 Option</span><span>ch11 Result</span><span>ch18 cargo</span>
    </div>
  </div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">🚪 开工：搭骨架、读命令行参数</div>
    <p class="ms-goal">目标：运行 <code class="ic">cargo run -- add 买蟹粮</code>，程序能正确「看见」你敲了什么。</p>
    <p>人话提示：Python 的 <code class="ic">sys.argv</code> 在 Rust 叫 <code class="ic">std::env::args()</code>。它第一个元素是程序自己的路径，所以要 <code class="ic">skip(1)</code> 跳过——然后 collect 成 Vec。</p>
    <div class="pg-wrap" data-pg="p1-args"></div>
    <details class="ref-impl"><summary>📖 参考实现（先自己写 15 分钟，卡住再看）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use std::env;

fn main() {
    let args: Vec&lt;String&gt; = env::args().skip(1).collect();
    println!("收到的参数: {args:?}");
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 1 关。</p>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">🎯 命令分发：enum + match 当指挥官</div>
    <p class="ms-goal">目标：把参数解析成三种命令之一：List / Add(标题) / Done(编号)。</p>
    <p>人话提示：别用 if-else 瀑布流！定义一个 <code class="ic">enum Command</code>，然后 match 参数切片。Rust 的「切片模式」能一次匹配长度和内容：<code class="ic">[cmd, title] if cmd == "add"</code> 直接把第二个参数绑到 title 上——比 Python 手写 args[1] 优雅得多。</p>
    <div class="pg-wrap" data-pg="p1-parse"></div>
    <details class="ref-impl"><summary>📖 参考实现</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use std::env;

#[derive(Debug)]
enum Command {
    List,
    Add(String),
    Done(usize),
}

fn parse(args: &amp;[String]) -&gt; Command {
    match args {
        [cmd, title] if cmd == "add" =&gt; Command::Add(title.clone()),     // 切片模式:连绑带取
        [cmd, n] if cmd == "done" =&gt; Command::Done(n.parse().unwrap_or(0)),
        _ =&gt; Command::List,                                 // 没参数就列清单
    }
}

fn main() {
    let args: Vec&lt;String&gt; = env::args().skip(1).collect();
    println!("{:?}", parse(&amp;args));
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 2 关。</p>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">📦 数据成型：Task struct + Vec 仓库</div>
    <p class="ms-goal">目标：add 能存任务、list 能打印（带序号和完成状态）、done 能标记完成。</p>
    <p>人话提示：Task struct（title + done）；list 时 <code class="ic">enumerate()</code> 给你序号（第 13 章）；done 时 <code class="ic">get_mut(n-1)</code> 拿可变借用改 done——编号不存在时走 None 分支，绝不 panic（第 10 章）。</p>
    <div class="pg-wrap" data-pg="p1-crud"></div>
    <p class="compare-note">感受一下真实使用节奏（模拟控制台）：</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 终端剧场</span><button class="btn-run" data-run="p1-theater">▶ 播放</button></div>
<pre><code data-lang="rust">$ cargo run -- add 买蟹粮
$ cargo run -- add 学完第 8 章
$ cargo run -- list
$ cargo run -- done 1
$ cargo run -- list</code></pre>
      <div class="console" hidden></div>
    </div>
    <details class="ref-impl"><summary>📖 参考实现（本步核心逻辑）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 main 里的 match</span></div>
<pre><code data-lang="rust">match parse(&amp;args) {
    Command::List =&gt; {
        if tasks.is_empty() {
            println!("没有任务,先 add 一条吧!");
        }
        for (i, t) in tasks.iter().enumerate() {
            println!("{}. [{}] {}", i + 1, if t.done { "✅" } else { "·" }, t.title);
        }
    }
    Command::Add(title) =&gt; {
        tasks.push(Task { title, done: false });
        println!("已添加: {}", tasks.last().unwrap().title);
    }
    Command::Done(n) =&gt; {
        if n == 0 {
            println!("用法: todo done &lt;编号&gt;");
        } else {
            match tasks.get_mut(n - 1) {
                Some(t) =&gt; {
                    t.done = true;
                    println!("完成: {}", t.title);
                }
                None =&gt; println!("没有第 {n} 号任务"),
            }
        }
    }
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 3、4 关。</p>
  </div>

  <div class="ms-card" data-no="第 4 步">
    <div class="ms-title">💾 持久化：重启不丢数据</div>
    <p class="ms-goal">目标：程序退出前存文件、启动时读回来——关掉重开，清单还在。</p>
    <p>人话提示：<code class="ic">fs::read_to_string</code> 读不到文件？第一次运行当然没有文件，用 match 降级成空清单（第 11 章的「错误是生活」）。格式用最朴素的 <code class="ic">状态|标题</code> 一行一条，解析时 <code class="ic">split_once</code> 返回 Option，接 filter_map 一行过滤脏数据——迭代器和 Option 联手的高光时刻。</p>
    <div class="local-note">💻 本步骤请<b>本地运行</b>（Playground 沙箱写不了文件）：装好 rustup 后 <code class="ic">cargo new todo_rs &amp;&amp; cd todo_rs</code>，把代码贴进 src/main.rs，<code class="ic">cargo run -- add 试试</code>。</div>
    <details class="ref-impl"><summary>📖 参考实现（load / save）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs 片段</span></div>
<pre><code data-lang="rust">use std::fs;

fn load() -&gt; Vec&lt;Task&gt; {
    match fs::read_to_string("todo.txt") {
        Ok(text) =&gt; text
            .lines()
            .filter_map(|line| {
                let (state, title) = line.split_once('|')?;   // 解析不了就跳过这行
                Some(Task { title: title.to_string(), done: state == "1" })
            })
            .collect(),
        Err(_) =&gt; vec![],   // 文件不存在 = 第一次运行 = 空清单
    }
}

fn save(tasks: &amp;[Task]) {
    let text: String = tasks
        .iter()
        .map(|t| format!("{}|{}", if t.done { 1 } else { 0 }, t.title))
        .collect::&lt;Vec&lt;_&gt;&gt;()
        .join("\n");
    fs::write("todo.txt", text).expect("保存失败");
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 5 关。</p>
  </div>

  <div class="ms-card" data-no="第 5 步">
    <div class="ms-title">🧰 升级：serde_json + 单元测试</div>
    <p class="ms-goal">目标：① 用 serde 存 JSON 代替手写格式；② 给核心逻辑补上 <code class="ic">#[test]</code>。</p>
    <p>人话提示：这是你的<b>第一个外部依赖</b>——Cargo.toml 里声明 serde 和 serde_json，cargo 自动下载编译（crates.io ≈ PyPI，第 18 章）。<code class="ic">#[derive(Serialize, Deserialize)]</code> 一行，struct ↔ JSON 双向自动转换，告别手写解析。</p>
    <div class="local-note">💻 本步骤本地运行。Cargo.toml 加依赖：</div>
    <div class="code-box">
      <div class="code-lang"><span>📦 Cargo.toml</span></div>
<pre><code data-lang="rust">[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"</code></pre>
    </div>
    <details class="ref-impl"><summary>📖 参考实现（serde 版 load / save）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs 片段</span></div>
<pre><code data-lang="rust">use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]   // 多两个证件,自动变 JSON
struct Task {
    title: String,
    done: bool,
}

fn load() -&gt; Vec&lt;Task&gt; {
    fs::read_to_string("todo.json").ok()                 // Option&lt;String&gt;
        .and_then(|t| serde_json::from_str(&amp;t).ok())     // Option&lt;Vec&lt;Task&gt;&gt;
        .unwrap_or_default()                              // 兜底:空清单
}

fn save(tasks: &amp;[Task]) {
    let json = serde_json::to_string_pretty(tasks).unwrap();
    fs::write("todo.json", json).expect("保存失败");
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 6 关。写完顺手 <code class="ic">cargo clippy</code>，请资深同事过目。</p>
  </div>`,

  quiz: [
    {
      q: "parse(&[\"add\", \"学 Rust\"]) 返回什么？",
      opts: ['Command::Add("学 Rust")', "\"add\"", "Command::List", "panic"],
      ans: 0,
      exp: "切片模式 [\"add\", title] 同时匹配「长度是 2 + 第一个元素是 add」，并把第二个参数绑定到 title。这一行顶 Python 的 if len(args)>=2 and args[0]==\"add\" 整一段。",
    },
    {
      q: "命令 done abc（不是数字）时，n.parse().unwrap_or(0) 的用意是？",
      opts: ["解析失败就兜底成 0,后面提示用法", "让程序 panic 报错", "自动重试解析", "把 abc 当 0 号任务"],
      ans: 0,
      exp: "unwrap_or(0)：解析失败给 0，后面走「用法提示」分支而不是崩溃。CLI 工具对用户输入要宽容——第 11 章的「错误是生活」落地了。",
    },
    {
      q: "tasks 是空 Vec 时执行 list，输出什么？",
      opts: ["panic", "什么都不打印", "没有任务,先 add 一条吧!", "打印 0."],
      ans: 2,
      exp: "先 is_empty 判断给个友好提示，再进循环。对用户说话，是 CLI 的基本礼貌。",
    },
    {
      q: "done 3 但只有 2 条任务：为什么用 get_mut(n - 1) 而不是 tasks[n - 1]？",
      opts: ["get_mut 返回 Option,越界走 None 分支不崩", "[i] 语法在 Vec 上不存在", "get_mut 更快", "纯粹是个人偏好"],
      ans: 0,
      exp: "tasks[99] 越界直接 panic——CLI 崩了用户会骂街。get_mut 给 Some/None，你优雅地打印「没有第 3 号任务」。这就是第 10 章的意义。",
    },
    {
      q: "load() 里 Err(_) => vec![] 的含义是？",
      opts: ["文件读不了就当空清单,程序照常跑", "读不了就报错退出", "打印警告后退出", "无限重试直到读到"],
      ans: 0,
      exp: "第一次运行必然没有存档文件——这不是 bug，是新用户的日常。错误处理是「降级方案」，不是「崩溃方案」。",
    },
    {
      q: "#[derive(Serialize, Deserialize)] 的作用是？",
      opts: ["编译器自动生成 struct ↔ JSON 的转换代码", "运行时反射读取字段", "给数据加密", "连接数据库"],
      ans: 0,
      exp: "一行注解，serde 在编译期替你生成序列化/反序列化代码——快、类型安全、零反射。相当于 Python 的 dataclass + json.dumps 全家桶。",
    },
  ],

  run: {
    "p1-theater": [
      "已添加: 买蟹粮",
      "已添加: 学完第 8 章",
      "1. [·] 买蟹粮",
      "2. [·] 学完第 8 章",
      "完成: 买蟹粮",
      "1. [✅] 买蟹粮",
      "2. [·] 学完第 8 章",
    ],
  },
});

/* ════════════ P2 · 文本侦探 ════════════ */
R.registerChapter({
  key: "p2", order: 41, part: 3, icon: "🪙", title: "P2 文本侦探",
  eyebrow: "实战 2 · 徽章待领：🪙 白银侦探",
  bonus: 50,

  html: `
  <p class="lead">第二个项目：<b>词频统计器</b>。给一段文字，数出谁出现最多、画成柱状图、还能导出 CSV / JSON。这是<b>迭代器链的完全体</b>项目——写完你会发现 Rust 的 map/filter/collect 比 Python 推导式还顺手。</p>

  <div class="proj-brief">
    <h4>📋 任务简报 · 文本侦探</h4>
    <p><b>成品：</b>输入任意文本 → 词频 Top-N 柱状图 + CSV/JSON 多格式导出 + 单元测试。</p>
    <p><b>难度：</b><span class="stars">★★★☆☆</span> · <b>规模：</b>~300 行 · <b>环境：</b>Playground 全程可跑</p>
    <div class="prereq">
      <span>前置：ch7 HashMap</span><span>ch9 enum/match</span><span>ch13 迭代器</span><span>ch14 trait</span><span>ch11 Result</span>
    </div>
  </div>

  <div class="ms-card" data-no="第 1 步">
    <div class="ms-title">📖 读文件：错误处理首秀</div>
    <p class="ms-goal">目标：从文件读文本；读不到就优雅报错，不许 panic。</p>
    <p>人话提示：<code class="ic">fs::read_to_string</code> 返回 Result（第 11 章）。Playground 里没有你的文件，所以下面的例子<b>会真的走 Err 分支</b>——亲眼看看 Rust 的失败有多体面。</p>
    <div class="pg-wrap" data-pg="p2-read"></div>
    <details class="ref-impl"><summary>📖 参考实现</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs</span></div>
<pre><code data-lang="rust">use std::fs;

fn load_text(path: &amp;str) -&gt; Result&lt;String, std::io::Error&gt; {
    fs::read_to_string(path)
}

fn main() {
    match load_text("article.txt") {
        Ok(text) =&gt; println!("读到 {} 字节", text.len()),
        Err(e) =&gt; println!("打不开: {e}"),
    }
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 1 关。</p>
  </div>

  <div class="ms-card" data-no="第 2 步">
    <div class="ms-title">✂️ 分词 + 词频：entry API 实战</div>
    <p class="ms-goal">目标：把文本拆成词，HashMap 计数，按次数从高到低排序。</p>
    <p>人话提示：<code class="ic">split_whitespace()</code> 切词（返回 &amp;str，零复制）；计数用 entry（第 7 章）；排序把 HashMap 倒进 Vec 再 <code class="ic">sort_by</code>。三步全是前面章节的直通车。</p>
    <div class="pg-wrap" data-pg="p2-freq"></div>
    <details class="ref-impl"><summary>📖 参考实现（核心函数）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 word_freq:输入文本,输出排好序的 (词, 次数)</span></div>
<pre><code data-lang="rust">use std::collections::HashMap;

fn word_freq(text: &amp;str) -&gt; Vec&lt;(String, i32)&gt; {
    let mut counts: HashMap&lt;&amp;str, i32&gt; = HashMap::new();
    for w in text.split_whitespace() {
        *counts.entry(w).or_insert(0) += 1;   // 词频一行流
    }

    let mut pairs: Vec&lt;(String, i32)&gt; = counts
        .iter()
        .map(|(w, c)| ((*w).to_string(), *c))
        .collect();
    pairs.sort_by(|a, b| b.1.cmp(&amp;a.1));      // 次数降序
    pairs
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 2、3、4 关。</p>
  </div>

  <div class="ms-card" data-no="第 3 步">
    <div class="ms-title">📊 多格式报告：trait 大显身手</div>
    <p class="ms-goal">目标：同一个统计结果，能按三种格式渲染：终端柱状图 / CSV / JSON。</p>
    <p>人话提示：包一个 <code class="ic">struct Report</code>，给方法一个 <code class="ic">mode</code> 参数，match 一下（第 9 章）。柱状图用 <code class="ic">"▍".repeat(n)</code>——对，字符串有 repeat，跟 Python 一样。</p>
    <div class="pg-wrap" data-pg="p2-report"></div>
    <details class="ref-impl"><summary>📖 参考实现（Report）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs 片段</span></div>
<pre><code data-lang="rust">struct Report {
    pairs: Vec&lt;(String, i32)&gt;,
}

impl Report {
    fn render(&amp;self, mode: &amp;str) -&gt; String {
        match mode {
            "csv" =&gt; self.pairs.iter()
                .map(|(w, c)| format!("{w},{c}"))
                .collect::&lt;Vec&lt;_&gt;&gt;()
                .join("\n"),
            "json" =&gt; {
                let items: Vec&lt;String&gt; = self.pairs.iter()
                    .map(|(w, c)| format!("\\"{w}\\": {c}"))
                    .collect();
                format!("{{{}}}", items.join(", "))
            }
            _ =&gt; self.pairs.iter()
                .map(|(w, c)| format!("{w:&lt;6} {}", "▍".repeat(*c as usize)))
                .collect::&lt;Vec&lt;_&gt;&gt;()
                .join("\n"),
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
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 6 关。</p>
  </div>

  <div class="ms-card" data-no="第 5 步(圣经加餐)">
    <div class="ms-title">🔴 stderr 与环境变量:错误信息走专用通道</div>
    <p class="ms-goal">目标:错误信息用 <code class="ic">eprintln!</code> 走 stderr,而不是和正常输出混在 stdout 里;再学一眼环境变量。</p>
    <p>人话提示:终端其实有<b>两条管道</b>——stdout 是「成果输出」,stderr 是「错误专线」。<code class="ic">cargo run &gt; out.txt</code> 重定向到文件时,stdout 进文件,<b>stderr 照常上屏</b>:程序错了你能看到,干净的成果文件也不被污染。</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 两条管道的分工</span></div>
<pre><code data-lang="rust">// 文件打不开?错误走 stderr 专线:
let content = match fs::read_to_string("missing.txt") {
    Ok(text) => text,
    Err(e) => {
        eprintln!("打不开: {e}");    // ← stderr,不混进成果文件
        return;
    }
};
println!("{content}");               // ← stdout,纯成果</code></pre>
    </div>
    <p>顺手一招——<b>环境变量</b>让 CLI 有「隐藏旋钮」:</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 CASE_INSENSITIVE=1 cargo run</span></div>
<pre><code data-lang="rust">let ignore_case = std::env::var("CASE_INSENSITIVE").is_ok();
// 终端里 CASE_INSENSITIVE=1 cargo run → 大小写不敏感
// 不设 → 默认大小写敏感。改行为不用改代码,设个变量就行</code></pre>
    </div>
    <p class="compare-note">这正是官方书 minigrep(第 12 章)压轴的两招:<b>eprintln! 分流 + env::var 隐藏旋钮</b>——CLI 工程的成人礼。自查见通关测验第 7 关。</p>
  </div>

  <div class="ms-card" data-no="第 4 步">
    <div class="ms-title">🧪 测试驱动：纯函数的胜利</div>
    <p class="ms-goal">目标：给 word_freq 补单元测试，<code class="ic">cargo test</code> 一把跑绿。</p>
    <p>人话提示：第 2 步特意把逻辑抽成<b>纯函数</b>——输入定、输出定、不碰文件。这就是它好测的原因：测试里随便喂字符串、随便 assert_eq!（第 18 章）。</p>
    <div class="code-box">
      <div class="code-lang"><span>🦀 终端剧场</span><button class="btn-run" data-run="p2-theater">▶ 播放</button></div>
<pre><code data-lang="rust">$ cargo test
    Finished test [unoptimized + debuginfo] target(s)
     Running unittests</code></pre>
      <div class="console" hidden></div>
    </div>
    <details class="ref-impl"><summary>📖 参考实现（测试）</summary>
      <div class="code-box">
        <div class="code-lang"><span>🦀 src/main.rs 片段</span></div>
<pre><code data-lang="rust">#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn basic_count() {
        let r = word_freq("a b a");
        assert_eq!(r[0], ("a".to_string(), 2));   // a 出现两次,排第一
    }

    #[test]
    fn empty_input() {
        assert!(word_freq("").is_empty());
    }
}</code></pre>
      </div>
    </details>
    <p class="compare-note">自查见通关测验第 5 关。</p>
  </div>`,

  quiz: [
    {
      q: "split_whitespace() 切出来的元素是什么类型？",
      opts: ["&str", "String", "char", "Vec<char>"],
      ans: 0,
      exp: "借用视角 &str——不复制内容，指着原文看。性能好，还顺便复习了第 6 章：想拥有就 .to_string()。",
    },
    {
      q: "entry(w).or_insert(0) 干的是什么事？",
      opts: ["w 不存在就先插入 0", "永远清零", "删除 w", "把 w 排到最前面"],
      ans: 0,
      exp: "「查这个格子，没有就先按我说的造一个」——返回可变引用让你直接 += 1。词频统计一行流的功臣，只查一次哈希。",
    },
    {
      q: "sort_by(|a, b| b.1.cmp(&a.1)) 排出什么顺序？",
      opts: ["次数从高到低", "次数从低到高", "按字母排", "随机"],
      ans: 0,
      exp: "b 和 a 交换位置比较 = 降序。.1 是元组第二个元素（次数）。想升序就写 a.1.cmp(&b.1)。",
    },
    {
      q: "word_freq(\"a b a\") 的第一名是谁？",
      opts: ["(\"a\", 2)", "(\"b\", 2)", "(\"a\", 1)", "不确定,HashMap 随机"],
      ans: 0,
      exp: "a 出现 2 次排第一。注意：a 和 b 次数相同时顺序不保证（HashMap 特性），但「2 次的 a 压过 1 次的 b」永远稳。",
    },
    {
      q: "为什么特意把统计逻辑抽成 word_freq 纯函数？",
      opts: ["输入固定输出固定,不碰 IO,测试直接喂字符串", "看起来专业", "编译器强制要求", "运行速度翻倍"],
      ans: 0,
      exp: "纯函数 = 可测试性。文件读取（IO）留在 main，核心逻辑保持纯净——这是「好测的代码」和「难测的代码」的分水岭，Python 也一样。",
    },
    {
      q: "render(\"csv\") 对 [(\"螃蟹\", 3)] 的输出是？",
      opts: ["螃蟹,3", "螃蟹:3", "{\"螃蟹\": 3}", "[螃蟹, 3]"],
      ans: 0,
      exp: "csv 模式用 format!(\"{w},{c}\") 拼——逗号分隔。同一段数据、同一个函数、三种出口，match 一个参数全搞定。",
    },
    {
      q: "cargo run > out.txt 重定向后,哪条管道进了文件?",
      opts: ["stdout 成果进文件,stderr 错误照常上屏", "全部进文件", "全部不进", "随机一条"],
      ans: 0,
      exp: "stdout 是成果管道,重定向管得着它;stderr 是错误专线,直接上屏——程序出错你看得见,成果文件也保持干净。这就是 eprintln! 存在的意义。",
    },
    {
      q: "std::env::var(\"CASE_INSENSITIVE\") 在变量没设置时返回?",
      opts: ["Err(所以 is_ok() 为 false,天然当开关用)", "Ok(空字符串)", "panic", "None(编译错误)"],
      ans: 0,
      exp: "环境变量也走 Result:没设就 Err,.is_ok() 顺手当布尔开关——一行代码给 CLI 装上隐藏旋钮,改行为不用改代码。",
    },
  ],

  run: {
    "p2-theater": [
      "test tests::basic_count ... ok",
      "test tests::empty_input ... ok",
      "",
      "test result: ok. 2 passed; 0 failed; 0 ignored",
    ],
  },
});

})();
