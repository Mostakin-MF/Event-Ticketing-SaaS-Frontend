'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Calendar, MapPin, Search } from 'lucide-react';
import { attendeeService } from '@/services/attendeeService';

export default function DiscoverEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await attendeeService.getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <span className="loading loading-dots loading-lg text-emerald-600"></span>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
             <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discover Events</h1>
                    <p className="text-slate-500 mt-1">Explore the best experiences around you.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search events, venues..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full pl-10 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </header>

            {filteredEvents.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900">No events found</h3>
                    <p className="text-slate-500">Try adjusting your search or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Link 
                            href={`/attendee/dashboard/events/${event.id}`} 
                            key={event.id} 
                            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                        >
                            <div className="relative h-48 bg-slate-200 overflow-hidden">
                                <img 
                                    src={event.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                                    {event.minPrice ? `From ৳${event.minPrice}` : 'Free'}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <div className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide">{event.category || 'Event'}</div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                                </div>
                                
                                <div className="mt-auto spacy-y-2 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <span>
                                            {new Date(event.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span className="truncate">{event.location || 'Online'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
