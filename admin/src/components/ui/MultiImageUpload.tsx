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
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of imageFiles) {
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

  function handleReorderOver(e: React.DragEvent, overIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === overIndex) return;
    const next = [...value];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    onChange(next);
    setDragIndex(overIndex);
  }

  return (
    <div>
      <div
        className={`flex flex-wrap gap-3 rounded-xl p-2 transition-colors ${dragOver ? 'bg-brand-primary/5 ring-2 ring-brand-primary/40' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (dragIndex === null) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (dragIndex !== null) return; // an internal thumbnail reorder, not a file drop
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
        }}
      >
        {value.map((url, idx) => (
          <div
            key={url}
            draggable
            onDragStart={() => setDragIndex(idx)}
            onDragOver={(e) => handleReorderOver(e, idx)}
            onDragEnd={() => setDragIndex(null)}
            onDrop={(e) => e.preventDefault()}
            className={`group relative h-24 w-24 cursor-grab overflow-hidden rounded-lg border border-line active:cursor-grabbing ${
              dragIndex === idx ? 'opacity-40' : ''
            }`}
          >
            <img src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                Principale
              </span>
            )}
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100"
              aria-label="Retirer cette image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <div
          className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-brand-primary hover:text-brand-primary"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus size={20} />}
          <span className="text-[10px] font-semibold">Ajouter</span>
        </div>
      </div>
      <p className="mt-1.5 text-xs text-gray-400">
        Glissez-déposez des images ici, ou cliquez sur « Ajouter ». Glissez une vignette pour réordonner — la première photo est utilisée comme image principale.
      </p>
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
