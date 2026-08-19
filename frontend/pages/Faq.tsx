import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useDocumentHead } from '../lib/useDocumentHead';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FaqRow: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-bold text-gray-900">{item.question}</span>
        <ChevronDown size={18} className={`shrink-0 text-[var(--brand-dark)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{item.answer}</p>}
    </div>
  );
};

const Faq: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentHead({
    title: 'Questions fréquentes',
    description:
      "Réponses aux questions les plus fréquentes sur les tickets de bus, l'envoi de colis et le transfert d'argent avec Nagode Transfert.",
  });

  useEffect(() => {
    api
      .get<FaqItem[]>('/faq')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  return (
    <div className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">
            Questions fréquentes
          </h1>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Tout ce qu'il faut savoir sur nos tickets, nos colis et nos transferts d'argent.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-gray-300 shadow-sm">
              <HelpCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {loading ? 'Chargement…' : 'Aucune question pour le moment'}
            </h3>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <div key={category} className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)]">{category}</h2>
                <div className="space-y-3">
                  {items.filter((i) => i.category === category).map((item) => (
                    <FaqRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Faq;
