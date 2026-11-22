/* ═══════════════════════════ Go 训练场 · 扩容四站(类型深潜 / 接口进阶 / JSON / 竞态风暴) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 新站 · 数据类型深入 ══════════ */
A.registerTopic({
  key: "types", order: 1.5, part: 2, icon: "🔢", title: "数据类型深潜",
  badge: { icon: "🔢", name: "类型炼金师" },

  html: `
  <p class="lead">int、float64 不是「数字」这么简单——它们是<b>有边界的盒子</b>。这一站带你撞一次边界(溢出)、踩一次浮点的坑、认识整数除法的真面目,然后请出枚举神器 <code class="ic">iota</code>。短小,但招招致命。</p>

  <h3 class="sec-title">整型家族:盒子是带刻度的</h3>
  <table class="tbl">
    <tr><th>类型</th><th>装什么</th><th>范围</th></tr>
    <tr><td><code class="ic">int8</code> ~ <code class="ic">int64</code></td><td>带符号整数</td><td>int8:−128 ~ 127</td></tr>
    <tr><td><code class="ic">uint8</code> ~ <code class="ic">uint64</code></td><td>非负整数</td><td>uint8:0 ~ 255</td></tr>
    <tr><td><code class="ic">int</code> / <code class="ic">uint</code></td><td>跟平台走(64 位机器上 64 位)</td><td>日常默认,不写也行</td></tr>
  </table>
  <div class="gcode"><div class="gbar"><span>溢出:刻度用尽,绕回起点</span></div><pre><code>var max int8 = 127      // int8 的天花板
max++                   // 加 1 ——直接绕到地板!
fmt.Println(max)        // -128 😱</code></pre></div>
  <div class="warn">
    <h4>⚠️ 溢出不报错,只绕圈</h4>
    <p>Go 的整数像钟表:127 加 1 绕回 −128,0 减 1 绕到 255(uint)。编译器不拦、运行不崩——<b>数据悄悄错了</b>。日常用 int 别慌;只有选小盒子(int8/uint8 省内存)时才要心里有杆秤。</p>
  </div>

  <div class="exslot" data-ex="ty-1"></div>
  <div class="exslot" data-ex="ty-2"></div>

  <h3 class="sec-title">浮点数:接近,但不等于</h3>
  <div class="gcode"><div class="gbar"><span>0.1 + 0.2 的真相</span></div><pre><code>a, b := 0.1, 0.2
fmt.Println(a + b)              // 0.30000000000000004 !!
fmt.Println(a+b == 0.3)         // false !!</code></pre></div>
  <div class="note">
    <h4>🐹 这是浮点的天性,不是 Go 的 bug</h4>
    <p>直接写 0.1 + 0.2 时，Go 先做精确的常量运算；这里先赋给 float64 变量，再观察运行时舍入。0.1 在二进制里是<b>无限循环小数</b>,float64 只能存近似值——所以 0.1+0.2 与 0.3 「差了一根头发丝」。对策:<b>浮点永远不直接 == 比较</b>;给用户看的数用 <code class="ic">%.2f</code> 收尾,内部算账容忍误差(先乘后除、整数分)。</p>
  </div>
  <div class="exslot" data-ex="ty-3"></div>

  <h3 class="sec-title">整数除法:一刀切,不商量</h3>
  <div class="gcode"><div class="gbar"><span>两个 int 相除</span></div><pre><code>fmt.Println(7 / 2)       // 3   ——整数除整数,小数直接扔掉
fmt.Println(7.0 / 2)     // 3.5 ——有一方是浮点,才走浮点除法</code></pre></div>

  <h3 class="sec-title">iota:枚举一行流</h3>
  <p>想让「星期」「级别」「状态码」各有一个整数编号,不想手写 0、1、2、3……用 <code class="ic">iota</code>:<b>const 块里的自动计数器,每过一行 +1</b>。</p>
  <div class="gcode"><div class="gbar"><span>iota 初见</span></div><pre><code>const (
    Red = iota    // iota 此行 = 0,Red 拿到 0
    Green         // 没写表达式?自动继承格式,iota 变 1
    Blue          // 2
)</code></pre></div>
  <div class="wgslot" data-wg="iota"></div>
  <div class="exslot" data-ex="ty-4"></div>
  <div class="exslot" data-ex="ty-5"></div>

  <h3 class="sec-title">🎯 本站大作业(2 个)</h3>
  <div class="exslot" data-ex="ty-b1"></div>
  <div class="exslot" data-ex="ty-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 本站心法</div>
    <ul>
      <li>整数有边界,溢出绕圈不报错;日常默认 int</li>
      <li>浮点是近似值,永不直接 ==;展示用 %.2f</li>
      <li>int ÷ int 直接砍小数;想要小数,先 as 成浮点</li>
      <li>iota:const 块自动计数,一行流枚举</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本站对应《Go 语言圣经》第 3.1~3.4 节与 3.6 节 ——<a href="https://golang-china.github.io/gopl-zh/ch3/ch3-01.html" target="_blank" rel="noopener">去读原文</a>(golang-china.github.io/gopl-zh)</div>`,

  exercises: [
    {
      id: "ty-1", kind: "predict", xp: 10, title: "撞上天花板",
      task: "int8 只装得下 −128 ~ 127。天花板 +1,打印什么?",
      given: "var max int8 = 127\nmax++\nfmt.Println(max)",
      expected: "-128",
      ref: "var max int8 = 127\nmax++                // 128 装不进 int8,绕回地板\nfmt.Println(max)     // -128",
      refNote: "钟表效应:127 的下一格是 −128。溢出静悄悄——这比崩溃更可怕,因为没人发现数据错了。",
    },
    {
      id: "ty-2", kind: "predict", xp: 10, title: "地板下面",
      task: "uint8 只装非负数(0~255)。地板 −1,打印什么?",
      given: "var u uint8 = 0\nu--\nfmt.Println(u)",
      expected: "255",
      ref: "var u uint8 = 0\nu--                 // 0−1 装不进无符号,绕到天花板\nfmt.Println(u)      // 255",
      refNote: "无符号数往回绕:0 的上一格是 255。向下溢出与向上溢出一对活宝——选窄盒子(int8/uint8)省内存,但心里得装着刻度。",
    },
    {
      id: "ty-3", kind: "predict", xp: 10, title: "浮点 Hairline",
      task: "两行打印,一个看真身,一个做比较。各打什么?",
      given: "a, b := 0.1, 0.2\nfmt.Println(a + b)\nfmt.Println(a+b == 0.3)",
      expected: "0.30000000000000004\nfalse",
      ref: "a, b := 0.1, 0.2\nfmt.Println(a + b)        // 0.30000000000000004\nfmt.Println(a+b == 0.3)   // false",
      refNote: "0.1 的二进制是无限循环,存的是近似值。所以浮点比较要用「差值小于某个容差」,或干脆整数化(钱用分算)——别用 ==。",
    },
    {
      id: "ty-4", kind: "blank", xp: 10, mini: true, title: "iota 的第一次点名",
      task: "枚举第一行,常量名后面空着。把 Red 的赋值补上(用 iota)。",
      given: "const (\n    Red = ____\n    Green\n    Blue\n)\nfmt.Println(Red, Green, Blue)",
      placeholder: "一个词…",
      checks: [
        { label: "用的是 iota", hint: "就一个词:iota ——自动计数器从 0 起跳。", test: (s) => /^\s*iota\s*$/.test(s) },
      ],
      ref: "iota",
      refNote: "Red = iota 拿到 0;后面两行自动继承,iota 每行 +1。装置里你亲手演算过全程——这就是「一行流枚举」的全部机关。",
    },
    {
      id: "ty-5", kind: "predict", xp: 10, title: "iota 的连锁反应",
      task: "三兄弟各拿几号?打印什么?",
      given: "const (\n    Red = iota\n    Green\n    Blue\n)\nfmt.Println(Red, Green, Blue)",
      expected: "0 1 2",
      ref: "const (\n    Red = iota   // 0\n    Green        // 1\n    Blue         // 2\n)\nfmt.Println(Red, Green, Blue)   // 0 1 2",
      refNote: "没写表达式的行自动继承上一行的「格式」,iota 照常 +1——Red、Green、Blue 各就各位。",
    },

    /* ── 大作业 ── */
    {
      id: "ty-b1", kind: "big", xp: 30, title: "大作业① 容量枚举(KB/MB/GB)",
      task: `用 iota + 位运算造容量单位:const 块里 <code class="ic">_ = iota</code> 丢弃 0,然后 <code class="ic">KB = 1 &lt;&lt; (10 * iota)</code>、MB、GB 同款表达式;最后打印三者(应得 <b>1024、1048576、1073741824</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// const 块:_ 丢 0,KB/MB/GB 用 1 << (10 * iota)\n\nfunc main() {\n\t// 打印 KB、MB、GB\n\n}",
      checks: [
        { label: "用了 _ = iota 丢弃第 0 行", hint: "const 块第一行:_ = iota", test: (s) => /_\s*=\s*iota/.test(s) },
        { label: "KB/MB/GB 用了 1 << (10 * iota) 模式", hint: "KB = 1 << (10 * iota) ——三行同款,只换名字。", test: (s) => /<<\s*\(\s*10\s*\*\s*iota\s*\)/.test(s) && /KB/.test(s) && /MB/.test(s) && /GB/.test(s) },
        { label: "main 里打印了三个值", hint: "fmt.Println(KB, MB, GB)", test: (s) => /fmt\.Print(ln|f)\s*\([^)]*(KB|MB)/.test(s) || (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 1 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nconst (\n\t_  = iota             // 丢掉 0\n\tKB = 1 << (10 * iota) // 1<<10 = 1024\n\tMB = 1 << (10 * iota) // 1<<20\n\tGB = 1 << (10 * iota) // 1<<30\n)\n\nfunc main() {\n\tfmt.Println(KB, MB, GB)   // 1024 1048576 1073741824\n}",
      refNote: "1 << 10 是位运算「左移 10 位」= ×1024。iota 每行 +1,表达式自动从 1<<10 变 1<<20、1<<30——装置里演算过的连锁,现在亲手写出来。",
    },
    {
      id: "ty-b2", kind: "big", xp: 30, title: "大作业② 周末枚举判定器",
      task: `①用 iota 造星期枚举(Sunday~Saturday);②设 <code class="ic">day := Saturday</code>,用 if 判断「是周六还是周日」就打印 <code>周末 🎉</code>,否则打印 <code>工作日 💼</code>。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① 星期枚举(Sunday = iota 开始)\n\nfunc main() {\n\tday := Saturday\n\n\t// ② 判断周末\n\n}",
      checks: [
        { label: "const 块从 Sunday = iota 开始", hint: "const (\n\tSunday = iota\n\tMonday\n\t…到 Saturday 共 7 行\n)", test: (s) => /Sunday\s*=\s*iota/.test(s) && /Saturday/.test(s) },
        { label: "枚举凑齐了 7 天", hint: "Sunday、Monday、Tuesday、Wednesday、Thursday、Friday、Saturday。", test: (s) => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].every((d) => new RegExp(d).test(s)) },
        { label: "用了 if 判断周末", hint: "if day == Saturday || day == Sunday ——|| 表示「或者」。", test: (s) => /if\s+day\s*==\s*(Saturday|Sunday)|if\s+\w+\s*==\s*Saturday\s*\|\|/.test(s) },
        { label: "两个分支都打印", hint: "周末 🎉 / 工作日 💼 各一支。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nconst (\n\tSunday = iota\n\tMonday\n\tTuesday\n\tWednesday\n\tThursday\n\tFriday\n\tSaturday\n)\n\nfunc main() {\n\tday := Saturday\n\n\tif day == Saturday || day == Sunday {\n\t\tfmt.Println(\"周末 🎉\")\n\t} else {\n\t\tfmt.Println(\"工作日 💼\")\n\t}\n}",
      refNote: "Saturday 拿到 6;条件 day == Saturday 成立,走周末分支。iota + if——枚举造出来,还要用起来才算数。",
    },
  ],
});

/* ══════════ 新站 · 接口进阶 ══════════ */
A.registerTopic({
  key: "iface", order: 7.5, part: 4, icon: "🧩", title: "接口进阶",
  badge: { icon: "🧩", name: "多态行者" },

  html: `
  <p class="lead">你已经会让类型「自动入会」了。这一站解锁接口的<b>后半套内功</b>:怎么从接口值里<b>认出</b>底层是谁(类型断言/类型分支),怎么让类型<b>自己会说人话</b>(fmt.Stringer),以及标准库最常用的 <code class="ic">sort.Slice</code>——它吃的正是一个函数参数。</p>

  <h3 class="sec-title">类型断言:x.(T) 拆包裹</h3>
  <div class="gcode"><div class="gbar"><span>断言的安全姿势</span></div><pre><code>var x interface{} = "hello"

// 危险版:猜错了直接 panic
s := x.(string)

// 安全版:双返回值,猜错不崩
s2, ok := x.(int)
fmt.Println(s2, ok)   // 0 false ——零值 + false,体面收场</code></pre></div>
  <div class="note">
    <h4>🐹 interface{} = 万能包裹</h4>
    <p><code class="ic">interface{}</code>(新写法 <code class="ic">any</code>)能装<b>任何值</b>——装进去之后想知道「里面到底是谁」,就得断言。<b>双返回值版永远优先</b>:猜错也不炸,像 map 取键一样体面。</p>
  </div>

  <div class="exslot" data-ex="if-1"></div>

  <h3 class="sec-title">类型分支:switch x.(type)</h3>
  <div class="gcode"><div class="gbar"><span>一个接口值,分拣多种底层</span></div><pre><code>func describe(x interface{}) {
    switch v := x.(type) {      // 注意:括号里写的是 type!
    case int:
        fmt.Println("整数:", v)
    case string:
        fmt.Println("字符串:", v)
    default:
        fmt.Println("不认识:", v)
    }
}</code></pre></div>
  <div class="exslot" data-ex="if-2"></div>
  <div class="exslot" data-ex="if-3"></div>

  <h3 class="sec-title">fmt.Stringer:让类型自我介绍</h3>
  <div class="gcode"><div class="gbar"><span>Stringer:打印界的 VIP 通道</span></div><pre><code>type Point struct{ X, Y int }

func (p Point) String() string {
    return fmt.Sprintf("(%d,%d)", p.X, p.Y)
}

fmt.Println(Point{1, 2})   // (1,2) ——Println 认出 Stringer,自动请它发言!</code></pre></div>
  <div class="note">
    <h4>hamster 这是 fmt 包和你的一次暗中合作</h4>
    <p>只要类型实现了 <code class="ic">String() string</code>,<b>所有打印函数(Println/Printf/Sprintf)都会自动改用它</b>——不用你调,fmt 亲自登门。调试 struct 的第一神器。</p>
  </div>
  <div class="exslot" data-ex="if-4"></div>

  <h3 class="sec-title">sort.Slice:函数参数的实战现场</h3>
  <div class="gcode"><div class="gbar"><span>给切片排序,一行搞定</span></div><pre><code>type Student struct {
    Name string
    Age  int
}

students := []Student{
    {"阿仓", 3}, {"小地鼠", 1}, {"大白", 2},
}

// 从小到大按 Age 排:
sort.Slice(students, func(i, j int) bool {
    return students[i].Age < students[j].Age
})</code></pre></div>
  <p>看到了吗?<code class="ic">sort.Slice</code> 的第二个参数<b>是一个现写的函数</b>(比较器)——函数是值的威力,标准库天天在用。想从大到小?把 <code class="ic">&lt;</code> 换成 <code class="ic">&gt;</code> 就完事。</p>
  <div class="exslot" data-ex="if-5"></div>

  <h3 class="sec-title">🎯 本站大作业(2 个)</h3>
  <div class="exslot" data-ex="if-b1"></div>
  <div class="exslot" data-ex="if-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 本站心法</div>
    <ul>
      <li>断言双返回值:x.(T) 猜错也不崩,永远优先</li>
      <li>类型分支 switch x.(type):一个接口,分拣多种底层</li>
      <li>实现 String() string,所有打印自动换上你的台词</li>
      <li>sort.Slice(切片, 比较函数)——函数是值,天天在用</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本站对应《Go 语言圣经》第 7.10~7.13 节 ——<a href="https://golang-china.github.io/gopl-zh/ch7/ch7-10.html" target="_blank" rel="noopener">去读原文</a></div>`,

  exercises: [
    {
      id: "if-1", kind: "predict", xp: 10, title: "猜错的断言",
      task: "x 里装的是字符串,却断言 int。安全版会打什么?",
      given: "var x interface{} = \"hello\"\ns, ok := x.(int)\nfmt.Println(s, ok)",
      expected: "0 false",
      ref: "var x interface{} = \"hello\"\ns, ok := x.(int)    // 断言失败:零值 + false\nfmt.Println(s, ok)   // 0 false",
      refNote: "断言失败不崩——给你该类型的零值(int 是 0)加一个 false。这和 map 取不存在键是同一套「体面哲学」。",
    },
    {
      id: "if-2", kind: "predict", xp: 10, title: "类型分拣机",
      task: "describe 各会收到 42 和 \"go\"。两行打印什么?",
      given: "package main\nimport \"fmt\"\n\nfunc describe(x interface{}) {\n    switch v := x.(type) {\n    case int:\n        fmt.Println(\"int:\", v)\n    case string:\n        fmt.Println(\"string:\", v)\n    default:\n        fmt.Println(\"未知\")\n    }\n}\n\nfunc main() {\n\tdescribe(42)\n\tdescribe(\"go\")\n}",
      expected: "int: 42\nstring: go",
      ref: "…\ndescribe(42)     // int: 42\ndescribe(\"go\")   // string: go",
      refNote: "switch v := x.(type) 的每个 case 都是一次「如果是这种类型」的猜箱——v 在各 case 里已经是对应类型的值,拿来就用。",
    },
    {
      id: "if-3", kind: "blank", xp: 10, mini: true, title: "类型分支的关键字",
      task: "类型分支的括号里不写具体类型,写一个词。打出来。",
      given: "var x any = 42\nswitch v := x.(____) {\ncase int:\n    fmt.Println(v)\n}",
      placeholder: "一个词…",
      checks: [
        { label: "括号里是 type", hint: "switch x.(type) ——类型分支的专属写法。", test: (s) => /^\s*type\s*$/.test(s) },
      ],
      ref: "type",
      refNote: "switch x.(type) 是唯一一个括号里写 type 的地方——类型分支和类型断言就差这个词。",
    },
    {
      id: "if-4", kind: "predict", xp: 10, title: "会自我介绍的坐标",
      task: "Point 实现了 String()。打印 Point{1, 2} 会输出什么?",
      given: "package main\nimport \"fmt\"\n\ntype Point struct{ X, Y int }\n\nfunc (p Point) String() string {\n    return fmt.Sprintf(\"(%d,%d)\", p.X, p.Y)\n}\n\nfunc main() {\n\tfmt.Println(Point{1, 2})\n}",
      expected: "(1,2)",
      ref: "…\nfmt.Println(Point{1, 2})   // Println 认出 Stringer → (1,2)",
      refNote: "Println 打印前先检查:这类型有 String() 方法吗?有——请你发言,不用默认格式。这就是 fmt.Stringer 的 VIP 待遇。",
    },
    {
      id: "if-5", kind: "write", xp: 10, title: "动手写:按年龄排序",
      task: `scaffold 已备好 Student 切片。用 <code class="ic">sort.Slice</code> 按 Age <b>从大到小</b>排序,然后打印第一位(应该是最年长的)。<b>需要 import "sort"</b>,scaffold 里已带。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\ntype Student struct {\n\tName string\n\tAge  int\n}\n\nfunc main() {\n\tstudents := []Student{\n\t\t{Name: \"阿仓\", Age: 3},\n\t\t{Name: \"小地鼠\", Age: 1},\n\t\t{Name: \"大白\", Age: 2},\n\t}\n\n\t// sort.Slice 从大到小排,然后打印第一位\n\n}",
      checks: [
        { label: "调用了 sort.Slice", hint: "sort.Slice(students, func(i, j int) bool { … })", test: (s) => /sort\.Slice\s*\(/.test(s) },
        { label: "比较器用了 > (从大到小)", hint: "return students[i].Age > students[j].Age", test: (s) => /students\[i\]\.Age\s*>|\.Age\s*>\s*students/.test(s) },
        { label: "打印了排序后的第一位", hint: "fmt.Println(students[0]) ——阿仓 3 岁应排第一。", test: (s) => /fmt\.Print(ln|f)\s*\([^)]*students\[0\]|fmt\.Print(ln|f)\s*\(\s*students/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\ntype Student struct {\n\tName string\n\tAge  int\n}\n\nfunc main() {\n\tstudents := []Student{\n\t\t{Name: \"阿仓\", Age: 3},\n\t\t{Name: \"小地鼠\", Age: 1},\n\t\t{Name: \"大白\", Age: 2},\n\t}\n\n\tsort.Slice(students, func(i, j int) bool {\n\t\treturn students[i].Age > students[j].Age\n\t})\n\n\tfmt.Println(students[0])   // {阿仓 3}\n}",
      refNote: "比较器函数现写现传——函数是值的标准应用。想去真跑看看完整队伍,把三个都打出来即可。",
    },

    /* ── 大作业 ── */
    {
      id: "if-b1", kind: "big", xp: 30, title: "大作业① 动物园自我介绍大会",
      task: `三个类型同台:Dog、Cat、Robot(都是空 struct)。各自实现 <code class="ic">String() string</code>(台词自定,如 "汪汪!"/"喵~"/"滴——")。组装 <code class="ic">[]interface{}</code> 三家全上,range 循环打印——每家自我介绍一次。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// Dog / Cat / Robot 三个类型 + 各自的 String() 方法\n\nfunc main() {\n\t// 组装队伍,range 打印\n\n}",
      checks: [
        { label: "定义了 Dog/Cat/Robot 三个类型", hint: "type Dog struct{} 等三行。", test: (s) => /type\s+Dog\s+struct/.test(s) && /type\s+Cat\s+struct/.test(s) && /type\s+Robot\s+struct/.test(s) },
        { label: "三家都实现了 String() string", hint: "func (d Dog) String() string { … } ——接收器换三家。", test: (s) => (s.match(/func\s*\(\s*\w+\s+(Dog|Cat|Robot)\s*\)\s+String\s*\(\s*\)\s+string/g) || []).length >= 3 },
        { label: "用了 []interface{} 或 []any 组装队伍", hint: "team := []interface{}{Dog{}, Cat{}, Robot{}}", test: (s) => /\[\]\s*(interface\{\}|any)/.test(s) },
        { label: "range 遍历打印", hint: "for _, a := range team { fmt.Println(a) } ——Println 自动请 Stringer 发言!", test: (s) => /\brange\b/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Dog struct{}\ntype Cat struct{}\ntype Robot struct{}\n\nfunc (d Dog) String() string   { return \"汪!\" }\nfunc (c Cat) String() string   { return \"喵~\" }\nfunc (r Robot) String() string { return \"滴——\" }\n\nfunc main() {\n\tteam := []interface{}{Dog{}, Cat{}, Robot{}}\n\tfor _, a := range team {\n\t\tfmt.Println(a)\n\t}\n}",
      refNote: "输出三行:汪! / 喵~ / 滴——。一个 []interface{} 队伍装下三家,Println 逢人就请 Stringer 发言——接口的「谁都能上台」,配合 Stringer 的「自动发言」,一场大会两行代码。",
    },
    {
      id: "if-b2", kind: "big", xp: 30, title: "大作业② 形状点名器(类型分支)",
      task: `①Shape 接口:方法 <code class="ic">Area() float64</code>;②Circle(R=2)和 Rect(W=3, H=4)各实现它;③组装 []Shape;<b>④range 循环里用类型分支</b>——圆打「圆 面积=12.57」,矩形打「矩形 面积=12.00」(格式 %.2f)。<b>圆周率用 3.14159。</b>`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Shape 接口 + ② Circle / Rect + Area\n\nfunc main() {\n\t// ③ 组装 []Shape\n\t// ④ range + switch s.(type) 分流打印\n\n}",
      checks: [
        { label: "定义了 Shape 接口", hint: "type Shape interface { Area() float64 }", test: (s) => /type\s+Shape\s+interface/.test(s) },
        { label: "Circle 和 Rect 都实现了 Area", hint: "func (c Circle) Area() float64 / func (r Rect) Area() float64", test: (s) => (s.match(/func\s*\(\s*\w+\s+(Circle|Rect)\s*\)\s+Area/g) || []).length >= 2 },
        { label: "组装了 []Shape 队伍", hint: "shapes := []Shape{Circle{R: 2}, Rect{W: 3, H: 4}}", test: (s) => /\[\]\s*Shape/.test(s) },
        { label: "循环里用了类型分支", hint: "switch v := s.(type) { case Circle: … case Rect: … }", test: (s) => /switch[^{]*\.\(\s*type\s*\)/.test(s) },
        { label: "打印带 %.2f", hint: "fmt.Printf(\"圆 面积=%.2f\\n\", s.Area())", test: (s) => /%\.2f/.test(s) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Shape interface {\n\tArea() float64\n}\n\ntype Circle struct{ R float64 }\ntype Rect struct{ W, H float64 }\n\nfunc (c Circle) Area() float64 { return 3.14159 * c.R * c.R }\nfunc (r Rect) Area() float64   { return r.W * r.H }\n\nfunc main() {\n\tshapes := []Shape{Circle{R: 2}, Rect{W: 3, H: 4}}\n\tfor _, s := range shapes {\n\t\tswitch v := s.(type) {\n\t\tcase Circle:\n\t\t\tfmt.Printf(\"圆 面积=%.2f\\n\", v.Area())\n\t\tcase Rect:\n\t\t\tfmt.Printf(\"矩形 面积=%.2f\\n\", v.Area())\n\t\t}\n\t}\n}",
      refNote: "接口统一调用 Area(),类型分支分头介绍身份——「统一调用 + 分流点名」是 Go 处理多态的经典双剑。多态行者,过关!",
    },
  ],
});

/* ══════════ 新站 · JSON ══════════ */
A.registerTopic({
  key: "json", order: 8.5, part: 4, icon: "📋", title: "JSON 数据打包",
  badge: { icon: "📋", name: "数据打包师" },

  html: `
  <p class="lead">现代程序传数据的通用语是 <b>JSON</b>:配置文件、接口返回、存档序列化,全是它。Go 的 <code class="ic">encoding/json</code> 让 struct 和 JSON 互相「变身」几乎零成本——这一站学完,你的程序就能和整个互联网对话了。</p>

  <h3 class="sec-title">打包:struct → JSON(Marshal)</h3>
  <div class="gcode"><div class="gbar"><span>第一次打包</span></div><pre><code>import "encoding/json"

type Movie struct {
    Title string
    Year  int
}

b, _ := json.Marshal(Movie{Title: "地鼠总动员", Year: 2026})
fmt.Println(string(b))
// {"Title":"地鼠总动员","Year":2026}</code></pre></div>
  <div class="note">
    <h4>hamster 三个细节,一个都不能少</h4>
    <p>① <code class="ic">Marshal</code> 交的是 <b>字节切片</b>,打印前要 <code class="ic">string(b)</code> 转一道;② <b>小写字段会被扔掉</b>——encoding/json 只认<b>大写开头</b>(导出)的字段;③ 想指定 JSON 里的名字,给字段挂<b>标签</b>(马上讲)。</p>
  </div>

  <div class="exslot" data-ex="js-1"></div>

  <h3 class="sec-title">标签:json:"name" — 你的 JSON 你命名</h3>
  <div class="gcode"><div class="gbar"><span>字段标签(反引号)</span></div><pre><code>type User struct {
    Name string \`json:"name"\`   // JSON 里叫 name(小写)
    Age  int    \`json:"age"\`
}

b, _ := json.Marshal(User{Name: "小地鼠", Age: 3})
fmt.Println(string(b))
// {"name":"小地鼠","age":3}</code></pre></div>
  <p>标签写在字段类型后面,用<b>反引号</b>包住,格式固定 <code class="ic">json:"名字"</code>——这是 Go 里少见的反引号主场。API 返回要 snake_case 小写?标签说了算。</p>

  <div class="exslot" data-ex="js-2"></div>

  <h3 class="sec-title">拆包:JSON → struct(Unmarshal)</h3>
  <div class="gcode"><div class="gbar"><span>拆包三件套:数据 · 目标 · 指针</span></div><pre><code>data := []byte(\`{"host":"localhost","port":8080}\`)

type Config struct {
    Host string \`json:"host"\`
    Port int    \`json:"port"\`
}

var cfg Config
err := json.Unmarshal(data, &cfg)   // 注意 &cfg:要指针!
if err != nil {
    fmt.Println("解析失败:", err)
    return
}
fmt.Println(cfg.Host, cfg.Port)   // localhost 8080</code></pre></div>
  <div class="warn">
    <h4>⚠️ Unmarshal 忘传指针,会返回错误</h4>
    <p>拆包要往目标里写数据,所以必须给<b>遥控器</b>(<code class="ic">&amp;cfg</code>)——给复印件没意义,Unmarshal 会返回错误:<code class="ic">json: Unmarshal(non-pointer)</code>。这是本站最容易翻车的一步,改错题伺候。</p>
  </div>

  <div class="exslot" data-ex="js-3"></div>
  <div class="exslot" data-ex="js-4"></div>

  <h3 class="sec-title">🎯 本站大作业(2 个)</h3>
  <div class="exslot" data-ex="js-b1"></div>
  <div class="exslot" data-ex="js-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 本站心法</div>
    <ul>
      <li>Marshal:struct→JSON 字节;打印要 string(b)</li>
      <li>小写字段不导出 → 被扔掉;名字用 json:"标签" 定制</li>
      <li>Unmarshal:JSON→struct,必须传指针 &cfg,记得接 err</li>
      <li>打包/拆包永远成对出现:API 返回用 Marshal,收配置用 Unmarshal</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本站对应《Go 语言圣经》第 4.5 节 ——<a href="https://golang-china.github.io/gopl-zh/ch4/ch4-05.html" target="_blank" rel="noopener">去读原文</a></div>`,

  exercises: [
    {
      id: "js-1", kind: "predict", xp: 10, title: "小写字段被扔了",
      task: "age 是小写开头。打包后 JSON 长什么样?把完整 JSON 打出来(不加空格)。",
      given: "package main\nimport \"fmt\"\nimport \"encoding/json\"\n\ntype User struct {\n    Name string\n    age  int     // 小写!\n}\n\nfunc main() {\n\tb, _ := json.Marshal(User{Name: \"地鼠\", age: 3})\n\tfmt.Println(string(b))\n}",
      expected: "{\"Name\":\"地鼠\"}",
      ref: "…\nb, _ := json.Marshal(User{Name: \"地鼠\", age: 3})\nfmt.Println(string(b))   // {\"Name\":\"地鼠\"} ——age 无声消失",
      refNote: "encoding/json 只认导出字段(大写开头)。age 是小写、包外不可见——JSON 打包当它不存在。想让小写名字出现在 JSON 里?不是改字段名,是用标签(下一节)。",
    },
    {
      id: "js-2", kind: "predict", xp: 10, title: "标签生效",
      task: "字段名大写,但标签要求 JSON 里小写。打出来的完整 JSON 是?",
      given: "package main\nimport \"fmt\"\nimport \"encoding/json\"\n\ntype User struct {\n    Name string `json:\"name\"`\n    Age  int    `json:\"age\"`\n}\n\nfunc main() {\n\tb, _ := json.Marshal(User{Name: \"小地鼠\", Age: 3})\n\tfmt.Println(string(b))\n}",
      expected: "{\"name\":\"小地鼠\",\"age\":3}",
      ref: "…\nfmt.Println(string(b))   // {\"name\":\"小地鼠\",\"age\":3}",
      refNote: "Go 侧字段照旧大写导出,JSON 侧名字由标签说了算——两全其美。注意标签用反引号包住,格式 json:\"名字\"。",
    },
    {
      id: "js-3", kind: "blank", xp: 10, mini: true, title: "拆包函数名",
      task: "JSON → struct 的函数空着。打出来(一个词)。",
      given: "package main\n\nimport \"fmt\"\nimport \"encoding/json\"\n\nfunc main() {\n\ttype Config struct { Host string }\n\tdata := []byte(`{\"host\":\"localhost\"}`)\n\tvar cfg Config\n\terr := json.____(data, &cfg)\n\tif err != nil { fmt.Println(err); return }\n\tfmt.Println(cfg.Host)\n}",
      placeholder: "一个词…",
      checks: [
        { label: "用的是 Unmarshal", hint: "json.Unmarshal(data, &cfg) ——U 要大写!", test: (s) => /^\s*Unmarshal\s*$/.test(s) },
      ],
      ref: "Unmarshal",
      refNote: "Marshal 打包、Unmarshal 拆包——对偶记忆。拆包三件套:数据 []byte、目标变量、指针 &cfg。",
    },
    {
      id: "js-4", replaceLine: "err := json.Unmarshal(data, cfg)", kind: "fix", xp: 10, title: "忘了遥控器",
      task: "这段代码会返回错误——拆包时忘了给指针。把修好的那行打出来(Unmarshal 那行,连 err 接收一起)。",
      given: "package main\n\nimport \"fmt\"\nimport \"encoding/json\"\n\nfunc main() {\n\ttype Config struct { Host string }\n\tdata := []byte(`{\"host\":\"localhost\"}`)\n\tvar cfg Config\n\terr := json.Unmarshal(data, cfg)\n\tif err != nil { fmt.Println(err); return }\n\tfmt.Println(cfg.Host)\n}",
      errText: "json: Unmarshal(non-pointer main.Config)",
      scaffold: "err := json.Unmarshal(data, cfg)",
      checks: [
        { label: "给 Unmarshal 传了指针 &cfg", hint: "第二个参数改成 &cfg ——Unmarshal 要往里写数据,得拿遥控器。", test: (s) => /Unmarshal\s*\([^)]*&\s*\w+/.test(s) },
        { label: "err 还接着", hint: "err := … 前半行不动。", test: (s) => /err\s*:=/.test(s) },
      ],
      ref: "err := json.Unmarshal(data, &cfg)",
      refNote: "不传指针,Unmarshal 拿到的只是 cfg 的复印件——想往复印件里写数据?Unmarshal 会返回错误。& 一加,立地成佛。",
    },

    /* ── 大作业 ── */
    {
      id: "js-b1", kind: "big", xp: 30, title: "大作业① 通讯录打包往返",
      task: `①定义 <code class="ic">Contact</code>(字段 Name、Phone string,挂标签 json:"name"/json:"phone");②切片装 2 个联系人,<b>Marshal</b> 后打印 JSON;③<b>Unmarshal</b> 把这段 JSON 装回一个新切片,打印第 2 个人的名字(证明往返成功)。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\n// ① Contact struct + 标签\n\nfunc main() {\n\t// ② 切片装 2 人 → Marshal → 打印\n\n\t// ③ Unmarshal 装回新切片 → 打印第 2 人名字\n\n}",
      checks: [
        { label: "Contact 有 Name/Phone 和 json 标签", hint: "Name string \\`json:\"name\"\\` / Phone string \\`json:\"phone\"\\`", test: (s) => /Name\s+string\s+`json:"name"`/.test(s) && /Phone\s+string\s+`json:"phone"`/.test(s) },
        { label: "用了 Marshal 打包并转 string 打印", hint: "b, _ := json.Marshal(contacts);fmt.Println(string(b))", test: (s) => /json\.Marshal\s*\(/.test(s) && /string\s*\(\s*\w+\s*\)/.test(s) },
        { label: "用了 Unmarshal 装回(带指针)", hint: "var back []Contact;err := json.Unmarshal(b, &back)", test: (s) => /json\.Unmarshal\s*\([^)]*&/.test(s) },
        { label: "打印了往返后的名字", hint: "fmt.Println(back[1].Name) ——第 2 人。", test: (s) => /fmt\.Print(ln|f)\s*\([^)]*back/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Contact struct {\n\tName  string `json:\"name\"`\n\tPhone string `json:\"phone\"`\n}\n\nfunc main() {\n\tcontacts := []Contact{\n\t\t{Name: \"小地鼠\", Phone: \"5xx-0001\"},\n\t\t{Name: \"阿仓\", Phone: \"5xx-0002\"},\n\t}\n\n\tb, _ := json.Marshal(contacts)\n\tfmt.Println(string(b))\n\n\tvar back []Contact\n\t_ = json.Unmarshal(b, &back)\n\tfmt.Println(back[1].Name)   // 阿仓\n}",
      refNote: "同一个 struct,Marshal 出去、Unmarshal 回来,数据一根毛都没丢——这就是「序列化」的全部承诺。真实项目里,这一对就是 API 的出和入。",
    },
    {
      id: "js-b2", kind: "big", xp: 30, title: "大作业② 解读服务器配置",
      task: `给定一段 JSON:<code class="ic">data := []byte(\\\`{"host":"localhost","port":8080}\\\`)</code>。①定义带标签的 Config(Host/Port);②Unmarshal 装进变量(记得指针和 err 检查);③打印 host 和 port。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tdata := []byte(`{\"host\":\"localhost\",\"port\":8080}`)\n\n\t// ① 定义 Config(带标签) → ② Unmarshal → ③ 打印\n\n}",
      checks: [
        { label: "定义了带标签的 Config", hint: "type Config struct { Host string \\`json:\"host\"\\`; Port int \\`json:\"port\"\\` } ——写在 main 外或里面都行。", test: (s) => /type\s+Config\s+struct/.test(s) && /json:"host"/.test(s) && /json:"port"/.test(s) },
        { label: "Unmarshal 带指针并接了 err", hint: "var cfg Config;err := json.Unmarshal(data, &cfg)", test: (s) => /json\.Unmarshal\s*\([^)]*&/.test(s) && /err\s*[:=]/.test(s) },
        { label: "检查了 err", hint: "if err != nil { … } ——老规矩。", test: (s) => /err\s*!=\s*nil/.test(s) },
        { label: "打印了两个字段", hint: "fmt.Println(cfg.Host, cfg.Port) → localhost 8080", test: (s) => /fmt\.Print(ln|f)\s*\([^)]*(Host|cfg)/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Config struct {\n\tHost string `json:\"host\"`\n\tPort int    `json:\"port\"`\n}\n\nfunc main() {\n\tdata := []byte(`{\"host\":\"localhost\",\"port\":8080}`)\n\n\tvar cfg Config\n\tif err := json.Unmarshal(data, &cfg); err != nil {\n\t\tfmt.Println(\"解析失败:\", err)\n\t\treturn\n\t}\n\tfmt.Println(cfg.Host, cfg.Port)   // localhost 8080\n}",
      refNote: "JSON 键是小写、Go 字段是大写——标签当翻译官,两头都体面。收配置、读 API、解析存档,全是这一套。",
    },
  ],
});

/* ══════════ 新站 · 竞态风暴 ══════════ */
A.registerTopic({
  key: "race", order: 13.5, part: 5, icon: "🔒", title: "竞态风暴",
  badge: { icon: "🔒", name: "锁匠" },

  html: `
  <p class="lead">并发进阶站你学会了锁的<b>语法</b>;这一站让你亲眼看锁的<b>必要性</b>——「竞态」这个幽灵,逻辑全对、结果全错,还能在 map 上当场爆炸。最后两件护身法宝:<code class="ic">sync.Once</code> 和 <code class="ic">go run -race</code>。</p>

  <h3 class="sec-title">竞态:两个都对,加起来是错</h3>
  <div class="gcode"><div class="gbar"><span>看起来人畜无害的代码</span></div><pre><code>var count int

for i := 0; i < 1000; i++ {
    go func() {
        count++        // 就一行,能有啥事?
    }()
}</code></pre></div>
  <p><code class="ic">count++</code> 是<b>三步舞</b>:读旧值 → 加 1 → 写回。两个 goroutine 同时跳这支舞,可能都读到 5,一个写 6、另一个也写 6——<b>一次加法蒸发</b>。逻辑无懈可击,结果常年 999/998。</p>

  <div class="wgslot" data-wg="race"></div>

  <div class="note">
    <h4>hamster 最可怕之处:它不出声</h4>
    <p>不崩溃、不报错,只是数字悄悄变小。测试跑十次九次对,上生产第 11 次丢数据——这就是竞态的名声。治它的药你在并发进阶站已经拿过:<code class="ic">mu.Lock() / defer mu.Unlock()</code>,把三步舞变成独舞。本站有两个改错题让你亲手下药。</p>
  </div>

  <div class="exslot" data-ex="rc-1"></div>
  <div class="exslot" data-ex="rc-2"></div>

  <h3 class="sec-title">map 并发写:当场爆炸</h3>
  <div class="gcode"><div class="gbar"><span>比丢数更惨的:直接崩</span></div><pre><code>m := make(map[int]int)\nfor i := 0; i < 100; i++ {\n    go func(n int) {\n        m[n] = n        // 多个 goroutine 同时写 map\n    }(i)\n}\n// 可能几秒后:fatal error: concurrent map writes 💥</code></pre></div>
  <p>map 内部不是并发安全的——多个 goroutine 同时写,<b>直接 fatal 崩溃</b>,不是丢数据是全灭。标准答案同样是上锁;要么就别共享,改用 channel 单点收发。</p>

  <div class="exslot" data-ex="rc-3"></div>

  <h3 class="sec-title">go run -race:竞态探测器</h3>
  <div class="gcode"><div class="gbar"><span>终端</span></div><pre><code>$ go run -race main.go
WARNING: DATA RACE
Read at 0x00c0000140a8 by goroutine 8:
  main.main.func1() /path/main.go:10 +0x3a

==================
Found 1 data race(s)</code></pre></div>
  <div class="note">
    <h4>hamster 把幽灵探测器随身带着</h4>
    <p>加个 <code class="ic">-race</code> 标志,Go 在运行时盯着每个内存读写,<b>竞态一露头就当场报警</b>(还带文件行号)。写并发程序,提交前跑一遍 -race 是基本礼仪——线上抓不到的幽灵,测试期就掐死。</p>
  </div>

  <h3 class="sec-title">sync.Once:只许初始化一次</h3>
  <div class="gcode"><div class="gbar"><span>Once:懒加载的保镖</span></div><pre><code>var once sync.Once\nvar config *Config\n\nfunc getConfig() *Config {\n    once.Do(func() {          // 并发调用,这段也只执行一次\n        config = loadConfig() // 读文件等昂贵操作\n    })\n    return config\n}</code></pre></div>
  <p>多个 goroutine 同时要配置,初始化只想做一次——手写「if 没初始化就……」在并发下会翻车(两个 goroutine 同时判断「没初始化」)。<code class="ic">sync.Once</code> 一个动作保证「全场恰好执行一次」,天然免疫竞态。</p>

  <div class="exslot" data-ex="rc-4"></div>

  <h3 class="sec-title">🎯 本站大作业(2 个)</h3>
  <div class="exslot" data-ex="rc-b1"></div>
  <div class="exslot" data-ex="rc-b2"></div>

  <div class="takeaway">
    <div class="tk-title">hamster 本站心法</div>
    <ul>
      <li>竞态 = 逻辑对、结果错,静悄悄发生;count++ 是读改写三步舞</li>
      <li>共享可变数据必上锁;map 并发写直接 fatal</li>
      <li>go run -race 是竞态探测器,提交前必跑</li>
      <li>sync.Once:全场恰好执行一次,懒加载标配</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本站对应《Go 语言圣经》第 9 章 ——<a href="https://golang-china.github.io/gopl-zh/ch9/ch9.html" target="_blank" rel="noopener">去读原文</a>(9.1 竞争条件 / 9.6 竞态检测)</div>`,

  exercises: [
    {
      id: "rc-1", runMain: "func main() {\n\tvar wg sync.WaitGroup\n\twg.Add(2)\n\tfor i := 0; i < 2; i++ { go func() { defer wg.Done(); for j := 0; j < 1000; j++ { worker() } }() }\n\twg.Wait()\n\tfmt.Println(count)\n}", kind: "fix", xp: 10, title: "给三步舞上锁",
      task: "两根 goroutine 各给 count 加 1000 次,没锁。把修好的 <b>worker 函数完整打出来</b>(用 Mutex 包住加法)。",
      given: "var count int\n\nfunc worker() {\n\tcount++\n}",
      errText: "$ go run -race main.go\nWARNING: DATA RACE\nRead at 0x00c0000140a8 by goroutine 7\n  main.worker() main.go:9 +0x2a",
      scaffold: "var count int\nvar mu sync.Mutex\n\nfunc worker() {\n\tcount++\n}",
      checks: [
        { label: "加法前 mu.Lock()", hint: "func worker() { mu.Lock(); defer mu.Unlock(); count++ } ——defer 保证出事也解锁。", test: (s) => /mu\.Lock\s*\(\s*\)|\.Lock\s*\(\s*\)/.test(s) },
        { label: "解锁用 defer mu.Unlock()", hint: "defer mu.Unlock() ——锁的黄金搭档,放函数第二行。", test: (s) => /defer\s+\w*\.?\s*Unlock\s*\(\s*\)/.test(s) },
        { label: "count++ 还在函数里", hint: "别忘了正主。", test: (s) => /count\s*\+\+/.test(s) },
      ],
      ref: "var count int\nvar mu sync.Mutex\n\nfunc worker() {\n\tmu.Lock()\n\tdefer mu.Unlock()\n\tcount++\n}",
      refNote: "锁内一次只进一根 goroutine,三步舞变独舞——竞态当场失效。defer Unlock 是铁律:函数从任何路径出去都还钥匙。",
    },
    {
      id: "rc-2", kind: "predict", xp: 10, title: "加了锁,结果可靠吗?",
      task: "1000 根 goroutine 各加一次,全程持锁,WaitGroup 等齐后打印。这次是多少?",
      given: "package main\n\nimport \"fmt\"\nimport \"sync\"\n\nvar count int\nvar mu sync.Mutex\n\nfunc add(wg *sync.WaitGroup) {\n\tdefer wg.Done()\n\tmu.Lock()\n\tdefer mu.Unlock()\n\tcount++\n}\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\twg.Add(1000)\n\tfor i := 0; i < 1000; i++ {\n\t\tgo add(&wg)\n\t}\n\twg.Wait()\n\tfmt.Println(count)\n}",
      expected: "1000",
      ref: "…\n\twg.Wait()\n\tfmt.Println(count)   // 1000 ——锁保的,一次不丢",
      refNote: "持锁的加法永远不会撞车:1000 根地鼠排成一条队,一人加一次,不多不少——对比上一题的 999/998,这就是锁匠的底气。",
    },
    {
      id: "rc-3", runMain: "func main() {\n\tvar wg sync.WaitGroup\n\tfor _, key := range []string{\"a\",\"b\"} { wg.Add(1); go func(k string) { defer wg.Done(); save(k,1) }(key) }\n\twg.Wait()\n\tfmt.Println(m)\n}", kind: "fix", xp: 10, title: "map 爆炸现场",
      task: "多根 goroutine 同时往 map 里写,程序会 fatal 崩溃。把修好的 <b>save 函数完整打出来</b>(Mutex 护住整次写操作)。",
      given: "var m = make(map[string]int)\n\nfunc save(key string, v int) {\n\tm[key] = v\n}",
      errText: "fatal error: concurrent map writes\n\ngoroutine 34 [running]:\nmain.save(0x…, 0x…)",
      scaffold: "var m = make(map[string]int)\nvar mu sync.Mutex\n\nfunc save(key string, v int) {\n\tm[key] = v\n}",
      checks: [
        { label: "写 map 前上锁", hint: "mu.Lock(); defer mu.Unlock(); m[key] = v", test: (s) => /\.Lock\s*\(\s*\)/.test(s) },
        { label: "defer 解锁在位", hint: "defer mu.Unlock()", test: (s) => /defer\s+\w*\.?\s*Unlock\s*\(\s*\)/.test(s) },
        { label: "写操作还在", hint: "m[key] = v 别丢。", test: (s) => /m\s*\[\s*\w+\s*\]\s*=/.test(s) },
      ],
      ref: "var m = make(map[string]int)\nvar mu sync.Mutex\n\nfunc save(key string, v int) {\n\tmu.Lock()\n\tdefer mu.Unlock()\n\tm[key] = v\n}",
      refNote: "map 天生不是并发安全的:崩溃比丢数更响亮,也算一种「好消息」。锁一上,写入排队执行;或者换个思路——用 channel 把写集中到一根 goroutine,压根不共享。",
    },
    {
      id: "rc-4", kind: "predict", xp: 10, title: "Once 的执念",
      task: "once.Do 被叫了两次,里面还会执行两次吗?打印什么?",
      given: "var once sync.Once\n\nonce.Do(func() { fmt.Println(\"只打一次\") })\nonce.Do(func() { fmt.Println(\"还打吗?\") })",
      expected: "只打一次",
      ref: "var once sync.Once\n\nonce.Do(func() { fmt.Println(\"只打一次\") })   // 执行 ✓\nonce.Do(func() { fmt.Println(\"还打吗?\") })   // 直接跳过!",
      refNote: "Once 记住「做过了」:第二个 Do 调用直接返回,里面的函数根本不执行。并发下也一样——100 根 goroutine 同时首调,初始化恰好一次。",
    },

    /* ── 大作业 ── */
    {
      id: "rc-b1", kind: "big", xp: 30, title: "大作业① 千次累加,一次不丢",
      task: `写完整程序:1000 根 goroutine 各给共享 count 加 1,<b>Mutex 护驾</b>,WaitGroup 等齐后打印(必须是稳稳的 <b>1000</b>)。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\n// 共享 count + Mutex 声明在包级\n\nfunc main() {\n\t// 1000 根 goroutine,等齐,打印\n\n}",
      checks: [
        { label: "声明了共享 count 和 Mutex", hint: "var count int\nvar mu sync.Mutex ——包级声明。", test: (s) => /var\s+count\s+int/.test(s) && /sync\.Mutex/.test(s) },
        { label: "循环里派了 1000 根 goroutine", hint: "for i := 0; i < 1000; i++ { go func() { … }() }", test: (s) => /for[\s\S]*\bgo\s+func/.test(s) && /1000/.test(s) },
        { label: "加法全程持锁(Lock + defer Unlock)", hint: "go func() 里:mu.Lock(); defer mu.Unlock(); count++", test: (s) => /\.Lock\s*\(\s*\)[\s\S]*defer\s+[^)]*Unlock/.test(s) && /count\s*\+\+/.test(s) },
        { label: "WaitGroup 等齐后打印", hint: "wg.Add(1000)、defer wg.Done()、wg.Wait() 一样不能少,最后 fmt.Println(count)。", test: (s) => /Add\s*\(\s*1000\s*\)/.test(s) && /wg\.Wait\s*\(\s*\)/.test(s) && /fmt\.Print(ln|f)\s*\(\s*count/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nvar count int\nvar mu sync.Mutex\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\twg.Add(1000)\n\tfor i := 0; i < 1000; i++ {\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tmu.Lock()\n\t\t\tdefer mu.Unlock()\n\t\t\tcount++\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(count)   // 1000,一次不丢\n}",
      refNote: "本地 go run 多跑几遍,再 go run -race 跑一遍——探测器全程沉默,这就是「锁匠验收合格」。去真跑时注意:Playground 上锁版也稳定,但你已经不需要运气了。",
    },
    {
      id: "rc-b2", kind: "big", xp: 30, title: "大作业② 三只地鼠抢初始化",
      task: `模拟懒加载:①包级 <code class="ic">config</code> 变量 + <code class="ic">sync.Once</code>;②写 <code class="ic">load()</code> 函数——once.Do 里给 config 赋值并打印「初始化中…」;③派 <b>3 根 goroutine 同时调 load</b>,WaitGroup 等齐后打印 config 值。<b>「初始化中…」必须只出现一次</b>,但三根地鼠都拿到了配置。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\n// config 变量 + once 声明在包级\n\nfunc load() {\n\t// once.Do:赋值 + 打印「初始化中…」\n}\n\nfunc main() {\n\t// 3 根 goroutine 同时调 load,等齐后打印 config\n\n}",
      checks: [
        { label: "声明了 config 和 sync.Once", hint: "var config string\nvar once sync.Once", test: (s) => /once\s+sync\.Once/.test(s) },
        { label: "load 里用 once.Do 包住初始化", hint: "once.Do(func() { config = \"…\"; fmt.Println(\"初始化中…\") })", test: (s) => /once\.Do\s*\(\s*func/.test(s) },
        { label: "初始化里赋值并打印", hint: "config = \"数据库连接\";fmt.Println(\"初始化中…\")", test: (s) => /初始化/.test(s) && /config\s*=/.test(s) },
        { label: "3 根 goroutine 同时抢", hint: "wg.Add(3) + for 循环里派(或手写三个 go)。谁先到都行,初始化只有一次。", test: (s) => { const goCount = (s.match(/\bgo\s+(func|load)/g) || []).length; return goCount >= 3 || (/go\s+func/.test(s) && /wg\.Add\s*\(\s*3\s*\)/.test(s)) || (/go\s+func/.test(s) && /for[\s\S]*<=?\s*3/.test(s)); } },
        { label: "等齐后打印了 config", hint: "wg.Wait() 之后:fmt.Println(config) ——三根都拿到了。", test: (s) => /fmt\.Print(ln|f)\s*\(\s*config/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nvar config string\nvar once sync.Once\n\nfunc load() {\n\tonce.Do(func() {\n\t\tconfig = \"数据库连接\"\n\t\tfmt.Println(\"初始化中…\")\n\t})\n}\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\twg.Add(3)\n\tfor i := 0; i < 3; i++ {\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tload()\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(config)   // 三根都拿到:数据库连接\n}",
      refNote: "不管三根地鼠怎么抢,「初始化中…」只出现一次,三根全都拿到同款配置——Once 把「手写 if 判断」在并发下的翻车风险一次性根除。锁匠大满贯!",
    },
  ],
});

})();
