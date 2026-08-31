"use client";

import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Database,
  BarChart3,
  Sparkles,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pt-12 sm:pb-10">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none -z-10">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/90 px-4 py-1 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-md mb-5 hover:border-blue-300 transition-all">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              <span className="tracking-wide">Real-Time Business Rule Engine & Credit Bureau Scoring</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Instant Loan Eligibility &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                Intelligent Lead Routing
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 max-w-2xl font-normal">
              Submit loan applications with confidence. Experience automated credit score retrieval,
              dynamic database-driven rule checks, and transparent eligibility evaluations in seconds.
            </p>

            {/* CTA Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/apply"
                className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Apply for Loan</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Bank-Grade 256-Bit Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-blue-600" />
                <span>Zero Inquiry Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Instant BRE Decision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURE HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 bg-white border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-7 shadow-sm hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-600 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Instant Evaluation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Automated multi-factor assessment of applicant age, income, loan ratio, and credit
                bureau scores with zero latency.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-7 shadow-sm hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-blue-100/80 text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Configurable BRE Rules
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Database-driven business rules that can be created, updated, and toggled by
                administrators on the fly without code deployments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-7 shadow-sm hover:bg-white hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-purple-100/80 text-purple-600 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Live Management & Analytics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Comprehensive admin portal offering live KPI metrics, detailed lead filtering,
                sorting, and full audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
