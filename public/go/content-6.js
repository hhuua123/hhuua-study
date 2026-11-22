/* ═══════════════════════════ Go 训练场 · 专题四(闭包) + 专题六(泛型) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 专题四 · 闭包 ══════════ */
A.registerTopic({
  key: "closure", order: 5, part: 3, icon: "🎭", title: "闭包",
  eyebrow: "专题五 · 通关徽章:🎭 闭包驭手",
  badge: { icon: "🎭", name: "闭包驭手" },

  html: `
  <p class="lead">函数在 Go 里不止是「活儿」——它还是<b>值</b>:能装进变量、能当参数传、能被随手现写现用。而当一个函数<b>记住</b>了自己出生时的变量,它就升级成了<b>闭包(closure)</b>:一只带着随身记忆的小地鼠。</p>

  <h3 class="sec-title">函数是值:也能装进盒子</h3>
  <div class="gcode"><div class="gbar"><span>匿名函数:现写现用</span></div><pre><code>// 写一个没有名字的函数,直接塞给变量 f
f := func(x int) int {
	return x * 3
}

fmt.Println(f(7))   // 21 —— f 后面带括号,就是调用它</code></pre></div>
  <ul class="points">
    <li>函数跟 42、"吱吱" 一样,是<b>一种值</b>——能赋给变量、塞进切片、当参数传给别人</li>
    <li><code class="ic">func(…){…}</code> 直接写不挂名 = <b>匿名函数</b>(现场小工)</li>
    <li>想让它干活:名字/字面量后跟一对括号 <code class="ic">(参数)</code> 就是「上工」</li>
  </ul>

  <div class="exslot" data-ex="closure-1"></div>

  <h3 class="sec-title">闭包:函数 + 随身记忆</h3>
  <p>看这只经典计数器——把下面这段逐行读三遍,它是本专题的心脏:</p>
  <div class="gcode"><div class="gbar"><span>makeCounter:计数器工厂</span></div><pre><code>func makeCounter() func() int {
	count := 0              // ① 记忆:工厂里造了一个 count

	return func() int {     // ② 发货:一只带着 count 的小函数
		count++          // ③ 它一直记得 count,每被调用就 +1
		return count
	}
}

func main() {
	c := makeCounter()
	fmt.Println(c())   // 1
	fmt.Println(c())   // 2
	fmt.Println(c())   // 3 —— 记忆还在累积!
}</code></pre></div>
  <div class="note">
    <h4>🐹 闭包到底是什么</h4>
    <p>被返回的那只匿名函数,<b>没有把 count 复印一份,而是随身携带了原装 count 的遥控</b>。函数 + 它捕获的变量 = <b>闭包</b>。count 住在工厂里、函数走到哪都带着它的记忆——所以每调一次 c(),count 就 +1,越攒越多。</p>
  </div>

  <div class="exslot" data-ex="closure-2"></div>
  <div class="exslot" data-ex="closure-3"></div>

  <h3 class="sec-title">工厂量产:记忆互不干扰</h3>
  <p>每次调用 makeCounter 都是一次<b>独立开炉</b>——count 是新造的,记忆归这家所有:</p>
  <div class="gcode"><div class="gbar"><span>两只计数器,两本账</span></div><pre><code>a := makeCounter()
b := makeCounter()

a()   // a 的 count → 1
a()   // a 的 count → 2
fmt.Println(a(), b())
// a 的 count 是 3;b 是新开的炉子,才第一次,是 1
// 打印:3 1</code></pre></div>

  <div class="exslot" data-ex="closure-4"></div>
  <div class="exslot" data-ex="closure-5"></div>

  <h3 class="sec-title">🎯 专题四 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="closure-b1"></div>
  <div class="exslot" data-ex="closure-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题四心法</div>
    <ul>
      <li>函数是值:能装变量、能匿名、能现写现用</li>
      <li>闭包 = 函数 + 捕获的变量(带原装遥控,不是复印件)</li>
      <li>工厂(makeXxx)每开一次炉,记忆独立一份</li>
      <li>闭包让「状态」住进函数里——不用全局变量,不污染别人</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "closure-1", kind: "predict", xp: 10, title: "匿名函数上岗",
      task: `f 装了一只现写的匿名函数。<span class="hl">f(7) 打印什么?</span>`,
      given: "f := func(x int) int {\n\treturn x * 3\n}\n\nfmt.Println(f(7))",
      expected: "21",
      ref: "f := func(x int) int {\n\treturn x * 3\n}\n\nfmt.Println(f(7))   // 7×3 = 21",
      refNote: "函数是值:装进 f、再带括号调用。匿名函数最大的用处马上到——它可以直接被别的函数「生下来」。",
    },
    {
      id: "closure-2", kind: "predict", xp: 10, title: "越叫越多的计数器",
      task: `makeCounter 造了一只带记忆的计数器,连叫三次。<span class="hl">三行输出按顺序打出来。</span>`,
      given: "func makeCounter() func() int {\n\tcount := 0\n\treturn func() int {\n\t\tcount++\n\t\treturn count\n\t}\n}\n\nfunc main() {\n\tc := makeCounter()\n\tfmt.Println(c())\n\tfmt.Println(c())\n\tfmt.Println(c())\n}",
      expected: "1\n2\n3",
      ref: "…\n\tc := makeCounter()\n\tfmt.Println(c())   // 1\n\tfmt.Println(c())   // 2\n\tfmt.Println(c())   // 3",
      refNote: "c 每被调用一次,藏在工厂里的 count 就 +1——函数带着 count 的遥控,记忆跨调用持续存在。这就是闭包的全部魔法。",
    },
    {
      id: "closure-3", kind: "blank", xp: 10, mini: true, title: "工厂的返回类型",
      task: `makeCounter 的返回类型空着——它返回的<b>不是一个数,是一只函数</b>。<span class="hl">把返回类型打出来</span>。`,
      given: "func makeCounter() ____ {\n\tcount := 0\n\treturn func() int {\n\t\tcount++\n\t\treturn count\n\t}\n}",
      placeholder: "func(…)",
      checks: [
        { label: "返回类型是 func() int", hint: "「无参数、返回 int 的函数」写作:func() int。", test: (s) => /func\s*\(\s*\)\s*int\b/.test(s) },
      ],
      ref: "func() int",
      refNote: "函数类型也能当返回类型写!工厂签名的意思是:我交出来的货是一只「调用后给 int」的函数。读顺了这行,闭包的语法关就过了。",
    },
    {
      id: "closure-4", kind: "predict", xp: 10, title: "两只计数器,两本账",
      task: `a、b 分别从工厂领货,a 多叫了几次。<span class="hl">最后打印什么?</span>(Println 两个参数之间自动加空格)`,
      given: "a := makeCounter()\nb := makeCounter()\na()\na()\nfmt.Println(a(), b())",
      expected: "3 1",
      ref: "a := makeCounter()   // 炉一:count 甲\nb := makeCounter()   // 炉二:count 乙(全新)\na()   // 甲→1\na()   // 甲→2\nfmt.Println(a(), b())   // 甲→3,乙→1,打印:3 1",
      refNote: "两次 makeCounter 各造各的 count,互不串门——闭包的「记忆」归各自的实例所有。这个特性和后面泛型、并发的「实例隔离」一脉相通。",
    },
    {
      id: "closure-5", kind: "write", xp: 10, title: "动手写:加法工厂",
      task: `写 <code class="ic">makeAdder(n int)</code>:返回一只「给任意数加上 n」的函数;main 里 <code class="ic">add5 := makeAdder(5)</code>,打印 <code class="ic">add5(10)</code>(应得 15)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// makeAdder:收一个 n,返回一只记得 n 的函数\n\nfunc main() {\n\t// 造 add5,调用并打印\n\n}",
      checks: [
        { label: "定义了 makeAdder,收 n int", hint: "func makeAdder(n int) …", test: (s) => /func\s+makeAdder\s*\(\s*n\s+int\s*\)\s*func/.test(s) },
        { label: "返回的是一只匿名函数", hint: "return func(x int) int { … }", test: (s) => /return\s+func/.test(s) },
        { label: "闭包体用上了 n", hint: "return x + n ——把出厂时的 n 加上去。", test: (s) => /return\s+x\s*\+\s*n|return\s*n\s*\+\s*x/.test(s) },
        { label: "main 里造了实例并打印", hint: "add5 := makeAdder(5);fmt.Println(add5(10))", test: (s) => (s.match(/makeAdder\s*\(/g) || []).length >= 2 && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc makeAdder(n int) func(int) int {\n\treturn func(x int) int {\n\t\treturn x + n\n\t}\n}\n\nfunc main() {\n\tadd5 := makeAdder(5)\n\tfmt.Println(add5(10))   // 15\n}",
      refNote: "makeAdder(5) 出厂时,n 就焊死成了 5——之后不管调多少次 add5,加的永远是这个 5。同一张图纸,拧不同的参数,出不同性格的函数:这就是「函数工厂」。",
    },

    /* ── 大作业 ── */
    {
      id: "closure-b1", kind: "big", xp: 30, title: "大作业① 双倍加法器",
      task: `升级加法工厂:用 <code class="ic">makeAdder(n)</code> 造<b>两个</b>实例——<code class="ic">add10</code>(加 10)和 <code class="ic">add100</code>(加 100),分别调用并打印(比如喂 5,应得 <b>15</b> 和 <b>105</b>)。两只加法器的 n 必须互不干扰。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// makeAdder 工厂\n\nfunc main() {\n\t// 造 add10 和 add100,分别调用并打印\n\n}",
      checks: [
        { label: "makeAdder 工厂定义完整", hint: "func makeAdder(n int) func(int) int { return func(x int) int { return x + n } }", test: (s) => /func\s+makeAdder\s*\(\s*n\s+int\s*\)\s*func/.test(s) && /return\s+x\s*\+\s*n|return\s*n\s*\+\s*x/.test(s) },
        { label: "造了两个实例", hint: "add10 := makeAdder(10) / add100 := makeAdder(100) ——两次开炉。", test: (s) => (s.match(/:=\s*makeAdder/g) || []).length >= 2 },
        { label: "两个实例都调用并打印了", hint: "fmt.Println(add10(5)) 和 fmt.Println(add100(5))。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc makeAdder(n int) func(int) int {\n\treturn func(x int) int {\n\t\treturn x + n\n\t}\n}\n\nfunc main() {\n\tadd10 := makeAdder(10)\n\tadd100 := makeAdder(100)\n\n\tfmt.Println(add10(5))    // 15\n\tfmt.Println(add100(5))   // 105\n}",
      refNote: "同一座工厂,参数一拧,出品两种性格:一只永远加 10,一只永远加 100,记忆各归各——大作业①到手。去真跑看看两只各报各的数。",
    },
    {
      id: "closure-b2", kind: "big", xp: 30, title: "大作业② 前缀日志器",
      task: `实战闭包:写 <code class="ic">makeLogger(prefix string)</code>,返回一只函数——被调用时打印 <code>[前缀] 消息</code>(用 Printf,格式串 <code class="ic">"[%s] %s\\n"</code>)。main 里造 <code class="ic">goLog</code>(前缀 GO)和 <code class="ic">sysLog</code>(前缀 SYS),各打一条消息。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// makeLogger:返回一只记得前缀的打印函数\n\nfunc main() {\n\t// 造 goLog 和 sysLog,各打一条\n\n}",
      checks: [
        { label: "签名:收 prefix,返回函数", hint: "func makeLogger(prefix string) func(string) { … }", test: (s) => /func\s+makeLogger\s*\(\s*prefix\s+string\s*\)\s*func\s*\(\s*\w*\s*string\s*\)/.test(s) },
        { label: "闭包体里打印,且用上了 prefix", hint: "fmt.Printf(\"[%s] %s\\n\", prefix, msg)", test: (s) => /Print(ln|f)\s*\([^)]*prefix/.test(s) },
        { label: "造了 goLog 和 sysLog 两个实例", hint: "goLog := makeLogger(\"GO\") / sysLog := makeLogger(\"SYS\")", test: (s) => (s.match(/:=\s*makeLogger/g) || []).length >= 2 },
        { label: "两个实例都上岗打印了", hint: "goLog(\"服务启动\") / sysLog(\"准备就绪\") ——各带括号调用。", test: (s) => /goLog\s*\(\s*"/.test(s) && /sysLog\s*\(\s*"/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc makeLogger(prefix string) func(string) {\n\treturn func(msg string) {\n\t\tfmt.Printf(\"[%s] %s\\n\", prefix, msg)\n\t}\n}\n\nfunc main() {\n\tgoLog := makeLogger(\"GO\")\n\tsysLog := makeLogger(\"SYS\")\n\n\tgoLog(\"服务启动\")\n\tsysLog(\"准备就绪\")\n}",
      refNote: "输出两行:[GO] 服务启动 / [SYS] 准备就绪。同一份闭包图纸,两只日志器各自记得各自的前缀——真实项目里的日志分模块、限流器分用户,套路全在这一题里。",
    },
  ],
});

/* ══════════ 专题六 · 泛型 ══════════ */
A.registerTopic({
  key: "generics", order: 10, part: 4, icon: "🧬", title: "泛型",
  eyebrow: "专题十 · 通关徽章:🧬 泛型行者",
  badge: { icon: "🧬", name: "泛型行者" },

  html: `
  <p class="lead">一个扎心的场景:你想写个「求最大值」函数——int 版一份、float64 版一份、string 还得再来一份……<b>除了类型,代码一模一样</b>。2022 年,Go 1.18 终于交出了答卷:<b>泛型</b>——函数带一个「类型占位符」,一份代码通吃多种类型。</p>

  <div class="theater">
    <h4>🎭 历史小剧场:催了十年的功能</h4>
    <p>Go 从 2009 年诞生起,「要不要泛型」就吵了十几年——社区年年提案,官方年年说「再等等」。<b>2022 年 3 月,Go 1.18 落地</b>,语法是方括号 <code class="ic">[T]</code>,被称为 Go 十年来最大的语言变更。你现在学的是最新式的 Go。</p>
  </div>

  <h3 class="sec-title">复制的痛(泛型之前的黑暗时代)</h3>
  <div class="gcode"><div class="gbar"><span>双胞胎函数:除了类型,一字不差</span></div><pre><code>func MaxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func MaxFloat64(a, b float64) float64 {
	if a > b {
		return a
	}
	return b
}

// 来个 string 版?再来个……  😩</code></pre></div>

  <h3 class="sec-title">泛型函数:类型也能当参数</h3>
  <div class="gcode"><div class="gbar"><span>[T Number] 读法解剖</span></div><pre><code>// 类型约束:允许 int 或 float64 联合入会
type Number interface {
	int | float64        // 竖线 =「或者」
}

//         [T Number] ← 类型参数:本函数的 T 只能是 Number 会里的类型
func Max[T Number](a, b T) T {
	if a > b {
		return a
	}
	return b
}

func main() {
	fmt.Println(Max(3, 7))        // 7    —— Go 自动看出 T 是 int
	fmt.Println(Max(2.5, 1.5))    // 2.5  —— 自动看出 T 是 float64
}</code></pre></div>
  <ul class="points">
    <li><code class="ic">[T Number]</code> 读作「T 是个类型占位符,取值只能来自 Number」</li>
    <li>函数体内 T 当真类型用;调用时<b>不用写类型,Go 自动推断</b></li>
    <li><b>约束</b>就是类型的「会员名单」:<code class="ic">type Number interface { int | float64 }</code></li>
    <li>名单里随便写 <code class="ic">any</code> = 来者不拒(什么类型都行)</li>
  </ul>

  <div class="note">
    <h4>hamster 求和三件套:零值 + range + 泛型</h4>
    <div class="gcode"><div class="gbar"><span>一份 Sum,通吃 int 和 float64</span></div><pre><code>func Sum[T Number](nums []T) T {
	var total T        // T 的零值!int 是 0,float64 是 0.0 ——泛型也守零值规矩
	for _, n := range nums {
		total += n
	}
	return total
}

fmt.Println(Sum([]int{1, 2, 3}))         // 6
fmt.Println(Sum([]float64{1.5, 2.5}))     // 4</code></pre></div>
    <p>零值、range、类型推断——前三关的兵器在泛型函数里照常服役。</p>
  </div>

  <div class="exslot" data-ex="generics-1"></div>
  <div class="exslot" data-ex="generics-2"></div>
  <div class="exslot" data-ex="generics-3"></div>

  <h3 class="sec-title">泛型类型:带占位符的 struct</h3>
  <p>不止函数能泛型,<b>struct 本身也能带类型占位符</b>——一座仓库,装什么货在开工时才定:</p>
  <div class="gcode"><div class="gbar"><span>Stack[T]:泛型栈(后进先出仓库)</span></div><pre><code>type Stack[T any] struct {       // [T any]:装任意类型的货
	items []T
}

func (s *Stack[T]) Push(v T) {    // 指针接收器:方法要改真身(专题五的指针!)
	s.items = append(s.items, v)
}

func (s *Stack[T]) Pop() T {     // 弹出最后进的那个
	v := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return v
}

func (s *Stack[T]) Len() int {
	return len(s.items)
}

func main() {
	nums := Stack[int]{}          // 一号仓:只装 int
	nums.Push(10)
	nums.Push(20)
	fmt.Println(nums.Pop(), nums.Len())   // 20 1

	words := Stack[string]{}       // 二号仓:只装 string
	words.Push("go")
	fmt.Println(words.Pop())              // go
}</code></pre></div>
  <div class="warn">
    <h4>⚠️ 看清两处细节</h4>
    <p>① 实例化写法是 <code class="ic">Stack[int]{}</code> ——占位符此刻落定为 int;② Push/Pop 用了<b>指针接收器</b> <code class="ic">(s *Stack[T])</code>——它们要改 s 的真身(items),递复印件改不了原件(专题五的遥控器,在这里上了生产岗)。</p>
  </div>

  <div class="exslot" data-ex="generics-4"></div>
  <div class="exslot" data-ex="generics-5"></div>

  <h3 class="sec-title">🎯 专题六 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="generics-b1"></div>
  <div class="exslot" data-ex="generics-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题六心法</div>
    <ul>
      <li>泛型 = 类型占位符:<code class="ic">func Max[T Number](a, b T) T</code>,一份代码多种类型</li>
      <li>约束是类型会员名单:interface 里竖线连写;<b>any</b> 来者不拒</li>
      <li>调用时类型自动推断;零值规矩照旧(<code class="ic">var total T</code>)</li>
      <li>泛型 struct + 指针接收器方法 = Stack[T] 这类通用容器</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "generics-1", kind: "predict", xp: 10, title: "一份 Sum,两种口味",
      task: `同一个 Sum,喂 int 切片和 float64 切片各一次。<span class="hl">两行输出打出来。</span>`,
      given: "type Number interface {\n\tint | float64\n}\n\nfunc Sum[T Number](nums []T) T {\n\tvar total T\n\tfor _, n := range nums {\n\t\ttotal += n\n\t}\n\treturn total\n}\n\nfunc main() {\n\tfmt.Println(Sum([]int{1, 2, 3}))\n\tfmt.Println(Sum([]float64{1.5, 2.5}))\n}",
      expected: "6\n4",
      ref: "…\n\tfmt.Println(Sum([]int{1, 2, 3}))       // 1+2+3 = 6\n\tfmt.Println(Sum([]float64{1.5, 2.5}))  // 1.5+2.5 = 4",
      refNote: "T 是 int 时,var total T 是 0;T 是 float64 时是 0.0——零值规矩在泛型里照常生效。类型推断看清了切片,你一行类型都不用手写。",
    },
    {
      id: "generics-2", kind: "blank", xp: 10, mini: true, title: "补上类型参数",
      task: `泛型函数名后面那对方括号空着。<span class="hl">把方括号里的类型参数打出来</span>。`,
      given: "func Sum[____](nums []T) T {\n\tvar total T\n\tfor _, n := range nums {\n\t\ttotal += n\n\t}\n\treturn total\n}",
      placeholder: "T …",
      checks: [
        { label: "类型参数是 T Number", hint: "写法:T Number ——占位符 T,约束 Number(空格隔开)。", test: (s) => /T\s+Number/.test(s) },
      ],
      ref: "T Number",
      refNote: "「T Number」读作:T 是个类型占位符,只能从 Number 会里挑。以后看到 [T any] 就是「什么类型都行」,[T comparable] 就是「能比较的类型」。",
    },
    {
      id: "generics-3", kind: "blank", xp: 10, mini: true, title: "约束的关键字",
      task: `定义类型约束(类型会员名单)的关键字空着。<span class="hl">打出来</span>(一个词)。`,
      given: "type Number ____ {\n\tint | float64\n}",
      placeholder: "一个词…",
      checks: [
        { label: "关键字是 interface", hint: "type Number interface { … } ——约束本质是个接口,只是成员是「类型」。", test: (s) => /^\s*interface\s*$/i.test(s) },
      ],
      ref: "interface",
      refNote: "interface 会员名单里可以列类型(竖线连写 = 或),也可以列方法(像专题五那样)。泛型约束就是吃了 interface 的老本,一物两用。",
    },
    {
      id: "generics-4", kind: "predict", xp: 10, title: "仓库进出货",
      task: `int 仓 push 了 10 和 20,pop 一次;string 仓 push 了 "go",pop 一次。<span class="hl">两行输出打出来。</span>`,
      given: "type Stack[T any] struct{ items []T }\n\nfunc (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }\nfunc (s *Stack[T]) Pop() T {\n\tv := s.items[len(s.items)-1]\n\ts.items = s.items[:len(s.items)-1]\n\treturn v\n}\nfunc (s *Stack[T]) Len() int { return len(s.items) }\n\nfunc main() {\n\tnums := Stack[int]{}\n\tnums.Push(10)\n\tnums.Push(20)\n\tfmt.Println(nums.Pop(), nums.Len())\n\twords := Stack[string]{}\n\twords.Push(\"go\")\n\tfmt.Println(words.Pop())\n}",
      expected: "20 1\ngo",
      ref: "…\n\tnums.Push(10); nums.Push(20)   // 仓库:10, 20\n\tfmt.Println(nums.Pop(), nums.Len())   // 弹出 20(最后进的),剩 1 件\n\twords.Push(\"go\")\n\tfmt.Println(words.Pop())              // go",
      refNote: "栈的规矩是「后进先出」:20 比 10 后进,先被弹出;Len 剩 1。同一张 Stack 图纸,int 仓、string 仓各自开工——这就是泛型 struct 的价值。",
    },
    {
      id: "generics-5", kind: "write", xp: 10, title: "动手写:泛型 Max",
      task: `写泛型函数 <code class="ic">Max[T Number](a, b T) T</code>(Number 约束的 interface 已在下面备好):返回较大值;main 里 <code class="ic">Max(3, 7)</code>(应得 7)和 <code class="ic">Max(2.5, 1.5)</code>(应得 2.5)各打印一次。`,
      scaffold: "package main\n\nimport \"fmt\"\n\ntype Number interface {\n\tint | float64\n}\n\n// 在这里写泛型 Max\n\nfunc main() {\n\t// 两份调用,两种类型\n\n}",
      checks: [
        { label: "签名带 [T Number]", hint: "func Max[T Number](a, b T) T", test: (s) => /func\s+Max\s*\[\s*T\s+Number\s*\]/.test(s) },
        { label: "条件比较后返回较大者", hint: "if a > b { return a } ——两支都要 return。", test: (s) => /if\s+\w+\s*>\s*\w+/.test(s) && (s.match(/\breturn\b/g) || []).length >= 2 },
        { label: "调用了 Max 两次(int 和 float64)", hint: "Max(3, 7) 和 Max(2.5, 1.5) ——类型自动推断,不用手写。", test: (s) => (s.match(/Max\s*\(/g) || []).length >= 2 },
        { label: "打印了结果", hint: "fmt.Println(Max(3, 7))", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Number interface {\n\tint | float64\n}\n\nfunc Max[T Number](a, b T) T {\n\tif a > b {\n\t\treturn a\n\t}\n\treturn b\n}\n\nfunc main() {\n\tfmt.Println(Max(3, 7))      // 7\n\tfmt.Println(Max(2.5, 1.5))   // 2.5\n}",
      refNote: "对比本专题开头那对双胞胎:一份泛型代码顶了过去两份,将来加 string 支持,只改 Number 名单一行。消灭复制粘贴,就是泛型的全部使命。",
    },

    /* ── 大作业 ── */
    {
      id: "generics-b1", kind: "big", xp: 30, title: "大作业① 通用求和器",
      task: `写完整程序:①定义 <code class="ic">Number</code> 约束(<code class="ic">int | float64</code>);②写泛型函数 <code class="ic">Sum[T Number](nums []T) T</code>——用零值起步 <code class="ic">var total T</code>,range 累加;③main 里对 <code class="ic">[]int{1, 2, 3}</code> 和 <code class="ic">[]float64{1.5, 2.5}</code> 各调用一次并打印(应得 <b>6</b> 和 <b>4</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Number 约束\n\n// ② 泛型 Sum\n\nfunc main() {\n\t// ③ 两种切片各求一次\n\n}",
      checks: [
        { label: "定义了 Number 约束(int | float64)", hint: "type Number interface { int | float64 }", test: (s) => /type\s+Number\s+interface\s*\{[\s\S]*int\s*\|\s*float64/.test(s) },
        { label: "签名带 [T Number]", hint: "func Sum[T Number](nums []T) T", test: (s) => /Sum\s*\[\s*T\s+Number\s*\]/.test(s) },
        { label: "用零值起步:var total T", hint: "var total T ——T 的零值自动适配 int/float64。", test: (s) => /var\s+total\s+T\b/.test(s) },
        { label: "range 累加", hint: "for _, n := range nums { total += n }", test: (s) => /\brange\b/.test(s) && /total\s*\+=/.test(s) },
        { label: "对 int 和 float64 两种切片各调用一次", hint: "Sum([]int{…}) 和 Sum([]float64{…})。", test: (s) => /Sum\s*\(\s*\[\]int/.test(s) && /Sum\s*\(\s*\[\]float64/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Number interface {\n\tint | float64\n}\n\nfunc Sum[T Number](nums []T) T {\n\tvar total T\n\tfor _, n := range nums {\n\t\ttotal += n\n\t}\n\treturn total\n}\n\nfunc main() {\n\tfmt.Println(Sum([]int{1, 2, 3}))       // 6\n\tfmt.Println(Sum([]float64{1.5, 2.5}))  // 4\n}",
      refNote: "一份函数、两种口味、零复制——sum 一号通吃 int 与 float64。把 Number 名单里再加个 string?编译器会当场拒绝(+ 对 string 不合法),约束的「安检」就在干这个活。",
    },
    {
      id: "generics-b2", kind: "big", xp: 30, title: "大作业② 泛型仓库 Stack[T]",
      task: `写完整泛型栈:①<code class="ic">type Stack[T any] struct{ items []T }</code>;②方法 <b>Push</b>(追加)、<b>Pop</b>(弹出最后进的)、<b>Len</b>(报数)——用<b>指针接收器</b> <code class="ic">(s *Stack[T])</code>(要改真身);③main 里开 <code class="ic">Stack[int]</code> 仓:push 10、20,pop 一次并打印(应得 <b>20</b>);再开 <code class="ic">Stack[string]</code> 仓:push "go",pop 打印(应得 <b>go</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Stack[T any] struct\n\n// ② Push / Pop / Len(指针接收器)\n\nfunc main() {\n\t// ③ int 仓与 string 仓各自开张\n\n}",
      checks: [
        { label: "定义了 Stack[T any]", hint: "type Stack[T any] struct { items []T }", test: (s) => /type\s+Stack\s*\[\s*T\s+any\s*\]\s*struct/.test(s) },
        { label: "有 items []T 字段", hint: "struct 里:items []T ——装什么货,开张时定。", test: (s) => /items\s+\[\]T/.test(s) },
        { label: "Push 是指针接收器方法", hint: "func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }", test: (s) => /func\s*\(\s*s\s+\*?Stack\s*\[\s*T\s*\]\s*\)\s+Push/.test(s) },
        { label: "Pop 方法完整", hint: "取末位 → 切短 → return,像题面那样三步走。", test: (s) => /func\s*\(\s*s\s+\*?Stack\s*\[\s*T\s*\]\s*\)\s+Pop/.test(s) },
        { label: "开了 int 和 string 两座仓", hint: "nums := Stack[int]{} / words := Stack[string]{}", test: (s) => /Stack\s*\[\s*int\s*\]/.test(s) && /Stack\s*\[\s*string\s*\]/.test(s) },
        { label: "两座仓都出货打印了", hint: "fmt.Println(nums.Pop()) 和 fmt.Println(words.Pop())", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Stack[T any] struct {\n\titems []T\n}\n\nfunc (s *Stack[T]) Push(v T) {\n\ts.items = append(s.items, v)\n}\n\nfunc (s *Stack[T]) Pop() T {\n\tv := s.items[len(s.items)-1]\n\ts.items = s.items[:len(s.items)-1]\n\treturn v\n}\n\nfunc (s *Stack[T]) Len() int {\n\treturn len(s.items)\n}\n\nfunc main() {\n\tnums := Stack[int]{}\n\tnums.Push(10)\n\tnums.Push(20)\n\tfmt.Println(nums.Pop())   // 20(后进先出)\n\n\twords := Stack[string]{}\n\twords.Push(\"go\")\n\tfmt.Println(words.Pop())  // go\n}",
      refNote: "「泛型行者」的期末验收:一张图纸开出 int 仓和 string 仓,类型安检由编译器把守。指针接收器改真身、any 来者不拒、[T] 落定即开工——三个新概念一次上膛。去真跑,亲眼看仓库进出货!",
    },
  ],
});

})();
