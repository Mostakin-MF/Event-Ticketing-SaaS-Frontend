'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function AttendeeLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(email, password);
            const user = response.user;
            
            if (user.role !== 'attendee') {
                throw new Error('This login is for attendees only.');
            }

            setSuccess(true);

            setTimeout(() => {
                // Redirect to returnUrl if provided, otherwise to attendee dashboard
                if (returnUrl) {
                    router.push(returnUrl);
                } else {
                    router.push('/attendee'); 
                }
            }, 800);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Invalid credentials.');
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

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Sign in to access your tickets and events.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <div className={`flex items-center border rounded-xl px-3 py-3 transition-all ${focusedInput === 'email' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50'}`}>
                                <Mail className="text-slate-500 w-5 h-5 mr-3" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                             <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <Link href="#" className="text-xs text-emerald-500 font-bold hover:text-emerald-400 transition-colors">Forgot password?</Link>
                            </div>
                            <div className={`flex items-center border rounded-xl px-3 py-3 transition-all ${focusedInput === 'password' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50'}`}>
                                <Lock className="text-slate-500 w-5 h-5 mr-3" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : success ? (
                                <span>Redirecting...</span>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                 <div className="text-center mt-6">
                    <p className="text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link href="/attendee/auth/signup" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
