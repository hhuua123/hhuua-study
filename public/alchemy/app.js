/* ═══════════════════════════ 炼丹修行录 · 引擎 ═══════════════════════════ */
(() => {
"use strict";

const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SAVE_KEY = "alchemy-save-v1";

/* ─────────────── 等级 / 文案 ─────────────── */
const LEVELS = [
  { at: 0,   title: "拾柴童子" },
  { at: 45,  title: "外门杂役" },
  { at: 100, title: "控火学徒" },
  { at: 165, title: "炼气修士" },
  { at: 235, title: "筑基丹师" },
  { at: 310, title: "金丹长老" },
  { at: 385, title: "丹成出师" },
];

const PRAISE = ["妙哉!🧪", "火候正好!", "丹成上品!", "有悟性,小狐狸看好你!", "这道题你炼得通透!", "一步登天,好!"];
const REGRET = ["哎呀,再感受一下丹炉的火候～", "差点意思!再试一次,学费打骨折!", "炼废一炉不亏,再来!"];
const TIPS = [
  "「炼丹」就是训练 AI 模型——黑话,不是真炼。",
  "训练 = 猜 → 对答案 → 微调,循环几百万次。",
  "token 是模型眼里的最小文字块,不是字也不是词。",
  "温度低 = 求稳,温度高 = 放飞,写材料常用 0.7 以下。",
  "2017 年那篇论文的标题,你现在知道有多嚣张了。",
  "思维链的触发咒语:让我们一步一步思考。",
  "预训练读书,后训练学做人。",
  "卡住的时候,回去看一眼本章的「丹方」。",
  "想亲手摸模型?终章毕业卡里有本地跑模型的路线图。",
];

/* ─────────────── 注册表 ─────────────── */
const REGISTRY = [];
let META = [];
const BADGES = {};   // key -> { icon, name }
const QUIZZES = {};

window.ALCHEMY = {
  registerChapter(def) {
    REGISTRY.push(def);
    if (def.badge) BADGES[def.key] = def.badge;
    if (def.quiz && def.quiz.length) QUIZZES[def.key] = def.quiz;
  },
  complete(key) { completeChapter(key, true); },
  isDone(key) { return !!state.chapters[key]; },
  foxSay, toast, confetti,
  setName(n) { state.name = n; save(); },
  stats() {
    let total = 0, hits = 0;
    Object.keys(QUIZZES).forEach((k) => {
      (QUIZZES[k] || []).forEach((_, i) => {
        total++;
        if (state.firstTry[`${k}#${i}`]) hits++;
      });
    });
    return { xp: state.xp, total, hits, badges: state.badges.length, name: state.name };
  },
};

/* ─────────────── 存档 ─────────────── */
let state = {
  xp: 0, current: "intro",
  solved: {}, firstTry: {}, wrong: {},
  chapters: {}, badges: [], name: "",
};
try {
  const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
  if (saved && typeof saved === "object") {
    for (const key of ["solved", "firstTry", "wrong", "chapters"]) {
      const map = saved[key];
      if (map && typeof map === "object" && !Array.isArray(map)) state[key] = map;
    }
    if (Array.isArray(saved.badges)) state.badges = saved.badges.filter(b => typeof b === "string");
    if (Number.isFinite(saved.xp) && saved.xp >= 0) state.xp = saved.xp;
    if (typeof saved.current === "string") state.current = saved.current;
    if (typeof saved.name === "string") state.name = saved.name;
  }
} catch (e) { /* 隐私模式静默降级 */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} };

/* ─────────────── 侧栏与导航 ─────────────── */
function accessible(def) {
  const idx = META.findIndex((m) => m.key === def.key);
  return idx === 0 || !!state.chapters[META[idx - 1].key];
}

function buildSidebar() {
  const nav = $("#chapterNav");
  nav.innerHTML = "";
  let lastPart = null;
  META.forEach((m) => {
    if (m.partTitle && m.partTitle !== lastPart) {
      const h = document.createElement("div");
      h.className = "side-part";
      h.textContent = m.partTitle;
      nav.appendChild(h);
      lastPart = m.partTitle;
    }
    const el = document.createElement("button");
    el.type = "button";
    el.className = "side-item";
    el.dataset.key = m.key;
    const locked = !accessible(m);
    const done = !!state.chapters[m.key];
    el.innerHTML = `<span>${m.icon}</span><span class="txt">${m.title}</span><span class="st">${
      done ? "✓" : locked ? "🔒" : "▶"
    }</span>`;
    if (locked) el.classList.add("locked");
    if (done) el.classList.add("done");
    el.addEventListener("click", () => {
      if (!accessible(m)) {
        foxSay("先通过上一站的天关,此路方通～🔒");
        el.classList.remove("shakeit"); void el.offsetWidth; el.classList.add("shakeit");
        return;
      }
      showChapter(m.key);
    });
    nav.appendChild(el);
  });
  const totalBadges = Object.keys(BADGES).length;
  $("#badgeCount").textContent = `(${state.badges.length}/${totalBadges})`;
  const wall = $("#badgeWall");
  wall.innerHTML = "";
  META.forEach((m) => {
    const b = BADGES[m.key];
    if (!b) return;
    const s = document.createElement("span");
    s.className = "bdg" + (state.badges.includes(m.key) ? " earned" : "");
    s.textContent = b.icon;
    s.title = state.badges.includes(m.key) ? `已炼成:${b.name}` : `未炼成:${b.name}`;
    wall.appendChild(s);
  });
}

function updateSidebarActive() {
  $$(".side-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.key === state.current);
    const m = META.find((x) => x.key === el.dataset.key);
    if (!m) return;
    const locked = !accessible(m);
    const done = !!state.chapters[m.key];
    el.classList.toggle("locked", locked);
    el.classList.toggle("done", done);
    el.querySelector(".st").textContent = done ? "✓" : locked ? "🔒" : "▶";
  });
}

