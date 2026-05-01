"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  History,
  Settings,
  Search,
  Bell,
  LogOut,
  ChartColumn,
  Menu,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Loading...");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name || name === "Loading...") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => data.name && setUserName(data.name))
      .catch(() => setUserName("User"));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Analysis", icon: ChartColumn, path: "/analysis" },
    { label: "History", icon: History, path: "/history" },
    { label: "Settings", icon: Settings, path: "/Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800 font-sans">
      {/* ── SIDEBAR (desktop only) ── */}
      <aside className="hidden md:flex h-screen w-52 sticky top-0 bg-white border-r border-gray-100 flex-col py-6 shrink-0">
        <div className="px-5 flex items-center gap-3 font-bold">
          <img src="/logo.png" alt="AdsVisor" className="h-4 w-auto" />
          <p>AdsVisor</p>
        </div>

        <nav className="flex-1 flex flex-col justify-center gap-1 text-sm">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <button
                key={label}
                onClick={() => handleNav(path)}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors text-left ${
                  active
                    ? "text-red-600 font-semibold border-r-2 border-red-600 rounded-r-none mr-0 pr-3.5"
                    : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-2 flex flex-col gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 w-full text-left"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ── TOPBAR ── */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-4 md:px-8 py-3">
          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden p-1 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-72">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              placeholder="Cari analisis atau laporan..."
              className="bg-transparent text-sm outline-none text-gray-700 w-full"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-[11px]">
                {getInitials(userName)}
              </div>
              <p className="hidden sm:block text-xs font-semibold text-slate-700">
                {userName}
              </p>
            </div>
          </div>
        </header>

        {/* ── MOBILE DRAWER ── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col py-6">
              <div className="px-5 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 font-bold">
                  <img src="/logo.png" alt="AdsVisor" className="h-4 w-auto" />
                  <p>AdsVisor</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1 text-sm px-2">
                {navItems.map(({ label, icon: Icon, path }) => {
                  const active = isActive(path);
                  return (
                    <button
                      key={label}
                      onClick={() => handleNav(path)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        active
                          ? "text-red-600 font-semibold bg-red-50"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </nav>

              <div className="px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 md:p-10 bg-white pb-24 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
