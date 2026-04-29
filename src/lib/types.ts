export interface CampaignFields {
  name: string;
  platform: string;
  startDate: string;
  endDate: string;
  impressions: string;
  clicks: string;
  conversions: string;
  spend: string;
  price: string;
}

export interface KPIResult {
  ctr: string | null;
  cpc: number | null;
  cpa: number | null;
  roas: string | null;
}

export interface DummyAnalysis {
  summary: string;
  whatsWorking: string[];
  needsAttention: string[];
  recommendations: string[];
  priority: string;
}

export interface AnalysisData {
  fields: CampaignFields;
  kpis: KPIResult;
  analysis: DummyAnalysis;
  timestamp: string;
}

// ─── History Types ────────────────────────────────────────────────────────────

export type SortOption = "newest" | "oldest" | "roi_highest";
export type RangeOption = "7" | "30" | "90";
export type CampaignStatus = "on-track" | "warning" | "critical";

export interface MetricItem {
  label: string;
  value: string;
  delta?: string | null;
  deltaUp?: boolean;
}

export interface HistoryCampaign {
  id: string;
  name: string;
  platform: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  metrics: MetricItem[];
  kpis: KPIResult;
  insight: string;
}

export interface HistoryMeta {
  totalAnalisis: number;
  avgROI: number | null;
  anggaranTerkelola: number;
  efisiensiAI: number;
}

export interface HistoryResponse {
  campaigns: HistoryCampaign[];
  meta: HistoryMeta;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export type AnalyzeResponse = ApiResponse<AnalysisData>;
export type HistoryApiResponse = ApiResponse<HistoryResponse>;
