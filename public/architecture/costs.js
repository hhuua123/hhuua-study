// AWS 与阿里云新加坡价格，2026-11-11 核对。金额为 USD。
const PRICE_CHECK_DATE = "2026-11-11";
const AWS_REGION = "ap-southeast-1";
const AWS_OFFERS = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws";
const regionalPriceList = (service) =>
  `${AWS_OFFERS}/${service}/current/${AWS_REGION}/index.json`;

const BILL_SOURCES = {
  ec2: [
    "EC2 Linux 按需单价 · AWS 计算器价格表",
    "https://calculator.aws/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-calc/Asia%20Pacific%20%28Singapore%29/OnDemand/Shared/Linux/NA/No%20License%20required/Yes/index.json",
  ],
  ebs: [
    "EBS gp3 · AWS 计算器价格表",
    "https://calculator.aws/pricing/2.0/meteredUnitMaps/ec2/USD/current/ebs-calculator.json",
  ],
  db: ["RDS for MySQL · 新加坡价格表", regionalPriceList("AmazonRDS")],
  s3: ["S3 Standard · 新加坡价格表", regionalPriceList("AmazonS3")],
  cdn: [
    "CloudFront · 按量定价与免费量",
    "https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/",
  ],
  lb: ["应用负载均衡 · 新加坡价格表", regionalPriceList("AWSELB")],
  lcu: [
    "ALB 容量计费说明",
    "https://aws.amazon.com/elasticloadbalancing/pricing/",
  ],
  ipv4: ["公网 IPv4 · 新加坡价格表", regionalPriceList("AmazonVPC")],
  transfer: [
    "公网出网流量 · 新加坡价格表",
    regionalPriceList("AWSDataTransfer"),
  ],
  egressFree: [
    "AWS 公网出网免费额度",
    "https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer",
  ],
  queue: ["SQS Standard · 新加坡价格表", regionalPriceList("AWSQueueService")],
  image: ["ECR 镜像存储 · 新加坡价格表", regionalPriceList("AmazonECR")],
  eks: ["EKS · 标准支持版本定价", "https://aws.amazon.com/eks/pricing/"],
};

const BILL_RATES = {
  ec2: {
    "2/4": ["c7g.large", 0.0833],
    "4/8": ["c7g.xlarge", 0.1666],
    "4/16": ["m7g.xlarge", 0.204],
    "8/32": ["m7g.2xlarge", 0.408],
  },
  ebs: 0.096,
  rds: { 4: ["db.m7g.xlarge", 0.468], 8: ["db.m7g.2xlarge", 0.937] },
  rdsMultiAz: 1.874,
  rdsDisk: 0.138,
  rdsMultiAzDisk: 0.276,
  s3Storage: 0.025,
  s3Get: 0.004, // 每万次
  s3Put: 0.005, // 每千次
  cloudFrontData: [
    [1024, 0],
    [9 * 1024, 0.12],
    [40 * 1024, 0.1],
    [100 * 1024, 0.095],
    [350 * 1024, 0.09],
    [524 * 1024, 0.08],
    [4 * 1024 ** 2, 0.07],
    [Infinity, 0.06],
  ],
  cloudFrontHttps: 0.012, // 每万次
  internetOut: [
    [100, 0],
    [10 * 1024, 0.12],
    [40 * 1024, 0.085],
    [100 * 1024, 0.082],
    [Infinity, 0.08],
  ],
  ipv4: 0.005,
  lbHour: 0.0252,
  lbLcu: 0.008,
  sqs: 0.4, // 每百万次
  ecr: 0.1,
  eks: 0.1,
};

