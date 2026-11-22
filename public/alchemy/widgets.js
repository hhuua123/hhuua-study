/* ═══════════════════════════ 炼丹修行录 · 七座丹炉装置 ═══════════════════════════ */
window.ALCHEMY_WIDGETS = (() => {
"use strict";

const HEADS = {
  neuron:     ["🧪 装置一 · 神经元打分器", "亲手拨动权重,看一个神经元如何举牌"],
  descent:    ["🏔 装置二 · 蒙眼下山", "亲手体验「梯度下降」,顺便掉进一个坑"],
  tokenizer:  ["✂️ 装置三 · 切香肠机", "粘贴文字,看模型眼里的 token 长什么样"],
  temperature:["🎲 装置四 · 温度抽签", "同一句话,不同温度,亲眼看出模型的「性格」"],
  attention:  ["🔦 装置五 · 注意力之眼", "点句中任意词,看它的注意力射向谁"],
  scaling:    ["📈 装置六 · 缩放天梯", "拖动参数量,看能力何时突然起飞"],
  cot:        ["💭 装置七 · 丹纹对照炉", "同一道题:直答 vs 一步一步想"],
};

const builders = {};

/* ══════════ 装置一:神经元 ══════════ */
builders.neuron = (body) => {
  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:12px">评委任务:判断一块西瓜<b>甜不甜</b>。三个线索各打分(0~10),每个线索的「偏好程度」就是权重。总分 = 加权求和 + 偏置(评委的底分),过 0 就举牌开火。</p>
    <div class="wgt-slider"><label>敲声清脆度</label><input type="range" min="0" max="10" step="0.5" value="7" data-nr="x0"><output>7.0</output></div>
    <div class="wgt-slider"><label>蒂蒂新鲜度</label><input type="range" min="0" max="10" step="0.5" value="5" data-nr="x1"><output>5.0</output></div>
    <div class="wgt-slider"><label>纹路清晰度</label><input type="range" min="0" max="10" step="0.5" value="9" data-nr="x2"><output>9.0</output></div>
    <p style="font-size:13px;color:var(--faint);margin:14px 0 2px">▼ 下面是评委的「偏好」(权重)与底分(偏置)——真正训练时,这些数会被自动学习调整:</p>
    <div class="wgt-slider"><label>偏好·敲声</label><input type="range" min="0" max="1.5" step="0.1" value="0.8" data-nr="w0"><output>0.8</output></div>
    <div class="wgt-slider"><label>偏好·蒂蒂</label><input type="range" min="0" max="1.5" step="0.1" value="0.5" data-nr="w1"><output>0.5</output></div>
    <div class="wgt-slider"><label>偏好·纹路</label><input type="range" min="0" max="1.5" step="0.1" value="1.2" data-nr="w2"><output>1.2</output></div>
    <div class="wgt-slider"><label>底分·偏置</label><input type="range" min="-3" max="3" step="0.5" value="-1" data-nr="b"><output>-1.0</output></div>
    <div class="nr-formula" id="nrF"></div>
    <div class="nr-result">
      <div class="nr-fire" id="nrFire">🔥</div>
      <div class="nr-verdict" id="nrV"></div>
    </div>`;

  const inputs = body.querySelectorAll("[data-nr]");
  const get = (k) => parseFloat(body.querySelector(`[data-nr="${k}"]`).value);
  const fmt = (n) => n.toFixed(1);

  function update() {
    const x = [get("x0"), get("x1"), get("x2")];
    const w = [get("w0"), get("w1"), get("w2")];
    const b = get("b");
    const terms = x.map((xi, i) => `${fmt(w[i])}×${fmt(xi)}`).join(" + ");
    const sum = x[0]*w[0] + x[1]*w[1] + x[2]*w[2] + b;
    body.querySelector("#nrF").innerHTML =
      `加权求和: ${terms} ${b >= 0 ? "+" : "−"} ${fmt(Math.abs(b))} = <b>${sum.toFixed(2)}</b><br>` +
      `激活判断: ${sum.toFixed(2)} ${sum > 0 ? "&gt;" : "≤"} 0 → ${sum > 0 ? "举牌开火 🔥" : "闭目不语 🌑"}`;
    const fire = body.querySelector("#nrFire");
    fire.classList.toggle("lit", sum > 0);
    body.querySelector("#nrV").innerHTML = sum > 0
      ? `<b>判定:甜!</b>(总分过线,评委举牌)`
      : `<b>判定:存疑…</b>(总分没过线,评委不举)`;
  }
  inputs.forEach((inp) => {
    inp.addEventListener("input", (e) => {
      e.target.nextElementSibling.textContent = parseFloat(e.target.value).toFixed(1);
      update();
    });
  });
  update();
};

/* ══════════ 装置二:蒙眼下山 ══════════ */
builders.descent = (body) => {
  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:12px">蒙眼下山:你只能用脚<b>感受脚下的坡度</b>(损失随位置改变的快慢),选择往下走的一步。目标:找到最深的谷底(全局最优)。先手动走几步,再试试「自动下山」。</p>
    <div class="des-canvas-wrap"><canvas id="dsCv" width="720" height="240"></canvas></div>
    <div style="margin-top:10px">
      <button class="wgt-btn" id="dsL">⬅ 向左一步</button>
      <button class="wgt-btn" id="dsR">➡ 向右一步</button>
      <button class="wgt-btn ghost" id="dsAuto">🧭 自动下山(梯度下降)</button>
      <button class="wgt-btn ghost" id="dsJump">🔀 换个位置重开炉</button>
      <button class="wgt-btn ghost" id="dsReset">↺ 重置</button>
    </div>
    <div class="des-status">当前位置(参数):<b id="dsX">60</b> · 损失值(海拔):<b id="dsH">-</b> · 坡度:<b id="dsS">-</b> · 步数:<b id="dsN">0</b></div>
    <div class="des-msg" id="dsMsg"></div>`;

  const W = 720, H = 240, GROUND = H - 18;
  const g = (x, c, w) => Math.exp(-((x - c) ** 2) / (2 * w * w));
  // 基线向右缓降(保证起点右侧是下坡),叠加一个浅坑(局部最优 205)和一个深谷(全局最优 480)
  const f = (x) => 168 - 0.045 * x - 70 * g(x, 480, 55) - 26 * g(x, 205, 26);
  const slope = (x) => (f(x + 1.5) - f(x - 1.5)) / 3;
  const LOCAL = 205, GLOBAL = 480;

  const cv = body.querySelector("#dsCv");
  const ctx = cv.getContext("2d");
  let px = 60, steps = 0, msg = body.querySelector("#dsMsg");

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // 地形
    ctx.beginPath(); ctx.moveTo(0, GROUND);
    for (let x = 0; x <= W; x += 2) ctx.lineTo(x, f(x));
    ctx.lineTo(W, GROUND); ctx.closePath();
    const grad = ctx.createLinearGradient(0, 40, 0, GROUND);
    grad.addColorStop(0, "rgba(240,112,63,.24)");
    grad.addColorStop(1, "rgba(60,44,28,.55)");
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = "#e2b04a"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) { x === 0 ? ctx.moveTo(x, f(x)) : ctx.lineTo(x, f(x)); }
    ctx.stroke();
    // 谷底标记
    ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "rgba(224,98,72,.95)";
    ctx.fillText("局部小坑(局部最优)", LOCAL, f(LOCAL) + 22);
    ctx.fillStyle = "rgba(127,200,169,.95)";
    ctx.fillText("最深谷底(全局最优)", GLOBAL, f(GLOBAL) + 22);
    // 玩家
    ctx.beginPath();
    ctx.arc(px, f(px) - 9, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#fff2df"; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = "#d94f24"; ctx.stroke();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#fff2df"; ctx.fillText("🧙".length ? "你" : "", px, f(px) - 22);
  }

  function readout() {
    body.querySelector("#dsX").textContent = Math.round(px);
    body.querySelector("#dsH").textContent = f(px).toFixed(1);
    const s = slope(px);
    body.querySelector("#dsS").textContent = (s >= 0 ? "+" : "") + s.toFixed(2) + (Math.abs(s) < 0.05 ? "(平地)" : s < 0 ? "(下坡向右)" : "(下坡向左)");
    body.querySelector("#dsN").textContent = steps;
  }

  function judge() {
    if (Math.abs(px - GLOBAL) < 12) {
      msg.textContent = "🏆 丹成!你找到了全局最优的谷底。";
      msg.style.color = "var(--herb)";
    } else if (Math.abs(px - LOCAL) < 10) {
      msg.textContent = "⚠️ 你卡在了局部小坑!四面都是上坡——梯度下降从这里永远出不去。点「重置」从别处再开一炉,或者读读下面的感悟。";
      msg.style.color = "var(--gold)";
    }
  }

  body.querySelector("#dsL").addEventListener("click", () => {
    steps++; px = Math.max(8, px - 8);
    const s = slope(px);
    if (s > 0.08) { msg.textContent = "👍 往左是下坡,损失在降,走对了。"; msg.style.color = "var(--herb)"; }
    else if (s < -0.08) { msg.textContent = "🤔 往左是上坡——你在往损失更高的地方走。"; msg.style.color = "var(--red-bad)"; }
    draw(); readout(); judge();
  });
  body.querySelector("#dsR").addEventListener("click", () => {
    steps++; px = Math.min(W - 8, px + 8);
    const s = slope(px);
    if (s < -0.08) { msg.textContent = "👍 往右是下坡,损失在降,走对了。"; msg.style.color = "var(--herb)"; }
    else if (s > 0.08) { msg.textContent = "🤔 往右是上坡——你在往损失更高的地方走。"; msg.style.color = "var(--red-bad)"; }
    draw(); readout(); judge();
  });

  let autoTimer = null;
  body.querySelector("#dsAuto").addEventListener("click", () => {
    clearInterval(autoTimer);
    msg.style.color = "var(--gold)";
    msg.textContent = "🧭 自动下山中:每步都走向「最陡下坡」…";
    autoTimer = setInterval(() => {
      const s = slope(px);
      const prev = px;
      if (Math.abs(s) < 0.03) {
        clearInterval(autoTimer);
        judge();
        if (Math.abs(px - LOCAL) < 12) {
          msg.textContent = "⚠️ 停了——但停在的是局部小坑!这就是梯度下降的死穴:每步都聪明,整体却被困。现实解法:多开几炉(随机换起点),或用更聪明的步长(学习率)。";
        } else if (Math.abs(px - GLOBAL) > 12) {
          msg.textContent = "脚下一马平川,可这里既不是谷底——坡度太小,推不动了。点「换个位置重开炉」换起点再试。";
        }
        return;
      }
      px = Math.max(8, Math.min(W - 8, px - s * 34));   // 学习率 34
      steps++;
      if (Math.abs(px - prev) < 0.01) {   // 撞墙保险丝:步子没挪动就停
        clearInterval(autoTimer);
        msg.textContent = "🛑 已到地图边缘。这个起点不适合下山——点「换个位置重开炉」再试。";
        return;
      }
      draw(); readout();
    }, 90);
  });
  body.querySelector("#dsJump").addEventListener("click", () => {
    clearInterval(autoTimer);
    px = px < 340 ? 590 : 60; steps = 0;
    msg.textContent = "🔀 换个起点重新开炉——「随机初始化」就是干这个的。";
    msg.style.color = "var(--gold)";
    draw(); readout();
  });
  body.querySelector("#dsReset").addEventListener("click", () => {
    clearInterval(autoTimer);
    px = 60; steps = 0;
    msg.textContent = "";
    draw(); readout();
  });

  draw(); readout();
};

/* ══════════ 装置三:token 切分 ══════════ */
builders.tokenizer = (body) => {
  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:10px">随便粘贴一句话,看它被切成哪些「块」。常用词整块带走,生僻词拆开拼。</p>
    <textarea class="tk-input" id="tkIn" maxlength="2000" aria-label="分词示例文本，最多两千字符">今天天气真不错,我们去公园散步吧</textarea>
    <div class="tk-presets">
      <button data-tk="今天天气真不错,我们去公园散步吧">中文日常</button>
      <button data-tk="Attention is all you need">英文金句</button>
      <button data-tk="unhappiness 的中文意思是不幸,attention 是注意力">中英混合</button>
    </div>
    <div class="tk-out" id="tkOut"></div>
    <div class="tk-count" id="tkCount"></div>
    <p style="font-size:12.5px;color:var(--faint);margin-top:8px">* 本装置是示意:真实模型的切分表(BPE)是训练前从海量文本统计学出来的,各家模型各不相同。</p>`;

  const DICT = new Set(["今天","天气","不错","我们","你们","公园","散步","注意","力量","神经","网络",
    "学习","思维","他们","什么","思考","一步","语言","模型","训练","数据","修行","炼丹","丹炉",
    "因为","所以","而且","但是","已经","现在","非常","真的","一起","可以","需要","这个","那个"]);
  const SUFFIX = ["tion","ness","ing","edly","ment","able","ful","less","s"];

  function tokenize(text) {
    const tokens = [];
    const parts = text.match(/[a-zA-Z0-9'’]+|[\u4e00-\u9fff]+|[^\s]/gu) || [];
    for (const part of parts) {
      if (/^[\u4e00-\u9fff]/.test(part)) {
        for (let i = 0; i < part.length; i++) {
          const pair = part.slice(i, i + 2);
          if (DICT.has(pair)) { tokens.push(pair); i++; }
          else tokens.push(part[i]);
        }
      } else tokens.push(...splitLatin(part));
    }
    return tokens;
  }

  function splitLatin(word) {
    const lower = word.toLowerCase();
    if (word.length <= 5) return [word];
    for (const suf of SUFFIX) {
      if (lower.endsWith(suf) && word.length - suf.length >= 3) {
        return [word.slice(0, word.length - suf.length), word.slice(-suf.length)];
      }
    }
    if (word.length >= 9) return [word.slice(0, 5), word.slice(5)];
    return [word];
  }

  const colors = ["c0","c1","c2","c3","c4","c5"];
  function render() {
    const text = body.querySelector("#tkIn").value;
    const toks = tokenize(text);
    const out = body.querySelector("#tkOut");
    out.replaceChildren(...toks.map((token, index) => {
      const chip = document.createElement("span");
      chip.className = "tk-chip " + colors[index % colors.length];
      chip.textContent = token;
      return chip;
    }));
    const chars = [...text].length;
    body.querySelector("#tkCount").textContent =
      toks.length ? `共 ${toks.length} 个 token(原始字符 ${chars} 个)——模型看到的不是「字」,是「块」` : "";
  }

  body.querySelector("#tkIn").addEventListener("input", render);
  body.querySelectorAll("[data-tk]").forEach((b) => {
    b.addEventListener("click", () => {
      body.querySelector("#tkIn").value = b.dataset.tk;
      render();
    });
  });
  render();
};

/* ══════════ 装置四:温度抽签 ══════════ */
builders.temperature = (body) => {
  const CANDS = [
    { w: "树梢",  logit: 3.0 },
    { w: "天上",  logit: 2.8 },
    { w: "窗前",  logit: 2.55 },
    { w: "天边",  logit: 2.2 },
    { w: "池塘里", logit: 1.7 },
    { w: "山尖上", logit: 1.2 },
    { w: "梦里",  logit: 0.4 },
  ];

  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:10px">模型读到:「夜深了,月亮挂在了__」。下面是它心中每个候选词的<b>概率分布</b>——拖动温度,看分布如何变化,再亲手抽签。</p>
    <div class="tm-sentence">🌙 夜深了,月亮挂在了 <b id="tmFill" style="color:var(--fire)">___</b></div>
    <div class="wgt-slider"><label>🌡 温度</label><input type="range" min="0.1" max="2" step="0.05" value="0.7" id="tmT"><output>0.70</output></div>
    <div class="tm-bars" id="tmBars"></div>
    <div>
      <button class="wgt-btn" id="tmDraw">🎲 抽一次签</button>
      <button class="wgt-btn ghost" id="tmDraw5">连抽五次</button>
    </div>
    <div class="tm-history" id="tmHist">尚无抽签记录。温度调到 0.2 试试,再调到 1.8 对比一下。</div>`;

  const slider = body.querySelector("#tmT");
  const output = slider.nextElementSibling;
  const barsEl = body.querySelector("#tmBars");
  const hist = body.querySelector("#tmHist");
  const fill = body.querySelector("#tmFill");
  let draws = [];

  function probs(T) {
    const ex = CANDS.map((c) => Math.exp(c.logit / T));
    const s = ex.reduce((a, b) => a + b, 0);
    return ex.map((e) => e / s);
  }

  function render() {
    const T = parseFloat(slider.value);
    output.textContent = T.toFixed(2);
    const p = probs(T);
    barsEl.innerHTML = CANDS.map((c, i) => `
      <div class="tm-row">
        <span class="tw">${c.w}</span>
        <div class="tbar"><i style="width:${(p[i] * 100).toFixed(1)}%"></i></div>
        <span class="tp">${(p[i] * 100).toFixed(1)}%</span>
      </div>`).join("");
  }

  function draw() {
    const T = parseFloat(slider.value);
    const p = probs(T);
    let r = Math.random(), pick = p.length - 1;
    for (let i = 0; i < p.length; i++) { r -= p[i]; if (r <= 0) { pick = i; break; } }
    draws.push(CANDS[pick].w);
    draws = draws.slice(-8);
    fill.textContent = draws[draws.length - 1];
    hist.innerHTML = `抽签记录:${draws.map((d) => `<b>${d}</b>`).join(" → ")}<br><span style="color:var(--faint);font-size:12.5px">温度 ${T.toFixed(2)}:${T < 0.4 ? "近乎必然,像复读机" : T < 1.1 ? "有主见,偶尔换换口味" : "彻底放飞,冷门词也有春天"}</span>`;
  }

  slider.addEventListener("input", render);
  body.querySelector("#tmDraw").addEventListener("click", draw);
  body.querySelector("#tmDraw5").addEventListener("click", () => {
    let n = 0;
    const t = setInterval(() => { draw(); if (++n >= 5) clearInterval(t); }, 260);
  });
  render();
};

/* ══════════ 装置五:注意力之眼 ══════════ */
builders.attention = (body) => {
  const TOKS = ["小猫", "追", "那只", "老鼠", ",", "因为", "它", "饿了"];
  // 手工设计的注意力(示意数值,每行和为 1)
  const M = {
    0: { 1: 0.42, 3: 0.26, 6: 0.14, 2: 0.10, 7: 0.08 },          // 小猫
    1: { 0: 0.55, 3: 0.35, 7: 0.06, 4: 0.04 },                    // 追
    2: { 3: 0.70, 1: 0.18, 0: 0.12 },                              // 那只
    3: { 1: 0.38, 2: 0.32, 0: 0.22, 6: 0.08 },                    // 老鼠
    4: { 5: 0.6, 4: 0.4 },                                        // ,
    5: { 6: 0.45, 7: 0.35, 3: 0.10, 0: 0.10 },                    // 因为
    6: { 0: 0.62, 3: 0.24, 7: 0.08, 1: 0.06 },                    // 它 ←- 重点
    7: { 6: 0.46, 3: 0.22, 0: 0.20, 1: 0.12 },                    // 饿了
  };
  const NOTES = {
    6: "看到「<b>它</b>了吗?模型把 62% 的注意力给了「<em>小猫</em>」——整句的重心。凭这种聚焦,模型才没把「它」误会成老鼠(是猫饿了,不是老鼠饿了)。",
    1: "动词「<b>追</b>是全局枢纽:谁追(小猫 55%)、追谁(老鼠 35%)。动词总在找自己的主语和宾语。",
    7: "「<b>饿了</b>回头看:谁饿?(它 46%)——而「它」又指向小猫。注意力会连成推理链。",
    0: "「<b>小猫</b>作为主角,受到「追」「它」「饿了」的广泛关注——这就是当主角的感觉。",
    3: "「<b>老鼠</b>:被追(追 38%)、被指(它 24%)。配角也有戏份。",
    5: "「<b>因为</b>在找原因从句:它(45%)和饿了(35%)。因果词是注意力活跃的中转站。",
  };

  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:6px">点击句中任意词,看它的「注意力」射向谁(数值为示意)。</p>
    <div class="at-sentence" id="atS">
      <svg class="at-svg" id="atSvg"></svg>
      <span class="at-tok" data-i="0">小猫<span class="pct"></span></span>
      <span class="at-tok" data-i="1">追<span class="pct"></span></span>
      <span class="at-tok" data-i="2">那只<span class="pct"></span></span>
      <span class="at-tok" data-i="3">老鼠<span class="pct"></span></span>
      <span class="at-tok" data-i="4">,<span class="pct"></span></span>
      <span class="at-tok" data-i="5">因为<span class="pct"></span></span>
      <span class="at-tok sel" data-i="6">它<span class="pct"></span></span>
      <span class="at-tok" data-i="7">饿了<span class="pct"></span></span>
    </div>
    <div>
      <button class="wgt-btn ghost" id="atPlay">▶ 自动巡演(它 → 追 → 饿了)</button>
    </div>
    <div class="at-info" id="atInfo"></div>`;

  const root = body.querySelector("#atS");
  const svg = body.querySelector("#atSvg");
  const chips = [...root.querySelectorAll(".at-tok")];

  function select(i) {
    chips.forEach((c, j) => {
      c.classList.toggle("sel", j === i);
      c.classList.remove("show-pct");
      const p = c.querySelector(".pct");
      p.textContent = "";
    });
    const row = M[i] || {};
    // 百分比标签
    Object.entries(row).forEach(([j, w]) => {
      if (w < 0.05) return;
      const c = chips[+j];
      c.classList.add("show-pct");
      c.querySelector(".pct").textContent = Math.round(w * 100) + "%";
    });
    drawArcs(i, row);
    const info = body.querySelector("#atInfo");
    const note = NOTES[i];
    info.innerHTML = (note || `「<b>${TOKS[i]}</b>」的注意力分布(示意):对整句扫描打分,越相关越亮。`)
      + `<br><span style="font-size:12.5px;color:var(--faint)">每个词都会这样对全句「扫一遍」——一层 Transformer 里所有词同时做,叠几十层,就构成了理解。</span>`;
  }

  function drawArcs(i, row) {
    const wrap = root.getBoundingClientRect();
    const c0 = chips[i].getBoundingClientRect();
    const x1 = c0.left - wrap.left + c0.width / 2;
    const y0 = c0.top - wrap.top;
    let paths = "";
    Object.entries(row).forEach(([j, w]) => {
      const c = chips[+j].getBoundingClientRect();
      const x2 = c.left - wrap.left + c.width / 2;
      const y2 = c.top - wrap.top;
      const lift = Math.min(y0, y2) - Math.min(64, 18 + Math.abs(x2 - x1) * 0.16);
      paths += `<path d="M ${x1} ${y0} Q ${(x1 + x2) / 2} ${lift} ${x2} ${y2}" fill="none"
        stroke="#f0703f" stroke-width="${(w * 14 + 1).toFixed(1)}" stroke-opacity="${Math.min(0.95, w * 1.6)}" stroke-linecap="round"/>`;
    });
    if (!wrap.width) return;
    svg.setAttribute("viewBox", `0 0 ${wrap.width} ${wrap.height}`);
    svg.innerHTML = paths;
  }

  chips.forEach((c) => c.addEventListener("click", () => select(+c.dataset.i)));

  let playTimer = null;
  body.querySelector("#atPlay").addEventListener("click", () => {
    const seq = [6, 1, 7];
    let k = 0;
    clearInterval(playTimer);
    playTimer = setInterval(() => {
      select(seq[k % seq.length]); k++;
      if (k >= seq.length) clearInterval(playTimer);
    }, 1100);
    select(seq[0]);
  });

  const observer = new ResizeObserver(() => {
    if (root.clientWidth) select(Number(root.querySelector(".sel").dataset.i));
  });
  observer.observe(root);
};

/* ══════════ 装置六:缩放天梯 ══════════ */
builders.scaling = (body) => {
  body.innerHTML = `
    <p style="font-size:14.5px;margin-bottom:10px">曲线和百分比为教学假设，模型名称只标记参数规模。横轴是参数量(对数),<b style="color:var(--gold)">金色线是训练损失</b>(越低学得越好),<b style="color:var(--herb)">青色线是多步算术能力</b>。拖动滑杆,感受「损失平滑降、能力台阶跳」。</p>
    <div class="sc-canvas-wrap"><canvas id="scCv" width="720" height="250"></canvas></div>
    <div class="wgt-slider"><label>⚙️ 参数量</label><input type="range" min="8" max="12" step="0.01" value="8.05" id="scT"><output id="scO">1.1亿</output></div>
    <div class="sc-marks">
      <button data-p="8.068">GPT-1(1.2亿)</button>
      <button data-p="8.531">BERT-大(3.4亿)</button>
      <button data-p="9.176">GPT-2(15亿)</button>
      <button data-p="11.243">GPT-3(1750亿)</button>
      <button data-p="11.732">PaLM(5400亿)</button>
    </div>
    <div class="sc-readout" id="scR"></div>`;

  const W = 720, H = 250, X0 = 46, X1 = 700, Y0 = 218, Y1 = 18;
  const cv = body.querySelector("#scCv");
  const ctx = cv.getContext("2d");
  const slider = body.querySelector("#scT");

  const xOf = (logp) => X0 + ((logp - 8) / 4) * (X1 - X0);
  const lossOf = (logp) => 3.35 - 0.5 * (logp - 8);
  const capOf = (logp) => 86 / (1 + Math.exp(-(logp - 10.6) * 4.6));
  const yLoss = (l) => Y0 - ((l - 1.1) / 2.4) * (Y0 - Y1);
  const yCap = (c) => Y0 - (c / 100) * (Y0 - Y1);

  function fmtParams(logp) {
    const p = Math.pow(10, logp);
    if (p >= 1e12) return (p / 1e12).toFixed(1) + " 万亿";
    if (p >= 1e8) return (p / 1e8).toFixed(p / 1e8 >= 10 ? 0 : 1) + " 亿";
    return p.toFixed(0);
  }

  function draw(logp) {
    ctx.clearRect(0, 0, W, H);
    // 轴
    ctx.strokeStyle = "#3b2f22"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X0, Y1 - 6); ctx.lineTo(X0, Y0); ctx.lineTo(X1, Y0); ctx.stroke();
    ctx.font = "10.5px sans-serif"; ctx.fillStyle = "#7e6d59"; ctx.textAlign = "center";
    [8, 9, 10, 11, 12].forEach((t) => {
      ctx.fillText(t === 8 ? "1亿" : t === 9 ? "10亿" : t === 10 ? "100亿" : t === 11 ? "1000亿" : "1万亿", xOf(t), Y0 + 16);
      ctx.beginPath(); ctx.moveTo(xOf(t), Y0); ctx.lineTo(xOf(t), Y0 + 4); ctx.strokeStyle = "#3b2f22"; ctx.stroke();
    });
    ctx.save(); ctx.translate(14, (Y0 + Y1) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText("损失(金)", 0, 0); ctx.restore();
    ctx.textAlign = "right";
    ctx.fillText("能力(青)", X1 - 4, Y1 + 2);
    ctx.textAlign = "center";
    // 损失曲线
    ctx.strokeStyle = "#e2b04a"; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let x = 8; x <= 12; x += 0.02) { const px = xOf(x); x === 8 ? ctx.moveTo(px, yLoss(lossOf(x))) : ctx.lineTo(px, yLoss(lossOf(x))); }
    ctx.stroke();
    // 能力曲线
    ctx.strokeStyle = "#7fc8a9"; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let x = 8; x <= 12; x += 0.02) { const px = xOf(x); x === 8 ? ctx.moveTo(px, yCap(capOf(x))) : ctx.lineTo(px, yCap(capOf(x))); }
    ctx.stroke();
    // 当前位置
    const px = xOf(logp);
    ctx.strokeStyle = "rgba(240,112,63,.9)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px, Y1 - 4); ctx.lineTo(px, Y0); ctx.stroke();
    [[yLoss(lossOf(logp)), "#e2b04a"], [yCap(capOf(logp)), "#7fc8a9"]].forEach(([y, c]) => {
      ctx.beginPath(); ctx.arc(px, y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = c; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "#15110d"; ctx.stroke();
    });
  }

  function readout(logp) {
    const p = Math.pow(10, logp);
    const cap = capOf(logp);
    const loss = lossOf(logp);
    let lvl, desc;
    if (cap < 3)       { lvl = "蒙";      desc = "此等修为,多步算术全靠猜——五题对一题,纯运气。"; }
    else if (cap < 15) { lvl = "初学";    desc = "偶尔对一题,还不成气候。但损失已经在悄悄降了……"; }
    else if (cap < 40) { lvl = "入门";    desc = "参数跨过约百亿,简单多步题开始能对了——台阶第一步!"; }
    else if (cap < 72) { lvl = "熟练";    desc = "像模像样,难题时灵时不灵,已经能唬住不少人。"; }
    else               { lvl = "炉火纯青"; desc = "在这组假设数据中，分数逐渐接近上限。"; }
    body.querySelector("#scO").textContent = fmtParams(logp);
    body.querySelector("#scR").innerHTML =
      `参数量:<b>${fmtParams(logp)}</b>(≈ ${p.toExponential(1).replace("e+", "×10^")} 个旋钮) · 训练损失:<b>${loss.toFixed(2)}</b>(一路平滑下滑) · 多步算术能力:<b>${cap.toFixed(0)}%</b><br>` +
      `评级:<span class="lvl">「${lvl}」</span> ${desc}`;
    body.querySelectorAll(".sc-marks button").forEach((b) => {
      b.classList.toggle("on", Math.abs(parseFloat(b.dataset.p) - logp) < 0.006);
    });
  }

  slider.addEventListener("input", () => {
    const logp = parseFloat(slider.value);
    draw(logp); readout(logp);
  });
  body.querySelectorAll(".sc-marks button").forEach((b) => {
    b.addEventListener("click", () => {
      slider.value = b.dataset.p;
      const logp = parseFloat(b.dataset.p);
      draw(logp); readout(logp);
    });
  });

  draw(parseFloat(slider.value)); readout(parseFloat(slider.value));
};

/* ══════════ 装置七:丹纹对照炉(CoT) ══════════ */
builders.cot = (body) => {
  const PROBS = [
    {
      q: "食堂原有 23 个苹果,中午用掉 20 个,下午又买来 6 个。现在食堂有几个苹果?",
      direct: "29 个!",
      directWhy: "(想都没想:23 + 6 = 29,把「用掉」忘了)",
      steps: ["食堂原有 23 个", "中午用掉 20 个:23 − 20 = 3 个", "下午又买来 6 个:3 + 6 = 9 个"],
      ans: "现在食堂有 9 个苹果。",
      cot: "先一步步捋:原有 → 用掉 → 补货,每步只用做一次小运算,想错都难。",
    },
    {
      q: "笼里关着鸡和兔,数头共 8 只,数脚共 26 只。鸡、兔各几只?",
      direct: "各 4 只!",
      directWhy: "(直觉拍脑袋:8 除以 2,对半分——但 4×2+4×4=24,不对)",
      steps: [
        "假设 8 只全是鸡:应有脚 8 × 2 = 16 只",
        "实际脚 26 只,多出 26 − 16 = 10 只",
        "每把 1 只鸡换成 1 只兔,多出 2 只脚:10 ÷ 2 = 5 只是兔",
        "所以兔 5 只,鸡 8 − 5 = 3 只",
      ],
      ans: "兔 5 只,鸡 3 只。验算:5×4 + 3×2 = 26 ✓",
      cot: "这就是教科书级的思维链:假设 → 找差距 → 换算 → 验算。模型把推理「写」出来,每一步都变成它最擅长的「预测下一句」。",
    },
  ];
  let idx = 0;

  body.innerHTML = `
    <div class="cot-q" id="cotQ"></div>
    <div class="cot-grid">
      <div class="cot-panel bad">
        <div class="ph">❌ 直答模式(憋大招)</div>
        <div class="pb" id="cotBad"></div>
      </div>
      <div class="cot-panel good">
        <div class="ph">✅ 思维链模式(一步一步)</div>
        <div class="pb" id="cotGood"></div>
      </div>
    </div>
    <div style="margin-top:12px">
      <button class="wgt-btn" id="cotPlay">▶ 同时演示两种答法</button>
      <button class="wgt-btn ghost" id="cotNext">换一道题</button>
    </div>
    <div class="at-info" id="cotInfo" style="min-height:40px">以下为预设脚本。点「同时演示」:左边一口报答案(容易翻车),右边把思路摊开一步步走。</div>`;

  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function setup() {
    const p = PROBS[idx];
    body.querySelector("#cotQ").innerHTML = `题目:<b>${p.q}</b>`;
    body.querySelector("#cotBad").innerHTML = `<span style="color:var(--faint)">……</span>`;
    body.querySelector("#cotGood").innerHTML = `<span style="color:var(--faint)">……</span>`;
    body.querySelector("#cotInfo").textContent = "以下为预设脚本。点「同时演示」:左边一口报答案(容易翻车),右边把思路摊开一步步走。";
  }

  function play() {
    clearTimers();
    const p = PROBS[idx];
    const bad = body.querySelector("#cotBad");
    const good = body.querySelector("#cotGood");
    bad.innerHTML = `<span style="color:var(--faint)">思考中……(0 步)</span>`;
    good.innerHTML = `<span style="color:var(--faint)">思考中……</span>`;
    // 左边:快速直答
    timers.push(setTimeout(() => {
      bad.innerHTML = `<p><span class="step">[一步直答]</span>${p.direct}</p>` +
        `<p style="font-size:12.5px;color:var(--faint)">${p.directWhy}</p>` +
        `<p class="ans">答案:${p.direct.replace(/!(|个)/, "")} ❌ 翻车</p>`;
    }, 900));
    // 右边:逐步思考
    p.steps.forEach((s, i) => {
      timers.push(setTimeout(() => {
        if (good.querySelector(".boot") === null && i === 0) good.innerHTML = "";
        const p2 = document.createElement("p");
        p2.innerHTML = `<span class="step">第${i + 1}步</span>${s}`;
        p2.style.animation = "fadeUp .4s ease both";
        good.appendChild(p2);
      }, 1200 + i * 1000));
    });
    timers.push(setTimeout(() => {
      const p3 = document.createElement("p");
      p3.className = "ans";
      p3.innerHTML = `答案:${p.ans}`;
      p3.style.animation = "fadeUp .4s ease both";
      good.appendChild(p3);
      body.querySelector("#cotInfo").innerHTML = `<b>为什么差这么多?</b>${p.cot}`;
    }, 1200 + p.steps.length * 1000 + 300));
  }

  body.querySelector("#cotPlay").addEventListener("click", play);
  body.querySelector("#cotNext").addEventListener("click", () => {
    idx = (idx + 1) % PROBS.length;
    clearTimers();
    setup();
  });

  setup();
};

/* ══════════ 总装 ══════════ */
function init() {
  document.querySelectorAll("[data-widget]").forEach((el) => {
    const t = el.dataset.widget;
    if (!builders[t]) return;
    const [name, sub] = HEADS[t];
    el.innerHTML = `<div class="wgt-head"><span class="wname">${name}</span><span class="wsub">${sub}</span></div><div class="wgt-body"></div>`;
    try {
      builders[t](el.querySelector(".wgt-body"));
    } catch (e) {
      el.querySelector(".wgt-body").innerHTML = `<p style="color:var(--red-bad)">装置故障:${e.message}</p>`;
    }
  });
}

return { init };
})();
