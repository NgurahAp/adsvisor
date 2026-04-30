import { ArrowRight, BarChart3, Info, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { AnalysisData, CampaignFields } from "@/lib/types";

interface FormProps {
  onAnalyze: (data: AnalysisData) => void;
}

const INITIAL_FIELDS: CampaignFields = {
  name: "",
  platform: "Facebook Ads",
  startDate: "",
  endDate: "",
  impressions: "",
  clicks: "",
  conversions: "",
  spend: "",
  price: "",
};

const PLATFORMS = [
  "Facebook Ads",
  "Google Ads",
  "TikTok Ads",
  "Instagram Ads",
] as const;

const PERFORMANCE_FIELDS: Array<[keyof CampaignFields, string]> = [
  ["impressions", "Impressions"],
  ["clicks", "Clicks"],
  ["conversions", "Conversions"],
];

function Spinner() {
  return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
}

export default function FormPage({ onAnalyze }: FormProps) {
  const [fields, setFields] = useState<CampaignFields>(INITIAL_FIELDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setField =
    (key: keyof CampaignFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setFields(INITIAL_FIELDS);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!fields.impressions || !fields.clicks || !fields.spend) {
      setError("Minimal isi Impressions, Clicks, dan Total Spend ya.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload?.message || "Gagal menganalisis campaign.");
      }

      if (payload.data) {
        onAnalyze({
          analysisId: payload.data.analysisId,
          fields: payload.data.fields,
          kpis: payload.data.kpis,
          analysis: payload.data.analysis,
          timestamp: payload.data.timestamp,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi error saat proses analisis.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
            Adsvisor
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-[10px] text-gray-400 tracking-wide uppercase">
            Analisis Kampanye
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900  leading-snug">
          Analisis Baru
        </h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
          Masukkan data kampanye iklanmu untuk mendapatkan insight cerdas.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm mb-4">
        {/* Informasi Kampanye */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[#E63946]">
              <Info size={16} strokeWidth={2.5} />
            </span>
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Informasi Kampanye
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-gray-400 uppercase">
                Nama Kampanye
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946] transition-all"
                placeholder="Contoh: Promo Ramadhan 2024"
                value={fields.name}
                onChange={setField("name")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-gray-400 uppercase">
                Platform
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946] transition-all"
                value={fields.platform}
                onChange={setField("platform")}
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-gray-400 uppercase">
                Tanggal Mulai
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946]"
                value={fields.startDate}
                onChange={setField("startDate")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-gray-400 uppercase">
                Tanggal Selesai
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946]"
                value={fields.endDate}
                onChange={setField("endDate")}
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-50 mb-8" />

        {/* Data Performa */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[#E63946]">
              <BarChart3 size={16} strokeWidth={2.5} />
            </span>
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Data Performa
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERFORMANCE_FIELDS.map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase">
                  {label}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#E63946]/10 focus:border-[#E63946]"
                  value={fields[key]}
                  onChange={setField(key)}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-gray-400 uppercase">
                Total Spend (Rp)
              </label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#E63946]/10 focus-within:border-[#E63946] transition-all">
                <span className="px-3 py-2 bg-gray-50 text-[11px] text-gray-400 border-r border-gray-200 flex items-center font-bold">
                  Rp
                </span>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-sm outline-none border-none"
                  placeholder="0"
                  value={fields.spend}
                  onChange={setField("spend")}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 md:w-1/2 space-y-1.5">
            <label className="text-[11px] font-medium text-gray-400 uppercase">
              Harga Produk (Rp){" "}
              <span className="text-gray-300 font-normal ml-1 lowercase">
                — opsional
              </span>
            </label>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#E63946]/10 focus-within:border-[#E63946] transition-all">
              <span className="px-3 py-2 bg-gray-50 text-[11px] text-gray-400 border-r border-gray-200 flex items-center font-bold">
                Rp
              </span>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm outline-none border-none"
                placeholder="0"
                value={fields.price}
                onChange={setField("price")}
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
          <button
            onClick={resetForm}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-400 transition-colors uppercase font-bold tracking-tight"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 bg-[#E63946] hover:bg-[#d62d3a] disabled:bg-red-200 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-red-100"
          >
            {loading ? (
              <>
                <Spinner /> Menganalisis...
              </>
            ) : (
              <>
                Hitung KPI & Analisis
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
