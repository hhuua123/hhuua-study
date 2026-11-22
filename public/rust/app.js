/* ═══════════════════════════ 锈岛求生 2.0 · 核心引擎 ═══════════════════════════ */
(() => {
"use strict";

const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SAVE_KEY = "rust-island-save-v1";

/* ───────────────────────── 元数据(内联章节) ───────────────────────── */
const META_BASE = [
  { key: "intro", order: 0,   part: 1, partTitle: "第一部 · 基础岛", icon: "🧭", title: "欢迎登岛" },
  { key: "ch1",   order: 1,   part: 1, icon: "📦", title: "变量与封条" },
  { key: "ch2",   order: 2,   part: 1, icon: "🔍", title: "类型体检" },
  { key: "ch3",   order: 3,   part: 1, icon: "🛠", title: "函数合同" },
  { key: "ch4",   order: 4,   part: 1, icon: "🚦", title: "控制流" },
  { key: "ch5",   order: 5,   part: 1, icon: "👑", title: "所有权" },
  /* ch6~ch11 由 content-basics2.js 注册(order 6~11) */
  { key: "final", order: 12,  part: 1, icon: "🏝", title: "基础篇毕业考" },
  /* ch12~ch18 + advfinal 由 content-advanced.js 注册(order 20~27) */
  /* p1~p5/snake/grand 由 content-projects.js 注册(order 40+) */
];

const BADGES = {
  intro: { icon: "🧭", name: "初来乍到" },
  ch1:   { icon: "📦", name: "封条管理员" },
  ch2:   { icon: "🔍", name: "类型侦探" },
  ch3:   { icon: "🛠", name: "函数工头" },
  ch4:   { icon: "🚦", name: "流程指挥官" },
  ch5:   { icon: "👑", name: "所有权觉醒" },
  ch6:   { icon: "🧾", name: "字符串管理员" },
  ch7:   { icon: "🎒", name: "背包管理员" },
  ch8:   { icon: "🪪", name: "数据公民" },
  ch9:   { icon: "⚔️", name: "分支魔法师" },
  ch10:  { icon: "🎁", name: "拆盒专家" },
  ch11:  { icon: "🚨", name: "首席风险官" },
  final: { icon: "🏝", name: "基础岛居民" },
  ch12:  { icon: "🎭", name: "匿名演员" },
  ch13:  { icon: "🛸", name: "惰性流水线" },
  ch14:  { icon: "🧬", name: "协议大师" },
  ch15:  { icon: "🏠", name: "房产中介" },
  ch16:  { icon: "🧵", name: "并发指挥官" },
  ch17:  { icon: "⏳", name: "时空魔法师" },
  ch18:  { icon: "🏗", name: "总工程师" },
  advfinal: { icon: "🎓", name: "群岛航海家" },
  p1: { icon: "🔧", name: "青铜工兵" },
  p2: { icon: "🪙", name: "白银侦探" },
  p3: { icon: "📡", name: "信号台长" },
  p4: { icon: "🔗", name: "链接骑士" },
  p5: { icon: "🧠", name: "语言建筑师" },
  snake: { icon: "🕹", name: "藏镜人" },
  grand: { icon: "🏆", name: "Rustacean" },
  guess: { icon: "🎲", name: "读心神探" },
  httpd: { icon: "🕸", name: "裸写铁匠" },
};

const LEVELS = [
  { at: 0,     title: "海滩游客" },
  { at: 100,   title: "拾贝学徒" },
  { at: 260,   title: "螃蟹骑士" },
  { at: 450,   title: "锈岛常客" },
  { at: 700,   title: "细节猎人" },
  { at: 1000,  title: "基础岛居民" },
  { at: 1350,  title: "群岛水手" },
  { at: 1750,  title: "群岛航海家" },
  { at: 2200,  title: "铁锈猎人" },
  { at: 2650,  title: "实战指挥官" },
  { at: 3100,  title: "管道宗师" },
  { at: 3600,  title: "锈甲骑将" },
  { at: 4100,  title: "编译器之友" },
  { at: 4600,  title: "所有权大师" },
];

const PRAISE = ["漂亮！🦀", "没错，就是这样！", "干净利落！", "你有点东西，Rustacean！", "连编译器都想给你鼓掌 👏", "这波操作很 Rust！"];
const REGRET = ["差一点！看看选项再想想～", "哎呀，再试一次，学费打骨折！", "不亏，错误也是 XP 的一部分。"];
const TIPS = [
  "遇到看不懂的报错？直接把错误信息贴进搜索引擎，Rust 社区全都懂。",
  "Ferris 是 Rust 社区吉祥物，玩家互称 Rustacean（锈甲居民）。",
  "Python 的 range(5) ≈ Rust 的 0..5，是不是很省心？",
  "Python 的 None，在 Rust 里是 Option<T>——比想象中优雅。",
  "Rust 编译器的报错是出了名的贴心，连怎么改都告诉你。",
  "偷偷告诉你：大括号替代缩进之后，空格和 Tab 之战与你无关了。",
  "今日灵魂拷问：这一章的核心是什么？说一遍给自己听 🦀",
  "写 Rust 卡住时先读编译器的话，它 90% 的时候都是对的。",
  "clippy 是 Rust 的资深同事，cargo clippy 请多请它吃饭。",
];

/* ───────────────────────── 测验数据(内联章节) ───────────────────────── */
const QUIZZES = {
  intro: [{
    q: "开胃小菜：Rust 的吉祥物 Ferris 是哪种小动物？",
    opts: ["海豚", "小海龟", "🦀 螃蟹", "海鸥"],
    ans: 2,
    exp: "答对了！Ferris 是只小螃蟹，Rust 社区的玩家互称 Rustacean（锈甲居民）。+5 XP 已到账，冒险正式开始！",
    xp: 5,
  }],

  ch1: [
    {
      q: "这段代码会发生什么？",
      code: "let x = 5;\nx = x + 1;",
      opts: ["正常运行，x 变成 6", "编译报错：x 是不可变的", "运行时才崩溃", "只是警告，能跑过去"],
      ans: 1,
      exp: "x 声明时没加 mut，默认贴了封条。想改盒子里的东西，必须一开始就写 let mut x = 5;。这是 Rust 和 Python 的第一道分水岭：不可变是默认值。",
    },
    {
      q: "下面哪个写法能通过编译？",
      opts: ["let mut a = 1; 然后 a = 2;", "let a = 1; 然后 a = 2;", "mut let a = 1; 然后 a = 2;", "let a = 1; 然后 a += 2;"],
      ans: 0,
      exp: "只有第一个给 a 加了 mut。D 的 += 复合赋值 Rust 确实也有，但 a 没加 mut 照样翻车。C 语法错误——mut 永远乖乖跟在 let 后面。",
    },
    {
      q: "预测一下输出：",
      code: "let mut count = 0;\ncount = count + 10;\ncount += 5;\nprintln!(\"{count}\");",
      opts: ["0", "10", "15", "编译错误"],
      ans: 2,
      exp: "count 加了 mut，可以随便改：0 + 10 + 5 = 15。顺便：+=、-=、*= 这些复合赋值 Rust 全都有，和 Python 一样用。",
    },
  ],

  ch2: [
    {
      q: "下面哪个写法会编译报错？",
      opts: ["let a = 'x';", 'let b = "hello";', "let c = 'hi';", "let d = '🦀';"],
      ans: 2,
      exp: "Rust 的单引号只能装「一个」字符。'hi' 是两个字符，属于字符串，得用双引号 \"hi\"。彩蛋：'🦀' 看着很大，但只算一个 Unicode 字符，所以合法！",
    },
    {
      q: "a 是 i32，b 是 f64。想让 a + b 合法，应该怎么写？",
      code: "let a = 1;     // i32\nlet b = 2.5;   // f64",
      opts: ["直接 a + b 就行", "a as f64 + b", "(f64)a + b", "str(a) + b"],
      ans: 1,
      exp: "Rust 绝不偷偷转换类型，i32 和 f64 是两种生物，不许悄悄混算。用 as 明说「把 a 当 f64 用」。(f64)a 是 C 语言的写法，Rust 不认识。",
    },
    {
      q: "Rust 里表示「真」的写法是？",
      opts: ["True", "TRUE", "true", "1"],
      ans: 2,
      exp: "Rust 关键字全小写：true / false。Python 的大写 True 在这里只是个编译器不认识的普通名字。",
    },
  ],

  ch3: [
    {
      q: "这个函数定义哪里有毛病？",
      code: "fn add(a, b) -> i32 {\n    a + b\n}",
      opts: ["函数名不能用小写", "参数没写类型", "少了 return 关键字", "大括号应该换成缩进"],
      ans: 1,
      exp: "Rust 的函数参数必须写类型，这是合同的一部分。正确写法：fn add(a: i32, b: i32) -> i32。换来的是：任何地方调用 add 传错参数，当场编译报错，绝不留到运行时炸。",
    },
    {
      q: "预测一下输出：",
      code: "fn double(n: i32) -> i32 {\n    n * 2\n}\n\nfn main() {\n    println!(\"{}\", double(21));\n}",
      opts: ["21", "42", "编译错误：没写 return", "n * 2"],
      ans: 1,
      exp: "最后一行不带分号，就是返回值——这是 Rust 最地道的写法。double(21) = 42。",
    },
    {
      q: "一个「什么都不返回」的函数，签名应该怎么写？",
      opts: ["fn f() -> void", "fn f() -> None", "fn f() { }（不写 ->）", "fn f() -> null"],
      ans: 2,
      exp: "Rust 没有 void / None 返回类型这回事。-> 不写就是「无返回值」。这和 Python 的「隐式返回 None」神似，但 Rust 把它做进了类型系统。",
    },
  ],

  ch4: [
    {
      q: "score 是 i32。下面哪个条件写法【不合法】？",
      opts: ["if score > 60 { }", "if (score > 60) { }", "if score { }", "if score == 60 { }"],
      ans: 2,
      exp: "Rust 的条件必须是货真价实的 bool。score 是数字，if score {} 直接编译报错——「非零即真」的偷懒写法在 Rust 一律禁止。（B 能编译，但编译器会唠叨让你删掉多余括号。）",
    },
    {
      q: "for i in 0..3 会循环几次？i 依次是多少？",
      opts: ["3 次：0、1、2", "4 次：0、1、2、3", "3 次：1、2、3", "2 次：0、1"],
      ans: 0,
      exp: "0..3 读作「从 0 到 3 为止，不含 3」，完全等价 Python 的 range(3)。想含尾巴写 0..=3。",
    },
    {
      q: "预测一下输出：",
      code: "let n = 3;\nlet label = if n % 2 == 0 { \"偶数\" } else { \"奇数\" };\nprintln!(\"{label}\");",
      opts: ["偶数", "奇数", "编译错误：if 不能这么用", "3"],
      ans: 1,
      exp: "if 在 Rust 里是表达式，能直接产出一个值——相当于 Python 的 level = \"及格\" if 条件 else \"挂科\"。3 % 2 = 1（不是 0），所以是奇数。",
    },
  ],

  ch5: [
    {
      q: "预测这段代码的下场：",
      code: "let s1 = String::from(\"hi\");\nlet s2 = s1;\nprintln!(\"{s1}\");",
      opts: ["打印 hi", "编译报错：s1 的所有权已转给 s2", "打印空字符串", "运行时崩溃"],
      ans: 1,
      exp: "赋值 = 过户。s2 拿走所有权后，s1 就是个空壳，编译器当场拦下。想想 Python 里 b.append(4) 悄悄污染 a 的幽灵 bug——Rust 把这类问题全掐死在编译期。",
    },
    {
      q: "想让函数「借用」你的字符串（用完就还），参数应该怎么写？",
      opts: ["fn f(s: String)", "fn f(s: &String)", "fn f(s: *String)", "fn f(s: borrowed String)"],
      ans: 1,
      exp: "& = 只借不占。函数拿到的是「查看权」而不是「所有权」，用完自动归还。不写 & 就是把字符串整个过户给函数。",
    },
    {
      q: "这段代码会怎样？",
      code: "let x = 10;\nlet y = x;\nprintln!(\"{x} {y}\");",
      opts: ["编译报错：x 被 move 了", "打印 10 10", "打印 10", "打印 10 和 y 的内存地址"],
      ans: 1,
      exp: "整数这种简单类型是 Copy 类型：赋值时自动复制一份，x 依然健在。所有权过户主要影响 String、Vec 这些「大件」。",
    },
  ],

  /* 基础篇毕业考：原 5 题 + 新增 3 题覆盖 ch6~ch11 */
  final: [
    {
      q: "要让第二行合法，第一行应该怎么写？",
      code: "______\nx = x + 1;",
      opts: ["let x = 5;", "let mut x = 5;", "mut x = 5;", "x = 5;"],
      ans: 1,
      exp: "变量默认不可变，想改就加 mut：let mut x = 5; 之后 x = x + 1; 才合法。",
    },
    {
      q: "哪个是合法的 Rust 函数签名？",
      opts: ["fn f(a, b) -> i32", "fn f(a: i32, b: i32) -> i32", "def f(a: i32, b: i32) -> i32:", "fn f(a: int, b: int) -> int"],
      ans: 1,
      exp: "参数写类型、返回用 -> 标注。C 是 Python 的写法；D 的 int 在 Rust 里叫 i32。",
    },
    {
      q: "输出是什么？",
      code: "for i in 1..=3 {\n    print!(\"{i} \");\n}",
      opts: ["1 2", "1 2 3", "1 2 3 4", "编译错误"],
      ans: 1,
      exp: "..= 表示含尾巴：1、2、3，等价于 Python 的 range(1, 4)。",
    },
    {
      q: "找出唯一会报错的那一行：",
      code: "let s = String::from(\"rust\");   // ①\nlet t = s;                      // ②\nlet u = s.clone();              // ③\nprintln!(\"{t} {u}\");             // ④",
      opts: ["①", "②", "③", "④"],
      ans: 2,
      exp: "② 把 s 的所有权过户给 t 之后，s 就作废了。③ 再碰 s 触发「use of moved value」错误。把 ② 改成 let t = s.clone(); 就全通了。",
    },
    {
      q: "下面哪句话是【对】的？",
      opts: ["Rust 依靠垃圾回收器（GC）管理内存", "Rust 的变量默认可以随意修改", "Rust 的函数参数可以不写类型", "同一时刻，一个值只有一个所有者"],
      ans: 3,
      exp: "所有权三铁律之一。正因「一物一主」，Rust 不靠 GC 也能在编译期敲定内存回收时机——这就是它又快又稳的底气。",
    },
    {
      q: "输出是什么？",
      code: "let s = \"你好\";\nprintln!(\"{}\", s.len());",
      opts: ["2", "3", "6", "编译错误"],
      ans: 2,
      exp: "len() 数的是字节！「你好」两个汉字共 6 个 UTF-8 字节。想要「人类视角」的字符数用 s.chars().count()。Python 的 len(\"你好\") 是 2——这里是最容易踩的差异。",
    },
    {
      q: "哪种遍历 Vec 只「借用」不「拿走」？",
      opts: ["for x in &v { }", "for x in v { }", "let y = v; for x in y { }", "for x in *v { }"],
      ans: 0,
      exp: "&v 是借用视角，遍历完 v 还能用；直接 for x in v 是 into_iter，把 v 整个拿走消耗掉，之后 v 作废。想改元素用 &mut v。",
    },
    {
      q: "match 的「必须穷尽」是什么意思？",
      opts: ["漏了分支会编译报错", "漏了分支会运行时崩溃", "漏了会返回 None", "漏了只给警告，能跑"],
      ans: 0,
      exp: "所有变体都必须被处理，漏一个编译器直接拦住。不想一个个写？可以用 _ 兜底——但那样就失去了「新增变体时编译器点名提醒」的超能力。",
    },
  ],
};

/* ───────────────────────── 运行输出(内联章节·模拟) ───────────────────────── */
const RUN = {
  "ch1-fix":    ["小蟹"],
  "ch1-shadow": ["12"],
  "ch2-cast":   ["3.5"],
  "ch2-bool":   ["好嘞"],
  "ch3-add":    ["3"],
  "ch3-double": ["42"],
  "ch3-check":  ["及格"],
  "ch3-shout":  ["你好!!!"],
  "ch4-if":     ["及格!"],
  "ch4-ifexpr": ["及格"],
  "ch4-loop":   ["第 1 圈", "第 2 圈", "第 3 圈"],
  "ch4-while":  ["3!", "2!", "1!", "发射 🚀"],
  "ch4-for":    ["第 0 圈", "第 1 圈", "第 2 圈", "第 3 圈", "第 4 圈"],
  "ch5-scope":  ["螃蟹"],
  "ch5-clone":  ["螃蟹 和 螃蟹"],
  "ch5-borrow": ["收到: 你好", "你好"],
  "ch5-copy":   ["10 10"],
};

const ERRS = {
  "ch1-imm": {
    lines: [
      "error[E0384]: cannot assign twice to immutable variable `name`",
      " --> src/main.rs:3:5",
      "  |",
      "1 |     let name = \"Ferris\";",
      "  |         ---- first assignment to `name`",
      "3 |     name = \"小蟹\";",
      "  |     ^^^^^^^^^^^^^ cannot assign twice to immutable variable",
      "  |",
      "help: consider making this binding mutable",
      "  |",
      "1 |     let mut name = \"Ferris\";",
      "  |         +++",
    ],
    human: "人话：name 没加 mut，是贴了封条的盒子。编译器不仅骂你，还把改法贴在最后：第 1 行加个 mut。就问你贴不贴心？",
  },
  "ch2-mix": {
    lines: [
      "error[E0308]: mismatched types",
      " --> src/main.rs:4:15",
      "  |",
      "4 |     let c = a + b;",
      "  |               ^ cannot add `f64` to `i32`",
    ],
    human: "人话：整数和浮点是两种生物，不许悄悄混算。想算？用 a as f64 明说要变身。",
  },
  "ch2-char": {
    lines: [
      "error: character literal may only contain one codepoint",
      " --> src/main.rs:2:13",
      "  |",
      "2 |     let c = 'hi';",
      "  |             ^^^^",
      "  |",
      "help: if you meant to write a `str` literal, use double quotes",
      "  |",
      "2 |     let c = \"hi\";",
      "  |             ^^ ^",
    ],
    human: "人话：单引号 = 一个字符，装不下 'hi' 两个。想要字符串？编译器手把手教你换双引号。",
  },
  "ch5-move": {
    lines: [
      "error[E0382]: borrow of moved value: `s1`",
      " --> src/main.rs:4:20",
      "  |",
      "2 |     let s1 = String::from(\"hi\");",
      "  |         -- move occurs because `s1` has type `String`, which does",
      "  |            not implement the `Copy` trait",
      "3 |     let s2 = s1;",
      "  |              -- value moved to `s2`",
      "4 |     println!(\"{s1}\");",
      "  |                    ^^ value borrowed here after move",
      "  |",
      "help: consider cloning the value if the performance cost is acceptable",
      "  |",
      "3 |     let s2 = s1.clone();",
      "  |               ++++++++",
    ],
    human: "人话：第 3 行把所有权「过户」给了 s2，s1 当场作废。要么 clone 复制一份，要么写 let s2 = &s1; 只借不占。",
  },
};

/* ───────────────────────── 存档 ───────────────────────── */
let state = {
  xp: 0, current: "intro",
  solved: {},     // qid -> true
  solvedEx: {},   // 3.0 动手练习 exId -> true
  firstTry: {},   // qid -> true（一发命中）
  wrong: {},      // qid -> true（曾经答错过）
  chapters: {},   // chapter key -> true
  badges: [],     // 已解锁徽章 key
  name: "",
};
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) state = { ...state, ...JSON.parse(raw) };
} catch (e) { /* 隐私模式等情况下静默降级 */ }

