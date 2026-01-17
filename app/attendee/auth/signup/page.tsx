'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { Mail, Lock, Loader2, ArrowRight, User as UserIcon, Ticket, ShieldCheck, Phone, Calendar, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AttendeeSignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            await authService.registerAttendee({ 
                email, 
                password, 
                fullName: name,
                phoneNumber: phone,
                dateOfBirth: dob,
                gender: gender,
                country: country,
                city: city
            });
            setSuccess(true);

            setTimeout(() => {
                router.push('/attendee');
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 font-sans relative overflow-hidden">
             {/* Ambient Background */}
             <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
                    
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400 text-sm">Join to book tickets and manage your events.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                <UserIcon className="text-slate-500 w-5 h-5 mr-3" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                <Mail className="text-slate-500 w-5 h-5 mr-3" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                            <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                <Phone className="text-slate-500 w-5 h-5 mr-3" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                    placeholder="+880 1XXX XXXXXX"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             {/* Date of Birth */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date of Birth</label>
                                <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                    <Calendar className="text-slate-500 w-5 h-5 mr-3" />
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                             {/* Gender */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                                <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                    <UserIcon className="text-slate-500 w-5 h-5 mr-3" />
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium [&>option]:text-black"
                                    >
                                        <option value="">Select</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Country */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Country</label>
                                <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                    <Globe className="text-slate-500 w-5 h-5 mr-3" />
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                             {/* City */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">City</label>
                                <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                    <MapPin className="text-slate-500 w-5 h-5 mr-3" />
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                        placeholder="City"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="flex items-center border border-slate-800 bg-slate-950/50 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:bg-emerald-500/5 transition-all">
                                <Lock className="text-slate-500 w-5 h-5 mr-3" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full mt-2 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : success ? (
                                <span>Success! Redirecting...</span>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                     <div className="text-center mt-6">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/attendee/auth/login" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
