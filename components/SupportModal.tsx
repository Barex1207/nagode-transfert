
import React, { useState } from 'react';
import { X, Phone, Headphones, MessageCircle, ArrowRight, MapPin, Bus, Box, CreditCard, ChevronLeft } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SupportStep = 'selection' | 'details' | 'results';
type SupportType = 'ticket' | 'parcel' | 'money';

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<SupportStep>('selection');
  const [type, setType] = useState<SupportType | null>(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  if (!isOpen) return null;

  const allNumbers = [
    { num: "93 76 25 60", code: "+228" },
    { num: "93 25 66 23", code: "+228" },
    { num: "93 25 66 24", code: "+228" },
    { num: "93 25 66 80", code: "+228" },
    { num: "93 17 27 92", code: "+228" },
    { num: "90 77 20 13", code: "+228" }
  ];

  const moneyNumber = { num: "90 77 20 13", code: "+228" };

  const handleSelection = (selectedType: SupportType) => {
    setType(selectedType);
    if (selectedType === 'money') {
      setStep('results');
    } else {
      setStep('details');
    }
  };

  const handleReset = () => {
    setStep('selection');
    setType(null);
    setOrigin('');
    setDestination('');
  };

  const formatForCall = (code: string, num: string) => `tel:${code}${num.replace(/\s/g, '')}`;

  const renderSelection = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <p className="text-gray-500 text-sm font-medium mb-6">
        Quel service souhaitez-vous contacter ?
      </p>
      <button 
        onClick={() => handleSelection('ticket')}
        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-[#6F1AAE]/5 border border-gray-100 rounded-2xl transition-all group"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6F1AAE] shadow-sm">
            <Bus size={24} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Réserver un ticket</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Voyagez avec nous</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-gray-300 group-hover:text-[#6F1AAE] group-hover:translate-x-1 transition-all" />
      </button>

      <button 
        onClick={() => handleSelection('parcel')}
        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-[#6F1AAE]/5 border border-gray-100 rounded-2xl transition-all group"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6F1AAE] shadow-sm">
            <Box size={24} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Envoi ou suivi colis</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Logistique & Colis</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-gray-300 group-hover:text-[#6F1AAE] group-hover:translate-x-1 transition-all" />
      </button>

      <button 
        onClick={() => handleSelection('money')}
        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-[#6F1AAE]/5 border border-gray-100 rounded-2xl transition-all group"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6F1AAE] shadow-sm">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Transférer de l'argent</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Nagode Pay</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-gray-300 group-hover:text-[#6F1AAE] group-hover:translate-x-1 transition-all" />
      </button>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={handleReset} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <p className="text-gray-500 text-sm font-medium">Précisez votre itinéraire</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
            {type === 'ticket' ? "D'où partez-vous ?" : "D'où est parti le colis ?"}
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ville de départ"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
            {type === 'ticket' ? "Où allez-vous ?" : "Où va le colis ?"}
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ville d'arrivée"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <button 
          disabled={!origin || !destination}
          onClick={() => setStep('results')}
          className="w-full py-5 bg-[#6F1AAE] text-white font-black rounded-2xl shadow-xl hover:shadow-[#6F1AAE]/40 hover:bg-[#5A148C] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none mt-4"
        >
          Afficher les numéros
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    const isMoney = type === 'money';
    const numbersToShow = isMoney ? [moneyNumber] : allNumbers;
    
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <p className="text-gray-500 text-sm font-medium">Numéros à contacter</p>
        </div>

        <div className="bg-[#6F1AAE]/5 p-4 rounded-2xl border border-[#6F1AAE]/10 mb-6">
          <div className="flex items-center gap-3">
             <div className="text-[#6F1AAE] bg-white p-2 rounded-lg shadow-sm">
                {type === 'ticket' ? <Bus size={18} /> : type === 'parcel' ? <Box size={18} /> : <CreditCard size={18} />}
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6F1AAE] opacity-70">
                  {type === 'ticket' ? 'Réservation Ticket' : type === 'parcel' ? 'Colis & Logistique' : 'Transfert d\'Argent'}
                </p>
                {origin && destination && (
                  <p className="text-xs font-bold text-gray-700">{origin} <span className="text-gray-300 mx-1">→</span> {destination}</p>
                )}
             </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 font-medium italic mb-2">
          {isMoney 
            ? "Pour vos transferts, un numéro spécifique est à votre disposition :" 
            : "Tous nos numéros d'assistance sont disponibles pour vous répondre :"}
        </p>

        <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
          {numbersToShow.map((item, idx) => (
            <a 
              key={idx}
              href={formatForCall(item.code, item.num)}
              className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-[#6F1AAE] rounded-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#6F1AAE] group-hover:scale-110 transition-transform shadow-sm">
                  <Phone size={18} />
                </div>
                <span className="font-black text-[#6F1AAE] group-hover:text-white transition-colors text-lg tracking-wider">
                  {item.code} {item.num}
                </span>
              </div>
              <div className="bg-[#6F1AAE]/10 text-[#6F1AAE] group-hover:bg-white group-hover:text-[#6F1AAE] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Appeler
              </div>
            </a>
          ))}
        </div>

        <button 
          onClick={handleReset}
          className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#6F1AAE] transition-colors pt-4"
        >
          Retour au menu principal
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#6F1AAE] p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Headphones size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Assistance 24/7</h3>
              <p className="text-white/70 text-sm font-medium">Conseillers Nagode Transfert</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {step === 'selection' && renderSelection()}
          {step === 'details' && renderDetails()}
          {step === 'results' && renderResults()}

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400">
             <MessageCircle size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Nagode Transfert à votre service</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
