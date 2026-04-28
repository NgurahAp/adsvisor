"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registrasi gagal");
        setLoading(false);
        return;
      }

      // Redirect langsung
      window.location.replace("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
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

        {/* CENTER REGISTER CARD */}
        <main className="flex-grow flex items-center justify-center px-6 pb-16">
          <div className="bg-white w-full max-w-[420px] rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
              </div>
              <h1 className="text-2xl font-black mb-1.5 tracking-tight">
                Daftar Akun
              </h1>
              <p className="text-[13px] text-slate-500">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-[#E63946] font-semibold hover:underline"
                >
                  Masuk
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
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/5 outline-none text-[13px]"
                />
              </div>

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
                    placeholder="Buat password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
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

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 ml-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/5 outline-none text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E63946] text-white py-3 rounded-xl font-bold text-[13px] hover:bg-[#d62d3a] transition-all mt-2 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <div className="hidden lg:block lg:w-1/2 h-screen">
        <img
          src="/login.jpg"
          alt="Register Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
