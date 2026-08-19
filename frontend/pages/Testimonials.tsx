import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { useDocumentHead } from '../lib/useDocumentHead';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
}

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-gold text-gold' : 'text-gray-200'}
      />
    ))}
  </div>
);

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', rating: 5, message: '' });

  useDocumentHead({
    title: 'Avis clients',
    description: "Ce que nos clients disent de Nagode Transfert. Partagez votre expérience à votre tour.",
  });

  useEffect(() => {
    api
      .get<Testimonial[]>('/testimonials')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/testimonials', formData);
      navigate('/merci?type=testimonial');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Échec de l'envoi, veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">
            Avis clients
          </h1>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Ce que nos voyageurs et clients disent de Nagode Transfert.
          </p>
        </div>

        {!loading && items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3 shadow-sm">
                <Stars rating={item.rating} />
                <p className="text-sm text-gray-600 leading-relaxed">"{item.message}"</p>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[rgb(var(--brand-dark-rgb)/10%)] flex items-center justify-center text-[var(--brand-dark)]">
                    <User size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-10 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-gray-300 shadow-sm">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Soyez le premier à laisser un avis</h3>
          </div>
        )}

        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight text-center">
            Laissez votre avis
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Votre nom</label>
              <input
                required
                type="text"
                placeholder="Jean Koffi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Votre note</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: n })}
                    aria-label={`${n} étoiles`}
                  >
                    <Star size={28} className={n <= formData.rating ? 'fill-gold text-gold' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Votre avis</label>
              <textarea
                required
                rows={4}
                placeholder="Partagez votre expérience avec Nagode Transfert..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium resize-none"
              />
            </div>
            {submitError && <p className="text-sm font-bold text-red-600 text-center">{submitError}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[var(--brand-dark)] text-white font-black rounded-xl shadow-lg hover:bg-[var(--brand-dark-hover)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-60"
            >
              <Send size={16} />
              {isSubmitting ? 'Envoi en cours…' : 'Publier mon avis'}
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              Votre avis sera publié après validation par notre équipe.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
