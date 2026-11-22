/* ═══════════════════════════ 锈岛求生 3.0 · 第二卷细节小节(ch16~ch18) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════ 第 16 章 · 多线程(5 小节 + 2 实战) ════════ */
R.registerSections("ch16", [
{
  id: "c16s1", no: "16.1", title: "JoinHandle:等线程的收条",
  html: `
  <pre><code class="lang-rust">let handle = thread::spawn(|| {\n    println!(\"子线程干完活\");\n});\n// handle 是收条:上面记着\"这活谁干、干没干完\"\n\nhandle.join().unwrap();   // 凭收条等它收工(join 返回 Result)\nprintln!(\"主线程确认收工\");</code></pre>
  <p>细节:join 返回 <b>Result</b>——子线程里如果 panic 了,Err 把恐慌传给你。<b>忘了 join 也能跑</b>(主程序先退,子线程可能来不及干完活就被拉闸)。</p>
  <div class="exslot" data-ex="c16s1-1"></div>`,
  exercises: [
    { id: "c16s1-1", kind: "predict", xp: 10, title: "凭收条等收工",
      task: 'join 等到子线程收工后才继续,两行的打印顺序是?',
      given: "let handle = std::thread::spawn(|| {\n    println!(\"子线程\");\n});\nhandle.join().unwrap();\nprintln!(\"主线程\");",
      expected: "子线程\n主线程",
      ref: "// join:堵住主线程,等子线程干完\nprintln!(\"子线程\");\nhandle.join().unwrap();\nprintln!(\"主线程\");   // 稳定在子线程之后",
      refNote: "子线程、主线程——join 是同步点,顺序 100% 确定。没 join 的话顺序就赌运气了(主线程可能先退,子线程都没机会打印)。收条要凭,活才作数。",
    },
  ],
},
{
  id: "c16s2", no: "16.2", title: "move 进线程:数据的搬家令",
  html: `
  <pre><code class="lang-rust">let data = vec![1, 2, 3];\n\nlet handle = thread::spawn(move || {   // move:数据搬进线程\n    println!(\"{:?}\", data);\n});\nhandle.join().unwrap();\n// println!(\"{:?}\", data);   // ❌ 已被 move 走</code></pre>
  <p>主章见过 move 闭包,这里明确<b>线程为什么必须 move</b>:子线程可能比当前函数活得久,借用当前栈上的数据 = 借给快拆的楼。move 把数据所有权一起搬进线程,谁用谁负责。</p>
  <div class="exslot" data-ex="c16s2-1"></div>`,
  exercises: [
    { id: "c16s2-1", kind: "fix", runDemo: { match: /^thread::spawn\s*\(/, before: "use std::thread;\nlet data = vec![1, 2, 3];\nlet handle =", after: ";\nhandle.join().unwrap();", trimSemicolon: true  }, xp: 10, title: "线程要 move",
      task: `子线程想用主线程的 data,编译器说闭包可能比 data 活得久。修法:加 move 把数据搬进去。在编辑器里修正 spawn，保留原有导入、数据和 join。`,
      given: "use std::thread;\n\nlet data = vec![1, 2, 3];\nlet handle = thread::spawn(|| {\n    println!(\"{:?}\", data);\n});\nhandle.join().unwrap();",
      errText: "error[E0373]: closure may outlive the current function, but it borrows 'data'",
      scaffold: "use std::thread;\n\nlet data = vec![1, 2, 3];\nlet handle = thread::spawn(|| {\n    println!(\"{:?}\", data);\n});\nhandle.join().unwrap();",
      checks: [
        { label: "闭包加了 move", hint: "thread::spawn(move || { … })", test: (s) => /spawn\s*\(\s*move\s*\|/.test(s) },
        { label: "数据跟着进了线程", hint: "闭包体里保留 data 的使用。", test: (s) => /data/.test(s) },
      ],
      ref: "use std::thread;\n\nlet data = vec![1, 2, 3];\nlet handle = thread::spawn(move || {\n    println!(\"{:?}\", data);\n});\nhandle.join().unwrap();",
      refNote: "move 一字,编译器闭嘴:数据所有权搬进线程,生命周期跟着走,谁都不悬空。线程场景是 move 的绝对主场。",
    },
  ],
},
{
  id: "c16s3", no: "16.3", title: "channel 发送端的 move",
  html: `
  <pre><code class="lang-rust">let (tx, rx) = mpsc::channel();\n\nthread::spawn(move || {       // tx 搬进子线程\n    tx.send(42).unwrap();     // 发货后 tx 就地销毁(自动关店!)\n});\n\nfor v in rx {                 // tx 销毁 → channel 关门 → 循环自然结束\n    println!(\"{}\", v);\n}</code></pre>
  <p>细节:所有发送端(tx)drop 后,channel <b>自动关闭</b>,接收端的迭代循环自然终止——不需要手动发"结束信号"。</p>
  <div class="exslot" data-ex="c16s3-1"></div>`,
  exercises: [
    { id: "c16s3-1", kind: "predict", xp: 10, title: "关店散场",
      task: `子线程发 42 后 tx 销毁,主循环收到后自动停。打印什么?`,
      given: "let (tx, rx) = std::sync::mpsc::channel();\nstd::thread::spawn(move || {\n    tx.send(42).unwrap();\n});\nfor v in rx {\n    println!(\"{}\", v);\n}",
      expected: "42",
      ref: "// 子线程:send 后 tx 销毁 → channel 关门\n// 主循环:收到 42,再等 → 门关了 → 循环结束\nprintln!(\"42\");",
      refNote: "打印 42 后循环安静退出——关门信号由\"最后一个 tx 销毁\"自动发出,免协议、免标志位。channel 的收尾设计,又一次把人从边界 bug 里解放出来。",
    },
  ],
},
{
  id: "c16s4", no: "16.4", title: "Arc&lt;Mutex&lt;T&gt;&gt;:跨线程共享可变",
  html: `
  <pre><code class="lang-rust">use std::sync::{Arc, Mutex};\n\nlet counter = Arc::new(Mutex::new(0));    // 共享卡 + 保险柜\n\nfor _ in 0..3 {\n    let c = Arc::clone(&counter);          // 每线程克隆一张卡\n    thread::spawn(move || {\n        let mut n = c.lock().unwrap();\n        *n += 1;\n    });   // 锁随作用域自动归还\n}\nprintln!(\"{}\", *counter.lock().unwrap());   // 3</code></pre>
  <p>组合拳分工:<b>Arc</b> 让多线程同持一份数据,<b>Mutex</b> 保证一次只有一个改。少 Arc → 线程间不共享;少 Mutex → 同时改打架(编译器直接拒收!)。</p>
  <div class="exslot" data-ex="c16s4-1"></div>`,
  exercises: [
    { id: "c16s4-1", kind: "predict", xp: 10, title: "三把钥匙",
      task: `3 个线程各 +1(Arc 共享、Mutex 串行),最后是几?`,
      given: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = Vec::new();\n    for _ in 0..3 {\n        let c = Arc::clone(&counter);\n        handles.push(thread::spawn(move || { *c.lock().unwrap() += 1; }));\n    }\n    for handle in handles { handle.join().unwrap(); }\n    println!(\"{}\", *counter.lock().unwrap());\n}",
      expected: "3",
      ref: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = Vec::new();\n    for _ in 0..3 {\n        let c = Arc::clone(&counter);\n        handles.push(thread::spawn(move || { *c.lock().unwrap() += 1; }));\n    }\n    for handle in handles { handle.join().unwrap(); }\n    println!(\"{}\", *counter.lock().unwrap());\n}",
      refNote: "join 等三条线程完成后，结果为 3。Mutex 把\"可能丢账的竞态\"变成\"排队记账\"。没有锁的版本在别的语言会随机丢更新;Rust 更狠,你连\"不加锁同时改\"的代码都编译不过。",
    },
  ],
},
{
  id: "c16s5", no: "16.5", title: "Send 与 Sync:跨线程的安检标签",
  html: `
  <p>哪些类型能跨线程?标准库早就贴好标签:</p>
  <pre><code class="lang-rust">// Send:值能"搬"到别的线程(所有权转移安全)\n// Sync:值能被多线程"同时借"(&共享安全)\n\n// 大多数类型都是 Send + Sync\n// Rc 是 !Send(计数不是原子)——跨线程必须换 Arc\n// RefCell 是 !Sync ——跨线程共享要换 Mutex</code></pre>
  <p>这两个是<b>标记 trait</b>(空接口,编译器查证件不查行为)。你不用实现它们——但报错信息里见到 Send/Sync,知道是"这个数据不能这样跨线程用"。</p>
  <div class="exslot" data-ex="c16s5-1"></div>`,
  exercises: [
    { id: "c16s5-1", kind: "predict", xp: 10, title: "Rc 的出国禁令",
      task: `Rc 的计数不是原子操作,不能跨线程(Send 不达标)。把 Rc 直接扔进线程会怎样?(这段代码能编译吗?)`,
      given: "use std::rc::Rc;\nlet data = Rc::new(5);\nstd::thread::spawn(move || {\n    println!(\"{}\", data);\n});",
      expected: "编译报错",
      ref: "// error[E0277]: 'Rc<i32>' cannot be sent between threads safely\n// ——Rc 不是 Send,编译器拦下\n// 修法:换 Arc(原子计数,可跨线程)",
      refNote: "编译报错:'Rc<i32>' cannot be sent between threads safely——这是 Send 安检拒绝放行。修法一行:换成 Arc。编译期就把跨线程的隐患拆弹,这就是 Rust 并发的底气。",
    },
  ],
},
{
  id: "c16f", no: "16.6", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c16f-1"></div>
  <div class="exslot" data-ex="c16f-2"></div>`,
  exercises: [
    { id: "c16f-1", kind: "big", xp: 15, title: "实战① 汇总三线程",
      task: '写完整小程序:①Arc<Mutex<Vec<i32>>> 装空 Vec;②spawn 三个线程,各自往里 push 一个数(1、2、3);③join 全部等齐后打印(应得 <code>[1, 2, 3]</code> 或乱序,如 <code>[2, 1, 3]</code>)。',
      scaffold: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let shared = Arc::new(Mutex::new(Vec::new()));\n    let mut handles = vec![];\n\n    // 三个线程各 push 一个数\n\n    // 全部 join 后打印\n}",
      checks: [
        { label: "用了 Arc<Mutex<Vec<i32>>>", hint: "Arc::new(Mutex::new(Vec::new())) 或标注类型。", test: (s) => /Arc\s*<\s*Mutex\s*</.test(s) || /Arc::new\s*\(\s*Mutex::new/.test(s) },
        { label: "spawn 了三个线程", hint: "for n in [1, 2, 3] { … spawn … } 或写三次。", test: (s) => (s.match(/spawn\s*\(/g) || []).length >= 3 || /for[\s\S]*1\s*,\s*2\s*,\s*3/.test(s) },
        { label: "每个线程用了 move", hint: "thread::spawn(move || { … }) ——Arc 克隆进线程。", test: (s) => (s.match(/move\s*\|/g) || []).length >= 1 },
        { label: "join 等齐后才打印", hint: "handles 收集,for h in handles { h.join().unwrap(); } 然后打印。", test: (s) => /join\s*\(\s*\)/.test(s) && /println!/.test(s) },
      ],
      ref: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let shared = Arc::new(Mutex::new(Vec::new()));\n    let mut handles = vec![];\n\n    for n in [1, 2, 3] {\n        let s = Arc::clone(&shared);\n        handles.push(thread::spawn(move || {\n            s.lock().unwrap().push(n);\n        }));\n    }\n\n    for h in handles {\n        h.join().unwrap();\n    }\n\n    println!(\"{:?}\", shared.lock().unwrap());   // [1, 2, 3](或乱序)\n}",
      refNote: "Arc 共享、Mutex 排队、move 搬卡、join 等齐——第 16 章的四件套全部上桌。push 顺序看运气(线程谁先抢到锁不定),但\"三个全到\"是铁的。",
    },
    { id: "c16f-2", kind: "big", xp: 15, title: "实战② 流水线 channel",
      task: '写完整小程序:①channel 一对;②spawn 生产者线程:发 1~5 后 drop(tx)(自动关门);③主线程用 <code class="ic">while let Ok(v) = rx.recv()</code> 收(或 <code class="ic">for v in rx</code>),边收边累加;最后打印总和(应得 <b>15</b>)。',
      scaffold: "use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    // 生产者:发 1~5 → drop(tx) 关门\n\n    // 消费者:收货累加 → 打印 15\n}",
      checks: [
        { label: "spawn 了生产者(带 move)", hint: "thread::spawn(move || { for i in 1..=5 { tx.send(i).unwrap(); } })", test: (s) => /spawn\s*\(\s*move/.test(s) && /send\s*\(/.test(s) },
        { label: "发了 1~5 五个", hint: "for i in 1..=5 { tx.send(i).unwrap(); }", test: (s) => /1\.\.=5|1\.\.6/.test(s) },
        { label: "消费端循环收货", hint: "for v in rx { … } 或 while let Ok(v) = rx.recv() { … }", test: (s) => /for\s+\w+\s+in\s+rx|while\s+let\s+Ok/.test(s) },
        { label: "累加打印了总和", hint: "sum += v; 最后 println!(\"{}\", sum); → 15", test: (s) => /\+=\s*\w+/.test(s) && /println!/.test(s) },
      ],
      ref: "use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    thread::spawn(move || {\n        for i in 1..=5 {\n            tx.send(i).unwrap();\n        }\n    });   // tx 在线程结束时自动 drop → channel 关门\n\n    let mut sum = 0;\n    for v in rx {\n        sum += v;\n    }\n    println!(\"{}\", sum);   // 15\n}",
      refNote: "生产者 spawn + 消费者 for-in ——最精简的流水线。tx 随线程销毁自动关店,循环自然散场,总和 15。消息传递(不用锁)是 Go 和 Rust 共同推崇的并发哲学。",
    },
  ],
},
]);

/* ════════ 第 17 章 · async(4 小节 + 2 实战) ════════ */
R.registerSections("ch17", [
{
  id: "c17s1", no: "17.1", title: "async fn:产出待办单",
  html: `
  <pre><code class="lang-rust">async fn fetch() -> u32 { 42 }\n\nlet f = fetch();            // 不执行!产出一张 Future(待办单)\nlet v = f.await;            // .await:这张单我等!\nprintln!(\"{}\", v);           // 42</code></pre>
  <p>细节:调用 async fn <b>什么都不干</b>(只是开单);.await 才是"去把这张单办了"。所以 async 代码里到处是 .await——每一步都在明确说"我在这儿等"。</p>
  <div class="exslot" data-ex="c17s1-1"></div>`,
  exercises: [
    { id: "c17s1-1", kind: "predict", xp: 10, title: "开单不办事",
      task: `async fn 被调用的那一刻,函数体执行了吗?(后面紧跟一个独立 println)`,
      given: "async fn fetch() -> u32 { 42 }\n\n#[tokio::main]\nasync fn main() {\n    let f = fetch();          // 这行执行了函数体吗?\n    println!(\"单已开\");\n    let v = f.await;\n    println!(\"{}\", v);\n}",
      expected: "单已开\n42",
      ref: "let f = fetch();          // 只开单!函数体一行没跑\nprintln!(\"单已开\");   // 先打印\nlet v = f.await;    // 现在!函数体执行 → 42\nprintln!(\"{}\", v);",
      refNote: "「单已开」在 42 之前——fetch() 的函数体被冻结成 Future,直到 .await 才解冻执行。这就是 async 的\"惰性\":不 await,不干活。",
    },
  ],
},
{
  id: "c17s2", no: "17.2", title: ".await 的语法位置:像方法调用",
  html: `
  <pre><code class="lang-rust">let data = fetch().await;              // 基本用法\nlet text = read(\"cfg\").await?;          // 和 ? 连用:async 里也要处理错误!\nprocess(\n    load().await,                       // .await 可以出现在表达式里\n    save().await,\n);</code></pre>
  <p>细节:.await 是<b>后缀表达式</b>(点号方法风),不像别的语言的前缀 await ——这使得 async 链式调用读起来一路向右,清爽。</p>
  <div class="exslot" data-ex="c17s2-1"></div>`,
  exercises: [
    { id: "c17s2-1", kind: "predict", xp: 10, title: "? 和 await 连招",
      task: `read 返回 Ok(\"cfg\"),.await 解包拿到值,再 .await? 拿 Ok 里的内容。打印什么?`,
      given: "async fn read() -> Result<String, String> {\n    Ok(String::from(\"cfg\"))\n}\n\n#[tokio::main]\nasync fn main() -> Result<(), String> {\n    let t = read().await?;    // await 解包 → ? 处理 Result\n    println!(\"{}\", t);\n    Ok(())\n}",
      expected: "cfg",
      ref: "// read() → Future → .await 解出 Result → ? 解出 String\nlet t = read().await?;   // t = \"cfg\"\nprintln!(\"{}\", t);        // cfg",
      refNote: "await 负责 Future、? 负责 Result ——两个操作符各管一环,连招拆解「异步 + 可能失败」的双层包装。async 世界的惯用句式,一气呵成。",
    },
  ],
},
{
  id: "c17s3", no: "17.3", title: "#[tokio::main] 的真身",
  html: `
  <p><code class="ic">#[tokio::main]</code> 是个宏,展开后其实是:</p>
  <pre><code class="lang-rust">fn main() {\n    tokio::runtime::Runtime::new()\n        .unwrap()\n        .block_on(async { /* 你的 async main 内容 */ })\n}</code></pre>
  <p>「tokio 运行时 + block_on 阻塞等你」——所谓"魔法注解"就是这段朴素代码的糖衣。第 15 章讲过宏是代码生成器,这里又是一个活例。</p>
  <div class="exslot" data-ex="c17s3-1"></div>`,
  exercises: [
    { id: "c17s3-1", kind: "predict", localOnly: true, xp: 10, title: "注解的糖衣",
      task: `#[tokio::main] 展开后,真正干活的是哪个调用?(概念题,答案就一个词组)`,
      given: "// #[tokio::main] 展开后的核心:\n// tokio::runtime::Runtime::new()…",
      expected: "block_on",
      ref: "// fn main() {\n//     Runtime::new().unwrap().block_on(async { … })\n// }                    ↑ 真正的发动机:block_on",
      refNote: "block_on ——启动运行时、把 async 块\"阻塞执行\"到完成。注解魔法看穿后就是这三行朴实代码:宏的又一场戏法。",
    },
  ],
},
{
  id: "c17s4", no: "17.4", title: "tokio::spawn:并发任务的发车员",
  html: `
  <pre><code class="lang-rust">#[tokio::main]\nasync fn main() {\n    let h = tokio::spawn(async {\n        // 一号任务:模拟耗时\n        tokio::time::sleep(std::time::Duration::from_millis(50)).await;\n        \"任务A完成\"\n    });\n\n    // 主任务继续跑别的…\n    let r = h.await.unwrap();   // 等任务A收工(异步地等!)\n    println!(\"{}\", r);\n}</code></pre>
  <p><code class="ic">tokio::spawn</code> ≈ async 版的 thread::spawn:发一个<b>异步任务</b>出去,拿回 JoinHandle,用 <b>.await</b>(而不是阻塞的 join)等它——几百个任务同跑,一个线程扛住。</p>
  <div class="exslot" data-ex="c17s4-1"></div>`,
  exercises: [
    { id: "c17s4-1", kind: "predict", xp: 10, title: "异步等车",
      task: `spawn 出的任务睡 50ms 后交货,主任务 await 等到后打印——输出顺序是?`,
      given: "#[tokio::main]\nasync fn main() {\n    let h = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(50)).await;\n        \"任务A完成\"\n    });\n    let r = h.await.unwrap();\n    println!(\"{}\", r);\n}",
      expected: "任务A完成",
      ref: "// 任务睡 50ms → 交货 → 主任务 await 接住\nprintln!(\"任务A完成\");",
      refNote: "打印「任务A完成」——.await 是异步的等:任务睡的时候线程去干别的了,醒来接着走。对比 thread::spawn + join(真堵);spawn + await(会躲)。一字之差,两个世界。",
    },
  ],
},
{
  id: "c17f", no: "17.5", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c17f-1"></div>
  <div class="exslot" data-ex="c17f-2"></div>`,
  exercises: [
    { id: "c17f-1", kind: "big", localOnly: true, xp: 15, title: "实战① 双任务并发",
      task: 'tokio 双任务并发(async 完全体):①spawn 任务A:睡 30ms 返回 "A";②spawn 任务B:睡 10ms 返回 "B";③主任务用两个变量接 handle,依次 await 打印——谁先返回谁先打:先打 B(它醒得早),再打 A。',
      scaffold: "#[tokio::main]\nasync fn main() {\n    let a = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(30)).await;\n        \"A\"\n    });\n    let b = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(10)).await;\n        \"B\"\n    });\n    // await 两个:设计顺序,让 B 先打印\n}",
      checks: [
        { label: "spawn 了两个异步任务", hint: "tokio::spawn(async { … }) ——两个。", test: (s) => (s.match(/tokio::spawn|spawn\s*\(\s*async/g) || []).length >= 2 },
        { label: "两个任务都用了 sleep+await", hint: "…sleep(Duration::from_millis(…)).await; ——A 30ms、B 10ms。", test: (s) => /30/.test(s) && /10/.test(s) },
        { label: "主任务 await 了两个", hint: "let rb = b.await.unwrap(); 先打;let ra = a.await.unwrap(); 后打。", test: (s) => (s.match(/\.await/g) || []).length >= 2 },
      ],
      ref: "#[tokio::main]\nasync fn main() {\n    let a = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(30)).await;\n        \"A\"\n    });\n    let b = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(10)).await;\n        \"B\"\n    });\n\n    let rb = b.await.unwrap();   // B 醒得早\n    println!(\"{}\", rb);           // B\n    let ra = a.await.unwrap();\n    println!(\"{}\", ra);           // A\n}",
      refNote: "B、A 依次打印——B 睡 10ms 醒得早。整段流程只在极少线程上跑:sleep 时线程去 await 别的了,「并发」而不「多线程」。第 4 篇短链服务(实战)就站在这个地基上。",
    },
    { id: "c17f-2", kind: "big", localOnly: true, xp: 15, title: "实战② async 读写器",
      task: '写完整小程序:①<code class="ic">async fn fetch(id: u32) -> String</code>:睡 id×10ms,返回 "数据{id}";②main 用 tokio::spawn 同时发 fetch(3) 和 fetch(1) 两个任务;③await 接住,打印两行(快的 1 先回)。',
      scaffold: "#[tokio::main]\nasync fn main() {\n    // ① fetch 函数(spawn 内联也行)\n\n    // ② 双任务并发\n\n    // ③ await 双收\n}",
      checks: [
        { label: "有 async fn 或 spawn(async)", hint: "async fn fetch(…) { … } 或 spawn(async { … })。", test: (s) => /async\s+fn/.test(s) || /spawn\s*\(\s*async/.test(s) },
        { label: "用了 sleep + await", hint: "tokio::time::sleep(…).await ——模拟耗时。", test: (s) => /sleep[\s\S]*await/.test(s) },
        { label: "两个任务并发", hint: "tokio::spawn 两次。", test: (s) => (s.match(/tokio::spawn|spawn\s*\(\s*async/g) || []).length >= 2 },
        { label: "双收并打印", hint: "let r1 = h1.await.unwrap(); let r2 = h2.await.unwrap(); println! ×2。", test: (s) => (s.match(/\.await/g) || []).length >= 2 && (s.match(/println!/g) || []).length >= 2 },
      ],
      ref: "#[tokio::main]\nasync fn main() {\n    let h1 = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(30)).await;\n        \"数据3\"\n    });\n    let h2 = tokio::spawn(async {\n        tokio::time::sleep(std::time::Duration::from_millis(10)).await;\n        \"数据1\"\n    });\n\n    let r2 = h2.await.unwrap();   // 数据1 先回\n    println!(\"{}\", r2);\n    let r1 = h1.await.unwrap();\n    println!(\"{}\", r1);\n}",
      refNote: "数据1、数据3 ——两个\"网络请求\"同时在飞,总耗时 ≈ 慢的那个(30ms),不是相加(40ms)。这就是高并发服务的基本盘: тысячи 个请求共享少量线程。",
    },
  ],
},
]);

/* ════════ 第 18 章 · cargo 工程化(5 小节 + 2 实战) ════════ */
R.registerSections("ch18", [
{
  id: "c18s1", no: "18.1", title: "mod:文件即模块",
  html: `
  <pre><code class="lang-rust">// src/main.rs\nmod utils;             // 声明:项目里有个 utils 模块(找 src/utils.rs)\n\nfn main() {\n    utils::helper();    // 模块路径调用\n}\n\n// src/utils.rs\npub fn helper() { … }  // pub 才能被外部看到!</code></pre>
  <p>细节:mod 声明只在<b>一个地方</b>写(main.rs 或父模块);模块文件自己<b>不写</b> mod 名(文件名就是身份)。忘写 mod 声明 = 编译器根本不知道这个文件存在。</p>
  <div class="exslot" data-ex="c18s1-1"></div>`,
  exercises: [
    { id: "c18s1-1", kind: "predict", localOnly: true, xp: 10, title: "没有声明的孤儿文件",
      task: `utils.rs 写了 helper,但 main.rs 忘了 mod utils 声明——能编译吗?`,
      given: "// src/utils.rs:\n// pub fn helper() { println!(\"hi\"); }\n\n// src/main.rs:\n// fn main() { utils::helper(); }   ← 没有 mod utils; 声明!",
      expected: "编译报错",
      ref: "// error[E0433]: failed to resolve: use of undeclared crate or module 'utils'\n// 修法:main.rs 顶部加 mod utils;",
      refNote: "编译报错:use of undeclared crate or module ——编译器没听说过 utils,因为 mod 声明没写。这个错每个 Rust 新手都犯过,认熟报错,三秒修好。",
    },
  ],
},
{
  id: "c18s2", no: "18.2", title: "use:把长路径背进兜里",
  html: `
  <pre><code class="lang-rust">use std::collections::HashMap;    // 一次 use,处处短名\nlet m: HashMap<String, i32> = HashMap::new();\n\nuse std::collections::hash_map::Entry;  // 深层路径也能背\n// 惯用:常用才 use,一年用一回的写全路径更清晰</code></pre>
  <p>use 的取舍:<b>高频用短名,低频用全路径</b>。读代码的人看到 std::fs::read_to_string 全路径,反而能立刻知道这是标准库文件操作——用不用 use 是为读者做的决定。</p>
  <div class="exslot" data-ex="c18s2-1"></div>`,
  exercises: [
    { id: "c18s2-1", kind: "predict", xp: 10, title: "背进兜里",
      task: `use 了 HashMap 之后,创建它还需要写全路径吗?这段能编译吗,打印什么?`,
      given: "use std::collections::HashMap;\n\nfn main() {\n    let mut m = HashMap::new();\n    m.insert(\"a\", 1);\n    println!(\"{:?}\", m.get(\"a\"));\n}",
      expected: "Some(1)",
      ref: "use std::collections::HashMap;   // 长路径进兜\nlet mut m = HashMap::new();        // 短名直接用\nprintln!(\"{:?}\", m.get(\"a\"));       // Some(1)",
      refNote: "编译通过,打印 Some(1) ——use 把三段长路径折叠成一个短名。项目顶部的一排 use 就像「工具清单」,读者扫一眼就知道这个文件在用哪些装备。",
    },
  ],
},
{
  id: "c18s3", no: "18.3", title: "pub:连 struct 字段都要单独公开",
  html: `
  <pre><code class="lang-rust">// utils.rs\npub struct Point { pub x: i32, y: i32 }   // ⚠️ x 公开,y 私有!\n\n// main.rs\nlet p = utils::Point { x: 1, y: 2 };   // ❌ y 是私有的,构造失败!</code></pre>
  <p>Rust 的可见性细到<b>字段级</b>:pub struct 只是类型可见,<b>字段默认私有</b>——要全公开,每个字段都要 pub。这个设计逼你「认真决定暴露什么」,API 边界清晰。</p>
  <div class="exslot" data-ex="c18s3-1"></div>`,
  exercises: [
    { id: "c18s3-1", kind: "predict", xp: 10, title: "半公开的 struct",
      task: `Point 是 pub 但 y 字段没 pub——外部能构造 Point { x: 1, y: 2 } 吗?`,
      given: "mod utils { pub struct Point { pub x: i32, y: i32 } }\nfn main() { let _p = utils::Point { x: 1, y: 2 }; }",
      expected: "编译报错",
      ref: "// error[E0616]: field 'y' of struct 'Point' is private\n// 修法:pub struct Point { pub x: i32, pub y: i32 } ——字段也要 pub",
      refNote: "编译报错:field 'y' is private ——Rust 的 pub 是逐层审批:struct 公开 ≠ 字段公开。想全开放,字段逐个写 pub;想藏一半,默认私有的部分只能走方法访问(这就是封装)。",
    },
  ],
},
{
  id: "c18s4", no: "18.4", title: "#[test]:一行注解一个用例",
  html: `
  <pre><code class="lang-rust">#[cfg(test)]           // 编译时只在测试模式带着这块\nmod tests {\n    use super::*;\n\n    #[test]              // ← 就这一行,add 测试用例注册完成\n    fn test_add() {\n        assert_eq!(add(1, 2), 3);\n    }\n}</code></pre>
  <p>#[test] 是宏注解:把普通函数登记为测试用例,cargo test 时统一执行。配合 <code class="ic">assert_eq!</code>(失败自动打印左右值),一行声明一套断言——没有 setup,没有仪式感,就这一行。</p>
  <div class="exslot" data-ex="c18s4-1"></div>`,
  exercises: [
    { id: "c18s4-1", kind: "predict", localOnly: true, xp: 10, title: "一行的力量",
      task: `#[test] + assert_eq!(add(1, 2), 3) ——add 正确时,cargo test 显示什么状态?`,
      given: "#[test]\nfn test_add() {\n    assert_eq!(add(1, 2), 3);\n}",
      expected: "ok",
      ref: "// cargo test 输出:\n// test tests::test_add ... ok\n// 全部通过:一行 \"ok\"",
      refNote: "ok ——测试通过的标准绿光。#[test] 一行声明、assert_eq! 一行断言、cargo test 一键全跑:Rust 把测试的仪式成本压到最低,让写测试这件事毫无借口。",
    },
  ],
},
{
  id: "c18s5", no: "18.5", title: "cargo clippy:资深同事的免费 review",
  html: `
  <pre><code class="lang-rust">let x = if true { 1 } else { 2 };   // clippy:if_true_then_without_else 建议直接写 1\n\n// clippy 的输出:\n// warning: this if-then-else returns the same thing…\n// help: 此处直接写 1 即可\n</code></pre>
  <p>clippy = 官方 lint 集合,几百条「更地道的写法」检查:<b>未用变量、可合并的 if、低效的 clone、应该用迭代器的循环…</b>。大项目跑一遍 clippy,常常有几十条改进建议——全部免费、全部有说明、大多数附自动改法。</p>
  <div class="exslot" data-ex="c18s5-1"></div>`,
  exercises: [
    { id: "c18s5-1", kind: "predict", localOnly: true, xp: 10, title: "clippy 的日常",
      task: `clippy 是工具不是语言特性——跑哪条命令请这位同事 review?`,
      given: "// 请出 clippy 的命令是?",
      expected: "cargo clippy",
      ref: "// $ cargo clippy\n// warning: … 逐条列出改进建议",
      refNote: "cargo clippy ——一行命令,几百条经验规则免费上岗。团队标配节奏:cargo fmt(统一格式)+ cargo clippy(地道性 review)+ cargo test(行为正确),三连做完再提 PR。",
    },
  ],
},
{
  id: "c18f", no: "18.6", title: "🎯 本章实战(2 题)",
  html: `<div class="exslot" data-ex="c18f-1"></div>
  <div class="exslot" data-ex="c18f-2"></div>`,
  exercises: [
    { id: "c18f-1", kind: "big", xp: 15, title: "实战① 模块拆分演习",
      task: '把工具函数模块化(页内单文件模拟):①文件顶部声明 <code class="ic">mod math_utils;</code>;②实现 math_utils 模块(内联版本 <code class="ic">mod math_utils { pub fn add(…) }</code>):导出 add 和 <b>私有</b>内部函数 double_check(收一个 n,加 0 后返回 n——故意摆设);③main 用 <code class="ic">math_utils::add(2, 3)</code> 打印(应得 5);试着调用 double_check?——编译器会说它私有!',
      scaffold: "// 声明 + 内联定义 math_utils 模块\n\nfn main() {\n    // 模块路径调用打印\n}",
      checks: [
        { label: "mod 声明存在", hint: "mod math_utils { … } ——内联模块也是正经模块。", test: (s) => /mod\s+math_utils/.test(s) },
        { label: "add 是 pub", hint: "pub fn add(…)", test: (s) => /pub\s+fn\s+add/.test(s) },
        { label: "double_check 私有(没有 pub)", hint: "fn double_check(…) ——不加 pub,默认私有。", test: (s) => /fn\s+double_check/.test(s) && !/pub\s+fn\s+double_check/.test(s) },
        { label: "main 路径调用打印", hint: "println!(\"{}\", math_utils::add(2, 3));", test: (s) => /math_utils\s*::\s*add/.test(s) && /println!/.test(s) },
      ],
      ref: "mod math_utils {\n    pub fn add(a: i32, b: i32) -> i32 {\n        double_check(a) + b\n    }\n    fn double_check(n: i32) -> i32 {   // 私有:模块外不可见\n        n + 0\n    }\n}\n\nfn main() {\n    println!(\"{}\", math_utils::add(2, 3));   // 5\n    // math_utils::double_check(1);   // ❌ 编译报错:私有!\n}",
      refNote: "add 公开对外,double_check 藏在模块内——真实项目里这就是 API 的门面设计:对外稳定、对内自由。真实拆分只要把 mod math_utils { … } 剪到 math_utils.rs,一行逻辑不用改。",
    },
    { id: "c18f-2", kind: "big", runTests: true, xp: 15, title: "实战② 测试起步包",
      task: '写一个可测的小项目:①<code class="ic">fn is_prime(n: u32) -> bool</code>:2 到 n 平方根逐个试除;②写测试模块(<code class="ic">#[cfg(test)] mod tests</code>):三个 #[test] 用例——is_prime(7) 为 true、is_prime(8) 为 false、is_prime(2) 为 true;③main 打印 is_prime(13)(应得 true)。',
      scaffold: "fn is_prime(n: u32) -> bool {\n    // 2 到 sqrt(n) 试除\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    // 三个 #[test] 用例\n}\n\nfn main() {\n    println!(\"{}\", is_prime(13));\n}",
      checks: [
        { label: "is_prime 有试除逻辑", hint: "for i in 2..=n/2 或 while i*i <= n ——逐个试除取余 %。", test: (s) => (s.includes("%") && (s.includes("for") || s.includes("while"))) },
        { label: "测试模块 #[cfg(test)]", hint: "#[cfg(test)]\nmod tests { … }", test: (s) => /#\[cfg\(test\)\]/.test(s) },
        { label: "三个 #[test] 用例", hint: "#[test] 出现三次,各自 assert!(is_prime(…))。", test: (s) => (s.match(/#\[test\]/g) || []).length >= 3 },
        { label: "main 打印了结果", hint: "println!(\"{}\", is_prime(13)); → true", test: (s) => /is_prime\s*\(\s*13\s*\)/.test(s) && /println!/.test(s) },
      ],
      ref: "fn is_prime(n: u32) -> bool {\n    if n < 2 { return false; }\n    let mut i = 2;\n    while i * i <= n {\n        if n % i == 0 { return false; }\n        i += 1;\n    }\n    true\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn seven_is_prime() { assert!(is_prime(7)); }\n    #[test]\n    fn eight_not_prime() { assert!(!is_prime(8)); }\n    #[test]\n    fn two_is_prime() { assert!(is_prime(2)); }\n}\n\nfn main() {\n    println!(\"{}\", is_prime(13));   // true\n}",
      refNote: "功能 + 测试成对交付:is_prime 走 i*i <= n 的高效试除,三个用例把边界(最小素数 2、合数 8)全钉死。cargo test 三绿,cargo clippy 无恙——这就是标准库项目的日常出厂配置。",
    },
  ],
},
]);

})();