const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} };

/* ───────────────────────── 章节注册表(2.0) ───────────────────────── */
const REGISTRY = [];   // content-*.js 注册的动态章节
let META = [];         // 合并后的完整章节列表
const SECTIONS = {};   // chapterKey -> [sectionDefs]  (3.0 细节小节)
const EXERCISES = {};  // exId -> exercise def(3.0 动手练习)

window.RUST_ISLAND = {
  registerChapter(def) { REGISTRY.push(def); },
  registerPlay(map) { Object.assign(PLAY, map); },
  registerSections(chapterKey, sections) {
    SECTIONS[chapterKey] = SECTIONS[chapterKey] || [];
    sections.forEach((sec) => {
      SECTIONS[chapterKey].push(sec);
      (sec.exercises || []).forEach((ex) => {
        ex.chapter = chapterKey;
        EXERCISES[ex.id] = ex;
      });
    });
  },
  getEx(id) { return EXERCISES[id]; },
  isExSolved(id) { return !!state.solvedEx[id]; },
  notifyExSolved(id) {
    const ex = EXERCISES[id];
    if (!ex || state.solvedEx[id]) return;
    state.solvedEx[id] = true;
    addXp(ex.xp || 10);
    checkChapterDone(ex.chapter);
  },
  complete(key) { completeChapter(key, true); },
  isDone(key) { return !!state.chapters[key]; },
  ferrisSay, toast, confetti,
  setName(n) { state.name = n; save(); },
  stats() {
    let total = 0, hits = 0;
    Object.keys(QUIZZES).forEach((k) => {
      activeQuiz(k).forEach((_, i) => {
        total++;
        if (state.firstTry[`${k}#${i}`]) hits++;
      });
    });
    return { xp: state.xp, total, hits, badgeTotal: Object.keys(BADGES).length, badges: state.badges.length, name: state.name };
  },
};

