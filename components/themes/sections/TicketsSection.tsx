'use client';

import { Check, Ticket } from 'lucide-react';

interface TicketsProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
}

export default function TicketsSection({ content, colors, fonts, isLight }: TicketsProps) {
    const tickets = Array.isArray(content) ? content : (content.tickets || []);

    return (
        <section id="tickets" className={`py-24 px-6 relative ${isLight ? 'bg-slate-50' : 'bg-gradient-to-b from-slate-900 to-black'}`}>
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square rounded-full blur-[120px] pointer-events-none ${isLight ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`}></div>

            <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>{content.subHeading || 'Join Us'}</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                        {content.heading || 'Get Your Tickets'}
                    </h2>
                    <p className={isLight ? 'text-slate-600' : 'text-slate-400'} style={{ fontFamily: fonts.body }}>
                        {content.description || 'Choose the perfect pass for your experience. All tickets include access to main activities.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto gap-12">
                    {tickets.map((ticket: any, index: number) => (
                        <div
                            key={index}
                            className={`relative p-8 md:p-10 rounded-[3rem] border transition-all hover:-translate-y-2 flex flex-col ${index === 1
                                ? `bg-white border-white shadow-2xl scale-100 lg:scale-105 ${isLight ? 'ring-4 ring-emerald-500/5' : ''}`
                                : isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
                                }`}
                        >
                            {index === 1 && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-2xl font-black mb-2 ${index === 1 || isLight ? 'text-slate-900' : 'text-white'}`} style={{ fontFamily: fonts.heading }}>
                                    {ticket.name}
                                </h3>
                                <p className={`text-sm ${index === 1 || isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {ticket.description}
                                </p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-2">
                                <span className={`text-4xl md:text-5xl font-black ${index === 1 || isLight ? 'text-slate-900' : 'text-white'}`}>
                                    ৳{ticket.price || '0.00'}
                                </span>
                                <span className={`text-sm font-medium ${index === 1 || isLight ? 'text-slate-500' : 'text-slate-400'}`}>/ per pass</span>
                            </div>

                            <div className="flex-1 space-y-4 mb-10">
                                {ticket.features?.map((feature: string, fIndex: number) => (
                                    <div key={fIndex} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${index === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            <Check size={14} />
                                        </div>
                                        <span className={`text-sm ${index === 1 ? 'text-slate-700' : 'text-slate-300'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:gap-5 ${index === 1
                                    ? 'bg-slate-900 text-white hover:bg-black'
                                    : isLight ? 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200' : 'border border-white/20 text-white hover:bg-white/10'
                                    }`}
                                style={(index !== 1 && !isLight) ? { borderColor: `${colors.primary}40`, color: colors.text } : {}}
                            >
                                <Ticket size={20} />
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
