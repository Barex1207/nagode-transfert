
import React, { useEffect, useMemo, useState } from 'react';
import { Bus, Box, ChevronDown, MapPin, Info, Ticket, ArrowRight, Construction, ShieldAlert, Package } from 'lucide-react';
import { api } from '../lib/api';
import { useDocumentHead } from '../lib/useDocumentHead';

type TravelClass = 'standard' | 'express';

interface Fare {
  id: string;
  type: 'BUS' | 'COLIS';
  origin: string;
  destination: string;
  price: number;
  label: string;
  description: string;
}

const Pricing: React.FC = () => {
  const [fares, setFares] = useState<Fare[]>([]);
  const [activeServiceTab, setActiveServiceTab] = useState<'bus' | 'colis'>('bus');

  const [selectedClass, setSelectedClass] = useState<TravelClass | ''>('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  useDocumentHead({
    title: 'Tarifs',
    description:
      'Tarifs officiels des tickets de bus et des envois de colis Nagode Transfert : consultez le prix exact de votre trajet.',
  });

  useEffect(() => {
    api
      .get<Fare[]>('/fares')
      .then(setFares)
      .catch(() => setFares([]));
  }, []);

  const busFares = useMemo(() => fares.filter((f) => f.type === 'BUS'), [fares]);
  const colisFares = useMemo(() => fares.filter((f) => f.type === 'COLIS'), [fares]);

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    busFares.forEach((f) => {
      citySet.add(f.origin);
      citySet.add(f.destination);
    });
    return Array.from(citySet).sort();
  }, [busFares]);

  const currentFare = useMemo(() => {
    if (!origin || !destination) return null;
    return (
      busFares.find((f) => f.origin === origin && f.destination === destination) ||
      busFares.find((f) => f.origin === destination && f.destination === origin) ||
      null
    );
  }, [busFares, origin, destination]);

  return (
    <div className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Nos Tarifs</h1>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Tarification transparente et officielle de Nagode Transfert.
          </p>
        </div>

        {/* Onglets Bus / Colis */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex gap-2">
            <button
              onClick={() => setActiveServiceTab('bus')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                activeServiceTab === 'bus'
                ? 'bg-[var(--brand-dark)] text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bus size={20} />
              Tickets Bus
            </button>
            <button
              onClick={() => setActiveServiceTab('colis')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                activeServiceTab === 'colis'
                ? 'bg-[var(--brand-dark)] text-white shadow-lg'
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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
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
                      className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[var(--brand-dark)] transition-all"
                    >
                      <option value="">Sélectionner une classe</option>
                      <option value="standard">Classe Standard</option>
                      <option value="express">Classe Express</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {selectedClass === 'express' && (
                  <div className="animate-in zoom-in-95 duration-500 py-12 flex flex-col items-center text-center space-y-4 bg-orange-50/30 rounded-2xl border border-orange-100">
                    <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                      <Construction size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Bientôt disponible</h4>
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
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[var(--brand-dark)] transition-all"
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
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[var(--brand-dark)] transition-all"
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
                          <div className="relative bg-white rounded-3xl border border-[rgb(var(--brand-dark-rgb)/12%)] shadow-xl overflow-hidden">
                            {/* Souche de billet — encart trajet */}
                            <div className="bg-[rgb(var(--brand-dark-rgb)/5%)] px-10 pt-10 pb-8 text-center space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Billet Nagode Transfert</span>
                              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center justify-center gap-4">
                                {origin} <ArrowRight className="text-[var(--brand-dark)]" size={20} /> {destination}
                              </h4>
                              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aller simple • Classe Standard</span>
                            </div>

                            {/* Ligne de déchirure perforée */}
                            <div className="relative h-0">
                              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-brand-light" />
                              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-brand-light" />
                              <div className="absolute left-3 right-3 top-0 border-t-2 border-dashed border-gray-200" />
                            </div>

                            {/* Souche de billet — prix */}
                            <div className="px-10 pt-8 pb-10 text-center space-y-6">
                              <div className="tabular-nums text-6xl font-black text-gold tracking-tighter flex items-baseline justify-center gap-2">
                                {currentFare.price.toLocaleString('fr-FR')}
                                <span className="text-xl font-bold text-gray-400">FCFA</span>
                              </div>

                              <button className="w-full py-5 bg-[var(--brand-dark)] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[rgb(var(--brand-dark-rgb)/20%)] hover:bg-[var(--brand-dark-hover)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                <Ticket size={18} />
                                Réserver ce trajet
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center space-y-3">
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
                 <div className="w-10 h-10 bg-[rgb(var(--brand-dark-rgb)/10%)] rounded-xl flex items-center justify-center text-[var(--brand-dark)] shrink-0">
                   <Info size={20} />
                 </div>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">
                   <span className="font-black text-gray-900 uppercase">Information :</span> Tous les tarifs sont indiqués pour un aller simple. Les prix sont identiques dans les deux sens de circulation.
                 </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Guide des Tarifs Colis</h3>
                  <p className="text-sm text-gray-400 font-medium">Comprendre comment sont calculés nos frais d'expédition.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-[rgb(var(--brand-dark-rgb)/10%)] rounded-xl text-[var(--brand-dark)]">
                  <ShieldAlert size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Inspection Obligatoire</span>
                </div>
              </div>

              <div className="p-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {colisFares.map((fare, idx) => (
                    <div
                      key={fare.id}
                      className="relative bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:border-[rgb(var(--brand-dark-rgb)/25%)] transition-colors"
                    >
                      <div className="p-6 flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm text-[var(--brand-dark)] flex items-center justify-center">
                          <Package size={22} />
                        </div>
                        <p className="text-xs font-bold uppercase text-gray-600">{fare.label || fare.origin}</p>
                      </div>

                      <div className="relative h-0">
                        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-brand-light" />
                        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-brand-light" />
                        <div className="absolute left-3 right-3 top-0 border-t-2 border-dashed border-gray-200" />
                      </div>

                      <div className="p-6 pt-5 text-center space-y-2">
                        <div className="tabular-nums text-3xl font-black text-gold tracking-tighter">
                          {fare.price.toLocaleString('fr-FR')}
                          <span className="text-xs ml-1 font-bold text-gray-400">FCFA</span>
                        </div>
                        {fare.description && (
                          <p className="text-[10px] font-medium leading-relaxed uppercase tracking-tight text-gray-400">
                            {fare.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {colisFares.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-8">Aucun tarif colis publié pour le moment.</p>
                )}
              </div>

              <div className="p-8 bg-[rgb(var(--brand-dark-rgb)/5%)] border-t border-gray-100 flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[var(--brand-dark)] shadow-sm shrink-0">
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
