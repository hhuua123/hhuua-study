/* ═══════════════════════════ 锈岛求生 3.0 · 动手练习引擎 ═══════════════════════════ */
window.RUST_EX = (() => {
"use strict";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ─────────────── Rust 语法高亮(引擎自用) ─────────────── */
const RUST_KW = "let|mut|fn|const|if|else|loop|while|for|in|break|continue|return|match|struct|enum|impl|trait|use|mod|pub|as|move|ref|dyn|unsafe|where|type|crate|self|Self|async|await";
const RUST_TYPES = "i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|str";
const RUST_RX = new RegExp([
  '("(?:\\\\.|[^"\\\\])*")',
  "('(?:\\\\.|[^'\\\\])*')",
  "(//[^\\n]*)",
  "([A-Za-z_][A-Za-z0-9_]*!)",
  "\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b",
  `\\b(${RUST_KW})\\b`,
  "\\b(true|false)\\b",
  "\\b([A-Z][A-Za-z0-9_]*)\\b",
  `\\b(${RUST_TYPES})\\b`,
  "([A-Za-z_][A-Za-z0-9_]*)(?=\\s*\\()",
].join("|"), "g");
const RUST_CLS = ["", "tk-str", "tk-str", "tk-cmt", "tk-macro", "tk-num", "tk-kw", "tk-bool", "tk-type", "tk-type", "tk-fn"];

function hlRust(code) {
  let out = "", last = 0, m;
  RUST_RX.lastIndex = 0;
  while ((m = RUST_RX.exec(code)) !== null) {
    if (m[0] === "") { RUST_RX.lastIndex++; continue; }
    out += esc(code.slice(last, m.index));
    let ci = 0;
    for (let g = 1; g < m.length; g++) if (m[g] !== undefined) { ci = g; break; }
    out += `<span class="${RUST_CLS[ci] || ""}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  out += esc(code.slice(last));
  return out;
}

/* ─────────────── 工具 ─────────────── */
const KIND_META = {
  blank:   { tag: "代码补全", cls: "k-blank" },
  predict: { tag: "预测输出", cls: "k-predict" },
  fix:     { tag: "改错", cls: "k-fix" },
  write:   { tag: "动手写", cls: "k-write" },
  big:     { tag: "本章实战", cls: "k-big" },
};

const CODE_KEY = "rust-island-code-v1";
const loadCodeMap = () => {
  try {
    const drafts = JSON.parse(localStorage.getItem(CODE_KEY));
    return drafts && typeof drafts === "object" && !Array.isArray(drafts) ? drafts : {};
  } catch (e) { return {}; }
};
const saveCodeMap = (m) => { try { localStorage.setItem(CODE_KEY, JSON.stringify(m)); } catch (e) {} };

const normalize = (s) =>
  s.replace(/\r\n?/g, "\n").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");

/* ─────────────── 练习卡渲染 ─────────────── */
function render(slot, ex, solved) {
  const km = KIND_META[ex.kind] || KIND_META.write;
  const codeMap = loadCodeMap();
  const el = document.createElement("div");
  el.className = "exr" + (solved ? " solved" : "");
  el.dataset.ex = ex.id;

  let inner = `
    <div class="exr-head">
      <span class="exr-tag ${km.cls}">${km.tag}</span>
      <span class="exr-title">${ex.title}</span>
      <span class="exr-xp">+${ex.xp || 10} 经验</span>
    </div>
    <div class="exr-body">
      <div class="exr-task">${ex.task}</div>`;

  if (ex.given) {
    inner += `<div class="exr-code"><pre><code>${hlRust(ex.given)}</code></pre></div>`;
  }
  if (ex.errText) {
    inner += `<div class="exr-err">${esc(ex.errText)}</div>`;
  }

  const initial = typeof codeMap[ex.id] === "string" ? codeMap[ex.id] : (ex.scaffold || "");
  inner += `
      <div class="editwrap">
        <pre class="edit-hl" aria-hidden="true"><code>${hlRust(initial)}</code></pre>
        <textarea class="exr-in" aria-label="练习作答" aria-description="Tab 缩进，Shift+Tab 切换焦点" maxlength="20000" spellcheck="false" wrap="off" placeholder="${ex.placeholder || "在这里写下你的代码…"}"></textarea>
      </div>
      <div class="exr-btns">
        <button class="btn-run ex-check" ${solved ? "disabled" : ""}>✍️ 提交批改</button>
        <button type="button" class="btn-run err ex-pg">复制示例或作答</button>
        ${ex.localOnly ? "" : '<button type="button" class="btn-run ex-run">运行 Rust</button>'}
        ${ex.scaffold && !solved ? '<button type="button" class="btn-run err ex-restore">恢复初始代码</button>' : ""}
      </div>
      ${ex.localOnly ? '<p class="ex-run-note">本题请复制代码并按题目说明在本地运行。</p>' : `
        <p class="ex-run-note" id="run-note-${ex.id}">${expectsCompileError(ex) ? "本题用来观察编译错误。" : ""}点击「运行 Rust」会将${ex.kind === "predict" ? "题面代码" : "待运行的代码"}发送给官方 Rust Playground。请勿填写密钥或私密信息。${ex.runDemo ? "运行代码片段时会补上本题的示例上下文。" : ""}</p>
        <div class="ex-run-result" hidden aria-busy="false">
          <p class="ex-run-status"></p>
          <div class="ex-run-stdout" hidden><strong>程序输出</strong><pre class="console"></pre></div>
          <div class="ex-run-stderr" hidden><strong>编译与运行诊断</strong><pre class="console"></pre></div>
        </div>
        <p class="ex-run-announcement" role="status"></p>`}
      <div class="exr-checks"></div>
      <div class="exr-verdict"></div>
      <details class="exr-ref"><summary>参考答案与讲解</summary>
        <div class="ref-body">
          <pre><code>${hlRust(ex.ref || "见任务说明")}</code></pre>
          <p>${ex.refNote || ""}</p>
        </div>
      </details>
    </div>`;
  el.innerHTML = inner;
  slot.appendChild(el);

  const input = el.querySelector(".exr-in");
  const hlCode = el.querySelector(".edit-hl code");
  const checksEl = el.querySelector(".exr-checks");
  const verdict = el.querySelector(".exr-verdict");
  const restore = el.querySelector(".ex-restore");

  const minRows = ex.kind === "big" ? 12 : ex.mini ? 2 : 5;
  input.value = initial;

  function syncScroll() {
    hlCode.style.transform = `translate(${-input.scrollLeft}px, ${-input.scrollTop}px)`;
  }

  function syncHl() {
    const code = input.value;
    const lineCount = code.split("\n").length;
    input.rows = Math.max(minRows, Math.min(24, lineCount + 1));
    hlCode.innerHTML = hlRust(code) + (code.endsWith("\n") ? " " : "");
    syncScroll();
  }
  input.addEventListener("input", () => {
    syncHl();
    const drafts = loadCodeMap();
    drafts[ex.id] = input.value;
    saveCodeMap(drafts);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || event.shiftKey || event.ctrlKey || event.metaKey ||
        event.altKey || event.isComposing || input.readOnly) return;

    event.preventDefault();
    const indent = "    ";
    const { value, selectionStart, selectionEnd } = input;
    if (selectionStart === selectionEnd) {
      if (value.length + indent.length > input.maxLength) return;
      input.setRangeText(indent, selectionStart, selectionEnd, "end");
    } else {
      const lineStart = value.slice(0, selectionStart).lastIndexOf("\n") + 1;
      const selectedLines = value.slice(lineStart, selectionEnd);
      const indented = indent + selectedLines.replace(/\n(?!$)/g, "\n" + indent);
      if (value.length + indented.length - selectedLines.length > input.maxLength) return;
      input.setRangeText(indented, lineStart, selectionEnd, "select");
      input.setSelectionRange(selectionStart + indent.length, lineStart + indented.length);
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  input.addEventListener("scroll", syncScroll);

  if (solved) input.readOnly = true;
  syncHl();

  function paintChecks(results) {
    checksEl.innerHTML = results.map((r) => `
      <div class="chk ${r.ok ? "ok" : "bad"}">
        <span class="m">${r.ok ? "✓" : "✗"}</span>
        <div><span class="lab">${r.label}</span>${!r.ok && r.hint ? `<span class="hint">💡 ${r.hint}</span>` : ""}</div>
      </div>`).join("");
  }

  function runChecks(raw) {
    const code = raw.trim();
    if (!code) return { empty: true };
    if (ex.kind === "predict") {
      const mine = normalize(raw);
      const want = normalize(ex.expected);
      if (mine === want) return { results: [{ ok: true, label: "输出与预期完全一致" }] };
      const a = mine.split("\n"), b = want.split("\n");
      let line = -1;
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[i] !== b[i]) { line = i + 1; break; }
      }
      const extra = line > 0 ? `你的第 ${line} 行和预期不一致,再看看那行代码到底打印什么。` : "行数对得上,再检查空格和换行。";
      return { results: [{ ok: false, label: "输出与预期一致", hint: extra }] };
    }
    const results = (ex.checks || []).map((c) => {
      let ok = false;
      try { ok = !!c.test(code); } catch (e) { ok = false; }
      return { ok, label: c.label, hint: c.hint };
    });
    return { results };
  }

  el.querySelector(".ex-check").addEventListener("click", () => {
    if (el.classList.contains("solved")) return;
    const { empty, results } = runChecks(input.value);
    if (empty) {
      verdict.className = "exr-verdict no";
      verdict.textContent = "先写点什么再提交嘛～";
      return;
    }
    paintChecks(results);
    const allOk = results.length > 0 && results.every((r) => r.ok);
    if (allOk) {
      el.classList.add("solved");
      input.readOnly = true;
      if (restore) restore.hidden = true;
      el.querySelector(".ex-check").disabled = true;
      verdict.className = "exr-verdict ok";
      const praises = ["漂亮!🦀", "代码很地道!", "一次成型,高手!", "铁锈味十足!"];
      const p = praises[(Math.random() * praises.length) | 0];
      verdict.innerHTML = `✅ ${p} 全部要点通过 <i class="xp-float">+${ex.xp || 10} 经验</i>`;
      const cm = loadCodeMap(); cm[ex.id] = input.value; saveCodeMap(cm);
      window.RUST_ISLAND.notifyExSolved(ex.id);
    } else {
      const miss = results.filter((r) => !r.ok).length;
      verdict.className = "exr-verdict no";
      verdict.textContent = `还差 ${miss} 个要点,按上面的提示改一改——批改不要钱。`;
      const cm = loadCodeMap(); cm[ex.id] = input.value; saveCodeMap(cm);
    }
  });

  const preview = document.createElement("textarea");
  preview.hidden = true;
  preview.readOnly = true;
  preview.className = "exr-copy-preview";
  preview.setAttribute("aria-label", "可手动复制的代码");
  el.querySelector(".exr-btns").after(preview);
  el.querySelector(".ex-pg").addEventListener("click", async () => {
    const code = playgroundCode(ex, input.value);
    if (!code || (ex.kind === "blank" && !input.value.trim())) {
      window.RUST_ISLAND.toast("先作答，再复制代码", "🦀");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      window.RUST_ISLAND.toast("已复制，代码片段可放进完整程序后运行", "🦀");
    } catch (e) {
      preview.hidden = false;
      preview.value = code;
      preview.focus();
      preview.select();
      window.RUST_ISLAND.toast("请手动复制已选中的代码", "🦀");
    }
  });

  restore?.addEventListener("click", () => {
    if (input.readOnly) return;
    if (input.value !== ex.scaffold && !window.confirm("恢复这道题的初始代码？这题当前的草稿会被替换。")) return;

    const drafts = loadCodeMap();
    delete drafts[ex.id];
    saveCodeMap(drafts);
    input.value = ex.scaffold;
    input.scrollTop = 0;
    input.scrollLeft = 0;
    input.setSelectionRange(0, 0);
    syncHl();
    checksEl.replaceChildren();
    verdict.className = "exr-verdict";
    verdict.textContent = "";
    preview.hidden = true;
    preview.value = "";
    const runResult = el.querySelector(".ex-run-result");
    if (runResult) runResult.hidden = true;
    input.focus();
    window.RUST_ISLAND.toast("已恢复这道题的初始代码", "🦀");
  });

  if (!ex.localOnly) setupRun(el, ex, input);

  if (solved) {
    const results = (ex.checks || (ex.kind === "predict" ? [{ label: "输出与预期完全一致" }] : [])).map((c) => ({ ok: true, label: c.label }));
    paintChecks(results);
    verdict.className = "exr-verdict ok";
    verdict.textContent = "✅ 已通过";
  }
}

/* ─────────────── 真跑代码组装 ─────────────── */
function playgroundCode(ex, userVal) {
  const u = (userVal || "").trim();
  switch (ex.kind) {
    case "blank":
      if (u && ex.given && ex.given.includes("____")) return ex.given.replace("____", () => u);
      return ex.given || ex.ref || "";
    case "predict":
      return ex.given || ex.ref || "";
    case "fix":
      return u || ex.given || ex.ref || "";
    default:
      return u || ex.ref || ex.scaffold || "";
  }
}

function expectsCompileError(exercise) {
  return exercise.kind === "predict" && exercise.expected === "编译报错";
}

function runnableRust(exercise, source) {
  if (/^\s*(?:pub\s+)?(?:async\s+)?fn\s+main\s*\(/m.test(source) || exercise.runTests) {
    return source;
  }

  // Lesson fixtures supply the context and a call for snippets with no entry point.
  const demo = exercise.runDemo;
  if (!demo || (demo.match && !demo.match.test(source))) return `fn main() {\n${source}\n}`;
  const snippet = demo.trimSemicolon ? source.replace(/;$/, "") : source;
  const body = [demo.before, snippet, demo.after].filter(Boolean).join("\n");
  return `fn main() {\n${body}\n}`;
}

/* ─────────────── 官方 Playground 执行 ─────────────── */
function setupRun(card, exercise, input) {
  const button = card.querySelector(".ex-run");
  const restore = card.querySelector(".ex-restore");
  const panel = card.querySelector(".ex-run-result");
  const status = card.querySelector(".ex-run-status");
  const announcement = card.querySelector(".ex-run-announcement");
  const stdout = card.querySelector(".ex-run-stdout");
  const stderr = card.querySelector(".ex-run-stderr");
  button.setAttribute("aria-describedby", "run-note-" + exercise.id);

  function showStatus(message) {
    status.textContent = message;
    announcement.textContent = message;
  }

  button.addEventListener("click", async () => {
    if (button.disabled) return;
    panel.hidden = false;
    for (const stream of [stdout, stderr]) {
      stream.hidden = true;
      stream.querySelector("pre").textContent = "";
    }

    const answer = input.value.trim();
    if (exercise.kind !== "predict" && !answer) {
      showStatus("请先填写代码，再点击运行。");
      return;
    }
    const source = playgroundCode(exercise, answer);
    if (!source.trim()) {
      showStatus("这道题没有可执行的代码，可继续提交批改。");
      return;
    }

    const code = runnableRust(exercise, source);
    button.disabled = true;
    if (restore) restore.disabled = true;
    panel.setAttribute("aria-busy", "true");
    showStatus("正在等待官方 Playground 编译和运行…");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch("https://play.rust-lang.org/execute", {
        method: "POST",
        credentials: "omit",
        redirect: "error",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          channel: "stable", mode: "debug", edition: "2021", crateType: "bin",
          tests: !!exercise.runTests, backtrace: false, code,
        }),
      });
      if (!response.ok) {
        showStatus(response.status === 429
          ? "官方 Playground 请求过多，请稍后重试。"
          : `官方 Playground 暂时无法处理请求（HTTP ${response.status}），请稍后重试或复制到本地运行。`);
        return;
      }
      const result = await response.json();
      if (typeof result.success !== "boolean" || typeof result.stdout !== "string" ||
          typeof result.stderr !== "string") throw new Error("Invalid Playground response");
      for (const [stream, value] of [[stdout, result.stdout], [stderr, result.stderr]]) {
        if (!value) continue;
        stream.querySelector("pre").textContent = value.length > 40000
          ? value.slice(0, 40000) + "\n[输出过长，已截断]"
          : value;
        stream.hidden = false;
      }
      showStatus(result.success
        ? (result.stdout ? "运行成功。" : "运行成功，程序没有打印内容。")
        : expectsCompileError(exercise)
          ? "编译报错，符合本题预期。请查看诊断。"
          : exercise.expectsBorrowPanic && result.stderr.includes("already mutably borrowed")
            ? "程序在运行时 panic，符合本题预期。请查看诊断。"
            : "编译或运行失败，请查看诊断。");
    } catch (error) {
      showStatus(controller.signal.aborted
        ? "等待官方 Playground 超时。请稍后重试，或复制到本地运行。"
        : "无法取得官方 Playground 的结果。请检查网络后重试，或复制到本地运行。");
    } finally {
      clearTimeout(timeout);
      panel.setAttribute("aria-busy", "false");
      button.disabled = false;
      if (restore) restore.disabled = false;
    }
  });
}

/* ─────────────── 总装 ─────────────── */
function init() {
  document.querySelectorAll(".exslot[data-ex]").forEach((slot) => {
    const ex = window.RUST_ISLAND.getEx(slot.dataset.ex);
    if (!ex) {
      slot.innerHTML = `<div class="exr"><div class="exr-body"><p style="color:var(--red)">练习数据缺失:${esc(slot.dataset.ex)}</p></div></div>`;
      return;
    }
    render(slot, ex, window.RUST_ISLAND.isExSolved(ex.id));
  });
}

return { init, hlRust };
})();
