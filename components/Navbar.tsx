"use client";

import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "py-4" : "py-6"
                }`}
        >
            <div className="mx-auto max-w-7xl px-6">
                <div
                    className={`relative flex items-center justify-between rounded-full border px-6 py-3 transition-all duration-500 ${scrolled
                        ? "bg-white/80 border-slate-200 backdrop-blur-xl shadow-lg shadow-slate-200/50"
                        : "bg-transparent border-transparent backdrop-blur-none"
                        }`}
                >
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group relative z-10">
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-sans text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                            TicketBD
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className={`hidden items-center gap-1 rounded-full px-2 py-1 border backdrop-blur-2xl lg:flex absolute left-1/2 -translate-x-1/2 transition-colors duration-500 ${scrolled ? "bg-slate-100/50 border-slate-200" : "bg-white/60 border-white/20 shadow-sm"
                        }`}>
                        <NavLink href="/#features">Product</NavLink>
                        <NavLink href="/pricing">Pricing</NavLink>
                        <NavLink href="/about">Mission</NavLink>
                        <NavLink href="/resources">Changelog</NavLink>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 relative z-10">
                        <Link
                            href="/auth/login"
                            className="hidden text-xs font-bold text-slate-600 transition-colors hover:text-slate-900 sm:block"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/admin"
                            className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 text-xs font-black uppercase tracking-wider text-white transition-transform hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20"
                        >
                            Get Access
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="text-slate-900 lg:hidden hover:text-emerald-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute top-24 left-6 right-6 rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl backdrop-blur-3xl lg:hidden animate-in slide-in-from-top-4 fade-in duration-200">
                        <div className="flex flex-col gap-6">
                            <MobileNavLink href="/#features" onClick={() => setMobileMenuOpen(false)}>Product</MobileNavLink>
                            <MobileNavLink href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
                            <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>Mission</MobileNavLink>
                            <MobileNavLink href="/resources" onClick={() => setMobileMenuOpen(false)}>Changelog</MobileNavLink>
                            <hr className="border-slate-200" />
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/auth/login"
                                    className="w-full rounded-xl bg-slate-100 py-3 text-center text-sm font-bold text-slate-900 hover:bg-slate-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/admin"
                                    className="w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="rounded-full px-4 py-2 text-xs font-medium text-slate-600 transition-all hover:bg-slate-200/50 hover:text-slate-900"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode, onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-lg font-medium text-slate-900 hover:text-emerald-600"
        >
            {children}
        </Link>
    );
}
