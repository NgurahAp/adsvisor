"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "Google Ads" | "Facebook Ads" | "TikTok Ads" | "Instagram Ads";
type Status = "on-track" | "warning" | "critical";
type FilterTab = "Semua" | Platform;
type SortOption = "Terbaru" | "Tertua" | "ROI Tertinggi";
type RangeOption = "7 Hari Terakhir" | "30 Hari Terakhir" | "90 Hari Terakhir";

interface CampaignMetric {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
}

interface CampaignHistory {
  id: string;
  name: string;
  platform: Platform;
  status: Status;
  startDate: string;
  endDate: string;
  metrics: CampaignMetric[];
  insight: string;
}

interface SummaryStats {
  totalAnalisis: number;
  avgROI: number | null;
  anggaranTerkelola: number;
  efisiensiAI: number;
}

interface ApiResponse {
  success: boolean;
  data?: {
    campaigns: CampaignHistory[];
    meta: SummaryStats;
  };
  message?: string;
  timestamp: string;
}

interface HistoryPageProps {
  onNew: () => void;
  onDetail?: (id: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_BADGE_CLASS: Record<Platform, string> = {
  "Google Ads": "bg-yellow-500",
  "Facebook Ads": "bg-[#1877F2]",
  "TikTok Ads": "bg-[#010101]",
  "Instagram Ads": "bg-[#E1306C]",
};

const FILTER_TABS: FilterTab[] = [
  "Semua",
  "Google Ads",
  "Facebook Ads",
  "TikTok Ads",
  "Instagram Ads",
];

const SORT_OPTIONS: SortOption[] = ["Terbaru", "Tertua", "ROI Tertinggi"];

const RANGE_OPTIONS: RangeOption[] = [
  "7 Hari Terakhir",
  "30 Hari Terakhir",
  "90 Hari Terakhir",
];

// Map UI labels → API query param values
const SORT_TO_PARAM: Record<SortOption, string> = {
  Terbaru: "newest",
  Tertua: "oldest",
  "ROI Tertinggi": "roi_highest",
};

const RANGE_TO_PARAM: Record<RangeOption, string> = {
  "7 Hari Terakhir": "7",
  "30 Hari Terakhir": "30",
  "90 Hari Terakhir": "90",
};

const PLATFORM_TO_PARAM: Partial<Record<FilterTab, string>> = {
  "Google Ads": "google",
  "Facebook Ads": "facebook",
  "TikTok Ads": "tiktok",
  "Instagram Ads": "instagram",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(1)}K`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "on-track") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-wide">
        <CheckCircle2 size={11} strokeWidth={2.5} />
        On-Track
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-wide">
        <AlertTriangle size={11} strokeWidth={2.5} />
        Warning
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-[#E63946] uppercase tracking-wide">
      <AlertTriangle size={11} strokeWidth={2.5} />
      Critical
    </span>
  );
}

function MetricItem({ metric }: { metric: CampaignMetric }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
        {metric.label}
      </p>
      <p className="text-[13px] font-bold text-gray-800 flex items-baseline gap-1.5">
        {metric.value}
        {metric.delta !== undefined && (
          <span
            className={`text-[10px] font-semibold flex items-center gap-0.5 ${
              metric.deltaUp ? "text-green-500" : "text-[#E63946]"
            }`}
          >
            {metric.deltaUp ? (
              <TrendingUp size={9} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={9} strokeWidth={2.5} />
            )}
            {metric.delta}
          </span>
        )}
      </p>
    </div>
  );
}

function CampaignCard({
  campaign,
  onDetail,
}: {
  campaign: CampaignHistory;
  onDetail?: (id: string) => void;
}) {
  const badgeClass = PLATFORM_BADGE_CLASS[campaign.platform];

  function handleDownload() {
    const metricsText = campaign.metrics
      .map((m) => `${m.label}: ${m.value}${m.delta ? ` (${m.delta})` : ""}`)
      .join("\n");
    const txt = `LAPORAN KAMPANYE\nNama: ${campaign.name}\nPlatform: ${campaign.platform}\nPeriode: ${campaign.startDate} – ${campaign.endDate}\n\nMetrics:\n${metricsText}\n\nInsight: ${campaign.insight}`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-${campaign.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Head */}
      <div className="flex items-center justify-between">
        <span
          className={`${badgeClass} flex items-center justify-center text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}
        >
          {campaign.platform}
        </span>
        <StatusBadge status={campaign.status} />
      </div>

      {/* Name & Date */}
      <div>
        <p className="text-[14px] font-bold text-gray-900">{campaign.name}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {campaign.startDate} - {campaign.endDate}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {campaign.metrics.map((m) => (
          <MetricItem key={m.label} metric={m} />
        ))}
      </div>

