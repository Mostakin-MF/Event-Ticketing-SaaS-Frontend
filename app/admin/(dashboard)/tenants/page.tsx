'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Building2, Plus, Search, Eye, Edit2, Trash2,
    Shield, Calendar, Globe, Filter, Zap,
    TrendingUp, Activity, Layers, CheckCircle2
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import CreateTenantModal from './CreateTenantModal';
import EditTenantModal from './EditTenantModal';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: string;
    brandingSettings?: {
        primaryColor?: string;
        logo?: string;
    };
}

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTenant, setEditingTenant] = useState<any>(null);

    useEffect(() => {
        fetchTenants();
    }, [searchTerm, statusFilter]);

    const fetchTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            const query: any = {};
            if (searchTerm) query.search = searchTerm;
            if (statusFilter !== 'all') query.status = statusFilter;

            const response = await adminService.getAllTenants(query);
            setTenants(response.data || []);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                setError('PERMISSION_DENIED: PLATFORM_ADMIN_ONLY');
            } else {
                console.error("Failed to fetch tenants", error);
                setError('IO_CONNECTION_FAILED: DATA_RETRIEVAL_ERROR');
            }
            setTenants([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTenant = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await adminService.deleteTenant(id);
            fetchTenants();
        } catch (error) {
            console.error('Failed to delete tenant', error);
            alert('Failed to delete tenant');
        }
    };

    // Calculate stats
    const stats = {
        total: tenants.length,
        active: tenants.filter(t => t.status === 'active').length,
        pending: tenants.filter(t => t.status === 'pending').length,
        suspended: tenants.filter(t => t.status === 'suspended').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">

            {/* COMPACT ECOSYSTEM HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Building2 size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Layers size={10} fill="currentColor" /> Organization Ecosystem
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase">Tenant Matrix</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            Orchestrating platform environments. Monitoring organization health, scalability, and deployment status across the network.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95 group"
                        >
                            <Plus size={16} className="text-emerald-600 group-hover:rotate-90 transition-transform" />
                            Onboard Org
                        </button>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE GRID - ECOSYSTEM STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <CompactStatCard label="Total Organizations" value={stats.total} icon={Building2} color="slate" />
                <CompactStatCard label="Active Deployments" value={stats.active} icon={CheckCircle2} color="emerald" />
                <CompactStatCard label="Pending Approval" value={stats.pending} icon={Activity} color="amber" />
                <CompactStatCard label="Suspended Cells" value={stats.suspended} icon={Zap} color="red" />
            </div>

            {/* FILTER & SEARCH HUB */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Compact Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <ModernTabButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All Matrix" />
                        <ModernTabButton active={statusFilter === 'active'} onClick={() => setStatusFilter('active')} label="Active" />
                        <ModernTabButton active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} label="Pending" />
                        <ModernTabButton active={statusFilter === 'suspended'} onClick={() => setStatusFilter('suspended')} label="Suspended" />
                    </div>

                    {/* Integrated Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Scan environments by name, slug or network vector..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-[2rem] text-[13px] font-bold focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <div className="h-4 w-px bg-slate-200"></div>
                            <Filter size={14} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ORGANIZATION MATRIX TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#022c22]"></div>

                {error && (
                    <div className="px-8 py-5 bg-red-50 border-b border-red-100 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                            <Shield size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-red-700">{error}</p>
                            <p className="text-[10px] text-red-600 font-medium">Please verify your credentials and ensure you have high-level platform authority.</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 bg-slate-50/50">
                                <th className="px-8 py-5 text-left">Organization Ecosystem</th>
                                <th className="px-8 py-5 text-left">Operational State</th>
                                <th className="px-8 py-5 text-left">Onboarded</th>
                                <th className="px-8 py-5 text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                            ) : tenants.length > 0 ? (
                                tenants.map((tenant) => (
                                    <tr key={tenant.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-white font-black shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 border border-white/20"
                                                    style={{ backgroundColor: tenant.brandingSettings?.primaryColor || '#10b981' }}
                                                >
                                                    {tenant.brandingSettings?.logo ? (
                                                        <img src={tenant.brandingSettings.logo} alt={tenant.name} className="w-9 h-9 rounded-lg object-contain" />
                                                    ) : (
                                                        <span className="text-lg">{tenant.name.substring(0, 1).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-base tracking-tight">{tenant.name}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 uppercase tracking-wider">
                                                        <Globe size={12} className="text-emerald-500/50" />
                                                        {tenant.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={tenant.status} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                                                <Calendar size={14} className="text-slate-300" />
                                                {new Date(tenant.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/tenants/${tenant.id}`}
                                                    className="p-2.5 rounded-xl hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-all"
                                                    title="Inspect Deployment"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setEditingTenant(tenant)}
                                                    className="p-2.5 rounded-xl hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-all"
                                                    title="Modify Matrix"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                                                    className="p-2.5 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-600 transition-all"
                                                    title="Purge Org"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Zero Organizations Detected within current matrix scope</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <CreateTenantModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchTenants}
            />
            <EditTenantModal
                isOpen={!!editingTenant}
                tenant={editingTenant}
                onClose={() => setEditingTenant(null)}
                onSuccess={fetchTenants}
            />
        </div>
    );
}

// COMPACT COMPONENTS

function CompactStatCard({ label, value, icon: Icon, color }: any) {
    const config: any = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-900/5",
        amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-900/5",
        red: "bg-red-50 text-red-600 border-red-100 shadow-red-900/5",
        slate: "bg-slate-900 text-white border-slate-800 shadow-xl shadow-slate-900/10",
    };

    return (
        <div className={`rounded-[2rem] p-6 border ${config[color] || config.emerald} group transition-all hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-2xl ${color === 'slate' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {color !== 'slate' && (
                    <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                        <TrendingUp size={12} /> Live
                    </div>
                )}
            </div>
            <div className="text-2xl font-black tracking-tight mb-0.5">{value}</div>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${color === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
        </div>
    );
}

function ModernTabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-white transition-colors'
                }`}
        >
            {label}
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        active: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        pending: 'text-amber-600 bg-amber-50 border-amber-100',
        suspended: 'text-red-600 bg-red-50 border-red-100',
    };
    const style = styles[status?.toLowerCase()] || 'text-slate-400 bg-slate-50 border-slate-100';

    return (
        <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current shadow-[0_0_8px_currentColor]"></span>
            {status}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50"></div>
                    <div className="space-y-2">
                        <div className="h-5 w-40 bg-slate-50 rounded"></div>
                        <div className="h-3 w-20 bg-slate-50 rounded"></div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6"><div className="h-6 w-24 bg-slate-50 rounded-full"></div></td>
            <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-50 rounded"></div></td>
            <td className="px-8 py-6"><div className="h-10 w-24 bg-slate-50 rounded ml-auto"></div></td>
        </tr>
    );
}
