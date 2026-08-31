"use client";

import { useState } from "react";
import { ClipboardList, User, Briefcase, IndianRupee, Edit3, CheckCircle2, Lock, Loader2 } from "lucide-react";

interface Step4Props {
  data: any;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error?: string | null;
}

export const Step4Review = ({ data, onEditStep, onSubmit, onBack, submitting, error }: Step4Props) => {
  const [declaration, setDeclaration] = useState(false);
  const [declarationError, setDeclarationError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) {
      setDeclarationError(true);
      return;
    }
    setDeclarationError(false);
    onSubmit();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Review Cards (~68%) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">4. Review & Submit</h2>
                  <p className="text-xs text-slate-500">Please review your details carefully before submitting your application.</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                * All fields are mandatory
              </span>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Section 1: Personal Information */}
            <div className="rounded-xl border border-slate-200/80 p-4 sm:p-5 mb-4 bg-slate-50/40">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Personal Information</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditStep(1)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Legal Name</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.full_name || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">+91 {data.mobile || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">{data.email || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.date_of_birth || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">City</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.city || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pincode</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.pincode || "—"}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Employment Details */}
            <div className="rounded-xl border border-slate-200/80 p-4 sm:p-5 mb-4 bg-slate-50/40">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Employment Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditStep(2)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Employment Type</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.employment_type || "Salaried"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Organization</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">{data.company_name || "ABC Technologies Pvt. Ltd."}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Monthly Net Income</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">₹ {Number(data.monthly_income || 60000).toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Work Experience</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.work_experience || "5 Years"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Designation</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.designation || "Software Engineer"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Work Experience</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.total_work_experience || "5 Years"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Office Address</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">{data.office_address || "Andheri East, Mumbai, Maharashtra"}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Loan Details */}
            <div className="rounded-xl border border-slate-200/80 p-4 sm:p-5 mb-6 bg-slate-50/40">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Loan Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditStep(3)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Loan Type</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.loan_type || "Personal Loan"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Required Loan Amount</span>
                  <span className="font-bold text-blue-600 mt-0.5 block">₹ {Number(data.loan_amount || 200000).toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Loan Tenure</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.loan_tenure || "24 Months"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Purpose of Loan</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.loan_purpose || "Home Renovation"}</span>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I hereby declare that all the information provided above is true, correct and complete to the best of my knowledge.
                </span>
              </label>
              {declarationError && (
                <p className="mt-1 text-xs text-red-500">Please accept the declaration to proceed.</p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={onBack}
                disabled={submitting}
                className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-8 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Evaluating Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Checklist (~32%) matching Image 4 */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>Review Checklist</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Please ensure the following before submitting:</p>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>All personal information is correct</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Employment details are accurate</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Loan details match your requirements</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>You meet the eligibility criteria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>All documents (if any) are ready</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Secure & Safe</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Your data is secured with 256-bit encryption and is never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
