"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Ticket, Mail, Lock, User, Building2, ArrowRight, ArrowLeft, Key, CheckCircle2, AlertCircle, Phone, Briefcase } from 'lucide-react';
import { registerAdmin } from '../../actions/auth-actions';
import { useRouter } from 'next/navigation';

export default function AdminRegisterPage() {
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setStatus({ type: 'loading', message: 'Creating account...' });
        setFieldErrors({});

        const result = await registerAdmin(formData);

        if (result.success) {
            setStatus({ type: 'success', message: result.message });
            setTimeout(() => router.push('/admin'), 2000);
        } else {
            setStatus({ type: 'error', message: result.message });
            if (result.errors) {
                setFieldErrors(result.errors);
            }
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-8">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 group-hover:rotate-6 transition-transform duration-300">
                        <Ticket className="text-white" size={28} />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-2xl font-black tracking-tighter text-slate-950 italic">TicketBD</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Admin Portal</span>
                    </div>
                </Link>
            </div>

            <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-12 border border-slate-100 max-w-lg mx-auto">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-4">
                        <ArrowLeft size={14} />
                        Back to Login
                    </Link>
                    <h2 className="text-2xl font-black text-slate-950 italic mb-2">Platform Admin Registration</h2>
                    <p className="text-slate-500 text-sm">Join the control center of TicketBD ticketing platform.</p>
                </div>

                {status.type !== 'idle' && (
                    <div className={`mb-8 p-5 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        status.type === 'loading' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {status.type === 'success' && <div className="mt-0.5"><CheckCircle2 size={18} className="shrink-0" /></div>}
                        {status.type === 'error' && <div className="mt-0.5"><AlertCircle size={18} className="shrink-0" /></div>}
                        {status.type === 'loading' && <div className="mt-0.5"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" /></div>}
                        <p className="text-sm font-medium leading-relaxed">{status.message}</p>
                    </div>
                )}

                <form className="space-y-5" action={handleSubmit}>
                    <div>
                        <label htmlFor="full_name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                placeholder="e.g. Abdullah Al Mamun"
                                className={`block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors.full_name ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                        </div>
                        {fieldErrors.full_name && (
                            <p className="mt-1.5 text-xs font-semibold text-red-500 uppercase tracking-tight italic">
                                {fieldErrors.full_name[0]}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Admin Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="admin@ticketbd.com"
                                    className={`block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500 uppercase tracking-tight italic">
                                    {fieldErrors.email[0]}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phone_number" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Phone size={18} />
                                </div>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    required
                                    placeholder="+880 1XXX-XXXXXX"
                                    className={`block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors.phone_number ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                />
                            </div>
                            {fieldErrors.phone_number && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500 uppercase tracking-tight italic">
                                    {fieldErrors.phone_number[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="designation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Designation / Role
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <Briefcase size={18} />
                            </div>
                            <input
                                id="designation"
                                name="designation"
                                type="text"
                                required
                                placeholder="e.g. Platform Administrator, Support Lead"
                                className={`block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors.designation ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                        </div>
                        {fieldErrors.designation && (
                            <p className="mt-1.5 text-xs font-semibold text-red-500 uppercase tracking-tight italic">
                                {fieldErrors.designation[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className={`block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                        </div>
                        {fieldErrors.password && (
                            <p className="mt-1.5 text-xs font-semibold text-red-500 uppercase tracking-tight italic">
                                {fieldErrors.password[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="registration_token" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Registration Token
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <Key size={18} />
                            </div>
                            <input
                                id="registration_token"
                                name="registration_token"
                                type="text"
                                required
                                placeholder="Enter token from platform admin"
                                className={`block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors.registration_token ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                            />
                        </div>
                        {fieldErrors.registration_token && (
                            <p className="mt-1.5 text-xs font-semibold text-red-500 uppercase tracking-tight italic">
                                {fieldErrors.registration_token[0]}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={status.type === 'loading'}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status.type === 'loading' ? "Creating Account..." : "Register Platform Admin"}
                            {status.type !== 'loading' && <ArrowRight size={18} />}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs text-slate-500 text-center px-4 leading-relaxed">
                    By registering, you agree to our <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>.
                </p>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 italic">
                &copy; {new Date().getFullYear()} TicketBD. Made with ❤️ for organizers.
            </p>
        </div>
    );
}
