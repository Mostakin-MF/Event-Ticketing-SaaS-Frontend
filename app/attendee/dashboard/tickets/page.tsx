'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, Download, QrCode, X } from 'lucide-react';
import { attendeeService } from '@/services/attendeeService';

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
      const fetchTickets = async () => {
          try {
              // First, get the user's profile to obtain their email
              const profile = await attendeeService.getProfile();
              const userEmail = profile.email;
              
              // Then fetch tickets using the user's email
              const ticketsData = await attendeeService.getMyTickets(userEmail);
              setTickets(ticketsData);
          } catch (err) {
              console.error("Failed to load tickets", err);
              setError("Failed to load tickets. Please try logging in again.");
          } finally {
              setLoading(false);
          }
      };
      fetchTickets();
  }, []);

  const handleViewQR = async (ticket: any) => {
      setSelectedTicket(ticket);
      // Use QR Server API - free and no installation needed
      const qrData = encodeURIComponent(ticket.qr_code_payload || ticket.id);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrData}&color=047857&bgcolor=FFFFFF`;
      setQrCodeUrl(qrUrl);
  };

  const handleDownloadPDF = async (ticket: any) => {
      try {
          // Generate QR code URL using API
          const qrData = encodeURIComponent(ticket.qr_code_payload || ticket.id);
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;

          // Create a simple HTML ticket
          const ticketHTML = `
              <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="UTF-8">
                  <title>Ticket - ${ticket.event_name}</title>
                  <style>
                      @media print {
                          body { margin: 0; }
                          .no-print { display: none; }
                      }
                      body { 
                          font-family: Arial, sans-serif; 
                          max-width: 800px; 
                          margin: 40px auto; 
                          padding: 20px;
                      }
                      .ticket {
                          border: 2px solid #047857;
                          border-radius: 12px;
                          padding: 30px;
                          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
                      }
                      h1 { color: #047857; margin: 0 0 20px 0; }
                      .info { margin: 10px 0; font-size: 16px; }
                      .label { font-weight: bold; color: #64748b; }
                      .qr-code { text-align: center; margin: 30px 0; }
                      .qr-code img { border: 8px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 300px; }
                      .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
                      .print-btn { 
                          display: block; 
                          margin: 20px auto; 
                          padding: 12px 24px; 
                          background: #047857; 
                          color: white; 
                          border: none; 
                          border-radius: 8px; 
                          cursor: pointer;
                          font-size: 16px;
                      }
                      .print-btn:hover { background: #059669; }
                  </style>
              </head>
              <body>
                  <button onclick="window.print()" class="print-btn no-print">🖨️ Print Ticket</button>
                  <div class="ticket">
                      <h1>🎫 ${ticket.event_name || 'Event Ticket'}</h1>
                      <div class="info"><span class="label">Ticket Type:</span> ${ticket.ticket_type_name}</div>
                      <div class="info"><span class="label">Attendee:</span> ${ticket.attendee_name}</div>
                      <div class="info"><span class="label">Email:</span> ${ticket.attendee_email}</div>
                      <div class="info"><span class="label">Seat:</span> ${ticket.seat_label || 'General Admission'}</div>
                      <div class="info"><span class="label">Status:</span> ${ticket.status.toUpperCase()}</div>
                      <div class="qr-code">
                          <p><strong>Scan at Entry</strong></p>
                          <img src="${qrUrl}" alt="QR Code" />
                          <p style="font-family: monospace; font-size: 12px; color: #64748b;">${ticket.id}</p>
                      </div>
                      <div class="footer">
                          <p>Please present this ticket at the venue entrance</p>
                          <p>Issued by Event Ticketing System</p>
                      </div>
                  </div>
              </body>
              </html>
          `;

          // Create blob and download
          const blob = new Blob([ticketHTML], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ticket-${ticket.id}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          alert('Ticket downloaded! Open the HTML file and click "Print Ticket" to save as PDF.');
      } catch (err) {
          console.error("Failed to download ticket", err);
          alert("Failed to download ticket. Please try again.");
      }
  };

  const handleCancelTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) return;

    try {
        await attendeeService.cancelTicket(ticketId);
        alert('Ticket cancelled successfully'); 
        // Refresh tickets
        const ticketsData = await attendeeService.getMyTickets();
        setTickets(ticketsData);
    } catch (err: any) {
        console.error("Cancellation failed", err);
        alert(err.response?.data?.message || "Failed to cancel ticket");
    }
  };
    
  const filteredTickets = tickets.filter(ticket => {
      const eventDate = new Date(ticket.event_date || Date.now());
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
                         
                         <div className={`badge ${ticket.status === 'valid' ? 'badge-success' : ticket.status === 'cancelled' ? 'badge-error' : 'badge-warning'} text-xs font-bold mb-3`}>
                             {ticket.ticket_type_name || 'Standard'}
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4">{ticket.event_name || 'Event Title'}</h3>
                         
                         <div className="space-y-2 text-sm text-slate-500 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                <span>{ticket.event_date ? new Date(ticket.event_date).toLocaleDateString() : 'TBA'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span>{ticket.venue || 'Venue TBD'}</span>
                            </div>
                         </div>

                         <div className="mt-auto">
                             <p className="text-xs text-slate-400 uppercase font-bold">Seat Info</p>
                             <p className="font-mono text-slate-700 font-bold">{ticket.seat_label || 'General Admission'}</p>
                         </div>

                         {ticket.status !== 'valid' && (
                             <div className="mt-4 pt-4 border-t border-slate-200">
                                 <p className="text-sm font-bold text-red-600">
                                     Status: {ticket.status.toUpperCase()}
                                 </p>
                             </div>
                         )}
                     </div>

                     {/* Divider (Mobile only) */}
                     <div className="border-t border-dashed border-slate-300 w-full sm:hidden"></div>
                     <div className="absolute left-0 bottom-1/2 translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full sm:hidden"></div>
                     <div className="absolute right-0 bottom-1/2 translate-y-1/2 translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full sm:hidden"></div>

                     {/* Right: QR Code Action */}
                     <div className="bg-slate-900 p-6 flex flex-col items-center justify-center text-center sm:w-48 relative overflow-hidden">
                          <div className="absolute inset-0 bg-emerald-900/20"></div>
                          <QrCode className="w-16 h-16 text-white mb-3" />
                          <button 
                              onClick={() => handleViewQR(ticket)}
                              className="btn btn-sm btn-white text-slate-900 font-bold w-full rounded-full shadow-lg mb-2 relative z-10"
                          >
                              View QR
                          </button>
                          <button 
                              onClick={() => handleDownloadPDF(ticket)}
                              className="btn btn-sm btn-outline text-white border-white/20 hover:bg-white/10 w-full rounded-full relative z-10"
                          >
                              <Download className="w-3 h-3 mr-1" /> PDF
                          </button>
                          {ticket.status === 'valid' && (
                              <button 
                                onClick={() => handleCancelTicket(ticket.id)}
                                className="btn btn-xs btn-outline text-red-400 font-bold w-full rounded-full border-red-900/50 hover:bg-red-950/50 hover:border-red-500 mt-2 relative z-10"
                              >
                                Cancel Ticket
                              </button>
                          )}
                          <p className="text-xs text-slate-500 mt-3 font-mono truncate w-full relative z-10">{ticket.id.slice(0, 8)}...</p>
                     </div>
                 </div>
              </div>
          ))}
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
          <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedTicket(null)}
          >
              <div 
                  className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
              >
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedTicket.event_name}</h2>
                          <p className="text-sm text-slate-500">{selectedTicket.ticket_type_name}</p>
                      </div>
                      <button 
                          onClick={() => setSelectedTicket(null)}
                          className="btn btn-sm btn-circle btn-ghost"
                      >
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl mb-6">
                      {qrCodeUrl && (
                          <img 
                              src={qrCodeUrl} 
                              alt="QR Code" 
                              className="w-full h-auto rounded-xl shadow-lg"
                          />
                      )}
                  </div>

                  <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                          <span className="text-slate-500">Attendee:</span>
                          <span className="font-bold text-slate-900">{selectedTicket.attendee_name}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-slate-500">Seat:</span>
                          <span className="font-bold text-slate-900">{selectedTicket.seat_label || 'General Admission'}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-slate-500">Ticket ID:</span>
                          <span className="font-mono text-xs text-slate-700">{selectedTicket.id}</span>
                      </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                      <p className="text-xs text-slate-400">
                          Present this QR code at the venue entrance
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
