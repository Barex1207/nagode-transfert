import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useDocumentHead } from '../lib/useDocumentHead';

const NotFound: React.FC = () => {
  useDocumentHead({
    title: 'Page introuvable',
    description: "Cette page n'existe pas ou plus sur le site de Nagode Transfert.",
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-light flex items-center">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto text-gray-300 shadow-sm">
          <Search size={32} />
        </div>
        <p className="text-7xl font-black text-[var(--brand-dark)] tracking-tighter">404</p>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Page introuvable</h1>
        <p className="text-gray-500 font-medium max-w-md mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil pour continuer votre visite.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-dark)] text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[var(--brand-dark-hover)] transition-colors"
        >
          <Home size={16} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
