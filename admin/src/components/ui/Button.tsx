import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-brand-dark text-white shadow-sm shadow-brand-dark/20 hover:bg-brand-primary hover:shadow-md hover:shadow-brand-primary/25',
  secondary: 'bg-white text-ink border border-line hover:border-brand-primary/40 hover:bg-brand-primary/5',
  danger: 'bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700',
  ghost: 'bg-transparent text-gray-500 hover:bg-black/5 hover:text-ink',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({ variant = 'primary', loading = false, className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${variantClass[variant]} ${className}`}
    >
      {loading && <Loader2 className="animate-spin" size={15} />}
      {children}
    </button>
  );
}
