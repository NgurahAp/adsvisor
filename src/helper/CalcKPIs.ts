import type { CampaignFields, KPIResult } from "@/lib/types";

function calcKPIs(fields: CampaignFields): KPIResult {
  const imp = parseFloat(fields.impressions) || 0;
  const clk = parseFloat(fields.clicks) || 0;
  const conv = parseFloat(fields.conversions) || 0;
  const spd = parseFloat(fields.spend) || 0;
  const prc = parseFloat(fields.price) || 0;

  const ctr = imp > 0 ? ((clk / imp) * 100).toFixed(2) : null;
  const cpc = clk > 0 ? Math.round(spd / clk) : null;
  const cpa = conv > 0 ? Math.round(spd / conv) : null;
  const revenue = conv * prc;
  const roas = spd > 0 && revenue > 0 ? (revenue / spd).toFixed(1) : null;

  return { ctr, cpc, cpa, roas };
}
