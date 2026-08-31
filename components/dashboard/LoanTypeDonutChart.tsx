"use client";

import { useState, useMemo } from "react";
import { Layers, Info } from "lucide-react";

interface LoanTypeDonutChartProps {
  byLoanType: Record<string, number>;
  totalLeads: number;
}

const COLORS = ["#2563eb", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899"];

export const LoanTypeDonutChart = ({
  byLoanType,
  totalLeads,
}: LoanTypeDonutChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    const entries = Object.entries(byLoanType || {});
    if (entries.length === 0) {
      return [{ type: "Home Loan", count: totalLeads || 1, color: COLORS[0], pct: 100 }];
    }
    const total = totalLeads || entries.reduce((s, [, c]) => s + c, 0) || 1;
    return entries.map(([type, count], index) => ({
      type,
      count,
      color: COLORS[index % COLORS.length],
      pct: Math.round((count / total) * 100),
    }));
  }, [byLoanType, totalLeads]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const slices = items.map((item) => {
    const strokeDash = (item.pct / 100) * circumference;
    const offset = -accumulated;
    accumulated += strokeDash;
    return { ...item, strokeDash, offset };
  });

  const activeItem = hoveredIndex !== null ? items[hoveredIndex] : null;

  return (
    <div className="relative flex flex-col justify-between h-[290px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">3. Leads by Loan Type</h3>
            <p className="text-[11px] text-slate-400 leading-tight">Product Mix Share</p>
          </div>
        </div>
        <button title="Breakdown of leads by loan category" className="text-slate-400 hover:text-slate-600 p-1">
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Pure Donut Chart Area */}
      <div className="relative w-full flex-1 flex items-center justify-center pt-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-90 select-none" viewBox="0 0 130 130">
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="16"
            />
            {slices.map((s, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <circle
                  key={i}
                  cx="65"
                  cy="65"
                  r={radius}
                  fill="transparent"
                  stroke={s.color}
                  strokeWidth={isHovered ? 20 : 16}
                  strokeDasharray={`${s.strokeDash} ${circumference}`}
                  strokeDashoffset={s.offset}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Dynamic Label */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span
              className="text-2xl font-black leading-none transition-colors"
              style={{ color: activeItem ? activeItem.color : "#2563eb" }}
            >
              {activeItem ? `${activeItem.pct}%` : totalLeads}
            </span>
            <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider truncate max-w-[80px]">
              {activeItem ? activeItem.type : "TOTAL LEADS"}
            </span>
          </div>

          {/* Floating Tooltip on Hover */}
          {activeItem && (
            <div
              className="absolute z-20 pointer-events-none bg-slate-900/90 text-white backdrop-blur-sm rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700/60 transition-all -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeItem.color }}
                />
                <span>{activeItem.type}</span>
              </div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-300">
                <div className="flex justify-between gap-3">
                  <span>Leads:</span>
                  <span className="font-bold text-white">{activeItem.count}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Percentage:</span>
                  <span className="font-bold text-white">{activeItem.pct}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
