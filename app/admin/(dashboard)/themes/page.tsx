'use client';

import { useState, useEffect } from 'react';
import {
    Palette,
    Plus,
    Search,
    Eye,
    Power,
    DollarSign,
    X,
    Check,
    Edit2,
    Trash2,
    Activity,
    Layers,
    Zap,
    TrendingUp,
    CheckCircle2,
    Clock,
    Shield,
    Filter,
    ExternalLink,
    ArrowUpRight,
    Image as ImageIcon
} from 'lucide-react';
import adminService from '@/services/adminService';
import { Theme, ThemeCategory } from '@/types/theme';

export default function ThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [filteredThemes, setFilteredThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [tempPrice, setTempPrice] = useState<number>(0);

    useEffect(() => {
        fetchThemes();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [themes, searchTerm, statusFilter, tierFilter]);

    const fetchThemes = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllThemes();
            const data = Array.isArray(response) ? response : (response.data || []);
            setThemes(data);
        } catch (error) {
            console.error('Failed to fetch themes:', error);
            setThemes([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...themes];

        if (searchTerm) {
            filtered = filtered.filter(theme =>
                theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                theme.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(theme => theme.status === statusFilter);
        }

        if (tierFilter !== 'all') {
            filtered = filtered.filter(theme =>
                tierFilter === 'premium' ? theme.isPremium : !theme.isPremium
            );
        }

        setFilteredThemes(filtered);
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await adminService.updateThemeStatus(id, newStatus);
            fetchThemes();
        } catch (error) {
            console.error('Failed to update theme status', error);
        }
    };

    const handlePriceEdit = (theme: Theme) => {
        setEditingPriceId(theme.id);
        setTempPrice(theme.price || 0);
    };

    const handlePriceSave = async (id: string, isPremium: boolean) => {
        try {
            await adminService.updateThemePrice(id, tempPrice, isPremium);
            setEditingPriceId(null);
            fetchThemes();
        } catch (error) {
            console.error('Failed to update theme price', error);
        }
    };

    const handleEdit = (theme: Theme) => {
        setEditingTheme(theme);
        setShowFormModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
            try {
                await adminService.deleteTheme(id);
                fetchThemes();
            } catch (error) {
                console.error('Failed to delete theme', error);
            }
        }
    };

    const stats = {
        total: themes.length,
        active: themes.filter(t => t.status === 'active').length,
        premium: themes.filter(t => t.isPremium).length,
        free: themes.filter(t => !t.isPremium).length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">

            {/* CINEMATIC AESTHETIC HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Palette size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Zap size={10} fill="currentColor" /> Aesthetic Laboratory
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase italic">Theme Orchestrator</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            Engineering platform visuals. Managing core templates, tiered aesthetic availability, and design systems for total ecosystem consistency.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <button
                            onClick={() => { setEditingTheme(null); setShowFormModal(true); }}
                            className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95 group"
                        >
                            <Plus size={16} className="text-emerald-600 group-hover:rotate-90 transition-transform" />
                            Synthesize Theme
                        </button>
                    </div>
                </div>
            </div>

            {/* VISUAL DISTRIBUTION GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <CompactStatCard label="Total Blueprints" value={stats.total} icon={Layers} color="slate" />
                <CompactStatCard label="Live Templates" value={stats.active} icon={CheckCircle2} color="emerald" />
                <CompactStatCard label="Premium Designs" value={stats.premium} icon={DollarSign} color="amber" />
                <CompactStatCard label="Standard Tier" value={stats.free} icon={Activity} color="emerald" />
            </div>

            {/* TIER-FOCUSED FILTERING */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Tier Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar">
                        <ModernTabButton active={tierFilter === 'all'} onClick={() => setTierFilter('all')} label="All Tiers" />
                        <ModernTabButton active={tierFilter === 'free'} onClick={() => setTierFilter('free')} label="Standard (Free)" />
                        <ModernTabButton active={tierFilter === 'premium'} onClick={() => setTierFilter('premium')} label="Elite (Paid)" />
                    </div>

                    <div className="h-8 w-px bg-slate-100 hidden lg:block"></div>

                    {/* Status Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar">
                        <ModernTabButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All Status" />
                        <ModernTabButton active={statusFilter === 'active'} onClick={() => setStatusFilter('active')} label="Active" />
                        <ModernTabButton active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')} label="Inactive" />
                    </div>

                    {/* Integrated Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Scan themes by name or design philosophy..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-[2rem] text-[13px] font-bold focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* THEME MATRIX GRID */}
            <div>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredThemes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredThemes.map((theme) => (
                            <ThemeCard
                                key={theme.id}
                                theme={theme}
                                editingPriceId={editingPriceId}
                                tempPrice={tempPrice}
                                setTempPrice={setTempPrice}
                                onStatusToggle={handleStatusToggle}
                                onPriceEdit={handlePriceEdit}
                                onPriceSave={handlePriceSave}
                                onPriceCancel={() => setEditingPriceId(null)}
                                onPreview={(theme: any) => window.open(`/admin/themes/preview/${theme.id}`, '_blank')}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border border-slate-100 py-32 text-center shadow-xl shadow-slate-200/50">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <Palette size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Zero Blueprints Detected</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 px-10">
                            The current search parameters do not match any synthesized designs in the matrix.
                        </p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showFormModal && <ThemeFormModal onClose={() => setShowFormModal(false)} onSuccess={fetchThemes} initialData={editingTheme} />}
            {showPreviewModal && previewTheme && <PreviewModal theme={previewTheme} onClose={() => setShowPreviewModal(false)} />}
        </div>
    );
}

// COMPACT UI BLOCKS

function CompactStatCard({ label, value, icon: Icon, color }: any) {
    const config: any = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-900/5",
        amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-900/5",
        red: "bg-red-50 text-red-600 border-red-100 shadow-red-900/5",
        slate: "bg-slate-900 text-white border-slate-800 shadow-xl shadow-slate-900/10",
    };

    return (
        <div className={`rounded-[2.5rem] p-7 border ${config[color] || config.emerald} group transition-all hover:-translate-y-1 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <Icon size={80} />
            </div>
            <div className="flex items-center justify-between mb-6">
                <div className={`p-2.5 rounded-2xl ${color === 'slate' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {color !== 'slate' && (
                    <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                        <TrendingUp size={12} /> Live
                    </div>
                )}
            </div>
            <div className="text-2xl font-black tracking-tighter mb-0.5 uppercase italic leading-none">{value}</div>
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${color === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
        </div>
    );
}

function ModernTabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-white transition-colors'
                }`}
        >
            {label}
        </button>
    );
}

function ThemeCard({ theme, editingPriceId, tempPrice, onStatusToggle, onPriceEdit, onPriceSave, onPriceCancel, onPreview, onEdit, onDelete, setTempPrice }: any) {
    const colors = theme.defaultProperties?.colors || { primary: '#ccc', secondary: '#ccc', background: '#fff' };
    const [imgError, setImgError] = useState(false);

    const getImageUrl = (url: string | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:7000';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${cleanBase}${cleanUrl}`;
    };

    const thumbnailUrl = getImageUrl(theme.thumbnailUrl);

    return (
        <div className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500 flex flex-col relative">
            {/* Preview Chamber */}
            <div className="h-52 bg-slate-50 relative overflow-hidden">
                {thumbnailUrl && !imgError ? (
                    <img
                        src={thumbnailUrl}
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 p-8 flex flex-col gap-3" style={{ backgroundColor: colors.background }}>
                        <div className="h-5 w-1/2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                        <div className="flex gap-3 mt-4">
                            <div className="h-24 w-1/4 rounded-[1.5rem] bg-slate-200/50"></div>
                            <div className="flex-1 space-y-3 pt-2">
                                <div className="h-2 w-full rounded-full bg-slate-200/30"></div>
                                <div className="h-2 w-2/3 rounded-full bg-slate-200/30"></div>
                                <div className="h-8 w-1/3 rounded-xl mt-4" style={{ backgroundColor: colors.secondary }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visual Identity Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.15em] text-slate-900 shadow-xl border border-white/50">
                        {theme.category || 'General Hub'}
                    </span>
                    <div className="flex gap-1.5 p-1.5 rounded-xl bg-white/40 backdrop-blur-md border border-white/30">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: colors.primary }}></div>
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: colors.secondary }}></div>
                    </div>
                </div>

                {/* Status Toggle HUD */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => onStatusToggle(theme.id, theme.status)}
                        className={`p-2.5 rounded-xl backdrop-blur-md border shadow-lg transition-all active:scale-90 ${theme.status === 'active'
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-white/90 border-slate-200 text-slate-400'
                            }`}
                        title={theme.status === 'active' ? 'Deactivate Node' : 'Initialize Node'}
                    >
                        <Power size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-slate-950 text-xl tracking-tighter uppercase italic">{theme.name}</h3>
                        <StatusIndicator status={theme.status} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-2 leading-relaxed italic">
                        {theme.description || 'No blueprint documentation found in records.'}
                    </p>
                </div>

                <div className="mt-auto space-y-6">
                    {/* Tier Orchestrator */}
                    <div className="flex items-center justify-between py-5 px-6 bg-slate-50/80 rounded-[2rem] border border-slate-100 group/tier">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${theme.isPremium ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <DollarSign size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Tier</span>
                        </div>

                        {editingPriceId === theme.id ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(Number(e.target.value))}
                                    className="w-20 px-3 py-1.5 text-xs font-black bg-white border border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none"
                                    min="0"
                                />
                                <button onClick={() => onPriceSave(theme.id, tempPrice > 0)} className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/20 active:scale-90">
                                    <Check size={14} />
                                </button>
                                <button onClick={onPriceCancel} className="p-2 bg-slate-200 text-slate-600 rounded-xl active:scale-90">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onPriceEdit(theme)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${theme.isPremium
                                    ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200'
                                    } hover:scale-105 active:scale-95`}
                            >
                                {theme.isPremium ? `Elite: ৳${Number(theme.price).toFixed(0)}` : 'Standard: Free'}
                            </button>
                        )}
                    </div>

                    {/* Matrix Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onPreview(theme)}
                            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] bg-[#022c22] text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/30 active:scale-95 group/preview"
                        >
                            <Eye size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            Visual Audit
                        </button>
                        <button
                            onClick={() => onEdit(theme)}
                            className="p-4 rounded-[1.5rem] bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-100 hover:border-emerald-100 active:scale-95"
                            title="Refactor Blueprint"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(theme.id)}
                            className="p-4 rounded-[1.5rem] bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100 active:scale-95"
                            title="Purge Design"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusIndicator({ status }: { status: string }) {
    const active = status === 'active';
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${active ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
            <span className={`w-1 h-1 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-300'}`}></span>
            {status}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-52 bg-slate-50"></div>
            <div className="p-8 space-y-6">
                <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-slate-50 rounded-lg"></div>
                    <div className="h-4 w-1/2 bg-slate-50 rounded-lg"></div>
                </div>
                <div className="h-16 bg-slate-50 rounded-[2rem]"></div>
                <div className="flex gap-3">
                    <div className="h-14 flex-1 bg-slate-50 rounded-[1.5rem]"></div>
                    <div className="h-14 w-14 bg-slate-50 rounded-[1.5rem]"></div>
                    <div className="h-14 w-14 bg-slate-50 rounded-[1.5rem]"></div>
                </div>
            </div>
        </div>
    );
}

