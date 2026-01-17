'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Calendar, 
    MapPin, 
    Users, 
    QrCode, 
    Search, 
    AlertTriangle, 
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { staffService } from '@/services/staffService';

interface EventStats {
    totalCapacity: number;
    totalSold: number;
    totalRemaining: number;
    ticketTypes: any[];
}

export default function StaffEventDashboard() {
    const params = useParams();
    const router = useRouter();
    const eventId = params?.slug as string;

    const [event, setEvent] = useState<any>(null);
    const [stats, setStats] = useState<EventStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (eventId) {
            fetchData();
        }
    }, [eventId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventRes, statsRes] = await Promise.all([
                staffService.getEventDetails(eventId),
                staffService.getEventCapacity(eventId)
            ]);
            // Backend returns { statusCode, message, data }
            setEvent(eventRes.data || eventRes);
            setStats(statsRes.data || statsRes);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to load event dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Event Intelligence...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Error</h2>
                <p className="text-slate-500 mb-8">{error || 'This event could not be found or you do not have access.'}</p>
                <Link href="/staff/dashboard" className="btn btn-emerald w-full">Back to Dashboard</Link>
            </div>
        );
    }

    const eventName = event.name || event.title || 'Untitled Event';
    const startDate = new Date(event.start_at || event.startDateTime);
    const location = event.venue || event.location || 'Venue TBD';
    const city = event.city || '';
    const country = event.country || '';

    const soldPercentage = stats ? Math.round((stats.totalSold / stats.totalCapacity) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Breadcrumb/Back */}
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 group font-bold text-sm uppercase tracking-wider"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to List
            </button>

            {/* Event Hero Card */}
            <div className="bg-emerald-950 text-white rounded-3xl p-8 mb-8 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            Event Operational
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-100/60 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Active Shift
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{eventName}</h1>
                    
                    <div className="grid sm:grid-cols-2 gap-6 text-emerald-100/80">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-bold">{startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                <p className="text-sm">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Onwards</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-bold">{location}</p>
                                <p className="text-sm">{city}{city && country ? ', ' : ''}{country}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Tickets Sold</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{stats?.totalSold || 0}</h3>
                        <p className="text-slate-400 text-sm mb-1">/ {stats?.totalCapacity || 0}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${soldPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Checked In</p>
                    <div className="flex items-end gap-2 text-emerald-600">
                        <h3 className="text-3xl font-black">--</h3>
                        <p className="text-slate-400 text-sm mb-1 italic text-emerald-500/50">Real-time</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold">System Sync Active</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Remaining</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-slate-900">{stats?.totalRemaining || 0}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">Capacity available for on-door sales if enabled.</p>
                </div>
            </div>

            {/* Actions Grid */}
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                Operational Tools
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                    href="/staff/scanner"
                    className="group bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-1 transition-all"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 tracking-tight">Open QR Scanner</h3>
                    <p className="text-emerald-50/80 text-sm">Validate entry tickets and check-in attendees instantly.</p>
                </Link>

                <Link 
                    href="/staff/lookup"
                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-slate-900 tracking-tight">Manual Lookup</h3>
                    <p className="text-slate-500 text-sm">Search attendees by name, email or ticket code manually.</p>
                </Link>

                <Link 
                    href="/staff/incidents"
                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-100 transition-all hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-slate-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-slate-900 tracking-tight">Report Incident</h3>
                    <p className="text-slate-500 text-sm">Log security issues or technical problems immediately.</p>
                </Link>

                <Link 
                    href="/staff/history"
                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-slate-900 tracking-tight">Shift History</h3>
                    <p className="text-slate-500 text-sm">Review your check-in logs and activity for this event.</p>
                </Link>
            </div>
        </div>
    );
}
