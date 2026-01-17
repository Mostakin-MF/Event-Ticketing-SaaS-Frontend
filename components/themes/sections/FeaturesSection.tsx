'use client';

import * as Icons from 'lucide-react';

interface FeaturesProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
    category?: string;
}

export default function FeaturesSection({ content, colors, fonts, isLight, category }: FeaturesProps) {
    const features = Array.isArray(content) ? content : (content.features || []);
    const isTech = category === 'Tech Conference';
    const isSports = category === 'Sports';
    const isFestival = category === 'Festival';

    return (
        <section className={`py-24 px-6 relative overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-black/20'} ${isTech ? 'bg-black/60' : ''} ${isSports ? 'bg-slate-900' : ''} ${isFestival ? 'bg-white/5' : ''}`}>
            {isSports && (
                <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
            )}

            <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>
                        {content.subHeading || (isTech ? 'MODULE_CAPABILITIES' : isSports ? 'Core Strength' : 'Highlights')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                        {content.heading || (isTech ? 'Technical_Scope.exe' : isSports ? 'Unleash the Power' : 'Experience Excellence')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature: any, index: number) => {
                        const IconComponent = (Icons as any)[feature.icon] || Icons.Zap;
                        return (
                            <div
                                key={index}
                                className={`p-8 rounded-3xl border transition-all hover:-translate-y-2 group ${isLight
                                    ? 'border-slate-200 bg-white hover:shadow-xl hover:shadow-emerald-500/5'
                                    : `border-white/10 bg-white/5 hover:bg-white/10 ${isTech ? 'hover:border-green-500/30' : ''} ${isSports ? 'hover:border-red-500/50' : ''} ${isFestival ? 'hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]' : ''}`
                                    } ${isTech ? 'rounded-xl' : ''} ${isSports ? '-skew-x-2 hover:skew-x-0' : ''} ${isFestival ? 'rounded-[2rem] border-2' : ''}`}
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-lg ${isTech ? 'rounded-lg' : ''} ${isSports ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white' : ''}`}
                                    style={!isSports ? { backgroundColor: isLight ? `${colors.primary}10` : `${colors.primary}20`, color: colors.primary } : {}}
                                >
                                    <IconComponent size={28} />
                                </div>
                                <h3 className={`text-xl font-bold mb-4 ${isTech ? 'font-mono' : ''} ${isSports ? 'italic tracking-tighter' : ''}`} style={{ color: colors.text, fontFamily: fonts.heading }}>
                                    {isTech && '0x'}{feature.title}
                                </h3>
                                <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'} ${isTech ? 'font-mono text-sm opacity-80' : ''}`} style={{ fontFamily: fonts.body }}>
                                    {isTech && '> '}{feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
