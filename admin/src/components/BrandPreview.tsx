import React from 'react';
import { Star, Ticket } from 'lucide-react';

interface BrandPreviewProps {
  siteName: string;
  slogan: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  heroImageUrl: string | null;
  heroUsersLabel: string;
}

export function BrandPreview({
  siteName,
  slogan,
  logoUrl,
  primaryColor,
  secondaryColor,
  heroImageUrl,
  heroUsersLabel,
}: BrandPreviewProps) {
  return (
    <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Barre de navigateur factice */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-gray-400 border border-gray-200">
          nagodetransfert.com
        </span>
      </div>

      {/* Mini navbar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/95 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <Ticket size={12} style={{ color: primaryColor }} />
            )}
          </div>
          <span className="text-[11px] font-black uppercase tracking-tight text-white truncate max-w-[120px]">
            {siteName || 'Nagode Transfert'}
          </span>
        </div>
        <div className="hidden gap-2 sm:flex">
          {['Accueil', 'Agences', 'Contact'].map((label) => (
            <span key={label} className="text-[9px] font-bold uppercase tracking-wide text-white/60">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Mini hero */}
      <div className="relative h-48 overflow-hidden bg-gray-800">
        {heroImageUrl && (
          <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-5">
          <p className="max-w-[70%] text-sm font-black leading-tight text-white">
            {slogan || 'Votre slogan apparaîtra ici'}
          </p>
          <button
            className="w-fit rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white shadow-md"
            style={{ backgroundColor: secondaryColor }}
          >
            Réserver
          </button>
          {heroUsersLabel && (
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-4 w-4 rounded-full border border-white bg-gray-300" />
                ))}
              </div>
              <span className="text-[9px] font-bold text-white/80">{heroUsersLabel} utilisateurs</span>
            </div>
          )}
        </div>
      </div>

      {/* Mini bandeau réseaux/contact */}
      <div className="flex items-center justify-center gap-1 border-t border-gray-100 px-4 py-2 text-gray-300">
        <Star size={10} className="fill-current" style={{ color: secondaryColor }} />
        <Star size={10} className="fill-current" style={{ color: secondaryColor }} />
        <Star size={10} className="fill-current" style={{ color: secondaryColor }} />
        <Star size={10} className="fill-current" style={{ color: secondaryColor }} />
        <Star size={10} className="fill-current" style={{ color: secondaryColor }} />
        <span className="ml-1 text-[9px] font-medium text-gray-400">Aperçu simplifié — mis à jour en direct</span>
      </div>
    </div>
  );
}
