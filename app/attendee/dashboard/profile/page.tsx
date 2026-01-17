'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, LogOut, Shield, Calendar, Globe, MapPin } from 'lucide-react';
import { authService } from '@/services/authService';
import { attendeeService } from '@/services/attendeeService';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
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

    const handleSave = async () => {
        try {
            setLoading(true);
            
            // 1. Update User Details (Name)
            if (formData.fullName !== user.name) {
                 await attendeeService.updateProfile({ fullName: formData.fullName } as any);
            }

            // 2. Update Profile Details
            await attendeeService.updateFullProfile({
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                country: formData.country,
                city: formData.city
            });
            
            // Update local state
            setUser({ ...user, name: formData.fullName, ...formData });
            setIsEditing(false);
        } catch (e) {
            console.error("Update failed", e);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-dots loading-lg text-emerald-600"></span></div>;

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
             <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your account settings.</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm">Edit Profile</button>
                )}
            </header>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 h-32 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-slate-900 opacity-80"></div>
                </div>
                
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg">
                             <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-4xl font-bold text-emerald-600">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User />}
                             </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="text-2xl font-bold text-slate-900 border-b border-slate-300 focus:border-emerald-500 outline-none w-full"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                            )}
                            <span className="badge badge-accent font-bold mt-2 capitalize">{user.role || 'Attendee'}</span>
                        </div>

                        <div className="grid gap-4">
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <Mail className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                                    <p className="text-slate-700 font-medium">{user.email}</p>
                                </div>
                             </div>

                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Phone Number</p>
                                    {isEditing ? (
                                        <input 
                                            type="tel" 
                                            value={formData.phoneNumber}
                                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                            placeholder="Enter phone number"
                                            className="bg-transparent border-b border-slate-300 focus:border-emerald-500 outline-none w-full text-slate-700 font-medium"
                                        />
                                    ) : (
                                        <p className={`font-medium ${user.phoneNumber ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                                            {user.phoneNumber || 'Not set'}
                                        </p>
                                    )}
                                </div>
                             </div>

                             {/* Additional Fields Grid */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date of Birth */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase">Date of Birth</p>
                                        {isEditing ? (
                                            <input 
                                                type="date" 
                                                value={formData.dateOfBirth}
                                                onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                                                className="bg-transparent border-b border-slate-300 focus:border-emerald-500 outline-none w-full text-slate-700 font-medium"
                                            />
                                        ) : (
                                            <p className={`font-medium ${user.dateOfBirth ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                                                {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <User className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase">Gender</p>
                                        {isEditing ? (
                                             <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                                className="bg-transparent border-b border-slate-300 focus:border-emerald-500 outline-none w-full text-slate-700 font-medium"
                                            >
                                                <option value="">Select</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        ) : (
                                            <p className={`font-medium ${user.gender ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                                                {user.gender || 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <Globe className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase">Country</p>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.country}
                                                onChange={e => setFormData({...formData, country: e.target.value})}
                                                placeholder="Country"
                                                className="bg-transparent border-b border-slate-300 focus:border-emerald-500 outline-none w-full text-slate-700 font-medium"
                                            />
                                        ) : (
                                            <p className={`font-medium ${user.country ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                                                {user.country || 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* City */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase">City</p>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.city}
                                                onChange={e => setFormData({...formData, city: e.target.value})}
                                                placeholder="City"
                                                className="bg-transparent border-b border-slate-300 focus:border-emerald-500 outline-none w-full text-slate-700 font-medium"
                                            />
                                        ) : (
                                            <p className={`font-medium ${user.city ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                                                {user.city || 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                             {isEditing ? (
                                 <div className="flex gap-4">
                                     <button onClick={handleSave} className="flex-1 btn btn-primary font-bold rounded-xl">Save Changes</button>
                                     <button onClick={() => setIsEditing(false)} className="flex-1 btn btn-ghost font-bold rounded-xl">Cancel</button>
                                 </div>
                             ) : (
                                 <button onClick={handleLogout} className="btn btn-error btn-outline w-full gap-2 font-bold rounded-xl">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                 </button>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