function showChapter(key) {
  $$("section.chapter").forEach((s) => s.classList.remove("show"));
  const sec = document.getElementById(key);
  if (!sec) return;
  sec.classList.add("show");
  state.current = key;
  save();
  buildSidebar();
  updateSidebarActive();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function tryGoto(key) {
  const m = META.find((x) => x.key === key);
  if (!m || !accessible(m)) {
    foxSay("先通过上一站的天关,此路方通～🔒");
    return;
  }
  showChapter(key);
}

document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-goto]");
  if (go) { tryGoto(go.dataset.goto); return; }
  const bgo = e.target.closest("[data-bgo]");
  if (bgo) { tryGoto(bgo.dataset.bgo); }
});

$("#btnReset").addEventListener("click", () => {
  if (confirm("散功转世,清空所有灵石与丹药,从第一站重修?")) {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  }
});

/* ─────────────── 动态建站 ─────────────── */
function buildSections() {
  const main = $("#main");
  META.forEach((def) => {
    const sec = document.createElement("section");
    sec.className = "chapter";
    sec.id = def.key;
    const badge = BADGES[def.key];
    const eyebrow = def.eyebrow || (badge ? `第 ${def.no} 站 · 徽章待领:${badge.icon} ${badge.name}` : def.title);
    let html = `
      <div class="ch-head">
        <div class="ch-eyebrow">${eyebrow}</div>
        <h2>${def.title}</h2>
      </div>
      ${def.html || ""}`;
    if (def.quiz && def.quiz.length) {
      html += `<div class="quiz-zone" data-quiz="${def.key}"></div>`;
    }
    html += `<div class="ch-banner" hidden></div>`;
    const idx = META.findIndex((m) => m.key === def.key);
    const prev = META[idx - 1];
    const next = META[idx + 1];
    html += `<div class="ch-nav">
      ${prev ? `<button class="btn ghost nav-prev" data-goto="${prev.key}">← ${prev.icon} ${prev.title}</button>` : "<span></span>"}
      ${next ? `<button class="btn ghost nav-next" data-goto="${next.key}">${next.icon} ${next.title} →</button>` : "<span></span>"}
    </div>`;
    sec.innerHTML = html;
    main.appendChild(sec);
  });
}

