/* ═══════════════════════════ Go 训练场 · 反射彩蛋 + 实战大陆 + 出师 ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 隐藏彩蛋 · 反射 ══════════ */
A.registerTopic({
  key: "reflect", order: 14.5, part: 6, partTitle: "隐藏彩蛋", icon: "🔮", title: "反射镜宫",
  eyebrow: "隐藏彩蛋 · 徽章:🔮 镜法师",
  badge: { icon: "🔮", name: "镜法师" },
  req: "grad",

  html: `
  <p class="lead">恭喜通关毕业大考!这扇门只为好奇心打开——<b>反射(reflect)</b>:让程序在运行时「照镜子」,看清任何值的类型与内容。你天天在用的 <code class="ic">fmt.Println</code>,底层就是靠它把各种类型打印出来的。<b>选学,不强制</b>,看完能理解 Go 的魔法后台。</p>

  <h3 class="sec-title">照镜子:TypeOf 与 ValueOf</h3>
  <div class="gcode"><div class="gbar"><span>反射双镜</span></div><pre><code>import "reflect"

t := reflect.TypeOf(42)        // 镜子A:你是谁?(类型)
v := reflect.ValueOf("go")    // 镜子B:你值多少?(内容)

fmt.Println(t)                // int
fmt.Println(v)                // go</code></pre></div>
  <div class="note">
    <h4>hamster 反射是 fmt 的幕后功臣</h4>
    <p><code class="ic">fmt.Println(随便什么)</code> 为什么什么都能打?——它拿着反射镜照一遍:类型是什么、有几个字段、值是什么,照完照抄。你这一站学的,就是 fmt 的「后台机密」。</p>
  </div>

  <div class="exslot" data-ex="rf-1"></div>

  <h3 class="sec-title">Kind:类型的血统</h3>
  <div class="gcode"><div class="gbar"><span>Kind 与取值</span></div><pre><code>v := reflect.ValueOf(3.14)

fmt.Println(v.Kind())    // float64 ——它是什么「种类」
fmt.Println(v.Float())   // 3.14   ——按种类取值</code></pre></div>
  <p>Kind 告诉你值的基本血统(int/float64/string/struct…),确认血统后才能用对应的取值方法(<code class="ic">Int()</code>/<code class="ic">Float()</code>/<code class="ic">String()</code>)——拿错方法会 panic,像断言猜错一样。</p>

  <div class="exslot" data-ex="rf-2"></div>
  <div class="exslot" data-ex="rf-3"></div>

  <h3 class="sec-title">🎯 彩蛋大作业(1 个)</h3>
  <div class="exslot" data-ex="rf-b1"></div>

  <div class="warn">
    <h4>⚠️ 圣经的忠告(第 12.9 节原文意思)</h4>
    <p>反射强大但<b>可读性差、性能慢、绕过类型检查</b>——能不用就不用。Go 圈共识:90% 你以为需要反射的场景,其实接口就能办;剩下 10%,才轮到镜子出场。</p>
  </div>

  <div class="takeaway">
    <div class="tk-title">hamster 彩蛋心法</div>
    <ul>
      <li>TypeOf 照类型,ValueOf 照内容——fmt 的后台就是它</li>
      <li>Kind 查血统,确认后才能按类取值(Float/Int/String)</li>
      <li>忠告:能用接口就不用反射——镜子是最后的手段</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本站对应《Go 语言圣经》第 12 章 ——<a href="https://golang-china.github.io/gopl-zh/ch12/ch12.html" target="_blank" rel="noopener">去读原文</a></div>`,

  exercises: [
    {
      id: "rf-1", kind: "predict", xp: 10, title: "镜子初照",
      task: "两个值各照一次类型镜。打印什么?",
      given: "fmt.Println(reflect.TypeOf(42), reflect.TypeOf(\"go\"))",
      expected: "int string",
      ref: "fmt.Println(reflect.TypeOf(42), reflect.TypeOf(\"go\"))\n// int string",
      refNote: "TypeOf 报的是运行时的真身类型。Println 能把它们打出来,靠的也是反射——镜子照镜子。",
    },
    {
      id: "rf-2", kind: "predict", xp: 10, title: "血统与取值",
      task: "3.14 照镜:血统是什么?按血统取值是多少?",
      given: "v := reflect.ValueOf(3.14)\nfmt.Println(v.Kind(), v.Float())",
      expected: "float64 3.14",
      ref: "v := reflect.ValueOf(3.14)\nfmt.Println(v.Kind(), v.Float())\n// float64 3.14",
      refNote: "Kind 报血统(float64),Float() 按血统取值。血统是 int 就得用 Int(),拿错方法当场 panic。",
    },
    {
      id: "rf-3", kind: "blank", xp: 10, mini: true, title: "照类型的那面镜",
      task: "查类型用哪面镜?把函数名打出来(带 reflect. 前缀整段)。",
      given: "t := ____(42)\nfmt.Println(t)",
      placeholder: "…Of(…)",
      checks: [
        { label: "用的是 reflect.TypeOf", hint: "TypeOf 照类型,ValueOf 照内容。", test: (s) => /^\s*reflect\.TypeOf\s*$/.test(s) },
      ],
      ref: "reflect.TypeOf",
      refNote: "Of 前缀这对双镜:TypeOf 管「你是谁」,ValueOf 管「你值多少」。fmt 包内部正是靠这对镜子实现万能打印。",
    },
    {
      id: "rf-b1", kind: "big", xp: 30, title: "彩蛋大作业 · 万能侦探",
      task: `写 <code class="ic">describe(x interface{})</code>:用反射报出任意值的<b>类型和内容</b>,格式「类型:值」;main 里依次 describe(42)、describe("go")、describe(3.14)。imports 已备好(reflect、fmt)。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"reflect\"\n)\n\n// describe:反射照镜,报告类型和内容\n\nfunc main() {\n\tdescribe(42)\n\tdescribe(\"go\")\n\tdescribe(3.14)\n}",
      checks: [
        { label: "describe 收的是 interface{}", hint: "func describe(x interface{}) { … } ——万能入口。", test: (s) => /func\s+describe\s*\(\s*\w*\s*interface\s*\{?\s*\}?\s*\)/.test(s) },
        { label: "用了 TypeOf 和 ValueOf 双镜", hint: "t := reflect.TypeOf(x);v := reflect.ValueOf(x)", test: (s) => /reflect\.TypeOf\s*\(/.test(s) && /reflect\.ValueOf\s*\(/.test(s) },
        { label: "按格式打印类型和内容", hint: "fmt.Printf(\"%v:%v\\n\", t, v) ——t 是类型,v 是内容。", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) && (s.match(/%v/g) || []).length >= 2 },
        { label: "main 三次调用", hint: "42 / \"go\" / 3.14 各照一次。", test: (s) => /describe\s*\(\s*42/.test(s) && /describe\s*\(\s*\"go\"/.test(s) && /describe\s*\(\s*3\.14/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"reflect\"\n)\n\nfunc describe(x interface{}) {\n\tt := reflect.TypeOf(x)\n\tv := reflect.ValueOf(x)\n\tfmt.Printf(\"%v:%v\\n\", t, v)\n}\n\nfunc main() {\n\tdescribe(42)\n\tdescribe(\"go\")\n\tdescribe(3.14)\n}",
      refNote: "输出:int:42 / string:go / float64:3.14。一个函数,来者不拒——这就是 fmt 的感觉。镜法师徽章到手,记得圣经的忠告:能不用,就不用。",
    },
  ],
});

/* ══════════ 实战一 · 词频统计 CLI ══════════ */
A.registerTopic({
  key: "p1", order: 15, part: 7, partTitle: "实战大陆 · 出山试炼", icon: "🔧", title: "实战① 词频 CLI",
  eyebrow: "实战一 · 徽章:🔧 词频猎人",
  badge: { icon: "🔧", name: "词频猎人" },
  req: "grad",

  html: `
  <p class="lead">出山第一战:<b>词频统计器</b>——给定一段文字,数出每个词出现几次,还要排出前三名。这一战集结你在标准库站(os.Args)、字符串站(Fields)、map 站(零值计数)、接口站(sort.Slice)攒下的全部兵器。</p>

  <div class="note">
    <h4>📋 任务简报</h4>
    <ul>
      <li><b>目标:</b>吃进一句话(先用固定变量,进阶接 os.Args),吐出词频表</li>
      <li><b>关键兵器:</b><code class="ic">strings.Fields</code> 切词 → <code class="ic">map[string]int</code> + <code class="ic">m[w]++</code> 计数 → <code class="ic">sort.Slice</code> 排名</li>
      <li><b>难度:</b>★★★☆☆ · 两步任务卡,写完可去真跑</li>
    </ul>
  </div>

  <div class="gcode"><div class="gbar"><span>期望效果(第一步)</span></div><pre><code>text := "go is fun go is fast go go"

// 词频表打印出来像:
// map[fast:1 fun:1 go:4 is:2]</code></pre></div>

  <div class="exslot" data-ex="p1-1"></div>

  <div class="gcode"><div class="gbar"><span>期望效果(第二步)</span></div><pre><code>// 前三名,按次数从高到低:
// go 出现 4 次
// is 出现 2 次
// fast 出现 1 次  ←(并列时顺序不作要求)</code></pre></div>

  <div class="exslot" data-ex="p1-2"></div>

  <div class="takeaway">
    <div class="tk-title">hamster 战报要点</div>
    <ul>
      <li>Fields 对付任意空白(空格/制表/换行),比 Split(",") 更抗脏数据</li>
      <li>m[w]++ 的零值魔法:没有的词当 0,一行完成「查+建+加」</li>
      <li>排序三件套:把 map 倒进切片 → sort.Slice 配比较器 → 取前 N</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本战综合第 3.5 节(strings)、4.3 节(map)——<a href="https://golang-china.github.io/gopl-zh/ch3/ch3-05.html" target="_blank" rel="noopener">复习原文</a></div>`,

  exercises: [
    {
      id: "p1-1", kind: "big", xp: 30, title: "任务卡① 词频引擎",
      task: `第一步造引擎:①固定文本 <code class="ic">text := "go is fun go is fast go go"</code>;②用 <code class="ic">strings.Fields</code> 切词;<b>③用 map 零值技巧计数</b>;<b>④打印整个 map</b>(应为 <code>map[fast:1 fun:1 go:4 is:2]</code>)。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\ttext := \"go is fun go is fast go go\"\n\n\t// Fields 切词 → map 计数 → 打印 map\n\n}",
      checks: [
        { label: "用 strings.Fields 切了词", hint: "words := strings.Fields(text)", test: (s) => /strings\.Fields\s*\(/.test(s) },
        { label: "创建了 map[string]int", hint: "m := make(map[string]int)", test: (s) => /make\s*\(\s*map\s*\[\s*string\s*\]\s*int\s*\)/.test(s) },
        { label: "用零值技巧 m[w]++ 计数", hint: "for _, w := range words { m[w]++ } ——没有的键当 0 用。", test: (s) => /\[\s*\w+\s*\]\s*\+\+/.test(s) && /\brange\b/.test(s) },
        { label: "打印了整个 map", hint: "fmt.Println(m)", test: (s) => /fmt\.Print(ln|f)\s*\(\s*\w+m\b/.test(s) || /fmt\.Print(ln|f)\s*\(\s*m\s*\)/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\ttext := \"go is fun go is fast go go\"\n\n\tm := make(map[string]int)\n\tfor _, w := range strings.Fields(text) {\n\t\tm[w]++\n\t}\n\tfmt.Println(m)   // map[fast:1 fun:1 go:4 is:2]\n}",
      refNote: "四行核心,词频引擎落地。Fields 顺手处理了所有空白——真实的 CLI 传入再脏的文本,它都切得干干净净。",
    },
    {
      id: "p1-2", kind: "big", xp: 30, title: "任务卡② 前三排名",
      task: `在引擎基础上加排名:①把 map 倒进切片(装「词+次数」的 struct 或平行切片);<b>②sort.Slice 按次数从高到低</b>;<b>③打印前三名</b>,格式「go 出现 4 次」(并列不要求稳定)。imports 已备好(fmt、strings、sort)。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"strings\"\n)\n\nfunc main() {\n\ttext := \"go is fun go is fast go go\"\n\n\t// ① 词频引擎(上一张任务卡)\n\t// ② 倒进切片 + sort.Slice 降序\n\t// ③ 打印前三名\n\n}",
      checks: [
        { label: "造了「词+次数」的切片", hint: "type pair struct{ word string; n int } + pairs := []pair{…},或平行切片也认。", test: (s) => /type\s+\w+\s+struct/.test(s) || /\[\]string/.test(s) },
        { label: "把 map 倒进了切片", hint: "for w, n := range m { pairs = append(pairs, pair{w, n}) }", test: (s) => /\brange\s+\w*m\b/.test(s) && /append\s*\(/.test(s) },
        { label: "sort.Slice 按次数降序", hint: "sort.Slice(pairs, func(i, j int) bool { return pairs[i].n > pairs[j].n })", test: (s) => /sort\.Slice\s*\(/.test(s) && (/>/.test(s)) },
        { label: "打印了前三名", hint: "for i := 0; i < 3 && i < len(pairs); i++ { fmt.Printf(…) } ——循环里打印即可。", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) && (/for\s/i.test(s) || /\[:3\]/.test(s)) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 1 },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"strings\"\n)\n\ntype pair struct {\n\tword string\n\tn    int\n}\n\nfunc main() {\n\ttext := \"go is fun go is fast go go\"\n\n\tm := make(map[string]int)\n\tfor _, w := range strings.Fields(text) {\n\t\tm[w]++\n\t}\n\n\tpairs := make([]pair, 0, len(m))\n\tfor w, n := range m {\n\t\tpairs = append(pairs, pair{w, n})\n\t}\n\tsort.Slice(pairs, func(i, j int) bool {\n\t\treturn pairs[i].n > pairs[j].n\n\t})\n\n\tfor i := 0; i < 3 && i < len(pairs); i++ {\n\t\tfmt.Printf(\"%s 出现 %d 次\\n\", pairs[i].word, pairs[i].n)\n\t}\n}",
      refNote: "map 天生无序,要排名就先倒进切片——「map 管查询、slice 管排序」是 Go 数据处理的分工铁律。前三名:go×4、is×2、fast/fun 并列。想接命令行参数?把 text 换成 os.Args[1],加个空参守卫,CLI 就成了。",
    },
  ],
});

/* ══════════ 实战二 · JSON 学生库 ══════════ */
A.registerTopic({
  key: "p2", req: "p1", order: 16, part: 7, icon: "📦", title: "实战② JSON 学生库",
  eyebrow: "实战二 · 徽章:📦 数据管家",
  badge: { icon: "📦", name: "数据管家" },

  html: `
  <p class="lead">第二战:<b>学生成绩的序列化管家</b>——把班级数据打包成 JSON(像 API 返回),再把一段陌生 JSON 拆包读出来(像收服务端数据)。JSON 站的 Marshal/Unmarshal 双件套,在真实数据上跑一遍。</p>

  <div class="note">
    <h4>📋 任务简报</h4>
    <ul>
      <li><b>目标:</b>struct ↔ JSON 双向实战,字段标签必须到位</li>
      <li><b>关键兵器:</b>struct 标签 + Marshal + Unmarshal + 指针 &</li>
      <li><b>难度:</b>★★★☆☆ · 两张任务卡</li>
    </ul>
  </div>

  <div class="gcode"><div class="gbar"><span>期望效果(第一步)</span></div><pre><code>// Student{Name, Score} + 标签 json:"name"/json:"score"
// 两个学生的切片 Marshal 后:
// [{"name":"小地鼠","score":100},{"name":"阿仓","score":95}]</code></pre></div>

  <div class="exslot" data-ex="p2-1"></div>

  <div class="gcode"><div class="gbar"><span>期望效果(第二步)</span></div><pre><code>data := []byte(\`{"name":"大白","score":88}\`)
// Unmarshal 后打印:
// 大白 88 分</code></pre></div>

  <div class="exslot" data-ex="p2-2"></div>

  <div class="takeaway">
    <div class="tk-title">hamster 战报要点</div>
    <ul>
      <li>API 出向用 Marshal,入向用 Unmarshal——一对镜像</li>
      <li>标签决定 JSON 侧的字段名,Go 侧保持导出大写</li>
      <li>Unmarshal 三件套:目标变量、指针、err 检查</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本战对应第 4.5 节(JSON)——<a href="https://golang-china.github.io/gopl-zh/ch4/ch4-05.html" target="_blank" rel="noopener">复习原文</a></div>`,

  exercises: [
    {
      id: "p2-1", kind: "big", xp: 30, title: "任务卡① 打包班级",
      task: `①定义 <code class="ic">Student</code>(Name string、Score int,标签 json:"name"/json:"score");②切片装 2 人(小地鼠 100 分、阿仓 95 分);<b>③Marshal 后转 string 打印</b>(应为 <code>[{"name":"小地鼠","score":100},{"name":"阿仓","score":95}]</code>)。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\n// Student struct + 标签\n\nfunc main() {\n\t// 切片装 2 人 → Marshal → string 打印\n\n}",
      checks: [
        { label: "Student 有字段和标签", hint: "Name string \\`json:\"name\"\\` / Score int \\`json:\"score\"\\`", test: (s) => /Name\s+string\s+`json:"name"`/.test(s) && /Score\s+int\s+`json:"score"`/.test(s) },
        { label: "切片装了 2 个学生", hint: "students := []Student{{Name: \"小地鼠\", Score: 100}, {…}}", test: (s) => /\[\]\s*Student\s*\{/.test(s) },
        { label: "Marshal 后转 string 打印", hint: "b, _ := json.Marshal(students);fmt.Println(string(b))", test: (s) => /json\.Marshal\s*\(/.test(s) && /string\s*\(\s*\w+\s*\)/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Student struct {\n\tName  string `json:\"name\"`\n\tScore int    `json:\"score\"`\n}\n\nfunc main() {\n\tstudents := []Student{\n\t\t{Name: \"小地鼠\", Score: 100},\n\t\t{Name: \"阿仓\", Score: 95},\n\t}\n\n\tb, _ := json.Marshal(students)\n\tfmt.Println(string(b))\n}",
      refNote: "切片直接 Marshal 出 JSON 数组——struct 单个是对象,切片自动包一层数组。这就是最迷你的「API 返回值」。",
    },
    {
      id: "p2-2", kind: "big", xp: 30, title: "任务卡② 拆包陌生数据",
      task: `给定 <code class="ic">data := []byte(\\\`{"name":"大白","score":88}\\\`)</code>(scaffold 已带):①定义带标签的 Student(可以和上一张同一个);②<b>Unmarshal 进变量</b>(指针+err 检查);③打印「大白 88 分」(用 Printf %s %d)。imports 已备好。`,
      scaffold: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Student struct {\n\tName  string `json:\"name\"`\n\tScore int    `json:\"score\"`\n}\n\nfunc main() {\n\tdata := []byte(`{\"name\":\"大白\",\"score\":88}`)\n\n\t// Unmarshal → 打印「大白 88 分」\n\n}",
      checks: [
        { label: "Unmarshal 带指针", hint: "var s Student;err := json.Unmarshal(data, &s)", test: (s) => /json\.Unmarshal\s*\([^)]*&/.test(s) },
        { label: "接了 err 并检查", hint: "if err != nil { … }", test: (s) => /err\s*!=\s*nil/.test(s) },
        { label: "用 %s %d 打印两个字段", hint: "fmt.Printf(\"%s %d 分\\n\", s.Name, s.Score)", test: (s) => /%s/.test(s) && /%d/.test(s) && /fmt\.Printf\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Student struct {\n\tName  string `json:\"name\"`\n\tScore int    `json:\"score\"`\n}\n\nfunc main() {\n\tdata := []byte(`{\"name\":\"大白\",\"score\":88}`)\n\n\tvar s Student\n\tif err := json.Unmarshal(data, &s); err != nil {\n\t\tfmt.Println(\"解析失败:\", err)\n\t\treturn\n\t}\n\tfmt.Printf(\"%s %d 分\\n\", s.Name, s.Score)   // 大白 88 分\n}",
      refNote: "陌生 JSON 拆包成功——服务端发什么,只要你有一个对得上号的 struct,几行代码就变成 Go 数据。数据管家,当之无愧。",
    },
  ],
});

/* ══════════ 实战三 · 并发流水线 ══════════ */
A.registerTopic({
  key: "p3", req: "p2", order: 17, part: 7, icon: "⚡", title: "实战③ 并发流水线",
  eyebrow: "实战三 · 徽章:⚡ 流水线监工",
  badge: { icon: "⚡", name: "流水线监工" },

  html: `
  <p class="lead">收官之战:<b>三站流水线</b>——生成器发数、工人翻倍、主程序收货,两根 goroutine、两根 channel,数据像传送带一样流过整条线。这是圣经第 8.4.5 节的经典模式,也是一切生产者-消费者系统的骨架。</p>

  <div class="note">
    <h4>📋 任务简报</h4>
    <ul>
      <li><b>目标:</b>gen → square → 主程序,三个角色用 channel 串成线</li>
      <li><b>关键兵器:</b>goroutine + channel + close + range;<b>进阶</b>加 select 超时</li>
      <li><b>难度:</b>★★★★☆ · 本实战大陆压轴</li>
    </ul>
  </div>

  <div class="gcode"><div class="gbar"><span>期望效果(第一步)</span></div><pre><code>// 生成 1、2、3 → 各自翻倍 → 主程序收:
// 2
// 4
// 6</code></pre></div>

  <div class="exslot" data-ex="p3-1"></div>

  <div class="gcode"><div class="gbar"><span>期望效果(第二步)</span></div><pre><code>// 老板等结果,但最多等 50 毫秒:
// 超时,不等了   ←(因为工人在磨蹭 200 毫秒)</code></pre></div>

  <div class="exslot" data-ex="p3-2"></div>

  <div class="takeaway">
    <div class="tk-title">hamster 战报要点</div>
    <ul>
      <li>流水线三步:上游 close、中游 range 收再发、下游 range 收</li>
      <li>close 只能由<b>发送方</b>喊——「我这头不再进货了」</li>
      <li>select + time.After = 给等待装上闹钟,永不干等</li>
    </ul>
  </div>

  <div class="gopl-nav">📖 <b>圣经导航</b>:本战对应第 8.4~8.5 节(Channels / 并发的循环)——<a href="https://golang-china.github.io/gopl-zh/ch8/ch8-04.html" target="_blank" rel="noopener">去读原文</a></div>`,

  exercises: [
    {
      id: "p3-1", kind: "big", xp: 30, title: "任务卡① 三站传送带",
      task: `搭流水线:①goroutine A(生成器)把 1、2、3 发进 <code class="ic">gen</code>,发完 close;②goroutine B(工人)用 range 从 gen 收,每个数<b>翻倍后</b>发进 <code class="ic">sq</code>,收完 close;③主程序 range 从 sq 收,逐个打印(应得 <b>2、4、6</b>)。imports 已备好。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tgen := make(chan int)\n\tsq := make(chan int)\n\n\t// ① 生成器:发 1、2、3 进 gen,发完 close\n\t// ② 工人:range gen → 翻倍 → 发 sq,收完 close\n\t// ③ 主程序:range sq 打印\n\n}",
      checks: [
        { label: "两根 goroutine 都发车了", hint: "go func() { … }() ×2。", test: (s) => (s.match(/\bgo\s+func/g) || []).length >= 2 },
        { label: "生成器发完 close(gen)", hint: "发完 1、2、3 后 close(gen) ——发送方才有权关店。", test: (s) => /close\s*\(\s*gen\s*\)/.test(s) },
        { label: "工人 range gen 收货再发 sq", hint: "for v := range gen { sq <- v * 2 }", test: (s) => /range\s+gen/.test(s) && /sq\s*<-\s*\w+\s*\*\s*2|sq\s*<-\s*2\s*\*\s*\w+/.test(s) },
        { label: "工人收完 close(sq)", hint: "range 循环自然退出后 close(sq)。", test: (s) => /close\s*\(\s*sq\s*\)/.test(s) },
        { label: "主程序 range sq 打印", hint: "for v := range sq { fmt.Println(v) } → 2、4、6。", test: (s) => /range\s+sq/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tgen := make(chan int)\n\tsq := make(chan int)\n\n\tgo func() {\n\t\tfor i := 1; i <= 3; i++ {\n\t\t\tgen <- i\n\t\t}\n\t\tclose(gen)\n\t}()\n\n\tgo func() {\n\t\tfor v := range gen {\n\t\t\tsq <- v * 2\n\t\t}\n\t\tclose(sq)\n\t}()\n\n\tfor v := range sq {\n\t\tfmt.Println(v)   // 2、4、6\n\t}\n}",
      refNote: "close 由发送方喊,range 由接收方自然收尾——两根 goroutine 谁也不用知道对方发几个:关店散场,行云流水。圣经 8.4.5 的管道模式,你亲手搭出来了。",
    },
    {
      id: "p3-2", kind: "big", xp: 30, title: "任务卡② 给等待装闹钟",
      task: `升级:工人在 <code class="ic">sq</code> 那头<b>磨蹭 200 毫秒</b>才发货(scaffold 已带 time.Sleep);主程序用 <b>select</b> 等货——<b>最多等 50 毫秒</b>:等到就打印货物,等不到打印「超时,不等了」。imports 已备好(fmt、time)。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tsq := make(chan int)\n\tgo func() {\n\t\ttime.Sleep(200 * time.Millisecond)   // 工人在磨蹭\n\t\tsq <- 99\n\t}()\n\n\t// select:要么 50 毫秒内收到,要么超时走人\n\n}",
      checks: [
        { label: "用了 select 两路等待", hint: "select {\ncase v := <-sq: …\ncase <-time.After(50 * time.Millisecond): …\n}", test: (s) => /select\s*\{/.test(s) && (s.match(/case\s/g) || []).length >= 2 },
        { label: "闹钟是 time.After(50 毫秒)", hint: "case <-time.After(50 * time.Millisecond):", test: (s) => /time\.After\s*\(\s*50\s*\*\s*time\.Millisecond/.test(s) },
        { label: "超时分支打印了「超时,不等了」", hint: "超时那支:fmt.Println(\"超时,不等了\")", test: (s) => /超时/.test(s) },
        { label: "正常分支打印收到的货", hint: "case v := <-sq: fmt.Println(\"收到:\", v)", test: (s) => /case\s+\w+\s*:=\s*<-\s*sq/.test(s) && /fmt\.Print(ln|f)\s*\([^)]*\w+/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tsq := make(chan int)\n\tgo func() {\n\t\ttime.Sleep(200 * time.Millisecond)\n\t\tsq <- 99\n\t}()\n\n\tselect {\n\tcase v := <-sq:\n\t\tfmt.Println(\"收到:\", v)\n\tcase <-time.After(50 * time.Millisecond):\n\t\tfmt.Println(\"超时,不等了\")\n\t}\n}",
      refNote: "工人 200 毫秒后才到,闹钟 50 毫秒先响——走超时分支,程序不再干等。真实系统里,这就是「调用外部 API 必须带超时」的雏形:等不起,就体面撤退。实战大陆三连胜!⚡",
    },
  ],
});

/* ══════════ 出师 ══════════ */
A.registerTopic({
  key: "outbound", order: 18, part: 8, partTitle: "出师", icon: "🎓", title: "出师之门",
  eyebrow: "最后一站 · 徽章:🎓 出师地鼠",
  badge: { icon: "🎓", name: "出师地鼠" },
  req: "p3",

  html: `
  <p class="lead">实战大陆三连胜,出师的时刻到了。最后一道题不留标准答案——只留一句承诺:写下你出山后的<b>第一个真实 Go 项目</b>。</p>

  <div class="ob-card" id="obCard">
    <div class="ob-icon">🎓</div>
    <div class="ob-title">出 师 令</div>
    <div class="ob-body">
      <span class="ob-name" id="obName">无名地鼠</span>,自 Hello World 入营,已完成三项出山实战,<br>
      亲手敲穿 <b id="obSolved">0</b> 道练习、斩获 <b id="obBadges">…</b>、积 <b id="obXp">0</b> 经验——<br>
      今出此关。后山代码,皆由你写。🐹
    </div>
  </div>

  <h3 class="sec-title">📜 全书 ↔ 圣经 对照表</h3>
  <p>训练场是练兵场,圣经是藏书阁——把这张表收好,每读一章原文,功力再进一层:</p>
  <table class="tbl">
    <tr><th>训练场站点</th><th>圣经章节</th></tr>
    <tr><td>入营 / 变量与打印</td><td><a href="https://golang-china.github.io/gopl-zh/ch1/ch1-01.html" target="_blank" rel="noopener">第 1 章 入门</a></td></tr>
    <tr><td>数据类型深潜</td><td><a href="https://golang-china.github.io/gopl-zh/ch3/ch3-01.html" target="_blank" rel="noopener">第 3 章 基础数据类型</a></td></tr>
    <tr><td>流程控制</td><td><a href="https://golang-china.github.io/gopl-zh/ch1/ch1.html" target="_blank" rel="noopener">第 1 章各节 + 第 2 章 程序结构</a></td></tr>
    <tr><td>函数与复合数据</td><td><a href="https://golang-china.github.io/gopl-zh/ch5/ch5-01.html" target="_blank" rel="noopener">第 5 章 函数</a> · <a href="https://golang-china.github.io/gopl-zh/ch4/ch4.html" target="_blank" rel="noopener">第 4 章 复合数据类型</a></td></tr>
    <tr><td>字符串与输入 / 切片深潜与指针</td><td><a href="https://golang-china.github.io/gopl-zh/ch3/ch3-05.html" target="_blank" rel="noopener">第 3.5 节 字符串</a> · <a href="https://golang-china.github.io/gopl-zh/ch4/ch4-02.html" target="_blank" rel="noopener">第 4.2 节 Slice</a></td></tr>
    <tr><td>闭包</td><td><a href="https://golang-china.github.io/gopl-zh/ch5/ch5-06.html" target="_blank" rel="noopener">第 5.6 节 匿名函数与闭包</a></td></tr>
    <tr><td>错误处理与接口 / 接口进阶</td><td><a href="https://golang-china.github.io/gopl-zh/ch7/ch7.html" target="_blank" rel="noopener">第 7 章 接口</a>(7.10~7.13 进阶)</td></tr>
    <tr><td>JSON 数据打包</td><td><a href="https://golang-china.github.io/gopl-zh/ch4/ch4-05.html" target="_blank" rel="noopener">第 4.5 节 JSON</a></td></tr>
    <tr><td>标准库与文件 / 包与项目</td><td><a href="https://golang-china.github.io/gopl-zh/ch10/ch10.html" target="_blank" rel="noopener">第 10 章 包和工具</a></td></tr>
    <tr><td>测试之道</td><td><a href="https://golang-china.github.io/gopl-zh/ch11/ch11.html" target="_blank" rel="noopener">第 11 章 测试</a></td></tr>
    <tr><td>泛型</td><td><a href="https://golang-china.github.io/gopl-zh/ch1/ch1.html" target="_blank" rel="noopener">官方泛型教程 go.dev/doc/tutorial/generics</a></td></tr>
    <tr><td>并发初探 / 并发进阶 / 竞态风暴</td><td><a href="https://golang-china.github.io/gopl-zh/ch8/ch8.html" target="_blank" rel="noopener">第 8 章 Goroutines和Channels</a> · <a href="https://golang-china.github.io/gopl-zh/ch9/ch9.html" target="_blank" rel="noopener">第 9 章 基于共享变量的并发</a></td></tr>
    <tr><td>反射镜宫(彩蛋)</td><td><a href="https://golang-china.github.io/gopl-zh/ch12/ch12.html" target="_blank" rel="noopener">第 12 章 反射</a></td></tr>
  </table>

  <h3 class="sec-title">🗺 出山路线图</h3>
  <ul class="points">
    <li><b>官方 Tour of Go</b>(go.dev/tour,可切中文):现在你的底子,半天刷完</li>
    <li><b>Go by Example</b>(gobyexample.com):哪句不会查哪句</li>
    <li><b>第一项目建议</b>:把毕业大作业改造成命令行工具(os.Args + 文件存档 + JSON)——小而完整,能跑能用</li>
    <li><b>读圣经全文</b>:从第 2 章重读到第 9 章,你会发现「原来如此」密度高得惊人</li>
  </ul>

  <div class="exslot" data-ex="ob-1"></div>`,

  exercises: [
    {
      id: "ob-1", kind: "write", xp: 30, title: "出师题 · 你的第一个 Go 项目",
      task: `没有标准答案的一题:写下你出山后想做的<b>第一个真实 Go 项目</b>——做什么、给谁用、大概什么样。写满 20 个字以上,批改器就放行。三个月后回来看,它就是你的简历第一行。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"我出山后的第一个 Go 项目:\")\n\tfmt.Println(\"…\")\n}",
      placeholder: "写下你的宣言…",
      checks: [
        { label: "宣言写满了 20 个字", hint: "多写点细节:做什么工具、解决什么麻烦——未来的你会感谢现在写得具体的你。", test: (s) => {
          const text = Array.from(s.matchAll(/fmt\.Print(?:ln)?\s*\(\s*"((?:\\.|[^"\\])*)"/g), match => match[1])
            .filter(line => line !== "我出山后的第一个 Go 项目:").join("");
          return Array.from(text.replace(/[^\p{L}\p{N}]/gu, "")).length >= 20;
        } },
        { label: "写了可运行的 Go 骨架", hint: "scaffold 已经是好骨架,补上你的内容即可。", test: (s) => /package\s+main/.test(s) && /fmt\.Print/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"我出山后的第一个 Go 项目:\")\n\tfmt.Println(\"给博客写一个静态站点生成器:markdown 进、HTML 出,\")\n\tfmt.Println(\"并发渲染,front-matter 当配置——就像这门课教我的样子。\")\n}",
      refNote: "这只是个示例宣言——你的那份才是真的。写完这道题,训练场的全部大门就都开过了。地鼠出山,代码为凭。🐹🎓",
    },
  ],
});

})();
