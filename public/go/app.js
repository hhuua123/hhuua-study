/* ═══════════════════════════ Go 训练场 · 引擎 ═══════════════════════════ */
(() => {
"use strict";

const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const SAVE_KEY = "go-dojo-save-v1";

/* ─────────────── 等级 / 文案 ─────────────── */
const LEVELS = [
  { at: 0,    title: "沙场新兵" },
  { at: 100,  title: "Hello 毕业生" },
  { at: 250,  title: "循环骑士" },
  { at: 400,  title: "切片术士" },
  { at: 550,  title: "字符串法师" },
  { at: 700,  title: "闭包驭手" },
  { at: 850,  title: "深潜行家" },
  { at: 950,  title: "接口行家" },
  { at: 1100, title: "标准库管家" },
  { at: 1200, title: "测试先锋" },
  { at: 1350, title: "泛型行者" },
  { at: 1500, title: "并发武士" },
  { at: 1900, title: "管道宗师" },
  { at: 2350, title: "地鼠宗师" },
];

const PRAISE = ["漂亮!🐹", "代码很地道!", "一次成型,高手!", "小地鼠为你鼓掌!", "这就是 Go 的味道!"];
const TIPS = [
  "卡住了?先看参考答案前的提示,再看答案,最后自己默写一遍。",
  "Go 官方 Playground(goplay)不能输入,涉及键盘输入的练习请本地 go run。",
  "批改器检查的是要点,不是唯一写法——过了就大胆用自己喜欢的风格。",
  "fmt.Printf 的 %v 万能但 %d %.2f 更精确,正式代码用精确的。",
  "unused variable 是 Go 编译器最常抓的错,写代码时随手清理。",
  "defer 的口诀:先注册,后执行,像叠盘子。",
  "map 取不存在的 key 返回零值——这个特性本课考过你。",
  "并发三件套:go 发车、channel 传话、WaitGroup 集合。",
];

/* ─────────────── 注册表 ─────────────── */
const REGISTRY = [];
let META = [];
const BADGES = {};
const EXERCISES = {};   // id -> exercise def(含 topic 归属)

window.GO_DOJO = {
  registerTopic(def) {
    REGISTRY.push(def);
    if (def.badge) BADGES[def.key] = def.badge;
    (def.exercises || []).forEach((ex) => {
      ex.topic = def.key;
      EXERCISES[ex.id] = ex;
    });
  },
  getEx(id) { return EXERCISES[id]; },
  notifySolved(exId) { onExerciseSolved(exId); },
  isSolved(exId) { return !!state.solved[exId]; },
  say, toast, confetti,
  setName(n) { state.name = n; save(); },
  stats() {
    const total = Object.keys(EXERCISES).length;
    return { xp: state.xp, total, solved: Object.keys(state.solved).length, badges: state.badges.length, name: state.name };
  },
};

/* ─────────────── 存档 ─────────────── */
let state = {
  xp: 0, current: "intro",
  solved: {},      // exId -> true
  chapters: {},   // topic key -> true
  badges: [], name: "",
};
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) state = { ...state, ...JSON.parse(raw) };
} catch (e) { /* 隐私模式静默降级 */ }
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} };

