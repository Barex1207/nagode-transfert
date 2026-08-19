import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useDocumentHead } from '../lib/useDocumentHead';
import { api, ApiError } from '../lib/api';

const Contact: React.FC = () => {
  const settings = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: searchParams.get('sujet') ?? 'Général',
    message: ''
  });

  useDocumentHead({
    title: 'Contactez-nous',
    description:
      "Contactez Nagode Transfert pour vos réservations, suivis de colis, transferts d'argent ou location de bus. Réponse rapide par téléphone, WhatsApp ou e-mail.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/contact-messages', formData);
      navigate('/merci?type=contact');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Échec de l'envoi, veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfos = [
    {
      icon: <Phone className="text-white" size={24} />,
      title: "Appelez-nous",
      details: [settings.phone, settings.whatsapp].filter(Boolean) as string[],
      bg: "bg-[var(--brand-dark)]"
    },
    {
      icon: <Mail className="text-white" size={24} />,
      title: "Écrivez-nous",
      details: [settings.email].filter(Boolean) as string[],
      bg: "bg-[var(--brand-accent)]"
    },
    {
      icon: <MapPin className="text-white" size={24} />,
      title: "Siège Social",
      details: [settings.address].filter(Boolean) as string[],
      bg: "bg-black"
    }
  ];

  // VOTRE VRAI LIEN GOOGLE MAPS CORRIGÉ
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.189305893502!2d1.2002649!3d6.1992946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1021599d6d8487e1%3A0xe2f8ba7b21e344fd!2sNAGODE%20Transfert%20-%20Agbalepedo!5e0!3m2!1sen!2stg!4v1620000000000!5m2!1sen!2stg";

  // Lien direct pour ouvrir dans Google Maps
  const googleMapsDirectUrl = "https://www.google.com/maps/place/NAGODE+Transfert+-+Agbalepedo/@6.1992946,1.2002649,17z/data=!3m1!4b1!4m6!3m5!1s0x1021599d6d8487e1:0xe2f8ba7b21e344fd!8m2!3d6.1992946!4d1.2002649!16s%2Fg%2F11hzpct589?entry=ttu";

  return (
    <div className="pt-32 pb-20 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Contactez-nous</h1>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Notre équipe est à votre disposition pour répondre à toutes vos questions concernant vos voyages, vos colis ou vos transferts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            {contactInfos.map((info, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-xl transition-all duration-500">
                <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center ${info.bg} shadow-lg group-hover:scale-110 transition-transform`}>
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight">{info.title}</h3>
                  {info.details.map((detail, dIdx) => (
                    <p key={dIdx} className="text-gray-500 font-medium">{detail}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Business Hours - Updated to 24/7 */}
            <div className="bg-[var(--brand-dark)] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <Clock size={24} />
                   <h3 className="text-lg font-black uppercase tracking-tight">Horaires d'Ouverture</h3>
                 </div>
                 <div className="space-y-4 opacity-95 font-medium">
                   <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center">
                     <p className="text-3xl font-black mb-1">24h / 24</p>
                     <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">Sept jours sur sept</p>
                   </div>
                   <p className="text-sm leading-relaxed text-center opacity-80 italic">
                     Nous ne fermons jamais. Nos services et notre assistance sont disponibles en permanence pour vous accompagner.
                   </p>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nom Complet</label>
                      <div className="relative">
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: Jean Koffi"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Adresse Email</label>
                      <div className="relative">
                        <input 
                          required
                          type="email" 
                          placeholder="Ex: jean@nagode.com"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Téléphone</label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          placeholder="+228 90 00 00 00"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Sujet</label>
                      <div className="relative">
                        <select 
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium appearance-none"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        >
                          <option value="Général">Demande Générale</option>
                          <option value="Voyage">Réservation Voyage</option>
                          <option value="Colis">Suivi de Colis</option>
                          <option value="Argent">Transfert d'Argent</option>
                          <option value="Location">Location de Bus (VIP / Événement)</option>
                          <option value="Réclamation">Réclamation</option>
                        </select>
                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Votre Message</label>
                    <div className="relative">
                      <textarea 
                        required
                        rows={6}
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--brand-dark)] focus:ring-1 focus:ring-[var(--brand-dark)] outline-none transition-all font-medium resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                      <MessageSquare size={18} className="absolute left-4 top-6 text-gray-300" />
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-sm font-bold text-red-600 text-center">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-[var(--brand-dark)] text-white font-black rounded-xl shadow-xl hover:shadow-[rgb(var(--brand-dark-rgb)/40%)] hover:bg-[var(--brand-dark-hover)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.2em] disabled:opacity-60"
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Envoi en cours…' : 'Envoyer le Message'}
                  </button>
                </form>
            </div>
          </div>
        </div>

        {/* Map Section - CORRIGÉ avec votre vrai lien */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Notre localisation</h3>
              <p className="text-gray-500 font-medium">Nagode Transfert - Agbalepedo, Lomé</p>
            </div>
            <a 
              href={googleMapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[var(--brand-dark)] text-white font-bold rounded-xl hover:bg-[var(--brand-dark-hover)] transition-colors shadow-lg"
            >
              <ExternalLink size={16} />
              Ouvrir dans Google Maps
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white animate-in fade-in zoom-in-95 duration-1000">
            <iframe 
              src={googleMapsEmbedUrl}
              width="100%" 
              height="500"
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nagode Transfert Agbalepedo - Localisation exacte"
              aria-label="Carte Google Maps montrant la localisation de Nagode Transfert à Agbalepedo, Lomé"
            ></iframe>
          </div>

          {/* Informations de localisation détaillées */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[rgb(var(--brand-dark-rgb)/10%)] rounded-xl flex items-center justify-center">
                  <MapPin className="text-[var(--brand-dark)]" size={20} />
                </div>
                <h4 className="font-bold text-gray-900">Adresse</h4>
              </div>
              <p className="text-gray-600">Agbalepedo</p>
              <p className="text-gray-600">Lomé, Togo</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[rgb(var(--brand-dark-rgb)/10%)] rounded-xl flex items-center justify-center">
                  <Clock className="text-[var(--brand-dark)]" size={20} />
                </div>
                <h4 className="font-bold text-gray-900">Horaires</h4>
              </div>
              <p className="text-gray-600 font-bold">24h/24</p>
              <p className="text-gray-500 text-sm">7 jours sur 7</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[rgb(var(--brand-dark-rgb)/10%)] rounded-xl flex items-center justify-center">
                  <Phone className="text-[var(--brand-dark)]" size={20} />
                </div>
                <h4 className="font-bold text-gray-900">Téléphone agence</h4>
              </div>
              <a href="tel:+22871119140" className="text-gray-900 font-bold hover:text-[var(--brand-dark)] transition-colors">
                +228 71 11 91 40
              </a>
              <p className="text-gray-500 text-sm">Guichet Agbalepedo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;