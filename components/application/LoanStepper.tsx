"use client";

import { Check } from "lucide-react";

interface LoanStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { step: 1, line1: "Personal", line2: "Information" },
  { step: 2, line1: "Employment", line2: "Details" },
  { step: 3, line1: "Loan", line2: "Details" },
  { step: 4, line1: "Review &", line2: "Submit" },
  { step: 5, line1: "Eligibility", line2: "Result" },
];

export const LoanStepper = ({ currentStep, onStepClick }: LoanStepperProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-6 sm:my-8 px-4">
      <div className="flex items-center justify-between relative">
        {steps.map((item, index) => {
          const isCompleted = currentStep > item.step;
          const isActive = currentStep === item.step;
          const isClickable = onStepClick && isCompleted;

          return (
            <div key={item.step} className="flex-1 flex flex-col items-center relative">
              {/* Connector line behind */}
              {index > 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 transition-all duration-300 ${
                    currentStep >= item.step ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}

              {/* Circle */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(item.step)}
                className={`relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-blue-600 text-white shadow-sm cursor-pointer hover:bg-blue-700"
                    : isActive
                    ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100"
                    : "bg-white text-slate-400 border border-slate-300"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : item.step}
              </button>

              {/* Step Labels */}
              <div className="mt-2 text-center select-none">
                <span
                  className={`block text-[11px] sm:text-xs leading-tight ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : isCompleted
                      ? "text-slate-700 font-medium"
                      : "text-slate-400 font-medium"
                  }`}
                >
                  {item.line1}
                </span>
                <span
                  className={`block text-[11px] sm:text-xs leading-tight ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : isCompleted
                      ? "text-slate-700 font-medium"
                      : "text-slate-400 font-medium"
                  }`}
                >
                  {item.line2}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
