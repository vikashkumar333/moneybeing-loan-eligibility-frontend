"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // /apply and /result have their own dedicated header
  if (pathname === "/apply" || pathname.startsWith("/result")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-200/60"
      }`}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between w-full">
          {/* FAR LEFT: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl shadow-md shadow-blue-500/20 tracking-tighter transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/35">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">
                MoneyBeing
              </span>
              <span className="text-[10.5px] uppercase font-bold text-blue-600 tracking-wider leading-tight">
                LOAN PORTAL
              </span>
            </div>
          </Link>

          {/* FAR RIGHT: Admin Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Profile Pill */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs uppercase shadow-sm">
                    {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-none">
                      {user?.username || "admin"}
                    </span>
                    <span className="text-[9px] uppercase font-semibold text-blue-600 tracking-wider mt-0.5">
                      {user?.role || "ADMIN"}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Admin Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
