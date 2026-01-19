
import React, { useState, useMemo } from 'react';
import { Bus, Box, ChevronDown, MapPin, Info, Ticket, ArrowRight, Construction, Scale, Ruler, DollarSign, AlertTriangle, Globe, ShieldAlert, PackageSearch } from 'lucide-react';

type TravelClass = 'standard' | 'express';

interface PricingMap {
  [key: string]: number;
}

const busFares: PricingMap = {
  "Lomé-Notsè": 4000,
  "Atakpamé-Lomé": 4000,
  "Anié-Lomé": 4000,
  "Blitta-Lomé": 5500,
  "Lomé-Sotouboua": 5500,
  "Adjengré-Lomé": 5500,
  "Lomé-Sokodé": 5500,
  "Kara-Lomé": 7000,
  "Kétao-Lomé": 7500,
  "Kantè-Lomé": 8000,
  "Lomé-Niamtougou": 8000,
  "Lomé-Mango": 9000,
  "Dapaong-Lomé": 10000,
  "Bassar-Lomé": 6000,
  "Kabou-Lomé": 7000,
  "Kouka-Lomé": 7000,
  "Lomé-Tchamba": 6000,
  "Kaboli-Lomé": 7500,
  "Dapaong-Mango": 2000,
  "Dapaong-Kantè": 3500,
  "Dapaong-Niamtougou": 4000,
  "Dapaong-Kara": 5000,
  "Dapaong-Sokodé": 6000,
  "Dapaong-Sotouboua": 7500,
  "Blitta-Dapaong": 8000,
  "Atakpamé-Dapaong": 8500,
  "Kpalimé-Lomé": 2500,
  "Atakpamé-Sokodé": 4000,
  "Atakpamé-Kara": 5500,
  "Atakpamé-Niamtougou": 7000,
  "Atakpamé-Mango": 8500,
};

