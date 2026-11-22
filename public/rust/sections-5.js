/* ═══════════════════════════ 锈岛求生 3.0 · 第二卷细节小节(ch12~ch15) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════ 第 12 章 · 闭包(4 小节 + 2 实战) ════════ */
R.registerSections("ch12", [
{
  id: "c12s1", no: "12.1", title: "闭包的类型推断:一次定型",
  html: `
  <pre><code class="lang-rust">let add = |a, b| a + b;          // 第一次调用时定类型\nadd(1, 2);                        // 此时推断:i32\n// add(1.5, 2.5);                // ❌ 已定型为 i32,f64 不收!</code></pre>
  <p>细节:闭包参数类型<b>第一次调用时锁定</b>——之后换类型直接报错。要支持多种类型,显式写或用泛型(第 14 章)。和函数不同:闭包有<b>捕获环境</b>这个变量,类型推断要靠上下文。</p>
  <div class="exslot" data-ex="c12s1-1"></div>`,
  exercises: [
    { id: "c12s1-1", kind: "predict", xp: 10, title: "一次定型",
      task: 'add 先调 (1, 2) 定了型,再调 (3, 4) 行吗?打印什么?',
      given: "let add = |a, b| a + b;\nprintln!(\"{}\", add(1, 2));\nprintln!(\"{}\", add(3, 4));",
      expected: "3\n7",
      ref: "let add = |a, b| a + b;   // 首调 (1,2):i32 锁定\nprintln!(\"{}\", add(1, 2));   // 3\nprintln!(\"{}\", add(3, 4));   // 7 ——i32 同型,照常",
      refNote: "两次都是 i32,畅通无阻。加一行 add(1.5, 2.5) 试试编译器:已定型 i32,f64 拒收——闭包的类型是一次性的,第一次说了算。",
    },
  ],
},
{
  id: "c12s2", no: "12.2", title: "捕获三种方式:借、独占、搬走",
  html: `
  <p>闭包用外面的变量,编译器按「最少权限」自动选:</p>
  <pre><code class="lang-rust">let name = String::from(\"蟹\");\n\nlet hi = || println!(\"hi {}\", name);    // 只读:借用 &name\nhi(); hi();                              // 借用,可反复调\nprintln!(\"{}\", name);                   // ✅ name 还能用</code></pre>
  <p>只读 → 自动借 &;要改 → 自动借 &mut;被 move 或生命周期冲突 → 编译器建议 move。Rust 让你<b>不写引用也自动遵守借用规则</b>。</p>
  <div class="exslot" data-ex="c12s2-1"></div>`,
  exercises: [
    { id: "c12s2-1", kind: "predict", xp: 10, title: "借用式闭包",
      task: `闭包借了 name 只读,name 本尊还能用吗?两行打印什么?`,
      given: "let name = String::from(\"蟹\");\nlet hi = || println!(\"hi {}\", name);\nhi();\nprintln!(\"{}\", name);",
      expected: "hi 蟹\n蟹",
      ref: "let name = String::from(\"蟹\");\nlet hi = || println!(\"hi {}\", name);   // 只读:借用\nhi();        // hi 蟹\nprintln!(\"{}\", name);   // 蟹 ——本尊健在",
      refNote: "hi 蟹、蟹——闭包只借不拿,name 全程健在。编译器替你选了最轻量的捕获方式;真要搬走时(下一节 move),它会明说。",
    },
  ],
},
{
  id: "c12s3", no: "12.3", title: "move:强制搬走所有捕获",
  html: `
  <pre><code class="lang-rust">let name = String::from(\"蟹\");\nlet own = move || println!(\"我独占 {}\", name);   // move:搬进闭包\nown();\n// println!(\"{}\", name);   // ❌ name 被 move 走,作废!</code></pre>
  <p>move 不改变闭包的<b>行为</b>,只改变捕获的<b>方式</b>——借用变所有权。第 16 章线程场景是它的主场:子线程可能活得比变量久,必须搬。</p>
  <div class="exslot" data-ex="c12s3-1"></div>`,
  exercises: [
    { id: "c12s3-1", kind: "predict", xp: 10, title: "搬走之后",
      task: `move 闭包独占了 name,打印什么?(只有闭包能调)`,
      given: "let name = String::from(\"蟹\");\nlet own = move || println!(\"独占 {}\", name);\nown();",
      expected: "独占 蟹",
      ref: "let name = String::from(\"蟹\");\nlet own = move || println!(\"独占 {}\", name);   // name 搬进闭包\nown();   // 独占 蟹(name 本尊作废)",
      refNote: "打印「独占 蟹」。name 的所有权已搬家,再 println 本尊就是 E0382。move 的语义清晰:闭包说「这变量归我了」,编译器照办。",
    },
  ],
},
{
  id: "c12s4", no: "12.4", title: "闭包当参数:impl Fn 三兄弟",
  html: `
  <p>函数想收闭包,参数写 <code class="ic">impl Fn(Args) -> Ret</code>:</p>
  <pre><code class="lang-rust">fn apply(f: impl Fn(i32) -> i32, v: i32) -> i32 {\n    f(v)          // 把闭包当函数调\n}\n\nprintln!(\"{}\", apply(|x| x * 3, 7));   // 21\nprintln!(\"{}\", apply(|x| x + 100, 7));  // 107</code></pre>
  <p>Fn / FnMut / FnOnce 一页记:只读捕获 → <b>Fn</b>(最常见);要改捕获 → FnMut;要吃掉捕获 → FnOnce。参数写 impl Fn 能收前两类——日常够用。</p>
  <div class="exslot" data-ex="c12s4-1"></div>`,
  exercises: [
    { id: "c12s4-1", kind: "write", xp: 10, title: "动手写:加工流水线",
      task: `写 <code class="ic">fn apply(f: impl Fn(i32) -> i32, v: i32) -> i32</code>,main 里用两个不同闭包各调一次(翻倍、+10),打印(应得 14 和 17)。`,
      scaffold: "fn apply(f: impl Fn(i32) -> i32, v: i32) -> i32 {\n    // 调用闭包\n}\n\nfn main() {\n    // 两个闭包各调一次\n}",
      checks: [
        { label: "参数是 impl Fn(i32) -> i32", hint: "f: impl Fn(i32) -> i32", test: (s) => /impl\s+Fn\s*\(\s*i32\s*\)\s*->\s*i32/.test(s) },
        { label: "函数体里调用了闭包", hint: "f(v) ——闭包当函数用。", test: (s) => /f\s*\(\s*\w+\s*\)/.test(s) },
        { label: "main 传了两个不同闭包", hint: "apply(|x| x * 2, 7); apply(|x| x + 10, 7);", test: (s) => (s.match(/\|[^|]*\|/g) || []).length >= 2 },
      ],
      ref: "fn apply(f: impl Fn(i32) -> i32, v: i32) -> i32 {\n    f(v)\n}\n\nfn main() {\n    println!(\"{}\", apply(|x| x * 2, 7));    // 14\n    println!(\"{}\", apply(|x| x + 10, 7));   // 17\n}",
      refNote: "一个 apply,两种闭包随传随用——行为参数化:把「做什么」变成参数传进来。后面迭代器的 map/filter 全是这个模式,工厂开工。",
    },
  ],
},
{
  id: "c12f", no: "12.5", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c12f-1"></div>
  <div class="exslot" data-ex="c12f-2"></div>`,
  exercises: [
    { id: "c12f-1", kind: "big", xp: 15, title: "实战① 计数器工厂(闭包版)",
      task: '主章的 makeCounter 亲手写一遍:①<code class="ic">fn make_counter() -> impl Fn() -> i32</code>;②函数内 <code class="ic">let mut count = 0</code>;③返回闭包 <code class="ic">move || { count += 1; count }</code>(FnMut 才能改,所以签名用 <code class="ic">impl FnMut() -> i32</code>);④main 造一个 counter 调三次,打印 1、2、3。',
      scaffold: "fn make_counter() -> impl FnMut() -> i32 {\n    let mut count = 0;\n    // 返回改 count 的闭包\n}\n\nfn main() {\n    let mut c = make_counter();\n    // 调三次打印\n}",
      checks: [
        { label: "工厂函数返回闭包", hint: "fn make_counter() -> impl FnMut() -> i32 { … } ——要改捕获,F:nMut。", test: (s) => /->\s*impl\s+FnMut\s*\(\s*\)\s*->\s*i32/.test(s) },
        { label: "闭包用了 move", hint: "move || { count += 1; count } ——count 搬进闭包随身带。", test: (s) => /move\s*\|/.test(s) },
        { label: "闭包改了 count 并返回", hint: "count += 1; 后返回 count。", test: (s) => /count\s*\+=\s*1/.test(s) },
        { label: "main 调了三次打印", hint: "c(); c(); println!(\"{}\", c());", test: (s) => (s.match(/\(\)\s*;/g) || []).length >= 2 && /println!/.test(s) },
      ],
      ref: "fn make_counter() -> impl FnMut() -> i32 {\n    let mut count = 0;\n    move || {\n        count += 1;\n        count\n    }\n}\n\nfn main() {\n    let mut c = make_counter();\n    c();\n    c();\n    println!(\"{}\", c());   // 3\n}",
      refNote: "move + FnMut + 工厂函数——闭包三板斧齐活。要改捕获必须 FnMut(调用方也要 mut),这是 Fn 三兄弟分家的根本原因:改东西需要更高的权限。",
    },
    { id: "c12f-2", kind: "big", xp: 15, title: "实战② 前缀日志器",
      task: `①<code class="ic">fn make_logger(prefix: String) -> impl Fn(&str) + '_</code> 简化版:直接写 <code class="ic">fn make_logger(prefix: String) -> impl Fn(&str) -> ()</code> 不行——move 闭包不受生命周期约束,直接 <code class="ic">move |msg| println!("[{}] {}", prefix, msg)</code>;返回 <code class="ic">impl Fn(&str)</code>;②main 造 GO 和 SYS 两个日志器,各打一条(应得 <code>[GO] 启动</code> 和 <code>[SYS] 就绪</code>)。`,
      scaffold: "fn make_logger(prefix: String) -> impl Fn(&str) {\n    // move 闭包,记得 prefix\n}\n\nfn main() {\n    // 两个日志器各打一条\n}",
      checks: [
        { label: "工厂返回 impl Fn(&str)", hint: "fn make_logger(prefix: String) -> impl Fn(&str) { … }", test: (s) => /->\s*impl\s+Fn\s*\(\s*&str\s*\)/.test(s) },
        { label: "move 闭包搬走了 prefix", hint: "move |msg| println!(\"[{}] {}\", prefix, msg)", test: (s) => /move\s*\|[\s\S]*prefix/.test(s) },
        { label: "闭包打印时用上了 prefix", hint: "println!(\"[{}] {}\", prefix, msg)", test: (s) => /println![\s\S]*prefix/.test(s) },
        { label: "main 造了两个日志器", hint: "let go_log = make_logger(\"GO\".to_string()); let sys_log = make_logger(\"SYS\".to_string());", test: (s) => (s.match(/make_logger\s*\(/g) || []).length >= 2 },
      ],
      ref: "fn make_logger(prefix: String) -> impl Fn(&str) {\n    move |msg| println!(\"[{}] {}\", prefix, msg)\n}\n\nfn main() {\n    let go_log = make_logger(\"GO\".to_string());\n    let sys_log = make_logger(\"SYS\".to_string());\n\n    go_log(\"启动\");   // [GO] 启动\n    sys_log(\"就绪\");   // [SYS] 就绪\n}",
      refNote: "move 把 prefix 焊进闭包,同一座工厂出品两种性格的日志器——工厂模式在 Rust 里的原生形态就是闭包。真实项目:按模块造 logger,前缀天然分频道。",
    },
  ],
},
]);

