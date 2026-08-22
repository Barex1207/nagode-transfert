import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors tracking-wide uppercase text-xs ${
    isActive ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/60 hover:text-white'
  }`;

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settings = useSettings();
  const customLogo = settings.logoUrl ?? "https://nagodetransfert.com/wp-content/uploads/2023/03/FB_IMG_1679044436873-72x72.jpg";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--brand-dark)] text-white shadow-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-24">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-white p-1 rounded-xl shadow-md transition-all group-hover:scale-105 group-active:scale-95">
               <img
                 src={customLogo}
                 alt="Nagode Transfert Logo"
                 className="w-10 h-10 object-contain"
               />
            </div>
            <div className="hidden sm:flex flex-col -space-y-1">
              <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase">Nagode</span>
              <span className="text-[10px] lg:text-xs font-bold tracking-[0.3em] opacity-80 uppercase">Transfert</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-10 text-sm font-bold">
            <NavLink to="/" end className={navLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/tarifs" className={navLinkClass}>
              Tarifs
            </NavLink>
            <NavLink to="/horaires" className={navLinkClass}>
              Horaires
            </NavLink>
            <NavLink to="/actualites" className={navLinkClass}>
              Actualités
            </NavLink>
            <NavLink to="/flotte" className={navLinkClass}>
              Notre Flotte
            </NavLink>
            <NavLink to="/agences" className={navLinkClass}>
              Nos Agences
            </NavLink>
            <NavLink to="/suggestions" className={navLinkClass}>
              Suggestions
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
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
        <div className="lg:hidden bg-[var(--brand-dark)] border-t border-white/10 p-6 space-y-6 h-screen animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
            Accueil
          </Link>
          <Link to="/tarifs" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
            Tarifs
          </Link>
          <Link to="/horaires" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
            Horaires
          </Link>

          <div className="space-y-6 pt-4 border-t border-white/5">
            <Link to="/actualites" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
              Actualités
            </Link>
            <Link to="/flotte" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
              Notre Flotte
            </Link>
            <Link to="/agences" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
              Nos Agences
            </Link>
            <Link to="/suggestions" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
              Suggestions
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold hover:text-white/70 w-full text-left">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
