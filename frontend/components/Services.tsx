import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { api } from '../lib/api';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number }> | undefined;
  const Fallback = Icons.Sparkles;
  const Comp = Icon ?? Fallback;
  return <Comp size={28} />;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api
      .get<Service[]>('/services')
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  if (services.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">Nos Services</h2>
          <div className="w-20 h-1.5 bg-[var(--brand-dark)] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Une gamme complète de services pensée pour vous simplifier la vie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="group bg-brand-light rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--brand-dark-rgb)/10%)] text-[var(--brand-dark)] flex items-center justify-center mb-6 group-hover:bg-[var(--brand-dark)] group-hover:text-white transition-colors duration-300">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{service.title}</h3>
              {service.description && <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
