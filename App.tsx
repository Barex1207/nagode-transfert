
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Destinations from './components/Destinations';
import MobileApp from './components/MobileApp';
import Footer from './components/Footer';
import News from './components/News';
import Suggestions from './components/Suggestions';
import Agencies from './components/Agencies';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import Schedules from './components/Schedules';
import SupportModal from './components/SupportModal';
import { ServiceTab } from './types';

type ViewState = 'home' | 'news' | 'suggestions' | 'agencies' | 'contact' | 'pricing' | 'schedules';

const App: React.FC = () => {
  const [activeBookingTab, setActiveBookingTab] = useState<ServiceTab>(ServiceTab.TRANSPORT);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Scroll to top when changing view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleQuickLinkClick = (tab: ServiceTab) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById('booking-section');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setActiveBookingTab(tab);
      const element = document.getElementById('booking-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'news':
        return <News />;
      case 'suggestions':
        return <Suggestions />;
      case 'agencies':
        return <Agencies />;
      case 'contact':
        return <Contact />;
      case 'pricing':
        return <Pricing />;
      case 'schedules':
        return <Schedules />;
      default:
        return (
          <>
            <Hero activeBookingTab={activeBookingTab} onTabChange={setActiveBookingTab} />
            <Features />
            <Destinations />
            
            <div className="pb-24 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="p-1 rounded-3xl border-[2.5px] border-blue-200/60 bg-white shadow-sm overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-0">
                       {[
                         { 
                           title: 'TICKET', 
                           icon: '🚌', 
                           desc: 'Voyagez confortablement',
                           tab: ServiceTab.TRANSPORT
                         },
                         { 
                           title: 'ENVOI COLIS', 
                           icon: '📦', 
                           desc: 'Sécurité et rapidité',
                           tab: ServiceTab.COLIS
                         },
                         { 
                           title: 'TRANSFERT D\'ARGENT', 
                           icon: '💸', 
                           desc: 'Envoyez à vos proches',
                           tab: ServiceTab.ARGENT
                         }
                       ].map((item, i) => (
                         <div 
                           key={i} 
                           onClick={() => handleQuickLinkClick(item.tab)}
                           className={`p-10 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer group relative ${
                             i !== 2 ? 'border-r border-gray-100' : ''
                           }`}
                         >
                           <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
                             {item.icon}
                           </div>
                           <div className="text-center">
                             <h5 className="font-black text-[#6F1AAE] text-lg group-hover:text-[#8A2BE2] transition-colors uppercase tracking-tight">
                               {item.title}
                             </h5>
                             <p className="text-sm text-gray-400 font-medium">
                               {item.desc}
                             </p>
                           </div>
                           <div className="absolute bottom-0 left-0 w-full h-1 bg-[#6F1AAE] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>

            <MobileApp />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar onNavigate={navigateTo} currentView={currentView} />
      <main>
        {renderContent()}
      </main>
      <Footer 
        onNavigate={navigateTo} 
        onSupportClick={() => setIsSupportModalOpen(true)} 
      />
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </div>
  );
};

export default App;
