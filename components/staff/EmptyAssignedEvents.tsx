'use client';

import React from 'react';
import { CalendarX } from 'lucide-react';

export default function EmptyAssignedEvents() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-inner">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CalendarX className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">No events assigned</h3>
      <p className="text-slate-500 max-w-xs mx-auto mb-8">
        You are not currently assigned to any active events. Contact your administrator if you believe this is an error.
      </p>
    </div>
  );
}