const PLAY = {};  // Playground 代码池: id -> 源码

function mergeRegistry() {
  META = [...META_BASE, ...REGISTRY].sort((a, b) => a.order - b.order);
  REGISTRY.forEach((def) => {
    if (def.quiz && def.quiz.length) QUIZZES[def.key] = def.quiz;
    if (def.run) Object.assign(RUN, def.run);
    if (def.errs) Object.assign(ERRS, def.errs);
  });
}

/* ─────────────── 章节 ↔ 官方书导航表 ─────────────── */
const BOOK_NAV = {
  intro: { ch: "1",  name: "Getting Started 入门", url: "https://doc.rust-lang.org/book/ch01-00-getting-started.html" },
  ch1:   { ch: "3",  sec: "1", name: "变量与可变性", url: "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html" },
  ch2:   { ch: "3",  sec: "2", name: "数据类型", url: "https://doc.rust-lang.org/book/ch03-02-data-types.html" },
  ch3:   { ch: "3",  sec: "3", name: "函数", url: "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html" },
  ch4:   { ch: "3",  sec: "5", name: "控制流", url: "https://doc.rust-lang.org/book/ch03-05-control-flow.html" },
  ch5:   { ch: "4",  name: "Understanding Ownership 所有权", url: "https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html" },
  ch6:   { ch: "8",  sec: "2", name: "Storing UTF-8 Strings 字符串", url: "https://doc.rust-lang.org/book/ch08-02-strings.html" },
  ch7:   { ch: "8",  name: "Common Collections 集合", url: "https://doc.rust-lang.org/book/ch08-00-common-collections.html" },
  ch8:   { ch: "5",  name: "Using Structs 结构体", url: "https://doc.rust-lang.org/book/ch05-00-structs.html" },
  ch9:   { ch: "6",  name: "Enums and Pattern Matching 枚举与模式", url: "https://doc.rust-lang.org/book/ch06-00-enums.html" },
  ch10:  { ch: "6", sec: "1", name: "The Option Type", url: "https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html" },
  ch11:  { ch: "9",  name: "Error Handling 错误处理", url: "https://doc.rust-lang.org/book/ch09-00-error-handling.html" },
  final: { ch: "3~9", name: "基础概念复习", url: "https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html" },
  guess: { ch: "2",  name: "Programming a Guessing Game 猜数字游戏", url: "https://doc.rust-lang.org/book/ch02-00-guessing-game-tutorial.html" },
  ch12:  { ch: "13", sec: "1", name: "Closures 闭包", url: "https://doc.rust-lang.org/book/ch13-01-closures.html" },
  ch13:  { ch: "13", sec: "2", name: "Processing a Series of Items with Iterators", url: "https://doc.rust-lang.org/book/ch13-02-iterators.html" },
  ch14:  { ch: "10", name: "Generic Types, Traits, and Lifetimes", url: "https://doc.rust-lang.org/book/ch10-00-generics.html" },
  ch15:  { ch: "15", name: "Smart Pointers 智能指针", url: "https://doc.rust-lang.org/book/ch15-00-smart-pointers.html" },
  ch16:  { ch: "16", name: "Fearless Concurrency 无畏并发", url: "https://doc.rust-lang.org/book/ch16-00-concurrency.html" },
  ch17:  { ch: "17", name: "Async and Await 异步", url: "https://doc.rust-lang.org/book/ch17-00-async-await.html" },
  ch18:  { ch: "7 & 11", name: "Packages/Modules & 测试", url: "https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html" },
  advfinal: { ch: "10~17", name: "进阶全览", url: "https://doc.rust-lang.org/book/ch10-00-generics.html" },
  p1:   { ch: "12", name: "An I/O Project 命令行程序", url: "https://doc.rust-lang.org/book/ch12-00-an-io-project.html" },
  p2:   { ch: "12", name: "An I/O Project 命令行程序", url: "https://doc.rust-lang.org/book/ch12-00-an-io-project.html" },
  p3:   { ch: "16", sec: "2", name: "Message Passing", url: "https://doc.rust-lang.org/book/ch16-02-message-passing.html" },
  p4:   { ch: "21", name: "Final Project 多线程 Web 服务器", url: "https://doc.rust-lang.org/book/ch21-00-final-project-a-web-server.html" },
  p5:   { ch: "20", name: "Advanced Features 进阶特性", url: "https://doc.rust-lang.org/book/ch20-00-advanced-features.html" },
  snake: { ch: "—", name: "实战综合", url: "https://doc.rust-lang.org/book/" },
  httpd: { ch: "21", name: "Final Project 多线程 Web 服务器", url: "https://doc.rust-lang.org/book/ch21-00-final-project-a-web-server.html" },
  grand: { ch: "全文", name: "The Rust Programming Language", url: "https://doc.rust-lang.org/book/" },
};

