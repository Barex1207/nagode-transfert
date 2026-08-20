import React, { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { Destination, DestinationStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Select } from '../components/ui/Field';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ApiError } from '../lib/api';

const STATUS_LABEL: Record<DestinationStatus, string> = {
  ACTIVE: 'En service',
  COMING_SOON: 'Bientôt disponible',
};

const STATUS_BADGE: Record<DestinationStatus, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  COMING_SOON: 'bg-amber-50 text-amber-700',
};

type FormState = Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = { name: '', siteLabel: '', countryCode: '', imageUrl: null, status: 'ACTIVE', order: 0 };

export default function Destinations() {
  const { items, loading, error, create, update, remove, reorder } = useResource<Destination>('/destinations');
  const [editing, setEditing] = useState<Destination | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Destination | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: Destination) {
    setEditing(item);
    const { id, createdAt, updatedAt, ...rest } = item;
    setForm(rest);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, countryCode: form.countryCode.toLowerCase() };
      if (editing) await update(editing.id, payload);
      else await create(payload);
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Destinations</h1>
          <p className="text-sm text-gray-400">Pays et sites touristiques affichés sur la landing page.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter une destination
        </Button>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <DraggableList
        items={items}
        onReorder={reorder}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        renderItem={(item) => (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="h-32 bg-gray-100">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w40/${item.countryCode}.png`}
                    alt={item.countryCode}
                    className="h-4 w-6 rounded object-cover"
                  />
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[item.status]}`}>
                  {STATUS_LABEL[item.status]}
                </span>
              </div>
              <p className="text-sm text-gray-400">{item.siteLabel}</p>
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
        )}
      />

      {!loading && items.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucune destination pour le moment.</p>
      )}

      {formOpen && (
        <Modal title={editing ? 'Modifier la destination' : 'Ajouter une destination'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Image">
              <ImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
            </Field>
            <Field label="Pays">
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Site touristique">
              <Input
                required
                value={form.siteLabel}
                onChange={(e) => setForm((f) => ({ ...f, siteLabel: e.target.value }))}
              />
            </Field>
            <Field label="Code pays (2 lettres, ex: tg)">
              <Input
                required
                maxLength={2}
                value={form.countryCode}
                onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
              />
            </Field>
            <Field label="Statut" hint="« Bientôt disponible » s'affiche distinctement sur le site et empêche le chatbot de la présenter comme une ligne active.">
              <Select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DestinationStatus }))}
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Ordre d'affichage">
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </Field>

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
          title="Supprimer la destination"
          message={`Voulez-vous vraiment supprimer "${deleting.name}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
