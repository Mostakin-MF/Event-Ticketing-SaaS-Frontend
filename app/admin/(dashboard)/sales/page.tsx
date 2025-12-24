import React from 'react';
import SectionHeader from '@/components/admin/SectionHeader';
import StatsGrid from '@/components/admin/StatsGrid';
import AdminCard from '@/components/admin/AdminCard';
import { Ticket, TrendingUp, DollarSign, Download, Filter, Search } from 'lucide-react';
import fs from 'fs/promises';
import path from 'path';

async function getSales() {
    const filePath = path.join(process.cwd(), 'data', 'sales.json');
    try {
        const fileData = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileData);
    } catch (e) {
        return [];
    }
}

export default async function SalesPage() {
    const sales = await getSales();

    const stats = [
        {
            label: 'Global Revenue',
            value: `৳${sales.reduce((acc: number, curr: any) => acc + (curr.status === 'completed' ? curr.amount : 0), 0).toLocaleString()}`,
            icon: <DollarSign size={20} />
        },
        {
            label: 'Total Transactions',
            value: sales.length,
            icon: <Ticket size={20} />
        },
        {
            label: 'Avg. Order Value',
            value: sales.length > 0 ? `৳${Math.round(sales.reduce((acc: number, curr: any) => acc + curr.amount, 0) / sales.length).toLocaleString()}` : '৳0',
            icon: <TrendingUp size={20} />
        },
        {
            label: 'Pending Payouts',
            value: `৳${sales.reduce((acc: number, curr: any) => acc + (curr.status === 'pending' ? curr.amount : 0), 0).toLocaleString()}`,
            icon: <Download size={20} />
        },
    ];

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Ticket Sales Ledger"
                description="Global transaction monitoring and financial audit."
                icon={<Ticket size={24} />}
                actionLabel="Export Report"
                actionIcon={<Download size={20} />}
            />

            <StatsGrid stats={stats as any} />

            <AdminCard title="Recent Transactions" icon={<TrendingUp size={18} />}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by TXN, Tenant or Customer..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">TXN ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Tenant</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {sales.map((sale: any) => (
                                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-center">{sale.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 text-center">{sale.tenantName}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 text-center">{sale.customer}</td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-950 italic text-center">৳{sale.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${sale.status === 'completed'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : sale.status === 'pending'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium text-center">
                                        {new Date(sale.date).toLocaleDateString('en-GB')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminCard>
        </div>
    );
}
