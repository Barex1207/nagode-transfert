import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';
import { useDocumentHead } from '../lib/useDocumentHead';

const MESSAGES: Record<string, { title: string; body: string }> = {
  contact: {
    title: 'Merci pour votre message !',
    body: 'Votre demande a bien été reçue. Un membre de notre équipe vous contactera dans les plus brefs délais.',
  },
  suggestion: {
    title: 'Merci pour votre retour !',
    body: 'Votre suggestion ou réclamation a bien été transmise à notre équipe. Nous la traiterons avec attention.',
  },
  testimonial: {
    title: 'Merci pour votre avis !',
    body: 'Votre avis a bien été reçu et sera publié après validation par notre équipe.',
  },
  default: {
    title: 'Merci !',
    body: 'Votre demande a bien été prise en compte.',
  },
};

const ThankYou: React.FC = () => {
  const [params] = useSearchParams();
  const type = params.get('type') ?? 'default';
  const { title, body } = MESSAGES[type] ?? MESSAGES.default;

  useDocumentHead({
    title: 'Merci',
    description: 'Votre demande a bien été envoyée à Nagode Transfert.',
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-light flex items-center">
      <div className="max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{title}</h1>
        <p className="text-gray-500 font-medium leading-relaxed">{body}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-dark)] text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[var(--brand-dark-hover)] transition-colors"
        >
          <Home size={16} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
