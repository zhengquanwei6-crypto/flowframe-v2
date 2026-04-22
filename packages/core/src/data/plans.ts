import type { CreditPlan } from "../types";

export const creditPlans: CreditPlan[] = [
  {
    key: "free",
    name: "免费试用",
    monthlyCredits: 20,
    maxResolution: "1024px",
    queue: "standard",
    historyDays: 7,
    features: ["基础模板", "标准队列", "短期历史", "基础下载"]
  },
  {
    key: "pro",
    name: "Pro 创作者",
    monthlyCredits: 500,
    maxResolution: "2048px",
    queue: "priority",
    historyDays: 90,
    features: ["高级模式", "优先队列", "高清结果", "私有 provider", "高级预设"]
  },
  {
    key: "team",
    name: "团队版",
    monthlyCredits: 2000,
    maxResolution: "4096px",
    queue: "priority",
    historyDays: 365,
    features: ["团队模板", "共享结果", "席位管理", "品牌素材库", "企业存储预留"]
  }
];
