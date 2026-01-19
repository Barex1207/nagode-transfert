
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Search } from 'lucide-react';

interface Agency {
  id: string;
  city: string;
  ticketPhone: string;
  parcelPhone: string;
  email: string;
  code: string;
}

interface CountryAgencies {
  country: string;
  flag: string;
  agencies: Agency[];
}

const agenciesData: CountryAgencies[] = [
  {
    country: "Togo",
    flag: "🇹🇬",
    agencies: [
      { id: "tg-10", city: "Sokodé", ticketPhone: "71 11 91 64", parcelPhone: "90 34 88 66", code: "+228", email: "sokode@nagodetransfert.com" },
      { id: "tg-9", city: "Adjengré", ticketPhone: "93 25 66 79", parcelPhone: "93 25 66 79", code: "+228", email: "adjengre@nagodetransfert.com" },
      { id: "tg-8", city: "Sotouboua", ticketPhone: "71 11 91 63", parcelPhone: "71 11 91 63", code: "+228", email: "sotouboua@nagodetransfert.com" },
      { id: "tg-6", city: "Anié", ticketPhone: "93 17 27 93", parcelPhone: "93 17 27 93", code: "+228", email: "anie@nagodetransfert.com" },
      { id: "tg-5", city: "Atakpamé", ticketPhone: "93 52 67 97", parcelPhone: "93 52 67 97", code: "+228", email: "atakpame@nagodetransfert.com" },
      { id: "tg-3", city: "Adéticopé", ticketPhone: "71 11 91 61", parcelPhone: "71 64 76 38", code: "+228", email: "adeticope@nagodetransfert.com" },
      { id: "tg-2", city: "Agoé Zongo", ticketPhone: "71 11 91 41", parcelPhone: "71 11 91 59", code: "+228", email: "agoe@nagodetransfert.com" },
      { id: "tg-23", city: "Agbalépédo", ticketPhone: "71 11 91 40", parcelPhone: "93 52 67 98", code: "+228", email: "agbalepedo@nagodetransfert.com" },
      { id: "tg-24", city: "Lycée", ticketPhone: "91 29 24 19", parcelPhone: "91 29 24 19", code: "+228", email: "lycee@nagodetransfert.com" },
      { id: "tg-25", city: "Adidogomé", ticketPhone: "93 02 31 59", parcelPhone: "93 02 31 59", code: "+228", email: "adidogome@nagodetransfert.com" },
      { id: "tg-26", city: "Kpalimé", ticketPhone: "93 17 27 94", parcelPhone: "93 17 27 94", code: "+228", email: "kpalime@nagodetransfert.com" },
      { id: "tg-27", city: "Badou", ticketPhone: "93 25 66 62", parcelPhone: "93 25 66 62", code: "+228", email: "badou@nagodetransfert.com" },
      { id: "tg-14", city: "Tchamba", ticketPhone: "93 17 27 98", parcelPhone: "93 17 27 98", code: "+228", email: "tchamba@nagodetransfert.com" },
      { id: "tg-28", city: "Bafilo", ticketPhone: "71 64 76 37", parcelPhone: "71 64 76 37", code: "+228", email: "bafilo@nagodetransfert.com" },
      { id: "tg-16", city: "Kara", ticketPhone: "71 11 91 54", parcelPhone: "71 64 76 39", code: "+228", email: "kara@nagodetransfert.com" },
      { id: "tg-17", city: "Kétao", ticketPhone: "90 11 62 58", parcelPhone: "90 11 62 58", code: "+228", email: "ketao@nagodetransfert.com" },
      { id: "tg-29", city: "Lassa", ticketPhone: "71 64 76 35", parcelPhone: "71 64 76 35", code: "+228", email: "lassa@nagodetransfert.com" },
      { id: "tg-30", city: "Agloudé", ticketPhone: "93 17 27 99", parcelPhone: "93 17 27 99", code: "+228", email: "agloud@nagodetransfert.com" },
      { id: "tg-19", city: "Niamtougou", ticketPhone: "71 11 91 66", parcelPhone: "71 11 91 66", code: "+228", email: "niamtougou@nagodetransfert.com" },
      { id: "tg-18", city: "Kanté", ticketPhone: "71 11 91 67", parcelPhone: "71 11 91 67", code: "+228", email: "kante@nagodetransfert.com" },
      { id: "tg-20", city: "Mango", ticketPhone: "71 11 91 68", parcelPhone: "71 11 91 68", code: "+228", email: "mango@nagodetransfert.com" },
      { id: "tg-21", city: "Dapaong Transport", ticketPhone: "71 11 91 69", parcelPhone: "71 11 91 69", code: "+228", email: "dapaong@nagodetransfert.com" },
      { id: "tg-7", city: "Blitta", ticketPhone: "71 71 11 53", parcelPhone: "71 71 11 53", code: "+228", email: "blitta@nagodetransfert.com" },
      { id: "tg-4", city: "Notsè", ticketPhone: "71 71 11 52", parcelPhone: "71 71 11 52", code: "+228", email: "notse@nagodetransfert.com" },
      { id: "tg-11", city: "Bassar", ticketPhone: "71 71 11 40", parcelPhone: "71 71 11 40", code: "+228", email: "bassar@nagodetransfert.com" },
      { id: "tg-12", city: "Kabou", ticketPhone: "71 71 11 41", parcelPhone: "71 71 11 41", code: "+228", email: "kabou@nagodetransfert.com" },
      { id: "tg-13", city: "Kouka", ticketPhone: "71 71 11 42", parcelPhone: "71 71 11 42", code: "+228", email: "kouka@nagodetransfert.com" },
      { id: "tg-31", city: "Atikoumé", ticketPhone: "71 71 11 51", parcelPhone: "71 71 11 51", code: "+228", email: "atikoume@nagodetransfert.com" },
      { id: "tg-32", city: "Aflao", ticketPhone: "71 71 11 50", parcelPhone: "71 71 11 50", code: "+228", email: "aflao@nagodetransfert.com" },
      { id: "tg-15", city: "Kaboli", ticketPhone: "71 71 11 54", parcelPhone: "71 71 11 54", code: "+228", email: "kaboli@nagodetransfert.com" }
    ]
  },
  {
    country: "Ghana",
    flag: "🇬🇭",
    agencies: [
      { id: "gh-1", city: "Atchimota/Adenta", ticketPhone: "53 051 6230", parcelPhone: "53 051 6230", code: "+233", email: "ghana@nagodetransfert.com" }
    ]
  },
  {
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    agencies: [
      { id: "ci-1", city: "Koumassi", ticketPhone: "70 404 1286", parcelPhone: "70 404 1286", code: "+225", email: "ci@nagodetransfert.com" }
    ]
  }
];

