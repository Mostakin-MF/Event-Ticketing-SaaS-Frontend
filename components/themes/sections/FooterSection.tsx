'use client';

import { Facebook, Twitter, Instagram, Ticket, Linkedin } from 'lucide-react';

interface FooterProps {
    tenant: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
    content?: any;
}

export default function FooterSection({ tenant, colors, fonts, isLight, content }: FooterProps) {
    return (
        <footer className={`py-20 px-6 border-t ${isLight ? 'bg-white border-slate-100' : 'bg-slate-950 border-white/10'}`} style={{ fontFamily: fonts.body }}>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                <Ticket className="text-emerald-500" />
                            </div>
                            <span className={`text-2xl font-black tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`} style={{ fontFamily: fonts.heading }}>
                                {tenant.name}
                            </span>
                        </div>
                        <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                            {content?.description || 'Building better event experiences for everyone. Join us for our upcoming events and be part of the community.'}
                        </p>
                        <div className="flex items-center gap-4">
                            {content?.socials?.facebook && (
                                <a href={content.socials.facebook} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-all ${isLight ? 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}><Facebook size={18} /></a>
                            )}
                            {content?.socials?.twitter && (
                                <a href={content.socials.twitter} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-all ${isLight ? 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}><Twitter size={18} /></a>
                            )}
                            {content?.socials?.linkedin && (
                                <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-all ${isLight ? 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}><Linkedin size={18} /></a>
                            )}
                            {content?.socials?.instagram && (
                                <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-all ${isLight ? 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}><Instagram size={18} /></a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className={`font-bold mb-6 uppercase tracking-widest text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Event Info</h4>
                        <ul className={`space-y-4 text-sm ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Privacy Policy</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Terms of Service</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Refund Policy</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Safety Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-bold mb-6 uppercase tracking-widest text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Support</h4>
                        <ul className={`space-y-4 text-sm ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Help Center</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Contact Us</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Ticket Support</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Venue Info</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-bold mb-6 uppercase tracking-widest text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Stay Updated</h4>
                        <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>Get notified about upcoming events and special offers.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 flex-1 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-inner' : 'bg-white/5 border-white/10 text-white'}`}
                            />
                            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors">Join</button>
                        </div>
                    </div>
                </div>

                <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest ${isLight ? 'border-slate-100 text-slate-400' : 'border-white/5 text-slate-600'}`}>
                    <p>{content?.copyrightText || `© 2026 ${tenant.name}. All rights reserved.`}</p>
                    <p>Powered by TicketBD Engine</p>
                </div>
            </div>
        </footer>
    );
}
