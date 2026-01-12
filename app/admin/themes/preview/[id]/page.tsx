'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import adminService from '@/services/adminService';
import DynamicThemeRenderer from '@/components/themes/DynamicThemeRenderer';
import { Theme } from '@/types/theme';

export default function ThemePreviewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [theme, setTheme] = useState<Theme | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        if (id) {
            fetchTheme();
        }
    }, [id]);

    const fetchTheme = async () => {
        try {
            setLoading(true);
            const data = await adminService.getThemeById(id as string);
            setTheme(data);
        } catch (error) {
            console.error('Failed to fetch theme:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
                <p className="text-xl font-medium animate-pulse">Loading Theme Preview...</p>
            </div>
        );
    }

    if (!theme) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <ArrowLeft className="text-red-500" size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-2">Theme Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-md">We couldn't find the theme you're looking for. It might have been deleted or the ID is incorrect.</p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Mock data for preview
    const mockTenant = {
        name: "Preview Event Organizers",
        slug: "preview"
    };

    const mockEvent = {
        name: 'Global Tech Summit 2026',
        startAt: '2026-05-20T09:00:00Z',
        venue: 'International Convention Center',
        city: 'Dhaka',
        themeContent: theme.defaultContent,
        themeCustomization: {
            primaryColor: theme.defaultProperties?.colors?.primary,
            secondaryColor: theme.defaultProperties?.colors?.secondary
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
            {/* Precision Toolbar */}
            <div className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        title="Back to Admin"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    <div>
                        <span className="text-white font-bold">{theme.name}</span>
                        <span className="ml-3 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Preview Mode</span>
                    </div>
                </div>

                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('tablet')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Tablet size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Smartphone size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:block">
                        Responsive Mockup View
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-slate-900 p-4 md:p-8 flex justify-center scrollbar-hide">
                <div
                    className={`bg-white shadow-2xl transition-all duration-500 ease-in-out ${viewMode === 'desktop' ? 'w-full max-w-7xl' :
                        viewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                        }`}
                    style={{ minHeight: '100%' }}
                >
                    <DynamicThemeRenderer
                        tenant={mockTenant}
                        event={mockEvent}
                        theme={theme}
                    />
                </div>
            </div>
        </div>
    );
}
