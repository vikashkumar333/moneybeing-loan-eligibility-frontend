"use client";

import { Lock, Users, Zap, FileText } from "lucide-react";

export const LoanFooter = () => {
  return (
    <footer className="w-full mt-6 sm:mt-8 pt-0 pb-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compact Trust Features Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:py-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* 100% Secure */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Lock className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">100% Secure</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">Your data is encrypted</p>
              </div>
            </div>

            {/* Trusted by Millions */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">Trusted by Millions</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">Over 10 Lakh+ customers</p>
              </div>
            </div>

            {/* Instant & Easy */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Zap className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">Instant & Easy</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">Quick process & approval</p>
              </div>
            </div>

            {/* Minimal Documentation */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pl-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">Minimal Documentation</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">Hassle-free experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Copyright & Policy Links */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs text-slate-500">
          <p>© 2026 MoneyBeing. All rights reserved.</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms & Conditions</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Grievance Redressal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