/* ════════ 第 13 章 · 迭代器(5 小节 + 2 实战) ════════ */
R.registerSections("ch13", [
{
  id: "c13s1", no: "13.1", title: "惰性的真相:不消费不动手",
  html: `
  <pre><code class="lang-rust">let v = vec![1, 2, 3];\nv.iter().map(|x| x * 10);    // 什么都没发生!只有记账\n\nlet out: Vec<i32> = v.iter().map(|x| x * 10).collect();   // collect 才干活\nprintln!("{:?}\", out);   // [10, 20, 30]</code></pre>
  <p>迭代器适配器(map/filter/take…)全是<b>记账员</b>,只有消费者(collect/sum/count/for)上门才真正开工——一行链路一趟循环,不浪费。</p>
  <div class="exslot" data-ex="c13s1-1"></div>`,
  exercises: [
    { id: "c13s1-1", kind: "predict", xp: 10, title: "不 collect 不干活",
      task: `不消费的 map 什么都没干——这行代码会打印什么?(编译能过吗?会警告)`,
      given: "let v = vec![1, 2, 3];\nv.iter().map(|x| x * 10);\nprintln!(\"done\");",
      expected: "done",
      ref: "let v = vec![1, 2, 3];\nv.iter().map(|x| x * 10);   // 记账,不执行(#[must_use] 警告)\nprintln!(\"done\");   // done",
      refNote: "打印 done,一行转换根本没跑。编译器会警告 unused(迭代器标了 #[must_use])——这是提醒你:记账了没消费,八成忘了 collect。",
    },
  ],
},
{
  id: "c13s2", no: "13.2", title: "filter:条件筛一遍",
  html: `
  <pre><code class="lang-rust">let v = vec![1, 2, 3, 4, 5, 6];\nlet evens: Vec<i32> = v.iter()\n    .filter(|x| *x % 2 == 0)   // 筛偶数\n    .cloned()                  // &i32 → i32(小值,复制免费)\n    .collect();\nprintln!("{:?}\", evens);   // [2, 4, 6]</code></pre>
  <p>细节:iter() 给的是<b>引用</b>(&i32),filter 的闭包拿到的是<b>引用的引用</b>(&&i32),所以解两层:<code class="ic">*x % 2</code>。要值就 cloned(),对数字这种小件,复制免费。</p>
  <div class="exslot" data-ex="c13s2-1"></div>`,
  exercises: [
    { id: "c13s2-1", kind: "predict", xp: 10, title: "筛完了",
      task: `1~6 筛偶数,collect 出来是什么?`,
      given: "let v = vec![1, 2, 3, 4, 5, 6];\nlet evens: Vec<i32> = v.iter().filter(|x| *x % 2 == 0).cloned().collect();\nprintln!(\"{:?}\", evens);",
      expected: "[2, 4, 6]",
      ref: "…\n    .filter(|x| *x % 2 == 0)   // 2、4、6 过筛\n    .cloned()\n    .collect();\nprintln!(\"{:?}\", evens);   // [2, 4, 6]",
      refNote: "[2, 4, 6]。filter 的闭包返回 bool:true 过筛、false 拦下。链式组合的惯用顺序:先 filter 缩小队伍,再 map 加工,最后 collect——一趟循环干完所有事。",
    },
  ],
},
{
  id: "c13s3", no: "13.3", title: "turbofish:collect 的显式指令",
  html: `
  <pre><code class="lang-rust">let v = vec![1, 2, 3];\n\n// 推断不出装什么时,三选一:\nlet a: Vec<i32> = v.iter().map(|x| x * 2).collect();   // ① 左边标注\nlet b = v.iter().map(|x| x * 2).collect::<Vec<i32>>(); // ② turbofish ::<T>\nlet c = v.iter().map(|x| x * 2).collect::<Vec<_>>();   // ③ 半推断:装 Vec,类型自己猜</code></pre>
  <p><code class="ic">::&lt;&gt;</code> 读作 turbofish(涡轮鱼,官方梗)——collect 目标类型的三种指定姿势,三种都对,团队喜欢哪种就统一哪种。</p>
  <div class="exslot" data-ex="c13s3-1"></div>`,
  exercises: [
    { id: "c13s3-1", kind: "predict", xp: 10, title: "涡轮鱼装车",
      task: `turbofish 指定装 Vec<i32>,collect 出来是什么?`,
      given: "let v = vec![1, 2, 3];\nlet b = v.iter().map(|x| x * 2).collect::<Vec<i32>>();\nprintln!(\"{:?}\", b);",
      expected: "[2, 4, 6]",
      ref: "let b = v.iter().map(|x| x * 2).collect::<Vec<i32>>();\nprintln!(\"{:?}\", b);   // [2, 4, 6]",
      refNote: "[2, 4, 6] 装进 Vec<i32>。collect 是\"多态消费者\"——能装 Vec、HashMap、String…turbofish 就是向它下指令:这次装哪种车。名字唬人,本事朴素。",
    },
  ],
},
{
  id: "c13s4", no: "13.4", title: "消费者四件套:sum、count、max、any",
  html: `
  <pre><code class="lang-rust">let v = vec![3, 1, 4, 1, 5];\n\nlet total: i32 = v.iter().sum();            // 求和:14\nlet n = v.iter().count();                    // 计数:5\nlet max = v.iter().max();                    // 最大:Some(5)(Option!)\nlet has_big = v.iter().any(|x| *x > 4);      // 有大于4的吗:true\n\nprintln!("{} {} {:?} {}\", total, n, max, has_big);   // 14 5 Some(5) true</code></pre>
  <p>细节:max 返回 <b>Option</b>(空迭代器没最大)——消费器也守 Option 规矩;any 是短路判定:撞到第一个 true 就收工。</p>
  <div class="exslot" data-ex="c13s4-1"></div>`,
  exercises: [
    { id: "c13s4-1", kind: "predict", xp: 10, title: "四件套开箱",
      task: `对 [3, 1, 4, 1, 5] 四连问:总和、个数、最大(Option)、有大于4的吗?一行打印。`,
      given: "let v = vec![3, 1, 4, 1, 5];\nlet total: i32 = v.iter().sum();\nlet n = v.iter().count();\nlet max = v.iter().max();\nlet has_big = v.iter().any(|x| *x > 4);\nprintln!(\"{} {} {:?} {}\", total, n, max, has_big);",
      expected: "14 5 Some(5) true",
      ref: "// total = 3+1+4+1+5 = 14\n// n = 5 个\n// max = Some(5) ——Option 包装\n// has_big = true(5 > 4)\nprintln!(\"14 5 Some(5) true\");",
      refNote: "14 5 Some(5) true。max 是 Option(空队伍没最大);any 短路:一撞到 5 就 true 收工。四个消费者,四个角度,一条链一趟循环。",
    },
  ],
},
{
  id: "c13s5", no: "13.5", title: "enumerate 与 zip:位置配对",
  html: `
  <pre><code class="lang-rust">let names = vec![\"a\", \"b\", \"c\"];\n\nfor (i, name) in names.iter().enumerate() {    // 带下标遍历\n    println!(\"{}: {}\", i, name);                // 0: a …\n}\n\nlet scores = vec![90, 85, 72];\nfor (name, score) in names.iter().zip(scores.iter()) {   // 拉链配对\n    println!(\"{} -> {}\", name, score);   // a -> 90 …\n}</code></pre>
  <p>enumerate 发下标、zip 拉链配对——两者都产出<b>元组</b>,正好接住第 2 章的解构。</p>
  <div class="exslot" data-ex="c13s5-1"></div>`,
  exercises: [
    { id: "c13s5-1", kind: "predict", xp: 10, title: "发号配对",
      task: `names 和 scores 拉链后逐对打印,输出几行?各是什么?`,
      given: "let names = vec![\"a\", \"b\", \"c\"];\nlet scores = vec![90, 85, 72];\nfor (name, score) in names.iter().zip(scores.iter()) {\n    println!(\"{} -> {}\", name, score);\n}",
      expected: "a -> 90\nb -> 85\nc -> 72",
      ref: "// zip 拉链:a 配 90,b 配 85,c 配 72\nprintln!(\"a -> 90\");\nprintln!(\"b -> 85\");\nprintln!(\"c -> 72\");",
      refNote: "三行,每行一对。zip 的规则:两边谁短跟谁——配不上的一侧自动丢弃。名字配分数、单词配计数,双列表对齐的日常全靠它。",
    },
  ],
},
{
  id: "c13f", no: "13.6", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c13f-1"></div>
  <div class="exslot" data-ex="c13f-2"></div>`,
  exercises: [
    { id: "c13f-1", kind: "big", xp: 15, title: "实战① 一行流:及格名单",
      task: '数据:students <code class="ic">vec![("小蟹", 55), ("阿仓", 92), ("大白", 78)]</code>。一条迭代器链:筛出 ≥ 60 的 → 按分数降序 → 取名字装进 Vec → 打印(应得 <code>["阿仓", "大白"]</code>)。提示:filter → sort(collect 后)→ 取 .0。',
      scaffold: "fn main() {\n    let students = vec![(\"小蟹\", 55), (\"阿仓\", 92), (\"大白\", 78)];\n    // 筛 → 排 → 取名 → 打印\n}",
      checks: [
        { label: "用了 filter 筛及格", hint: ".filter(|(_, s)| *s >= 60) ——元组模式解构。", test: (s) => /filter[\s\S]*>=\s*60/.test(s) },
        { label: "排序了(降序)", hint: "collect 后 sort_by(|a, b| b.1.cmp(&a.1)) 或先 sort 再 chain。", test: (s) => /sort_by|sort\s*\(/.test(s) },
        { label: "取了名字(.0)", hint: ".map(|(name, _)| *name) 或迭代取 .0。", test: (s) => /\.0|\(\s*\w+\s*,\s*_\s*\)/.test(s) },
        { label: "打印了结果", hint: "println!(\"{:?}\", passed); → [\"阿仓\", \"大白\"]", test: (s) => /println!/.test(s) },
      ],
      ref: "fn main() {\n    let students = vec![(\"小蟹\", 55), (\"阿仓\", 92), (\"大白\", 78)];\n\n    let mut passed: Vec<(&str, i32)> = students.iter()\n        .filter(|(_, s)| *s >= 60)\n        .cloned()\n        .collect();\n    passed.sort_by(|a, b| b.1.cmp(&a.1));\n\n    let names: Vec<&str> = passed.iter().map(|(n, _)| *n).collect();\n    println!(\"{:?}\", names);   // [\"阿仓\", \"大白\"]\n}",
      refNote: "filter(元组解构模式)→ collect → sort → 再 collect 取名字。两段链:第一段筛,第二段整形输出——复杂任务拆成两条链,比硬塞一条更清晰。",
    },
    { id: "c13f-2", kind: "big", xp: 15, title: "实战② 文本流水线",
      task: '一句话 <code class="ic">"The quick brown fox jumps over the lazy dog"</code>:①split_whitespace 切词;②filter 留长度 ≥ 4 的词;③map 转 大写;④collect 成 Vec 打印(应得 <code>["QUICK", "BROWN", "JUMPS", "OVER", "LAZY"]</code>,顺序保留)。提示:len() 判长度,to_uppercase() 转大写。',
      scaffold: "fn main() {\n    let text = \"The quick brown fox jumps over the lazy dog\";\n    // 切 → 筛 → 转大写 → collect → 打印\n}",
      checks: [
        { label: "切词了", hint: "text.split_whitespace()", test: (s) => /split_whitespace\s*\(/.test(s) },
        { label: "按长度筛(≥ 4)", hint: ".filter(|w| w.len() >= 4)", test: (s) => /filter[\s\S]*len[\s\S]*>=\s*4/.test(s) },
        { label: "map 转大写", hint: ".map(|w| w.to_uppercase())", test: (s) => /to_uppercase\s*\(/.test(s) },
        { label: "collect 并打印", hint: "let words: Vec<String> = …collect(); println!(\"{:?}\", words);", test: (s) => /collect/.test(s) && /println!/.test(s) },
      ],
      ref: "fn main() {\n    let text = \"The quick brown fox jumps over the lazy dog\";\n\n    let words: Vec<String> = text.split_whitespace()\n        .filter(|w| w.len() >= 4)\n        .map(|w| w.to_uppercase())\n        .collect();\n\n    println!(\"{:?}\", words);\n    // [\"QUICK\", \"BROWN\", \"JUMPS\", \"OVER\", \"LAZY\"]\n}",
      refNote: "切 → 筛 → 变 → 装:四环一条链,一趟循环跑完全部。The(3)和 fox(3)被长度筛掉,其余全部大写。这就是迭代器链的完全体——数据像流水一样从这头流到那头。",
    },
  ],
},
]);

/* ════════ 第 14 章 · trait(5 小节 + 2 实战) ════════ */
R.registerSections("ch14", [
{
  id: "c14s1", no: "14.1", title: "impl X for Y:实现语法的解剖",
  html: `
  <pre><code class="lang-rust">trait Speak { fn say(&self) -> String; }\n\nimpl Speak for Crab {         // 语法:impl Trait for Type\n    fn say(&self) -> String {\n        String::from(\"咔咔\")   // 必须给出 trait 里每个方法的完整实现\n    }\n}</code></pre>
  <p>读法:「<b>impl Speak for Crab</b>」= 给 Crab 发 Speak 证书。语法铁三角:trait 定门槛、impl 发证书、调用处当证件用。</p>
  <div class="exslot" data-ex="c14s1-1"></div>`,
  exercises: [
    { id: "c14s1-1", kind: "blank", runDemo: { before: "struct Fish;", after: "println!(\"{}\", Fish.say());" }, xp: 10, title: "发证语法",
      task: `给 Fish 发 Speak 的证书,impl 那行空着——补出来。`,
      given: "trait Speak { fn say(&self) -> String; }\n\n____ {\n    fn say(&self) -> String { String::from(\"咕噜\") }\n}",
      placeholder: "impl … for …",
      checks: [
        { label: "impl Speak for Fish", hint: "impl Speak for Fish { … } ——impl Trait for Type,顺序别反。", test: (s) => /impl\s+Speak\s+for\s+Fish/.test(s) },
      ],
      ref: "impl Speak for Fish",
      refNote: "impl Trait for Type ——这个顺序读着最顺:给 Type 发 Trait 证。写反了(impl Fish for Speak)编译器会一头雾水。",
    },
  ],
},
{
  id: "c14s2", no: "14.2", title: "默认实现:签了约就送基础款",
  html: `
  <pre><code class="lang-rust">trait Greet {\n    fn hello(&self) -> String { String::from(\"你好\") }   // 默认实现\n    fn bye(&self) -> String;                                 // 必须自己写\n}\n\nimpl Greet for Robot {}      // hello 白送,只欠 bye\nimpl Greet for Crab {\n    fn hello(&self) -> String { String::from(\"咔!\") }     // 不满意?覆盖默认\n    fn bye(&self) -> String { String::from(\"咔咔拜\") }\n}</code></pre>
  <p>默认实现的妙处:常用行为一份写好,大家白拿;特殊需求<b>按类型覆盖</b>——多态的 Rust 味儿。</p>
  <div class="exslot" data-ex="c14s2-1"></div>`,
  exercises: [
    { id: "c14s2-1", kind: "predict", xp: 10, title: "白送还是覆盖",
      task: `Robot 只实现了 bye(没写 hello),它说 hello 用哪个版本?`,
      given: "trait Greet {\n    fn hello(&self) -> String { String::from(\"你好\") }\n}\nstruct Robot;\nimpl Greet for Robot { fn hello(&self) -> String { String::from(\"你好\") } }\n\nprintln!(\"{}\", Robot.hello());",
      expected: "你好",
      ref: "// Robot 没自己实现 hello → 用 trait 的默认实现\nprintln!(\"{}\", Robot.hello());   // 你好(白送的)",
      refNote: "打印「你好」——trait 里写好的默认版本直接生效。默认实现是 trait 的赠品机制:基础款人人有,高配自己装。",
    },
  ],
},
{
  id: "c14s3", no: "14.3", title: "trait bound:泛型函数的入场券",
  html: `
  <pre><code class="lang-rust">// 方式一:尖括号里直接写\nfn largest<T: PartialOrd>(a: T, b: T) -> T {\n    if a > b { a } else { b }\n}\n\n// 方式二:where 从句(复杂约束时更清晰)\nfn show<T>(x: T) where T: std::fmt::Debug {\n    println!("{:?}\", x);\n}</code></pre>
  <p>trait bound 读作「<b>T 必须持有这张证书</b>」——largest 要求 T 可比较(PartialOrd),show 要求 T 可打印(Debug)。约束写在签名,编译器替你把关每一次调用。</p>
  <div class="exslot" data-ex="c14s3-1"></div>`,
  exercises: [
    { id: "c14s3-1", kind: "blank", runDemo: { after: "println!(\"{}\", largest(3, 7));" }, xp: 10, title: "给泛型加门槛",
      task: `largest 要比较 a、b,泛型 T 空着——补上能比较的约束。`,
      given: "fn largest<T: ____>(a: T, b: T) -> T {\n    if a > b { a } else { b }\n}",
      placeholder: "PartialOrd",
      checks: [
        { label: "约束是 PartialOrd", hint: "T: PartialOrd ——能比大小的证书。", test: (s) => /PartialOrd/.test(s) },
      ],
      ref: "PartialOrd",
      refNote: "PartialOrd 是「支持 > < 比较」的证书。没这张证,T 没法比大小——trait bound 就是把「我需要什么能力」白纸黑字写进签名。",
    },
  ],
},
{
  id: "c14s4", no: "14.4", title: "dyn Trait:运行时才知道是谁",
  html: `
  <pre><code class="lang-rust">let team: Vec<Box<dyn Speak>> = vec![Box::new(Crab), Box::new(Fish)];\n\nfor s in &team {\n    println!(\"{}\", s.say());   // 运行时查表:每只动物用自己的实现\n}</code></pre>
  <p><code class="ic">dyn Trait</code> = 「持有这张证书的<b>某种</b>类型」——编译期不查身、运行时查表(动态分发)。代价:每次调用查一次表;换来:异构列表(一队不同动物)。</p>
  <div class="exslot" data-ex="c14s4-1"></div>`,
  exercises: [
    { id: "c14s4-1", kind: "predict", xp: 10, title: "一队异构",
      task: `Box<dyn Speak> 装了 Crab 和 Fish,各自的 say 会响吗?打印几行?`,
      given: "trait Speak { fn say(&self) -> &'static str; }\nstruct Crab;\nstruct Fish;\nimpl Speak for Crab { fn say(&self) -> &'static str { \"咔咔\" } }\nimpl Speak for Fish { fn say(&self) -> &'static str { \"咕噜\" } }\n\nlet team: Vec<Box<dyn Speak>> = vec![Box::new(Crab), Box::new(Fish)];\nfor s in &team {\n    println!(\"{}\", s.say());\n}",
      expected: "咔咔\n咕噜",
      ref: "// Crab::say() → 咔咔\n// Fish::say() → 咕噜\n// 同一个循环,两个实现 ——动态分发的魔力",
      refNote: "两行:咔咔、咕噜。同一个 s.say() 调用,运行时各找各的表——这就是动态分发。Python 天生如此;Rust 让你按需付费:要异构用 dyn,同构用泛型(零查表)。",
    },
  ],
},
{
  id: "c14s5", no: "14.5", title: "derive 的幕后:编译器写的 impl",
  html: `
  <p><code class="ic">#[derive(Debug)]</code> 展开后,就是编译器默默替你写的一整段 <code class="ic">impl Debug for YourType</code>——你见过的注解,全是<b>代码生成器</b>:</p>
  <pre><code class="lang-rust">#[derive(Debug)]        // ≈ 编译器自动写:\nstruct P { x: i32 }     // impl Debug for P { …一整套打印逻辑 }</code></pre>
  <p>常用证件再数一遍:Debug(打印)、Clone(复制)、PartialEq(==)、Default(零值)、PartialOrd(排序)。derive 一行 = 编译器几百字,这是 Rust 宏力量的第一次亮相。</p>
  <div class="exslot" data-ex="c14s5-1"></div>`,
  exercises: [
    { id: "c14s5-1", kind: "predict", xp: 10, title: "一行的背后",
      task: `derive(Debug) 之后,{:?} 能打印 struct 了。这行打印什么?`,
      given: "#[derive(Debug)]\nstruct P { x: i32, y: i32 }\n\nprintln!(\"{:?}\", P { x: 1, y: 2 });",
      expected: "P { x: 1, y: 2 }",
      ref: "#[derive(Debug)]\nstruct P { x: i32, y: i32 }\nprintln!(\"{:?}\", P { x: 1, y: 2 });\n// P { x: 1, y: 2 } ——编译器写的 Debug 实现",
      refNote: "P { x: 1, y: 2 } ——这个格式是编译器替你写的 Debug 实现产出的。你只写了一行注解,背后是一整段 impl——宏的世界,大门刚开了一条缝。",
    },
  ],
},
{
  id: "c14f", no: "14.6", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c14f-1"></div>
  <div class="exslot" data-ex="c14f-2"></div>`,
  exercises: [
    { id: "c14f-1", kind: "big", xp: 15, title: "实战① 形状系统完整版",
      task: '①<code class="ic">trait Area { fn area(&self) -> f64 }</code>;②Circle(r: f64) 和 Rect(w: f64, h: f64) 各自实现 area(π 取 3.14159);③泛型函数 <code class="ic">fn print_area&lt;T: Area&gt;(s: &T)</code>:打印面积;④main:圆(r=2)和矩形(3×4)各调 print_area,打印 <code>12.56636</code> 和 <code>12</code>。',
      scaffold: "trait Area { fn area(&self) -> f64; }\n\n// Circle / Rect + 各自 area\n\nfn print_area<T: Area>(s: &T) {\n    // 打印\n}\n\nfn main() {\n    // 两种形状各打印\n}",
      checks: [
        { label: "Circle 和 Rect 都实现了 Area", hint: "impl Area for Circle { fn area(&self) -> f64 { … } } ×2。", test: (s) => (s.match(/impl\s+Area\s+for\s+\w+/g) || []).length >= 2 },
        { label: "print_area 用了 trait bound", hint: "fn print_area<T: Area>(s: &T)", test: (s) => /fn\s+print_area\s*<\s*T\s*:\s*Area\s*>/.test(s) },
        { label: "main 各调用一次", hint: "print_area(&Circle { r: 2.0 }); print_area(&Rect { w: 3.0, h: 4.0 });", test: (s) => (s.match(/print_area\s*\(/g) || []).length >= 2 },
      ],
      ref: "trait Area { fn area(&self) -> f64; }\n\nstruct Circle { r: f64 }\nstruct Rect { w: f64, h: f64 }\n\nimpl Area for Circle {\n    fn area(&self) -> f64 { 3.14159 * self.r * self.r }\n}\nimpl Area for Rect {\n    fn area(&self) -> f64 { self.w * self.h }\n}\n\nfn print_area<T: Area>(s: &T) {\n    println!(\"{}\", s.area());\n}\n\nfn main() {\n    print_area(&Circle { r: 2.0 });   // 12.56636\n    print_area(&Rect { w: 3.0, h: 4.0 });   // 12\n}",
      refNote: "trait 定门槛、两个 impl 发证、泛型函数查证——三章合一。print_area 不知道也不关心形状是谁:有 Area 证书的都能进。明早加 Triangle?一个 impl 就接入,print_area 一行不改。",
    },
    { id: "c14f-2", kind: "big", xp: 15, title: "实战② 动物园混合编队",
      task: '①<code class="ic">trait Speak { fn say(&self) -> String }</code>;②Dog、Cat、Robot 三种都实现 say(台词自选);③main:<code class="ic">Vec&lt;Box&lt;dyn Speak&gt;</code> 装三种,循环全员发言;打印三行。',
      scaffold: "trait Speak { fn say(&self) -> String; }\n\n// Dog / Cat / Robot 三个实现\n\nfn main() {\n    // Box<dyn Speak> 混合编队 → 循环发言\n}",
      checks: [
        { label: "三种类型都实现了 Speak", hint: "impl Speak for Dog / Cat / Robot ——三个 impl。", test: (s) => (s.match(/impl\s+Speak\s+for\s+\w+/g) || []).length >= 3 },
        { label: "用了 Box<dyn Speak> 编队", hint: "let team: Vec<Box<dyn Speak>> = vec![Box::new(Dog), …];", test: (s) => /Box\s*<\s*dyn\s+Speak\s*>/.test(s) },
        { label: "循环全员发言", hint: "for s in &team { println!(\"{}\", s.say()); }", test: (s) => /for[\s\S]*s\.say\s*\(\s*\)/.test(s) },
      ],
      ref: "trait Speak { fn say(&self) -> String; }\n\nstruct Dog; struct Cat; struct Robot;\n\nimpl Speak for Dog { fn say(&self) -> String { \"汪!\".into() } }\nimpl Speak for Cat { fn say(&self) -> String { \"喵~\".into() } }\nimpl Speak for Robot { fn say(&self) -> String { \"滴——\".into() } }\n\nfn main() {\n    let team: Vec<Box<dyn Speak>> = vec![Box::new(Dog), Box::new(Cat), Box::new(Robot)];\n    for s in &team {\n        println!(\"{}\", s.say());   // 汪! 喵~ 滴——\n    }\n}",
      refNote: "三种毫无血缘关系的类型,靠一张 Speak 证书编入一队——动态分发让「同一行代码,三种声音」成为现实。第 16 章线程收任务、第 17 章异步收回调,都是这张证书的延伸场景。",
    },
  ],
},
]);

/* ════════ 第 15 章 · 智能指针与生命周期(5 小节 + 2 实战) ════════ */
R.registerSections("ch15", [
{
  id: "c15s1", no: "15.1", title: "Box:堆上的第一块砖",
  html: `
  <pre><code class="lang-rust">let b = Box::new(5);    // 5 住进堆里,b 只是门牌\nprintln!("{}", *b);      // * 顺门牌取值:5</code></pre>
  <p>Box 的本职:<b>把数据搬到堆上</b>。日常最大用场是<b>递归类型</b>(主章见过:enum 里套自己,不 Box 就无限大)。普通数据不必上堆——Box 不是习惯,是<b>需要才用</b>。</p>
  <div class="exslot" data-ex="c15s1-1"></div>`,
  exercises: [
    { id: "c15s1-1", kind: "predict", xp: 10, title: "顺门牌取值",
      task: `Box 装着 5,*b 取出来是几?打印什么?`,
      given: "let b = Box::new(5);\nprintln!(\"{}\", *b);",
      expected: "5",
      ref: "let b = Box::new(5);   // 堆上住 5,栈上是门牌\nprintln!(\"{}\", *b);   // *:顺门牌取 → 5",
      refNote: "*b = 5 ——星号是\"顺着指针/Box 拿值\"的通用记号。Box 还能自动解引用:大多数方法直接 b.method() 就行,不用手写 *。",
    },
  ],
},
{
  id: "c15s2", no: "15.2", title: "Rc:一份数据多张主人卡",
  html: `
  <pre><code class="lang-rust">use std::rc::Rc;\n\nlet a = Rc::new(String::from(\"共享\"));\nlet b = Rc::clone(&a);    // 不是复制内容!主人卡 +1\n\nprintln!(\"{} {}\", Rc::strong_count(&a), b);   // 2 共享\n// 最后一张卡注销时,数据才销毁</code></pre>
  <p>打破"唯一主人"铁律的<b>单线程</b>方案:Rc 计数主人卡,谁用谁领卡、走时退卡,<b>清零销毁</b>。跨线程必须换 Arc(Atomic 计数,第 16 章见)。</p>
  <div class="exslot" data-ex="c15s2-1"></div>`,
  exercises: [
    { id: "c15s2-1", kind: "predict", xp: 10, title: "主人卡计数",
      task: `a 原卡 + b 克隆一张,计数是几?打印什么?`,
      given: "use std::rc::Rc;\n\nlet a = Rc::new(String::from(\"共享\"));\nlet b = Rc::clone(&a);\nprintln!(\"{} {}\", Rc::strong_count(&a), b);",
      expected: "2 共享",
      ref: "let a = Rc::new(String::from(\"共享\"));   // 计数 1\nlet b = Rc::clone(&a);                   // 计数 2(不是复制!)\nprintln!(\"{} {}\", Rc::strong_count(&a), b);   // 2 共享",
      refNote: "2 张卡、一份数据。Rc::clone 只加计数,堆上那间房还是同一间——这就是\"共享\"的账本式实现。记好主线:Rc 单线程、Arc 跨线程。",
    },
  ],
},
{
  id: "c15s3", no: "15.3", title: "Mutex:带锁的保险柜",
  html: `
  <pre><code class="lang-rust">use std::sync::Mutex;\n\nlet m = Mutex::new(0);\n{\n    let mut g = m.lock().unwrap();   // 拿钥匙\n    *g += 1;\n}    // ← g 到这里销毁,锁自动归还!(又是作用域的魔法)\n\nprintln!(\"{:?}\", m.lock().unwrap());   // 1</code></pre>
  <p>和别的语言比,Rust 的 Mutex 有个绝活:<b>锁的归还绑定在作用域上</b>——忘了还?编译后的作用域自动帮你还,不存在"忘 unlock"这种经典事故。</p>
  <div class="exslot" data-ex="c15s3-1"></div>`,
  exercises: [
    { id: "c15s3-1", kind: "predict", xp: 10, title: "自动还钥匙",
      task: `内层块里 +1,g 销毁时锁归还,外层再开柜看到几?`,
      given: "use std::sync::Mutex;\n\nlet m = Mutex::new(0);\n{\n    let mut g = m.lock().unwrap();\n    *g += 1;\n}\nprintln!(\"{:?}\", m.lock().unwrap());",
      expected: "1",
      ref: "…\n    let mut g = m.lock().unwrap();\n    *g += 1;    // 柜里:1\n}   // g 销毁 → 锁自动归还\nprintln!(\"{:?}\", m.lock().unwrap());   // 1",
      refNote: "开柜看到 1。锁跟随 g 的生命周期:g 死锁归还——Rust 把「忘还钥匙」这个并发经典 bug 编译成了不可能发生的事。",
    },
  ],
},
{
  id: "c15s4", no: "15.4", title: "生命周期 'a:向编译器作证",
  html: `
  <pre><code class="lang-rust">// 问题:返回的视角,顶多活多久?\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y\n}\n// 'a 读作:返回值活不过 'a(两个入参中较短命的那个)</code></pre>
  <p>三个要点:①'标注<b>不改寿命</b>,只是<b>向编译器作证</b>;②证据不足(存在活不过 'a 的场景)就报错拦下;③90% 情况编译器自己推(elision 规则,下一节),推不出才要你写。</p>
  <div class="exslot" data-ex="c15s4-1"></div>`,
  exercises: [
    { id: "c15s4-1", kind: "blank", runDemo: { after: "println!(\"{}\", longest(\"Rust\", \"Go\"));" }, xp: 10, title: "作证标签",
      task: `给 longest 补上一整行函数签名，参数和返回值要写明生命周期，末尾不用加左花括号。`,
      given: "____ {\n    if x.len() > y.len() { x } else { y }\n}",
      placeholder: "'a, &'a …",
      checks: [
        { label: "泛型参数声明了 'a", hint: "fn longest<'a>(…)", test: (s) => /<\s*'\w+\s*>/.test(s) },
        { label: "两个参数都标了 &'a str", hint: "x: &'a str, y: &'a str", test: (s) => /&'\w+\s+str[\s\S]*&'\w+\s+str/.test(s) },
        { label: "返回类型也标了 &'a str", hint: "-> &'a str ——和入参同一个标签。", test: (s) => /->\s*&'\w+\s+str/.test(s) },
      ],
      ref: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str",
      refNote: "一个 'a 三处贴牢:两个入参、一个返回——标签含义是「返回值顶多活到 'a」(入参里较短命的那个)。作证通过,悬垂引用无处遁形。",
    },
  ],
},
{
  id: "c15s5", no: "15.5", title: "elision:编译器的三条默认规则",
  html: `
  <p>为什么日常函数几乎不用写 'a?编译器有三条<b>省略规则</b>自动标注:</p>
  <pre><code class="lang-rust">fn first_word(s: &str) -> &str { … }   // 无需标注!\n// 规则:入参只有 & 一个 → 它的寿命自动给所有返回 &</code></pre>
  <p>三条:①每个 & 入参自动领自己的 'a;②只有一个入参 & → 返回值跟它同寿;③&self 方法 → 返回值跟 self 同寿。推得出就免写——所以<b>要你写的场景,一定是编译器拿不准的</b>(比如两个入参,返回值不知跟谁走)。</p>
  <div class="exslot" data-ex="c15s5-1"></div>`,
  exercises: [
    { id: "c15s5-1", kind: "predict", xp: 10, title: "编译器的静默工作",
      task: `这个函数没写 'a,编译器按规则自动推了。返回视角取第一个词,打印什么?`,
      given: "fn first_word(s: &str) -> &str {\n    s.split_whitespace().next().unwrap_or(\"\")\n}\n\nprintln!(\"{}\", first_word(\"hello world\"));",
      expected: "hello",
      ref: "fn first_word(s: &str) -> &str { … }   // elision:返回和入参同寿\nprintln!(\"{}\", first_word(\"hello world\"));   // hello",
      refNote: "hello ——一个 & 入参,编译器自动判「返回值跟它同寿」,无需手写 'a。等你哪天写两个入参的 longest,它才要求你作证:到底跟谁走?这时 'a 出场。",
    },
  ],
},
{
  id: "c15f", no: "15.6", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c15f-1"></div>
  <div class="exslot" data-ex="c15f-2"></div>`,
  exercises: [
    { id: "c15f-1", kind: "big", xp: 15, title: "实战① 递归链表完整版",
      task: '①<code class="ic">enum List { Node(i32, Box&lt;List&gt;), Empty }</code>;②函数 <code class="ic">fn push(head: List, v: i32) -> List</code>:返回新头节点(老链表塞进 Box 当尾巴);③main:Empty 起,依次 push 1、2、3,用 Debug 打印整条链(应得 <code>Node(3, Node(2, Node(1, Empty)))</code>)。',
      scaffold: "#[derive(Debug)]\nenum List { Node(i32, Box<List>), Empty }\n\nfn push(head: List, v: i32) -> List {\n    // 新节点接管老链表\n}\n\nfn main() {\n    // Empty → push 1 → push 2 → push 3 → {:?} 打印\n}",
      checks: [
        { label: "enum 用了 Box 封底", hint: "Node(i32, Box<List>) ——不 Box 就 E0072 无限大小。", test: (s) => /Box\s*<\s*List\s*>/.test(s) },
        { label: "push 返回新头节点", hint: "List::Node(v, Box::new(head)) ——新值当头,老链当尾。", test: (s) => /Node\s*\(\s*\w+\s*,\s*Box::new\s*\(\s*\w+\s*\)/.test(s) },
        { label: "main 依次 push 三个", hint: "let l = push(push(push(List::Empty, 1), 2), 3); 或 step by step。", test: (s) => (s.match(/push\s*\(/g) || []).length >= 3 },
        { label: "Debug 打印了整条链", hint: "println!(\"{:?}\", l); → Node(3, Node(2, Node(1, Empty)))", test: (s) => /\{:\?\}/.test(s) },
      ],
      ref: "#[derive(Debug)]\nenum List { Node(i32, Box<List>), Empty }\n\nfn push(head: List, v: i32) -> List {\n    List::Node(v, Box::new(head))   // 新头吞老链\n}\n\nfn main() {\n    let l = push(push(push(List::Empty, 1), 2), 3);\n    println!(\"{:?}\", l);\n    // Node(3, Node(2, Node(1, Empty)))\n}",
      refNote: "Box 封底 + 每次 push 都吞下旧链——3 在最外层,因为最后 push。递归类型的\"俄罗斯套娃\"就这样长成;数据结构的教科书写法,你的第一份。",
    },
    { id: "c15f-2", kind: "big", xp: 15, title: "实战② 作证练习:longest",
      task: `亲手写带生命周期的 <code class="ic">longest</code>:①完整签名(三个 'a 标注);②函数体返回更长的那个;③main:两个不同 String 的视角调一次,再故意用一个<b>内层短命</b>的 String 调一次——把使用挪进内层作用域,证明编译器拦下(本地跑,注释掉报错行看效果)。打印第一次的结果(应得 <code>长字符串</code>)。`,
      scaffold: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    // 更长的返回\n}\n\nfn main() {\n    let s1 = String::from(\"长字符串\");\n    let s2 = String::from(\"短\");\n    println!(\"{}\", longest(&s1, &s2));\n}",
      checks: [
        { label: "签名三处 'a 齐全", hint: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str", test: (s) => /<\s*'\w+\s*>[\s\S]*&'\w+\s+str[\s\S]*&'\w+\s+str[\s\S]*->\s*&'\w+\s+str/.test(s) },
        { label: "函数体返回更长者", hint: "if x.len() > y.len() { x } else { y }", test: (s) => /x\.len\(\)\s*>\s*y\.len\(\)/.test(s) },
        { label: "main 调用并打印", hint: "println!(\"{}\", longest(&s1, &s2)); → 长字符串", test: (s) => /longest\s*\(\s*&\w+\s*,\s*&\w+\s*\)/.test(s) && /println!/.test(s) },
      ],
      ref: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nfn main() {\n    let s1 = String::from(\"长字符串\");\n    let s2 = String::from(\"短\");\n    println!(\"{}\", longest(&s1, &s2));   // 长字符串\n}\n\n// 挑战(本地试):\n// {\n//     let temp = String::from(\"更短\");\n//     let r = longest(&s1, &temp);\n//     println!(\"{}\", r);\n// }   // ❌ E0597:temp 活不过 r ——生命周期标注抓现行!",
      refNote: "正常调用打印「长字符串」。本地跑挑战段:temp 生在内层块里,出去就死,而 r 的类型证明它顶多活到较短者(temp)——编译器当场拦下。生命周期不是玄学,是编译器替你守的「悬垂引用防火墙」。",
    },
  ],
},
]);

})();
