const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const icons = {
  user: "◉",
  edge: "⇄",
  app: "▤",
  db: "▱",
  storage: "▧",
  cdn: "⌁",
  cache: "ϟ",
  queue: "≡",
  observe: "◎",
};
let saved = {};
try {
  saved =
    JSON.parse(localStorage.getItem("architecture-growth-v1") || "{}") || {};
} catch {}
const initialId = location.hash.slice(1).split("/")[0];
const initialIndex = LESSONS.findIndex((lesson) => lesson.id === initialId);
const state = {
  index:
    initialIndex >= 0
      ? initialIndex
      : Math.min(Math.max(Number(saved.index) || 0, 0), LESSONS.length - 1),
  tab: location.hash.split("/")[1] === "seminar" ? 4 : 0,
  selected: "app",
  step: -1,
  playing: false,
  sim: 0,
  answer: null,
  complete: new Set(Array.isArray(saved.complete) ? saved.complete : []),
};
let timer;
let budgetProvider = "aws";
const budgetScenarios = new Map();
const budgetScenario = () => budgetScenarios.get(lesson().id) ?? budgetDefaults(state.index);
const currentBudget = () => monthlyBudget(state.index, budgetScenario(), budgetProvider);
const lesson = () => LESSONS[state.index];
function persist() {
  try {
    localStorage.setItem(
      "architecture-growth-v1",
      JSON.stringify({ index: state.index, complete: [...state.complete] }),
    );
  } catch {}
}
function sourceLinks(keys) {
  return keys
    .map((key) => {
      const s = SOURCES[key];
      return `<a class="source-link" href="${s[1]}" target="_blank" rel="noopener noreferrer"><span>${s[0]}</span><small>${s[2]}</small><span aria-hidden="true">↗</span></a>`;
    })
    .join("");
}
function sidebar() {
  let currentGroup = "";
  $("#sidebar").innerHTML =
    `<a class="brand" href="#one-server" aria-label="返回第一阶段"><span class="brand-mark"><i></i><i></i><i></i></span><span>架构生长<span class="brand-sub">一间小店的服务器进化史</span></span></a><div class="route-intro"><span>课程路线</span><span>15 个阶段</span></div><nav>${LESSONS.map(
      (l, i) => {
        let heading = "";
        if (currentGroup !== l.group) {
          currentGroup = l.group;
          heading = `<div class="nav-group">${l.group}</div>`;
        }
        return (
          heading +
          `<button class="nav-item ${i === state.index ? "active" : ""} ${state.complete.has(l.id) ? "complete" : ""}" data-go="${i}" ${i === state.index ? 'aria-current="page"' : ""}><span class="nav-number">${state.complete.has(l.id) ? "✓" : String(i + 1).padStart(2, "0")}</span><span>${l.short}</span>${i === state.index ? '<i class="nav-dot"></i>' : ""}</button>`
        );
      },
    ).join(
      "",
    )}</nav><div class="sidebar-bottom"><div><span>你的学习进度</span><strong>${state.complete.size} / 15</strong></div><div class="progress-track"><i style="width:${(state.complete.size / 15) * 100}%"></i></div><p>每次理解一点，架构就清楚一点。</p></div>`;
}
function positions(l) {
  if (l.nodes.includes("control"))
    return {
      user: [25, 170],
      lb: [220, 170],
      service: [420, 170],
      pods: [620, 170],
      data: [860, 50],
      control: [420, 30],
      observe: [620, 30],
      queue: [860, 180],
      worker: [860, 280],
      cdn: [220, 365],
      object: [860, 375],
    };
  if (l.nodes.includes("catalog"))
    return {
      user: [25, 160],
      lb: [220, 160],
      catalog: [420, 90],
      order: [420, 235],
      data: [650, 85],
      queue: [650, 235],
      worker: [860, 235],
      cdn: [220, 365],
      object: [860, 365],
      observe: [650, 365],
      image: [650, 365],
    };
  if (l.nodes.length <= 5)
    return {
      user: [30, 160],
      edge: [245, 160],
      app: [460, 160],
      db: [810, 95],
      files: [810, 265],
      object: [810, 265],
    };
  return {
    user: [25, 160],
    lb: [220, 160],
    edge: [220, 160],
    app: [420, l.nodes.includes("app2") ? 95 : 160],
    app2: [420, 235],
    db: [650, 160],
    cache: [650, 30],
    replica: [860, 30],
    standby: [860, 130],
    queue: [650, 285],
    worker: [860, 245],
    cdn: [220, 365],
    object: [860, 365],
    observe: [420, 365],
  };
}
function nodeName(id, l) {
  if (id === "app" && l.nodes.includes("app2")) return "网店程序 A";
  if (id === "app" && state.index > 5) return "多份网店程序";
  return PARTS[id].name;
}
function graph(l) {
  const pos = positions(l),
    w = 160,
    h = 68;
  const paths = l.edges
    .map(([a, b]) => {
      const [ax, ay] = pos[a],
        [bx, by] = pos[b];
      let d;
      if (Math.abs(ay - by) < 8) d = `M ${ax + w} ${ay + h / 2} H ${bx}`;
      else if (a === "edge" && b === "files")
        d = `M ${ax + w / 2} ${ay + h} V ${by + h / 2} H ${bx}`;
      else if (a === "user" && b === "object")
        d = `M ${ax + w / 2} ${ay + h} V 435 H ${bx + w / 2} V ${by + h}`;
      else if (ax === bx) d = `M ${ax + w / 2} ${ay + h} V ${by}`;
      else {
        const end = bx > ax ? bx : bx + w,
          start = bx > ax ? ax + w : ax;
        const mid = (start + end) / 2;
        d = `M ${start} ${ay + h / 2} H ${mid} V ${by + h / 2} H ${end}`;
      }
      const control = a === "control" || a === "observe" || b === "observe";
      return `<path class="connector ${control ? "management" : ""}" data-from="${a}" data-to="${b}" d="${d}" marker-end="url(#arrow)"/>`;
    })
    .join("");
  return `<div class="diagram-heading"><div><span class="status-dot"></span><h2>当前架构</h2><span class="diagram-counter">阶段 ${String(state.index + 1).padStart(2, "0")}</span></div><span>点击组件，查看它负责什么</span></div><div class="diagram-scroll"><div class="diagram-canvas" role="group" aria-label="${escapeHtml(l.focus)}结构图"><svg class="wires" viewBox="0 0 1060 465" aria-hidden="true"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8aaca7"/></marker></defs>${l.boundary ? '<rect class="server-boundary" x="228" y="76" width="785" height="283" rx="16"/><text x="250" y="103" class="boundary-label">同一台云服务器 · 共享处理器、内存与磁盘</text>' : ""}${paths}</svg>${l.nodes
    .map((id) => {
      const p = PARTS[id];
      return `<button class="graph-node type-${p.type} ${l.added.includes(id) ? "new-node" : ""}" data-node="${id}" style="left:${(pos[id][0] / 1060) * 100}%;top:${(pos[id][1] / 465) * 100}%"><span class="node-icon">${icons[p.type]}</span><span class="node-label"><strong>${nodeName(id, l)}</strong><small>${p.en}</small></span>${l.added.includes(id) ? '<span class="new-tag">本页</span>' : ""}</button>`;
    })
    .join(
      "",
    )}</div></div><div class="diagram-legend"><span><i class="legend-line"></i> 请求或数据流向</span><span><i class="legend-new"></i> 本页引入或调整</span>${l.nodes.includes("control") || l.nodes.includes("observe") ? '<span><i class="legend-line dashed"></i> 管理与观测关系</span>' : ""}<button class="text-button" id="showAllGraph">查看完整系统</button></div><div id="inspector" class="inspector" aria-live="polite"></div>`;
}
function overview(l) {
  const budget = currentBudget();
  return `<div class="section-grid"><section class="story"><div class="section-label"><span class="mini-square"></span>营业现场</div><h2>这一阶段，小店发生了什么？</h2>${l.story.map((p) => `<p>${p}</p>`).join("")}<div class="question-strip"><strong>这次要面对的问题</strong><p>${l.problem}</p></div></section><aside class="change-note"><span class="note-pin">↳</span><h3>本页的架构选择</h3><p>${l.change}</p><div class="note-bottom">${l.server}<button id="showBudget" class="budget-jump">月费用约 ${billMoney(budget.totalCents)} <span aria-hidden="true">↓</span></button></div></aside></div><section class="architecture-panel">${graph(l)}</section>${deploymentPanel()}${budgetPanel(budget)}${state.index === 14 ? fullSystem() : ""}${simulator(l)}${state.index === 0 ? loadLab() : ""}<section class="inventory"><div class="section-label"><span class="mini-square"></span>组件清单</div><h2>当前完整组件清单，各管一件事。</h2><p class="inventory-note">架构图聚焦本阶段的主要路径；下面保留继续运行的组件。点击图中组件可查看输入、输出与职责。</p><div class="inventory-list">${currentComponents()
    .filter((id) => id !== "user")
    .map((id) => {
      const p = PARTS[id];
      return `<article><span class="inventory-icon type-${p.type}">${icons[p.type]}</span><div><h3>${nodeName(id, l)} <small>${p.en}</small></h3><p>${p.what}</p></div><span class="component-role">${l.added.includes(id) ? "本页加入 / 调整" : "继续使用"}</span></article>`;
    })
    .join(
      "",
    )}</div></section><div class="learning-note"><span>留意这个边界</span><p>${l.trap}</p></div>`;
}
function deploymentDetails(row) {
  const doc = SPEC_DOCS[row.doc];
  return `<details class="deployment-row">
    <summary>
      <span class="deployment-name">${row.name}</span>
      <span class="deployment-count">${row.count}</span>
      <span class="deployment-spec">${row.spec}</span>
    </summary>
    <div class="deployment-detail">
      <ul>${row.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
      ${doc ? `<a href="${doc[1]}" target="_blank" rel="noopener noreferrer">${doc[0]} ↗</a>` : ""}
    </div>
  </details>`;
}

