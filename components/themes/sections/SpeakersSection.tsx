'use client';

import { Twitter, Linkedin, Globe } from 'lucide-react';

interface SpeakersProps {
    content: any;
    colors: any;
    fonts: any;
}

export default function SpeakersSection({ content, colors, fonts }: SpeakersProps) {
    const speakers = Array.isArray(content) ? content : (content.speakers || []);

    if (speakers.length === 0) return null;

    return (
        <section className="py-24 px-6 relative">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>Experts</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                        The Lineup
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {speakers.map((speaker: any, index: number) => (
                        <div
                            key={index}
                            className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:-translate-y-2 transition-all"
                        >
                            <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                {speaker.photo ? (
                                    <img src={speaker.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={speaker.name} />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-end justify-center pb-8 p-4 text-center">
                                        <div className="space-y-2">
                                            <p className="text-xl font-bold text-white uppercase">{speaker.name}</p>
                                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{speaker.role}</p>
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
                                <p className="text-sm text-slate-400 line-clamp-3 mb-6" style={{ fontFamily: fonts.body }}>
                                    {speaker.bio}
                                </p>

                                <div className="flex items-center gap-4">
                                    <a href={speaker.social?.twitter || '#'} className="text-slate-500 hover:text-white transition-colors"><Twitter size={18} /></a>
                                    <a href={speaker.social?.linkedin || '#'} className="text-slate-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
                                    <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe size={18} /></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
