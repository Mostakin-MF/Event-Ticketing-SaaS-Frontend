'use client';

interface GalleryProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
}

export default function GallerySection({ content, colors, fonts, isLight }: GalleryProps) {
    const images = Array.isArray(content) ? content : (content.gallery || []);

    if (images.length === 0) return null;

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>{content.subHeading || 'Visuals'}</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                        {content.heading || 'Event Gallery'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((url: string, index: number) => (
                        <div
                            key={index}
                            className={`relative group rounded-3xl overflow-hidden cursor-pointer ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                                }`}
                        >
                            <img
                                src={url}
                                alt={`Gallery ${index}`}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                                    View Full
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Mock Empty States IF less than 4 images */}
                    {images.length < 4 && Array.from({ length: 4 - images.length }).map((_, i) => (
                        <div key={`empty-${i}`} className={`aspect-square rounded-3xl border flex items-center justify-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                            <span className={`font-bold opacity-30 tracking-tighter text-4xl ${isLight ? 'text-slate-400' : 'text-slate-800'}`}>GALLERY</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
