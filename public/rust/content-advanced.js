/* ═══════════════════════════ 锈岛求生 2.0 · 第二部 进阶群岛(第 12~18 章 + 毕业考) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ══════════ 第 12 章 · 闭包 ══════════ */
R.registerChapter({
  key: "ch12", req: "final", order: 20, part: 2, partTitle: "第二部 · 进阶群岛", icon: "🎭", title: "闭包",
  eyebrow: "第 12 章 · 徽章待领：🎭 匿名演员",

  html: `
  <p class="lead">Python 的 <code class="ic">lambda</code> 你天天用。Rust 的闭包（closure）语法不同、能力更强：<b>它能把外面的变量「抓」进函数里随身携带</b>——这个能力在多线程和迭代器里大放异彩。</p>

  <h3 class="sec-title">语法对照：lambda ≈ 闭包</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">add = lambda a, b: a + b
greet = lambda name: f"hi {name}"
print(add(1, 2))</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch12-cap">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let add = |a: i32, b: i32| a + b;        // 参数夹在两根竖线里
    let greet = |name| format!("hi {name}");  // 类型可推断,首次调用时定死
    println!("{}", add(1, 2));
    println!("{}", greet("Ferris"));
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>
  <p class="compare-note">类型标注可写可不写（推断），但推断之后不能再变——不像 Python 一个 lambda 能今天吃数字明天吃字符串。</p>

  <h3 class="sec-title">闭包的独门绝活：捕获环境</h3>
  <p>普通函数看不到外面的变量，闭包可以「顺手带走」：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch12-count">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let mut count = 0;

    let mut inc = || count += 1;   // 闭包捕获了外面的 count!
    inc();
    inc();
    println!("{count}");           // 2
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">注意闭包自己也要 <code class="ic">mut</code>（它要改捕获的值）。捕获遵守借用规则：<code class="ic">inc</code> 活着期间，<code class="ic">count</code> 就被它占用——又是第 5 章。</p>

  <h3 class="sec-title">move：把所有权搬进闭包</h3>
  <p>默认是「借用」，加个 <code class="ic">move</code> 就是「带走」——第 16 章多线程的门票：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch12-move">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    let name = String::from("Ferris");
    let own = move || println!("{name}");   // move:name 被搬进闭包
    own();
    println!("{name}");                     // ❌ name 已经被搬走
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">普通场景借用就够，<b>闭包活得比原变量久</b>（比如扔进新线程）时必须 move——否则闭包引用的东西可能已经被回收，悬垂！</p>

  <div class="concept">
    <h4>📎 Fn / FnMut / FnOnce 一页讲完</h4>
    <p>编译器按闭包「对捕获值干了什么」自动分三档：<b>只读 → Fn</b>（可随便调用）、<b>要改 → FnMut</b>（调用者要 mut）、<b>要吞 → FnOnce</b>（只能调用一次）。<b>99% 的情况你不用管</b>，编译器全包——记住一句：闭包会捕获外面的变量，move 会把它变成自己的。</p>
  </div>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><code class="ic">|参数| 表达式</code> ≈ lambda，类型可推断</li>
      <li><b>闭包能捕获环境</b>——函数不能</li>
      <li><code class="ic">move</code> 把捕获值的所有权搬进闭包（多线程门票）</li>
      <li>Fn / FnMut / FnOnce 编译器自动分档，日常不用操心</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "编译过不过？",
      type: "compile",
      code: "fn main() {\n    let name = String::from(\"Ferris\");\n    let own = move || println!(\"{name}\");\n    own();\n    println!(\"{name}\");\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "move 把 name 的所有权搬进了闭包，之后再 println name 就是「use of moved value」。去掉 move（改回借用）就通了。",
    },
    {
      q: "预测一下输出：",
      code: "let mut count = 0;\nlet mut inc = || count += 1;\ninc();\ninc();\nprintln!(\"{count}\");",
      opts: ["0", "1", "2", "编译错误"],
      ans: 2,
      exp: "闭包捕获了外面的 count，两次调用各 +1。这种「把变量随身带进函数」的能力，lambda 只有羡慕的份。",
    },
    {
      q: "闭包和普通 fn 函数最大的区别是？",
      opts: ["写起来更短", "闭包能捕获环境里的变量", "闭包运行更快", "闭包可以递归"],
      ans: 1,
      exp: "闭包天生带着「环境快照」：定义处能看到的外部变量都能用。函数不行——这是两者本质区别，不是语法糖。",
    },
  ],

  run: {
    "ch12-cap":   ["3", "hi Ferris"],
    "ch12-count": ["2"],
  },

  errs: {
    "ch12-move": {
      lines: [
        "error[E0382]: borrow of moved value: `name`",
        " --> src/main.rs:5:20",
        "  |",
        "2 |     let name = String::from(\"Ferris\");",
        "  |         ---- move occurs because `name` has type `String`, which does not",
        "  |              implement the `Copy` trait",
        "3 |     let own = move || println!(\"{name}\");",
        "  |                    ------------- value moved into closure here",
        "5 |     println!(\"{name}\");",
        "  |                    ^^^^^ value borrowed here after move",
      ],
      human: "人话：move = 所有权搬家。搬进闭包之后，原地址就是空壳了。想两边都能用？去掉 move 改回借用。",
    },
  },
});

/* ══════════ 第 13 章 · 迭代器 ══════════ */
R.registerChapter({
  key: "ch13", order: 21, part: 2, icon: "🛸", title: "迭代器流水线",
  eyebrow: "第 13 章 · 徽章待领：🛸 惰性流水线",

  html: `
  <p class="lead">Python 的推导式 + 生成器，Rust 合并进化成了<b>迭代器</b>。<code class="ic">map / filter / collect</code> 一条链下来，惰性、零复制、还能自动并行——这是 Rust 写起来最「爽」的部分之一。</p>

  <h3 class="sec-title">推导式 ≈ 迭代器链</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">squares = [x*x for x in range(5)
           if x % 2 == 0]
print(squares)   # [0, 4, 16]</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch13-chain">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let squares: Vec&lt;i32&gt; = (0..5)
        .filter(|x| x % 2 == 0)   // 惰性:先"记账",不干活
        .map(|x| x * x)
        .collect();               // collect 才真正执行整条链
    println!("{squares:?}");
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>
  <p class="compare-note">推导式把「过滤、变换、装盒」压在一行；迭代器链把每一步摊开成可读的一行——像流水线图纸。惰性 = 和 Python 生成器一样：不 collect 不干活。</p>

  <h3 class="sec-title">遍历的三种姿势：把意图写明白</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch13-borrow">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let mut v = vec![1, 2, 3];

    for x in &amp;v {            // 借用:只看
        print!("{x} ");
    }
    println!();

    for x in &amp;mut v {         // 可变借用:原地改
        *x += 10;
    }
    println!("{v:?}");

    // for x in v { }        // 拿走:消耗掉 v(想用就没了)
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">Python 的 <code class="ic">for x in lst</code> 静静借走一个视图；Rust 逼你写清楚：借用读（&amp;v）、借用改（&amp;mut v）、还是消耗（v）。</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch13-own">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    let v = vec![1, 2, 3];
    for x in v {           // into_iter:v 被整个拿走
        println!("{x}");
    }
    println!("{v:?}");     // ❌ v 已经被消耗
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">常用工具速查</h3>
  <table class="cmp-table">
    <tr><th>Rust</th><th>Python 心译</th></tr>
    <tr><td><code class="ic">.map(f)</code> / <code class="ic">.filter(p)</code></td><td>变换 / 过滤（惰性）</td></tr>
    <tr><td><code class="ic">.sum()</code> / <code class="ic">.count()</code> / <code class="ic">.max()</code></td><td>sum() / len() / max()</td></tr>
    <tr><td><code class="ic">.enumerate()</code></td><td>enumerate()</td></tr>
    <tr><td><code class="ic">.zip(other)</code></td><td>zip()</td></tr>
    <tr><td><code class="ic">.take(n)</code> / <code class="ic">.skip(n)</code></td><td>切片思路：取前 n / 跳过 n</td></tr>
    <tr><td><code class="ic">.find(p)</code></td><td>next(x for x in ... if p(x), None)</td></tr>
  </table>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch13-tools">▶ 运行</button></div>
<pre><code data-lang="rust">fn main() {
    let mut s = vec![3, 1, 4, 1, 5];
    s.sort();
    let total: i32 = s.iter().sum();                      // 聚合:消费迭代器
    let doubled: Vec&lt;i32&gt; = s.iter().map(|x| x * 2).collect();
    println!("{total} {doubled:?}");

    let first_big = vec![1, 5, 9].into_iter().find(|x| *x &gt; 4);
    println!("{first_big:?}");   // find 返回 Option(第 10 章联动!)
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">编译器猜不出你想 collect 进什么容器时，用「turbofish」亲自指路：<code class="ic">.collect::&lt;Vec&lt;_&gt;&gt;()</code>——名字唬人，就是标注类型的另一种写法。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li>迭代器链 <b>惰性</b>：<code class="ic">collect / sum</code> 等消费动作才真正执行</li>
      <li>遍历三姿势：<code class="ic">&amp;v</code> 借用读、<code class="ic">&amp;mut v</code> 借用改、<code class="ic">v</code> 消耗</li>
      <li>map / filter / enumerate / zip / find 全家桶，与 Python 一一对应</li>
      <li>find、get、position 返回 Option——迭代器和 Option 是老搭档</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "迭代器链（map/filter）什么时候真正干活？",
      opts: ["定义的时候", "collect / sum 等消费的时候", "编译的时候", "随时都在干"],
      ans: 1,
      exp: "惰性！filter 和 map 只是把操作「记账」，collect 才一次性执行整条链。和 Python 生成器的心智模型一致。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "fn main() {\n    let v = vec![1, 2, 3];\n    for x in v {\n        println!(\"{x}\");\n    }\n    println!(\"{v:?}\");\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "for x in v（不带 &）= into_iter = 把 v 消耗掉，之后 v 作废。想遍历后继续用 v，写 for x in &v。",
    },
    {
      q: "预测一下输出：",
      code: "let out: Vec<i32> = (0..5).filter(|x| x % 2 == 0).map(|x| x * x).collect();\nprintln!(\"{out:?}\");",
      opts: ["[0, 1, 4, 9, 16]", "[0, 4, 16]", "[0, 2, 4]", "[4, 16]"],
      ans: 1,
      exp: "先过滤出偶数 0、2、4，再平方：0、4、16。filter 在前 map 在后，顺序就是流水线顺序。",
    },
    {
      q: "Python 的 enumerate(lst) 和 zip(a, b)，迭代器上对应？",
      opts: [".enumerate() 和 .zip(other)", ".index() 和 .pair(other)", ".keys() 和 .join(other)", "没有对应,要手写"],
      ans: 0,
      exp: ".enumerate() 给每个元素配上下标，.zip(other) 拉链式合并两条迭代器。名字都懒得改，迁移成本为零。",
    },
  ],

  run: {
    "ch13-chain":  ["[0, 4, 16]"],
    "ch13-borrow": ["1 2 3", "[11, 12, 13]"],
    "ch13-tools":  ["14 [2, 2, 6, 8, 10]", "Some(5)"],
  },

  errs: {
    "ch13-own": {
      lines: [
        "error[E0382]: borrow of moved value: `v`",
        " --> src/main.rs:7:20",
        "  |",
        "2 |     let v = vec![1, 2, 3];",
        "  |         - move occurs because `v` has type `Vec<i32>`, which does not",
        "  |           implement the `Copy` trait",
        "3 |     for x in v {",
        "  |              - `v` moved due to this implicit call to `.into_iter()`",
        "7 |     println!(\"{v:?}\");",
        "  |                    ^^^^ value borrowed here after move",
        "  |",
        "help: consider borrowing to avoid moving into the for loop",
        "  |",
        "3 |     for x in &v {",
        "  |              +",
      ],
      human: "人话：for x in v 是「把 v 倒进管道里烧掉」。编译器连改法都贴好了：加个 & 变成借用遍历。",
    },
  },
});

/* ══════════ 第 14 章 · trait 与泛型 ══════════ */
R.registerChapter({
  key: "ch14", order: 22, part: 2, icon: "🧬", title: "trait 与泛型",
  eyebrow: "第 14 章 · 徽章待领：🧬 协议大师",

  html: `
  <p class="lead">Python 靠「鸭子类型」：长得像就能上，错了到运行时才炸。Rust 说：<b>想要鸭子行为，先拿证</b>——这个证叫 trait。对照 <code class="ic">typing.Protocol</code> / <code class="ic">abc.ABC</code> 学，无缝衔接。</p>

  <h3 class="sec-title">trait：给能力发证</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch14-zoo">▶ 运行</button></div>
<pre><code data-lang="rust">trait Speak {
    fn say(&amp;self) -&gt; String;      // 「会说话」的合同:必须有 say 方法
}

struct Crab;
struct Fish;

impl Speak for Crab {              // Crab 来签合同
    fn say(&amp;self) -&gt; String { String::from("🦀 咔咔!") }
}

impl Speak for Fish {              // Fish 也签
    fn say(&amp;self) -&gt; String { String::from("🐟 咕噜~") }
}

fn main() {
    // Box&lt;dyn Speak&gt;:装"任何会说话的动物"的箱子
    let crew: Vec&lt;Box&lt;dyn Speak&gt;&gt; = vec![Box::new(Crab), Box::new(Fish)];
    for c in &amp;crew {
        println!("{}", c.say());
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note"><code class="ic">Box&lt;dyn Speak&gt;</code> ≈ Python 的运行时查方法表（动态分发）：盒子只保证「里面有只会说话的东西」，具体是谁运行才知道。没签合同就来 <code class="ic">say()</code>？编译期直接拒签。</p>

  <h3 class="sec-title">默认实现：签了就有赠品</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span></div>
<pre><code data-lang="rust">trait Greet {
    fn hello(&amp;self) -&gt; String {
        String::from("你好")        // 默认实现:签合同就白送
    }
    fn bye(&amp;self) -&gt; String;       // 没默认:必须自己写
}</code></pre>
  </div>

  <h3 class="sec-title">泛型：一台模板机，编译期定制</h3>
  <p>trait 还能当「参数门槛」用——<b>只要实现了比较能力，什么类型都收</b>：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch14-big">▶ 运行</button></div>
<pre><code data-lang="rust">fn biggest&lt;T: PartialOrd&gt;(a: T, b: T) -&gt; T {   // T:任何"可比较"的类型
    if a &gt; b { a } else { b }
}

fn main() {
    println!("{}", biggest(3, 9));          // 整数版,编译期生成
    println!("{}", biggest('🦀', '🐍'));      // 字符版,另一份代码
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">泛型是<b>静态分发</b>：编译期为每个具体类型生成专用代码，运行时零开销——这是 Python 「一套代码慢慢跑」换不来的快。写法嫌长可以换 <code class="ic">where</code> 风格，效果一样。</p>

  <h3 class="sec-title">derive：编译器代写服务</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch14-derive">▶ 运行</button></div>
<pre><code data-lang="rust">#[derive(Debug, Clone, PartialEq)]   // 一行,编译器替你实现三个 trait
struct Point { x: i32, y: i32 }

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = a.clone();                // Clone:复制
    println!("{:?} {}", a, a == b);    // Debug + PartialEq
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">第 8 章的 <code class="ic">#[derive(Debug)]</code> 原来是 trait 大家族的一员。常用证件：Debug（打印）、Clone（复制）、PartialEq（==）、Default（默认值）。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>trait</b> ≈ Protocol/ABC：能力合同，签了才能用</li>
      <li><code class="ic">Box&lt;dyn Trait&gt;</code> 动态分发（≈ Python 运行时查表）；<b>泛型静态分发</b>（编译期定制，零开销）</li>
      <li>trait 可以有<b>默认实现</b>，泛型参数用 <code class="ic">T: PartialOrd</code> 设门槛</li>
      <li>derive 一行代写 Debug / Clone / PartialEq 等</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "Python 的鸭子类型在 Rust 里对应什么？",
      opts: ["继承", "trait", "闭包", "宏"],
      ans: 1,
      exp: "Python：调用时看有没有这个方法（运行时）；Rust：实现 trait 才有资格（编译时）。哲学不同——Rust 宁可你多写一行，也要把检查提前到编译期。",
    },
    {
      q: "Box<dyn Speak> 里的 dyn 表示？",
      opts: ["动态分发:运行时才知道具体类型", "数据自动复制", "类型可以动态改名", "动态内存回收"],
      ans: 0,
      exp: "dyn Trait = 「任意实现了这个 trait 的东西」，运行时查方法表——最接近 Python 对象的感觉。代价是每次调用多一次查表。",
    },
    {
      q: "预测一下输出：",
      code: "fn biggest<T: PartialOrd>(a: T, b: T) -> T {\n    if a > b { a } else { b }\n}\n\nfn main() {\n    println!(\"{}\", biggest('🦀', '🐍'));\n}",
      opts: ["🦀", "🐍", "编译错误:char 不能比较", "随机"],
      ans: 0,
      exp: "char 实现了 PartialOrd，按 Unicode 编号比大小。🦀 的编号更大，所以赢。泛型门槛一行，整数、字符、字符串全都收。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "struct Duck;\n\nimpl Speak for Crab { /* ... */ }\n\nfn main() {\n    let d = Duck;\n    println!(\"{}\", d.say());\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "Duck 没实现 Speak 就想 say()？error[E0599]：没有找到这个方法。Python 里这会是运行时 AttributeError，Rust 在编译期就把「不会说话的鸭子」拦下了。",
    },
  ],

  run: {
    "ch14-zoo":    ["🦀 咔咔!", "🐟 咕噜~"],
    "ch14-big":    ["9", "🦀"],
    "ch14-derive": ["Point { x: 1, y: 2 } true"],
  },
});

/* ══════════ 第 15 章 · 智能指针与生命周期 ══════════ */
R.registerChapter({
  key: "ch15", order: 23, part: 2, icon: "🏠", title: "智能指针与生命周期",
  eyebrow: "第 15 章 · 徽章待领：🏠 房产中介",

  html: `
  <p class="lead">第 5 章说「一物一主」，但真实世界总有例外：递归的树、多人共享的数据、跨线程的计数。Rust 的答案是一批「<b>智能指针</b>」——给特殊的房产需求办手续。顺便用一页纸解决大家闻风丧胆的<b>生命周期</b>。</p>

  <h3 class="sec-title">Box：把数据搬到堆上</h3>
  <p>Box 就是「这东西放堆上，栈里只留个门牌」。最经典的用武之地是<b>递归类型</b>——不信你写个不用 Box 的链表试试：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch15-box">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">enum List {
    Node(i32, List),   // 里面又装着自己?那得有多大…
    Empty,
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">俄罗斯套娃必须有底。<b>Box 就是那个底</b>：「Box&lt;List&gt;」把下一层放堆上，栈里只留固定大小的门牌，循环就转起来了：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span></div>
<pre><code data-lang="rust">enum List {
    Node(i32, Box&lt;List&gt;),   // ✅ Box 封底,大小固定
    Empty,
}

fn main() {
    let l = List::Node(1, Box::new(List::Node(2, Box::new(List::Empty))));
    println!("{:?}", l);
}</code></pre>
  </div>

  <h3 class="sec-title">Rc / Arc：一份数据多个主人</h3>
  <p>「唯一所有者」铁律的补充通道：引用计数。clone 只是「住户名单 +1」，最后一个住户搬走才回收：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch15-rc">▶ 运行</button></div>
<pre><code data-lang="rust">use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("共享数据"));
    let b = Rc::clone(&amp;a);            // 不是复制内容!只是计数 +1
    println!("{} {}", Rc::strong_count(&amp;a), b);
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note"><b>Rc</b> 单线程用；<b>Arc</b>（Atomic rc）多线程用——计数操作是原子的，线程安全。这俩是 Python 引用计数的「亲戚」，但 Rust 的计数清零即回收、零 GC 停顿。</p>

  <h3 class="sec-title">Mutex：一次只进一个人的保险柜</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch15-mutex">▶ 运行</button></div>
<pre><code data-lang="rust">use std::sync::Mutex;

fn main() {
    let m = Mutex::new(0);
    {
        let mut g = m.lock().unwrap();   // 拿钥匙
        *g += 1;
    }                                     // g 离开作用域,自动还钥匙!
    println!("{:?}", m.lock().unwrap());
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">解锁靠作用域自动完成——<b>忘还钥匙都会被编译器记着</b>（第 16 章大战役的核心装备）。</p>

  <h3 class="sec-title">生命周期 'a：一页纸讲完</h3>
  <div class="concept">
    <h4>🧬 人话版定义</h4>
    <p>生命周期标注<b>不改变任何值的真实寿命</b>，它只是向编译器「作证」：这些引用之间的存活关系是这样这样的。90% 的情况编译器自己能推（省略规则）；推不出的才要你写。</p>
  </div>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch15-life">▶ 运行</button></div>
<pre><code data-lang="rust">// &'a 读作"活得顶多和 'a 一样久的 str 视角"
// 翻译:我返回的视角,顶多活到两个入参中较短命的那个
fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -&gt; &amp;'a str {
    if x.len() &gt; y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("长长的字符串");
    let r;
    {
        let s2 = String::from("短");
        r = longest(&amp;s1, &amp;s2);
        println!("{r}");     // ✅ 在 s2 还活着的时候用,没问题
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch15-life-err">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -&gt; &amp;'a str {
    if x.len() &gt; y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("长");
    let r;
    {
        let s2 = String::from("短");
        r = longest(&amp;s1, &amp;s2);
    }
    println!("{r}");   // ❌ s2 已经死了,r 可能指着 s2
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">生命周期防的正是 C 语言祖传惨案「<b>悬垂指针</b>」——Python 玩家没听过很正常，因为 GC 帮你挡了；Rust 没有 GC，改用编译期数学证明来挡。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>Box</b>：数据放堆上，递归类型的「底」</li>
      <li><b>Rc</b>（单线程）/ <b>Arc</b>（多线程）：一份数据多个主人，计数归零才回收</li>
      <li><b>Mutex</b>：保险柜，还钥匙是作用域自动的</li>
      <li>生命周期 <code class="ic">'a</code> 只是「作证」，不改变寿命；90% 情况编译器自己推</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "Box 最经典的用武之地是？",
      opts: ["让代码跑得更快", "递归类型封底(数据放堆上)", "自动回收内存", "字符串拼接"],
      ans: 1,
      exp: "递归类型（链表、树）会「无限套娃」导致大小算不出来，Box 把下一层搬到堆上、只留固定大小的门牌，循环就转起来了。",
    },
    {
      q: "Rc 和 Arc 的区别是？",
      opts: ["没有区别,写法偏好", "Arc 线程安全(计数是原子操作),Rc 单线程", "Rc 更快,Arc 更省内存", "Arc 只能装整数"],
      ans: 1,
      exp: "Rc 的计数操作不是原子的，跨线程会数出翔；Arc 用原子操作计数，多线程安全。口诀：单线程 Rc，多线程 Arc。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "enum List {\n    Node(i32, List),\n    Empty,\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "E0072：recursive type has infinite size。List 里面装 List，大小无限。Node(i32, Box<List>) 用 Box 封底就通了。",
    },
    {
      q: "生命周期标注 'a 的作用是？",
      opts: ["延长值的存活时间", "向编译器作证引用间的存活关系,不改变寿命", "给变量起别名", "标记垃圾回收时机"],
      ans: 1,
      exp: "'a 不创造也不延长任何东西的生命，它只是签名里的一份「证词」，让编译器能验证：返回的引用不会比它指的数据活得久。",
    },
  ],

  run: {
    "ch15-rc":    ["2 共享数据"],
    "ch15-mutex": ["1"],
    "ch15-life":  ["长长的字符串"],
  },

  errs: {
    "ch15-box": {
      lines: [
        "error[E0072]: recursive type `List` has infinite size",
        " --> src/main.rs:2:5",
        "  |",
        "2 |     Node(i32, List),",
        "  |     ^^^^^^^^^^^^^^ recursive type has infinite size",
        "  |",
        "help: insert indirection (e.g., type `Box`, `Rc`, or `&`) to break the cycle",
        "  |",
        "2 |     Node(i32, Box<List>),",
        "  |              ++++    +",
      ],
      human: "人话：套娃必须有底！编译器教你：用 Box<List> 把下一层放堆上。这个报错出现一次，你对「栈大小固定」的理解就深一层。",
    },
    "ch15-life-err": {
      lines: [
        "error[E0597]: `s2` does not live long enough",
        " --> src/main.rs:11:24",
        "  |",
        "9  |         let s2 = String::from(\"短\");",
        "   |             -- binding `s2` declared here",
        "10 |         r = longest(&s1, &s2);",
        "   |                        ---- borrow of `s2` occurs here",
        "11 |     }",
        "   |     - `s2` dropped here while still borrowed",
        "12 |     println!(\"{r}\");",
        "   |               - borrow later used here",
      ],
      human: "人话：s2 已经被回收，r 可能还指着它——悬垂指针。要么把 r 的使用挪进 s2 的作用域，要么让数据活得更久。这就是没有 GC 的 Rust 靠编译期挡下的 C 语言祖传惨案。",
    },
  },
});

/* ══════════ 第 16 章 · 多线程 ══════════ */
R.registerChapter({
  key: "ch16", order: 24, part: 2, icon: "🧵", title: "多线程",
  eyebrow: "第 16 章 · 徽章待领：🧵 并发指挥官",

  html: `
  <p class="lead">Python 玩家最懂 GIL 的痛：开 8 个线程跑 CPU，实际还是「轮流上」。Rust 没有 GIL：<b>真并行</b>，而且数据竞争在<b>编译期</b>就被消灭——你将第一次体验到「并发代码跑起来就是对的」的奢侈。</p>

  <h3 class="sec-title">spawn：发一根线程出去</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">from threading import Thread

t = Thread(target=lambda:
    print("子线程干活"))
t.start()
t.join()</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch16-spawn">▶ 运行</button></div>
<pre><code data-lang="rust">use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=3 {
            println!("子线程: {i}");
        }
    });
    for i in 1..=3 {
        println!("主线程: {i}");
    }
    handle.join().unwrap();   // ≈ Python 的 t.join()
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>
  <p class="compare-note">两根线程真·同时跑，输出顺序每次都不同——这不是 bug，是并行的本质（模拟控制台只演一种可能）。</p>

  <h3 class="sec-title">move：线程的门票</h3>
  <p>线程可能活得比「出生地」久，所以丢进线程的闭包必须 <code class="ic">move</code>——把用到的数据带走，而不是借走：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch16-move">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">use std::thread;

fn main() {
    let data = vec![1, 2, 3];
    let handle = thread::spawn(|| {        // ❌ 忘了 move
        println!("{data:?}");
    });
    handle.join().unwrap();
}</code></pre>
    <div class="console" hidden></div>
  </div>

  <h3 class="sec-title">channel：线程间的传菜口</h3>
  <p>多线程协作首选「消息传递」——一个只管发、一个只管收，不用抢锁：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch16-chan">▶ 运行</button></div>
<pre><code data-lang="rust">use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();        // 发送端 tx,接收端 rx

    thread::spawn(move || {
        for i in 1..=3 {
            tx.send(i).unwrap();           // 子线程:只管发
        }
    });

    for got in rx {                        // 主线程:收完自动结束
        println!("收到: {got}");
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">≈ Python 的 <code class="ic">queue.Queue</code>。mpsc = multi-producer single-consumer，官方鼓励「用消息共享内存，而不是用共享内存通信」。</p>

  <h3 class="sec-title">Arc&lt;Mutex&lt;T&gt;&gt;：多线程共享可变数据</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch16-arc">▶ 运行</button></div>
<pre><code data-lang="rust">use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));   // 保险柜,外面套共享计数
    let mut handles = vec![];

    for _ in 0..3 {
        let c = Arc::clone(&amp;counter);        // 每根线程办一份"共享证"
        handles.push(thread::spawn(move || {
            let mut num = c.lock().unwrap(); // 拿钥匙
            *num += 1;
        }));                                 // 还钥匙(作用域自动)
    }

    for h in handles {
        h.join().unwrap();
    }
    println!("总数: {}", *counter.lock().unwrap());
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note"><b>Arc</b> 管「三根线程都拿得到」，<b>Mutex</b> 管「一次只进一个人改」。Python 里你得自觉加 lock、忘了就数据竞争；Rust 里<b>不加锁根本编译不过</b>——这就是 Send / Sync 标记的威力，编译器替你把关谁能跨线程。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><code class="ic">thread::spawn</code> ≈ Thread；join 等它收工</li>
      <li>闭包进线程必须 <code class="ic">move</code>——带走数据，不借用</li>
      <li><b>channel</b> ≈ queue.Queue：消息传递优先于共享内存</li>
      <li><b>Arc&lt;Mutex&lt;T&gt;&gt;</b> = 共享 + 安全修改的组合拳</li>
      <li>Rust 没有 GIL：真并行，且数据竞争编译期绝迹</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "Python 多线程跑 CPU 密集任务为什么快不起来？",
      opts: ["线程太占内存", "GIL 让同一时刻只有一个线程执行 Python 字节码", "Python 线程不支持多核指令", "解释器会自动切换到单线程"],
      ans: 1,
      exp: "GIL（全局解释器锁）：任何时刻只允许一根线程跑字节码。所以 Python 圈才流行多进程。Rust 没有 GIL，8 核就是 8 倍。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "use std::thread;\n\nfn main() {\n    let data = vec![1, 2, 3];\n    let h = thread::spawn(|| println!(\"{data:?}\"));\n    h.join().unwrap();\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "线程闭包可能活得比 main 还久，借 main 的数据就是埋雷。加 move 把 data 带走：thread::spawn(move || ...)。编译器会直接教你怎么改。",
    },
    {
      q: "Arc<Mutex<T>> 为什么要俩一起上？",
      opts: ["一个管共享(Arc),一个管安全修改(Mutex)", "两个一样,随便用", "Arc 负责解锁,Mutex 负责加密", "历史遗留,新代码不用"],
      ans: 0,
      exp: "Arc 让多根线程都能「拿得到」这份数据（原子引用计数）；Mutex 保证同一时间只有一根线程「改得了」。缺一个：要么拿不到，要么一起改坏。",
    },
    {
      q: "预测一下输出：3 根线程各执行一次 num += 1，最后打印几？",
      code: "// 计数器被 Arc<Mutex<i32>> 保护\n// 3 根线程各 lock 后 +1,各 join 完毕\nprintln!(\"总数: {}\", *counter.lock().unwrap());",
      opts: ["1", "2", "3", "0 到 3 之间随机"],
      ans: 2,
      exp: "Mutex 保证 += 是排队的，3 根线程 +1 三次就是 3——永远是 3。Python 里裸奔的 count += 1 三线程可能丢更新，Rust 编译器根本不给裸奔的机会。",
    },
  ],

  run: {
    "ch16-spawn": ["主线程: 1", "子线程: 1", "子线程: 2", "主线程: 2", "子线程: 3", "主线程: 3"],
    "ch16-chan":  ["收到: 1", "收到: 2", "收到: 3"],
    "ch16-arc":   ["总数: 3"],
  },

  errs: {
    "ch16-move": {
      lines: [
        "error[E0373]: closure may outlive the current function, but it borrows `data`",
        " --> src/main.rs:5:32",
        "  |",
        "5 |     let handle = thread::spawn(|| {",
        "  |                                ^^ may outlive borrowed value `data`",
        "5 |     let data = vec![1, 2, 3];",
        "  |         ---- `data` is borrowed here",
        "  |",
        "note: thread spawns require closures that live for the `'static` lifetime",
        "help: to force the closure to take ownership of `data` (and any other",
        "      referenced variables), use the `move` keyword",
        "  |",
        "5 |     let handle = thread::spawn(move || {",
        "  |                                ++++",
      ],
      human: "人话：线程可能活到 main 都退场了，它借你的 vec 就成了断线的风筝。编译器直接给改法：加 move，把数据带走。",
    },
  },
});

