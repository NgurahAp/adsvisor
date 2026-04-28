"use client";
import {
  Download,
  Plus,
  History,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type Badge = {
  label: string;
  positive: boolean;
};

type MetricCard = {
  title: string;
  value: string;
  badge: Badge;
};

type Recommendation = {
  number: number;
  text: string;
};

const metrics: MetricCard[] = [
  { title: "CTR", value: "4.28%", badge: { label: "+12.4%", positive: true } },
  {
    title: "CPC",
    value: "Rp 0.84",
    badge: { label: "-0.12%", positive: false },
  },
  {
    title: "CPA",
    value: "Rp 14.200",
    badge: { label: "-8.1%", positive: false },
  },
  { title: "ROAS", value: "5.4x", badge: { label: "+1.2x", positive: true } },
];

const whatsWorking = [
  "Video format 9:16 memiliki tingkat konversi 2.4x lebih tinggi daripada format statis.",
  "Penargetan audiens 'Lookalike 1%' menunjukkan ROAS paling stabil di angka 6.2x.",
];

const needsAttention = [
  "Frekuensi iklan di atas 4.5 untuk segmen audiens 'Retargeting' menyebabkan kejenuhan (Ad Fatigue).",
  "Waktu muat landing page melambat pada perangkat mobile Android tertentu.",
];

const recommendations: Recommendation[] = [
  {
    number: 1,
    text: "Rotasi kreatif video baru untuk audiens retargeting minggu depan.",
  },
  {
    number: 2,
    text: "Naikkan budget harian sebesar 15% pada set iklan 'Lookalike'.",
  },
  { number: 3, text: "Optimalkan kompresi gambar pada landing page utama." },
];

export default function HasilAnalisisPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hasil Analisis</h1>
          <p className="text-sm text-gray-400 mt-1">
            Masukkan data kampanye iklanmu untuk mendapatkan insight cerdas.
          </p>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={13} />
          Export .txt
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {metrics.map((m) => (
          <div
            key={m.title}
            className="bg-white border border-gray-100 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{m.title}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  m.badge.positive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {m.badge.positive ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {m.badge.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        {/* AI Analysis Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={15} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-800">
              AI Analysis
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Terakhir diperbarui: 24 Jan 2024, 15:30
          </span>
        </div>

        {/* Performance Summary */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 tracking-wide uppercase mb-2">
            Performance Summary
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Kampanye ini menunjukkan performa yang sangat kuat di atas rata-rata
            industri. CTR meningkat signifikan didorong oleh materi kreatif
            varian B yang memiliki tingkat interaksi 35% lebih tinggi
            dibandingkan varian A. Pengurangan CPC secara bertahap menunjukkan
            optimasi penargetan yang mulai efektif.
          </p>
        </div>

        <hr className="border-gray-100 mb-5" />

        {/* What's Working */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 tracking-wide uppercase mb-3">
            What's Working
          </p>
          <ul className="space-y-2">
            {whatsWorking.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span className="text-sm text-gray-500">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-gray-100 mb-5" />

        {/* What Needs Attention */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 tracking-wide uppercase mb-3">
            What Needs Attention
          </p>
          <ul className="space-y-2">
            {needsAttention.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-sm text-gray-500">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-gray-100 mb-5" />

        {/* Recommendations */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 tracking-wide uppercase mb-3">
            Recommendations
          </p>
          <div className="grid grid-cols-3 gap-3">
            {recommendations.map((r) => (
              <div key={r.number} className="bg-red-50 rounded-lg p-3">
                <span className="text-xs font-bold text-red-400 mb-1.5 block">
                  {r.number}
                </span>
                <p className="text-xs text-red-700 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action */}
        <div className="border-l-4 border-red-500 bg-red-50 rounded-r-lg px-4 py-3">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">
            Priority Action
          </p>
          <p className="text-sm text-red-700 leading-relaxed">
            Segera alihkan sisa budget dari Ad Set "General Interest" ke
            "Lookalike Audience" untuk memaksimalkan ROAS sebelum promo
            berakhir.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus size={13} />
            Analisis Baru
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <History size={13} />
            Lihat Riwayat
          </button>
        </div>
        <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          <Download size={13} />
          Export .txt
        </button>
      </div>
    </div>
  );
}
