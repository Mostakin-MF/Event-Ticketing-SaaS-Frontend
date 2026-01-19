"use client";

import React, { useState } from 'react';
import { X, Loader2, Building2, Globe, Palette, ShieldCheck, Zap } from 'lucide-react';
import { adminService } from '@/services/adminService';

interface CreateTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateTenantModal({ isOpen, onClose, onSuccess }: CreateTenantModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        primaryColor: '#10b981', // Default emerald
        status: 'active'
    });

    const handleNameChange = (name: string) => {
        // Auto-generate slug from name if slug hasn't been manually edited or is empty
        const suggestedSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') ? suggestedSlug : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await adminService.createTenant({
                name: formData.name,
                slug: formData.slug,
                status: formData.status,
                brandingSettings: {
                    primaryColor: formData.primaryColor
                }
            });

            onSuccess();
            onClose();
            // Reset form
            setFormData({ name: '', slug: '', primaryColor: '#10b981', status: 'active' });
        } catch (error: any) {
            console.error("Failed to onboard tenant", error);
            alert(error.response?.data?.message || "Failed to onboard organization");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#022c22]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-emerald-100">

                {/* Header */}
                <div className="bg-[#022c22] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Onboard Organization</h3>
                                <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em]">Provisioning New Environment</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-emerald-100/60 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                <Building2 size={12} /> Org Name
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-6 py-4 rounded-[1.25rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm placeholder:text-slate-300"
                                placeholder="e.g. Techno Fest 2026"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                <Globe size={12} /> Network Slug
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">@</span>
                                <input
                                    required
                                    type="text"
                                    pattern="^[a-z0-9-]+$"
                                    className="w-full pl-10 pr-6 py-4 rounded-[1.25rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm placeholder:text-slate-300"
                                    placeholder="techno-fest"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status Selection */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                <ShieldCheck size={12} /> Operational State
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['active', 'pending', 'suspended'].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s })}
                                        className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.status === s
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                <Palette size={12} /> Signature Branding
                            </label>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-2xl border-4 border-slate-50 shadow-inner shrink-0"
                                    style={{ backgroundColor: formData.primaryColor }}
                                ></div>
                                <input
                                    type="color"
                                    className="h-10 w-full rounded-xl bg-slate-50 border border-slate-100 p-1 cursor-pointer"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-[1.25rem] font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Abort Deployment
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-4 rounded-[1.25rem] bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-70 flex items-center justify-center gap-3 active:scale-95 group"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Zap size={16} className="fill-current group-hover:scale-125 transition-transform" />
                            )}
                            Initialize Environment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
