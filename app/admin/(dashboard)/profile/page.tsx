'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import {
    User, Mail, Shield, ShieldCheck, Loader2,
    ArrowRight, LayoutDashboard, Settings,
    Building2, Save, CheckCircle2, AlertCircle, Lock
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authService.checkAuth();
                setUser(data);
                setFormData(prev => ({
                    ...prev,
                    fullName: data.name || data.fullName || '',
                    email: data.email || ''
                }));
            } catch (error: any) {
                if (error?.status !== 401 && error?.status !== 403) {
                    console.error("Failed to fetch profile", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        if (formData.newPassword || formData.confirmPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'New passwords do not match' });
                setSaving(false);
                return;
            }
            if (!formData.currentPassword) {
                setMessage({ type: 'error', text: 'Current password is required to change it' });
                setSaving(false);
                return;
            }
        }

        try {
            const updatePayload: any = {
                fullName: formData.fullName,
                email: formData.email
            };
            if (formData.newPassword) updatePayload.password = formData.newPassword;

            await authService.updateProfile(updatePayload);
            setMessage({ type: 'success', text: 'Identity updated successfully!' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            const updatedUser = await authService.checkAuth();
            setUser(updatedUser);
        } catch (error: any) {
            setMessage({ type: 'error', text: error?.response?.data?.message || 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Super Admin Identity Hub Header - COMPACT VERSION */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 lg:gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl p-1.5 shadow-xl ring-2 ring-emerald-500/20 group-hover:ring-emerald-400/40 transition-all duration-500">
                            <div className="w-full h-full rounded-full bg-[#022c22] flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                <User size={48} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-0 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg ring-2 ring-[#022c22]">
                            <ShieldCheck size={16} />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2 lg:space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Shield className="w-2.5 h-2.5 fill-current" />
                            System Authority
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none uppercase">
                            {formData.fullName || 'Super Admin'}
                        </h1>
                        <p className="text-emerald-100/70 text-sm font-medium max-w-xl mx-auto md:mx-0 line-clamp-2">
                            Platform Director governing TicketBD environments, tenant ecosystems, and security architectures.
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1">
                            <div className="flex items-center gap-2 text-white/80 text-xs">
                                <Mail size={14} className="text-emerald-400" />
                                <span className="font-bold">{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]"></div>
                                <span className="font-bold uppercase tracking-widest text-[10px]">Live Status: Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Command Hub - COMPACT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <CompactCommandCard
                    href="/admin/dashboard"
                    icon={LayoutDashboard}
                    title="Command Hub"
                    description="Analytics & System health."
                    color="emerald"
                />
                <CompactCommandCard
                    href="/admin/tenants"
                    icon={Building2}
                    title="Tenant Matrix"
                    description="Accounts & Billing."
                    color="slate"
                />
                <CompactCommandCard
                    href="/admin/settings"
                    icon={Settings}
                    title="Global Config"
                    description="Update platform settings."
                    color="teal"
                />
            </div>

            {/* Identity Update Form - STREAMLINED */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#022c22]"></div>

                <div className="p-6 lg:p-10 flex flex-col xl:flex-row gap-8 lg:gap-14">
                    {/* Form Left: Description */}
                    <div className="xl:w-80 shrink-0 space-y-4">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 inline-block">
                            <Settings size={22} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Identity Settings</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Maintain your global administrative presence across the TicketBD ecosystem.
                        </p>

                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-slate-600 text-[11px] leading-relaxed">
                            <div className="flex items-center gap-2 mb-1.5 font-bold uppercase tracking-wider text-emerald-600">
                                <ShieldCheck size={14} /> Security Note
                            </div>
                            Rotate your system credentials every 90 days for maximum platform security.
                        </div>
                    </div>

                    {/* Form Right: The Form */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {message && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-400 shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 className="shrink-0" size={18} /> : <AlertCircle className="shrink-0" size={18} />}
                                    <p className="font-bold text-xs tracking-tight">{message.text}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                                <CompactInput
                                    label="Administrative Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    icon={User}
                                    required
                                />
                                <CompactInput
                                    label="Platform Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={Mail}
                                    required
                                    type="email"
                                />
                            </div>

                            <div className="h-px bg-slate-50 w-full"></div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                    <Lock size={12} /> Security Protocol
                                </h3>
                                <div className="max-w-md">
                                    <CompactInput
                                        label="Verify Credentials"
                                        placeholder="Enter current password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        icon={Shield}
                                        type="password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                                    <CompactInput
                                        label="New Credentials"
                                        placeholder="New system password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        icon={Lock}
                                        type="password"
                                    />
                                    <CompactInput
                                        label="Confirm New Credentials"
                                        placeholder="Repeat for confirmation"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        icon={Lock}
                                        type="password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
                                >
                                    {saving ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {saving ? 'UPDATING...' : 'COMMIT CHANGES'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CompactCommandCard({ href, icon: Icon, title, description, color }: any) {
    const colors: any = {
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
        slate: 'bg-slate-50 text-slate-900 group-hover:bg-slate-900',
        teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600'
    };

    return (
        <div className="bg-white rounded-3xl p-5 lg:p-6 border border-slate-100 shadow-lg shadow-slate-200/40 group hover:border-emerald-500/20 transition-all">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all transform group-hover:scale-105 shadow-sm group-hover:text-white ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] text-slate-500 font-medium mb-5 leading-snug">{description}</p>
            <Link href={href} className="inline-flex items-center gap-1.5 font-black text-emerald-600 text-[9px] hover:gap-2.5 transition-all uppercase tracking-widest">
                EXECUTE <ArrowRight size={10} />
            </Link>
        </div>
    );
}

function CompactInput({ label, name, value, onChange, icon: Icon, required, type = 'text', placeholder }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-emerald-500 transition-colors">
                    <Icon size={16} />
                </div>
                <input
                    required={required}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 outline-none transition-all placeholder:text-slate-300"
                />
            </div>
        </div>
    );
}
