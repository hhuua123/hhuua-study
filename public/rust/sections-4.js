/* ═══════════════════════════ 锈岛求生 3.0 · 第一卷细节小节(ch9~ch11) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════ 第 9 章 · enum + match(7 小节 + 2 实战) ════════ */
R.registerSections("ch9", [
{
  id: "c9s1", no: "9.1", title: "解构:match 能拆开取内容",
  html: `
  <p>变体带行李,match 模式可以<b>当场拆包给行李起名</b>:</p>
  <pre><code class="lang-rust">enum Msg {\n    Text(String),      // 带一个 String\n    Move { x: i32, y: i32 },   // 像匿名 struct\n}\n\nmatch msg {\n    Msg::Text(content) => println!("内容:{}", content),   // content:拆出来的名字!\n    Msg::Move { x, y } => println!("到 ({}, {})", x, y),   // x、y:当场解构\n}</code></pre>
  <div class="exslot" data-ex="c9s1-1"></div>`,
  exercises: [
    { id: "c9s1-1", kind: "predict", xp: 10, title: "拆包取名",
      task: 'Msg::Text("hi".to_string()) 走哪个分支,拆出来的 content 是什么?打印什么?',
      given: "enum Msg { Text(String) }\n\nlet m = Msg::Text(\"hi\".to_string());\nmatch m {\n    Msg::Text(content) => println!(\"内容:{}\", content),\n}",
      expected: "内容:hi",
      ref: "let m = Msg::Text(\"hi\".to_string());\nmatch m {\n    Msg::Text(content) => println!(\"内容:{}\", content),\n    //           ↑ content:行李当场拆出、起名\n}",
      refNote: "content 是 match 当场创造的变量名——模式匹配不只是「对上号」,还在对上号的同时把行李交到你手上。这就是它比 if-else 链强大的根源。",
    },
  ],
},
{
  id: "c9s2", no: "9.2", title: "穷尽性是重构的安全网",
  html: `
  <p>match 漏一个变体,编译器点名到每一处:</p>
  <pre><code class="lang-rust">enum Status { Idle, Running, Error }\n\nfn desc(s: &Status) -> &str {\n    match s {\n        Status::Idle => "待机",\n        Status::Running => "运行中",\n        // 漏了 Error → error[E0004]: non-exhaustive patterns\n    }\n}</code></pre>
  <p>明天你给 Status 加个 <code class="ic">Paused</code> 变体——<b>所有 match 处全部亮红</b>,一处不漏。这就是「加变体,编译器点名」的重构安全网。</p>
  <div class="exslot" data-ex="c9s2-1"></div>`,
  exercises: [
    { id: "c9s2-1", kind: "predict", xp: 10, title: "谁接住了 Error",
      task: `三个分支都写齐了,Error 走哪支?打印什么?`,
      given: "enum Status { Idle, Running, Error }\n\nlet s = Status::Error;\nlet r = match s {\n    Status::Idle => \"待机\",\n    Status::Running => \"运行中\",\n    Status::Error => \"出错了\",\n};\nprintln!(\"{}\", r);",
      expected: "出错了",
      ref: "…\n    Status::Error => \"出错了\",   // Error 落在这支\n…\nprintln!(\"{}\", r);   // 出错了",
      refNote: "Error 被第三支接住,match 的值是 \"出错了\"。穷尽性保证:任何 Status 值扔进来,必有归处——运行时永远不慌。",
    },
  ],
},
{
  id: "c9s3", no: "9.3", title: "守卫:模式后面加 if 精修",
  html: `
  <pre><code class="lang-rust">let n = 42;\nmatch n {\n    x if x < 0 => println!("负数"),\n    x if x % 2 == 0 => println!("偶数:{}", x),   // 守卫:附加条件\n    _ => println!("正奇数"),\n}</code></pre>
  <p><b>守卫(match guard)</b>:模式先对号,再过 if 这道精修关。同一个模式 + 不同守卫 = 多条分支,细分场景不用堆枚举变体。</p>
  <div class="exslot" data-ex="c9s3-1"></div>`,
  exercises: [
    { id: "c9s3-1", kind: "predict", xp: 10, title: "过守卫的门",
      task: `42 先过「x < 0」守卫(不过),再过「偶数」守卫(过!),打印什么?`,
      given: "let n = 42;\nmatch n {\n    x if x < 0 => println!(\"负数\"),\n    x if x % 2 == 0 => println!(\"偶数:{}\", x),\n    _ => println!(\"正奇数\"),\n}",
      expected: "偶数:42",
      ref: "// 42 < 0?否,第一支守卫不放行\n// 42 % 2 == 0?是!第二支收留\nprintln!(\"偶数:{}\", 42);   // 偶数:42",
      refNote: "守卫从上往下试,过了就收。守卫 = 模式的精装修:同值不同待遇(偶数的 42 和奇数的 43),一个模式 + if 全办。",
    },
  ],
},
{
  id: "c9s4", no: "9.4", title: "@ 绑定:既要范围、又要值",
  html: `
  <pre><code class="lang-rust">match age {\n    n @ 0..=12 => println!("小孩({} 岁)", n),    // @ :范围对上,值也叫 n\n    n @ 13..=19 => println!("少年({} 岁)", n),\n    n => println!("成人({} 岁)", n),\n}</code></pre>
  <p>光写 <code class="ic">0..=12</code> 只知道"落进范围",<b>@ 把命中的具体数字也交给你</b>——既要分类、又要报数的场景一箭双雕。</p>
  <div class="exslot" data-ex="c9s4-1"></div>`,
  exercises: [
    { id: "c9s4-1", kind: "predict", xp: 10, title: "范围 + 值双收",
      task: `age = 8 落进 0..=12,@ 把 8 交给你。打印什么?`,
      given: "let age = 8;\nmatch age {\n    n @ 0..=12 => println!(\"小孩({} 岁)\", n),\n    n @ 13..=19 => println!(\"少年({} 岁)\", n),\n    n => println!(\"成人({} 岁)\", n),\n}",
      expected: "小孩(8 岁)",
      ref: "let age = 8;\nmatch age {\n    n @ 0..=12 => println!(\"小孩({} 岁)\", n),   // n 绑定到 8\n    …\n}",
      refNote: "n @ 0..=12:落在 0~12,n 的值就是 8 本尊。没有 @,你只知道\"是小孩\",不知道几岁——@ 让 match 从「分类器」升级成「分类 + 提取器」。",
    },
  ],
},
{
  id: "c9s5", no: "9.5", title: "if let:只想管一个分支的简写",
  html: `
  <p>match 四行起步太重?只关心一个变体时,if let 是瘦身版:</p>
  <pre><code class="lang-rust">if let Some(v) = maybe {\n    println!("有值:{}", v);   // 只处理 Some,None 不用管\n}\n\n// 对照 match 写法:\n// match maybe { Some(v) => println!(...), _ => {} }   ← 4 行</code></pre>
  <div class="exslot" data-ex="c9s5-1"></div>`,
  exercises: [
    { id: "c9s5-1", kind: "predict", xp: 10, title: "if let 只接一支",
      task: `maybe 是 Some(5),if let 接住打印什么?`,
      given: "let maybe = Some(5);\nif let Some(v) = maybe {\n    println!(\"有值:{}\", v);\n}",
      expected: "有值:5",
      ref: "let maybe = Some(5);\nif let Some(v) = maybe {\n    println!(\"有值:{}\", v);   // v = 5\n}",
      refNote: "if let = match 只开一支的简写。后面 Option 章你会天天用它——「有就处理,没有拉倒」的场景,它就是本命句式。",
    },
  ],
},
{
  id: "c9s6", no: "9.6", title: "let-else:没有就早点走人",
  html: `
  <p>Rust 1.65 新姿势:模式不匹配就<b>整段函数提前退出</b>:</p>
  <pre><code class="lang-rust">fn first_upper(v: Vec<String>) -> String {\n    let Some(first) = v.into_iter().next() else {\n        return "空集合".to_string();   // else 分支必须发散:return/panic/break\n    };\n    first.to_uppercase()   // 走到这里,first 一定有值\n}</code></pre>
  <p>if let 的镜像:if let 管"有值走这边",let-else 管<b>"没值你先走,别堵路"</b>——主干代码不被嵌套。</p>
  <div class="exslot" data-ex="c9s6-1"></div>`,
  exercises: [
    { id: "c9s6-1", kind: "predict", xp: 10, title: "else 的提前退场",
      task: `传一个非空 Vec,let-else 不触发,first 拿到第一个元素。打印什么?`,
      given: "let v = vec![\"go\".to_string(), \"rust\".to_string()];\nlet Some(first) = v.into_iter().next() else {\n    panic!(\"空\");\n};\nprintln!(\"{}\", first);",
      expected: "go",
      ref: "let Some(first) = v.into_iter().next() else {\n    panic!(\"空\");   // Vec 非空,这行不触发\n};\nprintln!(\"{}\", first);   // go",
      refNote: "Vec 有货 → next() 给 Some(\"go\") → 模式对上,else 跳过,first 落地。空 Vec 才走 else。「先排除异常,主干直着走」——let-else 是卫语句在模式世界的化身。",
    },
  ],
},
{
  id: "c9s7", no: "9.7", title: "_ 通配的代价:新变体被静默吞掉",
  html: `
  <pre><code class="lang-rust">match s {\n    Status::Idle => "…",\n    Status::Running => "…",\n    _ => "未知",     // ⚠️ Paused 明天加了,这里不点名,直接被吞进"未知"\n}</code></pre>
  <p>穷尽性是重构安全网,<code class="ic">_</code> 是把安全网剪了个洞。规则:<b>处理自己 enum 时不用 _</b>(让编译器点名);处理别人的或真的想兜底才用。</p>
  <div class="exslot" data-ex="c9s7-1"></div>`,
  exercises: [
    { id: "c9s7-1", kind: "predict", xp: 10, title: "通配的沉默",
      task: `Error 落进 _ ,打印什么?`,
      given: "enum Status { Idle, Error }\n\nlet s = Status::Error;\nlet r = match s {\n    Status::Idle => \"待机\",\n    _ => \"其他\",    // Error 被静默吞进这里\n};\nprintln!(\"{}\", r);",
      expected: "其他",
      ref: "…\n    _ => \"其他\",   // Error 落网,但不点名\n…\nprintln!(\"{}\", r);   // 其他",
      refNote: "打印\"其他\"。如果哪天你给 Status 加了 Paused,它也会被默默吞进 _——不报错、不点名。自己定义的 enum 尽量写全变体,把穷尽性这张安全网留给自己。",
    },
  ],
},
{
  id: "c9f", no: "9.8", title: "🎯 本章实战(2 题)",
  html: `<p>match 全火力实战。</p>
  <div class="exslot" data-ex="c9f-1"></div>
  <div class="exslot" data-ex="c9f-2"></div>`,
  exercises: [
    { id: "c9f-1", kind: "big", xp: 15, title: "实战① 计算器 match 版",
      task: '①enum Op { Add, Sub, Mul, Div };②<code class="ic">fn calc(op: Op, a: f64, b: f64) -> f64</code>:match 四分支算结果(Div 时 b==0 返回 f64::NAN);③main 里四种 Op 各调用一次并打印(应得 7、-1、12、NaN)。',
      scaffold: "enum Op { Add, Sub, Mul, Div }\n\nfn calc(op: Op, a: f64, b: f64) -> f64 {\n    // match 四分支\n}\n\nfn main() {\n    // 四次调用打印\n}",
      checks: [
        { label: "match 穷尽了四个变体", hint: "match op { Op::Add => …, Op::Sub => …, Op::Mul => …, Op::Div => … } ——四支,不用 _。", test: (s) => /match[\s\S]*Op::Add[\s\S]*Op::Sub[\s\S]*Op::Mul[\s\S]*Op::Div/.test(s) },
        { label: "Div 处理了零除", hint: "Op::Div => if b == 0.0 { f64::NAN } else { a / b },", test: (s) => /Div[\s\S]*NAN|Div[\s\S]*==\s*0/.test(s) },
        { label: "main 四次调用打印", hint: "println!(\"{}\", calc(Op::Add, 3.0, 4.0)); ——四次。", test: (s) => (s.match(/calc\s*\(/g) || []).length >= 5 && (s.match(/println!/g) || []).length >= 4 },
      ],
      ref: "enum Op { Add, Sub, Mul, Div }\n\nfn calc(op: Op, a: f64, b: f64) -> f64 {\n    match op {\n        Op::Add => a + b,\n        Op::Sub => a - b,\n        Op::Mul => a * b,\n        Op::Div => {\n            if b == 0.0 { f64::NAN } else { a / b }\n        }\n    }\n}\n\nfn main() {\n    println!(\"{}\", calc(Op::Add, 3.0, 4.0));   // 7\n    println!(\"{}\", calc(Op::Sub, 3.0, 4.0));   // -1\n    println!(\"{}\", calc(Op::Mul, 3.0, 4.0));   // 12\n    println!(\"{}\", calc(Op::Div, 1.0, 0.0));    // NaN\n}",
      refNote: "第 3 章用 if 链写的 calc,match 重写一遍:枚举四变体、match 四分支、穷尽性兜底——明天加个 Mod 变体,编译器立刻点名两处(calc + 它的 match)。这就是 enum+match 的架构红利。",
    },
    { id: "c9f-2", kind: "big", xp: 15, title: "实战② 消息路由器",
      task: '①enum Msg { Ping, Text(String), Move { x: i32, y: i32 } };②<code class="ic">fn handle(msg: Msg)</code>:match 三分支——Ping 打"心跳",Text 拆包打"收到:内容",Move 解构打"移动到 (x, y)";③main 三种消息各发一条(应得 <code>心跳</code>、<code>收到:hi</code>、<code>移动到 (3, 5)</code>)。',
      scaffold: "enum Msg {\n    Ping,\n    Text(String),\n    Move { x: i32, y: i32 },\n}\n\nfn handle(msg: Msg) {\n    // match 三分支:拆包 + 解构\n}\n\nfn main() {\n    // 三种消息各发一条\n}",
      checks: [
        { label: "match 处理了三种变体", hint: "match msg { Msg::Ping => …, Msg::Text(…) => …, Msg::Move { … } => … }", test: (s) => /Msg::Ping[\s\S]*Msg::Text[\s\S]*Msg::Move/.test(s) },
        { label: "Text 分支拆出了内容", hint: "Msg::Text(content) => println!(\"收到:{}\", content),", test: (s) => /Msg::Text\s*\(\s*\w+\s*\)/.test(s) },
        { label: "Move 分支解构了 x y", hint: "Msg::Move { x, y } => println!(\"移动到 ({}, {})\", x, y),", test: (s) => /Msg::Move\s*\{\s*x\s*,\s*y\s*\}/.test(s) },
        { label: "main 三条消息都发了", hint: "handle(Msg::Ping); handle(Msg::Text(…)); handle(Msg::Move { x: 3, y: 5 });", test: (s) => (s.match(/handle\s*\(/g) || []).length >= 3 },
      ],
      ref: "enum Msg {\n    Ping,\n    Text(String),\n    Move { x: i32, y: i32 },\n}\n\nfn handle(msg: Msg) {\n    match msg {\n        Msg::Ping => println!(\"心跳\"),\n        Msg::Text(content) => println!(\"收到:{}\", content),\n        Msg::Move { x, y } => println!(\"移动到 ({}, {})\", x, y),\n    }\n}\n\nfn main() {\n    handle(Msg::Ping);\n    handle(Msg::Text(\"hi\".to_string()));\n    handle(Msg::Move { x: 3, y: 5 });\n}",
      refNote: "一个 enum 描述消息全集,一个 match 路由全部——拆包、解构、穷尽,一章武功一题打尽。第 16 章 channel 传 Msg,第 17 章异步消息也是 Msg:这道骨架你会反复用到。",
    },
  ],
},
]);

/* ════════ 第 10 章 · Option(5 小节 + 2 实战) ════════ */
R.registerSections("ch10", [
{
  id: "c10s1", no: "10.1", title: "Option 的一家人:unwrap 家族",
  html: `
  <pre><code class="lang-rust">let x = Some(5);\n\nx.unwrap()               // 5 ——None 时 panic(原型期用)\nx.unwrap_or(0)           // 5 ——None 时给 0\nx.unwrap_or_default()     // 5 ——None 时给类型默认值\nx.unwrap_or_else(|| 99)  // 5 ——None 时执行闭包拿替代值</code></pre>
  <p>选用标准:<b>unwrap_or(默认值)</b> 是日常主力;unwrap_or_else 收一个<b>惰性闭包</b>——默认值要费劲算时才用它,省下"有值也白算"的浪费。</p>
  <div class="exslot" data-ex="c10s1-1"></div>`,
  exercises: [
    { id: "c10s1-1", kind: "predict", xp: 10, title: "各回各家",
      task: `三个 unwrap 家族成员各自处理同一个 Some(5),打印三行。`,
      given: "let x = Some(5);\nprintln!(\"{}\", x.unwrap());\nprintln!(\"{}\", x.unwrap_or(0));\nprintln!(\"{}\", x.unwrap_or_else(|| 99));",
      expected: "5\n5\n5",
      ref: "let x = Some(5);\n// 三种姿势全是 5 ——有值时殊途同归\nprintln!(\"{}\", x.unwrap());\nprintln!(\"{}\", x.unwrap_or(0));\nprintln!(\"{}\", x.unwrap_or_else(|| 99));",
      refNote: "有值时三家全给 5——差别只在 None 时:panic / 给 0 / 算一个 99。 unwrap_or_else 的闭包是惰性的:有值就不执行,这是它对 unwrap_or(算好的值) 的性能优势。",
    },
  ],
},
{
  id: "c10s2", no: "10.2", title: "map:有值就加工,没值就跳过",
  html: `
  <pre><code class="lang-rust">let some = Some(5);\nlet doubled = some.map(|x| x * 2);     // Some(10)\nlet none: Option<i32> = None;\nlet skipped = none.map(|x| x * 2);     // None ——闭包根本不执行\n\nprintln!("{:?} {:?}", doubled, skipped);   // Some(10) None</code></pre>
  <p>map 读作「<b>有就加工,没有就原样空着</b>」——不用 match 手动分叉,一行流水。</p>
  <div class="exslot" data-ex="c10s2-1"></div>`,
  exercises: [
    { id: "c10s2-1", kind: "predict", xp: 10, title: "None 的待遇",
      task: `Some(5) 和 None 各自 map 翻倍,打印什么?`,
      given: "let a = Some(5);\nlet b: Option<i32> = None;\nprintln!(\"{:?} {:?}\", a.map(|x| x * 2), b.map(|x| x * 2));",
      expected: "Some(10) None",
      ref: "let a = Some(5);\nlet b: Option<i32> = None;\na.map(|x| x * 2)   // Some(10) ——加工\nb.map(|x| x * 2)   // None ——跳过(闭包都没执行)\nprintln!(\"{:?} {:?}\", …);   // Some(10) None",
      refNote: "None.map(…) 直接原样返回 None,连闭包都不启动——map 自动处理了「没有」这个分支,你只写「有」的逻辑。",
    },
  ],
},
{
  id: "c10s3", no: "10.3", title: "and_then:级联 Option 的传送带",
  html: `
  <p>函数返回 Option,想链起来?and_then 把「内层的 Option」拍平:</p>
  <pre><code class="lang-rust">fn half(n: i32) -> Option<i32> {\n    if n % 2 == 0 { Some(n / 2) } else { None }\n}\n\nlet r = Some(8).and_then(half).and_then(half);   // Some(2):8→4→2\nlet bad = Some(7).and_then(half);               // None:7 是奇数\nprintln!("{:?} {:?}", r, bad);   // Some(2) None</code></pre>
  <p>区别:map 的闭包返回<b>普通值</b>,and_then 的闭包返回<b>Option</b>——链式流水线里,后者才能层层传递「可能有、可能没有」。</p>
  <div class="exslot" data-ex="c10s3-1"></div>`,
  exercises: [
    { id: "c10s3-1", kind: "predict", xp: 10, title: "传送带断层",
      task: `8 一路减半两次是几?7 第一次就卡住,结果各是什么?`,
      given: "fn half(n: i32) -> Option<i32> {\n    if n % 2 == 0 { Some(n / 2) } else { None }\n}\n\nprintln!(\"{:?}\", Some(8).and_then(half).and_then(half));\nprintln!(\"{:?}\", Some(7).and_then(half));",
      expected: "Some(2)\nNone",
      ref: "// 8 → half → 4 → half → 2:Some(2)\n// 7 → half → None:当场断流,后续 and_then 全跳过\nprintln!(\"Some(2)\");\nprintln!(\"None\");",
      refNote: "7 是奇数,第一环就断流——后面的 and_then 看到 None 直接躺平。这就是「级联可能失败」的标准处理:任何一环断掉,整条线安静地变 None,不炸不闹。",
    },
  ],
},
{
  id: "c10s4", no: "10.4", title: "?:Option 世界的绿色通道",
  html: `
  <pre><code class="lang-rust">fn first_char(s: &str) -> Option<char> {\n    let ch = s.chars().next()?;    // ? :None 就提前 return None\n    Some(ch.to_uppercase().next()?)\n}</code></pre>
  <p>? 只能用在<b>返回 Option 的函数里</b>:遇到 None 提前回家;有值解包继续——把「match 判断再返回」的六行姿势压成一个字符。</p>
  <div class="exslot" data-ex="c10s4-1"></div>`,
  exercises: [
    { id: "c10s4-1", kind: "fix", xp: 10, title: "? 放错了房间",
      task: `main 返回 (),不是 Option ——? 在这儿没有回家的路。修法任选:①把 main 返回类型改 Result<(), ()> 不好搞——直接删掉 ?,用 match 或 if let 处理。把修好的完整代码打出来。`,
      given: "fn main() {\n    let x: Option<i32> = Some(5);\n    let v = x?;\n    println!(\"{}\", v);\n}",
      errText: "error[E0277]: the '?' operator can only be used in a function that returns 'Result' or 'Option'",
      scaffold: "fn main() {\n    let x: Option<i32> = Some(5);\n    let v = x?;\n    println!(\"{}\", v);\n}",
      checks: [
        { label: "? 已移除", hint: "把 x? 换成 match 或 if let 的解包写法。", test: (s) => !/\?;/.test(s) || !/\w\?;/.test(s) },
        { label: "用 match 或 if let 解了包", hint: "if let Some(v) = x { println!(\"{}\", v); } 或 match x { Some(v) => println!(\"{}\", v), _ => {} }", test: (s) => /if\s+let\s+Some|match\s+\w+/.test(s) },
      ],
      ref: "fn main() {\n    let x: Option<i32> = Some(5);\n    if let Some(v) = x {\n        println!(\"{}\", v);\n    }\n}",
      refNote: "? 的契约:函数签名承诺返回 Option,? 才有「带 None 回家」的路。main 返回 () ——没这条路,老实用 if let / match。契约先行,这是 Rust 的行事风。",
    },
  ],
},
{
  id: "c10s5", no: "10.5", title: "filter:给 Option 加安检",
  html: `
  <pre><code class="lang-rust">let n = Some(10);\nlet even = n.filter(|x| x % 2 == 0);   // Some(10):过了安检\nlet odd = Some(7).filter(|x| x % 2 == 0); // None:7 没过\n\nprintln!("{:?} {:?}", even, odd);   // Some(10) None</code></pre>
  <p>filter:值存在且<b>满足条件才放行</b>——把「有值但值不对」也统一归入 None,一个口径管到底。</p>
  <div class="exslot" data-ex="c10s5-1"></div>`,
  exercises: [
    { id: "c10s5-1", kind: "predict", xp: 10, title: "安检口",
      task: `Some(7) 过偶数安检,结果是什么形态?`,
      given: "let odd = Some(7).filter(|x| x % 2 == 0);\nprintln!(\"{:?}\", odd);",
      expected: "None",
      ref: "let odd = Some(7).filter(|x| x % 2 == 0);\nprintln!(\"{:?}\", odd);   // None ——7 没过安检,统一当\"没有\"处理",
      refNote: "Some(7) 过不了偶数安检,变 None。业务含义:「找到了但不符合要求」和「没找到」对下游一样——都是 None。一个口径,下游少一套分支。",
    },
  ],
},
{
  id: "c10f", no: "10.6", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c10f-1"></div>
  <div class="exslot" data-ex="c10f-2"></div>`,
  exercises: [
    { id: "c10f-1", kind: "big", xp: 15, title: "实战① 查成绩流水线",
      task: '①函数 <code class="ic">fn score_of(m: &HashMap<&str, i32>, name: &str) -> Option&lt;i32&gt;</code>:get 查询(借用 map);②main:建 map 装 小蟹:90、阿仓:85;③查"小蟹"(map+filter 过 80 分)打印 Some;查"路人" 打印 None;查"阿仓"配 filter(&lt; 80) 打印 None(85 没过)。三行用 {:?} 打印。',
      scaffold: "use std::collections::HashMap;\n\nfn main() {\n    let mut m = HashMap::new();\n    m.insert(\"小蟹\", 90);\n    m.insert(\"阿仓\", 85);\n\n    // ① 查小蟹 → map/filter → 打印\n    // ② 查路人 → 打印\n    // ③ 查阿仓 + filter(< 80) → 打印\n}",
      checks: [
        { label: "用了 get 查询", hint: "m.get(\"小蟹\") ——返回 Option<&i32>。", test: (s) => /get\s*\(\s*\"/.test(s) },
        { label: "用了 map 加工或 filter 安检", hint: "m.get(\"小蟹\").map(|s| *s) 或 .filter(|s| **s > 80)。", test: (s) => /\.map\s*\(|\.filter\s*\(/.test(s) },
        { label: "三行 {:?} 打印", hint: "println!(\"{:?}\", …); ——三处。", test: (s) => (s.match(/\{:\?\}/g) || []).length >= 3 },
      ],
      ref: "use std::collections::HashMap;\n\nfn main() {\n    let mut m = HashMap::new();\n    m.insert(\"小蟹\", 90);\n    m.insert(\"阿仓\", 85);\n\n    let a = m.get(\"小蟹\").map(|s| *s).filter(|s| *s > 80);\n    let b = m.get(\"路人\").map(|s| *s);\n    let c = m.get(\"阿仓\").map(|s| *s).filter(|s| *s < 80);\n\n    println!(\"{:?} {:?} {:?}\", a, b, c);   // Some(90) None None\n}",
      refNote: "一条流水线:get(可能有)→ map(解引用加工)→ filter(条件安检)。三种「没有」:路人不存在、阿仓 85 不满足 <80 ——全部安静地变 None。Option 的组合美学:每一步都可能是 None,但代码一行不多写。",
    },
    { id: "c10f-2", kind: "big", xp: 15, title: "实战② 链式解析器",
      task: '①函数 <code class="ic">fn parse_pos(s: &str) -> Option&lt;i32&gt;</code>:trim 后 parse(用 ? 一步到底:<code class="ic">s.trim().parse().ok()</code>),再 filter 大于 0;②main:parse_pos("42") 打印 Some(42)、parse_pos("-5") 打印 None、parse_pos("abc") 打印 None。',
      scaffold: "fn parse_pos(s: &str) -> Option<i32> {\n    // trim → parse → ok → filter(>0)\n}\n\nfn main() {\n    // 三次调用 {:?} 打印\n}",
      checks: [
        { label: "函数返回 Option<i32>", hint: "fn parse_pos(s: &str) -> Option<i32>", test: (s) => /fn\s+parse_pos\s*\(\s*\w+\s*:\s*&str\s*\)\s*->\s*Option\s*<\s*i32\s*>/.test(s) },
        { label: "parse 用 .ok() 转成 Option", hint: "s.trim().parse::<i32>().ok() ——Result 转 Option。", test: (s) => /parse[\s\S]*\.ok\s*\(\s*\)/.test(s) },
        { label: "filter 只放正数", hint: ".filter(|n| *n > 0)", test: (s) => /filter\s*\(\s*\|[\s\S]*>\s*0/.test(s) },
        { label: "main 三次调用打印", hint: "println!(\"{:?}\", parse_pos(\"42\")); ——三次。", test: (s) => (s.match(/parse_pos\s*\(/g) || []).length >= 3 },
      ],
      ref: "fn parse_pos(s: &str) -> Option<i32> {\n    s.trim()\n        .parse::<i32>()\n        .ok()                 // Result → Option\n        .filter(|n| *n > 0)   // 只放正数\n}\n\nfn main() {\n    println!(\"{:?}\", parse_pos(\"42\"));    // Some(42)\n    println!(\"{:?}\", parse_pos(\"-5\"));    // None(负数被 filter 拦)\n    println!(\"{:?}\", parse_pos(\"abc\"));   // None(parse 失败 → None)\n}",
      refNote: ".ok() 是 Result 和 Option 的桥:错误直接折叠成 None。parse → ok → filter:文本世界的「可能失败的三连」,一行流水线全收。",
    },
  ],
},
]);

/* ════════ 第 11 章 · Result(6 小节 + 2 实战) ════════ */
R.registerSections("ch11", [
{
  id: "c11s1", no: "11.1", title: "err 的三种处置:修、交、报",
  html: `
  <pre><code class="lang-rust">match divide(10, 0) {\n    Ok(v) => println!("结果 {}", v),\n    Err(e) => println!("出错了 {}", e),   // 处置一:就地处理(报给用户)\n}\n\nlet v = divide(10, 0)?;    // 处置二:交货上抛(? 往上传)\n\nlet v = divide(10, 0).unwrap_or(0);   // 处置三:给默认值(修)</code></pre>
  <p>三种处置对应三种场景:<b>就地报</b>(UI 层)、<b>往上交</b>(中间层,? 的主场)、<b>给兜底</b>(有合理默认)。忌讳的是 unwrap——那是把雷埋到运行时。</p>
  <div class="exslot" data-ex="c11s1-1"></div>`,
  exercises: [
    { id: "c11s1-1", kind: "predict", xp: 10, title: "兜底的体面",
      task: `divide(10, 0) 是 Err,unwrap_or 兜住给 0。打印什么?`,
      given: "fn divide(a: i32, b: i32) -> Result<i32, &'static str> {\n    a.checked_div(b).ok_or(\"无法整除\")\n}\n\nlet v = divide(10, 0).unwrap_or(0);\nprintln!(\"{}\", v);",
      expected: "0",
      ref: "let v = divide(10, 0).unwrap_or(0);   // Err → 兜底 0\nprintln!(\"{}\", v);   // 0",
      refNote: "有合理默认值时,unwrap_or 是最优雅的处置。注意区分:unwrap 是 panic,unwrap_or 是体面兜底——差一个「_or(默认)」,差一份安全。",
    },
  ],
},
{
  id: "c11s2", no: "11.2", title: "?:最经济的甩锅,只走同一条回家路",
  html: `
  <p>? 的家规:函数返回什么错误类型,? 甩的就是什么类型。函数声明返回 <code class="ic">io::Error</code>,里面用 ? 甩 ParseIntError?——编译器说<b>类型对不上</b>,要显式转换:</p>
  <pre><code class="lang-rust">use std::num::ParseIntError;\n\nfn parse(s: &str) -> Result<i32, ParseIntError> {\n    let n: i32 = s.parse()?;        // parse 的错就是 ParseIntError:同路,直通\n    Ok(n * 2)\n}</code></pre>
  <p>不同类型混 ? 时用 <code class="ic">map_err</code> 桥接(下一节实战见),或统一走 Box<dyn Error> 万能通道(11.4)。</p>
  <div class="exslot" data-ex="c11s2-1"></div>`,
  exercises: [
    { id: "c11s2-1", kind: "predict", xp: 10, title: "? 的同路原则",
      task: `parse("abc") 失败,? 提前把 Err(ParseIntError) 甩回家。程序打印 Err 还是 Ok？`,
      given: "use std::num::ParseIntError;\n\nfn parse(s: &str) -> Result<i32, ParseIntError> {\n    let n: i32 = s.parse()?;\n    Ok(n * 2)\n}\n\nprintln!(\"{}\", if parse(\"abc\").is_err() { \"Err\" } else { \"Ok\" });",
      expected: "Err",
      ref: "fn parse(s: &str) -> Result<i32, ParseIntError> {\n    let n: i32 = s.parse()?;   // abc 解析失败 → ? 把 Err 原样甩回\n    Ok(n * 2)\n}\nprintln!(\"{}\", if parse(\"abc\").is_err() { \"Err\" } else { \"Ok\" });   // Err",
      refNote: "Err ——错误被 ? 原路送回调用方。parse 的错误类型恰好和函数声明一致,直通;换一个类型就得 map_err 桥接——兼容的错误类型也可由 From 自动转换。",
    },
  ],
},
{
  id: "c11s3", no: "11.3", title: "自定义错误:给自己的业务起名字",
  html: `
  <pre><code class="lang-rust">#[derive(Debug)]\nenum AgeError {\n    TooYoung,         // 未成年\n    Negative,         // 负数?离谱\n}\n\nfn set_age(n: i32) -> Result<(), AgeError> {\n    if n < 0 { return Err(AgeError::Negative); }\n    if n < 18 { return Err(AgeError::TooYoung); }\n    Ok(())              // () :成功时没有附带数据\n}</code></pre>
  <p>细节:<b>Result&lt;(), E&gt;</b> 表示「成功不给货、失败给错误」——纯校验类函数的标准签名。match 处理时每个 Err 变体都能点名。</p>
  <div class="exslot" data-ex="c11s3-1"></div>`,
  exercises: [
    { id: "c11s3-1", kind: "predict", xp: 10, title: "点名的错误",
      task: `set_age(-5) 走哪支?打印什么?`,
      given: "#[derive(Debug)]\nenum AgeError { TooYoung, Negative }\n\nfn set_age(n: i32) -> Result<(), AgeError> {\n    if n < 0 { return Err(AgeError::Negative); }\n    if n < 18 { return Err(AgeError::TooYoung); }\n    Ok(())\n}\n\nprintln!(\"{:?}\", set_age(-5));",
      expected: "Err(Negative)",
      ref: "…\n    if n < 0 { return Err(AgeError::Negative); }   // -5 命中\n…\nprintln!(\"{:?}\", set_age(-5));   // Err(Negative)",
      refNote: "Err(Negative) ——错误本身就是 enum,每个变体都能 match 点名。业务错误起名字,调用方 match 一看就懂:这句错误是什么性质。",
    },
  ],
},
{
  id: "c11s4", no: "11.4", title: "Box<dyn Error>:万能错误通道",
  html: `
  <p>函数里要 ? 好几种不同错误(io 的、parse 的)?用 <code class="ic">Box&lt;dyn Error&gt;</code> 统一装:</p>
  <pre><code class="lang-rust">use std::error::Error;\n\nfn read_num(path: &str) -> Result<i32, Box<dyn Error>> {\n    let text = std::fs::read_to_string(path)?;   // io::Error → 装箱\n    let n: i32 = text.trim().parse()?;            // ParseIntError → 装箱\n    Ok(n)\n}</code></pre>
  <p>Box<dyn Error> = 「<b>任何错误都装</b>」的黑箱接口,? 自动转换装箱。写小工具的标配签名;大型项目会有更精细的自定义错误层。</p>
  <div class="exslot" data-ex="c11s4-1"></div>`,
  exercises: [
    { id: "c11s4-1", kind: "blank", runDemo: { before: "use std::error::Error;", after: "std::fs::write(\"exercise-number.txt\", \"42\").expect(\"写入示例文件\");\nprintln!(\"{:?}\", read_num(\"exercise-number.txt\"));" }, xp: 10, title: "万能通道的签名",
      task: `函数内部 ? 两种不同错误,签名要能全装。把返回类型的空补出来。`,
      given: "fn read_num(path: &str) -> Result<i32, ____> {\n    let text = std::fs::read_to_string(path)?;\n    Ok(text.trim().parse()?)\n}",
      placeholder: "Box<dyn Error>",
      checks: [
        { label: "用了 Box<dyn Error>", hint: "Box<dyn Error> ——全大写 Box,尖括号里 dyn Error。", test: (s) => /Box\s*<\s*dyn\s+Error\s*>/.test(s) },
      ],
      ref: "Box<dyn Error>",
      refNote: "Box<dyn Error> 的 ? 自动把各种错误装箱统一——小工具的万能通道,工具人签名的标配。注意文件开头要 use std::error::Error;。",
    },
  ],
},
{
  id: "c11s5", no: "11.5", title: "unwrap vs expect:雷的礼貌分级",
  html: `
  <pre><code class="lang-rust">let n: i32 = \"42\".parse().unwrap();          // panic:报错信息干巴巴\nlet m: i32 = \"42\".parse().expect(\"配置里的数字写错了\");  // panic:带着你的话走</code></pre>
  <p>unwrap 和 expect 都会 panic,区别是 expect <b>带着你的话走</b>。原则:原型期两样都行;要留就留 expect——未来的你 debug 时会感谢那句遗言。</p>
  <div class="exslot" data-ex="c11s5-1"></div>`,
  exercises: [
    { id: "c11s5-1", kind: "predict", xp: 10, title: "雷的分级",
      task: `两个都是雷。成功路径下(能 parse),各打印什么?`,
      given: "let n: i32 = \"42\".parse().unwrap();\nlet m: i32 = \"42\".parse().expect(\"配置错了\");\nprintln!(\"{} {}\", n, m);",
      expected: "42 42",
      ref: "let n: i32 = \"42\".parse().unwrap();         // 有值:不炸\nlet m: i32 = \"42\".parse().expect(\"配置错了\");  // 同上\nprintln!(\"{} {}\", n, m);   // 42 42",
      refNote: "42 42——成功路径下两个都不炸。差别只在失败时:unwrap 干巴巴地 panic,expect 会连你的提示一起喊出来。生产代码里要留就留 expect,遗言很重要。",
    },
  ],
},
{
  id: "c11s6", no: "11.6", title: "main 也能返回 Result",
  html: `
  <pre><code class="lang-rust">fn main() -> Result<(), Box<dyn Error>> {\n    let n: i32 = \"abc\".parse()?;    // main 里也能用 ? !\n    println!(\"{}\", n);\n    Ok(())\n}</code></pre>
  <p>main 的返回值由运行时接收:Err 时自动打印错误并以非零码退出——<b>CLI 工具的标准写法</b>,整个 main 一路 ? 到底。</p>
  <div class="exslot" data-ex="c11s6-1"></div>`,
  exercises: [
    { id: "c11s6-1", kind: "predict", xp: 10, title: "main 的绿色通道",
      task: `parse 成功时走正常路,打印什么?(\"42\" 能 parse)`,
      given: "fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let n: i32 = \"42\".parse()?;\n    println!(\"{}\", n);\n    Ok(())\n}",
      expected: "42",
      ref: "fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let n: i32 = \"42\".parse()?;   // Some → 42,继续\n    println!(\"{}\", n);              // 42\n    Ok(())\n}",
      refNote: "打印 42。改 \"abc\" 再跑:? 会把错误交给运行时,程序报错退出(exit code 1)——CLI 的标准行为,连错误处理都写好了。",
    },
  ],
},
{
  id: "c11f", no: "11.7", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c11f-1"></div>
  <div class="exslot" data-ex="c11f-2"></div>`,
  exercises: [
    { id: "c11f-1", kind: "big", xp: 15, title: "实战① 校验器全家桶",
      task: '①<code class="ic">enum PassError { Short, NoDigit }</code>(derive Debug);②<code class="ic">fn check(pw: &str) -> Result&lt;(), PassError&gt;</code>:len &lt; 6 返回 Short、不含数字字符(遍历 chars,any 是数字)返回 NoDigit、都过返回 Ok(());③main:check(\"abc\") 打印 Err(Short),check(\"abcdef\") 打印 Err(NoDigit),check(\"abc123\") 打印 Ok(())。',
      scaffold: "#[derive(Debug)]\nenum PassError { Short, NoDigit }\n\nfn check(pw: &str) -> Result<(), PassError> {\n    // 长度 → 数字字符 → Ok\n}\n\nfn main() {\n    // 三次调用 {:?} 打印\n}",
      checks: [
        { label: "长度校验返回 Short", hint: "if pw.len() < 6 { return Err(PassError::Short); }", test: (s) => /len\s*\(\s*\)[\s\S]*<\s*6[\s\S]*Short/.test(s) },
        { label: "数字校验返回 NoDigit", hint: "if !pw.chars().any(|c| c.is_ascii_digit()) { return Err(PassError::NoDigit); }", test: (s) => /chars[\s\S]*any|is_ascii_digit|is_numeric/.test(s) && /NoDigit/.test(s) },
        { label: "成功返回 Ok(())", hint: "Ok(()) ——纯校验函数的标配。", test: (s) => /Ok\s*\(\s*\(\s*\)\s*\)/.test(s) },
        { label: "main 三次调用打印", hint: "println!(\"{:?}\", check(\"abc\")); ——三次。", test: (s) => (s.match(/check\s*\(/g) || []).length >= 3 },
      ],
      ref: "#[derive(Debug)]\nenum PassError { Short, NoDigit }\n\nfn check(pw: &str) -> Result<(), PassError> {\n    if pw.len() < 6 {\n        return Err(PassError::Short);\n    }\n    if !pw.chars().any(|c| c.is_ascii_digit()) {\n        return Err(PassError::NoDigit);\n    }\n    Ok(())\n}\n\nfn main() {\n    println!(\"{:?}\", check(\"abc\"));      // Err(Short)\n    println!(\"{:?}\", check(\"abcdef\"));   // Err(NoDigit)\n    println!(\"{:?}\", check(\"abc123\"));   // Ok(())\n}",
      refNote: "Result<(), E> 签名 + 自定义错误 enum + chars().any() ——校验器三件套齐活。三种密码各归各位:短了 Short、没数字 NoDigit、合格 Ok(())。",
    },
    { id: "c11f-2", kind: "big", localOnly: true, xp: 15, title: "实战② 文件读取全链路",
      task: '①<code class="ic">fn read_config(path: &str) -> Result&lt;String, Box&lt;dyn std::error::Error&gt;</code>:read_to_string 里 ?;再 trim;内容为空返回 Err(自造:<code class="ic">Err(\"空配置\".into())</code>);否则 Ok(trimmed.to_string());②main 返回 Result<(), Box<dyn Error>>:调用 read_config(不存在的路径)用 ? ——错误自动上抛到 main 退出。③打印成功时的内容(本地跑会用一个不存在的路径,看到自动退出效果)。',
      scaffold: "use std::error::Error;\n\nfn read_config(path: &str) -> Result<String, Box<dyn Error>> {\n    // 读取 ? → trim → 空则报错 → Ok\n}\n\nfn main() -> Result<(), Box<dyn Error>> {\n    let text = read_config(\"no_such_file.txt\")?;\n    println!(\"{}\", text);\n    Ok(())\n}",
      checks: [
        { label: "read_to_string 用了 ?", hint: "let text = std::fs::read_to_string(path)?;", test: (s) => /read_to_string[\s\S]*\?/.test(s) },
        { label: "返回类型是 Box<dyn Error>", hint: "Result<String, Box<dyn Error>>", test: (s) => /Box\s*<\s*dyn\s+Error\s*>/.test(s) },
        { label: "空文件用 into() 造了错误", hint: "return Err(\"空配置\".into()); ——&str 自动装箱成 Box<dyn Error>。", test: (s) => /into\s*\(\s*\)/.test(s) || /Err\s*\(\s*\"/.test(s) },
        { label: "main 签名也能 ?", hint: "fn main() -> Result<(), Box<dyn Error>> { … }", test: (s) => /fn\s+main\s*\(\s*\)\s*->\s*Result\s*<\s*\(\s*\)\s*,\s*Box/.test(s) },
      ],
      ref: "use std::error::Error;\n\nfn read_config(path: &str) -> Result<String, Box<dyn Error>> {\n    let text = std::fs::read_to_string(path)?;\n    let trimmed = text.trim();\n    if trimmed.is_empty() {\n        return Err(\"空配置\".into());\n    }\n    Ok(trimmed.to_string())\n}\n\nfn main() -> Result<(), Box<dyn Error>> {\n    let text = read_config(\"no_such_file.txt\")?;\n    println!(\"{}\", text);\n    Ok(())\n}",
      refNote: "read ? → trim → 空则 .into() 造错 → main ? 接力 ——两层 ? 一路甩到 main,文件不存在时自动报错退出。Box<dyn Error> 通道 + .into() 魔法:错误处理的全链路,这就是真实 CLI 的骨架。",
    },
  ],
},
]);

})();
