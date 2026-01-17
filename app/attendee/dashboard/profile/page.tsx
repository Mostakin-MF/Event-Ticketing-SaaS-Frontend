'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, LogOut, Shield, Calendar, Globe, MapPin, Edit2, Check, X } from 'lucide-react';
import { authService } from '@/services/authService';
import { attendeeService } from '@/services/attendeeService';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({ 
        fullName: '',
        phoneNumber: '', 
        dateOfBirth: '', 
        gender: '', 
        country: '', 
        city: '' 
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch full profile which includes user details
                const profileData = await attendeeService.getFullProfile();
                // Normalize data
                const userData = {
                    name: profileData.data.fullName,
                    email: profileData.data.email,
                    role: 'attendee',
                    ...profileData.data // Spread attendee specific fields
                };
                setUser(userData);
                setFormData({ 
                    fullName: userData.name || '',
                    phoneNumber: userData.phoneNumber || '',
                    dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
                    gender: userData.gender || '',
                    country: userData.country || '',
                    city: userData.city || ''
                });
            } catch (err) {
                console.error("Failed to load profile", err);
                // Fallback to auth check if full profile fails (e.g. new user)
                try {
                     const basicUser = await authService.checkAuth();
                     setUser(basicUser);
                     setFormData(prev => ({ ...prev, fullName: basicUser.name || '' }));
                } catch (e) {
                     router.push('/attendee/auth/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        await authService.logout();
        router.push('/attendee/auth/login');
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            setLoading(true);
            
            // 1. Consolidated Update with data sanitization
            const payload: any = {
                fullName: formData.fullName,
            };

            if (formData.phoneNumber) payload.phoneNumber = formData.phoneNumber;
            if (formData.gender) payload.gender = formData.gender;
            if (formData.country) payload.country = formData.country;
            if (formData.city) payload.city = formData.city;
            if (formData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;

            await attendeeService.updateFullProfile(payload);
            
            // Update local state
            setUser({ ...user, name: formData.fullName, ...formData });
            setSuccessMessage("Profile updated successfully");
            setIsEditing(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e: any) {
            console.error("Update failed", e);
            const msg = e.response?.data?.message || "Failed to update profile";
            setError(Array.isArray(msg) ? msg.join(', ') : msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-dots loading-lg text-emerald-600"></span></div>;

    if (!user) return null;

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
                    {!isEditing && (
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="btn btn-sm btn-ghost text-emerald-600 hover:bg-emerald-50 font-bold"
                        >
                            <Edit2 className="w-4 h-4 mr-2"/> Edit
                        </button>
                    )}
                </div>

                {/* Content - Scrollable only if needed inside card, but kept compact */}
                <form id="profile-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Avatar & Name */}
                    <div className="flex flex-col items-center">
                         <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-emerald-600 mb-3">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User />}
                         </div>
                         {isEditing ? (
                             <input 
                                 type="text" 
                                 value={formData.fullName}
                                 onChange={e => setFormData({...formData, fullName: e.target.value})}
                                 className="text-lg font-bold text-center text-slate-900 border-b border-slate-200 focus:border-emerald-500 outline-none w-full bg-transparent pb-1"
                                 placeholder="Your Name"
                             />
                         ) : (
                             <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                         )}
                         <span className="text-xs font-medium text-slate-400 mt-1">{user.email}</span>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Phone</label>
                                 {isEditing ? (
                                     <input 
                                         type="tel"
                                         value={formData.phoneNumber}
                                         onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                         className="w-full text-sm font-medium text-slate-700 border-b border-slate-200 focus:border-emerald-500 outline-none py-1"
                                         placeholder="+880..."
                                     />
                                 ) : (
                                     <p className="text-sm font-medium text-slate-700">{user.phoneNumber || 'Not set'}</p>
                                 )}
                             </div>
                             <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                                 {isEditing ? (
                                     <select
                                         value={formData.gender}
                                         onChange={e => setFormData({...formData, gender: e.target.value})}
                                         className="w-full text-sm font-medium text-slate-700 border-b border-slate-200 focus:border-emerald-500 outline-none py-1 bg-transparent"
                                     >
                                        <option value="">Select</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                     </select>
                                 ) : (
                                     <p className="text-sm font-medium text-slate-700 capitalize">{user.gender?.toLowerCase() || 'Not set'}</p>
                                 )}
                             </div>
                             <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Birth Date</label>
                                 {isEditing ? (
                                     <input 
                                         type="date"
                                         value={formData.dateOfBirth}
                                         onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                                         className="w-full text-sm font-medium text-slate-700 border-b border-slate-200 focus:border-emerald-500 outline-none py-1 bg-transparent"
                                     />
                                 ) : (
                                     <p className="text-sm font-medium text-slate-700">
                                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}
                                     </p>
                                 )}
                             </div>
                             <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                                 {isEditing ? (
                                     <div className="flex gap-2">
                                         <input 
                                             type="text" 
                                             value={formData.city}
                                             onChange={e => setFormData({...formData, city: e.target.value})}
                                             placeholder="City"
                                             className="w-full text-sm font-medium text-slate-700 border-b border-slate-200 focus:border-emerald-500 outline-none py-1"
                                         />
                                     </div>
                                 ) : (
                                     <p className="text-sm font-medium text-slate-700">
                                         {[user.city, user.country].filter(Boolean).join(', ') || 'Not set'}
                                     </p>
                                 )}
                             </div>
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <button 
                                type="submit"
                                form="profile-form"
                                disabled={loading}
                                className="flex-1 btn btn-primary btn-sm rounded-xl font-bold"
                            >
                                {loading ? <span className="loading loading-spinner loading-xs"></span> : <Check className="w-4 h-4 mr-2"/>} Save Changes
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)} 
                                className="flex-1 btn btn-ghost btn-sm rounded-xl"
                            >
                                <X className="w-4 h-4 mr-2"/> Cancel
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm w-full rounded-xl gap-2">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
