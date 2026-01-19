
import React from 'react';

const Destinations: React.FC = () => {
  const countries = [
    { 
      name: 'Togo', 
      site: 'Cascade de Kpimé',
      code: 'tg', 
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      name: 'Bénin', 
      site: 'Village Lacustre Ganvié',
      code: 'bj', 
      img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      name: 'Ghana', 
      site: 'Château de Cape Coast',
      code: 'gh', 
      img: 'https://images.unsplash.com/photo-1565152314545-0d0277259f93?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      name: 'Burkina Faso', 
      site: 'Pics de Sindou',
      code: 'bf', 
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      name: 'Côte d\'Ivoire', 
      site: 'Basilique Yamoussoukro',
      code: 'ci', 
      img: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&q=80&w=800' 
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-black text-[#2D1B69] uppercase tracking-tighter">Parcourez l'Afrique avec Nagode</h2>
          <div className="w-20 h-1.5 bg-[#6F1AAE] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Découvrez les plus beaux sites touristiques de la sous-région en voyageant avec nos lignes régulières.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {countries.map((country, idx) => (
            <div 
              key={idx} 
              className="group relative h-[28rem] rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Image de fond (Site touristique) */}
              <img 
                src={country.img} 
                alt={`${country.name} - ${country.site}`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
              
              {/* Infos Pays */}
              <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                    {/* Drapeau Officiel via flagcdn */}
                    <div className="w-8 h-5 rounded overflow-hidden border border-white/30 shadow-2xl shrink-0">
                       <img 
                         src={`https://flagcdn.com/w80/${country.code}.png`} 
                         alt={`Drapeau ${country.name}`}
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <span className="text-xl font-black text-white tracking-tight uppercase">{country.name}</span>
                 </div>
                 
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#8A2BE2] uppercase tracking-[0.2em]">{country.site}</p>
                    <div className="h-0.5 w-8 group-hover:w-full bg-[#8A2BE2] transition-all duration-500 rounded-full"></div>
                 </div>
              </div>

              {/* Tag "Nagode" discret au survol */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black py-2 px-4 rounded-full border border-white/20 uppercase tracking-widest">
                  Nagode Line
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
