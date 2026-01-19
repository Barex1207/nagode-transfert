
import React, { useState } from 'react';
import { ChevronDown, Construction, Search, Phone, Box, Ticket, XCircle, ArrowLeft, MapPin, AlertCircle, Info } from 'lucide-react';
import { ServiceTab } from '../types';

type TicketAction = 'choice' | 'reservation' | 'modification';

interface BookingFormProps {
  activeTab: ServiceTab;
  onTabChange: (tab: ServiceTab) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ activeTab, onTabChange }) => {
  const [ticketAction, setTicketAction] = useState<TicketAction>('choice');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedParcelAgency, setSelectedParcelAgency] = useState('');

  const tabs = [
    { id: ServiceTab.TRANSPORT, label: 'TICKET' },
    { id: ServiceTab.COLIS, label: 'ENVOI COLIS' },
    { id: ServiceTab.ARGENT, label: "TRANSFERT D'ARGENT" },
  ];

  const callCenterNumbers = [
    { num: "93 76 25 60", code: "+228" },
    { num: "93 25 66 23", code: "+228" },
    { num: "93 25 66 24", code: "+228" },
    { num: "93 25 66 80", code: "+228" },
    { num: "93 17 27 92", code: "+228" },
    { num: "90 77 20 13", code: "+228" }
  ];

  // Données extraites rigoureusement du tableau fourni
  const agenciesData: Record<string, { ticket: string[], parcel: string[], code: string }> = {
    "Sokodé": { ticket: ["71 11 91 64"], parcel: ["90 34 88 66", "91 26 59 76", "93 77 28 76"], code: "+228" },
    "Adjengré": { ticket: ["93 25 66 79"], parcel: ["93 25 66 79"], code: "+228" },
    "Sotouboua": { ticket: ["71 11 91 63"], parcel: ["71 11 91 63"], code: "+228" },
    "Anié": { ticket: ["93 17 27 93"], parcel: ["93 17 27 93"], code: "+228" },
    "Atakpamé": { ticket: ["93 52 67 97", "71 11 91 62"], parcel: ["93 52 67 97", "71 11 91 62"], code: "+228" },
    "Adéticopé": { ticket: ["71 11 91 61"], parcel: ["71 64 76 38"], code: "+228" },
    "Agoé Zongo": { ticket: ["71 11 91 41"], parcel: ["71 11 91 59"], code: "+228" },
    "Agbalépédo": { ticket: ["71 11 91 40"], parcel: ["93 52 67 98"], code: "+228" },
    "Lycée": { ticket: ["91 29 24 19"], parcel: ["91 29 24 19"], code: "+228" },
    "Adidogomé": { ticket: ["93 02 31 59"], parcel: ["93 02 31 59"], code: "+228" },
    "Kpalimé": { ticket: ["93 17 27 94"], parcel: ["93 17 27 94"], code: "+228" },
    "Badou": { ticket: ["93 25 66 62"], parcel: ["93 25 66 62"], code: "+228" },
    "Tchamba": { ticket: ["93 17 27 98"], parcel: ["93 17 27 98"], code: "+228" },
    "Bafilo": { ticket: ["71 64 76 37"], parcel: ["71 64 76 37"], code: "+228" },
    "Kara": { ticket: ["71 11 91 54"], parcel: ["71 64 76 39", "71 11 91 65"], code: "+228" },
    "Kétao": { ticket: ["90 11 62 58"], parcel: ["90 11 62 58"], code: "+228" },
    "Lassa": { ticket: ["71 64 76 35"], parcel: ["71 64 76 35"], code: "+228" },
    "Agloudé": { ticket: ["93 17 27 99"], parcel: ["93 17 27 99"], code: "+228" },
    "Niamtougou": { ticket: ["71 11 91 66"], parcel: ["71 11 91 66"], code: "+228" },
    "Kanté": { ticket: ["71 11 91 67"], parcel: ["71 11 91 67"], code: "+228" },
    "Mango": { ticket: ["71 11 91 68"], parcel: ["71 11 91 68"], code: "+228" },
    "Dapaong Transport": { ticket: ["71 11 91 69"], parcel: ["71 11 91 69"], code: "+228" },
    "Blitta": { ticket: ["71 71 11 53"], parcel: ["71 71 11 53"], code: "+228" },
    "Notsè": { ticket: ["71 71 11 52"], parcel: ["71 71 11 52"], code: "+228" },
    "Bassar": { ticket: ["71 71 11 40"], parcel: ["71 71 11 40"], code: "+228" },
    "Kabou": { ticket: ["71 71 11 41"], parcel: ["71 71 11 41"], code: "+228" },
    "Kouka": { ticket: ["71 71 11 42"], parcel: ["71 71 11 42"], code: "+228" },
    "Atikoumé": { ticket: ["71 71 11 51"], parcel: ["71 71 11 51"], code: "+228" },
    "Aflao": { ticket: ["71 71 11 50"], parcel: ["71 71 11 50"], code: "+228" },
    "Kaboli": { ticket: ["71 71 11 54"], parcel: ["71 71 11 54"], code: "+228" },
    "Koumassi (Abidjan)": { ticket: ["70 404 1286"], parcel: ["70 404 1286"], code: "+225" },
    "Atchimota/Adenta (Accra)": { ticket: ["53 051 6230"], parcel: ["53 051 6230"], code: "+233" }
  };

  const ImportantNote = () => (
    <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 mt-6">
      <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
      <p className="text-[11px] leading-relaxed text-orange-800 font-bold uppercase tracking-tight">
        <span className="font-black text-orange-600">NB :</span> Pour toute annulation ou report de ticket, veuillez appeler une heure avant votre rendez-vous.
      </p>
    </div>
  );

  return (
    <div id="booking-section" className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-700 border border-gray-100 transition-all duration-500">
      <div className="flex bg-gray-50 border-b border-gray-200 p-1.5">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative flex-1">
            <button
              onClick={() => {
                onTabChange(tab.id);
                setTicketAction('choice');
                setSelectedAgency('');
                setSelectedParcelAgency('');
              }}
              className={`w-full py-3.5 text-[10px] font-black transition-all duration-300 rounded-xl uppercase tracking-widest ${
                activeTab === tab.id 
                ? 'bg-[#6F1AAE] text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
            {activeTab === tab.id && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#6F1AAE] z-10"></div>
            )}
          </div>
        ))}
      </div>

      <div className="p-8 space-y-6 min-h-[420px]">
        {activeTab === ServiceTab.TRANSPORT && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            {ticketAction === 'choice' && (
              <div className="space-y-4 py-4">
                <button 
                  onClick={() => setTicketAction('reservation')}
                  className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-[#6F1AAE]/5 border border-gray-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6F1AAE] shadow-sm">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Réservation</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Réservez votre place</p>
                    </div>
                  </div>
                  <ChevronDown size={20} className="text-gray-300 -rotate-90 group-hover:text-[#6F1AAE] transition-all" />
                </button>

                <button 
                  onClick={() => setTicketAction('modification')}
                  className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-[#6F1AAE]/5 border border-gray-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6F1AAE] shadow-sm">
                      <XCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Annulation ou report</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Gérer mon ticket existant</p>
                    </div>
                  </div>
                  <ChevronDown size={20} className="text-gray-300 -rotate-90 group-hover:text-[#6F1AAE] transition-all" />
                </button>
              </div>
            )}

            {ticketAction === 'reservation' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <button 
                  onClick={() => setTicketAction('choice')}
                  className="flex items-center gap-2 text-[#6F1AAE] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity mb-2"
                >
                  <ArrowLeft size={14} /> Retour
                </button>
                <div className="text-center space-y-2">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Centre d'appel de réservation</h4>
                  <p className="text-xs text-gray-400 font-medium">Appelez pour effectuer votre réservation :</p>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                  {callCenterNumbers.map((item, i) => (
                    <a 
                      key={i} 
                      href={`tel:${item.code}${item.num.replace(/\s/g, '')}`}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-[#6F1AAE] group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-[#6F1AAE] group-hover:text-white" />
                        <span className="text-[13px] font-black text-gray-900 group-hover:text-white tracking-widest">{item.code} {item.num}</span>
                      </div>
                      <span className="text-[9px] font-black text-[#6F1AAE] group-hover:text-white uppercase tracking-widest bg-white group-hover:bg-white/20 px-2 py-1 rounded shadow-sm">Appeler</span>
                    </a>
                  ))}
                </div>
                <ImportantNote />
              </div>
            )}

            {ticketAction === 'modification' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <button 
                  onClick={() => {setTicketAction('choice'); setSelectedAgency('');}}
                  className="flex items-center gap-2 text-[#6F1AAE] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity mb-2"
                >
                  <ArrowLeft size={14} /> Retour
                </button>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Agence de départ</label>
                    <div className="relative group">
                      <select 
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none appearance-none pr-10 cursor-pointer font-bold focus:border-[#6F1AAE]"
                        value={selectedAgency}
                        onChange={(e) => setSelectedAgency(e.target.value)}
                      >
                        <option value="">Sélectionner une agence</option>
                        {Object.keys(agenciesData).sort().map(agency => (
                          <option key={agency} value={agency}>{agency}</option>
                        ))}
                      </select>
                      <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {selectedAgency && (
                    <div className="animate-in zoom-in-95 duration-500 bg-[#6F1AAE]/5 p-6 rounded-2xl border border-[#6F1AAE]/10 space-y-4">
                      <p className="text-xs text-gray-500 font-medium text-center">Pour annuler ou reporter au départ de <span className="font-black text-[#6F1AAE] uppercase">{selectedAgency}</span>, contactez le guichet :</p>
                      <div className="grid gap-2">
                        {agenciesData[selectedAgency].ticket.map((num, i) => (
                          <a 
                            key={i}
                            href={`tel:${agenciesData[selectedAgency].code}${num.replace(/\s/g, '')}`}
                            className="flex items-center justify-between px-6 py-4 bg-white border border-[#6F1AAE]/20 rounded-2xl shadow-sm hover:bg-[#6F1AAE] group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Phone size={18} className="text-[#6F1AAE] group-hover:text-white" />
                              <span className="text-base font-black text-[#6F1AAE] group-hover:text-white tracking-widest">{agenciesData[selectedAgency].code} {num}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-[#6F1AAE] group-hover:text-white">Appeler</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <ImportantNote />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === ServiceTab.COLIS && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Agence d'expédition</label>
              <div className="relative group">
                <select 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none appearance-none pr-10 cursor-pointer font-bold focus:border-[#6F1AAE] transition-all"
                  value={selectedParcelAgency}
                  onChange={(e) => setSelectedParcelAgency(e.target.value)}
                >
                  <option value="">Sélectionner votre agence Nagode</option>
                  {Object.keys(agenciesData).sort().map(agency => (
                    <option key={agency} value={agency}>{agency}</option>
                  ))}
                </select>
                <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedParcelAgency ? (
              <div className="animate-in zoom-in-95 duration-500 space-y-6">
                <div className="bg-[#6F1AAE]/5 p-10 rounded-[2.5rem] border border-[#6F1AAE]/10 text-center space-y-8 shadow-inner">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#6F1AAE] shadow-md mx-auto transform -rotate-3">
                    <Box size={40} />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-[#6F1AAE] uppercase tracking-[0.3em]">Agence Nagode {selectedParcelAgency}</h4>
                    <p className="text-sm text-gray-600 font-black uppercase tracking-tight">Suivi de votre colis / courrier :</p>
                  </div>

                  <div className="grid gap-3">
                    {agenciesData[selectedParcelAgency].parcel.map((num, i) => (
                      <a 
                        key={i}
                        href={`tel:${agenciesData[selectedParcelAgency].code}${num.replace(/\s/g, '')}`}
                        className="flex items-center justify-center gap-4 py-5 bg-[#6F1AAE] text-white rounded-[1.5rem] shadow-lg hover:bg-[#5A148C] hover:scale-105 transition-all group"
                      >
                        <Phone size={22} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-xl font-black tracking-widest">{agenciesData[selectedParcelAgency].code} {num}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Info size={16} />
                  </div>
                  <p className="text-[11px] text-blue-800/70 font-bold uppercase tracking-wide leading-relaxed">
                    Nos équipes vous renseigneront instantanément sur la position de votre envoi.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-5 opacity-30">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-gray-200">
                  <Search size={40} className="text-gray-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Prêt pour le suivi ?</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Choisissez l'agence d'origine de votre envoi</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === ServiceTab.ARGENT && (
           <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-600">
             <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <Construction size={48} className="animate-pulse" />
             </div>
             <h3 className="text-2xl font-black text-[#6F1AAE] mb-2 uppercase tracking-tight">Nagode Pay</h3>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Phase de développement</p>
             <p className="text-sm text-gray-400 mt-5 max-w-xs mx-auto leading-relaxed font-medium">
               Nous préparons un service de transfert d'argent ultra-sécurisé pour toute l'Afrique de l'Ouest.
             </p>
             <div className="mt-10 px-6 py-2 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
               Bientôt disponible
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
