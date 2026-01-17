'use client';

import { Clock, Star, Terminal } from 'lucide-react';

interface ScheduleProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
    category?: string;
}

export default function ScheduleSection({ content, colors, fonts, isLight, category }: ScheduleProps) {
    const schedule = Array.isArray(content) ? content : (content.schedule || []);
    const isTech = category === 'Tech Conference';

    return (
        <section className={`py-24 px-6 relative ${isTech ? 'bg-black/40' : ''}`}>
            {isTech && (
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }}
                ></div>
            )}
            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            {isTech && <Terminal size={16} style={{ color: colors.secondary }} />}
                            <span className="text-sm font-bold uppercase tracking-widest block" style={{ color: colors.secondary }}>
                                {content.subHeading || (isTech ? 'STDOUT_TIMELINE' : 'Timeline')}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black" style={{ color: colors.text, fontFamily: fonts.heading }}>
                            {content.heading || (isTech ? 'Event_Schedule.log' : 'Event Schedule')}
                        </h2>
                    </div>
                    <p className={`max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`} style={{ fontFamily: fonts.body }}>
                        {content.description || (isTech ? 'System initialization complete. Reviewing event execution cycle.' : "Don't miss a single moment of the action. Here is our planned timeline for the event.")}
                    </p>
                </div>

                <div className="space-y-4">
                    {schedule.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={`group flex flex-col md:flex-row gap-6 p-8 rounded-3xl border transition-all items-start md:items-center ${isLight
                                ? 'border-slate-200 bg-white hover:shadow-lg'
                                : `border-white/10 bg-white/5 hover:bg-white/10 ${isTech ? 'hover:border-green-500/50' : ''}`
                                }`}
                        >
                            <div className="flex items-center gap-4 shrink-0">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isTech ? 'rounded-lg' : ''}`}
                                    style={{ borderColor: `${colors.primary}40`, color: colors.primary }}
                                >
                                    <Clock size={20} />
                                </div>
                                <span className={`text-2xl font-black ${isTech ? 'font-mono' : ''}`} style={{ color: colors.text }}>{item.time}</span>
                            </div>

                            <div className={`h-px flex-1 hidden md:block ${isLight ? 'bg-slate-100' : 'bg-white/10'}`}></div>

                            <div className="flex-1">
                                <h3 className={`text-2xl font-bold mb-2 transition-colors ${isTech ? 'font-mono' : ''}`} style={{ color: colors.text, fontFamily: fonts.heading }}>
                                    {isTech && '> '}{item.title}
                                </h3>
                                <p className={isLight ? 'text-slate-600' : 'text-slate-400'} style={{ fontFamily: fonts.body }}>
                                    {item.description}
                                </p>
                            </div>

                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'} ${isTech ? 'rounded-lg border-green-500/20' : ''}`}>
                                <Star size={14} className="text-amber-500" />
                                <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                                    {isTech ? 'MAIN_PROCESS' : 'Main Stage'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
