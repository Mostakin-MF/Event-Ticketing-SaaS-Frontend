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
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

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
        const theme = themes.find(t => t.id === themeId);
        if (theme && (!theme.isPremium || theme.price === 0)) return true; // Free themes are auto-owned
        return purchasedThemes.some(p => p.themeId === themeId && p.status === 'active');
    };

    const handlePurchaseSuccess = () => {
        setPurchasingTheme(null);
        fetchData(); // Refresh data to update ownership status
    };

    const filteredThemes = themes.filter(theme => {
        const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            theme.description.toLowerCase().includes(searchTerm.toLowerCase());

        const isFree = !theme.isPremium || theme.price === 0;
        const matchesPrice = priceFilter === 'all' ? true :
            priceFilter === 'free' ? isFree :
                priceFilter === 'paid' ? !isFree : true;

        return matchesSearch && matchesPrice;
    });

    // Merge purchased themes with free themes for the Library view
    const allLibraryThemes = [
        ...themes.filter(t => !t.isPremium || t.price === 0).map(t => ({ theme: t, themeId: t.id, status: 'active', purchasedAt: new Date().toISOString() } as any)),
        ...purchasedThemes
    ];

    // Deduplicate logic: If a free theme is also in purchasedThemes, prefer purchasedThemes so we have real purchase data if any
    const uniqueLibraryThemes = Array.from(new Map(allLibraryThemes.map(item => [item.theme.id, item])).values());




    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto p-4 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Theme Marketplace</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Browse and install themes for your events</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'marketplace'
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                            }`}
                    >
                        <ShoppingBag size={14} />
                        Marketplace
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'library'
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                            }`}
                    >
                        <Layout size={14} />
                        My Library
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[10px] ml-1">
                            {uniqueLibraryThemes.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Marketplace View */}
            {activeTab === 'marketplace' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search themes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-400 flex-shrink-0" />
                            {[
                                { id: 'all', label: 'All Themes' },
                                { id: 'free', label: 'Free' },
                                { id: 'paid', label: 'Paid' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setPriceFilter(filter.id as any)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors border ${priceFilter === filter.id
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-slate-200"></div>
                            ))}
                        </div>
                    ) : filteredThemes.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500 font-semibold text-sm">No themes found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="space-y-4">
                    {uniqueLibraryThemes.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                <Layout size={24} className="text-slate-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Your library is empty</h3>
                            <p className="text-slate-500 text-xs mb-4">Browse the marketplace to find themes for your events.</p>
                            <button
                                onClick={() => setActiveTab('marketplace')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                            >
                                Browse Marketplace
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {uniqueLibraryThemes.map(purchase => (
                                <ThemeMarketplaceCard
                                    key={purchase.theme.id}
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
        <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
            {/* Thumbnail */}
            <div className="h-36 bg-slate-100 relative overflow-hidden group-hover:brightness-105 transition-all">
                {theme.thumbnailUrl ? (
                    <img src={theme.thumbnailUrl} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <Layout size={32} />
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-white/95 backdrop-blur text-[9px] font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-slate-100/50">
                        {theme.category}
                    </span>
                </div>
                {owned && (
                    <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Check size={8} strokeWidth={4} />
                            Owned
                        </span>
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col flex-1">
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">{theme.name}</h3>
                        <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${isFree ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                            {isFree ? 'FREE' : `৳${theme.price}`}
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">{theme.description}</p>

                    {/* Features / Date */}
                    {purchaseDate && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-2">
                            <Clock size={10} />
                            Installed {new Date(purchaseDate).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto pt-2 border-t border-slate-50">
                    {owned ? (
                        <button
                            disabled
                            className="w-full py-2 rounded-lg bg-slate-50 text-slate-400 font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
                        >
                            <Check size={12} strokeWidth={3} />
                            In Library
                        </button>
                    ) : (
                        <button
                            onClick={onPurchase}
                            className={`w-full py-2 rounded-lg text-white font-bold text-xs shadow-md shadow-emerald-900/5 flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-95 ${isFree ? 'bg-blue-600' : 'bg-emerald-600'
                                }`}
                        >
                            {isFree ? (
                                <>
                                    <ShoppingBag size={12} />
                                    Install
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={12} />
                                    Buy
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
    const [isSuccess, setIsSuccess] = useState(false);
    const isFree = !theme.isPremium || theme.price === 0;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await tenantAdminService.purchaseTheme(theme.id, paymentMethod);
            setIsSuccess(true);
        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Failed to process purchase. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onSuccess}>
                <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Check size={40} strokeWidth={3} />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-2">Awesome!</h3>
                    <p className="text-slate-500 text-sm mb-8">
                        The <span className="font-bold text-slate-900">"{theme.name}"</span> theme has been successfully added to your library.
                    </p>

                    <button
                        onClick={onSuccess}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
                    >
                        Go to My Library
                    </button>

                    <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">You can now use it for your events</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">
                        {isFree ? 'Confirm Installation' : 'Confirm Purchase'}
                    </h3>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="h-12 w-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                            {theme.thumbnailUrl && <img src={theme.thumbnailUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{theme.name}</h4>
                            <p className="text-xs text-slate-500 capitalize">{theme.category}</p>
                            <p className="text-emerald-600 font-bold text-sm mt-0.5">
                                {isFree ? 'Free' : `৳${theme.price}`}
                            </p>
                        </div>
                    </div>

                    {!isFree && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Method</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['bkash', 'nagad', 'stripe', 'sslcommerz', 'demo'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`p-2.5 rounded-lg border text-xs font-bold capitalize flex items-center justify-center gap-2 ${paymentMethod === method
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <CreditCard size={12} />
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isFree && (
                        <div className="text-[10px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex gap-2">
                            <AlertCircle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            Premium theme. Charged on confirmation.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm"
                    >
                        {loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {isFree ? 'Install' : 'Pay & Install'}
                    </button>
                </div>
            </div>
        </div>
    );
}
