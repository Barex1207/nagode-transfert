import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket } from 'lucide-react';

const HIDDEN_ON = ['/contact', '/merci'];

const StickyMobileCTA: React.FC = () => {
  const location = useLocation();

  if (HIDDEN_ON.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
      <Link
        to="/#booking-section"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--brand-dark)] text-white text-sm font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-transform"
      >
        <Ticket size={18} />
        Réserver mon trajet
      </Link>
    </div>
  );
};

export default StickyMobileCTA;