// 阿里云国际站新加坡询价。ECS、RDS、ACR 采用官方计算器返回的目录价。
const ALI_CALCULATOR = "https://www.alibabacloud.com/en/pricing-calculator";
const ALI_SOURCES = {
  ec2: ["阿里云 ECS 官方询价", ALI_CALCULATOR],
  ebs: ["阿里云 ESSD PL1 官方询价", ALI_CALCULATOR],
  db: ["阿里云 RDS MySQL 官方询价", ALI_CALCULATOR],
  s3: [
    "OSS 新加坡价目表",
    "https://www.alibabacloud.com/en/product/oss/pricing?_p_lc=1",
  ],
  cdn: [
    "阿里云 CDN 亚太一区流量价目表",
    "https://www.alibabacloud.com/help/en/cdn/product-overview/billing-rules-of-basic-services",
  ],
  cdnRequest: [
    "阿里云 CDN 静态 HTTPS 请求单价",
    "https://www.alibabacloud.com/help/en/cdn/product-overview/billing-of-https-requests-for-static-content",
  ],
  lb: [
    "阿里云 ALB 实例和容量单价",
    "https://www.alibabacloud.com/help/en/slb/application-load-balancer/alb-billing-rules",
  ],
  ipv4: [
    "新加坡 EIP 公网 IP 保有费",
    "https://www.alibabacloud.com/help/en/eip/product-overview/billing-announcement-announcement-on-adjustment-of-eip-public-network-ip-preservation-fee-unit-price-in-some-regions",
  ],
  ipv4Free: [
    "EIP 绑定 ECS 的免收费条件",
    "https://www.alibabacloud.com/help/en/eip/pay-as-you-go/",
  ],
  transfer: [
    "CDT 亚太公网流量价目表",
    "https://www.alibabacloud.com/help/en/cdt/internet-data-transfers",
  ],
  queue: [
    "SMQ（原 MNS）新加坡价格",
    "https://www.alibabacloud.com/help/en/mns/product-overview/billing-overview",
  ],
  imageQuote: ["ACR 企业版官方询价", ALI_CALCULATOR],
  eks: [
    "ACK Pro 控制平面价格",
    "https://www.alibabacloud.com/help/en/ack/ack-managed-and-ack-dedicated/product-overview/ack-pro-cluster-billing",
  ],
};

const ALI_RATES = {
  ec2: {
    "2/4": ["ecs.c8y.large", 0.0785],
    "4/8": ["ecs.c8y.xlarge", 0.157],
    "4/16": ["ecs.g8y.xlarge", 0.1922],
    "8/32": ["ecs.g8y.2xlarge", 0.3844],
  },
  ebs: 0.182304, // 0.0002532 USD/GB·小时 × 720 小时
  rds: { 4: ["mysql.n4.large.1", 0.2504], 8: ["mysql.n4.xlarge.1", 0.5008] },
  rdsHaModel: "mysql.x4.xlarge.2c",
  rdsMultiAz: 1.4424,
  rdsDisk: 0.36, // 0.0005 USD/GB·小时 × 720 小时
  rdsMultiAzDisk: 0.576, // 0.0008 USD/GB·小时 × 720 小时
  s3Storage: 0.017,
  s3Get: 0.001,
  s3Put: 0.0014,
  cloudFrontData: [
    [50 * 1024, 0.081],
    [50 * 1024, 0.062],
    [924 * 1024, 0.053],
    [Infinity, 0.048],
  ],
  cloudFrontHttps: 0.008,
  internetOut: [
    [200, 0],
    [10 * 1024 - 200, 0.1],
    [40 * 1024, 0.07],
    [100 * 1024, 0.065],
    [Infinity, 0.055],
  ],
  ossOut: [
    [100, 0],
    [10 * 1024 - 100, 0.08],
    [40 * 1024, 0.072],
    [100 * 1024, 0.068],
    [Infinity, 0.063],
  ],
  ipv4: 0.005,
  lbHour: 0.021,
  lbLcu: 0.007,
  sqs: 0.46,
  queueDay: 0.11,
  acr: 146,
  acrVpc: 11,
  eks: 0.09,
};

const BILL_DAYS = 30;
const BILL_HOURS = BILL_DAYS * 24;
const PAGES_PER_VISIT = 3;
const IMAGES_PER_PAGE = 4;
const IMAGE_KIB = 128;
const RESPONSE_KIB = 8;
const REQUEST_KIB = 2;
const CDN_HIT = 0.9;
const CDN_REQUESTS_FREE = 10_000_000;

