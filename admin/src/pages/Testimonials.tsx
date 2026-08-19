import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Star, Trash2, XCircle } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import type { Testimonial } from '../types';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function reload() {
    setLoading(true);
    api
      .get<Testimonial[]>('/testimonials')
      .then(setItems)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function toggleApproved(item: Testimonial) {
    const updated = await api.patch<Testimonial>(`/testimonials/${item.id}`, { approved: !item.approved });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/testimonials/${deleting.id}`);
      setItems((prev) => prev.filter((i) => i.id !== deleting.id));
      setDeleting(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  const pendingCount = items.filter((i) => !i.approved).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Avis clients</h1>
        <p className="text-sm text-gray-400">
          Avis soumis publiquement sur le site — validez-les pour les publier.
          {pendingCount > 0 && <span className="ml-2 font-bold text-brand-primary">{pendingCount} en attente</span>}
        </p>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-5 shadow-sm ${
              item.approved ? 'border-gray-100 bg-white' : 'border-amber-300/50 bg-amber-50/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold text-gray-900">{item.name}</span>
                  <Stars rating={item.rating} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                      item.approved ? 'bg-green-50 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.approved ? 'Publié' : 'En attente'}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('fr-FR')}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{item.message}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => toggleApproved(item)}>
                  {item.approved ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                  {item.approved ? 'Dépublier' : 'Publier'}
                </Button>
                <Button variant="danger" onClick={() => setDeleting(item)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucun avis reçu pour le moment.</p>
      )}

      {deleting && (
        <ConfirmDialog
          title="Supprimer l'avis"
          message={`Voulez-vous vraiment supprimer l'avis de "${deleting.name}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
