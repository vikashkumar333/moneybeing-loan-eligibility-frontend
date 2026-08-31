"use client";

import { useState } from "react";
import { PieChart, Info } from "lucide-react";

interface EligibilityDonutChartProps {
  eligibleCount: number;
  rejectedCount: number;
  totalLeads: number;
}

export const EligibilityDonutChart = ({
  eligibleCount,
  rejectedCount,
  totalLeads,
}: EligibilityDonutChartProps) => {
  const [hoveredSegment, setHoveredSegment] = useState<"eligible" | "rejected" | null>(null);

  const total = totalLeads || (eligibleCount + rejectedCount) || 1;
  const eligiblePct = Math.round((eligibleCount / total) * 100);
  const rejectedPct = 100 - eligiblePct;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const eligibleStrokeDash = (eligiblePct / 100) * circumference;

  return (
    <div className="relative flex flex-col justify-between h-[290px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <PieChart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">2. Eligibility Breakdown</h3>
            <p className="text-[11px] text-slate-400 leading-tight">BRE Evaluation Status</p>
          </div>
        </div>
        <button title="Ratio of passed vs rejected applications" className="text-slate-400 hover:text-slate-600 p-1">
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Pure Donut Chart Area */}
      <div className="relative w-full flex-1 flex items-center justify-center pt-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-90 select-none" viewBox="0 0 130 130">
            {/* Background Track */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="16"
            />
            {/* Not Eligible Segment (Rose) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth={hoveredSegment === "rejected" ? 20 : 16}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset="0"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredSegment("rejected")}
              onMouseLeave={() => setHoveredSegment(null)}
            />
            {/* Eligible Segment (Emerald) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={hoveredSegment === "eligible" ? 20 : 16}
              strokeDasharray={`${eligibleStrokeDash} ${circumference}`}
              strokeDashoffset="0"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredSegment("eligible")}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          </svg>

          {/* Center Dynamic Label */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
            <span
              className={`text-2xl font-black leading-none transition-colors ${
                hoveredSegment === "rejected" ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {hoveredSegment === "rejected" ? `${rejectedPct}%` : `${eligiblePct}%`}
            </span>
            <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">
              {hoveredSegment === "rejected" ? "REJECTED" : "ELIGIBLE"}
            </span>
          </div>

          {/* Hover Floating Tooltip */}
          {hoveredSegment && (
            <div
              className="absolute z-20 pointer-events-none bg-slate-900/90 text-white backdrop-blur-sm rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700/60 transition-all -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span
                  className={`h-2 w-2 rounded-full ${
                    hoveredSegment === "eligible" ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                <span>{hoveredSegment === "eligible" ? "Eligible" : "Not Eligible"}</span>
              </div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-300">
                <div className="flex justify-between gap-3">
                  <span>Count:</span>
                  <span className="font-bold text-white">
                    {hoveredSegment === "eligible" ? eligibleCount : rejectedCount}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Percentage:</span>
                  <span className="font-bold text-white">
                    {hoveredSegment === "eligible" ? `${eligiblePct}%` : `${rejectedPct}%`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
