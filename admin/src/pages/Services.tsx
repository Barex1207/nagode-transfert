import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { Service } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Textarea } from '../components/ui/Field';
import { ApiError } from '../lib/api';

type FormState = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = { title: '', description: '', icon: 'Bus', order: 0 };

function IconPreview({ name }: { name: string }) {
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number }> | undefined;
  if (!Icon) return null;
  return <Icon size={20} />;
}

export default function Services() {
  const { items, loading, error, create, update, remove, reorder } = useResource<Service>('/services');
  const [editing, setEditing] = useState<Service | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: Service) {
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
      if (editing) await update(editing.id, form);
      else await create(form);
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
          <h1 className="text-2xl font-black text-gray-900">Nos Services</h1>
          <p className="text-sm text-gray-400">Cartes de services affichées sur la page d'accueil.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter un service
        </Button>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <DraggableList
        items={items}
        onReorder={reorder}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        renderItem={(item) => (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-dark/10 text-brand-dark">
              <IconPreview name={item.icon} />
            </div>
            <h3 className="font-bold text-gray-900">{item.title}</h3>
            {item.description && <p className="mt-1 text-sm text-gray-400">{item.description}</p>}
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => openEdit(item)}>
                <Pencil size={14} /> Modifier
              </Button>
              <Button variant="danger" onClick={() => setDeleting(item)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        )}
      />

      {!loading && items.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucun service pour le moment.</p>
      )}

      {formOpen && (
        <Modal title={editing ? 'Modifier le service' : 'Ajouter un service'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Titre">
              <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </Field>
            <Field label="Description">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
            <Field label="Icône (nom Lucide, ex: Bus, Box, CreditCard)">
              <div className="flex items-center gap-3">
                <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500">
                  <IconPreview name={form.icon} />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Liste des icônes disponibles :{' '}
                <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="underline">
                  lucide.dev/icons
                </a>
              </p>
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
          title="Supprimer le service"
          message={`Voulez-vous vraiment supprimer "${deleting.title}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
