"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">An unexpected client-side exception occurred while rendering this view.</p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-700"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try again</span>
      </button>
    </div>
  );
}
