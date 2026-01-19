
import React, { useState, useMemo } from 'react';
import { Clock, MapPin, Search, Calendar, ArrowRight, Info, Bus, Shield } from 'lucide-react';

interface ScheduleItem {
  origin: string;
  destination: string;
  times: string[];
  frequency: string;
}

const schedulesData: ScheduleItem[] = [
  { origin: "Lomé", destination: "Sokodé", times: ["06:00", "07:30", "12:00", "18:00"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Kara", times: ["06:00", "07:30", "18:00"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Dapaong", times: ["06:00", "07:30", "18:00"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Bassar", times: ["06:30", "12:30"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Kpalimé", times: ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Atakpamé", times: ["06:30", "08:30", "12:30", "16:30"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Accra (Ghana)", times: ["06:00", "08:00"], frequency: "Quotidien" },
  { origin: "Lomé", destination: "Abidjan (CI)", times: ["06:00"], frequency: "Lundi, Mercredi, Vendredi" },
  { origin: "Sokodé", destination: "Lomé", times: ["06:00", "07:30", "12:00", "18:00"], frequency: "Quotidien" },
  { origin: "Kara", destination: "Lomé", times: ["06:00", "07:30", "18:00"], frequency: "Quotidien" },
  { origin: "Dapaong", destination: "Lomé", times: ["05:30", "07:00", "17:30"], frequency: "Quotidien" },
  { origin: "Atakpamé", destination: "Lomé", times: ["06:00", "10:00", "14:00"], frequency: "Quotidien" },
  { origin: "Kpalimé", destination: "Lomé", times: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00"], frequency: "Quotidien" },
];

const Schedules: React.FC = () => {
  const [filterCity, setFilterCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const origins = useMemo(() => {
    return Array.from(new Set(schedulesData.map(s => s.origin))).sort();
  }, []);

  const filteredSchedules = useMemo(() => {
    return schedulesData.filter(s => {
      const matchFilter = filterCity ? s.origin === filterCity : true;
      const matchSearch = searchQuery 
        ? s.destination.toLowerCase().includes(searchQuery.toLowerCase()) || 
          s.origin.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchFilter && matchSearch;
    });
  }, [filterCity, searchQuery]);

  const rules = [
    "Présentez-vous 30 minutes avant le départ pour l'embarquement.",
    "Pour toute annulation de ticket, vous devez appeler une heure avant l'heure d'embarquement prévue.",
    "Chaque passager n'a droit qu'à deux bagages. Le dépassement de ce nombre entraînera des frais supplémentaires pour chaque bagage en plus."
  ];

  return (
    <section className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#6F1AAE] uppercase tracking-tighter">Horaires de Départ</h1>
          <div className="w-24 h-1.5 bg-[#6F1AAE] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Planifiez vos voyages en toute sérénité avec nos horaires officiels.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterCity("")}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterCity === "" 
                ? 'bg-white text-[#6F1AAE] shadow-md scale-105' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Tous les départs
            </button>
            {origins.map((city) => (
              <button
                key={city}
                onClick={() => setFilterCity(city)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterCity === city 
                  ? 'bg-white text-[#6F1AAE] shadow-md scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Depuis {city}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#6F1AAE] outline-none transition-all"
            />
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((item, idx) => (
              <div 
                key={`${item.origin}-${item.destination}-${idx}`}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#6F1AAE] text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Bus size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                        {item.origin} <ArrowRight className="text-[#6F1AAE]" size={18} /> {item.destination}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Ligne Interurbaine</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={14} />
                    {item.frequency}
                  </div>
                </div>

                <div className="p-8">
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {item.times.map((time, tIdx) => (
                       <div 
                        key={tIdx}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#6F1AAE]/30 hover:bg-[#6F1AAE]/5 transition-all group"
                       >
                         <Clock size={18} className="text-[#6F1AAE] mb-2 opacity-50 group-hover:opacity-100" />
                         <span className="text-lg font-black text-gray-900 group-hover:text-[#6F1AAE]">{time}</span>
                       </div>
                     ))}
                   </div>

                   <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 italic">
                        <Info size={14} />
                        Heure de démarrage prévue
                      </div>
                      <button className="flex items-center gap-2 text-[#6F1AAE] font-black text-xs uppercase tracking-widest hover:opacity-70 transition-opacity">
                        Réserver <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Aucun horaire trouvé</h3>
              <p className="text-gray-500">Essayez une autre destination ou changez de ville de départ.</p>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="mt-16 bg-[#6F1AAE] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Shield className="text-white" size={32} />
               </div>
               <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">Important pour votre voyage</h3>
               <p className="text-lg text-white/70 font-medium leading-relaxed max-w-sm">
                 Pour garantir votre place et le départ à l'heure, nous vous prions de respecter les consignes suivantes.
               </p>
             </div>
             
             {/* Box with blue border around rules as seen in the screenshot */}
             <div className="p-1 rounded-3xl border-[2.5px] border-blue-400/60 bg-white/5 overflow-hidden">
               <div className="space-y-4">
                 {rules.map((text, i) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-white/10 rounded-2xl transition-colors hover:bg-white/15">
                     <div className="w-8 h-8 rounded-full bg-white text-[#6F1AAE] flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                       {i + 1}
                     </div>
                     <p className="text-[13px] font-bold opacity-95 leading-relaxed">{text}</p>
                   </div>
                 ))}
               </div>
             </div>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[10rem] -mr-20 -mt-20"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-tr-[10rem] -ml-10 -mb-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Schedules;
