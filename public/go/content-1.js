/* ═══════════════════════════ Go 训练场 · 入营 + 专题一(变量与打印) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 序关 · 入营须知 ══════════ */
A.registerTopic({
  key: "intro", order: 0, part: 1, partTitle: "入营", icon: "🐹", title: "入营须知",
  eyebrow: "序关 · 通关徽章:🐹 初入训练场",
  badge: { icon: "🐹", name: "初入训练场" },

  html: `
  <p class="lead">欢迎来到 Go 训练场。这里的规矩只有一条:<b>每一关都亲手敲代码</b>——全书没有一道选择题,你想过关,只能写。要点检查、参考答案和运行入口,全都配好了,放心开练。</p>

  <div class="note">
    <h4>🐹 Go 是个啥</h4>
    <p>2007 年,Google 的三位工程师(<b>Ken Thompson</b>——Unix 之父之一、Rob Pike、Robert Griesemer)被大型工程的臃肿折磨烦了,决定造一门<b>语法简单、编译飞快、天生适合大项目</b>的新语言。2009 年开源,它叫 <b>Go</b>(昵称 Golang,吉祥物是地鼠 Gopher)。</p>
    <p>今天你天天听说的 <b>Docker、Kubernetes</b>(云原生世界的地基)都是 Go 写的;各家的后端服务、数据库、命令行工具里也到处是它的身影。一句话:<b>互联网的地基下面,趴着很多地鼠。</b></p>
  </div>

  <h3 class="sec-title">开练之前:两种玩法,任选其一</h3>
  <div class="note">
    <h4>玩法 A:在线训练场(推荐起步)</h4>
    <p>在练习卡点击「运行 Go」，待运行代码会发送给官方 Go Playground。编译错误和输出直接显示在题目下方。</p>
    <h4>玩法 B:本地开炉</h4>
    <p>去 <b>go.dev/dl</b> 下载对应系统的安装包,一路「下一步」,然后在终端里验证:</p>
    <div class="gcode"><div class="gbar"><span>终端</span></div><pre><code>go version
go run hello.go   // 把 hello.go 换成你的文件名</code></pre></div>
    <p style="margin-bottom:0">⚠️ 官方 Playground <b>不支持键盘输入</b>——本课涉及输入的练习会单独标注「本地运行版」,涉及网络、文件或交互输入的程序请在本地运行。</p>
  </div>

  <h3 class="sec-title">本训练场的四种兵器</h3>
  <table class="tbl">
    <tr><th>按钮</th><th>干什么</th></tr>
    <tr><td><b>✍️ 提交批改</b></td><td>浏览器按规则检查关键写法；预测输出题则比对文本。编译、输出和边界情况需要实际运行验证。</td></tr>
    <tr><td><b>复制运行代码</b></td><td>把示例或作答复制到剪贴板，方便在本地编辑器里继续练习。</td></tr>
    <tr><td><b>📖 参考答案</b></td><td>卡住超过 15 分钟再看。看完请<b>关掉自己默写一遍</b>——抄会 ≠ 会写。</td></tr>
    <tr><td><b>🐹 小地鼠</b></td><td>右下角那只,点它随时传音给小提示。</td></tr>
  </table>

  <h3 class="sec-title">现在,马上,写第一行</h3>
  <p>规矩说完了——上第一发。<b>不用懂原理,猜也要猜</b>(下一关马上逐行拆给你看)。</p>
  <div class="exslot" data-ex="intro-1"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 本关心法</div>
    <ul>
      <li>Go 的卖点:语法小、编译快、适合大项目;Docker / K8s 是它的代表作</li>
      <li>在线 go.dev/play 秒开练;本地 go run 跑文件</li>
      <li>Playground 不支持键盘输入,需要输入的练习走本地</li>
      <li>过关唯一方式:亲手写代码,过批改</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "intro-1", kind: "predict", xp: 5, title: "预热:猜猜它打印什么",
      task: `第一发子弹替你上膛了。下面这段完整的 Go 程序,运行后会在屏幕上打印什么?<span class="hl">把输出原样打在框里</span>(一行就打一行)。`,
      given: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, Go!\")\n}",
      expected: "Hello, Go!",
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, Go!\")\n}",
      refNote: "Println 会把它括号里的内容原样打印出来,并自动换行。这就是你人生第一个 Go 程序的全部真相——下一关,我们把它逐行拆开讲。",
    },
  ],
});

/* ══════════ 专题一 · 变量与打印 ══════════ */
A.registerTopic({
  key: "t1", order: 1, part: 2, partTitle: "第一部分 · 基础锻造", icon: "🐹", title: "变量与打印",
  eyebrow: "专题一 · 通关徽章:🐹 Hello 毕业生",
  badge: { icon: "🐹", name: "Hello 毕业生" },

  html: `
  <p class="lead">每个 Go 程序都长着同一副骨架。这一关我们把这副骨架<b>逐行解剖</b>到彻底眼熟,再学会往里面装<b>变量</b>——程序的记忆格子。全程七个小练习 + 三个大作业,写起来。</p>

  <h3 class="sec-title">逐行解剖 Hello World</h3>
  <div class="gcode"><div class="gbar"><span>hello.go · 完整可运行</span></div><pre><code>package main        // ① 程序属于哪个包

import "fmt"        // ② 借工具箱

func main() {       // ③ 程序大门
	fmt.Println("Hello, World!")   // ④ 打印一行
}</code></pre></div>
  <ul class="points">
    <li><b>① package main</b> —— 声明"这是个<b>可执行程序</b>"。main 是特殊包名:程序从这里出生</li>
    <li><b>② import "fmt"</b> —— 借工具箱。<b>fmt</b> 是 format(格式化)的缩写,打印全靠它</li>
    <li><b>③ func main()</b> —— 大门函数。运行程序 = 从这扇门进去,门里的代码从上往下执行</li>
    <li><b>④ fmt.Println(...)</b> —— 从 fmt 工具箱里拿 Println 工具,打印一行并自动换行</li>
  </ul>

  <div class="warn">
    <h4>⚠️ 两个新手必踩的坑</h4>
    <p>① <b>行尾分号不用写</b>——Go 编译器自动补,你写了反而画蛇添足;② <b>左大括号必须在行尾</b>——<code class="ic">func main()</code> 后面直接 <code class="ic">{</code>,换行再写 <code class="ic">{</code> 会编译报错。这两个规矩是 Go 强制的,从此你的代码全队长得一样整齐。</p>
  </div>

  <div class="note">
    <h4>🐹 注释:写给人类看的悄悄话</h4>
    <p><code class="ic">// 单行注释</code> 和 <code class="ic">/* 多行注释 */</code>,编译器完全无视。本课的参考答案里就到处是注释——它们是写给三个月后的你自己看的。</p>
  </div>

  <div class="exslot" data-ex="t1-1"></div>
  <div class="exslot" data-ex="t1-2"></div>

  <h3 class="sec-title">变量:程序的记忆格子</h3>
  <p>变量 = 贴了名字的盒子,装着程序运行时要记住的东西。Go 里有三种写法:</p>
  <div class="gcode"><div class="gbar"><span>变量的三种写法</span></div><pre><code>var name string = "小地鼠"   // 完整三段式:var 名字 类型 = 值
var age = 3                    // 类型可以省略,Go 自己看值猜
city := "杭州"                  // 短声明:声明+赋值一步到位(函数内最常用)</code></pre></div>
  <div class="note">
    <h4>🐹 哪种最常用?</h4>
    <p><b>函数内用 :=</b>,又短又快;包级别(函数外面)不能用 :=,只能用 var。另外有一条铁律:<code class="ic">:=</code> 声明过的名字<b>不能再 := 第二次</b>——重新赋值直接写 <code class="ic">city = "上海"</code> 就行。</p>
  </div>
  <p>还有一类盒子是<b>封死的</b>——常量,用 <code class="ic">const</code> 声明,装进去就不许改:</p>
  <div class="gcode"><div class="gbar"><span>const</span></div><pre><code>const Pi = 3.14159
const Greeting = "吱吱"</code></pre></div>

  <h3 class="sec-title">零值:Go 不留垃圾</h3>
  <p>在 Go 里,只声明、不装东西的盒子<b>不是空的随机垃圾</b>——它有出厂默认值,叫<b>零值</b>:</p>
  <table class="tbl">
    <tr><th>类型</th><th>零值</th></tr>
    <tr><td>int / float64(数字)</td><td><code class="ic">0</code></td></tr>
    <tr><td>string(字符串)</td><td><code class="ic">""</code>(空字符串)</td></tr>
    <tr><td>bool(真假)</td><td><code class="ic">false</code></td></tr>
  </table>

  <div class="exslot" data-ex="t1-3"></div>
  <div class="exslot" data-ex="t1-4"></div>

  <h3 class="sec-title">打印三件套:Println、Printf、格式动词</h3>
  <ul class="points">
    <li><b>fmt.Println(a, b)</b> —— 依次打印,参数之间自动加空格,最后自动换行</li>
    <li><b>fmt.Printf(格式串, 值...)</b> —— 按模板打印,不会自动换行,要自己写 <code class="ic">\\n</code></li>
  </ul>
  <table class="tbl">
    <tr><th>格式动词</th><th>管什么</th><th>例子</th></tr>
    <tr><td><code class="ic">%v</code></td><td>万能:任何值都行</td><td>Printf("%v", 42) → 42</td></tr>
    <tr><td><code class="ic">%d</code></td><td>整数</td><td>Printf("我%d岁", 3) → 我3岁</td></tr>
    <tr><td><code class="ic">%s</code></td><td>字符串</td><td>Printf("%s好", "你") → 你好</td></tr>
    <tr><td><code class="ic">%f</code> / <code class="ic">%.2f</code></td><td>浮点 / 保留两位小数</td><td>Printf("%.2f", 3.14159) → 3.14</td></tr>
  </table>

  <div class="exslot" data-ex="t1-5"></div>
  <div class="exslot" data-ex="t1-6"></div>
  <div class="exslot" data-ex="t1-7"></div>

  <h3 class="sec-title">🎯 专题一 · 结尾大作业(3 个)</h3>
  <p>三个大作业全部通过,徽章到手、下一关解锁。每个都有要点清单批改和参考答案——但先别点开答案,写!</p>
  <div class="exslot" data-ex="t1-b1"></div>
  <div class="exslot" data-ex="t1-b2"></div>
  <div class="exslot" data-ex="t1-b3"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题一心法</div>
    <ul>
      <li>骨架四件套:package main → import "fmt" → func main() → 大括号行尾</li>
      <li>函数内声明变量用 :=;常量用 const;零值让盒子永远干净</li>
      <li>Println 自动换行;Printf 记得自己 \\n;%.2f 保留两位小数</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "t1-1", kind: "blank", xp: 10, mini: true, title: "补上程序的第一行",
      task: `下面程序缺了第一行——那行声明"这是个可执行程序"。<span class="hl">把缺的一行打出来</span>(就一行)。`,
      given: "____\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello!\")\n}",
      placeholder: "只打这一行…",
      checks: [
        { label: "声明了 main 包", hint: "固定写法:package main。package 后面有个空格,结尾不加分号。", test: (s) => /^package\s+main\s*$/i.test(s) },
      ],
      ref: "package main",
      refNote: "package main 告诉 Go:这是一个可执行程序,入口在 main 函数。以后每个练习的第一行都是它,写三次就刻进肌肉记忆了。",
    },
    {
      id: "t1-2", kind: "blank", xp: 10, mini: true, title: "把工具箱借进来",
      task: `程序要用 fmt 打印,却忘了借工具箱。<span class="hl">把缺的 import 行打出来</span>。`,
      given: "package main\n\n____\n\nfunc main() {\n\tfmt.Println(\"你好,Go\")\n}",
      placeholder: "就一行,注意引号…",
      checks: [
        { label: "导入了 fmt 工具箱", hint: "写法:import \"fmt\"——fmt 两边是英文双引号。", test: (s) => /^import\s+"fmt"\s*$/i.test(s) },
      ],
      ref: "import \"fmt\"",
      refNote: "没这行就用不了 fmt.Println,编译器会报 undefined: fmt。工具箱必须先借后用。",
    },
    {
      id: "t1-3", kind: "predict", xp: 10, title: "数字 vs 字符串",
      task: `两行打印长得像,身世完全不同:一个是<b>算出来的</b>,一个是<b>照抄的</b>。<span class="hl">把两行输出按顺序打出来</span>(一行一行写,别加多余空格)。`,
      given: "fmt.Println(1 + 2)\nfmt.Println(\"1 + 2\")",
      expected: "3\n1 + 2",
      ref: "fmt.Println(1 + 2)      // 打印:3      (Go 先算 1+2,再打印结果)\nfmt.Println(\"1 + 2\")     // 打印:1 + 2  (引号里是字符串,原样照抄)",
      refNote: "没引号 → Go 拿它当数学算;有引号 → 当文字抄。这是引号在编程世界里最重要的一次出场。",
    },
    {
      id: "t1-4", kind: "predict", xp: 10, title: "空盒子里有什么?(零值)",
      task: `三个变量只声明、没装东西。<span class="hl">打印出来的是什么?</span>(提示:零值表就挂在这一节上面)`,
      given: "var a int\nvar b float64\nvar ok bool\nfmt.Println(a, b, ok)",
      expected: "0 0 false",
      ref: "var a int\nvar b float64\nvar ok bool\nfmt.Println(a, b, ok)   // 打印:0 0 false",
      refNote: "int 和 float64 的零值都是 0,bool 是 false。Println 打印多个参数时中间自动加空格。零值特性后面到处用——map 那一课它还要再立大功。",
    },
    {
      id: "t1-5", kind: "write", xp: 10, title: "动手写:自我介绍",
      task: `写一个完整小程序:用 <code class="ic">:=</code> 声明变量 <b>name</b>(装一个字符串,比如"小地鼠")和 <b>age</b>(装一个整数),然后用 <code class="ic">fmt.Println</code> 打印它们。骨架已备好,填函数体就行。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// 1. 用 := 声明 name(字符串)和 age(整数)\n\n\t// 2. 用 fmt.Println 打印它们\n\n}",
      checks: [
        { label: "用了 := 短声明", hint: "函数内声明最常用写法:name := \"小地鼠\"", test: (s) => /:=/.test(s) },
        { label: "声明了至少两个变量", hint: "两行 :=,一行一个:name := \"…\" 和 age := 3", test: (s) => ((s.match(/:=/g) || []).length + (s.match(/\bvar\s+\w+/g) || []).length) >= 2 },
        { label: "调用了 fmt.Println 打印", hint: "fmt.Println(name, age) —— 一次打印两个,中间自动加空格。", test: (s) => /fmt\.Println\s*\(/.test(s) },
        { label: "有字符串值(带引号)", hint: "name 里装个字符串:\"小地鼠\"", test: (s) => /"[^"]*"/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tname := \"小地鼠\"\n\tage := 3\n\n\tfmt.Println(\"它叫\", name, \"今年\", age, \"岁\")\n}",
      refNote: "Println 想接几个参数就接几个,打印时自动用空格隔开——很贴心的换行打印。",
    },
    {
      id: "t1-6", kind: "blank", xp: 10, mini: false, title: "Printf 的格式串",
      task: `补全 Printf 的第一个参数:<span class="hl">一个完整的格式串</span>——名字的位置用 %s,年龄的位置用 %d,结尾换行 \n,用双引号包好。打印效果应该是:<code>我叫小地鼠,今年3岁</code>`,
      given: "name := \"小地鼠\"\nage := 3\n// 下面这行缺第一个参数:格式串(记得带引号)\nfmt.Printf(____, name, age)",
      placeholder: "\"…%s…%d…\\n\"",
      checks: [
        { label: "用了 %s 接字符串", hint: "字符串用动词 %s。", test: (s) => /%s/.test(s) },
        { label: "用了 %d 接整数", hint: "整数用动词 %d。", test: (s) => /%d/.test(s) },
        { label: "格式串用双引号包好", hint: "整串要被英文双引号包住。", test: (s) => /^\s*"[^"]*"\s*$/.test(s) },
        { label: "结尾有换行 \\n", hint: "Printf 不自动换行,格式串末尾自己加 \\n。", test: (s) => /\\n/.test(s) },
      ],
      ref: "\"我叫%s,今年%d岁\\n\"",
      refNote: "格式串是模板,后面的参数按 % 出现的顺序对号入座。Printf 不换行是它的性格——模板里写了 \\n 才换。注意:整个格式串要被双引号包住,结尾的 \\n 也在引号里面。",
    },
    {
      id: "t1-7", kind: "predict", xp: 10, title: "%.2f 是什么效果?",
      task: `圆周率只剩两位小数的命运。<span class="hl">打印结果是什么?</span>`,
      given: "pi := 3.14159\nfmt.Printf(\"%.2f\\n\", pi)",
      expected: "3.14",
      ref: "pi := 3.14159\nfmt.Printf(\"%.2f\\n\", pi)   // 打印:3.14",
      refNote: "%.2f = 保留两位小数,多余的直接剪掉。打印价格、面积、温度,全靠它体面收尾。",
    },

    /* ── 大作业 ── */
    {
      id: "t1-b1", kind: "big", xp: 30, title: "大作业① 个人信息卡片",
      task: `写一个程序,打印三行个人信息卡:<b>姓名</b>、<b>年龄</b>、<b>家乡</b>。要求:声明三个变量,用 <code class="ic">fmt.Printf</code> 配合 <code class="ic">%s</code> 和 <code class="ic">%d</code> 打印,每行都要换行。示例效果:<br><code>姓名:小地鼠</code><br><code>年龄:3岁</code><br><code>家乡:杭州</code>`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// 声明三个变量:name、age、city\n\n\t// 用 Printf 打印三行\n\n}",
      checks: [
        { label: "声明了至少 3 个变量", hint: "name := … / age := … / city := …,三行 :=。", test: (s) => ((s.match(/:=/g) || []).length + (s.match(/\bvar\s+\w+/g) || []).length) >= 3 },
        { label: "用了 fmt.Printf", hint: "三行都用 Printf 打印。", test: (s) => /fmt\.Printf\s*\(/.test(s) },
        { label: "格式串里用了 %s", hint: "姓名和家乡是字符串,用 %s。", test: (s) => /%s/.test(s) },
        { label: "格式串里用了 %d", hint: "年龄是整数,用 %d。", test: (s) => /%d/.test(s) },
        { label: "每行都换行了(至少 2 个 \\n)", hint: "Printf 不自动换行,格式串结尾写 \\n。", test: (s) => (s.match(/\\n/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tname := \"小地鼠\"\n\tage := 3\n\tcity := \"杭州\"\n\n\tfmt.Printf(\"姓名:%s\\n\", name)\n\tfmt.Printf(\"年龄:%d岁\\n\", age)\n\tfmt.Printf(\"家乡:%s\\n\", city)\n}",
      refNote: "三个变量、三次 Printf、三个格式串。写完可以「去真跑」看看真实效果——你写的东西真的能跑,这就是编程的快感。",
    },
    {
      id: "t1-b2", kind: "big", xp: 30, title: "大作业② 温度转换器",
      task: `体温 36.6℃ 换算成华氏度。公式:<b>F = C × 9 ÷ 5 + 32</b>。要求:声明变量装摄氏温度,把换算结果算出来存进新变量,最后用 <code class="ic">%.2f</code> 打印(答案应该是 <b>98.78</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// 1. 摄氏温度 c := 36.6\n\n\t// 2. 换算:F = C*9/5 + 32\n\n\t// 3. 用 %.2f 打印\n\n}",
      checks: [
        { label: "声明了摄氏温度变量", hint: "c := 36.6", test: (s) => /:=/.test(s) || /\bvar\s+\w+/.test(s) },
        { label: "公式带上了 9、5、32 三个数", hint: "F = C*9/5 + 32,三个数一个不能少。", test: (s) => /9/.test(s) && /5/.test(s) && /32/.test(s) },
        { label: "做了乘法和除法", hint: "* 是乘,/ 是除。", test: (s) => /\*/.test(s) && /\//.test(s) },
        { label: "用 %.2f 打印结果", hint: "fmt.Printf(\"%.2f\", f) ——结果存进变量 f 再打印更清晰。", test: (s) => /%\.2f/.test(s) },
        { label: "用了 Printf 或 Println 打印", hint: "打印别忘了。", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tc := 36.6\n\tf := c*9/5 + 32\n\n\tfmt.Printf(\"%.2f 摄氏度 = %.2f 华氏度\\n\", c, f)\n}",
      refNote: "36.6×9÷5+32 = 98.78。同一个格式串里能放多个动词——%.2f 和 %.2f,参数按顺序对号入座。",
    },
    {
      id: "t1-b3", kind: "big", xp: 30, title: "大作业③ 圆面积计算器",
      task: `半径 5.0 的圆,面积 = π × r × r。要求:π 用 <code class="ic">const</code> 声明(取 3.14159),半径和面积用变量,最后用 <code class="ic">%.2f</code> 打印(答案应该是 <b>78.54</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// 1. const pi = 3.14159\n\n\t// 2. r := 5.0,面积算出来存进 area\n\n\t// 3. %.2f 打印 area\n\n}",
      checks: [
        { label: "用了 const 声明 π", hint: "const pi = 3.14159 ——常量装进去就不许改。", test: (s) => /\bconst\s+\w+/.test(s) },
        { label: "声明了半径变量", hint: "r := 5.0", test: (s) => /:=|\bvar\s+\w+/.test(s) },
        { label: "做了两次乘法(π×r×r)", hint: "area := pi * r * r ——连乘两次。", test: (s) => (s.match(/\*/g) || []).length >= 2 },
        { label: "用 %.2f 打印面积", hint: "fmt.Printf(\"%.2f\\n\", area)", test: (s) => /%\.2f/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tconst pi = 3.14159\n\tr := 5.0\n\tarea := pi * r * r\n\n\tfmt.Printf(\"半径 %.2f 的圆面积是 %.2f\\n\", r, area)\n}",
      refNote: "3.14159 × 5 × 5 = 78.5397…,%.2f 收尾成 78.54。const + 变量 + 算式 + 格式化,这四个零件你以后每个程序都要用。",
    },
  ],
});

})();
