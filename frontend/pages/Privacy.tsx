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

const Privacy: React.FC = () => {
  const settings = useSettings();

  useDocumentHead({
    title: 'Politique de confidentialité',
    description: "Comment Nagode Transfert collecte, utilise et protège vos données personnelles.",
  });

  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="Août 2026">
      <Section title="1. Données que nous collectons">
        <p>
          Lorsque vous utilisez le formulaire de contact, le formulaire de suggestions, ou que vous réservez un
          service auprès de {settings.siteName}, nous pouvons collecter votre nom, votre adresse e-mail, votre
          numéro de téléphone et le contenu de votre message. Aucune donnée bancaire n'est collectée via ce site.
        </p>
      </Section>
      <Section title="2. Utilisation des données">
        <p>
          Ces informations servent uniquement à répondre à vos demandes (réservation, suivi de colis, réclamation,
          location de bus), à améliorer nos services et, si vous y consentez, à vous informer de nos actualités.
          Nous ne vendons ni ne louons vos données à des tiers.
        </p>
      </Section>
      <Section title="3. Conservation">
        <p>
          Vos données sont conservées le temps nécessaire au traitement de votre demande, puis archivées ou
          supprimées conformément à nos obligations légales.
        </p>
      </Section>
      <Section title="4. Cookies">
        <p>
          Ce site peut utiliser des cookies techniques nécessaires à son bon fonctionnement, ainsi que des cookies
          de mesure d'audience anonymisés. Aucune donnée n'est transmise à des fins publicitaires.
        </p>
      </Section>
      <Section title="5. Vos droits">
        <p>
          Vous pouvez à tout moment demander l'accès, la correction ou la suppression de vos données personnelles en
          nous écrivant à{' '}
          <a href={`mailto:${settings.email}`} className="text-[var(--brand-dark)] font-bold">
            {settings.email}
          </a>{' '}
          ou en appelant le {settings.phone}.
        </p>
      </Section>
      <Section title="6. Contact">
        <p>
          {settings.siteName} — {settings.address}.
        </p>
      </Section>
    </LegalLayout>
  );
};

export default Privacy;