function buildDynamicSections() {
  const main = $("#main");
  REGISTRY.forEach((def) => {
    const prevKey = def.prev || "";
    const sec = document.createElement("section");
    sec.className = "chapter";
    sec.id = def.key;

    const eyebrow = def.eyebrow || `徽章待领：${BADGES[def.key].icon} ${BADGES[def.key].name}`;
    let html = `
      <div class="ch-head">
        <div class="ch-eyebrow">${eyebrow}</div>
        <h2>${def.title}</h2>
      </div>
      ${def.html || ""}`;

    // 3.0 细节小节:插在正文之后、quiz 之前
    if (SECTIONS[def.key] && SECTIONS[def.key].length) {
      html += `<div class="detail-divider">📚 细节拆解</div>`;
      SECTIONS[def.key].forEach((s) => {
        html += `
        <div class="rsec" id="${s.id}">
          <div class="rsec-head">
            <span class="rsec-no">${s.no}</span>
            <h3 class="rsec-title">${s.title}</h3>
          </div>
          <div class="rsec-body">${s.html || ""}</div>
        </div>`;
      });
    }

    if (def.quiz && def.quiz.length) {
      html += `<div class="quiz-zone" data-quiz="${def.key}"></div>`;
    }
    html += `<div class="ch-banner" hidden></div>`;

    // 前后导航按钮(按 META 顺序计算)
    const idx = META.findIndex((m) => m.key === def.key);
    const prev = META[idx - 1];
    const next = META[idx + 1];
    html += `<div class="ch-nav">
      ${prev ? `<button class="btn ghost nav-prev" data-goto="${prev.key}">← ${prev.icon} ${prev.title}</button>` : "<span></span>"}
      ${next ? `<button class="btn ghost nav-next" data-goto="${next.key}">${next.icon} ${next.title} →</button>` : "<span></span>"}
    </div>`;

    sec.innerHTML = html;
    // 圣经导航:每章末尾自动挂上官方书对应章节链接
    const nav = BOOK_NAV[def.key];
    if (nav) {
      sec.insertAdjacentHTML("beforeend",
        `<div class="book-nav">📖 <b>圣经导航</b> · 本站对应《The Rust Programming Language》<a href="${nav.url}" target="_blank" rel="noopener">第 ${nav.ch} 章${nav.sec ? " " + nav.sec + " 节" : ""} · ${nav.name}</a> —— 英文免费在线,中文译本 <a href="https://kaisery.github.io/trpl-zh-cn/" target="_blank" rel="noopener">《Rust 程序设计语言》</a></div>`);
    }
    main.appendChild(sec);
    if (def.onRestore) sec.dataset.onRestore = "1";
  });
}

