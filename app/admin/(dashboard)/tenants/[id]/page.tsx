"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Users,
    Ticket,
    TrendingUp,
    Settings,
    Shield,
    ExternalLink,
    Mail,
    Phone,
    Zap,
    Activity,
    Layers,
    Clock,
    Palette,
    Globe,
    CheckCircle,
    Loader2,
    Building2
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import EditTenantModal from '../EditTenantModal';

export default function TenantDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;

    const [tenant, setTenant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchTenant = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getTenantById(id);
            setTenant(response.data || response);
        } catch (err: any) {
            console.error("Failed to fetch tenant", err);
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                setError('AUTH_FAILURE: ACCESS_DENIED');
            } else {
                setError('IO_FAILURE: DATA_LINK_BROKEN');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTenant();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                <Loader2 size={48} className="text-emerald-500 animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Node Data...</p>
            </div>
        );
    }

    if (error || !tenant) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-6 border border-red-100">
                    <Shield size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {error === 'AUTH_FAILURE: ACCESS_DENIED' ? 'Authorization Failed' : 'Organization Not Found'}
                </h2>
                <p className="text-slate-500 mt-2 font-medium">
                    {error === 'AUTH_FAILURE: ACCESS_DENIED'
                        ? 'Your current session does not have the authority to inspect this environment.'
                        : 'The specified deployment environment does not exist in the matrix.'}
                </p>
                <Link
                    href="/admin/tenants"
                    className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                >
                    Return to Ecosystem
                </Link>
            </div>
        );
    }

    const branding = tenant.brandingSettings || { primaryColor: '#10b981', logo: '' };

    return (
        <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* NAVIGATION & ACTION SUITE */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <Link href="/admin/tenants" className="flex items-center gap-3 text-slate-400 hover:text-emerald-600 transition-all font-black text-[11px] uppercase tracking-[0.2em] group">
                    <div className="p-3 rounded-2xl bg-white border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Matrix</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3.5 rounded-2xl bg-white border border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        Lifecycle: {tenant.status}
                    </button>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="px-6 py-3.5 rounded-2xl bg-[#022c22] text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/40 active:scale-95 flex items-center gap-2"
                    >
                        <Zap size={14} className="fill-current text-emerald-400" />
                        Modify Core Matrix
                    </button>
                </div>
            </div>

            {/* CINEMATIC ORGANIZATION HERO */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 lg:p-12 relative overflow-hidden group">
                {/* Dynamic Background Glow */}
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-1000 group-hover:scale-110"
                    style={{ backgroundColor: branding.primaryColor }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                    {/* Perspective Brand Identity */}
                    <div className="relative group/logo">
                        <div
                            className="absolute inset-0 blur-2xl opacity-20 group-hover/logo:opacity-40 transition-opacity rounded-full scale-90"
                            style={{ backgroundColor: branding.primaryColor }}
                        ></div>
                        <div
                            className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-slate-200 border-8 border-white relative z-10 overflow-hidden transform group-hover/logo:rotate-3 transition-transform duration-500"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            {branding.logo ? (
                                <img src={branding.logo} alt={tenant.name} className="w-20 h-20 lg:w-24 lg:h-24 object-contain" />
                            ) : (
                                <Building2 className="text-white w-14 h-14" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 pt-2">
                        <div className="space-y-2">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase italic">{tenant.name}</h1>
                                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${tenant.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                    <span className="inline-block w-2 h-2 rounded-full bg-current mr-2 shadow-[0_0_8px_currentColor]"></span>
                                    {tenant.status} Network State
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <div className="flex items-center gap-2"><Globe size={14} className="text-emerald-500" /> @{tenant.slug}</div>
                                <div className="flex items-center gap-2"><Clock size={14} className="text-emerald-500" /> Node Established: {new Date(tenant.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            <ContactCard icon={<Mail size={16} />} value={`corp@${tenant.slug}.platform`} label="Administrative Uplink" />
                            <ContactCard icon={<Phone size={16} />} value="+880 1700-000000" label="Direct Frequency" />
                            <ContactCard icon={<ExternalLink size={16} />} value={`${tenant.slug}.ticketbd.com`} label="Public Node Portal" />
                        </div>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE TELMETRY GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <MetricCard label="Ecosystem Events" value="24" icon={<Activity size={20} />} trend="+12%" color="blue" />
                <MetricCard label="Personnel Count" value="18" icon={<Users size={20} />} trend="Stable" color="emerald" />
                <MetricCard label="Entity Transactions" value="2.4k" icon={<Ticket size={20} />} trend="+8% (MoM)" color="amber" />
                <MetricCard label="Network Inflow" value="৳1.2M" icon={<TrendingUp size={20} />} trend="Peak" color="rose" />
            </div>

            {/* DEEP DIVE CONFIGURATION MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* GOVERNANCE & ROLES */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Shield size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#022c22] text-emerald-400 flex items-center justify-center shadow-lg">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Governance Matrix</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authority Protocols</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AuthorityRow role="Tenant Executive" email={`admin@${tenant.slug}.org`} status="Active" isPrimary />
                        <AuthorityRow role="Security Officer" email="sec.protocol@platform.net" status="Monitoring" />
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group/item hover:border-emerald-200 transition-all cursor-pointer">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Verify Credentials</p>
                                    <p className="text-sm font-bold text-slate-900 italic">Audit Log Integrity: 99.8%</p>
                                </div>
                                <div className="p-2 rounded-xl bg-white text-emerald-600 shadow-sm group-hover/item:scale-110 transition-transform">
                                    <CheckCircle size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIGNATURE BRANDING CORE */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100">
                            <Palette size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Aesthetic Foundation</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Visual Identity Systems</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group-hover:border-emerald-100 transition-all">
                            <div
                                className="w-20 h-20 rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center relative transition-transform duration-500 group-hover:rotate-3"
                                style={{ backgroundColor: branding.primaryColor }}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Zap size={24} className="text-white/40" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Signature Color</p>
                                <p className="text-lg font-black text-slate-900 font-mono tracking-tighter uppercase">{branding.primaryColor}</p>
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-1 w-4 rounded-full bg-slate-200" style={{ opacity: 1 - i * 0.2, backgroundColor: i === 1 ? branding.primaryColor : undefined }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2rem] bg-[#022c22] text-white">
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 mb-1">Node Asset</p>
                                <p className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">favicon_vector.svg</p>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Typography</p>
                                <p className="text-xs font-black text-slate-900 italic uppercase italic">Outfit Black</p>
                            </div>
                        </div>

                        <Link
                            href={`/admin/tenants/${tenant.id}/design`}
                            className="flex items-center justify-center gap-3 w-full py-4 rounded-[1.5rem] bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group"
                        >
                            <Settings size={14} className="group-hover:rotate-90 transition-transform" />
                            Modify Global Aesthetics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditTenantModal
                isOpen={showEditModal}
                tenant={tenant}
                onClose={() => setShowEditModal(false)}
                onSuccess={fetchTenant}
            />
        </div>
    );
}

// COMPACT UI BLOCKS

function ContactCard({ icon, value, label }: any) {
    return (
        <div className="flex items-start gap-4 group/card">
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover/card:bg-emerald-50 group-hover/card:text-emerald-500 transition-all border border-transparent group-hover/card:border-emerald-100">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                <p className="text-xs font-bold text-slate-900 break-all">{value}</p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, color }: any) {
    const colors: any = {
        emerald: "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-900/5",
        blue: "text-blue-500 bg-blue-50 border-blue-100 shadow-blue-900/5",
        amber: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-900/5",
        rose: "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-900/5",
    };
    return (
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all cursor-default relative overflow-hidden">
            <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">{value}</p>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

function AuthorityRow({ role, email, status, isPrimary }: any) {
    return (
        <div className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${isPrimary ? 'bg-slate-900 text-white border-slate-800 shadow-xl' : 'bg-slate-50/50 text-slate-900 border-slate-100'
            }`}>
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isPrimary ? 'bg-white/10 text-emerald-400' : 'bg-white text-slate-300 shadow-sm'}`}>
                    <Shield size={18} />
                </div>
                <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${isPrimary ? 'text-emerald-400' : 'text-slate-400'}`}>{role}</p>
                    <p className="text-sm font-bold opacity-80 italic">{email}</p>
                </div>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${isPrimary ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                {status}
            </span>
        </div>
    );
}
