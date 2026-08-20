import React from 'react';

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}

export function Field({ label, children, error, hint }: FieldProps) {
  return (
    <label className="block mb-4">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

const baseInputClass =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder-gray-400 outline-none transition-all duration-150 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInputClass} ${props.className ?? ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInputClass} ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInputClass} bg-white ${props.className ?? ''}`} />;
}
