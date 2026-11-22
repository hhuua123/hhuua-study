// 一条具体请求的往返实验；数字仅为可修改的教学假设。
function returnJourney(l) {
  const entry = l.nodes.includes('lb') ? '负载均衡入口' : '网站入口';
  const middle = l.nodes.includes('pods') ? '运行中的程序' : l.nodes.includes('catalog') ? '对应的业务程序' : '网店程序';
  const data = l.nodes.includes('data') ? '业务数据库' : '数据库';
  return `<section class="return-journey"><div class="section-label"><span class="mini-square"></span>补上回程</div><h2>结果怎样回到顾客手里？</h2><p>以读取订单为例：箭头是一次调用的方向，返回经过正在等待结果的调用者。</p><div class="journey-line"><span>顾客浏览器</span><b>→</b><span>${entry}</span><b>→</b><span>${middle}</span><b>→</b><span>${data}</span></div><div class="journey-line back"><span>顾客浏览器</span><b>←</b><span>${entry}</span><b>←</b><span>${middle}</span><b>←</b><span>${data}</span></div><p>${data}返回查询结果；${middle}检查权限并整理成响应；${entry}转发响应；浏览器收到后显示页面。${l.nodes.includes('cache') ? '如果缓存命中，程序可以直接从缓存拿到结果，本次未必访问数据库。' : ''} ${l.nodes.includes('cdn') ? '图片通常是浏览器另发请求，经 CDN 返回；未命中时再去对象存储取，和订单接口是两条不同的路。' : ''}</p><small>这是一次同步查询的简化示意；后台队列、重试和长连接可能有不同路径。实际前后台网络连接也不一定是同一条。</small></section>`;
}
function requestLab() {
 const rows = [
 ['浏览器准备连接','首次解析域名、建立连接和加密握手；连接及域名缓存复用时可能省略。','30'],
 ['浏览器 → 入口','请求在网络上传递，包含传播、排队及传输。','20'],
 ['入口处理与转发','解密后按规则找程序组，再选一个健康实例；含入口到程序的网络。','3'],
 ['程序处理','验证身份、检查参数、准备查询；不含数据库等待。','5'],
 ['程序 → 数据库','发送查询语句及参数；示例假设已复用数据库连接。','1'],
 ['数据库执行','根据条件查找允许读取的订单记录。','8'],
 ['数据库 → 程序','返回查询结果及状态。','1'],
 ['程序整理响应','生成状态码、响应头和 JSON 数据。','3'],
 ['程序 → 入口 → 浏览器','响应传回入口并发送给浏览器；包含网络传输。','22']
 ];
 return `<section class="deep-lab"><div class="section-label"><span class="mini-square"></span>入口拆解实验室 · 第 06 阶段</div><h2>一条 HTTPS 请求，拆开看清楚</h2><p class="deep-lead">顾客打开订单详情，浏览器向小店请求订单 123。下面约定：加密连接在负载均衡入口结束，入口转给程序 A，再由程序读取数据库。</p><div class="packet"><div><span>请求示例</span><strong>GET /api/orders/123</strong><small>HTTPS · shop.example.com</small></div><pre>Host: shop.example.com
Cookie: session=示例凭证
Accept: application/json
User-Agent: 浏览器信息</pre></div><p class="deep-note">HTTPS 是加密传输网页请求的方式。请求头是随请求附带的说明；路径表示要访问的资源。此示例 GET 一般没有请求正文。</p><div class="request-cards"><article><em>01 / 浏览器 → 入口</em><h3>先建立安全通道</h3><p>浏览器找到域名对应的地址并连接入口，验证证书后建立加密通道。入口解密后才能按 HTTP 内容分流；已建立的连接可以复用。</p>${stepDeep("load-balancer",0)}</article><article><em>02 / 入口 → 程序 A</em><h3>先找组，再选机器</h3><p>示例规则：域名是 shop.example.com 且路径以 /api/ 开头，交给订单程序组；组内按轮流分配选中健康的 A。未匹配则执行默认规则。B 是其他请求的候选，不参与本次返回。</p>${stepDeep("load-balancer",1)}</article><article><em>03 / 程序 A → 数据库</em><h3>业务程序才理解订单</h3><p>程序读取 Cookie 中的凭证并验证身份，检查顾客是否有权看订单 123，再向数据库发送带参数的查询。数据库执行查询并返回记录或未找到的结果。</p>${stepDeep("load-balancer",2)}</article><article><em>04 / 逐层返回</em><h3>原路把结果带回去</h3><p>数据库 → A：订单数据；A → 入口：例如 200 状态码、响应头和 JSON；入口 → 浏览器：转发响应并通过客户端的加密连接送出。浏览器根据结果显示订单。</p>${stepDeep("load-balancer",3)}</article></div><div class="header-explainer"><h3>入口究竟看了哪些信息？</h3><div class="header-grid"><div><strong>本例用于分流</strong><p>Host（访问哪个域名）和路径 /api/orders/123。路径和请求方法属于请求行，并非请求头。</p></div><div><strong>本例不用于分流</strong><p>Cookie、Accept、User-Agent：本例入口不按它们选择机器，通常交给程序使用；并不等于入口完全无法读取它们。</p></div><div><strong>可能改写或补充</strong><p>代理可按配置修改 Host 或增加 X-Forwarded-For（用于传递访问方地址）。不同产品默认不同；程序只能信任自己控制的代理提供的地址。</p></div><div><strong>规则可以改变</strong><p>例如云负载均衡可配置按请求头、请求方法或查询参数分流。入口本身不等于业务授权，是否能查看订单仍需程序判断。</p></div></div><p>入口到程序可以用 HTTP，也可以用 HTTPS 再加密；本例假设内网 HTTP。是否转发、删除或改写字段取决于具体产品与配置，不保证所有头原样通过。</p></div><div class="choice-table"><h3>这个入口可以用什么做？</h3><div><strong>Nginx</strong><span>自行部署的软件，可做 HTTPS 入口、反向代理和分流；灵活，但机器、配置、升级和故障切换需自己维护。</span></div><div><strong>阿里云 ALB / AWS ALB</strong><span>云厂商管理的应用型负载均衡，可按域名、路径等规则分流，减少入口基础设施维护；需要付费并受产品能力和配置限制。</span></div><div><strong>网络型负载均衡</strong><span>主要按连接信息分配连接，适合不需要按 HTTP 路径分流的场景；是否能终止加密或读取具体字段取决于产品和配置。</span></div></div><div class="latency-lab"><div class="latency-heading"><div><span>可调整的时间账本</span><h3>每一步花了多久？</h3><p>单位：毫秒。下面是虚构的串行示例，不是实测或厂商承诺。可输入自己的测量值。</p></div><div class="latency-total"><small>本次估算总耗时</small><strong id="latencyTotal">93 ms</strong></div></div><div class="latency-rows">${rows.map(([name,desc,value],i)=>`<label><span><strong>${name}</strong><small>${desc}</small></span><span class="latency-input"><input type="number" min="0" max="600000" step="1" value="${value}" data-latency="${i}" aria-label="${name}耗时（毫秒）"> ms</span></label>`).join('')}</div><div class="latency-footer"><button type="button" class="secondary-button" id="latencyReset">恢复示例</button><span id="latencyError" role="status">直接相加只适用于本例没有重叠的步骤；真实网络与并行操作不能简单累加。</span></div><p>想知道真实慢在哪：用浏览器网络面板看连接与等待时间，在入口、程序和数据库记录同一次请求的时间与标识。优先测量，再决定优化哪一段。</p></div><div class="deep-sources">资料核对：2026-11-11 · <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html" target="_blank" rel="noopener noreferrer">AWS 入口规则</a> · <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html" target="_blank" rel="noopener noreferrer">AWS 目标组与分配</a> · <a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener noreferrer">Nginx 请求头处理</a> · <a href="https://www.alibabacloud.com/help/en/slb/application-load-balancer/ascript-common-scenarios" target="_blank" rel="noopener noreferrer">阿里云 ALB 规则示例</a></div></section>`;
}
document.addEventListener('input', e => {
 if (!e.target.matches('[data-latency]')) return;
 const inputs = [...document.querySelectorAll('[data-latency]')];
 const valid = inputs.every(input => input.value !== '' && input.validity.valid);
 document.querySelector('#latencyTotal').textContent = valid ? `${inputs.reduce((sum,input)=>sum+input.valueAsNumber,0)} ms` : '—';
 document.querySelector('#latencyError').textContent = valid ? '直接相加只适用于本例没有重叠的步骤；真实网络与并行操作不能简单累加。' : '请为每一步输入 0 到 600000 的毫秒数。';
});
document.addEventListener('click', e => {
 if (e.target.id !== 'latencyReset') return;
 const defaults = [30,20,3,5,1,8,1,3,22];
 document.querySelectorAll('[data-latency]').forEach((input,i)=>{input.value=input.dataset.default ?? defaults[i]});
 document.querySelector('[data-latency]').dispatchEvent(new Event('input',{bubbles:true}));
});
