'use client';

interface AboutProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
    category?: string;
}

export default function AboutSection({ content, colors, fonts, isLight, category }: AboutProps) {
    const isTech = category === 'Tech Conference';
    const isSports = category === 'Sports';
    const isFestival = category === 'Festival';

    return (
        <section className="py-24 px-6 relative bg-transparent overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className={`relative group ${isSports ? 'order-last lg:order-first' : ''}`}>
                        <div className={`absolute -inset-4 bg-gradient-to-tr rounded-3xl blur-2xl group-hover:opacity-75 transition-opacity ${isLight ? 'from-emerald-500/10 to-blue-500/10' : 'from-emerald-500/20 to-blue-500/20'} ${isTech ? 'from-green-500/20 to-emerald-500/20' : ''} ${isSports ? 'from-red-600/30 to-orange-600/30 -skew-x-6 scale-105' : ''} ${isFestival ? 'from-pink-500/30 to-yellow-500/30 rounded-full scale-110' : ''}`}></div>
                        <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden border ${isLight ? 'border-slate-200' : 'border-white/10'} ${isTech ? 'border-green-500/30' : ''} ${isSports ? '-skew-x-6 border-red-500/20' : ''} ${isFestival ? 'rounded-[3rem] border-transparent' : ''}`}>
                            {content.images?.[0] ? (
                                <img src={content.images[0]} className="w-full h-full object-cover" alt="About" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">About Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <span className={`text-sm font-bold uppercase tracking-widest mb-4 block ${isSports ? 'italic text-red-500' : ''} ${isFestival ? 'text-pink-500 tracking-normal font-black' : ''}`} style={{ color: (isSports || isFestival) ? undefined : colors.secondary }}>
                                {isSports ? 'The Legacy' : isFestival ? '✨ The Vibration' : 'Our Story'}
                            </span>
                            <h2 className={`text-4xl md:text-5xl font-black leading-tight ${isSports ? 'italic uppercase tracking-tighter' : ''}`} style={{ color: colors.text, fontFamily: fonts.heading }}>
                                {content.heading || 'Crafting Unforgettable Moments'}
                            </h2>
                        </div>

                        <p className={`text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`} style={{ fontFamily: fonts.body }}>
                            {content.content || 'Join us as we explore the intersection of technology, culture, and community. Our event is designed to spark conversation and create lasting memories for all attendees.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-3xl font-black mb-1" style={{ color: colors.primary }}>10k+</h4>
                                <p className={`text-sm uppercase font-bold tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Attendees Expected</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black mb-1" style={{ color: colors.primary }}>25+</h4>
                                <p className={`text-sm uppercase font-bold tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>World-Class Speakers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
