"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getFirstValidationError,
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";

type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string>>;

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [formData, setFormData] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const inputClassName = (hasError?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border ${
      hasError ? "border-red-300" : "border-gray-200"
    } focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/5 outline-none text-[13px]`;

  const updateField = (field: keyof RegisterFormValues, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedFields = registerFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      });
      toast.error(getFirstValidationError(validatedFields.error));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: validatedFields.data.name,
          email: validatedFields.data.email,
          password: validatedFields.data.password,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Registrasi gagal");
        setLoading(false);
        return;
      }

      toast.success("Registrasi berhasil");

      // Redirect langsung
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 700);
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
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

            {/* FORM */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 ml-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={
                    fieldErrors.name ? "register-name-error" : undefined
                  }
                  className={inputClassName(Boolean(fieldErrors.name))}
                />
                {fieldErrors.name && (
                  <p
                    id="register-name-error"
                    className="ml-1 text-[11px] font-medium text-red-600"
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? "register-email-error" : undefined
                  }
                  className={inputClassName(Boolean(fieldErrors.email))}
                />
                {fieldErrors.email && (
                  <p
                    id="register-email-error"
                    className="ml-1 text-[11px] font-medium text-red-600"
                  >
                    {fieldErrors.email}
                  </p>
                )}
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
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                    minLength={6}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password
                        ? "register-password-error"
                        : undefined
                    }
                    className={`${inputClassName(
                      Boolean(fieldErrors.password),
                    )} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p
                    id="register-password-error"
                    className="ml-1 text-[11px] font-medium text-red-600"
                  >
                    {fieldErrors.password}
                  </p>
                )}
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
                      updateField("confirmPassword", e.target.value)
                    }
                    required
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={
                      fieldErrors.confirmPassword
                        ? "register-confirm-password-error"
                        : undefined
                    }
                    className={`${inputClassName(
                      Boolean(fieldErrors.confirmPassword),
                    )} pr-10`}
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
                {fieldErrors.confirmPassword && (
                  <p
                    id="register-confirm-password-error"
                    className="ml-1 text-[11px] font-medium text-red-600"
                  >
                    {fieldErrors.confirmPassword}
                  </p>
                )}
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
