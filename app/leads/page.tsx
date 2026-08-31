"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { leadService } from "@/services/lead.service";
import { LeadListItem, PaginationMeta } from "@/types/lead";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { DashboardFilterToolbar, DashboardFilters } from "@/components/dashboard/DashboardFilterToolbar";
import { generateLeadsExcel, buildExportFileName } from "@/lib/excelExport";

const initialFilters: DashboardFilters = {
  search: "",
  bre_status: "",
  loan_type: "",
  employment_type: "",
  date_from: "",
  date_to: "",
};

interface ToastState {
  type: "success" | "error" | "info";
  message: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchLeads = async (currentFilters: DashboardFilters = filters, currentPage: number = page) => {
    setLoading(true);
    try {
      const resp = await leadService.listLeads({
        page: currentPage,
        page_size: 10,
        search: currentFilters.search.trim() || undefined,
        loan_type: currentFilters.loan_type || undefined,
        employment_type: currentFilters.employment_type || undefined,
        bre_status: currentFilters.bre_status || undefined,
        date_from: currentFilters.date_from || undefined,
        date_to: currentFilters.date_to || undefined,
      });
      setLeads(resp.data);
      setPagination(resp.pagination);
    } catch {
      // Error handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(filters, page);
  }, [page]);

  const handleApplyFilters = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchLeads(newFilters, 1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
    fetchLeads(initialFilters, 1);
  };

  // Enterprise Filter-Aware Excel Export (Fetches ALL pages using backend-compliant page_size=100)
  const handleExportExcel = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // 1. Fetch first page with max backend allowed page_size (100)
      const firstPageResp = await leadService.listLeads({
        page: 1,
        page_size: 100,
        search: filters.search.trim() || undefined,
        loan_type: filters.loan_type || undefined,
        employment_type: filters.employment_type || undefined,
        bre_status: filters.bre_status || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
      });

      let allMatchingLeads: LeadListItem[] = [...(firstPageResp?.data || [])];
      const totalPages = firstPageResp?.pagination?.total_pages || 1;

      // 2. Fetch remaining pages if dataset exceeds 100 records
      if (totalPages > 1) {
        const remainingPagePromises = [];
        for (let p = 2; p <= totalPages; p++) {
          remainingPagePromises.push(
            leadService.listLeads({
              page: p,
              page_size: 100,
              search: filters.search.trim() || undefined,
              loan_type: filters.loan_type || undefined,
              employment_type: filters.employment_type || undefined,
              bre_status: filters.bre_status || undefined,
              date_from: filters.date_from || undefined,
              date_to: filters.date_to || undefined,
            })
          );
        }

        const remainingResponses = await Promise.all(remainingPagePromises);
        remainingResponses.forEach((r) => {
          if (r?.data) {
            allMatchingLeads.push(...r.data);
          }
        });
      }

      // 3. Handle zero records case
      if (allMatchingLeads.length === 0) {
        showToast("info", "No leads found for the selected filters.");
        return;
      }

      // 4. Generate multi-sheet workbook with styling & formulas
      const excelBlob = await generateLeadsExcel(allMatchingLeads, filters);
      const filename = buildExportFileName(filters);

      // 5. Trigger browser download
      const downloadUrl = window.URL.createObjectURL(excelBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      showToast("success", `Leads exported successfully (${allMatchingLeads.length} records)`);
    } catch {
      showToast("error", "Unable to export leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10"
                  : toast.type === "error"
                  ? "bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10"
                  : "bg-slate-900/90 border-slate-700 text-white shadow-slate-900/20"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : toast.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-blue-400 shrink-0" />
              )}
              <span>{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="hover:opacity-75 p-0.5 rounded ml-2"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Header with Export Leads & Refresh Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leads Management</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Filter, search, and inspect submitted loan applications.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Export Leads Button */}
            <button
              onClick={handleExportExcel}
              disabled={isExporting || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 shadow-sm transition-all hover:scale-[1.01] disabled:opacity-60 disabled:pointer-events-none"
              title="Export all matching leads to Excel (.xlsx)"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span>Preparing Excel...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span>Export Leads</span>
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchLeads(filters, page)}
              disabled={loading || isExporting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar matching Dashboard exactly */}
        <DashboardFilterToolbar
          filters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          totalResults={pagination.total}
          loading={loading}
        />

        {/* Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Loan / Type</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Credit Score</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">BRE Decision</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                      <span className="mt-2 block text-xs font-semibold">Loading leads...</span>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No matching leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isEligible = lead.bre_status.toLowerCase() === "eligible";
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900">#{lead.id}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-900">{lead.full_name}</td>
                        <td className="px-4 py-3.5 text-slate-600">{lead.mobile}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-900">₹{Number(lead.loan_amount).toLocaleString("en-IN")}</span>
                          <span className="block text-xs text-slate-500">{lead.loan_type}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-800">{lead.credit_score ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isEligible
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {lead.bre_status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold">{leads.length > 0 ? (pagination.page - 1) * pagination.page_size + 1 : 0}</span> to{" "}
              <span className="font-semibold">{Math.min(pagination.page * pagination.page_size, pagination.total)}</span> of{" "}
              <span className="font-semibold">{pagination.total}</span> leads
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={!pagination.has_previous || loading}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <span className="text-xs font-bold text-slate-700 px-2">
                Page {pagination.page} of {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pagination.total_pages))}
                disabled={!pagination.has_next || loading}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
