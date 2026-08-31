"use client";

import { useState } from "react";
import { LoanHeader } from "@/components/application/LoanHeader";
import { LoanStepper } from "@/components/application/LoanStepper";
import { LoanFooter } from "@/components/application/LoanFooter";
import { Step1Personal } from "@/components/application/Step1Personal";
import { Step2Employment } from "@/components/application/Step2Employment";
import { Step3Loan } from "@/components/application/Step3Loan";
import { Step4Review } from "@/components/application/Step4Review";
import { Step5Result } from "@/components/application/Step5Result";
import { leadService } from "@/services/lead.service";
import { LeadResponse } from "@/types/lead";

const initialFormData = {
  // Step 1
  full_name: "",
  mobile: "",
  email: "",
  date_of_birth: "",
  city: "",
  pincode: "",
  // Step 2
  employment_type: "Salaried",
  company_name: "",
  monthly_income: "",
  work_experience: "5 Years",
  designation: "",
  total_work_experience: "5 Years",
  office_address: "",
  // Step 3
  loan_type: "Home Loan",
  loan_amount: "",
  loan_tenure: "24 Months",
  loan_purpose: "Home Renovation",
  property_value: "",
  consent: false,
};

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadResponse | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const resetApplication = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setResult(null);
    setApiError(null);
    setSubmitting(false);
    sessionStorage.removeItem("last_lead_result");
    sessionStorage.removeItem("last_lead_applicant");
  };

  const handleStep4Submit = async () => {
    setSubmitting(true);
    setApiError(null);

    try {
      const resp = await leadService.createLead({
        full_name: formData.full_name,
        mobile: formData.mobile,
        email: formData.email || undefined,
        date_of_birth: formData.date_of_birth,
        city: formData.city,
        pincode: formData.pincode,
        loan_type: formData.loan_type === "Personal Loan" ? "Home Loan" : formData.loan_type,
        employment_type: formData.employment_type,
        monthly_income: Number(formData.monthly_income),
        loan_amount: Number(formData.loan_amount),
        property_value: Number(formData.property_value || Number(formData.loan_amount) * 1.5),
        consent: true,
      });

      setResult(resp);
      sessionStorage.setItem("last_lead_result", JSON.stringify(resp));
      sessionStorage.setItem("last_lead_applicant", JSON.stringify(formData));
      setCurrentStep(5);
    } catch (err: any) {
      const errorMsg = err?.message || (typeof err === "string" ? err : "Failed to submit loan application.");
      if (err?.statusCode === 409 || errorMsg.toLowerCase().includes("already exists") || errorMsg.toLowerCase().includes("mobile")) {
        setApiError("A loan application already exists with this mobile number.");
      } else if (err?.statusCode === 422) {
        setApiError(errorMsg);
      } else if (err?.statusCode === 502 || err?.statusCode === 503) {
        setApiError("Credit bureau service is temporarily unavailable. Please try again.");
      } else {
        setApiError(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Header */}
      <LoanHeader />

      {/* Main Form Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-2">
        {/* Title & Subtitle */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Loan Eligibility Application
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete your application in a few simple steps
          </p>
        </div>

        {/* 5-Step Progress Indicator */}
        <LoanStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }}
        />

        {/* Dynamic Step View */}
        <div className="mt-6 sm:mt-8">
          {currentStep === 1 && (
            <Step1Personal
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Employment
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Loan
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Review
              data={formData}
              onEditStep={(step) => setCurrentStep(step)}
              onSubmit={handleStep4Submit}
              onBack={() => setCurrentStep(3)}
              submitting={submitting}
              error={apiError}
            />
          )}

          {currentStep === 5 && (
            <Step5Result
              data={formData}
              result={result}
              onFinalSubmit={handleFinalSubmit}
              onReset={() => setCurrentStep(4)}
              onCloseSuccessModal={resetApplication}
              submitting={submitting}
              submissionError={apiError}
            />
          )}
        </div>
      </main>

      {/* Trust & Policy Footer */}
      <LoanFooter />
    </div>
  );
}
