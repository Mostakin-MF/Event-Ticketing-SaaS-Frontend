'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendeePage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/attendee/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
    );
}
