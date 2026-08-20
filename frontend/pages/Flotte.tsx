import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bus, Clock, HelpCircle, MapPin, Package, Sparkles, Tag, Truck } from 'lucide-react';
import { api } from '../lib/api';
import { useDocumentHead } from '../lib/useDocumentHead';
import VehicleDetailCard, { type FlotteVehicle } from '../components/VehicleDetailCard';

const SECTIONS: { category: FlotteVehicle['category']; title: string; intro: string }[] = [
  {
    category: 'STANDARD',
    title: 'Nos cars et bus Standard',
    intro:
      "L'ossature de notre réseau au quotidien. Ces cars assurent l'essentiel de nos liaisons régulières entre le Togo, le Ghana et la Côte d'Ivoire, avec la climatisation, des sièges confortables et l'espace bagages nécessaires pour voyager sereinement, à un tarif accessible.",
  },
  {
    category: 'PRESTIGE',
    title: 'Notre gamme Prestige',
    intro:
      "Pour les voyageurs qui recherchent un confort supérieur : sièges plus larges et inclinables, équipements individuels et services à bord pensés pour rendre les longs trajets aussi agréables qu'un vol en classe affaires.",
  },
];

const Flotte: React.FC = () => {
  const [vehicles, setVehicles] = useState<FlotteVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentHead({
    title: 'Notre Flotte',
    description:
      'Découvrez en détail les cars, bus Prestige et véhicule cargo de Nagode Transfert : capacité, équipements à bord, plans des sièges et lignes desservies.',
  });

  useEffect(() => {
    api
      .get<FlotteVehicle[]>('/vehicles')
      .then((data) => setVehicles(data.filter((v: any) => v.status !== 'HORS_SERVICE')))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        vehicles: vehicles.filter((v) => v.category === s.category),
      })),
    [vehicles],
  );

  const cargoVehicles = useMemo(() => vehicles.filter((v) => v.category === 'CARGO'), [vehicles]);

  return (
    <div className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-14 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)]">La flotte Nagode Transfert</p>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Notre Flotte</h1>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full" />
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            De nos cars Standard qui assurent nos liaisons régulières à notre gamme Prestige haut de gamme, en passant
            par le véhicule qui achemine vos colis entre agences : découvrez en détail chaque modèle de notre flotte,
            sa capacité, ses équipements et les lignes qu'il dessert.
          </p>
        </div>

        {loading && <p className="text-center text-sm text-gray-400 py-10">Chargement de la flotte…</p>}

        {!loading && vehicles.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-white/70 py-14 px-6 text-center mb-16">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-300 shadow-sm">
              <Bus size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Le détail de nos véhicules arrive bientôt</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Modèle, capacité, équipements à bord et plans des sièges seront publiés ici prochainement.
            </p>
          </div>
        )}

        <div className="space-y-20">
          {groups.map(
            (group) =>
              group.vehicles.length > 0 && (
                <section key={group.category}>
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2">
                      {group.category === 'PRESTIGE' && <Sparkles size={18} className="text-[var(--brand-dark)]" />}
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{group.title}</h2>
                    </div>
                    <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">{group.intro}</p>
                  </div>
                  <div className="space-y-4">
                    {group.vehicles.map((vehicle) => (
                      <VehicleDetailCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                </section>
              ),
          )}

          {cargoVehicles.length > 0 && (
            <section>
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-[var(--brand-dark)]" />
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Notre flotte Cargo</h2>
                </div>
                <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
                  À côté du transport de voyageurs, ce véhicule est dédié à notre service d'envoi de colis : il
                  achemine les paquets confiés en agence vers leur agence de destination, selon les mêmes fréquences
                  que nos lignes régulières.
                </p>
              </div>
              <div className="space-y-4">
                {cargoVehicles.map((vehicle) => (
                  <VehicleDetailCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              <Link
                to="/tarifs"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-dark)] hover:underline"
              >
                <Package size={15} />
                Voir les tarifs d'envoi de colis
                <ArrowRight size={14} />
              </Link>
            </section>
          )}
        </div>

        {/* Dans la même rubrique */}
        <div className="mt-24 pt-10 border-t border-gray-200">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)] mb-6">Dans la même rubrique</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/tarifs"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Tag size={20} className="text-[var(--brand-dark)]" />
              <span className="text-sm font-bold text-gray-900">Tarifs</span>
            </Link>
            <Link
              to="/horaires"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Clock size={20} className="text-[var(--brand-dark)]" />
              <span className="text-sm font-bold text-gray-900">Horaires</span>
            </Link>
            <Link
              to="/agences"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <MapPin size={20} className="text-[var(--brand-dark)]" />
              <span className="text-sm font-bold text-gray-900">Nos Agences</span>
            </Link>
            <Link
              to="/faq"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <HelpCircle size={20} className="text-[var(--brand-dark)]" />
              <span className="text-sm font-bold text-gray-900">FAQ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flotte;