function deploymentPanel() {
  return `<section class="deployment-panel" aria-labelledby="deployment-heading">
    <h2 id="deployment-heading">本阶段的部署配置</h2>
    <p>点开一项，看看它跑在哪里、资源怎么分。以下是青屿小店的教学配置，实际规格根据压测、数据增长和故障余量调整。vCPU 表示虚拟处理器核心数，GiB 表示内存大小。</p>
    <div class="deployment-list">${deploymentsFor(state.index).map(deploymentDetails).join("")}</div>
  </section>`;
}

function componentDeployment(id) {
  const rows = deploymentsFor(state.index).filter((row) => row.components.includes(id));
  if (!rows.length) return "";
  return `<section class="inspector-deployment" aria-label="组件部署配置">
    <h4>部署配置 <small>教学示例</small></h4>
    <div class="deployment-list">${rows.map(deploymentDetails).join("")}</div>
  </section>`;
}
function budgetGroups(budget, expanded = new Set()) {
  return budget.groups.map((group) => `<details class="budget-group" data-budget-group="${group.name}" ${expanded.has(group.name) ? "open" : ""}>
    <summary><span>${group.name}</span><strong>${billMoney(group.cents)}</strong></summary>
    <div class="budget-group-content">
      <p>${group.explanation}</p>
      ${group.charges.length ? `<ul class="budget-charges">
        ${group.charges.map((charge) => {
          const [label, url] = budget.sources[charge.source];
          return `<li>
            <div class="budget-charge-title"><strong>${charge.name}</strong><b>${billMoney(charge.cents)}</b></div>
            <div class="budget-equation">${billNumber(charge.quantity)} ${charge.unit} × $${charge.rate} / ${charge.unit}</div>
            ${charge.note ? `<p>${charge.note}</p>` : ""}
            <a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>
          </li>`;
        }).join("")}
      </ul>` : ""}
    </div>
  </details>`).join("");
}

