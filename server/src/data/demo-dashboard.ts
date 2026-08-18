export interface WidgetSeed {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
}

export interface DashboardTemplate {
  key: string;
  keywords: string[];
  name: string;
  prompt: string;
  headline: string;
  subtitle: string;
  widgets: WidgetSeed[];
}

const actionEndpoint = "/api/widget-action";

export const templates: DashboardTemplate[] = [
  {
    key: "risk",
    keywords: ["risk", "high risk", "account", "critical"],
    name: "High Risk Accounts Review",
    prompt: "High risk accounts review",
    headline:
      "2,988 accounts are high-risk — 996 are critical.",
    subtitle:
      "Concentrated in the South-East; ABC Manufacturing tops the list at 0.93.",
    widgets: [
      {
        id: "risk_metric_high",
        type: "METRIC_CARD",
        title: "High Risk",
        data: {
          value: 2988,
          trend: "-3.2%",
          status: "error",
          sparkline: [62, 58, 55, 51, 48, 44, 41],
        },
      },
      {
        id: "risk_metric_critical",
        type: "METRIC_CARD",
        title: "Critical",
        data: {
          value: 996,
          trend: "-1.1%",
          status: "error",
          sparkline: [30, 28, 27, 26, 25, 24, 23],
        },
      },
      {
        id: "risk_metric_avg",
        type: "METRIC_CARD",
        title: "Avg Risk Score",
        data: {
          value: 0.68,
          caption: "High-risk cohort",
          status: "warning",
          sparkline: [55, 58, 60, 62, 65, 66, 68],
        },
      },
      {
        id: "risk_metric_flagged",
        type: "METRIC_CARD",
        title: "Flagged Today",
        data: {
          value: 38,
          trend: "-10%",
          status: "success",
          sparkline: [52, 49, 47, 45, 43, 40, 38],
        },
      },
      {
        id: "risk_table",
        type: "DATA_TABLE",
        title: "Top accounts by risk",
        data: {
          columns: [
            { key: "account", label: "Account" },
            { key: "exposure", label: "Exposure" },
            { key: "score", label: "Score" },
            { key: "region", label: "Region" },
          ],
          rows: [
            { account: "ABC Manufacturing", exposure: "SAR 5.1M", score: 0.93, region: "South-East" },
            { account: "Delta Logistics", exposure: "SAR 4.7M", score: 0.89, region: "West" },
            { account: "Orion Retail", exposure: "SAR 3.9M", score: 0.81, region: "Midwest" },
            { account: "Vega Foods", exposure: "SAR 3.4M", score: 0.77, region: "South-East" },
            { account: "Nimbus Tech", exposure: "SAR 2.9M", score: 0.72, region: "North" },
          ],
        },
      },
      {
        id: "risk_chart",
        type: "BAR_CHART",
        title: "Risk score distribution",
        data: {
          unit: "accounts",

          // 0.05-wide score bins. The tails are deliberately kept in even
          // though they are near-zero: the empty shoulders are what make the
          // distribution read as a distribution rather than as a ranking.
          bars: [
            { label: "0.20", value: 15 },
            { label: "0.25", value: 45 },
            { label: "0.30", value: 105 },
            { label: "0.35", value: 190 },
            { label: "0.40", value: 300 },
            { label: "0.45", value: 430 },
            { label: "0.50", value: 545 },
            { label: "0.55", value: 640 },
            { label: "0.60", value: 680 },
            { label: "0.65", value: 655 },
            { label: "0.70", value: 560 },
            { label: "0.75", value: 430 },
            { label: "0.80", value: 300 },
            { label: "0.85", value: 175 },
            { label: "0.90", value: 80 },
            { label: "0.95", value: 25 },
          ],
        },
      },
      {
        id: "risk_form",
        type: "DYNAMIC_FORM",
        title: "Scoring Parameters",
        data: {
          fields: [
            { name: "threshold", label: "Risk Threshold", type: "slider", min: 0, max: 1, default: 0.7 },
            { name: "escalationHours", label: "Escalate after (hours)", type: "number", required: true, min: 1, max: 72, default: 24, helpText: "Between 1 and 72 hours." },
            { name: "reviewerEmail", label: "Reviewer email", type: "text", required: true, pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", patternMessage: "Enter a valid email address.", placeholder: "risk-team@acme.com", default: "risk-team@acme.com" },
            { name: "autoFreeze", label: "Auto-freeze critical", type: "toggle", default: true },
          ],
          actionEndpoint,
        },
      },
      {
        id: "risk_commands",
        type: "COMMAND_PANEL",
        title: "Recommended actions",
        data: {
          actions: [
            { id: "review-critical", label: "Review 996 critical accounts", variant: "default" },
            { id: "freeze-credit", label: "Freeze new credit for the top 5 segments", variant: "danger" },
            { id: "alert-team", label: "Alert the risk team this week", variant: "default" },
            { id: "schedule-review", label: "Schedule review with relationship managers", variant: "default" },
          ],
          actionEndpoint,
        },
      },
    ],
  },

  {
    key: "system",
    keywords: ["system", "analytics", "api", "infrastructure", "server", "latency"],
    name: "Real-time System Analytics",
    prompt: "Real-time system analytics",
    headline:
      "14,280 req/sec across 6 regions — all systems nominal.",
    subtitle:
      "Payment Service latency is trending up; everything else is within budget.",
    widgets: [
      {
        id: "sys_metric_rps",
        type: "METRIC_CARD",
        title: "Requests / sec",
        data: { value: 14280, unit: "req/s", trend: "+12.4%", status: "success", sparkline: [40, 48, 44, 52, 61, 58, 72] },
      },
      {
        id: "sys_metric_users",
        type: "METRIC_CARD",
        title: "Active Users",
        data: { value: 8492, trend: "+8.2%", status: "success", sparkline: [30, 42, 35, 50, 55, 70, 82] },
      },
      {
        id: "sys_metric_error",
        type: "METRIC_CARD",
        title: "Error Rate",
        data: { value: 0.68, unit: "%", trend: "-2.1%", status: "success", sparkline: [80, 65, 70, 50, 45, 30, 25] },
      },
      {
        id: "sys_metric_p99",
        type: "METRIC_CARD",
        title: "p99 Latency",
        data: { value: 214, unit: "ms", trend: "+4.5%", status: "warning", sparkline: [40, 42, 45, 48, 52, 58, 63] },
      },
      {
        id: "sys_table",
        type: "DATA_TABLE",
        title: "Top services",
        data: {
          columns: [
            { key: "service", label: "Service" },
            { key: "requests", label: "Requests" },
            { key: "latency", label: "Latency" },
            { key: "status", label: "Status" },
          ],
          rows: [
            { service: "API Gateway", requests: "4.2M", latency: "42ms", status: "Healthy" },
            { service: "Auth Service", requests: "2.8M", latency: "38ms", status: "Healthy" },
            { service: "Payment Service", requests: "1.9M", latency: "72ms", status: "Warning" },
            { service: "Notification Service", requests: "1.4M", latency: "51ms", status: "Healthy" },
            { service: "Search Service", requests: "1.1M", latency: "63ms", status: "Healthy" },
          ],
        },
      },
      {
        id: "sys_chart",
        type: "BAR_CHART",
        title: "Requests by region",
        data: {
          unit: "req/s",
          bars: [
            { label: "US-E", value: 4200 },
            { label: "US-W", value: 3100 },
            { label: "EU", value: 2900 },
            { label: "APAC", value: 2100 },
            { label: "SA", value: 980 },
            { label: "AF", value: 800 },
          ],
        },
      },
      {
        id: "sys_form",
        type: "DYNAMIC_FORM",
        title: "Autoscaler Parameters",
        data: {
          fields: [
            { name: "targetCpu", label: "Target CPU", type: "slider", min: 0, max: 1, default: 0.6 },
            { name: "minReplicas", label: "Minimum replicas", type: "number", required: true, min: 1, max: 50, default: 3, helpText: "Between 1 and 50." },
            { name: "alertChannel", label: "Alert channel", type: "text", required: true, pattern: "^#[a-z0-9-]{2,20}$", patternMessage: "Use a channel like #ops-alerts.", placeholder: "#ops-alerts", default: "#ops-alerts" },
            { name: "burst", label: "Allow burst scaling", type: "toggle", default: true },
          ],
          actionEndpoint,
        },
      },
      {
        id: "sys_commands",
        type: "COMMAND_PANEL",
        title: "System commands",
        data: {
          actions: [
            { id: "restart-api", label: "Restart API gateway", variant: "default" },
            { id: "clear-cache", label: "Clear application cache", variant: "default" },
            { id: "maintenance", label: "Enable maintenance mode", variant: "danger" },
          ],
          actionEndpoint,
        },
      },
    ],
  },

  {
    key: "sales",
    keywords: ["sales", "revenue", "performance", "deals", "pipeline"],
    name: "Sales Performance Overview",
    prompt: "Sales performance overview",
    headline:
      "$4.7M booked this quarter — 112% to target.",
    subtitle:
      "Enterprise is carrying the number; SMB win-rate slipped 3 points.",
    widgets: [
      {
        id: "sales_metric_revenue",
        type: "METRIC_CARD",
        title: "Revenue (QTD)",
        data: { value: 4720000, trend: "+18.6%", status: "success", sparkline: [30, 34, 40, 45, 52, 61, 70] },
      },
      {
        id: "sales_metric_deals",
        type: "METRIC_CARD",
        title: "Deals Won",
        data: { value: 184, trend: "+9.1%", status: "success", sparkline: [40, 44, 48, 50, 58, 64, 71] },
      },
      {
        id: "sales_metric_winrate",
        type: "METRIC_CARD",
        title: "Win Rate",
        data: { value: 27.4, unit: "%", trend: "-3.0%", status: "warning", sparkline: [60, 58, 55, 52, 50, 48, 46] },
      },
      {
        id: "sales_metric_acv",
        type: "METRIC_CARD",
        title: "Avg Contract Value",
        data: { value: 25600, trend: "+5.2%", status: "success", sparkline: [45, 48, 50, 53, 57, 60, 64] },
      },
      {
        id: "sales_table",
        type: "DATA_TABLE",
        title: "Top deals",
        data: {
          columns: [
            { key: "account", label: "Account" },
            { key: "stage", label: "Stage" },
            { key: "value", label: "Value" },
            { key: "owner", label: "Owner" },
          ],
          rows: [
            { account: "Globex", stage: "Closed Won", value: "$820K", owner: "R. Patel" },
            { account: "Initech", stage: "Negotiation", value: "$610K", owner: "S. Kim" },
            { account: "Umbrella", stage: "Closed Won", value: "$540K", owner: "A. Diaz" },
            { account: "Hooli", stage: "Proposal", value: "$430K", owner: "M. Chen" },
            { account: "Stark Ind.", stage: "Negotiation", value: "$390K", owner: "R. Patel" },
          ],
        },
      },
      {
        id: "sales_chart",
        type: "BAR_CHART",
        title: "Revenue by month",
        data: {
          unit: "$K",
          bars: [
            { label: "Jan", value: 320 },
            { label: "Feb", value: 410 },
            { label: "Mar", value: 480 },
            { label: "Apr", value: 520 },
            { label: "May", value: 610 },
            { label: "Jun", value: 700 },
          ],
        },
      },
      {
        id: "sales_form",
        type: "DYNAMIC_FORM",
        title: "Forecast Settings",
        data: {
          fields: [
            { name: "confidence", label: "Confidence weighting", type: "slider", min: 0, max: 1, default: 0.75 },
            { name: "quotaTarget", label: "Quota target (USD)", type: "number", required: true, min: 0, max: 10000000, default: 250000 },
            { name: "ownerAlias", label: "Forecast owner", type: "text", required: true, minLength: 3, maxLength: 24, default: "rev-ops", helpText: "3–24 characters." },
            { name: "includePipeline", label: "Include open pipeline", type: "toggle", default: false },
          ],
          actionEndpoint,
        },
      },
      {
        id: "sales_commands",
        type: "COMMAND_PANEL",
        title: "Recommended actions",
        data: {
          actions: [
            { id: "push-forecast", label: "Publish updated forecast", variant: "default" },
            { id: "nudge-smb", label: "Launch SMB win-back play", variant: "default" },
            { id: "escalate", label: "Escalate 3 stalled deals", variant: "danger" },
          ],
          actionEndpoint,
        },
      },
    ],
  },

  {
    key: "fraud",
    keywords: ["fraud", "chargeback", "suspicious", "transaction"],
    name: "Fraud Monitoring",
    prompt: "Fraud monitoring dashboard",
    headline:
      "412 transactions flagged in the last hour.",
    subtitle:
      "Card-not-present fraud is spiking in EU; block-rate holding at 98.2%.",
    widgets: [
      {
        id: "fraud_metric_flagged",
        type: "METRIC_CARD((",
        title: "Flagged (1h)",
        data: { value: 412, trend: "+22.0%", status: "error", sparkline: [30, 34, 41, 48, 55, 63, 72] },
      },
      {
        id: "fraud_metric_blocked",
        type: "METRIC_CARD",
        title: "Block Rate",
        data: { value: 98.2, unit: "%", trend: "+0.4%", status: "success", sparkline: [88, 90, 92, 94, 95, 97, 98] },
      },
      {
        id: "fraud_metric_loss",
        type: "METRIC_CARD",
        title: "Prevented Loss",
        data: { value: 184000, trend: "+11.3%", status: "success", sparkline: [40, 45, 50, 55, 60, 66, 71] },
      },
      {
        id: "fraud_metric_fp",
        type: "METRIC_CARD",
        title: "False Positives",
        data: { value: 1.8, unit: "%", trend: "-0.6%", status: "success", sparkline: [70, 62, 55, 48, 42, 36, 30] },
      },
      {
        id: "fraud_table",
        type: "DATA_TABLE",
        title: "Recent flags",
        data: {
          columns: [
            { key: "txn", label: "Txn" },
            { key: "amount", label: "Amount" },
            { key: "reason", label: "Reason" },
            { key: "region", label: "Region" },
          ],
          rows: [
            { txn: "#A8F2", amount: "$4,210", reason: "Velocity", region: "EU" },
            { txn: "#B1C9", amount: "$980", reason: "CNP mismatch", region: "EU" },
            { txn: "#C7D4", amount: "$2,640", reason: "Geo anomaly", region: "US" },
            { txn: "#D2E8", amount: "$120", reason: "BIN attack", region: "APAC" },
            { txn: "#E9A1", amount: "$7,300", reason: "Velocity", region: "EU" },
          ],
        },
      },
      {
        id: "fraud_chart",
        type: "BAR_CHART",
        title: "Flags by reason",
        data: {
          unit: "flags",
          bars: [
            { label: "Velocity", value: 160 },
            { label: "CNP", value: 120 },
            { label: "Geo", value: 70 },
            { label: "BIN", value: 40 },
            { label: "Other", value: 22 },
          ],
        },
      },
      {
        id: "fraud_form",
        type: "DYNAMIC_FORM",
        title: "Detection Sensitivity",
        data: {
          fields: [
            { name: "sensitivity", label: "Sensitivity", type: "slider", min: 0, max: 1, default: 0.82 },
            { name: "blockThreshold", label: "Block above score", type: "number", required: true, min: 0, max: 100, default: 85 },
            { name: "caseQueue", label: "Case queue", type: "text", required: true, pattern: "^[A-Z]{2,4}-[0-9]{3,5}$", patternMessage: "Queue looks like FRD-1042.", placeholder: "FRD-1042", default: "FRD-1042" },
            { name: "autoBlock", label: "Auto-block high risk", type: "toggle", default: true },
          ],
          actionEndpoint,
        },
      },
      {
        id: "fraud_commands",
        type: "COMMAND_PANEL",
        title: "Recommended actions",
        data: {
          actions: [
            { id: "tighten-eu", label: "Tighten EU CNP rules", variant: "default" },
            { id: "review-flags", label: "Review 412 flagged transactions", variant: "default" },
            { id: "freeze-bins", label: "Freeze 12 compromised BINs", variant: "danger" },
          ],
          actionEndpoint,
        },
      },
    ],
  },

  {
    key: "traffic",
    keywords: ["traffic", "engagement", "web", "visitors", "marketing"],
    name: "Web Traffic & Engagement",
    prompt: "Web traffic and engagement",
    headline:
      "1.2M sessions this week — bounce rate down to 38%.",
    subtitle:
      "Organic search is up 14%; mobile now drives 61% of sessions.",
    widgets: [
      {
        id: "traf_metric_sessions",
        type: "METRIC_CARD",
        title: "Sessions",
        data: { value: 1204000, trend: "+9.7%", status: "success", sparkline: [40, 44, 50, 55, 60, 66, 73] },
      },
      {
        id: "traf_metric_bounce",
        type: "METRIC_CARD",
        title: "Bounce Rate",
        data: { value: 38, unit: "%", trend: "-4.2%", status: "success", sparkline: [70, 66, 60, 55, 50, 44, 40] },
      },
      {
        id: "traf_metric_signups",
        type: "METRIC_CARD",
        title: "Signups",
        data: { value: 3140, trend: "+12.9%", status: "success", sparkline: [30, 36, 42, 48, 55, 63, 71] },
      },
      {
        id: "traf_metric_time",
        type: "METRIC_CARD",
        title: "Avg Session",
        data: { value: 3.4, unit: "min", trend: "+0.3%", status: "success", sparkline: [45, 47, 50, 52, 55, 57, 60] },
      },
      {
        id: "traf_table",
        type: "DATA_TABLE",
        title: "Top pages",
        data: {
          columns: [
            { key: "page", label: "Page" },
            { key: "views", label: "Views" },
            { key: "avg", label: "Avg Time" },
            { key: "source", label: "Top Source" },
          ],
          rows: [
            { page: "/pricing", views: "182K", avg: "2:10", source: "Organic" },
            { page: "/features", views: "141K", avg: "1:48", source: "Direct" },
            { page: "/blog/ai", views: "119K", avg: "4:02", source: "Social" },
            { page: "/signup", views: "96K", avg: "1:12", source: "Paid" },
            { page: "/docs", views: "74K", avg: "5:20", source: "Organic" },
            { page: "/pricing", views: "182K", avg: "2:10", source: "Organic" },
            { page: "/features", views: "141K", avg: "1:48", source: "Direct" },
            { page: "/blog/ai", views: "119K", avg: "4:02", source: "Social" },
            { page: "/signup", views: "96K", avg: "1:12", source: "Paid" },
            { page: "/docs", views: "74K", avg: "5:20", source: "Organic" },
            { page: "/pricing", views: "182K", avg: "2:10", source: "Organic" },
            { page: "/features", views: "141K", avg: "1:48", source: "Direct" },
            { page: "/blog/ai", views: "119K", avg: "4:02", source: "Social" },
            { page: "/signup", views: "96K", avg: "1:12", source: "Paid" },
            { page: "/docs", views: "74K", avg: "5:20", source: "Organic" },
            { page: "/pricing", views: "182K", avg: "2:10", source: "Organic" },
            { page: "/features", views: "141K", avg: "1:48", source: "Direct" },
            { page: "/blog/ai", views: "119K", avg: "4:02", source: "Social" },
            { page: "/signup", views: "96K", avg: "1:12", source: "Paid" },
            { page: "/docs", views: "74K", avg: "5:20", source: "Organic" },
            { page: "/pricing", views: "182K", avg: "2:10", source: "Organic" },
            { page: "/features", views: "141K", avg: "1:48", source: "Direct" },
            { page: "/blog/ai", views: "119K", avg: "4:02", source: "Social" },
            { page: "/signup", views: "96K", avg: "1:12", source: "Paid" },
            { page: "/docs", views: "74K", avg: "5:20", source: "Organic" },
            { page: "/pricing", views: "182K", avg: "2:10", source: "Organic" },
            { page: "/features", views: "141K", avg: "1:48", source: "Direct" },
            { page: "/blog/ai", views: "119K", avg: "4:02", source: "Social" },
            { page: "/signup", views: "96K", avg: "1:12", source: "Paid" },
            { page: "/docs", views: "74K", avg: "5:20", source: "Organic" },
          ],
        },
      },
      {
        id: "traf_chart",
        type: "BAR_CHART",
        title: "Sessions by channel",
        data: {
          unit: "sessions",
          bars: [
            { label: "Organic", value: 480 },
            { label: "Direct", value: 320 },
            { label: "Social", value: 210 },
            { label: "Paid", value: 160 },
            { label: "Email", value: 90 },
          ],
        },
      },
      {
        id: "traf_form",
        type: "DYNAMIC_FORM",
        title: "Attribution Settings",
        data: {
          fields: [
            { name: "window", label: "Attribution window", type: "slider", min: 0, max: 1, default: 0.5 },
            { name: "lookbackDays", label: "Lookback (days)", type: "number", required: true, min: 1, max: 90, default: 30, helpText: "Between 1 and 90 days." },
            { name: "utmSource", label: "UTM source filter", type: "text", maxLength: 32, default: "", placeholder: "Leave blank for all sources" },
            { name: "includePaid", label: "Include paid channels", type: "toggle", default: true },
          ],
          actionEndpoint,
        },
      },
      {
        id: "traf_commands",
        type: "COMMAND_PANEL",
        title: "Recommended actions",
        data: {
          actions: [
            { id: "boost-organic", label: "Double down on organic content", variant: "default" },
            { id: "retarget", label: "Launch retargeting campaign", variant: "default" },
            { id: "pause-paid", label: "Pause underperforming paid ads", variant: "danger" },
          ],
          actionEndpoint,
        },
      },
    ],
  },
];

let rotation = 0;

export function pickTemplate(
  prompt: string,
): DashboardTemplate {
  const normalized =
    prompt.trim().toLowerCase();

  if (normalized.length > 0) {
    const matched = templates.find(
      (template) =>
        template.keywords.some((keyword) =>
          normalized.includes(keyword),
        ),
    );

    if (matched) {
      return matched;
    }
  }

  const template =
    templates[rotation % templates.length];

  rotation += 1;

  return template;
}
