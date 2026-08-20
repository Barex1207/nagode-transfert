import React, { useMemo, useState } from 'react';
import { ImageIcon, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { NewsItem } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Field, Input, Textarea } from '../components/ui/Field';
import { MultiImageUpload } from '../components/ui/MultiImageUpload';
import { ApiError } from '../lib/api';

type FormState = Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt: string };

function toDateInput(iso?: string) {
  return (iso ?? new Date().toISOString()).slice(0, 10);
}

const emptyForm: FormState = {
  title: '',
  images: [],
  content: '',
  excerpt: '',
  published: true,
  publishedAt: toDateInput(),
};

export default function News() {
  const { items, loading, error, create, update, remove } = useResource<NewsItem>('/news');
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<NewsItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: NewsItem) {
    setEditing(item);
    setForm({
      title: item.title,
      images: item.images,
      content: item.content,
      excerpt: item.excerpt,
      published: item.published,
      publishedAt: toDateInput(item.publishedAt),
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, publishedAt: new Date(form.publishedAt).toISOString() };
      if (editing) {
        await update(editing.id, payload);
      } else {
        await create(payload);
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Échec de l’enregistrement');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await remove(deleting.id);
      setDeleting(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  const filtered = useMemo(
    () => items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, searchQuery],
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Actualités / Annonces</h1>
          <p className="text-sm text-gray-400">Publiez des actualités visibles sur la landing page.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Publier une actualité
        </Button>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un titre..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-36 bg-gray-100">
              {item.images[0] && <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />}
              {item.images.length > 1 && (
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                  <ImageIcon size={10} /> {item.images.length}
                </span>
              )}
              {!item.published && (
                <span className="absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                  Brouillon
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-brand-primary">
                {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
              </p>
              <h3 className="mt-1 font-bold text-gray-900 line-clamp-2">{item.title}</h3>
              {item.excerpt && <p className="mt-2 text-sm text-gray-400 line-clamp-2">{item.excerpt}</p>}
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => openEdit(item)}>
                  <Pencil size={14} /> Modifier
                </Button>
                <Button variant="danger" onClick={() => setDeleting(item)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucune actualité trouvée.</p>
      )}

      {formOpen && (
        <Modal title={editing ? "Modifier l'actualité" : 'Publier une actualité'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Photos (plusieurs possibles)">
              <MultiImageUpload value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
            </Field>
            <Field label="Titre">
              <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </Field>
            <Field label="Contenu">
              <Textarea
                required
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </Field>
            <Field label="Date de publication">
              <Input
                type="date"
                required
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              />
            </Field>
            <label className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm font-semibold text-gray-700">
                Publié (visible sur le site — décochez pour enregistrer en brouillon)
              </span>
            </label>

            {formError && <p className="mb-4 text-sm text-red-600">{formError}</p>}

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Supprimer l'actualité"
          message={`Voulez-vous vraiment supprimer "${deleting.title}" ? Cette action est irréversible.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
