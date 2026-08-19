import React, { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, User } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { TeamMember } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input } from '../components/ui/Field';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ApiError } from '../lib/api';

type FormState = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = { name: '', role: '', photoUrl: null, order: 0 };

export default function TeamMembers() {
  const { items, loading, error, create, update, remove, reorder } = useResource<TeamMember>('/team-members');
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    const { id, createdAt, updatedAt, ...rest } = member;
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
          <h1 className="text-2xl font-black text-gray-900">Notre Équipe</h1>
          <p className="text-sm text-gray-400">Photos et rôles affichés dans la section "Notre Équipe" du site.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter un membre
        </Button>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <DraggableList
        items={items}
        onReorder={reorder}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        renderItem={(member) => (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm text-center">
            <div className="aspect-square bg-gray-100">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <User size={32} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => openEdit(member)}>
                  <Pencil size={14} /> Modifier
                </Button>
                <Button variant="danger" onClick={() => setDeleting(member)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
      />

      {!loading && items.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">
          Aucun membre de l'équipe pour le moment. Ajoutez une vraie photo pour renforcer la confiance des visiteurs.
        </p>
      )}

      {formOpen && (
        <Modal title={editing ? 'Modifier le membre' : "Ajouter un membre"} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Photo">
              <ImageUpload value={form.photoUrl} onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))} />
            </Field>
            <Field label="Nom">
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Rôle / Fonction">
              <Input
                required
                placeholder="Ex: Chauffeur, Responsable agence..."
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
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
          title="Supprimer le membre"
          message={`Voulez-vous vraiment supprimer "${deleting.name}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
