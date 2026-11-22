/* ═══════════════════════════ 锈岛求生 3.0 · 第一卷细节小节(ch4~ch5) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════ 第 4 章 · 控制流(6 小节 + 2 实战) ════════ */
R.registerSections("ch4", [
{
  id: "c4s1", no: "4.1", title: "if 条件必须是货真价实的 bool",
  html: `
  <p>主章说过,这里看真实报错长相。数字不能冒充条件:</p>
  <pre><code class="lang-rust">let x = 5;
if x { }    // ❌ error[E0308]: mismatched types
            //    expected 'bool', found integer
if x > 0 { } // ✅ 明确写出判断</code></pre>
  <p>这条规矩消灭了无数"误把 0 当 false"的祖传 bug。</p>
  <div class="exslot" data-ex="c4s1-1"></div>`,
  exercises: [
    { id: "c4s1-1", kind: "fix", runDemo: { match: /^if\s/, before: "let x = 5;"  }, xp: 10, title: "数字冒充 bool 被抓",
      task: '编译器把条件拦下了:数字不是 bool。保留 x 的声明，改好 if 条件，x 大于 0 时打印「正数」。',
      given: "let x = 5;\nif x {\n    println!(\"正数\");\n}",
      errText: "error[E0308]: mismatched types\nexpected 'bool', found integer",
      scaffold: "let x = 5;\nif x {\n    println!(\"正数\");\n}",
      checks: [
        { label: "条件改成了真正的比较", hint: "if x > 0 { ——写明确的判断,别让数字裸奔。", test: (s) => /if\s+x\s*>\s*0\s*\{/.test(s) },
        { label: "不再有裸数字条件", hint: "if x { 这种写法整行删掉。", test: (s) => !/if\s+x\s*\{/.test(s) },
      ],
      ref: "let x = 5;\nif x > 0 {\n    println!(\"正数\");\n}",
      refNote: "x > 0 的结果是 bool(true/false),if 只吃 bool。想表示“非零”就写 x != 0,想表示“有值”就写 !list.is_empty()——每一步都写得清清楚楚。",
    },
  ],
},
{
  id: "c4s2", no: "4.2", title: "if 是表达式:两个分支必须同型",
  html: `
  <pre><code class="lang-rust">let n = 5;
let r = if n % 2 == 0 { "偶数" } else { "奇数" };
println!("{}", r);   // 奇数</code></pre>
  <p>if 表达式的规矩:两个分支产出的必须是<b>同一类型</b>(要装进同一个盒子,类型必须兼容)。一个分支给 &str 另一个给数字,当场报错 E0308。</p>
  <div class="exslot" data-ex="c4s2-1"></div>`,
  exercises: [
    { id: "c4s2-1", kind: "predict", xp: 10, title: "同型分支",
      task: `9 是奇是偶,r 拿到什么?`,
      given: "let n = 9;\nlet r = if n % 2 == 0 { \"偶数\" } else { \"奇数\" };\nprintln!(\"{}\", r);",
      expected: "奇数",
      ref: "let n = 9;\nlet r = if n % 2 == 0 { \"偶数\" } else { \"奇数\" };\nprintln!(\"{}\", r);   // 奇数(9 % 2 = 1,非零)",
      refNote: "两个分支都产出 &str,装进 r 没毛病。这是 Rust 的三岔路口赋值写法——后面 match 表达式把这套思路放大成了一门分拣艺术。",
    },
  ],
},
{
  id: "c4s3", no: "4.3", title: "loop + break 带值:循环的结果也能交货",
  html: `
  <p>break 可以捎一个值出去:</p>
  <pre><code class="lang-rust">let mut n = 0;
let result = loop {
    n += 1;
    if n == 5 {
        break n * 2;    // 循环交货:10
    }
};
println!("{}", result);   // 10</code></pre>
  <p>"试到成功为止"的写法天然合适:循环里不断尝试,成了就 break 把结果带出去。</p>
  <div class="exslot" data-ex="c4s3-1"></div>`,
  exercises: [
    { id: "c4s3-1", kind: "predict", xp: 10, title: "循环的战利品",
      task: `break 捎出去了什么?打印什么?`,
      given: "let mut n = 0;\nlet result = loop {\n    n += 1;\n    if n == 5 {\n        break n * 2;\n    }\n};\nprintln!(\"{}\", result);",
      expected: "10",
      ref: "…\n        break n * 2;   // n=5 时,捎 10 出去\n…\nprintln!(\"{}\", result);   // 10",
      refNote: "break 带值让 loop 也能当\"计算器\"用。真实场景:不断重试网络请求,成了 break response;次数用尽 break 错误——整个重试逻辑就是一个带值 loop。",
    },
  ],
},
{
  id: "c4s4", no: "4.4", title: "循环标签:break 精准逃生到哪一层",
  html: `
  <p>双层循环里,裸 break 只逃一层;想<b>直接冲出外层</b>,给循环起个名字(标签以 ' 开头):</p>
  <pre><code class="lang-rust">'outer: for i in 0..3 {
    for j in 0..3 {
        if i == 1 && j == 1 {
            break 'outer;    // 直接逃出两层!
        }
        print!("{}{} ", i, j);
    }
}
// 打印:00 01 02 10   ←(1,1) 直接终止,i=2 没机会跑</code></pre>
  <div class="exslot" data-ex="c4s4-1"></div>`,
  exercises: [
    { id: "c4s4-1", kind: "predict", xp: 10, title: "标签逃生",
      task: `(1,1) 触发 break 'outer,数一数共打印了几组?`,
      given: "'outer: for i in 0..3 {\n    for j in 0..3 {\n        if i == 1 && j == 1 {\n            break 'outer;\n        }\n        print!(\"{}{} \", i, j);\n    }\n}",
      expected: "00 01 02 10",
      ref: "// i=0:内层 j=0,1,2 各打印一次(00 01 02)\n// i=1:打印 10 后,(1,1) 触发 break 'outer\n// i=2:永远没机会 ——直接逃出整个 'outer\n// 输出:00 01 02 10",
      refNote: "共四组。break 'outer 的射程穿过两层;裸 break 只能逃出内层,j=2 还会继续跑。写嵌套循环时标签就是你的消防通道。",
    },
  ],
},
{
  id: "c4s5", no: "4.5", title: "while 的条件也是每圈重查",
  html: `
  <pre><code class="lang-rust">let mut fuel = 3;
while fuel > 0 {
    println!(\"燃料还剩 {} 格\", fuel);\n    fuel -= 1;
}
println!(\"降落\");</code></pre>
  <p>细节:while 每圈开始前重新检查条件;条件一旦为 false,一圈都不进。燃料为 0 开局,循环体一行都不执行。</p>
  <div class="exslot" data-ex="c4s5-1"></div>`,
  exercises: [
    { id: "c4s5-1", kind: "predict", xp: 10, title: "倒数点火",
      task: `燃料从 3 格烧到 0,每步打印什么?最后一行是什么?`,
      given: "let mut fuel = 3;\nwhile fuel > 0 {\n    println!(\"{}\", fuel);\n    fuel -= 1;\n}\nprintln!(\"发射\");",
      expected: "3\n2\n1\n发射",
      ref: "// fuel=3 → 打印 3,fuel=2\n// fuel=2 → 打印 2,fuel=1\n// fuel=1 → 打印 1,fuel=0\n// fuel=0:条件不成立,跳出\nprintln!(\"发射\");",
      refNote: "打印 3、2、1,然后发射。while 每圈重查条件——和 Python 的 while 一个心思,只是没括号没冒号。",
    },
  ],
},
{
  id: "c4s6", no: "4.6", title: "range 的进阶:rev、倒着走",
  html: `
  <p>range 能倒着跑,还能掐头去尾:</p>
  <pre><code class="lang-rust">for i in (1..4).rev() {    // rev():倒序 3, 2, 1
    print!("{} ", i);
}
// 输出:3 2 1

for i in 0..=10.step_by(5) {  // 进阶:步长,0, 5, 10
    print!("{} ", i);
}</code></pre>
  <div class="exslot" data-ex="c4s6-1"></div>`,
  exercises: [
    { id: "c4s6-1", kind: "predict", xp: 10, title: "倒计时",
      task: `(1..4) 倒过来数,打印什么?`,
      given: "for i in (1..4).rev() {\n    print!(\"{} \", i);\n}",
      expected: "3 2 1",
      ref: "for i in (1..4).rev() {   // 1..4 = 1,2,3;rev 倒着走\n    print!(\"{} \", i);\n}\n// 输出:3 2 1",
      refNote: "rev() 是迭代器方法——这里第一次见到\"迭代器适配器\"的影子,第 13 章会把它发扬光大。倒计时、倒序遍历,一招鲜。",
    },
  ],
},
{
  id: "c4f", no: "4.7", title: "🎯 本章实战(2 题)",
  html: `<p>控制流全火力操练。</p>
  <div class="exslot" data-ex="c4f-1"></div>
  <div class="exslot" data-ex="c4f-2"></div>`,
  exercises: [
    { id: "c4f-1", kind: "big", xp: 15, title: "实战① 猜数字雏形(硬编码版)",
      task: '猜数字游戏的骨架:①<code class="ic">let secret = 7</code>;②可变 <code class="ic">let guesses</code> 计数;③<code class="ic">loop</code> 里硬编码三次猜测 [3, 10, 7]:if 小了打"小了",else if 大了打"大了",否则 break 并打印猜中(带值 break:<code class="ic">break guesses</code>);④循环交货后打印总次数(应得 <b>3</b>)。',
      scaffold: "fn main() {\n    let secret = 7;\n    let guesses = [3, 10, 7];\n    // loop + 下标或迭代:三次猜测,中了 break 带值\n\n}",
      checks: [
        { label: "用了 loop", hint: "let count = loop { … };", test: (s) => /\bloop\b/.test(s) },
        { label: "三种判断齐全(小了/大了/猜中)", hint: "if guess < secret / else if guess > secret / else { break … }", test: (s) => /<\s*&?\s*secret/.test(s) && />\s*&?\s*secret/.test(s) && /break/.test(s) },
        { label: "break 带了值出去", hint: "break count; 或 break i + 1; ——循环也能交货。", test: (s) => /break\s+[^;{]+;/.test(s) },
        { label: "循环结果被接住并打印", hint: "let result = loop { … };println!(\"{}\", result); → 3", test: (s) => /=\s*(?:'\w+:\s*)?loop/.test(s) && /println!/.test(s) },
      ],
      ref: "fn main() {\n    let secret = 7;\n    let guesses = [3, 10, 7];\n\n    let result = 'game: loop {\n        for (i, guess) in guesses.iter().enumerate() {\n            if guess < &secret {\n                println!(\"第{}猜 {}:小了\", i + 1, guess);\n            } else if guess > &secret {\n                println!(\"第{}猜 {}:大了\", i + 1, guess);\n            } else {\n                println!(\"第{}猜 {}:猜中!\", i + 1, guess);\n                break 'game i + 1;\n            }\n        }\n    };\n\n    println!(\"用了 {} 猜\", result);\n}",
      refNote: "loop + break 带值 + 三路判断——这就是第 4 章的全部武器。真实猜数字把硬编码换成用户输入(第 6 章学会),这道骨架就能活起来。",
    },
    { id: "c4f-2", kind: "big", xp: 15, title: "实战② 标签突围",
      task: `写完整小程序:双层循环找第一个乘积超过 50 的组合:i 从 1..10、j 从 1..10,一旦 <code class="ic">i * j > 50</code> 就 <code class="ic">break 'outer</code> 直接全退;标签循环外加打印"找到: i×j"(应在 <b>6×9=54</b> 处突围)。`,
      scaffold: "fn main() {\n    // 'outer 标签双层循环,找到就全退\n\n    // 退出来后打印找到的组合\n}",
      checks: [
        { label: "给外层循环起了标签", hint: "'outer: for i in 1..10 { … }", test: (s) => /'\w+\s*:\s*for/.test(s) },
        { label: "判断乘积超过 50", hint: "if i * j > 50 { … }", test: (s) => /i\s*\*\s*j\s*>\s*50/.test(s) },
        { label: "break 精准逃到标签层", hint: "break 'outer; ——穿过两层。", test: (s) => /break\s+'\w+/.test(s) },
        { label: "突围后打印了组合", hint: "println!(\"{} × {}\", i, j); ——在标签循环外面(所以需要先把 i,j 提到外层声明)。", test: (s) => /println!/.test(s) },
      ],
      ref: "fn main() {\n    let mut found = (0, 0);\n\n    'outer: for i in 1..10 {\n        for j in 1..10 {\n            if i * j > 50 {\n                found = (i, j);\n                break 'outer;\n            }\n        }\n    }\n\n    println!(\"找到:{} × {} = {}\", found.0, found.1, found.0 * found.1);\n}",
      refNote: "6×9=54 是第一个超 50 的组合(i=6 先于 j 到 9?注意 i=6,j=9 是 i 从小到大先行的第一个答案)。突围后想在外层用 i、j——它们的作用域已随循环结束,所以先存进外部变量。作用域边界,处处是细节。",
    },
  ],
},
]);

/* ════════ 第 5 章 · 所有权(7 小节 + 2 实战) ════════ */
R.registerSections("ch5", [
{
  id: "c5s1", no: "5.1", title: "作用域结束 = 变量人间蒸发",
  html: `
  <p>出了大括号,名字就不存在了——不是"值还在只是看不见",是<b>连名字都被注销</b>:</p>
  <pre><code class="lang-rust">{
    let s = String::from("hi");
}        // ← s 在这里被注销
println!("{s}");    // ❌ error[E0425]: cannot find value 's' in this scope</code></pre>
  <div class="exslot" data-ex="c5s1-1"></div>`,
  exercises: [
    { id: "c5s1-1", kind: "fix", xp: 10, title: "名字被注销了",
      task: `s 活在大括号里,出来就被注销。把修好的代码打出来(让打印能看到 s)。`,
      given: "{\n    let s = String::from(\"hi\");\n}\nprintln!(\"{}\", s);",
      errText: "error[E0425]: cannot find value 's' in this scope",
      scaffold: "{\n    let s = String::from(\"hi\");\n}\nprintln!(\"{}\", s);",
      checks: [
        { label: "打印挪进了 s 的作用域", hint: "println! 搬进大括号里,趁 s 还活着。", test: (s) => /\{[\s\S]*println![\s\S]*String::from[\s\S]*println![\s\S]*\}/.test(s) || /String::from[\s\S]*println![\s\S]*\}/.test(s) },
        { label: "没有在作用域外引用 s", hint: "大括号外不能有 println!(…s)。", test: (s) => !/\}\s*\n\s*println![\s\S]*s\b/.test(s) },
      ],
      ref: "{\n    let s = String::from(\"hi\");\n    println!(\"{}\", s);   // 趁 s 还活着用\n}",
      refNote: "两种修法:打印挪进去,或把 let 提出来。作用域是所有权的\"围墙\"——第 5 章的一切规则,都在这道墙上展开。",
    },
  ],
},
{
  id: "c5s2", no: "5.2", title: "函数参数也 move:交出去就是别人的",
  html: `
  <p>主章讲赋值过户,细节:传给函数同样过户:</p>
  <pre><code class="lang-rust">fn eat(s: String) {        // s 的所有权搬进函数
    println!("吃掉 {}", s);
}                          // 函数结束,s 在这里销毁

let mine = String::from("蟹堡");
eat(mine);                 // 过户!mine 作废
println!("{}", mine);      // ❌ E0382: value borrowed after move</code></pre>
  <div class="exslot" data-ex="c5s2-1"></div>`,
  exercises: [
    { id: "c5s2-1", kind: "fix", xp: 10, title: "被函数吃掉的变量",
      task: `eat 把 mine 过户吞了,后面还想用。两种修法任选:①传副本 <code class="ic">eat(mine.clone())</code>;②改传引用 <code class="ic">fn eat(s: &String)</code>。把修好的完整代码打出来。`,
      given: "fn eat(s: String) {\n    println!(\"{}\", s);\n}\n\nlet mine = String::from(\"蟹堡\");\neat(mine);\nprintln!(\"{}\", mine);",
      errText: "error[E0382]: borrow of moved value: 'mine'",
      scaffold: "fn eat(s: String) {\n    println!(\"{}\", s);\n}\n\nlet mine = String::from(\"蟹堡\");\neat(mine);\nprintln!(\"{}\", mine);",
      checks: [
        { label: "过户问题解除(clone 或引用)", hint: "修法一:eat(mine.clone());修法二:fn eat(s: &String) + eat(&mine)。", test: (s) => /\.clone\s*\(/.test(s) || /&\s*String/.test(s) },
        { label: "mine 在调用后依然能用", hint: "println! 里保留 mine,修法保证它没被过户。", test: (s) => /println![\s\S]*mine/.test(s) },
      ],
      ref: "// 修法一:复制一份交出去\nfn eat(s: String) {\n    println!(\"{}\", s);\n}\nlet mine = String::from(\"蟹堡\");\neat(mine.clone());\nprintln!(\"{}\", mine);",
      refNote: "过户的不只是赋值——函数参数、返回值、模式匹配,所有权流动无处不在。也可以改为 <code>fn eat(s: &amp;String)</code>，再调用 <code>eat(&amp;mine)</code>，让函数借用字符串,只在真需要接管时才传值。",
    },
  ],
},
{
  id: "c5s3", no: "5.3", title: "Copy 白名单:哪些类型天生豁免",
  html: `
  <p>整数、浮点、bool、char、定长数组、以及"只含这些"的 tuple——赋值时<b>自动复制</b>,旧变量健在:</p>
  <pre><code class="lang-rust">let x = 5;
let y = x;          // 复制!x、y 各过各的
println!("{} {}", x, y);   // 5 5 ✅</code></pre>
  <p>判定标准:能<b>在栈上完整拷贝</b>的类型才配 Copy。String 这种"栈上是门牌,真身住堆上"的,复制成本不可控,必须走所有权或借用。</p>
  <div class="exslot" data-ex="c5s3-1"></div>`,
  exercises: [
    { id: "c5s3-1", kind: "predict", xp: 10, title: "豁免家族",
      task: `x 被赋值给 y 后还能用吗?打印什么?`,
      given: "let x = 10;\nlet y = x;\nprintln!(\"{} {}\", x, y);",
      expected: "10 10",
      ref: "let x = 10;\nlet y = x;            // i32 是 Copy 类型:复制,不过户\nprintln!(\"{} {}\", x, y);   // 10 10 ✅",
      refNote: "x 健在!第 5 章的过户规则只管\"大件\"(String/Vec…)。小件(数字/bool/char)编译器直接送你一份,不折腾。",
    },
  ],
},
{
  id: "c5s4", no: "5.4", title: "借用 &:只看,不动所有权",
  html: `
  <pre><code class="lang-rust">fn peek(s: &String) {       // s 是"视角",不是主人
    println!("我只看看:{}", s);
}

let mine = String::from("蟹堡");
peek(&mine);    // &mine:把视角借给函数(所有权还在我手里)
peek(&mine);    // 借多少次都行!视角可以人手一份
println!("{}", mine);   // ✅ mine 全程健在</code></pre>
  <p>引用的日常:<b>函数参数默认想清楚"我要不要接管"——只是看看?加 &。</b></p>
  <div class="exslot" data-ex="c5s4-1"></div>`,
  exercises: [
    { id: "c5s4-1", kind: "blank", runDemo: { after: "print_len(&String::from(\"Rust\"));" }, xp: 10, title: "把参数改成借用",
      task: `只打印不修改的函数,签名里的类型空着——按借用写,填出参数括号里那一格。`,
      given: "fn print_len(____) {\n    println!(\"len = {}\", s.len());\n}",
      placeholder: "s: ?String",
      checks: [
        { label: "用了 &String", hint: "s: &String ——加 & 号,只借视角。", test: (s) => /s\s*:\s*&String/.test(s) },
      ],
      ref: "s: &String",
      refNote: "&String 读作\"String 的视角\"。只读函数用 & 是 Rust 的日常礼节——语义清晰,调用方放心。",
    },
  ],
},
{
  id: "c5s5", no: "5.5", title: "&mut 的独行规则:一个可变 XOR 多个只读",
  html: `
  <p>可变引用有条铁律:<b>同一时刻,要么一个 &mut,要么任意多个 &——不能同时存在</b>:</p>
  <pre><code class="lang-rust">let mut v = vec![1, 2, 3];
let r1 = &mut v;    // r1:唯一的写入权
r1.push(4);
// let r2 = &mut v; // ❌ E0499:第二个 &mut 被 r1 挡住!
r1.push(5);
println!("{:?}", v);   // [1, 2, 3, 4, 5]</code></pre>
  <p>这条规则在编译期消灭了<b>数据竞争</b>——两个地方同时改一份数据的祖传 bug,在 Rust 里根本活不到编译通过。</p>
  <div class="exslot" data-ex="c5s5-1"></div>`,
  exercises: [
    { id: "c5s5-1", kind: "fix", xp: 10, title: "两个 &mut 打架了",
      task: `r1 还在用,r2 就抢 &mut,编译器拦下。修法:等 r1 用完(不再出现)再让 r2 上场——顺序借用。把修好的完整代码打出来(两次 push 都保留)。`,
      given: "let mut v = vec![1, 2, 3];\nlet r1 = &mut v;\nlet r2 = &mut v;   // ❌ r1 还在,r2 不能上\nr1.push(4);\nr2.push(5);\nprintln!(\"{:?}\", v);",
      errText: "error[E0499]: cannot borrow 'v' as mutable more than once at a time",
      scaffold: "let mut v = vec![1, 2, 3];\nlet r1 = &mut v;\nlet r2 = &mut v;\nr1.push(4);\nr2.push(5);\nprintln!(\"{:?}\", v);",
      checks: [
        { label: "r2 的借用挪到 r1 用完之后", hint: "先 r1.push(4); 再 let r2 = &mut v; r2.push(5); ——顺序借,不重叠。", test: (s) => /r1\.push[\s\S]*let\s+r2/.test(s) },
        { label: "两次 push 都活着", hint: "r1.push(4) 和 r2.push(5) 都保留。", test: (s) => /r1\.push/.test(s) && /r2\.push/.test(s) },
      ],
      ref: "let mut v = vec![1, 2, 3];\n\nlet r1 = &mut v;\nr1.push(4);        // r1 的活干完,权限自动释放\n\nlet r2 = &mut v;\nr2.push(5);\nprintln!(\"{:?}\", v);   // [1, 2, 3, 4, 5]",
      refNote: "借用权在“最后一次使用”后自动释放(NLL 规则)——所以错开时间,两个 &mut 先后上岗完全合法。同时写入会被拒,先后写入畅通无阻。",
    },
  ],
},
{
  id: "c5s6", no: "5.6", title: "NLL:借用比想象中更早“下班”",
  html: `
  <p>借用的有效期到<b>最后一次使用</b>为止,不是到作用域结束——这叫 NLL(Non-Lexical Lifetimes)。看这段<b>能编译</b>的代码:</p>
  <pre><code class="lang-rust">let mut v = vec![1, 2, 3];
let r = &v;             // r 借入(只读视角)
println!("{:?}", r);    // r 的最后一次使用
v.push(4);              // ✅ r 已经"下班",v 拿回修改权!
println!("{:?}", v);     // [1, 2, 3, 4]</code></pre>
  <p>2018 年前这会报错;NLL 规则让借用"用了就还",大幅减少无谓的编译冲突。</p>
  <div class="exslot" data-ex="c5s6-1"></div>`,
  exercises: [
    { id: "c5s6-1", kind: "predict", xp: 10, title: "r 下班了吗?",
      task: `r 在 println 之后没再出现,v 能 push 吗?打印什么?`,
      given: "let mut v = vec![1, 2, 3];\nlet r = &v;\nprintln!(\"{:?}\", r);\nv.push(4);\nprintln!(\"{:?}\", v);",
      expected: "[1, 2, 3]\n[1, 2, 3, 4]",
      ref: "let r = &v;\nprintln!(\"{:?}\", r);   // r 唯一一次使用,之后下班\nv.push(4);              // ✅ r 已释放,v 拿回可变权\nprintln!(\"{:?}\", v);     // [1, 2, 3, 4]",
      refNote: "两行输出:[1, 2, 3] 和 [1, 2, 3, 4]。NLL 的功劳——r 在它最后被使用的那一行“下班”,而不是活到大括号结束。借用比想象中更讲道理。",
    },
  ],
},
{
  id: "c5s7", no: "5.7", title: "悬垂引用:想都别想",
  html: `
  <p>返回"指向已销毁数据"的引用 = 悬垂引用,C 语言祖传噩梦。Rust 编译期掐死:</p>
  <pre><code class="lang-rust">fn dangle() -> &String {        // 想返回一个视角……
    let s = String::from("hi");
    &s       // ❌ E0515:函数一结束 s 就销毁,视角指向空气!
}</code></pre>
  <p>修法干脆:别借了,<b>把所有权交出来</b>(直接返回 String)。</p>
  <div class="exslot" data-ex="c5s7-1"></div>`,
  exercises: [
    { id: "c5s7-1", kind: "fix", runDemo: { after: "println!(\"{}\", dangle());" }, xp: 10, title: "消灭悬垂",
      task: `返回值指向即将销毁的局部变量。修法:直接交所有权。把修好的函数签名加函数体打出来。`,
      given: "fn dangle() -> &String {\n    let s = String::from(\"hi\");\n    &s\n}",
      errText: "error[E0515]: cannot return reference to local variable 's'",
      scaffold: "fn dangle() -> &String {\n    let s = String::from(\"hi\");\n    &s\n}",
      checks: [
        { label: "返回类型改成了 String", hint: "fn dangle() -> String ——直接交所有权,不借。", test: (s) => /fn\s+dangle\s*\(\s*\)\s*->\s*String/.test(s) },
        { label: "返回的是值不是引用", hint: "return s; 或末尾裸 s ——不带 &。", test: (s) => !/&\s*\w+\s*$/.test(s.trim()) },
      ],
      ref: "fn dangle() -> String {\n    let s = String::from(\"hi\");\n    s    // 值直接交出去,内存跟着走\n}",
      refNote: "直接交 String:堆上的房子所有权跟着函数走了,调用方接住后继续住。借用不能指向“快死的东西”——编译器全程把守,悬垂引用在 Rust 是传说。",
    },
  ],
},
{
  id: "c5f", no: "5.8", title: "🎯 本章实战(2 题)",
  html: `<p>所有权功夫大乱斗。</p>
  <div class="exslot" data-ex="c5f-1"></div>
  <div class="exslot" data-ex="c5f-2"></div>`,
  exercises: [
    { id: "c5f-1", kind: "big", xp: 15, title: "实战① 所有权流水线",
      task: '写完整小程序:①<code class="ic">fn make() -> String</code> 造字符串返回(返回 <code class="ic">String::from("蟹堡")</code>);②<code class="ic">fn shout(s: &String) -> String</code> 借用参数,返回 <code class="ic">format!("{}!!!", s)</code>;③main 里 let 拿 make 的货、调 shout(&货) 打印(应得 <code>蟹堡!!!</code>)、再打印原字符串证明它健在(应得 <code>蟹堡</code>)。',
      scaffold: "fn make() -> String {\n    // 造货交所有权\n}\n\nfn shout(s: &String) -> String {\n    // 只借不占,format! 返回新串\n}\n\nfn main() {\n    // 拿货 → 喟 → 打印两次\n}",
      checks: [
        { label: "make 交出所有权(-> String)", hint: "fn make() -> String { String::from(\"蟹堡\") }", test: (s) => /fn\s+make\s*\(\s*\)\s*->\s*String/.test(s) },
        { label: "shout 借用参数(&String)", hint: "fn shout(s: &String) -> String", test: (s) => /fn\s+shout\s*\(\s*s\s*:\s*&String\s*\)/.test(s) },
        { label: "用了 format! 造新串", hint: "format!(\"{}!!!\", s) ——format! 不动任何人。", test: (s) => /format!\s*\(/.test(s) },
        { label: "main 打印了两次(新串 + 原串)", hint: "shout 结果打印,原字符串也打印(证明没被吃)。", test: (s) => (s.match(/println!/g) || []).length >= 2 },
      ],
      ref: "fn make() -> String {\n    String::from(\"蟹堡\")\n}\n\nfn shout(s: &String) -> String {\n    format!(\"{}!!!\", s)\n}\n\nfn main() {\n    let burger = make();          // 接住所有权\n    let loud = shout(&burger);    // 只借\n    println!(\"{}\", loud);         // 蟹堡!!!\n    println!(\"{}\", burger);       // 蟹堡 ——健在!\n}",
      refNote: "三个函数、三种数据流:造货交权 → 借看不动手 → format! 造新串。所有权三板斧排成一条生产线,打印证明原串毫发无损。",
    },
    { id: "c5f-2", kind: "big", xp: 15, title: "实战② 借用检查通关",
      task: '写完整小程序:①可变 Vec 装 [1,2,3];②函数 <code class="ic">fn double_all(v: &mut Vec&lt;i32&gt;)</code>:借用并原地翻倍(遍历 <code class="ic">for x in v.iter_mut()</code> 里面 <code class="ic">*x *= 2</code>);③main:调用前先打印一遍,调用后再打印(应得 <code>[1, 2, 3]</code> 和 <code>[2, 4, 6]</code>)。',
      scaffold: "fn double_all(v: &mut Vec<i32>) {\n    // 遍历可变借用,逐个翻倍\n}\n\nfn main() {\n    let mut v = vec![1, 2, 3];\n    // 打印 → 调用 → 再打印\n}",
      checks: [
        { label: "签名是 &mut Vec<i32>", hint: "fn double_all(v: &mut Vec<i32>) ——要改真身,必须可变借用。", test: (s) => /fn\s+double_all\s*\(\s*v\s*:\s*&mut\s+Vec\s*<\s*i32\s*>\s*\)/.test(s) },
        { label: "用了 iter_mut 遍历", hint: "for x in v.iter_mut() { *x *= 2; } ——星号解开引用改真值。", test: (s) => /iter_mut\s*\(\s*\)/.test(s) && /\*\w+\s*\*=\s*2/.test(s) },
        { label: "main 打印了前后两次", hint: "调用前 println!(\"{:?}\", v); 调用后再打。", test: (s) => (s.match(/println!/g) || []).length >= 2 },
      ],
      ref: "fn double_all(v: &mut Vec<i32>) {\n    for x in v.iter_mut() {\n        *x *= 2;\n    }\n}\n\nfn main() {\n    let mut v = vec![1, 2, 3];\n    println!(\"{:?}\", v);    // [1, 2, 3]\n    double_all(&mut v);       // 可变借用:把真身交给函数改\n    println!(\"{:?}\", v);    // [2, 4, 6]\n}",
      refNote: "&mut + iter_mut + *x ——可变借用的三件套。函数改真身、调用方看得见:同一个 Vec,原地翻倍。这是 Rust\"想改,先说清\"哲学的完全体。",
    },
  ],
},
]);

})();
