/* ═══════════════════════════ Go 训练场 · 专题五(并发) + 毕业大考 ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

A.registerTopic({
  key: "t5", order: 12, part: 5, partTitle: "第四部分 · 并发之门", icon: "⚡", title: "并发初探",
  eyebrow: "专题十二 · 通关徽章:⚡ 并发武士",
  badge: { icon: "⚡", name: "并发武士" },

  html: `
  <p class="lead">终于来到 Go 的招牌功夫:<b>并发</b>。让程序同时干好几件事,别的语言要费一番周章,Go 只用一个小小的关键字 <code class="ic">go</code>——念出来就是「去,自己干!」。这一关学会三件兵器:发车(go)、传话(channel)、集合(WaitGroup)。</p>

  <h3 class="sec-title">go:一个关键字,发车</h3>
  <div class="gcode"><div class="gbar"><span>goroutine:轻量小地鼠</span></div><pre><code>import "time"

func main() {
	// 在函数前加一个 go,它就被派出去了,主程序继续往下跑
	go fmt.Println("B: 我是先出发的小地鼠")

	fmt.Println("A: 我是压轴的主地鼠")
}</code></pre></div>
  <p>被 <code class="ic">go</code> 修饰的调用叫 <b>goroutine</b>——一只独立干活的小地鼠。主程序不等它:自顾自往下跑。<b>上面那段代码有个悬念</b>:B 会不会被打印出来,取决于 A 打完、main 结束时它跑没跑到——这局我们来点确定的:</p>
  <div class="gcode"><div class="gbar"><span>加上一点等待</span></div><pre><code>func main() {
	go fmt.Println("B: 我是先出发的小地鼠")
	time.Sleep(100 * time.Millisecond)   // 主程序小睡 0.1 秒,给 B 留时间
	fmt.Println("A: 我是压轴的主地鼠")
}</code></pre></div>
  <div class="warn">
    <h4>⚠️ time.Sleep 只是教学拐杖</h4>
    <p>「睡一会儿等别人」在真实项目里又糙又危险(睡多久才够?)。正经的同步方式马上有:<b>WaitGroup 集合</b>和 <b>channel 传话</b>。记住:睡觉是新手村拐杖,后两件才是真兵器。</p>
  </div>

  <div class="exslot" data-ex="t5-1"></div>

  <h3 class="sec-title">channel:地鼠之间的传话筒</h3>
  <div class="gcode"><div class="gbar"><span>channel 发送与接收</span></div><pre><code>ch := make(chan int)   // 造一根传话筒:里面只能过 int

go func() {
	ch <- 42          // <- :把 42 发进筒里
}()

v := <-ch             // <- :从筒里接出来
fmt.Println(v)        // 42</code></pre></div>
  <div class="note">
    <h4>🐹 传话筒的死规矩:必须两个人到场</h4>
    <p>无缓冲 channel 像<b>对讲机交接仪式</b>:发送方举着话筒等接收方,接收方伸手等发送方——<b>谁先到谁等对方</b>,俩人都到了,交接瞬间完成。所以「往筒里发」和「从筒里接」天然就是一次同步:发出去就确定有人收,收之前对方一定发过。</p>
  </div>

  <div class="exslot" data-ex="t5-2"></div>
  <div class="exslot" data-ex="t5-3"></div>

  <h3 class="sec-title">WaitGroup:集合点发车</h3>
  <div class="gcode"><div class="gbar"><span>sync.WaitGroup</span></div><pre><code>import "sync"

func main() {
	var wg sync.WaitGroup
	wg.Add(2)                 // 要等 2 只小地鼠

	go func() {
		defer wg.Done()   // 我干完了,记一笔
		fmt.Println("地鼠 1 号完工")
	}()
	go func() {
		defer wg.Done()   // 我也干完了,记一笔
		fmt.Println("地鼠 2 号完工")
	}()

	wg.Wait()                 // 集合点:两笔都记上才放行
	fmt.Println("全队到齐,收工")
}</code></pre></div>
  <p>读法:Add(2) = 报数「等两位」;每只地鼠完事 <b>wg.Done()</b> 报一声;主程序 <b>wg.Wait()</b> 站在集合点,数齐了才走。defer wg.Done() 放函数开头是惯用写法——先记账再干活,忘不了。</p>

  <div class="exslot" data-ex="t5-4"></div>
  <div class="exslot" data-ex="t5-5"></div>

  <h3 class="sec-title">🎯 专题五 · 结尾大作业(2 个)</h3>
  <div class="exslot" data-ex="t5-b1"></div>
  <div class="exslot" data-ex="t5-b2"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题五心法</div>
    <ul>
      <li>go 一个关键字发车;主程序默认不等人</li>
      <li>channel 传话:发送和接收必须双方到场,天然同步</li>
      <li>WaitGroup 集合:Add 报数、Done 记账、Wait 等齐</li>
      <li>忘了 Done = 死锁;time.Sleep 只是教学拐杖</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "t5-1", kind: "predict", xp: 10, title: "谁先被打印?",
      task: "主程序等小地鼠发出完成信号，再继续。按顺序写出两行输出。",
      given: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    done := make(chan struct{})\n    go func() {\n        fmt.Println(\"B: 我是先出发的小地鼠\")\n        close(done)\n    }()\n    <-done\n    fmt.Println(\"A: 我是压轴的主地鼠\")\n}",
      expected: "B: 我是先出发的小地鼠\nA: 我是压轴的主地鼠",
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    done := make(chan struct{})\n    go func() {\n        fmt.Println(\"B: 我是先出发的小地鼠\")\n        close(done)\n    }()\n    <-done\n    fmt.Println(\"A: 我是压轴的主地鼠\")\n}",
      refNote: "B 打印后才关闭通道，主程序接到关闭信号后才打印 A。Sleep 只能延迟主程序，通道才能在这里明确保证顺序。",
    },
    {
      id: "t5-2", kind: "blank", xp: 10, mini: true, title: "造一根传话筒",
      task: `程序要往传话筒里发"吱吱",但筒还没造出来。<span class="hl">把创建 channel 的那半行打出来</span>(=: 左边已写好)。`,
      given: "ch := ____\ngo func() {\n\tch <- \"吱吱\"\n}()\nfmt.Println(<-ch)",
      placeholder: "make(…)",
      checks: [
        { label: "用 make 造了 chan string", hint: "make(chan string) ——chan 是 channel 的关键字,后面跟筒里能过的类型。", test: (s) => /make\s*\(\s*chan\s+string\s*\)/.test(s) },
      ],
      ref: "make(chan string)",
      refNote: "make(chan 类型) 造一根只能过该类型的传话筒。chan int、chan string 都行——筒里过什么货,声明时就定死。",
    },
    {
      id: "t5-3", kind: "predict", xp: 10, title: "包裹交接",
      task: `goroutine 往筒里发了个包裹,主程序从筒里接。<span class="hl">打印什么?</span>`,
      given: "ch := make(chan string)\ngo func() {\n\tch <- \"一个包裹\"\n}()\nfmt.Println(<-ch)",
      expected: "一个包裹",
      ref: "ch := make(chan string)\ngo func() {\n\tch <- \"一个包裹\"   // 发送方举筒等接收方\n}()\nfmt.Println(<-ch)      // 接收方伸手,交接瞬间完成",
      refNote: "ch <- x 是发,<-\u2009ch 是收。箭头永远指向数据流动的方向。main 里的 <-ch 会一直等,直到筒里真的有东西——这就是 channel 自带的同步力。",
    },
    {
      id: "t5-4", kind: "write", xp: 10, title: "动手写:全队集合",
      task: `用 WaitGroup 指挥两只小地鼠:各打印一句「N 号完工」,主程序等<b>两只都完工</b>后打印「全队到齐,收工」。imports 已备好(sync + fmt)。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\n\t// 派出两只小地鼠,各自 defer wg.Done()\n\n\t// 集合等齐,打印收工\n\n}",
      checks: [
        { label: "用 go 派出了两只小地鼠", hint: "go func() { … }() ——两次。", test: (s) => (s.match(/\bgo\s+func/g) || []).length >= 2 },
        { label: "报数 Add(2)", hint: "wg.Add(2) ——要等几位,先报数。", test: (s) => /Add\s*\(\s*2\s*\)/.test(s) },
        { label: "每只都 defer wg.Done()", hint: "函数开头写 defer wg.Done() ——先记账再干活,忘不了。", test: (s) => (s.match(/defer\s+wg\.Done/g) || []).length >= 2 },
        { label: "主程序 wg.Wait() 等齐", hint: "wg.Wait() 放在打印「收工」之前。", test: (s) => /wg\.Wait\s*\(\s*\)/.test(s) },
        { label: "打印了完工与收工", hint: "小地鼠打「N 号完工」,Wait 之后打「全队到齐,收工」。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 3 },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\twg.Add(2)\n\n\tgo func() {\n\t\tdefer wg.Done()\n\t\tfmt.Println(\"1 号完工\")\n\t}()\n\tgo func() {\n\t\tdefer wg.Done()\n\t\tfmt.Println(\"2 号完工\")\n\t}()\n\n\twg.Wait()\n\tfmt.Println(\"全队到齐,收工\")\n}",
      refNote: "「1 号/2 号」谁先打印不一定——并发就是这样;但「全队到齐」<b>一定</b>最后打——WaitGroup 保证了这一点。不确定中锁定确定,这就是同步的意义。",
    },
    {
      id: "t5-5", kind: "fix", xp: 10, title: "死锁!队伍永远等不齐",
      task: `这段代码会<b>整个程序卡死</b>,然后崩溃——小地鼠干完活忘了报数,主程序在集合点等到天荒地老。<span class="hl">把修好的完整代码打出来</span>(imports 已备好:fmt、sync)。`,
      given: "var wg sync.WaitGroup\nwg.Add(1)\n\ngo func() {\n\tfmt.Println(\"干活\")\n\t// 小地鼠干完活,忘了什么?\n}()\n\nwg.Wait()\nfmt.Println(\"收工\")",
      errText: "fatal error: all goroutines are asleep - deadlock!",
      scaffold: "var wg sync.WaitGroup\nwg.Add(1)\n\ngo func() {\n\tfmt.Println(\"干活\")\n\t// 小地鼠干完活,忘了什么?\n}()\n\nwg.Wait()\nfmt.Println(\"收工\")",
      checks: [
        { label: "补上了 wg.Done()", hint: "defer wg.Done() 放在 func 开头——干完活自动报数。", test: (s) => /wg\.Done\s*\(\s*\)/.test(s) },
        { label: "Done 在 goroutine 内部", hint: "报数是小地鼠的事:写进 go func() { … } 的大括号里。", test: (s) => /go\s+func[\s\S]*wg\.Done/.test(s) },
        { label: "Wait 和收工还在", hint: "主程序的 wg.Wait() 和最后的打印保持不动。", test: (s) => /wg\.Wait\s*\(\s*\)/.test(s) && /fmt\.Print(ln|f)\s*\(\s*\"收工/.test(s) },
      ],
      ref: "var wg sync.WaitGroup\nwg.Add(1)\n\ngo func() {\n\tdefer wg.Done()   // 先记账:干完(或中途出事)都会报数\n\tfmt.Println(\"干活\")\n}()\n\nwg.Wait()\nfmt.Println(\"收工\")",
      refNote: "Add(1) 报了「等一位」,Done() 不喊,Wait() 就永远等——全员睡死,程序崩溃。defer wg.Done() 放在开头是铁律:哪怕函数中途出错 return,账也照记。",
    },

    /* ── 大作业 ── */
    {
      id: "t5-b1", kind: "big", xp: 30, title: "大作业① 并发下载模拟",
      task: `模拟下载器:派 <b>3 只小地鼠</b>各自打印「文件N下载完成」(N=1/2/3),主程序在集合点等<b>全部完成</b>后打印「<b>全部下载完成</b>」。要求用 WaitGroup(Add(3) + defer Done + Wait)。imports 已备好:fmt、time、sync。三只小地鼠可以各睡一小会儿(如 N×100 毫秒)制造先后感。`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n\t\"sync\"\n)\n\nfunc main() {\n\t// 派 3 只小地鼠,各打印一个文件的下载完成\n\n\t// 集合点:全部完成后打印「全部下载完成」\n\n}",
      checks: [
        { label: "用 go 派出了小地鼠", hint: "可以在一个 for 循环里 go,也可以手写三个 go func——都行。", test: (s) => /\bgo\s+(func|fmt)/.test(s) },
        { label: "报数 Add(3)", hint: "wg.Add(3) ——三位。", test: (s) => /Add\s*\(\s*3\s*\)/.test(s) },
        { label: "每只都 defer wg.Done()", hint: "goroutine 开头 defer wg.Done() ——本作业至少 3 处(或循环里 1 处也认)。", test: (s) => /defer\s+wg\.Done/.test(s) },
        { label: "打印了每个文件的完成", hint: "fmt.Println(\"文件1下载完成\") 这样,三个文件各一句(或循环生成)。", test: (s) => /下载完成|fmt\.Print[\s\S]*文件/.test(s) },
        { label: "Wait 之后打印了总完成", hint: "wg.Wait() 之后:fmt.Println(\"全部下载完成\")", test: (s) => /wg\.Wait\s*\(\s*\)[\s\S]*fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\t\"time\"\n)\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\twg.Add(3)\n\n\tfor i := 1; i <= 3; i++ {\n\t\tgo func(n int) {\n\t\t\tdefer wg.Done()\n\t\t\ttime.Sleep(time.Duration(n*100) * time.Millisecond)\n\t\t\tfmt.Printf(\"文件%d下载完成\\n\", n)\n\t\t}(i)\n\t}\n\n\twg.Wait()\n\tfmt.Println(\"全部下载完成\")\n}",
      refNote: "循环里发车是最常见的写法:go func(n int){…}(i) 把当前的 i 复印进小地鼠的工单。三只各自睡不同时长,打印顺序每次可能都不同——但「全部下载完成」永远压轴。去真跑几次,亲眼看看顺序怎么变!",
    },
    {
      id: "t5-b2", kind: "big", xp: 30, title: "大作业② 加倍工厂",
      task: `一根传话筒,一条流水线:①小地鼠工人(goroutine)拿到 <b>ch</b> 后,把 1、2、3 各自<b>翻倍</b>再发进筒里;②主程序从筒里收 3 次,打印 2、4、6。要求:channel 一根、go 一只、收发用 <code class="ic">&lt;-</code>。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// ① 造一根 chan int\n\n\t// ② go 一只工人小地鼠:把 1、2、3 翻倍发进筒\n\n\t// ③ 主程序收 3 次并打印\n\n}",
      checks: [
        { label: "造了 chan int 传话筒", hint: "ch := make(chan int)", test: (s) => /make\s*\(\s*chan\s+int\s*\)/.test(s) },
        { label: "用 go 派出了工人", hint: "go func() { … }()", test: (s) => /\bgo\s+func/.test(s) },
        { label: "工人把数翻倍后发进筒", hint: "ch <- i * 2 ——乘 2 后再 ch <-。", test: (s) => /ch\s*<-[^;]*\*|<-[\s\S]*\*\s*2/.test(s) },
        { label: "主程序从筒里收", hint: "v := <-ch 或 fmt.Println(<-ch)", test: (s) => /<-\s*ch/.test(s) },
        { label: "收了 3 个并打印", hint: "收三次:for i := 1; i <= 3; i++ { fmt.Println(<-ch) }", test: (s) => /for[\s\S]*<-\s*ch/.test(s) && /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tch := make(chan int)\n\n\tgo func() {\n\t\tfor i := 1; i <= 3; i++ {\n\t\t\tch <- i * 2\n\t\t}\n\t}()\n\n\tfor i := 1; i <= 3; i++ {\n\t\tfmt.Println(<-ch)\n\t}\n}",
      refNote: "工人发一个、主程序收一个,一来一回正好三趟——无缓冲 channel 的「交接仪式」把两边的节奏天然对齐了,谁也不用 sleep,谁也不会漏。恭喜,「并发武士」结业!",
    },
  ],
});

/* ══════════ 毕业大考 · 综合大作业 + 结业证书 ══════════ */
A.registerTopic({
  key: "grad", order: 14, part: 6, partTitle: "毕业", icon: "🏆", title: "毕业大考",
  eyebrow: "终关 · 通关徽章:🏆 地鼠宗师",
  badge: { icon: "🏆", name: "地鼠宗师" },

  html: `
  <p class="lead">三份毕业作业，用上学过的工具:<b>struct、切片、方法、错误、循环</b>。完成三份作业后，你就是本训练场认证的「地鼠宗师」。</p>

  <h3 class="sec-title">⚡ 毕业快问快答(五连发)</h3>
  <p>三份大作业之前,先用五道快题把全书的关键直觉过一遍——每题一行答案,秒判。</p>
  <div class="exslot" data-ex="grad-4"></div>
  <div class="exslot" data-ex="grad-5"></div>
  <div class="exslot" data-ex="grad-6"></div>
  <div class="exslot" data-ex="grad-7"></div>
  <div class="exslot" data-ex="grad-8"></div>

  <div class="exslot" data-ex="grad-1"></div>
  <div class="exslot" data-ex="grad-2"></div>
  <div class="exslot" data-ex="grad-3"></div>

  <div class="grad-wrap" id="gradCard">
    <div class="cert">
      <div class="cert-icon">🏆</div>
      <div class="cert-title">Go 训练场 · 结业证书</div>
      <div class="cert-body">
        兹证明 <input id="gdName" class="cert-name" placeholder="点这里落下大名"> ,<br>
        完成主线毕业考核、亲手敲穿 <b id="gdSolved">0</b> 道动手练习,<br>
        以 <b id="gdXp">0</b> 经验通过主线考核,特此认证:
      </div>
      <div class="cert-rank">「 地鼠宗师 🐹 」</div>
      <div class="cert-badges" id="gdBadges"></div>
      <div class="cert-foot">Go 训练场 · 从 Hello World 到并发 · 主线毕业纪念</div>
    </div>

    <div class="note" style="margin-top:22px">
      <h4>🗺 出山路线图(真实世界入口)</h4>
      <ul>
        <li><b>🏃 官方 Tour of Go</b>(go.dev/tour):官方交互教程,支持切换中文——你现在的底子,半天刷完</li>
        <li><b>📖 Go by Example</b>(gobyexample.com):例子驱动,哪句不会查哪句</li>
        <li><b>📚 官方文档</b>(go.dev/doc):语言规范、标准库,查 fmt、os、strings 的家</li>
        <li><b>🔨 下一个小项目建议</b>:把毕业大作业改造成<b>命令行版待办清单</b>——加上 os.Args 读命令、文件保存待办,正是你的第一个真实 Go 工具</li>
      </ul>
    </div>
    <p class="compare-note" style="text-align:center">往后读任何 Go 代码,遇到生词就回训练场查心法——各专题的心法表就是你的随身兵器谱。🐹</p>
  </div>`,

  exercises: [
    {
      id: "grad-4", kind: "predict", xp: 10, title: "快问① 交换",
      task: "两行完成交换,Go 不需要临时变量。打印什么?",
      given: "a, b := 3, 8\na, b = b, a\nfmt.Println(a > b)",
      expected: "true",
      ref: "a, b := 3, 8\na, b = b, a    // 右边先算好一对新值,再同时塞回左边\nfmt.Println(a > b)   // a=8, b=3 → true",
      refNote: "元组赋值是 Go 的常用手法:右边全部求值完毕,再一次性分配给左边——交换、多返回值接货,全是它。",
    },
    {
      id: "grad-5", kind: "predict", xp: 10, title: "快问② iota 累计",
      task: "三原色各是几号?打印什么?",
      given: "const (\n    Red = iota\n    Green\n    Blue\n)\nfmt.Println(Red + Green + Blue)",
      expected: "3",
      ref: "const (\n    Red = iota   // 0\n    Green        // 1\n    Blue         // 2\n)\nfmt.Println(Red + Green + Blue)   // 0+1+2 = 3",
      refNote: "iota 每过一行自动 +1——枚举界的一键三连。",
    },
    {
      id: "grad-6", kind: "predict", xp: 10, title: "快问③ 字符串双面",
      task: "len 数字节,range 走字符——两个视角都考。打印什么?",
      given: "fmt.Println(len(\"地鼠\"))\nfor _, r := range \"地鼠\" {\n    fmt.Print(r, \" \")\n}",
      expected: "6\n22320 40736",
      ref: "fmt.Println(len(\"地鼠\"))   // 6 个 UTF-8 字节\nfor _, r := range \"地鼠\" {\n    fmt.Print(r, \" \")   // 22320 40736 ——两个字符的 Unicode 编号\n}",
      refNote: "地(U+5730)=22320,鼠(U+9F20)=40736。len 看字节,rune 看字符——两个视角,各管各的。",
    },
    {
      id: "grad-7", kind: "blank", xp: 10, mini: true, title: "快问④ 断言",
      task: "x 装着一个值,想安全地断言它是 string。把 if 里缺的那半句打出来。",
      given: "var x interface{} = \"go\"\nif s, ok := x.____; ok {\n    fmt.Println(\"是字符串:\", s)\n}",
      placeholder: "(…)",
      checks: [
        { label: "断言写的是 (string)", hint: "断言语法:x.(string) ——括号里写目标类型。", test: (s) => /^\(\s*string\s*\)$/.test(s) },
      ],
      ref: "(string)",
      refNote: "双返回值断言:成了 ok 是 true,败了也不崩——接口进阶站的看家本领。",
    },
    {
      id: "grad-8", kind: "predict", xp: 10, title: "快问⑤ 关店散场",
      task: "close 之后 range 还能收尾。打印什么?",
      given: "ch := make(chan int, 3)\nch <- 10\nch <- 20\nch <- 30\nclose(ch)\ntotal := 0\nfor v := range ch {\n    total += v\n}\nfmt.Println(total)",
      expected: "60",
      ref: "…\nclose(ch)            // 关店:不再进货\nfor v := range ch {  // 把货架上的收完,循环自动结束\n    total += v\n}\nfmt.Println(total)   // 60",
      refNote: "close + range 是黄金搭档:收完存量、自然散场,不会死等新货——并发进阶站的核心招式。",
    },
    {
      id: "grad-1", kind: "big", xp: 40, title: "毕业大作业 · 迷你任务清单",
      task: `综合实战,把学过的全用上:①定义 <code class="ic">Task</code> struct(字段 <b>Title string</b>、<b>Done bool</b>);②用切片字面量装 3 个任务(全部未完成);③写函数 <code class="ic">complete(tasks []Task, i int)</code>:把第 i 个任务标记完成;<b>④用 range 遍历打印</b>每个任务——完成的打 <code>[✅] 标题</code>,没完成的打 <code>[·] 标题</code>(在循环里用 if 判断 Done 字段)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\n// ① Task struct\n\n// ③ complete 函数:把第 i 个任务标记完成\n\nfunc main() {\n\t// ② 切片装 3 个任务\n\t// 调用 complete 完成第 0 个\n\t// ④ range 遍历,按完成状态打印\n\n}",
      checks: [
        { label: "定义了 Task struct", hint: "type Task struct { Title string; Done bool }", test: (s) => /type\s+Task\s+struct/.test(s) },
        { label: "有 Title 和 Done 两个字段", hint: "struct 里:Title string / Done bool。", test: (s) => /Title\s+string/.test(s) && /Done\s+bool/.test(s) },
        { label: "用切片装了任务", hint: "tasks := []Task{ {Title: \"学Go\", Done: false}, … } ——三个。", test: (s) => /\[\]\s*Task\s*\{/.test(s) },
        { label: "写了 complete 函数", hint: "func complete(tasks []Task, i int) { tasks[i].Done = true }", test: (s) => /func\s+complete\s*\(/.test(s) },
        { label: "函数里标记了完成状态", hint: "tasks[i].Done = true ——顺着索引改字段。", test: (s) => /\.Done\s*=\s*true/.test(s) },
        { label: "main 里调用了 complete", hint: "complete(tasks, 0) ——完成第 0 个。", test: (s) => /complete\s*\(\s*tasks\s*,\s*0\s*\)/.test(s) || /complete\s*\(/.test(s) },
        { label: "range 遍历并按状态打印", hint: "for _, t := range tasks { if t.Done { … } else { … } } ——✅ 和 · 区分开。", test: (s) => /\brange\b/.test(s) && /if\s+\w+\.Done/.test(s) && (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 1 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\ntype Task struct {\n\tTitle string\n\tDone  bool\n}\n\nfunc complete(tasks []Task, i int) {\n\ttasks[i].Done = true\n}\n\nfunc main() {\n\ttasks := []Task{\n\t\t{Title: \"学完十三个专题\", Done: false},\n\t\t{Title: \"敲穿 108 道练习\", Done: false},\n\t\t{Title: \"写出毕业大作业\", Done: false},\n\t}\n\n\tcomplete(tasks, 0)\n\n\tfor _, t := range tasks {\n\t\tmark := \"·\"\n\t\tif t.Done {\n\t\t\tmark = \"✅\"\n\t\t}\n\t\tfmt.Printf(\"[%s] %s\\n\", mark, t.Title)\n\t}\n}",
      refNote: "struct 定型、切片装货、函数改状态、range 分流打印——四个专题的兵器在一段代码里全部上膛。把它改造成命令行工具、加上文件保存,就是路线图里的「出山第一项目」。地鼠宗师,出山快乐!🐹",
    },
    {
      id: "grad-2", kind: "big", localOnly: true, xp: 40, title: "大作业② 记账 CLI(本地运行版 🏠)",
      task: `命令行记账本,综合 os.Args + struct + 切片 + strconv:①定义 <code class="ic">Record</code> struct(字段 <b>Desc string</b>、<b>Amount int</b>);②预置两笔记录进切片;③命令分发:<code class="ic">add 描述 金额</code> → 解析 os.Args 后 append 一笔;<code class="ic">total</code> → range 求和打印;<code class="ic">list</code> → range 逐条打印。金额解析用 <code class="ic">strconv.Atoi</code>。🏠 <b>本地运行版</b>:go run main.go total / go run main.go add 买菜 35(Playground 不支持命令行参数)`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n)\n\n// ① Record struct\n\nfunc main() {\n\t// ② 预置两笔记录\n\n\t// ③ 命令分发:add / total / list\n\n}",
      checks: [
        { label: "定义了 Record struct", hint: "type Record struct { Desc string; Amount int }", test: (s) => /type\s+Record\s+struct/.test(s) && /Desc\s+string/.test(s) && /Amount\s+int/.test(s) },
        { label: "用切片装了记录", hint: "records := []Record{ … }", test: (s) => /\[\]\s*Record\s*\{/.test(s) },
        { label: "读了命令行参数 os.Args", hint: "cmd := os.Args[1] ——参数在 os.Args 里,Args[0] 是程序名。", test: (s) => /os\.Args/.test(s) },
        { label: "add 命令用 Atoi 解析金额并 append", hint: "amount, err := strconv.Atoi(os.Args[3]);records = append(records, Record{Desc: …, Amount: amount})", test: (s) => /strconv\.Atoi/.test(s) && /=\s*append\s*\(/.test(s) },
        { label: "total 用 range 求和", hint: "for _, r := range records { sum += r.Amount }", test: (s) => /\brange\b/.test(s) && /\+=\s*\w+\.Amount|Amount\s*\+=/.test(s) },
        { label: "命令分发有兜底", hint: "if/switch 后跟 default/else:未知命令给提示。", test: (s) => /\bdefault\b|\belse\b/.test(s) },
        { label: "打印了结果", hint: "list/total 都要 fmt.Println/Printf。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n)\n\ntype Record struct {\n\tDesc   string\n\tAmount int\n}\n\nfunc main() {\n\trecords := []Record{\n\t\t{Desc: \"早餐\", Amount: 12},\n\t\t{Desc: \"地铁\", Amount: 4},\n\t}\n\n\tif len(os.Args) < 2 {\n\t\tfmt.Println(\"用法:add 描述 金额 | total | list\")\n\t\treturn\n\t}\n\n\tswitch os.Args[1] {\n\tcase \"add\":\n\t\tif len(os.Args) != 4 {\n\t\t\tfmt.Println(\"用法: add 描述 金额\")\n\t\t\treturn\n\t\t}\n\t\tamount, err := strconv.Atoi(os.Args[3])\n\t\tif err != nil {\n\t\t\tfmt.Println(\"金额必须是数字\")\n\t\t\treturn\n\t\t}\n\t\trecords = append(records, Record{Desc: os.Args[2], Amount: amount})\n\t\tfmt.Println(\"已记入:\", os.Args[2], amount)\n\tcase \"total\":\n\t\tsum := 0\n\t\tfor _, r := range records {\n\t\t\tsum += r.Amount\n\t\t}\n\t\tfmt.Println(\"总计:\", sum, \"元\")\n\tcase \"list\":\n\t\tfor _, r := range records {\n\t\t\tfmt.Printf(\"%s %d元\\n\", r.Desc, r.Amount)\n\t\t}\n\tdefault:\n\t\tfmt.Println(\"未知命令:\", os.Args[1])\n\t}\n}",
      refNote: "os.Args + struct + 切片 + Atoi + 命令分发——一个真正能用的 CLI 骨架。运行 go run main.go add 买菜 35 会打印新增记录。另起进程执行 total 只会统计两笔预置记录，因为这个版本把记录存在内存里。进阶:把 records 存进文件(标准库专题学过 WriteFile),重启不丢。",
    },
    {
      id: "grad-3", kind: "big", localOnly: true, xp: 40, title: "大作业③ 迷你 HTTP 服务(本地运行版 🏠)",
      task: `「能写网站」的毕业标志:①用 <code class="ic">http.HandleFunc("/", …)</code> 注册一个首页处理函数,向浏览器回一句问候;②再加一个 <code class="ic">/api/time</code> 路由,返回当前时间(<code class="ic">time.Now().Format(\"2006-01-02 15:04:05\")</code>);③<code class="ic">log.Fatal(http.ListenAndServe(\"127.0.0.1:8080\", nil))</code> 启动服务。🏠 <b>本地运行版</b>:go run 后浏览器打开 http://127.0.0.1:8080`,
      scaffold: "package main\n\nimport (\n\t\"fmt\"\n\t\"log\"\n\t\"net/http\"\n\t\"time\"\n)\n\nfunc main() {\n\t// ① 首页路由\n\t// ② /api/time 路由\n\t// ③ 启动服务\n\n}",
      checks: [
        { label: "注册了首页路由", hint: "http.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) { … })", test: (s) => /http\.HandleFunc\s*\(\s*"\/"/.test(s) },
        { label: "处理函数向浏览器回了话", hint: "fmt.Fprintln(w, \"你好,Go 服务\") ——w 是给浏览器回话的笔。", test: (s) => /fmt\.Fprintln\s*\(\s*w|fmt\.Fprintf\s*\(\s*w/.test(s) },
        { label: "加了 /api/time 路由", hint: "http.HandleFunc(\"/api/time\", …)", test: (s) => /http\.HandleFunc\s*\(\s*"\/api\/time"/.test(s) },
        { label: "用了 time.Now().Format", hint: "fmt.Fprintln(w, time.Now().Format(\"2006-01-02 15:04:05\"))", test: (s) => /time\.Now\s*\(\s*\)\s*\.Format/.test(s) },
        { label: "ListenAndServe 启动在 8080", hint: "log.Fatal(http.ListenAndServe(\"127.0.0.1:8080\", nil))", test: (s) => /http\.ListenAndServe\s*\(\s*"127\.0\.0\.1:8080"/.test(s) },
      ],
      ref: "package main\n\nimport (\n\t\"fmt\"\n\t\"log\"\n\t\"net/http\"\n\t\"time\"\n)\n\nfunc main() {\n\thttp.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"你好,这是 Go 写的服务 🐹\")\n\t})\n\n\thttp.HandleFunc(\"/api/time\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"当前时间:\", time.Now().Format(\"2006-01-02 15:04:05\"))\n\t})\n\n\tlog.Fatal(http.ListenAndServe(\"127.0.0.1:8080\", nil))\n}",
      refNote: "十来行代码,一个真 HTTP 服务:浏览器访问首页,访问 /api/time 看时间。Go 官方宣传语「十行代码起一个网站」不虚——这行 ListenAndServe 背后是工业级标准库。到这里,工具、CLI、网站三栖,「地鼠宗师」名副其实。",
    },
  ],
});

})();
