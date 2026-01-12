'use client';

import { ArrowRight, Calendar, MapPin } from 'lucide-react';

interface HeroProps {
    content: any;
    colors: any;
    fonts: any;
    category?: string;
    event?: any;
}

export default function HeroSection({ content, colors, fonts, category, event }: HeroProps) {
    const isMusic = category === 'music';

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {content.backgroundImage ? (
                    <img src={content.backgroundImage} className="w-full h-full object-cover" alt="Hero" />
                ) : (
                    <div className="w-full h-full bg-slate-900">
                        {/* Neon Glows for Music */}
                        {isMusic && (
                            <>
                                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30" style={{ backgroundColor: colors.primary }}></div>
                                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30" style={{ backgroundColor: colors.secondary }}></div>
                            </>
                        )}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/60"></div>
                {/* Gradient Mesh for specific categories */}
                {isMusic && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                        style={{ color: colors.secondary }}
                    >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.secondary }}></span>
                        <span className="text-xs font-bold uppercase tracking-widest">
                            {event?.city || 'Worldwide'} • {event?.startAt ? new Date(event.startAt).toLocaleDateString() : 'Upcoming'}
                        </span>
                    </div>

                    <h1
                        className={`text-6xl md:text-8xl font-black mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 tracking-tighter`}
                        style={{ color: colors.text, fontFamily: fonts.heading }}
                    >
                        {content.title || 'The Event of a Lifetime'}
                    </h1>

                    <p
                        className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
                        style={{ fontFamily: fonts.body }}
                    >
                        {content.subtitle || 'Join us for an unforgettable experience filled with innovation and inspiration.'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <button
                            className="group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl"
                            style={{ backgroundColor: colors.primary, color: '#fff', boxShadow: isMusic ? `0 0 20px ${colors.primary}40` : 'none' }}
                        >
                            {content.ctaText || 'Get Tickets Now'}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md font-bold text-white hover:bg-white/10 transition-all text-center">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Quick Info Footer */}
            {event && (
                <div className="absolute bottom-0 left-0 w-full md:h-24 border-t border-white/10 flex items-center bg-black/40 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-4 md:py-0 flex flex-wrap items-center gap-6 md:gap-12 text-white/70">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-slate-400" size={20} />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Date & Time</p>
                                <p className="text-sm font-semibold">{new Date(event.startAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-slate-400" size={20} />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Venue</p>
                                <p className="text-sm font-semibold">{event.venue}, {event.city}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
