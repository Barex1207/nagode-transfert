import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const res = await api.upload<{ url: string }>('/uploads', file);
      onChange(res.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Échec de l'envoi de l'image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        className="flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-brand-primary"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-brand-primary" size={24} />
        ) : value ? (
          <img src={value} alt="Aperçu" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <ImagePlus size={24} />
            <span className="text-xs">Cliquer pour téléverser une image</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
