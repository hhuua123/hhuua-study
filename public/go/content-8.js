/* ═══════════════════════════ Go 训练场 · 专题八(标准库与文件) + 专题九(测试之道) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 专题八 · 标准库与文件 ══════════ */
A.registerTopic({
  key: "stdlib", order: 8, part: 4, icon: "📚", title: "标准库与文件",
  eyebrow: "专题八 · 通关徽章:📚 标准库管家",
  badge: { icon: "📚", name: "标准库管家" },

  html: `
  <p class="lead">会语法只是会拼积木,真正让程序「能干活」的是 Go 自带的<b>标准库</b>——官方免费送的几千件兵器。这一关挑最常用的几件:读写文件、读命令行参数、看时间、生成随机数。学完,你的程序终于能<b>碰真实世界</b>了。</p>

  <h3 class="sec-title">标准库地图(先认门牌)</h3>
  <table class="tbl">
    <tr><th>包</th><th>管什么</th><th>你已见过?</th></tr>
    <tr><td><code class="ic">fmt</code></td><td>打印、格式化、Scan</td><td>✓ 全场都在用</td></tr>
    <tr><td><code class="ic">strings</code> / <code class="ic">strconv</code></td><td>字符串处理 / 文字数字互变</td><td>✓ 专题四</td></tr>
    <tr><td><code class="ic">os</code></td><td>文件读写、命令行参数</td><td>本关主角</td></tr>
    <tr><td><code class="ic">time</code></td><td>取时间、定时</td><td>本关</td></tr>
    <tr><td><code class="ic">math/rand</code></td><td>随机数</td><td>✓ 猜数字用过</td></tr>
    <tr><td><code class="ic">bufio</code></td><td>带缓冲的读(逐行读文件)</td><td>本关</td></tr>
  </table>
  <p class="compare-note">好习惯:不确定某个功能有没有现成的,先搜「go 标准库 xxx」——大概率官方早就备好了。</p>

  <h3 class="sec-title">os.Args:程序的命令行口袋</h3>
  <div class="gcode"><div class="gbar"><span>🏠 本地运行版</span></div><pre><code>// 本地执行:go run main.go 苹果 3
fmt.Println(os.Args)   // [./main 苹果 3] ——os.Args[0] 是程序自己!
fmt.Println(os.Args[1])   // 苹果
fmt.Println(os.Args[2])   // 3</code></pre></div>
  <p>命令行工具的参数全在 <code class="ic">os.Args</code> 切片里:<b>下标 0 永远是程序名</b>,真正的参数从 1 开始。CLI 工具的第一课,就这么朴素。⚠️ 没传参数就取 os.Args[1] 会当场崩(越界),先查 <code class="ic">len(os.Args)</code>。</p>

  <h3 class="sec-title">文件读写:两行搞定</h3>
  <div class="gcode"><div class="gbar"><span>读 + 写,都自带错误单</span></div><pre><code>// 写:名字、内容([]byte)、权限(0644 = 主人可读写,其他人只读)
err := os.WriteFile("note.txt", []byte("今天开始写 Go"), 0644)

// 读:返回 ([]byte, error) ——字节串 + 错误单
data, err := os.ReadFile("note.txt")
if err != nil {
	fmt.Println("读不到:", err)
	return
}
fmt.Println(string(data))   // []byte 要显式转回字符串:string(data)</code></pre></div>
  <div class="note">
    <h4>🐹 bufio.Scanner:一行一行地读</h4>
    <div class="gcode"><div class="gbar"><span>逐行扫描大文件</span></div><pre><code>f, err := os.Open("note.txt")   // 只开窗,不搬内容
if err != nil { return }
defer f.Close()               // 退房关窗,老朋友 defer!

scanner := bufio.NewScanner(f)
for scanner.Scan() {          // 有下一行就进循环
	fmt.Println(scanner.Text())   // 当前行的文字
}</code></pre></div>
    <p>ReadFile 一口吞下整个文件,Scanner 逐行吃——大文件用后者,内存才不会撑着。</p>
  </div>

  <div class="exslot" data-ex="io-1"></div>
  <div class="exslot" data-ex="io-2"></div>

  <h3 class="sec-title">time:Go 的「顺口时间」格式</h3>
  <div class="gcode"><div class="gbar"><span>Format 的模板时间</span></div><pre><code>t := time.Now()                        // 现在
fmt.Println(t.Format("2006-01-02 15:04:05"))

// Go 不用 YYYY-MM-DD 这种符号,直接给你一个"顺口时间"当模板:
// 2006=年  01=月  02=日  15=时  04=分  05=秒
// (念作:06年1月2日3点4分5秒——就是为了好记!)</code></pre></div>
  <p>想要什么格式,拿 2006-01-02 15:04:05 里<b>需要的部分</b>拼就是了,比如只显示日期 <code class="ic">t.Format("2006年01月02日")</code>。</p>

  <div class="exslot" data-ex="io-3"></div>
  <div class="exslot" data-ex="io-4"></div>
  <div class="exslot" data-ex="io-5"></div>

  <h3 class="sec-title">🎯 专题八 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="io-b1"></div>
  <div class="exslot" data-ex="io-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题八心法</div>
    <ul>
      <li>os.Args[0] 是程序名,真参数从 1 起;先查 len 防越界</li>
      <li>WriteFile(名, []byte, 0644) / ReadFile → []byte + err;string(data) 转回文字</li>
      <li>bufio.Scanner 逐行吃大文件;defer f.Close() 退房关窗</li>
      <li>时间格式 = 顺口时间 2006-01-02 15:04:05 当模板拼</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "io-1", kind: "predict", localOnly: true, xp: 10, title: "读不到的文件",
      task: `文件不存在,ReadFile 交回来的错误单不空。<span class="hl">打印什么?</span>`,
      given: "data, err := os.ReadFile(\"不存在.txt\")\nif err != nil {\n\tfmt.Println(\"读不到:\", err != nil)\n\treturn\n}\nfmt.Println(len(data))",
      expected: "读不到: true",
      ref: "data, err := os.ReadFile(\"不存在.txt\")\nif err != nil {\n\tfmt.Println(\"读不到:\", err != nil)   // err 不空 → true,走这\n\treturn\n}\nfmt.Println(len(data))",
      refNote: "文件操作永远要过 err 这道安检——硬盘随时可能缺文件、没权限、盘满了。这次我们直接把「err 是否非空」打印出来看:确实 true。",
    },
    {
      id: "io-2", kind: "blank", localOnly: true, xp: 10, mini: true, title: "写文件那行",
      task: `data 里是待写的内容,把写文件的调用补出来:写入 note.txt,权限 0644。`,
      given: "data := []byte(\"今天开始写 Go\")\n____\nfmt.Println(\"写完了\")",
      placeholder: "os.WriteFile(…)",
      checks: [
        { label: "os.WriteFile 三件套齐全", hint: "os.WriteFile(\"note.txt\", data, 0644) ——名字、内容、权限,一个不能少。", test: (s) => /os\.WriteFile\s*\(\s*"note\.txt"\s*,\s*\w+\s*,\s*0644\s*\)/.test(s) },
      ],
      ref: "os.WriteFile(\"note.txt\", data, 0644)",
      refNote: "WriteFile 也返回 error(真实代码里要接住检查),这里先聚焦写法。0644 是文件权限的Unix 记号:主人读写、访客只读,示例文件使用这个权限；敏感文件应限制其他用户读取。",
    },
    {
      id: "io-3", kind: "predict", xp: 10, title: "顺口时间格式",
      task: `Format 的模板已经给你了。<span class="hl">打印什么?</span>(这是固定日期,不是现在)</p>`,
      given: "t := time.Date(2026, 11, 20, 10, 30, 0, 0, time.UTC)\nfmt.Println(t.Format(\"2006-01-02 15:04\"))",
      expected: "2026-11-20 10:30",
      ref: "t := time.Date(2026, 11, 20, 10, 30, 0, 0, time.UTC)\nfmt.Println(t.Format(\"2006-01-02 15:04\"))\n// 模板里的 2006→2026,01→11,02→20,15→10,04→30 ——按位替换",
      refNote: "模板怎么写,输出就怎么长——想换格式改模板即可,比如 Format(\"2006年01月02日\") → 2026年11月20日。一次记顺,终身受用。",
    },
    {
      id: "io-4", kind: "write", localOnly: true, xp: 10, title: "动手写:写进去,读出来(本地运行版 🏠)",
      task: `完整小程序:①用 <code class="ic">os.WriteFile</code> 把 <code class="ic">[]byte("你好,文件")</code> 写进 hello.txt;②用 <code class="ic">os.ReadFile</code> 读回来,检查 err;<b>③用 string(…) 转回文字打印</b>(应打印「你好,文件」)。🏠 本地运行:Playground 文件只读,写文件会报错——本地跑才能看到全流程!`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\t// ① 写 → ② 读(查 err)→ ③ string() 转回打印\n\n}",
      checks: [
        { label: "用 os.WriteFile 写了文件", hint: "os.WriteFile(\"hello.txt\", []byte(\"你好,文件\"), 0644) ——记得接 err 或用 _。", test: (s) => /os\.WriteFile\s*\(/.test(s) },
        { label: "用 os.ReadFile 读了回来", hint: "data, err := os.ReadFile(\"hello.txt\")", test: (s) => /os\.ReadFile\s*\(/.test(s) },
        { label: "读写两处都检查了 err", hint: "WriteFile 返回的 err 也要看(if err != nil 或至少判断)。", test: (s) => (s.match(/err\s*!=\s*nil|err\s*=/g) || []).length >= 2 },
        { label: "string() 转换并打印了内容", hint: "fmt.Println(string(data))", test: (s) => /string\s*\(\s*\w+\s*\)/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\terr := os.WriteFile(\"hello.txt\", []byte(\"你好,文件\"), 0644)\n\tif err != nil {\n\t\tfmt.Println(\"写失败:\", err)\n\t\treturn\n\t}\n\n\tdata, err := os.ReadFile(\"hello.txt\")\n\tif err != nil {\n\t\tfmt.Println(\"读失败:\", err)\n\t\treturn\n\t}\n\tfmt.Println(string(data))   // 你好,文件\n}",
      refNote: "写进去、读回来、转回文字——数据在硬盘和内存之间完整走了一圈。这是所有「能存东西」的工具的地基。",
    },
    {
      id: "io-5", kind: "blank", localOnly: true, xp: 10, mini: true, title: "扫描器的前进键",
      task: `bufio.Scanner 逐行读文件,循环条件里空着——「有下一行吗」的方法名是?把括号里那半截补出来。`,
      given: "f, err := os.Open(\"note.txt\")\nif err != nil {\n\tfmt.Println(err)\n\treturn\n}\ndefer f.Close()\nscanner := bufio.NewScanner(f)\nfor scanner.____ {\n\tfmt.Println(scanner.Text())\n}",
      placeholder: "Scan…",
      checks: [
        { label: "调用了 Scan()", hint: "scanner.Scan() ——有下一行返回 true,循环继续。", test: (s) => /Scan\s*\(\s*\)/.test(s) },
      ],
      ref: "Scan()",
      refNote: "for scanner.Scan() 是逐行读的固定骨架:Scan 问「还有下一行吗」,Text() 给出当前行的文字。加一句 if scanner.Err() != nil 就更稳。",
    },

    /* ── 大作业 ── */
    {
      id: "io-b1", kind: "big", localOnly: true, xp: 30, title: "大作业① 电子日记本(本地运行版 🏠)",
      task: `会存档的日记本:①把两行日记(<code class="ic">"今天学了标准库\\n明天学测试"</code>)用 <code class="ic">os.WriteFile</code> 写进 diary.txt;②用 <code class="ic">os.ReadFile</code> 读回,转 string 后打印全文;<b>③再用 strings.Split 按换行切,打印共几行</b>(应为 2 行)。🏠 本地运行。imports 已备好:fmt、os、strings。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc main() {\n\t// ① 写两行日记 → ② 读回打印 → ③ Split 数行数\n\n}",
      checks: [
        { label: "用 WriteFile 写了日记", hint: "os.WriteFile(\"diary.txt\", []byte(\"今天学了标准库\\n明天学测试\"), 0644)", test: (s) => /os\.WriteFile\s*\(/.test(s) },
        { label: "用 ReadFile 读回并转回文字", hint: "data, err := os.ReadFile(…);string(data)", test: (s) => /os\.ReadFile\s*\(/.test(s) && /string\s*\(\s*\w+\s*\)/.test(s) },
        { label: "err 检查至少两处", hint: "写一处、读一处,都 if err != nil。", test: (s) => (s.match(/err\s*!=\s*nil/g) || []).length >= 2 },
        { label: "用 Split 按换行切开并数行", hint: "lines := strings.Split(s, \"\\n\");fmt.Println(len(lines)) → 2", test: (s) => /strings\.Split\s*\(/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc main() {\n\terr := os.WriteFile(\"diary.txt\", []byte(\"今天学了标准库\\n明天学测试\"), 0644)\n\tif err != nil {\n\t\tfmt.Println(\"写失败:\", err)\n\t\treturn\n\t}\n\n\tdata, err := os.ReadFile(\"diary.txt\")\n\tif err != nil {\n\t\tfmt.Println(\"读失败:\", err)\n\t\treturn\n\t}\n\ts := string(data)\n\tfmt.Println(\"日记内容:\\n\" + s)\n\n\tlines := strings.Split(s, \"\\n\")\n\tfmt.Println(\"共\", len(lines), \"行\")   // 2\n}",
      refNote: "写、读、转、切、数——五步一条龙。这就是「程序有了记忆」:关机重跑,日记还在硬盘里躺着。把它接上 os.Args,就能做成命令行日记工具。",
    },
    {
      id: "io-b2", kind: "big", localOnly: true, xp: 30, title: "大作业② 迷你 wc(本地运行版 🏠)",
      task: `自制「文件统计器」(Linux 经典工具 wc 的雏形):①先写 sample.txt,内容固定 <code class="ic">"go is fun\\ngo is fast\\n"</code>(含末尾换行);②读回后统计三样并打印:<b>字节总数</b>(len(data))、<b>词数</b>(strings.Fields)、<b>行数</b>(Split 按换行,注意先 TrimRight 掉末尾换行再切,应为 2 行)。🏠 本地运行。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc main() {\n\t// ① 写 sample.txt → ② 统计字节/词/行并打印\n\n}",
      checks: [
        { label: "先写了样例文件", hint: "os.WriteFile(\"sample.txt\", []byte(\"go is fun\\ngo is fast\\n\"), 0644)", test: (s) => /os\.WriteFile\s*\(/.test(s) },
        { label: "读回并检查了 err", hint: "data, err := os.ReadFile(\"sample.txt\");if err != nil { … }", test: (s) => /os\.ReadFile\s*\(/.test(s) && /err\s*!=\s*nil/.test(s) },
        { label: "统计了字节总数", hint: "fmt.Println(\"字节:\", len(data)) → 21", test: (s) => /len\s*\(\s*\w+\s*\)/.test(s) },
        { label: "用 Fields 数了词", hint: "words := strings.Fields(s);len(words) → 4", test: (s) => /strings\.Fields\s*\(/.test(s) },
        { label: "用 Split 数了行(且处理了末尾换行)", hint: "先 strings.TrimRight(s, \"\\n\") 再 Split(s, \"\\n\") → 2 行,不然末尾空行会多算。", test: (s) => /strings\.Split\s*\(/.test(s) && /TrimRight|TrimSpace/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc main() {\n\tos.WriteFile(\"sample.txt\", []byte(\"go is fun\\ngo is fast\\n\"), 0644)\n\n\tdata, err := os.ReadFile(\"sample.txt\")\n\tif err != nil {\n\t\tfmt.Println(\"读失败:\", err)\n\t\treturn\n\t}\n\ts := string(data)\n\n\twords := strings.Fields(s)\n\tlines := strings.Split(strings.TrimRight(s, \"\\n\"), \"\\n\")\n\n\tfmt.Println(\"字节:\", len(data))         // 21\n\tfmt.Println(\"词数:\", len(words))        // 4\n\tfmt.Println(\"行数:\", len(lines))        // 2\n}",
      refNote: "三个数字 21、4、2,和 Linux 的 wc 命令一个意思。注意末尾换行的小陷阱:不 Trim 一下,Split 会切出一个「空行」,统计就虚高一格——文件处理的经典细节。",
    },
  ],
});

/* ══════════ 专题九 · 测试之道 ══════════ */
A.registerTopic({
  key: "test", order: 9, part: 4, icon: "🧪", title: "测试之道",
  eyebrow: "专题九 · 通关徽章:🧪 测试先锋",
  badge: { icon: "🧪", name: "测试先锋" },

  html: `
  <p class="lead">改完代码,你是靠肉眼盯输出验证,还是每次手动跑一遍?Go 文化把测试当<b>一等公民</b>:一行 <code class="ic">go test</code> 命令,几十个断言瞬间全跑完。这一关学会写 Go 测试,顺便解锁 Go 最有辨识度的招牌姿势——<b>表驱动测试</b>。</p>

  <h3 class="sec-title">go test 的三条家规</h3>
  <div class="note">
    <h4>🐹 测试世界的入场券</h4>
    <ul>
      <li>测试文件必须以 <code class="ic">_test.go</code> 结尾(add.go 的测试住在 add_test.go)</li>
      <li>测试函数必须以 <b>Test</b> 开头,且接收唯一的 <code class="ic">t *testing.T</code>:<code class="ic">func TestAdd(t *testing.T)</code></li>
      <li>运行命令:<code class="ic">go test ./...</code> ——全绿打印 ok,有错打印 FAIL 并告诉你哪个函数</li>
    </ul>
  </div>

  <h3 class="sec-title">Go 的朴素断言:不用任何断言库</h3>
  <div class="gcode"><div class="gbar"><span>add_test.go</span></div><pre><code>func TestAdd(t *testing.T) {
	got := add(2, 3)
	want := 5
	if got != want {                      // Go 风格:手写 if,不用 assert 库
		t.Errorf("add(2, 3) = %d; 期望 %d", got, want)
	}
}</code></pre></div>
  <p><code class="ic">t.Errorf</code> 记一笔失败但<b>不中断</b>,跑完所有测试再汇总;想当场掀桌用 <code class="ic">t.Fatalf</code>。风格看似朴素,却让失败信息<b>完全由你掌控</b>——写什么打什么。</p>

  <div class="exslot" data-ex="te-1"></div>
  <div class="exslot" data-ex="te-2"></div>
  <div class="exslot" data-ex="te-3"></div>

  <h3 class="sec-title">表驱动测试:Go 的招牌姿势</h3>
  <div class="gcode"><div class="gbar"><span>把用例排成表,一次跑全</span></div><pre><code>func TestMax(t *testing.T) {
	cases := []struct {          // 一张用例表:名字、输入、期望
		name string
		a, b, want int
	}{
		{"都是正数", 3, 7, 7},
		{"有负数", -2, -9, -2},
		{"相等", 5, 5, 5},
	}

	for _, c := range cases {          // 逐行验
		t.Run(c.name, func(t *testing.T) {   // 每行一个子测试
			if got := Max(c.a, c.b); got != c.want {
				t.Errorf("Max(%d, %d) = %d; 期望 %d", c.a, c.b, got, c.want)
			}
		})
	}
}</code></pre></div>
  <div class="note">
    <h4>🐹 为什么这是 Go 文化?</h4>
    <p>新用例 = 表里<b>加一行</b>,测试逻辑一行不改。加用例的心理成本降到接近零,大家才会乐呵呵地补边界情况(负数、零、相等、空值……)。<b>看一个 Go 项目的测试写得像不像样,先看它是不是表驱动。</b></p>
  </div>

  <div class="exslot" data-ex="te-4"></div>
  <div class="exslot" data-ex="te-5"></div>

  <h3 class="sec-title">🎯 专题九 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="te-b1"></div>
  <div class="exslot" data-ex="te-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题九心法</div>
    <ul>
      <li>三条家规:xxx_test.go 文件、Test 开头函数、go test 跑全</li>
      <li>断言朴素:if got != want { t.Errorf } ——失败信息自己写</li>
      <li>表驱动:用例排成表,新用例只加行不写逻辑</li>
      <li>t.Run 子测试让失败报告按用例点名</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "te-1", kind: "blank", localOnly: true, xp: 10, mini: false, title: "测试函数签名",
      task: `给 add 写测试,函数签名那一行空着。三样规矩里它占两样:<b>Test 开头 + 唯一的 t *testing.T</b>。<span class="hl">把签名行打出来</span>。`,
      given: "____ {\n\tgot := add(2, 3)\n\tif got != 5 {\n\t\tt.Errorf(\"add(2, 3) = %d; 期望 5\", got)\n\t}\n}",
      placeholder: "func Test…",
      checks: [
        { label: "函数名以 Test 开头", hint: "func TestAdd(…) ——Test 前缀是 go test 认亲的记号。", test: (s) => /func\s+Test\w*\s*\(/.test(s) },
        { label: "参数是 t *testing.T", hint: "func TestAdd(t *testing.T) ——星号别丢,t 是测试世界的笔。", test: (s) => /\(\s*t\s+\*testing\.T\s*\)/.test(s) },
      ],
      ref: "func TestAdd(t *testing.T)",
      refNote: "Test + 大写字母开头的名字 + (t *testing.T) ——三条凑齐,go test 才会认领这个函数。签名不符合要求时，go test 可能报错。",
    },
    {
      id: "te-2", kind: "fix", localOnly: true, xp: 10, title: "打印不算断言",
      task: `这个测试<b>永远显示通过</b>——哪怕 Double 写错了,它也只是把错值打印出来完事。测试要的是「错了就吭声」。修好它:用 if + t.Errorf 做真断言(Double(4) 应等于 8)。`,
      given: "func TestDouble(t *testing.T) {\n\tgot := Double(4)\n\tfmt.Println(got)      // 打印不算断言!\n}",
      scaffold: "func TestDouble(t *testing.T) {\n\tgot := Double(4)\n\tfmt.Println(got)      // 打印不算断言!\n}",
      checks: [
        { label: "做了真断言 if got != 8", hint: "if got != 8 { … }", test: (s) => /if\s+got\s*!=\s*8/.test(s) },
        { label: "失败时用 t.Errorf 吭声", hint: "t.Errorf(\"Double(4) = %d; 期望 8\", got)", test: (s) => /t\.Errorf\s*\(/.test(s) },
        { label: "不再靠打印充数", hint: "fmt.Println 那行删掉——测试输出不给人看,给 go test 看。", test: (s) => !/fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "func TestDouble(t *testing.T) {\n\tgot := Double(4)\n\tif got != 8 {\n\t\tt.Errorf(\"Double(4) = %d; 期望 8\", got)\n\t}\n}",
      refNote: "Println 不会让测试失败,Errorf 才会。「打印了就算测过」是新手最大的自欺——修好这个,你的测试才有牙齿。",
    },
    {
      id: "te-3", kind: "predict", localOnly: true, xp: 10, title: "认读 go test 的脸色",
      task: `假设 add(2, 3) 被写成了返回 a - b。测试跑完,go test 输出的最后会亮出哪个单词?(就打那个单词)`,
      given: "func TestAdd(t *testing.T) {\n\tgot := add(2, 3)   // add 被写坏了:返回 a - b → -1\n\tif got != 5 {\n\t\tt.Errorf(\"add(2, 3) = %d; 期望 5\", got)\n\t}\n}",
      expected: "FAIL",
      ref: "// go test 输出(节选):\n// --- FAIL: TestAdd (0.00s)\n//     add_test.go:8: add(2, 3) = -1; 期望 5\n// FAIL",
      refNote: "失败=FAIL+每个失败测试的点名;全过=一个低调的 ok。把输出认熟,红绿灯一眼可辨。",
    },
    {
      id: "te-4", kind: "write", localOnly: true, xp: 10, title: "动手写:第一个真测试",
      task: `给已经写好的 add 函数补一个真测试(测试骨架已备):调用 <code class="ic">add(2, 3)</code>,断言结果等于 5——用 if + <code class="ic">t.Errorf</code>,失败信息里带上 got 的值。`,
      scaffold: "func add(a, b int) int {\n\treturn a + b\n}\n\nfunc TestAdd(t *testing.T) {\n\t// 调用 add(2, 3),断言等于 5\n\n}",
      checks: [
        { label: "调用了 add(2, 3)", hint: "got := add(2, 3)", test: (s) => /add\s*\(\s*2\s*,\s*3\s*\)/.test(s) },
        { label: "if 断言了 5", hint: "if got != 5 { … }", test: (s) => /if\s+got\s*!=\s*5/.test(s) },
        { label: "失败信息用 t.Errorf", hint: "t.Errorf(\"add(2, 3) = %d; 期望 5\", got)", test: (s) => /t\.Errorf\s*\(/.test(s) && /%d/.test(s) },
      ],
      ref: "func TestAdd(t *testing.T) {\n\tgot := add(2, 3)\n\tif got != 5 {\n\t\tt.Errorf(\"add(2, 3) = %d; 期望 5\", got)\n\t}\n}",
      refNote: "九行代码,四句是骨头:调用、断言、报错、收工。以后每个函数都配这么一小块,你的代码从此有了自动哨兵。",
    },
    {
      id: "te-5", kind: "blank", localOnly: true, xp: 10, mini: true, title: "测试文件的门牌",
      task: `go test 只认特定后缀的文件。math.go 的测试文件该叫什么?<span class="hl">把完整文件名打出来</span>。`,
      given: "// math.go 的测试文件叫:\n// ____",
      placeholder: "math…",
      checks: [
        { label: "文件名以 _test.go 结尾", hint: "math_test.go ——go test 靠这个后缀认亲。", test: (s) => /^\s*math_test\.go\s*$/i.test(s) },
      ],
      ref: "math_test.go",
      refNote: "_test.go 后缀一举两得:go test 认领它,go build 无视它(测试代码不会被打进正式程序)。文件组织这活儿,Go 用后缀解决得干干净净。",
    },

    /* ── 大作业 ── */
    {
      id: "te-b1", kind: "big", localOnly: true, xp: 30, title: "大作业① Max 的表驱动测试",
      task: `给 Max(返回两数较大者,已备好)写<b>表驱动测试</b>:①用 <code class="ic">[]struct</code> 定义用例表(name、a、b、want 四列);②<b>至少 3 个用例</b>:都是正数、有负数、两数相等;③range 遍历 + <code class="ic">t.Run(c.name, …)</code> 子测试;④断言失败用 t.Errorf。`,
      scaffold: "func Max(a, b int) int {\n\tif a > b {\n\t\treturn a\n\t}\n\treturn b\n}\n\nfunc TestMax(t *testing.T) {\n\t// ① 用例表 → ② range + t.Run → ③ 断言\n\n}",
      checks: [
        { label: "用 []struct 定义了用例表", hint: "cases := []struct { name string; a, b, want int }{ … }", test: (s) => /\[\]struct\s*\{/.test(s) },
        { label: "至少 3 个用例", hint: "表里三行:{\"都是正数\", 3, 7, 7} 这种,至少三行。", test: (s) => (s.match(/\{\s*"/g) || []).length >= 3 },
        { label: "包含负数或相等这类边界用例", hint: "除正数外,至少一个 {-2, -9, -2} 或 {5, 5, 5}。", test: (s) => /-\d/.test(s) || /want[:\s]+5[\s\S]*\{\s*"相等"|,\s*5,\s*5,\s*5/.test(s) },
        { label: "range 遍历用例", hint: "for _, c := range cases { … }", test: (s) => /\brange\s+\w+/.test(s) },
        { label: "用了 t.Run 子测试", hint: "t.Run(c.name, func(t *testing.T) { … })", test: (s) => /t\.Run\s*\(/.test(s) },
        { label: "断言失败用 t.Errorf 报数", hint: "if got := Max(c.a, c.b); got != c.want { t.Errorf(…) }", test: (s) => /t\.Errorf\s*\(/.test(s) },
      ],
      ref: "func Max(a, b int) int {\n\tif a > b {\n\t\treturn a\n\t}\n\treturn b\n}\n\nfunc TestMax(t *testing.T) {\n\tcases := []struct {\n\t\tname string\n\t\ta, b  int\n\t\twant  int\n\t}{\n\t\t{\"都是正数\", 3, 7, 7},\n\t\t{\"有负数\", -2, -9, -2},\n\t\t{\"两数相等\", 5, 5, 5},\n\t}\n\n\tfor _, c := range cases {\n\t\tt.Run(c.name, func(t *testing.T) {\n\t\t\tif got := Max(c.a, c.b); got != c.want {\n\t\t\t\tt.Errorf(\"Max(%d, %d) = %d; 期望 %d\", c.a, c.b, got, c.want)\n\t\t\t}\n\t\t})\n\t}\n}",
      refNote: "这就是教科书级的表驱动测试:用例成表、子测试点名、失败带数。以后想测「0 和 -1」「超大数」,表里添一行就完事——这就是 Go 项目测试覆盖率普遍很高的秘密。",
    },
    {
      id: "te-b2", kind: "big", localOnly: true, xp: 30, title: "大作业② Reverse:函数 + 测试成对交付",
      task: `功能与测试<b>成对</b>交付。按参考答案分成 main.go 和 reverse_test.go，然后运行 go test。①写 <code class="ic">Reverse(s string) string</code>——把字符串<b>按字符反转</b>(提示:先 []rune(s) 转字符切片,再倒着拼,别忘中文!);②给它写表驱动测试:<b>普通串、含空格串、中文串</b>各一,断言反转正确(比如 "你好" ↔ "好你")。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Reverse:[]rune 转字符切片,倒着拼\n\n// ② TestReverse 表驱动测试(3 个用例)\n\nfunc main() {\n\tfmt.Println(Reverse(\"地鼠修go\"))\n}",
      checks: [
        { label: "Reverse 签名正确", hint: "func Reverse(s string) string", test: (s) => /func\s+Reverse\s*\(\s*\w*\s*string\s*\)\s*string/.test(s) },
        { label: "先转成了 []rune(照顾中文)", hint: "runes := []rune(s) ——直接按字节反,中文会碎成一地乱码!", test: (s) => /\[\]rune\s*\(\s*\w+\s*\)/.test(s) },
        { label: "倒序逻辑存在(倒着遍历或首尾对调)", hint: "for i := len(runes) - 1; i >= 0; i-- { out += string(runes[i]) }", test: (s) => /for[\s\S]*len\s*\(\s*\w+\s*\)\s*-\s*1/.test(s) || /for\s+\w+\s*:=\s*\w+\s*-\s*1/.test(s) },
        { label: "测试函数 TestReverse 存在", hint: "func TestReverse(t *testing.T)", test: (s) => /func\s+TestReverse\s*\(\s*t\s+\*testing\.T/.test(s) },
        { label: "用例表 ≥3 个,含中文用例", hint: "[]struct 用例表:{\"go\", \"og\"} / {\"地鼠\", \"鼠地\"} 至少三行,必须有一个中文反转。", test: (s) => (s.match(/\{\s*"/g) || []).length >= 3 && /"好你"|"鼠地"|\\u/.test(s) },
        { label: "断言用 t.Errorf", hint: "if got := Reverse(c.in); got != c.want { t.Errorf(…) }", test: (s) => /t\.Errorf\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc Reverse(s string) string {\n\trunes := []rune(s)\n\tout := \"\"\n\tfor i := len(runes) - 1; i >= 0; i-- {\n\t\tout += string(runes[i])\n\t}\n\treturn out\n}\n\nfunc main() {\n\tfmt.Println(Reverse(\"地鼠修go\"))   // og修鼠地\n}\n\n// ===== reverse_test.go =====\npackage main\n\nimport \"testing\"\n\nfunc TestReverse(t *testing.T) {\n\tcases := []struct {\n\t\tname string\n\t\tin   string\n\t\twant string\n\t}{\n\t\t{\"普通串\", \"go\", \"og\"},\n\t\t{\"含空格\", \"ab c\", \"c ba\"},\n\t\t{\"中文串\", \"你好\", \"好你\"},\n\t}\n\n\tfor _, c := range cases {\n\t\tt.Run(c.name, func(t *testing.T) {\n\t\t\tif got := Reverse(c.in); got != c.want {\n\t\t\t\tt.Errorf(\"Reverse(%q) = %q; 期望 %q\", c.in, got, c.want)\n\t\t\t}\n\t\t})\n\t}\n}\n",
      refNote: "把 in 和 want 的中文用例放进去,再故意把 []rune 改成直接反转字节试试——测试会立刻抓住乱码。功能 + 测试成对交付,这一关出师:你写的代码从此自带哨兵。",
    },
  ],
});

})();
