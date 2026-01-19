"use client";

import React, { useEffect, useState } from 'react';
import {
    CreditCard,
    DollarSign,
    TrendingUp,
    Download,
    Search,
    Shield,
    Calendar,
    ExternalLink,
    CheckCircle2,
    Clock,
    XCircle,
    Filter,
    Zap,
    Activity,
    Layers,
    ArrowUpRight
} from 'lucide-react';
import { adminService } from '@/services/adminService';

interface Payment {
    id: string;
    amountCents: number;
    currency: string;
    status: string;
    provider: string;
    createdAt: string;
    orderId?: string;
    providerReference?: string;
}

export default function PaymentPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

    useEffect(() => {
        fetchPayments();
    }, [searchTerm, statusFilter]);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const query: any = {};
            if (statusFilter !== 'all') query.status = statusFilter;

            const response = await adminService.getAllPayments(query);
            let paymentsData = response.data || [];

            // Filter by search term on frontend
            if (searchTerm) {
                paymentsData = paymentsData.filter((p: Payment) =>
                    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.provider.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setPayments(paymentsData);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                setError('PERMISSION_DENIED: PLATFORM_ADMIN_ONLY');
            } else {
                console.error("Failed to fetch payments", error);
                setError('IO_CONNECTION_FAILED: DATA_RETRIEVAL_ERROR');
            }
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const totalRevenueCents = payments.reduce((acc, curr) =>
        acc + (['completed', 'succeeded', 'paid'].includes(curr.status?.toLowerCase()) ? Number(curr.amountCents) : 0), 0);
    const totalTransactions = payments.length;
    const completedCount = payments.filter(p => ['completed', 'succeeded', 'paid'].includes(p.status?.toLowerCase())).length;
    const pendingCount = payments.filter(p => p.status?.toLowerCase() === 'pending').length;

    const handleExportCSV = () => {
        if (!payments.length) return;

        const headers = ["Transaction ID", "Amount", "Currency", "Status", "Provider", "Created At", "Order ID", "Provider Reference"];
        const csvRows = [headers.join(",")];

        for (const payment of payments) {
            const row = [
                payment.id,
                (payment.amountCents / 100).toFixed(2),
                payment.currency,
                payment.status,
                payment.provider,
                new Date(payment.createdAt).toISOString(),
                payment.orderId || "",
                payment.providerReference || ""
            ];
            // Escape quotes and wrap fields in quotes to handle commas within data
            const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`);
            csvRows.push(escapedRow.join(","));
        }

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payment_ledger_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">

            {/* CINEMATIC FISCAL HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <DollarSign size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Activity size={10} fill="currentColor" /> Fiscal Ledger Hub
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase italic">Payment Ecosystem</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            Monitoring global monetary velocity. Auditing transactions, revenue streams, and checkout integrity across the matrix.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <button onClick={handleExportCSV} className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95 group">
                            <Download size={16} className="text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
                            Export Ledger
                        </button>
                    </div>
                </div>
            </div>

            {/* MONETARY VELOCITY GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <CompactStatCard label="Platform Revenue" value={`৳${(totalRevenueCents / 100).toLocaleString()}`} icon={TrendingUp} color="emerald" />
                <CompactStatCard label="Transaction Volume" value={totalTransactions} icon={Layers} color="slate" />
                <CompactStatCard label="Success Matrix" value={completedCount} icon={CheckCircle2} color="emerald" />
                <CompactStatCard label="Pending Inflow" value={pendingCount} icon={Clock} color="amber" />
            </div>

            {/* INTEGRATED FISCAL FILTERING */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Compact Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <ModernTabButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All Inflow" />
                        <ModernTabButton active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')} label="Success" />
                        <ModernTabButton active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} label="Pending" />
                        <ModernTabButton active={statusFilter === 'failed'} onClick={() => setStatusFilter('failed')} label="Failed" />
                    </div>

                    {/* Integrated Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Scan transactions by hash, order ID, or provider network..."
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

            {/* CINEMATIC TRANSACTION MATRIX */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#022c22]"></div>

                {error && (
                    <div className="px-8 py-5 bg-red-50 border-b border-red-100 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                            <Shield size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-red-700">{error}</p>
                            <p className="text-[10px] text-red-600 font-medium">Authentication handshake failed. Verify platform authority credentials.</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 bg-slate-50/50">
                                <th className="px-8 py-5 text-left">Transaction Hash</th>
                                <th className="px-8 py-5 text-left">Merchant Provider</th>
                                <th className="px-8 py-5 text-left">Value (BDT)</th>
                                <th className="px-8 py-5 text-left">Network State</th>
                                <th className="px-8 py-5 text-right">Synchronization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                            ) : payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="font-black text-slate-950 font-mono text-[11px] uppercase tracking-tighter">
                                                    #{payment.id.substring(0, 12)}...
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                                        ORD: {payment.orderId || 'UNLINKED'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {(() => {
                                                const p = payment.provider?.toLowerCase();
                                                const providerStyles: any = {
                                                    strip: 'bg-indigo-600 border-indigo-500 text-white',
                                                    stripe: 'bg-indigo-600 border-indigo-500 text-white',
                                                    sslcommerz: 'bg-cyan-600 border-cyan-500 text-white',
                                                    paypal: 'bg-blue-600 border-blue-500 text-white',
                                                    bkash: 'bg-pink-600 border-pink-500 text-white',
                                                    nagad: 'bg-orange-600 border-orange-500 text-white',
                                                    aamarpay: 'bg-emerald-600 border-emerald-500 text-white',
                                                };
                                                const style = providerStyles[p] || 'bg-slate-900 border-slate-800 text-white';

                                                return (
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest border shadow-sm ${style}`}>
                                                        <Zap size={10} className="fill-current" />
                                                        {payment.provider}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-black text-slate-950 italic text-base tracking-tighter">
                                                ৳{(Number(payment.amountCents) / 100).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-tight">
                                                    <Calendar size={12} className="text-emerald-500" />
                                                    {new Date(payment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <button className="flex items-center gap-1 text-[9px] font-black text-slate-300 hover:text-emerald-500 transition-colors uppercase tracking-widest group/btn">
                                                    Audit Internal <ArrowUpRight size={10} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Zero Fiscal Records Detected within current matrix scope</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// COMPACT UI BLOCKS

function CompactStatCard({ label, value, icon: Icon, color }: any) {
    const config: any = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-900/5",
        amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-900/5",
        red: "bg-red-50 text-red-600 border-red-100 shadow-red-900/5",
        slate: "bg-slate-900 text-white border-slate-800 shadow-xl shadow-slate-900/10",
    };

    return (
        <div className={`rounded-[2.5rem] p-7 border ${config[color] || config.emerald} group transition-all hover:-translate-y-1 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <Icon size={80} />
            </div>
            <div className="flex items-center justify-between mb-6">
                <div className={`p-2.5 rounded-2xl ${color === 'slate' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {color !== 'slate' && (
                    <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                        <TrendingUp size={12} /> Live
                    </div>
                )}
            </div>
            <div className="text-2xl font-black tracking-tighter mb-0.5 uppercase italic leading-none">{value}</div>
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${color === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
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
        completed: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        succeeded: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        paid: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        pending: 'text-amber-600 bg-amber-50 border-amber-100',
        failed: 'text-red-600 bg-red-50 border-red-100',
    };
    const style = styles[status?.toLowerCase()] || 'text-slate-400 bg-slate-50 border-slate-100';

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${style}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current shadow-[0_0_8px_currentColor]"></span>
            {status}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-8 py-6">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-50 rounded"></div>
                    <div className="h-3 w-20 bg-slate-50 rounded"></div>
                </div>
            </td>
            <td className="px-8 py-6"><div className="h-8 w-24 bg-slate-50 rounded-xl"></div></td>
            <td className="px-8 py-6"><div className="h-6 w-20 bg-slate-50 rounded"></div></td>
            <td className="px-8 py-6"><div className="h-6 w-24 bg-slate-50 rounded-full"></div></td>
            <td className="px-8 py-6"><div className="space-y-2 flex flex-col items-end"><div className="h-4 w-24 bg-slate-50 rounded"></div><div className="h-3 w-16 bg-slate-50 rounded"></div></div></td>
        </tr>
    );
}
