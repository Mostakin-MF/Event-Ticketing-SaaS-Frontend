'use client';

import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import FeaturesSection from './sections/FeaturesSection';
import ScheduleSection from './sections/ScheduleSection';
import TicketsSection from './sections/TicketsSection';
import SpeakersSection from './sections/SpeakersSection';
import VenueSection from './sections/VenueSection';
import GallerySection from './sections/GallerySection';
import FAQSection from './sections/FAQSection';
import FooterSection from './sections/FooterSection';

interface DynamicThemeRendererProps {
    tenant: any;
    event: any;
    theme: any;
    customContent?: any;
}

export default function DynamicThemeRenderer({ tenant, event, theme, customContent }: DynamicThemeRendererProps) {
    if (!theme) return null;

    // Merge default theme properties with event-specific overrides
    const colors = event?.themeCustomization?.primaryColor
        ? { ...theme.defaultProperties.colors, primary: event.themeCustomization.primaryColor, secondary: event.themeCustomization.secondaryColor || theme.defaultProperties.colors.secondary }
        : theme.defaultProperties.colors;

    const fonts = theme.defaultProperties.fonts;
    const structure = theme.templateStructure;

    // Map real tickets from DB if available
    const realTickets = event?.ticketTypes?.map((t: any) => ({
        name: t.name,
        description: t.description,
        price: t.price_taka,
        // features: ['Standard Access', 'Event Entry'] // Default features as they are not in DB entity yet
        features: event?.themeContent?.ticketFeatures?.[t.id] || ['Standard Access', 'Event Entry']
    }));

    // Map real sessions from DB if available
    const realSchedule = event?.sessions?.map((s: any) => ({
        time: s.start_at ? new Date(s.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
        title: s.title,
        description: s.description
    }));

    const content = {
        ...theme.defaultContent,
        ...(event?.themeContent || {}),
        // Prioritize real DB tickets, fallback to theme content
        tickets: realTickets?.length ? realTickets : (event?.themeContent?.tickets || theme.defaultContent?.tickets || []),
        // Prioritize real DB sessions, fallback to theme content
        schedule: realSchedule?.length ? realSchedule : (event?.themeContent?.schedule || theme.defaultContent?.schedule || []),
        ...(customContent || {})
    };

    // Helper to determine if background is light (for section styling)
    const isLight = colors.background.toLowerCase() === '#ffffff' || colors.background.toLowerCase() === '#f8fafc';

    // Visibility Overrides from Event
    const visibility = event?.themeCustomization?.sectionVisibility || {};

    // Sort sections by order and filter by visibility
    const sections = Object.entries(structure.sections)
        .filter(([name, config]: any) => {
            // If explicit override exists, use it. Otherwise fall back to theme default (defaulting to enabled).
            const isVisible = visibility[name] !== undefined ? visibility[name] : config.enabled;
            return isVisible;
        })
        .sort(([_, a]: any, [__, b]: any) => a.order - b.order);

    const renderSection = (name: string, sectionConfig: any) => {
        const props = { content: content[name] || {}, colors, fonts, category: theme.category, event, isLight };

        switch (name) {
            case 'hero': return <HeroSection key={name} {...props} />;
            case 'about': return <AboutSection key={name} {...props} />;
            case 'features': return <FeaturesSection key={name} {...props} />;
            case 'schedule': return <ScheduleSection key={name} {...props} />;
            case 'tickets': return <TicketsSection key={name} {...props} />;
            case 'speakers': return <SpeakersSection key={name} {...props} />;
            case 'venue': return <VenueSection key={name} {...props} />;
            case 'gallery': return <GallerySection key={name} {...props} />;
            case 'faq': return <FAQSection key={name} {...props} />;
            default: return null;
        }
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500"
            style={{ backgroundColor: colors.background, color: colors.text }}
        >
            {sections.map(([name, config]) => renderSection(name, config))}

            <FooterSection tenant={tenant} content={content['footer'] || {}} colors={colors} fonts={fonts} isLight={isLight} />
        </div>
    );
}
