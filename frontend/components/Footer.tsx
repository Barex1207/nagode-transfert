import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Headphones, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ADMIN_URL = (import.meta as any).env?.VITE_ADMIN_URL ?? 'http://localhost:5173';

interface FooterProps {
  onSupportClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSupportClick }) => {
  const settings = useSettings();
  const customLogo = settings.logoUrl ?? "https://nagodetransfert.com/wp-content/uploads/2023/03/FB_IMG_1679044436873-72x72.jpg";

  return (
    <footer id="site-footer" className="bg-brand-light border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Bar */}
        <div className="py-12 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-8">
           <Link to="/agences" className="flex items-center gap-4 group cursor-pointer">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
               <Shield size={24} />
             </div>
             <div>
               <h4 className="font-bold text-brand-dark">Sécurité Garantie</h4>
               <p className="text-sm text-gray-500">Voyagez et envoyez l'esprit tranquille</p>
             </div>
           </Link>
           <div className="flex items-center gap-4 group cursor-pointer" onClick={onSupportClick}>
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
               < Headphones size={24} />
             </div>
             <div>
               <h4 className="font-bold text-brand-dark">Assistance 24/7</h4>
               <p className="text-sm text-gray-500">Une équipe dédiée pour vous aider</p>
             </div>
           </div>
           <Link to="/agences" className="flex items-center gap-4 group cursor-pointer">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
               <MapPin size={24} />
             </div>
             <div>
               <h4 className="font-bold text-brand-dark">Nos Agences</h4>
               <p className="text-sm text-gray-500">Trouvez un point de vente proche</p>
             </div>
           </Link>
        </div>

        {/* Links Grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-brand-black">
          <div className="space-y-6">
             <Link
               to="/"
               className="flex items-center gap-3 cursor-pointer group w-fit transition-transform hover:scale-105 active:scale-95"
             >
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                  <img
                    src={customLogo}
                    alt="Nagode Transfert Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black tracking-tighter text-brand-dark uppercase">Nagode</span>
                  <div className="w-full h-[1px] bg-brand-dark/20"></div>
                  <span className="text-[7px] font-bold tracking-[0.2em] text-black">TRANSFERT</span>
                </div>
             </Link>
             <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
               La solution de transport et logistique de référence en Afrique de l'Ouest. Connectez les cœurs, transportez l'avenir avec Nagode Transfert.
             </p>
             <div className="flex gap-4">
                <a
                  href={settings.facebookUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={settings.twitterUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href={settings.instagramUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  <Instagram size={20} />
                </a>
             </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs">L'entreprise</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-brand-primary transition-colors">À propos</Link></li>
              <li><Link to="/actualites" className="hover:text-brand-primary transition-colors">Actualités</Link></li>
              <li><Link to="/agences" className="hover:text-brand-primary transition-colors">Nos Agences</Link></li>
              <li><Link to="/avis" className="hover:text-brand-primary transition-colors">Avis clients</Link></li>
              <li><Link to="/faq" className="hover:text-brand-primary transition-colors">Questions fréquentes</Link></li>
              <li><Link to="/suggestions" className="hover:text-brand-primary transition-colors">Suggestions</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs">Services</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/tarifs" className="hover:text-brand-primary transition-colors">Tarifs Tickets bus</Link></li>
              <li><Link to="/tarifs" className="hover:text-brand-primary transition-colors">Tarifs Colis</Link></li>
              <li><Link to="/horaires" className="hover:text-brand-primary transition-colors">Horaires de départ</Link></li>
              <li><Link to="/contact?sujet=Location" className="hover:text-brand-primary transition-colors">Location de Bus</Link></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
          <p className="flex items-center gap-2">
            © 2025 Nagode Transfert. Tous droits réservés.
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Administration"
              title="Administration"
              className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300 hover:bg-[var(--brand-dark)] transition-colors"
            />
          </p>
          <div className="flex gap-8">
            <Link to="/confidentialite" className="hover:text-brand-primary">Confidentialité</Link>
            <Link to="/conditions" className="hover:text-brand-primary">Conditions d'utilisation</Link>
            <Link to="/confidentialite" className="hover:text-brand-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
