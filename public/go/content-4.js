/* ═══════════════════════════ Go 训练场 · 专题四(错误处理与接口) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

A.registerTopic({
  key: "t4", order: 7, part: 4, partTitle: "第三部分 · 工程之道", icon: "🛡", title: "错误处理与接口",
  eyebrow: "专题七 · 通关徽章:🛡 接口行家",
  badge: { icon: "🛡", name: "接口行家" },

  html: `
  <p class="lead">程序总会出错:文件不存在、除数是零、密码太短……Go 处理错误的方式独树一帜:<b>错误不是警报,是个普普通通的值</b>——像快递单一样从函数里交回来,你亲眼签收、亲手处理。这一关还有指针的温柔一面,和 Go 的招牌概念 <b>interface</b>(隐式实现的优雅)。</p>

  <h3 class="sec-title">error:把错误装进快递盒</h3>
  <div class="gcode"><div class="gbar"><span>会交货也会认错的函数</span></div><pre><code>import "errors"          // error 工具箱

func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("除数不能为零")   // 出错:货架空着,交一盒错误
	}
	return a / b, nil                         // 正常:交货 + nil(没有错误)
}</code></pre></div>
  <ul class="points">
    <li><b>error 就是一种类型</b>,和 int、string 平级——能装进变量、当参数传、当返回值交</li>
    <li><b>nil</b> 读作「空」:没有错误时的样子。出错才不空</li>
    <li>调用方用 <b>两个变量</b>接货:结果一份、错误一份,谁也别想溜</li>
  </ul>

  <div class="note">
    <h4>🐹 全 Go 最著名的一行</h4>
    <div class="gcode"><div class="gbar"><span>签名收货的标准姿势</span></div><pre><code>val, err := divide(10, 2)
if err != nil {          // err 不为空 = 出事了
	// 处理:报给用户 / 记下来 / 往上交
}</code></pre></div>
    <p><code class="ic">if err != nil</code> 这行在 Go 代码里出现率断崖式第一——官方教程里满屏都是。写熟它,你就有了 Go 程序员的肌肉记忆。</p>
  </div>

  <div class="exslot" data-ex="t4-1"></div>
  <div class="exslot" data-ex="t4-2"></div>

  <h3 class="sec-title">亲手造一个「会认错的函数」</h3>
  <p>套路永远三步:<b>①判断出问题的条件 → ②返回 errors.New(…)/fmt.Errorf(…) → ③成功路返回 nil</b>。造一次,你会认出天下所有这种函数。</p>
  <div class="exslot" data-ex="t4-3"></div>
  <div class="exslot" data-ex="t4-4"></div>

  <h3 class="sec-title">指针:遥控器与电视</h3>
  <div class="gcode"><div class="gbar"><span>指针 = 变量的遥控器</span></div><pre><code>x := 10
p := &x        // & 读「取地址」:拿到 x 的遥控器
*p = 20        // * 读「顺着遥控器去操作」:直接改了 x!
fmt.Println(x) // 20 —— x 被遥控改掉了</code></pre></div>
  <p>为什么要遥控器?函数收参数是<b>复印</b>一份——改复印件,原件不动;想把原件改掉,就得<b>递遥控器(指针)</b>。以后你会遇到 <code class="ic">func (a *Account) Withdraw(…)</code> 这种指针接收器的方法——带星号,意思就是「这个方法要改真身」。</p>

  <div class="exslot" data-ex="t4-5"></div>

  <h3 class="sec-title">interface:不查证件的能力认证</h3>
  <p>interface 只问一句话:<b>你会不会这些方法?</b>会,你就是这个接口的成员——<b>不用报名,不用声明,自动入会</b>。</p>
  <div class="gcode"><div class="gbar"><span>接口 · 隐式实现</span></div><pre><code>type Speaker interface {
	Speak() string          // 会员门槛:有一个 Speak 方法
}

type Dog struct{}

func (d Dog) Speak() string {   // Dog 写了这个方法 → 自动成为 Speaker!
	return "汪!"
}

type Robot struct{}

func (r Robot) Speak() string { // Robot 也写了 → 也是 Speaker!
	return "滴——"
}

func main() {
	team := []Speaker{Dog{}, Robot{}}   // 一支混合队伍!
	for _, s := range team {
		fmt.Println(s.Speak())      // 汪!  滴——
	}
}</code></pre></div>
  <div class="note">
    <h4>🐹 为什么这是 Go 的招牌设计?</h4>
    <p>接口不关心你是谁(狗还是机器人),只关心你能干什么(会不会说话)。<b>一个接口、百家实现,混着装、统一调</b>——后面所有 Go 生态的「插件感」,根基都在这。你上一关写的 Account 方法接收器,其实已经在为接口铺路了。</p>
  </div>

  <div class="exslot" data-ex="t4-6"></div>
  <div class="exslot" data-ex="t4-7"></div>

  <h3 class="sec-title">🎯 专题四 · 结尾大作业(3 个)</h3>
  <p>三个带「防弹衣」的程序:安全除法、形状系统、密码检查。错误和接口双修,过!</p>
  <div class="exslot" data-ex="t4-b1"></div>
  <div class="exslot" data-ex="t4-b2"></div>
  <div class="exslot" data-ex="t4-b3"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题四心法</div>
    <ul>
      <li>error 是普通值:函数交 (结果, 错误) 两个货,调用方必须签收</li>
      <li>if err != nil 是 Go 出现率第一的行;errors.New / fmt.Errorf 造错误</li>
      <li>& 取遥控器,* 按遥控器:想改真身就传指针</li>
      <li>interface 只认能力不认出身:写了方法,自动入会</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "t4-1", kind: "predict", xp: 10, title: "除数是零会怎样?",
      task: `divide(10, 0) 踩中了错误分支。<span class="hl">打印什么?</span>(注意 Println 用逗号隔开两个参数,打印时自动加空格)`,
      given: "func divide(a, b float64) (float64, error) {\n\tif b == 0 {\n\t\treturn 0, errors.New(\"除数不能为零\")\n\t}\n\treturn a / b, nil\n}\n\nfunc main() {\n\t_, err := divide(10, 0)\n\tif err != nil {\n\t\tfmt.Println(\"出错了:\", err)\n\t}\n}",
      expected: "出错了: 除数不能为零",
      ref: "…\n\t_, err := divide(10, 0)      // 结果不要,用 _ 丢掉,只接错误\n\tif err != nil {\n\t\tfmt.Println(\"出错了:\", err)   // 打印:出错了: 除数不能为零\n\t}",
      refNote: "Println(\"出错了:\", err) 两个参数之间自动加空格,所以冒号后面有一个空格。_ 是垃圾桶:这行我们只关心错误,把结果丢掉了。",
    },
    {
      id: "t4-2", kind: "blank", xp: 10, mini: true, title: "补全签收检查",
      task: `货和错误单都接回来了,检查那一行空着。<span class="hl">写出 if 与左花括号之间的条件</span>。`,
      given: "val, err := divide(10, 2)\nif ____ {\n\tfmt.Println(\"出错了:\", err)\n\treturn\n}\nfmt.Println(\"结果是\", val)",
      placeholder: "err … nil …",
      checks: [
        { label: "条件是 err != nil", hint: "「有错误」写作 err != nil ——!= 读作「不等于」。", test: (s) => /err\s*!=\s*nil/.test(s) },
      ],
      ref: "err != nil",
      refNote: "err 不为 nil = 快递里装着错误。这行检查你今后要写几千遍,现在开始攒。",
    },
    {
      id: "t4-3", kind: "write", xp: 10, title: "动手写:安全的平方根",
      task: `定义 <code class="ic">sqrtSafe(n float64) (float64, error)</code>:n 是负数 → 返回错误 <code class="ic">errors.New("负数没有实平方根")</code>;正常 → 返回 <code class="ic">math.Sqrt(n)</code> 和 nil。main 里调用 <b>sqrtSafe(9)</b>(应打 3)和 <b>sqrtSafe(-4)</b>(应打错误信息),分别处理。imports 已经备好。`,
      scaffold: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n\t\"math\"\n)\n\n// 在这里定义 sqrtSafe\n\nfunc main() {\n\t// 调用 sqrtSafe(9) 和 sqrtSafe(-4),分别处理\n\n}",
      checks: [
        { label: "签名是 (float64, error) 双返回值", hint: "func sqrtSafe(n float64) (float64, error)", test: (s) => /func\s+sqrtSafe\s*\(\s*n\s+float64\s*\)\s*\(\s*float64\s*,\s*error\s*\)/.test(s) },
        { label: "判断了负数", hint: "if n < 0 { … }", test: (s) => /if\s+n\s*<\s*0/.test(s) },
        { label: "错误用 errors.New 造", hint: "return 0, errors.New(\"负数没有实平方根\")", test: (s) => /errors\.New|fmt\.Errorf/.test(s) },
        { label: "成功路返回了 nil", hint: "return math.Sqrt(n), nil", test: (s) => /,\s*nil/.test(s) },
        { label: "main 调用并处理了错误", hint: "r, err := sqrtSafe(9); if err != nil { … } ——两份调用都要接。", test: (s) => /sqrtSafe\s*\(/.test(s) && /err\s*!=\s*nil/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n\t\"math\"\n)\n\nfunc sqrtSafe(n float64) (float64, error) {\n\tif n < 0 {\n\t\treturn 0, errors.New(\"负数没有实平方根\")\n\t}\n\treturn math.Sqrt(n), nil\n}\n\nfunc main() {\n\tr, err := sqrtSafe(9)\n\tif err != nil {\n\t\tfmt.Println(\"出错了:\", err)\n\t} else {\n\t\tfmt.Println(\"sqrt(9) =\", r)\n\t}\n\n\tr2, err2 := sqrtSafe(-4)\n\tif err2 != nil {\n\t\tfmt.Println(\"出错了:\", err2)\n\t} else {\n\t\tfmt.Println(\"sqrt(-4) =\", r2)\n\t}\n}",
      refNote: "三步套路一模一样:判条件 → 交错误 → 成功交 nil。如果你把 sqrtSafe 的检查写对了、两份调用都接了货——这个函数可以直接放进真实项目。",
    },
    {
      id: "t4-4", kind: "fix", xp: 10, title: "把被无视的错误捡起来",
      task: `这段代码<b>编译能过</b>,但 divide(10, 0) 会返回错误,程序却把 0 当结果打印了——错误单被扔进了垃圾桶。<span class="hl">把修好的代码打出来</span>:加上 if err != nil 检查,出错就打印错误并 return。`,
      given: "val, err := divide(10, 0)\nfmt.Println(\"结果:\", val)",
      scaffold: "val, err := divide(10, 0)\nfmt.Println(\"结果:\", val)",
      checks: [
        { label: "加上了 if err != nil 检查", hint: "接货之后立刻查:if err != nil { … }", test: (s) => /if\s+err\s*!=\s*nil/.test(s) },
        { label: "出错分支做了处理", hint: "分支里打印错误,并且 return ——别让程序带着错误继续跑。", test: (s) => /err[^)]*fmt\.|fmt\.[^)]*err/.test(s) && /\breturn\b/.test(s) },
        { label: "只有没错才打印结果", hint: "fmt.Println(\"结果:\", val) 要放在检查之后。", test: (s) => /if[\s\S]*fmt\.Print(ln|f)\s*\([^)]*val/.test(s) },
      ],
      ref: "val, err := divide(10, 0)\nif err != nil {\n\tfmt.Println(\"出错了:\", err)\n\treturn\n}\nfmt.Println(\"结果:\", val)",
      refNote: "这是真实项目里最危险的一类 bug:编译器抓不到,逻辑悄悄变错。Go 社区的铁律是「接了 err 就必须看一眼」——很多工具甚至会替你检查这个。",
    },
    {
      id: "t4-5", kind: "predict", xp: 10, title: "遥控器按下去",
      task: `p 是 x 的遥控器,顺着遥控器改了值。<span class="hl">x 现在是多少?</span>`,
      given: "x := 10\np := &x\n*p = 20\nfmt.Println(x)",
      expected: "20",
      ref: "x := 10\np := &x        // p 是 x 的遥控器\n*p = 20        // 顺着遥控器改\nfmt.Println(x) // 20 —— 原件被改了",
      refNote: "& 取地址(领遥控器),* 按遥控器(操作原件)。复印改不了原件,遥控器才能——这是指针存在的全部理由。",
    },
    {
      id: "t4-6", kind: "blank", xp: 10, mini: true, title: "补上关键字",
      task: `定义接口的关键字空着。<span class="hl">打出来</span>(就一个词)。`,
      given: "type Shape ____ {\n\tArea() float64\n}",
      placeholder: "一个词…",
      checks: [
        { label: "关键字是 interface", hint: "type Shape interface { … }", test: (s) => /^\s*interface\s*$/i.test(s) },
      ],
      ref: "interface",
      refNote: "interface 关键字出场:type Shape interface { … }。里面只写方法签名(门槛),不写实现。谁能干这些活,谁就自动是 Shape——下一题亲眼见。",
    },
    {
      id: "t4-7", kind: "predict", xp: 10, title: "自动入会",
      task: `Dog 写了 Speak 方法,从没填过「Speaker 入会申请表」。用 Speaker 类型的变量装它,能行吗?<span class="hl">打印什么?</span>`,
      given: "type Speaker interface {\n\tSpeak() string\n}\n\ntype Dog struct{}\n\nfunc (d Dog) Speak() string {\n\treturn \"汪!\"\n}\n\nfunc main() {\n\tvar s Speaker\n\ts = Dog{}          // Dog 没写过「我是 Speaker」,这行能编译吗?\n\tfmt.Println(s.Speak())\n}",
      expected: "汪!",
      ref: "…\n\tvar s Speaker\n\ts = Dog{}   // 编译通过!有 Speak 方法 = 自动是 Speaker\n\tfmt.Println(s.Speak())   // 打印:汪!",
      refNote: "能编译、能跑、打「汪!」。Go 的隐式实现:不查报名表,只验真本事。这就是接口的全部魔法,没有更多了。",
    },

    /* ── 大作业 ── */
    {
      id: "t4-b1", kind: "big", xp: 30, title: "大作业① 安全除法计算器",
      task: `写完整程序:①定义 <code class="ic">divide(a, b float64) (float64, error)</code>,b 为 0 时交 <code class="ic">errors.New("除数不能为零")</code>,否则交结果和 nil;②main 里调用 <b>divide(10, 2)</b>(打印 5)和 <b>divide(10, 0)</b>(打印错误信息),两次都要用 <code class="ic">if err != nil</code> 检查。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\n// ① divide 函数\n\nfunc main() {\n\t// ② 两份调用,分别处理\n\n}",
      checks: [
        { label: "签名是 (float64, error)", hint: "func divide(a, b float64) (float64, error)", test: (s) => /\(\s*float64\s*,\s*error\s*\)/.test(s) },
        { label: "判断了 b == 0", hint: "if b == 0 { return 0, errors.New(…) }", test: (s) => /if\s+b\s*==\s*0/.test(s) },
        { label: "用 errors.New 造了错误", hint: "errors.New(\"除数不能为零\")", test: (s) => /errors\.New\s*\(/.test(s) },
        { label: "成功路返回了 nil", hint: "return a / b, nil", test: (s) => /,\s*nil/.test(s) },
        { label: "main 里签收并检查了错误", hint: "每份调用:r, err := divide(…);if err != nil { 打印错误 } else { 打印结果 }", test: (s) => /err\s*!=\s*nil/.test(s) && (s.match(/divide\s*\(/g) || []).length >= 3 },
        { label: "结果和错误都打印了", hint: "成功打数值,失败打错误信息——两条路都走到。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc divide(a, b float64) (float64, error) {\n\tif b == 0 {\n\t\treturn 0, errors.New(\"除数不能为零\")\n\t}\n\treturn a / b, nil\n}\n\nfunc main() {\n\tr1, err := divide(10, 2)\n\tif err != nil {\n\t\tfmt.Println(\"出错了:\", err)\n\t} else {\n\t\tfmt.Println(\"10 / 2 =\", r1)\n\t}\n\n\tr2, err2 := divide(10, 0)\n\tif err2 != nil {\n\t\tfmt.Println(\"出错了:\", err2)\n\t} else {\n\t\tfmt.Println(\"10 / 0 =\", r2)\n\t}\n}",
      refNote: "两份调用,两条路:一路成功打 5,一路失败打错误。程序在任何输入下都不崩——这就叫「防弹」。点「去真跑」亲眼看它体面地处理 10/0。",
    },
    {
      id: "t4-b2", kind: "big", xp: 30, title: "大作业② 形状面积系统",
      task: `①定义接口 <code class="ic">Shape</code>:方法 <code class="ic">Area() float64</code>;②定义 <b>Circle</b>(字段 R)和 <b>Rect</b>(字段 W、H)两个 struct,各自实现 Area(圆用 3.14159×R×R,矩形 W×H);③组装切片 <code class="ic">shapes := []Shape{…}</code> 装一个圆(R=2)一个矩形(3×4);④range 遍历,用 %.2f 打印每块面积(应得 <b>12.57</b> 和 <b>12.00</b>)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Shape 接口\n\n// ② Circle 和 Rect + 各自的 Area 方法\n\nfunc main() {\n\t// ③ 组装 []Shape\n\t// ④ range 遍历打印面积\n\n}",
      checks: [
        { label: "定义了 Shape 接口", hint: "type Shape interface { Area() float64 }", test: (s) => /type\s+Shape\s+interface/.test(s) },
        { label: "接口门槛是 Area() float64", hint: "interface 大括号里写方法签名:Area() float64。", test: (s) => /Area\s*\(\s*\)\s*float64/.test(s) },
        { label: "Circle 和 Rect 都定义了", hint: "type Circle struct { R float64 } / type Rect struct { W, H float64 }", test: (s) => /type\s+Circle\s+struct/.test(s) && /type\s+Rect\s+struct/.test(s) },
        { label: "两个类型都实现了 Area", hint: "func (c Circle) Area() float64 / func (r Rect) Area() float64 ——接收器写上类型。", test: (s) => (s.match(/func\s*\(\s*\w+\s+(Circle|Rect)\s*\)\s+Area/g) || []).length >= 2 },
        { label: "用 []Shape 组装了混合队伍", hint: "shapes := []Shape{Circle{R: 2}, Rect{W: 3, H: 4}}", test: (s) => /\[\]\s*Shape/.test(s) },
        { label: "range 遍历并打印了面积", hint: "for _, s := range shapes { fmt.Printf(\"%.2f\\n\", s.Area()) }", test: (s) => /\brange\b/.test(s) && /%\.2f/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Shape interface {\n\tArea() float64\n}\n\ntype Circle struct {\n\tR float64\n}\n\ntype Rect struct {\n\tW, H float64\n}\n\nfunc (c Circle) Area() float64 {\n\treturn 3.14159 * c.R * c.R\n}\n\nfunc (r Rect) Area() float64 {\n\treturn r.W * r.H\n}\n\nfunc main() {\n\tshapes := []Shape{Circle{R: 2}, Rect{W: 3, H: 4}}\n\tfor _, s := range shapes {\n\t\tfmt.Printf(\"面积:%.2f\\n\", s.Area())\n\t}\n}",
      refNote: "圆和矩形八竿子打不着,却能在同一个 []Shape 队伍里排队干活——这就是接口的意义:将来加个 Triangle,只要它也写 Area(),一行不改照进队伍。",
    },
    {
      id: "t4-b3", kind: "big", xp: 30, title: "大作业③ 密码强度检查器",
      task: `①定义 <code class="ic">checkPass(pw string) (int, error)</code>:长度 < 6 → 返回 <code class="ic">0, errors.New("密码太短")</code>;否则返回 <code class="ic">len(pw) * 4, nil</code> 当分数;②main 里检查 <b>\"abc\"</b>(应打错误)和 <b>\"abc12345\"</b>(应打分数 32),都用 if err != nil 处理。`,
      scaffold: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\n// ① checkPass 函数\n\nfunc main() {\n\t// ② 两份检查\n\n}",
      checks: [
        { label: "签名是 (int, error)", hint: "func checkPass(pw string) (int, error)", test: (s) => /\(\s*int\s*,\s*error\s*\)/.test(s) },
        { label: "判断了长度 < 6", hint: "if len(pw) < 6 { … }", test: (s) => /len\s*\(\s*pw\s*\)\s*<\s*6/.test(s) },
        { label: "短密码交了错误", hint: "return 0, errors.New(\"密码太短\")", test: (s) => /errors\.New\s*\(/.test(s) },
        { label: "长密码交了分数和 nil", hint: "return len(pw) * 4, nil", test: (s) => /len\s*\(\s*pw\s*\)\s*\*\s*4/.test(s) && /,\s*nil/.test(s) },
        { label: "main 两份调用都检查了 err", hint: "score, err := checkPass(…);if err != nil { … }", test: (s) => /err\s*!=\s*nil/.test(s) && (s.match(/checkPass\s*\(/g) || []).length >= 3 },
      ],
      ref: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc checkPass(pw string) (int, error) {\n\tif len(pw) < 6 {\n\t\treturn 0, errors.New(\"密码太短\")\n\t}\n\treturn len(pw) * 4, nil\n}\n\nfunc main() {\n\tscore, err := checkPass(\"abc\")\n\tif err != nil {\n\t\tfmt.Println(\"出错了:\", err)\n\t} else {\n\t\tfmt.Println(\"分数:\", score)\n\t}\n\n\tscore2, err2 := checkPass(\"abc12345\")\n\tif err2 != nil {\n\t\tfmt.Println(\"出错了:\", err2)\n\t} else {\n\t\tfmt.Println(\"分数:\", score2)   // 8×4 = 32\n\t}\n}",
      refNote: "len(pw) 是 Go 数长度的标准姿势(上一关 range、len 一脉相承)。到这里,「接口行家」四大件齐活:造错误、签收、处理、接口编队。",
    },
  ],
});

})();
