import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'nagode_cookie_consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[95] px-4 lg:bottom-4 lg:inset-x-auto lg:left-4 lg:max-w-md">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-sm p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center">
        <div className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
          <Cookie size={18} className="mt-0.5 shrink-0 text-[var(--brand-dark)]" />
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur ce site.{' '}
            <Link to="/confidentialite" className="font-semibold text-[var(--brand-dark)] hover:underline">
              En savoir plus
            </Link>
          </p>
        </div>
        <button
          onClick={accept}
          className="shrink-0 rounded-xl bg-[var(--brand-dark)] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[var(--brand-dark-hover)] sm:self-center"
        >
          Accepter
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
