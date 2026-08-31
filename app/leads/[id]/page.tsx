"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { leadService } from "@/services/lead.service";
import { LeadDetail } from "@/types/lead";
import { ArrowLeft, User, Briefcase, ShieldCheck, CheckCircle2, XCircle, Loader2, Calendar, MapPin, Phone, Mail } from "lucide-react";

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = Number(params?.id);

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await leadService.getLeadDetail(leadId);
        setLead(data);
      } catch (err: any) {
        setError(err?.message || "Lead not found");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [leadId]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center gap-4">
          <Link
            href="/leads"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead #{leadId}</h1>
            <p className="text-xs text-slate-500">Submitted on {lead?.created_at ? new Date(lead.created_at).toLocaleString() : "—"}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : error || !lead ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error || "Lead not found."}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 ${
              lead.bre_status.toLowerCase() === "eligible"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                : "bg-gradient-to-r from-rose-600 to-red-600"
            }`}>
              <div className="flex items-center gap-3">
                {lead.bre_status.toLowerCase() === "eligible" ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <XCircle className="h-8 w-8" />
                )}
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider">Status: {lead.bre_status}</h2>
                  <p className="text-xs text-white/90">Credit Score: {lead.credit_score ?? "N/A"}</p>
                </div>
              </div>

              {lead.rejection_reasons && lead.rejection_reasons.length > 0 && (
                <div className="bg-white/20 px-4 py-2 rounded-xl text-xs backdrop-blur-sm max-w-md">
                  <span className="font-bold">Reasons: </span>
                  {lead.rejection_reasons.join(", ")}
                </div>
              )}
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applicant Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <User className="h-4 w-4 text-brand-600" />
                  <span>Applicant Information</span>
                </h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Full Name</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{lead.full_name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Mobile Number</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{lead.mobile}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Email</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{lead.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Date of Birth</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{lead.date_of_birth}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">City</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{lead.city}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Pincode</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{lead.pincode}</dd>
                  </div>
                </dl>
              </div>

              {/* Financial & Loan Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase className="h-4 w-4 text-brand-600" />
                  <span>Financial & Loan Requirements</span>
                </h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Loan Type</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{lead.loan_type}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Employment Type</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{lead.employment_type}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Monthly Income</dt>
                    <dd className="font-bold text-brand-600 mt-0.5">₹{Number(lead.monthly_income).toLocaleString("en-IN")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Loan Requested</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">₹{Number(lead.loan_amount).toLocaleString("en-IN")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Property Valuation</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">₹{Number(lead.property_value).toLocaleString("en-IN")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold uppercase">Loan-to-Value (LTV)</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">
                      {((Number(lead.loan_amount) / Number(lead.property_value)) * 100).toFixed(1)}%
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Individual BRE Rule Evaluation History */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <span>BRE Rule Evaluation Audit Records ({lead.bre_results?.length || 0})</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Rule ID</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Result</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Failure Message</th>
                      <th className="px-4 py-2.5 text-right text-xs font-bold text-slate-600 uppercase">Evaluated At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lead.bre_results?.map((res, i) => (
                      <tr key={res.id || i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">Rule #{res.rule_id ?? "—"}</td>
                        <td className="px-4 py-3">
                          {res.is_passed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                              <XCircle className="h-3.5 w-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">{res.failure_message || "—"}</td>
                        <td className="px-4 py-3 text-right text-xs text-slate-500">
                          {new Date(res.evaluated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
