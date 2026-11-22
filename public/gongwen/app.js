/* ═══════════ 文电训练营 · 页面脚本(进度条 / 目录高亮 / 一键复制 / 返回顶部) ═══════════ */
(() => {
"use strict";

const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ─────────── 阅读进度条 + 目录高亮(scrollspy) ─────────── */
const bar = document.getElementById("pbar");
const tocLinks = $$("#toc a[href^='#']");
const sectionIds = [...new Set(tocLinks.map((a) => a.getAttribute("href").slice(1)))];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function syncScrollUI() {
  const h = document.documentElement;
  // 进度条
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  bar.style.width = pct + "%";
  // 目录高亮:最后一个"顶部已越过视口 1/4 线"的章节
  let cur = null;
  const markLine = h.clientHeight * 0.25;
  sections.forEach((s) => {
    if (s.getBoundingClientRect().top <= markLine) cur = s.id;
  });
  if (!cur && sections.length) cur = sections[0].id;   // 页面顶端兜底:高亮第一章
  tocLinks.forEach((a) => a.classList.toggle("act", a.getAttribute("href") === "#" + cur));
  // 返回顶部按钮
  document.getElementById("toTop").classList.toggle("show", h.scrollTop > 600);
}
document.addEventListener("scroll", () => syncScrollUI(), { passive: true });
window.addEventListener("resize", () => syncScrollUI(), { passive: true });
syncScrollUI();

/* ─────────── 一键复制 ─────────── */
function bindCopy(el) {
  if (el.dataset.copyBound === "1") return;
  el.dataset.copyBound = "1";
  const btn = document.createElement("button");
  btn.className = "copybtn";
  btn.type = "button";
  btn.textContent = "📋 复制";
  el.appendChild(btn);
  btn.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    const text = el.dataset.copyText || el.textContent.replace(/📋 复制$/, "").trim();
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (e) {
      // 兼容 http / 旧环境
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;top:-100px;";
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
      ta.remove();
    }
    btn.textContent = ok ? "✓ 已复制" : "✗ 失败,请手动选择";
    btn.classList.add("done");
    setTimeout(() => {
      btn.textContent = "📋 复制";
      btn.classList.remove("done");
    }, 1800);
  });
}

function scanCopyables(root = document) {
  $$("[data-copy]", root).forEach((el) => {
    if (el.dataset.copyTextSrc) {
      // 指定从别的元素取源文本
      const src = document.getElementById(el.dataset.copyTextSrc);
      if (src) el.dataset.copyText = src.textContent;
    }
    bindCopy(el);
  });
}
scanCopyables();

/* ─────────── 返回顶部 ─────────── */
document.getElementById("toTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

})();
