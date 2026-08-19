import React from 'react';
import LegalLayout from '../components/LegalLayout';
import { useDocumentHead } from '../lib/useDocumentHead';
import { useSettings } from '../context/SettingsContext';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h2>
    <div className="text-sm space-y-2">{children}</div>
  </section>
);

const Terms: React.FC = () => {
  const settings = useSettings();

  useDocumentHead({
    title: "Conditions d'utilisation",
    description: "Conditions générales de vente et d'utilisation des services de Nagode Transfert.",
  });

  return (
    <LegalLayout title="Conditions d'utilisation" updatedAt="Août 2026">
      <Section title="1. Objet">
        <p>
          Les présentes conditions régissent l'utilisation des services de {settings.siteName} : transport de
          voyageurs, envoi de colis, transfert d'argent et location de bus.
        </p>
      </Section>
      <Section title="2. Réservation et embarquement">
        <ul className="list-disc pl-5 space-y-1">
          <li>Présentez-vous 30 minutes avant le départ pour l'embarquement.</li>
          <li>Pour toute annulation ou report de ticket, contactez-nous au moins une heure avant le départ prévu.</li>
          <li>Chaque passager a droit à deux bagages ; tout bagage supplémentaire entraîne des frais.</li>
        </ul>
      </Section>
      <Section title="3. Envoi de colis">
        <p>
          Le tarif définitif d'un colis est fixé en agence après évaluation du poids, du volume et de la valeur
          déclarée. Le paiement s'effectue au dépôt. Nagode Transfert se réserve le droit d'inspecter tout colis
          avant expédition pour des raisons de sécurité.
        </p>
      </Section>
      <Section title="4. Location de bus">
        <p>
          Toute location de bus (mariages, cérémonies, événements) fait l'objet d'un devis préalable et d'une
          confirmation écrite précisant la durée, l'itinéraire et les conditions tarifaires.
        </p>
      </Section>
      <Section title="5. Responsabilité">
        <p>
          Nagode Transfert met tout en œuvre pour garantir la sécurité et la ponctualité de ses services, sans
          pouvoir être tenu responsable des retards liés à des circonstances indépendantes de sa volonté (routes,
          météo, force majeure).
        </p>
      </Section>
      <Section title="6. Contact">
        <p>
          Pour toute question relative à ces conditions, contactez-nous au {settings.phone} ou à{' '}
          <a href={`mailto:${settings.email}`} className="text-[var(--brand-dark)] font-bold">
            {settings.email}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
};

export default Terms;
