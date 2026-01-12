'use client';

import { ArrowRight, Calendar, MapPin } from 'lucide-react';

interface HeroProps {
    content: any;
    colors: any;
    fonts: any;
    category?: string;
    event?: any;
    isLight?: boolean;
}

export default function HeroSection({ content, colors, fonts, category, event, isLight }: HeroProps) {
    const isMusic = category === 'music';
    const isExhibition = category === 'Exhibition';
    const isTech = category === 'Tech Conference';
    const isSports = category === 'Sports';
    const isFestival = category === 'Festival';

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {content.backgroundImage ? (
                    <img src={content.backgroundImage} className="w-full h-full object-cover" alt="Hero" />
                ) : (
                    <div className="w-full h-full" style={{ backgroundColor: isLight ? '#f1f5f9' : '#0f172a' }}>
                        {/* Neon Glows for Music */}
                        {isMusic && (
                            <>
                                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30" style={{ backgroundColor: colors.primary }}></div>
                                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30" style={{ backgroundColor: colors.secondary }}></div>
                            </>
                        )}
                        {/* Tech Grid Pattern */}
                        {isTech && (
                            <div className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `linear-gradient(${colors.primary}20 1px, transparent 1px), linear-gradient(90deg, ${colors.primary}20 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }}
                            ></div>
                        )}
                    </div>
                )}
                <div className={`absolute inset-0 ${isLight ? 'bg-white/40' : 'bg-black/60'}`}></div>
                {/* Gradient Mesh for specific categories */}
                {isMusic && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>}
                {isExhibition && isLight && <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent"></div>}
                {isTech && <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>}
                {isSports && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        {/* Diagonal Energy Lines */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                            <div className="absolute -top-[50%] -left-[10%] w-[120%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_100px,rgba(239,68,68,0.1)_100px,rgba(239,68,68,0.1)_101px)]"></div>
                        </div>
                    </>
                )}
                {isFestival && (
                    <>
                        {/* Organic Shapes for Festival */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-pulse" style={{ backgroundColor: colors.primary }}></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-pulse delay-1000" style={{ backgroundColor: colors.secondary }}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]"></div>
                    </>
                )}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-white/10 bg-white/5'
                            }`}
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
                        className={`text-xl md:text-2xl mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
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

                        <button className={`w-full sm:w-auto px-8 py-4 rounded-2xl border font-bold backdrop-blur-md transition-all text-center ${isLight
                            ? 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                            : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                            }`}>
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Quick Info Footer */}
            {event && (
                <div className={`absolute bottom-0 left-0 w-full md:h-24 border-t flex items-center backdrop-blur-xl ${isLight ? 'bg-white/40 border-slate-200' : 'bg-black/40 border-white/10'}`}>
                    <div className={`container mx-auto px-6 py-4 md:py-0 flex flex-wrap items-center gap-6 md:gap-12 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                        <div className="flex items-center gap-3">
                            <Calendar className={isLight ? 'text-emerald-500' : 'text-slate-400'} size={20} />
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
