import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import { api, ApiError } from '../lib/api';
import type { Agency, Schedule } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Select } from '../components/ui/Field';
import { TagListInput } from '../components/ui/TagListInput';

type FormState = Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'agency'>;

const emptyForm: FormState = { agencyId: null, origin: '', destination: '', times: [], frequency: 'Quotidien', order: 0 };

export default function Schedules() {
  const { items, loading, error, create, update, remove, reorder } = useResource<Schedule>('/schedules');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filterAgency, setFilterAgency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Schedule | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    api.get<Agency[]>('/agencies').then(setAgencies).catch(() => setAgencies([]));
  }, []);

  const filtered = useMemo(
    () =>
      items
        .filter((s) => (filterAgency ? s.agencyId === filterAgency : true))
        .filter(
          (s) =>
            s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.destination.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    [items, filterAgency, searchQuery],
  );
  const canReorder = !filterAgency && !searchQuery;

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, agencyId: filterAgency || null });
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: Schedule) {
    setEditing(item);
    const { id, createdAt, updatedAt, agency, ...rest } = item;
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
          <h1 className="text-2xl font-black text-gray-900">Horaires de départ</h1>
          <p className="text-sm text-gray-400">Horaires par agence, affichés sur la page Horaires du site.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter un horaire
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="max-w-xs flex-1">
          <Select value={filterAgency} onChange={(e) => setFilterAgency(e.target.value)}>
            <option value="">Toutes les agences</option>
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.city} — {a.country}
              </option>
            ))}
          </Select>
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

      {canReorder ? (
        <DraggableList
          items={filtered}
          onReorder={reorder}
          className="space-y-3"
          itemClassName="rounded-2xl border border-gray-100 bg-white shadow-sm pl-6"
          renderItem={(s) => (
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  {s.origin} <ArrowRight size={14} className="text-brand-primary" /> {s.destination}
                </div>
                <p className="text-xs text-gray-400">
                  {s.agency ? `${s.agency.city} — ${s.agency.country}` : 'Sans agence'} · {s.frequency}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.times.map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => openEdit(s)}>
                  <Pencil size={14} /> Modifier
                </Button>
                <Button variant="danger" onClick={() => setDeleting(s)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  {s.origin} <ArrowRight size={14} className="text-brand-primary" /> {s.destination}
                </div>
                <p className="text-xs text-gray-400">
                  {s.agency ? `${s.agency.city} — ${s.agency.country}` : 'Sans agence'} · {s.frequency}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.times.map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => openEdit(s)}>
                  <Pencil size={14} /> Modifier
                </Button>
                <Button variant="danger" onClick={() => setDeleting(s)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucun horaire pour le moment.</p>
      )}

      {formOpen && (
        <Modal title={editing ? "Modifier l'horaire" : 'Ajouter un horaire'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Agence">
              <Select
                value={form.agencyId ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, agencyId: e.target.value || null }))}
              >
                <option value="">Sans agence spécifique</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.city} — {a.country}
                  </option>
                ))}
              </Select>
            </Field>
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
            <Field label="Heures de départ (HH:MM, Entrée pour ajouter)">
              <TagListInput
                value={form.times}
                onChange={(times) => setForm((f) => ({ ...f, times }))}
                placeholder="06:00"
                pattern={/^([01]\d|2[0-3]):[0-5]\d$/}
              />
            </Field>
            <Field label="Fréquence">
              <Input
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                placeholder="Quotidien, Lundi/Mercredi/Vendredi…"
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
          title="Supprimer l'horaire"
          message={`Voulez-vous vraiment supprimer l'horaire ${deleting.origin} → ${deleting.destination} ?`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
