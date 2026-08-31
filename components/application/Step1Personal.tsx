"use client";

import { useState } from "react";
import { User, Phone, Mail, Calendar, Building2, MapPin, ArrowRight } from "lucide-react";

interface Step1Props {
  data: any;
  onUpdate: (fields: any) => void;
  onNext: () => void;
}

export const Step1Personal = ({ data, onUpdate, onNext }: Step1Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate maximum allowed date (must be at least 21 years ago)
  const maxAllowedDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 21);
    return d.toISOString().split("T")[0];
  })();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.full_name?.trim()) {
      newErrors.full_name = "Full legal name is required";
    }

    if (!data.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(data.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!data.email?.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const birthDate = new Date(data.date_of_birth);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        newErrors.date_of_birth = "Please enter a valid date of birth";
      } else if (birthDate > today) {
        newErrors.date_of_birth = "Date of birth cannot be in the future";
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 21) {
          newErrors.date_of_birth = "Applicant must be at least 21 years old to apply for a loan";
        } else if (age > 65) {
          newErrors.date_of_birth = "Applicant age cannot exceed 65 years";
        }
      }
    }

    if (!data.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!data.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(data.pincode.trim())) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Step 1: Personal Information</h2>
          <p className="text-sm text-slate-500 mt-1">
            Please provide your legal contact details to initiate eligibility evaluation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={data.full_name || ""}
                  onChange={(e) => onUpdate({ full_name: e.target.value })}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.full_name
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number (10 Digits) <span className="text-red-500">*</span>
              </label>
              <div className="relative flex rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 overflow-hidden">
                <div className="flex items-center gap-1.5 pl-3.5 pr-2 bg-slate-50 border-r border-slate-200 text-slate-600 text-xs font-bold select-none">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10 digit mobile number"
                  value={data.mobile || ""}
                  onChange={(e) => onUpdate({ mobile: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-3.5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={data.email || ""}
                  onChange={(e) => onUpdate({ email: e.target.value })}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date of Birth (Min. 21 Years) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="date"
                  max={maxAllowedDate}
                  value={data.date_of_birth || ""}
                  onChange={(e) => onUpdate({ date_of_birth: e.target.value })}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.date_of_birth
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.date_of_birth && <p className="mt-1 text-xs text-red-500 font-medium">{errors.date_of_birth}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={data.city || ""}
                  onChange={(e) => onUpdate({ city: e.target.value })}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.city
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pincode (6 Digits) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6 digit pincode"
                  value={data.pincode || ""}
                  onChange={(e) => onUpdate({ pincode: e.target.value.replace(/\D/g, "") })}
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.pincode
                      ? "border-red-400 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
            </div>
          </div>

          {/* Continue button right-aligned */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
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