function budgetAssumptions(budget) {
  return `<li>每天 ${billNumber(budget.dailyVisits)} 次访问 × ${BILL_DAYS} 天 × 每次 ${PAGES_PER_VISIT} 页，得到 ${billNumber(budget.pages)} 次业务响应。</li>
    <li>每页 ${IMAGES_PER_PAGE} 张图、每图 ${budget.imageKiB} KiB。合计 ${billNumber(budget.imageRequests)} 次图片请求，约 ${billNumber(budget.imageGb)} GB。每页业务响应平均 ${RESPONSE_KIB} KiB，另产生约 ${billNumber(budget.responseGb)} GB 出网。流量按 1 GB = 1,024² KiB 换算。</li>
    ${budget.hasCdn ? `<li>缓存命中率 ${budget.hitPercent}%，约 ${billNumber(budget.originRequests)} 次图片请求回到对象存储。CDN 给用户发送的总量仍按全部图片请求计算。</li>` : ""}
    <li>对象存储、备份和镜像的月均存量沿用本阶段假设。图片传输大小用于重算网络流量。</li>
    <li>固定实例每月运行 ${BILL_HOURS} 小时。估算采用所选厂商的公开计费规则，按账户尚有完整的常规月度免费额度计算，未计承诺折扣、新客赠金和税。${budget.isAli ? "阿里云镜像仓库企业版采用包月目录价。" : ""}</li>
    <li>域名、NAT 网关、私网端点、跨可用区流量、第三方短信与支付、额外监控服务和人工按实际部署另计。每条费用四舍五入到美分后合计。</li>`;
}

function budgetProviderSummary(budget) {
  return `${budget.isAli ? "阿里云新加坡（ap-southeast-1）" : "AWS 新加坡（ap-southeast-1）"} · USD · ${PRICE_CHECK_DATE} 核对`;
}

function budgetControls(scenario, budget) {
  const machines = budgetMachineRows(state.index);
  return `<div class="budget-controls">
    <div class="budget-control-heading"><h3>调整用量</h3><button type="button" id="resetBudget" class="secondary-button">恢复本阶段默认</button></div>
    <div class="budget-input-grid">
      <label>云厂商<select id="budgetProvider"><option value="aws" ${budgetProvider === "aws" ? "selected" : ""}>AWS</option><option value="ali" ${budgetProvider === "ali" ? "selected" : ""}>阿里云</option></select></label>
      <label>每天访问量（次）<input data-budget-field="dailyVisits" type="number" min="0" max="100000000" step="1" required value="${scenario.dailyVisits}"></label>
      <label>单张图片传输大小（KiB）<input data-budget-field="imageKiB" type="number" min="1" max="102400" step="1" required value="${scenario.imageKiB}"></label>
      <label>CDN 缓存命中率（%）<input data-budget-field="hitPercent" type="number" min="0" max="100" step="1" required value="${scenario.hitPercent}" ${budget.hasCdn ? "" : "disabled"}></label>
    </div>
    ${budget.hasCdn ? "" : '<p class="budget-input-help">本阶段还没有 CDN，命中率会在接入 CDN 的阶段启用。</p>'}
    <details class="budget-machines" ${machines.length < 3 ? "open" : ""}>
      <summary>服务器台数</summary>
      <div class="budget-input-grid">${machines.map(row => `<label>${row.name}<input aria-label="${row.name}台数" data-budget-machine="${row.key}" type="number" min="0" max="10000" step="1" required value="${scenario.counts[row.key]}"><small>${row.spec} · 默认 ${row.instances} 台</small></label>`).join("")}</div>
      <p class="budget-input-help">各组台数用于费用估算。数据库数量按本阶段的部署配置计。</p>
    </details>
    <p id="budgetInputError" role="status" class="budget-input-error" hidden>请输入范围内的整数。账单暂用上一笔有效输入。</p>
  </div>`;
}

function budgetPanel(budget) {
  return `<section class="budget-panel" id="monthly-budget" tabindex="-1" aria-labelledby="budget-heading">
    <div class="budget-header">
      <div><h2 id="budget-heading">每月云费用估算</h2><p id="budgetProviderSummary">${budgetProviderSummary(budget)}</p></div>
      <div class="budget-total"><strong aria-live="polite">${billMoney(budget.totalCents)}</strong><small>合计 · 美元 / 30 天，未税</small></div>
    </div>
    ${budgetControls(budgetScenario(), budget)}
    <details class="budget-assumptions"><summary>用量假设与计费范围</summary><ul>${budgetAssumptions(budget)}</ul></details>
    <div class="budget-groups">${budgetGroups(budget)}</div>
  </section>`;
}

function refreshBudget() {
  const budget = currentBudget();
  const expanded = new Set([...document.querySelectorAll(".budget-group[open]")].map(row => row.dataset.budgetGroup));
  $(".budget-total strong").textContent = billMoney(budget.totalCents);
  $("#budgetProviderSummary").textContent = budgetProviderSummary(budget);
  $(".budget-assumptions ul").innerHTML = budgetAssumptions(budget);
  $(".budget-groups").innerHTML = budgetGroups(budget, expanded);
  $("#showBudget").innerHTML = `月费用约 ${billMoney(budget.totalCents)} <span aria-hidden="true">↓</span>`;
}

