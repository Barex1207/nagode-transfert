import React from 'react';

interface LegalLayoutProps {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, updatedAt, children }) => {
  return (
    <div className="pt-32 pb-24 bg-brand-light min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--brand-dark)] uppercase tracking-tighter">
            {title}
          </h1>
          {updatedAt && <p className="text-xs text-gray-400 font-medium">Dernière mise à jour : {updatedAt}</p>}
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-8 text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
