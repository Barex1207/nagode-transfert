
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Général',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  const contactInfos = [
    {
      icon: <Phone className="text-white" size={24} />,
      title: "Appelez-nous",
      details: ["+228 93 76 25 60", "+228 90 77 20 13"],
      bg: "bg-[#6F1AAE]"
    },
    {
      icon: <Mail className="text-white" size={24} />,
      title: "Écrivez-nous",
      details: ["info@nagodetransfert.com", "support@nagodetransfert.com"],
      bg: "bg-[#8A2BE2]"
    },
    {
      icon: <MapPin className="text-white" size={24} />,
      title: "Siège Social",
      details: ["Agbalepedou, Lomé", "République Togolaise"],
      bg: "bg-black"
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#6F1AAE] uppercase tracking-tighter">Contactez-nous</h1>
          <div className="w-24 h-1.5 bg-[#6F1AAE] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Notre équipe est à votre disposition pour répondre à toutes vos questions concernant vos voyages, vos colis ou vos transferts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            {contactInfos.map((info, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-xl transition-all duration-500">
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${info.bg} shadow-lg group-hover:scale-110 transition-transform`}>
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
            <div className="bg-[#6F1AAE] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
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
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
              {isSent ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                   <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                     <CheckCircle2 size={48} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Merci pour votre message !</h2>
                   <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                     Votre demande a bien été reçue. Un membre de notre équipe vous contactera dans les plus brefs délais.
                   </p>
                   <button 
                    onClick={() => setIsSent(false)}
                    className="mt-10 text-[#6F1AAE] font-black text-sm uppercase tracking-widest underline hover:opacity-70 transition-opacity"
                   >
                     Envoyer un autre message
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nom Complet</label>
                      <div className="relative">
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: Jean Koffi"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium"
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
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium"
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
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium"
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
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium appearance-none"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        >
                          <option value="Général">Demande Générale</option>
                          <option value="Voyage">Réservation Voyage</option>
                          <option value="Colis">Suivi de Colis</option>
                          <option value="Argent">Transfert d'Argent</option>
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
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#6F1AAE] focus:ring-1 focus:ring-[#6F1AAE] outline-none transition-all font-medium resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                      <MessageSquare size={18} className="absolute left-4 top-6 text-gray-300" />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-[#6F1AAE] text-white font-black rounded-2xl shadow-xl hover:shadow-[#6F1AAE]/40 hover:bg-[#5A148C] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                  >
                    <Send size={20} />
                    Envoyer le Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-in fade-in zoom-in-95 duration-1000">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.000000000002!2d1.215!3d6.21!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c0c0c0c0c1%3A0xc0c0c0c0c0c0c0c!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sen!2stg!4v1620000000000!5m2!1sen!2stg" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Localisation Nagode Transfert"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
