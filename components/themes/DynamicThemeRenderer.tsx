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

    const content = {
        ...theme.defaultContent,
        ...(event?.themeContent || {}),
        ...(customContent || {})
    };

    // Helper to determine if background is light (for section styling)
    const isLight = colors.background.toLowerCase() === '#ffffff' || colors.background.toLowerCase() === '#f8fafc';

    // Sort sections by order
    const sections = Object.entries(structure.sections)
        .filter(([_, config]: any) => config.enabled)
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

            <FooterSection tenant={tenant} colors={colors} fonts={fonts} isLight={isLight} />
        </div>
    );
}