function resetBudget() {
  budgetScenarios.delete(lesson().id);
  const defaults = budgetScenario();
  for (const field of document.querySelectorAll("[data-budget-field], [data-budget-machine]")) {
    const { budgetField, budgetMachine } = field.dataset;
    field.value = budgetField ? defaults[budgetField] : defaults.counts[budgetMachine];
  }
  $("#budgetInputError").hidden = true;
  refreshBudget();
}

document.addEventListener("input", (event) => {
  const { budgetField, budgetMachine } = event.target.dataset;
  if (!budgetField && !budgetMachine) return;
  $("#budgetInputError").hidden = !document.querySelector(".budget-controls input:invalid");
  if (!event.target.validity.valid) return;
  const scenario = budgetScenario();
  if (budgetField) scenario[budgetField] = event.target.valueAsNumber;
  else scenario.counts[budgetMachine] = event.target.valueAsNumber;
  budgetScenarios.set(lesson().id, scenario);
  refreshBudget();
});

document.addEventListener("change", (event) => {
  if (event.target.id !== "budgetProvider") return;
  budgetProvider = event.target.value;
  refreshBudget();
});
function simulator(l) {
  return `<section class="simulator"><div class="sim-title"><div class="section-label"><span class="mini-square"></span>试着改变现场</div><h2>如果现在发生这件事……</h2><p>选择一种情况，观察这套架构的反应。</p></div><div class="sim-body"><div class="scenario-buttons">${l.sim.map((s, i) => `<button data-sim="${i}" class="scenario ${i === state.sim ? "selected" : ""}" aria-pressed="${i === state.sim}">${s[0]}</button>`).join("")}</div><div id="simResult" class="sim-result" aria-live="polite"></div><div class="sim-footnote">概念实验 · 情况与数值为教学设定，结果用于理解因果</div></div></section>`;
}
function flow(l) {
  return `<div class="flow-intro"><div><div class="section-label"><span class="mini-square"></span>把镜头拉近</div><h2>跟着一次操作，逐步走过系统。</h2><p>点击播放或逐步前进。发亮的组件对应正在发生的工作。</p></div><span class="flow-count">${l.steps.length} 个步骤</span></div><section class="architecture-panel">${graph(l)}</section><div class="playback"><button class="primary-button" id="playButton">▶ 播放一次请求</button><button class="secondary-button" id="backStep">上一步</button><button class="secondary-button" id="nextStep">下一步</button><button class="text-button" id="resetStep">重置</button><span id="stepCount" aria-live="polite">尚未开始</span></div><div class="steps">${l.steps.map(([id, title, text], i) => `<button class="request-step" data-step="${i}"><span class="step-number">${i + 1}</span><span><span class="step-location">${nodeName(id, l)}</span><strong>${title}</strong><span class="step-description">${text}</span></span><span class="step-check">↘</span></button>`).join("")}</div>${returnJourney(l)}${l.id === "load-balancer" ? requestLab() : stageRequestLab(l)}`;
}
function tradeoffs(l) {
  return `<div class="section-label"><span class="mini-square"></span>一次有代价的选择</div><h2 class="section-title">为什么现在改，改完又要操心什么？</h2><div class="comparison"><article><span>改造之前</span><h3>原来的工作方式</h3><p>${l.before}</p></article><div class="comparison-arrow">⇢</div><article><span>改造之后</span><h3>这一步带来的变化</h3><p>${l.after}</p></article></div><div class="trade-grid"><section><h2><span class="round-icon">＋</span>需要付出的代价</h2><ul class="detail-list">${l.costs.map((p) => `<li>${p}</li>`).join("")}</ul></section><section><h2><span class="round-icon">◎</span>应该盯住哪些信号</h2><ul class="detail-list">${l.watch.map((p) => `<li>${p}</li>`).join("")}</ul></section></div><section class="decision"><div class="decision-symbol">↗</div><div><h2>什么时候值得走这一步？</h2><p>${l.threshold}</p><small>本页规模帮助你代入故事。真正的引入时机要根据负载测试、故障要求与维护能力判断。</small></div></section><section class="project-structure"><div class="section-label"><span class="mini-square"></span>项目与部署结构</div><h2>代码放在哪里，运行时又在哪里？</h2><div class="structure-columns"><pre>${escapeHtml(projectTree(state.index))}</pre><div><h3>沿着这三个问题检查</h3><p><strong>程序版本</strong><br>${state.index >= 11 ? "程序经过构建与测试进入镜像仓库，再由机器或集群启动。" : "网店代码先在测试环境验证，再部署到程序机器。"}</p><p><strong>业务数据</strong><br>${state.index >= 2 ? "订单等记录保存在独立数据库，权限与备份单独维护。" : "订单等记录暂存在本机数据库，备份存到另一处。"}</p><p><strong>图片文件</strong><br>${state.index >= 3 ? "对象存储保存原始文件。" + (state.index >= 4 ? "CDN 按缓存规则交付副本。" : "浏览器按授权地址读取。") : "图片在本机目录，数据库保存关联路径。"}</p></div></div></section>`;
}
function projectTree(index) {
  if (index < 10)
    return `qingyu-shop/\n├─ web/             页面与交互\n├─ server/          网店程序\n│  ├─ catalog/      商品模块\n│  ├─ cart/         购物车模块\n│  └─ orders/       订单模块\n├─ migrations/      数据库变更记录\n${index >= 7 ? "├─ workers/         后台任务处理\n" : ""}├─ config/          环境配置模板\n└─ ops/             部署、备份与恢复说明\n\n运行位置\n${index >= 2 ? "程序服务器 ←内部网络→ 独立数据库" : "接待处、程序、数据库都在同一台机器"}\n${index >= 3 ? "文件 → 独立对象存储" : "文件 → 本机图片目录"}\n\n仅展示结构，密钥在受控环境中提供。`;
  return `qingyu-platform/\n├─ services/\n│  ├─ catalog/      商品服务${index >= 11 ? " + Dockerfile" : ""}\n│  └─ orders/       订单服务${index >= 11 ? " + Dockerfile" : ""}\n├─ workers/         后台工人${index >= 11 ? " + Dockerfile" : ""}\n├─ web/             顾客页面\n├─ contracts/       服务接口与事件约定\n├─ migrations/      数据库变更记录\n├─ pipelines/       构建、测试、发布\n└─ deploy/\n${index >= 12 ? "   ├─ workloads/    镜像、资源与副本配置\n   ├─ services/     稳定访问入口\n   └─ policies/     权限、探测与扩容规则" : index >= 11 ? "   └─ containers/   版本与运行配置" : "   └─ services/     独立服务的部署配置"}\n\n数据 → 外部数据库、缓存、对象存储\n密钥 → 受控配置渠道，避免写进镜像`;
}
function review(l) {
  const q = l.quiz;
  return `<div class="review-grid"><section class="quiz-panel"><div class="section-label"><span class="mini-square"></span>停下来想一想</div><h2>${q[0]}</h2><fieldset><legend class="sr-only">选择你的答案</legend>${q[1].map((a, i) => `<button class="answer" data-answer="${i}"><span>${String.fromCharCode(65 + i)}</span>${a}</button>`).join("")}</fieldset><div id="answerResult" aria-live="polite"></div></section><aside class="takeaway"><div class="section-label">带走一个判断</div><h3>${l.focus}</h3><p>${l.threshold}</p><button class="secondary-button" id="markComplete">${state.complete.has(l.id) ? "✓ 已标记学懂" : "标记这页已学懂"}</button></aside></div><section class="case-study"><div class="section-label"><span class="mini-square"></span>现实世界里的线索</div><h2>${l.caseSource ? "看看公开披露的实际做法" : "把模型与原始资料对起来"}</h2><p>${l.caseText}</p>${l.caseSource ? sourceLinks([l.caseSource]) : ""}</section><section class="sources"><h2>本页资料与进一步阅读</h2><p>技术解释于 2026 年 11 月 11 日对照官方资料核对。持续更新的文档没有统一发布日期，企业案例单独标注披露时间。</p>${sourceLinks(l.sources)}<div class="source-notice">企业案例反映公开披露的范围。规模、流程与架构模型均属于青屿小店的教学设定。后续学习涉及新版本和新实践时，需要再次核对资料。</div></section>`;
}
function render(scroll = true) {
  stopPlayback();
  resetLoad();
  const l = lesson();
  state.step = -1;
  state.selected = l.nodes.includes("app")
    ? "app"
    : l.nodes.includes("pods")
      ? "pods"
      : l.nodes[0];
  sidebar();
  $("#currentCrumb").textContent = l.short;
  $("#lesson").innerHTML =
    `<section class="lesson-header"><div class="lesson-meta"><span class="chapter-badge">阶段 ${String(state.index + 1).padStart(2, "0")}</span><span>${l.group}</span><span class="meta-divider"></span><span>${l.focus}</span></div><h1>${l.title}</h1><p class="lesson-subtitle">${l.subtitle}</p><div class="chapter-stamp" aria-hidden="true">${String(state.index + 1).padStart(2, "0")}<span>/ 15</span></div></section><div class="business-bar">${l.scale.map((s, i) => `<div><small>${l.scaleLabels[i]}</small><strong>${s}</strong></div>`).join("")}<div class="scale-note"><i>i</i><span>虚构业务规模<br>用于模拟成长过程</span></div></div><div class="lesson-tabs" role="tablist" aria-label="本阶段学习内容">${["业务与架构", "跟着请求走", "改造与代价", "自测与资料", "专题课"].map((t, i) => `<button role="tab" id="tab-${i}" aria-controls="tabContent" aria-selected="${state.tab === i}" tabindex="${state.tab === i ? 0 : -1}" data-tab="${i}" class="${state.tab === i ? "active" : ""}"><span>0${i + 1}</span>${t}</button>`).join("")}</div><div id="tabContent" class="tab-content" role="tabpanel" aria-labelledby="tab-${state.tab}">${[overview, flow, tradeoffs, review, seminar][state.tab](l)}</div><div class="lesson-navigation"><button class="prev-lesson secondary-button" id="prevLesson" ${state.index === 0 && state.tab === 0 ? "disabled" : ""}>← ${state.tab > 0 ? "上一页" : "上一阶段"}</button><div><span>把这一页理解透，再往前走。</span><button class="text-button" id="completeButton">${state.complete.has(l.id) ? "✓ 本页已学懂" : "标记已学懂"}</button></div><button class="primary-button" id="nextLesson">${state.tab < 4 ? "下一页 · " + ["", "请求演示", "改造取舍", "自测资料", "专题课"][state.tab + 1] + " →" : HANDBOOK[l.id] && (handbookPosition.get(l.id) || 0) < HANDBOOK[l.id].pages.length - 1 ? "下一节 · 专题课 →" : state.index === LESSONS.length - 1 ? "回到第一阶段" : "下一阶段 →"}</button></div>`;
  if ($("#inspector")) updateInspector();
  if ($("#simResult")) updateSimulation();
  updatePlayback();
  if (state.answer !== null && state.tab === 3) showAnswer(state.answer);
  persist();
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
}
function updateInspector() {
  const p = PARTS[state.selected];
  if (!$("#inspector")) return;
  $("#inspector").innerHTML =
    `<div class="inspector-title"><span class="inventory-icon type-${p.type}">${icons[p.type]}</span><div><small>组件说明</small><h3>${nodeName(state.selected, lesson())}</h3></div></div><div class="inspector-description"><p>${p.what}</p><small>${p.detail}</small></div><div class="io"><p><span>接收</span>${p.input}</p><p><span>交给 / 返回</span>${p.output}</p></div>${componentDeployment(state.selected)}`;
  document.querySelectorAll(".graph-node").forEach((n) => {
    n.classList.toggle("inspected", n.dataset.node === state.selected);
    n.setAttribute("aria-pressed", String(n.dataset.node === state.selected));
  });
}
function updateSimulation() {
  const s = lesson().sim[state.sim];
  const affected = SIM_EFFECTS[state.index][state.sim];
  document.querySelectorAll(".graph-node").forEach((n) => {
    n.classList.remove("scenario-ok", "scenario-warn", "scenario-bad");
    if (affected.includes(n.dataset.node)) n.classList.add("scenario-" + s[4]);
  });
  if (!$("#simResult")) return;
  $("#simResult").innerHTML =
    `<div class="sim-status ${s[4]}"><span class="signal-bars"><i></i><i></i><i></i><i></i></span><span>${s[1]}</span><strong>${s[2]}</strong></div><p>${s[3]}</p>`;
  document.querySelectorAll("[data-sim]").forEach((b) => {
    b.classList.toggle("selected", Number(b.dataset.sim) === state.sim);
    b.setAttribute("aria-pressed", String(Number(b.dataset.sim) === state.sim));
  });
}
function showAnswer(index) {
  state.answer = index;
  const q = lesson().quiz;
  document.querySelectorAll(".answer").forEach((b, i) => {
    b.classList.toggle("correct", i === q[2]);
    b.classList.toggle("incorrect", i === index && i !== q[2]);
    b.setAttribute("aria-pressed", String(i === index));
  });
  $("#answerResult").innerHTML =
    `<div class="answer-feedback ${index === q[2] ? "ok" : "warn"}"><strong>${index === q[2] ? "理解到位。" : "再沿着这条逻辑看一遍。"}</strong><p>${q[3]}</p></div>`;
}
function stopPlayback() {
  clearTimeout(timer);
  state.playing = false;
}
function updatePlayback() {
  const l = lesson(),
    active = state.step >= 0 ? l.steps[state.step][0] : null;
  document
    .querySelectorAll(".graph-node")
    .forEach((n) =>
      n.classList.toggle("flow-active", n.dataset.node === active),
    );
  document
    .querySelectorAll(".connector")
    .forEach((p) =>
      p.classList.toggle(
        "flow-active",
        state.step >= 0 &&
          (p.dataset.to === active || p.dataset.from === active),
      ),
    );
  document.querySelectorAll(".request-step").forEach((n, i) => {
    n.classList.toggle("current", i === state.step);
    n.classList.toggle("visited", i < state.step);
    n.setAttribute("aria-current", i === state.step ? "step" : "false");
  });
  if ($("#stepCount"))
    $("#stepCount").textContent =
      state.step < 0
        ? "尚未开始"
        : `第 ${state.step + 1} / ${l.steps.length} 步`;
  if ($("#playButton"))
    $("#playButton").textContent = state.playing
      ? "Ⅱ 暂停播放"
      : state.step === l.steps.length - 1
        ? "↻ 再播放一次"
        : "▶ 播放一次请求";
  if ($("#backStep")) $("#backStep").disabled = state.step <= 0;
  if ($("#nextStep"))
    $("#nextStep").disabled = state.step >= l.steps.length - 1;
}
function advance() {
  state.step++;
  state.selected = lesson().steps[state.step][0];
  updateInspector();
  if (state.step === lesson().steps.length - 1) state.playing = false;
  updatePlayback();
  if (state.playing) timer = setTimeout(advance, 2800);
}
function togglePlay() {
  if (state.playing) {
    stopPlayback();
    updatePlayback();
    return;
  }
  if (state.step >= lesson().steps.length - 1) state.step = -1;
  state.playing = true;
  advance();
}
function go(index) {
  state.index = index;
  state.tab = 0;
  state.sim = 0;
  state.answer = null;
  history.replaceState(null, "", `#${lesson().id}`);
  render();
  closeMenu();
}
function complete() {
  const id = lesson().id;
  state.complete.add(id);
  persist();
  sidebar();
  $("#completeButton").textContent = "✓ 本页已学懂";
  if ($("#markComplete")) $("#markComplete").textContent = "✓ 已标记学懂";
  $("#toast").textContent = "已保存这页的学习进度";
  $("#toast").classList.add("visible");
  setTimeout(() => $("#toast").classList.remove("visible"), 2200);
}
function closeMenu() {
  document.body.classList.remove("menu-open");
  $("#menuButton").setAttribute("aria-expanded", "false");
}
function changeTab(tab, focus = false) {
  state.tab = tab;
  history.replaceState(null, "", tab === 4 ? `#${lesson().id}/seminar/${(handbookPosition.get(lesson().id) || 0)+1}` : `#${lesson().id}`);
  render(false);
  if (focus) $(`#tab-${tab}`).focus();
}
document.addEventListener("click", (event) => {
  const b = event.target.closest("button");
  if (!b) return;
  if (b.dataset.go !== undefined) go(Number(b.dataset.go));
  else if (b.dataset.tab !== undefined) changeTab(Number(b.dataset.tab));
  else if (b.dataset.node) {
    state.selected = b.dataset.node;
    updateInspector();
  } else if (b.dataset.sim !== undefined) {
    state.sim = Number(b.dataset.sim);
    updateSimulation();
  } else if (b.dataset.step !== undefined) {
    stopPlayback();
    state.step = Number(b.dataset.step);
    state.selected = lesson().steps[state.step][0];
    updateInspector();
    updatePlayback();
  } else if (b.dataset.answer !== undefined)
    showAnswer(Number(b.dataset.answer));
  else
    switch (b.id) {
      case "resetBudget":
        resetBudget();
        break;
      case "showBudget":
        $("#monthly-budget").focus();
        break;
      case "loadStep":
        advanceLoad();
        break;
      case "loadReset":
        resetLoad();
        $("#arrivalRate").value = 20;
        $("#rateValue").textContent = 20;
        updateLoad();
        break;
      case "prevLesson":
        if (state.tab === 4 && HANDBOOK[lesson().id] && (handbookPosition.get(lesson().id) || 0) > 0) {
          handbookPosition.set(lesson().id, handbookPosition.get(lesson().id) - 1);
          render();
        } else if (state.tab > 0) {
          changeTab(state.tab - 1);
        } else if (state.index > 0) go(state.index - 1);
        break;
      case "nextLesson":
        if (state.tab === 4 && HANDBOOK[lesson().id] && (handbookPosition.get(lesson().id) || 0) < HANDBOOK[lesson().id].pages.length - 1) {
          handbookPosition.set(lesson().id, (handbookPosition.get(lesson().id) || 0) + 1);
          render();
        } else if (state.tab < 4) {
          changeTab(state.tab + 1);
        } else go((state.index + 1) % LESSONS.length);
        break;
      case "completeButton":
      case "markComplete":
        complete();
        break;
      case "playButton":
        togglePlay();
        break;
      case "nextStep":
      case "backStep":
        stopPlayback();
        state.step += b.id === "nextStep" ? 1 : -1;
        state.step = Math.min(
          Math.max(state.step, 0),
          lesson().steps.length - 1,
        );
        state.selected = lesson().steps[state.step][0];
        updateInspector();
        updatePlayback();
        break;
      case "resetStep":
        stopPlayback();
        state.step = -1;
        updatePlayback();
        break;
      case "menuButton":
        document.body.classList.toggle("menu-open");
        b.setAttribute(
          "aria-expanded",
          String(document.body.classList.contains("menu-open")),
        );
        break;
      case "overviewButton":
      case "showAllGraph":
        go(LESSONS.length - 1);
        break;
    }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
  const tab = event.target.closest('[role="tab"]');
  if (tab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 4
          : (state.tab + (event.key === "ArrowRight" ? 1 : 4)) % 5;
    changeTab(next, true);
  }
});
$("#mobileShade").addEventListener("click", closeMenu);
window.addEventListener("hashchange", () => {
  const [id, section, rawPage] = location.hash.slice(1).split("/");
  const i = LESSONS.findIndex((l) => l.id === id);
  if (i >= 0) {
    state.index=i; state.tab=section === "seminar" ? 4 : 0;
    if(HANDBOOK[id]) handbookPosition.set(id, Math.min(Math.max((Math.floor(Number(rawPage))||1)-1,0),HANDBOOK[id].pages.length-1));
    state.answer=null; state.sim=0; render(); closeMenu();
  }
});
function fullSystem() {
  return `<section class="full-system"><div class="section-label"><span class="mini-square"></span>完整部署结构 · 逻辑示意</div><h2>展开汇总节点，看每个东西的实际位置。</h2><p>下面展示概念职责，不把每个框当成独立代理。Service 的实际转发方式依部署实现；专题课提供直达 Pod 和双层入口两种具体图。数据库、缓存和队列各自独立。</p><div class="system-lane"><span class="lane-label">图片路径</span><div class="system-route"><span>顾客浏览器</span><b>→</b><span>CDN 边缘副本</span><b>→<small>未命中时回源</small></b><span>对象存储<small>原始图片 / 文件</small></span></div></div><div class="system-lane"><span class="lane-label">交易路径</span><div class="system-route"><span>顾客浏览器</span><b>→</b><span>统一入口<small>HTTPS / 分流 / 限流</small></span><b>→</b><span>集群内 Service<small>稳定访问名字</small></span></div><div class="cluster-box"><div class="cluster-title">Kubernetes 工作机器组 <small>副本分散到不同机器，后台工人也可部署在集群内</small></div><div class="workload-row"><div><span>工作机器 A</span><strong>商品 Pod ①</strong><strong>订单 Pod ①</strong></div><div><span>工作机器 B</span><strong>商品 Pod ②</strong><strong>订单 Pod ②</strong></div><div><span>工作机器 C</span><strong>商品 Pod ③</strong><strong>后台工人 Pod</strong></div></div><div class="cluster-foot">Service 根据服务身份选择就绪的 Pod，再由网络转发机制交付请求。</div></div><div class="dependency-label">业务 Pod 根据操作访问下列外部服务 ↓</div><div class="data-platform"><article><h3>业务主库</h3><p>订单写入、关键读取</p><div>→ 只读副本 <small>允许滞后的查询</small></div><div>→ 备用实例 <small>复制；故障时按方案接替</small></div><div>→ 独立备份 <small>按恢复点找回数据</small></div></article><article><h3>Redis 缓存</h3><p>商品展示等可复用数据</p><div>未命中 → 程序查询数据库</div><div>修改后 → 处理旧副本</div></article><article><h3>消息队列</h3><p>缓冲后台任务</p><div>→ 工人领取与去重</div><div>→ 短信 / 邮件 / 文件</div><div>失败 → 重试与人工排查</div></article></div></div><div class="system-lane management-lane"><span class="lane-label">运行与交付</span><div class="management-grid"><article><h3>构建与镜像仓库</h3><p>代码 → 测试与构建 → 镜像 → 部署配置</p></article><article><h3>K8s 控制平面</h3><p>期望状态 → 调度、补副本、更新 → 工作机器</p></article><article><h3>监控、日志与追踪</h3><p>收集各层信号 → 发现影响 → 关联请求 → 定位与告警</p></article></div></div></section>`;
}
const SIM_EFFECTS = [
  [
    ["app", "db"],
    ["app", "db"],
    ["edge", "app", "db", "files"],
  ],
  [["db"], ["db"], ["app", "db"]],
  [["app", "db"], ["app", "db"], ["db"]],
  [["app", "object"], ["object"], ["app", "object"]],
  [["cdn", "object"], ["cdn"], ["cdn", "object"]],
  [
    ["app", "db"],
    ["app2", "db"],
    ["app", "app2", "lb"],
  ],
  [["cache", "db"], ["cache"], ["cache", "db"]],
  [["db", "queue"], ["queue", "worker"], ["worker"]],
  [["db"], ["replica"], ["db", "replica", "standby"]],
  [["queue", "worker", "observe"], ["lb"], ["db"]],
  [["catalog"], ["catalog", "order"], ["order", "queue"]],
  [["image", "catalog"], ["data"], ["order", "data"]],
  [
    ["control", "pods"],
    ["control", "pods"],
    ["service", "pods"],
  ],
  [["control", "pods"], ["service", "pods"], ["pods"]],
  [
    ["cdn", "object"],
    ["lb", "service", "pods", "data"],
    ["control", "pods"],
  ],
];

