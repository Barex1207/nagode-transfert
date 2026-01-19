
import React from 'react';
import BookingForm from './BookingForm';
import { ServiceTab } from '../types';

interface HeroProps {
  activeBookingTab: ServiceTab;
  onTabChange: (tab: ServiceTab) => void;
}

const Hero: React.FC<HeroProps> = ({ activeBookingTab, onTabChange }) => {
  const customBgImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background avec overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={customBgImage} 
          className="w-full h-full object-cover" 
          alt="Nagode Transfert Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-light to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-white space-y-10 animate-in slide-in-from-left-8 duration-700">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1]">
              Voyagez, Envoyez,<br />
              <span className="text-[#8A2BE2]">Transférez en toute sécurité</span>
            </h1>
            <p className="text-xl text-white/80 font-medium max-w-lg leading-relaxed">
              Réservez votre trajet, suivez vos colis, ou effectuez des transferts d'argent facilement avec <span className="font-bold text-white">Nagode Transfert</span>.
            </p>
            <div className="flex gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden shadow-lg">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                   </div>
                 ))}
               </div>
               <div className="text-sm flex flex-col justify-center">
                  <div className="font-bold text-lg">+50,000</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider font-bold">Utilisateurs satisfaits</div>
               </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-in slide-in-from-right-8 duration-700">
            <BookingForm activeTab={activeBookingTab} onTabChange={onTabChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
