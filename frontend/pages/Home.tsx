import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Package, Banknote } from 'lucide-react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Fleet from '../components/Fleet';
import BusRental from '../components/BusRental';
import Services from '../components/Services';
import Destinations from '../components/Destinations';
import Team from '../components/Team';
import MobileApp from '../components/MobileApp';
import { ServiceTab } from '../types';
import { useDocumentHead } from '../lib/useDocumentHead';
import { useSettings } from '../context/SettingsContext';

interface HomeProps {
  activeBookingTab: ServiceTab;
  onTabChange: (tab: ServiceTab) => void;
}

const Home: React.FC<HomeProps> = ({ activeBookingTab, onTabChange }) => {
  const navigate = useNavigate();
  const settings = useSettings();

  useDocumentHead({
    title: 'Voyagez, Envoyez, Transférez en toute sécurité',
    description:
      "Nagode Transfert : réservation de tickets de bus, envoi de colis et transfert d'argent au Togo, Ghana et Côte d'Ivoire. Départs quotidiens, agences dans tout le pays.",
    image: settings.heroImageUrl ?? undefined,
  });

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handleQuickLinkClick = (tab: ServiceTab) => {
    onTabChange(tab);
    const element = document.getElementById('booking-section');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <Hero activeBookingTab={activeBookingTab} onTabChange={onTabChange} />
      <Features />
      <Fleet />
      <BusRental onRequestQuote={() => navigate('/contact?sujet=Location')} />
      <Services />
      <Destinations />
      <Team />

      <div className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {[
                { title: 'Ticket', icon: Ticket, desc: 'Voyagez confortablement', tab: ServiceTab.TRANSPORT },
                { title: 'Envoi colis', icon: Package, desc: 'Sécurité et rapidité', tab: ServiceTab.COLIS },
                { title: "Transfert d'argent", icon: Banknote, desc: 'Envoyez à vos proches', tab: ServiceTab.ARGENT },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleQuickLinkClick(item.tab)}
                  className={`p-10 flex flex-col items-center justify-center gap-4 hover:bg-brand-light transition-all duration-300 cursor-pointer group relative ${
                    i !== 2 ? 'md:border-r border-gray-100' : ''
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-[rgb(var(--brand-dark-rgb)/8%)] flex items-center justify-center text-[var(--brand-dark)] group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                    <item.icon size={26} strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <h5 className="font-black text-gray-900 text-lg group-hover:text-[var(--brand-dark)] transition-colors uppercase tracking-tight">
                      {item.title}
                    </h5>
                    <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileApp />
    </>
  );
};

export default Home;
