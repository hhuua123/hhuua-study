/* ═══════════════════════════ Go 训练场 · 专题二(流程控制) ═══════════════════════════ */
(() => {
"use strict";
const A = window.GO_DOJO;

A.registerTopic({
  key: "t2", order: 2, part: 2, icon: "🔀", title: "流程控制",
  eyebrow: "专题二 · 通关徽章:🔀 循环骑士",
  badge: { icon: "🔀", name: "循环骑士" },

  html: `
  <p class="lead">程序有了记忆(变量),还得会<b>做决定</b>和<b>重复干活</b>。Go 把这两件事交给了三员大将:<code class="ic">if</code>、<code class="ic">for</code>、<code class="ic">switch</code>。好消息:Go 的流程控制是出了名的精简——比如它压根<b>没有 while</b>,一个 for 全包了。</p>

  <h3 class="sec-title">if:做决定</h3>
  <div class="gcode"><div class="gbar"><span>if 的长相</span></div><pre><code>grade := 75

if grade >= 60 {
	fmt.Println("及格")
} else {
	fmt.Println("再接再厉")
}</code></pre></div>
  <ul class="points">
    <li>条件<b>不套小括号</b>:<code class="ic">if grade >= 60</code>,套了编译器不报错但社区会瞪你</li>
    <li>大括号<b>必须有</b>,而且左括号照旧在行尾</li>
    <li>条件必须是<b>货真价实的 bool</b>——写 <code class="ic">if 1 {}</code> 直接编译不过(这条马上有改错题伺候)</li>
  </ul>

  <div class="exslot" data-ex="t2-1"></div>
  <div class="exslot" data-ex="t2-2"></div>

  <h3 class="sec-title">动手:奇偶判断</h3>
  <div class="note">
    <h4>🐹 取余运算 %</h4>
    <p><code class="ic">n % 2</code> 读作「n 除以 2 的余数」:余 0 是偶数,余 1 是奇数。这个小小的 <b>%</b> 在编程界的出场率极高——判断倍数、分组、循环轮换,全是它。</p>
  </div>
  <div class="exslot" data-ex="t2-3"></div>

  <h3 class="sec-title">for:重复干活(三种形态)</h3>
  <div class="gcode"><div class="gbar"><span>for 的三副面孔</span></div><pre><code>// 形态一:经典计数循环(三段式:起点;终点;步长)
for i := 1; i <= 3; i++ {
	fmt.Println("第", i, "圈")
}

// 形态二:条件循环(别的语言叫 while,Go 里还是 for)
n := 1
for n <= 3 {
	fmt.Println(n)
	n++
}

// 形态三:无限循环(死循环,靠 break 逃生)
for {
	fmt.Println("跑")
	break        // 立刻跳出去
}</code></pre></div>
  <div class="note">
    <h4>🐹 三段式怎么读</h4>
    <p><code class="ic">for i := 1; i <= 3; i++</code> = 「i 从 1 出发,<b>只要</b> i ≤ 3 就转一圈,每圈结束 i 加 1」。<code class="ic">i++</code> 是 i = i + 1 的缩写。还有两个关键词随时待命:<b>break</b> 立刻跳出不转了,<b>continue</b> 跳过这一圈剩下的、直接进下一圈。</p>
  </div>

  <div class="exslot" data-ex="t2-4"></div>
  <div class="exslot" data-ex="t2-5"></div>

  <h3 class="sec-title">switch:一路分拣</h3>
  <div class="gcode"><div class="gbar"><span>switch 的长相</span></div><pre><code>day := 3

switch day {
case 1, 2, 3, 4, 5:        // 一个 case 可以管多个值!
	fmt.Println("工作日")
case 6, 7:
	fmt.Println("周末")
default:                   // 谁都没接住,它兜底
	fmt.Println("外星日")
}</code></pre></div>
  <p>Go 的 switch 有个贴心规矩:<b>匹配进一个 case,干完活自动收工</b>,不会掉进下一个 case——想故意往下掉,得明写 <code class="ic">fallthrough</code>。所以不用在每个 case 尾部写一排 break。</p>

  <div class="exslot" data-ex="t2-6"></div>
  <div class="exslot" data-ex="t2-7"></div>
  <div class="exslot" data-ex="t2-8"></div>

  <h3 class="sec-title">🎯 专题二 · 结尾大作业(3 个)</h3>
  <p>三关连击:乘法表、成绩评级、Go地鼠报数。骨架已备好,直接往 main 里写。</p>
  <div class="exslot" data-ex="t2-b1"></div>
  <div class="exslot" data-ex="t2-b2"></div>
  <div class="exslot" data-ex="t2-b3"></div>

  <div class="takeaway">
    <div class="tk-title">🐹 专题二心法</div>
    <ul>
      <li>if 不套括号、条件必须是 bool;for 包办一切循环(三段式/条件式/无限式)</li>
      <li>break 逃生,continue 跳圈;switch 自动收工,case 能管多个值</li>
      <li>判断倍数用 %;Go 编译器会亲自抓出没用过的变量</li>
    </ul>
  </div>`,

  exercises: [
    {
      id: "t2-1", kind: "predict", xp: 10, title: "及格了吗?",
      task: `75 分过线吗?<span class="hl">打印出来的是什么?</span>`,
      given: "grade := 75\n\nif grade >= 60 {\n\tfmt.Println(\"及格\")\n} else {\n\tfmt.Println(\"再接再厉\")\n}",
      expected: "及格",
      ref: "grade := 75\n\nif grade >= 60 {\n\tfmt.Println(\"及格\")   // 75 >= 60 成立,走这\n} else {\n\tfmt.Println(\"再接再厉\")\n}",
      refNote: "条件成立走 if 分支,else 分支根本不看。程序的世界里没有「都行」——永远只走一条路。",
    },
    {
      id: "t2-2", kind: "blank", xp: 10, mini: true, title: "补全判断条件",
      task: `程序想判断成年(≥18 岁),条件空着。<span class="hl">把 if 与左花括号之间的条件写出来</span>(20 岁应该能进去)。`,
      given: "age := 20\n\nif ____ {\n\tfmt.Println(\"已成年\")\n}",
      placeholder: "拿 age 和 18 比较…",
      checks: [
        { label: "条件是 age >= 18", hint: "「大于等于」写作 >=,两个符号连着。", test: (s) => /age\s*>=\s*18\b/.test(s) },
      ],
      ref: "age >= 18",
      refNote: ">= 读作「大于等于」。注意 Go 的 if 条件外面不套小括号——直接 if + 条件 + 大括号。",
    },
    {
      id: "t2-3", kind: "write", xp: 10, title: "动手写:奇偶判断",
      task: `写完整程序:<code class="ic">n := 7</code>,判断它是奇数还是偶数——<b>偶数打印「偶数」,否则打印「奇数」</b>。用取余 <code class="ic">%</code> 和 <code class="ic">if / else</code>。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tn := 7\n\n\t// 判断奇偶并打印\n\n}",
      checks: [
        { label: "用了取余 %", hint: "n % 2 是 n 除以 2 的余数。", test: (s) => /%/.test(s) },
        { label: "余数和 0 做了比较", hint: "if n%2 == 0 —— 注意是两个等号(比较),不是一个(赋值)。", test: (s) => /%[^=]*==\s*0/.test(s) || /==\s*0/.test(s) },
        { label: "有 else 分支", hint: "偶数走 if,奇数走 else。", test: (s) => /\belse\b/.test(s) },
        { label: "两个分支都打印了", hint: "if 里 Println(\"偶数\"),else 里 Println(\"奇数\")。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tn := 7\n\n\tif n%2 == 0 {\n\t\tfmt.Println(\"偶数\")\n\t} else {\n\t\tfmt.Println(\"奇数\")\n\t}\n}",
      refNote: "7 % 2 = 1(不是 0),走 else,打印「奇数」。改成 n := 8 再真跑一次,自己验证两条路都通。",
    },
    {
      id: "t2-4", kind: "predict", xp: 10, title: "循环累加",
      task: `循环跑完,sum 是多少?<span class="hl">打印出来的数打出来。</span>`,
      given: "sum := 0\n\nfor i := 1; i <= 5; i++ {\n\tsum += i\n}\n\nfmt.Println(sum)",
      expected: "15",
      ref: "sum := 0\n\nfor i := 1; i <= 5; i++ {\n\tsum += i    // sum += i 是 sum = sum + i 的缩写\n}\n\nfmt.Println(sum)   // 1+2+3+4+5 = 15",
      refNote: "i 依次是 1、2、3、4、5,每次都加进 sum。+= 是「加到自家身上」的缩写,循环里出场率极高。",
    },
    {
      id: "t2-5", kind: "blank", xp: 10, mini: true, title: "补全循环三段式",
      task: `循环要转 3 圈,三段式(起点;终点;步长)空着。<span class="hl">把 for 与左花括号之间的三段写出来</span>,用分号隔开。`,
      given: "for ____ {\n\tfmt.Println(\"第\", i, \"圈\")\n}",
      placeholder: "起点; 终点; 步长",
      checks: [
        { label: "起点 i 从 1 开始", hint: "第一段:i := 1", test: (s) => /i\s*:=\s*1/.test(s) },
        { label: "终点是 i <= 3", hint: "第二段:只要 i ≤ 3 就转。", test: (s) => /i\s*<=\s*3/.test(s) },
        { label: "步长是 i++", hint: "第三段:每圈 i 加 1。", test: (s) => /i\+\+/.test(s) },
      ],
      ref: "i := 1; i <= 3; i++",
      refNote: "三段用分号隔开:从哪开始;到哪为止;每圈干啥。这是 Go 里最常见的一行,多写两次就顺嘴了。",
    },
    {
      id: "t2-6", kind: "fix", xp: 10, title: "修好这个 if",
      task: `这段代码编译不过。编译器说得很清楚了,读一遍报错,然后<span class="hl">只把修正后的那行(if 开头到大括号)打出来</span>。`,
      given: "x := 5\nif x = 10 {\n\tfmt.Println(\"十\")\n}",
      errText: "non-boolean condition in if statement",
      scaffold: "x := 5\nif x = 10 {\n\tfmt.Println(\"十\")\n}",
      checks: [
        { label: "赋值改成了比较(==)", hint: "一个 = 是赋值,两个 == 才是比较。if 后面要的是「真假」,不是「赋值」。", test: (s) => /if\s+x\s*==\s*10/.test(s) },
        { label: "不再出现单个 = 的赋值条件", hint: "if x = 10 这种写法整个删掉。", test: (s) => !/x\s*=[^=]/.test(s) },
      ],
      replaceLine: "if x = 10 {",
      ref: "if x == 10 {",
      refNote: "Go 在这上面特别严:if 的条件必须是 bool 值。x = 10 是「把 10 塞给 x」,不是「x 是不是 10」。想比较,就写两个等号。这个错误改过一次,终身免疫。",
    },
    {
      id: "t2-7", kind: "predict", xp: 10, title: "switch 分拣",
      task: `day 是 3,switch 会接住它?<span class="hl">打印什么?</span>`,
      given: "day := 3\n\nswitch day {\ncase 1, 2, 3, 4, 5:\n\tfmt.Println(\"工作日\")\ncase 6, 7:\n\tfmt.Println(\"周末\")\ndefault:\n\tfmt.Println(\"外星日\")\n}",
      expected: "工作日",
      ref: "day := 3\n\nswitch day {\ncase 1, 2, 3, 4, 5:        // 3 落在这支,接住!\n\tfmt.Println(\"工作日\")\ncase 6, 7:\n\tfmt.Println(\"周末\")\ndefault:\n\tfmt.Println(\"外星日\")\n}",
      refNote: "一个 case 管一串值,3 被「1, 2, 3, 4, 5」接住,打印完自动收工——后面的 case 看都不看。",
    },
    {
      id: "t2-8", kind: "fix", xp: 10, title: "编译器的强迫症:没用的变量",
      task: `这段代码编译不过——不是语法错,是 Go 的著名强迫症:<b>声明了的变量必须用</b>。两种修法任选:①把 name 用起来(打印时带上它);②干脆删掉声明。<span class="hl">把修好的完整代码打出来</span>。`,
      given: "name := \"小地鼠\"\nfmt.Println(\"你好!\")",
      errText: "declared and not used: name",
      scaffold: "name := \"小地鼠\"\nfmt.Println(\"你好!\")",
      checks: [
        { label: "name 被用上了(或删掉了声明)", hint: "最简单:改成 fmt.Println(\"你好,\", name)——或者把 name := 那行整行删掉。", test: (s) => !/\bname\s*:=/.test(s) || /fmt\.Print(ln|f)\s*\([^)]*name/.test(s) },
        { label: "程序还在正常打印", hint: "无论哪种修法,Println 都得活着。", test: (s) => /fmt\.Print(ln|f)\s*\(/.test(s) },
      ],
      ref: "// 修法一:用起来\nname := \"小地鼠\"\nfmt.Println(\"你好,\", name)\n\n// 修法二:删干净\nfmt.Println(\"你好!\")",
      refNote: "Go 编译器是个严格的管家:开了盒子就得用,不用就别开。这条强迫症让 Go 代码很少留垃圾——你现在觉得烦,三个月后会回来谢它。",
    },

    /* ── 大作业 ── */
    {
      id: "t2-b1", kind: "big", xp: 30, title: "大作业① 九九表第一行",
      task: `用循环打印乘法表第一行,共 9 个式子,每行一个,长这样:<br><code>1×1=1</code><br><code>1×2=2</code><br><code>…直到 1×9=9</code><br>要求:用 for 循环 + <code class="ic">fmt.Printf</code>(格式串用 %d)。`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// for 循环 1 到 9,每次 Printf 一行\n\n}",
      checks: [
        { label: "用了 for 循环", hint: "for i := 1; i <= 9; i++ { … }", test: (s) => /\bfor\b/.test(s) },
        { label: "循环从 1 跑到 9", hint: "三段式:i := 1; i <= 9; i++", test: (s) => /:=\s*1/.test(s) && /<=\s*9/.test(s) },
        { label: "在循环里用了 Printf", hint: "把 Printf 写进 for 的大括号里。", test: (s) => /for[\s\S]*fmt\.Printf\s*\(/.test(s) },
        { label: "格式串里有 %d", hint: "fmt.Printf(\"1×%d=%d\\n\", i, i) ——两个 %d 分别接 i 和 i。", test: (s) => (s.match(/%d/g) || []).length >= 2 },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfor i := 1; i <= 9; i++ {\n\t\tfmt.Printf(\"1×%d=%d\\n\", i, i)\n\t}\n}",
      refNote: "同一个格式串放两个 %d,两个 i 依次填进去。想挑战完整九九表?套两层循环:外层管第一个乘数,内层管第二个——练完这一关你就是「循环骑士」。",
    },
    {
      id: "t2-b2", kind: "big", xp: 30, title: "大作业② 成绩等级评定",
      task: `<code class="ic">score := 87</code>,用 <b>if / else if / else</b> 链评级并打印:<br>≥90 → <code>A 优秀</code>;≥80 → <code>B 良好</code>;≥70 → <code>C 中等</code>;≥60 → <code>D 及格</code>;再低 → <code>不及格</code>。<br>(87 应该打 <b>B 良好</b>——写完真跑验证!)`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tscore := 87\n\n\t// if / else if / else 链:五个分支\n\n}",
      checks: [
        { label: "用了 else if 链", hint: "if … {} else if … {} else if … {} else {} ——至少三段 else if。", test: (s) => (s.match(/else\s+if/g) || []).length >= 3 },
        { label: "条件用 >= 比较", hint: "score >= 90、score >= 80 这样从高往低排。", test: (s) => (s.match(/>=/g) || []).length >= 4 },
        { label: "五个分支都有打印", hint: "A/B/C/D/不及格,每支一个 Println。", test: (s) => (s.match(/fmt\.Print(ln|f)\s*\(/g) || []).length >= 5 },
        { label: "最后的 else 兜底", hint: "链尾要有 else {} 接住不及格。", test: (s) => /\belse\s*\{/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tscore := 87\n\n\tif score >= 90 {\n\t\tfmt.Println(\"A 优秀\")\n\t} else if score >= 80 {\n\t\tfmt.Println(\"B 良好\")\n\t} else if score >= 70 {\n\t\tfmt.Println(\"C 中等\")\n\t} else if score >= 60 {\n\t\tfmt.Println(\"D 及格\")\n\t} else {\n\t\tfmt.Println(\"不及格\")\n\t}\n}",
      refNote: "条件从高往低排,先到先得:87 够不到 90,但够到 80,进 B 分支,后面的分支全部跳过。把 score 改成 59、95 真跑几遍,五条路都走一走。",
    },
    {
      id: "t2-b3", kind: "big", xp: 30, title: "大作业③ Go地鼠报数",
      task: `从 1 数到 15,遇到特殊数字要变着喊:<br>③ 的倍数喊 <code>Go</code>;⑤ 的倍数喊 <code>地鼠</code>;既是 3 又是 5 的倍数(比如 15)喊 <code>Go地鼠</code>;其他原样打数字。<br>(小提示:先判 15 的情况,不然它会被 3 的分支抢走——想通为什么,这题就通了。)`,
      scaffold: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// for 1 到 15 + if / else if 链\n\n}",
      checks: [
        { label: "循环跑到了 15", hint: "for i := 1; i <= 15; i++", test: (s) => /\bfor\b/.test(s) && /15/.test(s) },
        { label: "用了 % 3 和 % 5 判倍数", hint: "i%3 == 0、i%5 == 0——取余判倍数。", test: (s) => /%\s*3/.test(s) && /%\s*5/.test(s) },
        { label: "先处理了「既是 3 又是 5」的情况", hint: "if i%3 == 0 && i%5 == 0 { … } 放链头。&& 表示「并且」。(另一种写法:i%15 == 0 也行。)", test: (s) => /&&\s*[^%]*%\s*5/.test(s) || /%\s*15/.test(s) },
        { label: "有 else 分支打数字", hint: "链尾 else { fmt.Println(i) } 原样报数。", test: (s) => /else\s*\{[\s\S]*fmt\.Print(ln|f)\s*\(\s*i/.test(s) },
      ],
      ref: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfor i := 1; i <= 15; i++ {\n\t\tif i%3 == 0 && i%5 == 0 {\n\t\t\tfmt.Println(\"Go地鼠\")\n\t\t} else if i%3 == 0 {\n\t\t\tfmt.Println(\"Go\")\n\t\t} else if i%5 == 0 {\n\t\t\tfmt.Println(\"地鼠\")\n\t\t} else {\n\t\t\tfmt.Println(i)\n\t\t}\n\t}\n}",
      refNote: "15 是 3 的倍数,如果先判 3,15 会喊「Go」而不是「Go地鼠」——所以「最大公约」的判断必须排链头。&& 读作「并且」,两边同时成立才进。这题是流程控制的毕业考,你过了。",
    },
  ],
});

})();
