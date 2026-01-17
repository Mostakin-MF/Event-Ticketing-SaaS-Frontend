'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { QrCode, Search, History, Calendar, User } from 'lucide-react';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userData = await authService.checkAuth();
        // Simple role check - in production might be more robust
        // Backend guards will fail anyway, but this improves UX
        setUser(userData);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [router]);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
           <span className="loading loading-dots loading-lg text-emerald-500"></span>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Staff Navbar - Nishorgo Theme: emerald-950 for deep context */}
      <nav className="bg-emerald-950 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/staff/dashboard" className="flex-shrink-0 font-bold text-xl tracking-wide flex items-center gap-2 group">
                 <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-emerald-950 shadow-emerald-500/20 shadow-lg group-hover:scale-105 transition-transform">S</div>
                 <span className="font-display tracking-tight">TICKET<span className="text-emerald-400">BD</span> <span className="text-emerald-500/50 font-normal ml-1 text-sm">STAFF</span></span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-2">
                  <Link
                    href="/staff/dashboard"
                    className="px-4 py-2 rounded-full text-sm font-medium text-emerald-100 hover:bg-emerald-900 hover:text-white transition-all transform hover:scale-[1.02]"
                  >
                    My Events
                  </Link>
                  <Link
                    href="/staff/scanner"
                    className="px-4 py-2 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 transition-all transform hover:scale-105"
                  >
                    Scanner
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-4">
                 <Link href="/staff/profile" className="flex items-center gap-3 hover:bg-emerald-900/50 pl-2 pr-1 py-1 rounded-full transition-colors border border-transparent hover:border-emerald-800/50">
                     <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider leading-none mb-0.5">Logged In</p>
                        <p className="text-sm font-medium text-white leading-none">{user?.name || 'Staff User'}</p>
                     </div>
                     <div className="h-9 w-9 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-bold ring-2 ring-emerald-600 text-emerald-200">
                        {user?.name?.charAt(0) || 'S'}
                     </div>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-emerald-950/90 backdrop-blur-xl border border-emerald-800/50 text-white/80 rounded-2xl flex justify-around p-3 z-40 shadow-2xl shadow-emerald-950/40">
        <Link href="/staff/dashboard" className="flex flex-col items-center hover:text-emerald-400 active:scale-95 transition-all">
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Events</span>
        </Link>
        <Link href="/staff/lookup" className="flex flex-col items-center hover:text-emerald-400 active:scale-95 transition-all">
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Lookup</span>
        </Link>
        <Link href="/staff/scanner" className="flex flex-col items-center justify-center -mt-10 group">
           <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/30 border-4 border-slate-50 transform group-active:scale-95 transition-all">
             <QrCode className="w-6 h-6" />
           </div>
        </Link>
        <Link href="/staff/history" className="flex flex-col items-center hover:text-emerald-400 active:scale-95 transition-all">
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
        </Link>
        <Link href="/staff/profile" className="flex flex-col items-center hover:text-emerald-400 active:scale-95 transition-all">
           <User className="w-5 h-5 mb-0.5" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
        </Link>
      </div>
    </div>
  );
}