      {/* Insight */}
      {campaign.insight && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <BarChart2
            size={12}
            strokeWidth={2.5}
            className="mt-0.5 shrink-0 text-[#E63946]"
          />
          <p className="text-[11px] text-red-700 leading-relaxed">
            {campaign.insight}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-around gap-2 pt-4 border-t border-gray-50">
        <button
          onClick={() => onDetail?.(campaign.id)}
          className="text-[11px] font-bold text-gray-600 hover:text-gray-800 transition-colors uppercase tracking-tight"
        >
          Lihat Detail
        </button>
        <span className="w-px h-3 bg-gray-200" />
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-[11px] font-bold text-[#E63946] hover:text-[#d62d3a] transition-colors uppercase tracking-tight"
        >
          <Download size={11} />
          Unduh Laporan
        </button>
      </div>
    </div>
  );
}

function EmptySlot({ onNew }: { onNew: () => void }) {
  return (
    <div className="border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center bg-gray-50/50">
      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
        <BarChart2 size={18} className="text-gray-300" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-bold text-gray-700">Ingin data lebih?</p>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
          Mulai analisis baru untuk memperkaya histori data pemasaran Anda.
        </p>
      </div>
      <button
        onClick={onNew}
        className="mt-1 text-[11px] font-bold text-[#E63946] border border-[#E63946] px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-tight"
      >
        Mulai Sekarang
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-gray-100 rounded-full" />
        <div className="h-4 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-2 w-12 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="h-8 w-full bg-gray-100 rounded-lg" />
      <div className="h-3 w-full bg-gray-50 rounded mt-auto" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HistoryPage({ onNew, onDetail }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("Semua");
  const [sortBy, setSortBy] = useState<SortOption>("Terbaru");
  const [range, setRange] = useState<RangeOption>("30 Hari Terakhir");

  const [campaigns, setCampaigns] = useState<CampaignHistory[]>([]);
  const [meta, setMeta] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        sort: SORT_TO_PARAM[sortBy],
        range: RANGE_TO_PARAM[range],
      });

      const platformParam = PLATFORM_TO_PARAM[activeTab];
      if (platformParam) params.set("platform", platformParam);

      const res = await fetch(`/api/dashboard/history?${params.toString()}`);
      const payload: ApiResponse = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload.message || "Gagal memuat riwayat kampanye.");
      }

      if (payload.data) {
        setCampaigns(payload.data.campaigns);
        setMeta(payload.data.meta);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi error saat memuat data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, sortBy, range]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const showEmpty = !loading && campaigns.length > 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
              AdvisorAI
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-[10px] text-gray-400 tracking-wide uppercase">
              Riwayat Analisis
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Riwayat Analisis
          </h1>
          <p className="text-[11px] text-gray-400 mt-1 font-medium">
            Pantau dan bandingkan performa kampanye yang telah dianalisis
            sebelumnya.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-gray-600 border border-gray-200 rounded-xl px-4 py-2 bg-white hover:bg-gray-50 transition-all shadow-sm">
            <Download size={13} />
            Export Report
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-2 bg-[#E63946] hover:bg-[#d62d3a] text-white px-5 py-2 rounded-xl text-[11px] font-bold uppercase transition-all active:scale-95 shadow-lg shadow-red-100"
          >
            <Plus size={14} />
            Analisis Baru
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Total Analisis
          </p>
          <p className="text-xl font-bold text-gray-900">
            {meta !== null ? meta.totalAnalisis : "—"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Rata-rata ROI
          </p>
          <p className="text-xl font-bold text-gray-900">
            {meta !== null
              ? meta.avgROI !== null
                ? `${meta.avgROI}x`
                : "—"
              : "—"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Anggaran Terkelola
          </p>
          <p className="text-xl font-bold text-gray-900">
            {meta !== null ? formatRupiah(meta.anggaranTerkelola) : "—"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Efisiensi AI
          </p>
          <p className="text-xl font-bold text-gray-900 flex items-baseline gap-2">
            {meta !== null ? `${meta.efisiensiAI}%` : "—"}
            {meta !== null && (
              <span className="text-[11px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">
                ±
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex gap-1 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-bold uppercase tracking-tight px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-gray-100 text-gray-800"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-[11px] font-bold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                Urutkan: {o}
              </option>
            ))}
          </select>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeOption)}
            className="text-[11px] font-bold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946]"
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between">
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={fetchHistory}
            className="text-[11px] font-bold text-[#E63946] uppercase hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : campaigns.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-sm text-gray-400">
              Belum ada kampanye untuk filter ini.
            </p>
          </div>
        ) : (
          <>
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDetail={onDetail}
              />
            ))}
            {showEmpty && <EmptySlot onNew={onNew} />}
          </>
        )}
      </div>

      {/* Spinner saat refetch (bukan initial load) */}
      {loading && campaigns.length > 0 && (
        <div className="flex justify-center mt-6">
          <Loader2 size={16} className="animate-spin text-gray-300" />
        </div>
      )}
    </div>
  );
}