const Pricing: React.FC = () => {
  const [activeServiceTab, setActiveServiceTab] = useState<'bus' | 'colis'>('bus');
  
  const [selectedClass, setSelectedClass] = useState<TravelClass | ''>('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    Object.keys(busFares).forEach(key => {
      const [c1, c2] = key.split('-');
      citySet.add(c1);
      citySet.add(c2);
    });
    return Array.from(citySet).sort();
  }, []);

  const currentFare = useMemo(() => {
    if (!origin || !destination) return null;
    const key1 = `${origin}-${destination}`;
    const key2 = `${destination}-${origin}`;
    return busFares[key1] || busFares[key2] || null;
  }, [origin, destination]);

  return (
    <div className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#6F1AAE] uppercase tracking-tighter">Nos Tarifs</h1>
          <div className="w-24 h-1.5 bg-[#6F1AAE] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Tarification transparente et officielle de Nagode Transfert.
          </p>
        </div>

        {/* Onglets Bus / Colis */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100 flex gap-2">
            <button 
              onClick={() => setActiveServiceTab('bus')}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                activeServiceTab === 'bus' 
                ? 'bg-[#6F1AAE] text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bus size={20} />
              Tickets Bus
            </button>
            <button 
              onClick={() => setActiveServiceTab('colis')}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                activeServiceTab === 'colis' 
                ? 'bg-[#6F1AAE] text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Box size={20} />
              Envoi Colis
            </button>
          </div>
        </div>

        {activeServiceTab === 'bus' ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl mx-auto">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Grille des tarifs voyageurs</h3>
                <p className="text-sm text-gray-400 font-medium">Sélectionnez vos options pour connaître le tarif officiel.</p>
              </div>

              <div className="p-10 space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">
                    1. Choisir la Classe
                  </label>
                  <div className="relative group">
                    <select 
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value as TravelClass);
                        setOrigin('');
                        setDestination('');
                      }}
                      className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#6F1AAE] transition-all"
                    >
                      <option value="">Sélectionner une classe</option>
                      <option value="standard">Classe Standard</option>
                      <option value="express">Classe Express</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {selectedClass === 'express' && (
                  <div className="animate-in zoom-in-95 duration-500 py-12 flex flex-col items-center text-center space-y-4 bg-orange-50/30 rounded-[2rem] border border-orange-100">
                    <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                      <Construction size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-[#6F1AAE] uppercase tracking-tighter">Bientôt disponible</h4>
                    <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                      Nos services Express sont en cours de finalisation pour vous offrir plus de rapidité.
                    </p>
                  </div>
                )}

                {selectedClass === 'standard' && (
                  <div className="animate-in slide-in-from-right-4 duration-500 space-y-10">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Départ</label>
                        <div className="relative">
                          <select 
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#6F1AAE] transition-all"
                          >
                            <option value="">Sélectionner</option>
                            {cities.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                          <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        </div>
                       </div>

                       <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Destination</label>
                        <div className="relative">
                          <select 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#6F1AAE] transition-all"
                          >
                            <option value="">Sélectionner</option>
                            {cities.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                          <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        </div>
                       </div>
                    </div>

                    {origin && destination && (
                      <div className="animate-in zoom-in-95 duration-500">
                        {currentFare ? (
                          <div className="bg-[#6F1AAE]/5 p-10 rounded-[2.5rem] border border-[#6F1AAE]/10 text-center space-y-6">
                            <div className="flex items-center justify-center gap-4 text-gray-300">
                              <div className="h-[1px] w-12 bg-gray-200"></div>
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tarif du trajet</span>
                              <div className="h-[1px] w-12 bg-gray-200"></div>
                            </div>
                            
                            <div className="flex flex-col items-center gap-2">
                              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-4">
                                {origin} <ArrowRight className="text-[#6F1AAE]" size={20} /> {destination}
                              </h4>
                              <div className="text-6xl font-black text-[#6F1AAE] tracking-tighter mt-4 flex items-baseline gap-2">
                                {currentFare.toLocaleString('fr-FR')}
                                <span className="text-xl font-bold opacity-60">FCFA</span>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Aller simple • Classe Standard</span>
                            </div>

                            <button className="w-full mt-6 py-5 bg-[#6F1AAE] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#6F1AAE]/20 hover:bg-[#5A148C] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                              <Ticket size={18} />
                              Réserver ce trajet
                            </button>
                          </div>
                        ) : (
                          <div className="p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center space-y-3">
                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                               <MapPin size={24} />
                             </div>
                             <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Itinéraire non listé</p>
                             <p className="text-xs text-gray-500 leading-relaxed font-medium">
                               Veuillez contacter le centre d'appel pour connaître le tarif de cette liaison particulière.
                             </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-start gap-4">
                 <div className="w-10 h-10 bg-[#6F1AAE]/10 rounded-xl flex items-center justify-center text-[#6F1AAE] shrink-0">
                   <Info size={20} />
                 </div>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">
                   <span className="font-black text-gray-900 uppercase">Information :</span> Tous les tarifs sont indiqués pour un aller simple. Les prix sont identiques dans les deux sens de circulation. Réduction de 20% pour les enfants de moins de 10 ans.
                 </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto space-y-8">
            {/* Guide Informatique des Colis */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Guide des Tarifs Colis</h3>
                  <p className="text-sm text-gray-400 font-medium">Comprendre comment sont calculés nos frais d'expédition.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-[#6F1AAE]/10 rounded-2xl text-[#6F1AAE]">
                  <ShieldAlert size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Inspection Obligatoire</span>
                </div>
              </div>

              <div className="p-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* National (Before Sokodé) */}
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center space-y-4 hover:bg-[#6F1AAE]/5 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#6F1AAE]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Trajets Courts</h4>
                      <p className="text-xs font-bold text-gray-600 uppercase">Avant Sokodé</p>
                    </div>
                    <div className="text-4xl font-black text-[#6F1AAE] tracking-tighter">
                      1000<span className="text-xs ml-1 opacity-50 font-bold">FCFA</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tight">Prix minimum garanti pour les petits colis (enveloppes).</p>
                  </div>

                  {/* National (Beyond Sokodé) */}
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center space-y-4 hover:bg-[#6F1AAE]/5 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#6F1AAE]">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Longs Trajets</h4>
                      <p className="text-xs font-bold text-gray-600 uppercase">Sokodé et au-delà</p>
                    </div>
                    <div className="text-4xl font-black text-[#6F1AAE] tracking-tighter">
                      1500<span className="text-xs ml-1 opacity-50 font-bold">FCFA</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tight">Prix minimum appliqué dès que le trajet excède Sokodé.</p>
                  </div>

                  {/* International (Accra) */}
                  <div className="bg-[#6F1AAE] p-8 rounded-[2rem] text-white flex flex-col items-center text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1">International</h4>
                      <p className="text-xs font-bold uppercase">Lomé ↔ Accra</p>
                    </div>
                    <div className="text-4xl font-black tracking-tighter">
                      3000<span className="text-xs ml-1 opacity-50 font-bold">FCFA</span>
                    </div>
                    <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-tight">Tarif de base pour enveloppes et courriers vers le Ghana.</p>
                  </div>

                  {/* International (Abidjan) */}
                  <div className="bg-[#6F1AAE] p-8 rounded-[2rem] text-white flex flex-col items-center text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1">International</h4>
                      <p className="text-xs font-bold uppercase">Lomé ↔ Abidjan</p>
                    </div>
                    <div className="text-4xl font-black tracking-tighter">
                      5000<span className="text-xs ml-1 opacity-50 font-bold">FCFA</span>
                    </div>
                    <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-tight">Tarif de base pour enveloppes et courriers vers la Côte d'Ivoire.</p>
                  </div>
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-8 pt-10 border-t border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Scale className="text-[#6F1AAE]" size={20} />
                      <h4 className="font-black text-xs uppercase tracking-widest">Poids & Volume</h4>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Le tarif final est ajusté en fonction du poids réel et de la taille du colis. Les colis volumineux sont sujets à une tarification spéciale.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-[#6F1AAE]" size={20} />
                      <h4 className="font-black text-xs uppercase tracking-widest">Valeur Marchande</h4>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      La valeur déclarée du contenu influe sur l'assurance et le prix final pour garantir un transport sécurisé.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <PackageSearch className="text-[#6F1AAE]" size={20} />
                      <h4 className="font-black text-xs uppercase tracking-widest">Fouille & Sécurité</h4>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Chaque colis est minutieusement inspecté pour vérifier son contenu avant expédition, conformément aux règles de sécurité.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#6F1AAE]/5 border-t border-gray-100 flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#6F1AAE] shadow-sm shrink-0">
                  <Info size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-1">Information Expédition</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Pour envoyer un colis, rendez-vous en agence. Nos agents évalueront la taille, le poids et la valeur pour fixer le prix définitif. Le paiement s'effectue sur place lors du dépôt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
