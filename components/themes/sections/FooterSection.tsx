'use client';

import { Facebook, Twitter, Instagram, Ticket } from 'lucide-react';

interface FooterProps {
    tenant: any;
    colors: any;
    fonts: any;
}

export default function FooterSection({ tenant, colors, fonts }: FooterProps) {
    return (
        <footer className="py-20 px-6 border-t border-white/10 bg-slate-950" style={{ fontFamily: fonts.body }}>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                                <Ticket className="text-emerald-500" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: fonts.heading }}>
                                {tenant.name}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Building better event experiences for everyone. Join us for our upcoming events and be part of the community.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Facebook size={18} /></a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Twitter size={18} /></a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Instagram size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Event Info</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Safety Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Support</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ticket Support</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Venue Info</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Stay Updated</h4>
                        <p className="text-sm text-slate-500 mb-6">Get notified about upcoming events and special offers.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 flex-1"
                            />
                            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm">Join</button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-bold uppercase tracking-widest">
                    <p>© 2026 {tenant.name}. All rights reserved.</p>
                    <p>Powered by TicketBD Engine</p>
                </div>
            </div>
        </footer>
    );
}
