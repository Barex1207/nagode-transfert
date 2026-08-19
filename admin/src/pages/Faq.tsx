import React, { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { FaqItem } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Textarea } from '../components/ui/Field';
import { ApiError } from '../lib/api';

type FormState = Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = { question: '', answer: '', category: 'Général', order: 0 };

export default function Faq() {
  const { items, loading, error, create, update, remove, reorder } = useResource<FaqItem>('/faq');
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<FaqItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: FaqItem) {
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
          <h1 className="text-2xl font-black text-gray-900">Questions fréquentes</h1>
          <p className="text-sm text-gray-400">Gérez la page FAQ affichée sur le site.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter une question
        </Button>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <DraggableList
        items={items}
        onReorder={reorder}
        className="space-y-3"
        renderItem={(item) => (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">{item.category}</span>
                <h3 className="mt-2 font-bold text-gray-900">{item.question}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.answer}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => openEdit(item)}>
                  <Pencil size={14} />
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
        <p className="mt-8 text-center text-sm text-gray-400">Aucune question pour le moment.</p>
      )}

      {formOpen && (
        <Modal title={editing ? 'Modifier la question' : 'Ajouter une question'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Catégorie">
              <Input
                required
                placeholder="Ex: Tickets & Voyages, Colis, Transfert d'argent..."
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </Field>
            <Field label="Question">
              <Input required value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
            </Field>
            <Field label="Réponse">
              <Textarea
                required
                rows={4}
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              />
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
          title="Supprimer la question"
          message={`Voulez-vous vraiment supprimer "${deleting.question}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
