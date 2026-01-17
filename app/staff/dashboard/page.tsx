'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { staffService } from '@/services/staffService';
import StaffHeader from '@/components/staff/StaffHeader';
import AssignedEventCard from '@/components/staff/AssignedEventCard';
import EmptyAssignedEvents from '@/components/staff/EmptyAssignedEvents';
import { AssignedEvent } from '@/types/staff';

export default function StaffDashboard() {
  const [events, setEvents] = useState<AssignedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await staffService.getAssignedEvents();
        // Backend returns { data: [], pagination: {} } or similar array
        // Adjust based on actual API response structure (checking Array vs Object)
        if (Array.isArray(response.data)) {
             setEvents(response.data);
        } else if (Array.isArray(response)) {
             setEvents(response);
        } else {
             setEvents([]);
        }
      } catch (err) {
        console.error("Failed to load events", err);
        setError('Could not load assigned events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (error) {
    return (
        <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <StaffHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
            <AssignedEventCard key={event.id} event={event} />
        ))}
      </div>

      {events.length === 0 && (
        <EmptyAssignedEvents />
      )}
    </div>
  );
}
