import Link from 'next/link';
import { Calendar, Home, Search } from 'lucide-react';

export default function StaffNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[12rem] font-black text-emerald-100 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-slate-600 max-w-md mx-auto">
            The staff page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/staff/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all"
          >
            <Calendar className="w-5 h-5" />
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/staff/scanner" className="text-emerald-600 hover:text-emerald-500 font-medium">Scanner</Link>
            <span className="text-slate-300">•</span>
            <Link href="/staff/lookup" className="text-emerald-600 hover:text-emerald-500 font-medium">Lookup</Link>
            <span className="text-slate-300">•</span>
            <Link href="/staff/history" className="text-emerald-600 hover:text-emerald-500 font-medium">History</Link>
            <span className="text-slate-300">•</span>
            <Link href="/staff/profile" className="text-emerald-600 hover:text-emerald-500 font-medium">Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
