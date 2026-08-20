
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportModal from './components/SupportModal';
import StickyMobileCTA from './components/StickyMobileCTA';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import { ServiceTab } from './types';

const News = lazy(() => import('./components/News'));
const Suggestions = lazy(() => import('./components/Suggestions'));
const Agencies = lazy(() => import('./components/Agencies'));
const Contact = lazy(() => import('./components/Contact'));
const Pricing = lazy(() => import('./components/Pricing'));
const Schedules = lazy(() => import('./components/Schedules'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const ChatbotTerms = lazy(() => import('./pages/ChatbotTerms'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Faq = lazy(() => import('./pages/Faq'));
const Testimonials = lazy(() => import('./pages/Testimonials'));

const RouteFallback: React.FC = () => (
  <div className="flex items-center justify-center py-32">
    <Loader2 className="animate-spin text-[var(--brand-dark)]" size={32} />
  </div>
);

const App: React.FC = () => {
  const [activeBookingTab, setActiveBookingTab] = useState<ServiceTab>(ServiceTab.TRANSPORT);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const location = useLocation();

  // Remonte en haut de page à chaque changement de route, sauf si une ancre (#section) est ciblée.
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home activeBookingTab={activeBookingTab} onTabChange={setActiveBookingTab} />} />
            <Route path="/agences" element={<Agencies />} />
            <Route path="/tarifs" element={<Pricing />} />
            <Route path="/horaires" element={<Schedules />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/confidentialite" element={<Privacy />} />
            <Route path="/conditions" element={<Terms />} />
            <Route path="/conditions-chatbot" element={<ChatbotTerms />} />
            <Route path="/merci" element={<ThankYou />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/avis" element={<Testimonials />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer onSupportClick={() => setIsSupportModalOpen(true)} />
      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
      <StickyMobileCTA />
      <ChatWidget />
    </div>
  );
};

export default App;
