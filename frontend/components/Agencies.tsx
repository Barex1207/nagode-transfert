
import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Phone, Search, Clock, ExternalLink, Mail } from 'lucide-react';
import { api } from '../lib/api';
import { useDocumentHead } from '../lib/useDocumentHead';
import AgencyMap from './AgencyMap';

interface Agency {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  address: string;
  openingHours: string;
  ticketPhones: string[];
  parcelPhones: string[];
  email: string | null;
  mapUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}

const COUNTRY_FLAG: Record<string, string> = {
  Togo: 'tg',
  Ghana: 'gh',
  "Côte d'Ivoire": 'ci',
  Bénin: 'bj',
  'Burkina Faso': 'bf',
};

const Agencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useDocumentHead({
    title: 'Nos Agences',
    description:
      "Retrouvez toutes les agences Nagode Transfert au Togo, au Ghana et en Côte d'Ivoire : adresses, horaires et numéros directs.",
  });

  useEffect(() => {
    api
      .get<Agency[]>('/agencies')
      .then((data) => {
        setAgencies(data);
        if (data.length > 0) setActiveCountry(data[0].country);
      })
      .catch(() => setAgencies([]))
      .finally(() => setLoading(false));
  }, []);

  const countries = useMemo(() => Array.from(new Set(agencies.map((a) => a.country))), [agencies]);

  const filteredAgencies = useMemo(
    () =>
      agencies
        .filter((a) => (activeCountry ? a.country === activeCountry : true))
        .filter((a) => a.city.toLowerCase().includes(searchQuery.toLowerCase())),
    [agencies, activeCountry, searchQuery],
  );

  return (
    <section className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Nos Agences</h2>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Trouvez le point de service Nagode Transfert le plus proche de vous.
          </p>
        </div>

        {countries.length > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex bg-gray-100 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => setActiveCountry(country)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeCountry === country
                      ? 'bg-white text-[var(--brand-dark)] shadow-md scale-105'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {COUNTRY_FLAG[country] && (
                    <img
                      src={`https://flagcdn.com/w40/${COUNTRY_FLAG[country]}.png`}
                      alt={country}
                      className="h-3.5 w-5 rounded-sm object-cover"
                    />
                  )}
                  {country}
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
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--brand-dark)] outline-none transition-all"
              />
            </div>
          </div>
        )}

        <AgencyMap agencies={filteredAgencies} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgencies.length > 0 ? (
            filteredAgencies.map((agency, idx) => (
              <div
                key={agency.id}
                className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[rgb(var(--brand-dark-rgb)/5%)] text-[var(--brand-dark)] rounded-xl flex items-center justify-center group-hover:bg-[var(--brand-dark)] group-hover:text-white transition-colors duration-300">
                    <MapPin size={28} />
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                    Guichet
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[var(--brand-dark)] transition-colors">
                  {agency.city}
                </h3>
                {agency.address && <p className="text-sm text-gray-400 font-medium mb-4">{agency.address}</p>}

                <div className="space-y-4 pt-6 border-t border-gray-50">
                  {agency.openingHours && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <Clock size={16} className="text-[var(--brand-dark)]" />
                      {agency.openingHours}
                    </div>
                  )}

                  {agency.ticketPhones.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tickets & Résas</p>
                      {agency.ticketPhones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${agency.countryCode}${phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-3 text-[15px] font-black text-gray-900 hover:text-[var(--brand-dark)] transition-colors"
                        >
                          <Phone size={16} className="text-[var(--brand-dark)]" />
                          <span className="tracking-widest">
                            {agency.countryCode} {phone}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {agency.parcelPhones.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Suivi Colis</p>
                      {agency.parcelPhones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${agency.countryCode}${phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-3 text-[15px] font-black text-gray-900 hover:text-[var(--brand-dark)] transition-colors"
                        >
                          <Phone size={16} className="text-[var(--brand-dark)]" />
                          <span className="tracking-widest">
                            {agency.countryCode} {phone}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {agency.email && (
                    <a
                      href={`mailto:${agency.email}`}
                      className="flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-[var(--brand-dark)] transition-colors"
                    >
                      <Mail size={16} className="text-[var(--brand-dark)]" />
                      {agency.email}
                    </a>
                  )}

                  {agency.mapUrl && (
                    <a
                      href={agency.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-dark)] hover:opacity-70 transition-opacity"
                    >
                      <ExternalLink size={14} />
                      Voir sur la carte
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {loading ? 'Chargement des agences…' : 'Aucune agence trouvée'}
              </h3>
              {!loading && <p className="text-gray-500">Essayez une autre recherche ou changez de pays.</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Agencies;
