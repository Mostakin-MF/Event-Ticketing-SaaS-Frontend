'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tenantAdminService, CreateEventDto, EventStatus } from '@/services/tenantAdminService';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Layout,
    Users,
    DollarSign,
    Type,
    Plus,
    Save,
    Clock,
    Palette,
    Lock,
    Settings,
    ShoppingBag,
    CheckCircle2
} from 'lucide-react';

// Helper to generate slug
const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const toISOStringOrNull = (value?: string) => {
    if (!value) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
};

const getLocalDatetimeValue = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchingThemes, setFetchingThemes] = useState(true);
    const [themes, setThemes] = useState<any[]>([]);
    const [purchasedThemes, setPurchasedThemes] = useState<any[]>([]);
    const [error, setError] = useState<string | string[] | null>(null);


    const [filterPrice, setFilterPrice] = useState<'all' | 'free' | 'premium'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Derived state for categories
    const categories = ['all', ...Array.from(new Set(themes.map(t => t.category || 'General')))];

    // Helper to check ownership
    const isOwned = (themeId: string) => {
        const theme = themes.find(t => t.id === themeId);
        if (!theme) return false;
        if (!theme.isPremium || theme.price === 0) return true;
        return purchasedThemes.some(p => p.themeId === themeId && p.status === 'active');
    };

    // Filtered themes
    const filteredThemes = themes.filter(theme => {
        const matchesPrice =
            filterPrice === 'all' ? true :
                filterPrice === 'free' ? !theme.isPremium :
                    filterPrice === 'premium' ? theme.isPremium : true;

        const matchesCategory =
            filterCategory === 'all' ? true :
                (theme.category || 'General') === filterCategory;

        return matchesPrice && matchesCategory;
    });

    const [formData, setFormData] = useState<Partial<CreateEventDto>>({
        name: '',
        slug: '',
        description: '',
        venue: '',
        city: '',
        country: 'Bangladesh',
        startAt: '',
        endAt: '',
        status: EventStatus.DRAFT,
        themeId: '',
        capacity: 100,
        price: 0,
    });

    useEffect(() => {
        const fetchThemesAndPurchases = async () => {
            try {
                const [themeData, purchasedData] = await Promise.all([
                    tenantAdminService.getAvailableThemes(),
                    tenantAdminService.getPurchasedThemes()
                ]);

                const themeList = Array.isArray(themeData) ? themeData : (themeData as any).data || [];
                setThemes(themeList);
                setPurchasedThemes(purchasedData);
            } catch (err) {
                console.error('Failed to fetch themes or purchases', err);
            } finally {
                setFetchingThemes(false);
            }
        };
        fetchThemesAndPurchases();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setError(null);

        if (name === 'name') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                // Only auto-update slug if it hasn't been manually edited (simple check: if it matches old slug expectation)
                slug: !prev.slug || prev.slug === generateSlug(prev.name || '') ? generateSlug(value) : prev.slug
            }));
        } else if (name === 'price' || name === 'capacity') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleThemeSelect = (themeId: string) => {
        if (!isOwned(themeId)) {
            setError("This premium theme is locked. Please purchase it from the marketplace first.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setFormData(prev => ({ ...prev, themeId }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!formData.name || !formData.slug || !formData.startAt || !formData.endAt) {
            setError('Please fill in all required fields (Name, Slug, Dates).');
            return;
        }

        if (!formData.themeId) {
            setError('Please select a theme for your event.');
            return;
        }

        setLoading(true);
        try {
            const payload: CreateEventDto = {
                name: formData.name!,
                slug: formData.slug!,
                description: formData.description || '',
                fullDescription: formData.fullDescription,
                venue: formData.venue || 'TBD', // Default if empty to avoid fail
                city: formData.city || 'Dhaka',
                country: formData.country || 'Bangladesh',
                status: formData.status,
                themeId: formData.themeId,
                capacity: formData.capacity,
                price: formData.price,
                startAt: toISOStringOrNull(formData.startAt as string) as any,
                endAt: toISOStringOrNull(formData.endAt as string) as any,
            };

            await tenantAdminService.createEvent(payload);
            router.push('/tenant-admin/events');
        } catch (error: any) {
            console.error("Failed to create event", error);
            setError(error?.response?.data?.message || error?.message || 'Failed to create event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/tenant-admin/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-1 transition-colors text-sm">
                        <ArrowLeft size={14} />
                        Back to Events
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Event</h1>
                    <p className="text-sm text-slate-500 font-medium">Launch a stunning page for your next big thing.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-8 space-y-5">

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                            <div className="text-red-500 mt-0.5">⚠️</div>
                            <div className="text-red-700 font-medium">
                                {Array.isArray(error) ? (
                                    <ul className="list-disc pl-4 space-y-1">
                                        {error.map((err, i) => (
                                            <li key={i}>{typeof err === 'string' ? err : JSON.stringify(err)}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{error}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Section 1: Essentials */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                                <Layout size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 leading-none">Essentials</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Event Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Future Tech Summit 2026"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-bold text-slate-900 placeholder:font-normal text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">URL Slug <span className="text-red-500">*</span></label>
                                    <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                                        <span className="px-3 py-2 bg-slate-100 text-slate-400 font-bold border-r border-slate-200 text-xs flex items-center">
                                            /
                                        </span>
                                        <input
                                            type="text"
                                            name="slug"
                                            required
                                            value={formData.slug}
                                            onChange={handleChange}
                                            placeholder="slug"
                                            className="flex-1 px-3 py-2 bg-transparent border-none focus:ring-0 text-slate-900 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Short Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief summary..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all resize-none text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Full Description</label>
                                <textarea
                                    name="fullDescription"
                                    rows={4}
                                    value={formData.fullDescription || ''}
                                    onChange={handleChange}
                                    placeholder="Detailed information..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all resize-none text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Date & Schedule */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 p-4 rounded-xl bg-slate-50/50 border border-slate-100 group transition-all hover:border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 group-hover:text-emerald-500 transition-colors">Start Date & Time</span>
                                </div>
                                <div className="relative group/picker">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/picker:text-emerald-500 group-hover/picker:text-emerald-500 pointer-events-none transition-colors">
                                        <Calendar size={14} />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        required
                                        onClick={(e) => {
                                            try {
                                                e.currentTarget.showPicker?.();
                                            } catch (err) {
                                                console.error('Picker error:', err);
                                            }
                                        }}
                                        onChange={(e) => {
                                            const newDate = new Date(e.target.value);
                                            setFormData(prev => ({ ...prev, startAt: isNaN(newDate.getTime()) ? '' : newDate.toISOString() }));
                                        }}
                                        value={getLocalDatetimeValue(formData.startAt as string)}
                                        className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-slate-700 text-sm transition-all cursor-pointer hover:bg-slate-50"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/picker:text-emerald-500 group-hover/picker:text-emerald-500 pointer-events-none transition-colors">
                                        <Clock size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 p-4 rounded-xl bg-slate-50/50 border border-slate-100 group transition-all hover:border-red-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 group-hover:text-red-500 transition-colors">End Date & Time</span>
                                </div>
                                <div className="relative group/picker">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/picker:text-red-500 group-hover/picker:text-red-500 pointer-events-none transition-colors">
                                        <Calendar size={14} />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        required
                                        onClick={(e) => {
                                            try {
                                                e.currentTarget.showPicker?.();
                                            } catch (err) {
                                                console.error('Picker error:', err);
                                            }
                                        }}
                                        onChange={(e) => {
                                            const newDate = new Date(e.target.value);
                                            setFormData(prev => ({ ...prev, endAt: isNaN(newDate.getTime()) ? '' : newDate.toISOString() }));
                                        }}
                                        value={getLocalDatetimeValue(formData.endAt as string)}
                                        className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none font-bold text-slate-700 text-sm transition-all cursor-pointer hover:bg-slate-50"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/picker:text-red-500 group-hover/picker:text-red-500 pointer-events-none transition-colors">
                                        <Clock size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Section: Theme Selection */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                                    <Palette size={18} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 leading-none">Choose a Theme</h2>
                            </div>

                            {/* Filter Controls */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={filterPrice}
                                    onChange={(e) => setFilterPrice(e.target.value as any)}
                                    className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="free">Free</option>
                                    <option value="premium">Premium</option>
                                </select>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {fetchingThemes ? (
                            <div className="flex items-center justify-center p-8 text-slate-400">
                                <span className="loading loading-spinner loading-md mr-2"></span>
                                Loading themes...
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {filteredThemes.map((theme) => {
                                    const owned = isOwned(theme.id);
                                    return (
                                        <div
                                            key={theme.id}
                                            onClick={() => handleThemeSelect(theme.id)}
                                            className={`group relative cursor-pointer rounded-2xl border-2 transition-all duration-200 overflow-hidden flex flex-col ${formData.themeId === theme.id
                                                ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-200 shadow-xl shadow-violet-500/10'
                                                : !owned
                                                    ? 'border-slate-100 opacity-60 grayscale-[0.3]'
                                                    : 'border-slate-100 hover:border-slate-300 hover:shadow-lg bg-white'
                                                }`}
                                        >
                                            <div className="aspect-video bg-slate-200 relative overflow-hidden">
                                                {theme.thumbnailUrl ? (
                                                    <img
                                                        src={theme.thumbnailUrl}
                                                        alt={theme.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                                                        <Palette size={24} className="mb-2 opacity-50" />
                                                        <span className="text-xs font-semibold">No Preview</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-md shadow-sm border ${theme.isPremium
                                                        ? 'bg-amber-100/90 text-amber-700 border-amber-200/50'
                                                        : 'bg-white/90 text-slate-700 border-slate-200/50'
                                                        }`}>
                                                        {theme.isPremium ? `৳${theme.price}` : 'Free'}
                                                    </span>
                                                    {owned && theme.isPremium && (
                                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500 text-white uppercase tracking-tighter shadow-sm border border-emerald-400/50">
                                                            Purchased
                                                        </span>
                                                    )}
                                                </div>

                                                {!owned && (
                                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[1px]">
                                                        <div className="bg-white/90 text-slate-900 rounded-full p-2 shadow-xl border border-white">
                                                            <Lock size={20} className="animate-pulse" />
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.themeId === theme.id && (
                                                    <div className="absolute inset-0 bg-violet-900/40 flex items-center justify-center backdrop-blur-[1px] animate-in fade-in duration-200">
                                                        <div className="bg-white text-violet-700 rounded-full p-2 shadow-xl scale-in-center">
                                                            <CheckCircle2 size={24} fill="currentColor" className="text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3">
                                                <h3 className="font-bold text-xs text-slate-900 group-hover:text-violet-700 truncate leading-tight mb-1">{theme.name}</h3>

                                                <div className="flex items-center justify-between">
                                                    {theme.defaultProperties?.colors && (
                                                        <div className="flex -space-x-1.5">
                                                            {Object.entries(theme.defaultProperties.colors)
                                                                .filter(([key]) => ['primary', 'secondary', 'background', 'accent'].includes(key))
                                                                .slice(0, 3)
                                                                .map(([key, color]: any) => (
                                                                    <div
                                                                        key={key}
                                                                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                                                                        style={{ backgroundColor: color }}
                                                                    />
                                                                ))}
                                                        </div>
                                                    )}

                                                    {theme.previewUrl && (
                                                        <a
                                                            href={theme.previewUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[9px] font-bold text-slate-400 hover:text-violet-600 uppercase tracking-tighter"
                                                        >
                                                            Preview
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center">
                            <Link
                                href="/tenant-admin/themes"
                                className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-2 transition-colors uppercase tracking-widest"
                            >
                                <ShoppingBag size={14} />
                                Get more premium themes from Marketplace
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-5">
                    {/* Status & Options Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Settings size={16} />
                            <h3 className="font-bold text-slate-900 text-sm leading-none">Settings</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Event Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-violet-500 focus:outline-none text-slate-900 font-bold text-sm"
                                >
                                    <option value={EventStatus.DRAFT}>Draft (Hidden)</option>
                                    <option value={EventStatus.PUBLISHED}>Published (Live)</option>
                                    <option value={EventStatus.SCHEDULED}>Scheduled</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Tickets Price</label>
                                <div className="flex rounded-lg bg-slate-50 border border-slate-200 overflow-hidden focus-within:border-emerald-500 transition-all">
                                    <span className="px-2.5 py-2 bg-slate-100 text-slate-500 font-bold text-xs flex items-center">৳</span>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="flex-1 px-3 py-2 bg-transparent border-none focus:ring-0 text-slate-900 font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location & Capacity Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <MapPin size={16} />
                            <h3 className="font-bold text-slate-900 text-sm leading-none">Location</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="e.g. Convention Hall"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Capacity</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Create Event
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
