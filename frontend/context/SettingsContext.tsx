import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface SiteSettings {
  siteName: string;
  slogan: string;
  description: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  address: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  heroImageUrl: string | null;
  heroUsersLabel: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  appPreviewImageUrl: string | null;
}

const FALLBACK_SETTINGS: SiteSettings = {
  siteName: 'Nagode Transfert',
  slogan: "Voyagez, Envoyez, Transférez en toute sécurité",
  description: '',
  logoUrl: 'https://nagodetransfert.com/wp-content/uploads/2023/03/FB_IMG_1679044436873-72x72.jpg',
  primaryColor: '#6F1AAE',
  secondaryColor: '#8A2BE2',
  phone: '+228 93 76 25 60',
  whatsapp: '+228 90 77 20 13',
  email: 'info@nagodetransfert.com',
  address: 'Agbalepedo, Lomé, République Togolaise',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100068396082049&locale=fr_FR',
  instagramUrl: null,
  twitterUrl: null,
  heroImageUrl: 'https://nagodetransfert.com/wp-content/uploads/2024/03/new_landing_2023.jpg',
  heroUsersLabel: '+50,000',
  appStoreUrl: 'https://apps.apple.com/us/app/nagode-bus/id1640486349',
  playStoreUrl: 'https://play.google.com/store/search?q=nagode+bus&c=apps',
  appPreviewImageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800',
};

const SettingsContext = createContext<SiteSettings>(FALLBACK_SETTINGS);

function hexToRgbTriplet(hex: string): string | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const int = parseInt(match[1], 16);
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

function darkenHex(hex: string, amount = 0.18): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return hex;
  const int = parseInt(match[1], 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((int >> 16) & 255) * (1 - amount));
  const g = clamp(((int >> 8) & 255) * (1 - amount));
  const b = clamp((int & 255) * (1 - amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function applyBrandColors(settings: SiteSettings) {
  const root = document.documentElement.style;
  const darkRgb = hexToRgbTriplet(settings.primaryColor);
  const accentRgb = hexToRgbTriplet(settings.secondaryColor);
  if (darkRgb) {
    root.setProperty('--brand-dark', settings.primaryColor);
    root.setProperty('--brand-dark-rgb', darkRgb);
    root.setProperty('--brand-dark-hover', darkenHex(settings.primaryColor));
  }
  if (accentRgb) {
    root.setProperty('--brand-accent', settings.secondaryColor);
    root.setProperty('--brand-accent-rgb', accentRgb);
  }
}

function applyLocalBusinessSchema(settings: SiteSettings) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.siteName,
    description: settings.description || settings.slogan,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || undefined,
    },
    image: settings.logoUrl || undefined,
    url: window.location.origin,
    sameAs: [settings.facebookUrl, settings.instagramUrl, settings.twitterUrl].filter(Boolean),
  };

  let script = document.getElementById('local-business-schema') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'local-business-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);

  useEffect(() => {
    api
      .get<SiteSettings>('/settings')
      .then((data) => {
        setSettings(data);
        applyBrandColors(data);
        applyLocalBusinessSchema(data);
      })
      .catch(() => {
        // Backend indisponible : on garde les valeurs de repli (déjà appliquées via index.html).
        applyLocalBusinessSchema(FALLBACK_SETTINGS);
      });
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
