import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TagListInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  pattern?: RegExp;
}

export function TagListInput({ value, onChange, placeholder, pattern }: TagListInputProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  function add() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (pattern && !pattern.test(trimmed)) {
      setError('Format invalide');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
    setError(null);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((v, idx) => (
          <span
            key={`${v}-${idx}`}
            className="inline-flex items-center gap-1 rounded-full bg-brand-dark/10 px-3 py-1 text-xs font-bold text-brand-dark"
          >
            {v}
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== idx))}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center justify-center rounded-lg bg-gray-100 px-3 text-gray-600 hover:bg-gray-200"
        >
          <Plus size={16} />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
