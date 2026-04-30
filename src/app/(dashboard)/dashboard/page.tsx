"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  TrendingUp,
  Wallet,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { HistoryApiResponse, HistoryCampaign, HistoryMeta } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "on-track" | "warning" | "critical";

const SORT_PARAM = "newest";
const RANGE_PARAM = "30";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000)
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(1)}K`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function extractROI(campaign: HistoryCampaign): string | null {
  const roiMetric = campaign.metrics.find(
    (m) =>
      m.label.toLowerCase().includes("roi") ||
      m.label.toLowerCase().includes("roas"),
  );
  if (roiMetric) return roiMetric.value;
  if (campaign.kpis?.roas) return `${campaign.kpis.roas}x`;
  return null;
}

// ─── Platform Icon ─────────────────────────────────────────────────────────────

export function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "Google Ads") {
    return (
      <div className="flex mr-3 items-center justify-center flex-shrink-0 rounded-xl ">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </div>
    );
  }

  if (platform === "Facebook Ads") {
    return (
      <div className="flex mr-3 items-center justify-center flex-shrink-0">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
            fill="#1877F2"
          />
        </svg>
      </div>
    );
  }

  if (platform === "TikTok Ads") {
    return (
      <div className="flex mr-3 items-center justify-center flex-shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.81 1.54V6.79a4.85 4.85 0 01-1.04-.1z"
            fill="black"
          />
        </svg>
      </div>
    );
  }

  if (platform === "Instagram Ads") {
    return (
      <div className="flex mr-3 items-center justify-center flex-shrink-0">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id="ig-grad"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(6 21) rotate(-45) scale(26)"
            >
              <stop offset="0" stopColor="#f09433" />
              <stop offset="0.25" stopColor="#e6683c" />
              <stop offset="0.5" stopColor="#dc2743" />
              <stop offset="0.75" stopColor="#cc2366" />
              <stop offset="1" stopColor="#bc1888" />
            </radialGradient>
          </defs>
          <path
            fill="url(#ig-grad)"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex mr-3 items-center justify-center flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100">
      <BarChart2 size={16} className="text-gray-400" />
    </div>
  );
}
// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "on-track") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
        <CheckCircle2 size={10} strokeWidth={2.5} />
        On-Track
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
        <AlertTriangle size={10} strokeWidth={2.5} />
        Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E63946] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
      <AlertTriangle size={10} strokeWidth={2.5} />
      Critical
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  badge?: React.ReactNode;
};

function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  deltaPositive,
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-all duration-200">
      {/* Header Section: Icon & Label */}
      <div className="flex items-center gap-3">
        <div
          className={`rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} bg-opacity-10`}
        >
          {/* Menyesuaikan ukuran ikon agar tetap proporsional dengan container baru */}
          <div className="scale-90">{icon}</div>
        </div>
        <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </p>
      </div>

      <h3 className="text-lg font-bold text-slate-800 leading-tight">
        {value}
      </h3>

      {/* Content Section: Value & Delta */}
      <div className="flex flex-col gap-1">
        {(delta || deltaLabel) && (
          <div className="flex items-center gap-1">
            {delta && (
              <span
                className={`text-[10px] font-semibold ${deltaPositive ? "text-green-600" : "text-red-500"}`}
              >
                {delta}
              </span>
            )}
            {deltaLabel && (
              <span className="text-[10px] font-medium text-gray-400">
                {deltaLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Campaign Row ──────────────────────────────────────────────────────────────

function CampaignRow({
  campaign,
  onDetail,
  isLast,
}: {
  campaign: HistoryCampaign;
  onDetail?: (id: string) => void;
  isLast: boolean;
}) {
  const roi = extractROI(campaign);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
      onClick={() => onDetail?.(campaign.id)}
    >
      <PlatformIcon platform={campaign.platform} />

      {/* Nama kampanye — flex-1 supaya sisanya terdorong ke kanan */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-gray-900 truncate leading-tight">
          {campaign.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
          {campaign.startDate} – {campaign.endDate}
        </p>
      </div>

      {/* Status — fixed width + centered */}
      <div className="w-52 flex justify-center flex-shrink-0">
        <StatusBadge status={campaign.status as Status} />
      </div>

      {/* ROI — fixed width + centered */}
      <div className="w-40 flex justify-center flex-shrink-0">
        {roi ? (
          <p className="text-[13px] font-bold text-gray-800">{roi}</p>
        ) : (
          <p className="text-[13px] font-bold text-gray-300">—</p>
        )}
      </div>

      <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
    </div>
  );
}

// ─── Skeleton Row ──────────────────────────────────────────────────────────────

function SkeletonRow({ isLast }: { isLast: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 animate-pulse ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <div className="rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
        <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
      </div>
      <div className="w-16 h-5 bg-gray-100 rounded-full flex-shrink-0" />
      <div className="w-10 h-3 bg-gray-100 rounded flex-shrink-0" />
      <div className="w-3.5 h-3.5 bg-gray-100 rounded flex-shrink-0" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<HistoryCampaign[]>([]);
  const [meta, setMeta] = useState<HistoryMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDetail = (id: string) => {
    router.push(`/analysis/${id}`);
  };

  const handleLihatSemua = () => {
    router.push("/history");
  };

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        sort: SORT_PARAM,
        range: RANGE_PARAM,
        limit: "3",
      });

      const res = await fetch(`/api/dashboard/history?${params.toString()}`);
      const payload: HistoryApiResponse = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload.message || "Gagal memuat data dashboard.");
      }

      if (payload.data) {
        setCampaigns(payload.data.campaigns.slice(0, 4));
        setMeta(payload.data.meta);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi error saat memuat data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* ── Page Header ── */}
      <div className="relative mb-8 bg-white -gray-100 overflow-hidden">
        {/* Left: text */}
        <div className="max-w-[60%]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
              Adsvisor
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-[10px] text-gray-400 tracking-wide uppercase">
              Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900  leading-snug">
            Selamat datang kembali, Ngurah Ap 👋
          </h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
            Pantau performa iklanmu dan dapatkan insight terbaik untuk hasil
            maksimal.
          </p>
        </div>

        {/* Right: chart illustration */}
        <div className="absolute right-0 top-0 h-full w-[220px] flex items-center justify-end pr-4 pointer-events-none select-none">
          <Image
            src="/chartImage.png"
            alt="Dashboard Illustration"
            width={180}
            height={150}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Analisis"
          value={meta !== null ? String(meta.totalAnalisis) : "—"}
          delta="+1"
          deltaLabel="dari minggu lalu"
          deltaPositive
          icon={<ClipboardList size={16} className="text-[#E63946]" />}
          iconBg="bg-red-50"
        />

        <StatCard
          label="Rata-rata ROI"
          value={
            meta !== null
              ? meta.avgROI !== null
                ? `${meta.avgROI}x`
                : "—"
              : "—"
          }
          delta="+0.8x"
          deltaLabel="dari minggu lalu"
          deltaPositive
          icon={<TrendingUp size={16} className="text-green-500" />}
          iconBg="bg-green-50"
        />

        <StatCard
          label="Anggaran Terkelola"
          value={meta !== null ? formatRupiah(meta.anggaranTerkelola) : "—"}
          delta="+12.5%"
          deltaLabel="dari minggu lalu"
          deltaPositive
          icon={<Wallet size={16} className="text-purple-500" />}
          iconBg="bg-purple-50"
        />

        <StatCard
          label="Efisiensi AI"
          value={meta !== null ? `${meta.efisiensiAI}%` : "—"}
          deltaLabel="Sangat efisien ✨"
          icon={<Sparkles size={16} className="text-amber-500" />}
          iconBg="bg-amber-50"
          badge={
            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          }
        />
      </div>

      {/* ── Error State ── */}
      {error && !loading && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={fetchDashboard}
            className="text-[11px] font-bold text-[#E63946] uppercase hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Campaign Card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-[13.5px] font-bold text-gray-900">
            Riwayat Analisis Terbaru
          </p>
          <button
            onClick={handleLihatSemua}
            className="text-[12px] font-semibold text-[#E63946] hover:text-red-700 transition-colors flex items-center gap-1"
          >
            Lihat Semua
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Campaign List */}
        {loading ? (
          <>
            <SkeletonRow isLast={false} />
            <SkeletonRow isLast={false} />
            <SkeletonRow isLast={true} />
          </>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <BarChart2 size={20} className="text-gray-300" strokeWidth={2} />
            </div>
            <p className="text-[13px] font-bold text-gray-700">
              Belum ada analisis
            </p>
            <p className="text-[11px] text-gray-400 text-center max-w-xs leading-relaxed">
              Mulai analisis pertama kamu untuk melihat performa kampanye di
              sini.
            </p>
            <button
              onClick={() => router.push("/analysis")}
              className="mt-1 text-[11px] font-bold text-[#E63946] border border-[#E63946] px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-tight"
            >
              Mulai Sekarang
            </button>
          </div>
        ) : (
          campaigns.map((campaign, idx) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              onDetail={handleDetail}
              isLast={idx === campaigns.length - 1}
            />
          ))
        )}
      </div>

      {/* Spinner saat refetch */}
      {loading && campaigns.length > 0 && (
        <div className="flex justify-center mt-6">
          <Loader2 size={16} className="animate-spin text-gray-300" />
        </div>
      )}
    </div>
  );
}
