'use client';

import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, Shield, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        if (formData.password.length < 8) {
            setStatus({ type: 'error', message: 'Password must be at least 8 characters' });
            return;
        }

        setLoading(true);
        setStatus({ type: 'idle', message: '' });

        try {
            await adminService.createUser({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                isPlatformAdmin: true,
            });

            setStatus({ type: 'success', message: 'Admin account created successfully!' });

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/admin/users');
            }, 2000);
        } catch (error: any) {
            console.error('Failed to create admin', error);
            const errorMessage = error.response?.data?.message || 'Failed to create admin account';
            setStatus({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
            {/* COMPACT COMMAND HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <Link
                        href="/admin/users"
                        className="group w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <UserPlus size={10} fill="currentColor" /> Recruitment
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase">Provision Admin</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            Onboard a new platform executive. This user will inherit full system authority and governing permissions.
                        </p>
                    </div>
                </div>
            </div>

            {/* MAIN FORM CONTAINER */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#022c22]"></div>

                <div className="p-6 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-14">
                    {/* Role Briefing Sidebar */}
                    <div className="lg:w-72 shrink-0 space-y-6">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 inline-block">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Authority Briefing</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Admins hold global control over TicketBD environments. Please verify the identity before provisioning.
                        </p>

                        <div className="space-y-3">
                            <PermissionItem label="Full System Access" />
                            <PermissionItem label="User Data Controls" />
                            <PermissionItem label="Financial Oversight" />
                            <PermissionItem label="Tenant Management" />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <AlertCircle size={16} className="text-emerald-500 shrink-0" />
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">Passwords must be complex and contain at least 8 characters.</p>
                        </div>
                    </div>

                    {/* Actual Form */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {status.type !== 'idle' && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-400 shadow-sm border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                                    <p className="font-bold text-xs tracking-tight">{status.message}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CompactInput
                                    label="Full Executive Name"
                                    placeholder="Enter full name"
                                    icon={User}
                                    value={formData.fullName}
                                    onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                                <CompactInput
                                    label="System Email Address"
                                    placeholder="admin@ticketbd.com"
                                    icon={Mail}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="h-px bg-slate-50 w-full"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CompactInput
                                    label="Security Password"
                                    placeholder="Minimum 8 characters"
                                    icon={Lock}
                                    type="password"
                                    value={formData.password}
                                    onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <CompactInput
                                    label="Confirm Credentials"
                                    placeholder="Re-enter password"
                                    icon={Lock}
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
                                <Link
                                    href="/admin/users"
                                    className="px-8 py-3.5 border border-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all text-center"
                                >
                                    Abort Process
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <UserPlus size={18} />
                                    )}
                                    {loading ? 'PROVISIONING...' : 'CONFIRM PROVISIONING'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// SHARED COMPACT COMPONENTS

function CompactInput({ label, value, onChange, type = 'text', placeholder, icon: Icon, required }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">{label} {required && '*'}</label>
            <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-emerald-500 transition-colors">
                    {Icon && <Icon size={18} />}
                </div>
                <input
                    required={required}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-5 text-[13px] font-bold focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
                />
            </div>
        </div>
    );
}

function PermissionItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            {label}
        </div>
    );
}
