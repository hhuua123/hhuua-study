/* ═══════════════════════════ Go 训练场 · 交互装置 ═══════════════════════════ */
window.GO_WIDGETS = (() => {
"use strict";

const HEADS = {
  iota:   ["🧮 装置 · iota 演算器", "一行行演算 const,亲眼看 iota 怎么自动 +1"],
  slicer: ["🍰 装置 · 切片切割台", "拖动滑杆切一刀,实时看取景框、len 和 cap"],
  race:   ["⚔️ 装置 · 竞态现场", "无锁 vs 加锁各跑十轮,亲眼看数据怎么丢的"],
};

/* ══════════ 装置一:iota 演算器 ══════════ */
function buildIota(body) {
  const PRESETS = {
    week: {
      name: "星期枚举",
      rows: [
        { code: "const (", note: "", badge: "", plain: true },
        { code: "    Sunday = iota     // iota 从 0 起跳", note: "第一行:iota 的值是 0,直接给 Sunday", badge: "0" },
        { code: "    Monday            // 没写表达式?", note: "自动继承上一行,换汤不换药:iota 变 1", badge: "1" },
        { code: "    Tuesday           // 又没写?", note: "继续继承:iota 变 2", badge: "2" },
        { code: "    Wednesday         // …", note: "iota 变 3——每过一行,自己 +1", badge: "3" },
        { code: ")", note: "", badge: "", plain: true },
      ],
    },
    size: {
      name: "容量枚举(表达式复用)",
      rows: [
        { code: "const (", note: "", badge: "", plain: true },
        { code: "    _  = iota              // 第 0 行", note: "用 _ 丢掉 0——列表常从 1 起跳时的小技巧", badge: "0(丢弃)" },
        { code: "    KB = 1 << (10 * iota)  // 表达式也能用 iota", note: "第 1 行:1 << 10", badge: "1024" },
        { code: "    MB = 1 << (10 * iota)  // 同一个表达式,iota 自动变", note: "第 2 行:1 << 20", badge: "1048576" },
        { code: "    GB = 1 << (10 * iota)  // …", note: "第 3 行:1 << 30", badge: "1073741824" },
        { code: ")", note: "", badge: "", plain: true },
      ],
    },
  };

  body.innerHTML = `
    <div style="margin-bottom:8px">
      <button class="wgbtn ghost it-pre" data-p="week">星期枚举</button>
      <button class="wgbtn ghost it-pre" data-p="size">容量枚举</button>
    </div>
    <div class="gcode"><pre><code id="itCode" style="white-space:pre"></code></pre></div>
    <div style="margin-top:10px">
      <button class="wgbtn" id="itStep">▶ 演算下一行</button>
      <button class="wgbtn ghost" id="itReset">↺ 重置</button>
    </div>
    <div class="wgmsg" id="itMsg"></div>`;

  let cur = "week", pos = -1;
  const rowsEl = () => [...body.querySelectorAll(".it-row")];

  function render() {
    const rows = PRESETS[cur].rows;
    body.querySelector("#itCode").innerHTML = rows.map((r, i) =>
      `<div class="it-row ${r.plain ? "" : ""}" data-i="${i}">
         <span class="it-badge hide">${r.plain ? "—" : r.badge}</span>
         <span>${r.code}</span>
       </div>`).join("");
    pos = -1;
    body.querySelector("#itMsg").textContent = "";
    body.querySelectorAll(".it-pre").forEach((b) => {
      b.classList.toggle("ghost", b.dataset.p !== cur);
    });
  }

  function step() {
    const rows = PRESETS[cur].rows.filter((r) => !r.plain);
    const total = rows.length;
    if (pos >= total - 1) {
      body.querySelector("#itMsg").textContent = "🎉 演算完毕:iota 在每个 const 行自动 +1,一行都不用你管。";
      return;
    }
    pos++;
    const realIdx = PRESETS[cur].rows.findIndex((r, i) => !r.plain && PRESETS[cur].rows.slice(0, i + 1).filter(x => !x.plain).length === pos + 1);
    const row = rowsEl()[realIdx];
    rowsEl().forEach((r, i) => {
      r.classList.toggle("on", i === realIdx);
      if (i < realIdx) r.classList.add("done");
    });
    row.querySelector(".it-badge").classList.remove("hide");
    body.querySelector("#itMsg").textContent = `第 ${pos + 1} 行:${PRESETS[cur].rows[realIdx].note}`;
  }

  body.querySelectorAll(".it-pre").forEach((b) => {
    b.addEventListener("click", () => { cur = b.dataset.p; render(); });
  });
  body.querySelector("#itStep").addEventListener("click", step);
  body.querySelector("#itReset").addEventListener("click", render);
  render();
}

/* ══════════ 装置二:切片切割台 ══════════ */
function buildSlicer(body) {
  const nums = [10, 20, 30, 40, 50, 60, 70, 80];
  const N = nums.length;

  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:4px">底层数组 <code class="ic">nums</code> 有 8 个元素。拖滑杆切一刀 <code class="ic">nums[起:止]</code>(含头不含尾),看窗户框住了谁。</p>
    <div class="wg-row"><label for="slA">起 start</label><input type="range" class="wgs" id="slA" min="0" max="${N}" value="2"><output id="slAO">2</output></div>
    <div class="wg-row"><label for="slB">止 end</label><input type="range" class="wgs" id="slB" min="0" max="${N}" value="5"><output id="slBO">5</output></div>
    <div class="sl-boxes" id="slBoxes"></div>
    <div style="margin-top:6px">
      <button class="wgbtn ghost sl-pre" data-a="0" data-b="3">[0:3]</button>
      <button class="wgbtn ghost sl-pre" data-a="2" data-b="5">[2:5]</button>
      <button class="wgbtn ghost sl-pre" data-a="4" data-b="8">[4:8]</button>
    </div>
    <div class="sl-info" id="slInfo"></div>`;

  const aEl = body.querySelector("#slA"), bEl = body.querySelector("#slB");

  function update(event) {
    let a = parseInt(aEl.value, 10), b = parseInt(bEl.value, 10);
    if (b < a) {
      if (event?.target === bEl) a = b;
      else b = a;
    }
    aEl.value = a;
    bEl.value = b;
    body.querySelector("#slAO").textContent = a;
    body.querySelector("#slBO").textContent = b;
    body.querySelector("#slBoxes").innerHTML = nums.map((v, i) => `
      <div class="sl-box ${i >= a && i < b ? "sel" : ""}">
        <span class="v">${v}</span>
        <span class="i">[${i}]</span>
      </div>`).join("");
    const len = b - a;
    const cap = N - a;
    const elems = nums.slice(a, b).join(" ");
    const detail = len ? `s[0] 对应 nums[${a}]，修改元素会反映到底层数组。` : "空切片没有第一个元素。";
    body.querySelector("#slInfo").innerHTML =
      `s := nums[${a}:${b}]   →   s = [${elems}]<br>` +
      `len(s) = <b>${len}</b>   ·   cap(s) = <b>${cap}</b>(从 ${a} 一直到底层数组末尾)<br>` +
      `<span style="font-family:inherit;color:var(--muted)">${detail}</span>`;
  }

  aEl.addEventListener("input", update);
  bEl.addEventListener("input", update);
  body.querySelectorAll(".sl-pre").forEach((btn) => {
    btn.addEventListener("click", () => {
      aEl.value = btn.dataset.a; bEl.value = btn.dataset.b;
      update();
    });
  });
  update();
}

/* ══════════ 装置三:竞态现场 ══════════ */
function buildRace(body) {
  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:8px">两只小地鼠同时给 <code class="ic">count++</code>。左栏<b>不锁</b>:俩人都读到了同一个旧值,一次加法凭空消失;右栏<b>上锁</b>:一次只进一个。各跑 10 轮,看战报。</p>
    <div class="rc-grid">
      <div class="rc-panel bad">
        <div class="ph">❌ 无锁版(裸奔 ++)</div>
        <div class="rc-log" id="rcBad"></div>
        <div class="rc-tally" id="rcBadT">待命</div>
      </div>
      <div class="rc-panel good">
        <div class="ph">✅ 加锁版(Mutex)</div>
        <div class="rc-log" id="rcGood"></div>
        <div class="rc-tally" id="rcGoodT">待命</div>
      </div>
    </div>
    <div style="margin-top:10px">
      <button class="wgbtn" id="rcRun">▶ 各跑 10 轮</button>
      <button class="wgbtn ghost" id="rcReset">↺ 清空战报</button>
    </div>
    <div class="wgmsg" id="rcMsg"></div>`;

  const badLog = body.querySelector("#rcBad"), goodLog = body.querySelector("#rcGood");
  let timer = null;

  function reset() {
    clearInterval(timer);
    badLog.innerHTML = goodLog.innerHTML = "";
    body.querySelector("#rcBadT").textContent = "待命";
    body.querySelector("#rcGoodT").textContent = "待命";
    body.querySelector("#rcMsg").textContent = "";
  }

  function line(log, html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function run() {
    reset();
    let bad = 0, good = 0, lost = 0, round = 0;
    body.querySelector("#rcMsg").textContent = "跑动中……";
    timer = setInterval(() => {
      round++;
      if (round > 10) {
        clearInterval(timer);
        body.querySelector("#rcBadT").textContent = `10 轮丢了 ${lost} 次 → count = ${bad} / 20`;
        body.querySelector("#rcGoodT").textContent = `稳稳的 10 轮 → count = ${good} / 20`;
        body.querySelector("#rcMsg").textContent = lost > 0
          ? `无锁版丢了 ${lost} 次加法!这就是「竞态」:逻辑全对,结果不对。真实程序里,这类 bug 藏得更深——go run -race 专抓它。`
          : "这轮侥幸全中?再跑几次,无锁版早晚会丢——竞态就是这样:不出事是运气,出事是必然。";
        return;
      }
      // 无锁:40% 概率撞车(双方读到同一个旧值)
      if (Math.random() < 0.4) {
        line(badLog, `第${round}轮 1号读${bad}→写${bad + 1} ‖ 2号读${bad}→写${bad + 1} <span class="bad">❌丢一次</span>`);
        bad += 1; lost += 1;
      } else {
        bad += 2;
        line(badLog, `第${round}轮 1号读${bad - 2}→写${bad - 1} ‖ 2号读${bad - 1}→写${bad} <span class="dim">(没撞,纯属走运)</span>`);
      }
      // 加锁:串行,永不丢
      good += 2;
      line(goodLog, `第${round}轮 <span class="lock">1号🔒${good - 2}→${good - 1}</span> ‖ <span class="lock">2号🔒${good - 1}→${good}</span> ✓`);
    }, 260);
  }

  body.querySelector("#rcRun").addEventListener("click", run);
  body.querySelector("#rcReset").addEventListener("click", reset);
}

/* ══════════ 总装 ══════════ */
const BUILDERS = { iota: buildIota, slicer: buildSlicer, race: buildRace };

function init() {
  document.querySelectorAll("[data-wg]").forEach((slot) => {
    const t = slot.dataset.wg;
    if (!BUILDERS[t]) return;
    const [name, sub] = HEADS[t];
    const el = document.createElement("div");
    el.className = "wg";
    el.innerHTML = `<div class="wg-head"><span class="wname">${name}</span><span class="wsub">${sub}</span></div><div class="wg-body"></div>`;
    slot.appendChild(el);
    try {
      BUILDERS[t](el.querySelector(".wg-body"));
    } catch (e) {
      el.querySelector(".wg-body").innerHTML = `<p style="color:var(--bad)">装置故障:${e.message}</p>`;
    }
  });
}

return { init };
})();
