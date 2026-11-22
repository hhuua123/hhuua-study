/* ═══════════════════════════ 锈岛求生 3.0 · 第四批小节(ch15/ch17/ch18 扩容) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ══════════ ch15 追加:Deref / Drop / RefCell ══════════ */
R.registerSections("ch15", [{
  id: "c15s7", no: "15.7", title: "Deref:Box 为什么能像普通值一样用",
  html: `
  <p>Box 装的值在堆上,但你从来没写过 <code class="ic">(*box).field</code> 去取内容——因为 <b>Deref trait 在背后自动解引用</b>:</p>
  <pre><code data-lang="rust">let boxed = Box::new(42);
let n: &i32 = &boxed;      // 看着像引用了 Box,其实编译器
                          // 通过 Deref 自动跳进了堆里的 42
println!("{n}");            // 42</code></pre>
  <p>这就是「智能指针像普通值一样用」的机关。你自己的类型也能实现 <code class="ic">Deref</code>——这就是智能结构体的入场券:</p>
  <pre><code data-lang="rust">use std::ops::Deref;

struct MyBox(i32);

impl Deref for MyBox {
    type Target = i32;                 // 解引用之后是啥
    fn deref(&amp;self) -&gt; &amp;i32 { &amp;self.0 }
}

let b = MyBox(7);
let v: &amp;i32 = &amp;b;   // 编译器自动通过 deref() 跳到 &amp;7
println!("{v}");     // 7</code></pre>
  <p><b>链式解引用</b>:编译器会一直跳到目标类型为止——<code class="ic">&amp;&amp;Box::new(x)</code> 也能解到 x。这就是为什么 <code class="ic">Arc&lt;Mutex&lt;T&gt;&gt;</code> 能一路 <code class="ic">lock()</code> 到底。</p>
  <div class="exslot" data-ex="c15s7-1"></div>`,
  exercises: [
    { id: "c15s7-1", kind: "predict", xp: 10, title: "自动跳了几层?",
      task: "编译器通过 Deref 自动跳层,直到类型匹配。打印什么?",
      given: "let boxed = Box::new(42);\nlet n: &i32 = &boxed;\nprintln!(\"{n}\");",
      expectsCompileError: false,
      expected: "42",
      expNote: "&boxed 是 &Box<i32>,编译器自动 deref 跳到 &i32。",
      ref: "42",
      refNote: "Deref 是「智能指针像普通值一样用」的全部机关。Arc&lt;Mutex&lt;T&gt;&gt; 能一路 lock() 到底,靠的也是同一套链式自动跳层。",
    },
  ],
},
{
  id: "c15s8", no: "15.8", title: "Drop:值离开时,编译器替你送终",
  html: `
  <p>第 5 章说「离开作用域,值被回收」——<b>谁来执行回收?</b>Drop trait:</p>
  <pre><code data-lang="rust">struct Resource { name: &'static str }

impl Drop for Resource {
    fn drop(&amp;mut self) {
        println!("[{}] 被回收", self.name);
    }
}

fn main() {
    let _a = Resource { name: "甲" };
    {
        let _b = Resource { name: "乙" };   // 先回收:作用域先结束
    }
    println!("main 末尾");
}</code></pre>
  <p>打印顺序:<b>乙 被回收 → main 末尾 → 甲 被回收</b>——作用域一结束,Drop 立刻执行,后进先出像叠盘子。</p>
  <div class="note">🦀 <b>Box/Rc/Mutex 全都带 Drop</b>:Box 离开时释放堆内存,Rc 离开时计数 −1,MutexGuard 离开时自动解锁——你在 ch15 学过的「自动还钥匙」,底层正是 Drop 在干活。<b>不能手动调 drop()</b>,但可以 <code class="ic">drop(x)</code>(std 函数)提前销毁。</p>
  <div class="exslot" data-ex="c15s8-1"></div>`,
  exercises: [
    { id: "c15s8-1", kind: "predict", xp: 10, title: "回收顺序",
      task: "两件 Resource,一个在内层作用域。三行输出按顺序打出来(每行格式:「[名字] 被回收」或 main 末尾)。",
      given: "struct Resource { name: &'static str }\nimpl Drop for Resource {\n    fn drop(&mut self) {\n        println!(\"[{}] 被回收\", self.name);\n    }\n}\n\nfn main() {\n    let _a = Resource { name: \"甲\" };\n    {\n        let _b = Resource { name: \"乙\" };\n    }\n    println!(\"main 末尾\");\n}",
      expectsCompileError: false,
      expected: "[乙] 被回收\nmain 末尾\n[甲] 被回收",
      expNote: "乙的作用域先结束,先送终;main 结束时轮到甲。Drop 后进先出。",
      ref: "[乙] 被回收\nmain 末尾\n[甲] 被回收",
      refNote: "Drop = Rust 的确定性析构:离开作用域,当场回收,顺序后进先出——没有 GC 的不确定,也没有 C 的手动 free。MutexGuard 的自动解锁用的就是它。",
    },
  ],
},
{
  id: "c15s9", no: "15.9", title: "RefCell:编译期锁不住的,运行期来查",
  html: `
  <p>有一条规则你已经被咬过多次:「同一时间,要么一个 &mut,要么任意多个 &」。<b>RefCell 把这条检查从编译期搬到了运行期</b>:</p>
  <pre><code data-lang="rust">use std::cell::RefCell;

let cell = RefCell::new(5);

{
    let mut m = cell.borrow_mut();   // 运行期借出可变引用
    *m += 1;
}                                    // 归还

println!("{:?}", cell.borrow());     // 6</code></pre>
  <p>规矩还在:<b>可变借用存在期间再借任何引用,程序当场 panic</b>(不是编译错误!)。编译期躲过的债,运行期连本带息还上。</p>
  <div class="warn">⚠️ <b>什么时候才需要它?</b>极少数场景:比如「逻辑上只有一处会改,但编译器看不出来」的内部缓存、测试替身(Mutex 的单线程版)。新手法则:<b>想用 RefCell 之前,先重新想一遍借用结构——九成不需要它</b>。</p>
  <div class="exslot" data-ex="c15s9-1"></div>`,
  exercises: [
    { id: "c15s9-1", expectsBorrowPanic: true, kind: "predict", xp: 10, title: "运行期抓违规",
      task: "可变借用没还,又去借了——编译器这次不拦(RefCell 是运行期检查),运行时会发生什么？填写 panic 或正常结束。",
      given: "use std::cell::RefCell;\n\nlet cell = RefCell::new(5);\nlet _guard = cell.borrow_mut();   // 可变借用,没还\nlet v = cell.borrow();       // 这里会 panic\nprintln!(\"{}\", *v);",
      expectsCompileError: false,
      expected: "panic",
      expNote: "RefCell 运行期报 already mutably borrowed,程序 panic 崩溃。",
      ref: "panic",
      refNote: "编译期能查的绝不留给运行期——这是 Rust 的哲学。RefCell 只在编译器确实看不出来的角落使用,是最后手段而非默认选择。",
    },
  ],
},

/* ══════════ ch17 追加:join 并发组合 / timeout ══════════ */
]);

