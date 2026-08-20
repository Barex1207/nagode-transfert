import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { toast, type ToastMessage } from '../../lib/toast';

export function Toaster() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => toast.subscribe(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-3.5 shadow-lg shadow-ink/10 ${
            item.kind === 'success' ? 'border-success/20 bg-white' : 'border-red-200 bg-white'
          }`}
        >
          {item.kind === 'success' ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-success" />
          ) : (
            <XCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
          )}
          <p className="flex-1 text-sm font-medium text-ink">{item.text}</p>
          <button
            onClick={() => toast.dismiss(item.id)}
            className="shrink-0 rounded-md p-0.5 text-gray-300 hover:bg-black/5 hover:text-gray-500"
            aria-label="Fermer"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
