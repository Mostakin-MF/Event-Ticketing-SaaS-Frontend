'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Users } from 'lucide-react';
import { AssignedEvent } from '@/types/staff';

interface AssignedEventCardProps {
  event: AssignedEvent;
}

export default function AssignedEventCard({ event }: AssignedEventCardProps) {
  const startDate = new Date(event.start_at || event.startDateTime);
  
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full group">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-lg">
             Shift Active
          </div>
          <div className="text-xs font-bold text-slate-400">ID: {event.id.slice(0, 8)}</div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-emerald-600 transition-colors">
          {event.name || event.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-emerald-500">
                <Calendar className="w-4 h-4" />
            </div>
            <div>
                <p className="font-bold text-slate-900 leading-none mb-1">
                    {startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs opacity-70">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-emerald-500">
                <MapPin className="w-4 h-4" />
            </div>
            <span className="font-medium truncate">{event.venue || event.location || 'Venue TBD'}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter">Event Access</span>
           </div>
           <Link 
            href={`/staff/events/${event.id}`} 
            className="btn btn-circle btn-sm btn-ghost bg-slate-900 text-white hover:bg-emerald-600 border-none transition-all"
           >
              <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </div>
  );
}
