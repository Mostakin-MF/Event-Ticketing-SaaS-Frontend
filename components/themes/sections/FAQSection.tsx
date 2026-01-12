'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQProps {
    content: any;
    colors: any;
    fonts: any;
}

export default function FAQSection({ content, colors, fonts }: FAQProps) {
    const faqs = Array.isArray(content) ? content : (content.faq || []);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (faqs.length === 0) return null;

    return (
        <section className="py-24 px-6 relative bg-black/20">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: colors.secondary }}>Support</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.text, fontFamily: fonts.heading }}>
                            Frequently Asked <br /> Questions
                        </h2>
                        <p className="text-slate-400 max-w-md mb-10" style={{ fontFamily: fonts.body }}>
                            Have questions about tickets, travel, or the venue? We have gathered answers to the most common inquiries.
                        </p>
                        <button
                            className="px-8 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                        >
                            Contact Support
                        </button>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq: any, index: number) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-lg font-bold text-white" style={{ fontFamily: fonts.heading }}>
                                        {faq.question}
                                    </span>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                                        style={{ backgroundColor: openIndex === index ? colors.primary : 'rgba(255,255,255,0.05)', color: '#fff' }}
                                    >
                                        {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                        <p className="text-slate-400 leading-relaxed border-t border-white/5 pt-4" style={{ fontFamily: fonts.body }}>
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
