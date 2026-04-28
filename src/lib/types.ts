interface CampaignFields {
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

interface KPIResult {
  ctr: string | null;
  cpc: number | null;
  cpa: number | null;
  roas: string | null;
}

interface DummyAnalysis {
  summary: string;
  whatsWorking: string[];
  needsAttention: string[];
  recommendations: string[];
  priority: string;
}

interface AnalysisData {
  fields: CampaignFields;
  kpis: KPIResult;
  analysis: DummyAnalysis;
  timestamp: Date;
}
