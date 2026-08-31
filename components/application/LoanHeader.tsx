"use client";

import Link from "next/link";
import { Headphones, User } from "lucide-react";

export const LoanHeader = () => {
  return (
    <header className="w-full bg-white border-b border-slate-100 py-3.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo matching reference images */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-2xl shadow-sm tracking-tighter">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-slate-900 leading-tight">MoneyBeing</span>
            <span className="text-[11px] text-slate-500 font-medium leading-tight">Smart Loans, Better Living</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-5 sm:gap-7">
          <a
            href="mailto:support@moneybeing.com"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <Headphones className="h-4 w-4 text-slate-600" />
            <span>Help & Support</span>
          </a>

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-semibold transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
