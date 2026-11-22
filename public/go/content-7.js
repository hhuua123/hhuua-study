/* ═══════════════════════════ Go 训练场 · 专题四(字符串与输入) + 专题六(切片深潜与指针) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 专题四 · 字符串与输入 ══════════ */
A.registerTopic({
  key: "strings", order: 4, part: 3, partTitle: "第二部分 · 语法进阶", icon: "🧵", title: "字符串与输入",
  eyebrow: "专题四 · 通关徽章:🧵 字符串法师",
  badge: { icon: "🧵", name: "字符串法师" },

  html: `
  <p class="lead">真实程序天天和文字、和用户打交道。这一关补上两块刚需:<b>字符串处理</b>(Go 的中文坑比你想的深)和<b>用户输入</b>(之前一直没敢碰,现在本地真跑)。学完你能写出第一个<b>交互程序</b>——猜数字游戏。</p>

  <h3 class="sec-title">字符串的真身:只读的字节串</h3>
  <div class="gcode"><div class="gbar"><span>len 与索引的真相</span></div><pre><code>s := "hello"

fmt.Println(len(s))   // 5    ——数的是「字节」
fmt.Println(s[0])     // 104  ——'h' 的字节值,不是字母 h!
fmt.Println(s[1:3])   // "el" ——切片语法切字符串,含头不含尾</code></pre></div>
  <div class="warn">
    <h4>⚠️ 中文必踩的坑(现在踩,以后不疼)</h4>
    <p>Go 字符串按 <b>UTF-8 字节</b>存储:一个汉字占 <b>3 个字节</b>!所以 <code class="ic">len("你好")</code> 是 <b>6</b>,不是 2。想把字符串按<b>人类字符</b>(rune)处理,用 <code class="ic">for range</code> 遍历——它会自动按字符走:</p>
    <div class="gcode"><div class="gbar"><span>rune:人类视角的字符</span></div><pre><code>for _, c := range "你好" {
	fmt.Println(c)   // 你   好 ——rune 遍历,一个字符一个字符来
}</code></pre></div>
  </div>
  <div class="note">
    <h4>🐹 另一条铁律:字符串只读</h4>
    <p><code class="ic">s[0] = 'H'</code> 直接编译报错——字符串<b>不可修改</b>。想要"改",其实是拿旧字符串<b>拼一个新的</b>:<code class="ic">s = "H" + s[1:]</code>。Go 不给你原地改字的机会,宁可让你新建。</p>
  </div>

  <div class="exslot" data-ex="st-1"></div>
  <div class="exslot" data-ex="st-2"></div>

  <h3 class="sec-title">strings 工具箱:五件常用兵器</h3>
  <div class="gcode"><div class="gbar"><span>import "strings"</span></div><pre><code>strings.ToUpper("go")            // "GO"
strings.Contains("hello", "ell") // true ——包含吗?
strings.Split("a,b,c", ",")      // ["a" "b" "c"] → 切片!
strings.Join([]string{"a","b"}, "-")  // "a-b"
strings.Fields("go is fun")     // ["go" "is" "fun"] 按空白自动切(切香肠神器)</code></pre></div>

  <div class="exslot" data-ex="st-3"></div>

  <h3 class="sec-title">strconv:文字 ↔ 数字互相变身</h3>
  <div class="gcode"><div class="gbar"><span>import "strconv"</span></div><pre><code>n, err := strconv.Atoi("42")    // 文字 → 数字(顺便交一张错误单)
if err != nil {                  // "42a" 变不了,err 就不空
	fmt.Println("不是数字:", err)
}
s := strconv.Itoa(42)           // 数字 → 文字 "42"</code></pre></div>
  <p>错误处理下一部分才细讲,这里先记住姿势:<b>Atoi 永远交两件货,接了 err 就查一查</b>——用户输入的东西,永远可能是乱七八糟的。</p>

  <div class="exslot" data-ex="st-4"></div>
  <div class="exslot" data-ex="st-5"></div>

  <h3 class="sec-title">用户输入:程序长出耳朵 🏠</h3>
  <div class="gcode"><div class="gbar"><span>本地运行版(Playground 不支持键盘输入)</span></div><pre><code>import "fmt"

var guess int
fmt.Print("猜一个数:")
fmt.Scan(&guess)          // & 取遥控器——Scan 顺着遥控器把用户敲的数写进 guess
fmt.Println("你猜的是:", guess)</code></pre></div>
  <p>还记得专题五的指针吗?<code class="ic">Scan(&guess)</code> 把 guess 的<b>遥控器</b>递给 Scan,它才能把值<b>写进真身</b>。输入输出的底层,全是遥控器在干活。</p>

  <h3 class="sec-title">🎯 专题四 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="st-b1"></div>
  <div class="exslot" data-ex="st-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题四心法</div>
    <ul>
      <li>字符串按 UTF-8 字节存:len("你好")==6;按人类字符用 for range(rune)</li>
      <li>字符串只读:改 = 拼新的("H" + s[1:])</li>
      <li>strings 五兵器 + strconv.Atoi/Itoa(数字文字互变)</li>
      <li>fmt.Scan(&x) 听用户说话——& 递遥控器</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "st-1", kind: "predict", xp: 10, title: "len 和 s[0] 的真相",
      task: `记住开头的规矩再答:<span class="hl">打印什么?</span>`,
      given: "s := \"hello\"\nfmt.Println(len(s), s[0])",
      expected: "5 104",
      ref: "s := \"hello\"\nfmt.Println(len(s), s[0])   // len 数字节=5;s[0] 是 'h' 的字节值 104",
      refNote: "s[0] 打出来是 104——'h' 在字节世界的编号。想打出字母本身,得转成字符:fmt.Println(string(s[0])) 才是 h。",
    },
    {
      id: "st-2", kind: "predict", xp: 10, title: "中文的字节陷阱",
      task: `len 按<b>字节</b>数,range 按 <b>Unicode 码点</b>走，%c 把码点显示成字符。<span class="hl">三行输出打出来。</span>`,
      given: "fmt.Println(len(\"你好\"))\nfor _, c := range \"你好\" {\n\tfmt.Printf(\"%c\\n\", c)\n}",
      expected: "6\n你\n好",
      ref: "fmt.Println(len(\"你好\"))   // 6:每个汉字 3 个 UTF-8 字节\nfor _, c := range \"你好\" {\n\tfmt.Printf(\"%c\\n\", c)   // range 自动按 rune(字符)走:你、好\n}",
      refNote: "同一句\"你好\":len 看见 6 个字节,range 看见 2 个 Unicode 码点。处理中文记得用 range——这条坑踩明白,以后字符串统计类 bug 少一半。",
    },
    {
      id: "st-3", kind: "blank", xp: 10, mini: true, title: "判断包含",
      task: `程序想知道句子里有没有 "go"。<span class="hl">把判断那行补出来</span>(s 变量已给,结果放进 ok)。`,
      given: "s := \"i love go\"\nok := ____\nfmt.Println(ok)   // 应打印 true",
      placeholder: "strings.____",
      checks: [
        { label: "用了 strings.Contains", hint: "写法:strings.Contains(s, \"go\") —— Contains(在哪找, 找什么)。", test: (s) => /strings\.Contains\s*\(\s*\w+\s*,\s*"go"\s*\)/.test(s) },
      ],
      ref: "strings.Contains(s, \"go\")",
      refNote: "Contains 像盖章检查:句子里有就 true,没有就 false。配套五件兵器记全:ToUpper / Contains / Split / Join / Fields。",
    },
    {
      id: "st-4", kind: "write", xp: 10, title: "动手写:文字变数字",
      task: `把用户风格输入的 "42" 变成数字再翻倍打印(应得 <b>84</b>):用 <code class="ic">strconv.Atoi</code> 转换,转换完<b>必须检查 err</b>,出错就打印"不是数字"。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tinput := \"42\"\n\n\t// Atoi 转换 + 检查 err + 翻倍打印\n\n}",
      checks: [
        { label: "用 strconv.Atoi 转换", hint: "n, err := strconv.Atoi(input)", test: (s) => /strconv\.Atoi\s*\(/.test(s) },
        { label: "检查了 err", hint: "if err != nil { 打印提示;return }", test: (s) => /if\s+err\s*!=\s*nil/.test(s) },
        { label: "出错分支有提示", hint: "fmt.Println(\"不是数字:\", err)", test: (s) => /if[\s\S]*fmt\.Print(ln|f)\s*\([^)]*err/.test(s) },
        { label: "成功后翻倍打印", hint: "fmt.Println(n * 2) → 84", test: (s) => /fmt\.Print(ln|f)\s*\(\s*\w*\s*\w+\s*\*\s*2|n\s*\*\s*2/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tinput := \"42\"\n\n\tn, err := strconv.Atoi(input)\n\tif err != nil {\n\t\tfmt.Println(\"不是数字:\", err)\n\t\treturn\n\t}\n\tfmt.Println(n * 2)   // 84\n}",
      refNote: "把 input 改成 \"42a\" 再跑一次,亲眼看 err 分支上岗——用户输入永远是脏的,转换必须带安检。",
    },
    {
      id: "st-5", kind: "fix", xp: 10, title: "字符串不可改",
      task: `想把 hello 首字母大写,编译器当场拒绝。<span class="hl">把修正后的那行打出来</span>(用拼接造一个新字符串)。`,
      given: "s := \"hello\"\ns[0] = 'H'\nfmt.Println(s)",
      errText: "cannot assign to s[0] (neither addressable nor a map index expression)",
      checks: [
        { label: "不再原地改 s[0]", hint: "s[0] = 'H' 这行整个删掉——字符串是只读的。", test: (s) => !/s\[0\]\s*=/.test(s) },
        { label: "用拼接造了新字符串", hint: "s = \"H\" + s[1:] ——头接新字母,尾巴切旧字符串的。", test: (s) => /"H"\s*\+\s*s\s*\[\s*1\s*:\s*\]/.test(s) },
      ],
      replaceLine: "s[0] = 'H'",
      ref: "s = \"H\" + s[1:]",
      refNote: "s[1:] 是从第 1 个字节切到末尾(\"ello\")。头挂上 'H',拼出 \"Hello\"——Go 的哲学:改不了就新建,又安全又省心。",
    },

    /* ── 大作业 ── */
    {
      id: "st-b1", kind: "big", xp: 30, title: "大作业① 单词统计器",
      task: `统计一句话里每个词出现几次:<code class="ic">text := "go is fun go is fast"</code>(直接复制);用 <code class="ic">strings.Fields</code> 切词,用 map + 零值技巧计数,最后打印整个 map(应得 <code>map[fast:1 fun:1 go:2 is:2]</code>,顺序可能不同)。imports 已备好:fmt、strings。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\ttext := \"go is fun go is fast\"\n\n\t// ① Fields 切词 → ② map 计数 → ③ 打印\n\n}",
      checks: [
        { label: "用 strings.Fields 切词", hint: "words := strings.Fields(text) ——按空白自动切,多余的空格也不怕。", test: (s) => /strings\.Fields\s*\(/.test(s) },
        { label: "创建了 map[string]int", hint: "m := make(map[string]int)", test: (s) => /make\s*\(\s*map\s*\[\s*string\s*\]\s*int\s*\)/.test(s) || /map\s*\[\s*string\s*\]\s*int\s*\{/.test(s) },
        { label: "range 遍历 + m[w]++ 零值计数", hint: "for _, w := range words { m[w]++ }", test: (s) => /\brange\b/.test(s) && /\[\s*\w+\s*\]\s*\+\+/.test(s) },
        { label: "打印了统计结果", hint: "fmt.Println(m)", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\ttext := \"go is fun go is fast\"\n\n\twords := strings.Fields(text)\n\tm := make(map[string]int)\n\tfor _, w := range words {\n\t\tm[w]++\n\t}\n\tfmt.Println(m)   // map[fast:1 fun:1 go:2 is:2]\n}",
      refNote: "Fields 比 Split(\"\") 高明:不管中间隔几个空格、有没有 tab,统统切干净。map 零值 + ++ 的组合在专题三练过——现在它俩加上了字符串兵器,凑齐了词频统计的全部零件。",
    },
    {
      id: "st-b2", kind: "big", localOnly: true, xp: 30, title: "大作业② 猜数字游戏(本地运行版 🏠)",
      task: `经典中的经典,交互程序第一练:①<code class="ic">secret := rand.Intn(100)</code> 造一个 0~99 的随机数;②<code class="ic">for</code> 循环里用 <code class="ic">fmt.Scan(&guess)</code> 读用户猜测;③猜小了提示「小了」、猜大了提示「大了」、猜中提示「猜中了!」并 break。🏠 <b>本地运行版</b>(Playground 不支持键盘输入):本地 go run 亲自玩几局!`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"math/rand\"\n)\n\nfunc main() {\n\tsecret := rand.Intn(100)\n\tfmt.Println(\"我心里想了个 0~99 的数,猜猜看\")\n\n\t// for 循环:Scan 读入 → 大小判断 → 猜中 break\n\n}",
      checks: [
        { label: "造了随机数", hint: "secret := rand.Intn(100) ——scaffold 里已备好,保留即可。", test: (s) => /rand\.Intn\s*\(/.test(s) },
        { label: "用 Scan 读入用户猜测", hint: "fmt.Scan(&guess) ——& 别忘了,不然猜不进去!", test: (s) => /fmt\.Scan\s*\(\s*&\s*\w+/.test(s) },
        { label: "三种比较齐全(< > ==)", hint: "if guess < secret 提示小了 / else if guess > secret 提示大了 / 相等猜中。", test: (s) => /<\s*\w+/.test(s) && />\s*\w+/.test(s) && (/==\s*\w+/.test(s) || /else\s*\{/.test(s)) },
        { label: "猜中后 break 出循环", hint: "相等分支里 fmt.Println(\"猜中了!\") 然后 break。", test: (s) => /==[\s\S]*break|break/.test(s) },
        { label: "提示语都打印了", hint: "小了/大了/猜中了至少三句输出(else if 分支里 Println)。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 3 },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"math/rand\"\n)\n\nfunc main() {\n\tsecret := rand.Intn(100)\n\tfmt.Println(\"我心里想了个 0~99 的数,猜猜看\")\n\n\tfor {\n\t\tvar guess int\n\t\tfmt.Print(\"你的猜测:\")\n\t\tif _, err := fmt.Scan(&guess); err != nil {\n\t\t\tfmt.Println(\"输入结束或格式错误，请输入整数后再试\")\n\t\t\treturn\n\t\t}\n\n\t\tif guess < secret {\n\t\t\tfmt.Println(\"小了,再大点\")\n\t\t} else if guess > secret {\n\t\t\tfmt.Println(\"大了,再小点\")\n\t\t} else {\n\t\t\tfmt.Println(\"猜中了!就是\", secret)\n\t\t\tbreak\n\t\t}\n\t}\n}",
      refNote: "for 无限循环 + Scan 读入 + 三路判断 + break 逃生——流程控制和输入的第一次全面实战。这就是 A Tour of Go 的招牌项目,你现在独立写出来了。本地跑一局,感受自己的程序「长出了耳朵」。",
    },
  ],
});

/* ══════════ 专题六 · 切片深潜与指针 ══════════ */
A.registerTopic({
  key: "deep", order: 6, part: 3, icon: "🔬", title: "切片深潜与指针",
  eyebrow: "专题六 · 通关徽章:🔬 深潜行家",
  badge: { icon: "🔬", name: "深潜行家" },

  html: `
  <p class="lead">专题三学过切片的「用法」,这一关潜到<b>水面之下</b>:切片其实是<b>一扇窗,不是一座房</b>——窗开在底层数组上,开窗的人多了,看到的却是<b>同一间房</b>。这一关还有指针接收器的完全体、struct 嵌入。学完你写 Go 才算「知其所以然」。</p>

  <h3 class="sec-title">切片的真身:窗户三件套</h3>
  <div class="note">
    <h4>🐹 每个切片都由三样东西构成</h4>
    <p><b>① 指向哪片内存</b>(底层数组的位置)+ <b>② len</b>(看到几个元素)+ <b>③ cap</b>(这片内存最多还剩几个)。切片<b>不复制数据</b>——它只是贴在数组上的一扇窗。所有「灵异事件」,都因为忘了这一点。</p>
  </div>
  <div class="gcode"><div class="gbar"><span>窗户共享实验</span></div><pre><code>a := []int{1, 2, 3, 4}

b := a[1:3]        // b 是开在同一片内存上的新窗(看到 2、3)

b[0] = 99          // 顺着 b 的窗改了房里的东西……

fmt.Println(a)    // [1 99 3 4] ——a 这扇窗看到的,也变了!</code></pre></div>
  <div class="wgslot" data-wg="slicer"></div>
  <div class="warn">
    <h4>⚠️ 共享是特性,不是 bug——但会咬人</h4>
    <p>切片传进函数,函数里改了,外面也能看见——因为传的是<b>窗</b>,不是房。想要<b>完全独立</b>的副本,用 <code class="ic">copy(dst, src)</code> 造一座新房再搬进去:</p>
    <div class="gcode"><div class="gbar"><span>copy:正经搬家</span></div><pre><code>dst := make([]int, len(a))
copy(dst, a)       // 从 a 搬到 dst:从此两间房,互不干扰
dst[0] = 999       // 只影响 dst,a 安然无恙</code></pre></div>
  </div>

  <div class="exslot" data-ex="dp-1"></div>
  <div class="exslot" data-ex="dp-2"></div>
  <div class="exslot" data-ex="dp-3"></div>
  <div class="exslot" data-ex="dp-4"></div>

  <h3 class="sec-title">指针接收器:为什么方法要用 *Account</h3>
  <p>专题五讲过:函数收参数是<b>复印</b>。方法同理——<b>值接收器</b> <code class="ic">func (a Account) Deposit()</code> 改的是复印件,存了等于没存;想让方法<b>改真身</b>,必须用<b>指针接收器</b> <code class="ic">func (a *Account) Deposit()</code>,星号 = 拿遥控器干活:</p>
  <div class="gcode"><div class="gbar"><span>值接收器 vs 指针接收器</span></div><pre><code>type Account struct{ Balance float64 }

func (a Account) DepositV(x float64) {   // 收复印件
	a.Balance += x                       // 改了个寂寞
}

func (a *Account) DepositP(x float64) {  // 拿遥控器
	a.Balance += x                       // 改的是真身!
}</code></pre></div>
  <p>经验法则一句话:<b>方法要改数据 → 必须指针接收器;只是读 → 值接收器</b>。同一类型的方法最好统一用一种(改数据就全用指针)。</p>

  <div class="exslot" data-ex="dp-5"></div>

  <h3 class="sec-title">struct 嵌入:Go 版的「继承」</h3>
  <div class="gcode"><div class="gbar"><span>embedding:把一个 struct 塞进另一个</span></div><pre><code>type Engine struct{ Power int }

func (e Engine) Start() {
	fmt.Println("引擎启动,功率", e.Power)
}

type Car struct {
	Engine        // 只写字段名 = 嵌入!Engine 的字段和方法都「借」给 Car
	Brand string
}

func main() {
	c := Car{Engine: Engine{Power: 300}, Brand: "Go牌"}
	c.Start()   // Engine 的方法被「提升」,Car 直接点用!
	fmt.Println(c.Power)   // 字段也提升:c.Power
}</code></pre></div>
  <div class="note">
    <h4>🐹 嵌入 ≠ 继承</h4>
    <p>Go 官方从不叫它继承——没有父子类、没有多态重写,只是<b>把内层的东西抬升到外层方便点用</b>。想让 Car 的引擎换成别的?换个嵌入类型就行,比继承树灵活得多。</p>
  </div>

  <div class="exslot" data-ex="dp-6"></div>

  <h3 class="sec-title">🎯 专题六 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="dp-b1"></div>
  <div class="exslot" data-ex="dp-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题六心法</div>
    <ul>
      <li>切片 = 贴在底层数组上的窗(指针+len+cap),共享数据</li>
      <li>要独立副本:copy 搬家,别再开窗</li>
      <li>方法改真身 → 指针接收器 (a *Account);只读 → 值接收器</li>
      <li>struct 嵌入:字段和方法自动提升,是组合不是继承</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "dp-1", kind: "predict", xp: 10, title: "窗户共享实验",
      task: `b 是 a 上开的新窗,顺着 b 改了一个值。<span class="hl">Println(a) 打印什么?</span>`,
      given: "a := []int{1, 2, 3, 4}\nb := a[1:3]\nb[0] = 99\nfmt.Println(a)",
      expected: "[1 99 3 4]",
      ref: "a := []int{1, 2, 3, 4}\nb := a[1:3]     // b 看到 a[1]、a[2](即 2、3)\nb[0] = 99       // b[0] 就是 a[1]——同一间房!\nfmt.Println(a)  // [1 99 3 4]",
      refNote: "b[0] 不是新数组的第一个,是 a[1] 本尊。切片赋值/传参传的都是「窗」,改窗内看到的东西 = 改原房。想要隔离,下一题的 copy 上场。",
    },
    {
      id: "dp-2", kind: "predict", xp: 10, title: "子切片的范围",
      task: `a[1:3] 含头不含尾。<span class="hl">len(b) 和 b[0] 各是多少?</span>`,
      given: "a := []int{10, 20, 30, 40}\nb := a[1:3]\nfmt.Println(len(b), b[0])",
      expected: "2 20",
      ref: "a := []int{10, 20, 30, 40}\nb := a[1:3]   // 从下标 1 切到下标 3 之前:看到 20、30\nfmt.Println(len(b), b[0])   // len=2;b[0] 对应 a[1]=20",
      refNote: "含头不含尾的老规矩在切片上原样适用:b[0] 和 a[1] 是同一格。切片表达式是 Go 里最常见的「开窗」操作,值得吃透。",
    },
    {
      id: "dp-3", kind: "fix", xp: 10, title: "存了钱却没到账",
      task: `编译能过、跑起来不报错,但钱<b>没存进去</b>——Deposit 用了值接收器,改的是复印件。把接收器修成指针接收器(其余不动)。`,
      given: "type Account struct{ Balance float64 }\n\nfunc (a Account) Deposit(x float64) {\n\ta.Balance += x\n}\n\nfunc main() {\n\tacc := Account{Balance: 100}\n\tacc.Deposit(50)\n\tfmt.Println(acc.Balance)   // 还是 100!\n}",
      scaffold: "type Account struct{ Balance float64 }\n\nfunc (a Account) Deposit(x float64) {\n\ta.Balance += x\n}\n\nfunc main() {\n\tacc := Account{Balance: 100}\n\tacc.Deposit(50)\n\tfmt.Println(acc.Balance)\n}",
      checks: [
        { label: "接收器改成了指针 (*Account)", hint: "func (a *Account) Deposit(x float64) ——加个星号,拿遥控器。", test: (s) => /func\s*\(\s*\w+\s+\*?Account\s*\)\s+Deposit/.test(s) && /\*Account/.test(s) },
        { label: "值接收器已清除", hint: "func (a Account) Deposit 这种写法不能再出现。", test: (s) => !/\(\s*\w+\s+Account\s*\)\s+Deposit/.test(s) },
        { label: "main 的调用和打印保持原样", hint: "acc.Deposit(50) 和 Println(acc.Balance) 不用动——Go 自动取遥控器传给指针方法。", test: (s) => /acc\.Deposit\s*\(\s*50\s*\)/.test(s) && /fmt\.Print(ln|f)\s*\(\s*acc\.Balance/.test(s) },
      ],
      ref: "type Account struct{ Balance float64 }\n\nfunc (a *Account) Deposit(x float64) {\n\ta.Balance += x\n}\n\nfunc main() {\n\tacc := Account{Balance: 100}\n\tacc.Deposit(50)\n\tfmt.Println(acc.Balance)   // 150 ——真到账了!\n}",
      refNote: "加一个星号,余额 100 变 150。这是真实项目里最隐蔽的一类 bug:不崩、不报错,只是「数据没变」。经验法则:改数据的方法,接收器一律带星号。修好后本地跑一遍,亲眼看钱到账。",
    },
    {
      id: "dp-4", kind: "blank", xp: 10, mini: true, title: "独立副本怎么造",
      task: `想要一份和 a 完全独立的新切片(改它不影响 a),把造副本那行补出来(dst 已创建)。`,
      given: "a := []int{1, 2, 3}\ndst := make([]int, len(a))\n____\ndst[0] = 999   // 只影响 dst,a 安然无恙\nfmt.Println(a)",
      placeholder: "copy(…)",
      checks: [
        { label: "用 copy 搬家", hint: "copy(dst, a) ——从 a 搬到 dst,目标在前,来源在后。", test: (s) => /copy\s*\(\s*\w+\s*,\s*\w+\s*\)/.test(s) },
      ],
      ref: "copy(dst, a)",
      refNote: "copy(目标, 来源)——注意方向别记反。copy 之后 dst 是搬进新房的家具清单,砸了 dst 的桌子,a 家的桌子毫发无损。",
    },
    {
      id: "dp-5", kind: "predict", xp: 10, title: "方法提升",
      task: `Car 嵌入了 Engine,直接点用 Engine 的方法。<span class="hl">打印什么?</span>`,
      given: "type Engine struct{ Power int }\n\nfunc (e Engine) Start() {\n\tfmt.Println(\"引擎启动\")\n}\n\ntype Car struct {\n\tEngine\n\tBrand string\n}\n\nfunc main() {\n\tc := Car{Engine: Engine{Power: 300}, Brand: \"Go牌\"}\n\tc.Start()\n\tfmt.Println(c.Power)\n}",
      expected: "引擎启动\n300",
      ref: "…\n\tc.Start()          // Engine 的方法被提升,Car 直接用\n\tfmt.Println(c.Power)   // 字段也提升 → 300",
      refNote: "嵌入的字段和方法自动「抬」到外层:c.Start()、c.Power 都能直接点——好像这些本来就长在 Car 身上。这就是 Go 的组合复用哲学。",
    },
    {
      id: "dp-6", kind: "write", xp: 10, title: "动手写:引擎与车",
      task: `①定义 <code class="ic">Engine</code> struct(字段 <b>Power int</b>)和方法 <code class="ic">Start()</code>(打印"引擎启动");②定义 <code class="ic">Car</code> struct,<b>嵌入 Engine</b>,加字段 <b>Brand string</b>;③main 里造一辆车,调用 <code class="ic">c.Start()</code>(提升方法)并打印 <code class="ic">c.Power</code>。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Engine + Start 方法\n\n// ② Car 嵌入 Engine\n\nfunc main() {\n\t// ③ 造车、Start、打印 Power\n\n}",
      checks: [
        { label: "定义了 Engine 和它的 Start 方法", hint: "type Engine struct { Power int };func (e Engine) Start() { … }", test: (s) => /type\s+Engine\s+struct/.test(s) && /func\s*\(\s*\w+\s+Engine\s*\)\s+Start/.test(s) },
        { label: "Car 嵌入了 Engine", hint: "type Car struct { Engine; Brand string } ——只写字段名就是嵌入。", test: (s) => /type\s+Car\s+struct\s*\{[\s\S]*\bEngine\b/.test(s) },
        { label: "main 里用提升方法 c.Start()", hint: "c := Car{…};c.Start()", test: (s) => /c\.Start\s*\(\s*\)/.test(s) || /\.Start\s*\(\s*\)/.test(s) },
        { label: "打印了提升字段 Power", hint: "fmt.Println(c.Power)", test: (s) => /\.Power/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Engine struct {\n\tPower int\n}\n\nfunc (e Engine) Start() {\n\tfmt.Println(\"引擎启动\")\n}\n\ntype Car struct {\n\tEngine\n\tBrand string\n}\n\nfunc main() {\n\tc := Car{Engine: Engine{Power: 300}, Brand: \"Go牌\"}\n\tc.Start()\n\tfmt.Println(c.Power)\n}",
      refNote: "嵌入一行,字段方法全提升——复用不靠家谱靠组合。造好这辆 Go 牌,下一关去标准库挑真家伙。",
    },

    /* ── 大作业 ── */
    {
      id: "dp-b1", kind: "big", xp: 30, title: "大作业① 切片手术台",
      task: `把共享与独立演给你自己看:a := []int{1,2,3,4,5,6}(直接复制);①用切片表达式开窗 <code class="ic">b := a[1:4]</code>,改 <code class="ic">b[0]</code> 后打印 a(看联动);②用 <code class="ic">copy</code> 造独立副本 c,改 <code class="ic">c[0]</code> 后再打印 a(看隔离)。三处打印都要有。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ta := []int{1, 2, 3, 4, 5, 6}\n\n\t// ① 开窗改 → 打印 a\n\t// ② copy 造独立副本 → 改 → 打印 a\n\n}",
      checks: [
        { label: "用切片表达式开了窗", hint: "b := a[1:4] ——含头不含尾,看到 2、3、4。", test: (s) => /a\s*\[\s*1\s*:\s*4\s*\]/.test(s) },
        { label: "顺着窗改了值并打印 a", hint: "b[0] = 99;fmt.Println(a) ——看到联动了吗?", test: (s) => /b\s*\[\s*0\s*\]\s*=/.test(s) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 1 },
        { label: "用 copy 造了独立副本", hint: "c := make([]int, len(a));copy(c, a)", test: (s) => /copy\s*\(\s*\w+\s*,\s*\w+\s*\)/.test(s) },
        { label: "改副本并再次打印 a(证明隔离)", hint: "c[0] = 999;fmt.Println(a) ——a 应不受影响。", test: (s) => /c\s*\[\s*0\s*\]\s*=/.test(s) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ta := []int{1, 2, 3, 4, 5, 6}\n\n\tb := a[1:4]\n\tb[0] = 99\n\tfmt.Println(\"开窗改动后:\", a)   // [1 99 3 4 5 6] 联动!\n\n\tc := make([]int, len(a))\n\tcopy(c, a)\n\tc[0] = 999\n\tfmt.Println(\"copy 改动后:\", a)   // [1 99 3 4 5 6] 隔离!\n}",
      refNote: "同一段代码里演完共享与隔离:开窗改,原切片跟着变;copy 改,原切片岿然不动。去真跑看输出,把这两个对比刻进直觉——以后遇到「函数里改了切片外面怎么也变了」的灵异事件,秒破案。",
    },
    {
      id: "dp-b2", kind: "big", xp: 30, title: "大作业② 银行账户·指针版",
      task: `把专题三的银行账户<b>深潜重造</b>:①<code class="ic">Account</code> struct(Owner string、Balance float64);②<code class="ic">Deposit</code> 和 <code class="ic">Withdraw</code> 两个方法<b>都用指针接收器</b>(这次要求真改余额);③Withdraw 余额不足要拒绝,返回 <code class="ic">(float64, bool)</code>;④main:存 100、取 30、试取 500(失败),最后打印余额(应为 <b>70</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Account struct\n\n// ② 两个指针接收器方法\n\nfunc main() {\n\t// ④ 存、取、试取失败,最后打印余额\n\n}",
      checks: [
        { label: "定义了 Account struct", hint: "type Account struct { Owner string; Balance float64 }", test: (s) => /type\s+Account\s+struct/.test(s) },
        { label: "两个方法都是指针接收器 (*Account)", hint: "func (a *Account) Deposit(…) / func (a *Account) Withdraw(…) ——都带星号。", test: (s) => (s.match(/func\s*\(\s*\w+\s+\*Account\s*\)/g) || []).length >= 2 },
        { label: "Withdraw 有余额判断", hint: "if a.Balance >= amount { … }", test: (s) => /Balance\s*>=|>=\s*amount/.test(s) },
        { label: "Withdraw 返回 (float64, bool)", hint: "func (a *Account) Withdraw(amount float64) (float64, bool)", test: (s) => /\(\s*\w*\s*float64\s*,\s*bool\s*\)/.test(s) },
        { label: "main 存了钱、取了钱、试取失败都处理了", hint: "acc.Deposit(100);acc.Withdraw(30);b, ok := acc.Withdraw(500);ok 应为 false。", test: (s) => /Deposit/.test(s) && /Withdraw/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Account struct {\n\tOwner   string\n\tBalance float64\n}\n\nfunc (a *Account) Deposit(amount float64) {\n\ta.Balance += amount\n}\n\nfunc (a *Account) Withdraw(amount float64) (float64, bool) {\n\tif a.Balance >= amount {\n\t\ta.Balance -= amount\n\t\treturn a.Balance, true\n\t}\n\treturn a.Balance, false\n}\n\nfunc main() {\n\tacc := Account{Owner: \"小地鼠\"}\n\tacc.Deposit(100)\n\tacc.Withdraw(30)\n\t_, ok := acc.Withdraw(500)\n\tfmt.Println(\"取500失败了吗:\", !ok)\n\tfmt.Println(\"余额:\", acc.Balance)   // 70\n}",
      refNote: "对比专题三的版本:同样存 100 取 30,这版余额真的变成了 70——星号到位,数据才到位。指针接收器 + 多返回值 + 失败拒绝,深潜行家的三板斧,齐了。",
    },
  ],
});

})();
