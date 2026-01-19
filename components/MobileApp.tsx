
import React from 'react';
import { Apple, Play, Smartphone, Ship, Box, CreditCard } from 'lucide-react';

const MobileApp: React.FC = () => {
  const landscapeImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000";

  return (
    <section id="mobile-app-section" className="relative overflow-hidden min-h-[450px] flex items-center">
      {/* Background complexe : Image + Overlay Dégradé */}
      <div className="absolute inset-0 z-0">
        <img 
          src={landscapeImg} 
          className="w-full h-full object-cover" 
          alt="Paysage fond" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6F1AAE] via-[#6F1AAE]/95 to-[#6F1AAE]/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Bloc Texte (Gauche) */}
          <div className="text-white space-y-6 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Téléchargez notre app mobile
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              Réservez, suivez et transférez en toute simplicité <br className="hidden md:block" />
              grâce à notre application mobile gratuite.
            </p>
            
            {/* Boutons Store avec liens réels */}
            <div className="flex flex-wrap gap-4 pt-6">
              <a 
                href="https://apps.apple.com/us/app/nagode-bus/id1640486349" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl border border-white/10 hover:bg-gray-900 transition-all group"
              >
                <Apple size={28} className="fill-current" />
                <div className="text-left leading-none">
                  <span className="text-[10px] block opacity-60 font-medium">Download on the</span>
                  <span className="text-lg font-bold">App Store</span>
                </div>
              </a>
              
              <a 
                href="https://play.google.com/store/search?q=nagode+bus&c=apps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl border border-white/10 hover:bg-gray-900 transition-all group"
              >
                <Play size={24} className="fill-current" />
                <div className="text-left leading-none">
                  <span className="text-[10px] block opacity-60 font-medium">GET IT ON</span>
                  <span className="text-lg font-bold">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Bloc Visuel (Droite) */}
          <div className="relative flex justify-center lg:justify-end items-center mt-12 lg:mt-0">
            <div className="absolute -z-10 flex flex-wrap gap-4 w-[400px] justify-center opacity-80">
                <div className="w-16 h-16 bg-[#5A148C] rounded-2xl flex items-center justify-center transform -rotate-12 shadow-xl border border-white/10">
                    <Ship className="text-white/60" size={32} />
                </div>
                <div className="w-20 h-20 bg-[#6F1AAE] rounded-2xl flex items-center justify-center transform rotate-6 shadow-2xl translate-y-8 border border-white/20">
                    <Box className="text-white/80" size={40} />
                </div>
                <div className="w-14 h-14 bg-[#8A2BE2] rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg -translate-x-12 border border-white/10">
                    <CreditCard className="text-white/50" size={24} />
                </div>
            </div>

            <div className="relative w-full max-w-[280px] transform rotate-[12deg] shadow-[20px_40px_60px_rgba(0,0,0,0.5)] rounded-[2.5rem] border-[8px] border-black overflow-hidden hover:rotate-0 transition-transform duration-700 ease-out">
               <img 
                 src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800" 
                 alt="Nagode App Preview" 
                 className="w-full h-auto"
               />
               <div className="absolute inset-0 bg-[#6F1AAE]/10 pointer-events-none"></div>
            </div>

            <div className="absolute -bottom-4 right-10 md:right-20 bg-white p-3 rounded-2xl shadow-2xl animate-bounce hidden md:block">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <Smartphone size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#6F1AAE] uppercase">Nagode App</p>
                        <p className="text-[9px] text-gray-400 font-medium leading-none">Disponible maintenant</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