/* ch17 追加 */
R.registerSections("ch17", [
{
  id: "c17s6", no: "17.6", title: "join!:两个待办同时等,谁也不堵谁",
  html: `
  <p>一个 <code class="ic">.await</code> = 一件待办等到底。想<b>同时</b>等两件待办?用 <code class="ic">tokio::join!</code>:</p>
  <pre><code data-lang="rust">async fn fetch_a() -&gt; u32 { 1 }
async fn fetch_b() -&gt; u32 { 2 }

#[tokio::main]
async fn main() {
    let (a, b) = tokio::join!(fetch_a(), fetch_b());
    // 两个同时开工,都完成才继续 ——像拉链一样合流
    println!("{a} {b}");   // 1 2
}</code></pre>
  <p>对比串行 <code class="ic">a.await; b.await</code>(等完一个再等下一个)——join! 是<b>并发</b>,两个任务大部分时间都在等待时，总耗时 ≈ 最慢的那个,不是两个相加。真实世界:同时请求两个 API、同时读文件和网络,全是它。</p>
  <div class="exslot" data-ex="c17s6-1"></div>`,
  exercises: [
    { id: "c17s6-1", kind: "predict", xp: 10, title: "join 之后的等待",
      task: "两个假任务各要 100 毫秒,join! 并发合流。请填写打印的两个数。",
      given: "async fn task_a() -> u32 { tokio::time::sleep(std::time::Duration::from_millis(100)).await; 1 }\nasync fn task_b() -> u32 { tokio::time::sleep(std::time::Duration::from_millis(100)).await; 2 }\n\n#[tokio::main]\nasync fn main() {\n    let (a, b) = tokio::join!(task_a(), task_b());\n    println!(\"{a} {b}\");\n}",
      expectsCompileError: false,
      expected: "1 2",
      expNote: "join! 并发执行,总耗时 ≈ 100ms(最慢者),不是 200ms。",
      ref: "1 2",
      refNote: "串行 await:100+100=200ms;join!:同时跑,≈100ms。这就是 async 的核心收益——P4 短链服务的并发理论后盾。",
    },
  ],
},
{
  id: "c17s7", no: "17.7", title: "超时:等待要有闹钟",
  html: `
  <p>网络请求可能永远不回——<b>永远干等是工程事故</b>。tokio 给等待装闹钟:</p>
  <pre><code data-lang="rust">use tokio::time::{timeout, Duration};

#[tokio::main]
async fn main() {
    let result = timeout(
        Duration::from_millis(50),      // 最多等 50ms
        async { tokio::time::sleep(Duration::from_millis(200)).await; 1 },               // 这件事可能很慢
    ).await;

    match result {
        Ok(v)  =&gt; println!("等到: {v}"),
        Err(_) =&gt; println!("超时,不等了"),
    }
}</code></pre>
  <p>返回 <code class="ic">Result&lt;T, Elapsed&gt;</code>:等到走 Ok,闹钟先响走 Err——<b>体面撤退</b>。生产代码的铁律:每个可能卡住的网络调用,都要有闹钟。</p>
  <div class="exslot" data-ex="c17s7-1"></div>`,
  exercises: [
    { id: "c17s7-1", kind: "predict", xp: 10, title: "闹钟先响",
      task: "任务要睡 200ms,闹钟只给 50ms。match 哪个分支?打印什么?",
      given: "use tokio::time::{sleep, timeout, Duration};\nasync fn slow_200ms() -> i32 { sleep(Duration::from_millis(200)).await; 1 }\n#[tokio::main]\nasync fn main() {\nlet result = timeout(\n    Duration::from_millis(50),\n    slow_200ms(),\n).await;\n\nmatch result {\n    Ok(v)  => println!(\"等到: {v}\"),\n    Err(_) => println!(\"超时,不等了\"),\n}\n}",
      expectsCompileError: false,
      expected: "超时,不等了",
      expNote: "50ms 闹钟先响,slow_200ms 还没醒,走 Err 分支。",
      ref: "超时,不等了",
      refNote: "timeout(闹钟时长, 任务) 返回 Result:Ok=等到,Err=超时。所有可能卡住的网络调用都要有闹钟——P4 的 select 超时保护同源。",
    },
  ],
},

/* ══════════ ch18 追加:测试三连 / release profile ══════════ */
]);

