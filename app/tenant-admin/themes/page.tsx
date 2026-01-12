'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Check, Layout, Filter, CreditCard, ChevronRight, Star, Clock, AlertCircle } from 'lucide-react';
import { tenantAdminService } from '@/services/tenantAdminService';
import { Theme, ThemePurchase } from '@/types/theme';

export default function TenantThemesPage() {
    const [activeTab, setActiveTab] = useState<'marketplace' | 'library'>('marketplace');
    const [themes, setThemes] = useState<Theme[]>([]);
    const [purchasedThemes, setPurchasedThemes] = useState<ThemePurchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const [purchasingTheme, setPurchasingTheme] = useState<Theme | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [availableData, purchasedData] = await Promise.all([
                tenantAdminService.getAvailableThemes(),
                tenantAdminService.getPurchasedThemes()
            ]);
            setThemes(availableData);
            setPurchasedThemes(purchasedData);
        } catch (error) {
            console.error('Failed to fetch themes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to check ownership
    const isOwned = (themeId: string) => {
        return purchasedThemes.some(p => p.themeId === themeId && p.status === 'active');
    };

    const handlePurchaseSuccess = () => {
        setPurchasingTheme(null);
        fetchData(); // Refresh data to update ownership status
    };

    const filteredThemes = themes.filter(theme => {
        const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            theme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || theme.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', 'general', 'music', 'jobfair', 'expo', 'conference', 'sports', 'festival'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Theme Marketplace</h1>
                    <p className="text-slate-500 mt-1">Browse and install themes for your events</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'marketplace'
                                ? 'bg-white text-emerald-700 shadow-sm'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                            }`}
                    >
                        <ShoppingBag size={18} />
                        Marketplace
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'library'
                                ? 'bg-white text-emerald-700 shadow-sm'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                            }`}
                    >
                        <Layout size={18} />
                        My Library
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs ml-1">
                            {purchasedThemes.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Marketplace View */}
            {activeTab === 'marketplace' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search themes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <Filter size={18} className="text-slate-400" />
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors border ${categoryFilter === cat
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"></div>
                            ))}
                        </div>
                    ) : filteredThemes.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500 font-semibold">No themes found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredThemes.map(theme => (
                                <ThemeMarketplaceCard
                                    key={theme.id}
                                    theme={theme}
                                    owned={isOwned(theme.id)}
                                    onPurchase={() => setPurchasingTheme(theme)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Library View */}
            {activeTab === 'library' && (
                <div className="space-y-6">
                    {purchasedThemes.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Layout size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Your library is empty</h3>
                            <p className="text-slate-500 text-sm mb-6">Browse the marketplace to find themes for your events.</p>
                            <button
                                onClick={() => setActiveTab('marketplace')}
                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Browse Marketplace
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {purchasedThemes.map(purchase => (
                                <ThemeMarketplaceCard
                                    key={purchase.id}
                                    theme={purchase.theme}
                                    owned={true}
                                    purchaseDate={purchase.purchasedAt}
                                    onPurchase={() => { }} // No-op for owned
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Purchase Modal */}
            {purchasingTheme && (
                <PurchaseModal
                    theme={purchasingTheme}
                    onClose={() => setPurchasingTheme(null)}
                    onSuccess={handlePurchaseSuccess}
                />
            )}
        </div>
    );
}

// Components

function ThemeMarketplaceCard({ theme, owned, purchaseDate, onPurchase }: { theme: Theme; owned: boolean; purchaseDate?: string; onPurchase: () => void }) {
    const isFree = !theme.isPremium || theme.price === 0;

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full">
            {/* Thumbnail */}
            <div className="h-48 bg-slate-100 relative overflow-hidden">
                {theme.thumbnailUrl ? (
                    <img src={theme.thumbnailUrl} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <Layout size={48} />
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-slate-100">
                        {theme.category}
                    </span>
                </div>
                {owned && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Check size={10} strokeWidth={4} />
                            Owned
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-emerald-700 transition-colors">{theme.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{theme.description}</p>

                    {/* Features / Price Tag */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold border ${isFree ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {isFree ? 'FREE' : `৳${theme.price}`}
                        </div>
                        {purchaseDate && (
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={12} />
                                Installed {new Date(purchaseDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                    {owned ? (
                        <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-default flex items-center justify-center gap-2"
                        >
                            <Check size={16} />
                            Already in Library
                        </button>
                    ) : (
                        <button
                            onClick={onPurchase}
                            className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 ${isFree ? 'bg-blue-600' : 'bg-emerald-600'
                                }`}
                        >
                            {isFree ? (
                                <>
                                    <ShoppingBag size={16} />
                                    Install for Free
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={16} />
                                    Buy Now - ৳{theme.price}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Purchase Modal
function PurchaseModal({ theme, onClose, onSuccess }: { theme: Theme; onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const isFree = !theme.isPremium || theme.price === 0;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await tenantAdminService.purchaseTheme(theme.id, paymentMethod);
            onSuccess();
        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Failed to process purchase. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900">
                        {isFree ? 'Confirm Installation' : 'Confirm Purchase'}
                    </h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="h-16 w-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                            {theme.thumbnailUrl && <img src={theme.thumbnailUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{theme.name}</h4>
                            <p className="text-sm text-slate-500">{theme.category}</p>
                            <p className="text-emerald-600 font-bold mt-1">
                                {isFree ? 'Free' : `৳${theme.price}`}
                            </p>
                        </div>
                    </div>

                    {!isFree && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['bkash', 'nagad', 'stripe', 'sslcommerz'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`p-3 rounded-xl border text-sm font-semibold capitalize flex items-center justify-center gap-2 ${paymentMethod === method
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <CreditCard size={14} />
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isFree && (
                        <div className="text-xs text-slate-500 bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
                            <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            This is a premium theme. You will be charged once confirmed.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {isFree ? 'Install Now' : 'Pay & Install'}
                    </button>
                </div>
            </div>
        </div>
    );
}
