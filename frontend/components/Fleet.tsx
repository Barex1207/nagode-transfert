import React, { useEffect, useState } from 'react';
import {
  Armchair,
  ArrowRight,
  Bus,
  Coffee,
  Luggage,
  MapPin,
  Snowflake,
  Toilet,
  Tv,
  Usb,
  Users,
  Wifi,
} from 'lucide-react';
import { api } from '../lib/api';
import { useSettings } from '../context/SettingsContext';

type VehicleStatus = 'ACTIF' | 'MAINTENANCE' | 'HORS_SERVICE';
type VehicleCategory = 'STANDARD' | 'VIP' | 'PRESTIGE';
type VehicleAmenity =
  | 'CLIMATISATION'
  | 'WIFI'
  | 'USB'
  | 'SIEGES_INCLINABLES'
  | 'TOILETTES'
  | 'ECRAN'
  | 'BAGAGES'
  | 'COLLATION';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  imageUrl: string | null;
  description: string;
  capacity: number;
  status: VehicleStatus;
  category: VehicleCategory;
  amenities: VehicleAmenity[];
  routes: string[];
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

const AMENITY_LABEL: Record<VehicleAmenity, string> = {
  CLIMATISATION: 'Climatisation',
  WIFI: 'Wifi à bord',
  USB: 'Prises USB',
  SIEGES_INCLINABLES: 'Sièges inclinables',
  TOILETTES: 'Toilettes à bord',
  ECRAN: 'Écran de divertissement',
  BAGAGES: 'Grand espace bagages',
  COLLATION: 'Collation offerte',
};

const AMENITY_ICON: Record<VehicleAmenity, React.ComponentType<{ size?: number }>> = {
  CLIMATISATION: Snowflake,
  WIFI: Wifi,
  USB: Usb,
  SIEGES_INCLINABLES: Armchair,
  TOILETTES: Toilet,
  ECRAN: Tv,
  BAGAGES: Luggage,
  COLLATION: Coffee,
};

const CATEGORY_META: Record<VehicleCategory, { label: string; tagline: string }> = {
  STANDARD: { label: 'Gamme Standard', tagline: "L'essentiel du confort pour vos trajets du quotidien." },
  VIP: { label: 'Gamme VIP', tagline: 'Plus d’espace et d’équipements pour voyager sereinement.' },
  PRESTIGE: { label: 'Gamme Prestige', tagline: 'Le meilleur de Nagode Transfert, pour un voyage haut de gamme.' },
};

const CATEGORY_ORDER: VehicleCategory[] = ['STANDARD', 'VIP', 'PRESTIGE'];

function scrollToBooking(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const VehicleCard: React.FC<{ vehicle: Vehicle; delay: number }> = ({ vehicle, delay }) => (
  <div
    className="group relative rounded-[2rem] overflow-hidden bg-white shadow-[0_4px_20px_rgb(var(--brand-dark-rgb)/12%)] hover:shadow-[0_12px_32px_rgb(var(--brand-dark-rgb)/22%)] hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
    style={{ animationDelay: `${delay}ms` }}
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

    <div className="bg-[#07111f] px-4 pt-3 pb-4">
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

      {vehicle.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vehicle.amenities.map((a) => {
            const Icon = AMENITY_ICON[a];
            return (
              <span
                key={a}
                title={AMENITY_LABEL[a]}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/70"
              >
                <Icon size={12} />
              </span>
            );
          })}
        </div>
      )}

      {vehicle.routes.length > 0 && (
        <div className="mt-3 flex items-start gap-1.5 border-t border-white/10 pt-3 text-[10px] font-medium leading-relaxed text-white/50">
          <MapPin size={11} className="mt-0.5 shrink-0" />
          <span className="truncate">{vehicle.routes.join(' · ')}</span>
        </div>
      )}
    </div>
  </div>
);

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

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    vehicles: vehicles.filter((v) => v.category === category),
  })).filter((g) => g.vehicles.length > 0);

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

        {groups.length === 0 ? (
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
          <div className="space-y-16">
            {groups.map(({ category, vehicles: groupVehicles }) => (
              <div key={category}>
                <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    {CATEGORY_META[category].label}
                  </h3>
                  <p className="hidden sm:block text-sm text-gray-400 font-medium">{CATEGORY_META[category].tagline}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupVehicles.map((vehicle, idx) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} delay={idx * 100} />
                  ))}
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
