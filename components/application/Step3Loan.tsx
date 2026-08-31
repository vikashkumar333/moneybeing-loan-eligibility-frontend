"use client";

import React, { useState, useEffect } from "react";
import { Landmark, IndianRupee, Calendar, Tag, Info, Zap, Clock, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

interface Step3Props {
  data: any;
  onUpdate: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Loan = ({ data, onUpdate, onNext, onBack }: Step3Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const updates: Record<string, any> = {};
    if (!data.loan_type) updates.loan_type = "Home Loan";
    if (!data.loan_tenure) updates.loan_tenure = "24 Months";
    if (!data.loan_purpose) updates.loan_purpose = "Home Renovation";
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const loanType = data.loan_type || "Home Loan";
    if (!loanType) {
      newErrors.loan_type = "Loan type is required";
    }

    if (!data.monthly_income || Number(data.monthly_income) <= 0) {
      newErrors.monthly_income = "Valid monthly net income is required";
    }

    if (!data.loan_amount || Number(data.loan_amount) <= 0) {
      newErrors.loan_amount = "Required loan amount is required";
    }

    const loanTenure = data.loan_tenure || "24 Months";
    if (!loanTenure) {
      newErrors.loan_tenure = "Loan tenure is required";
    }

    const loanPurpose = data.loan_purpose || "Home Renovation";
    if (!loanPurpose) {
      newErrors.loan_purpose = "Purpose of loan is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpdate({
        loan_type: data.loan_type || "Home Loan",
        loan_tenure: data.loan_tenure || "24 Months",
        loan_purpose: data.loan_purpose || "Home Renovation",
      });
      onNext();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: Loan Requirements</h2>
                <p className="text-xs text-slate-500">Configure your requested loan parameters.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleContinue} className="space-y-5">
            {/* Loan Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Loan Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Home Loan", "Loan Against Property"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onUpdate({ loan_type: type });
                      if (errors.loan_type) setErrors((prev) => ({ ...prev, loan_type: "" }));
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      (data.loan_type || "Home Loan") === type
                        ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50"
                    }`}
                  >
                    <Landmark className="h-4 w-4" />
                    <span>{type}</span>
                  </button>
                ))}
              </div>
              {errors.loan_type && <p className="mt-1 text-xs text-red-500">{errors.loan_type}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Monthly Income Confirmation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Net Income (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter monthly net income"
                    value={data.monthly_income || ""}
                    onChange={(e) => {
                      onUpdate({ monthly_income: e.target.value });
                      if (errors.monthly_income) setErrors((prev) => ({ ...prev, monthly_income: "" }));
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                {errors.monthly_income && <p className="mt-1 text-xs text-red-500">{errors.monthly_income}</p>}
              </div>

              {/* Required Loan Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Required Loan Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter loan amount you need"
                    value={data.loan_amount || ""}
                    onChange={(e) => {
                      onUpdate({ loan_amount: e.target.value });
                      if (errors.loan_amount) setErrors((prev) => ({ ...prev, loan_amount: "" }));
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                {errors.loan_amount && <p className="mt-1 text-xs text-red-500">{errors.loan_amount}</p>}
              </div>

              {/* Loan Tenure */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Loan Tenure (in months) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <select
                    value={data.loan_tenure || "24 Months"}
                    onChange={(e) => {
                      onUpdate({ loan_tenure: e.target.value });
                      if (errors.loan_tenure) setErrors((prev) => ({ ...prev, loan_tenure: "" }));
                    }}
                    className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  >
                    <option value="12 Months">12 Months</option>
                    <option value="24 Months">24 Months</option>
                    <option value="36 Months">36 Months</option>
                    <option value="48 Months">48 Months</option>
                    <option value="60 Months">60 Months</option>
                    <option value="120 Months">120 Months</option>
                  </select>
                </div>
                {errors.loan_tenure && <p className="mt-1 text-xs text-red-500">{errors.loan_tenure}</p>}
              </div>

              {/* Purpose of Loan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Purpose of Loan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Tag className="h-4 w-4" />
                  </div>
                  <select
                    value={data.loan_purpose || "Home Renovation"}
                    onChange={(e) => {
                      onUpdate({ loan_purpose: e.target.value });
                      if (errors.loan_purpose) setErrors((prev) => ({ ...prev, loan_purpose: "" }));
                    }}
                    className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  >
                    <option value="Home Renovation">Home Renovation</option>
                    <option value="Property Purchase">Property Purchase</option>
                    <option value="Debt Consolidation">Debt Consolidation</option>
                    <option value="Business Expansion">Business Expansion</option>
                    <option value="Personal / Medical">Personal / Medical</option>
                  </select>
                </div>
                {errors.loan_purpose && <p className="mt-1 text-xs text-red-500">{errors.loan_purpose}</p>}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-8 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Sidebar */}
        <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Info className="h-4 w-4 text-blue-600" />
              <span>Loan Info</span>
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Eligibility</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Get instant credit check and eligibility status.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Flexible Tenure</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Choose tenure that suits your repayment capacity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Quick Process</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Simple process with minimal documentation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-blue-100/80 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>100% Confidential & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
