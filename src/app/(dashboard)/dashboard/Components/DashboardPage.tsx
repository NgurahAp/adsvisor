import { ArrowRight, BarChart3, Info, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
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

export default function DashboardPage({ onAnalyze }: DashboardProps) {
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

  const handleAnalyze = () => {
    if (!fields.impressions || !fields.clicks || !fields.spend) {
      setError("Minimal isi Impressions, Clicks, dan Total Spend ya.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      const kpis = calcKPIs(fields);
      const dummyAnalysis: DummyAnalysis = {
        summary:
          "Kampanye ini menunjukkan performa yang cukup solid di pasar lokal, terutama pada efisiensi biaya per klik (CPC). CTR Anda berada di atas rata-rata industri Indonesia sebesar 1.2%, yang menandakan materi kreatif cukup relevan bagi audiens target.",
        whatsWorking: [
          "Targeting audiens 'Interest' menunjukkan engagement rate tertinggi.",
          "Materi iklan video 15 detik memiliki retensi penonton 40% lebih baik dibanding statis.",
          "Biaya akuisisi (CPA) masih dalam batas margin keuntungan produk.",
        ],
        needsAttention: [
          "Frekuensi iklan mulai menyentuh angka 3.2, waspada terhadap kejenuhan audiens.",
          "Landing page load time di perangkat mobile melambat di angka 4.5 detik.",
          "Konversi pada hari kerja (Weekdays) menurun signifikan dibanding akhir pekan.",
        ],
        recommendations: [
          "Segera lakukan refresh materi kreatif (creative fatigue) untuk menurunkan frekuensi.",
          "Optimasi ukuran gambar di landing page untuk mempercepat loading time.",
          "Alokasikan 20% budget lebih banyak ke hari Sabtu dan Minggu untuk memaksimalkan ROAS.",
        ],
        priority:
          "Lakukan Creative Refresh pada set iklan dengan frekuensi tertinggi hari ini juga.",
      };

      onAnalyze({
        fields,
        kpis,
        analysis: dummyAnalysis,
        timestamp: new Date(),
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
            AdvisorAI
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-[10px] text-gray-400 tracking-wide uppercase">
            Analisis Kampanye
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Analisis Baru
        </h1>
        <p className="text-sm text-gray-400 mt-1">
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
