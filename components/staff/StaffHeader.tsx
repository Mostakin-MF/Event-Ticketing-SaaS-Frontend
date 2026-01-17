'use client';

import React from 'react';

export default function StaffHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Events</h1>
        <p className="text-slate-500 mt-1">Manage check-ins for all your assigned shifts.</p>
      </div>
    </header>
  );
}
