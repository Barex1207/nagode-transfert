import React, { useEffect, useState } from 'react';
import { ArrowRight, Bus, Users } from 'lucide-react';
import { api } from '../lib/api';
import { useSettings } from '../context/SettingsContext';

type VehicleStatus = 'ACTIF' | 'MAINTENANCE' | 'HORS_SERVICE';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  imageUrl: string | null;
  description: string;
  capacity: number;
  status: VehicleStatus;
}

const STATUS_LABEL: Record<VehicleStatus, string> = {
  ACTIF: 'En service',
  MAINTENANCE: 'En maintenance',
  HORS_SERVICE: 'Hors service',
};

const STATUS_DOT: Record<VehicleStatus, string> = {
  ACTIF: 'bg-green-400',
  MAINTENANCE: 'bg-amber-400',
  HORS_SERVICE: 'bg-red-400',
};

function scrollToBooking(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const Fleet: React.FC = () => {
  const settings = useSettings();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Vehicle[]>('/vehicles')
      .then((data) => setVehicles(data.filter((v) => v.status !== 'HORS_SERVICE')))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="flotte-section" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)]">Notre Flotte</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Des Bus Modernes &amp; Confortables
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Une flotte régulièrement entretenue, pensée pour votre confort et votre sécurité à chaque trajet.
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-gray-300 shadow-sm">
              <Bus size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {loading ? 'Chargement de la flotte…' : 'La flotte sera bientôt en ligne'}
            </h3>
            {!loading && (
              <p className="text-sm text-gray-400 mt-1">Nos véhicules apparaîtront ici dès leur ajout.</p>
            )}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((vehicle, idx) => (
            <div
              key={vehicle.id}
              className="group relative rounded-[2rem] overflow-hidden bg-white shadow-[0_4px_20px_rgb(var(--brand-dark-rgb)/12%)] hover:shadow-[0_12px_32px_rgb(var(--brand-dark-rgb)/22%)] hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Bus size={40} />
                  </div>
                )}
                <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[vehicle.status]}`} />
                  {STATUS_LABEL[vehicle.status]}
                </span>
              </div>

              <div className="bg-[#07111f] px-4 py-3">
                <span className="block text-[11px] font-black uppercase tracking-wider text-white/85 truncate">
                  {vehicle.name}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-white/50 truncate">
                  {vehicle.model}
                  {vehicle.capacity > 0 && (
                    <span className="flex items-center gap-1 shrink-0">
                      <Users size={11} />
                      {vehicle.capacity}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="mt-14 flex flex-col items-center gap-6">
          <div className="w-16 h-1 rounded-full bg-[var(--brand-dark)]" />
          {settings.slogan && (
            <p className="text-sm italic text-gray-400 text-center max-w-lg">
              "{settings.slogan}" — {settings.siteName}
            </p>
          )}
          <a
            href="#booking-section"
            onClick={scrollToBooking}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand-dark)] text-white text-xs font-black uppercase tracking-widest shadow-[0_4px_20px_rgb(var(--brand-dark-rgb)/30%)] hover:bg-[var(--brand-dark-hover)] hover:scale-105 transition-all"
          >
            Réservez votre place
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
