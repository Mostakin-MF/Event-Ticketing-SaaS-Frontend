'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Ticket, ArrowRight, QrCode, Calendar, Clock, MapPin } from 'lucide-react';
import { attendeeService } from '@/services/attendeeService';
import { authService } from '@/services/authService';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [upcomingTickets, setUpcomingTickets] = useState<any[]>([]);
    const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const userData = await authService.checkAuth();
                setUser(userData);

                const [tickets, events] = await Promise.all([
                    attendeeService.getMyTickets(),
                    attendeeService.getEvents({ limit: 3 })
                ]);
                setUpcomingTickets(tickets);
                setRecommendedEvents(events.slice(0, 3));
            } catch (e) {
                console.error("Dashboard load failed", e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-dots loading-lg text-emerald-600"></span></div>;

    const nextEvent = upcomingTickets[0]; // Assuming sorted by date

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Welcome back, <span className="text-emerald-600">{user?.name?.split(' ')[0] || 'Guest'}</span>!
                    </h1>
                    <p className="text-slate-500 mt-1">Ready for your next experience?</p>
                </div>
                <Link href="/attendee/dashboard/events" className="btn btn-primary rounded-xl font-bold">
                    <Compass className="w-4 h-4 mr-2" />
                    Browse Events
                </Link>
            </header>

            {/* Quick Stats / Next Event */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Next Event Card */}
                <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                    
                    {nextEvent ? (
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <span className="badge badge-accent font-bold">UPCOMING</span>
                                <h2 className="text-3xl font-black leading-tight">{nextEvent.event_name || 'Event Title'}</h2>
                                <div className="space-y-2 text-emerald-100 font-medium">
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(nextEvent.event_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        <MapPin className="w-4 h-4" />
                                        <span>{nextEvent.venue || 'Venue TBD'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <QrCode className="w-24 h-24 text-slate-900" />
                                <p className="text-[10px] text-center text-slate-400 font-mono mt-2">SCAN ME</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center py-8">
                            <Ticket className="w-16 h-16 text-emerald-500/50 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Upcoming Tickets</h3>
                            <p className="text-emerald-200/60 max-w-sm mx-auto mb-6">You haven't booked any events yet. Explore what's happening around you!</p>
                            <Link href="/attendee/dashboard/events" className="btn btn-outline btn-accent btn-sm rounded-full">Find Events</Link>
                        </div>
                    )}
                </div>

                {/* Stats / Actions */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Your Stats</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">LIFETIME</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-6">
                        <div className="bg-slate-50 p-4 rounded-2xl text-center">
                            <span className="block text-3xl font-black text-slate-900">{upcomingTickets.length}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Tickets</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl text-center">
                             <span className="block text-3xl font-black text-slate-900">0</span>
                             <span className="text-xs font-bold text-slate-400 uppercase">Points</span>
                        </div>
                    </div>

                    <Link href="/attendee/dashboard/tickets" className="btn btn-ghost w-full justify-between group font-bold">
                        View All Tickets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Recommended */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedEvents.map((event: any) => {
                        // Calculate minimum price from ticket types
                        const minPrice = event.ticket_types && event.ticket_types.length > 0
                            ? Math.min(...event.ticket_types.map((tt: any) => tt.price_taka))
                            : null;

                        return (
                            <Link href={`/attendee/dashboard/events/${event.id}`} key={event.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                 <div className="relative h-40 bg-slate-200 overflow-hidden">
                                    <img 
                                        src={event.hero_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=500'} 
                                        alt={event.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                 </div>
                                 <div className="p-4">
                                     <h3 className="font-bold text-slate-900 mb-1 truncate">{event.name}</h3>
                                     <p className="text-xs text-slate-500 mb-3">{new Date(event.start_at).toLocaleDateString()}</p>
                                     <div className="flex items-center justify-between">
                                         <span className="text-sm font-black text-emerald-600">৳{minPrice || '0'}</span>
                                         <span className="text-xs font-bold text-slate-400 uppercase group-hover:text-emerald-600 transition-colors">Book Now</span>
                                     </div>
                                 </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
