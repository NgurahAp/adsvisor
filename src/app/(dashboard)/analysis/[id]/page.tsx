"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download, Sparkles, Loader2 } from "lucide-react";
import { fmt, fmtRp, fmtDate } from "@/helper/fmt";
import type { AnalysisData } from "@/lib/types";
import KPICard from "../../../../components/KPICard";
import TypewriterText from "../../../../components/TypeWritterText";

const PLATFORM_COLORS: Record<string, string> = {
  "Facebook Ads": "bg-[#1877F2]",
  "Google Ads": "bg-[#4285F4]",
  "TikTok Ads": "bg-[#010101]",
  "Instagram Ads": "bg-[#E1306C]",
};

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/dashboard/analysis/${params.id}`);
        const payload = await res.json();

        if (!res.ok || !payload.success) {
          throw new Error(payload.message || "Gagal memuat detail analisis");
        }

        setData(payload.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi error saat memuat data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E63946]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Data tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/history")}
            className="text-[#E63946] hover:underline"
          >
            Kembali ke History
          </button>
        </div>
      </div>
    );
  }

  const { fields, kpis, analysis, timestamp } = data;

  const date = new Date(timestamp);
  const tsStr = `${date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const platformColor = PLATFORM_COLORS[fields.platform] ?? "bg-[#E63946]";

  type StatRow = [string, string];
  const statRows: StatRow[] = [
    ["Impressions", fmt(fields.impressions)],
    ["Clicks", fmt(fields.clicks)],
    ...(fields.conversions
      ? ([["Conversions", fmt(fields.conversions)]] as StatRow[])
      : []),
    ["Total Spend", fmtRp(fields.spend)],
  ];

  function handleExport() {
    const txt = `HASIL ANALISIS ADVISOR AI\nKampanye: ${fields.name || "—"}\nPlatform: ${fields.platform}\n...`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adsvisor-${fields.name || "kampanye"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
              AdvisorAI
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-[10px] text-gray-400 tracking-wide uppercase">
              Detail Analisis
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900  leading-snug">
            {fields.name || "Campaign"}
          </h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
            Dianalisis oleh AdvisorAI • {tsStr}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/history")}
            className="flex items-center gap-1 text-[11px] border border-gray-200 rounded-lg px-4 py-2 text-gray-500 bg-white hover:bg-gray-50 transition-all font-bold uppercase"
          >
            <ChevronLeft size={12} />
            Back
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-[11px] text-gray-600 bg-white hover:bg-gray-50 transition-all font-bold uppercase shadow-sm"
          >
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-4 shadow-sm">
        <div className="flex items-center flex-wrap gap-2.5 mb-4">
          <span
            className={`${platformColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase`}
          >
            {fields.platform}
          </span>
          {fields.name && (
            <span className="text-sm font-bold text-gray-900">
              {fields.name}
            </span>
          )}
          {(fields.startDate || fields.endDate) && (
            <span className="text-[11px] text-gray-400 font-medium">
              {fmtDate(fields.startDate)} – {fmtDate(fields.endDate)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statRows.map(([label, val]) => (
            <div key={label} className="border-l border-gray-200 pl-3">
              <div className="text-[9px] text-gray-400 uppercase font-bold mb-0.5 tracking-tighter">
                {label}
              </div>
              <div className="text-[13px] font-bold text-gray-800">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KPICard
          title="CTR"
          value={kpis.ctr}
          suffix="%"
          badge={
            kpis.ctr !== null
              ? Number(kpis.ctr) > 1.5
                ? "Good"
                : "Low"
              : undefined
          }
          badgeUp={kpis.ctr !== null ? Number(kpis.ctr) > 1.5 : undefined}
          delay={0}
        />
        <KPICard
          title="CPC"
          value={kpis.cpc !== null ? fmtRp(kpis.cpc) : null}
          delay={100}
        />
        <KPICard
          title="CPA"
          value={kpis.cpa !== null ? fmtRp(kpis.cpa) : null}
          delay={200}
        />
        <KPICard
          title="ROAS"
          value={kpis.roas}
          suffix="x"
          badge={
            kpis.roas !== null
              ? Number(kpis.roas) >= 3
                ? "+ROI"
                : "Flat"
              : undefined
          }
          badgeUp={kpis.roas !== null ? Number(kpis.roas) >= 3 : undefined}
          delay={300}
        />
      </div>

      {/* AI Analysis */}
      <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold">
            <Sparkles
              size={14}
              className="text-[#E63946]"
              fill="currentColor"
            />{" "}
            AI Analysis
          </div>
          <span className="text-[10px] text-gray-300 font-medium uppercase">
            Last Updated: {tsStr}
          </span>
        </div>

        {/* Summary */}
        <div className="mb-8 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Performance Summary
          </p>
          <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#E63946]/20 pl-4">
            <TypewriterText text={analysis.summary} speed={8} />
          </p>
        </div>

        {/* What's Working + Needs Attention */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              What's Working
            </p>
            <div className="space-y-3">
              {analysis.whatsWorking.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Needs Attention
            </p>
            <div className="space-y-3">
              {analysis.needsAttention.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8 pt-6 border-t border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Recommendations
          </p>
          <div className="space-y-3">
            {analysis.recommendations.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 items-center"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="p-4 bg-gray-900 rounded-xl relative">
          <div className="absolute top-0 right-0 p-3 opacity-30">
            <Sparkles
              size={14}
              className="text-[#E63946]"
              fill="currentColor"
            />
          </div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-1">
            Priority Today
          </p>
          <p className="text-sm text-white font-bold leading-relaxed">
            {analysis.priority}
          </p>
        </div>
      </div>
    </div>
  );
}
