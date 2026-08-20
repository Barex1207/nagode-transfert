import { useEffect, useState } from 'react';
import { api } from './api';
import type { SiteSettings } from '../types';

const FALLBACK_LOGO = 'https://nagodetransfert.com/wp-content/uploads/2023/03/FB_IMG_1679044436873-72x72.jpg';

export interface Branding {
  siteName: string;
  logoUrl: string;
}

const DEFAULT_BRANDING: Branding = { siteName: 'Nagode Transfert', logoUrl: FALLBACK_LOGO };

// GET /settings is public, so this works both on the login page (pre-auth)
// and inside the authenticated shell — the logo/name stay in sync everywhere
// as soon as an admin updates them from the Settings page.
export function useBranding(): Branding {
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);

  useEffect(() => {
    api
      .get<SiteSettings>('/settings')
      .then((settings) =>
        setBranding({
          siteName: settings.siteName || DEFAULT_BRANDING.siteName,
          logoUrl: settings.logoUrl || DEFAULT_BRANDING.logoUrl,
        }),
      )
      .catch(() => {
        // keep defaults
      });
  }, []);

  return branding;
}
