'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { staffService, StaffProfile } from '@/services/staffService';
import { authService } from '@/services/authService';
import { User, Phone, LogOut, Shield, Mail, Calendar, Edit2, Check, X, UserCircle, AlertCircle } from 'lucide-react';
import { staffProfileUpdateSchema } from '@/lib/validations/staff';
import { z } from 'zod';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<StaffProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    
    // Edit state
    const [editData, setEditData] = useState({
        fullName: '',
        phoneNumber: '',
        gender: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await staffService.getProfile();
            // Backend returns { statusCode, message, data }
            const profileData = response.data || response;
            setProfile(profileData);
            setEditData({
                fullName: profileData.fullName || profileData.name || '',
                phoneNumber: profileData.phoneNumber || '',
                gender: profileData.gender || ''
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        router.push('/auth/login');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        
        try {
            setUpdating(true);
            setError('');
            setFieldErrors({});
            
            // Validate with Zod
            const validatedData = staffProfileUpdateSchema.parse({
                fullName: editData.fullName?.trim(),
                phoneNumber: editData.phoneNumber?.trim(),
                gender: editData.gender || undefined
            });
            
            // Sanitize: only send fields that have values
            const sanitizedData: any = {};
            if (validatedData.fullName) sanitizedData.fullName = validatedData.fullName;
            if (validatedData.phoneNumber) sanitizedData.phoneNumber = validatedData.phoneNumber;
            if (validatedData.gender) sanitizedData.gender = validatedData.gender;

            await staffService.updateProfile(sanitizedData);
            await fetchProfile(); // Refresh profile
            setIsEditing(false);
        } catch (err: any) {
            console.error('Update failed:', err);
            
            // Handle Zod validation errors
            if (err instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                err.issues.forEach(issue => {
                    if (issue.path.length > 0) {
                        errors[issue.path[0] as string] = issue.message;
                    }
                });
                setFieldErrors(errors);
                setError('Please fix the errors below.');
            } else {
                const msg = err.response?.data?.message || 'Failed to update profile.';
                setError(Array.isArray(msg) ? msg.join(', ') : msg);
            }
        } finally {
            setUpdating(false);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-xl mx-auto p-8 text-center text-red-500">
                {error || 'Failed to load profile.'}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 relative z-10">
            {/* Error Alert */}
            {error && (
                <div className="alert alert-error rounded-2xl">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}
            
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 relative z-30">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Account</h1>
                    <p className="text-slate-500 font-medium text-sm">System credentials & preferences</p>
                </div>
                <div className="flex gap-2 relative z-50 pointer-events-auto">
                    {!isEditing ? (
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="btn btn-sm bg-white border-slate-200 text-slate-700 rounded-xl px-4 hover:bg-slate-50 transition-all font-bold shadow-sm cursor-pointer"
                        >
                            <Edit2 className="w-4 h-4 mr-2"/> Edit Profile
                        </button>
                    ) : (
                        <>
                            <button 
                                type="submit"
                                form="profile-form"
                                disabled={updating}
                                className="btn btn-sm bg-emerald-600 border-none text-white rounded-xl px-4 hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-600/20"
                            >
                                {updating ? <span className="loading loading-spinner loading-xs"></span> : <Check className="w-4 h-4 mr-2"/>} Save Changes
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-sm bg-slate-100 border-none text-slate-500 rounded-xl px-4 hover:bg-slate-200 transition-all font-bold"
                            >
                                <X className="w-4 h-4 mr-2"/> Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Identity Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="h-24 bg-emerald-600 relative">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                        </div>
                        <div className="px-6 pb-8 -mt-12 text-center relative z-20">
                            <div className="mx-auto w-24 h-24 rounded-2xl ring-8 ring-white bg-emerald-500 text-white text-4xl font-black flex items-center justify-center shadow-xl">
                                {profile.fullName.charAt(0)}
                            </div>
                            <div className="mt-4 space-y-1">
                                <h2 className="text-xl font-black text-slate-900 leading-tight">{profile.fullName}</h2>
                                <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">{profile.position}</p>
                            </div>
                            <div className="mt-6 flex flex-col gap-2">
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-sm bg-slate-900 border-none hover:bg-red-600 text-white rounded-xl w-full font-bold transition-colors group"
                                >
                                    <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"/> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    <form id="profile-form" onSubmit={handleUpdateProfile} className="card bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                                <UserCircle className="w-6 h-6 text-emerald-600"/>
                                <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            className="input input-md w-full bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/10 transition-all rounded-xl font-bold h-12" 
                                            value={editData.fullName}
                                            onChange={e => setEditData({...editData, fullName: e.target.value})}
                                            required
                                        />
                                    ) : (
                                        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                            <p className="font-bold text-slate-700">{profile.fullName}</p>
                                        </div>
                                    )}
                                    {fieldErrors.fullName && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {fieldErrors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50 opacity-70">
                                        <p className="font-bold text-slate-700">{profile.user.email}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                                    {isEditing ? (
                                        <input 
                                            type="tel" 
                                            className="input input-md w-full bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/10 transition-all rounded-xl font-bold h-12" 
                                            value={editData.phoneNumber}
                                            onChange={e => setEditData({...editData, phoneNumber: e.target.value})}
                                            placeholder="+880 1XXX-XXXXXX"
                                        />
                                    ) : (
                                        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                            <p className="font-bold text-slate-700">{profile.phoneNumber || '--'}</p>
                                        </div>
                                    )}
                                    {fieldErrors.phoneNumber && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {fieldErrors.phoneNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gender Identity</label>
                                    {isEditing ? (
                                        <select 
                                            className="select select-md w-full bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/10 transition-all rounded-xl font-bold h-12" 
                                            value={editData.gender}
                                            onChange={e => setEditData({...editData, gender: e.target.value})}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    ) : (
                                        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                            <p className="font-bold text-slate-700 capitalize">{profile.gender?.toLowerCase() || 'Unspecified'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                    <Shield className="w-3 h-3"/> Secured Account
                                </div>
                                <div className="text-slate-300 text-[10px] font-bold">
                                    Last Access: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

