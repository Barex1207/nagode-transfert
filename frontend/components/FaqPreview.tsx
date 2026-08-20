import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import { api } from '../lib/api';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const PREVIEW_COUNT = 4;

const FaqPreviewRow: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-bold text-gray-900">{item.question}</span>
        <ChevronDown size={18} className={`shrink-0 text-[var(--brand-dark)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{item.answer}</p>}
    </div>
  );
};

const FaqPreview: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    api
      .get<FaqItem[]>('/faq')
      .then((data) => setItems(data.slice(0, PREVIEW_COUNT)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-brand-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--brand-dark)] shadow-sm mb-2">
            <HelpCircle size={26} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Les réponses aux questions les plus posées, avant même de nous contacter.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <FaqPreviewRow key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand-dark)] text-white text-xs font-black uppercase tracking-widest shadow-[0_4px_20px_rgb(var(--brand-dark-rgb)/30%)] hover:bg-[var(--brand-dark-hover)] hover:scale-105 transition-all"
          >
            Voir toutes les questions
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqPreview;
