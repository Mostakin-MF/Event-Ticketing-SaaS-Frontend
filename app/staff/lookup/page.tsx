'use client';

import React, { useState } from 'react';
import { Search, Ticket, CreditCard, ArrowRight, X, AlertCircle } from 'lucide-react';
import { staffService } from '@/services/staffService';
import Link from 'next/link';
import { z } from 'zod';

// Validation Schema
const searchSchema = z.string().min(3, { message: "Search query must be at least 3 characters long." });

export default function LookupPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'orders'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError('');

    // Zod Validation
    const result = searchSchema.safeParse(searchQuery);
    if (!result.success) {
        setValidationError(result.error.issues[0].message);
        return;
    }

    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      if (activeTab === 'tickets') {
        const data = await staffService.searchTickets(searchQuery);
        setResults(Array.isArray(data) ? data : []);
      } else {
        const isEmail = searchQuery.includes('@');
        const data = await staffService.searchOrders(
          isEmail ? searchQuery : undefined,
          !isEmail ? searchQuery : undefined
        );
         setResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lookup</h1>
        <p className="text-slate-500 mt-1">Search the global database.</p>
      </header>

      {/* Search Type Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-full">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            activeTab === 'tickets' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-emerald-500'
          }`}
        >
          Tickets
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            activeTab === 'orders' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-emerald-500'
          }`}
        >
          Orders
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={activeTab === 'tickets' ? "Search Name, Email, or Ticket Code..." : "Search Order ID or Customer Email..."}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-400"
          autoFocus
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        {searchQuery && (
            <button 
                type="button"
                onClick={() => { setSearchQuery(''); setValidationError(''); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
                <X className="w-5 h-5" />
            </button>
        )}
      </form>
      
      {validationError && (
          <div className="flex items-center gap-2 text-rose-500 text-sm px-4 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              <span>{validationError}</span>
          </div>
      )}

      {/* Results Area */}
      <div>
        {loading && (
            <div className="flex justify-center py-12">
                <span className="loading loading-dots loading-lg text-emerald-500"></span>
            </div>
        )}

        {!loading && searched && results.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p>No matches found for "{searchQuery}"</p>
            </div>
        )}

        {/* Ticket Results */}
        {!loading && activeTab === 'tickets' && results.map((ticket: any) => (
            <div key={ticket.id} className="card bg-white border border-slate-100 shadow-lg shadow-slate-200/50 rounded-2xl mb-4 hover:-translate-y-1 transition-transform">
                <div className="card-body p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{ticket.attendeeName}</h3>
                            <p className="text-slate-500 text-sm font-mono">{ticket.orderNumber}</p>
                        </div>
                        <div className={`badge ${ticket.status === 'CHECKED_IN' ? 'badge-success text-white' : 'badge-ghost'} font-bold`}>
                            {ticket.status}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                         <div className="text-sm text-slate-600">
                            <span className="block font-semibold text-emerald-600">{ticket.ticketType}</span>
                            <span className="block text-xs">{ticket.seatInfo || 'General Admission'}</span>
                         </div>
                         <button className="btn btn-sm btn-circle btn-ghost bg-slate-100 text-slate-600">
                             <ArrowRight className="w-4 h-4" />
                         </button>
                    </div>
                </div>
            </div>
        ))}

        {/* Order Results */}
        {!loading && activeTab === 'orders' && results.map((order: any) => (
             <div key={order.id} className="card bg-white border border-slate-100 shadow-lg shadow-slate-200/50 rounded-2xl mb-4 hover:-translate-y-1 transition-transform">
                <div className="card-body p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-emerald-500"/>
                                <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
                            </div>
                            <h3 className="font-bold text-slate-900">{order.customerName}</h3>
                            <p className="text-xs text-slate-400">{order.email}</p>
                        </div>
                         <div className={`badge ${order.status === 'paid' ? 'badge-success text-white' : 'badge-warning'} font-bold`}>
                            {order.status}
                        </div>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-500">{order.items || 1} Items</span>
                        <span className="text-slate-900 font-bold">৳{order.amount?.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        ))}

      </div>

      {!searched && (
        <div className="text-center py-12 opacity-50">
           <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
           <p className="text-slate-400">Enter a query to start searching.</p>
        </div>
      )}
    </div>
  );
}
