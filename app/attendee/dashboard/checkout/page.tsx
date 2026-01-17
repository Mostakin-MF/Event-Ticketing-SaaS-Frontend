'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { attendeeService } from '@/services/attendeeService';
import { CreditCard, Smartphone, CheckCircle, AlertCircle, Loader2, Ticket } from 'lucide-react';
// import { z } from 'zod'; // Can use zod for validation later

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Query params for pre-filling
    const eventId = searchParams.get('eventId');
    
    // Support both legacy single ticket and new cart array format
    const cartParam = searchParams.get('cart');
    const legacyTicketTypeId = searchParams.get('ticketTypeId');
    const legacyQty = searchParams.get('qty');

    const [event, setEvent] = useState<any>(null);
    const [cartItems, setCartItems] = useState<Array<{ticket_type_id: string, quantity: number, ticketType?: any}>>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'nagad'>('card');
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [validatingDiscount, setValidatingDiscount] = useState(false);

    const [user, setUser] = useState<any>(null); // Store user details

    useEffect(() => {
        const init = async () => {
            console.log('Checkout page initialized');
            console.log('Event ID:', eventId);
            console.log('Cart param:', cartParam);
            console.log('Legacy ticket type ID:', legacyTicketTypeId);
            
            if (!eventId) {
                console.error('No event ID provided');
                setLoading(false);
                return;
            }

            let caughtError: any = null;

            try {
                // Fetch User Details - this requires authentication
                console.log('Fetching user profile...');
                const profile = await attendeeService.getFullProfile();
                console.log('User profile:', profile);
                setUser(profile.data);

                // Fetch event details
                console.log('Fetching event details for:', eventId);
                const eventData = await attendeeService.getEventDetails(eventId);
                console.log('Event data:', eventData);
                setEvent(eventData);

                // Parse cart items
                let items: Array<{ticket_type_id: string, quantity: number}> = [];
                
                if (cartParam) {
                    // New cart format
                    try {
                        items = JSON.parse(decodeURIComponent(cartParam));
                        console.log('Parsed cart items:', items);
                    } catch (e) {
                        console.error("Failed to parse cart", e);
                        setError("Invalid cart data. Please go back and try again.");
                    }
                } else if (legacyTicketTypeId) {
                    // Legacy single ticket format
                    items = [{ ticket_type_id: legacyTicketTypeId, quantity: parseInt(legacyQty || '1') }];
                    console.log('Using legacy format:', items);
                }

                // Enrich cart items with ticket type details
                if (eventData && eventData.ticket_types && items.length > 0) {
                    const enrichedItems = items.map(item => {
                        const ticketType = eventData.ticket_types.find((t: any) => t.id === item.ticket_type_id);
                        return {
                            ...item,
                            ticketType
                        };
                    }).filter(item => item.ticketType); // Remove items with missing ticket types

                    console.log('Enriched cart items:', enrichedItems);
                    setCartItems(enrichedItems);
                }
            } catch (e: any) {
                caughtError = e;
                console.error("Setup failed", e);
                
                // Check if it's an authentication error (401)
                if (e.response?.status === 401) {
                    console.log('User not authenticated, redirecting to login...');
                    // Save current URL to return after login
                    const returnUrl = window.location.href;
                    router.push(`/attendee/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
                } else {
                    setError("Could not load checkout details. Please try again.");
                }
                setLoading(false);
            } finally {
                // Only set loading to false if we're not redirecting
                if (!caughtError || caughtError.response?.status !== 401) {
                    setLoading(false);
                }
            }
        };
        init();
    }, [eventId, cartParam, legacyTicketTypeId, legacyQty, router]);

    const handleValidateDiscount = async () => {
        if (!discountCode.trim() || !eventId) return;

        setValidatingDiscount(true);
        try {
            const result = await attendeeService.validateDiscountCode(eventId, discountCode);
            if (result.valid) {
                // Calculate discount amount
                const subtotal = getSubtotal();
                if (result.discount_type === 'percentage') {
                    setDiscountAmount(Math.floor(subtotal * (result.discount_value || 0) / 100));
                } else {
                    setDiscountAmount(result.discount_value || 0);
                }
                alert(`Discount applied: ${result.message || 'Success!'}`);
            } else {
                setDiscountAmount(0);
                alert(result.message || 'Invalid discount code');
            }
        } catch (err: any) {
            console.error("Discount validation failed", err);
            setDiscountAmount(0);
            alert(err.response?.data?.message || "Failed to validate discount code");
        } finally {
            setValidatingDiscount(false);
        }
    };

    const getSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            return sum + (item.ticketType?.price_taka || 0) * item.quantity;
        }, 0);
    };

    const subtotal = getSubtotal();
    const fees = Math.floor(subtotal * 0.02); // 2% platform fee
    const total = subtotal + fees - discountAmount;

    const handlePlaceOrder = async () => {
        setProcessing(true);
        setError('');
        try {
            if (!eventId) throw new Error("Invalid order parameters");
            if (cartItems.length === 0) throw new Error("No items in cart");
            if (!user) throw new Error("User information missing. Please login.");

            // Prepare items for backend (already in correct format)
            const items = cartItems.map(item => ({
                ticket_type_id: item.ticket_type_id,
                quantity: item.quantity
            }));

            // API Call with corrected DTO structure
            await attendeeService.createOrder(
                eventId, 
                items,
                { name: user.fullName, email: user.email },
                paymentMethod,
                discountCode 
            );
            
            setSuccess(true);
            // Redirect after delay
            setTimeout(() => {
                router.push('/attendee/dashboard/tickets');
            }, 2000);

        } catch (err: any) {
            console.error("Order failed", err);
            setError(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
            setProcessing(false);
        }
    };



    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

    // Show error if there was an actual error
    if (error) {
        return (
            <div className="text-center p-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-800">Checkout Error</h1>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => router.back()} className="btn btn-primary">Go Back</button>
            </div>
        );
    }

    // More specific validation with debugging
    if (!eventId) {
        return (
            <div className="text-center p-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-800">Missing Event ID</h1>
                <p className="text-slate-500 mb-6">No event ID was provided in the URL.</p>
                <button onClick={() => router.push('/attendee/dashboard/events')} className="btn btn-primary">Browse Events</button>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center p-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-800">Event Not Found</h1>
                <p className="text-slate-500 mb-6">Could not load event details. The event may no longer be available.</p>
                <p className="text-xs text-slate-400 mb-4">Event ID: {eventId}</p>
                <button onClick={() => router.push('/attendee/dashboard/events')} className="btn btn-primary">Browse Events</button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center p-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-800">Empty Cart</h1>
                <p className="text-slate-500 mb-6">No tickets selected. Please select tickets from the event page.</p>
                <p className="text-xs text-slate-400 mb-4">Cart param: {cartParam || 'none'}</p>
                <button onClick={() => router.push(`/attendee/dashboard/events/${eventId}`)} className="btn btn-primary">Back to Event</button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
                <p className="text-slate-500 mb-8 max-w-md">Your tickets have been sent to your email and are also available in your dashboard.</p>
                <button onClick={() => router.push('/attendee/dashboard/tickets')} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                    View My Tickets
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
                <p className="text-slate-500 mt-1">Complete your purchase for <span className="font-bold text-slate-700">{event.name}</span></p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Payment & Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-emerald-500" /> Order Details
                        </h2>
                        <div className="space-y-3">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-900">{item.ticketType?.name}</p>
                                        <p className="text-sm text-slate-500">{event.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">৳{item.ticketType?.price_taka} x {item.quantity}</p>
                                        <p className="text-sm text-emerald-600 font-bold">৳{(item.ticketType?.price_taka || 0) * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Discount Code Section */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Discount Code (Optional)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="input input-bordered flex-1 rounded-xl"
                                />
                                <button
                                    onClick={handleValidateDiscount}
                                    disabled={validatingDiscount || !discountCode.trim()}
                                    className="btn btn-outline rounded-xl"
                                >
                                    {validatingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-500" /> Payment Method
                        </h2>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <CreditCard className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase">Card</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('bkash')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <Smartphone className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase">bKash</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('nagad')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <Smartphone className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase">Nagad</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="md:col-span-1">
                     <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Summary</h2>

                        <div className="space-y-3 text-sm text-slate-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium">৳{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span className="font-medium">৳{fees}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span className="font-medium">-৳{discountAmount}</span>
                                </div>
                            )}
                            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-slate-900">
                                <span>Total</span>
                                <span>৳{total}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={processing}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? <Loader2 className="animate-spin" /> : 'Confirm Payment'}
                        </button>
                        
                        <p className="text-xs text-center text-slate-400 mt-4">
                            By confirming, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
