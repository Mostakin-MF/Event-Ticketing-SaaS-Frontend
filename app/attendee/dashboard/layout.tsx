'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Ticket, User, LogOut, Menu, X, Bell, Inbox, Trash2, CheckCheck } from 'lucide-react';
import { authService } from '@/services/authService';
import { usePusher } from '@/components/providers/PusherProvider';

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { history, unreadCount, markAllRead, clearHistory } = usePusher();

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const userData = await authService.checkAuth();
            setUser(userData);
        } catch (e) {
            // Optional: Redirect to login or allow guest viewing for Discovery
            // router.push('/auth/login');
        }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/attendee/dashboard', icon: Menu },
    { name: 'Discover', href: '/attendee/dashboard/events', icon: Compass },
    { name: 'My Tickets', href: '/attendee/dashboard/tickets', icon: Ticket },
    { name: 'Profile', href: '/attendee/dashboard/profile', icon: User },
  ];

  // If we are on an auth page, don't show the layout
  if (pathname?.startsWith('/attendee/auth')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm">
         <div className="font-black text-xl tracking-tighter text-emerald-600">TICKETBD</div>
         <div className="flex items-center gap-2">
           {/* Notification Bell */}
           <button
             onClick={() => {
               setShowNotifications(!showNotifications);
               if (!showNotifications) markAllRead();
             }}
             className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
           >
             <Bell className="w-5 h-5" />
             {unreadCount > 0 && (
               <span className="absolute top-0 right-0 flex h-4 w-4">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[10px] items-center justify-center font-bold text-white">
                   {unreadCount}
                 </span>
               </span>
             )}
           </button>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
               {isSidebarOpen ? <X /> : <Menu />}
           </button>
         </div>
      </div>

      {/* Main Container */}
      <div className="flex max-w-7xl mx-auto">
        
        {/* Sidebar (Desktop) */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6 md:p-8">
                    <div className="font-black text-2xl tracking-tighter text-emerald-400 mb-1 flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">T</div>
                        TicketBD
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-10">Attendees</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    {/* Notification Bell (Desktop Sidebar) */}
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) markAllRead();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium mb-3 ${
                        showNotifications ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="relative">
                        <Bell className={`w-5 h-5 ${showNotifications ? 'text-emerald-400' : 'text-slate-400'}`} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                          {unreadCount} NEW
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0) || 'G'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Guest User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || 'Sign in to book'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full min-h-screen">
             <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
                {children}
             </div>
        </main>

      </div>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe flex justify-around p-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center w-full p-2 rounded-lg ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                    <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                </Link>
            )
         })}
       </div>

       {/* Notification Panel Overlay */}
       {showNotifications && (
         <div className="fixed inset-0 z-50 overflow-hidden">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
           <div className="absolute top-20 right-4 sm:right-6 w-full max-w-[380px] h-[500px] bg-slate-900 border border-slate-700/50 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
             {/* Panel Header */}
             <div className="p-6 border-b border-slate-700/30 bg-black/20 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Inbox className="text-emerald-400 w-5 h-5" />
                 <h3 className="font-bold text-white uppercase tracking-widest text-sm">Notifications</h3>
               </div>
               <div className="flex items-center gap-2">
                 <button onClick={clearHistory} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Clear All">
                   <Trash2 size={16} />
                 </button>
                 <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                   <X size={16} />
                 </button>
               </div>
             </div>

             {/* Panel Content */}
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {history.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
                   <Bell size={40} className="mb-4 text-emerald-400" />
                   <p className="text-xs font-bold uppercase tracking-widest leading-loose text-white">No notifications yet. They will appear here in real-time.</p>
                 </div>
               ) : (
                 history.map((notif, i) => (
                   <div key={i} className={`p-4 rounded-2xl border ${
                     notif.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                     notif.type === 'error' ? 'bg-red-500/5 border-red-500/10' :
                     notif.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/10' :
                     'bg-blue-500/5 border-blue-500/10'}
                   `}>
                     <div className="flex items-start gap-4">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                         notif.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                         notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
                         notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                         'bg-blue-500/20 text-blue-400'}
                       `}>
                         {notif.type === 'success' ? <CheckCheck size={14} /> : <Bell size={14} />}
                       </div>
                       <div>
                         <h4 className="text-[11px] font-black uppercase tracking-wider text-white mb-0.5">{notif.title}</h4>
                         <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{notif.message}</p>
                       </div>
                     </div>
                   </div>
                 ))
               )}
             </div>

             {/* Panel Footer */}
             <div className="p-4 bg-black/20 border-t border-slate-700/30 text-center">
               <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50 hover:text-emerald-400 transition-colors">
                 Mark All as Read
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
}