/* ─────────────── 侧栏与导航 ─────────────── */
function accessible(def) {
  if (state.chapters[def.key] || state.legacyAccess?.includes(def.key)) return true;
  if (def.req) return !!state.chapters[def.req];   // 显式前置:支持彩蛋/实战跳级解锁
  const idx = META.findIndex((m) => m.key === def.key);
  return META.slice(0, idx).every(m => state.chapters[m.key]);
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
        say("先完成前面还没通过的关卡，这里才开门～🔒");
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
    s.title = state.badges.includes(m.key) ? `已获得:${b.name}` : `未获得:${b.name}`;
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
  if (key === "grad" && state.chapters.grad) showCert();
  if (key === "outbound" && state.chapters.outbound) fillOutbound();
  state.current = key;
  save();
  buildSidebar();
  updateSidebarActive();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function tryGoto(key) {
  const m = META.find((x) => x.key === key);
  if (!m || !accessible(m)) {
    say("先完成前面还没通过的关卡，这里才开门～🔒");
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
  if (confirm("清空所有进度与徽章,从第一关重练?")) {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  }
});

/* ─────────────── 动态建页 ─────────────── */
function buildSections() {
  const main = $("#main");
  META.forEach((def) => {
    const sec = document.createElement("section");
    sec.className = "chapter";
    sec.id = def.key;
    const badge = BADGES[def.key];
    const eyebrow = def.eyebrow || (badge ? `通关徽章:${badge.icon} ${badge.name}` : def.title);
    let html = `
      <div class="ch-head">
        <div class="ch-eyebrow">${eyebrow}</div>
        <h2>${def.title}</h2>
      </div>
      ${def.html || ""}`;
    html += `<div class="ch-banner" hidden></div>`;
    const idx = META.findIndex((m) => m.key === def.key);
    const prev = META[idx - 1];
    const next = META[idx + 1];
    html += `<div class="ch-nav">
      ${prev ? `<button class="gbtn ghost nav-prev" data-goto="${prev.key}">← ${prev.icon} ${prev.title}</button>` : "<span></span>"}
      ${next ? `<button class="gbtn ghost nav-next" data-goto="${next.key}">${next.icon} ${next.title} →</button>` : "<span></span>"}
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
  $("#xpText").textContent = state.xp + " 经验";
  const done = META.filter((m) => state.chapters[m.key]).length;
  $("#chProgress").textContent = `${done}/${META.length} 关`;
  document.title = `Go 训练场 · Lv${li + 1} ${cur.title}`;
  if (shownLevel !== -1 && li > shownLevel) {
    toast(`🎉 升级!Lv${li + 1} ${cur.title}`);
    say(`升级啦——${cur.title}!继续保持 🐹`);
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

const FX_COLORS = ["#00ADD8", "#007d9c", "#7fd8f0", "#25925d", "#b8860b", "#ffffff"];
const FX_EMOJI = ["🐹", "✨", "⭐"];
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

/* ─────────────── 小地鼠 ─────────────── */
let bubbleTimer = null;
function say(text) {
  const b = $("#goBubble");
  b.textContent = text;
  b.classList.add("show");
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.remove("show"), 4200);
}
$("#goFloat").addEventListener("click", () => {
  say(TIPS[(Math.random() * TIPS.length) | 0]);
});

/* ─────────────── 练习通关判定 ─────────────── */
function onExerciseSolved(exId) {
  const ex = EXERCISES[exId];
  if (!ex || state.solved[exId]) return;
  state.solved[exId] = true;
  addXp(ex.xp || 10);
  const def = META.find((m) => m.key === ex.topic);
  if (!def) return;
  const allSolved = (def.exercises || []).every((e) => state.solved[e.id]);
  if (allSolved) completeTopic(ex.topic, true);
}

function completeTopic(key, celebrate) {
  const firstTime = !state.chapters[key];
  state.chapters[key] = true;
  if (celebrate && firstTime) {
    const badge = BADGES[key];
    if (badge && !state.badges.includes(key)) {
      state.badges.push(key);
      toast(`获得徽章:${badge.icon} ${badge.name}`);
    }
    confetti(70);
    say(`「${BADGES[key].name}」入手!下一关已开 🐹`);
  }
  save();
  buildSidebar();
  updateSidebarActive();
  updateHud();
  showBanner(key);
  if (key === "grad") showCert();
  if (key === "outbound") fillOutbound();
}

/* ─────────────── 出师令填充 ─────────────── */
function fillOutbound() {
  const card = $("#obCard");
  if (!card) return;
  const s = window.GO_DOJO.stats();
  const obXp = $("#obXp"), obSolved = $("#obSolved"), obBadges = $("#obBadges"), obName = $("#obName");
  if (obXp) obXp.textContent = s.xp;
  if (obSolved) obSolved.textContent = `${s.solved} / ${s.total}`;
  if (obBadges) obBadges.textContent = `🏅 ${s.badges} / ${Object.keys(BADGES).length}`;
  if (obName) obName.textContent = state.name || "无名地鼠";
  if (card.classList.contains("show")) return;
  card.classList.add("show");
  confetti(200);
  setTimeout(() => confetti(120), 800);
  say(`出师!${state.name || "道友"},往后山去写真项目吧 🐹🏔`);
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
    ? `<p>🎉 本关通过!徽章 <b>${badge.icon} ${badge.name}</b> 到手,<b>${next.icon} ${next.title}</b> 是课程的下一关。</p><button class="gbtn" data-bgo="${next.key}">前往 ${next.icon} ${next.title} →</button>`
    : `<p>🏆 全部通关!去领取你的结业证书吧!</p>`;
}

/* ─────────────── 结业证书 ─────────────── */
function showCert() {
  const wrap = $("#gradCard");
  if (!wrap) return;

  const s = window.GO_DOJO.stats();
  $("#gdXp").textContent = s.xp;
  $("#gdSolved").textContent = `${s.solved} / ${s.total}`;
  $("#gdBadges").textContent = `🏅 ${s.badges} / ${Object.keys(BADGES).length} 枚徽章`;
  if (wrap.classList.contains("show")) return;
  wrap.classList.add("show");
  const nameInput = $("#gdName");
  nameInput.value = state.name || "";
  nameInput.addEventListener("input", () => window.GO_DOJO.setName(nameInput.value));
  confetti(180);
  setTimeout(() => confetti(90), 700);
  say("结业!去真实世界写 Go 吧 🐹🎉");
}

/* ─────────────── 初始化 ─────────────── */
document.addEventListener("DOMContentLoaded", () => {
  META = [...REGISTRY].sort((a, b) => a.order - b.order);
  // 保留扩课前已经开放的入口，新增关卡按新路线解锁。
  if (!Array.isArray(state.legacyAccess)) {
    const oldRoute = META.filter(m => Number.isInteger(m.order) && m.order <= 14);
    state.legacyAccess = oldRoute.filter((m, i) =>
      state.chapters[m.key] || oldRoute.slice(0, i).every(prev => state.chapters[prev.key])
    ).map(m => m.key);
  }
  buildSections();

  // 练习卡点火(由 checker.js 实现)
  if (window.GO_CHECKER && typeof window.GO_CHECKER.init === "function") {
    window.GO_CHECKER.init();
  }

  // 交互装置点火(由 widgets.js 实现)
  if (window.GO_WIDGETS && typeof window.GO_WIDGETS.init === "function") {
    window.GO_WIDGETS.init();
  }

  buildSidebar();
  META.forEach((m) => {
    if (state.chapters[m.key]) showBanner(m.key);
  });
  if (state.chapters.grad) showCert();
  if (state.chapters.outbound) fillOutbound();

  const resume = META.find(m => m.key === state.current && accessible(m));
  const next = META.find(m => !state.chapters[m.key]);
  const startKey = (resume || next || META[0]).key;
  showChapter(startKey);
  updateHud();

  setTimeout(() => {
    say(state.chapters.intro ? "欢迎回来,代码还热着 🐹" : "欢迎入营!我是陪练小地鼠,点我传音～");
  }, 900);
});

})();
