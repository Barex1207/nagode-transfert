import React, { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

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

// Custom brand-colored pin instead of Leaflet's default marker, so it matches
// the site's identity — also sidesteps the well-known Vite/Leaflet issue
// where the default marker's PNG assets don't resolve after bundling.
function pinIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="var(--brand-dark)" stroke="white" stroke-width="1.5"/>
      <circle cx="15" cy="15" r="6" fill="white"/>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

// A country like Togo is very tall and narrow (~4° of latitude for ~0.6° of
// longitude), so a plain fitBounds on a wide, short map container has to
// zoom out far enough to fit the height — which then reveals a huge, mostly
// irrelevant east-west sliver reaching into Nigeria and Niger. Flooring the
// zoom keeps the view regionally sensible; a couple of extreme agencies can
// end up just outside the initial frame, but the map stays draggable.
const MIN_ZOOM_MULTI = 8;

const FitBounds: React.FC<{ points: [number, number][] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 9, { animate: false });
    } else {
      const bounds = L.latLngBounds(points);
      const fittedZoom = map.getBoundsZoom(bounds, false, L.point(32, 32));
      map.setView(bounds.getCenter(), Math.max(fittedZoom, MIN_ZOOM_MULTI), { animate: false });
    }
  }, [map, points]);
  return null;
};

const WEST_AFRICA_CENTER: [number, number] = [7.5, -1.5];

const AgencyMap: React.FC<{ agencies: Agency[] }> = ({ agencies }) => {
  const located = useMemo(
    () => agencies.filter((a): a is Agency & { latitude: number; longitude: number } => a.latitude != null && a.longitude != null),
    [agencies],
  );
  const points = useMemo<[number, number][]>(() => located.map((a) => [a.latitude, a.longitude]), [located]);
  const icon = useMemo(() => pinIcon(), []);

  if (located.length === 0) {
    return (
      <div className="mb-12 flex items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-5 text-sm text-gray-400">
        <MapPin size={20} className="shrink-0 text-gray-300" />
        Les coordonnées de nos agences seront bientôt disponibles sur la carte.
      </div>
    );
  }

  return (
    <div className="mb-12 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
      <MapContainer
        center={WEST_AFRICA_CENTER}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {located.map((agency) => (
          <Marker key={agency.id} position={[agency.latitude, agency.longitude]} icon={icon}>
            <Popup>
              <div className="min-w-[200px] space-y-2 py-1">
                <p className="font-black text-gray-900">
                  {agency.city}, {agency.country}
                </p>
                {agency.address && <p className="text-xs text-gray-500">{agency.address}</p>}
                {agency.openingHours && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Clock size={13} className="text-[var(--brand-dark)]" />
                    {agency.openingHours}
                  </p>
                )}
                {agency.ticketPhones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${agency.countryCode}${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-900"
                  >
                    <Phone size={13} className="text-[var(--brand-dark)]" />
                    {agency.countryCode} {phone} <span className="font-normal text-gray-400">(tickets)</span>
                  </a>
                ))}
                {agency.parcelPhones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${agency.countryCode}${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-900"
                  >
                    <Phone size={13} className="text-[var(--brand-dark)]" />
                    {agency.countryCode} {phone} <span className="font-normal text-gray-400">(colis)</span>
                  </a>
                ))}
                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <Mail size={13} className="text-[var(--brand-dark)]" />
                    {agency.email}
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AgencyMap;
