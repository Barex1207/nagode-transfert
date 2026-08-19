import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function MultiImageUpload({ value, onChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await api.upload<{ url: string }>('/uploads', file);
        uploaded.push(res.url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Échec de l'envoi d'une image");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, idx) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
            <img src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
              aria-label="Retirer cette image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <div
          className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-brand-primary"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus size={20} />}
          <span className="text-[10px] font-semibold">Ajouter</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
