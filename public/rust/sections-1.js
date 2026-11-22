/* ═══════════════════════════ 锈岛求生 3.0 · 第一卷细节小节(ch1~ch3) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════ 第 1 章 · 变量(6 小节 + 2 实战) ════════ */
R.registerSections("ch1", [
{
  id: "c1s1", no: "1.1", title: "let 的完整形态:可选类型标注",
  html: `
  <p>主章见过 <code class="ic">let</code>,但完整形态是三段式的:</p>
  <pre><code class="lang-rust">let 名字: 类型 = 值;
let pi: f64 = 3.14;      // 显式标注:一个 64 位浮点数
let x = 42;              // 省略类型:编译器看 42,推断为 i32</code></pre>
  <p><b>什么时候必须标注?</b>两种情况:①想让变量用非默认类型(比如想用 <code class="ic">u8</code> 装一个小数字);②编译器猜不出(比如空容器 <code class="ic">let v = Vec::new()</code> 猜不出装什么,必须 <code class="ic">Vec::new()</code> 配上标注或第一次使用来锁定)。</p>
  <div class="exslot" data-ex="c1s1-1"></div>`,
  exercises: [
    { id: "c1s1-1", kind: "blank", xp: 10, title: "标注 f64",
      task: '给变量补上 64 位浮点数的类型。填写后点击「运行 Rust」，应输出 2.5。',
      given: "let radius: ____ = 2.5;\nprintln!(\"{radius}\");",
      placeholder: "填写类型",
      checks: [
        { label: "标注了 f64", hint: "填写 f64。", test: (s) => /^f64$/.test(s) },
      ],
      ref: "f64",
      refNote: "标注写法是「冒号 类型」。编译器能猜的时候省略;猜不出或想指定时写上。零成本——类型在编译期就定了,不占运行时一丝性能。",
    },
  ],
},
{
  id: "c1s2", no: "1.2", title: "mut 的活动范围:声明时写一次",
  html: `
  <p>新手最容易犯的错:以为修改时也要写 <code class="ic">mut</code>。<b>mut 只在 let 旁边出现一次</b>,之后修改就是裸赋值:</p>
  <pre><code class="lang-rust">let mut count = 0;    // 声明时贴上"可变"标签
count = 10;           // 修改:不写 mut
count += 5;           // 复合赋值:也不写
// mut count = 10;    // ❌ 语法错误!mut 不跟赋值走</code></pre>
  <div class="exslot" data-ex="c1s2-1"></div>`,
  exercises: [
    { id: "c1s2-1", kind: "predict", xp: 10, title: "mut 走哪边?",
      task: `数一数:count 最后是几?把打印结果打出来。`,
      given: "let mut count = 0;\ncount = 10;\ncount += 5;\ncount = count * 2;\nprintln!(\"{count}\");",
      expected: "30",
      ref: "let mut count = 0;   // 声明一次\ncount = 10;          // 裸赋值\ncount += 5;          // 15\ncount = count * 2;   // 30\nprintln!(\"{count}\");",
      refNote: "10 + 5 = 15,再 ×2 = 30。mut 只在第一行出现——之后改的是同一个盒子,不需要再声明。",
    },
  ],
},
{
  id: "c1s3", no: "1.3", title: "const:编译期就定死的常量",
  html: `
  <p><code class="ic">const</code> 和 <code class="ic">let</code> 是两种东西:const 在<b>编译期</b>就定死、编译器会直接把值嵌进使用处,而且<b>必须标注类型</b>(编译器要替你确认嵌入的字节布局):</p>
  <pre><code class="lang-rust">const MAX_POINTS: i32 = 100;     // ✅ 类型必须写
const PI: f64 = 3.14159;

// const MAX_POINTS = 100;      // ❌ 编译报错:missing type for 'const' item</code></pre>
  <div class="exslot" data-ex="c1s3-1"></div>`,
  exercises: [
    { id: "c1s3-1", kind: "fix", runDemo: { after: "println!(\"{MAX}\");" }, xp: 10, title: "const 少了类型",
      task: `这个常量少了类型标注,编译器拒收。把修好的一行打出来。`,
      given: "const MAX = 100;",
      errText: "missing type for 'const' item\nhelp: consider giving it the explicit type 'i32'",
      scaffold: "const MAX = 100;",
      checks: [
        { label: "const 带上了类型标注", hint: "const MAX: i32 = 100; ——冒号、空格、i32。", test: (s) => /const\s+MAX\s*:\s*i32\s*=\s*\d+/.test(s) },
      ],
      ref: "const MAX: i32 = 100;",
      refNote: "const 的类型省不得——编译器要在编译期决定嵌多少字节进去。命名习惯:全大写 + 下划线(SCREAMING_SNAKE)。",
    },
  ],
},
{
  id: "c1s4", no: "1.4", title: "遮蔽再深一层:同名新盒子能换类型",
  html: `
  <p>主章提过遮蔽,这里挖深一层:<b>遮蔽出来的新变量可以换类型</b>,这是 Python 没有的合法操作:</p>
  <pre><code class="lang-rust">let x = "42";              // x 是 &str(字符串)
let x: i32 = x.trim().parse().unwrap();   // 新 x 是 i32(数字)
println!("{}", x + 8);     // 50 ——数字 + 数字,合法!</code></pre>
  <p>这不叫"违规修改变量",而是<b>造了个同名新盒子、旧盒子的名字被顶掉</b>。处理"同一份数据的不同形态"时非常有用(字符串解析成数字是最常见的场景)。</p>
  <div class="exslot" data-ex="c1s4-1"></div>`,
  exercises: [
    { id: "c1s4-1", kind: "predict", xp: 10, title: "同名换类型",
      task: `x 被 let 了两次,第二次换了类型。打印什么?`,
      given: "let x = \"5\";\nlet x: i32 = x.parse().unwrap();\nprintln!(\"{}\", x * 3);",
      expected: "15",
      ref: "let x = \"5\";                    // 第一个 x:&str\nlet x: i32 = x.parse().unwrap();   // 第二个 x:i32,顶掉旧名\nprintln!(\"{}\", x * 3);          // 5×3 = 15",
      refNote: "第二个 x 是全新的 i32,和旧的 &str 只是同姓。这就是遮蔽与 mut 的本质区别:mut 改盒子里装的东西,遮蔽是拿新盒子顶名字。",
    },
  ],
},
{
  id: "c1s5", no: "1.5", title: "下划线变量:告诉编译器“我知道我没用它”",
  html: `
  <p>声明了不用,编译器会唠叨警告 <code class="ic">unused variable</code>。想表达"这个变量我故意不接",名字前加下划线:</p>
  <pre><code class="lang-rust">let _unused = 5;          // ✅ 无警告:名字已声明"我知道"
let x = 5;                // ⚠️ warning: unused variable 'x'

let _ = compute();        // 纯下划线:连"绑定"都不发生,直接丢弃返回值</code></pre>
  <p><code class="ic">_</code> 单独出现 = 彻底丢弃;<code class="ic">_x</code> = 会绑定但不警告。解构元组时会大量用到这个约定。</p>
  <div class="exslot" data-ex="c1s5-1"></div>`,
  exercises: [
    { id: "c1s5-1", kind: "predict", xp: 10, title: "警告不影响运行",
      task: `unused 警告只是唠叨,程序照样跑。输出什么?`,
      given: "let x = 99;   // 声明了没用\nprintln!(\"hello\");",
      expected: "hello",
      ref: "let x = 99;            // ⚠️ 编译期警告 unused variable,但不阻止编译\nprintln!(\"hello\");     // 照常打印 hello",
      refNote: "警告 ≠ 错误:程序编译通过、照常运行。但 Rust 圈的习惯是追求零警告——警告多了一行行看,经常能提前发现 bug。想消掉它:_x 改名即可。",
    },
  ],
},
{
  id: "c1s6", no: "1.6", title: "数字字面量的花样写法",
  html: `
  <p>数字可以写得很好看,还能指定进制和类型:</p>
  <pre><code class="lang-rust">let million = 1_000_000;      // 下划线分隔,纯视觉友好
let hex = 0xFF;                // 十六进制 = 255
let oct = 0o77;               // 八进制 = 63
let bin = 0b1010;             // 二进制 = 10
let byte: u8 = 255u8;          // 后缀直接标类型

println!("{}", million);      // 打印:1000000(下划线不参与)</code></pre>
  <div class="exslot" data-ex="c1s6-1"></div>`,
  exercises: [
    { id: "c1s6-1", kind: "predict", xp: 10, title: "下划线去哪了?",
      task: `1_000_000 打印出来长什么样?`,
      given: "let million = 1_000_000;\nprintln!(\"{}\", million);",
      expected: "1000000",
      ref: "let million = 1_000_000;\nprintln!(\"{}\", million);   // 1000000 ——下划线是给人看的,机器不认",
      refNote: "下划线只是分隔符,值就是 1000000。写大数字时加上,读的人会感谢你。",
    },
  ],
},
{
  id: "c1f", no: "1.7", title: "🎯 本章实战(2 题)",
  html: `<p>变量功夫全部上膛:mut、遮蔽、下划线、字面量,一起用。</p>
  <div class="exslot" data-ex="c1f-1"></div>
  <div class="exslot" data-ex="c1f-2"></div>`,
  exercises: [
    { id: "c1f-1", kind: "big", xp: 15, title: "实战① 变量变形记",
      task: '写一个完整小程序:①声明 <code class="ic">let input = "42"</code>(字符串);②用遮蔽把它变成 i32(提示:<code class="ic">input.parse().unwrap()</code>);③声明 <code class="ic">let mut result</code> 接住 input 的三倍;④再遮蔽一次,把 result 变成字符串(用 <code class="ic">result.to_string()</code>)拼接 "!";⑤打印最终值(应得 <code>126!</code>)。',
      scaffold: "fn main() {\n    let input = \"42\";\n    // ① 遮蔽成 i32\n\n    // ② mut 三倍\n\n    // ③ 遮蔽回字符串拼 \"!\"\n\n    // ④ 打印\n}",
      checks: [
        { label: "用了遮蔽(parse 转 i32)", hint: "let input: i32 = input.parse().unwrap();", test: (s) => /parse\s*\(\s*\)/.test(s) && /:\s*i32\b/.test(s) },
        { label: "用了 mut 做乘法", hint: "let mut result = input * 3; ——记住 mut 只在 let 旁。", test: (s) => /let\s+mut\s+\w+/.test(s) && /\*\s*3/.test(s) },
        { label: "再次遮蔽转字符串并拼接", hint: "let result = result.to_string() + \"!\";", test: (s) => /to_string\s*\(\s*\)/.test(s) && /\"!\"|'!'/.test(s) },
        { label: "打印了最终结果", hint: "println!(\"{}\", result); → 126!", test: (s) => /println!|print!/.test(s) },
      ],
      ref: "fn main() {\n    let input = \"42\";\n    let input: i32 = input.parse().unwrap();\n    let mut result = input * 3;    // 126\n    let result = result.to_string() + \"!\";\n    println!(\"{}\", result);        // 126!\n}",
      refNote: "一道题串起本章四个概念:let 类型标注、mut、遮蔽换类型、类型转换。126! 就是你的第一枚实战勋章。",
    },
    { id: "c1f-2", kind: "big", xp: 15, title: "实战② 计步器",
      task: '写完整小程序:①声明 <code class="ic">let mut steps = 0</code>;②在循环里走 5 步(每次 +1);③走完后声明一个<b>带下划线前缀</b>的变量装当前时间字符串(假装的:<code class="ic">let _now = "今天"</code>,故意不用它);④打印 steps(应得 5)。',
      scaffold: "fn main() {\n    // ① mut steps\n\n    // ② 循环 5 次,每次 +1\n\n    // ③ 声明故意不用的 _now\n\n    // ④ 打印 steps\n}",
      checks: [
        { label: "声明了 mut steps", hint: "let mut steps = 0;", test: (s) => /let\s+mut\s+steps/.test(s) },
        { label: "循环走 5 步", hint: "for _ in 0..5 { steps += 1; } ——下划线在这里也出勤:不需要循环变量。", test: (s) => /for\s+_\s+in\s+0\.\.5/.test(s) && /\+=\s*1/.test(s) },
        { label: "声明了下划线前缀的变量", hint: "let _now = \"今天\"; ——下划线开头,编译器不唠叨。", test: (s) => /let\s+_now/.test(s) },
        { label: "打印了结果", hint: "println!(\"{}\", steps);", test: (s) => /println!\s*\(\s*"?[^"]*"?steps|println!\s*\(\s*"\\{\\}"\s*,\s*steps/.test(s) || /println!/.test(s) },
      ],
      ref: "fn main() {\n    let mut steps = 0;\n    for _ in 0..5 {\n        steps += 1;\n    }\n    let _now = \"今天\";   // 故意不用:下划线前缀免警告\n    println!(\"{}\", steps);\n}",
      refNote: "for _ in 0..5 里的下划线是它的经典舞台:循环变量用不上,干脆用 _ 丢弃。mut、for、下划线约定,三件事一题打尽。",
    },
  ],
},
]);

/* ════════ 第 2 章 · 类型(7 小节 + 2 实战) ════════ */
R.registerSections("ch2", [
{
  id: "c2s1", no: "2.1", title: "整数家族:一排规格不同的盒子",
  html: `
  <p>主章只用了 i32,现在认识全家:i 系列(带正负号)和 u 系列(只装非负数),数字是位数:</p>
  <table class="tbl">
    <tr><th>类型</th><th>范围</th><th>装什么</th></tr>
    <tr><td><code class="ic">i8 / u8</code></td><td>-128~127 / 0~255</td><td>字节数据</td></tr>
    <tr><td><code class="ic">i32 / u32</code></td><td>约 ±21 亿</td><td><b>日常默认</b></td></tr>
    <tr><td><code class="ic">i64 / u64</code></td><td>约 ±922 亿亿</td><td>时间戳、大计数</td></tr>
    <tr><td><code class="ic">isize / usize</code></td><td>跟平台位数走</td><td>下标、长度</td></tr>
  </table>
  <p>不标类型时整数默认 <code class="ic">i32</code>——它是"够用且最快"的甜点位置。</p>
  <div class="exslot" data-ex="c2s1-1"></div>`,
  exercises: [
    { id: "c2s1-1", kind: "blank", runDemo: { after: "println!(\"{age}\");" }, xp: 10, title: "给年龄挑个合适的类型",
      task: `装人的年龄,最贴切的最小类型是哪个?把标注补上。`,
      given: "let age: ____ = 30;",
      placeholder: "u8 / i8 / u32 ?",
      checks: [
        { label: "选了 u8(0~255,装年龄绰绰有余)", hint: "u8 ——年龄不可能是负数,255 也够活。", test: (s) => /u8\b/.test(s) },
      ],
      ref: "u8",
      refNote: "u8 装年龄最贴切(0~255)。不过\"最贴切\"是追求极致时的思考;日常不纠结的话 i32 一把梭,读代码的人不用算范围。",
    },
  ],
},
{
  id: "c2s2", no: "2.2", title: "溢出:debug 模式当场翻脸",
  html: `
  <p><code class="ic">u8</code> 装到 255 就满了。加 1 会怎样?——<b>debug 编译(默认)当场 panic</b>:</p>
  <pre><code class="lang-rust">let x: u8 = 255;
let y = x + 1;    // 💥 panic: attempt to add with overflow</code></pre>
  <p>这是 Rust 的安全设计:溢出往往是 bug,宁可当场炸给你看。真需要环绕运算,有明确说出口的写法:<code class="ic">wrapping_add</code>、<code class="ic">checked_add</code>(返回 Option,后面讲)。</p>
  <div class="exslot" data-ex="c2s2-1"></div>`,
  exercises: [
    { id: "c2s2-1", kind: "fix", runDemo: { after: 'println!("{y}");'  }, xp: 10, title: "255 + 1 的翻车现场",
      task: `u8 装不下 256。不改语义(就是想算 255+1),换一个装得下的类型,保留 y 的计算，修正 x 的类型，让运行结果输出 256。`,
      given: "let x: u8 = 255;\nlet y = x + 1;",
      errText: "attempt to compute `255_u8 + 1_u8`, which would overflow",
      scaffold: "let x: u8 = 255;\nlet y = x + 1;",
      checks: [
        { label: "类型扩容(i16/u16/i32 等)", hint: "u8 → i16:let x: i16 = 255; 或显式转换。", test: (s) => /:\s*(i16|u16|i32|u32|i64)\b/.test(s) || /as\s+(i16|u16|i32|u32)/.test(s) },
        { label: "没有再出现 u8 溢出写法", hint: "x: u8 = 255 后面直接 +1 的组合必须消失。", test: (s) => !(/:\s*u8\b[\s\S]*\+\s*1/.test(s) && !/as\s+/.test(s)) },
      ],
      ref: "let x: i16 = 255;\nlet y = x + 1;   // 256,i16 装得下",
      refNote: "换大盒子是最直白的修法。真实项目里,涉及\"可能溢出\"的计算(哈希、加密)用 wrapping_* 系列,把意图写在明面上。",
    },
  ],
},
{
  id: "c2s3", no: "2.3", title: "f64 的边界:NaN 和无穷",
  html: `
  <p>浮点有两个特殊"值",写金融或科学计算时必须认识:</p>
  <pre><code class="lang-rust">let nan = 0.0 / 0.0;          // NaN:Not a Number(0 除以 0)
let inf = 1.0 / 0.0;          // inf:无穷大

println!("{}", nan == nan);   // false!NaN 连自己都不等于
println!("{}", nan.is_nan()); // true ——判断 NaN 的唯一正道</code></pre>
  <p>NaN 参与比较全是 false,所以<b>永远用 <code class="ic">is_nan()</code></b> 来判断,别用 ==。</p>
  <div class="exslot" data-ex="c2s3-1"></div>`,
  exercises: [
    { id: "c2s3-1", kind: "predict", xp: 10, title: "NaN 不等于自己",
      task: `两行比较,各打印什么?`,
      given: "let nan: f64 = 0.0 / 0.0;\nprintln!(\"{}\", nan == nan);\nprintln!(\"{}\", nan.is_nan());",
      expected: "false\ntrue",
      ref: "let nan: f64 = 0.0 / 0.0;\nprintln!(\"{}\", nan == nan);     // false ——NaN 六亲不认\nprintln!(\"{}\", nan.is_nan());  // true  ——正道",
      refNote: "NaN == NaN 是 false(IEEE 754 标准,所有语言都这样)。想检测 NaN?is_nan() 是唯一靠谱的招。",
    },
  ],
},
{
  id: "c2s4", no: "2.4", title: "char:一个 unicode 码点,不是字节",
  html: `
  <p>主章说过单引号是 char,现在补一个细节:char 是 <b>4 字节的 Unicode 码点</b>,不是字符串里的一个字节:</p>
  <pre><code class="lang-rust">let c = '中';       // char:4 字节
let s = "中";        // String/&str:UTF-8 编码占 3 字节

// char 可以直接比较(按 Unicode 编号)
println!("{}", 'a' < 'z');     // true</code></pre>
  <p>细节:char 的尺寸比字符串里的字节大——这是 UTF-8(字符串可变长编码)和 UCS-4(char 定长 4 字节)两套表示法的分工。</p>
  <div class="exslot" data-ex="c2s4-1"></div>`,
  exercises: [
    { id: "c2s4-1", kind: "predict", xp: 10, title: "char 比大小",
      task: `'a' 和 'z' 按码点比,谁小?打印什么?`,
      given: "println!(\"{}\", 'a' < 'z');",
      expected: "true",
      ref: "println!(\"{}\", 'a' < 'z');   // true ——'a' 编号 97,'z' 编号 122",
      refNote: "char 比较按 Unicode 编号:'a'(97) < 'z'(122)。判断\"这个字符是不是字母/数字\"也靠这套编号(std::char::is_alphabetic 等)。",
    },
  ],
},
{
  id: "c2s5", no: "2.5", title: "元组:一次性声明多个变量",
  html: `
  <p>元组把几个不同类型的值打成一个包,还能<b>一步解构成独立变量</b>:</p>
  <pre><code class="lang-rust">let point = (3, 5.0, "家");   // (i32, f64, &str) 打包
println!("{}", point.0);      // 用 .0 .1 .2 访问(下标)

let (x, y, label) = point;    // 解构:一步拆成三个变量
println!("{x} {y} {label}");  // 3 5 家</code></pre>
  <div class="exslot" data-ex="c2s5-1"></div>`,
  exercises: [
    { id: "c2s5-1", kind: "predict", xp: 10, title: "解构三连",
      task: `元组解构后,x、y、label 各是什么?打印一行。`,
      given: "let t = (10, 3.14, \"go\");\nlet (x, y, label) = t;\nprintln!(\"{} {} {}\", x, y, label);",
      expected: "10 3.14 go",
      ref: "let t = (10, 3.14, \"go\");\nlet (x, y, label) = t;   // 一步拆包\nprintln!(\"{} {} {}\", x, y, label);   // 10 3.14 go",
      refNote: "解构是元组的高频用法:函数想返回多个值时返回元组,接收方一行拆包。后面章节的模式匹配,把这套解构玩成了一门艺术。",
    },
  ],
},
{
  id: "c2s6", no: "2.6", title: "数组 [T; N]:定长、生在栈上",
  html: `
  <p>数组是<b>定长</b>的同类元素序列,长度是类型的一部分:</p>
  <pre><code class="lang-rust">let arr = [1, 2, 3, 4];            // 长度 4,推断 [i32; 4]
let zeros = [0; 8];                // [0; 8]:8 个 0,声明语法糖

println!("{}", arr.len());         // 4
println!("{}", arr[0]);             // 1,下标从 0
// arr[4] = 5;                     // ❌ 编译报错!长度是类型的骨头</code></pre>
  <p>与 Vec 的分工:长度<b>编译期就定死</b>用数组(更快、栈上分配),长度要变用 Vec。</p>
  <div class="exslot" data-ex="c2s6-1"></div>`,
  exercises: [
    { id: "c2s6-1", kind: "predict", xp: 10, title: "[0; 8] 语法糖",
      task: `zeros 是几个 0?len 是几?打印一行。`,
      given: "let zeros = [0; 8];\nprintln!(\"{}\", zeros.len());",
      expected: "8",
      ref: "let zeros = [0; 8];   // 8 个 0\nprintln!(\"{}\", zeros.len());   // 8",
      refNote: "[0; 8] 读作「8 个 0」——初始化定长缓冲区的标准写法。数组的长度写进类型([i32; 8]),编译器全程替你把守。",
    },
  ],
},
{
  id: "c2s7", no: "2.7", title: "as 转换:截断比你想的狠",
  html: `
  <p>主章讲过 <code class="ic">as</code>,补一个坑:大类型转小类型是<b>直接截断高位字节</b>,不是四舍五入:</p>
  <pre><code class="lang-rust">let a = 300u16;           // 底层字节:0x012C
let b = a as u8;           // 截掉高位 → 0x2C = 44
println!("{}", b);         // 44 !</code></pre>
  <div class="exslot" data-ex="c2s7-1"></div>`,
  exercises: [
    { id: "c2s7-1", kind: "predict", xp: 10, title: "300 的截肢手术",
      task: `u16 的 300 强转 u8,剩几?`,
      given: "let a = 300u16;\nlet b = a as u8;\nprintln!(\"{}\", b);",
      expected: "44",
      ref: "let a = 300u16;   // 256 + 44\nlet b = a as u8;\nprintln!(\"{}\", b);   // 44 ——300 - 256,高位字节直接扔",
      refNote: "300 = 256 + 44;u8 只装得下 0~255,高位溢出部分直接丢弃。as 是\"你说行就行\",编译器不拦——用的时候自己心里要有数。",
    },
  ],
},
{
  id: "c2f", no: "2.8", title: "🎯 本章实战(2 题)",
  html: `<p>类型系统细节的期末操练。</p>
  <div class="exslot" data-ex="c2f-1"></div>
  <div class="exslot" data-ex="c2f-2"></div>`,
  exercises: [
    { id: "c2f-1", kind: "big", xp: 15, title: "实战① 类型侦探",
      task: '写完整小程序:①声明元组 <code class="ic">t = ("小蟹", 3, 99.5)</code>(名字/年龄/分数);②解构成三个变量;③打印一行 "小蟹 3 99.5";④年龄用 <code class="ic">as</code> 转成 f64 算平均分的一半(99.5 / age as f64),保留一位小数打印(应得 <code>33.2</code>)。',
      scaffold: "fn main() {\n    // ① 元组\n\n    // ② 解构\n\n    // ③ 打印三元组\n\n    // ④ as 转换算平均\n}",
      checks: [
        { label: "声明了元组", hint: "let t = (\"小蟹\", 3, 99.5);", test: (s) => /\(\s*\"[^\"]*\"\s*,\s*\d+\s*,\s*\d+\.\d+\s*\)/.test(s) },
        { label: "解构成三个变量", hint: "let (name, age, score) = t;", test: (s) => /let\s*\(\s*\w+\s*,\s*\w+\s*,\s*\w+\s*\)/.test(s) },
        { label: "用了 as f64 做除法", hint: "score / age as f64 ——先变身再除。", test: (s) => /as\s+f64/.test(s) && /\//.test(s) },
        { label: "保留了小数位打印", hint: "println!(\"{:.1}\", avg); ——格式 {:.1}。", test: (s) => /\{:\.1\}|:\.\d/.test(s) },
      ],
      ref: "fn main() {\n    let t = (\"小蟹\", 3, 99.5);\n    let (name, age, score) = t;\n    println!(\"{} {} {}\", name, age, score);\n\n    let avg = score / age as f64;\n    println!(\"{:.1}\", avg);\n}",
      refNote: "元组打包、解构、as 变身、{:.1} 格式化——类型世界的四个常用零件一次装齐。99.5 / 3 = 33.17,保留一位 → 33.2。",
    },
    { id: "c2f-2", kind: "big", xp: 15, title: "实战② 定长数组报表",
      task: '写完整小程序:①用 <code class="ic">[0; 5]</code> 声明 5 个 0;②让它是可变的,用 for 循环往里依次填 i×2(下标访问赋值,提示循环 0..5,用 <code class="ic">arr[i] = i * 2</code>);③打印数组长度和每个元素(应得 <code>0 2 4 6 8</code>)。',
      scaffold: "fn main() {\n    // ① mut 数组 [0; 5]\n\n    // ② for 循环下标赋值\n\n    // ③ 打印 len 和元素\n}",
      checks: [
        { label: "声明了可变定长数组", hint: "let mut arr = [0; 5];", test: (s) => /let\s+mut\s+\w+\s*=\s*\[\s*0\s*;\s*5\s*\]/.test(s) },
        { label: "for 循环下标赋值", hint: "for i in 0..5 { arr[i] = i * 2; }", test: (s) => /for\s+\w+\s+in\s+0\.\.5/.test(s) && /\[\s*\w+\s*\]\s*=/.test(s) },
        { label: "打印了数组内容", hint: "println!(\"{:?}\", arr); 或逐个打印。", test: (s) => /println!/.test(s) },
      ],
      ref: "fn main() {\n    let mut arr = [0; 5];\n    for i in 0..5 {\n        arr[i] = i * 2;\n    }\n    println!(\"len: {}\", arr.len());\n    println!(\"{:?}\", arr);   // [0, 2, 4, 6, 8]\n}",
      refNote: "{:?} 打印整个数组(Debug 格式)。下标循环是 C 时代的老手艺;后面学会迭代器,同一件事能写得更 Rust——但现在先用它,练手感。",
    },
  ],
},
]);

/* ════════ 第 3 章 · 函数(6 小节 + 2 实战) ════════ */
R.registerSections("ch3", [
{
  id: "c3s1", no: "3.1", title: "每个参数都必须亮出类型",
  html: `
  <p>主章立过"合同"的规矩,细节:同类型参数可以<b>合并声明</b>:</p>
  <pre><code class="lang-rust">fn add(a: i32, b: i32) -> i32 { a + b }   // 合同:两个 i32 换一个 i32
fn dist(x1: i32, y1: i32, x2: i32, y2: i32) -> i32 {   // 同类型一串:合并写
    (x2 - x1).abs() + (y2 - y1).abs()
}</code></pre>
  <p>函数也是"公共建筑":默认对全 crate 可见,签名就是它的门牌——签名靠谱,用的人就不用读函数体。</p>
  <div class="exslot" data-ex="c3s1-1"></div>`,
  exercises: [
    { id: "c3s1-1", kind: "blank", runDemo: { after: "println!(\"{}\", avg(2.0, 4.0));" }, xp: 10, title: "补合同",
      task: `下面函数收两个 f64、返回 f64,签名空着,补出来(一行)。`,
      given: "fn avg(____) -> f64 { (a + b) / 2.0 }",
      placeholder: "a: f64, b: f64",
      checks: [
        { label: "两个参数都标了 f64", hint: "a: f64, b: f64 ——一个类型管俩,逗号隔开。", test: (s) => /a\s*:\s*f64\s*,\s*b\s*:\s*f64/.test(s) },
      ],
      ref: "a: f64, b: f64",
      refNote: "两个 f64 合并写成「a: f64, b: f64」。同类型一长串时还能全并「x1: i32, y1: i32」→ 更简,签名是给人读的,清晰优先。",
    },
  ],
},
{
  id: "c3s2", no: "3.2", title: "块表达式:let 后面能接整个故事",
  html: `
  <p>表达式在 Rust 里无处不在——<b>大括号块本身就是表达式</b>,最后一行不带分号就是值:</p>
  <pre><code class="lang-rust">let y = {
    let x = 3;
    x + 1          // 没分号:整块的值
};
println!("{}", y);   // 4</code></pre>
  <p>这是"在 let 里做一段计算"的合法姿势。分号把表达式变成语句——<b>一个分号,值就没了</b>。</p>
  <div class="exslot" data-ex="c3s2-1"></div>`,
  exercises: [
    { id: "c3s2-1", kind: "predict", xp: 10, title: "块里藏着几?",
      task: `let y 接住了一个块,块里最后算出什么?打印什么?`,
      given: "let y = {\n    let x = 3;\n    x + 1\n};\nprintln!(\"{}\", y);",
      expected: "4",
      ref: "let y = {\n    let x = 3;\n    x + 1     // 无分号:块的表达式\n};\nprintln!(\"{}\", y);   // 4",
      refNote: "x + 1 没分号 → 是块的值 → 交给 y。给它加个分号试试:块的类型变 (),y 就接不住了,编译器当场报错——分号的哲学,拿这个例子反复品味。",
    },
  ],
},
{
  id: "c3s3", no: "3.3", title: "提前 return 与发散",
  html: `
  <pre><code class="lang-rust">fn check(n: i32) -> &amp;'static str {
    if n < 0 {
        return "负数";   // 中途下车:return
    }
    "非负"               // 终点站:表达式即返回
}</code></pre>
  <p>两种下车方式的分工:<b>return</b> 在函数任意处喊停;<b>末尾表达式</b>是走到终点的自然交付。Rust 里后者更地道,return 只用于"提前"。panic! 和 return 一样能"喊停",类型上叫发散(<code class="ic">!</code>),它兼容任何返回类型。</p>
  <div class="exslot" data-ex="c3s3-1"></div>`,
  exercises: [
    { id: "c3s3-1", kind: "predict", xp: 10, title: "提前下车",
      task: `check(-5) 走哪条路?打印什么?`,
      given: "fn check(n: i32) -> &'static str {\n    if n < 0 {\n        return \"负数\";\n    }\n    \"非负\"\n}\n\nprintln!(\"{}\", check(-5));",
      expected: "负数",
      ref: "// check(-5):n < 0 成立 → return \"负数\" 中途下车\nprintln!(\"{}\", check(-5));   // 负数",
      refNote: "return 一路狂奔到调用方,后面的代码全跳过。同型函数里 return 和末尾表达式混用完全合法——提前退出用 return,正常出口用表达式。",
    },
  ],
},
{
  id: "c3s4", no: "3.4", title: "函数是值:fn 类型与函数指针",
  html: `
  <p>函数本身就是一种值,类型写作 <code class="ic">fn(参数) -> 返回</code>:</p>
  <pre><code class="lang-rust">fn double(n: i32) -> i32 { n * 2 }

let f: fn(i32) -> i32 = double;   // 函数名就是它的地址
println!("{}", f(21));            // 42 ——f() 就是 double()</code></pre>
  <p>能装进变量,就能当参数传、当返回值交——<b>闭包章节的全部地基</b>就在这几行。</p>
  <div class="exslot" data-ex="c3s4-1"></div>`,
  exercises: [
    { id: "c3s4-1", kind: "predict", xp: 10, title: "函数装进变量",
      task: `f 装着 double,调用它会算什么?打印什么?`,
      given: "fn double(n: i32) -> i32 { n * 2 }\n\nlet f: fn(i32) -> i32 = double;\nprintln!(\"{}\", f(21));",
      expected: "42",
      ref: "fn double(n: i32) -> i32 { n * 2 }\nlet f: fn(i32) -> i32 = double;\nprintln!(\"{}\", f(21));   // 42",
      refNote: "函数名即值。fn(i32) -> i32 是它的完整类型。把这个概念踩实,闭包那章的 |x| x * 2 就只是\"更灵活的函数值\"而已。",
    },
  ],
},
{
  id: "c3s5", no: "3.5", title: "递归:函数调用自己",
  html: `
  <p>函数在自己身体里调用自己,就是递归。经典:阶乘 5! = 5×4×3×2×1:</p>
  <pre><code class="lang-rust">fn fact(n: u64) -> u64 {
    if n <= 1 { return 1; }   // 出口:递归的逃生门
    n * fact(n - 1)           // 自己调自己,但规模变小
}
println!("{}", fact(5));      // 120</code></pre>
  <p>递归两件套:<b>出口</b>(什么时候停)+<b>缩小规模</b>(每步更靠近出口)。少一样就是死循环炸弹。</p>
  <div class="exslot" data-ex="c3s5-1"></div>`,
  exercises: [
    { id: "c3s5-1", kind: "write", xp: 10, title: "动手写:斐波那契",
      task: `写 <code class="ic">fib(n: u64) -> u64</code>:fib(0)=0, fib(1)=1, 之后 fib(n)=fib(n-1)+fib(n-2)。main 里打印 fib(10)(应得 <b>55</b>)。记住两件套:出口 + 缩小。`,
      scaffold: "fn fib(n: u64) -> u64 {\n    // 出口:n 是 0 或 1 时直接返回\n\n    // 递归:缩小规模\n}\n\nfn main() {\n    println!(\"{}\", fib(10));\n}",
      checks: [
        { label: "有出口(n <= 1 直接返回)", hint: "if n <= 1 { return n; } ——不设出口就是死循环。", test: (s) => /if\s+n\s*<=?\s*1/.test(s) },
        { label: "递归调用自己且规模缩小", hint: "fib(n - 1) + fib(n - 2)", test: (s) => /fib\s*\(\s*n\s*-\s*1\s*\)/.test(s) && /fib\s*\(\s*n\s*-\s*2\s*\)/.test(s) },
        { label: "main 里打印了 fib(10)", hint: "println!(\"{}\", fib(10)); → 55", test: (s) => /fib\s*\(\s*10\s*\)/.test(s) },
      ],
      ref: "fn fib(n: u64) -> u64 {\n    if n <= 1 {\n        return n;\n    }\n    fib(n - 1) + fib(n - 2)\n}\n\nfn main() {\n    println!(\"{}\", fib(10));   // 55\n}",
      refNote: "出口 return n 一箭双雕:fib(0)=0、fib(1)=1 天然正确。递归是后面讲\"思维链\"时模型最爱的推理方式——你现在也在用递归思维解题!",
    },
  ],
},
{
  id: "c3s6", no: "3.6", title: "单元类型 ():什么都不返回",
  html: `
  <p>没写 <code class="ic">-></code> 的函数,其实返回了<b>单元类型 ()</b>——一个"空"值:</p>
  <pre><code class="lang-rust">fn shout(msg: &str) {       // 隐式 -> ()
    println!("{msg}!!!");
}

fn main() -> () {            // 显式写出来也合法(没人这么干)
    shout("go");\n}</code></pre>
  <p>() 类似"占位空值",一个所有 () 都相等的世界。它还会出现在"块加了分号变语句"的场合——你给块加了分号,它的类型就悄悄变成了 ()。</p>
  <div class="exslot" data-ex="c3s6-1"></div>`,
  exercises: [
    { id: "c3s6-1", kind: "predict", xp: 10, title: "空值的世界",
      task: `所有 () 都相等。打印什么?`,
      given: "let a = ();\nlet b = ();\nprintln!(\"{}\", a == b);",
      expected: "true",
      ref: "let a = ();\nlet b = ();\nprintln!(\"{}\", a == b);   // true ——世界上只有一个 ()",
      refNote: "() 是只有一个值的类型,所有 () 都相等。它不是 null——null 是\"应该有值但没有\"的谎言,() 是光明正大的\"我就是空\"。",
    },
  ],
},
{
  id: "c3f", no: "3.7", title: "🎯 本章实战(2 题)",
  html: `<p>函数功夫三件套:签名合同、表达式返回、递归,一起上。</p>
  <div class="exslot" data-ex="c3f-1"></div>
  <div class="exslot" data-ex="c3f-2"></div>`,
  exercises: [
    { id: "c3f-1", kind: "big", xp: 15, title: "实战① 迷你计算器",
      task: '写完整小程序:①函数 <code class="ic">calc(op: char, a: f64, b: f64) -> f64</code>:用 if/else if 处理 + - * / 四种运算(/ 时 b 为 0 返回 NaN:<code class="ic">a / b</code> 零除天然 NaN,f64 不怕);②main 里调用三次:calc('+', 10, 3)、calc('*', 10, 3)、calc('/', 10, 0),分别打印(应得 13、30、NaN)。',
      scaffold: "fn calc(op: char, a: f64, b: f64) -> f64 {\n    // if/else if 四种运算\n}\n\nfn main() {\n    // 三次调用打印\n}",
      checks: [
        { label: "签名完整(char + 两个 f64 -> f64)", hint: "fn calc(op: char, a: f64, b: f64) -> f64", test: (s) => /fn\s+calc\s*\(\s*op\s*:\s*char\s*,\s*a\s*:\s*f64\s*,\s*b\s*:\s*f64\s*\)\s*->\s*f64/.test(s) },
        { label: "处理了 + - * / 四种运算", hint: "op == '+' / '-' / '*' / '/' 四分支。", test: (s) => s.includes("'+'") && s.includes("'*'") && s.includes("'/'") },
        { label: "main 三次调用并打印", hint: "println!(\"{}\", calc('+', 10.0, 3.0)); ——三次。", test: (s) => (s.match(/calc\s*\(/g) || []).length >= 4 && (s.match(/println!|print!/g) || []).length >= 3 },
      ],
      ref: "fn calc(op: char, a: f64, b: f64) -> f64 {\n    if op == '+' { a + b }\n    else if op == '-' { a - b }\n    else if op == '*' { a * b }\n    else if op == '/' { a / b }\n    else { f64::NAN }\n}\n\nfn main() {\n    println!(\"{}\", calc('+', 10.0, 3.0));   // 13\n    println!(\"{}\", calc('*', 10.0, 3.0));   // 30\n    println!(\"{}\", calc('/', 10.0, 0.0));    // NaN\n}",
      refNote: "f64 除以 0 不 panic,天然返回 NaN——浮点世界里 0 是\"允许的除数\"。整数 0 除会 panic,浮点不会,这个差别记住。calc 也是\"块表达式+多分支返回\"的完整展示。",
    },
    { id: "c3f-2", kind: "big", xp: 15, title: "实战② 递归求和",
      task: '写完整小程序:递归函数 <code class="ic">sum_to(n: u64) -> u64</code>:算 1+2+…+n(sum_to(0)=0 出口)。main 打印 sum_to(100)(应得 <b>5050</b>)。',
      scaffold: "fn sum_to(n: u64) -> u64 {\n    // 出口 + 递归缩小\n}\n\nfn main() {\n    println!(\"{}\", sum_to(100));\n}",
      checks: [
        { label: "有出口(n == 0 返回 0)", hint: "if n == 0 { return 0; } 或 if n == 0 { 0 }", test: (s) => /if\s+n\s*==\s*0/.test(s) },
        { label: "递归调用且规模缩小", hint: "sum_to(n - 1) + n", test: (s) => /sum_to\s*\(\s*n\s*-\s*1\s*\)/.test(s) && /\+\s*n|n\s*\+/.test(s) },
        { label: "main 打印 sum_to(100)", hint: "println!(\"{}\", sum_to(100)); → 5050", test: (s) => /sum_to\s*\(\s*100\s*\)/.test(s) },
      ],
      ref: "fn sum_to(n: u64) -> u64 {\n    if n == 0 {\n        return 0;\n    }\n    sum_to(n - 1) + n\n}\n\nfn main() {\n    println!(\"{}\", sum_to(100));   // 5050\n}",
      refNote: "高斯小时候的故事:1+100=101,101×50=5050。递归不用聪明公式,老老实实一层层拆——理解了它,你就理解了\"函数调用栈\"的运作方式。100 层对栈来说毫无压力(默认栈约 8MB,百万层才会爆)。",
    },
  ],
},
]);

})();
