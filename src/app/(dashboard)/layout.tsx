"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ChartColumn,
  BriefcaseBusiness,
  Users,
  Settings,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("Loading...");

  // Fungsi untuk mengambil inisial dari nama
  const getInitials = (name: string) => {
    if (!name || name === "Loading...") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2); // Ambil maksimal 2 huruf (contoh: Aditya Romanov -> AR)
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          setUserName(data.name);
        }
      })
      .catch(() => {
        setUserName("User");
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Analytics", icon: ChartColumn, active: true },
    { label: "Portfolio", icon: BriefcaseBusiness },
    { label: "Advisors", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-white text-gray-800 font-sans">
      <aside className="h-screen w-52 sticky top-0 bg-white border-r border-gray-100 flex flex-col py-6 shrink-0">
        {/* LOGO */}
        <div className="px-5 flex items-center gap-3 font-bold">
          <img src="/logo.png" alt="AdvisorAI Logo" className="h-4 w-auto" />
          <p>AdsVisor</p>
        </div>

        {/* NAV MENU */}
        <nav className="flex-1 flex flex-col justify-center gap-1 text-sm">
          {navItems.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                active
                  ? "text-red-600 font-semibold border-r-2 border-red-600 rounded-r-none mr-0 pr-3.5"
                  : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </nav>

        {/* BOTTOM AREA */}
        <div className="px-2 flex flex-col gap-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-800 hover:bg-gray-50"
          >
            <Settings size={15} />
            Settings
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 w-full text-left"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-8 py-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-72">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              placeholder="Cari analisis atau laporan..."
              className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell dengan Red Dot sesuai gambar */}
            <button className="relative w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-slate-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            {/* Profile Section */}
            <div className="flex items-center justify-center gap-3">
              {/* Avatar Bulat Biru dengan Inisial */}
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-[11px]">
                {getInitials(userName)}
              </div>

              <div className="flex flex-col">
                <p className="text-xs font-semibold text-slate-700 leading-tight">
                  {userName}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-10 bg-white">{children}</main>
      </div>
    </div>
  );
}
