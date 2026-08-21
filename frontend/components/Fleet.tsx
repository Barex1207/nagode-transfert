import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, ArrowRight, Bus, Snowflake, Users, Wifi } from 'lucide-react';
import { api } from '../lib/api';

type VehicleStatus = 'ACTIF' | 'MAINTENANCE' | 'HORS_SERVICE';
type VehicleCategory = 'STANDARD' | 'VIP' | 'PRESTIGE' | 'CARGO';
type VehicleAmenity =
  | 'CLIMATISATION'
  | 'WIFI'
  | 'USB'
  | 'SIEGES_INCLINABLES'
  | 'TOILETTES'
  | 'ECRAN'
  | 'BAGAGES'
  | 'COLLATION'
  | 'ECLAIRAGE_LED';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  images: string[];
  capacity: number | null;
  status: VehicleStatus;
  category: VehicleCategory;
  amenities: VehicleAmenity[];
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

const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  STANDARD: 'Standard',
  VIP: 'VIP',
  PRESTIGE: 'Prestige',
  CARGO: 'Cargo',
};

const AMENITY_ICON: Partial<Record<VehicleAmenity, React.ComponentType<{ size?: number }>>> = {
  CLIMATISATION: Snowflake,
  WIFI: Wifi,
  SIEGES_INCLINABLES: Armchair,
};

const TeaserCard: React.FC<{ vehicle: Vehicle; delay: number }> = ({ vehicle, delay }) => (
  <div
    className="group relative rounded-[2rem] overflow-hidden bg-white shadow-[0_4px_20px_rgb(var(--brand-dark-rgb)/12%)] hover:shadow-[0_12px_32px_rgb(var(--brand-dark-rgb)/22%)] hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
      {vehicle.images[0] ? (
        <img
          src={vehicle.images[0]}
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

    <div className="bg-[#07111f] px-4 pt-3 pb-4">
      <span className="block text-[11px] font-black uppercase tracking-wider text-white/85 truncate">
        {vehicle.name}
      </span>
      <span className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-white/50 truncate">
        {CATEGORY_LABEL[vehicle.category]}
        {vehicle.capacity != null && (
          <span className="flex items-center gap-1 shrink-0">
            <Users size={11} />
            {vehicle.capacity}
          </span>
        )}
      </span>

      {vehicle.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vehicle.amenities.map((a) => {
            const Icon = AMENITY_ICON[a];
            if (!Icon) return null;
            return (
              <span key={a} className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/70">
                <Icon size={12} />
              </span>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const Fleet: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Vehicle[]>('/vehicles')
      .then((data) => setVehicles(data.filter((v) => v.status !== 'HORS_SERVICE' && v.category !== 'CARGO')))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const teaser = vehicles.slice(0, 4);

  return (
    <section id="flotte-section" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)]">Notre Flotte</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Des Bus Modernes &amp; Confortables
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Standard ou Prestige : un aperçu des véhicules qui composent notre réseau.
          </p>
        </div>

        {teaser.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-white/70 py-10 px-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-300 shadow-sm">
              <Bus size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {loading ? 'Chargement de la flotte…' : 'Le détail de nos bus arrive bientôt'}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teaser.map((vehicle, idx) => (
              <TeaserCard key={vehicle.id} vehicle={vehicle} delay={idx * 100} />
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-col items-center gap-6">
          <div className="w-16 h-1 rounded-full bg-[var(--brand-dark)]" />
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/flotte"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand-dark)] text-white text-xs font-black uppercase tracking-widest shadow-[0_4px_20px_rgb(var(--brand-dark-rgb)/30%)] hover:bg-[var(--brand-dark-hover)] hover:scale-105 transition-all"
            >
              Voir toute notre flotte
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