/* ─────────────── HUD ─────────────── */
let shownLevel = -1;

function levelIdx() {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (state.xp >= l.at) idx = i; });
  return idx;
}

function updateHud() {
  const li = levelIdx();
  const cur = LEVELS[li];
  const next = LEVELS[li + 1];
  $("#lvlTitle").textContent = `Lv${li + 1} ${cur.title}`;
  const pct = next ? Math.min(100, ((state.xp - cur.at) / (next.at - cur.at)) * 100) : 100;
  $("#xpFill").style.width = pct + "%";
  $("#xpText").textContent = state.xp + " 灵石";
  const done = META.filter((m) => state.chapters[m.key]).length;
  $("#chProgress").textContent = `${done}/${META.length} 站`;
  document.title = `炼丹修行录 · Lv${li + 1} ${cur.title}`;
  if (shownLevel !== -1 && li > shownLevel) {
    toast(`🎉 突破!Lv${li + 1} ${cur.title}`);
    foxSay(`境界突破——${cur.title}!继续走 🧪`);
  }
  shownLevel = li;
}

function addXp(n) { state.xp += n; updateHud(); save(); }

/* ─────────────── Toast / 彩带 ─────────────── */
function toast(text, icon = "🏅") {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = `${icon} ${text}`;
  $("#toastWrap").appendChild(t);
  setTimeout(() => { t.classList.add("out"); }, 2800);
  setTimeout(() => t.remove(), 3300);
}

const FX_COLORS = ["#f0703f", "#e2b04a", "#7fc8a9", "#d94f24", "#fff2df", "#c98f9e"];
const FX_EMOJI = ["🧪", "✨", "🔥"];
function confetti(burst = 80) {
  const cvs = $("#fx");
  const ctx = cvs.getContext("2d");
  cvs.width = innerWidth; cvs.height = innerHeight;
  const parts = [];
  for (let i = 0; i < burst; i++) {
    parts.push({
      x: Math.random() * cvs.width,
      y: -30 - Math.random() * cvs.height * 0.25,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 2.2 + Math.random() * 3.4,
      size: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      color: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
      emoji: Math.random() < 0.15 ? FX_EMOJI[(Math.random() * FX_EMOJI.length) | 0] : null,
    });
  }
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.emoji) { ctx.font = "20px serif"; ctx.fillText(p.emoji, -10, 0); }
      else { ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62); }
      ctx.restore();
    });
    if (++frames < 250) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, cvs.width, cvs.height);
  })();
}

/* ─────────────── 小狐狸 ─────────────── */
let bubbleTimer = null;
function foxSay(text) {
  const b = $("#foxBubble");
  b.textContent = text;
  b.classList.add("show");
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.remove("show"), 4200);
}
$("#foxFloat").addEventListener("click", () => {
  foxSay(TIPS[(Math.random() * TIPS.length) | 0]);
});

/* ─────────────── 测验引擎 ─────────────── */
function renderQuizzes() {
  $$(".quiz-zone").forEach((zone) => {
    if (zone.dataset.rendered === "1") return;
    zone.dataset.rendered = "1";
    const key = zone.dataset.quiz;
    const items = QUIZZES[key] || [];
    if (!items.length) return;
    const title = document.createElement("div");
    title.className = "quiz-title";
    title.innerHTML = `🧪 天关<span class="sub">共 ${items.length} 题 · 全对通关</span>`;
    zone.appendChild(title);
    items.forEach((item, i) => {
      zone.appendChild(buildQCard(key, item, i, items.length));
    });
  });
}