// 每阶段的日访问量、月均商品文件、远端备份和镜像存量。容量单位为 GB。
const BILL_USAGE = {
  "one-server": [100, 0, 12, 0],
  "measure-first": [1_000, 0, 24, 0],
  database: [3_000, 0, 55, 0],
  "object-storage": [8_000, 100, 60, 0],
  cdn: [20_000, 160, 75, 0],
  "load-balancer": [50_000, 220, 85, 0],
  cache: [100_000, 300, 100, 0],
  queue: [200_000, 450, 125, 0],
  "database-reliability": [300_000, 600, 250, 0],
  observe: [500_000, 800, 350, 0],
  services: [800_000, 1_200, 450, 0],
  containers: [1_000_000, 1_800, 550, 20],
  kubernetes: [1_500_000, 2_400, 650, 30],
  autoscaling: [2_000_000, 3_200, 800, 40],
  "whole-system": [2_000_000, 3_200, 800, 40],
};

const BILL_NUMBER = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 6,
});
const BILL_MONEY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const billNumber = (number) => BILL_NUMBER.format(number);
const billMoney = (cents) => BILL_MONEY.format(cents / 100);
const billGb = (requests, sizeKiB) => (requests * sizeKiB) / 1024 ** 2;

function billCharge(name, quantity, unit, rate, source, note = "") {
  return {
    name,
    quantity,
    unit,
    rate,
    source,
    note,
    cents: Math.round(quantity * rate * 100),
  };
}

function billTiers(name, quantity, unit, tiers, source, freeSource = source) {
  const charges = [];
  let remaining = quantity;
  for (const [limit, rate] of tiers) {
    const volume = Math.min(remaining, limit);
    if (!volume) break;
    charges.push(
      billCharge(
        `${name} · ${rate ? `第 ${charges.length + 1} 档` : "月度免费量"}`,
        volume,
        unit,
        rate,
        rate ? source : freeSource,
        Number.isFinite(limit)
          ? `本档最多 ${billNumber(limit)} ${unit}。按顺序分段计费。`
          : "超过前面档位的部分。",
      ),
    );
    remaining -= volume;
  }
  if (remaining > 0) throw new Error(`超出已核对的计价范围：${name}`);
  return charges;
}

function budgetMachineRows(lessonIndex) {
  return deploymentsFor(lessonIndex).filter(
    (row) => row.hardware && !["db", "replica", "standby"].includes(row.key),
  );
}

function budgetDefaults(lessonIndex) {
  return {
    dailyVisits: BILL_USAGE[LESSONS[lessonIndex].id][0],
    imageKiB: IMAGE_KIB,
    hitPercent: CDN_HIT * 100,
    counts: Object.fromEntries(
      budgetMachineRows(lessonIndex).map((row) => [row.key, row.instances]),
    ),
  };
}

