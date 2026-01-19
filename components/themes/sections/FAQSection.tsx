'use client';

interface FAQProps {
    content: any;
    colors: any;
    fonts: any;
    isLight?: boolean;
}

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection({ content, colors, fonts, isLight }: FAQProps) {
    const faqs = Array.isArray(content) ? content : (content.faq || []);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (faqs.length === 0) return null;

    return (
        <section className={`py-24 px-6 relative ${isLight ? 'bg-slate-50' : 'bg-black/20'}`}>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>{content.subHeading || 'Support'}</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                            {content.heading || <>Frequently Asked <br /> Questions</>}
                        </h2>
                        <p className={`max-w-md mb-10 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} style={{ fontFamily: fonts.body }}>
                            {content.description || 'Have questions about tickets, travel, or the venue? We have gathered answers to the most common inquiries.'}
                        </p>
                        <button
                            className={`px-8 py-3 rounded-xl border font-bold transition-all ${isLight
                                ? 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm'
                                : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            Contact Support
                        </button>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq: any, index: number) => (
                            <div
                                key={index}
                                className={`rounded-3xl border overflow-hidden transition-all ${isLight
                                    ? 'border-slate-200 bg-white shadow-sm'
                                    : 'border-white/10 bg-black/20'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`} style={{ fontFamily: fonts.heading }}>
                                        {faq.question}
                                    </span>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                                        style={{ backgroundColor: openIndex === index ? colors.primary : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'), color: openIndex === index ? '#fff' : (isLight ? colors.text : '#fff') }}
                                    >
                                        {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                        <p className={`leading-relaxed border-t pt-4 ${isLight ? 'text-slate-600 border-slate-100' : 'text-slate-400 border-white/5'}`} style={{ fontFamily: fonts.body }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
