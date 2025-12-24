"use client";

import Link from "next/link";
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-12 lg:grid-cols-4 mb-16">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                <Ticket className="text-white" size={22} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-900 italic">TicketBD</span>
                        </Link>
                        <p className="text-slate-500 text-sm italic leading-relaxed">
                            Bangladesh's leading multi-tenant event ticketing platform. Designed for reliability, speed, and local growth.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={<Facebook size={18} />} href="#" />
                            <SocialLink icon={<Twitter size={18} />} href="#" />
                            <SocialLink icon={<Instagram size={18} />} href="#" />
                            <SocialLink icon={<Linkedin size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 italic">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="/#features">Platform Features</FooterLink></li>
                            <li><FooterLink href="/pricing">Pricing Plans</FooterLink></li>
                            <li><FooterLink href="/about">Our Story</FooterLink></li>
                            <li><FooterLink href="/resources">Organizer Resources</FooterLink></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 italic">Support</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-500 text-sm italic">
                                <Mail size={16} className="text-primary" />
                                support@ticketbd.com
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 text-sm italic">
                                <Phone size={16} className="text-primary" />
                                +880 1XXX XXXXXX
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 text-sm italic">
                                <MapPin size={16} className="text-primary" />
                                Dhaka, Bangladesh (BST)
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 italic">Stay Updated</h4>
                        <p className="text-slate-500 text-sm italic mb-4 leading-relaxed">
                            Get the latest event management tips and updates.
                        </p>
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 text-sm"
                            />
                            <button className="btn btn-primary w-full rounded-xl">Subscribe</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-400 text-xs italic">
                        &copy; {new Date().getFullYear()} TicketBD. Developed with ❤️ for Bangladesh.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-xs italic">Privacy Policy</Link>
                        <Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-xs italic">Terms of Service</Link>
                        <Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-xs italic">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-slate-500 hover:text-primary transition-colors text-sm italic flex items-center gap-2 group">
            <span className="h-1 w-1 rounded-full bg-slate-300 group-hover:bg-primary transition-colors"></span>
            {children}
        </Link>
    );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a href={href} className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
            {icon}
        </a>
    );
}
