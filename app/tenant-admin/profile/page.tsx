'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { User, Mail, Lock, Shield, CheckCircle2, AlertCircle, Loader2, Save, Camera, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
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
            } catch (error) {
                console.error("Failed to fetch profile", error);
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

        // Validation for password change
        if (formData.newPassword || formData.confirmPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'New passwords do not match' });
                setSaving(false);
                return;
            }
            if (!formData.currentPassword) {
                setMessage({ type: 'error', text: 'Current password is required to set a new one' });
                setSaving(false);
                return;
            }
        }

        try {
            const updatePayload: any = {
                fullName: formData.fullName,
                email: formData.email
            };

            if (formData.newPassword) {
                updatePayload.password = formData.newPassword;
                // Note: Backend updateUser hashes the password if provided
            }

            await authService.updateProfile(updatePayload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear passwords
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            // Refresh local user state if needed
            const updatedUser = await authService.checkAuth();
            setUser(updatedUser);

        } catch (error: any) {
            console.error("Failed to update profile", error);
            setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Manage your personal information and security</p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100">
                    <ShieldCheck className="text-emerald-600" size={20} />
                    <div>
                        <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Account Status</p>
                        <p className="text-xs font-bold text-emerald-600">Verified Admin</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-slate-50 p-1.5 ring-4 ring-slate-100 group-hover:ring-emerald-100 transition-all overflow-hidden mb-6">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors shadow-inner">
                                    <User size={64} strokeWidth={1.5} />
                                </div>
                            </div>
                            <button type="button" className="absolute bottom-6 right-0 p-2 bg-emerald-600 text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all">
                                <Camera size={16} />
                            </button>
                        </div>

                        <h2 className="text-xl font-black text-slate-900 line-clamp-1">{formData.fullName || 'User Name'}</h2>
                        <p className="text-sm text-slate-500 font-medium mb-6">{formData.email}</p>

                        <div className="w-full pt-6 border-t border-slate-50 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs px-2">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Access Level</span>
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter text-[10px]">
                                    {user?.role === 'platform_admin' ? 'System Administrator' : user?.role || 'User'}
                                </span>
                            </div>
                            {user?.tenantName && (
                                <div className="flex items-center justify-between text-xs px-2">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Organization</span>
                                    <span className="text-slate-900 font-bold truncate max-w-[120px]">{user.tenantName}</span>
                                </div>
                            )}
                            {user?.tenantRole && (
                                <div className="flex items-center justify-between text-xs px-2">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Internal Role</span>
                                    <span className="text-emerald-700 font-bold">{user.tenantRole}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-xs px-2">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">User ID</span>
                                <span className="text-slate-600 font-mono font-bold truncate max-w-[100px]">{user?.id || user?.sub?.substring(0, 8)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-xl text-amber-600 shrink-0">
                                <Shield size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Security Tip</h4>
                                <p className="text-xs text-amber-700/80 leading-relaxed font-medium">Use a strong, unique password with at least 12 characters, symbols, and numbers to keep your account safe.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Details */}
                <div className="lg:col-span-2 space-y-8">
                    {message && (
                        <div className={`p-5 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                            <p className="font-bold text-sm">{message.text}</p>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <User size={18} />
                                </div>
                                Basic Information
                            </h3>
                            <div className="mt-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                <User size={16} />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                <Mail size={16} />
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="pt-8 border-t border-slate-50">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <Lock size={18} />
                                </div>
                                Change Password
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-2 italic">Leave blank if you don't want to change your password.</p>

                            <div className="mt-8 space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            placeholder="••••••••"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                placeholder="••••••••"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-base shadow-2xl shadow-slate-900/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Updating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
