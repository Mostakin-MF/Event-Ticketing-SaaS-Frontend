import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DynamicThemeRenderer from '@/components/themes/DynamicThemeRenderer';

interface PageProps {
    params: Promise<{
        tenantSlug: string;
        eventSlug: string;
    }>;
}

async function getEventData(tenantSlug: string, eventSlug: string) {
    try {
        const res = await fetch(
            `http://localhost:7000/public/${tenantSlug}/${eventSlug}`,
            { cache: 'no-store' }
        );

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
}

async function getTickets(eventId: string) {
    try {
        const res = await fetch(
            `http://localhost:7000/tickets/event/${eventId}`,
            { cache: 'no-store' }
        );

        if (!res.ok) {
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { tenantSlug, eventSlug } = await params;
    const data = await getEventData(tenantSlug, eventSlug);

    if (!data?.event) {
        return {
            title: 'Event Not Found',
        };
    }

    const { event } = data;
    const seo = event.seoSettings || {};

    return {
        title: seo.metaTitle || event.name,
        description: seo.metaDescription || event.description,
        openGraph: {
            title: seo.metaTitle || event.name,
            description: seo.metaDescription || event.description,
            images: seo.ogImage ? [seo.ogImage] : (event.imageUrl ? [event.imageUrl] : []),
        },
    };
}

export default async function PublicEventPage({ params }: PageProps) {
    const { tenantSlug, eventSlug } = await params;
    const data = await getEventData(tenantSlug, eventSlug);

    if (!data || !data.event) {
        notFound();
    }

    const { event } = data;
    const tickets = await getTickets(event.id);
    const tenant = event.tenant || { name: tenantSlug };
    const theme = event.theme;

    if (!theme) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">No Theme Assigned</h1>
                    <p className="text-slate-400">Please assign a theme to this event in the dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <DynamicThemeRenderer
            tenant={tenant}
            event={{ ...event, tickets }}
            theme={theme}
        />
    );
}
