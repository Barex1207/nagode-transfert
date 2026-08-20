import React from 'react';
import { ArrowRight, Sparkles, Users, Calendar } from 'lucide-react';

interface BusRentalProps {
  onRequestQuote: () => void;
}

const FEATURES = [
  { icon: Sparkles, label: 'Bus VIP & Prestige' },
  { icon: Calendar, label: 'Mariages, fêtes traditionnelles, cérémonies' },
  { icon: Users, label: 'Groupes et délégations' },
];

const BusRental: React.FC<BusRentalProps> = ({ onRequestQuote }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#07111f] px-8 py-14 md:px-16 md:py-16 text-white">
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-accent)]">Location de Bus</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Un bus VIP pour votre prochain événement
              </h2>
              <p className="text-white/60 font-medium leading-relaxed max-w-md">
                Mariages, fêtes traditionnelles, cérémonies régionales, déplacements de groupe : louez l'un de nos
                bus VIP ou prestige avec chauffeur, pour l'événement qui compte.
              </p>
              <button
                onClick={onRequestQuote}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-accent)] text-white text-xs font-black uppercase tracking-widest shadow-lg hover:opacity-90 hover:scale-105 transition-all"
              >
                Demander un devis
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid gap-4">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 px-5 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--brand-accent-rgb)/15%)] text-[var(--brand-accent)]">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-bold text-white/85">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.03] rounded-bl-[8rem] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.03] rounded-tr-[8rem] -ml-10 -mb-10" />
        </div>
      </div>
    </section>
  );
};

export default BusRental;
