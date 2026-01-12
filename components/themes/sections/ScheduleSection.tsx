'use client';

import { Clock, Star } from 'lucide-react';

interface ScheduleProps {
    content: any;
    colors: any;
    fonts: any;
}

export default function ScheduleSection({ content, colors, fonts }: ScheduleProps) {
    const schedule = Array.isArray(content) ? content : (content.schedule || []);

    return (
        <section className="py-24 px-6 relative">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>Timeline</span>
                        <h2 className="text-4xl md:text-5xl font-black" style={{ color: colors.text, fontFamily: fonts.heading }}>
                            Event Schedule
                        </h2>
                    </div>
                    <p className="text-slate-400 max-w-sm" style={{ fontFamily: fonts.body }}>
                        Don't miss a single moment of the action. Here is our planned timeline for the event.
                    </p>
                </div>

                <div className="space-y-4">
                    {schedule.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="group flex flex-col md:flex-row gap-6 p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all items-start md:items-center"
                        >
                            <div className="flex items-center gap-4 shrink-0">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                                    style={{ borderColor: `${colors.primary}40`, color: colors.primary }}
                                >
                                    <Clock size={20} />
                                </div>
                                <span className="text-2xl font-black" style={{ color: colors.text }}>{item.time}</span>
                            </div>

                            <div className="h-px flex-1 bg-white/10 hidden md:block"></div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors" style={{ color: colors.text, fontFamily: fonts.heading }}>
                                    {item.title}
                                </h3>
                                <p className="text-slate-400" style={{ fontFamily: fonts.body }}>
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                                <Star size={14} className="text-amber-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Main Stage</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
