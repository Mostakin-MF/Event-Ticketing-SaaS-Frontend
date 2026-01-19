import Link from 'next/link';
import { Compass, Home, Ticket } from 'lucide-react';

export default function AttendeeNotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[12rem] font-black text-slate-900 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Compass className="w-16 h-16 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight">Lost in the Event Jungle?</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. Let's get you back to discovering amazing events.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/attendee/dashboard/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all"
          >
            <Compass className="w-5 h-5" />
            Discover Events
          </Link>
          
          <Link
            href="/attendee/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-100 font-bold rounded-xl border border-slate-700 hover:border-emerald-500 hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/attendee/dashboard/events" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">Discover</Link>
            <span className="text-slate-700">•</span>
            <Link href="/attendee/dashboard/tickets" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">My Tickets</Link>
            <span className="text-slate-700">•</span>
            <Link href="/attendee/dashboard/profile" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">Profile</Link>
            <span className="text-slate-700">•</span>
            <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
