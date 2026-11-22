/* ═══════════════════════════ 锈岛求生 2.0 · 第一部续写(第 6~11 章) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ══════════ 第 6 章 · 字符串真相 ══════════ */
R.registerChapter({
  key: "ch6", order: 6, part: 1, icon: "🧾", title: "字符串真相",
  eyebrow: "第 6 章 · 徽章待领：🧾 字符串管理员",

  html: `
  <p class="lead">第 3 章和第 5 章各欠了一个悬念：<code class="ic">&amp;str</code> 到底是什么、<code class="ic">&amp;</code> 到底干嘛用。今天连本带利一起还，顺便认识一个 Python 玩家最容易翻车的坑：<b>字节 vs 字符</b>。</p>

  <h3 class="sec-title">两种字符串：两个世界的居民</h3>
  <p>Python 一个 <code class="ic">str</code> 走天下。Rust 偏要给你两种——因为它们对应所有权世界的两种身份：</p>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">s = "hello"        # 一个 str 走天下
t = s              # 再贴一张标签,完了</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span></div>
<pre><code data-lang="rust">let s = "hello";                // &amp;str:字符串字面量,住在只读区
let t = String::from("hello");   // String:在堆上盖了个新房子</code></pre>
    </div>
  </div>
  <div class="concept">
    <h4>🏠 房子与视角</h4>
    <p><b>String = 堆上自己盖的房子</b>：有所有权、可以扩建（追加内容）、可以过户给别人。</p>
    <p><b>&amp;str = 贴在窗户上看风景的视角</b>：只是「借用别人的字符串看一眼」，不拥有任何东西。函数参数写 <code class="ic">&amp;str</code>，就是第 5 章讲的「借用」——悬念回收！</p>
  </div>

  <h3 class="sec-title">互转：参数写 &amp;str 最通用</h3>
  <p>两种字符串互相打通：字面量直接传 <code class="ic">&amp;str</code>；<code class="ic">String</code> 加个 <code class="ic">&amp;</code> 会自动「降级」成 <code class="ic">&amp;str</code>。所以<b>函数参数收 <code class="ic">&amp;str</code>，两种都能传</b>：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch6-greet">▶ 运行</button></div>
<pre><code data-lang="rust">fn greet(name: &amp;str) {
    println!("你好, {name}");
}

fn main() {
    let a = "Ferris";               // &amp;str
    let b = String::from("小蟹");   // String
    greet(a);        // ✅ 字面量直接传
    greet(&amp;b);       // ✅ String 加 &amp; 自动降级成 &amp;str
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">String 能扩建，&amp;str 不能</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch6-build">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let mut s = String::from("rust");   // String:堆上的房子
    s.push_str(" is");                  // 追加字符串 ≈ Python 的 +=
    s.push('!');                        // 追加单个字符
    let full = format!("{s} fun");      // format! ≈ f-string,最灵活的拼接
    println!("{full}");
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p>反过来看，&amp;str 只是视角，没有房子可扩建——硬改它，编译器当场拦下：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch6-push">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    let s = "hello";          // 这是 &amp;str,不是 String
    s.push_str(" world");     // ❌ 视角哪来的 push_str?
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">字节 vs 字符：len() 的陷阱</h3>
  <p>这是 Python 玩家必踩的坑：<b>Rust 的 <code class="ic">len()</code> 数的是字节，不是字符</b>。Python 里 <code class="ic">len("🦀") == 1</code>；Rust 里它是 4——emoji 在 UTF-8 里占 4 个字节：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch6-len">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let c = "🦀";
    println!("{}", c.len());             // 4 —— len 数的是字节!
    println!("{}", c.chars().count());   // 1 —— chars 才是"人类视角"的字符数
    let zh = "螃蟹";
    println!("{}", zh.len());            // 6 —— 两个汉字,每个占 3 字节
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">想按「人类字符」处理字符串，用 <code class="ic">.chars()</code> 遍历；想按字节切，用 <code class="ic">.bytes()</code>。字符串切片 <code class="ic">&amp;s[0..2]</code> 之所以危险（容易把汉字切一半），就是字节视角的锅——新手先记住：<b>别对中文/emoji 字符串随手切下标</b>。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>String</b> = 堆上房子（有所有权、可扩建）；<b>&amp;str</b> = 借用视角（只看不拥有）</li>
      <li>函数参数写 <code class="ic">&amp;str</code> 最通用，String 传 <code class="ic">&amp;s</code> 自动降级</li>
      <li>字面量 → String：<code class="ic">.to_string()</code> / <code class="ic">String::from()</code></li>
      <li><code class="ic">len()</code> 数字节，<code class="ic">chars().count()</code> 数字符——中文和 emoji 是坑</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "编译过不过？",
      type: "compile",
      code: "let mut s = String::from(\"hi\");\ns.push_str(\"!\");",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 0,
      exp: "s 是 String（堆上的房子），加了 mut，push_str 随便扩建，完全合法。",
    },
    {
      q: "预测一下输出：",
      code: "let s = \"🦀\";\nprintln!(\"{}\", s.len());",
      opts: ["1", "2", "4", "编译错误"],
      ans: 2,
      exp: "len() 数字节！🦀 在 UTF-8 里占 4 个字节。想要「1」得用 s.chars().count()。这是 Python 玩家最容易想当然的地方。",
    },
    {
      q: "函数参数想同时接收字面量和 String，写哪种类型最通用？",
      opts: ["String", "&str", "char", "str"],
      ans: 1,
      exp: "字面量本来就是 &str 直接传；String 加个 & 自动降级成 &str。反过来 String 参数收不了字面量——所以标准库和日常代码里，字符串参数几乎都是 &str。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "let s = \"hi\";\ns.push_str(\" world\");",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "s 是 &str——贴在窗上看风景的视角，没有房子可以扩建。想要能改的字符串，先 String::from(\"hi\") 盖房子。",
    },
  ],

  run: {
    "ch6-greet": ["你好, Ferris", "你好, 小蟹"],
    "ch6-build": ["rust is! fun"],
    "ch6-len":   ["4", "1", "6"],
  },

  errs: {
    "ch6-push": {
      lines: [
        "error[E0599]: no method named `push_str` found for reference `&str` in the current scope",
        " --> src/main.rs:3:5",
        "  |",
        "3 |     s.push_str(\" world\");",
        "  |     ^^^^^^^^^ method not found in `&str`",
        "  |",
        "note: the method `push_str` exists on the type `String`",
        "help: you might have meant to call it on a `String`",
        "  |",
        "1 |     let mut s = String::from(\"hello\");",
        "  |              ++++",
      ],
      human: "人话：&str 只是视角，没有房子可扩建。编译器还教你了：改成 String::from 再来。",
    },
  },
});

/* ══════════ 第 7 章 · 集合：Vec 与 HashMap ══════════ */
R.registerChapter({
  key: "ch7", order: 7, part: 1, icon: "🎒", title: "集合背包",
  eyebrow: "第 7 章 · 徽章待领：🎒 背包管理员",

  html: `
  <p class="lead">Python 两大金刚 <code class="ic">list</code> 和 <code class="ic">dict</code>，Rust 有直接对位：<b>Vec</b> 和 <b>HashMap</b>。上手几乎零门槛，但 Rust 会在你「边遍历边修改」时亮红牌——那是借用规则（第 5 章）的第一次实战开火。</p>

  <h3 class="sec-title">Vec ≈ list</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">v = [1, 2, 3]
v.append(4)
print(v)</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch7-vec">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let mut v = vec![1, 2, 3];   // vec! 宏 ≈ Python 的 [1, 2, 3]
    v.push(4);                   // ≈ append
    println!("{v:?}");            // {v:?} 是"打印整个集合"的万能格式
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>

  <h3 class="sec-title">get(i)：下标不敢瞎给了</h3>
  <p>Python 里 <code class="ic">v[5]</code> 越界直接 IndexError 崩溃。Rust 给了两条路：<b>直接下标越界也会 panic</b>，但 <code class="ic">.get(i)</code> 会返回一个 Option——要么 Some(值)，要么 None，绝不崩：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch7-get">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let v = vec![10, 20, 30];
    println!("{:?}", v.get(2));   // Some(30) —— 找到了
    println!("{:?}", v.get(5));   // None —— 越界不崩,给 None!
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">这个 Some/None 就是第 10 章的主角 <b>Option</b>——Rust 把「可能没有」写进了类型系统，先混个脸熟。</p>

  <h3 class="sec-title">HashMap ≈ dict</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">m = {"🦀": "螃蟹"}       # 字面量,真香
print(m.get("🦀"))</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch7-map">▶ 运行</button></div>
<pre><code data-lang="rust">use std::collections::HashMap;

fn main() {
    let mut m = HashMap::new();       // 注意:没有 {..} 字面量语法
    m.insert("🦀", "螃蟹");            // ≈ m["🦀"] = "螃蟹"
    if let Some(name) = m.get("🦀") {  // get 返回 Option
        println!("{name}");
    }
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>
  <p class="compare-note">用 HashMap 前要 <code class="ic">use std::collections::HashMap</code>——它不在默认预导入里（Rust 标准库的「默认背包」故意很小）。</p>

  <h3 class="sec-title">entry API：setdefault 的优雅版</h3>
  <p>词频统计是 HashMap 的经典用法。Python 的 <code class="ic">counts.get(w, 0) + 1</code>，Rust 用 entry 一行搞定：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch7-entry">▶ 运行</button></div>
<pre><code data-lang="rust">use std::collections::HashMap;

fn main() {
    let mut counts: HashMap&lt;&amp;str, i32&gt; = HashMap::new();
    for word in ["rust", "is", "rust"] {
        *counts.entry(word).or_insert(0) += 1;   // 没有就先放 0,再 +1
    }
    println!("{counts:?}");
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">entry = 「查这个格子，没有就先按我说的造一个」。它是 Python <code class="ic">setdefault</code> + 赋值的合体，而且只查一次哈希。另外 HashMap <b>不保证顺序</b>（上面输出顺序每次可能不同），想要有序换 BTreeMap。</p>

  <h3 class="sec-title">⚠️ 实战开火：一边遍历一边改？</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch7-mut">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    let mut v = vec![1, 2, 3];
    for x in &amp;v {
        v.push(*x);   // ❌ 一边遍历一边改?借用检查员当场逮捕
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">第 5 章的借用规则不是纸上谈兵：遍历是「读」（借用 v），push 是「写」（可变借用）——<b>同一时间读和写不能并存</b>，编译期就拦下。Python 里这种代码能跑，但会死循环到内存爆炸；Rust 直接不给上膛的机会。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>Vec</b> ≈ list：<code class="ic">vec![]</code>、<code class="ic">push</code>、<code class="ic">{v:?}</code> 打印</li>
      <li><code class="ic">.get(i)</code> 返回 Option，越界给 None 不崩；直接 <code class="ic">v[i]</code> 越界会 panic</li>
      <li><b>HashMap</b> ≈ dict：没有字面量，<code class="ic">insert</code> / <code class="ic">get</code>，不保序</li>
      <li><code class="ic">entry().or_insert(0)</code> ≈ setdefault，词频统计一把梭</li>
      <li>边遍历边修改 = 借用冲突，编译期拦截</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "编译过不过？",
      type: "compile",
      code: "let mut v = vec![1, 2];\nv.push(\"3\");",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "v 装的是 i32，push 一个 &str 进去？Rust 的集合是「单一种族」的：一个 Vec 只装一种类型，绝不混装。",
    },
    {
      q: "预测一下输出：",
      code: "let v = vec![10, 20, 30];\nprintln!(\"{:?}\", v.get(5));",
      opts: ["30", "None", "panic 崩溃", "0"],
      ans: 1,
      exp: "get 越界返回 None，不崩。这正是 Rust 的风格：「可能出错」用类型表达，而不是运行时赌运气。要是写 v[5] 就真的 panic 了。",
    },
    {
      q: "把键 \"a\" 值 1 塞进 HashMap 的标准写法是？",
      opts: ["m[\"a\"] = 1;", "m.insert(\"a\", 1);", "m.add(\"a\", 1);", "m.set(\"a\", 1);"],
      ans: 1,
      exp: "HashMap 用 insert 插入、get 查询。方括号 m[\"a\"] 在 HashMap 上不能用（那是数组的语法）。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "let mut v = vec![1, 2, 3];\nfor x in &v {\n    v.push(*x);\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "for x in &v 是「读」借用，v.push 是「写」借用——同一时间只能有一个。借用检查员（第 5 章的所有权规则）在编译期就逮捕你。",
    },
  ],

  run: {
    "ch7-vec":   ["[1, 2, 3, 4]"],
    "ch7-get":   ["Some(30)", "None"],
    "ch7-map":   ["螃蟹"],
    "ch7-entry": ["{\"is\": 1, \"rust\": 2}"],
  },

  errs: {
    "ch7-mut": {
      lines: [
        "error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable",
        " --> src/main.rs:3:9",
        "  |",
        "2 |     for x in &v {",
        "  |              --",
        "  |              |",
        "  |              immutable borrow occurs here",
        "3 |         v.push(*x);",
        "  |         ^^^^^^^^^ mutable borrow occurs here",
      ],
      human: "人话：一边翻柜子（遍历）一边往柜子里塞东西（push），永远翻不完还会爆。想边读边攒数据？先把要加的收进一个新 Vec，遍历完再合并。",
    },
  },
});

/* ══════════ 第 8 章 · struct ══════════ */
R.registerChapter({
  key: "ch8", order: 8, part: 1, icon: "🪪", title: "struct 数据公民",
  eyebrow: "第 8 章 · 徽章待领：🪪 数据公民",

  html: `
  <p class="lead">Python 的 class 把「数据 + 方法」一锅炖。Rust 把它拆成两半：<b>struct 管数据的形状，impl 管数据的行为</b>——对照 <code class="ic">@dataclass</code> 学，零压力，还顺便更安全。</p>

  <h3 class="sec-title">对照 dataclass</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">from dataclasses import dataclass

@dataclass
class Task:
    title: str
    done: bool = False

t = Task(title="学 Rust")
print(t)</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch8-print">▶ 运行</button></div>
<pre><code data-lang="rust">#[derive(Debug)]
struct Task {
    title: String,
    done: bool,
}

fn main() {
    let t = Task { title: String::from("学 Rust"), done: false };
    println!("{t:?}");   // {:?} 打印需要 Debug "许可证"
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>
  <p class="compare-note">Rust 创建实例用 <b>名字段语法</b>（<code class="ic">Task { title: ..., done: ... }</code>），字段必须全给、顺序随便——比 Python 位置参数更防手滑。</p>

  <h3 class="sec-title">打印要许可证：derive(Debug)</h3>
  <p>Python 的对象随便 print，Rust 的 struct 想 <code class="ic">{:?}</code> 打印，得先亮证：<code class="ic">#[derive(Debug)]</code>——一行注解，编译器替你把「打印自己」的代码写好。忘写？看看编译器怎么说：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch8-debug">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">struct Task {
    title: String,
}

fn main() {
    let t = Task { title: String::from("hi") };
    println!("{t:?}");   // ❌ 没有 Debug 许可证,不许打印
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">derive 是 Rust 的「编译器代写服务」：Debug（打印）、Clone（复制）、PartialEq（比较）都能这么一键生成，第 14 章细讲这个家族。</p>

  <h3 class="sec-title">方法与 self 三兄弟</h3>
  <p>Python 方法全靠一个 <code class="ic">self</code>。Rust 要你<b>声明意图</b>——只读、可改、还是拿走：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch8-impl">▶ 运行</button></div>
<pre><code data-lang="rust">#[derive(Debug)]
struct Task {
    title: String,
    done: bool,
}

impl Task {
    fn new(title: String) -&gt; Task {      // 关联函数:没有 self ≈ @classmethod
        Task { title, done: false }      // 字段简写:名字相同直接写
    }

    fn finish(&amp;mut self) {              // 要修改:&amp;mut self
        self.done = true;
    }

    fn shout(&amp;self) {                   // 只读取:&amp;self
        let mark = if self.done { "✅" } else { "…" };
        println!("任务: {} [{}]", self.title, mark);
    }
}

fn main() {
    let mut t = Task::new(String::from("学 Rust"));
    t.shout();     // 方法用 . 调用,Python 同款
    t.finish();
    t.shout();
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <ul class="points">
    <li><code class="ic">&amp;self</code> —— 只看不动：最常见的方法签名</li>
    <li><code class="ic">&amp;mut self</code> —— 要改内容：一次只能有一个调用者（借用规则自动护法）</li>
    <li><code class="ic">self</code> —— 直接拿走所有权：少见，用于「消费型」操作</li>
    <li><code class="ic">Task::new(...)</code> —— 没写 self 的叫<b>关联函数</b>，用 <code class="ic">::</code> 调用，≈ Python 的 <code class="ic">@classmethod</code></li>
  </ul>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>struct</b> ≈ dataclass：字段必须全给，名字段创建</li>
      <li><b>impl</b> 给 struct 挂方法；<code class="ic">self / &amp;self / &amp;mut self</code> 声明访问权限</li>
      <li><code class="ic">#[derive(Debug)]</code> = 打印许可证，一行搞定</li>
      <li>关联函数 <code class="ic">::new</code> ≈ <code class="ic">@classmethod</code>，构造对象的惯用入口</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "一个「只读取数据、不修改」的方法，self 应该写成？",
      opts: ["self", "&self", "&mut self", "*self"],
      ans: 1,
      exp: "&self 只借看：不拿所有权、不改内容、想同时调用多少次都行。日常方法 90% 是它。",
    },
    {
      q: "Task::new(\"学 Rust\") 这种用 :: 调用的是？",
      opts: ["普通方法", "关联函数", "静态变量", "Python 借来的构造语法"],
      ans: 1,
      exp: "签名里没有 self 的函数叫关联函数，≈ Python 的 @classmethod。它依附在类型上而不是某个实例上，所以用 Task:: 调用。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "struct T { x: i32 }\n\nfn main() {\n    let t = T { x: 1 };\n    println!(\"{t:?}\");\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "T 没有 #[derive(Debug)]，{:?} 打印不了。加一行 #[derive(Debug)] 在 struct 头上就通了——编译器的错误信息会直接教你加。",
    },
  ],

  run: {
    "ch8-print": ['Task { title: "学 Rust", done: false }'],
    "ch8-impl":  ["任务: 学 Rust […]", "任务: 学 Rust [✅]"],
  },

  errs: {
    "ch8-debug": {
      lines: [
        "error[E0277]: `Task` doesn't implement `Debug`",
        " --> src/main.rs:6:20",
        "  |",
        "6 |     println!(\"{t:?}\");",
        "  |               ^^^^^^ `Task` cannot be formatted using `{:?}`",
        "  |",
        "  = help: the trait `Debug` is not implemented for `Task`",
        "  = note: add #[derive(Debug)] to the type or manually implement it",
      ],
      human: "人话：Rust 不自动生成「打印自己」的能力。在 struct 头上加一行 #[derive(Debug)]，编译器就替你写好了——Python 的 __repr__ 还得手写呢。",
    },
  },
});

/* ══════════ 第 9 章 · enum + match ══════════ */
R.registerChapter({
  key: "ch9", order: 9, part: 1, icon: "⚔️", title: "enum + match",
  eyebrow: "第 9 章 · 徽章待领：⚔️ 分支魔法师",

  html: `
  <p class="lead">Python 3.10 的 <code class="ic">match-case</code> 你可能见过。Rust 的 enum + match 是它的完全体：<b>枚举变体能带数据，match 能拆包取值，漏了分支编译器不放过你</b>。这是 Rust 表达力的高光时刻，也是后面 Option / Result 的地基。</p>

  <h3 class="sec-title">enum：带行李的枚举</h3>
  <p>Python 的枚举只有「名字」；Rust 的每个变体还能<b>自带行李</b>：</p>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">from enum import Enum

class Shape(Enum):    # 枚举只有"名字",带不了数据
    CIRCLE = 1
    RECT = 2
# 想带半径、宽高?还得再套一层 dataclass…</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span></div>
<pre><code data-lang="rust">enum Shape {
    Circle(f64),      // 直接带行李:半径
    Rect(f64, f64),   // 宽、高
    Point,            // 也可以什么都不带
}</code></pre>
    </div>
  </div>
  <p class="compare-note">「Circle 带一个 f64」意味着：值不光是标签，<b>标签里面还装着数据</b>。这个能力叫 sum type，是很多 Python 玩家来到 Rust 后最先爱上的一集。</p>

  <h3 class="sec-title">match：必须穷尽的分拣机</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch9-area">▶ 运行</button></div>
<pre><code data-lang="rust">enum Shape {
    Circle(f64),
    Rect(f64, f64),
    Point,
}

fn area(s: &amp;Shape) -&gt; f64 {
    match s {
        Shape::Circle(r) =&gt; 3.14159 * r * r,   // r 是"拆包"出来的半径!
        Shape::Rect(w, h) =&gt; w * h,
        Shape::Point =&gt; 0.0,
    }
}

fn main() {
    println!("{}", area(&amp;Shape::Circle(2.0)));
    println!("{}", area(&amp;Shape::Rect(3.0, 4.0)));
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">看 <code class="ic">Shape::Circle(r)</code>：模式匹配在「对上号」的同时把里面的值拆出来给你用——<b>判断 + 拆包一步完成</b>。match 还是表达式，最后一行的值就是返回值（第 3 章的老朋友）。</p>

  <h3 class="sec-title">漏了分支？编译器点名</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch9-exhaust">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn area(s: &amp;Shape) -&gt; f64 {
    match s {
        Shape::Circle(r) =&gt; 3.14159 * r * r,
        Shape::Rect(w, h) =&gt; w * h,
        // ❌ 漏了 Point!
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">Python 的 match-case 漏了分支会<b>静默跳过</b>；Rust 直接编译失败。这不是找茬——是超能力：哪天你给 Shape 加了新变体 Triangle，所有 match 的地方编译器挨个点名让你处理，<b>重构再也不怕漏</b>。</p>

  <h3 class="sec-title">match 也能配字面量和范围</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch9-num">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let n = 7;
    match n {
        0 =&gt; println!("零"),
        1..=9 =&gt; println!("个位数"),     // 范围模式
        _ =&gt; println!("好大的数"),        // _ = 通配符:其他全部
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note"><code class="ic">_</code> 能一网打尽，但会失去「新增变体被点名」的提醒——能用明确分支就别用 _。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li>Rust 的 <b>enum 变体能带数据</b>——比 Python 的 enum 强一档</li>
      <li><b>match 拆包</b>：对上号的同时取出里面的值</li>
      <li><b>必须穷尽</b>：漏分支编译不过；_ 通配但会失去点名提醒</li>
      <li>match 是表达式，值可以直接当返回值</li>
      <li>预告：Option 和 Result 就是标准库里的两个 enum，下两章见</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "编译过不过？",
      type: "compile",
      code: "enum S { A, B, C }\n\nfn f(s: &S) {\n    match s {\n        S::A => println!(\"a\"),\n        S::B => println!(\"b\"),\n    }\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "match 必须穷尽：S::C 没有被处理，E0004 直接拦下。要么补上 C 的分支，要么用 _ 兜底（但会失去点名单提醒）。",
    },
    {
      q: "Rust 的 enum 比 Python 的 enum 强在哪？",
      opts: ["写起来更短", "变体能自带数据", "不用 import", "能直接当 int 用"],
      ans: 1,
      exp: "Rust 的枚举变体可以携带数据（Circle(f64) 甚至嵌 struct），Python 的 Enum 只有名字。这个能力叫 sum type，配 match 食用效果拔群。",
    },
    {
      q: "预测一下输出：",
      code: "let s = Shape::Rect(3.0, 4.0);\nprintln!(\"{}\", area(&s));\n// area 定义同本章,按 w * h 计算",
      opts: ["12", "7", "0", "编译错误"],
      ans: 0,
      exp: "Rect 模式拆包出 w=3.0、h=4.0，3.0 * 4.0 = 12。拆包发生在 match 的那一步。",
    },
    {
      q: "match 里写 Shape::Circle(r)，那个 r 是什么？",
      opts: ["一个常量", "新变量,接住\"拆包\"出来的半径", "类型名字", "编译器看不懂,会报错"],
      ans: 1,
      exp: "模式匹配在「对上号」的同时创建新变量 r，装着变体里带的值。想改名？Shape::Circle(半径) 都行——合法的标识符都能当模式变量。",
    },
  ],

  run: {
    "ch9-area": ["12.56636", "12"],
    "ch9-num":  ["个位数"],
  },

  errs: {
    "ch9-exhaust": {
      lines: [
        "error[E0004]: non-exhaustive patterns: `Shape::Point` not covered",
        " --> src/main.rs:5:11",
        "  |",
        "5 |     match s {",
        "  |           ^ pattern `Shape::Point` not covered",
        "  |",
        "note: the matched value is of type `&Shape`",
        "help: ensure that all possible cases are being handled by adding a match",
        "     arm with a wildcard pattern or an explicit pattern",
        "  |",
        "5 |     match s {",
        "  |           ^ add `Shape::Point => todo!()`",
      ],
      human: "人话：match 是分拣机，每种包裹都必须有去处。漏了 Point？编译器点名让你补。Python 的 match 漏了会静默跳过——Rust 不给静默的机会，这就是重构安全。",
    },
  },
});

/* ══════════ 第 10 章 · Option ══════════ */
R.registerChapter({
  key: "ch10", order: 10, part: 1, icon: "🎁", title: "Option 拆盒",
  eyebrow: "第 10 章 · 徽章待领：🎁 拆盒专家",

  html: `
  <p class="lead">每个 Python 玩家都被 <code class="ic">None</code> 咬过：函数返回 None，调用的人忘了检查，半夜生产环境 <code class="ic">AttributeError</code> 报警。Rust 的答案：<b>Option&lt;T&gt;</b>——用类型系统逼你面对「可能没有」。</p>

  <h3 class="sec-title">Some 或 None，没有中间态</h3>
  <p>Option 就是上一章那种「带数据的 enum」，标准库出品，只有两个变体：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch10-price">▶ 运行</button></div>
<pre><code data-lang="rust">use std::collections::HashMap;

fn find_price(table: &amp;HashMap&lt;&amp;str, i32&gt;, item: &amp;str) -&gt; Option&lt;&amp;i32&gt; {
    table.get(item)        // HashMap 的 get 本来就返回 Option!
}

fn main() {
    let mut t = HashMap::new();
    t.insert("🦀", 99);
    match find_price(&amp;t, "🦀") {
        Some(p) =&gt; println!("价格: {p}"),
        None =&gt; println!("没这个货"),
    }
    match find_price(&amp;t, "🐌") {
        Some(p) =&gt; println!("价格: {p}"),
        None =&gt; println!("没这个货"),
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <div class="warn">
    <h4>👻 Python 佬熟悉的 None 惨案</h4>
<pre><code data-lang="python">price = table.get("🐌")    # 找不到给 None...
print(price * 2)            # TypeError!运行时才炸,
                            # 而 None 可能已经悄悄污染了三层代码</code></pre>
    <p>Rust 里这行代码<b>编译不过</b>：Option 是个盒子，不拆包就当值用，编译器直接拒绝。惨案从根上消失。</p>
  </div>

  <h3 class="sec-title">工具箱：五种拆盒姿势（对照 Python）</h3>
  <table class="cmp-table">
    <tr><th>Rust 写法</th><th>Python 心译</th></tr>
    <tr><td><code class="ic">x.unwrap()</code></td><td>有值给值，None 直接 panic（原型期专用）</td></tr>
    <tr><td><code class="ic">x.unwrap_or(0)</code></td><td><code class="ic">0 if x is None else x</code></td></tr>
    <tr><td><code class="ic">x.map(f)</code></td><td><code class="ic">f(x) if x else None</code>——自动跳过 None</td></tr>
    <tr><td><code class="ic">if let Some(v) = x</code></td><td><code class="ic">if x is not None:</code> 的语法糖</td></tr>
    <tr><td><code class="ic">x?</code></td><td>有值解包继续，None 立刻 return None（下章细讲）</td></tr>
  </table>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch10-tools">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let words = vec![String::from("rust"), String::from("🦀")];

    // if let ≈ Python 的 if x is not None
    if let Some(w) = words.get(0) {
        println!("第一个: {w}");
    }

    // unwrap_or ≈ Python 的 0 if x is None else x
    let missing: Option&lt;&amp;String&gt; = words.get(9);
    println!("{:?}", missing.unwrap_or(&amp;String::from("空空如也")));
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">盒子不能直接做算术</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch10-add">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    let v: Option&lt;i32&gt; = Some(5);
    println!("{}", v + 1);   // ❌ 盒子不能直接当数用
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>Option&lt;T&gt;</b> = Some(值) 或 None，Rust 版「可能没有」</li>
      <li>不拆包就用？<b>编译不过</b>——None 惨案从根上绝迹</li>
      <li>五件套：unwrap / unwrap_or / map / if let / ?</li>
      <li>返回 Option 的常见来源：<code class="ic">HashMap.get</code>、<code class="ic">Vec.get</code>、字符串 <code class="ic">parse</code></li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "Python 的 None 在 Rust 里的对应物是？",
      opts: ["null", "nil", "Option<T>", "void"],
      ans: 2,
      exp: "Option<T>：Some(有值) 或 None(没有)。区别在于：Rust 里「可能没有」写在类型上，编译器逼你处理；Python 里 None 是运行时才炸的惊喜。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "let v: Option<i32> = Some(5);\nprintln!(\"{}\", v + 1);",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "Option 是盒子不是值，盒子不能直接做算术。先拆包（match / unwrap_or / ?），拆的时候顺手想清楚 None 怎么办——这一步 Python 丢了，所以才有 None 惨案。",
    },
    {
      q: "哪个写法最像 Python 的「0 if x is None else x」？",
      opts: ["x.unwrap()", "x.unwrap_or(0)", "x.map(0)", "x?"],
      ans: 1,
      exp: "unwrap_or(0)：没有就给个默认值 0。unwrap 是「None 就崩」，原型期专用。",
    },
  ],

  run: {
    "ch10-price": ["价格: 99", "没这个货"],
    "ch10-tools": ["第一个: rust", "\"空空如也\""],
  },

  errs: {
    "ch10-add": {
      lines: [
        "error[E0369]: cannot add `{integer}` to `Option<i32>`",
        " --> src/main.rs:3:20",
        "  |",
        "3 |     println!(\"{}\", v + 1);",
        "  |                    ^ no implementation for `Option<i32> + {integer}`",
        "  |",
        "  = help: the trait `Add<{integer}>` is not implemented for `Option<i32>`",
      ],
      human: "人话：Option 是盒子，里面的值不会自己漏出来。用 match / unwrap_or / if let 拆开，顺便想清楚 None 的下场。",
    },
  },
});

/* ══════════ 第 11 章 · Result 与错误处理 ══════════ */
R.registerChapter({
  key: "ch11", order: 11, part: 1, icon: "🚨", title: "Result 错误处理",
  eyebrow: "第 11 章 · 徽章待领：🚨 首席风险官",

  html: `
  <p class="lead">Python 的异常是「半路杀出的刺客」——光看函数签名，完全看不出它会不会炸。Rust 把「可能失败」写进<b>返回类型</b>：Result&lt;T, E&gt;。签名即合同，错误处理从选修课变成必修课。</p>

  <h3 class="sec-title">Result：错误是返回值</h3>
  <p>Result 也是标准库的 enum：<b>Ok(值) 或 Err(错误)</b>。读文件这种「随时可能失败」的操作，返回的就是它：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch11-read">▶ 运行</button></div>
<pre><code data-lang="rust">use std::fs;

fn main() {
    // 返回 Result&lt;String, io::Error&gt;:要么读到内容,要么带着错误回来
    let content = fs::read_to_string("no_such_file.txt");
    match content {
        Ok(text) =&gt; println!("读到 {} 字节", text.len()),
        Err(e) =&gt; println!("读不了: {e}"),
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">这段代码的真跑结果就是走 Err 分支（文件确实不存在）——Rust 连「演示失败」都这么从容。</p>

  <h3 class="sec-title">? 运算符：优雅地甩锅</h3>
  <p>每层都写 match 太啰嗦。当你只想「出错就把错误传给上层」，一个 <code class="ic">?</code> 搞定：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch11-q">▶ 运行</button></div>
<pre><code data-lang="rust">use std::fs;
use std::io;

fn read_config() -&gt; Result&lt;String, io::Error&gt; {
    // ? = Ok 就解包继续;Err 就立刻 return Err(往上传)
    let text = fs::read_to_string("no_such_file.txt")?;
    Ok(text)
}

fn main() {
    match read_config() {
        Ok(_) =&gt; println!("OK"),
        Err(e) =&gt; println!("传播上来啦: {e}"),
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note"><code class="ic">?</code> ≈ Python 的 <code class="ic">raise</code>，但由类型系统监督：<b>函数签名必须声明返回 Result 才能用 ?</b>——想甩锅，得先把锅写进合同里。</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch11-qmark">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    let n: i32 = "abc".parse::&lt;i32&gt;()?;   // ❌ main 返回的是 (),不是 Result
    println!("{n}");
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">unwrap / expect：原型期专用</h3>
  <p><code class="ic">.unwrap()</code> 出错就 panic——写原型时够用，但崩了没线索。<code class="ic">.expect("话")</code> 是带遗言的 unwrap，panic 信息里会喊出你写的话：</p>
  <div class="tip">🧭 惯用分工：<b>库代码和业务逻辑用 ? 传播错误；测试和原型用 expect("...")；unwrap 只在「绝对不可能失败」时用</b>。panic 信息会说话，是一种美德。</div>

  <h3 class="sec-title">自定义错误：enum 再立功</h3>
  <p>自家业务的错误，就该用自家 enum 描述——第 9 章的 match 又出场了：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch11-age">▶ 运行</button></div>
<pre><code data-lang="rust">#[derive(Debug)]
enum AgeError {
    NotANumber,
    TooOld,
}

fn parse_age(s: &amp;str) -&gt; Result&lt;i32, AgeError&gt; {
    // map_err:把 parse 的错误"翻译"成自家错误类型
    let n: i32 = s.parse().map_err(|_| AgeError::NotANumber)?;
    if n &gt; 150 {
        return Err(AgeError::TooOld);
    }
    Ok(n)
}

fn main() {
    println!("{:?}", parse_age("42"));
    println!("{:?}", parse_age("abc"));
    println!("{:?}", parse_age("999"));
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">panic! vs Result：什么时候用哪个</h3>
  <table class="cmp-table">
    <tr><th></th><th>panic!</th><th>Result</th></tr>
    <tr><td>含义</td><td>程序员的锅：不变量被破坏，bug</td><td>现实的锅：文件没了、网断了，正常生活</td></tr>
    <tr><td>处理方式</td><td>不处理，直接崩</td><td>交给调用方：重试、兜底、上报</td></tr>
    <tr><td>用在</td><td>测试、原型、真正的 bug</td><td>一切「可预期的失败」</td></tr>
    <tr><td>Python 对照</td><td>raise Exception（炸了再说）</td><td>错误成为返回值的强制版</td></tr>
  </table>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>Result&lt;T, E&gt;</b> = Ok(值) 或 Err(错误)——「可能失败」写进签名</li>
      <li><code class="ic">?</code> = 出错立刻返回 Err 往上传，签名必须声明 Result</li>
      <li><code class="ic">expect("话")</code> > <code class="ic">unwrap()</code>：panic 也要会说话</li>
      <li>业务错误用<b>自定义 enum</b>，map_err 负责翻译</li>
      <li>panic 是 bug 的处理方式，Result 是生活的处理方式</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "预测一下输出：",
      code: "fn parse_age(s: &str) -> Result<i32, AgeError> {\n    let n: i32 = s.parse().map_err(|_| AgeError::NotANumber)?;\n    if n > 150 { return Err(AgeError::TooOld); }\n    Ok(n)\n}\n\nprintln!(\"{:?}\", parse_age(\"999\"));",
      opts: ["Ok(999)", "Err(TooOld)", "Err(NotANumber)", "panic 崩溃"],
      ans: 1,
      exp: "999 是合法数字所以 parse 成功，但超过 150 的年龄上限，走到 return Err(AgeError::TooOld)。自定义错误让你「按业务规则拒绝」。",
    },
    {
      q: "fs::read_to_string 的返回类型是？",
      opts: ["String", "Option<String>", "Result<String, io::Error>", "io::Error"],
      ans: 2,
      exp: "读文件可能失败，所以返回 Result。签名一眼看穿风险——这就是 Rust 的「签名即合同」。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "fn main() {\n    let n: i32 = \"42\".parse::<i32>()?;\n    println!(\"{n}\");\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "? 要求所在函数返回 Result / Option，而 main 返回 ()。彩蛋：把签名改成 fn main() -> Result<(), Box<dyn std::error::Error>> 就能用 ? 了——官方认证的偷懒姿势。",
    },
  ],

  run: {
    "ch11-read": ["读不了: No such file or directory (os error 2)"],
    "ch11-q":    ["传播上来啦: No such file or directory (os error 2)"],
    "ch11-age":  ["Ok(42)", "Err(NotANumber)", "Err(TooOld)"],
  },

  errs: {
    "ch11-qmark": {
      lines: [
        "error[E0277]: the `?` operator can only be used in a function that returns",
        "`Result` or `Option` (or a type that implements `FromResidual`)",
        " --> src/main.rs:2:33",
        "  |",
        "2 |     let n: i32 = \"42\".parse::<i32>()?;",
        "  |                                 ^ cannot use the `?` operator in a function",
        "  |                                   that returns `()`",
      ],
      human: "人话：? 是「出错就提前回家」的缩写，前提是函数承诺过会带错误回家（返回 Result）。main 默认返回 ()，没这承诺，所以不让用。",
    },
  },
});

})();