// Color Picker Component
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="color"
                        className="h-10 w-10 rounded-xl cursor-pointer border-none p-0 bg-transparent"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <div className="absolute inset-0 rounded-xl border-2 border-slate-100 pointer-events-none"></div>
                </div>
                <span className="text-xs font-black text-slate-900 font-mono tracking-tighter uppercase">{value}</span>
            </div>
        </div>
    );
}

// PREVIEW & FORM MODALS (Maintained complex logic)

function PreviewModal({ theme, onClose }: { theme: Theme; onClose: () => void }) {
    const colors = theme.defaultProperties?.colors || { primary: '#059669', secondary: '#d97706', background: '#ffffff', text: '#0f172a' };
    const fonts = theme.defaultProperties?.fonts || { heading: 'Inter', body: 'Inter' };
    const [imgError, setImgError] = useState(false);

    const getImageUrl = (url: string | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:7000';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${cleanBase}${cleanUrl}`;
    };

    const thumbnailUrl = getImageUrl(theme.thumbnailUrl);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">{theme.name}</h2>
                            <span className="px-3 py-1 rounded-full bg-[#022c22] text-emerald-400 text-[9px] font-black uppercase tracking-widest">{theme.category || 'General'}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">{theme.description || 'Design Blueprint Visualization'}</p>
                    </div>
                    <button onClick={onClose} className="p-4 rounded-2xl bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95 group">
                        <X size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Preview Master Content */}
                <div className="p-10 overflow-y-auto no-scrollbar">
                    <div className="rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl shadow-slate-200/50 relative min-h-[400px]" style={{ backgroundColor: colors.background }}>
                        {thumbnailUrl && !imgError && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={thumbnailUrl}
                                    alt={theme.name}
                                    className="w-full h-full object-cover opacity-20"
                                    onError={() => setImgError(true)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                            </div>
                        )}
                        <div className="p-12 space-y-12 relative z-10">
                            {/* Cinematic Header Preview */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b" style={{ borderColor: `${colors.primary}20` }}>
                                <div className="space-y-4 text-center md:text-left">
                                    <h1 className="text-5xl font-black tracking-tighter uppercase italic" style={{ color: colors.primary, fontFamily: fonts.heading }}>
                                        Event Alpha
                                    </h1>
                                    <p className="text-lg font-bold opacity-60 italic" style={{ color: colors.text, fontFamily: fonts.body }}>
                                        January 20, 2026 // Dhaka Digital Hub
                                    </p>
                                </div>
                                <button className="px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:-translate-y-1 active:scale-95" style={{ backgroundColor: colors.primary }}>
                                    Secure Access
                                </button>
                            </div>

                            {/* Lifestyle Mockup Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-8">
                                    <p className="text-2xl font-bold leading-relaxed tracking-tight" style={{ color: colors.text, fontFamily: fonts.body }}>
                                        Experiencing the next iteration of event technology through the lens of <span className="italic" style={{ color: colors.primary }}>{theme.name}</span> aesthetics. This blueprint defines the visual language and interaction patterns for the entire ecosystem.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg" style={{ backgroundColor: colors.secondary, color: '#fff' }}>
                                            Primary Linkage
                                        </button>
                                        <button className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 bg-transparent" style={{ borderColor: colors.primary, color: colors.primary }}>
                                            Secondary Protocol
                                        </button>
                                    </div>
                                </div>
                                <div className="rounded-[2rem] p-8 shadow-inner flex flex-col justify-between aspect-square" style={{ backgroundColor: `${colors.primary}10` }}>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: colors.primary }}>Matrix Details</h3>
                                    <div className="space-y-2 opacity-80" style={{ color: colors.text }}>
                                        <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Clock size={14} /> T-Minus 42 Days</p>
                                        <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> Capacity Peak</p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t" style={{ borderColor: `${colors.primary}20` }}>
                                        <div className="w-full h-2 rounded-full overflow-hidden bg-white/50">
                                            <div className="h-full w-2/3" style={{ backgroundColor: colors.primary }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Color Matrix */}
                            <div className="pt-10 border-t" style={{ borderColor: `${colors.primary}20` }}>
                                <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em]">Chromatic Core Protocols</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <PaletteEntry label="Primary Flow" value={colors.primary} />
                                    <PaletteEntry label="Secondary Sync" value={colors.secondary} />
                                    <PaletteEntry label="Canvas Layer" value={colors.background} />
                                    <PaletteEntry label="Type Matrix" value={colors.text} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaletteEntry({ label, value }: { label: string; value: any }) {
    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center group">
            <div className="h-20 rounded-2xl shadow-xl mb-4 border-4 border-slate-50 transition-transform group-hover:scale-105" style={{ backgroundColor: value }}></div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs font-black text-slate-900 font-mono tracking-tighter uppercase">{value}</p>
        </div>
    );
}

