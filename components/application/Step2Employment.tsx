"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Building2, IndianRupee, Clock, MapPin, User, ArrowLeft, ArrowRight } from "lucide-react";

interface Step2Props {
  data: any;
  onUpdate: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Employment = ({ data, onUpdate, onNext, onBack }: Step2Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ensure default selections are synced with parent state on mount
  useEffect(() => {
    const updates: Record<string, any> = {};
    if (!data.employment_type) updates.employment_type = "Salaried";
    if (!data.work_experience) updates.work_experience = "5 Years";
    if (!data.total_work_experience) updates.total_work_experience = "5 Years";
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const employmentType = data.employment_type || "Salaried";
    if (!employmentType) {
      newErrors.employment_type = "Employment type is required";
    }

    if (!data.company_name?.trim()) {
      newErrors.company_name = "Organization name is required";
    }

    if (!data.monthly_income || Number(data.monthly_income) <= 0) {
      newErrors.monthly_income = "Valid monthly net income is required";
    }

    const workExp = data.work_experience || "5 Years";
    if (!workExp.trim()) {
      newErrors.work_experience = "Work experience is required";
    }

    if (!data.designation?.trim()) {
      newErrors.designation = "Designation / job title is required";
    }

    const totalWorkExp = data.total_work_experience || "5 Years";
    if (!totalWorkExp.trim()) {
      newErrors.total_work_experience = "Total work experience is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Sync defaulted fields to ensure state integrity
      onUpdate({
        employment_type: data.employment_type || "Salaried",
        work_experience: data.work_experience || "5 Years",
        total_work_experience: data.total_work_experience || "5 Years",
      });
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Step 2: Employment & Income Details</h2>
          <p className="text-sm text-slate-500 mt-1">
            Provide your employment background and monthly net earnings.
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-5">
          {/* Employment Type Radio/Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Salaried", "Self Employed"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onUpdate({ employment_type: type });
                    if (errors.employment_type) {
                      setErrors((prev) => ({ ...prev, employment_type: "" }));
                    }
                  }}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    (data.employment_type || "Salaried") === type
                      ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>{type}</span>
                </button>
              ))}
            </div>
            {errors.employment_type && (
              <p className="mt-1 text-xs text-red-500">{errors.employment_type}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Organization Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Organization / Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your organization name"
                  value={data.company_name || ""}
                  onChange={(e) => {
                    onUpdate({ company_name: e.target.value });
                    if (errors.company_name) {
                      setErrors((prev) => ({ ...prev, company_name: "" }));
                    }
                  }}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.company_name
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.company_name && (
                <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>
              )}
            </div>

            {/* Monthly Net Income */}
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
                  placeholder="Enter your monthly income"
                  value={data.monthly_income || ""}
                  onChange={(e) => {
                    onUpdate({ monthly_income: e.target.value });
                    if (errors.monthly_income) {
                      setErrors((prev) => ({ ...prev, monthly_income: "" }));
                    }
                  }}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.monthly_income
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.monthly_income && (
                <p className="mt-1 text-xs text-red-500">{errors.monthly_income}</p>
              )}
            </div>

            {/* Work Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Experience in Current Org <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <select
                  value={data.work_experience || "5 Years"}
                  onChange={(e) => {
                    onUpdate({ work_experience: e.target.value });
                    if (errors.work_experience) {
                      setErrors((prev) => ({ ...prev, work_experience: "" }));
                    }
                  }}
                  className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                >
                  <option value="Less than 1 Year">Less than 1 Year</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>
              {errors.work_experience && (
                <p className="mt-1 text-xs text-red-500">{errors.work_experience}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Designation / Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your job title"
                  value={data.designation || ""}
                  onChange={(e) => {
                    onUpdate({ designation: e.target.value });
                    if (errors.designation) {
                      setErrors((prev) => ({ ...prev, designation: "" }));
                    }
                  }}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.designation
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.designation && (
                <p className="mt-1 text-xs text-red-500">{errors.designation}</p>
              )}
            </div>

            {/* Total Work Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Work Experience (in years) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="h-4 w-4" />
                </div>
                <select
                  value={data.total_work_experience || "5 Years"}
                  onChange={(e) => {
                    onUpdate({ total_work_experience: e.target.value });
                    if (errors.total_work_experience) {
                      setErrors((prev) => ({ ...prev, total_work_experience: "" }));
                    }
                  }}
                  className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
              {errors.total_work_experience && (
                <p className="mt-1 text-xs text-red-500">{errors.total_work_experience}</p>
              )}
            </div>

            {/* Office Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Office Address (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter office address"
                  value={data.office_address || ""}
                  onChange={(e) => onUpdate({ office_address: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 flex items-center justify-between">
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
    </div>
  );
};