/* ───────────────────────── 语法高亮 ───────────────────────── */
const RUST_KW = "let|mut|fn|const|if|else|loop|while|for|in|break|continue|return|match|struct|enum|impl|trait|use|mod|pub|as|move|ref|dyn|unsafe|where|type|crate|self|Self|async|await|let";
const RUST_TYPES = "i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|str";
const PY_KW = "def|return|if|elif|else|for|while|in|import|from|class|pass|break|continue|lambda|with|as|is|not|and|or|del|global|raise|try|except|finally|assert|yield";
const PY_BI = "print|range|len|str|int|float|list|dict|set|tuple|type|isinstance|input|enumerate|zip|abs|min|max|sum|sorted";

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildRustRx() {
  return new RegExp([
    '("(?:\\\\.|[^"\\\\])*")',            // 1 字符串
    "('(?:\\\\.|[^'\\\\])*')",            // 2 字符
    "(//[^\\n]*)",                        // 3 注释
    "([A-Za-z_][A-Za-z0-9_]*!)",          // 4 宏 println!
    "\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b",     // 5 数字
    `\\b(${RUST_KW})\\b`,                  // 6 关键字
    "\\b(true|false)\\b",                 // 7 布尔
    "\\b([A-Z][A-Za-z0-9_]*)\\b",         // 8 大写开头类型
    `\\b(${RUST_TYPES})\\b`,               // 9 内置类型
    "([A-Za-z_][A-Za-z0-9_]*)(?=\\s*\\()",// 10 函数调用
  ].join("|"), "g");
}

function buildPyRx() {
  return new RegExp([
    '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')', // 1 字符串
    "(#[^\\n]*)",                          // 2 注释
    "\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b",      // 3 数字
    `\\b(${PY_KW})\\b`,                     // 4 关键字
    "\\b(True|False|None)\\b",             // 5 常量
    `\\b(${PY_BI})\\b`,                     // 6 内建
    "([A-Za-z_][A-Za-z0-9_]*)(?=\\s*\\()",  // 7 函数调用
  ].join("|"), "g");
}

const RUST_CLS = ["", "tk-str", "tk-str", "tk-cmt", "tk-macro", "tk-num", "tk-kw", "tk-bool", "tk-type", "tk-type", "tk-fn"];
const PY_CLS   = ["", "tk-str", "tk-cmt", "tk-num", "tk-kw", "tk-bool", "tk-bi", "tk-fn"];

