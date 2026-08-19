
import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { api } from '../lib/api';
import { useSettings } from '../context/SettingsContext';
import { useDocumentHead } from '../lib/useDocumentHead';

interface NewsItem {
  id: string;
  title: string;
  images: string[];
  content: string;
  excerpt: string;
  publishedAt: string;
}

const NewsGallery: React.FC<{ images: string[]; alt: string }> = ({ images, alt }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="relative h-56 overflow-hidden bg-gray-200 group/gallery">
      <img
        src={images[index]}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover/gallery:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover/gallery:opacity-100"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const News: React.FC = () => {
  const settings = useSettings();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentHead({
    title: 'Actualités',
    description: "Toutes les actualités, promotions et nouveautés de Nagode Transfert.",
  });

  useEffect(() => {
    api
      .get<NewsItem[]>('/news')
      .then(setNewsItems)
      .catch(() => setNewsItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Actualités de Nagode Transfert</h2>
          <div className="w-24 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Restez informé des dernières nouveautés, promotions et changements de notre réseau.
          </p>
        </div>

        {newsItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Newspaper size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {loading ? 'Chargement des actualités…' : 'Aucune actualité pour le moment'}
            </h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <NewsGallery images={item.images} alt={item.title} />
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-4">
                    <Calendar size={14} />
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-dark)] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                    {item.excerpt || item.content.slice(0, 160)}
                  </p>
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--brand-dark)] font-black text-xs uppercase tracking-widest"
                    >
                      Voir sur Facebook
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