function buildQCard(key, item, i, total) {
  const qid = `${key}#${i}`;
  const card = document.createElement("div");
  card.className = "q-card";
  card.dataset.qid = qid;

  // 按题号确定的选项洗牌(同一次存档里顺序稳定,防止"永远选A"被摸到规律)
  let h = 0;
  for (const c of qid) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const order = item.opts.map((_, k) => k);
  for (let k = order.length - 1; k > 0; k--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (k + 1);
    [order[k], order[j]] = [order[j], order[k]];
  }
  const optsArr = order.map((k) => item.opts[k]);
  const correct = order.indexOf(item.ans);

  const tag = document.createElement("span");
  tag.className = "q-tag";
  tag.textContent = `第 ${i + 1} / ${total} 关`;
  card.appendChild(tag);

  const qt = document.createElement("p");
  qt.className = "q-text";
  qt.textContent = item.q;
  card.appendChild(qt);

  if (item.code) {
    const pre = document.createElement("pre");
    pre.className = "q-code";
    pre.textContent = item.code;
    card.appendChild(pre);
  }

  const opts = document.createElement("div");
  opts.className = "q-opts";
  let selected = -1;

  optsArr.forEach((opt, oi) => {
    const b = document.createElement("button");
    b.className = "q-opt";
    b.type = "button";
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = "ABCD"[oi];
    const txt = document.createElement("span");
    txt.textContent = opt;
    b.appendChild(letter); b.appendChild(txt);
    b.addEventListener("click", () => {
      if (card.dataset.locked === "1") return;
      selected = oi;
      $$(".q-opt", card).forEach((x) => x.classList.remove("sel", "wrong"));
      b.classList.add("sel");
    });
    opts.appendChild(b);
  });
  card.appendChild(opts);

  const foot = document.createElement("div");
  foot.className = "q-foot";
  const submit = document.createElement("button");
  submit.className = "q-submit";
  submit.textContent = "提交答案";
  const result = document.createElement("span");
  result.className = "q-result";
  foot.appendChild(submit); foot.appendChild(result);
  card.appendChild(foot);

  const exp = document.createElement("div");
  exp.className = "q-exp";
  exp.textContent = "💡 " + item.exp;
  card.appendChild(exp);

  submit.addEventListener("click", () => {
    if (card.dataset.locked === "1") return;
    if (selected < 0) {
      result.className = "q-result no";
      result.textContent = "先选一个答案再闯关嘛～";
      return;
    }
    if (selected === correct) {
      card.dataset.locked = "1";
      const firstTry = !state.wrong[qid];
      if (!state.solved[qid]) {
        state.solved[qid] = true;
        if (firstTry) state.firstTry[qid] = true;
        const gain = firstTry ? (item.xp || 10) : 4;
        addXp(gain);
        result.className = "q-result ok";
        result.innerHTML = `✅ ${PRAISE[(Math.random() * PRAISE.length) | 0]} <i class="xp-float">+${gain} 灵石</i>`;
      } else {
        result.className = "q-result ok";
        result.textContent = "✅ 正确!";
      }
      const btn = $$(".q-opt", card)[correct];
      btn.classList.add("correct");
      $$(".q-opt", card).forEach((x) => (x.disabled = true));
      btn.classList.remove("sel");
      submit.disabled = true;
      exp.classList.add("show");
      foxSay(PRAISE[(Math.random() * PRAISE.length) | 0]);
      checkChapterDone(key);
    } else {
      state.wrong[qid] = true;
      save();
      $$(".q-opt", card)[selected].classList.add("wrong");
      result.className = "q-result no";
      result.textContent = `❌ ${REGRET[(Math.random() * REGRET.length) | 0]}`;
    }
  });

  if (state.solved[qid]) {
    card.dataset.locked = "1";
    $$(".q-opt", card).forEach((x) => (x.disabled = true));
    $$(".q-opt", card)[correct].classList.add("correct");
    submit.disabled = true;
    exp.classList.add("show");
    result.className = "q-result ok";
    result.textContent = "✅ 已通过";
  }

  return card;
}

