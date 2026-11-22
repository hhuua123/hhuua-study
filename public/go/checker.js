/* ═══════════════════════════ Go 训练场 · 练习批改引擎 ═══════════════════════════ */
window.GO_CHECKER = (() => {
"use strict";

const CODE_KEY = "go-dojo-code-v1";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ─────────────── Go 语法高亮 ─────────────── */
const GO_KW = "package|import|func|var|const|type|struct|interface|map|chan|go|defer|if|else|for|range|switch|case|default|fallthrough|return|break|continue|select";
const GO_TYPES = "any|error|string|int|int64|uint|float64|bool|byte|rune";
const GO_RX = new RegExp([
  '("(?:\\\\.|[^"\\\\])*"|`(?:\\\\.|[^`\\\\])*`)',  // 1 字符串(含反引号原生串)
  "(//[^\\n]*)",                                  // 2 注释
  "\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b",               // 3 数字
  `\\b(${GO_KW})\\b`,                              // 4 关键字
  "\\b(true|false|nil)\\b",                       // 5 常量
  `\\b(${GO_TYPES})\\b`,                           // 6 类型
  "([A-Za-z_][A-Za-z0-9_]*)(?=\\s*\\()",          // 7 函数调用
].join("|"), "g");
const CLS = ["", "gs", "gc", "gn", "gk", "gb", "gt", "gf"];

function hlGo(code) {
  let out = "", last = 0, m;
  GO_RX.lastIndex = 0;
  while ((m = GO_RX.exec(code)) !== null) {
    if (m[0] === "") { GO_RX.lastIndex++; continue; }
    out += esc(code.slice(last, m.index));
    let ci = 0;
    for (let g = 1; g < m.length; g++) if (m[g] !== undefined) { ci = g; break; }
    out += `<span class="${CLS[ci]}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  out += esc(code.slice(last));
  return out;
}

/* ─────────────── 工具 ─────────────── */
const KIND_META = {
  blank:   { tag: "填空", cls: "" },
  predict: { tag: "预测输出", cls: "k-predict" },
  fix:     { tag: "改错", cls: "k-fix" },
  write:   { tag: "动手写", cls: "k-write" },
  big:     { tag: "大作业", cls: "k-big" },
};

const normalize = (s) =>
  s.replace(/\r\n?/g, "\n").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");

const loadCodeMap = () => {
  try {
    const data = JSON.parse(localStorage.getItem(CODE_KEY));
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch (e) { return {}; }
};
const saveCodeMap = (m) => { try { localStorage.setItem(CODE_KEY, JSON.stringify(m)); } catch (e) {} };

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
    inner += `<div class="exr-code gcode"><div class="gbar"><span>题面代码</span></div><pre><code>${hlGo(ex.given)}</code></pre></div>`;
  }
  if (ex.errText) {
    inner += `<div class="exr-err">${esc(ex.errText)}</div>`;
  }

  const initial = typeof codeMap[ex.id] === "string" ? codeMap[ex.id] : (ex.scaffold || "");
  inner += `
      <div class="editwrap">
        <pre class="edit-hl" aria-hidden="true"><code></code></pre>
        <textarea class="exr-in" maxlength="20000" aria-label="练习作答" aria-description="Tab 缩进，Shift+Tab 切换焦点" spellcheck="false" wrap="off" placeholder="${ex.placeholder || "在这里写下你的代码…"}"></textarea>
      </div>
      <div class="exr-btns">
        <button class="gbtn ex-check" ${solved ? "disabled" : ""}>✍️ 提交批改</button>
        <button type="button" class="gbtn ghost ex-pg">复制运行代码</button>
        ${ex.localOnly ? "" : '<button type="button" class="gbtn ex-run">运行 Go</button>'}
        ${ex.scaffold && !solved ? '<button type="button" class="gbtn ghost ex-restore">恢复初始代码</button>' : ""}
      </div>
      ${ex.localOnly ? '<p class="ex-run-note">本题请复制代码并按题目说明在本地运行。</p>' : `
        <p class="ex-run-note" id="run-note-${ex.id}">点击「运行 Go」会将${ex.kind === "predict" ? "题面代码" : "待运行的代码"}发送给官方 Go Playground。请勿填写密钥或私密信息。</p>
        <div class="ex-run-result" hidden aria-busy="false">
          <p class="ex-run-status"></p>
          <div class="ex-run-output" hidden><strong>程序输出</strong><pre></pre></div>
          <div class="ex-run-diagnostics" hidden><strong>编译与运行诊断</strong><pre></pre></div>
        </div>
        <p class="ex-run-announcement" role="status"></p>`}
      <div class="exr-checks"></div>
      <div class="exr-verdict"></div>
      <details class="exr-ref"><summary>参考答案与讲解</summary>
        <div class="ref-body">
          <pre><code>${hlGo(ex.ref || "见任务说明")}</code></pre>
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
    hlCode.innerHTML = hlGo(code) + (code.endsWith("\n") ? " " : "");
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
    const indent = "\t";
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
      // 找出第一处不一致的行,提示但不剧透
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
      const praises = ["漂亮!🐹", "代码很地道!", "一次成型,高手!", "小地鼠为你鼓掌!"];
      verdict.innerHTML = `✅ ${praises[(Math.random() * praises.length) | 0]} 全部要点通过 <i class="xp-float">+${ex.xp || 10} 经验</i>`;
      window.GO_DOJO.say(praises[(Math.random() * praises.length) | 0]);
      const cm = loadCodeMap(); cm[ex.id] = input.value; saveCodeMap(cm);
      window.GO_DOJO.notifySolved(ex.id);
    } else {
      const miss = results.filter((r) => !r.ok).length;
      verdict.className = "exr-verdict no";
      verdict.textContent = `还差 ${miss} 个要点,按上面的提示改一改,改几次都行——批改不要钱。`;
      const cm = loadCodeMap(); cm[ex.id] = input.value; saveCodeMap(cm);
    }
  });

  const preview = document.createElement("textarea");
  preview.hidden = true;
  preview.readOnly = true;
  preview.className = "playground-preview";
  preview.setAttribute("aria-label", "可手动复制的运行代码");
  el.querySelector(".exr-btns").after(preview);
  el.querySelector(".ex-pg").addEventListener("click", async () => {
    const code = playgroundCode(ex, input.value);
    if (!code || (ex.kind === "blank" && !input.value.trim())) {
      window.GO_DOJO.toast("先填写练习，再复制运行代码", "🐹");
      return;
    }
    const copyText = ex.localOnly ? code : runnableGo(ex, code);
    try {
      await navigator.clipboard.writeText(copyText);
      window.GO_DOJO.toast(ex.localOnly ? "已复制，请按题目说明在本地使用" : "代码已复制，可粘贴到编辑器中运行", "🚀");
    } catch (e) {
      preview.hidden = false;
      preview.value = copyText;
      preview.focus();
      preview.select();
      window.GO_DOJO.toast("请手动复制已选中的代码", "🐹");
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
    window.GO_DOJO.toast("已恢复这道题的初始代码", "🐹");
  });

  if (!ex.localOnly) setupRun(el, ex, input);

  // 恢复已通过状态
  if (solved) {
    const results = (ex.checks || (ex.kind === "predict" ? [{ label: "输出与预期完全一致" }] : [])).map((c) => ({ ok: true, label: c.label }));
    paintChecks(results);
    verdict.className = "exr-verdict ok";
    verdict.textContent = "✅ 已通过";
  }
}

/* ─────────────── 组装真跑代码 ─────────────── */
function playgroundCode(ex, userVal) {
  const u = (userVal || "").trim();
  switch (ex.kind) {
    case "blank":
      if (u && ex.given && ex.given.includes("____")) return ex.given.replace("____", () => u);
      return ex.given || ex.ref || "";
    case "predict":
      return ex.given || ex.ref || "";
    case "fix":
      if (u && ex.replaceLine) return ex.given.replace(ex.replaceLine, () => u);
      return u || ex.given || ex.ref || "";
    default:
      return u || ex.ref || ex.scaffold || "";
  }
}

/* ─────────────── 官方 Playground 执行 ─────────────── */
// Only these lesson fragments depend on definitions introduced earlier.
const RUN_CONTEXT = {
  "closure-4": "func makeCounter() func() int { n := 0; return func() int { n++; return n } }",
  "t4-2": 'func divide(a, b float64) (float64, error) { if b == 0 { return 0, errors.New("除数不能为零") }; return a / b, nil }',
  "generics-2": "type Number interface { int | float64 }",
};
const FRAGMENT_IMPORTS = ["errors", "fmt", "reflect", "strconv", "strings", "sync", "time", "unicode/utf8"];

function runnableGo(exercise, source) {
  // Ignore comments and literals when looking for Go declarations and package selectors.
  const tokens = text => text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`/g, " ");
  const syntax = tokens(source);
  if (/^\s*package\s+\w+/.test(syntax)) return source;

  const declarations = RUN_CONTEXT[exercise.id] || (exercise.id === "t4-4" ? RUN_CONTEXT["t4-2"] : "");
  const statements = exercise.id === "cc-3" ? "ch := make(chan int)\n" + source : source;
  const body = exercise.runMain ? source + "\n" + exercise.runMain : /^\s*(?:func\s+\w+|type\s+\w+)/.test(syntax)
    ? source + (/\bfunc\s+main\s*\(/.test(syntax) ? "" : "\nfunc main() {}")
    : `func main() {\n${statements}\n}`;
  const used = tokens(declarations + "\n" + body);
  const imports = FRAGMENT_IMPORTS.filter(path => new RegExp(`\\b${path.split("/").pop()}\\s*\\.`).test(used));
  return ["package main", ...imports.map(path => `import "${path}"`), declarations, body].join("\n");
}

function setupRun(card, exercise, input) {
  const button = card.querySelector(".ex-run");
  const restore = card.querySelector(".ex-restore");
  const panel = card.querySelector(".ex-run-result");
  const status = card.querySelector(".ex-run-status");
  const announcement = card.querySelector(".ex-run-announcement");
  const output = card.querySelector(".ex-run-output");
  const diagnostics = card.querySelector(".ex-run-diagnostics");
  button.setAttribute("aria-describedby", "run-note-" + exercise.id);

  function showStatus(message) {
    status.textContent = message;
    announcement.textContent = message;
  }

  button.addEventListener("click", async () => {
    if (button.disabled) return;
    panel.hidden = false;
    for (const stream of [output, diagnostics]) {
      stream.hidden = true;
      stream.querySelector("pre").textContent = "";
    }

    const answer = input.value.trim();
    if (exercise.kind !== "predict" && !answer) {
      showStatus("请先填写代码，再点击运行。");
      return;
    }

    button.disabled = true;
    if (restore) restore.disabled = true;
    panel.setAttribute("aria-busy", "true");
    showStatus("正在等待官方 Go Playground 编译和运行…");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const body = runnableGo(exercise, playgroundCode(exercise, answer));
      const response = await fetch("https://play.golang.org/compile", {
        method: "POST",
        credentials: "omit",
        redirect: "error",
        signal: controller.signal,
        body: new URLSearchParams({ version: "2", body }),
      });
      if (!response.ok) {
        showStatus(response.status === 429
          ? "官方 Go Playground 请求过多，请稍后重试。"
          : `官方 Go Playground 暂时无法处理请求（HTTP ${response.status}），请稍后重试或复制到本地运行。`);
        return;
      }
      const result = await response.json();
      if (typeof result?.Errors !== "string" || !Number.isInteger(result.Status) ||
          (result.Events != null && !Array.isArray(result.Events))) {
        throw new Error("Invalid Go Playground response");
      }
      const stdout = [];
      const stderr = [];
      for (const event of result.Events || []) {
        if (typeof event?.Message !== "string") continue;
        (event.Kind === "stderr" ? stderr : stdout).push(event.Message);
      }
      for (const [stream, text] of [[output, stdout.join("")], [diagnostics, result.Errors || stderr.join("")]]) {
        if (!text) continue;
        stream.querySelector("pre").textContent = text.length > 40000
          ? text.slice(0, 40000) + "\n[输出过长，已截断]"
          : text;
        stream.hidden = false;
      }
      showStatus(result.Errors
        ? "编译或执行未完成，请查看诊断。"
        : result.Status !== 0 || result.TestsFailed > 0
          ? "运行失败，请查看输出或诊断。"
          : (stdout.length || stderr.length ? "运行成功。" : "运行成功，程序没有打印内容。"));
    } catch (error) {
      showStatus(controller.signal.aborted
        ? "等待官方 Go Playground 超时。请稍后重试，或复制到本地运行。"
        : "无法取得官方 Go Playground 的结果。请检查网络后重试，或复制到本地运行。");
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
  // 教学代码块上色
  document.querySelectorAll(".gcode pre code").forEach((el) => {
    el.innerHTML = hlGo(el.textContent);
  });
  document.querySelectorAll(".exslot[data-ex]").forEach((slot) => {
    const ex = window.GO_DOJO.getEx(slot.dataset.ex);
    if (!ex) {
      slot.innerHTML = `<div class="exr"><div class="exr-body"><p style="color:var(--bad)">练习数据缺失:${esc(slot.dataset.ex)}</p></div></div>`;
      return;
    }
    render(slot, ex, window.GO_DOJO.isSolved(ex.id));
  });
}

return { init, hlGo };
})();
