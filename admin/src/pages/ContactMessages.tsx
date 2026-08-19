import React, { useEffect, useState } from 'react';
import { Loader2, Mail, MailOpen, Phone, Trash2, User } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import type { ContactMessage } from '../types';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export default function ContactMessages() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function reload() {
    setLoading(true);
    api
      .get<ContactMessage[]>('/contact-messages')
      .then(setItems)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function toggleRead(item: ContactMessage) {
    const updated = await api.patch<ContactMessage>(`/contact-messages/${item.id}`, { isRead: !item.isRead });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/contact-messages/${deleting.id}`);
      setItems((prev) => prev.filter((i) => i.id !== deleting.id));
      setDeleting(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  const unreadCount = items.filter((i) => !i.isRead).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Messages de contact</h1>
        <p className="text-sm text-gray-400">
          Messages envoyés depuis le formulaire de contact du site.
          {unreadCount > 0 && <span className="ml-2 font-bold text-brand-primary">{unreadCount} non lu(s)</span>}
        </p>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-5 shadow-sm ${
              item.isRead ? 'border-gray-100 bg-white' : 'border-brand-primary/30 bg-brand-primary/5'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1 font-bold text-gray-900">
                    <User size={14} /> {item.name}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Mail size={14} /> {item.email}
                  </span>
                  {item.phone && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <Phone size={14} /> {item.phone}
                    </span>
                  )}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
                    {item.subject}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{item.message}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => toggleRead(item)}>
                  {item.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                  {item.isRead ? 'Marquer non lu' : 'Marquer lu'}
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
        <p className="mt-8 text-center text-sm text-gray-400">Aucun message pour le moment.</p>
      )}

      {deleting && (
        <ConfirmDialog
          title="Supprimer le message"
          message={`Voulez-vous vraiment supprimer le message de "${deleting.name}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
