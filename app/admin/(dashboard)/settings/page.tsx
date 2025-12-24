import React from 'react';
import { Settings, Shield, Globe, Bell, Lock, Database } from 'lucide-react';

export default function SettingsPage() {
    const sections = [
        {
            title: 'Platform Config',
            icon: <Globe size={20} />,
            items: [
                { label: 'Platform Name', value: 'TicketBD' },
                { label: 'Primary Domain', value: 'ticketbd.com' },
                { label: 'System Language', value: 'English (BD)' },
                { label: 'Base Currency', value: 'BDT (৳)' },
            ]
        },
        {
            title: 'Security & Access',
            icon: <Shield size={20} />,
            items: [
                { label: 'Admin Session Timeout', value: '24 Hours' },
                { label: 'Registration Token Requirement', value: 'Enabled' },
                { label: 'Two-Factor Authentication', value: 'Optional' },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-950 tracking-tight italic">System Settings</h1>
                <p className="text-slate-500 mt-1 font-medium">Configure global platform behavior and defaults.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sections.map((section) => (
                    <div key={section.title} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-100 shadow-sm">
                                {section.icon}
                            </div>
                            <h3 className="text-lg font-black text-slate-950 italic">{section.title}</h3>
                        </div>

                        <div className="space-y-4">
                            {section.items.map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer">
                                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                                    <span className="text-sm font-black text-slate-950 italic">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button className="w-full py-4 px-6 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300">
                                Update {section.title}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Additional Settings Panels */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Database size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black italic mb-2">Database & Backups</h3>
                        <p className="text-slate-400 text-sm mb-8 font-medium">Maintain system health and data integrity.</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 font-bold">Last Auto-Backup</span>
                                <span className="font-black italic">2 hours ago</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-primary rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Storage Used: 4.2GB</span>
                                <span>Cap: 50GB</span>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-all text-sm backdrop-blur-md border border-white/5">
                            <Database size={18} />
                            <span>Run Manual Backup</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
