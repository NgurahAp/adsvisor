"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Login response:", data);

      // Tunggu sebentar untuk memastikan cookie ter-set
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-[#1a1c31]">
      <div className="w-full lg:w-1/2 bg-[#fcfcfc] flex flex-col">
        {/* TOP NAV */}
        <header className="p-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-[#1a1c31] transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
        </header>

        {/* CENTER LOGIN CARD */}
        <main className="flex-grow flex items-center justify-center px-6 pb-16">
          <div className="bg-white w-full max-w-[400px] rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
              </div>
              <h1 className="text-2xl font-black mb-1.5 tracking-tight">
                Masuk
              </h1>
              <p className="text-[13px] text-slate-500">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="text-[#E63946] font-semibold hover:underline"
                >
                  Daftar
                </a>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-[12px] mb-4">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/5 outline-none text-[13px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/5 outline-none text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E63946] text-white py-3 rounded-xl font-bold text-[13px] hover:bg-[#d62d3a] transition-all mt-2 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </div>
        </main>
      </div>{" "}
      <div className="hidden lg:block lg:w-1/2 h-screen">
        <img
          src="/login.jpg"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
