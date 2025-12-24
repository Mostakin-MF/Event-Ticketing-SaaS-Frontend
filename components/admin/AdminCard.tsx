import React from 'react';

interface AdminCardProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
    dark?: boolean;
}

export default function AdminCard({
    title,
    icon,
    children,
    className = "",
    headerAction,
    dark = false
}: AdminCardProps) {
    return (
        <div className={`${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 ring-1 ring-slate-100'
            } rounded-[2rem] shadow-sm p-8 ${className}`}>
            {(title || icon || headerAction) && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className={`p-2.5 rounded-xl border shadow-sm ${dark ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}>
                                {icon}
                            </div>
                        )}
                        {title && <h3 className={`text-lg font-black italic ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h3>}
                    </div>
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    );
}