function highlight(text, lang) {
  const rx = lang === "python" ? buildPyRx() : buildRustRx();
  const cls = lang === "python" ? PY_CLS : RUST_CLS;
  let out = "", last = 0, m;
  while ((m = rx.exec(text)) !== null) {
    if (m[0] === "") { rx.lastIndex++; continue; } // 零宽保护
    out += escapeHtml(text.slice(last, m.index));
    let ci = 0;
    for (let g = 1; g < m.length; g++) if (m[g] !== undefined) { ci = g; break; }
    out += `<span class="${cls[ci] || ""}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  out += escapeHtml(text.slice(last));
  return out;
}

function highlightAll(root = document) {
  $$("code[data-lang]", root).forEach((el) => {
    el.innerHTML = highlight(el.textContent, el.dataset.lang);
  });
}

/* ───────────────────────── HUD ───────────────────────── */
let shownLevel = -1;

function levelIdx() {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (state.xp >= l.at) idx = i; });
  return idx;
}

function updateHud() {
  const li = levelIdx();
  const cur = LEVELS[li];
  const next = LEVELS[li + 1];
  $("#lvlTitle").textContent = `Lv${li + 1} ${cur.title}`;
  const pct = next ? Math.min(100, ((state.xp - cur.at) / (next.at - cur.at)) * 100) : 100;
  $("#xpFill").style.width = pct + "%";
  $("#xpText").textContent = state.xp + " XP";
  const done = META.filter((m) => state.chapters[m.key]).length;
  $("#chProgress").textContent = `${done}/${META.length} 关`;
  document.title = `锈岛求生 · Lv${li + 1} ${cur.title}`;
  if (shownLevel !== -1 && li > shownLevel) {
    toast(`🎉 升级！Lv${li + 1} ${cur.title}`);
    ferrisSay(`升级啦——${cur.title}！继续保持 🦀`);
  }
  shownLevel = li;
}

function addXp(n) {
  state.xp += n;
  updateHud();
  save();
}

/* ───────────────────────── Toast ───────────────────────── */
function toast(text, icon = "🏅") {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = `${icon} ${text}`;
  $("#toastWrap").appendChild(t);
  setTimeout(() => { t.classList.add("out"); }, 2800);
  setTimeout(() => t.remove(), 3300);
}

/* ───────────────────────── 彩带 ───────────────────────── */
const FX_COLORS = ["#f74c00", "#ffb38a", "#ffd166", "#ff8a5c", "#9ce0a5", "#7fd4c9"];
const FX_EMOJI = ["🦀", "🎉", "⭐"];

function confetti(burst = 80) {
  const cvs = $("#fx");
  const ctx = cvs.getContext("2d");
  cvs.width = innerWidth; cvs.height = innerHeight;
  const parts = [];
  for (let i = 0; i < burst; i++) {
    parts.push({
      x: Math.random() * cvs.width,
      y: -30 - Math.random() * cvs.height * 0.25,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 2.2 + Math.random() * 3.4,
      size: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      color: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
      emoji: Math.random() < 0.14 ? FX_EMOJI[(Math.random() * FX_EMOJI.length) | 0] : null,
    });
  }
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.emoji) { ctx.font = "20px serif"; ctx.fillText(p.emoji, -10, 0); }
      else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
      }
      ctx.restore();
    });
    if (++frames < 250) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, cvs.width, cvs.height);
  })();
}

/* ───────────────────────── Ferris 漂浮助手 ───────────────────────── */
let bubbleTimer = null;
function ferrisSay(text) {
  const b = $("#ferrisBubble");
  b.textContent = text;
  b.classList.add("show");
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.remove("show"), 4200);
}

$("#ferrisFloat").addEventListener("click", () => {
  ferrisSay(TIPS[(Math.random() * TIPS.length) | 0]);
});

/* ───────────────────────── 侧栏与导航 ───────────────────────── */
function reqOf(def) { return def.req || null; }

function accessible(def) {
  if (state.chapters[def.key]) return true;
  const idx = META.findIndex((m) => m.key === def.key);
  const req = reqOf(def);
  if (req !== null) return !!state.chapters[req];
  return idx === 0 || !!state.chapters[META[idx - 1].key];
}

function buildSidebar() {
  const nav = $("#chapterNav");
  nav.innerHTML = "";
  let lastPart = null;
  META.forEach((m) => {
    if (m.partTitle && m.partTitle !== lastPart) {
      const h = document.createElement("div");
      h.className = "side-part";
      h.textContent = m.partTitle;
      nav.appendChild(h);
      lastPart = m.partTitle;
    }
    const el = document.createElement("div");
    el.className = "side-item";
    el.dataset.key = m.key;
    const locked = !accessible(m);
    const done = !!state.chapters[m.key];
    el.innerHTML = `<span>${m.icon}</span><span class="txt">${m.title}</span><span class="st">${
      done ? "✓" : locked ? "🔒" : "▶"
    }</span>`;
    if (locked) el.classList.add("locked");
    if (done) el.classList.add("done");
    el.addEventListener("click", () => {
      if (!accessible(m)) {
        ferrisSay("先通关上一章的小测验，我才能带你去那儿～🔒");
        el.classList.remove("shakeit"); void el.offsetWidth; el.classList.add("shakeit");
        return;
      }
      showChapter(m.key);
    });
    nav.appendChild(el);

    // 3.0 手风琴:有细节小节的章节展开小节列表
    if (SECTIONS[m.key] && SECTIONS[m.key].length) {
      const acc = document.createElement("div");
      acc.className = "side-acc";
      acc.dataset.for = m.key;
      if (state.current === m.key) acc.classList.add("open");
      SECTIONS[m.key].forEach((s) => {
        const a = document.createElement("a");
        a.className = "acc-link";
        a.href = "#" + s.id;
        a.dataset.ch = m.key;
        a.dataset.sec = s.id;
        a.textContent = `${s.no} ${s.title}`;
        a.addEventListener("click", (ev) => {
          ev.preventDefault();
          if (!accessible(m)) return;
          if (state.current !== m.key) showChapter(m.key);
          const target = document.getElementById(s.id);
          if (target) window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
        });
        acc.appendChild(a);
      });
      nav.appendChild(acc);
    }
  });
  const totalBadges = Object.keys(BADGES).length;
  $("#badgeCount").textContent = `(${state.badges.length}/${totalBadges})`;
  const wall = $("#badgeWall");
  wall.innerHTML = "";
  Object.entries(BADGES).forEach(([key, b]) => {
    const s = document.createElement("span");
    s.className = "bdg" + (state.badges.includes(key) ? " earned" : "");
    s.textContent = b.icon;
    s.title = state.badges.includes(key) ? `已解锁：${b.name}` : `未解锁：${b.name}`;
    wall.appendChild(s);
  });
}

function updateSidebarActive() {
  $$(".side-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.key === state.current);
    const m = META.find((x) => x.key === el.dataset.key);
    if (!m) return;
    const locked = !accessible(m);
    const done = !!state.chapters[m.key];
    el.classList.toggle("locked", locked);
    el.classList.toggle("done", done);
    el.querySelector(".st").textContent = done ? "✓" : locked ? "🔒" : "▶";
  });
}

function showChapter(key) {
  $$("section.chapter").forEach((s) => s.classList.remove("show"));
  const sec = document.getElementById(key);
  if (!sec) return;
  sec.classList.add("show");
  if (key === "grand") REGISTRY.find(m => m.key === key)?.onRestore?.();
  state.current = key;
  save();
  updateSidebarActive();
  buildSidebar();
  window.scrollTo({ top: 0, behavior: "auto" });
}

/* 3.0 小节滚动高亮 + 手风琴开合 */
function syncSectionSpy() {
  const acc = document.querySelector(`.side-acc[data-for="${state.current}"]`);
  if (acc && !acc.classList.contains("open")) acc.classList.add("open");
  // 关掉其他章的手风琴
  document.querySelectorAll(".side-acc.open").forEach((a) => {
    if (a.dataset.for !== state.current) a.classList.remove("open");
  });
  const visible = document.querySelectorAll(`#${state.current} .rsec`);
  if (!visible.length) return;
  let cur = null;
  visible.forEach((s) => {
    if (s.getBoundingClientRect().top <= 180) cur = s.id;
  });
  document.querySelectorAll(".acc-link").forEach((a) => {
    a.classList.toggle("on", a.dataset.sec === cur);
  });
}

function tryGoto(key) {
  const m = META.find((x) => x.key === key);
  if (!m || !accessible(m)) {
    ferrisSay("先通关上一章的小测验，下一站才开门哦～🔒");
    return;
  }
  showChapter(key);
}

/* 全局导航与领奖(事件委托,覆盖动态生成的按钮) */
document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-goto]");
  if (go) { tryGoto(go.dataset.goto); return; }
  const bgo = e.target.closest("[data-bgo]");
  if (bgo) { tryGoto(bgo.dataset.bgo); return; }
  const claim = e.target.closest("[data-claim]");
  if (claim) {
    const key = claim.dataset.claim;
    completeChapter(key, true);
    document.dispatchEvent(new CustomEvent("island:claim:" + key));
  }
});

$("#btnReset").addEventListener("click", () => {
  if (confirm("清空所有进度和徽章，从登岛重新开始？")) {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  }
});

/* ───────────────────────── 测验引擎 ───────────────────────── */
/* 3.0 章末快问快答:只渲染每章第一道选择题,其余退役让位给动手练习 */
const QUIZ_KEEP = ["intro","ch1","ch2","ch3","ch4","ch5","ch6","ch7","ch8","ch9","ch10","ch11","final","ch12","ch13","ch14","ch15","ch16","ch17","ch18","advfinal"];

function activeQuiz(key) {
  const items = QUIZZES[key] || [];
  return QUIZ_KEEP.includes(key) ? items.slice(0, 1) : items;
}

function renderQuizzes() {
  $$(".quiz-zone").forEach((zone) => {
    if (zone.dataset.rendered === "1") return;
    zone.dataset.rendered = "1";
    const key = zone.dataset.quiz;
    const items = activeQuiz(key);
    if (!items.length) return;
    const title = document.createElement("div");
    title.className = "quiz-title";
    title.innerHTML = `🦀 章末快问快答<span class="sub">${items.length} 题速答</span>`;
    zone.appendChild(title);

    items.forEach((item, i) => {
      zone.appendChild(buildQCard(key, item, i, items.length));
    });
  });
}

