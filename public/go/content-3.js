/* ═══════════════════════════ Go 训练场 · 专题三(函数与复合数据) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

A.registerTopic({
  key: "t3", order: 3, part: 2, icon: "📦", title: "函数与复合数据",
  eyebrow: "专题三 · 通关徽章:📦 切片术士",
  badge: { icon: "📦", name: "切片术士" },

  html: `
  <p class="lead">前两关的数据都是散兵游勇。这一关,你把代码<b>打包</b>的能力会突飞猛进:把逻辑装进<b>函数</b>,把一堆数据装进<b>切片</b>和<b>map</b>,把相关字段装进 <b>struct</b> 并给它配上方法。练完这一关,你能写出像模像样的「程序」了。</p>

  <h3 class="sec-title">函数:把活儿打包</h3>
  <div class="gcode"><div class="gbar"><span>函数三件套:签名 · 返回 · 调用</span></div><pre><code>//       接收两个 int          返回一个 int
func add(a, b int) int {
	return a + b          // return:交货
}

func main() {
	result := add(3, 4)   // 调用:把 3 和 4 递进去,接住交回来的货
	fmt.Println(result)   // 7
}</code></pre></div>
  <div class="note">
    <h4>🐹 Go 函数的独门绝活:一次交两件货</h4>
    <p>别的活儿不表,Go 函数可以<b>返回多个值</b>,调用方用两个变量接:</p>
    <div class="gcode"><div class="gbar"><span>多返回值</span></div><pre><code>func divmod(a, b int) (int, int) {
	return a / b, a % b
}

q, r := divmod(17, 5)   // q=3, r=2</code></pre></div>
    <p>这个特性贯穿 Go 全书——后面「错误处理」专题全靠它:函数把「结果」和「错误」一起交回来。</p>
  </div>

  <div class="exslot" data-ex="t3-1"></div>

  <h3 class="sec-title">defer:退房前打扫</h3>
  <p><code class="ic">defer</code> 修饰的语句,会在<b>当前函数出门前</b>才执行——像住酒店:入住时先声明「退房要打扫」,退房时自动执行。</p>
  <div class="gcode"><div class="gbar"><span>defer</span></div><pre><code>func main() {
	defer fmt.Println("退房打扫")   // 先记账,不执行
	fmt.Println("开始干活")
	// main 结束前,defer 的活儿才干
}</code></pre></div>

  <div class="exslot" data-ex="t3-2"></div>

  <h3 class="sec-title">切片:能伸缩的队伍</h3>
  <div class="gcode"><div class="gbar"><span>切片 slice</span></div><pre><code>nums := []int{1, 2}             // 字面量创建,方括号里空着 = 切片
nums = append(nums, 3)          // 追加一个 3(注意:用 = 接住返回值!)
fmt.Println(len(nums))          // 3   —— len 报数人数
fmt.Println(nums[0])            // 1   —— 索引从 0 数起

// 遍历三剑客:range
for i, v := range nums {        // i 是位置,v 是值
	fmt.Println(i, v)
}</code></pre></div>
  <div class="warn">
    <h4>⚠️ append 的两个坑</h4>
    <p>① <b>必须接返回值</b>:<code class="ic">nums = append(nums, 3)</code>——append 是「原件留着,给你一份加了新元素的」,不接等于白加;② <b>索引从 0 起</b>:三人队伍的第三位是 <code class="ic">nums[2]</code>,不是 nums[3]。</p>
  </div>

  <div class="exslot" data-ex="t3-3"></div>

  <h3 class="sec-title">map:带名牌标签的格子柜</h3>
  <div class="gcode"><div class="gbar"><span>map</span></div><pre><code>// 创建:键是 string,值是 int
m := make(map[string]int)

m["苹果"] = 5            // 放进柜子
fmt.Println(m["苹果"])    // 5
delete(m, "苹果")        // 拿走整个格子

// 高级:一眼判断键在不在
v, ok := m["苹果"]       // ok 是 bool:在不在?
fmt.Println(v, ok)       // 0 false   —— 没了</code></pre></div>
  <div class="note">
    <h4>hamster 零值再现江湖</h4>
    <p>取一个<b>不存在</b>的键,map 不报错、不崩溃,给你<b>零值</b>(int 就是 0)。这个特性配合 <code class="ic">m[w]++</code> 是绝杀:没有的键当 0 用,加一下就变 1——词频统计两行搞定,大作业③见。</p>
  </div>

  <div class="exslot" data-ex="t3-4"></div>
  <div class="exslot" data-ex="t3-5"></div>

  <h3 class="sec-title">struct + 方法:把数据和动作绑一起</h3>
  <div class="gcode"><div class="gbar"><span>struct 与方法</span></div><pre><code>// 定义一个自定义类型:Student 结构体
type Student struct {
	Name string       // 字段一:姓名
	Age  int          // 字段二:年龄
}

// 方法:专门属于 Student 的函数
//        接收器(这个方法挂在谁身上)
func (s Student) Hello() {
	fmt.Println("大家好,我是", s.Name)
}

func main() {
	xw := Student{Name: "小地鼠", Age: 3}   // 按字段名构造
	xw.Hello()                              // 点号调用方法
}</code></pre></div>
  <p>解读 <code class="ic">func (s Student) Hello()</code>:比普通函数多了括号里的 <b>(s Student)</b>——这叫<b>接收器</b>,意思是「这个方法挂在 Student 身上,谁调用谁就是 s」。</p>

  <div class="exslot" data-ex="t3-6"></div>
  <div class="exslot" data-ex="t3-7"></div>

  <h3 class="sec-title">🎯 专题三 · 结尾大作业(3 个)</h3>
  <p>三个真实小系统:通讯录、银行账户、词频统计。全要点通过 = 「切片术士」徽章。</p>
  <div class="exslot" data-ex="t3-b1"></div>
  <div class="exslot" data-ex="t3-b2"></div>
  <div class="exslot" data-ex="t3-b3"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题三心法</div>
    <ul>
      <li>函数可返回多个值,这是 Go 错误处理的地基;defer = 退房打扫</li>
      <li>切片 append 必须接返回值;索引从 0 起;range 遍历又快又稳</li>
      <li>map 取不存在的键给零值——m[w]++ 一行完成计数</li>
      <li>struct 装字段,方法靠接收器挂上去:func (s Student) Hello()</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "t3-1", kind: "blank", xp: 10, mini: false, title: "补全函数签名",
      task: `函数的身子都在,签名(第一行)空着。要求:接收两个 int 参数 a、b,返回一个 int。<span class="hl">把签名打出来</span>。`,
      given: "____ {\n\treturn a + b\n}\n\nfunc main() {\n\tfmt.Println(add(1, 2))\n}",
      placeholder: "func …",
      checks: [
        { label: "func 名字是 add", hint: "func add(…)", test: (s) => /func\s+add\s*\(/.test(s) },
        { label: "接收两个 int 参数", hint: "同类型参数可以合写:a, b int ——一个 int 管俩。", test: (s) => /\(\s*a\s*,\s*b\s+int\s*\)/.test(s) },
        { label: "声明返回一个 int", hint: "参数括号后面写返回类型:int,不带括号。", test: (s) => /\)\s*int\b/.test(s) },
      ],
      ref: "func add(a, b int) int",
      refNote: "签名是函数的合同:收什么、交什么,一行写得清清楚楚。a、b 都是 int 时可以合并声明——这是 Go 签名的常见省字写法。",
    },
    {
      id: "t3-2", kind: "predict", xp: 10, title: "defer:谁先谁后?",
      task: `defer 把「打扫」记账了,但不是现在干。<span class="hl">两行输出按顺序打出来。</span>`,
      given: "func main() {\n\tdefer fmt.Println(\"退房打扫\")\n\tfmt.Println(\"开始干活\")\n}",
      expected: "开始干活\n退房打扫",
      ref: "func main() {\n\tdefer fmt.Println(\"退房打扫\")   // 记账:出门前干这个\n\tfmt.Println(\"开始干活\")\n}",
      refNote: "defer 只记账、不干活——函数正常流程先跑完(开始干活),临出门前才补上记账的事(退房打扫)。多个 defer 像叠盘子:后记的先干。",
    },
    {
      id: "t3-3", kind: "predict", xp: 10, title: "切片:加了一个之后",
      task: `切片加了新队员。<span class="hl">打印出来的是什么?</span>(注意索引从谁数起)`,
      given: "nums := []int{1, 2}\nnums = append(nums, 3)\nfmt.Println(len(nums), nums[2])",
      expected: "3 3",
      ref: "nums := []int{1, 2}\nnums = append(nums, 3)      // 队伍变成 [1 2 3]\nfmt.Println(len(nums), nums[2])\n// len=3;nums[2] 是第三个位置的 3(从 0 数)",
      refNote: "len 数人头:3 个。nums[2] 从 0 数起数到第三位:值是 3。两次 3 撞在一起纯属巧合,数清楚是关键。",
    },
    {
      id: "t3-4", kind: "write", xp: 10, title: "动手写:写个 double 函数",
      task: `写完整程序:定义函数 <code class="ic">double(n int) int</code> 返回 n 的两倍;在 main 里调用 <code class="ic">double(21)</code> 并打印结果(应该是 42)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// 在这里定义 double 函数\n\nfunc main() {\n\t// 调用 double(21) 并打印\n\n}",
      checks: [
        { label: "定义了 double 函数", hint: "func double(n int) int { … }", test: (s) => /func\s+double\s*\(\s*n\s+int\s*\)\s*int/.test(s) },
        { label: "函数里有 return 交货", hint: "return n * 2", test: (s) => /\breturn\b/.test(s) },
        { label: "在 main 里调用了 double(21)", hint: "result := double(21),然后打印 result。", test: (s) => /double\s*\(\s*21\s*\)/.test(s) },
        { label: "打印了结果", hint: "fmt.Println(result)", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc double(n int) int {\n\treturn n * 2\n}\n\nfunc main() {\n\tfmt.Println(double(21))   // 42\n}",
      refNote: "调用可以直接塞进 Println 里,也可以先接住再打印——两种都对。函数是 Go 里最划算的打包:写一次,用一辈子。",
    },
    {
      id: "t3-5", kind: "blank", xp: 10, mini: true, title: "创建一个 map",
      task: `程序要往「键是字符串、值是整数」的 map 里放苹果,但 map 还没出生。<span class="hl">把创建 map 的那行打出来</span>。`,
      given: "____\nm[\"苹果\"] = 5\nfmt.Println(m[\"苹果\"])",
      placeholder: "m := …",
      checks: [
        { label: "用 make 创建了 map[string]int", hint: "写法:m := make(map[string]int) ——键类型和值类型写在中括号里。", test: (s) => /m\s*:=\s*make\s*\(\s*map\s*\[\s*string\s*\]\s*int\s*\)/.test(s) },
      ],
      ref: "m := make(map[string]int)",
      refNote: "make(map[键类型]值类型) 是 map 的出生证明。顺手记:字面量也行——m := map[string]int{\"苹果\": 5},一次带俩。",
    },
    {
      id: "t3-6", kind: "predict", xp: 10, title: "map 里没有的键",
      task: `柜子里只有 "x",却去取 "y"。<span class="hl">打印什么?</span>(提示:想想零值)`,
      given: "m := map[string]int{\"x\": 10}\nfmt.Println(m[\"y\"])",
      expected: "0",
      ref: "m := map[string]int{\"x\": 10}\nfmt.Println(m[\"y\"])   // 打印:0",
      refNote: "取不存在的键,Go 不报错,安静地给你 int 的零值 0。想知道键到底在不在,用双返回值:v, ok := m[\"y\"]——ok 是 false。",
    },
    {
      id: "t3-7", kind: "write", xp: 10, title: "动手写:Student 结构体",
      task: `①定义 <code class="ic">type Student struct</code>,字段:<b>Name string</b>、<b>Age int</b>(定义写在 main 外面、import 下面);②在 main 里构造一个实例并打印两个字段。<span class="hl">struct 定义放函数外面是 Go 的规矩——类型住包级别。</span>`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① 在这里定义 Student struct\n\nfunc main() {\n\t// ② 构造一个 Student 实例并打印\n\n}",
      checks: [
        { label: "定义了 Student struct", hint: "type Student struct { … } ——写在 main 外面。", test: (s) => /type\s+Student\s+struct\s*\{/.test(s) },
        { label: "有 Name string 字段", hint: "struct 大括号里一行:Name string", test: (s) => /Name\s+string/.test(s) },
        { label: "有 Age int 字段", hint: "再来一行:Age int", test: (s) => /Age\s+int/.test(s) },
        { label: "构造了实例", hint: "s := Student{Name: \"小地鼠\", Age: 3} ——按字段名赋值。", test: (s) => /Student\s*\{/.test(s) },
        { label: "打印了字段", hint: "fmt.Println(s.Name, s.Age) 或 Printf 都行。", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Student struct {\n\tName string\n\tAge  int\n}\n\nfunc main() {\n\ts := Student{Name: \"小地鼠\", Age: 3}\n\tfmt.Printf(\"%s 今年 %d 岁\\n\", s.Name, s.Age)\n}",
      refNote: "构造时按字段名赋值(Name: xxx),顺序随便、漏了就装零值——比按位置填更抗手滑。s.Name 读作「s 的 Name」。",
    },

    /* ── 大作业 ── */
    {
      id: "t3-b1", kind: "big", xp: 30, title: "大作业① 通讯录",
      task: `做一个迷你通讯录:①定义 <code class="ic">Contact</code> struct(字段 <b>Name string</b>、<b>Phone string</b>);②用切片字面量装 2 个联系人;③用 <code class="ic">append</code> 再添 1 个新联系人;<b>④用 range 遍历打印所有人的姓名和电话</b>。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Contact struct\n\nfunc main() {\n\t// ② 切片字面量装 2 人\n\n\t// ③ append 再添 1 人\n\n\t// ④ range 遍历打印\n\n}",
      checks: [
        { label: "定义了 Contact struct", hint: "type Contact struct { Name string; Phone string }", test: (s) => /type\s+Contact\s+struct/.test(s) },
        { label: "有 Name 和 Phone 两个 string 字段", hint: "struct 里两行:Name string / Phone string。", test: (s) => /Name\s+string/.test(s) && /Phone\s+string/.test(s) },
        { label: "用切片装了联系人", hint: "contacts := []Contact{ … }  ——方括号里空着就是切片。", test: (s) => /\[\]\s*Contact\s*\{/.test(s) || /:=\s*\[\]/.test(s) },
        { label: "用 append 添加了新联系人", hint: "contacts = append(contacts, Contact{Name: \"…\", Phone: \"…\"}) ——append 的返回值要接住!", test: (s) => /=\s*append\s*\(/.test(s) },
        { label: "用 range 遍历并打印", hint: "for _, c := range contacts { fmt.Println(c.Name, c.Phone) }", test: (s) => /\brange\b/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Contact struct {\n\tName  string\n\tPhone string\n}\n\nfunc main() {\n\tcontacts := []Contact{\n\t\t{Name: \"小地鼠\", Phone: \"5xx-0001\"},\n\t\t{Name: \"阿仓\", Phone: \"5xx-0002\"},\n\t}\n\n\tcontacts = append(contacts, Contact{Name: \"大白\", Phone: \"5xx-0003\"})\n\n\tfor _, c := range contacts {\n\t\tfmt.Printf(\"%s:%s\\n\", c.Name, c.Phone)\n\t}\n}",
      refNote: "range 一次吐两个值:位置和元素。只要元素不要位置时,位置用 _ 丢弃——下划线在 Go 里就是「垃圾桶」。这套 struct+切片+range 的组合拳,是 Go 工程里天天见的主力阵容。",
    },
    {
      id: "t3-b2", kind: "big", xp: 30, title: "大作业② 银行账户",
      task: `①定义 <code class="ic">Account</code> struct,字段 <b>Owner string</b>、<b>Balance float64</b>;②给它写两个方法:<b>Deposit</b>(存钱,直接加进余额)和 <b>Withdraw</b>(取钱,余额够就扣、不够就拒绝——用<b>两个返回值</b>交货:<code class="ic">(float64, bool)</code>,取完的新余额 + 是否成功);③main 里:存 100,取 30,再试取 500(应该失败),把三次结果都打印出来。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Account struct\n\n// ② 两个方法(注意接收器)\n\nfunc main() {\n\t// ③ 存钱、取钱、再取一个不可能的数\n\n}",
      checks: [
        { label: "定义了 Account struct", hint: "type Account struct { Owner string; Balance float64 }", test: (s) => /type\s+Account\s+struct/.test(s) },
        { label: "方法挂在了 Account 身上(有接收器)", hint: "func (a Account) Deposit(amount float64) { … } ——括号里的 (a Account) 就是接收器。", test: (s) => /func\s*\(\s*\w+\s+\*?Account\s*\)\s+\w+/.test(s) },
        { label: "Withdraw 有余额判断", hint: "if a.Balance >= amount { … } ——不够就拒绝。", test: (s) => /Balance\s*>=|>=\s*amount/.test(s) },
        { label: "Withdraw 交两个货:(float64, bool)", hint: "func (a Account) Withdraw(amount float64) (float64, bool) ——返回元组里可以带名字也可以不带。", test: (s) => /\(\s*\w*\s*float64\s*,\s*bool\s*\)/.test(s) },
        { label: "main 里调用了方法并打印", hint: "acc.Deposit(100); b, ok := acc.Withdraw(30); fmt.Println(b, ok)", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) && /\.Deposit|\.Withdraw/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Account struct {\n\tOwner   string\n\tBalance float64\n}\n\nfunc (a Account) Deposit(amount float64) {\n\ta.Balance += amount\n}\n\nfunc (a Account) Withdraw(amount float64) (float64, bool) {\n\tif a.Balance >= amount {\n\t\ta.Balance -= amount\n\t\treturn a.Balance, true\n\t}\n\treturn a.Balance, false\n}\n\nfunc main() {\n\tacc := Account{Owner: \"小地鼠\", Balance: 0}\n\tacc.Deposit(100)\n\tb, ok := acc.Withdraw(30)\n\tfmt.Println(\"取30:\", b, ok)\n\tb2, ok2 := acc.Withdraw(500)\n\tfmt.Println(\"取500:\", b2, ok2)\n}",
      refNote: "Withdraw 永远交两件货:余额 + 成败。调用方必须用两个变量接——想忽略哪个就用 _。取 500 失败,余额不动,ok 是 false。「多返回值」从此有了正经用途。",
    },
    {
      id: "t3-b3", kind: "big", xp: 30, title: "大作业③ 词频统计",
      task: `统计一句话里每个词出现几次:①给定切片 <code class="ic">words := []string{\"go\", \"is\", \"fun\", \"go\", \"is\", \"fast\"}</code>(直接复制进代码);②创建一个 <code class="ic">map[string]int</code>;③用 range 遍历 words,<b>用零值技巧</b> <code class="ic">m[w]++</code> 计数;④最后把 map 打印出来(打印结果应该是 <code>map[fast:1 fun:1 go:2 is:2]</code>,顺序可能不同)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\twords := []string{\"go\", \"is\", \"fun\", \"go\", \"is\", \"fast\"}\n\n\t// ① 创建 map\n\t// ② range 遍历计数\n\t// ③ 打印 map\n\n}",
      checks: [
        { label: "创建了 map[string]int", hint: "m := make(map[string]int)", test: (s) => /make\s*\(\s*map\s*\[\s*string\s*\]\s*int\s*\)/.test(s) || /map\s*\[\s*string\s*\]\s*int\s*\{/.test(s) },
        { label: "range 遍历了 words", hint: "for _, w := range words { … }", test: (s) => /\brange\b/.test(s) },
        { label: "用了零值技巧 m[w]++", hint: "一行:m[w]++ ——不存在的键当 0 用,加一下就变 1。这就是零值的威力。", test: (s) => /\[\s*\w+\s*\]\s*\+\+/.test(s) },
        { label: "打印了统计结果", hint: "fmt.Println(m) 直接打整个 map 也行。", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\twords := []string{\"go\", \"is\", \"fun\", \"go\", \"is\", \"fast\"}\n\n\tm := make(map[string]int)\n\tfor _, w := range words {\n\t\tm[w]++\n\t}\n\tfmt.Println(m)\n}",
      refNote: "m[w]++ 一行干了三件事:键不存在→零值 0;加 1;存回去。两行核心代码完成整个统计——零值 + map,天生一对。这就是「切片术士」的期末验收。",
    },
  ],
});

})();
