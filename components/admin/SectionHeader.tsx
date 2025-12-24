import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: React.ReactNode;
}

export default function SectionHeader({
    title,
    description,
    icon,
    actionLabel,
    onAction,
    actionIcon
}: SectionHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="hidden sm:flex p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-900">
                        {icon}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight italic">{title}</h1>
                    <p className="text-slate-500 mt-1 font-medium">{description}</p>
                </div>
            </div>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200"
                >
                    {actionIcon}
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
}
