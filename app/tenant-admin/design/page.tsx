'use client';

import { useState, useEffect } from 'react';
import {
    Palette, Upload, Layout, Globe, Save, CheckCircle,
    Monitor, Loader2, Link as LinkIcon,
    Sparkles, Wand2, Paintbrush,
    Image as ImageIcon
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';

export default function TenantDesignPage() {
    const [activeTab, setActiveTab] = useState('theme'); // theme, customization, content
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [themes, setThemes] = useState<any[]>([]);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [tenantSlug, setTenantSlug] = useState<string>('');

    // Design State
    const [selectedThemeId, setSelectedThemeId] = useState('default');
    const [colors, setColors] = useState({
        primary: '#10b981',
        secondary: '#f59e0b',
        background: '#020617',
        text: '#ffffff'
    });
    const [assets, setAssets] = useState({
        logoUrl: '',
        bannerUrl: ''
    });
    const [siteInfo, setSiteInfo] = useState({
        title: '',
        description: '',
        socialLinks: { facebook: '', twitter: '', instagram: '' }
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const auth = await authService.checkAuth();
            if (auth.tenantId) {
                setTenantId(auth.tenantId);

                const [configData, themesData] = await Promise.all([
                    adminService.getTenantConfig(auth.tenantId),
                    adminService.getAllThemes({}),
                ]);

                setThemes(themesData.data || []);

                if (configData.tenant?.slug) {
                    setTenantSlug(configData.tenant.slug);
                }

                if (configData.themeId) setSelectedThemeId(configData.themeId);
                if (configData.styleOverrides?.colors) {
                    setColors(prev => ({ ...prev, ...configData.styleOverrides.colors }));
                }
                if (configData.assets) {
                    setAssets(prev => ({ ...prev, ...configData.assets }));
                }
                if (configData.siteInfo) {
                    setSiteInfo(prev => ({ ...prev, ...configData.siteInfo }));
                }
            }
        } catch (error) {
            console.error("Failed to load design data", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!tenantId) return;
        setSaving(true);
        try {
            await adminService.updateTenantConfig(tenantId, {
                themeId: selectedThemeId,
                styleOverrides: { colors },
                assets,
                siteInfo
            });
            alert('Design saved successfully!');
        } catch (error) {
            console.error("Failed to save", error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
    );

    const presetPalettes = [
        { name: "Emerald & Night", primary: "#10b981", secondary: "#f59e0b", background: "#020617", text: "#ffffff" },
        { name: "Oceanic Blue", primary: "#0ea5e9", secondary: "#6366f1", background: "#0f172a", text: "#e2e8f0" },
        { name: "Purple Haze", primary: "#8b5cf6", secondary: "#ec4899", background: "#111827", text: "#f9fafb" },
        { name: "Midnight Red", primary: "#ef4444", secondary: "#f97316", background: "#0c0a09", text: "#fafaf9" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Wand2 className="text-emerald-600" size={24} />
                        Site Builder
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {tenantSlug && (
                        <a
                            href={`/${tenantSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                        >
                            <Globe size={18} />
                            View Live Site
                        </a>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Publishing...' : 'Publish Changes'}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Horizontal Tabs */}
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm mb-8">
                    {[
                        { id: 'theme', icon: Layout, label: 'Theme Selection' },
                        { id: 'customization', icon: Palette, label: 'Branding & Colors' },
                        { id: 'content', icon: Upload, label: 'Content & Assets' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">

                    {activeTab === 'theme' && (
                        <div className="p-8 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="text-emerald-500" />
                                    Choose a Theme
                                </h2>
                                <p className="text-slate-500 mt-1">Select a starting template for your event portal.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {themes.map(theme => (
                                    <div
                                        key={theme.id}
                                        onClick={() => setSelectedThemeId(theme.id)}
                                        className={`
                                            group relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300
                                            ${selectedThemeId === theme.id
                                                ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                                                : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                            {theme.thumbnailUrl ? (
                                                <img src={theme.thumbnailUrl} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Layout size={40} />
                                                </div>
                                            )}

                                            {/* Selection Badge */}
                                            <div className={`absolute top-3 right-3 transition-all duration-300 ${selectedThemeId === theme.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                                <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                                                    <CheckCircle size={20} fill="white" className="text-emerald-500" />
                                                </div>
                                            </div>

                                            {/* Premium Badge */}
                                            {theme.isPremium && (
                                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                                    PREMIUM
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 bg-white">
                                            <h4 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">{theme.name}</h4>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{theme.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'customization' && (
                        <div className="p-8 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Paintbrush className="text-emerald-500" />
                                    Branding & Style
                                </h2>
                                <p className="text-slate-500 mt-1">Customize your brand colors to match your identity.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Color Palettes */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Palettes</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {presetPalettes.map((palette) => (
                                            <button
                                                key={palette.name}
                                                onClick={() => setColors({
                                                    primary: palette.primary,
                                                    secondary: palette.secondary,
                                                    background: palette.background,
                                                    text: palette.text
                                                })}
                                                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 transition-all text-left group bg-slate-50/50"
                                            >
                                                <div className="grid grid-cols-2 w-10 h-10 rounded-lg overflow-hidden shadow-sm shrink-0">
                                                    <div style={{ background: palette.primary }} />
                                                    <div style={{ background: palette.secondary }} />
                                                    <div style={{ background: palette.background }} />
                                                    <div style={{ background: palette.text }} />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-emerald-700">
                                                    {palette.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Color Controls */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Fine Tuning</h3>
                                    <div className="space-y-6">
                                        {[
                                            { key: 'primary', label: 'Primary Brand Color', desc: 'Main buttons and highlights' },
                                            { key: 'secondary', label: 'Secondary Accent', desc: 'Subtle details and borders' },
                                            { key: 'background', label: 'Page Background', desc: 'Main canvas color' },
                                            { key: 'text', label: 'Typography Color', desc: 'Headings and paragraphs' },
                                        ].map((color) => (
                                            <div key={color.key} className="flex items-center gap-6">
                                                <div className="relative group cursor-pointer">
                                                    <div
                                                        className="w-14 h-14 rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                                        style={{ backgroundColor: colors[color.key as keyof typeof colors] }}
                                                    >
                                                        <input
                                                            type="color"
                                                            value={colors[color.key as keyof typeof colors]}
                                                            onChange={(e) => setColors({ ...colors, [color.key]: e.target.value })}
                                                            className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{color.label}</div>
                                                    <div className="text-xs text-slate-500 font-mono mt-1 uppercase opacity-70">
                                                        {colors[color.key as keyof typeof colors]}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="p-8 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <ImageIcon className="text-emerald-500" />
                                    Content & Assets
                                </h2>
                                <p className="text-slate-500 mt-1">Manage your logo, banners, and general site information.</p>
                            </div>

                            <div className="max-w-3xl space-y-10">
                                {/* Assets Section */}
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Visual Assets</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700">Logo URL</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={assets.logoUrl}
                                                    onChange={(e) => setAssets({ ...assets, logoUrl: e.target.value })}
                                                    placeholder="https://..."
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            </div>
                                            <p className="text-xs text-slate-400">Recommended: Transparent PNG, height 40px</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700">Hero Banner URL</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={assets.bannerUrl}
                                                    onChange={(e) => setAssets({ ...assets, bannerUrl: e.target.value })}
                                                    placeholder="https://..."
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            </div>
                                            <p className="text-xs text-slate-400">Recommended: 1920x600px JPG or WebP</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Site Details Section */}
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Site Information</h3>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Page Title</label>
                                            <input
                                                type="text"
                                                value={siteInfo.title}
                                                onChange={(e) => setSiteInfo({ ...siteInfo, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Description</label>
                                            <textarea
                                                value={siteInfo.description}
                                                onChange={(e) => setSiteInfo({ ...siteInfo, description: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Contact Email</label>
                                                <input
                                                    type="text"
                                                    value={(siteInfo as any).contactEmail || ''}
                                                    onChange={(e) => setSiteInfo({ ...siteInfo, contactEmail: e.target.value } as any)}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