function buildQCard(key, item, i, total) {
  const qid = `${key}#${i}`;
  const card = document.createElement("div");
  card.className = "q-card" + (item.type === "compile" ? " compile" : "");
  card.dataset.qid = qid;

  const tag = document.createElement("span");
  tag.className = "q-tag";
  tag.textContent = `第 ${i + 1} / ${total} 题`;
  card.appendChild(tag);

  const qt = document.createElement("p");
  qt.className = "q-text";
  qt.textContent = item.q;
  card.appendChild(qt);

  if (item.code) {
    const pre = document.createElement("pre");
    pre.className = "q-code";
    pre.innerHTML = highlight(item.code, "rust");
    card.appendChild(pre);
  }

  const opts = document.createElement("div");
  opts.className = "q-opts";
  let selected = -1;

  item.opts.forEach((opt, oi) => {
    const b = document.createElement("button");
    b.className = "q-opt";
    b.type = "button";
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = "ABCD"[oi];
    const txt = document.createElement("span");
    txt.textContent = opt; // textContent 注入,天然防注入
    b.appendChild(letter);
    b.appendChild(txt);
    b.addEventListener("click", () => {
      if (card.dataset.locked === "1") return;
      selected = oi;
      $$(".q-opt", card).forEach((x) => x.classList.remove("sel", "wrong"));
      b.classList.add("sel");
    });
    opts.appendChild(b);
  });
  card.appendChild(opts);

  const foot = document.createElement("div");
  foot.className = "q-foot";
  const submit = document.createElement("button");
  submit.className = "q-submit";
  submit.textContent = "提交答案";
  const result = document.createElement("span");
  result.className = "q-result";
  foot.appendChild(submit);
  foot.appendChild(result);
  card.appendChild(foot);

  const exp = document.createElement("div");
  exp.className = "q-exp";
  exp.textContent = "💡 " + item.exp;
  card.appendChild(exp);

  submit.addEventListener("click", () => {
    if (card.dataset.locked === "1") return;
    if (selected < 0) {
      result.className = "q-result no";
      result.textContent = "先选一个答案再提交嘛～";
      return;
    }
    if (selected === item.ans) {
      card.dataset.locked = "1";
      const firstTry = !state.wrong[qid];
      if (!state.solved[qid]) {
        state.solved[qid] = true;
        if (firstTry) state.firstTry[qid] = true;
        const gain = firstTry ? (item.xp || 10) : 4;
        addXp(gain);
        result.className = "q-result ok";
        result.innerHTML = `✅ ${PRAISE[(Math.random() * PRAISE.length) | 0]} <i class="xp-float">+${gain} XP</i>`;
      } else {
        result.className = "q-result ok";
        result.textContent = "✅ 正确！";
      }
      const btn = $$(".q-opt", card)[item.ans];
      btn.classList.add("correct");
      $$(".q-opt", card).forEach((x) => (x.disabled = true));
      btn.classList.remove("sel");
      submit.disabled = true;
      exp.classList.add("show");
      ferrisSay(PRAISE[(Math.random() * PRAISE.length) | 0]);
      checkChapterDone(key);
    } else {
      state.wrong[qid] = true;
      save();
      const btn = $$(".q-opt", card)[selected];
      btn.classList.add("wrong");
      result.className = "q-result no";
      result.textContent = `❌ ${REGRET[(Math.random() * REGRET.length) | 0]}`;
    }
  });

  // 恢复存档:已答对的题直接锁定
  if (state.solved[qid]) {
    card.dataset.locked = "1";
    $$(".q-opt", card).forEach((x) => (x.disabled = true));
    $$(".q-opt", card)[item.ans].classList.add("correct");
    submit.disabled = true;
    exp.classList.add("show");
    result.className = "q-result ok";
    result.textContent = "✅ 已通过";
  }

  return card;
}

/* ───────────────────────── 通关 / 徽章 ───────────────────────── */
function checkChapterDone(key) {
  const items = activeQuiz(key);
  const quizDone = items.length === 0 || items.every((_, i) => state.solved[`${key}#${i}`]);
  const chEx = Object.values(EXERCISES).filter((e) => e.chapter === key);
  const exDone = chEx.length === 0 || chEx.every((e) => state.solvedEx[e.id]);
  if (quizDone && exDone) completeChapter(key, true);
}

function completeChapter(key, celebrate) {
  const firstTime = !state.chapters[key];
  state.chapters[key] = true;

  const def = META.find((m) => m.key === key) || {};

  if (celebrate && firstTime) {
    const badge = BADGES[key];
    if (badge && !state.badges.includes(key)) {
      state.badges.push(key);
      toast(`解锁徽章：${badge.icon} ${badge.name}`);
    }
    if (def.bonus) {
      addXp(def.bonus);
      toast(`项目通关奖励 +${def.bonus} XP`, "🎁");
    }
    confetti(70);
    ferrisSay(`徽章「${BADGES[key].name}」到手！🦀`);
  }
  save();
  buildSidebar();
  updateSidebarActive();
  updateHud();
  showBanner(key, celebrate && firstTime);

  if (key === "final") showCheckpoint();

  const reg = REGISTRY.find((r) => r.key === key);
  if (celebrate && reg && reg.onComplete) reg.onComplete();
}

function showBanner(key, fresh) {
  const sec = document.getElementById(key);
  if (!sec) return;
  const banner = $(".ch-banner", sec);
  if (!banner) return;
  const idx = META.findIndex((m) => m.key === key);
  const next = META[idx + 1];
  const badge = BADGES[key];
  banner.hidden = false;
  let html = "";
  if (key === "grand") {
    html = `<p>🏆 全岛通关！${badge.icon} <b>${badge.name}</b> 称号已入册——去领取你的终极证书吧！</p>`;
  } else if (next) {
    html = `<p>${fresh ? "🎉" : "✓"} 本关通关！徽章 <b>${badge.icon} ${badge.name}</b> 到手，下一站 <b>${next.icon} ${next.title}</b> 已解锁。</p><button class="btn" data-bgo="${next.key}">前往 ${next.icon} ${next.title} →</button>`;
  } else {
    html = `<p>🎓 通关！徽章 <b>${badge.icon} ${badge.name}</b> 到手。</p>`;
  }
  banner.innerHTML = html;
}

/* ───────────────────────── 基础篇通关凭证 ───────────────────────── */
function showCheckpoint() {
  const wrap = $("#gradCard");
  if (!wrap) return;
  // 基础篇统计:只数 intro + ch1~11 + final
  let basicQ = 0, basicHit = 0;
  ["intro", "ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8", "ch9", "ch10", "ch11", "final"].forEach((k) => {
    activeQuiz(k).forEach((_, i) => {
      basicQ++;
      if (state.firstTry[`${k}#${i}`]) basicHit++;
    });
  });
  wrap.classList.add("show");
  $("#cpXp").textContent = state.xp;
  $("#cpAcc").textContent = basicQ ? Math.round((basicHit / basicQ) * 100) + "%" : "0%";
  confetti(150);
  setTimeout(() => confetti(80), 700);
  ferrisSay("基础岛通关！进阶群岛见 🦀⛵");
}

