"use client";

import { BarChart3, Zap, FlaskConical, Sparkles } from "lucide-react";
import { MetricCard } from "../components/MetricCard";

const AdvisorLandingPage = () => {
  return (
    <div className="bg-white text-[#1a1c31] font-sans antialiased min-h-screen flex flex-col">
      {/* 1. NAVBAR - Sticky */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 font-bold">
            <img src="/logo.png" alt="AdvisorAI Logo" className="h-4 w-auto" />
            <p>AdsVisor</p>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1a1c31]">
            {["Product", "Features", "Pricing", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className={`pb-0.5 ${item === "Product" ? "text-[#E63946] border-b-2 border-[#E63946]" : "text-[#1a1c31] hover:text-[#E63946]"}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="text-sm font-semibold text-[#1a1c31] hover:text-[#E63946] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => window.location.href = '/register'}
              className="bg-[#E63946] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#d62d3a] transition-colors"
            >
              Mulai Analisis Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="bg-white flex-grow flex items-center py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
          <div className="flex flex-col space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdf2f2] text-[#E63946] text-xs font-bold w-fit tracking-wide">
              AI-POWERED ADS ADVISOR ✦
            </span>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
              Ubah Data Iklanmu
              <br />
              Jadi Keputusan
              <br />
              yang Tepat
            </h1>

            <p className="text-base text-slate-600 max-w-[450px] leading-relaxed">
              Analisis CTR, CPC, CPA & ROAS kampanye Facebook, Google & TikTok
              Ads kamu — lalu dapatkan rekomendasi AI dalam 2 menit.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <button 
                onClick={() => window.location.href = '/register'}
                className="bg-[#E63946] text-white px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 hover:bg-[#d62d3a] transition-all shadow-md active:scale-95"
              >
                Mulai Analisis Gratis →
              </button>
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="font-bold text-slate-500 text-sm flex items-center gap-1.5 hover:text-[#E63946] transition-colors"
              >
                Lihat Cara Kerjanya <span className="text-lg">↓</span>
              </button>
            </div>
          </div>

          <div className="relative scale-90 lg:scale-95 origin-center lg:origin-right">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] relative">
              <div className="flex gap-1.5 mb-6">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Dashboard Analisis •{" "}
                  <span className="text-emerald-500">Live</span>
                </span>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="CTR" value="2.45%" change="+ 0.41%" isUp />
                  <MetricCard
                    title="CPC"
                    value="Rp 1.250"
                    change="+ 12%"
                    isUp
                  />
                  <MetricCard
                    title="CPA"
                    value="15.000"
                    change="Stable"
                    isStable
                  />
                  <MetricCard title="ROAS" value="4.2x" change="+ 1.1x" isUp />
                </div>

                <div className="mt-5 p-4 rounded-xl border border-blue-100 bg-white shadow-sm">
                  <p className="font-bold text-xs text-[#E63946] mb-1.5 flex items-center gap-1.5">
                    ✨ AI Insights & Recommendation
                  </p>
                  <p className="text-[13px] text-slate-600 leading-relaxed italic">
                    "Kampanye Google Search kamu menunjukkan performa CTR di
                    atas rata-rata industri. Fokuskan budget 30% lebih
                    banyak..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO FEATURES SECTION */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Fitur Utama Untuk Pertumbuhan
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Kami tidak hanya memberikan data, kami memberikan strategi yang
              didukung oleh data real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Multi-Platform */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="bg-[#E63946] w-9 h-9 rounded-lg flex items-center justify-center mb-5">
                <BarChart3 className="text-white w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Multi–Platform Centralization
              </h3>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Hubungkan semua akun iklanmu dan lihat gambaran besar bisnismu
                tanpa harus berpindah tab.
              </p>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                <svg
                  width="150"
                  height="150"
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

            {/* Real-time Alert */}
            <div className="md:col-span-4 bg-[#006070] rounded-3xl p-8 text-white">
              <Zap className="text-white w-7 h-7 mb-5 fill-white" />
              <h3 className="text-xl font-bold mb-3">Real-time Alert</h3>
              <p className="text-xs text-teal-50/80 leading-relaxed">
                Dapatkan notifikasi instan saat biaya per klik melonjak atau
                ROAS menurun drastis.
              </p>
            </div>

            {/* A/B Test AI */}
            <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className=" w-10 h-10 rounded-lg flex items-center justify-center mb-5">
                <FlaskConical className="text-blue-600 w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">A/B Test AI</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Biar AI kami yang menentukan mana materi kreatif yang paling
                berpotensi memenangkan audiens.
              </p>
            </div>

            {/* Smart Budgeting */}
            <div className="md:col-span-8 bg-[#fff5f5] rounded-3xl p-8 border border-red-50 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
              <div className="flex-1">
                <div className="bg-white w-9 h-9 rounded-lg flex items-center justify-center mb-5 shadow-sm">
                  <Sparkles className="text-[#E63946] w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  Smart Budgeting
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Alokasi otomatis anggaran iklanmu ke kampanye dengan performa
                  tertinggi setiap hari.
                </p>
              </div>
              <div className="w-full md:w-40 bg-white rounded-xl p-4 shadow-sm border border-red-100 flex flex-col gap-2">
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
