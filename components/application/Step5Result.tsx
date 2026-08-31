"use client";

import { useState } from "react";
import { Check, CheckCircle2, XCircle, Percent, Calendar, Zap, FileText, Shield, Users, Lock, ArrowLeft, Loader2, Download, X, AlertCircle } from "lucide-react";
import { LeadResponse } from "@/types/lead";

interface Step5Props {
  data: any;
  result: LeadResponse | null;
  onFinalSubmit: () => Promise<boolean> | void;
  onReset: () => void;
  onCloseSuccessModal: () => void;
  submitting: boolean;
  submissionError?: string | null;
}

export const Step5Result = ({
  data,
  result,
  onFinalSubmit,
  onReset,
  onCloseSuccessModal,
  submitting,
  submissionError,
}: Step5Props) => {
  const [partnerConsent, setPartnerConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const isEligible = result?.bre_status?.toLowerCase() === "eligible";

  const handleFinalSubmitClick = async () => {
    if (!partnerConsent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setLocalSubmitting(true);

    try {
      if (onFinalSubmit) {
        const res = await onFinalSubmit();
        if (res !== false) {
          setShowSuccessModal(true);
        }
      } else {
        setShowSuccessModal(true);
      }
    } catch {
      // Error handled by parent
    } finally {
      setLocalSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (onCloseSuccessModal) {
      onCloseSuccessModal();
    }
  };

  const handleDownloadReport = () => {
    const rejectionSection = isEligible
      ? "Rejection Reasons: None (All Business Rules Passed)"
      : (result?.reasons && result.reasons.length > 0)
        ? `Rejection Reasons:\n${result.reasons.map((r, i) => `  ${i + 1}. ${r}`).join("\n")}`
        : "Rejection Reasons: Eligibility criteria not met";

    const summaryText = `==================================================
MONEYBEING LOAN ELIGIBILITY REPORT
==================================================
Application ID: #${result?.lead_id || "N/A"}
Eligibility Status: ${result?.bre_status || (isEligible ? "Eligible" : "Not Eligible")}
Credit Score: ${result?.credit_score ?? "N/A"}
Date Processed: ${new Date().toLocaleString()}

APPLICANT DETAILS
--------------------------------------------------
Applicant Name: ${data.full_name || ""}
Mobile Number: +91 ${data.mobile || ""}
Email Address: ${data.email || "N/A"}
Date of Birth: ${data.date_of_birth || "N/A"}
City: ${data.city || "N/A"}
Pincode: ${data.pincode || "N/A"}

EMPLOYMENT & FINANCIAL DETAILS
--------------------------------------------------
Employment Type: ${data.employment_type || "Salaried"}
Organization: ${data.company_name || "N/A"}
Monthly Net Income: ₹${Number(data.monthly_income || 60000).toLocaleString("en-IN")}
Work Experience: ${data.work_experience || "N/A"}

LOAN DETAILS
--------------------------------------------------
Loan Type: ${data.loan_type || "Home Loan"}
Requested Amount: ₹${Number(data.loan_amount || 500000).toLocaleString("en-IN")}
Tenure: ${data.loan_tenure || "24 Months"}
Purpose: ${data.loan_purpose || "Home Renovation"}

ELIGIBILITY EVALUATION
--------------------------------------------------
Status: ${isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
${rejectionSection}

==================================================
Thank you for choosing MoneyBeing!
==================================================`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MoneyBeing_Loan_Report_${result?.lead_id || "Summary"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isSubmittingActive = submitting || localSubmitting;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner Result Card */}
      {isEligible ? (
        <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
              <Check className="h-7 w-7 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 leading-tight">
                Congratulations! You are eligible for a loan.
              </h2>
              <p className="text-sm sm:text-base font-semibold text-emerald-800 mt-1">
                You may be eligible for a loan up to{" "}
                <span className="font-extrabold text-emerald-950">
                  ₹{Number(data.loan_amount || 500000).toLocaleString("en-IN")}
                </span>
                {result?.lead_id && (
                  <span className="ml-3 text-xs bg-emerald-200/70 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                    App ID: #{result.lead_id}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 4 KPI Grid inside matching Image 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-200/60 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-800 font-medium">Interest Rate</p>
                <p className="font-bold text-emerald-950">Starting from 12.5% p.a.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-800 font-medium">Loan Tenure</p>
                <p className="font-bold text-emerald-950">Up to 60 Months</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-800 font-medium">Quick Disbursal</p>
                <p className="font-bold text-emerald-950">As fast as 24 Hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-800 font-medium">Minimal Documentation</p>
                <p className="font-bold text-emerald-950">Hassle-free experience</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
              <XCircle className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-rose-900 leading-tight">
                Application Not Eligible
              </h2>
              <p className="text-xs sm:text-sm text-rose-700 mt-1">
                Unfortunately, your application did not meet one or more automated eligibility criteria.
              </p>
            </div>
          </div>

          {result?.reasons && result.reasons.length > 0 && (
            <div className="mt-6 pt-5 border-t border-rose-200/80">
              <p className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">Rejection Reasons:</p>
              <ul className="space-y-1.5 text-xs text-rose-700">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Submission Error Banner if any */}
      {submissionError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs sm:text-sm text-red-700 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Bottom Section: Conditional based on eligibility */}
      {isEligible ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Take the final step</h3>
              <p className="text-xs text-slate-500">Please provide your consent to proceed.</p>
            </div>
          </div>

          {/* Inner Light Blue Privacy Box */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mt-0.5">
                <Users className="h-4 w-4" />
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900">We value your privacy and data security.</h4>
                <p>By providing consent, you authorize MoneyBeing and its lending partners to:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600">
                  <li>Collect, access, verify and share my personal, employment and financial information</li>
                  <li>Use this information to assess my loan application and determine eligibility</li>
                  <li>Share my information with our trusted lending partners for loan processing and disbursal</li>
                  <li>Contact me for updates regarding my loan application</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={partnerConsent}
                onChange={(e) => setPartnerConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I hereby consent and authorize MoneyBeing and its lending partners to collect, access, verify, store and share my information as described above for the purpose of loan processing, credit assessment and related services. <span className="text-red-500">*</span>
              </span>
            </label>
            {consentError && (
              <p className="mt-1 text-xs text-red-500">Consent is mandatory to finalize application.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>

            <button
              type="button"
              onClick={handleFinalSubmitClick}
              disabled={isSubmittingActive}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] disabled:opacity-60"
            >
              {isSubmittingActive ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Application Recorded</h3>
              <p className="text-xs text-slate-500">Your application data has been recorded in our system with Lead ID #{result?.lead_id || "N/A"}.</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">What should you do next?</p>
            <p>You can re-apply with updated financial criteria or address the specific rejection reasons identified above.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Security Tagline matching Image 5 */}
      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2 pt-2">
        <Lock className="h-3.5 w-3.5 text-slate-400" />
        <span>Your information is <strong className="text-emerald-600 font-semibold">100% secure</strong> and encrypted with bank-level security.</span>
      </div>

      {/* EXACT SPECIFICATION SUCCESS MODAL */}
      {showSuccessModal && isEligible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative animate-in zoom-in-95 duration-200">
            {/* Top Right Close X Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Green Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5 shadow-inner">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Application Submitted Successfully!
            </h3>

            {/* Message */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
              Your loan application has been submitted successfully.
            </p>

            {/* Application Information Box */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Application Reference ID:</span>
                <span className="font-bold text-slate-900">#{result?.lead_id || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Applicant Name:</span>
                <span className="font-semibold text-slate-900">{data.full_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Loan Type:</span>
                <span className="font-semibold text-slate-900">{data.loan_type || "Home Loan"}</span>
              </div>
            </div>

            {/* Modal Actions: Download Report & Close */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadReport}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="sm:w-32 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 text-xs sm:text-sm transition-all"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
