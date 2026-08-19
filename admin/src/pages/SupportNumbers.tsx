import React, { useState } from 'react';
import { Loader2, Phone, Plus, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { SupportCategory, SupportNumber } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Field, Input, Select } from '../components/ui/Field';
import { ApiError } from '../lib/api';

const CATEGORY_LABEL: Record<SupportCategory, string> = {
  TICKET: 'Réservation ticket',
  PARCEL: 'Colis / Logistique',
  MONEY: "Transfert d'argent",
};

type FormState = Omit<SupportNumber, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = { category: 'TICKET', phone: '', order: 0 };

export default function SupportNumbers() {
  const { items, loading, error, create, remove } = useResource<SupportNumber>('/support-numbers');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<SupportNumber | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await create(form);
      setForm(emptyForm);
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
          <h1 className="text-2xl font-black text-gray-900">Numéros d'assistance</h1>
          <p className="text-sm text-gray-400">Numéros affichés dans le module d'assistance rapide du site.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          Ajouter un numéro
        </Button>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {(['TICKET', 'PARCEL', 'MONEY'] as SupportCategory[]).map((cat) => (
          <div key={cat} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-brand-primary">
              {CATEGORY_LABEL[cat]}
            </h3>
            <div className="space-y-2">
              {items
                .filter((n) => n.category === cat)
                .map((n) => (
                  <div key={n.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Phone size={14} className="text-brand-primary" />
                      {n.phone}
                    </span>
                    <button onClick={() => setDeleting(n)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              {items.filter((n) => n.category === cat).length === 0 && (
                <p className="text-xs text-gray-400">Aucun numéro</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <Modal title="Ajouter un numéro" onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Catégorie">
              <Select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as SupportCategory }))}
              >
                {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Numéro de téléphone">
              <Input
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+228 93 76 25 60"
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
          title="Supprimer le numéro"
          message={`Voulez-vous vraiment supprimer "${deleting.phone}" ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