/* ───────────────────────── 模拟控制台 ───────────────────────── */
async function runConsole(box, lines, mode, humanText) {
  const con = $(".console", box) || (() => {
    const c = document.createElement("div");
    c.className = "console";
    box.appendChild(c);
    return c;
  })();
  con.hidden = false;
  con.innerHTML = "";
  const cur = document.createElement("span");
  cur.className = "cur";
  con.appendChild(cur);

  const addLine = (text, cls) => {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    d.textContent = text;
    con.insertBefore(d, cur);
  };

  if (mode === "run") {
    addLine(`✓ 编译通过（${(0.2 + Math.random() * 0.5).toFixed(2)}s）`, "c-ok");
    await sleep(240);
    for (const line of lines) {
      addLine(line, "c-out");
      await sleep(160 + Math.random() * 180);
    }
  } else {
    addLine("✗ 编译失败 · rustc 拦住了你", "c-bad");
    await sleep(200);
    for (const line of lines) {
      addLine(line, "c-err");
      await sleep(75 + Math.random() * 60);
    }
    await sleep(160);
    addLine(humanText || "", "c-human");
  }
  cur.remove();
}

function setupRunners() {
  $$("[data-run]").forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", async () => {
      if (btn.dataset.busy) return;
      const box = btn.closest(".code-box");
      const id = btn.dataset.run;
      btn.dataset.busy = "1";
      const old = btn.textContent;
      btn.textContent = "⏳ 编译中…";
      await sleep(360 + Math.random() * 420);
      btn.textContent = old;
      delete btn.dataset.busy;
      runConsole(box, RUN[id] || [], "run");
    });
  });
  $$("[data-err]").forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", async () => {
      if (btn.dataset.busy) return;
      const box = btn.closest(".code-box");
      const data = ERRS[btn.dataset.err];
      if (!data) return;
      btn.dataset.busy = "1";
      const old = btn.textContent;
      btn.textContent = "⏳ rustc 巡查中…";
      await sleep(420 + Math.random() * 380);
      btn.textContent = old;
      delete btn.dataset.busy;
      ferrisSay("别怕报错，它其实是你的免费家教 🧑‍🏫");
      runConsole(box, data.lines, "err", data.human);
    });
  });
}

/* ───────────────────────── Playground 懒加载 ───────────────────────── */
function setupPlaygrounds() {
  $$("[data-pg]").forEach((wrap) => {
    if (wrap.dataset.wired) return;
    wrap.dataset.wired = "1";
    const id = wrap.dataset.pg;
    const code = PLAY[id];
    if (!code) return;
    const url = new URL("https://play.rust-lang.org/");
    url.search = new URLSearchParams({ version: "stable", mode: "debug", edition: "2021", code });
    const link = document.createElement("a");
    link.className = "pg-btn";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "在 Rust Playground 运行示例（新标签页）";
    wrap.appendChild(link);
  });
}

// v1 与 v2 共用存档键，保留旧卷仍然相同的五道题和已有经验。
function migrateProgress() {
  if (state.version === 2) return;
  const basics = META.filter(m => m.part === 1 && m.order < 12);
  const nextBasic = basics.find(m => !state.chapters[m.key]);
  const passedExam = activeQuiz("final").every((_, i) => state.solved[`final#${i}`]);
  if (nextBasic || !passedExam) {
    delete state.chapters.final;
    state.badges = state.badges.filter(key => key !== "final");
  }
  const current = META.find(m => m.key === state.current);
  if (!current || !accessible(current)) state.current = nextBasic?.key || "final";
  state.version = 2;
  save();
}

/* 3.0 为内联章节(ch1~ch5,intro,final 等)注入细节小节 */
function injectInlineSections() {
  Object.keys(SECTIONS).forEach((chKey) => {
    const chEl = document.getElementById(chKey);
    if (!chEl) return;
    // 跳过已注入的(动态章节在 buildDynamicSections 已处理)
    if (chEl.querySelector(".detail-divider")) return;
    const secs = SECTIONS[chKey];
    if (!secs || !secs.length) return;
    
    // 找到注入点:quiz-zone 之前,没有的话就找 ch-banner 或 ch-nav
    let anchor = chEl.querySelector(".quiz-zone");
    if (!anchor) anchor = chEl.querySelector(".ch-banner");
    if (!anchor) anchor = chEl.querySelector(".ch-nav");
    if (!anchor) return;
    
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="detail-divider">📚 细节拆解</div>`;
    secs.forEach((s) => {
      wrapper.innerHTML += `
        <div class="rsec" id="${s.id}">
          <div class="rsec-head">
            <span class="rsec-no">${s.no}</span>
            <h3 class="rsec-title">${s.title}</h3>
          </div>
          <div class="rsec-body">${s.html || ""}</div>
        </div>`;
    });
    
    // 逐个插入(不能一次 innerHTML,因为 anchor 前面)
    const frag = document.createElement("div");
    frag.innerHTML = wrapper.innerHTML;
    while (frag.firstChild) {
      chEl.insertBefore(frag.firstChild, anchor);
    }
  });

  // 圣经导航:META_BASE 内联章节(intro/ch1~ch11/final/guess 不在此列)也补挂
  META.filter((m) => !REGISTRY.some((r) => r.key === m.key)).forEach((m) => {
    const chEl = document.getElementById(m.key);
    const nav = BOOK_NAV[m.key];
    if (!chEl || !nav || chEl.querySelector(".book-nav")) return;
    chEl.insertAdjacentHTML("beforeend",
      `<div class="book-nav">📖 <b>圣经导航</b> · 本站对应《The Rust Programming Language》<a href="${nav.url}" target="_blank" rel="noopener">第 ${nav.ch} 章${nav.sec ? " " + nav.sec + " 节" : ""} · ${nav.name}</a> —— 英文免费在线,中文译本 <a href="https://kaisery.github.io/trpl-zh-cn/" target="_blank" rel="noopener">《Rust 程序设计语言》</a></div>`);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  try {
  mergeRegistry();
  migrateProgress();
  buildDynamicSections();
  injectInlineSections();

  // 3.0 动手练习引擎点火
  if (window.RUST_EX && typeof window.RUST_EX.init === "function") {
    window.RUST_EX.init();
  }

  highlightAll();
  renderQuizzes();
  setupRunners();
  setupPlaygrounds();
  buildSidebar();
  document.addEventListener("scroll", syncSectionSpy, { passive: true });
  syncSectionSpy();

  // 恢复已通关章节的横幅 / 凭证 / 项目自定义钩子
  META.forEach((m) => {
    if (state.chapters[m.key]) showBanner(m.key, false);
  });
  if (state.chapters.final) showCheckpoint();
  REGISTRY.forEach((def) => {
    if (state.chapters[def.key] && def.onRestore) def.onRestore();
  });

  const startKey = META.some((m) => m.key === state.current) ? state.current : "intro";
  showChapter(startKey);
  updateHud();

  setTimeout(() => {
    ferrisSay(state.chapters.intro ? "欢迎回来，老朋友 🦀" : "欢迎登岛！我是你的向导 Ferris，点我随时聊天～");
  }, 900);
  } catch (e) {
    console.error("[3.0] init error:", e.message, e.stack);
  }
});

})();
