import React, { useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { Vehicle, VehicleStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ApiError } from '../lib/api';

const STATUS_LABEL: Record<VehicleStatus, string> = {
  ACTIF: 'Actif',
  MAINTENANCE: 'En maintenance',
  HORS_SERVICE: 'Hors service',
};

const STATUS_BADGE: Record<VehicleStatus, string> = {
  ACTIF: 'bg-green-50 text-green-700',
  MAINTENANCE: 'bg-amber-50 text-amber-700',
  HORS_SERVICE: 'bg-red-50 text-red-700',
};

type FormState = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = {
  name: '',
  model: '',
  imageUrl: null,
  description: '',
  capacity: 0,
  status: 'ACTIF',
  order: 0,
};

export default function Vehicles() {
  const { items, loading, error, create, update, remove, reorder } = useResource<Vehicle>('/vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(vehicle: Vehicle) {
    setEditing(vehicle);
    const { id, createdAt, updatedAt, ...rest } = vehicle;
    setForm(rest);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await update(editing.id, form);
      } else {
        await create(form);
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
    () =>
      items.filter(
        (v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.model.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [items, searchQuery],
  );

  function renderCard(vehicle: Vehicle) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-36 bg-gray-100">
          {vehicle.imageUrl && <img src={vehicle.imageUrl} alt={vehicle.name} className="h-full w-full object-cover" />}
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[vehicle.status]}`}>
              {STATUS_LABEL[vehicle.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {vehicle.model} · {vehicle.capacity} places
          </p>
          {vehicle.description && <p className="mt-2 text-sm text-gray-400 line-clamp-2">{vehicle.description}</p>}
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => openEdit(vehicle)}>
              <Pencil size={14} /> Modifier
            </Button>
            <Button variant="danger" onClick={() => setDeleting(vehicle)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Flotte / Véhicules</h1>
          <p className="text-sm text-gray-400">Gérez les bus affichés sur la landing page. Glissez une carte pour réordonner.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter un véhicule
        </Button>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un véhicule..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      {searchQuery ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <div key={vehicle.id}>{renderCard(vehicle)}</div>
          ))}
        </div>
      ) : (
        <DraggableList
          items={items}
          onReorder={reorder}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          renderItem={renderCard}
        />
      )}

      {!loading && filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucun véhicule trouvé.</p>
      )}

      {formOpen && (
        <Modal title={editing ? 'Modifier le véhicule' : 'Ajouter un véhicule'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Image">
              <ImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
            </Field>
            <Field label="Nom">
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Modèle">
              <Input required value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Capacité (places)">
                <Input
                  type="number"
                  min={0}
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                />
              </Field>
              <Field label="Statut">
                <Select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as VehicleStatus }))}
                >
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                rows={3}
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
          title="Supprimer le véhicule"
          message={`Voulez-vous vraiment supprimer "${deleting.name}" ? Cette action est irréversible.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
