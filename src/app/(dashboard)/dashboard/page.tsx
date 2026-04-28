"use client";
import { useState } from "react";
import { Info, ChartColumn } from "lucide-react";

type PerfFields = {
  impressions: string;
  clicks: string;
  conversions: string;
  spend: string;
  price: string;
};

const FIELD_LABELS: Record<keyof PerfFields, string> = {
  impressions: "Impressions",
  clicks: "Clicks",
  conversions: "Conversions",
  spend: "Spend",
  price: "Harga",
};

export default function DashboardPage() {
  const [fields, setFields] = useState<PerfFields>({
    impressions: "",
    clicks: "",
    conversions: "",
    spend: "",
    price: "",
  });

  function resetForm() {
    setFields({
      impressions: "",
      clicks: "",
      conversions: "",
      spend: "",
      price: "",
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analisis Baru</h1>
        <p className="text-sm text-gray-400 mt-1">
          Masukkan data kampanye iklanmu untuk mendapatkan insight cerdas.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-8 space-y-8">
        {/* Informasi Kampanye */}
        <section>
          <h2 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-1.5">
            <Info size={15} className="text-red-500" />
            Informasi Kampanye
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Nama Kampanye</label>
              <input
                placeholder="Contoh: Promo Ramadhan 2024"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 placeholder-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Platform</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-white">
                <option>Facebook Ads</option>
                <option>Google Ads</option>
                <option>TikTok Ads</option>
                <option>Instagram Ads</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Tanggal Mulai</label>
              <input
                type="date"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Tanggal Selesai</label>
              <input
                type="date"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Data Performa */}
        <section>
          <h2 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-1.5">
            <ChartColumn size={15} className="text-red-500" />
            Data Performa
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {(["impressions", "clicks", "conversions"] as const).map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">
                  {FIELD_LABELS[key]}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={fields[key]}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 placeholder-gray-300"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Total Spend (Rp)</label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50">
                <span className="px-3 py-2 bg-gray-50 text-xs text-gray-400 border-r border-gray-200">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={fields.spend}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, spend: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none placeholder-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 w-1/2 pr-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">
                Harga Produk (Rp){" "}
                <span className="text-gray-300">— Opsional</span>
              </label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50">
                <span className="px-3 py-2 bg-gray-50 text-xs text-gray-400 border-r border-gray-200">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={fields.price}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, price: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none placeholder-gray-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <button
            onClick={resetForm}
            className="text-sm text-gray-300 hover:text-gray-500 transition-colors"
          >
            Reset
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Hitung KPI &amp; Analisis
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 flex items-start gap-2.5 bg-white border border-gray-100 rounded-lg px-4 py-3">
        <Info size={13} className="text-red-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="text-gray-600 font-medium">Tips Cerdas</span> —
          Lengkapi data Conversions untuk mendapatkan analisis ROAS (Return on
          Ad Spend) yang lebih akurat dari AdvisorAI.
        </p>
      </div>
    </div>
  );
}
