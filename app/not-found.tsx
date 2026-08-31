import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-black text-brand-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">The page you are looking for might have been moved or removed.</p>
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-700"
      >
        <Home className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
