"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#030712] pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-12 lg:grid-cols-6 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-lg font-bold text-white">TicketBD</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                            The new standard for event ticketing in Bangladesh. Engineered for speed, designed for scale.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            All systems operational
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-1">
                        <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><FooterLink href="/#features">Features</FooterLink></li>
                            <li><FooterLink href="/pricing">Pricing</FooterLink></li>
                            <li><FooterLink href="/resources">Changelog</FooterLink></li>
                            <li><FooterLink href="/admin">Integration</FooterLink></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1">
                        <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><FooterLink href="/about">About</FooterLink></li>
                            <li><FooterLink href="/about">Careers</FooterLink></li>
                            <li><FooterLink href="/about">Contact</FooterLink></li>
                            <li><FooterLink href="/privacy">Privacy</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter - Minimal */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-white mb-4">Stay updated</h4>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                            />
                            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} TicketBD Inc. Dhaka, Bangladesh.
                    </p>
                    <div className="flex gap-6">
                        <SocialLink href="twitter" label="Twitter" />
                        <SocialLink href="github" label="GitHub" />
                        <SocialLink href="discord" label="Discord" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors block">
            {children}
        </Link>
    );
}

function SocialLink({ href, label }: { href: string, label: string }) {
    return (
        <a href={`#${href}`} className="text-xs font-medium text-slate-500 hover:text-emerald-400 transition-colors">
            {label}
        </a>
    );
}
