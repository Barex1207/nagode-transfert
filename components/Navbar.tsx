
import React, { useState } from 'react';
import { Menu, ChevronDown, Clock, Tag, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'news' | 'suggestions' | 'agencies' | 'contact' | 'pricing' | 'schedules') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isVoyagerOpen, setIsVoyagerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // High-fidelity SVG recreation of the Nagode Logo
  const LogoEmblem = ({ size = 24, color = "black" }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className="transition-transform group-hover:rotate-12 duration-500">
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#6F1AAE] text-white shadow-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-24">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-white p-1 rounded-xl shadow-md transition-all group-hover:scale-105 group-active:scale-95">
               <div className="flex flex-col items-center leading-none p-1">
                 <LogoEmblem size={32} />
                 <span className="text-[#6F1AAE] font-black text-[8px] mt-0.5 tracking-tighter">NAGODE</span>
                 <div className="w-full h-[0.5px] bg-[#6F1AAE]/20 my-0.5"></div>
                 <span className="text-[4px] font-bold text-black tracking-[0.1em]">TRANSFERT</span>
               </div>
            </div>
            <div className="hidden sm:flex flex-col -space-y-1">
              <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase">Nagode</span>
              <span className="text-[10px] lg:text-xs font-bold tracking-[0.3em] opacity-80 uppercase">Transfert</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-10 text-sm font-bold">
            <button 
              onClick={() => onNavigate('home')} 
              className={`transition-colors tracking-wide uppercase text-xs ${currentView === 'home' ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/60 hover:text-white'}`}
            >
              Accueil
            </button>
            
            <div 
              className="relative group"
              onMouseEnter={() => setIsVoyagerOpen(true)}
              onMouseLeave={() => setIsVoyagerOpen(false)}
            >
              <button className="flex items-center gap-1 cursor-pointer hover:text-white/80 py-4 tracking-wide uppercase text-xs">
                <span>Voyager</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isVoyagerOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 origin-top ${isVoyagerOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="p-2">
                  <button 
                    onClick={() => {onNavigate('pricing'); setIsVoyagerOpen(false);}}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-brand-light rounded-lg transition-colors text-left"
                  >
                    <Tag size={16} className="text-[#6F1AAE]" />
                    <span className="font-bold text-sm">Tarifs</span>
                  </button>
                  <button 
                    onClick={() => {onNavigate('schedules'); setIsVoyagerOpen(false);}}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-brand-light rounded-lg transition-colors text-left"
                  >
                    <Clock size={16} className="text-[#6F1AAE]" />
                    <span className="font-bold text-sm">Horaires de départ</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('news')} 
              className={`transition-colors tracking-wide uppercase text-xs ${currentView === 'news' ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/60 hover:text-white'}`}
            >
              Actualités
            </button>
            <button 
              onClick={() => onNavigate('agencies')} 
              className={`transition-colors tracking-wide uppercase text-xs ${currentView === 'agencies' ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/60 hover:text-white'}`}
            >
              Nos Agences
            </button>
            <button 
              onClick={() => onNavigate('suggestions')} 
              className={`transition-colors tracking-wide uppercase text-xs ${currentView === 'suggestions' ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/60 hover:text-white'}`}
            >
              Suggestions
            </button>
            <button 
              onClick={() => onNavigate('contact')} 
              className={`transition-colors tracking-wide uppercase text-xs ${currentView === 'contact' ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/60 hover:text-white'}`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#6F1AAE] border-t border-white/10 p-6 space-y-6 h-screen animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
          <button onClick={() => {onNavigate('home'); setIsMobileMenuOpen(false);}} className="block text-xl font-bold hover:text-white/70 w-full text-left">Accueil</button>
          
          <div className="space-y-4">
             <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Voyager</p>
             <div className="space-y-4 pl-4 border-l-2 border-white/10">
               <button 
                onClick={() => {onNavigate('pricing'); setIsMobileMenuOpen(false);}}
                className="flex items-center gap-3 text-lg font-bold hover:text-white/70 w-full text-left"
               >
                 <Tag size={18} />
                 <span>Tarifs</span>
               </button>
               <button 
                onClick={() => {onNavigate('schedules'); setIsMobileMenuOpen(false);}}
                className="flex items-center gap-3 text-lg font-bold hover:text-white/70 w-full text-left"
               >
                 <Clock size={18} />
                 <span>Horaires</span>
               </button>
             </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-white/5">
            <button onClick={() => {onNavigate('news'); setIsMobileMenuOpen(false);}} className="block text-xl font-bold hover:text-white/70 w-full text-left">Actualités</button>
            <button onClick={() => {onNavigate('agencies'); setIsMobileMenuOpen(false);}} className="block text-xl font-bold hover:text-white/70 w-full text-left">Nos Agences</button>
            <button onClick={() => {onNavigate('suggestions'); setIsMobileMenuOpen(false);}} className="block text-xl font-bold hover:text-white/70 w-full text-left">Suggestions</button>
            <button onClick={() => {onNavigate('contact'); setIsMobileMenuOpen(false);}} className="block text-xl font-bold hover:text-white/70 w-full text-left">Contact</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
