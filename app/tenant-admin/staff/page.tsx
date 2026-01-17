'use client';

import React, { useEffect, useState } from 'react';
import { tenantAdminService } from '@/services/tenantAdminService';
import { Mail, Plus, Shield, Trash2, User, MoreVertical, Search, ExternalLink, ShieldAlert, CheckCircle2, X, Loader2, Key, Info } from 'lucide-react';

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Invitation Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviting, setInviting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await tenantAdminService.getAllStaff();
            // Ensure data is an array
            const staffList = Array.isArray(data) ? data : (data as any).data || [];
            setStaff(staffList);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        setMessage(null);
        try {
            await tenantAdminService.inviteStaff(formData);
            setMessage({ type: 'success', text: 'Member invited successfully! An email has been sent.' });
            setFormData({ fullName: '', email: '', password: '' });
            fetchStaff();
            // Close modal after delay
            setTimeout(() => {
                setIsModalOpen(false);
                setMessage(null);
            }, 3000);
        } catch (error: any) {
            console.error('Invitation error details:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message
            });
            setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to invite member' });
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}? They will lose access immediately.`)) return;

        try {
            await tenantAdminService.removeStaff(id);
            fetchStaff();
        } catch (error) {
            console.error("Failed to remove staff", error);
            alert("Failed to remove member. Please try again.");
        }
    };

    const filteredStaff = staff.filter(member =>
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto p-2 sm:p-4 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500 relative">
            {/* Header Area */}
            <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Team Access</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{staff.length} Active Members</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search team..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Staff Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-64 bg-white rounded-[2rem] border border-slate-100 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 border-dashed">
                    <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <User className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No team members found</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your search or invite someone new.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {filteredStaff.map((member) => (
                        <div
                            key={member.id || member.user_id}
                            className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-100 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Role Badge - Floating */}
                            <div className="absolute top-4 left-4">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600`}>
                                    <Shield size={10} strokeWidth={3} />
                                    {member.role || 'Staff'}
                                </span>
                            </div>

                            <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-900 transition-colors z-10">
                                <MoreVertical size={18} />
                            </button>

                            <div className="mt-8 mb-4 relative">
                                <div className="w-20 h-20 rounded-full bg-slate-50 p-1 ring-1 ring-slate-100 group-hover:ring-emerald-100 transition-all overflow-hidden">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors shadow-inner">
                                        <User size={40} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full p-0.5 shadow-sm border border-slate-50">
                                    <div className={`w-full h-full rounded-full ${member.status !== 'inactive' ? 'bg-emerald-500' : 'bg-slate-300'} ring-2 ring-white animate-pulse`}></div>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="font-black text-slate-900 decoration-emerald-500/30 group-hover:underline underline-offset-4 decoration-2 transition-all">{member.fullName}</h3>
                                <div className="flex items-center justify-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wide group-hover:text-slate-500 transition-colors">
                                    <Mail size={10} />
                                    {member.email}
                                </div>
                            </div>

                            <div className="w-full mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                                <button className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                                    View Profile
                                    <ExternalLink size={12} />
                                </button>
                                <button
                                    onClick={() => handleRemove(member.id || member.user_id, member.fullName)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !inviting && setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-slate-100">
                        {/* Modal Header */}
                        <div className="bg-emerald-600 p-8 text-white relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-all"
                                disabled={inviting}
                            >
                                <X size={20} />
                            </button>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white">
                                <Plus size={28} strokeWidth={3} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Invite Member</h2>
                            <p className="text-white/70 text-sm font-medium">Add a new team member to your organization.</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            <form onSubmit={handleInvite} className="space-y-4">
                                {message && (
                                    <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
                                        <p className="text-sm font-bold">{message.text}</p>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                            <User size={16} />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
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
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporary Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                            <Key size={16} />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            minLength={8}
                                            placeholder="Min. 8 characters"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-3">
                                    <div className="p-3 bg-amber-50 rounded-xl">
                                        <Info size={16} className="text-amber-600" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 leading-tight">
                                        The user will receive an email with their credentials and will be assigned the 'Staff' role automatically.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all text-sm"
                                        disabled={inviting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 bg-emerald-600 hover:bg-black text-white rounded-2xl font-bold transition-all text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
                                        disabled={inviting}
                                    >
                                        {inviting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Invitation
                                                <CheckCircle2 size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

