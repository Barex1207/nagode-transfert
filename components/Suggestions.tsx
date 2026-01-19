
import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, User, MessageSquare } from 'lucide-react';

const Suggestions: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de l'envoi vers l'adresse support
    console.log("Envoi de la suggestion/réclamation à info@nagodetransfert.com", formData);
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <section id="suggestions-form" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre avec encadré bleu selon la capture d'écran, incluant "Réclamations" */}
        <div className="flex flex-col items-center mb-12 space-y-6">
          <div className="border-[2.5px] border-[#8A2BE2] px-8 py-5 md:px-14 md:py-6 inline-block">
            <h2 className="text-3xl md:text-5xl font-black text-[#6F1AAE] uppercase tracking-tighter text-center">
              Suggestions / Réclamations
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-center max-w-2xl leading-relaxed text-base">
            Votre avis nous aide à grandir. Partagez vos idées ou vos préoccupations directement avec l'équipe Nagode Transfert.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_35px_70px_rgba(0,0,0,0.04)] p-8 md:p-14 border border-gray-100 relative overflow-hidden">
          {isSent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 size={40} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">Message reçu !</h3>
               <p className="text-gray-500 max-w-xs font-medium">
                 Merci pour votre retour. Nous traiterons votre demande avec la plus grande attention.
               </p>
               <button 
                onClick={() => setIsSent(false)}
                className="mt-8 text-[#6F1AAE] font-bold text-sm uppercase tracking-widest underline decoration-2 underline-offset-4"
               >
                 Envoyer un autre message
               </button>
            </div>
          ) : (
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
                      className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 shadow-sm"
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
                      className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 shadow-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
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
                    className="w-full px-7 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300 resize-none shadow-sm"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-6 bg-[#6F1AAE] text-white font-black rounded-[1.5rem] shadow-[0_15px_30px_rgba(111,26,174,0.25)] hover:shadow-[0_20px_40px_rgba(111,26,174,0.4)] hover:bg-[#5A148C] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-sm"
                >
                  <Send size={18} />
                  Soumettre à Nagode
                </button>
              </div>
            </form>
          )}

          {/* Décorations subtiles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#6F1AAE]/5 rounded-full pointer-events-none blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#8A2BE2]/5 rounded-full pointer-events-none blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Suggestions;
