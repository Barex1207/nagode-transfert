import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mail, User, MessageSquare, Phone } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { useDocumentHead } from '../lib/useDocumentHead';

const Suggestions: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useDocumentHead({
    title: 'Suggestions et réclamations',
    description: "Partagez vos idées, suggestions ou réclamations avec l'équipe Nagode Transfert.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/suggestions', formData);
      navigate('/merci?type=suggestion');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Échec de l'envoi, veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="suggestions-form" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre avec encadré bleu selon la capture d'écran, incluant "Réclamations" */}
        <div className="flex flex-col items-center mb-12 space-y-6">
          <div className="border-[2.5px] border-[var(--brand-accent)] px-8 py-5 md:px-14 md:py-6 inline-block">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter text-center">
              Suggestions / Réclamations
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-center max-w-2xl leading-relaxed text-base">
            Votre avis nous aide à grandir. Partagez vos idées ou vos préoccupations directement avec l'équipe Nagode Transfert.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_35px_70px_rgba(0,0,0,0.04)] p-8 md:p-14 border border-gray-100 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                {/* NOM COMPLET */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">
                    Nom Complet
                  </label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      placeholder="Jean Dupont"
                      className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 shadow-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                {/* VOTRE EMAIL */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">
                    Votre Email
                  </label>
                  <div className="relative">
                    <input 
                      required
                      type="email" 
                      placeholder="jean@exemple.com"
                      className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 shadow-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* TÉLÉPHONE - CORRIGÉ : structure simplifiée */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel"
                    placeholder="+228 90 00 00 00"
                    className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 shadow-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium ml-1">
                  Format : +228 XX XX XX XX
                </p>
              </div>

              {/* MESSAGE / SUGGESTION / RÉCLAMATION */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">
                  Message / Suggestion / Réclamation
                </label>
                <div className="relative">
                  <textarea 
                    required
                    rows={6}
                    placeholder="Détaillez ici votre suggestion ou votre réclamation..."
                    className="w-full px-7 py-6 bg-gray-50 border border-gray-100 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 resize-none shadow-sm"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
              </div>

              {submitError && <p className="text-sm font-bold text-red-600 text-center">{submitError}</p>}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-[var(--brand-dark)] text-white font-black rounded-xl shadow-[0_15px_30px_rgb(var(--brand-dark-rgb)/25%)] hover:shadow-[0_20px_40px_rgb(var(--brand-dark-rgb)/40%)] hover:bg-[var(--brand-dark-hover)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-sm disabled:opacity-60"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Envoi en cours…' : 'Soumettre'}
                </button>
              </div>
            </form>

          {/* Décorations subtiles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[rgb(var(--brand-dark-rgb)/5%)] rounded-full pointer-events-none blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[rgb(var(--brand-accent-rgb)/5%)] rounded-full pointer-events-none blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Suggestions;