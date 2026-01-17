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
    const ticketTypeId = searchParams.get('ticketTypeId');
    const initialQty = parseInt(searchParams.get('qty') || '1');

    const [event, setEvent] = useState<any>(null);
    const [ticketType, setTicketType] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'nagad'>('card');
    const [discountCode, setDiscountCode] = useState('');

    const [user, setUser] = useState<any>(null); // Store user details

    useEffect(() => {
        const init = async () => {
            if (!eventId || !ticketTypeId) {
                setLoading(false);
                return;
            }

            try {
                // Fetch User Details
                const profile = await attendeeService.getProfile();
                setUser(profile);

                // Determine event details
                const eventData = await attendeeService.getEventDetails(eventId);
                setEvent(eventData);

                // Find specific ticket type
                if (eventData && eventData.ticket_types) {
                    const found = eventData.ticket_types.find((t: any) => t.id === ticketTypeId);
                    setTicketType(found);
                }
            } catch (e) {
                console.error("Setup failed", e);
                setError("Could not load checkout details. Please try logging in again.");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [eventId, ticketTypeId]);

    const subtotal = ticketType ? ticketType.price_taka * initialQty : 0;
    const fees = Math.floor(subtotal * 0.02); // 2% platform fee mock
    const discount = 0; // Implement discount logic API later
    const total = subtotal + fees - discount;

    const handlePlaceOrder = async () => {
        setProcessing(true);
        setError('');
        try {
            if (!eventId || !ticketTypeId) throw new Error("Invalid order parameters");
            if (!user) throw new Error("User information missing. Please login.");

            // API Call
            await attendeeService.createOrder(
                eventId, 
                [{ typeId: ticketTypeId, quantity: initialQty }],
                { name: user.name, email: user.email },
                paymentMethod,
                discountCode 
            );
            
            setSuccess(true);
            // Redirect after delay
            setTimeout(() => {
                router.push('/attendee/tickets');
            }, 2000);

        } catch (err: any) {
            console.error("Order failed", err);
            setError(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

    if (!eventId || !ticketTypeId || !event || !ticketType) {
        return (
            <div className="text-center p-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-800">Invalid Checkout Link</h1>
                <p className="text-slate-500 mb-6">Please start from the event page.</p>
                <button onClick={() => router.back()} className="btn btn-primary">Go Back</button>
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
                <button onClick={() => router.push('/attendee/tickets')} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
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
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="font-bold text-slate-900">{ticketType.name}</p>
                                <p className="text-sm text-slate-500">{event.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900">৳{ticketType.price_taka} x {initialQty}</p>
                                <p className="text-sm text-emerald-600 font-bold">৳{subtotal}</p>
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
                            <div className="flex justify-between text-emerald-600">
                                <span>Discount</span>
                                <span className="font-medium">-৳{discount}</span>
                            </div>
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
