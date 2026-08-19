import React from 'react';

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

export function Field({ label, children, error }: FieldProps) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-gray-700 mb-1">{label}</span>
      {children}
      {error && <span className="block text-sm text-red-600 mt-1">{error}</span>}
    </label>
  );
}

const baseInputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInputClass} ${props.className ?? ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInputClass} ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInputClass} bg-white ${props.className ?? ''}`} />;
}
