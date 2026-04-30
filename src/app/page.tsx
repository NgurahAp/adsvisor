"use client";

import { BarChart3, Zap, FlaskConical, Sparkles } from "lucide-react";
import { PlatformIcon } from "./(dashboard)/dashboard/page";

const AdvisorLandingPage = () => {
  const platforms = ["Google Ads", "Facebook Ads", "Instagram Ads"];

  return (
    <div className="bg-white text-[#1a1c31] font-sans antialiased min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold">
            <img src="/logo.png" alt="AdvisorAI Logo" className="h-4 w-auto" />
            <p className="text-sm">AdsVisor</p>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
            {["Product", "Features", "Pricing", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className={`pb-0.5 ${
                  item === "Product"
                    ? "text-[#E63946] border-b-2 border-[#E63946]"
                    : "hover:text-[#E63946]"
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-xs font-semibold hover:text-[#E63946]"
            >
              Login
            </button>
            <button
              onClick={() => (window.location.href = "/register")}
              className="bg-[#E63946] text-white px-4 py-1.5 rounded-full font-bold text-xs hover:bg-[#d62d3a]"
            >
              Mulai Analisis Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="bg-white pt-10 pb-10 px-10">
        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-[0.9fr_1.1fr] items-center ">
          {/* LEFT */}
          <div className="flex flex-col space-y-5">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#fdf2f2] text-[#E63946] text-[8px] font-bold w-fit tracking-wide">
              AI-POWERED ADS ADVISOR ✦
            </span>

            <h1 className="text-[28px] lg:text-[36px] font-extrabold leading-[1.18] tracking-tight text-slate-900">
              Ubah Data Iklanmu
              <br />
              <span className="text-[#E63946]">Jadi Keputusan</span>
              <br />
              yang Tepat
            </h1>

            <p className="text-[12px] text-slate-500 max-w-[380px] leading-relaxed">
              Analisis CTR, CPC, CPA & ROAS kampanye Facebook, Google & TikTok
              Ads kamu — lalu dapatkan rekomendasi AI dalam{" "}
              <span className="text-[#E63946] font-semibold">2 menit.</span>
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => (window.location.href = "/register")}
                className="bg-[#E63946] text-white px-4 py-2 rounded-xl font-semibold text-[12px] shadow-md hover:bg-[#d62d3a]"
              >
                Mulai Analisis Gratis →
              </button>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
                className="font-semibold text-slate-400 text-[10px] hover:text-[#E63946]"
              >
                Lihat Cara Kerjanya ↓
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full lg:pl-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white rounded-xl blur-2xl opacity-60" />

            <div className="relative w-full rounded-xl overflow-hidden border border-gray-100 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)]">
              <img
                src="/dashboard.png"
                alt="AdsVisor Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-5 px-10">
        <div className="max-w-[1100px] mx-auto px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          {/* LEFT — INTEGRATION LOGOS (SMALL VERSION) */}
          <div>
            <p className="text-[8px] text-slate-400 font-semibold mb-4 uppercase tracking-wider">
              Integrasi Platform Ads
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {platforms.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center text-[10px] font-semibold text-slate-400 grayscale opacity-70"
                >
                  <PlatformIcon platform={platform} />
                  {platform}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — FEATURES (COMPACT VERSION) */}
          <div className="grid grid-cols-3 gap-8">
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 bg-red-50 rounded-md flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
              </div>
              <div>
                <p className="font-bold text-[11px] leading-tight">
                  Insight AI Otomatis
                </p>
                <p className="text-[9px] text-slate-400">
                  Rekomendasi optimasi instan.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 bg-red-50 rounded-md flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[#E63946]" />
              </div>
              <div>
                <p className="font-bold text-[11px] leading-tight">
                  Analisis Cepat
                </p>
                <p className="text-[9px] text-slate-400">
                  Insight dalam hitungan menit.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 bg-red-50 rounded-md flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-[#E63946]" />
              </div>
              <div>
                <p className="font-bold text-[11px] leading-tight">
                  Semua Platform
                </p>
                <p className="text-[9px] text-slate-400">
                  Google, Meta & TikTok Ads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* TITLE */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-slate-900 ">
              Fitur Utama Untuk Pertumbuhan
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Bukan sekadar data — tapi strategi berbasis performa real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Multi Platform */}
            <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="bg-[#E63946] w-8 h-8 rounded-md flex items-center justify-center mb-4">
                <BarChart3 className="text-white w-4 h-4" />
              </div>
              <h3 className="text-[16px] font-bold mb-2">
                Multi-Platform Centralization
              </h3>
              <p className="text-[12px] text-slate-500 max-w-xs">
                Semua akun ads dalam satu dashboard.
              </p>

              <div className="absolute right-[-10px] bottom-[-10px] opacity-5">
                <svg
                  width="130"
                  height="130"
                  viewBox="0 0 200 200"
                  fill="currentColor"
                >
                  <circle cx="100" cy="100" r="40" />
                  <circle cx="160" cy="60" r="20" />
                  <circle cx="40" cy="140" r="25" />
                  <line
                    x1="100"
                    y1="100"
                    x2="160"
                    y2="60"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                </svg>
              </div>
            </div>

            {/* Real-time alert */}
            <div className="md:col-span-4 bg-[#006070] rounded-2xl p-6 text-white">
              <Zap className="w-6 h-6 mb-4 fill-white" />
              <h3 className="text-[16px] font-bold mb-2">Real-time Alert</h3>
              <p className="text-[11px] text-teal-50/80">
                Notifikasi saat performa campaign berubah drastis.
              </p>
            </div>

            {/* AB Test */}
            <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <FlaskConical className="text-blue-600 w-4 h-4 mb-4" />
              <h3 className="text-[16px] font-bold mb-2">AI A/B Testing</h3>
              <p className="text-[12px] text-slate-500">
                AI memilih kreatif terbaik otomatis.
              </p>
            </div>

            {/* Smart budgeting */}
            <div className="md:col-span-8 bg-[#fff5f5] rounded-2xl p-6 border border-red-50 flex flex-col md:flex-row items-center gap-5">
              <div className="flex-1">
                <div className="bg-white w-8 h-8 rounded-md flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="text-[#E63946] w-4 h-4" />
                </div>
                <h3 className="text-[16px] font-bold mb-2">Smart Budgeting</h3>
                <p className="text-[12px] text-slate-500">
                  Anggaran otomatis ke campaign performa terbaik.
                </p>
              </div>

              <div className="w-full md:w-36 bg-white rounded-lg p-3 shadow-sm border border-red-100 flex flex-col gap-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E63946] w-[70%]" />
                </div>
                <div className="h-1.5 w-1/2 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvisorLandingPage;
