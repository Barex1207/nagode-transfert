import React, { useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { Fare, FareType } from '../types';
import { api, ApiError } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Select, Textarea } from '../components/ui/Field';

type FormState = Omit<Fare, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = {
  type: 'BUS',
  origin: '',
  destination: '',
  price: 0,
  label: '',
  description: '',
  order: 0,
};

const TYPE_LABEL: Record<FareType, string> = { BUS: 'Ticket Bus', COLIS: 'Envoi Colis' };

export default function Fares() {
  const { items, setItems, loading, error, create, update, remove } = useResource<Fare>('/fares');
  const [tab, setTab] = useState<FareType>('BUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Fare | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Fare | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const byTab = useMemo(() => items.filter((f) => f.type === tab), [items, tab]);
  const filtered = useMemo(
    () =>
      byTab.filter(
        (f) =>
          f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [byTab, searchQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, type: tab });
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: Fare) {
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

  async function handleReorder(newTabItems: Fare[]) {
    const reindexed = newTabItems.map((item, index) => ({ ...item, order: index }));
    const reindexedIds = new Set(reindexed.map((i) => i.id));
    setItems((prev) => [...prev.filter((i) => !reindexedIds.has(i.id)), ...reindexed]);
    await api.patch(`/fares/reorder`, { items: reindexed.map((i) => ({ id: i.id, order: i.order })) });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tarifs</h1>
          <p className="text-sm text-gray-400">Grille tarifaire affichée sur la page Tarifs du site. Glissez pour réordonner.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter un tarif
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          {(['BUS', 'COLIS'] as FareType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                tab === t ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
              }`}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un trajet..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-4 border-b border-gray-100 px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">
          <span>{tab === 'BUS' ? 'Trajet' : 'Libellé'}</span>
          <span>Prix</span>
          <span>Description</span>
          <span></span>
        </div>
        {searchQuery ? (
          filtered.map((fare) => (
            <div key={fare.id} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-4 border-b border-gray-50 px-5 py-3 text-sm last:border-0">
              <span className="font-bold text-gray-900">
                {tab === 'BUS' ? `${fare.origin} → ${fare.destination}` : fare.label || fare.origin}
              </span>
              <span className="font-black text-brand-dark">{fare.price.toLocaleString('fr-FR')} FCFA</span>
              <span className="truncate text-gray-400">{fare.description}</span>
              <div className="flex justify-end gap-2">
                <button onClick={() => openEdit(fare)} className="text-gray-400 hover:text-brand-primary">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleting(fare)} className="text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <DraggableList
            items={byTab}
            onReorder={handleReorder}
            itemClassName="border-b border-gray-50 last:border-0 pl-6"
            renderItem={(fare) => (
              <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-4 px-5 py-3 text-sm">
                <span className="font-bold text-gray-900">
                  {tab === 'BUS' ? `${fare.origin} → ${fare.destination}` : fare.label || fare.origin}
                </span>
                <span className="font-black text-brand-dark">{fare.price.toLocaleString('fr-FR')} FCFA</span>
                <span className="truncate text-gray-400">{fare.description}</span>
                <div className="flex justify-end gap-2">
                  <button onClick={() => openEdit(fare)} className="text-gray-400 hover:text-brand-primary">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleting(fare)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          />
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Aucun tarif trouvé.</p>
        )}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Modifier le tarif' : 'Ajouter un tarif'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as FareType }))}>
                <option value="BUS">Ticket Bus</option>
                <option value="COLIS">Envoi Colis</option>
              </Select>
            </Field>
            {form.type === 'BUS' ? (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Départ">
                  <Input
                    required
                    value={form.origin}
                    onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                  />
                </Field>
                <Field label="Arrivée">
                  <Input
                    required
                    value={form.destination}
                    onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                  />
                </Field>
              </div>
            ) : (
              <Field label="Libellé (ex: Trajets courts, International Accra)">
                <Input
                  required
                  value={form.label || form.origin}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value, origin: e.target.value }))}
                />
              </Field>
            )}
            <Field label="Prix (FCFA)">
              <Input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Description">
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
          title="Supprimer le tarif"
          message="Voulez-vous vraiment supprimer ce tarif ?"
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
