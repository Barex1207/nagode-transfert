
import React from 'react';
import { Shield, Headphones, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'news' | 'suggestions' | 'agencies' | 'contact' | 'pricing' | 'schedules') => void;
  onSupportClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onSupportClick }) => {
  // Same logo emblem as used in Navbar for consistency
  const LogoEmblem = ({ size = 20, color = "black" }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="white" />
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6"/>
      <rect x="40" y="40" width="20" height="20" fill={color}/>
      <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="6" />
      <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="6" />
      <rect x="42" y="10" width="16" height="10" fill="white" />
      <rect x="42" y="80" width="16" height="10" fill="white" />
      <rect x="10" y="42" width="10" height="16" fill="white" />
      <rect x="80" y="42" width="10" height="16" fill="white" />
    </svg>
  );

  return (
    <footer className="bg-brand-light border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Bar */}
        <div className="py-12 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate('agencies')}>
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
               <Shield size={24} />
             </div>
             <div>
               <h4 className="font-bold text-brand-dark">Sécurité Garantie</h4>
               <p className="text-sm text-gray-500">Voyagez et envoyez l'esprit tranquille</p>
             </div>
           </div>
           <div className="flex items-center gap-4 group cursor-pointer" onClick={onSupportClick}>
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
               < Headphones size={24} />
             </div>
             <div>
               <h4 className="font-bold text-brand-dark">Assistance 24/7</h4>
               <p className="text-sm text-gray-500">Une équipe dédiée pour vous aider</p>
             </div>
           </div>
           <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate('agencies')}>
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
               <MapPin size={24} />
             </div>
             <div>
               <h4 className="font-bold text-brand-dark">Nos Agences</h4>
               <p className="text-sm text-gray-500">Trouvez un point de vente proche</p>
             </div>
           </div>
        </div>

        {/* Links Grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-brand-black">
          <div className="space-y-6">
             {/* Clickable Logo Section */}
             <div 
               className="flex items-center gap-3 cursor-pointer group w-fit transition-transform hover:scale-105 active:scale-95"
               onClick={() => onNavigate('home')}
             >
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center leading-none p-1">
                    <LogoEmblem size={24} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black tracking-tighter text-brand-dark uppercase">Nagode</span>
                  <div className="w-full h-[1px] bg-brand-dark/20"></div>
                  <span className="text-[7px] font-bold tracking-[0.2em] text-black">TRANSFERT</span>
                </div>
             </div>
             <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
               La solution de transport et logistique de référence en Afrique de l'Ouest. Connectez les cœurs, transportez l'avenir avec Nagode Transfert.
             </p>
             <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=100068396082049&locale=fr_FR" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"><Twitter size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"><Instagram size={20} /></a>
             </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs">L'entreprise</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => onNavigate('home')} className="hover:text-brand-primary transition-colors">À propos</button></li>
              <li><button onClick={() => onNavigate('news')} className="hover:text-brand-primary transition-colors">Actualités</button></li>
              <li><button onClick={() => onNavigate('agencies')} className="hover:text-brand-primary transition-colors">Nos Agences</button></li>
              <li><button onClick={() => onNavigate('suggestions')} className="hover:text-brand-primary transition-colors">Suggestions</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-brand-primary transition-colors">Contact</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs">Services</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-brand-primary transition-colors">Tarifs Tickets bus</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-brand-primary transition-colors">Tarifs Colis</button></li>
              <li><button onClick={() => onNavigate('schedules')} className="hover:text-brand-primary transition-colors">Horaires de départ</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-brand-primary transition-colors">Transfert d'argent</button></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
          <p>© 2025 Nagode Transfert. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-primary">Confidentialité</a>
            <a href="#" className="hover:text-brand-primary">Conditions d'utilisation</a>
            <a href="#" className="hover:text-brand-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
