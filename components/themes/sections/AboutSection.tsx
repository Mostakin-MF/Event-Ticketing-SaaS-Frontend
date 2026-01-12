'use client';

interface AboutProps {
    content: any;
    colors: any;
    fonts: any;
}

export default function AboutSection({ content, colors, fonts }: AboutProps) {
    return (
        <section className="py-24 px-6 relative bg-transparent overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                            {content.images?.[0] ? (
                                <img src={content.images[0]} className="w-full h-full object-cover" alt="About" />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest">About Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>Our Story</span>
                            <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ color: colors.text, fontFamily: fonts.heading }}>
                                {content.heading || 'Crafting Unforgettable Moments'}
                            </h2>
                        </div>

                        <p className="text-lg text-slate-400 leading-relaxed" style={{ fontFamily: fonts.body }}>
                            {content.content || 'Join us as we explore the intersection of technology, culture, and community. Our event is designed to spark conversation and create lasting memories for all attendees.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-3xl font-black mb-1" style={{ color: colors.primary }}>10k+</h4>
                                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Attendees Expected</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black mb-1" style={{ color: colors.primary }}>25+</h4>
                                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">World-Class Speakers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
