'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, Tag, ShoppingCart, Loader2, AlertCircle, ChevronLeft, Plus, Minus } from 'lucide-react';
import { attendeeService } from '@/services/attendeeService';
import Link from 'next/link';

interface TicketTypeSelection {
    id: string;
    name: string;
    description: string;
    price_taka: number;
    quantity_available: number;
    selectedQuantity: number;
}

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<any>(null);
    const [ticketTypes, setTicketTypes] = useState<TicketTypeSelection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await attendeeService.getEventDetails(eventId);
                setEvent(eventData);

                // Initialize ticket types with selection state
                if (eventData.ticket_types) {
                    const typesWithSelection = eventData.ticket_types.map((tt: any) => ({
                        id: tt.id,
                        name: tt.name,
                        description: tt.description,
                        price_taka: tt.price_taka,
                        quantity_available: tt.quantity_available,
                        status: tt.status,
                        selectedQuantity: 0
                    }));
                    setTicketTypes(typesWithSelection);
                }
            } catch (err) {
                console.error("Failed to load event", err);
                setError("Failed to load event details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const updateQuantity = (ticketTypeId: string, delta: number) => {
        setTicketTypes(prev => prev.map(tt => {
            if (tt.id === ticketTypeId) {
                const newQuantity = Math.max(0, Math.min(tt.quantity_available, tt.selectedQuantity + delta));
                return { ...tt, selectedQuantity: newQuantity };
            }
            return tt;
        }));
    };

    const getTotalTickets = () => {
        return ticketTypes.reduce((sum, tt) => sum + tt.selectedQuantity, 0);
    };

    const getTotalPrice = () => {
        return ticketTypes.reduce((sum, tt) => sum + (tt.price_taka * tt.selectedQuantity), 0);
    };

    const handleProceedToCheckout = () => {
        console.log('Proceed to checkout clicked');
        console.log('Ticket types:', ticketTypes);
        
        const selectedItems = ticketTypes
            .filter(tt => tt.selectedQuantity > 0)
            .map(tt => ({ ticket_type_id: tt.id, quantity: tt.selectedQuantity }));

        console.log('Selected items:', selectedItems);

        if (selectedItems.length === 0) {
            alert("Please select at least one ticket");
            return;
        }

        try {
            // Encode cart as query parameter
            const cartParam = encodeURIComponent(JSON.stringify(selectedItems));
            const checkoutUrl = `/attendee/dashboard/checkout?eventId=${eventId}&cart=${cartParam}`;
            console.log('Navigating to:', checkoutUrl);
            router.push(checkoutUrl);
        } catch (error) {
            console.error('Navigation error:', error);
            alert('Failed to proceed to checkout. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-800 mb-2">Event Not Found</h1>
                <p className="text-slate-500 mb-6">{error || "This event doesn't exist or has been removed."}</p>
                <Link href="/attendee/dashboard/events" className="btn btn-primary">
                    Back to Events
                </Link>
            </div>
        );
    }

    const totalTickets = getTotalTickets();
    const totalPrice = getTotalPrice();

    return (
        <div className="space-y-8 pb-20">
            {/* Back Button */}
            <Link 
                href="/attendee/dashboard/events" 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Events
            </Link>

            {/* Hero Section */}
            <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                    src={event.hero_image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200'} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="badge badge-accent mb-3 font-bold">{event.status?.toUpperCase()}</div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">{event.name}</h1>
                    <div className="flex flex-wrap gap-4 text-emerald-100">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">
                                {new Date(event.start_at).toLocaleDateString(undefined, { 
                                    weekday: 'short', 
                                    month: 'long', 
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">
                                {new Date(event.start_at).toLocaleTimeString(undefined, { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium">{event.venue}, {event.city}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Event Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Event</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {event.description || "No description available."}
                        </p>
                    </div>

                    {/* Ticket Types */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Tag className="w-6 h-6 text-emerald-600" />
                            Select Tickets
                        </h2>

                        {ticketTypes.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                No tickets available for this event.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ticketTypes.map((ticket) => (
                                    <div 
                                        key={ticket.id} 
                                        className={`p-6 rounded-2xl border-2 transition-all ${
                                            ticket.selectedQuantity > 0 
                                                ? 'border-emerald-500 bg-emerald-50/50' 
                                                : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">{ticket.name}</h3>
                                                <p className="text-sm text-slate-500">{ticket.description}</p>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                                    <Users className="w-3 h-3" />
                                                    <span>{ticket.quantity_available} available</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-emerald-600">৳{ticket.price_taka}</div>
                                            </div>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(ticket.id, -1)}
                                                    disabled={ticket.selectedQuantity === 0}
                                                    className="btn btn-sm btn-circle btn-outline border-slate-300 hover:bg-slate-100 disabled:opacity-30"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold text-lg text-slate-900">
                                                    {ticket.selectedQuantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(ticket.id, 1)}
                                                    disabled={ticket.selectedQuantity >= ticket.quantity_available}
                                                    className="btn btn-sm btn-circle btn-primary disabled:opacity-30"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {ticket.selectedQuantity > 0 && (
                                                <div className="text-sm font-bold text-emerald-600">
                                                    Subtotal: ৳{ticket.price_taka * ticket.selectedQuantity}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Cart Summary (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-emerald-600" />
                            Your Cart
                        </h3>

                        {totalTickets === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No tickets selected</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {ticketTypes
                                        .filter(tt => tt.selectedQuantity > 0)
                                        .map(tt => (
                                            <div key={tt.id} className="flex justify-between text-sm">
                                                <span className="text-slate-600">
                                                    {tt.name} x {tt.selectedQuantity}
                                                </span>
                                                <span className="font-bold text-slate-900">
                                                    ৳{tt.price_taka * tt.selectedQuantity}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="border-t border-slate-200 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-slate-900">Total</span>
                                        <span className="text-2xl font-black text-emerald-600">৳{totalPrice}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</p>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
                                >
                                    Proceed to Checkout
                                </button>
                            </>
                        )}

                        <p className="text-xs text-center text-slate-400 mt-4">
                            Secure checkout powered by SSL
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
