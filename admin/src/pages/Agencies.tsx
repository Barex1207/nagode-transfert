import React, { useMemo, useState } from 'react';
import { Loader2, Mail, Pencil, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { Agency } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Field, Input } from '../components/ui/Field';
import { TagListInput } from '../components/ui/TagListInput';
import { ApiError } from '../lib/api';

type FormState = Omit<Agency, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = {
  city: '',
  country: 'Togo',
  countryCode: '+228',
  address: '',
  openingHours: '',
  ticketPhones: [],
  parcelPhones: [],
  email: null,
  mapUrl: null,
  latitude: null,
  longitude: null,
  order: 0,
};

export default function Agencies() {
  const { items, loading, error, create, update, remove } = useResource<Agency>('/agencies');
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Agency | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Agency | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter(
        (a) =>
          a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.country.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [items, searchQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(agency: Agency) {
    setEditing(agency);
    const { id, createdAt, updatedAt, ...rest } = agency;
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
          <h1 className="text-2xl font-black text-gray-900">Agences / Localisations</h1>
          <p className="text-sm text-gray-400">{items.length} agence(s) enregistrée(s).</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Ajouter une agence
        </Button>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une ville ou un pays..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((agency) => (
          <div key={agency.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900">{agency.city}</h3>
                <p className="text-xs text-gray-400">
                  {agency.country} · {agency.countryCode}
                </p>
              </div>
            </div>
            {agency.address && <p className="text-sm text-gray-500">{agency.address}</p>}
            <div className="mt-3 space-y-1">
              {agency.ticketPhones.length > 0 && (
                <p className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={12} className="text-brand-primary shrink-0" />
                  <span className="font-semibold">Tickets:</span> {agency.ticketPhones.join(', ')}
                </p>
              )}
              {agency.parcelPhones.length > 0 && (
                <p className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={12} className="text-brand-primary shrink-0" />
                  <span className="font-semibold">Colis:</span> {agency.parcelPhones.join(', ')}
                </p>
              )}
              {agency.email && (
                <p className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={12} className="text-brand-primary shrink-0" />
                  {agency.email}
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => openEdit(agency)}>
                <Pencil size={14} /> Modifier
              </Button>
              <Button variant="danger" onClick={() => setDeleting(agency)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">Aucune agence trouvée.</p>
      )}

      {formOpen && (
        <Modal title={editing ? "Modifier l'agence" : 'Ajouter une agence'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ville">
                <Input required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
              </Field>
              <Field label="Pays">
                <Input required value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
              </Field>
            </div>
            <Field label="Indicatif téléphonique">
              <Input
                required
                value={form.countryCode}
                onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
                placeholder="+228"
              />
            </Field>
            <Field label="Adresse">
              <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </Field>
            <Field label="Horaires d'ouverture">
              <Input
                placeholder="Lun - Sam : 7h - 19h"
                value={form.openingHours}
                onChange={(e) => setForm((f) => ({ ...f, openingHours: e.target.value }))}
              />
            </Field>
            <Field label="Numéros — Réservation ticket (Entrée pour ajouter)">
              <TagListInput
                value={form.ticketPhones}
                onChange={(ticketPhones) => setForm((f) => ({ ...f, ticketPhones }))}
                placeholder="71 11 91 40"
              />
            </Field>
            <Field label="Numéros — Colis (Entrée pour ajouter)">
              <TagListInput
                value={form.parcelPhones}
                onChange={(parcelPhones) => setForm((f) => ({ ...f, parcelPhones }))}
                placeholder="93 52 67 98"
              />
            </Field>
            <Field label="E-mail (optionnel)">
              <Input
                type="email"
                value={form.email ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value || null }))}
              />
            </Field>
            <Field label="Lien Google Maps (optionnel)">
              <Input
                type="url"
                placeholder="https://maps.google.com/..."
                value={form.mapUrl ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, mapUrl: e.target.value || null }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude (optionnel)">
                <Input
                  type="number"
                  step="any"
                  value={form.latitude ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value ? Number(e.target.value) : null }))}
                />
              </Field>
              <Field label="Longitude (optionnel)">
                <Input
                  type="number"
                  step="any"
                  value={form.longitude ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value ? Number(e.target.value) : null }))}
                />
              </Field>
            </div>
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
          title="Supprimer l'agence"
          message={`Voulez-vous vraiment supprimer l'agence de "${deleting.city}" ? Cette action est irréversible.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
