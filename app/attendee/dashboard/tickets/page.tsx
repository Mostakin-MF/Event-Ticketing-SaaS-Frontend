'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, Download, QrCode } from 'lucide-react';
import { attendeeService } from '@/services/attendeeService';
import { authService } from '@/services/authService';

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchTickets = async () => {
          try {
              // Now we can just call getMyTickets() which uses the JWT token
              const ticketsData = await attendeeService.getMyTickets();
              
              const formattedTickets = ticketsData.map((t: any) => ({
                  id: t.id,
                  title: t.event_name || 'Event',
                  date: t.event_date,
                  location: t.venue,
                  type: t.ticket_type_name,
                  ticketCode: t.qr_code_payload,
                  status: t.status,
                  seat: t.seat_label || 'General Admission',
                  qrCode: t.qr_code_payload
              }));

              setTickets(formattedTickets);
          } catch (err) {
              console.error("Failed to load tickets", err);
              setError("Failed to load tickets. Please try logging in again.");
          } finally {
              setLoading(false);
          }
      };
      fetchTickets();
  }, []);

  const handleCancelTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) return;

    try {
        await attendeeService.cancelTicket(ticketId);
        // Show success message or simply reload
        alert('Ticket cancelled successfully'); 
        window.location.reload();
    } catch (err: any) {
        console.error("Cancellation failed", err);
        setError(err.response?.data?.message || "Failed to cancel ticket");
        // Clear error after 5 seconds
        setTimeout(() => setError(''), 5000);
    }
  };
    
  const filteredTickets = tickets.filter(ticket => {
      const eventDate = new Date(ticket.eventDate || ticket.date || Date.now()); // Handle different field names
      const now = new Date();
      if (activeTab === 'upcoming') return eventDate >= now;
      return eventDate < now;
  });

  if (loading) return <div className="flex justify-center py-20"><span className="loading loading-dots loading-lg text-emerald-600"></span></div>;

  return (
    <div className="space-y-6 pb-20">
       <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Tickets</h1>
        <p className="text-slate-500 mt-1">Manage your passes and entry codes.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
          <button 
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'upcoming' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('upcoming')}
          >
              Upcoming
          </button>
          <button 
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'past' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('past')}
          >
              Past Events
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTickets.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400">No {activeTab} tickets found.</p>
              </div>
          ) : filteredTickets.map(ticket => (
              <div key={ticket.id} className="relative group perspective-1000">
                 {/* Ticket Card */}
                 <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row h-full">
                     
                     {/* Left: Event Info */}
                     <div className="p-6 flex-1 bg-gradient-to-br from-white to-slate-50 relative">
                         {/* Punch Hole Decoration */}
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full sm:block hidden z-10"></div>
                         
                         <div className="badge badge-accent text-xs font-bold mb-3">{ticket.type || ticket.ticketType || 'Standard'}</div>
                         <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4">{ticket.title || ticket.eventName || 'Event Title'}</h3>
                         
                         <div className="space-y-2 text-sm text-slate-500 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                <span>{ticket.date ? new Date(ticket.date).toLocaleDateString() : 'TBA'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span>{ticket.location || ticket.venue || 'Venue TBD'}</span>
                            </div>
                         </div>

                         <div className="mt-auto">
                             <p className="text-xs text-slate-400 uppercase font-bold">Seat Info</p>
                             <p className="font-mono text-slate-700 font-bold">{ticket.seat || 'General Admission'}</p>
                         </div>
                     </div>

                     {/* Divider (Mobile only) */}
                     <div className="border-t border-dashed border-slate-300 w-full sm:hidden"></div>
                     <div className="absolute left-0 bottom-1/2 translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full sm:hidden"></div>
                     <div className="absolute right-0 bottom-1/2 translate-y-1/2 translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full sm:hidden"></div>


                     {/* Right: QR Code Action */}
                     <div className="bg-slate-900 p-6 flex flex-col items-center justify-center text-center sm:w-48 relative overflow-hidden">
                          <div className="absolute inset-0 bg-emerald-900/20"></div>
                          <QrCode className="w-16 h-16 text-white mb-3" />
                          <button className="btn btn-sm btn-white text-slate-900 font-bold w-full rounded-full shadow-lg mb-2">
                              View QR
                          </button>
                          <button className="btn btn-sm btn-outline text-white border-white/20 hover:bg-white/10 w-full rounded-full">
                              <Download className="w-3 h-3 mr-1" /> PDF
                          </button>
                          {ticket.status === 'valid' && (
                              <button 
                                onClick={() => handleCancelTicket(ticket.id)}
                                className="btn btn-xs btn-outline text-red-400 font-bold w-full rounded-full border-red-900/50 hover:bg-red-950/50 hover:border-red-500 mt-2"
                              >
                                Cancel Ticket
                              </button>
                          )}
                          <p className="text-xs text-slate-500 mt-3 font-mono">{ticket.qrCode || ticket.ticketCode || '****'}</p>
                     </div>
                 </div>
              </div>
          ))}
      </div>
    </div>
  );
}