/* ch18 追加 */
R.registerSections("ch18", [
{
  id: "c18s7", no: "18.7", title: "#[should_panic]:该崩的必须崩",
  html: `
  <p>有些函数的<b>正确行为就是 panic</b>(比如越界守卫)。测试它 = 断言「它确实崩了」:</p>
  <pre><code data-lang="rust">#[test]
#[should_panic]               // 期待 panic,不 panic 反而失败
fn test_out_of_range() {
    let v = vec![1, 2, 3];
    let _ = v[10];            // 越界:panic → 测试通过 ✓
}</code></pre>
  <p>再配一个 <code class="ic">#[should_panic(expected = \"越界信息\")]</code>,还能检查崩得对不对——防止崩错了地方也绿。</p>
  <div class="exslot" data-ex="c18s7-1"></div>`,
  exercises: [
    { id: "c18s7-1", kind: "predict", xp: 10, localOnly: true, title: "该崩不崩",
      task: "带 #[should_panic] 的测试,如果函数<b>没有</b> panic——cargo test 显示什么?",
      given: "#[test]\n#[should_panic]\nfn test_safe() {\n    let v = vec![1, 2, 3];\n    let _ = v[0];    // 没越界,没 panic\n}",
      expectsCompileError: false,
      expected: "FAILED",
      expNote: "should_panic 期待崩溃;没崩 = 测试失败(FAILED)。",
      ref: "FAILED",
      refNote: "should_panic 的逻辑反过来:不崩才是不及格。它是「该崩的必须崩」的守门员——守卫函数的验收利器。",
    },
  ],
},
{
  id: "c18s8", no: "18.8", title: "Result 测试：返回 Err 时测试失败",
  html: `
  <p>测试函数也可以返回 <code class="ic">Result&lt;(), E&gt;</code>——用 <code class="ic">?</code> 传播错误,<b>Err 就是测试失败</b>,不用 unwrap:</p>
  <pre><code data-lang="rust">#[test]
fn parse_number() -&gt; Result&lt;(), std::num::ParseIntError&gt; {
    let n: i32 = \"42\".parse()?;      // 失败会 Err → 测试失败
    assert_eq!(n, 42);
    Ok(())                            // 必须显式交 Ok
}</code></pre>
  <p>比 unwrap 优雅:测试体里可以放心用 <code class="ic">?</code> 了。</p>
  <div class="exslot" data-ex="c18s8-1"></div>`,
  exercises: [
    { id: "c18s8-1", kind: "predict", xp: 10, localOnly: true, title: "Result 测试的及格线",
      task: "parse(\"abc\") 会 Err。这个 Result 测试的结局?",
      given: "#[test]\nfn parse_bad() -> Result<(), std::num::ParseIntError> {\n    let _n: i32 = \"abc\".parse()?;   // Err 往上传\n    Ok(())\n}",
      expectsCompileError: false,
      expected: "FAILED",
      expNote: "? 把 Err 传出函数 = 测试失败,unwrap 都不用写。",
      ref: "FAILED",
      refNote: "Result 测试的约定:返回 Err 即测试失败。函数体内用 ? 直通,代码更整洁——错误处理的知识搬进测试,完美衔接 ch11。",
    },
  ],
},
{
  id: "c18s9", no: "18.9", title: "dev vs release:两副引擎,两种性格",
  html: `
  <p>Cargo 自带两套「编译引擎配置」:</p>
  <table class="cmp-table">
    <tr><th>命令</th><th>profile</th><th>性格</th></tr>
    <tr><td><code class="ic">cargo run</code></td><td>dev(默认)</td><td>编译飞快、能调试,但<b>跑得慢</b>(不优化)</td></tr>
    <tr><td><code class="ic">cargo run --release</code></td><td>release</td><td>编译慢一截,但<b>跑得飞快</b>(满血优化)</td></tr>
  </table>
  <p>同一个程序,release 可能比 dev <b>快十倍以上</b>(循环展开、内联、去掉调试检查)。两条军规:① <b>开发用 dev</b>(等编译的每一秒都在烧命);② <b>性能测试必须用 release</b>——在 dev 上测性能,结论全是错的。</p>
  <div class="exslot" data-ex="c18s9-1"></div>`,
  exercises: [
    { id: "c18s9-1", kind: "predict", xp: 10, localOnly: true, title: "哪个 profile 测性能?",
      task: "你想测程序跑得多快。请填写完整的 Cargo 命令。",
      given: "// 测性能,选哪个?\n// A: cargo run\n// B: cargo run --release",
      expectsCompileError: false,
      expected: "cargo run --release",
      expNote: "dev 不优化,测出的全是「调试版速度」;性能测试必须 release。",
      ref: "cargo run --release",
      refNote: "dev 快编译慢运行,release 慢编译快运行——开发迭代用 dev,交卷和性能测试用 release。顺带一提:发布给别人用的二进制也是 --release 出的。",
    },
  ],
}]);

})();
