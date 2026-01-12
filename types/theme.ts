export type ThemeCategory = 
  | 'music' 
  | 'jobfair' 
  | 'expo' 
  | 'conference' 
  | 'sports' 
  | 'festival' 
  | 'general';

export interface ThemeStructure {
  sections: {
    [key: string]: {
      enabled: boolean;
      order: number;
    };
  };
  components?: {
    cardStyle?: string;
    buttonStyle?: string;
    sectionSpacing?: string;
    [key: string]: any;
  };
}

export interface ThemeContent {
  hero?: {
    title: string;
    subtitle: string;
    ctaText: string;
    [key: string]: any;
  };
  about?: {
    heading: string;
    content: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  isPremium: boolean;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  thumbnailUrl?: string;
  previewUrl?: string;
  templateStructure: ThemeStructure;
  defaultContent: ThemeContent;
  defaultProperties?: {
    colors?: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    fonts?: {
      heading: string;
      body: string;
    };
    layout?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThemePurchase {
  id: string;
  tenantId: string;
  themeId: string;
  theme: Theme;
  pricePaid: number;
  paymentId: string;
  status: 'active' | 'expired' | 'cancelled';
  purchasedAt: string;
  expiresAt?: string;
}

export interface EventThemeContent {
  hero?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  about?: {
    heading?: string;
    content?: string;
    images?: string[];
  };
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  schedule?: Array<{
    time: string;
    title: string;
    description: string;
    speaker?: string;
  }>;
  tickets?: Array<{
    name: string;
    price: number;
    description: string;
    available: number;
    features: string[];
  }>;
  speakers?: Array<{
    name: string;
    role: string;
    bio: string;
    photo: string;
    social: { twitter?: string; linkedin?: string };
  }>;
  venue?: {
    name: string;
    address: string;
    mapUrl: string;
    directions: string;
    parking: string;
  };
  gallery?: string[];
  faq?: Array<{ question: string; answer: string }>;
  [key: string]: any;
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
}
