/* ═══════════════════════════ 锈岛求生 3.0 · 第一卷细节小节(ch6~ch8) ═══════════════════════════ */
(() => {
"use strict";
const R = window.RUST_ISLAND;

/* ════════ 第 6 章 · 字符串(6 小节 + 2 实战) ════════ */
R.registerSections("ch6", [
{
  id: "c6s1", no: "6.1", title: "String ↔ &str 的互转姿势",
  html: `
  <p>两种字符串的换装三式:</p>
  <pre><code class="lang-rust">let s1 = "字面量".to_string();       // &str → String:要房子,就盖一个
let s2 = String::from("再盖一个");    // 同上,写法二

let owned = String::from("我有房子");
let view: &str = &owned;              // String → &str:拿视角(& 自动降级)
let view2: &str = owned.as_str();    // 同上,显式写法</code></pre>
  <p>方向性记住:<b>&str → String 随时可转(要付一次拷贝);String → &str 用 & 或 as_str(零成本)</b>。所以函数参数收 &str 最通用——两种调用方都能喂。</p>
  <div class="exslot" data-ex="c6s1-1"></div>`,
  exercises: [
    { id: "c6s1-1", kind: "blank", runDemo: { after: "println!(\"{owned}\");" }, xp: 10, title: "字面量上户口",
      task: '把字面量 "锈" 变成有房子的 String(用 to_string 那式),空格补上。',
      given: "let owned: String = ____;",
      placeholder: "\"锈\".???",
      checks: [
        { label: "用了 .to_string()", hint: "\"锈\".to_string() ——点 to_string,盖房入户。", test: (s) => /\.to_string\s*\(\s*\)/.test(s) },
      ],
      ref: "\"锈\".to_string()",
      refNote: "to_string() 是 &str 的标配方法,任何字面量都能随叫随盖。反过来 String → &str 用 &owned 就行,零成本。",
    },
  ],
},
{
  id: "c6s2", no: "6.2", title: "拼接的坑:+ 会吃掉左边!",
  html: `
  <p>三式拼接,<code class="ic">+</code> 的脾气最怪:</p>
  <pre><code class="lang-rust">let mut s = String::from("rust");
s.push_str(" is");           // ✅ 追加,所有权不动
let full = s + " fun";       // ⚠️ + 把 s 过户给了 full!
// println!("{}", s);        // ❌ s 已经作废

let g = format!("{}-{}", "a", "b");   // ✅ 谁都不吃,永远安全</code></pre>
  <p><b>format! 是拼接的安全牌</b>——不动任何一方所有权,只是读一眼、拼新的。</p>
  <div class="exslot" data-ex="c6s2-1"></div>`,
  exercises: [
    { id: "c6s2-1", kind: "predict", xp: 10, title: "+ 的过户",
      task: `s 被 + 过户给 full,full 打印什么?`,
      given: "let s = String::from(\"rust\");\nlet full = s + \" is fun\";\nprintln!(\"{}\", full);",
      expected: "rust is fun",
      ref: "let s = String::from(\"rust\");\nlet full = s + \" is fun\";   // s 过户给 full\nprintln!(\"{}\", full);      // rust is fun(s 作废,full 接班)",
      refNote: "full 印着 rust is fun。想保住 s?用 format!(\"{}{}\", s, \" is fun\") 谁都不吃。+ 过户是因为它要复用左边的堆内存,吃一记长一智。",
    },
  ],
},
{
  id: "c6s3", no: "6.3", title: "为什么不能 s[0]:字节的世界",
  html: `
  <p>字符串按 UTF-8 字节存储,一个"汉字"占 3 字节——s[0] 给你的是什么?第 0 个<b>字节</b>,不是第一个字!Rust 干脆禁止数字下标:</p>
  <pre><code class="lang-rust">let s = "你好";
// let c = s[0];    // ❌ 编译错误!String 不支持数字下标

let slice = &s[0..3];   // 切片:按字节切 ——恰好切出"你"
println!("{}", slice);   // 你</code></pre>
  <p>细节危险区:切割不落在字符边界上,运行时 panic(<code class="ic">&s[0..2]</code> 切半个字,当场炸)。按字节切要格外小心中文。</p>
  <div class="exslot" data-ex="c6s3-1"></div>`,
  exercises: [
    { id: "c6s3-1", kind: "predict", xp: 10, title: "切出第一个字",
      task: `"你好" 按 0..3 字节切,切出什么?`,
      given: "let s = \"你好\";\nprintln!(\"{}\", &s[0..3]);",
      expected: "你",
      ref: "let s = \"你好\";         // 6 个字节:你=3,好=3\nprintln!(\"{}\", &s[0..3]);   // 你 ——前 3 个字节,恰好是完整的\"你\"",
      refNote: "0..3 恰好是\"你\"的三个字节。换成 0..2?切半个字,运行时 panic:byte index 2 is not a char boundary。下标的世界按字节走,人心按字符走——这个鸿沟,下一节的 chars() 来填。",
    },
  ],
},
{
  id: "c6s4", no: "6.4", title: "chars() 与 bytes():两种遍历视角",
  html: `
  <pre><code class="lang-rust">let s = "你好go";

for c in s.chars() {    // 人类视角:字符
    print!("{} ", c);  // 你 好 g o
}
for b in s.bytes() {    // 机器视角:字节
    print!("{} ", b);   // 228 189 160 229 165 189 103 111
}</code></pre>
  <p>处理文字内容用 <code class="ic">chars()</code>(汉字是 1 个);数存储用 <code class="ic">bytes()</code>(汉字是 3 个)。主章的 <code class="ic">len()</code> 数的是字节——和 bytes() 一个视角。</p>
  <div class="exslot" data-ex="c6s4-1"></div>`,
  exercises: [
    { id: "c6s4-1", kind: "predict", xp: 10, title: "两种数法",
      task: `"你好go":chars 数几个、bytes 数几个?打印两个数。`,
      given: "let s = \"你好go\";\nprintln!(\"{} {}\", s.chars().count(), s.bytes().count());",
      expected: "4 8",
      ref: "let s = \"你好go\";\nprintln!(\"{} {}\", s.chars().count(), s.bytes().count());\n// chars:你 好 g o → 4\n// bytes:3+3+1+1 → 8",
      refNote: "4 个字符、8 个字节——两个世界两套账。写\"字数统计\"类功能时,用 chars() 才符合人的预期;len() 是给机器的。",
    },
  ],
},
{
  id: "c6s5", no: "6.5", title: "字符串的常用内功:trim、split",
  html: `
  <p>日常处理三招,全部<b>返回新数据、不动原串</b>:</p>
  <pre><code class="lang-rust">let raw = "  hello world  ";
println!("{}", raw.trim());           // "hello world":剃掉首尾空白

let csv = "a,b,c";
for part in csv.split(',') {           // 切片迭代器
    print!("[{}] ", part);             // [a] [b] [c]
}

println!("{}", "a-b-c".replace('-', "+"));   // a+b+c</code></pre>
  <div class="exslot" data-ex="c6s5-1"></div>`,
  exercises: [
    { id: "c6s5-1", kind: "predict", xp: 10, title: "剃须刀 trim",
      task: `trim 剃掉首尾空白,打印什么?(注意两侧空格没了)`,
      given: "let raw = \"  hi  \";\nprintln!(\"[{}]\", raw.trim());",
      expected: "[hi]",
      ref: "let raw = \"  hi  \";\nprintln!(\"[{}]\", raw.trim());   // [hi] ——两侧空白剃净",
      refNote: "trim 只剃首尾,中间的空白留着。处理用户输入的标配第一招——用户输入永远带你看不见的空格。",
    },
  ],
},
{
  id: "c6s6", no: "6.6", title: "字符串比较:== 直接可用",
  html: `
  <pre><code class="lang-rust">let a = String::from("go");
let b = "go";

println!("{}", a == b);        // true!String 和 &str 直接比
println!("{}", "x" == "y");     // false</code></pre>
  <p>细节:Rust 的 == 对字符串<b>比内容不比地址</b>——两个 String 是不是同一间房无所谓,住的人一样就相等。</p>
  <div class="exslot" data-ex="c6s6-1"></div>`,
  exercises: [
    { id: "c6s6-1", kind: "predict", xp: 10, title: "比内容还是比地址",
      task: `String 和字面量比内容,打印什么?`,
      given: "let a = String::from(\"go\");\nprintln!(\"{}\", a == \"go\");",
      expected: "true",
      ref: "let a = String::from(\"go\");\nprintln!(\"{}\", a == \"go\");   // true ——比的是内容",
      refNote: "String 和 &str 跨类型 == 完全合法(编译器自动处理视角)。内容相等就是 true——不用担心 Python 里 is 和 == 的坑,Rust 的 == 就是纯内容比。",
    },
  ],
},
{
  id: "c6f", no: "6.7", title: "🎯 本章实战(2 题)",
  html: `<p>字符串内功串联实战。</p>
  <div class="exslot" data-ex="c6f-1"></div>
  <div class="exslot" data-ex="c6f-2"></div>`,
  exercises: [
    { id: "c6f-1", kind: "big", xp: 15, title: "实战① 用户输入清洗器",
      task: '模拟清洗用户输入:①原始串 <code class="ic">let raw = " 蟹老板 "</code>(注意两侧空格);②trim 剃干净存成 String;③再遮蔽一个 &str 视角(证明降级零成本);④打印清洗结果和字符数(用 chars().count(),应得 <code>蟹老板 3</code>)。',
      scaffold: "fn main() {\n    let raw = \" 蟹老板 \";\n    // ① trim 成 String\n\n    // ② 遮蔽成 &str 视角\n\n    // ③ 打印结果 + chars 计数\n}",
      checks: [
        { label: "trim 出了干净串", hint: "let clean = raw.trim().to_string();", test: (s) => /trim\s*\(\s*\)/.test(s) },
        { label: "遮蔽成 &str", hint: "let clean: &str = &clean; ——String 自动降级成视角。", test: (s) => /:\s*&str|&clean/.test(s) },
        { label: "打印清洗结果", hint: "println!(\"{}\", clean);", test: (s) => /println![\s\S]*clean/.test(s) },
        { label: "用 chars().count() 数字符", hint: "println!(\"{}\", clean.chars().count()); → 3", test: (s) => /chars\s*\(\s*\)[\s\S]*count/.test(s) },
      ],
      ref: "fn main() {\n    let raw = \" 蟹老板 \";\n    let clean = raw.trim().to_string();\n    let clean: &str = &clean;   // 视角,零成本\n    println!(\"{}\", clean);\n    println!(\"{}\", clean.chars().count());   // 3\n}",
      refNote: "trim → String → &str → chars 计数,一条完整的清洗流水线。trim 返回 &str,想拥有就 to_string;只是看看,直接用。",
    },
    { id: "c6f-2", kind: "big", xp: 15, title: "实战② 安全拼接厂",
      task: '写完整小程序:①三个碎片 <code class="ic">a="rust"</code>、<code class="ic">b=" is"</code>、<code class="ic">c=" fun"</code>(都先 to_string 成 String);②用 format! 拼成完整句子;③证明三个碎片拼接后依然健在(打印 a,应得 <code>rust</code>);④打印完整句和它的字节数(应得 <code>rust is fun 11</code>)。',
      scaffold: "fn main() {\n    // ① 三个 String\n\n    // ② format! 拼接\n\n    // ③ 打印 a 证明健在 + ④ 完整句 + 字节数\n}",
      checks: [
        { label: "三个碎片都是 String", hint: "let a = \"rust\".to_string(); ——三次。", test: (s) => (s.match(/to_string\s*\(\s*\)/g) || []).length >= 3 },
        { label: "用了 format! 拼接", hint: "let full = format!(\"{}{}{}\", a, b, c);", test: (s) => /format!\s*\(/.test(s) },
        { label: "证明了碎片健在", hint: "println!(\"{}\", a); ——format! 没吃它。", test: (s) => /println![\s\S]*\ba\b/.test(s) },
        { label: "打印了完整句和字节数", hint: "println!(\"{} {}\", full, full.len()); → rust is fun 11", test: (s) => /len\s*\(\s*\)/.test(s) },
      ],
      ref: "fn main() {\n    let a = \"rust\".to_string();\n    let b = \" is\".to_string();\n    let c = \" fun\".to_string();\n\n    let full = format!(\"{}{}{}\", a, b, c);\n    println!(\"{}\", a);        // rust ——format! 没动它\n    println!(\"{} {}\", full, full.len());   // rust is fun 11\n}",
      refNote: "format! 谁都不吃——这是它比 + 高贵的地方。字节数 11 = 4+3+4。三碎片、一次拼、全员健在:字符串拼接的安全哲学。",
    },
  ],
},
]);

/* ════════ 第 7 章 · 集合(7 小节 + 2 实战) ════════ */
R.registerSections("ch7", [
{
  id: "c7s1", no: "7.1", title: "Vec::new 与 with_capacity",
  html: `
  <pre><code class="lang-rust">let mut v = Vec::new();          // 空 Vec,类型待定
v.push(1);                        // 第一次 push:i32 落户

let mut big = Vec::with_capacity(100);   // 预留 100 格
big.push(1);                              // 不触发扩容拷贝</code></pre>
  <p>细节:Vec 满了再 push 会<b>搬家扩容</b>(找块 2 倍大的地,整队搬过去)。<code class="ic">with_capacity</code> 提前圈地——明确知道要装多少时,一步到位免搬家。</p>
  <div class="exslot" data-ex="c7s1-1"></div>`,
  exercises: [
    { id: "c7s1-1", kind: "predict", xp: 10, title: "类型落户",
      task: `空 Vec 第一次 push 后类型定了。打印什么?`,
      given: "let mut v = Vec::new();\nv.push(42);\nprintln!(\"{}\", v[0]);",
      expected: "42",
      ref: "let mut v = Vec::new();   // 类型待定\nv.push(42);              // i32 落户\nprintln!(\"{}\", v[0]);    // 42",
      refNote: "空 Vec 类型悬空(E0282 那个报错的朋友),第一次使用时锁定。明确点:let v: Vec<i32> = Vec::new(); 或 Vec::with_capacity。",
    },
  ],
},
{
  id: "c7s2", no: "7.2", title: "下标 vs get:两种越界哲学",
  html: `
  <pre><code class="lang-rust">let v = vec![1, 2, 3];
let third = v[2];         // 直接下标:越界当场 panic(硬汉风)
let maybe = v.get(9);     // get:返回 Option ——你决定怎么处理
println!("{:?}", maybe);  // None</code></pre>
  <p>选择标准:下标越界是<b>程序员的 bug</b>(下标算错了)→ 用 [i] 让它炸给你看;下标越界是<b>生活的常态</b>(用户选了不存在的第 5 页)→ 用 get 优雅处理。</p>
  <div class="exslot" data-ex="c7s2-1"></div>`,
  exercises: [
    { id: "c7s2-1", kind: "predict", xp: 10, title: "get 的温柔",
      task: `get(9) 越界了,打印什么?`,
      given: "let v = vec![1, 2, 3];\nprintln!(\"{:?}\", v.get(9));",
      expected: "None",
      ref: "let v = vec![1, 2, 3];\nprintln!(\"{:?}\", v.get(9));   // None ——不炸,给答案",
      refNote: "None!get 把\"可能没有\"变成类型系统的一部分(第 10 章 Option 的主场)。炸与不炸都是选项——Rust 把选择权给你,但必须写下来。",
    },
  ],
},
{
  id: "c7s3", no: "7.3", title: "遍历三姿势的实战归属",
  html: `
  <pre><code class="lang-rust">let mut v = vec![1, 2, 3];

for x in &v { print!("{} ", x); }        // 借用读:1 2 3
for x in &mut v { *x += 10; }            // 可变借用改:11 12 13
// for x in v { }                        // 拿走消耗!遍完 v 作废</code></pre>
  <p>默认姿势:<b>只读加 &,要改加 &mut,真要吃掉才裸拿</b>——第三个会消耗整个 Vec,慎用。</p>
  <div class="exslot" data-ex="c7s3-1"></div>`,
  exercises: [
    { id: "c7s3-1", kind: "predict", xp: 10, title: "改完全队",
      task: `&mut 遍历原地 +10,之后打印 Vec 长什么样?`,
      given: "let mut v = vec![1, 2, 3];\nfor x in &mut v {\n    *x += 10;\n}\nprintln!(\"{:?}\", v);",
      expected: "[11, 12, 13]",
      ref: "for x in &mut v {\n    *x += 10;    // 星号解开引用,改真身\n}\nprintln!(\"{:?}\", v);   // [11, 12, 13]",
      refNote: "*x 里的星号\"顺引用改真身\"。&mut 遍历是原地修改的标准姿势——整个 Vec 还在原地,只是每个元素胖了十斤。",
    },
  ],
},
{
  id: "c7s4", no: "7.4", title: "Vec 武器库:pop、insert、remove、contains",
  html: `
  <pre><code class="lang-rust">let mut v = vec![1, 2, 3];

let last = v.pop();          // 弹出末位:Some(3)(Option!)
v.insert(0, 0);              // 下标 0 插一个:[0, 1, 2]
let gone = v.remove(1);       // 删下标 1,返回删掉的值:1
println!("{:?}", v);         // [0, 2]
println!("{}", v.contains(&2));  // true ——含 2 吗</code></pre>
  <div class="exslot" data-ex="c7s4-1"></div>`,
  exercises: [
    { id: "c7s4-1", kind: "predict", xp: 10, title: "pop 的 Option",
      task: `pop 弹出末位,返回什么形态?打印什么?`,
      given: "let mut v = vec![1, 2, 3];\nprintln!(\"{:?}\", v.pop());",
      expected: "Some(3)",
      ref: "let mut v = vec![1, 2, 3];\nprintln!(\"{:?}\", v.pop());   // Some(3) ——Vec 有末位可弹",
      refNote: "Some(3) 不是 3!pop 返回 Option——空 Vec 弹出来的就是 None。跟 get 一脉相承:可能失败的操作,用类型告诉你。",
    },
  ],
},
{
  id: "c7s5", no: "7.5", title: "切片 &[T]:函数参数的标准配置",
  html: `
  <p>函数不想接管 Vec、又想读元素,参数写<b>切片 <code class="ic">&[i32]</code></b>——Vec 和数组都能自动降级喂进来:</p>
  <pre><code class="lang-rust">fn total(nums: &[i32]) -> i32 {       // 读一切数字序列
    let mut sum = 0;
    for n in nums { sum += n; }
    sum
}

let v = vec![1, 2, 3];
let arr = [4, 5];
println!("{}", total(&v));    // 6 ——Vec 自动降级
println!("{}", total(&arr));  // 9 ——数组也能喂!</code></pre>
  <div class="exslot" data-ex="c7s5-1"></div>`,
  exercises: [
    { id: "c7s5-1", kind: "blank", runDemo: { after: "println!(\"{}\", total(&[1, 2, 3]));" }, xp: 10, title: "参数写切片",
      task: `total 要能吃 Vec 也能吃数组,参数类型空着——按切片写。`,
      given: "fn total(nums: ____) -> i32 {\n    let mut sum = 0;\n    for n in nums {\n        sum += n;\n    }\n    sum\n}",
      placeholder: "&[i32]",
      checks: [
        { label: "参数是 &[i32] 切片", hint: "&[i32] ——Vec、数组、切片全都能喂。", test: (s) => /&\s*\[\s*i32\s*\]/.test(s) },
      ],
      ref: "&[i32]",
      refNote: "&[i32] 是\"数字序列的视角\"——比 &Vec<i32> 更通用(数组也能喂),比按值传更礼貌(不动所有权)。标准库的 API 几乎都这么写,照抄不亏。",
    },
  ],
},
{
  id: "c7s6", no: "7.6", title: "HashMap 的创建与查看",
  html: `
  <pre><code class="lang-rust">use std::collections::HashMap;

let mut m = HashMap::new();     // 创建
m.insert("🦀", 99);             // 放入(已存在会覆盖!)
m.insert("🐙", 85);

if let Some(score) = m.get("🦀") {   // get 返回 Option
    println!("🦀 的分数:{}", score);   // 99
}</code></pre>
  <p>细节:insert 到<b>已存在的键会直接覆盖旧值</b>;get 返回 Option(不炸);HashMap 的遍历顺序每次可能都不同。</p>
  <div class="exslot" data-ex="c7s6-1"></div>`,
  exercises: [
    { id: "c7s6-1", kind: "predict", xp: 10, title: "覆盖旧值",
      task: `同一个键 insert 两次,留下的是哪个?get 出来打印什么?`,
      given: "use std::collections::HashMap;\n\nlet mut m = HashMap::new();\nm.insert(\"a\", 1);\nm.insert(\"a\", 2);\n\nif let Some(v) = m.get(\"a\") {\n    println!(\"{}\", v);\n}",
      expected: "2",
      ref: "m.insert(\"a\", 1);\nm.insert(\"a\", 2);   // 覆盖!1 被顶掉\nif let Some(v) = m.get(\"a\") {\n    println!(\"{}\", v);   // 2\n}",
      refNote: "后到的覆盖先到——想\"没有才插入\"用 entry(下一节)。if let Some(v) 这个句式第 9 章细讲,现在先记住它是\"从 Option 里取值\"的顺手写法。",
    },
  ],
},
{
  id: "c7s7", no: "7.7", title: "entry:没有就先造,一行顶三行",
  html: `
  <pre><code class="lang-rust">let mut counts: HashMap<char, i32> = HashMap::new();
for c in "abbccc".chars() {
    *counts.entry(c).or_insert(0) += 1;   // 没键先放 0,再 +1
}
println!("{:?}", counts);   // {'b': 2, 'c': 3, 'a': 1}</code></pre>
  <p><code class="ic">entry(c)</code>:看格子 c ——<code class="ic">or_insert(0)</code>:空格子先造个 0——返回<b>可变引用</b>直接 += 1。词频统计的"一行流",既是惯用法也是性能优品(只查一次哈希)。</p>
  <div class="exslot" data-ex="c7s7-1"></div>`,
  exercises: [
    { id: "c7s7-1", kind: "predict", xp: 10, title: "entry 记账",
      task: `"abbccc" 数出来每个字母几次?按 a、b、c 的顺序输出计数。`,
      given: "use std::collections::HashMap;\n\nlet mut counts: HashMap<char, i32> = HashMap::new();\nfor c in \"abbccc\".chars() {\n    *counts.entry(c).or_insert(0) += 1;\n}\nfor key in ['a', 'b', 'c'] {\n    println!(\"{key}: {}\", counts[&key]);\n}",
      expected: "a: 1\nb: 2\nc: 3",
      ref: "for c in \"abbccc\".chars() {\n    *counts.entry(c).or_insert(0) += 1;\n}\nfor key in ['a', 'b', 'c'] {\n    println!(\"{key}: {}\", counts[&key]);\n}\n// a:1 b:2 c:3(打印顺序不定!)",
      refNote: "HashMap 的迭代顺序没有保证。示例按固定键顺序查询，确保输出可复现。",
    },
  ],
},
{
  id: "c7f", no: "7.8", title: "🎯 本章实战(2 题)",
  html: `<p>集合功夫合体战。</p>
  <div class="exslot" data-ex="c7f-1"></div>
  <div class="exslot" data-ex="c7f-2"></div>`,
  exercises: [
    { id: "c7f-1", kind: "big", xp: 15, title: "实战① Vec 操演场",
      task: '写完整小程序:①空 Vec(带类型标注 <code class="ic">Vec<i32></code>);②push 进 10、20、30;③pop 弹出并打印(Option 格式);④insert 在下标 0 插入 5;⑤打印整个 Vec(应得 <code>Some(30)</code> 和 <code>[5, 10, 20]</code>)。',
      scaffold: "fn main() {\n    // ① 空 Vec + 类型标注\n\n    // ② push ×3 → ③ pop 打印 → ④ insert → ⑤ 打印\n}",
      checks: [
        { label: "空 Vec 带类型标注", hint: "let mut v: Vec<i32> = Vec::new();", test: (s) => /:\s*Vec\s*<\s*i32\s*>/.test(s) },
        { label: "push 了三个值", hint: "v.push(10); ×3", test: (s) => (s.match(/push\s*\(/g) || []).length >= 3 },
        { label: "pop 并以 Option 形式打印", hint: "println!(\"{:?}\", v.pop()); → Some(30)", test: (s) => /pop\s*\(\s*\)/.test(s) && /println!/.test(s) },
        { label: "insert 到下标 0", hint: "v.insert(0, 5);", test: (s) => /insert\s*\(\s*0\s*,\s*\d+/.test(s) },
        { label: "打印了最终 Vec", hint: "println!(\"{:?}\", v); → [5, 10, 20]", test: (s) => /println![\s\S]*v\b/.test(s) },
      ],
      ref: "fn main() {\n    let mut v: Vec<i32> = Vec::new();\n    v.push(10);\n    v.push(20);\n    v.push(30);\n\n    println!(\"{:?}\", v.pop());   // Some(30)\n    v.insert(0, 5);\n    println!(\"{:?}\", v);          // [5, 10, 20]\n}",
      refNote: "pop 弹出 30(Option 打包),insert 把 5 插到队头。最后剩 [5, 10, 20]。Vec 的四件兵器一次操演完毕。",
    },
    { id: "c7f-2", kind: "big", xp: 15, title: "实战② 词频统计标准姿势",
      task: '完整写一遍标准词频:①<code class="ic">let text = "go is fun go is fast"</code>;②<code class="ic">split_whitespace()</code> 切词;③entry + or_insert 计数;④按 <b>次数降序</b>打印前两名(收集进 Vec 排序:<code class="ic">sort_by(|a, b| b.1.cmp(a.1))</code>)(应得 <code>go:2</code> 和 <code>is:2</code>,顺序不定)。',
      scaffold: "use std::collections::HashMap;\n\nfn main() {\n    let text = \"go is fun go is fast\";\n    // ① 切词 → ② entry 计数 → ③ 收集 Vec 排序 → ④ 打印前二\n}",
      checks: [
        { label: "切词(split_whitespace)", hint: "text.split_whitespace()", test: (s) => /split_whitespace\s*\(\s*\)/.test(s) },
        { label: "entry + or_insert 计数", hint: "*counts.entry(w).or_insert(0) += 1;", test: (s) => /entry\s*\([\s\S]*or_insert\s*\(\s*0\s*\)/.test(s) },
        { label: "收集 Vec 并按次数降序", hint: "let mut pairs: Vec<_> = counts.into_iter().collect();\\npairs.sort_by(|a, b| b.1.cmp(&a.1));", test: (s) => /sort_by\s*\(\s*\|[\s\S]*cmp/.test(s) },
        { label: "打印了前两名", hint: "for (w, c) in pairs.iter().take(2) { println!(\"{}:{}\", w, c); }", test: (s) => /take\s*\(\s*2\s*\)/.test(s) && /println!/.test(s) },
      ],
      ref: "use std::collections::HashMap;\n\nfn main() {\n    let text = \"go is fun go is fast\";\n    let mut counts: HashMap<&str, i32> = HashMap::new();\n    for w in text.split_whitespace() {\n        *counts.entry(w).or_insert(0) += 1;\n    }\n\n    let mut pairs: Vec<_> = counts.into_iter().collect();\n    pairs.sort_by(|a, b| b.1.cmp(&a.1));\n\n    for (w, c) in pairs.iter().take(2) {\n        println!(\"{}:{}\", w, c);\n    }\n}",
      refNote: "HashMap 顺序不定?倒进 Vec 排序就定了。切词 → entry 计数 → 收集排序 → 取前 N:文本统计的完整生产线,以后统计任何东西都是这套骨架。",
    },
  ],
},
]);

/* ════════ 第 8 章 · struct(6 小节 + 2 实战) ════════ */
R.registerSections("ch8", [
{
  id: "c8s1", no: "8.1", title: "实例化的字段简写与更新语法",
  html: `
  <pre><code class="lang-rust">struct Rect { w: i32, h: i32 }

let w = 30;
let r1 = Rect { w, h: 20 };     // w: w 的简写:同名变量只写一次!

let base = Rect { w: 10, h: 10 };\nlet r2 = Rect { h: 20, ..base };   // 更新语法:其余字段抄 base</code></pre>
  <p><code class="ic">..base</code> 注意:未列出的字段会<b>从 base 里 move 出来</b>(Copy 类型则是复制)——base 的 w 被拿走后就残缺了。</p>
  <div class="exslot" data-ex="c8s1-1"></div>`,
  exercises: [
    { id: "c8s1-1", kind: "predict", xp: 10, title: "简写等于全写",
      task: `w 是同名变量,Rect { w, h: 20 } 展开是什么?r1.w 是几?`,
      given: "struct Rect { w: i32, h: i32 }\n\nlet w = 30;\nlet r1 = Rect { w, h: 20 };\nprintln!(\"{}\", r1.w);",
      expected: "30",
      ref: "let w = 30;\nlet r1 = Rect { w, h: 20 };   // 等价 Rect { w: w, h: 20 }\nprintln!(\"{}\", r1.w);   // 30",
      refNote: "字段简写 = 变量名和字段名相同时省掉「w: 」。纯语法糖,长出来的代码完全一样。更新语法 ..base 则是反向的省:没写的字段抄别人。",
    },
  ],
},
{
  id: "c8s2", no: "8.2", title: "方法接收器:三兄弟的选用标准",
  html: `
  <pre><code class="lang-rust">struct Account { balance: f64 }

impl Account {
    fn peek(&self) -> f64 {        // 只读:&self
        self.balance
    }
    fn deposit(&mut self, x: f64) {   // 要改:&mut self
        self.balance += x;
    }
    fn new(balance: f64) -> Self {    // 构造:不挂实例
        Account { balance }
    }
}</code></pre>
  <p>选择口诀:<b>读 → &self,改 → &mut self,连锅端走 → self(罕见),造新房 → 无 self(关联函数)</b>。</p>
  <div class="exslot" data-ex="c8s2-1"></div>`,
  exercises: [
    { id: "c8s2-1", kind: "blank", runDemo: { before: "struct Account { balance: f64 }", after: "println!(\"{}\", Account { balance: 250.0 }.peek());" }, xp: 10, title: "只读方法选哪个 self",
      task: `peek 只想读余额、不改不动,接收器空着——填三兄弟中合适的那个。`,
      given: "impl Account {\n    fn peek(____) -> f64 {\n        self.balance\n    }\n}",
      placeholder: "&self / self / &mut self",
      checks: [
        { label: "用了 &self", hint: "只读 &self ——最常用、最安全。", test: (s) => /&self/.test(s) },
      ],
      ref: "&self",
      refNote: "&self = “只看不动手”。日常方法九成是它;要改数据才升级 &mut self——编译器全程盯着借用规则,越权当场报错。",
    },
  ],
},
{
  id: "c8s3", no: "8.3", title: "关联函数与 ::new 构造惯用",
  html: `
  <p>不挂 self 的函数叫<b>关联函数</b>,用 <code class="ic">类型::</code> 调用——最常见的就是构造器 <code class="ic">new</code>:</p>
  <pre><code class="lang-rust">impl Rect {
    fn new(w: i32, h: i32) -> Rect {    // 关联函数:像"工厂入口"
        Rect { w, h }
    }
    fn square(size: i32) -> Rect {      // 命名构造:正方形
        Rect { w: size, h: size }
    }
}

let r = Rect::new(3, 4);       // 类型::函数 ——不走实例
let s = Rect::square(5);       // 同上</code></pre>
  <p>命名惯用:new 是"通用入口",square 这种"特殊构造"各起其名——读代码的人一眼看懂怎么造出来的。</p>
  <div class="exslot" data-ex="c8s3-1"></div>`,
  exercises: [
    { id: "c8s3-1", kind: "write", xp: 10, title: "动手写:命名构造器",
      task: `给 <code class="ic">Rect</code>(字段 w、h)写关联函数 <code class="ic">square(size: i32) -> Rect</code>:造一个边长相等的正方形。main 用 <code class="ic">Rect::square(5)</code> 造一个并打印 w(应得 5)。struct 定义已备好。`,
      scaffold: "struct Rect { w: i32, h: i32 }\n\nimpl Rect {\n    // 在这里写 square\n}\n\nfn main() {\n    let s = Rect::square(5);\n    println!(\"{}\", s.w);\n}",
      checks: [
        { label: "square 是关联函数(没有 self)", hint: "fn square(size: i32) -> Rect ——不挂 self,用 Rect:: 调。", test: (s) => /fn\s+square\s*\(\s*size\s*:\s*i32\s*\)\s*->\s*Rect/.test(s) },
        { label: "造的是正方形(w=h=size)", hint: "Rect { w: size, h: size }", test: (s) => /w\s*:\s*size[\s\S]*h\s*:\s*size/.test(s) },
        { label: "main 用 :: 调用了 square", hint: "Rect::square(5)", test: (s) => /Rect\s*::\s*square\s*\(\s*5\s*\)/.test(s) },
      ],
      ref: "struct Rect { w: i32, h: i32 }\n\nimpl Rect {\n    fn square(size: i32) -> Rect {\n        Rect { w: size, h: size }\n    }\n}\n\nfn main() {\n    let s = Rect::square(5);\n    println!(\"{}\", s.w);   // 5\n}",
      refNote: "Rect::square(5) 读着就像\"Rect 家的 square 生产线\"——类型::函数 的点号双冒号,是关联函数的门牌。new + 命名构造,是 Rust 世界的工厂惯用。",
    },
  ],
},
{
  id: "c8s4", no: "8.4", title: "derive 家族的完整名单",
  html: `
  <pre><code class="lang-rust">#[derive(Debug, Clone, PartialEq, Default)]
struct Config {\n    name: String,\n    retries: u32,\n}

let c1 = Config { name: "db".into(), retries: 3 };
let c2 = c1.clone();               // Clone:复制
println!("{:?} {}", c1 == c2, c2.retries);   // true 3
let d = Config::default();          // Default:全字段零值\nprintln!("{:?}", d);               // Config { name: "", retries: 0 }</code></pre>
  <p>四件套各司其职:<b>Debug</b> 打印({:?})、<b>Clone</b> 复制、<b>PartialEq</b> 比较、<b>Default</b> 出厂零值——编译器替你写实现,一行注解四份代码。</p>
  <div class="exslot" data-ex="c8s4-1"></div>`,
  exercises: [
    { id: "c8s4-1", kind: "predict", xp: 10, title: "Default 的零值",
      task: `Default 造出来的 Config 长什么样?Debug 打印什么?`,
      given: "#[derive(Debug, Default)]\nstruct Config {\n    name: String,\n    retries: u32,\n}\n\nlet d = Config::default();\nprintln!(\"{:?}\", d);",
      expected: "Config { name: \"\", retries: 0 }",
      ref: "…\nlet d = Config::default();\nprintln!(\"{:?}\", d);\n// Config { name: \"\", retries: 0 } ——各字段零值出厂",
      refNote: "String 零值是空串,u32 是 0。Default + 更新语法是黄金搭档:Config { retries: 3, ..Default::default() } ——只写关心的字段,其余全默认。",
    },
  ],
},
{
  id: "c8s5", no: "8.5", title: "元组结构体:给元组发身份证",
  html: `
  <pre><code class="lang-rust">struct Meters(f64);       // 元组结构体:一个字段,匿名字段
struct Seconds(f64);

let d = Meters(9.8);      // 造法:像元组
let t = Seconds(9.8);

println!("{:?}", d);      // Meters(9.8)
println!("{}", d.0);      // 用 .0 访问</code></pre>
  <p>都装 9.8,但 <code class="ic">Meters(9.8)</code> 和 <code class="ic">Seconds(9.8)</code> 是<b>不同类型</b>——不能互加、不能比错。这就是 newtype 技巧:用类型系统把"数字"升级成"带单位的数字",单位错误编译期现形。</p>
  <div class="exslot" data-ex="c8s5-1"></div>`,
  exercises: [
    { id: "c8s5-1", kind: "predict", xp: 10, title: "同值不同型",
      task: `Meters 和 Seconds 都装 9.8,== 比得过吗?(想想 Debug 打印)`,
      given: "struct Meters(f64);\nstruct Seconds(f64);\n\n#[derive(Debug, PartialEq)]\nstruct M(f64);\n#[derive(Debug, PartialEq)]\nstruct S(f64);\n\nlet a = M(9.8);\nlet b = S(9.8);\nprintln!(\"{}\", a == b);",
      expected: "编译报错",
      ref: "// 这段代码 <b>编译不过</b>!\n// error[E0308]: mismatched types\n// expected 'M', found 'S'\n// ——M 和 S 是两种类型,9.8 相同也没用",
      refNote: "打印不出来——编译错误!M(9.8) == S(9.8) 连编译都过不了:M 和 S 类型不同,== 根本不成立。这就是 newtype 的价值:把\"米加秒\"这种低级 bug 拦在编译期。",
    },
  ],
},
{
  id: "c8s6", no: "8.6", title: "嵌套 struct 与方法链",
  html: `
  <pre><code class="lang-rust">struct Point { x: i32, y: i32 }
struct Line { start: Point, end: Point }

impl Line {
    fn len(&self) -> i32 {
        (self.end.x - self.start.x).abs() + (self.end.y - self.start.y).abs()
    }
}

let l = Line {\n    start: Point { x: 0, y: 0 },\n    end: Point { x: 3, y: 4 },\n};
println!("{}", l.len());   // 7 ——嵌套字段的取法:l.end.x</code></pre>
  <div class="exslot" data-ex="c8s6-1"></div>`,
  exercises: [
    { id: "c8s6-1", kind: "predict", xp: 10, title: "嵌套取值",
      task: `l.end 是 Point (3,4)。start 到 end 的曼哈顿距离是多少?打印什么?`,
      given: "struct Point { x: i32, y: i32 }\nstruct Line { start: Point, end: Point }\nimpl Line {\n    fn len(&self) -> i32 {\n        (self.end.x - self.start.x).abs() + (self.end.y - self.start.y).abs()\n    }\n}\n\nlet l = Line {\n    start: Point { x: 0, y: 0 },\n    end: Point { x: 3, y: 4 },\n};\nprintln!(\"{}\", l.len());",
      expected: "7",
      ref: "// start(0,0) → end(3,4)\n// |3-0| + |4-0| = 3 + 4 = 7(曼哈顿距离:只走直角)\nprintln!(\"{}\", l.len());   // 7",
      refNote: "曼哈顿距离 7。嵌套字段像剥洋葱:l.end.x 一路点下去。struct 套 struct 是数据建模的日常——方法挂在最外层,内部细节全封装。",
    },
  ],
},
{
  id: "c8f", no: "8.7", title: "🎯 本章实战(2 题)",
  html: `<p>struct 的完全体操练。</p>
  <div class="exslot" data-ex="c8f-1"></div>
  <div class="exslot" data-ex="c8f-2"></div>`,
  exercises: [
    { id: "c8f-1", kind: "big", xp: 15, title: "实战① 书籍管理器",
      task: '①定义 <code class="ic">Book</code>(title: String、price: f64)derive Debug + Clone;②关联函数 <code class="ic">cheap(title: &str) -> Book</code>:造 price 9.9 的书;③方法 <code class="ic">discount(&self, pct: f64) -> Book</code>:借用返回打折新书(原书不动);④main:造一本 <code>"rust"</code> 的书,打 5 折,打印两本(应得 <code>9.9</code> 和 <code>4.95</code>,原价不变)。',
      scaffold: "#[derive(Debug, Clone)]\nstruct Book {\n    title: String,\n    price: f64,\n}\n\nimpl Book {\n    // cheap 构造 + discount 方法\n}\n\nfn main() {\n    // 造书 → 打折 → 双打印\n}",
      checks: [
        { label: "cheap 是关联函数", hint: "fn cheap(title: &str) -> Book { Book { title: title.to_string(), price: 9.9 } }", test: (s) => /fn\s+cheap\s*\(\s*\w+\s*:\s*&str/.test(s) },
        { label: "discount 用 &self 不动原书", hint: "fn discount(&self, pct: f64) -> Book { Book { title: self.title.clone(), price: self.price * pct } }", test: (s) => /fn\s+discount\s*\(\s*&self/.test(s) },
        { label: "main 打折后打印两本", hint: "println!(\"{} {}\", b.price, sale.price);", test: (s) => (s.match(/println!|print!/g) || []).length >= 1 && /discount/.test(s) },
      ],
      ref: "#[derive(Debug, Clone)]\nstruct Book {\n    title: String,\n    price: f64,\n}\n\nimpl Book {\n    fn cheap(title: &str) -> Book {\n        Book { title: title.to_string(), price: 9.9 }\n    }\n    fn discount(&self, pct: f64) -> Book {\n        Book { title: self.title.clone(), price: self.price * pct }\n    }\n}\n\nfn main() {\n    let b = Book::cheap(\"rust\");\n    let sale = b.discount(0.5);\n    println!(\"{} {}\", b.price, sale.price);   // 9.9 4.95\n}",
      refNote: "discount 只借(&self)不改——原书 9.9 纹丝不动,新书 4.95 独立出厂。关联函数造货、方法加工、derive 打印:struct 王国的三权分立。",
    },
    { id: "c8f-2", kind: "big", xp: 15, title: "实战② 计步器 with Default",
      task: '①定义 <code class="ic">Pedometer</code>(steps: u32)derive Debug + Default;②方法 <code class="ic">walk(&mut self, n: u32)</code>:累加步数;③方法 <code class="ic">report(&self)</code>:打印"已走 N 步";④main:用 <code class="ic">..Default::default()</code> 造新表 → 走 3000 → 再走 2000 → 打印报告(应得 <code>已走 5000 步</code>)。',
      scaffold: "#[derive(Debug, Default)]\nstruct Pedometer {\n    steps: u32,\n}\n\nimpl Pedometer {\n    // walk + report\n}\n\nfn main() {\n    // Default 造表 → 走两趟 → 报告\n}",
      checks: [
        { label: "walk 用 &mut self 累加", hint: "fn walk(&mut self, n: u32) { self.steps += n; }", test: (s) => /fn\s+walk\s*\(\s*&mut\s+self/.test(s) && /\+=\s*n|self\.steps\s*\+/.test(s) },
        { label: "report 用 &self 只读", hint: "fn report(&self) { println!(\"已走 {} 步\", self.steps); }", test: (s) => /fn\s+report\s*\(\s*&self/.test(s) },
        { label: "main 用 ..Default::default() 造表", hint: "let mut p = Pedometer { ..Default::default() };", test: (s) => /Default::default\s*\(\s*\)/.test(s) },
        { label: "走了两趟并报告", hint: "p.walk(3000); p.walk(2000); p.report();", test: (s) => (s.match(/walk\s*\(/g) || []).length >= 2 && /report/.test(s) },
      ],
      ref: "#[derive(Debug, Default)]\nstruct Pedometer {\n    steps: u32,\n}\n\nimpl Pedometer {\n    fn walk(&mut self, n: u32) {\n        self.steps += n;\n    }\n    fn report(&self) {\n        println!(\"已走 {} 步\", self.steps);\n    }\n}\n\nfn main() {\n    let mut p = Pedometer { ..Default::default() };\n    p.walk(3000);\n    p.walk(2000);\n    p.report();   // 已走 5000 步\n}",
      refNote: "Default 造表、&mut 累加、&self 汇报——这个结构体兼收了本章的 derive、三兄弟、更新语法。真实项目里的 struct 全长这个样:字段少而清晰,方法各司其职。",
    },
  ],
},
]);

})();
