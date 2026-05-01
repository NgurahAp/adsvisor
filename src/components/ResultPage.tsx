"use client";

import { fmt, fmtRp, fmtDate } from "@/helper/fmt";
import { ChevronLeft, Download, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AnalysisData, DummyAnalysis } from "@/lib/types";
import TypewriterText from "./TypeWritterText";
import KPICard from "./KPICard";
import { exportAnalysisPdf } from "@/helper/ExportAnalystPDF";

interface ResultPageProps {
  data: AnalysisData | null;
  onNew: () => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  "Facebook Ads": "bg-[#1877F2]",
  "Google Ads": "bg-[#4285F4]",
  "TikTok Ads": "bg-[#010101]",
  "Instagram Ads": "bg-[#E1306C]",
};

function AIAnalysisIdle({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-5">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
        <Sparkles size={20} className="text-gray-300" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-[12px] font-bold text-gray-700">
          Analisis AI belum dimulai
        </p>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Klik tombol di bawah untuk mendapatkan insight mendalam dari AI
        </p>
      </div>
      <button
        onClick={onStart}
        className="flex items-center gap-2 bg-[#E63946] hover:bg-[#d62d3a] active:scale-95 text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all shadow-lg shadow-red-100"
      >
        <Sparkles size={13} fill="currentColor" />
        Mulai Analisis AI
      </button>
    </div>
  );
}

function AIAnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <Sparkles size={22} className="text-[#E63946]" fill="currentColor" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E63946] rounded-full animate-ping opacity-60" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
          AI sedang menganalisis...
        </p>
        <p className="text-[10px] text-gray-400">
          Ini mungkin memakan beberapa detik
        </p>
      </div>
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#E63946]/40 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AIAnalysisError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <p className="text-[11px] text-gray-500">Gagal memuat analisis AI.</p>
      <button
        onClick={onRetry}
        className="text-[11px] font-bold text-[#E63946] border border-[#E63946]/30 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors uppercase"
      >
        Coba Lagi
      </button>
    </div>
  );
}

function AIAnalysisContent({
  analysis,
  tsStr,
}: {
  analysis: DummyAnalysis;
  tsStr: string;
}) {
  return (
    <>
      <div className="mb-8 space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Performance Summary
        </p>
        <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#E63946]/20 pl-4">
          <TypewriterText text={analysis.summary} speed={8} />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            What's Working
          </p>
          <div className="space-y-3">
            {analysis.whatsWorking.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
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
              <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <span className="text-sm text-gray-700 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded-xl relative">
        <div className="absolute top-0 right-0 p-3 opacity-30">
          <Sparkles size={14} className="text-[#E63946]" fill="currentColor" />
        </div>
        <p className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-1">
          Priority Today
        </p>
        <p className="text-sm text-white font-bold leading-relaxed">
          {analysis.priority}
        </p>
      </div>
    </>
  );
}

export function ResultPage({ data, onNew }: ResultPageProps) {
  const [visible, setVisible] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<DummyAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiStarted, setAiStarted] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => setExporting(false);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  async function fetchAiAnalysis() {
    if (!data) return;
    setAiStarted(true);
    setAiLoading(true);
    setAiError(false);

    try {
      const res = await fetch("/api/dashboard/analyzeWithAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: data.analysisId,
          fields: data.fields,
          kpis: data.kpis,
        }),
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload.message || "Gagal mendapatkan analisis AI.");
      }

      setAiAnalysis(payload.data.analysis);
    } catch (err) {
      console.error("[AI Analysis]", err);
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleExport() {
    if (!data) return;
    setExporting(true);
    try {
      await exportAnalysisPdf(data, aiAnalysis, tsStr);
    } catch (err) {
      console.error("Export PDF gagal:", err);
    } finally {
      setExporting(false);
    }
  }

  if (!data) return null;

  const { fields, kpis, timestamp } = data;

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

  return (
    <div
      className={`max-w-4xl mx-auto px-3 sm:px-4 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Header */}
      <div className="no-print flex items-start justify-between mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
              AdvisorAI
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-[10px] text-gray-400 tracking-wide uppercase">
              Hasil Analisis
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            Hasil Analisis
          </h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
            Dianalisis oleh AdvisorAI • {tsStr}
          </p>
        </div>

        {/* Tombol — icon only di mobile, teks muncul di sm+ */}
        <div className="flex gap-2 shrink-0 ml-3">
          <button
            onClick={onNew}
            className="flex items-center gap-1 text-[11px] border border-gray-200 rounded-lg px-2 sm:px-4 py-2 text-gray-500 bg-white hover:bg-gray-50 transition-all font-bold uppercase"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 sm:px-4 py-2 text-[11px] text-gray-600 bg-white hover:bg-gray-50 transition-all font-bold uppercase shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            <span className="hidden sm:inline">
              {exporting ? "Menyiapkan..." : "Export PDF"}
            </span>
          </button>
        </div>
      </div>

      {/* Konten utama */}
      <div className="print-area">
        {/* Print-only header */}
        <div className="hidden print:block mb-6">
          <p className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase mb-1">
            AdvisorAI • Hasil Analisis
          </p>
          <h1 className="text-xl font-bold text-gray-900">{fields.name}</h1>
          <p className="text-[10px] text-gray-400 mt-0.5 uppercase">
            Dianalisis oleh AdvisorAI • {tsStr}
          </p>
        </div>

        {/* Campaign Info */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-5 mb-4 shadow-sm">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
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
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold">
              <Sparkles size={14} className="text-[#E63946]" fill="currentColor" />
              AI Analysis
            </div>
            {aiAnalysis && (
              <span className="text-[10px] text-gray-300 font-medium uppercase">
                Last Updated: {tsStr}
              </span>
            )}
          </div>

          {!aiStarted && <AIAnalysisIdle onStart={fetchAiAnalysis} />}
          {aiStarted && aiLoading && <AIAnalysisLoading />}
          {aiStarted && aiError && (
            <AIAnalysisError onRetry={fetchAiAnalysis} />
          )}
          {aiAnalysis && (
            <AIAnalysisContent analysis={aiAnalysis} tsStr={tsStr} />
          )}
        </div>
      </div>
    </div>
  );
}