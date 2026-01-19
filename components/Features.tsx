
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Ship, ShieldCheck, Zap, Award, Users, Armchair } from 'lucide-react';

interface FeatureItem {
  title: string;
  icon: React.ReactNode;
}

const allFeatures: FeatureItem[] = [
  { title: 'Confort', icon: <Armchair size={24} /> },
  { title: 'Sécurité', icon: <ShieldCheck size={24} /> },
  { title: 'Flotte', icon: <Ship size={24} /> },
  { title: 'Fiabilité', icon: <Award size={24} /> },
  { title: 'Rapidité', icon: <Zap size={24} /> },
  { title: 'Support', icon: <Users size={24} /> },
];

const Features: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const autoPlayRef = useRef<number | null>(null);

  const nextFeature = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allFeatures.length);
  }, []);

  const prevFeature = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allFeatures.length) % allFeatures.length);
  }, []);

  // Défilement automatique toutes les 3 secondes comme demandé
  useEffect(() => {
    autoPlayRef.current = window.setInterval(nextFeature, 3000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextFeature]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.pageX;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX;
    const walk = x - startX.current;
    if (Math.abs(walk) > 50) {
      if (walk > 0) prevFeature();
      else nextFeature();
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = window.setInterval(nextFeature, 3000);
  };

  const getVisibleItems = (offset: number, count: number) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(allFeatures[(currentIndex + offset + i) % allFeatures.length]);
    }
    return items;
  };

  const topRowItems = getVisibleItems(0, 3);
  const bottomRowItems = getVisibleItems(3, 3);

  // Image de fond paysage/lac comme sur le modèle
  const bgImage = "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000";

  return (
    <section className="relative py-20 overflow-hidden select-none min-h-[450px] flex items-center bg-[#FDFDFF]">
      {/* Background avec overlay pour lisibilité du texte */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Background paysage" />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Bloc Texte à Gauche */}
          <div className="lg:w-1/3 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D1B69] leading-tight">
                Une nouvelle façon de voyager
              </h2>
              <p className="text-gray-700 text-lg font-medium opacity-90 leading-snug">
                Voyagez dans des bus confort avec des chauffeurs expérimentés.
              </p>
            </div>
            
            {/* Bouton de navigation Précédent */}
            <div className="flex">
              <button 
                onClick={prevFeature}
                className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-[#2D1B69] hover:bg-gray-50 transition-all transform active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>

          {/* Grille de Navigation à Droite */}
          <div 
            className="lg:w-2/3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="flex-1 flex flex-col gap-2">
              {/* Ligne Supérieure : Cartes Violettes (Majeures) */}
              <div className="grid grid-cols-3 gap-2">
                {topRowItems.map((item, idx) => (
                  <div 
                    key={`top-${item.title}-${currentIndex}`}
                    className="h-24 md:h-28 flex flex-col items-center justify-center bg-[#4B32A1] text-white rounded-xl shadow-[0_4px_10px_rgba(45,27,105,0.3)] border-b-4 border-[#352378] transition-all duration-700 animate-in fade-in slide-in-from-right-4"
                  >
                    <div className="mb-1 opacity-80">{item.icon}</div>
                    <span className="font-bold text-lg md:text-xl tracking-wide">{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Ligne Inférieure : Cartes Blanches (Mineures) */}
              <div className="grid grid-cols-3 gap-2">
                {bottomRowItems.map((item, idx) => (
                  <div 
                    key={`bottom-${item.title}-${currentIndex}`}
                    className="h-14 md:h-16 flex items-center justify-center bg-white text-[#2D1B69] font-bold text-base md:text-lg rounded-xl shadow-sm border border-gray-100 transition-all duration-700 animate-in fade-in slide-in-from-right-2"
                  >
                    <div className="mr-2 hidden md:block opacity-60 scale-75">{item.icon}</div>
                    {item.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton de navigation Suivant (Style bloc droit) */}
            <button 
              onClick={nextFeature}
              className="w-12 h-20 md:h-24 bg-[#2D1B69] text-white flex items-center justify-center rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-[#3d278f] transition-all group active:scale-95"
            >
              <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
