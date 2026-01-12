'use client';

import { useState, useEffect } from 'react';
import { Palette, Plus, Search, Eye, Power, DollarSign, X, Check, Edit2, Trash2 } from 'lucide-react';
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
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [tempPrice, setTempPrice] = useState<number>(0);

    useEffect(() => {
        fetchThemes();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [themes, searchTerm, statusFilter]);

    const fetchThemes = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllThemes();
            // Handle both array and paginated response
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

    const handlePreview = (theme: Theme) => {
        setPreviewTheme(theme);
        setShowPreviewModal(true);
    };

    const handleEdit = (theme: Theme) => {
        setEditingTheme(theme);
        setShowFormModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this theme?')) {
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Themes Management</h1>
                    <p className="text-slate-500 mt-1">Manage platform themes for tenants</p>
                </div>
                <button
                    onClick={() => { setEditingTheme(null); setShowFormModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Plus size={20} />
                    Create Theme
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Themes" value={stats.total} color="blue" />
                <StatCard label="Active" value={stats.active} color="emerald" />
                <StatCard label="Premium" value={stats.premium} color="amber" />
                <StatCard label="Free" value={stats.free} color="purple" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search themes by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                        />
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        <TabButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All" />
                        <TabButton active={statusFilter === 'active'} onClick={() => setStatusFilter('active')} label="Active" />
                        <TabButton active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')} label="Inactive" />
                        <TabButton active={statusFilter === 'draft'} onClick={() => setStatusFilter('draft')} label="Draft" />
                    </div>
                </div>
            </div>

            {/* Themes Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-40 bg-slate-100 rounded-xl mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredThemes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Palette size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-1">No themes found</p>
                        <p className="text-slate-500 text-sm">Try adjusting your filters or create a new theme</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredThemes.map((theme) => (
                            <ThemeCard
                                key={theme.id}
                                theme={theme}
                                editingPriceId={editingPriceId}
                                tempPrice={tempPrice}
                                onStatusToggle={handleStatusToggle}
                                onPriceEdit={handlePriceEdit}
                                onPriceSave={handlePriceSave}
                                onPriceCancel={() => setEditingPriceId(null)}
                                onPreview={(theme: any) => window.open(`/admin/themes/preview/${theme.id}`, '_blank')}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                setTempPrice={setTempPrice}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showFormModal && <ThemeFormModal onClose={() => setShowFormModal(false)} onSuccess={fetchThemes} initialData={editingTheme} />}
            {showPreviewModal && previewTheme && <PreviewModal theme={previewTheme} onClose={() => setShowPreviewModal(false)} />}
        </div>
    );
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    const colors: Record<string, string> = {
        blue: 'from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-200',
        emerald: 'from-emerald-500/10 to-emerald-600/5 text-emerald-600 border-emerald-200',
        amber: 'from-amber-500/10 to-amber-600/5 text-amber-600 border-amber-200',
        purple: 'from-purple-500/10 to-purple-600/5 text-purple-600 border-purple-200',
    };

    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${colors[color]} p-4 shadow-sm`}>
            <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
            <div className="text-xs font-medium text-slate-600">{label}</div>
        </div>
    );
}

// Tab Button Component
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${active
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                }`}
        >
            {label}
        </button>
    );
}

// Theme Card Component
function ThemeCard({ theme, editingPriceId, tempPrice, onStatusToggle, onPriceEdit, onPriceSave, onPriceCancel, onPreview, onEdit, onDelete, setTempPrice }: any) {
    // Get colors from defaultProperties or use defaults
    const colors = theme.defaultProperties?.colors || { primary: '#ccc', secondary: '#ccc', background: '#fff' };

    return (
        <div className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-500/30 transition-all">
            {/* Preview */}
            <div className="h-40 bg-slate-100 relative overflow-hidden">
                {theme.thumbnailUrl ? (
                    <img src={theme.thumbnailUrl} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 p-4 flex flex-col gap-2" style={{ backgroundColor: colors.background }}>
                        <div className="h-4 w-1/3 rounded" style={{ backgroundColor: colors.primary }}></div>
                        <div className="flex gap-2 mt-2">
                            <div className="h-24 w-1/4 rounded bg-slate-200/50"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-full rounded bg-slate-200/50"></div>
                                <div className="h-2 w-2/3 rounded bg-slate-200/50"></div>
                                <div className="h-8 w-1/3 rounded mt-2" style={{ backgroundColor: colors.secondary }}></div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-slate-100">
                        {theme.category || 'General'}
                    </span>
                </div>
            </div>

            <div className="p-5">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{theme.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{theme.description || 'No description'}</p>
                </div>

                {/* Status & Price */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onStatusToggle(theme.id, theme.status)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                        <span className={`text-xs font-semibold uppercase ${theme.status === 'active' ? 'text-emerald-600' : 'text-slate-500'
                            }`}>
                            {theme.status}
                        </span>
                    </div>

                    {/* Price Editor */}
                    {editingPriceId === theme.id ? (
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-16 px-2 py-1 text-xs border border-emerald-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                min="0"
                                step="0.01"
                            />
                            <button
                                onClick={() => onPriceSave(theme.id, tempPrice > 0)}
                                className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={onPriceCancel}
                                className="p-1.5 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onPriceEdit(theme)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                            <DollarSign size={12} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-700">
                                {theme.isPremium ? `৳${Number(theme.price).toFixed(2)}` : 'Free'}
                            </span>
                        </button>
                    )}
                </div>

                {/* Color Palette */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                        <div className="w-5 h-5 rounded-full shadow-sm border border-slate-200" style={{ backgroundColor: colors.primary }} title="Primary"></div>
                        <div className="w-5 h-5 rounded-full shadow-sm border border-slate-200" style={{ backgroundColor: colors.secondary }} title="Secondary"></div>
                        <div className="w-5 h-5 rounded-full shadow-sm border border-slate-200" style={{ backgroundColor: colors.background }} title="Background"></div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Colors</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPreview(theme)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20"
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                    <button
                        onClick={() => onEdit(theme)}
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Theme"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(theme.id)}
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Theme"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Preview Modal Component
function PreviewModal({ theme, onClose }: { theme: Theme; onClose: () => void }) {
    // Get colors or use defaults
    const colors = theme.defaultProperties?.colors || { primary: '#059669', secondary: '#d97706', background: '#ffffff', text: '#0f172a' };
    const fonts = theme.defaultProperties?.fonts || { heading: 'Inter', body: 'Inter' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{theme.name}</h2>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-600">
                            {theme.category || 'General'}
                        </span>
                        <p className="text-sm text-slate-500 mt-1">{theme.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Preview Content */}
                <div className="p-8">
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg" style={{ backgroundColor: colors.background }}>
                        <div className="p-8 space-y-6">
                            {/* Header Preview */}
                            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: `${colors.primary}20` }}>
                                <h1 className="text-3xl font-bold" style={{ color: colors.primary, fontFamily: fonts.heading }}>
                                    Event Name
                                </h1>
                                <button className="px-6 py-3 rounded-xl font-bold text-white shadow-lg" style={{ backgroundColor: colors.primary }}>
                                    Get Tickets
                                </button>
                            </div>

                            {/* Content Preview */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-4">
                                    <p className="text-lg" style={{ color: colors.text, fontFamily: fonts.body }}>
                                        This is a preview of how the theme will look on tenant sites. The colors, fonts, and layout are applied according to the theme settings.
                                    </p>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: colors.secondary, color: '#fff' }}>
                                            Secondary Action
                                        </button>
                                        <button className="px-4 py-2 rounded-lg font-semibold border-2" style={{ borderColor: colors.primary, color: colors.primary }}>
                                            Outline Button
                                        </button>
                                    </div>
                                </div>
                                <div className="rounded-xl p-4 shadow-inner" style={{ backgroundColor: `${colors.primary}10` }}>
                                    <h3 className="font-bold mb-2" style={{ color: colors.primary }}>Event Details</h3>
                                    <p className="text-sm" style={{ color: colors.text }}>Date: Jan 15, 2026</p>
                                    <p className="text-sm" style={{ color: colors.text }}>Location: Dhaka</p>
                                </div>
                            </div>

                            {/* Color Palette Display */}
                            <div className="pt-6 border-t" style={{ borderColor: `${colors.primary}20` }}>
                                <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Theme Colors</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    {Object.entries(colors).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <div className="h-16 rounded-xl shadow-md mb-2 border border-slate-200" style={{ backgroundColor: value as string }}></div>
                                            <p className="text-xs font-mono text-slate-600">{value as string}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{key}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Theme Form Modal Component (Create & Edit)
function ThemeFormModal({ onClose, onSuccess, initialData }: { onClose: () => void; onSuccess: () => void; initialData?: Theme | null }) {
    const isEditing = !!initialData;
    const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');

    // Form State
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || ('general' as ThemeCategory),
        price: initialData?.price || 0,
        thumbnailUrl: initialData?.thumbnailUrl || '',
        primaryColor: initialData?.defaultProperties?.colors?.primary || '#059669',
        secondaryColor: initialData?.defaultProperties?.colors?.secondary || '#d97706',
        backgroundColor: initialData?.defaultProperties?.colors?.background || '#ffffff',
        textColor: initialData?.defaultProperties?.colors?.text || '#0f172a',
        headingFont: initialData?.defaultProperties?.fonts?.heading || 'Inter',
        bodyFont: initialData?.defaultProperties?.fonts?.body || 'Inter',
        isPremium: initialData?.isPremium || false
    });

    // JSON State
    const [templateStructureJson, setTemplateStructureJson] = useState(
        initialData?.templateStructure
            ? JSON.stringify(initialData.templateStructure, null, 2)
            : JSON.stringify({ sections: { hero: { enabled: true, order: 1 }, about: { enabled: true, order: 2 }, tickets: { enabled: true, order: 3 } } }, null, 2)
    );
    const [defaultContentJson, setDefaultContentJson] = useState(
        initialData?.defaultContent
            ? JSON.stringify(initialData.defaultContent, null, 2)
            : JSON.stringify({ hero: { title: "Event Title", subtitle: "Join us for an amazing experience" } }, null, 2)
    );

    const [loading, setLoading] = useState(false);
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setJsonError(null);

        try {
            // Validate JSON
            let templateStructure, defaultContent;
            try {
                templateStructure = JSON.parse(templateStructureJson);
                defaultContent = JSON.parse(defaultContentJson);
            } catch (err) {
                setJsonError('Invalid JSON format in Advanced tab');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white px-8 py-8 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Theme' : 'Create New Theme'}</h2>
                        <p className="text-slate-500 text-sm">{isEditing ? 'Update theme details' : 'Create a master template for tenants'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'general' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        General Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'advanced' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Advanced (JSON)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Theme Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Neon Nights"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as ThemeCategory })}
                                        >
                                            <option value="general">General</option>
                                            <option value="music">Music Concert</option>
                                            <option value="jobfair">Job Fair</option>
                                            <option value="expo">Expo / Exhibition</option>
                                            <option value="conference">Conference</option>
                                            <option value="sports">Sports Event</option>
                                            <option value="festival">Festival</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-24"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Brief description..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Thumbnail URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={formData.thumbnailUrl}
                                            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                            placeholder="https://example.com/preview.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">Default Style</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ColorPicker label="Primary" value={formData.primaryColor} onChange={(value) => setFormData({ ...formData, primaryColor: value })} />
                                        <ColorPicker label="Secondary" value={formData.secondaryColor} onChange={(value) => setFormData({ ...formData, secondaryColor: value })} />
                                        <ColorPicker label="Background" value={formData.backgroundColor} onChange={(value) => setFormData({ ...formData, backgroundColor: value })} />
                                        <ColorPicker label="Text" value={formData.textColor} onChange={(value) => setFormData({ ...formData, textColor: value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Heading Font</label>
                                            <select className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs" value={formData.headingFont} onChange={(e) => setFormData({ ...formData, headingFont: e.target.value })}>
                                                <option value="Inter">Inter</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Montserrat">Montserrat</option>
                                                <option value="Playfair Display">Playfair Display</option>
                                                <option value="Outfit">Outfit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Body Font</label>
                                            <select className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs" value={formData.bodyFont} onChange={(e) => setFormData({ ...formData, bodyFont: e.target.value })}>
                                                <option value="Inter">Inter</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Open Sans">Open Sans</option>
                                                <option value="Lato">Lato</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isPremium"
                                        className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={formData.isPremium}
                                        onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                                    />
                                    <label htmlFor="isPremium" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                        Premium Theme
                                        <span className="block text-xs font-medium text-slate-500">Available to paid tenants only</span>
                                    </label>
                                </div>

                                {formData.isPremium && (
                                    <div className="pl-8">
                                        <label className="block text-xs font-semibold text-slate-600 mb-2">Price (BDT)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full md:w-1/2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Advanced Tab */}
                    {activeTab === 'advanced' && (
                        <div className="space-y-6">
                            {jsonError && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    {jsonError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Template Structure (JSON)</label>
                                <p className="text-xs text-slate-500 mb-2">Defines sections, enabled status, and ordering.</p>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-48"
                                    value={templateStructureJson}
                                    onChange={(e) => setTemplateStructureJson(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Default Content (JSON)</label>
                                <p className="text-xs text-slate-500 mb-2">Default text and images for the theme.</p>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-48"
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
                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>}
                        {isEditing ? 'Update Theme' : 'Create Theme'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Color Picker Component
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input type="color" className="h-10 w-10 rounded-lg cursor-pointer border border-slate-200" value={value} onChange={(e) => onChange(e.target.value)} />
                <span className="text-xs font-mono text-slate-500">{value}</span>
            </div>
        </div>
    );
}
