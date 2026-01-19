'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    ShoppingCart,
    Ticket,
    Users,
    Settings,
    LogOut,
    Menu,
    ShieldCheck,
    Palette,
    User,
    Bell,
    CheckCheck,
    Trash2,
    Inbox,
    X
} from 'lucide-react';
import { authService } from '@/services/authService';
import { usePusher } from '@/components/providers/PusherProvider';

export default function TenantAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loggingOut, setLoggingOut] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { history, unreadCount, markAllRead, clearHistory } = usePusher();

    React.useEffect(() => {
        const verifySession = async () => {
            try {
                await authService.checkAuth();
                setIsAuthenticated(true);
            } catch (error: any) {
                const status = error?.status;
                // 401/403 is expected for unauthenticated users - silently redirect
                if (status === 401 || status === 403) {
                    router.replace('/auth/login');
                } else {
                    console.error('Auth verification failed:', error?.message || error);
                    router.replace('/auth/login');
                }
            }
        };
        verifySession();
    }, [router]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setLoggingOut(false);
        }
    };

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href;
        return (
            <li>
                <Link
                    href={href}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group
                        ${isActive
                            ? 'bg-white/10 text-emerald-400 shadow-lg shadow-black/10 backdrop-blur-sm'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                    `}
                >
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`} />
                    <span>{label}</span>
                    {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                    )}
                </Link>
            </li>
        );
    };

    // Check if we are in the "Customize Theme" page (fullscreen mode)
    const isCustomizePage = pathname?.endsWith('/customize');

    if (isCustomizePage) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
                {children}
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open font-sans antialiased text-slate-900 bg-slate-50">
            <input id="tenant-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Content */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Mobile Navbar */}
                <div className="w-full navbar bg-slate-900 text-white shadow-md lg:hidden z-20">
                    <div className="flex-none">
                        <label htmlFor="tenant-drawer" className="btn btn-square btn-ghost">
                            <Menu className="h-6 w-6" />
                        </label>
                    </div>
                    <div className="flex-1">
                        <span className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="text-emerald-400" size={20} />
                            TicketBD
                        </span>
                    </div>
                    <div className="flex-none pr-2">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) markAllRead();
                            }}
                            className="btn btn-ghost btn-circle relative"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[10px] items-center justify-center font-bold">{unreadCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto bg-slate-50/50">
                    {children}
                </main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-30">
                <label htmlFor="tenant-drawer" className="drawer-overlay bg-black/50 backdrop-blur-sm"></label>
                <div className="menu p-4 w-72 min-h-full bg-[#022c22] text-base-content flex flex-col justify-between border-r border-white/5 shadow-2xl relative overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[96px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[96px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div>
                        {/* Logo Section */}
                        <div className="flex items-center gap-3 px-2 mb-10 pt-2 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 ring-1 ring-white/10">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-white leading-tight tracking-tight">TicketBD</h2>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tenant Portal</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <ul className="space-y-1 relative z-10">
                            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2 mt-2">Overview</p>
                            <NavItem href="/tenant-admin" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem href="/tenant-admin/events" icon={CalendarDays} label="Events" />
                            <NavItem href="/tenant-admin/orders" icon={ShoppingCart} label="Orders" />

                            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2 mt-6">Management</p>
                            <NavItem href="/tenant-admin/tickets" icon={Ticket} label="Tickets" />
                            <NavItem href="/tenant-admin/themes" icon={Palette} label="Themes" />
                            <NavItem href="/tenant-admin/staff" icon={Users} label="Staff" />
                        </ul>
                    </div>

                    {/* User & Logout */}
                    <div className="relative z-10">
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

                        {/* Notification Bell (Sidebar) */}
                        <div className="px-2 mb-4">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) markAllRead();
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group
                                    ${showNotifications ? 'bg-white/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                `}
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
                                {unreadCount > 0 && <span className="ml-auto text-[10px] font-black bg-emerald-500 text-black px-1.5 py-0.5 rounded-full">{unreadCount} NEW</span>}
                            </button>
                        </div>

                        {/* Tenant Info */}
                        <Link href="/tenant-admin/profile" className="block px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    TA
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">Tenant Admin</p>
                                    <p className="text-xs text-slate-400">Profile</p>
                                </div>
                            </div>
                        </Link>

                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-500/10 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Notification Panel Overlay */}
            {showNotifications && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
                    <div className="absolute top-20 right-4 sm:right-6 lg:right-10 w-full max-w-[380px] h-[500px] bg-[#022c22] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                        {/* Panel Header */}
                        <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Inbox className="text-emerald-400 w-5 h-5" />
                                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Notifications</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearHistory}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                    title="Clear All"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {history.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
                                    <Bell size={40} className="mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest leading-loose">No notifications yet. They will appear here in real-time.</p>
                                </div>
                            ) : (
                                history.map((notif, i) => (
                                    <div
                                        key={i}
                                        className={`
                                            p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group/item
                                            ${notif.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                                                notif.type === 'error' ? 'bg-red-500/5 border-red-500/10' :
                                                    'bg-blue-500/5 border-blue-500/10'}
                                        `}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                                ${notif.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
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
                        <div className="p-4 bg-black/20 border-t border-white/5 text-center">
                            <button
                                onClick={markAllRead}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50 hover:text-emerald-400 transition-colors"
                            >
                                Mark All as Read
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