function monthlyBudget(
  lessonIndex,
  scenario = budgetDefaults(lessonIndex),
  providerId = "aws",
) {
  const lessonId = LESSONS[lessonIndex].id;
  const { dailyVisits, imageKiB, hitPercent, counts } = scenario;
  const [, objectGb, backupGb, imageRegistryGb] = BILL_USAGE[lessonId];
  const active = new Map(
    deploymentsFor(lessonIndex).map((row) => [row.key, row]),
  );
  const isAli = providerId === "ali";
  const rates = isAli ? ALI_RATES : BILL_RATES;
  const sources = isAli ? ALI_SOURCES : BILL_SOURCES;
  const computeName = isAli ? "ECS" : "EC2";
  const diskName = isAli ? "ESSD PL1" : "EBS gp3";
  const storageName = isAli ? "OSS Standard LRS" : "S3 Standard";
  const cdnName = isAli ? "阿里云 CDN（亚太一区）" : "CloudFront";
  const hasCdn = active.has("cdn");
  const hasLb = active.has("lb");
  const pages = dailyVisits * BILL_DAYS * PAGES_PER_VISIT;
  const imageRequests = pages * IMAGES_PER_PAGE;
  const imageGb = billGb(imageRequests, imageKiB);
  const responseGb = billGb(pages, RESPONSE_KIB);
  const groups = [];
  const add = (name, charges, explanation) =>
    groups.push({
      name,
      charges,
      explanation,
      cents: charges.reduce((sum, row) => sum + row.cents, 0),
    });

  const servers = [];
  const redis = [];
  const database = [];
  for (const row of active.values()) {
    if (!row.hardware || row.key === "standby") continue;
    const { cpu, ram, disk } = row.hardware;
    if (row.key === "db" || row.key === "replica") {
      const [model, rate] = rates.rds[cpu];
      const hasStandby = row.key === "db" && active.has("standby");
      const label = hasStandby
        ? `主库与故障备用（${isAli ? "高可用版" : "Multi-AZ"}）`
        : row.name;
      database.push(
        billCharge(
          `${label} · ${hasStandby && isAli ? rates.rdsHaModel : model}`,
          BILL_HOURS,
          "实例小时",
          hasStandby ? rates.rdsMultiAz : rate,
          "db",
          hasStandby
            ? "实例价含主库和备用。"
            : isAli && row.key === "replica"
              ? "只读副本按同规格 RDS 基础版的已核价实例估算。"
              : "单可用区实例，每天运行 24 小时。",
        ),
        billCharge(
          `${label} · ${isAli ? "ESSD PL1" : "gp3"} 数据盘`,
          disk,
          "GB·月",
          hasStandby ? rates.rdsMultiAzDisk : rates.rdsDisk,
          "db",
          hasStandby
            ? "高可用部署的存储费已包含备用侧。使用默认磁盘性能额度。"
            : "按预分配容量计费，使用默认磁盘性能额度。",
        ),
      );
      continue;
    }
    const [model, rate] = rates.ec2[`${cpu}/${ram}`];
    const extraNodes =
      row.key === "nodes" &&
      (lessonId === "autoscaling" || lessonId === "whole-system");
    const extraHours = extraNodes ? 2 * 90 : 0;
    const count = counts[row.key] ?? row.instances;
    const hours = count * BILL_HOURS + extraHours;
    const duration = `${count} 台 × ${BILL_HOURS} 小时${extraNodes ? " + 高峰额外 2 台 × 90 小时" : ""}。`;
    const group = row.key === "cache" ? redis : servers;
    group.push(
      billCharge(
        `${row.name} · ${model}`,
        hours,
        "台·小时",
        rate,
        "ec2",
        duration,
      ),
      billCharge(
        `${row.name} · ${diskName}`,
        (disk * hours) / BILL_HOURS,
        "GB·月",
        rates.ebs,
        "ebs",
        `每台 ${disk} GB，按云盘保留时间折算。${extraNodes ? "高峰节点退出时删除其系统盘。" : "采用基础磁盘性能额度。"}`,
      ),
    );
  }
  add(
    "云服务器与系统盘",
    servers,
    `用相同规格的 ${computeName} Linux 按需实例估价。包括本阶段的业务机、入口机、后台工人、观测机或集群工作节点。`,
  );
  add(
    "数据库",
    database,
    database.length
      ? "独立 MySQL 用同规格的托管 RDS 估价。RDS 的故障备用计入主库的跨可用区价格。"
      : "MySQL 与应用共用一台服务器，相关机器和磁盘已计入云服务器。",
  );
  add(
    "Redis 缓存",
    redis,
    redis.length
      ? `Redis 使用独立的 ${computeName} 与系统盘，自管实例的费用集中计在这里。`
      : "此阶段尚未加入 Redis。",
  );

  const objectGet = hasCdn
    ? Math.round((imageRequests * (100 - hitPercent)) / 100)
    : imageRequests;
  const objectPut = Math.ceil(objectGb / 100) * 1_000;
  const freeGets = isAli ? 500_000_000 : 0;
  const freePuts = isAli ? 100_000_000 : 0;
  add(
    "对象存储 · 商品文件",
    objectGb
      ? [
          billCharge(
            `${storageName} 月均存量`,
            objectGb,
            "GB·月",
            rates.s3Storage,
            "s3",
          ),
          billCharge(
            `${isAli ? "OSS" : "S3"} GET 读图片`,
            Math.max(0, objectGet - freeGets) / 10_000,
            "万次",
            rates.s3Get,
            "s3",
            `${
              hasCdn
                ? `${billNumber(imageRequests)} 次图片访问 × ${billNumber(100 - hitPercent)}% 回源。`
                : "浏览器直接读对象存储，计入全部图片请求。"
            }${freeGets ? `共 ${billNumber(objectGet)} 次 GET，扣除 5 亿次月度免费量。` : ""}`,
          ),
          billCharge(
            `${isAli ? "OSS" : "S3"} PUT 上传或更新`,
            Math.max(0, objectPut - freePuts) / 1_000,
            "千次",
            rates.s3Put,
            "s3",
            `${billNumber(objectPut)} 次。每 100 GB 的月均存量假设约有 1,000 次写请求。${freePuts ? "账户每月前 1 亿次写请求免费。" : ""}`,
          ),
          ...(isAli && !hasCdn
            ? billTiers(
                "OSS 图片直接公网出流量",
                imageGb,
                "GB",
                rates.ossOut,
                "s3",
              )
            : []),
        ]
      : [],
    objectGb
      ? `图片文件按 ${storageName} 存量与读写次数计价。${isAli ? "从 OSS 直出的流量按 OSS 自身档位计算。" : "公网直出的流量列在网络项。"}`
      : "商品图片仍保存在业务服务器。远端备份另列。",
  );

  const freeCdnRequests = isAli ? 0 : CDN_REQUESTS_FREE;
  const cdnCharges = hasCdn
    ? [
        ...billTiers(
          `${cdnName} 图片出流量`,
          imageGb,
          "GB",
          rates.cloudFrontData,
          "cdn",
        ),
        billCharge(
          `${cdnName} HTTPS 图片请求`,
          Math.max(0, imageRequests - freeCdnRequests) / 10_000,
          "万次",
          rates.cloudFrontHttps,
          isAli ? "cdnRequest" : "cdn",
          `${billNumber(imageRequests)} 次请求。${freeCdnRequests ? "扣除每月前 1,000 万次免费量。" : "按全部静态 HTTPS 请求计费。"}`,
        ),
      ]
    : [];
  add(
    "CDN · 图片分发",
    cdnCharges,
    hasCdn
      ? `${cdnName} 按用户实际收到的图片流量及请求数计费。假设 ${storageName} 与 CDN 均在新加坡，回源传输免费，回源 GET 计入对象存储。`
      : "此阶段图片直接发给用户，出网费用根据实际来源列入对应项。",
  );

  add(
    "远端备份",
    [
      billCharge(
        `独立备份 · ${storageName}`,
        backupGb,
        "GB·月",
        rates.s3Storage,
        "s3",
        "月均保留体积。托管数据库自带备份假设在所含额度内。",
      ),
      billCharge(
        "备份写入",
        Math.max(0, BILL_DAYS * 20 - Math.max(0, freePuts - objectPut)) / 1_000,
        "千次",
        rates.s3Put,
        "s3",
        `每日一批，每批估 20 次 PUT，含分段上传。${isAli ? "使用商品文件写入后剩余的免费额度。" : ""}`,
      ),
    ],
    `预算为另存到 ${storageName} 的备份预留空间。`,
  );

  if (hasLb) {
    const processedGb = billGb(pages, REQUEST_KIB + RESPONSE_KIB);
    add(
      "托管负载均衡",
      [
        billCharge(
          isAli ? "1 个阿里云标准版 ALB" : "1 个 AWS 应用负载均衡器（ALB）",
          BILL_HOURS,
          "小时",
          rates.lbHour,
          "lb",
        ),
        billCharge(
          "ALB 容量用量",
          processedGb,
          "LCU·小时",
          rates.lbLcu,
          isAli ? "lb" : "lcu",
          `每页的请求与响应共 ${REQUEST_KIB + RESPONSE_KIB} KiB，合计 ${billNumber(processedGb)} GB。LCU 是云厂商衡量分流容量的单位。此处假设每小时主要按转发数据量计费，每 GB 折算成 1 LCU·小时。`,
        ),
      ],
      "托管入口按运行时间和实际容量计费。独立 Nginx 机器的费用计在云服务器项。",
    );
  }

  const ipv4Count = hasLb ? 2 : 1;
  const ecsIpWaiver = isAli && !hasLb && (counts.allInOne ?? counts.app) > 0;
  const directImageGb = hasCdn || (isAli && objectGb) ? 0 : imageGb;
  add(
    "公网流量与 IPv4",
    [
      ...billTiers(
        "直接公网出流量",
        responseGb + directImageGb,
        "GB",
        rates.internetOut,
        "transfer",
        isAli ? "transfer" : "egressFree",
      ),
      billCharge(
        "公网 IPv4 地址",
        ipv4Count * BILL_HOURS,
        "地址·小时",
        ecsIpWaiver ? 0 : rates.ipv4,
        ecsIpWaiver ? "ipv4Free" : "ipv4",
        hasLb
          ? "假设入口在两个可用区，共 2 个公网 IPv4 地址。"
          : ecsIpWaiver
            ? "1 个 BGP EIP 绑定 ECS，假设账户满足保有费减免条件。"
            : "估算保留 1 个对外 IPv4 地址。",
      ),
    ],
    directImageGb
      ? "应用响应和服务器直出的图片流量共享公网出网档位。"
      : "该项计入应用响应的出网流量。CDN 或 OSS 发出的图片列在各自费用项。",
  );

  if (active.has("queue")) {
    const free = isAli ? 20_000_000 : 1_000_000;
    const requests = dailyVisits * BILL_DAYS * 0.02 * 4;
    add(
      "消息队列",
      [
        ...(isAli
          ? [
              billCharge(
                "SMQ 主队列与失败队列",
                2 * BILL_DAYS,
                "队列·天",
                rates.queueDay,
                "queue",
                "2 条队列 × 30 天。",
              ),
            ]
          : []),
        billCharge(
          isAli ? "SMQ（原 MNS）普通消息请求" : "SQS Standard 请求",
          Math.max(0, requests - free) / 1_000_000,
          "百万次",
          rates.sqs,
          "queue",
          `假设 2% 的访问产生订单，每单估 4 次计费请求，含发送、领取、确认和额外轮询。共 ${billNumber(requests)} 次，扣除每月前 ${billNumber(free / 10_000)} 万次。`,
        ),
      ],
      isAli
        ? "SMQ 按队列保有天数和请求数计费。"
        : "主队列和失败队列按实际请求计价。",
    );
  }
  if (active.has("image")) {
    const registryCharges = isAli
      ? [
          billCharge(
            "ACR 企业基础版",
            1,
            "实例·月",
            rates.acr,
            "imageQuote",
            "新加坡官方询价，包月目录价。",
          ),
          billCharge(
            "ACR 额外 VPC 访问配额",
            1,
            "配额·月",
            rates.acrVpc,
            "imageQuote",
            "按询价配置增加 1 份 VPC 访问配额。",
          ),
          billCharge(
            "镜像的 OSS 存量",
            imageRegistryGb,
            "GB·月",
            rates.s3Storage,
            "s3",
          ),
        ]
      : [
          billCharge(
            "ECR 私有镜像月均存量",
            imageRegistryGb,
            "GB·月",
            rates.ecr,
            "image",
          ),
        ];
    add(
      "镜像仓库",
      registryCharges,
      "镜像仓库和运行机器都位于新加坡，按同区私网拉取估算。",
    );
  }
  if (active.has("control")) {
    add(
      "Kubernetes 控制平面",
      [
        billCharge(
          isAli ? "1 个阿里云 ACK Pro 集群" : "1 个 Amazon EKS 集群",
          BILL_HOURS,
          "集群小时",
          rates.eks,
          "eks",
        ),
      ],
      isAli
        ? "ACK Pro 按集群小时计费。工作节点已计在云服务器项。"
        : "使用标准支持版本。工作节点已计在云服务器项。",
    );
  }

  return {
    groups,
    isAli,
    sources,
    hasCdn,
    originRequests: objectGet,
    dailyVisits,
    imageKiB,
    hitPercent,
    pages,
    imageRequests,
    imageGb,
    responseGb,
    totalCents: groups.reduce((sum, group) => sum + group.cents, 0),
  };
}
