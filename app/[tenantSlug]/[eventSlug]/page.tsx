'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, Tag, ShoppingCart, Loader2, AlertCircle, Plus, Minus, Share2, Heart, Info } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface TicketType {
    id: string;
    name: string;
    description: string;
    price_taka: number;
    quantity_available: number;
    status: string;
    selectedQuantity: number;
}

export default function PublicEventPage() {
    const params = useParams();
    const router = useRouter();
    const tenantSlug = params.tenantSlug as string;
    const eventSlug = params.eventSlug as string;

    const [event, setEvent] = useState<any>(null);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                
                // Fetch event data from public API
                const eventRes = await fetch(
                    `http://localhost:7000/public/${tenantSlug}/${eventSlug}`,
                    { cache: 'no-store' }
                );

                if (!eventRes.ok) {
                    throw new Error('Event not found');
                }

                const eventData = await eventRes.json();
                console.log('Event data:', eventData);
                
                // Public API returns { event: {...} } structure
                setEvent(eventData.event || eventData);

                // Fetch tickets for this event
                const fetchedEvent = eventData.event || eventData;
                if (fetchedEvent?.id) {
                    const ticketsRes = await fetch(
                        `http://localhost:7000/tickets/event/${fetchedEvent.id}`,
                        { cache: 'no-store' }
                    );

                    if (ticketsRes.ok) {
                        const ticketsData = await ticketsRes.json();
                        console.log('Tickets data:', ticketsData);
                        
                        // Initialize tickets with selection state
                        const typesWithSelection = ticketsData.map((tt: any) => ({
                            id: tt.id,
                            name: tt.name,
                            description: tt.description || 'Standard ticket',
                            price_taka: tt.price_taka,
                            quantity_available: tt.quantity_available,
                            status: tt.status
                        }));
                        setTicketTypes(typesWithSelection);
                    }
                }
            } catch (err: any) {
                console.error('Failed to load event:', err);
                setError(err.message || 'Failed to load event details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (tenantSlug && eventSlug) {
            fetchEvent();
        }
    }, [tenantSlug, eventSlug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
                    <p className="text-slate-600 font-medium">Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h1>
                    <p className="text-slate-600 mb-6">{error || "This event doesn't exist or has been removed."}</p>
                    <Link href="/" className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    // Format date and time
    const eventDate = event.startAt ? new Date(event.startAt) : null;
    const formattedDate = eventDate ? eventDate.toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
    }) : 'TBA';
    const formattedTime = eventDate ? eventDate.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit'
    }) : 'TBA';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-black text-slate-900 tracking-tight">
                            {event.tenant?.name || tenantSlug}
                        </Link>
                        <div className="flex items-center gap-3">
                            <button className="btn btn-sm btn-ghost btn-circle">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="btn btn-sm btn-ghost btn-circle">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <Link 
                                href="/attendee/auth/login" 
                                className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-[500px] bg-slate-900">
                <img 
                    src={event.imageUrl || event.bannerImages?.[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920'} 
                    alt={event.name}
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                
                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="badge bg-emerald-500 text-white border-none font-bold px-4 py-3 text-xs uppercase">
                                    {event.status}
                                </span>
                                {event.category && (
                                    <span className="badge bg-white/10 backdrop-blur-sm text-white border-white/20 font-semibold px-4 py-3 text-xs">
                                        {event.category}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                                {event.name}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-semibold">{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span className="font-semibold">{formattedTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-semibold">
                                        {event.venue || 'Venue TBA'}{event.city ? `, ${event.city}` : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                    <Info className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">About This Event</h2>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {event.description || event.fullDescription || "No description available."}
                                </p>
                            </div>
                        </div>

                        {/* Event Info Grid */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Event Details</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Venue</p>
                                    <p className="text-lg font-bold text-slate-900">{event.venue || 'TBA'}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">City</p>
                                    <p className="text-lg font-bold text-slate-900">{event.city || 'TBA'}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Date</p>
                                    <p className="text-lg font-bold text-slate-900">{formattedDate}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Time</p>
                                    <p className="text-lg font-bold text-slate-900">{formattedTime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Types */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                    <Tag className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Available Tickets</h2>
                            </div>

                            {ticketTypes.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl">
                                    <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No tickets available for this event yet.</p>
                                    <p className="text-sm mt-2">Check back later for ticket sales.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ticketTypes.map((ticket) => (
                                        <div 
                                            key={ticket.id} 
                                            className="p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{ticket.name}</h3>
                                                    <p className="text-sm text-slate-600 mb-3">{ticket.description}</p>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Users className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            {ticket.quantity_available > 0 
                                                                ? `${ticket.quantity_available} available` 
                                                                : 'Sold out'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-black text-emerald-600">৳{ticket.price_taka}</div>
                                                    <p className="text-xs text-slate-500 mt-1">per ticket</p>
                                                </div>
                                            </div>

                                            {/* Purchase Button */}
                                            <div className="pt-4 border-t border-slate-200">
                                                <Link
                                                    href={`/attendee/auth/login?redirect=/attendee/dashboard/events/${event.id}`}
                                                    className={`w-full py-3 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
                                                        ticket.quantity_available > 0
                                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {ticket.quantity_available > 0 ? (
                                                        <>
                                                            <ShoppingCart className="w-5 h-5" />
                                                            Sign In to Purchase
                                                        </>
                                                    ) : (
                                                        'Sold Out'
                                                    )}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Event Info Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-3xl shadow-xl sticky top-24">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black mb-2">Ready to Join?</h3>
                                    <p className="text-emerald-100 text-sm">
                                        Sign in to purchase tickets and secure your spot at this amazing event!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href={`/attendee/auth/login?redirect=/attendee/dashboard/events/${event.id}`}
                                        className="block w-full py-4 bg-white text-emerald-600 font-bold rounded-xl text-center hover:bg-emerald-50 transition-all shadow-lg"
                                    >
                                        Sign In to Purchase
                                    </Link>
                                    <Link
                                        href="/attendee/auth/signup"
                                        className="block w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-center transition-all"
                                    >
                                        Create Account
                                    </Link>
                                </div>

                                <div className="pt-6 border-t border-emerald-500/30">
                                    <div className="space-y-3 text-sm text-emerald-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{formattedTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.venue}, {event.city}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-emerald-500/30 text-center">
                                    <p className="text-xs text-emerald-200">
                                        🔒 Secure booking • Instant confirmation
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-black mb-4">{event.tenant?.name || 'TicketBD'}</h3>
                            <p className="text-slate-400 text-sm">Your trusted event ticketing platform in Bangladesh.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/attendee/auth/login" className="hover:text-white transition-colors">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-3">Contact</h4>
                            <p className="text-sm text-slate-400">support@ticketbd.com</p>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} {event.tenant?.name || 'TicketBD'}. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
