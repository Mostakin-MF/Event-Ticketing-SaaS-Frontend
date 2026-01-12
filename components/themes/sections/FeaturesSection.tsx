'use client';

import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface FeaturesProps {
    content: any;
    colors: any;
    fonts: any;
}

export default function FeaturesSection({ content, colors, fonts }: FeaturesProps) {
    const features = Array.isArray(content) ? content : (content.features || []);

    return (
        <section className="py-24 px-6 relative bg-black/20">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>Highlights</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                        Why Attend?
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature: any, index: number) => {
                        const IconComponent = (LucideIcons as any)[feature.icon] as LucideIcon || LucideIcons.Zap;

                        return (
                            <div
                                key={index}
                                className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-2 group"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-lg"
                                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                                >
                                    <IconComponent size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text, fontFamily: fonts.heading }}>
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed" style={{ fontFamily: fonts.body }}>
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
