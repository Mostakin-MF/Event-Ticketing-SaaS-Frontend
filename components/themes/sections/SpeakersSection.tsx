'use client';

import { Twitter, Linkedin, Globe } from 'lucide-react';

interface SpeakersProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
}

export default function SpeakersSection({ content, colors, fonts, isLight }: SpeakersProps) {
    const speakers = Array.isArray(content) ? content : (content.speakers || []);

    if (speakers.length === 0) return null;

    return (
        <section className={`py-24 px-6 relative ${isLight ? 'bg-white' : ''}`}>
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>{content.subHeading || 'Experts'}</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                        {content.heading || 'The Lineup'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {speakers.map((speaker: any, index: number) => (
                        <div
                            key={index}
                            className={`group relative rounded-3xl overflow-hidden border transition-all hover:-translate-y-2 ${isLight
                                ? 'border-slate-200 bg-slate-50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                {speaker.photo ? (
                                    <img src={speaker.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={speaker.name} />
                                ) : (
                                    <div className={`w-full h-full flex items-end justify-center pb-8 p-4 text-center ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                                        <div className="space-y-2">
                                            <p className={`text-xl font-bold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>{speaker.name}</p>
                                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">{speaker.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1" style={{ color: colors.text, fontFamily: fonts.heading }}>
                                    {speaker.name}
                                </h3>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: colors.secondary }}>
                                    {speaker.role}
                                </p>
                                <p className={`text-sm line-clamp-3 mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} style={{ fontFamily: fonts.body }}>
                                    {speaker.bio}
                                </p>

                                <div className="flex items-center gap-4">
                                    <a href={speaker.social?.twitter || '#'} className={`transition-colors ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}><Twitter size={18} /></a>
                                    <a href={speaker.social?.linkedin || '#'} className={`transition-colors ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}><Linkedin size={18} /></a>
                                    <a href="#" className={`transition-colors ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}><Globe size={18} /></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
