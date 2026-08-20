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

const ChatbotTerms: React.FC = () => {
  const settings = useSettings();

  useDocumentHead({
    title: "Conditions d'utilisation du chatbot",
    description: `Ce que vous devez savoir avant d'utiliser l'assistant virtuel Nago sur le site de ${settings.siteName}.`,
  });

  return (
    <LegalLayout title="Conditions d'utilisation du chatbot" updatedAt="Août 2026">
      <Section title="1. Nature du service">
        <p>
          « Nago » est un assistant virtuel basé sur l'intelligence artificielle, mis à disposition sur le site de{' '}
          {settings.siteName} pour répondre à vos questions sur nos trajets, tarifs, horaires, agences et services.
          Il ne remplace pas un conseiller humain et n'a pas accès à vos réservations personnelles.
        </p>
      </Section>
      <Section title="2. Fiabilité des réponses">
        <p>
          Nago s'appuie sur les informations publiées par {settings.siteName}, mais reste une IA en apprentissage :
          ses réponses peuvent être incomplètes ou inexactes. Pour toute décision importante — réservation, paiement,
          réclamation, litige — vérifiez systématiquement l'information auprès de l'une de nos agences ou de nos
          numéros d'assistance officiels.
        </p>
      </Section>
      <Section title="3. Ce que vous ne devez pas partager">
        <p>
          Ne communiquez jamais vos mots de passe, coordonnées bancaires complètes ou codes de sécurité dans la
          conversation. Nago ne vous les demandera jamais.
        </p>
      </Section>
      <Section title="4. Données de conversation">
        <p>
          Les messages échangés avec Nago sont traités pour générer une réponse et peuvent être conservés
          temporairement à des fins d'amélioration du service. Ils sont soumis à notre{' '}
          <a href="/confidentialite" className="text-[var(--brand-dark)] font-bold">
            politique de confidentialité
          </a>
          .
        </p>
      </Section>
      <Section title="5. Usage raisonnable">
        <p>
          Le chatbot est réservé à un usage personnel et raisonnable en lien avec les services de {settings.siteName}
          . Toute utilisation abusive, frauduleuse ou visant à détourner le service pourra entraîner une restriction
          d'accès.
        </p>
      </Section>
      <Section title="6. Contact">
        <p>
          Pour toute question sur ce service, contactez-nous à{' '}
          <a href={`mailto:${settings.email}`} className="text-[var(--brand-dark)] font-bold">
            {settings.email}
          </a>{' '}
          ou au {settings.phone}.
        </p>
      </Section>
    </LegalLayout>
  );
};

export default ChatbotTerms;
