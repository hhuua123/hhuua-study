// 青屿小店的教学部署方案。只记录各阶段发生的变更。
const SPEC_DOCS = {
  nginx: [
    "Nginx 工作进程与连接参数",
    "https://nginx.org/en/docs/ngx_core_module.html#worker_connections",
  ],
  redis: [
    "Redis 内存上限与淘汰规则",
    "https://redis.io/docs/latest/develop/reference/eviction/",
  ],
  pods: [
    "Kubernetes 资源请求与上限",
    "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
  ],
  lb: [
    "托管负载均衡官方说明",
    "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html",
  ],
};

function deploymentRow(name, count, spec, components, details, doc) {
  const hardware = typeof spec === "string" ? null : spec;
  return {
    name,
    count: hardware
      ? `${Array.isArray(count) ? count.join("–") : count} 台`
      : count,
    instances: Array.isArray(count) ? count[0] : hardware ? count : null,
    spec: hardware ? hardware.label : spec,
    hardware,
    components,
    details,
    doc,
  };
}

const serverSpec = (cpu, ram, disk) => ({
  cpu,
  ram,
  disk,
  label: `${cpu} vCPU · ${ram} GiB 内存 · ${disk} GB SSD / 台`,
});
const nginxConnections =
  "示例参数为 worker_processes auto、worker_connections 1024。后者是每个工作进程可同时维护的连接数，也包含转发给业务程序的连接。";
const singleHost = (cpu, ram, disk, memoryPlan) =>
  deploymentRow(
    "一体服务器",
    1,
    serverSpec(cpu, ram, disk),
    ["edge", "app", "db", "files"],
    [
      "一台机器运行 Nginx、网店程序和 MySQL，商品图片也存在本机。四者共享 CPU、内存和磁盘。",
      memoryPlan,
      "系统、数据库、图片和日志使用同一块 SSD 的空间，备份另存到远端。",
      nginxConnections,
    ],
    "nginx",
  );

const appHosts = (count, cpu, ram, disk, components, purpose) =>
  deploymentRow(
    "网店程序服务器",
    count,
    serverSpec(cpu, ram, disk),
    components,
    [
      purpose,
      "本机磁盘用于系统、代码和日志。登录状态与订单写入独立数据库，图片上传到对象存储。",
    ],
  );

const dataHosts = (name, role, cpu, ram, disk, details) =>
  deploymentRow(name, 1, serverSpec(cpu, ram, disk), [role, "data"], details);

const podGroup = (name, count, components, request, limit, detail) =>
  deploymentRow(
    name,
    count,
    `每份申请 ${request} · 上限 ${limit}`,
    components,
    [
      "Pod 是 Kubernetes 安排运行的一份程序。本例每个 Pod 运行一个业务容器，资源申请是调度时预留的份额，上限用于限制实际使用。",
      detail,
      "临时日志与运行文件使用节点磁盘，持久业务数据保存到外部服务。",
    ],
    "pods",
  );