/* ══════════ 第 17 章 · async/await ══════════ */
R.registerChapter({
  key: "ch17", order: 25, part: 2, icon: "⏳", title: "async/await",
  eyebrow: "第 17 章 · 徽章待领：⏳ 时空魔法师",

  html: `
  <p class="lead">写过 Python <code class="ic">asyncio</code> 或 JS 的 async？那概念你已经有了，只是换咒语：<code class="ic">async fn</code> 定义、<code class="ic">.await</code> 等待。概念章先行，真刀真枪在第 4 个实战项目（axum Web 服务）里见。</p>

  <h3 class="sec-title">对照 asyncio</h3>
  <div class="code-compare">
    <div class="code-box py">
      <div class="code-lang"><span>🐍 Python</span></div>
<pre><code data-lang="python">import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return "数据!"

async def main():
    data = await fetch_data()
    print(data)

asyncio.run(main())</code></pre>
    </div>
    <div class="code-box rust">
      <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch17-async">▶ 运行</button></div>
<pre><code data-lang="rust">async fn fetch_data() -&gt; String {
    // 假装这里在等网络回应(真代码用 tokio::time::sleep)
    String::from("数据!")
}

#[tokio::main]
async fn main() {
    let data = fetch_data().await;   // .await:等它,但线程去忙别的
    println!("{data}");
}</code></pre>
      <div class="console" hidden></div>
    </div>
  </div>

  <h3 class="sec-title">三个核心概念</h3>
  <table class="cmp-table">
    <tr><th>概念</th><th>人话</th><th>Python 对照</th></tr>
    <tr><td><code class="ic">async fn</code></td><td>定义「可暂停的任务」，调用它<b>不执行</b>，只产出一张待办单（Future）</td><td>调用协程拿到 coroutine 对象</td></tr>
    <tr><td><code class="ic">.await</code></td><td>「现在等这张待办单」——等待期间线程让出去接别的活</td><td>await</td></tr>
    <tr><td><b>runtime</b>（tokio）</td><td>真正的调度管家：决定哪个任务什么时候上 CPU</td><td>asyncio 的事件循环</td></tr>
  </table>

  <h3 class="sec-title">为什么需要 async？</h3>
  <div class="concept">
    <p>一根线程的栈要占 MB 级内存；一个 async 任务只要几百字节。服务器同时扛<b>一万条连接</b>：用线程是豪赌，用 async 是日常——这就是 Web 服务标配 async 的原因。而 Python 里你可能还听过「asyncio 性能上限在解释器」，Rust 的 tokio 是世界上最快的一档。</p>
  </div>

  <h3 class="sec-title">await 不能乱用</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch17-await">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn not_async() {                      // 普通 fn,不是 async
    let data = fetch_data().await;     // ❌ 哪来的 await?
    println!("{data}");
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">规则硬邦邦：<b>.await 只能在 async 环境里用</b>。编译器强制你待在正确的世界里——概念上和 Python 的「await 只能在 async def 里」一模一样，只是 Rust 把它编译期执法。</p>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><code class="ic">async fn</code> 产出 Future，<b>不 .await 不干活</b></li>
      <li><code class="ic">.await</code> = 等待但让出线程，只能在 async 环境用</li>
      <li><b>tokio</b> 是 runtime 管家 ≈ asyncio 事件循环</li>
      <li>async 任务轻如鸿毛——高并发服务的标配</li>
      <li>实战首秀在 P4：axum 短链服务</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "调用 async fn 之后立刻发生什么？",
      opts: ["函数立刻执行并返回结果", "返回一个 Future,什么都不干,直到 .await", "启动一根新线程", "打印警告"],
      ans: 1,
      exp: "async fn 调用 = 拿到一张「待办单」（Future），不会执行。必须 .await（或交给 runtime）它才动起来——和 Python 里调用协程函数拿到 coroutine 对象是同一个道理。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "async fn fetch() -> String { String::from(\"hi\") }\n\nfn main() {\n    let s = fetch().await;\n    println!(\"{s}\");\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 1,
      exp: "E0728：.await 只能在 async 函数/块里用。main 要么改成 #[tokio::main] async fn main()，要么把 await 挪进 async 块。",
    },
    {
      q: "tokio 之类的 runtime 在 async 里扮演什么角色？",
      opts: ["替你写代码的 AI", "调度管家:决定成千上万个任务谁什么时候上 CPU", "编译器插件", "数据库连接池"],
      ans: 1,
      exp: "Future 只是待办单，runtime 才是真正干活的车间主任——对应 asyncio 的事件循环。#[tokio::main] 就是把 main 交给这位主任。",
    },
  ],

  run: {
    "ch17-async": ["数据!"],
  },

  errs: {
    "ch17-await": {
      lines: [
        "error[E0728]: `await` is only allowed within async functions and blocks",
        " --> src/main.rs:4:26",
        "  |",
        "4 |     let data = fetch_data().await;",
        "  |                          ^^^^^^ only allowed within async functions and blocks",
      ],
      human: "人话：await 是 async 世界的通行证，普通 fn 里用就是非法入境。把函数改成 async fn，或者把这一段包进 async 块。",
    },
  },
});

/* ══════════ 第 18 章 · Cargo 工程化 ══════════ */
R.registerChapter({
  key: "ch18", order: 26, part: 2, icon: "🏗", title: "Cargo 工程化",
  eyebrow: "第 18 章 · 徽章待领：🏗 总工程师",

  html: `
  <p class="lead">从第 1 个实战项目开始，你要跟 Cargo 朝夕相处了。它一个工具顶 Python 半个工具链——学完这章，你就有资格说「我会用 Rust 干活了」。</p>

  <h3 class="sec-title">工具链对照：一个顶四个</h3>
  <table class="cmp-table">
    <tr><th>你在 Python 用</th><th>Rust 里是谁</th></tr>
    <tr><td>pip + venv + requirements.txt</td><td><b>cargo</b>（自带依赖管理、锁文件、构建）</td></tr>
    <tr><td>PyPI</td><td><b>crates.io</b></td></tr>
    <tr><td>pytest</td><td><code class="ic">cargo test</code></td></tr>
    <tr><td>sphinx</td><td><code class="ic">cargo doc</code>（从注释直接生成文档站）</td></tr>
    <tr><td>ruff / pylint</td><td><code class="ic">cargo clippy</code></td></tr>
    <tr><td>black</td><td><code class="ic">cargo fmt</code></td></tr>
  </table>

  <h3 class="sec-title">项目长什么样</h3>
<pre><code data-lang="rust" class="plain-code">todo-rs/
├── Cargo.toml      # ≈ requirements.txt:声明依赖
├── Cargo.lock      # ≈ 锁死的版本号(pip freeze 的自动版)
└── src/
    ├── main.rs     # 程序入口
    └── lib.rs      # 库代码(可选)</code></pre>

  <h3 class="sec-title">模块：默认私有，pub 才开放</h3>
  <p>Python 的一切默认公开，靠自觉；Rust 默认<b>私有</b>，开放要写 <code class="ic">pub</code>——和「不可变默认」一脉相承的哲学：</p>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run err" data-err="ch18-mod">🔍 编译器怎么说？</button></div>
<pre><code data-lang="rust">fn main() {
    helper();
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note">（假设 helper 在 src/utils.rs 里）要先用 <code class="ic">mod utils;</code> 声明模块、utils.rs 里给函数标 <code class="ic">pub</code>，再 <code class="ic">use crate::utils::helper;</code> 导入——三步一个都不能少。<code class="ic">crate::</code> 是「本项目根」，<code class="ic">super::</code> 是「上一层」，跟 Python 的相对导入心法相通。</p>

  <h3 class="sec-title">测试：写在代码旁边</h3>
  <div class="code-box">
    <div class="code-lang"><span>🦀 Rust</span><button class="btn-run" data-run="ch18-test">▶ 运行 cargo test</button></div>
<pre><code data-lang="rust">fn add(a: i32, b: i32) -&gt; i32 {
    a + b
}

#[cfg(test)]              // 这一段只在 cargo test 时编译
mod tests {
    use super::*;         // 把外面所有东西引进来

    #[test]               // 一个 #[test] = 一个测试用例
    fn test_add() {
        assert_eq!(add(1, 2), 3);
        assert_eq!(add(-1, 1), 0);
    }
}</code></pre>
    <div class="console" hidden></div>
  </div>
  <p class="compare-note"><code class="ic">cargo test</code> 一把跑完。assert_eq! 失败时会打印「左边 vs 右边」的实际值——比 pytest 的 assert 语义更贴心。</p>

  <h3 class="sec-title">日常六连</h3>
  <table class="cmp-table">
    <tr><th>命令</th><th>干嘛</th></tr>
    <tr><td><code class="ic">cargo new 项目名</code></td><td>建项目（自动 git init）</td></tr>
    <tr><td><code class="ic">cargo run</code></td><td>编译 + 运行</td></tr>
    <tr><td><code class="ic">cargo check</code></td><td><b>只查错不生成二进制</b>——写代码时的好伙伴，快得多</td></tr>
    <tr><td><code class="ic">cargo test</code></td><td>跑全部测试</td></tr>
    <tr><td><code class="ic">cargo clippy</code></td><td>资深同事 code review（lint）</td></tr>
    <tr><td><code class="ic">cargo fmt</code></td><td>一键格式化，终结缩进圣战</td></tr>
  </table>

  <div class="takeaway">
    <div class="tk-title">🎯 本章要点</div>
    <ul>
      <li><b>cargo</b> 一个顶 Python 半个工具链；crates.io ≈ PyPI</li>
      <li>模块默认<b>私有</b>，<code class="ic">pub</code> 才开放；mod / use / crate:: 三件套</li>
      <li>测试写在代码旁边：<code class="ic">#[cfg(test)] + #[test]</code>，cargo test 一把跑</li>
      <li>日常：run / check / test / clippy / fmt</li>
    </ul>
  </div>`,

  quiz: [
    {
      q: "Python 的 PyPI 在 Rust 世界对应？",
      opts: ["npm", "crates.io", "cargo.io", "GitHub"],
      ans: 1,
      exp: "crates.io 是官方包仓库。Cargo.toml 里加一行依赖，cargo 自动下载、编译、锁版本——不用 venv、不用 pip install，一个工具全包。",
    },
    {
      q: "cargo check 和 cargo build 的区别是？",
      opts: ["没有区别", "check 只查错误不生成二进制,快得多", "check 只能查测试", "build 只能用于发布"],
      ans: 1,
      exp: "写代码时的肌肉记忆：cargo check 秒级反馈编译错误，写完再 cargo build/run。这是 Rust 开发快感的来源之一。",
    },
    {
      q: "Rust 里模块和函数的默认可见性是？",
      opts: ["公开,像 Python", "私有,pub 才开放", "保护,同包可见", "看配置文件"],
      ans: 1,
      exp: "和「变量默认不可变」一脉相承：默认收着，明说才给。想要别人用，就写 pub——API 边界清清楚楚。",
    },
  ],

  run: {
    "ch18-test": ["$ cargo test", "   Compiling todo-rs v0.1.0", "    Finished test [unoptimized + debuginfo] target(s)", "     Running tests...", "test tests::test_add ... ok", "test result: ok. 1 passed; 0 failed; 0 ignored"],
  },

  errs: {
    "ch18-mod": {
      lines: [
        "error[E0433]: failed to resolve: use of undeclared crate or module `utils`",
        " --> src/main.rs:2:5",
        "  |",
        "2 |     utils::helper();",
        "  |     ^^^^^ use of undeclared crate or module `utils`",
        "  |",
        "help: consider importing this module or declaring it",
        "  |",
        "1 | mod utils;",
        "  | ++++++++++++",
      ],
      human: "人话：用了别人的模块前要先「办手续」：main.rs 顶部写 mod utils; 声明，utils.rs 里的函数标 pub 开放，然后 use 引进来——三步一个都不能省。",
    },
  },
});

/* ══════════ 进阶篇毕业考 ══════════ */
R.registerChapter({
  key: "advfinal", order: 27, part: 2, icon: "🎓", title: "进阶毕业考",
  eyebrow: "进阶篇毕业考 · 徽章待领：🎓 群岛航海家",

  html: `
  <p class="lead">6 道综合大题，覆盖第 12~18 章。<b>全部答对，你就是群岛航海家，实战大陆正式开门迎客</b>——那里有 5 个真项目、1 个隐藏支线，和你的终极毕业证。🦀</p>`,

  quiz: [
    {
      q: "编译过不过？",
      type: "compile",
      code: "fn main() {\n    let v = vec![1, 2, 3];\n    let out: Vec<i32> = v.iter().map(|x| x * 2).collect();\n    println!(\"{v:?} {out:?}\");\n}",
      opts: ["✅ 能编译", "❌ 编译报错"],
      ans: 0,
      exp: "iter() 只是借用，map/collect 产出新的 Vec，原 v 完好无损——所以打印 [1, 2, 3] [2, 4, 6]。对比 for x in v 那种「消耗式」遍历，iter 是日常首选。",
    },
    {
      q: "多线程要共享同一份「会修改」的数据，标准组合是？",
      opts: ["Rc<Box<T>>", "Arc<Mutex<T>>", "Box<dyn T>", "Vec<Arc<T>>"],
      ans: 1,
      exp: "Arc 管共享（原子计数，多线程拿得到），Mutex 管安全修改（一次只进一个人）。只 Arc 不 Mutex，编译器会在你想改的时候拦住。",
    },
    {
      q: "预测一下输出：",
      code: "let crew: Vec<Box<dyn Speak>> = vec![Box::new(Crab), Box::new(Fish)];\nfor c in &crew {\n    print!(\"{} \", c.say());\n}",
      opts: ["🦀 咔咔! 🐟 咕噜~", "编译错误:两个类型装不进同一个 Vec", "只能打印第一个", "随机打印一个"],
      ans: 0,
      exp: "Box<dyn Speak> 是「任意会说话的东西」的箱子，动态分发在运行时各找各的 say()。这就是 trait 对象——Python 玩家最熟悉的「异构列表」在 Rust 的打开方式。",
    },
    {
      q: "编译过不过？",
      type: "compile",
      code: "let r = Rc::new(5);\nlet s = Rc::clone(&r);\nprintln!(\"{}\", Rc::strong_count(&r));",
      opts: ["✅ 能编译,打印 2", "❌ 编译报错"],
      ans: 0,
      exp: "Rc::clone 只是引用计数 +1（不复制内容），strong_count 打印 2，两个主人共享同一份数据。合法且常用——但注意 Rc 只能单线程。",
    },
    {
      q: "async fn fetch_data() 被调用后，你手里拿到的是？",
      opts: ["最终结果 String", "一个 Future(待办单),.await 才执行", "一根新线程的句柄", "Option<String>"],
      ans: 1,
      exp: "async fn 的调用产出 Future，不 .await 不动。这也是为什么 main 需要 #[tokio::main]——得有人（runtime）替你执行这些待办单。",
    },
    {
      q: "cargo clippy 最像 Python 生态里的谁？",
      opts: ["black(格式化)", "ruff(lint)", "pytest(测试)", "pip(装包)"],
      ans: 1,
      exp: "clippy 是 lint 工具：扫出更地道的写法、潜在 bug、性能坑。进阶篇毕业了——记得以后每个项目都请它 code review。",
    },
  ],
});

})();
