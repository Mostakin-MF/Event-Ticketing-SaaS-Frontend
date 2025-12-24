import React from 'react';

interface StatItem {
    label: string;
    value: string | number;
    color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
    icon?: React.ReactNode;
}

interface StatsGridProps {
    stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 group hover:border-slate-200 transition-all cursor-default">
                    {stat.icon && (
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all mb-4">
                            {stat.icon}
                        </div>
                    )}
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-950 italic">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
