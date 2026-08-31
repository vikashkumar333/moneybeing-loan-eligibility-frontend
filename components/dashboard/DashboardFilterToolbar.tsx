"use client";

import { Search, RotateCcw, X, ChevronDown, Calendar } from "lucide-react";

export interface DashboardFilters {
  search: string;
  bre_status: string;
  loan_type: string;
  employment_type: string;
  date_from: string;
  date_to: string;
}

interface DashboardFilterToolbarProps {
  filters: DashboardFilters;
  onApply: (filters: DashboardFilters) => void;
  onReset: () => void;
  totalResults: number;
  loading: boolean;
}

export const DashboardFilterToolbar = ({
  filters,
  onApply,
  onReset,
  totalResults,
  loading,
}: DashboardFilterToolbarProps) => {
  const handleInputChange = (field: keyof DashboardFilters, value: string) => {
    const updated = { ...filters, [field]: value };
    onApply(updated);
  };

  const handleResetClick = () => {
    onReset();
  };

  const removeFilter = (field: keyof DashboardFilters) => {
    const updated = { ...filters, [field]: "" };
    onApply(updated);
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.bre_status ||
    filters.loan_type ||
    filters.employment_type ||
    filters.date_from ||
    filters.date_to
  );

  return (
    <div className="space-y-3">
      {/* Unified Horizontal Toolbar Card with Start & End Date Filters */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-3.5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* 1. Search Bar (Flex-1) */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
              placeholder="Search customer, mobile or ID..."
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => handleInputChange("search", "")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Controls Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-2">
            {/* 2. Status Dropdown */}
            <div className="relative min-w-[120px]">
              <select
                value={filters.bre_status}
                onChange={(e) => handleInputChange("bre_status", e.target.value)}
                className="w-full h-10 appearance-none pl-3 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 hover:bg-white focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* 3. Loan Type Dropdown */}
            <div className="relative min-w-[135px]">
              <select
                value={filters.loan_type}
                onChange={(e) => handleInputChange("loan_type", e.target.value)}
                className="w-full h-10 appearance-none pl-3 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 hover:bg-white focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all cursor-pointer"
              >
                <option value="">All Loan Types</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Loan Against Property">Loan Against Property</option>
                <option value="Personal Loan">Personal Loan</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* 4. Employment Type Dropdown */}
            <div className="relative min-w-[130px]">
              <select
                value={filters.employment_type}
                onChange={(e) => handleInputChange("employment_type", e.target.value)}
                className="w-full h-10 appearance-none pl-3 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 hover:bg-white focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all cursor-pointer"
              >
                <option value="">All Employment</option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self Employed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* 5. Start Date Filter */}
            <div className="relative flex items-center min-w-[130px] rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 px-2.5 h-10 transition-all">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-1.5 pointer-events-none" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Start</span>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleInputChange("date_from", e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer w-full leading-none p-0"
                  title="Start Date (From)"
                />
              </div>
              {filters.date_from && (
                <button
                  type="button"
                  onClick={() => handleInputChange("date_from", "")}
                  className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* 6. End Date Filter */}
            <div className="relative flex items-center min-w-[130px] rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 px-2.5 h-10 transition-all">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-1.5 pointer-events-none" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">End</span>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleInputChange("date_to", e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer w-full leading-none p-0"
                  title="End Date (To)"
                />
              </div>
              {filters.date_to && (
                <button
                  type="button"
                  onClick={() => handleInputChange("date_to", "")}
                  className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Reset Action */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleResetClick}
              disabled={loading}
              className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all whitespace-nowrap"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Result Counter */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-3 flex-wrap px-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-100">
                <span>Keyword: "{filters.search}"</span>
                <button
                  onClick={() => removeFilter("search")}
                  className="hover:bg-blue-200/60 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.bre_status && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-100">
                <span>Status: {filters.bre_status}</span>
                <button
                  onClick={() => removeFilter("bre_status")}
                  className="hover:bg-emerald-200/60 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.loan_type && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-100">
                <span>Loan: {filters.loan_type}</span>
                <button
                  onClick={() => removeFilter("loan_type")}
                  className="hover:bg-indigo-200/60 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.employment_type && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                <span>Emp: {filters.employment_type}</span>
                <button
                  onClick={() => removeFilter("employment_type")}
                  className="hover:bg-slate-200 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.date_from && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
                <span>From: {filters.date_from}</span>
                <button
                  onClick={() => removeFilter("date_from")}
                  className="hover:bg-amber-200/60 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.date_to && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
                <span>To: {filters.date_to}</span>
                <button
                  onClick={() => removeFilter("date_to")}
                  className="hover:bg-amber-200/60 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetClick}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline ml-1"
            >
              Clear All
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{totalResults} {totalResults === 1 ? "result" : "results"} found</span>
          </div>
        </div>
      )}
    </div>
  );
};
