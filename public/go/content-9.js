/* ═══════════════════════════ Go 训练场 · 专题十一(包与项目) + 专题十三(并发进阶) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

/* ══════════ 专题十一 · 包与项目 ══════════ */
A.registerTopic({
  key: "packages", order: 11, part: 4, icon: "🗂", title: "包与项目",
  eyebrow: "专题十一 · 通关徽章:🗂 模块工匠",
  badge: { icon: "🗂", name: "模块工匠" },

  html: `
  <p class="lead">一路走来你都在单文件里练功。真实项目是<b>多文件、有名字、有版本</b>的有机体——Go 用两个朴素概念撑起这一切:<b>包(package)</b>和<b>模块(module)</b>。这一关走完,你就知道别人的 Go 项目为什么长那样,自己的代码也知道怎么「成家立业」。</p>

  <h3 class="sec-title">从单文件到项目:go mod init</h3>
  <div class="gcode"><div class="gbar"><span>🏠 本地运行版</span></div><pre><code>// 进入项目文件夹后,第一句:
go mod init hello        // 给项目起名,生成 go.mod 文件

// go.mod 长这样:
// module hello
// go 1.22

// 之后一切如常:go run . / go test ./... / go build</code></pre></div>
  <p><b>module</b> = 项目的名字(通常用仓库地址,如 github.com/你/项目名),<b>go.mod</b> 就是项目的户口本:记录名字、Go 版本、依赖了哪些第三方包。有了它,这个文件夹才是一个正经「项目」。</p>

  <h3 class="sec-title">同一文件夹 = 同一个包</h3>
  <div class="gcode"><div class="gbar"><span>多文件协作,不用 import 自己人</span></div><pre><code>// 文件一:util.go
package main            // ← 同文件夹同包,这里写 main

func sayHi() {
	fmt.Println("hi")
}

// 文件二:main.go(同一文件夹)
package main

func main() {
	sayHi()   // 直接调!同一个包里,跨文件共享
}</code></pre></div>
  <p>注意每个文件<b>各写各的 import</b>(util.go 也要自己 import "fmt")——包是共享的,工具箱是各人自备的。跨<b>文件夹</b>才是跨包,才需要 import 路径。</p>

  <div class="exslot" data-ex="pk-1"></div>
  <div class="exslot" data-ex="pk-2"></div>
  <div class="exslot" data-ex="pk-3"></div>

  <h3 class="sec-title">大写导出:名字首字母就是通行证</h3>
  <div class="note">
    <h4>🐹 一条铁律记牢</h4>
    <p><b>首字母大写 = 对外公开(导出)</b>——别的包可以调,比如 <code class="ic">fmt.Println</code>、<code class="ic">os.ReadFile</code>,个个大写;<b>首字母小写 = 包内私有</b>——只有同包的人能碰。Go 没有 public/private 关键字,靠命名大小写一刀切,简单到离谱,却极少有人抱怨。</p>
  </div>

  <div class="exslot" data-ex="pk-4"></div>

  <h3 class="sec-title">go 命令家族速查</h3>
  <table class="tbl">
    <tr><th>命令</th><th>干啥</th></tr>
    <tr><td><code class="ic">go run .</code></td><td>编译并立刻运行整个项目(开发日常)</td></tr>
    <tr><td><code class="ic">go build</code></td><td>编译出可执行文件(交货给没装 Go 的机器)</td></tr>
    <tr><td><code class="ic">go test ./...</code></td><td>跑项目里全部测试(上一关的家当)</td></tr>
    <tr><td><code class="ic">go fmt</code></td><td>一键统一格式——Go 世界没有缩进圣战</td></tr>
  </table>

  <h3 class="sec-title">🎯 专题十一 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="pk-b1"></div>
  <div class="exslot" data-ex="pk-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题十一心法</div>
    <ul>
      <li>项目起名:go mod init → 生成 go.mod 户口本</li>
      <li>同文件夹 = 同包,跨文件直接调;import 是各文件自备</li>
      <li>大写导出、小写私有——名字首字母就是访问控制</li>
      <li>日常四连:go run . / go build / go test ./... / go fmt</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "pk-1", kind: "fix", xp: 10, title: "大小写不是小事",
      task: `想打印一句话,大小写手滑了。编译器拒绝的理由藏在报错里——读一遍,修正那行。`,
      given: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.println(\"hi\")\n}",
      errText: "undefined: fmt.println",
      checks: [
        { label: "改成了 fmt.Println", hint: "Println 首字母大写——它是 fmt 包导出的函数。", test: (s) => /fmt\.Println\s*\(/.test(s) },
        { label: "小写的 println 已清除", hint: "fmt.println 这个写法整行删掉。", test: (s) => !/fmt\.println/.test(s) },
      ],
      replaceLine: "fmt.println(\"hi\")",
      ref: "fmt.Println(\"hi\")",
      refNote: "undefined: fmt.println = 「fmt 包里没有这号人物」。Go 的导出规则不是建议,是硬性安检:跨包调函数,名字必须大写开头。你调 Println 十几关了,现在知道它为啥非大写不可。",
    },
    {
      id: "pk-2", kind: "blank", localOnly: true, xp: 10, mini: true, title: "项目落户口",
      task: `新项目文件夹里,给项目起名 hello 的第一句命令是什么?<span class="hl">把命令打出来</span>。`,
      given: "// 我刚建了个空文件夹 myapp,进去后第一句:\n// ____",
      placeholder: "go …",
      checks: [
        { label: "命令是 go mod init hello", hint: "go mod init 后面跟项目名:go mod init hello", test: (s) => /go\s+mod\s+init\s+hello/i.test(s) },
      ],
      ref: "go mod init hello",
      refNote: "执行完文件夹里躺着一个 go.mod——从这一刻起,它是「项目」而不是「一堆散文件」。真实项目名常用仓库地址:go mod init github.com/你/hello。",
    },
    {
      id: "pk-3", kind: "predict", localOnly: true, xp: 10, title: "两个文件一个包",
      task: `下面两段代码分别存在<b>同一文件夹</b>的 util.go 和 main.go 里。本地运行 go run main.go util.go，打印什么？`,
      given: "// ===== 文件一:util.go =====\npackage main\n\nimport \"fmt\"\n\nfunc sayHi() {\n\tfmt.Println(\"hi\")\n}\n\n// ===== 文件二:main.go(同文件夹)=====\npackage main\n\nfunc main() {\n\tsayHi()   // 没写 import!能编译吗?\n}",
      expected: "hi",
      ref: "// go run main.go util.go → 打印:hi\n// 同文件夹 = 同一个 package main,\n// sayHi 直接可用,不需要 import 自己人。",
      refNote: "能编译,打印 hi!包是文件夹级别的:同一个 package main 里,同一个包的包级声明可以跨文件使用，不必导入自己的包。注意 util.go 自己 import 了 fmt——工具箱各文件自备。",
    },
    {
      id: "pk-4", kind: "write", xp: 10, title: "动手写:给别的包备好工具",
      task: `导出命名演练:写三个函数 <code class="ic">Add</code>、<code class="ic">Sub</code>(都返回 int)和 <code class="ic">IsEven</code>(返回 bool,判断偶数)——<b>首字母全部大写</b>,将来给别的包用;main 里依次调用并打印(应得 5、-1、true)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// 三个导出函数:大写开头\n\nfunc main() {\n\t// 依次调用并打印\n\n}",
      checks: [
        { label: "三个函数全部大写开头", hint: "func Add(a, b int) int / func Sub(…) / func IsEven(…) ——大写是导出的通行证。", test: (s) => /func\s+Add\s*\(/.test(s) && /func\s+Sub\s*\(/.test(s) && /func\s+IsEven\s*\(/.test(s) },
        { label: "IsEven 用取余判断偶数", hint: "return n%2 == 0", test: (s) => /%\s*2\s*==\s*0/.test(s) },
        { label: "main 里全部调用并打印", hint: "fmt.Println(Add(2, 3), Sub(2, 3), IsEven(4)) ——或分三次打印。", test: (s) => /Add\s*\(/.test(s) && /Sub\s*\(/.test(s) && /IsEven\s*\(/.test(s) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 1 },
        { label: "main 里没有出现大写之外的手滑", hint: "别写成 add/sub/IsEven 的小写版——那是私有函数,别的包够不着。", test: (s) => !/func\s+(add|sub|iseven)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc Add(a, b int) int {\n\treturn a + b\n}\n\nfunc Sub(a, b int) int {\n\treturn a - b\n}\n\nfunc IsEven(n int) bool {\n\treturn n%2 == 0\n}\n\nfunc main() {\n\tfmt.Println(Add(2, 3))     // 5\n\tfmt.Println(Sub(2, 3))     // -1\n\tfmt.Println(IsEven(4))    // true\n}",
      refNote: "大写 = 摆上货架,小写 = 藏进后厨。你现在已经能读懂 Go 生态里所有「为啥 API 都是大写开头」的设计了——模块工匠的命名直觉,就是这么练出来的。",
    },

    /* ── 大作业 ── */
    {
      id: "pk-b1", kind: "big", localOnly: true, xp: 30, title: "大作业① util 双文件演练",
      task: `模拟真实项目拆分:写导出函数 <code class="ic">Add</code>(加)和 <code class="ic">Mul</code>(乘),main 里调用并打印(Add(2,3)=5、Mul(2,3)=6)。代码先在页内单文件完成——写完想象「把函数部分剪切到 util.go,同文件夹 package main,go run 照常」(参考答案里画给你看)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// 将来住进 util.go 的部分:Add、Mul(导出)\n\nfunc main() {\n\t// 调用并打印\n\n}",
      checks: [
        { label: "定义了导出函数 Add 和 Mul", hint: "func Add(a, b int) int / func Mul(a, b int) int ——都大写开头。", test: (s) => /func\s+Add\s*\([^)]*int/.test(s) && /func\s+Mul\s*\([^)]*int/.test(s) },
        { label: "Add 和 Mul 是真函数(带 return)", hint: "return a + b / return a * b", test: (s) => (s.match(/\breturn\b/g) || []).length >= 2 },
        { label: "main 调用了两个函数并打印", hint: "fmt.Println(Add(2, 3), Mul(2, 3))", test: (s) => /Add\s*\(/.test(s) && /Mul\s*\(/.test(s) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 1 },
      ],
      ref: "// ===== 真实项目里的样子:两个文件,同文件夹 =====\n\n// 文件一:util.go\npackage main\n\nfunc Add(a, b int) int {\n\treturn a + b\n}\n\nfunc Mul(a, b int) int {\n\treturn a * b\n}\n\n// 文件二:main.go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(Add(2, 3))   // 5\n\tfmt.Println(Mul(2, 3))   // 6\n}\n\n// 本地:go run .  ← 注意:多个文件用 go run . 一次跑全包",
      refNote: "页内你写的是单文件版;真实项目把 util 部分剪到 util.go 即可,一行逻辑都不用改——「同文件夹同包」的规矩让拆分变成纯粹的剪切粘贴。顺带记住:多文件项目跑 go run .(不是 go run main.go)。",
    },
    {
      id: "pk-b2", kind: "big", localOnly: true, xp: 30, title: "大作业② 命令行加法器(本地运行版 🏠)",
      task: `把「包」和前面所有功夫串起来的完整 CLI:本地运行 <code class="ic">go run . 3 5</code> 应打印 <b>8</b>。①先检查 <code class="ic">len(os.Args)</code>,参数不足 3 个就打印用法提示并退出;②用 <code class="ic">strconv.Atoi</code> 把两个参数转成数字(各自查 err);③打印两数之和。🏠 本地运行:Playground 不支持命令行参数。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n)\n\nfunc main() {\n\t// ① 参数数检查 → ② Atoi ×2(查 err)→ ③ 打印和\n\n}",
      checks: [
        { label: "检查了 len(os.Args)", hint: "if len(os.Args) < 3 { 打印用法;return } ——Args[0] 是程序名,3 个元素才够两个参数。", test: (s) => /len\s*\(\s*os\.Args\s*\)/.test(s) },
        { label: "两次 strconv.Atoi 转换参数", hint: "a, err := strconv.Atoi(os.Args[1]);b, err2 := strconv.Atoi(os.Args[2])", test: (s) => (s.match(/strconv\.Atoi\s*\(/g) || []).length >= 2 },
        { label: "转换的 err 都检查了", hint: "if err != nil { … } ——用户敲的参数,永远可能是「abc」。", test: (s) => (s.match(/err\w*\s*!=\s*nil/g) || []).length >= 2 },
        { label: "打印了和", hint: "fmt.Println(a + b)", test: (s) => /fmt\.Print(ln|f)\s*\(\s*\w+\s*\+\s*\w+|a\s*\+\s*b/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tif len(os.Args) < 3 {\n\t\tfmt.Println(\"用法:go run . 数字1 数字2\")\n\t\treturn\n\t}\n\n\ta, err := strconv.Atoi(os.Args[1])\n\tif err != nil {\n\t\tfmt.Println(\"第一个参数不是数字:\", err)\n\t\treturn\n\t}\n\tb, err2 := strconv.Atoi(os.Args[2])\n\tif err2 != nil {\n\t\tfmt.Println(\"第二个参数不是数字:\", err2)\n\t\treturn\n\t}\n\tfmt.Println(a + b)\n}",
      refNote: "参数安检 + 双份 Atoi + 错误处理 + 求和输出——一个五脏俱全的命令行工具。本地试试 go run . 3 5、go run . a b,两条路都走走看。这就是你将来所有 CLI 项目的骨架。",
    },
  ],
});

/* ══════════ 专题十三 · 并发进阶 ══════════ */
A.registerTopic({
  key: "conc2", order: 13, part: 5, icon: "🚰", title: "并发进阶",
  eyebrow: "专题十三 · 通关徽章:🚰 管道宗师",
  badge: { icon: "🚰", name: "管道宗师" },

  html: `
  <p class="lead">并发初探学会了发车和传话。这一关把 channel 的<b>全套交通规则</b>补完:带格子的邮筒(buffered)、关门散场(close + range)、多路监听(select),外加共享状态的保险柜(Mutex)。学完你能写出 Go 引以为傲的<b>流水线</b>。</p>

  <h3 class="sec-title">buffered channel:邮筒带格子</h3>
  <div class="gcode"><div class="gbar"><span>第二个参数 = 格子数</span></div><pre><code>ch := make(chan int, 3)   // 造一个带 3 个格子的邮筒

ch <- 1     // 放进格子,不用等人来收!
ch <- 2     // 再放一格
fmt.Println(len(ch))   // 2 ——筒里现在压着 2 个

// 格子没满:发送方不等待;满了才站住等人取</code></pre></div>
  <div class="note">
    <h4>🐹 什么时候用带格子的?</h4>
    <p>无缓冲像<b>当面交接</b>(必须两人同时到场),带缓冲像<b>邮筒投递</b>(有空位时可以先放进去，满了就得等接收方腾出位置)。生产快、消费慢、或想批量攒一攒,用格子;需要精确同步,用无缓冲。</p>
  </div>

  <div class="exslot" data-ex="cc-1"></div>
  <div class="exslot" data-ex="cc-2"></div>

  <h3 class="sec-title">close + range:干完活,关店散场</h3>
  <div class="gcode"><div class="gbar"><span>生产者消费者标准姿势</span></div><pre><code>ch := make(chan int)

go func() {              // 生产者:发货
	for i := 1; i <= 3; i++ {
		ch <- i
	}
	close(ch)          // ★ 干完活关门:告诉消费者"没有更多了"
}()

for v := range ch {      // 消费者:一直收,直到门关上自动散场
	fmt.Println(v)
}</code></pre></div>
  <p>两句口诀:<b>发送方 close</b>(通常由发送方在确认不会再发送后关闭。往已关闭的通道发送会 panic，接收方仍可以读完缓冲里的数据);<b>range 等关门</b>——关门后，循环会先读完缓冲里剩下的数据，再自动结束,不需要提前知道有几个货。这是 Go 流水线的标准接头暗号。</p>

  <div class="exslot" data-ex="cc-3"></div>
  <div class="exslot" data-ex="cc-4"></div>

  <h3 class="sec-title">单向通道:把权限写进签名</h3>
  <div class="gcode"><div class="gbar"><span>chan&lt;- 只发 / &lt;-chan 只收</span></div><pre><code>// 生产者:参数声明成"只发"——函数里想收都收不了,编译器把权限焊死
func producer(ch chan&lt;- int) {
	ch <- 42
}

// 消费者:参数声明成"只收"
func consumer(ch &lt;-chan int) {
	fmt.Println(&lt;-ch)
}</code></pre></div>
  <p>箭头永远指着数据的流向:写在 chan <b>左边</b>是「只收」,写在<b>右边</b>是「只发」。权限写进函数签名,误用当场编译报错——Go 的安全感就是这么来的。</p>

  <h3 class="sec-title">select:站在两条路中间</h3>
  <div class="gcode"><div class="gbar"><span>谁先来,走谁</span></div><pre><code>select {
case msg := &lt;-ch:                        // 路 1:货到了
	fmt.Println("收到:", msg)
case &lt;-time.After(500 * time.Millisecond):   // 路 2:等超 0.5 秒
	fmt.Println("超时!")
}</code></pre></div>
  <p>select 像<b>十字路口的交警</b>:同时盯着几条 channel,哪条先有动静走哪条;都闲着就等。最经典的用法就是上面这个「业务 + 超时」双保险——网络请求、任务分发里天天见。</p>

  <div class="exslot" data-ex="cc-5"></div>

  <h3 class="sec-title">sync.Mutex:共享状态的保险柜</h3>
  <div class="gcode"><div class="gbar"><span>多只地鼠同时改一个数</span></div><pre><code>var mu sync.Mutex
counter := 0

for i := 0; i < 100; i++ {
	go func() {
		mu.Lock()          // 拿钥匙开保险柜
		counter++
		mu.Unlock()        // 用完立刻还
	}()
}</code></pre></div>
  <p>一百只地鼠同时 counter++,不加锁就会<b>丢更新</b>(两只同时读到 5、各写回 6,只涨了 1)。Mutex 保证「一次只进一只」。惯用写法是函数开头 <code class="ic">defer mu.Unlock()</code>——老朋友 defer 再次值岗。channel 传数据、Mutex 保状态,这就是 Go 并发的两大流派。</p>

  <h3 class="sec-title">🎯 专题十三 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="cc-b1"></div>
  <div class="exslot" data-ex="cc-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题十三心法</div>
    <ul>
      <li>buffered = 邮筒格子:没满随投,满了才等</li>
      <li>发送方 close,接收方 range:关门自动散场</li>
      <li>单向通道把权限焊进签名:chan<- 只发、<-chan 只收</li>
      <li>select 多路监听,超时模式是标配;共享状态用 Mutex 上锁</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "cc-1", kind: "predict", xp: 10, title: "筒里压了几个?",
      task: `带 3 格的邮筒,连投两个没人收。<span class="hl">len(ch) 打印几?</span>`,
      given: "ch := make(chan int, 3)\nch <- 1\nch <- 2\nfmt.Println(len(ch))",
      expected: "2",
      ref: "ch := make(chan int, 3)   // 3 格邮筒\nch <- 1\nch <- 2\nfmt.Println(len(ch))   // 2 ——格子没满,发送方根本不用等",
      refNote: "带缓冲就「投了就走」:两次投递瞬间完成,筒里压着 2 个等收件人。这就是它和无缓冲(必须两人到场)的本质区别。",
    },
    {
      id: "cc-2", kind: "predict", xp: 10, title: "关门散场",
      task: `生产者发 3 个后 close,消费者 range 收。<span class="hl">三行输出打出来。</span>`,
      given: "ch := make(chan int)\n\ngo func() {\n\tfor i := 1; i <= 3; i++ {\n\t\tch <- i\n\t}\n\tclose(ch)\n}()\n\nfor v := range ch {\n\tfmt.Println(v)\n}",
      expected: "1\n2\n3",
      ref: "…\n\tclose(ch)          // 发完关门\n}()\nfor v := range ch {   // 收到门关为止,自动散场\n\tfmt.Println(v)     // 1 2 3\n}",
      refNote: "消费者根本不知道会有几个货——range 一直收,直到 close 把门带上才退出循环。「数量未知」的生产消费,这套姿势永远成立。",
    },
    {
      id: "cc-3", kind: "blank", xp: 10, mini: true, title: "关门那行",
      task: `生产者发完了,忘了告诉消费者「没有更多了」。<span class="hl">把缺的那行打出来</span>。`,
      given: "go func() {\n\tfor i := 1; i <= 3; i++ {\n\t\tch <- i\n\t}\n\t____\n}()\nfor v := range ch {\n\tfmt.Println(v)\n}",
      placeholder: "close…",
      checks: [
        { label: "关闭了 ch", hint: "close(ch) ——发送方负责关门,接收方负责散场。", test: (s) => /close\s*\(\s*ch\s*\)/.test(s) },
      ],
      ref: "close(ch)",
      refNote: "不 close,range 会永远等下去(死锁崩溃)。记牢分工:close 永远写在发送方,「发货完毕」的告示牌由发货人挂。",
    },
    {
      id: "cc-4", kind: "fix", xp: 10, title: "死锁现场(二连发)",
      task: `main 里往<b>无缓冲</b>通道连发两个,没有任何人接收——第一发就当场卡死。两种修法任选:①改成带格子的邮筒(make 加容量);②派一只小地鼠接收。把修好的完整代码打出来。`,
      given: "func main() {\n\tch := make(chan int)\n\tch <- 1      // 无人接收,当场卡死\n\tch <- 2\n\tfmt.Println(\"完成\")\n}",
      errText: "fatal error: all goroutines are asleep - deadlock!",
      scaffold: "func main() {\n\tch := make(chan int)\n\tch <- 1      // 无人接收,当场卡死\n\tch <- 2\n\tfmt.Println(\"完成\")\n}",
      checks: [
        { label: "死锁已解除(带缓冲 或 有接收方)", hint: "修法一:make(chan int, 2) 加 2 个格子;修法二:go func() { <-ch; <-ch }() 派人收。", test: (s) => /make\s*\(\s*chan\s+int\s*,\s*(?:[2-9]|[1-9]\d+)\s*\)/.test(s) || (/\bgo\s+(func|fmt)/.test(s) && /<-\s*ch/.test(s)) },
        { label: "发送逻辑保留", hint: "ch <- 1 和 ch <- 2 这两次发送还在。", test: (s) => /ch\s*<-\s*1/.test(s) && /ch\s*<-\s*2/.test(s) },
      ],
      ref: "// 修法一:邮筒加格子\nfunc main() {\n\tch := make(chan int, 2)   // 两个格子,投了就走\n\tch <- 1\n\tch <- 2\n\tfmt.Println(\"完成\")\n}",
      refNote: "无缓冲的每次交接都要<b>两人同时到场</b>——main 自己发、自己收不成,发第一发就永远等。也可在发送前用 go func() { <-ch; <-ch }() 启动接收方。两种修法对应两种真实场景:攒批用格子,实时用接收方,别死记,看需求。",
    },
    {
      id: "cc-5", kind: "write", xp: 10, title: "动手写:流水线求和",
      task: `把流水线串起来:①goroutine 发 1~5 进通道后 <code class="ic">close</code>;②main 用 <code class="ic">range</code> 收齐并求和,打印结果(应为 <b>15</b>)。imports 已备好:fmt。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tch := make(chan int)\n\n\t// ① goroutine 发货 + close\n\n\t// ② range 收齐求和打印\n\n}",
      checks: [
        { label: "goroutine 里发了 1~5", hint: "go func() { for i := 1; i <= 5; i++ { ch <- i }; close(ch) }()", test: (s) => /\bgo\s+func/.test(s) && /i\s*<=\s*5/.test(s) },
        { label: "发货完毕 close 了通道", hint: "close(ch) ——忘了它,range 永远等不到散场。", test: (s) => /close\s*\(\s*ch\s*\)/.test(s) },
        { label: "main 用 range 收货", hint: "for v := range ch { sum += v }", test: (s) => /\brange\s+ch\b/.test(s) },
        { label: "求和并打印了结果", hint: "fmt.Println(sum) → 15", test: (s) => /sum\s*\+=|sum\s*=\s*sum\s*\+/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tch := make(chan int)\n\n\tgo func() {\n\t\tfor i := 1; i <= 5; i++ {\n\t\t\tch <- i\n\t\t}\n\t\tclose(ch)\n\t}()\n\n\tsum := 0\n\tfor v := range ch {\n\t\tsum += v\n\t}\n\tfmt.Println(sum)   // 1+2+3+4+5 = 15\n}",
      refNote: "生产者(goroutine)与消费者(main)隔着通道各干各的,close+range 让它们无缝收尾——Go 流水线的最小完整闭环,不过如此。",
    },

    /* ── 大作业 ── */
    {
      id: "cc-b1", kind: "big", xp: 30, title: "大作业① 双工人流水线",
      task: `两班倒的加工厂:①<code class="ic">jobs</code> 通道(带 3 格)装 3 个活,装完 <code class="ic">close(jobs)</code>;②派 <b>2 只工人 goroutine</b>,各自 <code class="ic">for j := range jobs</code> 领活,加工(乘 10)后投进 <code class="ic">results</code> 通道;③main 从 results 收 3 个打印(应为 10、20、30,顺序不定)。imports 已备好:fmt。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tjobs := make(chan int, 3)\n\tresults := make(chan int, 3)\n\n\t// ① 装活 + close\n\t// ② 两只工人 goroutine 领活加工\n\t// ③ 收 3 个结果打印\n\n}",
      checks: [
        { label: "两条通道就位", hint: "jobs 和 results 都 make(chan int, 3)。", test: (s) => (s.match(/make\s*\(\s*chan\s+int\s*,\s*\d+\s*\)/g) || []).length >= 2 },
        { label: "装了活并 close(jobs)", hint: "jobs <- 1(三个活),然后 close(jobs) ——关门了工人还能把筒里的干完。", test: (s) => /close\s*\(\s*jobs\s*\)/.test(s) },
        { label: "派了 2 只工人 goroutine", hint: "go func() { for j := range jobs { results <- j * 10 } }() ——写两次,或用 for 循环两次 go(都算)。", test: (s) => (s.match(/\bgo\s+func/g) || []).length >= 2 || (/\bfor\b[\s\S]*\bgo\s+func/.test(s) && /<=\s*2/.test(s)) },
        { label: "工人用 range 领活", hint: "for j := range jobs ——领到门关为止,活干完自动下班。", test: (s) => /\brange\s+jobs\b/.test(s) },
        { label: "main 收齐 3 个结果打印", hint: "for i := 0; i < 3; i++ { fmt.Println(<-results) }", test: (s) => /<-\s*results/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tjobs := make(chan int, 3)\n\tresults := make(chan int, 3)\n\n\tfor i := 1; i <= 3; i++ {\n\t\tjobs <- i\n\t}\n\tclose(jobs)\n\n\tfor w := 1; w <= 2; w++ {\n\t\tgo func() {\n\t\t\tfor j := range jobs {\n\t\t\t\tresults <- j * 10\n\t\t\t}\n\t\t}()\n\t}\n\n\tfor i := 0; i < 3; i++ {\n\t\tfmt.Println(<-results)   // 10 20 30,谁先到不定\n\t}\n}",
      refNote: "close 后工人仍能领完筒里剩下的活——「关门」是说没有新活,不是赶人走。两只工人谁抢到哪个活不定,但货一件不少。把工人改成 5 只试试:加活不加代码,这就是流水线架构的甜头。",
    },
    {
      id: "cc-b2", kind: "big", xp: 30, title: "大作业② 业务 + 超时双保险",
      task: `select 的经典应用:①goroutine 往通道发一句「消息到达」(快速到达);②main 用 <code class="ic">select</code> 双路监听:收到就打印「收到:…」;超过 0.5 秒(<code class="ic">time.After(500 * time.Millisecond)</code>)打印「超时!」。本程序应走<b>收到</b>这条路。imports 已备好:fmt、time。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tch := make(chan string)\n\n\t// ① goroutine 发消息\n\t// ② select 双路:收到 / 超时\n\n}",
      checks: [
        { label: "goroutine 里发了消息", hint: "go func() { ch <- \"消息到达\" }()", test: (s) => /\bgo\s+func/.test(s) && /ch\s*<-/.test(s) },
        { label: "用了 select 双路监听", hint: "select { case msg := <-ch: … case <-time.After(500 * time.Millisecond): … }", test: (s) => /\bselect\s*\{/.test(s) },
        { label: "有 case 接收消息", hint: "case msg := <-ch:", test: (s) => /case\s+\w+\s*:=\s*<-\s*ch|case\s+<-\s*ch/.test(s) },
        { label: "有超时 case(time.After)", hint: "case <-time.After(500 * time.Millisecond):", test: (s) => /time\.After\s*\(/.test(s) },
        { label: "两条路都有打印", hint: "收到路打印消息;超时路打印「超时!」。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tch := make(chan string)\n\n\tgo func() {\n\t\tch <- \"消息到达\"      // 到得很快\n\t}()\n\n\tselect {\n\tcase msg := <-ch:\n\t\tfmt.Println(\"收到:\", msg)         // 走这条路\n\tcase <-time.After(500 * time.Millisecond):\n\t\tfmt.Println(\"超时!\")\n\t}\n}",
      refNote: "把 goroutine 里的发送改成 time.Sleep(time.Second) 后再发——程序会改走「超时」路。同一套骨架,两种命运,全看哪条路先亮灯。这就是网络请求、任务队列的标配保底写法:业务 + 超时,双保险。「管道宗师」结业!",
    },
  ],
});

})();