function currentComponents() {
  const index = state.index;
  let parts = ["edge", "app", "db", index >= 3 ? "object" : "files"];
  if (index >= 4) parts.push("cdn");
  if (index >= 5)
    parts = ["lb", ...parts.filter((id) => id !== "edge"), "app2"];
  if (index >= 6) parts.push("cache");
  if (index >= 7) parts.push("queue", "worker");
  if (index >= 8) parts.push("replica", "standby");
  if (index >= 9) parts.push("observe");
  if (index >= 10)
    parts = [
      ...parts.filter((id) => id !== "app" && id !== "app2"),
      "catalog",
      "order",
    ];
  if (index >= 11) parts.push("image");
  if (index >= 12)
    parts = [
      ...parts.filter((id) => id !== "catalog" && id !== "order"),
      "control",
      "service",
      "pods",
    ];
  return parts;
}

const loadState = { second: 0, queue: 0, processed: 0, arrivals: 0 };
function loadLab() {
  return `<section class="load-lab"><div class="section-label"><span class="mini-square"></span>亲手试一次流量增长</div><h2>每秒接到的工作，超过每秒能做的工作，会怎样？</h2><p>假设这台机器每秒最多完成 40 次请求。调节进入速度，再推进一秒，看看没做完的请求去了哪里。</p><div class="load-controls"><label for="arrivalRate">每秒进入 <output id="rateValue">20</output> 次请求</label><input id="arrivalRate" type="range" min="2" max="100" value="20" step="2"><div class="range-labels"><span>2 次 / 秒</span><span>100 次 / 秒</span></div></div><div class="load-visual"><div><span>累计进入</span><strong id="loadArrivals">0</strong><small>次请求</small></div><b>→</b><div class="machine-box"><span>单台服务器</span><strong>每秒最多 40 次</strong><div class="load-meter"><i id="loadFill"></i></div></div><b>→</b><div><span>累计完成</span><strong id="loadProcessed">0</strong><small>次请求</small></div><div class="queue-box"><span>还在排队</span><strong id="loadQueue">0</strong><small>次请求</small></div></div><div class="load-actions"><button class="primary-button" id="loadStep">推进 1 秒</button><button class="secondary-button" id="loadReset">重新开始</button><span id="loadTime">模拟时间 0 秒</span></div><p class="load-explanation" id="loadExplanation" aria-live="polite">先以每秒 20 次请求推进几秒，再调到 80。随后调回 20，观察已有积压如何消退。</p><small class="model-note">教学简化模型 · 请求处理成本相同、处理能力固定、不设置等待超时。真实容量需要压测，实际请求也可能因超时或队列满而失败。</small></section>`;
}
function resetLoad() {
  Object.assign(loadState, { second: 0, queue: 0, processed: 0, arrivals: 0 });
}
function advanceLoad() {
  const rate = Number($("#arrivalRate").value);
  const completed = Math.min(loadState.queue + rate, 40);
  loadState.second++;
  loadState.arrivals += rate;
  loadState.queue += rate - completed;
  loadState.processed += completed;
  updateLoad(completed);
}
function updateLoad(completed = 0) {
  if (!$("#loadQueue")) return;
  $("#loadArrivals").textContent = loadState.arrivals;
  $("#loadProcessed").textContent = loadState.processed;
  $("#loadQueue").textContent = loadState.queue;
  $("#loadTime").textContent = `模拟时间 ${loadState.second} 秒`;
  $("#loadFill").style.width = `${(completed / 40) * 100}%`;
  $(".queue-box").classList.toggle("has-queue", loadState.queue > 0);
  $("#loadExplanation").textContent =
    loadState.second === 0
      ? "先以每秒 20 次请求推进几秒，再调到 80。随后调回 20，观察已有积压如何消退。"
      : `第 ${loadState.second} 秒完成 ${completed} 次请求，还有 ${loadState.queue} 次在等。${loadState.queue > 0 ? "只要后续进入少于处理能力，多出来的处理余量就能逐步消化积压。" : "这一秒的工作已经处理完成。"}`;
}
document.addEventListener("input", (event) => {
  if (event.target.id === "arrivalRate")
    $("#rateValue").textContent = event.target.value;
});

render(false);
