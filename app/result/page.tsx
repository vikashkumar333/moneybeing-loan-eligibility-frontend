"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LeadResponse } from "@/types/lead";
import { CheckCircle2, XCircle, FileText, Home, Loader2 } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  const leadIdQuery = searchParams.get("lead_id");

  const [result, setResult] = useState<LeadResponse | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_lead_result");
    if (raw) {
      setResult(JSON.parse(raw));
    }
  }, []);

  const isEligible = result?.bre_status?.toLowerCase() === "eligible";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* Header Badge Banner */}
        <div className={`p-8 text-center text-white ${isEligible ? "bg-gradient-to-br from-emerald-600 to-teal-700" : "bg-gradient-to-br from-rose-600 to-red-700"}`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md mb-4">
            {isEligible ? (
              <CheckCircle2 className="h-10 w-10 text-white" />
            ) : (
              <XCircle className="h-10 w-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isEligible ? "Congratulations! You are Eligible" : "Application Not Eligible"}
          </h1>
          <p className="mt-2 text-white/90 text-sm">
            {isEligible
              ? "Your application successfully met all automated credit and Business Rule criteria."
              : "Unfortunately, your application did not meet one or more eligibility criteria."}
          </p>
        </div>

        {/* Details Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Lead Application ID</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">#{result?.lead_id || leadIdQuery || "—"}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Credit Bureau Score</span>
              <span className="text-2xl font-black text-brand-600 mt-1 block">{result?.credit_score || "—"}</span>
            </div>
          </div>

          {/* Rejection Reasons if not eligible */}
          {!isEligible && result?.reasons && result.reasons.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
              <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-3">Rejection Reasons Identified:</h3>
              <ul className="space-y-2">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                    <XCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 text-sm text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">What happens next?</p>
            {isEligible ? (
              <p>Our lending representative will contact you within 24 business hours to finalize documentation and loan sanctioning.</p>
            ) : (
              <p>You may re-apply after 90 days once the criteria or credit score thresholds are addressed.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/apply"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Submit Another Application</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
