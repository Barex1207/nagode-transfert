import React, { useState } from 'react';
import {
  Armchair,
  Bus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  LayoutGrid,
  Luggage,
  MapPin,
  Snowflake,
  Toilet,
  Truck,
  Tv,
  Usb,
  Users,
  Wifi,
} from 'lucide-react';
import SeatPlanModal, { type SeatPlanKey } from './seatPlans/SeatPlanModal';

type VehicleAmenity =
  | 'CLIMATISATION'
  | 'WIFI'
  | 'USB'
  | 'SIEGES_INCLINABLES'
  | 'TOILETTES'
  | 'ECRAN'
  | 'BAGAGES'
  | 'COLLATION';

export interface FlotteVehicle {
  id: string;
  name: string;
  model: string;
  images: string[];
  description: string;
  capacity: number | null;
  cargoCapacityLabel: string | null;
  unitCount: number | null;
  category: 'STANDARD' | 'VIP' | 'PRESTIGE' | 'CARGO';
  amenities: VehicleAmenity[];
  routes: string[];
  seatPlanKey: SeatPlanKey | null;
}

const AMENITY_LABEL: Record<VehicleAmenity, string> = {
  CLIMATISATION: 'Climatisation',
  WIFI: 'Wifi à bord',
  USB: 'Prises USB',
  SIEGES_INCLINABLES: 'Sièges inclinables',
  TOILETTES: 'Toilettes à bord',
  ECRAN: 'Écran individuel par siège',
  BAGAGES: 'Grand espace bagages',
  COLLATION: 'Restauration à bord',
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

const Gallery: React.FC<{ images: string[]; alt: string; isCargo: boolean }> = ({ images, alt, isCargo }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        {isCargo ? <Truck size={40} /> : <Bus size={40} />}
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 group/gallery">
      <img src={images[index]} alt={alt} className="h-full w-full object-cover" />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover/gallery:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover/gallery:opacity-100"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const VehicleDetailCard: React.FC<{ vehicle: FlotteVehicle; defaultOpen?: boolean }> = ({ vehicle, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  const [seatPlanOpen, setSeatPlanOpen] = useState(false);
  const isCargo = vehicle.category === 'CARGO';

  const capacityLabel = isCargo
    ? vehicle.cargoCapacityLabel || 'Capacité de chargement à confirmer'
    : vehicle.capacity != null
      ? `${vehicle.capacity} places`
      : 'Capacité à confirmer';

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:block">
            {vehicle.images[0] ? (
              <img src={vehicle.images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                {isCargo ? <Truck size={22} /> : <Bus size={22} />}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-gray-900 truncate">{vehicle.name}</h4>
            <p className="text-sm text-gray-400 truncate">
              {vehicle.model} · {capacityLabel}
              {vehicle.unitCount != null && ` · ${vehicle.unitCount} unité${vehicle.unitCount > 1 ? 's' : ''} dans la flotte`}
            </p>
          </div>
        </div>
        <ChevronDown size={20} className={`shrink-0 text-[var(--brand-dark)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 py-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Gallery images={vehicle.images} alt={vehicle.name} isCargo={isCargo} />
            <div className="space-y-4">
              {vehicle.description && <p className="text-sm text-gray-600 leading-relaxed">{vehicle.description}</p>}

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-[rgb(var(--brand-dark-rgb)/6%)] px-3 py-1.5 text-xs font-bold text-[var(--brand-dark)]">
                  {isCargo ? <Truck size={13} /> : <Users size={13} />}
                  {capacityLabel}
                </span>
                {vehicle.unitCount != null && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[rgb(var(--brand-dark-rgb)/6%)] px-3 py-1.5 text-xs font-bold text-[var(--brand-dark)]">
                    <LayoutGrid size={13} />
                    {vehicle.unitCount} unité{vehicle.unitCount > 1 ? 's' : ''}
                  </span>
                )}
                {vehicle.amenities.map((a) => {
                  const Icon = AMENITY_ICON[a];
                  return (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 rounded-full bg-[rgb(var(--brand-dark-rgb)/6%)] px-3 py-1.5 text-xs font-bold text-[var(--brand-dark)]"
                    >
                      <Icon size={13} />
                      {AMENITY_LABEL[a]}
                    </span>
                  );
                })}
              </div>

              {vehicle.routes.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Lignes desservies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.routes.map((r) => (
                      <span key={r} className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                        <MapPin size={11} className="text-[var(--brand-dark)]" />
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isCargo && vehicle.seatPlanKey && (
                <button
                  onClick={() => setSeatPlanOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand-dark)] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--brand-dark)] transition-colors hover:bg-[var(--brand-dark)] hover:text-white"
                >
                  <LayoutGrid size={15} />
                  Voir le plan des sièges
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {seatPlanOpen && vehicle.seatPlanKey && (
        <SeatPlanModal seatPlanKey={vehicle.seatPlanKey} vehicleName={vehicle.name} onClose={() => setSeatPlanOpen(false)} />
      )}
    </div>
  );
};

export default VehicleDetailCard;