const Agencies: React.FC = () => {
  const [activeCountry, setActiveCountry] = useState<string>("Togo");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgencies = agenciesData
    .find(c => c.country === activeCountry)
    ?.agencies.filter(a => 
      a.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <section className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-black text-[#6F1AAE] uppercase tracking-tighter">Nos Agences</h2>
          <div className="w-24 h-1.5 bg-[#6F1AAE] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Trouvez le point de service Nagode Transfert le plus proche de vous.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {agenciesData.map((c) => (
              <button
                key={c.country}
                onClick={() => setActiveCountry(c.country)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCountry === c.country 
                  ? 'bg-white text-[#6F1AAE] shadow-md scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                {c.country}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#6F1AAE] outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgencies.length > 0 ? (
            filteredAgencies.map((agency, idx) => (
              <div 
                key={agency.id} 
                className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[#6F1AAE]/5 text-[#6F1AAE] rounded-2xl flex items-center justify-center group-hover:bg-[#6F1AAE] group-hover:text-white transition-colors duration-300">
                    <MapPin size={28} />
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                    Guichet
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-[#6F1AAE] transition-colors">{agency.city}</h3>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tickets & Résas</p>
                    <a href={`tel:${agency.code}${agency.ticketPhone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-[15px] font-black text-gray-900 hover:text-[#6F1AAE] transition-colors">
                      <Phone size={16} className="text-[#6F1AAE]" />
                      <span className="tracking-widest">{agency.code} {agency.ticketPhone}</span>
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Suivi Colis</p>
                    <a href={`tel:${agency.code}${agency.parcelPhone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-[15px] font-black text-gray-900 hover:text-[#6F1AAE] transition-colors">
                      <Phone size={16} className="text-[#6F1AAE]" />
                      <span className="tracking-widest">{agency.code} {agency.parcelPhone}</span>
                    </a>
                  </div>
                  <div className="pt-2">
                    <a href={`mailto:${agency.email}`} className="flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-[#6F1AAE] transition-colors">
                      <Mail size={16} className="text-[#6F1AAE]" />
                      {agency.email}
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Aucune agence trouvée</h3>
              <p className="text-gray-500">Essayez une autre recherche ou changez de pays.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Agencies;