function ThemeFormModal({ onClose, onSuccess, initialData }: { onClose: () => void; onSuccess: () => void; initialData?: Theme | null }) {
    const isEditing = !!initialData;
    const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || ('general' as ThemeCategory),
        price: initialData?.price || 0,
        thumbnailUrl: initialData?.thumbnailUrl || '',
        primaryColor: initialData?.defaultProperties?.colors?.primary || '#10b981',
        secondaryColor: initialData?.defaultProperties?.colors?.secondary || '#f59e0b',
        backgroundColor: initialData?.defaultProperties?.colors?.background || '#ffffff',
        textColor: initialData?.defaultProperties?.colors?.text || '#020617',
        headingFont: initialData?.defaultProperties?.fonts?.heading || 'Outfit',
        bodyFont: initialData?.defaultProperties?.fonts?.body || 'Inter',
        isPremium: initialData?.isPremium || false
    });

    const [templateStructureJson, setTemplateStructureJson] = useState(
        initialData?.templateStructure
            ? JSON.stringify(initialData.templateStructure, null, 2)
            : JSON.stringify({ sections: { hero: { enabled: true, order: 1 }, about: { enabled: true, order: 2 }, tickets: { enabled: true, order: 3 } } }, null, 2)
    );
    const [defaultContentJson, setDefaultContentJson] = useState(
        initialData?.defaultContent
            ? JSON.stringify(initialData.defaultContent, null, 2)
            : JSON.stringify({ hero: { title: "Nexus Summit 2026", subtitle: "Orchestrating the Future of Digital Assets" } }, null, 2)
    );

    const [loading, setLoading] = useState(false);
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setJsonError(null);

        try {
            let templateStructure, defaultContent;
            try {
                templateStructure = JSON.parse(templateStructureJson);
                defaultContent = JSON.parse(defaultContentJson);
            } catch (err) {
                setJsonError('SYNTAX_FAILURE: INVALID_JSON_PAYLOAD');
                setLoading(false);
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                isPremium: formData.isPremium,
                price: formData.isPremium ? Number(formData.price) : 0,
                thumbnailUrl: formData.thumbnailUrl,
                defaultProperties: {
                    colors: {
                        primary: formData.primaryColor,
                        secondary: formData.secondaryColor,
                        background: formData.backgroundColor,
                        text: formData.textColor
                    },
                    fonts: {
                        heading: formData.headingFont,
                        body: formData.bodyFont
                    },
                    layout: 'grid'
                },
                templateStructure,
                defaultContent
            };

            if (isEditing && initialData) {
                await adminService.updateTheme(initialData.id, payload);
            } else {
                await adminService.createTheme(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(isEditing ? 'Failed to update theme' : 'Failed to create theme', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto no-scrollbar">
            <div className="bg-white p-10 rounded-[3rem] w-full max-w-3xl shadow-2xl my-10 relative">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#022c22] text-emerald-400 flex items-center justify-center shadow-lg">
                                <Layers size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">{isEditing ? 'Blueprint Refactor' : 'Master Synthesis'}</h2>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isEditing ? 'Optimizing design parameters' : 'Constructing a new aesthetic foundation'}</p>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs Hub */}
                <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-600'}`}
                    >
                        Core Parameters
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'advanced' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-600'}`}
                    >
                        JSON Matrix
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Identity Tag</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-[13px] font-bold italic text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Aesthetic Node Name..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Design Category</label>
                                        <select
                                            className="w-full px-5 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-[13px] font-bold uppercase text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as ThemeCategory })}
                                        >
                                            <option value="general">Global Template</option>
                                            <option value="music">Symphonic (Music)</option>
                                            <option value="jobfair">Corporate Flow (Job)</option>
                                            <option value="expo">Vast Grid (Expo)</option>
                                            <option value="conference">Oratory (Conf)</option>
                                            <option value="sports">Direct Action (Sports)</option>
                                            <option value="festival">Vibrant Soul (Fest)</option>
                                        </select>
                                    </div>
                                    <div className="pt-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Visual Preview Vector (URL)</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="url"
                                                className="w-full pl-14 pr-5 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                                value={formData.thumbnailUrl}
                                                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                                placeholder="https://assets.cdn/blueprint.jpg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-900 border-b border-slate-50 pb-2 uppercase tracking-[0.2em] mb-4">Chromatic Orchestration</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ColorPicker label="Primary Flow" value={formData.primaryColor} onChange={(v) => setFormData({ ...formData, primaryColor: v })} />
                                        <ColorPicker label="Secondary Sync" value={formData.secondaryColor} onChange={(v) => setFormData({ ...formData, secondaryColor: v })} />
                                        <ColorPicker label="Base Canvas" value={formData.backgroundColor} onChange={(v) => setFormData({ ...formData, backgroundColor: v })} />
                                        <ColorPicker label="Type Matrix" value={formData.textColor} onChange={(v) => setFormData({ ...formData, textColor: v })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-black uppercase" value={formData.headingFont} onChange={(e) => setFormData({ ...formData, headingFont: e.target.value })}>
                                            <option value="Outfit">Outfit (Mod)</option>
                                            <option value="Inter">Inter (Clean)</option>
                                            <option value="Montserrat">Mont (Bold)</option>
                                            <option value="Playfair Display">Playfair (Lux)</option>
                                        </select>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-black uppercase" value={formData.bodyFont} onChange={(e) => setFormData({ ...formData, bodyFont: e.target.value })}>
                                            <option value="Inter">Inter (Swiss)</option>
                                            <option value="Roboto">Robo (Tech)</option>
                                            <option value="Open Sans">Open (Web)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#022c22] p-8 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-900/40 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className={`p-4 rounded-2xl transition-all ${formData.isPremium ? 'bg-amber-400 text-amber-950 scale-110 shadow-xl shadow-amber-900/20' : 'bg-white/10 text-white'}`}>
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Elite Availability</p>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="isPremium"
                                                className="h-5 w-5 rounded-lg border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-500"
                                                checked={formData.isPremium}
                                                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                                            />
                                            <label htmlFor="isPremium" className="text-base font-black uppercase italic tracking-tighter cursor-pointer">Premium blueprint status</label>
                                        </div>
                                    </div>
                                </div>

                                {formData.isPremium && (
                                    <div className="relative z-10 w-full sm:w-auto overflow-hidden">
                                        <label className="block text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-2 px-1">Tier Valuation (BDT)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-400 text-sm">৳</div>
                                            <input
                                                type="number"
                                                className="w-full sm:w-40 pl-8 pr-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-sm font-black text-white focus:bg-white/20 outline-none transition-all"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'advanced' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            {jsonError && (
                                <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 border border-red-100">
                                    <Shield size={16} />
                                    {jsonError}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Template Architecture (JSON Structure)</label>
                                <textarea
                                    className="w-full px-6 py-5 rounded-[2rem] bg-slate-950 text-emerald-400 font-mono text-[11px] focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all resize-none h-40 no-scrollbar"
                                    value={templateStructureJson}
                                    onChange={(e) => setTemplateStructureJson(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Default Node Content (Mock Matrix)</label>
                                <textarea
                                    className="w-full px-6 py-5 rounded-[2rem] bg-slate-950 text-emerald-400 font-mono text-[11px] focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all resize-none h-40 no-scrollbar"
                                    value={defaultContentJson}
                                    onChange={(e) => setDefaultContentJson(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 rounded-[2rem] bg-[#022c22] text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 group"
                    >
                        {loading ? (
                            <div className="h-5 w-5 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin"></div>
                        ) : (
                            <Zap size={16} className="text-emerald-400 fill-current group-hover:scale-125 transition-transform" />
                        )}
                        {isEditing ? 'Execute Master Refactor' : 'Initialize Design Cycle'}
                    </button>
                </form>
            </div>
        </div>
    );
}
