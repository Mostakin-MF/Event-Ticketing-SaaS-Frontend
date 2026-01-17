'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Building2, Users, TrendingUp, AlertCircle,
    ArrowUpRight, ArrowDownRight, Activity,
    CreditCard, RefreshCw, DollarSign,
    Settings, Palette, Shield, Clock,
    CheckCircle2, Eye, Zap, Layers
} from 'lucide-react';
import { adminService, ActivityLog } from '@/services/adminService';

export default function AdminDashboard() {
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [tenants, setTenants] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [themes, setThemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsResponse, statsData, tenantsResponse, paymentsResponse, themesResponse] = await Promise.all([
                adminService.getAllActivityLogs().catch((err) => {
                    const status = err?.response?.status;
                    if (status !== 401 && status !== 403) console.error('Activity logs error:', err);
                    return { data: [] };
                }),
                adminService.getDashboardStats().catch((err) => {
                    const status = err?.response?.status;
                    if (status !== 401 && status !== 403) console.error('Stats error:', err);
                    return { activeTenants: 0, totalUsers: 0, totalRevenue: 0, systemHealth: 'Healthy' };
                }),
                adminService.getAllTenants({ limit: 5 }).catch((err) => {
                    const status = err?.response?.status;
                    if (status !== 401 && status !== 403) console.error('Tenants error:', err);
                    return { data: [] };
                }),
                adminService.getAllPayments({ limit: 5 }).catch((err) => {
                    const status = err?.response?.status;
                    if (status !== 401 && status !== 403) console.error('Payments error:', err);
                    return { data: [] };
                }),
                adminService.getAllThemes().catch((err) => {
                    const status = err?.response?.status;
                    if (status !== 401 && status !== 403) console.error('Themes error:', err);
                    return { data: [] };
                })
            ]);

            setActivityLogs((logsResponse.data || []).slice(0, 10));
            setStats(statsData);
            setTenants(Array.isArray(tenantsResponse) ? tenantsResponse : tenantsResponse.data || []);
            setPayments(Array.isArray(paymentsResponse) ? paymentsResponse : paymentsResponse.data || []);
            setThemes(Array.isArray(themesResponse) ? themesResponse : themesResponse.data || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(amount)) return '৳0';
        return `৳${amount.toLocaleString()}`;
    };

    const activeThemes = themes.filter((t: any) => t.status === 'active').length;

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">

            {/* COMPACT COMMAND HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Activity size={10} strokeWidth={3} /> Real-time Ops
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase">Command Center</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            High-level platform telemetry. Monitoring {stats?.activeTenants || 0} active environments across the TicketBD network.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            <span className="text-[11px] font-black uppercase tracking-widest">{loading ? 'Syncing' : 'Sync Ops'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE GRID - PREMIUM CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <PremiumStatCard
                    label="Platform Tenants"
                    value={stats?.activeTenants || 0}
                    trend={+12.5}
                    icon={Building2}
                    color="emerald"
                    loading={loading}
                />
                <PremiumStatCard
                    label="Global Network Users"
                    value={stats?.totalUsers || 0}
                    trend={+8.3}
                    icon={Users}
                    color="teal"
                    loading={loading}
                />
                <PremiumStatCard
                    label="Accumulated Revenue"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    trend={+15.7}
                    icon={DollarSign}
                    color="emerald"
                    loading={loading}
                />
                <PremiumStatCard
                    label="Operational Themes"
                    value={activeThemes}
                    trend={0}
                    icon={Palette}
                    color="slate"
                    loading={loading}
                />
            </div>

            {/* QUICK COMMANDS & ACTIVITY MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* Left Column: Commands & Tenants */}
                <div className="lg:col-span-8 space-y-6 lg:space-y-8">

                    {/* Glow-Up Quick Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <IntegratedAction href="/admin/tenants" icon={Building2} label="Tenants" />
                        <IntegratedAction href="/admin/users" icon={Users} label="Identity" />
                        <IntegratedAction href="/admin/themes" icon={Palette} label="Themes" />
                        <IntegratedAction href="/admin/settings" icon={Settings} label="Config" />
                    </div>

                    {/* Modern Tenant Matrix */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                    <Layers size={16} className="text-emerald-500" />
                                    Recent Tenant Activation
                                </h3>
                            </div>
                            <Link href="/admin/tenants" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-all group">
                                Matrix View <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/50">
                                        <th className="px-8 py-4 text-left">Identity</th>
                                        <th className="px-8 py-4 text-left">Deployment</th>
                                        <th className="px-8 py-4 text-left">State</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        [1, 2, 3].map(i => <SkeletonRow key={i} />)
                                    ) : tenants.slice(0, 5).map((tenant: any) => (
                                        <tr key={tenant.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-slate-900 text-sm">{tenant.name}</div>
                                                <div className="text-[10px] font-medium text-slate-400">slug: {tenant.slug}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">
                                                    {new Date(tenant.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <OperationalBadge status={tenant.status} />
                                            </td>
                                            <td className="px-8 py-5 text-right font-black uppercase text-[10px]">
                                                <Link href={`/admin/tenants/${tenant.id}`} className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors">
                                                    Manage <ChevronRight size={12} className="stroke-[3]" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && tenants.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-10 text-center text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Zero Active Deployments Detected</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity & Payments */}
                <div className="lg:col-span-4 space-y-6 lg:space-y-8">

                    {/* Cinematic Activity Timeline */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col min-h-[480px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="mb-8 relative z-10 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.25em] flex items-center gap-2.5 text-emerald-400">
                                <Activity size={14} strokeWidth={3} /> System Pulse
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar relative z-10 pr-2">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse w-full"></div>)}
                                </div>
                            ) : activityLogs.map((log: any, i: number) => (
                                <div key={log.id} className="relative pl-6 border-l border-white/10 group">
                                    <div className={`absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full transition-all duration-500 ${i === 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-700 group-hover:bg-slate-500'}`}></div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-200 leading-snug group-hover:text-white transition-colors">
                                            {log.action}
                                        </p>
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                                            <Clock size={10} />
                                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • SYSTEM_LOG
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!loading && activityLogs.length === 0 && (
                                <p className="text-center py-20 text-[10px] font-black uppercase text-slate-600 tracking-widest">Awaiting Pulse...</p>
                            )}
                        </div>
                    </div>

                    {/* Mini Payment Feed */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <CreditCard size={12} />
                                Latest Inflow
                            </h3>
                            <Link href="/admin/payment" className="text-[9px] font-black uppercase text-emerald-600">Explore</Link>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                [1, 2].map(i => <div key={i} className="h-10 bg-slate-50 rounded-xl animate-pulse"></div>)
                            ) : payments.slice(0, 3).map((payment: any) => (
                                <div key={payment.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div>
                                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{payment.provider}</div>
                                        <div className="text-[9px] font-medium text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-slate-900">{formatCurrency(payment.amount)}</div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${payment.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// SUB-COMPONENTS

function PremiumStatCard({ label, value, trend, icon: Icon, color, loading }: any) {
    const configs: any = {
        emerald: "bg-white text-emerald-600 border-emerald-50 shadow-emerald-200/20",
        teal: "bg-white text-teal-600 border-teal-50 shadow-teal-200/20",
        slate: "bg-white text-slate-900 border-slate-50 shadow-slate-200/20",
    };

    return (
        <div className={`bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-emerald-500/30 transition-all hover:-translate-y-1`}>
            {loading ? (
                <div className="space-y-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl animate-pulse"></div>
                    <div className="h-6 bg-slate-50 rounded-lg animate-pulse w-1/2"></div>
                    <div className="h-3 bg-slate-50 rounded-lg animate-pulse w-3/4"></div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${configs[color] || configs.slate}`}>
                            <Icon size={24} strokeWidth={2.5} />
                        </div>
                        {trend !== 0 && (
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {trend > 0 ? <TrendingUp size={14} /> : <ArrowDownRight size={14} />}
                                {trend}%
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">{value}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
                    </div>
                </>
            )}
        </div>
    );
}

function IntegratedAction({ href, icon: Icon, label }: any) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-lg shadow-slate-200/40 hover:border-emerald-500/30 hover:bg-emerald-50/20 transition-all group"
        >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-emerald-700 transition-colors">{label}</span>
        </Link>
    );
}

function OperationalBadge({ status }: { status: string }) {
    const styles: any = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
        suspended: 'bg-red-50 text-red-600 border-red-100',
    };
    const style = styles[status?.toLowerCase()] || 'bg-slate-50 text-slate-500 border-slate-100';

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style}`}>
            {status}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-8 py-5"><div className="h-4 w-32 bg-slate-50 rounded"></div></td>
            <td className="px-8 py-5"><div className="h-3 w-20 bg-slate-50 rounded"></div></td>
            <td className="px-8 py-5"><div className="h-5 w-16 bg-slate-50 rounded-full"></div></td>
            <td className="px-8 py-5"><div className="h-3 w-12 bg-slate-50 rounded ml-auto"></div></td>
        </tr>
    );
}

function ChevronRight({ className, size = 16, ...props }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
