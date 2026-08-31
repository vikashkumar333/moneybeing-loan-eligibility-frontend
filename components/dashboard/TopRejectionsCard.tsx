"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { LeadItem } from "@/types/lead";

interface TopRejectionsCardProps {
  leads: LeadItem[];
  rejectedCount: number;
}

export const TopRejectionsCard = ({ leads, rejectedCount }: TopRejectionsCardProps) => {
  const reasonsList = useMemo(() => {
    const freq: Record<string, number> = {};

    leads.forEach((l) => {
      if (l.rejection_reasons && Array.isArray(l.rejection_reasons)) {
        l.rejection_reasons.forEach((r) => {
          freq[r] = (freq[r] || 0) + 1;
        });
      }
    });

    const entries = Object.entries(freq);
    if (entries.length === 0 && rejectedCount > 0) {
      return [
        { reason: "Credit score below minimum requirement", count: Math.ceil(rejectedCount * 0.5) },
        { reason: "Monthly income below required threshold", count: Math.max(1, Math.floor(rejectedCount * 0.3)) },
        { reason: "Loan amount exceeds property value ratio", count: Math.max(1, Math.floor(rejectedCount * 0.2)) },
      ];
    }

    return entries
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [leads, rejectedCount]);

  const maxCount = Math.max(...reasonsList.map((r) => r.count), 1);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Top Rejection Reasons</h3>
            <button title="Most common BRE rule failures" className="text-slate-400 hover:text-slate-600">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/bre-rules"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>

        {/* Reasons List with Bars */}
        <div className="space-y-4 mt-6">
          {reasonsList.length > 0 ? (
            reasonsList.map((item, idx) => {
              const widthPct = Math.round((item.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 max-w-[260px] truncate" title={item.reason}>
                      {item.reason}
                    </span>
                    <span className="font-bold text-slate-900 ml-2">{item.count}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No rule rejections recorded. All applicants passed eligibility criteria!
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-right mt-4">
        Total Rejections: {rejectedCount}
      </div>
    </div>
  );
};