const DEPLOYMENT_CHANGES = {
  "one-server": {
    allInOne: singleHost(
      2,
      4,
      80,
      "内存预算示意为 MySQL 约 2 GiB、网店程序约 1 GiB，剩余约 1 GiB 留给系统、Nginx 和余量。CPU 在进程之间共享。",
    ),
    backup: deploymentRow(
      "远端备份空间",
      "1 项服务",
      "每日备份 · 保留 7 天",
      ["db", "files", "data"],
      [
        "每日保存数据库备份与图片备份，定期在独立环境验证可以恢复。保留天数随业务要求调整。",
      ],
    ),
  },
  "measure-first": {
    allInOne: singleHost(
      4,
      8,
      120,
      "本阶段先优化查询。压测仍显示单机资源紧张时，示例提升到 4 vCPU 和 8 GiB。内存暂按 MySQL 4 GiB、应用 2 GiB、系统和入口等 2 GiB 分配。",
    ),
  },
  database: {
    allInOne: null,
    app: deploymentRow(
      "网店程序服务器",
      1,
      serverSpec(4, 8, 120),
      ["edge", "app", "files"],
      [
        "Nginx 和网店程序仍在原机器，SSD 继续存放商品图片与日志。网店程序通过内网连接数据库。",
        nginxConnections,
      ],
      "nginx",
    ),
    db: dataHosts("独立 MySQL", "db", 4, 16, 150, [
      "只运行 MySQL。相较原来的单机方案，给常用数据页的内存缓冲和数据库连接留出更多空间，业务程序另用一台机器。",
      "示例把数据库常用数据的内存缓冲区设为约 10 GiB，并保留系统、连接和排序空间。",
    ]),
  },
  "object-storage": {
    app: deploymentRow(
      "网店程序服务器",
      1,
      serverSpec(4, 8, 120),
      ["edge", "app"],
      [
        "同机运行 Nginx 和网店程序。图片迁出后，磁盘主要用来放系统、代码与日志。",
        nginxConnections,
      ],
      "nginx",
    ),
    object: deploymentRow(
      "对象存储",
      "1 个存储桶",
      "已有文件约 100 GB · 按用量增长",
      ["object"],
      [
        "存储桶可以理解为云上的文件库。公开商品图和受保护文件分路径管理，主要关注实际存储量、上传下载次数和传输量。",
        "100 GB 指本阶段已存文件的示例体积。以后的实际用量随商品与媒体文件增加。",
      ],
    ),
    backup: deploymentRow(
      "远端备份空间",
      "1 项服务",
      "数据库每日备份 · 保留 7 天",
      ["db", "object", "data"],
      [
        "数据库独立备份。对象存储开启版本保留策略，结合独立副本应对误删，并定期演练恢复。",
      ],
    ),
  },
  cdn: {
    cdn: deploymentRow(
      "CDN 图片分发",
      "1 个分发配置",
      "1 个图片域名 · 缓存有效期示例 24 小时",
      ["cdn"],
      [
        "接入托管 CDN 后，服务商负责节点容量。这里配置图片域名、缓存规则和对象存储的回源地址。",
        "主图换版本就换文件名，公共图与私人文件分别设定缓存规则。关注命中比例、边缘流量和回源流量。",
      ],
    ),
  },
  "load-balancer": {
    lb: deploymentRow(
      "托管负载均衡",
      "1 个入口",
      "HTTPS 入口 · 健康检查 /health",
      ["lb"],
      [
        "服务商提供稳定入口并分流至 Nginx。课图中的统一入口把这一步与 Nginx 转发合在一起展示。",
        "可配置证书、后端目标组与健康检查。检查通过的 Nginx 实例参与接流量。",
      ],
      "lb",
    ),
    nginx: deploymentRow(
      "独立 Nginx 入口",
      2,
      serverSpec(2, 4, 40),
      ["lb", "edge"],
      [
        "从业务机拆出来，每台只运行 Nginx，接收托管入口转来的请求，再按规则转给各台网店程序。",
        nginxConnections,
        "两台分开放置。压测时要验证故障只剩一台入口时的连接数、带宽和响应延迟。",
      ],
      "nginx",
    ),
    app: appHosts(
      2,
      4,
      8,
      80,
      ["app", "app2"],
      "A 和 B 各运行一份相同的网店程序。表中的规格是每台机器的资源。",
    ),
  },
  cache: {
    app: appHosts(
      4,
      4,
      8,
      80,
      ["app", "app2"],
      "四台各跑一份网店程序。图中 A/B 用来示范请求会交给不同实例。",
    ),
    cache: deploymentRow(
      "独立 Redis 缓存",
      1,
      serverSpec(2, 4, 40),
      ["cache", "data"],
      [
        "只做商品展示缓存。示例把 maxmemory 设为 2 GiB，为系统和 Redis 的额外内存消耗留余量。",
        "示例采用 allkeys-lfu，内存紧张时优先移除较少访问的键。商品缓存的有效期暂设 5 分钟，库存和结算继续核对数据库。",
        "缓存故障时限制回源速度，避免所有查询同时涌入数据库。",
      ],
      "redis",
    ),
  },
  queue: {
    app: appHosts(
      6,
      4,
      8,
      80,
      ["app", "app2"],
      "业务机器负责浏览与下单。提交订单后，通知等后续工作经队列交给工人。",
    ),
    queue: deploymentRow(
      "托管消息队列",
      "2 条队列",
      "主队列 + 多次失败后待排查的队列",
      ["queue"],
      [
        "示例任务领取后隐藏 60 秒，给工人处理并确认的时间。处理较久的任务应调整等待时间或续期。",
        "任务消息用订单号和事件编号去重。队列服务按请求与积压等使用情况管理容量。",
      ],
    ),
    worker: deploymentRow(
      "后台工人服务器",
      2,
      serverSpec(2, 4, 60),
      ["worker"],
      [
        "每台从队列领取任务，负责短信、邮件或生成文件。处理并发按外部接口限额与实际耗时调整。",
      ],
    ),
  },
  "database-reliability": {
    db: dataHosts("MySQL 主库", "db", 8, 32, 500, [
      "接订单写入和必须即时可见的读取。示例内存缓冲区约 22 GiB，数据盘预留增长空间。",
    ]),
    replica: dataHosts("MySQL 只读副本", "replica", 8, 32, 500, [
      "接报表和允许短暂延迟的读请求。关注复制延迟、查询时间和磁盘空间。",
    ]),
    standby: dataHosts("MySQL 故障备用", "standby", 8, 32, 500, [
      "部署在另一个可用区。使用与主库相同的示例规格，为故障切换后接管主库业务做准备。",
    ]),
    backup: deploymentRow(
      "备份与恢复",
      "1 项服务",
      "每日快照 · 保留 14 天 · 支持按时间点恢复",
      ["db", "replica", "standby", "data"],
      [
        "快照保留当时的数据。示例用快照加变更日志，支持在保留周期内回到指定时间点。",
      ],
    ),
  },
  observe: {
    app: appHosts(
      10,
      4,
      8,
      80,
      ["app", "app2"],
      "入口统一标记请求编号，多份程序把关键指标与日志送到集中平台。",
    ),
    observe: deploymentRow(
      "集中观测服务器",
      1,
      serverSpec(4, 16, 300),
      ["observe"],
      [
        "统一收集指标、日志与链路记录。示例详细日志保留 7 天，指标保留 30 天。",
        "磁盘大小按每天实际写入量、压缩效果和保留时间调整。观测故障时，业务请求仍需能处理。",
      ],
    ),
  },
  services: {
    app: null,
    catalog: deploymentRow(
      "商品服务服务器",
      8,
      serverSpec(4, 8, 80),
      ["catalog"],
      ["每台运行一份商品程序，负责商品查询与列表读取。独立发布与扩容。"],
    ),
    order: deploymentRow(
      "订单服务服务器",
      6,
      serverSpec(4, 8, 80),
      ["order"],
      ["每台运行一份订单程序，负责价格库存校验、订单写入与发送后续事件。"],
    ),
    cache: deploymentRow(
      "Redis 主实例与复制实例",
      2,
      serverSpec(4, 16, 80),
      ["cache", "data"],
      [
        "一台提供缓存读写，另一台保存复制数据，用于故障切换。示例每台 maxmemory 为 8 GiB，主从存相同的数据，逻辑缓存容量按主实例计算。",
      ],
      "redis",
    ),
  },
  containers: {
    catalog: deploymentRow(
      "商品容器服务器",
      8,
      serverSpec(4, 8, 80),
      ["catalog"],
      [
        "每台运行两个商品容器，每份示例上限 1 vCPU、1 GiB。镜像一致，启动时注入各环境配置。",
      ],
    ),
    order: deploymentRow(
      "订单容器服务器",
      6,
      serverSpec(4, 8, 80),
      ["order"],
      [
        "每台运行两个订单容器，每份示例上限 1 vCPU、2 GiB。节点剩余资源用于系统、日志和运行余量。",
      ],
    ),
    image: deploymentRow(
      "托管镜像仓库",
      "1 项服务",
      "按服务存放镜像 · 每个服务保留最近 10 个普通版本",
      ["image"],
      [
        "记录每个发布版本的唯一镜像摘要，保留正在使用和用于回退的版本。关注镜像存储量与拉取耗时。",
      ],
    ),
  },
  kubernetes: {
    nginx: null,
    lb: deploymentRow(
      "托管集群入口",
      "1 个入口",
      "HTTPS · 业务端口与健康检查",
      ["lb", "service"],
      [
        "本阶段由云入口和集群的转发集成替代独立 Nginx 机器。Service 给各业务提供稳定的访问名称，入口将请求交给对应业务的就绪副本。",
      ],
      "lb",
    ),
    catalog: null,
    order: null,
    worker: null,
    control: deploymentRow(
      "Kubernetes 控制平面",
      "1 个托管集群",
      "调度、健康管理与发布由控制平面协调",
      ["control"],
      [
        "服务商负责管理控制平面的机器。课程给出下方工作节点的资源，并单列实际运行业务的 Pod 数量。",
      ],
    ),
    nodes: deploymentRow(
      "Kubernetes 工作节点",
      4,
      serverSpec(8, 32, 150),
      ["pods", "worker"],
      [
        "节点是实际运行 Pod 的机器。示例用每台约 7 vCPU 和 28 GiB 作为可分配资源，系统和集群组件保留其余部分。",
        "下方共 48 个业务与后台 Pod，按资源申请值合计约 20 vCPU、32 GiB，具体能否排下还要检查每台节点的余量和副本分布。",
      ],
      "pods",
    ),
    catalogPods: podGroup(
      "商品服务 Pod",
      "16 份",
      ["pods", "catalog"],
      "0.5 vCPU / 512 MiB",
      "1 vCPU / 1 GiB",
      "商品服务分散到多个节点。本章用 3 份做恢复演示，部署清单展示完整业务的 16 份。",
    ),
    orderPods: podGroup(
      "订单服务 Pod",
      "16 份",
      ["pods", "order"],
      "0.5 vCPU / 1 GiB",
      "1 vCPU / 2 GiB",
      "负责交易关键路径，另按下游数据库连接预算限制并发。",
    ),
    workerPods: podGroup(
      "后台工人 Pod",
      "16 份",
      ["worker"],
      "0.25 vCPU / 512 MiB",
      "0.5 vCPU / 1 GiB",
      "从队列领取通知和文件任务，按后台任务的积压时间调整副本。",
    ),
  },
  autoscaling: {
    nodes: deploymentRow(
      "Kubernetes 工作节点",
      [4, 6],
      serverSpec(8, 32, 150),
      ["pods", "worker"],
      [
        "日常保持 4 台，资源不足时节点扩容可增加到 6 台。给节点启动和镜像拉取留时间。",
        "订单达到 18 份时，示例业务与后台 Pod 的总申请约为 21 vCPU、34 GiB。还需要为滚动发布、节点故障和系统组件留出空间。",
      ],
      "pods",
    ),
    orderPods: podGroup(
      "订单服务 Pod",
      "6–18 份",
      ["pods", "order"],
      "0.5 vCPU / 1 GiB",
      "1 vCPU / 2 GiB",
      "6 份是日常下限，18 份是扩容上限。这里的 6–18 只对应订单服务，商品和后台工人各保持 16 份。",
    ),
  },
  "whole-system": {},
};

function deploymentsFor(lessonIndex) {
  const active = new Map();
  for (const { id } of LESSONS.slice(0, lessonIndex + 1)) {
    for (const [key, row] of Object.entries(DEPLOYMENT_CHANGES[id])) {
      if (row) active.set(key, { key, ...row });
      else active.delete(key);
    }
  }
  return [...active.values()];
}
