"use client";

import Link from "next/link";
import { LeadItem } from "@/types/lead";

interface RecentLeadsTableProps {
  leads: LeadItem[];
}

export const RecentLeadsTable = ({ leads }: RecentLeadsTableProps) => {
  const topLeads = leads.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Leads</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest customer applications processed</p>
        </div>
        <Link
          href="/leads"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All Leads
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 pr-4">ID</th>
              <th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Loan Type</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {topLeads.length > 0 ? (
              topLeads.map((lead) => {
                const isEligible = lead.bre_status?.toLowerCase() === "eligible";
                const dateStr = lead.created_at
                  ? new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Today";

                return (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-4 font-bold text-slate-900">#{lead.id}</td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">{lead.full_name}</td>
                    <td className="py-3 pr-4 text-slate-600">{lead.loan_type || "Home Loan"}</td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      ₹{Number(lead.loan_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isEligible
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {lead.bre_status || (isEligible ? "Eligible" : "Not Eligible")}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{dateStr}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No applications recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
