'use client';

import { MapPin, Navigation, Car } from 'lucide-react';

interface VenueProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
}

export default function VenueSection({ content, colors, fonts, isLight }: VenueProps) {
    if (!content) return null;

    return (
        <section className={`py-24 px-6 relative ${isLight ? 'bg-white' : 'bg-black/20'}`}>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>Location</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                                Join Us at <br /> {content.name || 'The Main Stage'}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                                >
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Address</h4>
                                    <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>{content.address || 'Location details coming soon.'}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                                >
                                    <Navigation size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Getting There</h4>
                                    <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>{content.directions || 'Multiple public transit options available.'}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                                >
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Parking</h4>
                                    <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>{content.parking || 'On-site parking available for early arrivals.'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 text-white transition-all hover:gap-4"
                            style={{ backgroundColor: colors.primary }}
                        >
                            Open in Google Maps
                            <Navigation size={18} />
                        </button>
                    </div>

                    <div className="relative group grayscale hover:grayscale-0 transition-all duration-700">
                        {/* Mock Map View */}
                        <div className={`absolute -inset-2 bg-gradient-to-tr rounded-[2.5rem] blur-xl opacity-20 ${isLight ? 'from-emerald-500/20 to-blue-500/20' : 'from-emerald-500/10 to-blue-500/10'}`}></div>
                        <div className={`relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-800'}`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin size={48} className="mx-auto mb-4 animate-bounce" style={{ color: colors.primary }} />
                                    <p className="text-white font-bold uppercase tracking-widest text-xs">Dynamic Map Integration</p>
                                </div>
                            </div>
                            {/* Static Map Image Placeholder */}
                            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-30" alt="Map" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