/* ─────────────── 通关 / 徽章 ─────────────── */
function checkChapterDone(key) {
  const items = QUIZZES[key] || [];
  const allSolved = items.length > 0 && items.every((_, i) => state.solved[`${key}#${i}`]);
  if (!allSolved) return;
  completeChapter(key, true);
}

function completeChapter(key, celebrate) {
  const firstTime = !state.chapters[key];
  state.chapters[key] = true;

  if (celebrate && firstTime) {
    const badge = BADGES[key];
    if (badge && !state.badges.includes(key)) {
      state.badges.push(key);
      toast(`炼成丹药:${badge.icon} ${badge.name}`);
    }
    confetti(70);
    foxSay(`「${BADGES[key].name}」到手!🧪`);
  }
  save();
  buildSidebar();
  updateSidebarActive();
  updateHud();
  showBanner(key);

  if (key === "final") showGraduation();
}

function showBanner(key) {
  const sec = document.getElementById(key);
  if (!sec) return;
  const banner = $(".ch-banner", sec);
  if (!banner) return;
  const idx = META.findIndex((m) => m.key === key);
  const next = META[idx + 1];
  const badge = BADGES[key];
  banner.hidden = false;
  banner.innerHTML = next
    ? `<p>🎉 本站通关!丹药 <b>${badge.icon} ${badge.name}</b> 炼成,下一站 <b>${next.icon} ${next.title}</b> 已开山门。</p><button class="btn" data-bgo="${next.key}">前往 ${next.icon} ${next.title} →</button>`
    : `<p>🏆 修行圆满,全图通关!</p>`;
}

/* ─────────────── 出师证书 ─────────────── */
function showGraduation() {
  const wrap = $("#gradCard");
  if (!wrap) return;
  if (wrap.classList.contains("show")) { confetti(30); return; }
  wrap.classList.add("show");
  // 标记附站完成 + 点亮下山之礼
  if (!state.chapters.grand) {
    state.chapters.grand = true;
    if (BADGES.grand && !state.badges.includes("grand")) {
      state.badges.push("grand");
      toast(`炼成丹药:${BADGES.grand.icon} ${BADGES.grand.name}`);
    }
    save();
    buildSidebar();
  }
  const s = window.ALCHEMY.stats();
  $("#gdXp").textContent = s.xp;
  $("#gdAcc").textContent = s.total ? Math.round((s.hits / s.total) * 100) + "%" : "0%";
  $("#gdBadges").textContent = `🏅 ${s.badges} / ${Object.keys(BADGES).length} 枚丹药`;
  const nameInput = $("#gdName");
  nameInput.value = state.name || "";
  nameInput.addEventListener("input", () => window.ALCHEMY.setName(nameInput.value));
  updateHud();
  confetti(180);
  setTimeout(() => confetti(90), 700);
  foxSay("丹成出师!往后山修行去吧 🧪🦊");
}

/* ─────────────── 初始化 ─────────────── */
document.addEventListener("DOMContentLoaded", () => {
  META = [...REGISTRY].sort((a, b) => a.order - b.order);
  buildSections();

  // 七座装置点火
  if (window.ALCHEMY_WIDGETS && typeof window.ALCHEMY_WIDGETS.init === "function") {
    window.ALCHEMY_WIDGETS.init();
  }

  renderQuizzes();
  buildSidebar();

  META.forEach((m) => {
    if (state.chapters[m.key]) showBanner(m.key);
  });
  if (state.chapters.final) showGraduation();

  const startKey = META.some((m) => m.key === state.current && accessible(m)) ? state.current : "intro";
  showChapter(startKey);
  updateHud();

  setTimeout(() => {
    foxSay(state.chapters.intro ? "道友回山,丹炉尚温 🧪" : "欢迎入山!我是引路小狐狸,点我传音～");
  }, 900);
});

})();
