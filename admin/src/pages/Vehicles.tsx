import React, { useMemo, useState } from 'react';
import {
  Armchair,
  Bus,
  Coffee,
  Lightbulb,
  Luggage,
  Pencil,
  Plus,
  Search,
  Snowflake,
  Toilet,
  Trash2,
  Truck,
  Tv,
  Usb,
  Wifi,
} from 'lucide-react';
import { useResource } from '../lib/useResource';
import type { Vehicle, VehicleAmenity, VehicleCategory, VehicleSeatPlanKey, VehicleStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DraggableList } from '../components/ui/DraggableList';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { ImageUpload } from '../components/ui/ImageUpload';
import { MultiImageUpload } from '../components/ui/MultiImageUpload';
import { TagListInput } from '../components/ui/TagListInput';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
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

const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  STANDARD: 'Standard',
  VIP: 'VIP',
  PRESTIGE: 'Prestige',
  CARGO: 'Cargo (colis)',
};

export const AMENITY_LABEL: Record<VehicleAmenity, string> = {
  CLIMATISATION: 'Climatisation',
  WIFI: 'Wifi à bord',
  USB: 'Prises USB',
  SIEGES_INCLINABLES: 'Sièges inclinables',
  TOILETTES: 'Toilettes à bord',
  ECRAN: 'Écran individuel par siège',
  BAGAGES: 'Grand espace bagages',
  COLLATION: 'Restauration à bord',
  ECLAIRAGE_LED: 'Éclairage LED d’ambiance',
};

export const AMENITY_ICON: Record<VehicleAmenity, React.ComponentType<{ size?: number }>> = {
  CLIMATISATION: Snowflake,
  WIFI: Wifi,
  USB: Usb,
  SIEGES_INCLINABLES: Armchair,
  TOILETTES: Toilet,
  ECRAN: Tv,
  BAGAGES: Luggage,
  COLLATION: Coffee,
  ECLAIRAGE_LED: Lightbulb,
};

const AMENITY_KEYS = Object.keys(AMENITY_LABEL) as VehicleAmenity[];

const SEAT_PLAN_LABEL: Record<VehicleSeatPlanKey, string> = {
  yutong_c9: 'Yutong C9',
  yutong_d7: 'Yutong D7',
  yutong_c12pro_standard: 'Yutong C12 Pro Standard — châssis ZK6120D1 (sans LED, 51 places)',
  yutong_c12pro_standard_led: 'Yutong C12 Pro Standard — châssis ZK6129D (avec LED, 52 places)',
  yutong_c12pro_prestige: 'Yutong C12 Pro (Prestige)',
  yutong_v6: 'Yutong V6',
};

type FormState = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormState = {
  name: '',
  model: '',
  images: [],
  description: '',
  capacity: null,
  cargoCapacityLabel: null,
  unitCount: null,
  status: 'ACTIF',
  category: 'STANDARD',
  amenities: [],
  routes: [],
  seatPlanKey: null,
  seatPlanImageUrl: null,
  order: 0,
};

function numberOrNull(value: string): number | null {
  if (value.trim() === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

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

  function toggleAmenity(key: VehicleAmenity) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(key) ? f.amenities.filter((a) => a !== key) : [...f.amenities, key],
    }));
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
    const isCargo = vehicle.category === 'CARGO';
    return (
      <div className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative h-36 overflow-hidden bg-surface">
          {vehicle.images[0] ? (
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              {isCargo ? <Truck size={28} /> : <Bus size={28} />}
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-brand-dark px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-sm">
            {CATEGORY_LABEL[vehicle.category]}
          </span>
          {vehicle.images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
              {vehicle.images.length} photos
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-ink">{vehicle.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[vehicle.status]}`}>
              {STATUS_LABEL[vehicle.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {vehicle.model}
            {' · '}
            {isCargo
              ? vehicle.cargoCapacityLabel || 'Capacité à confirmer'
              : vehicle.capacity != null
                ? `${vehicle.capacity} places`
                : 'Capacité à confirmer'}
            {vehicle.unitCount != null && ` · ${vehicle.unitCount} unité${vehicle.unitCount > 1 ? 's' : ''}`}
          </p>
          {vehicle.amenities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-gray-400">
              {vehicle.amenities.map((a) => {
                const Icon = AMENITY_ICON[a];
                return (
                  <span key={a} title={AMENITY_LABEL[a]} className="flex h-6 w-6 items-center justify-center rounded-full bg-surface">
                    <Icon size={12} />
                  </span>
                );
              })}
            </div>
          )}
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

  const isCargoForm = form.category === 'CARGO';

  return (
    <div>
      <PageHeader
        title="Flotte / Véhicules"
        subtitle="Gérez les véhicules affichés sur la landing page et la page Notre Flotte. Glissez une carte pour réordonner."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Ajouter un véhicule
          </Button>
        }
      />

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un véhicule..."
          className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bus}
          title={searchQuery ? 'Aucun véhicule ne correspond' : 'Aucun véhicule pour le moment'}
          message={searchQuery ? 'Essayez un autre nom ou modèle.' : 'Ajoutez votre premier véhicule pour l’afficher sur le site.'}
          action={
            !searchQuery && (
              <Button onClick={openCreate}>
                <Plus size={16} />
                Ajouter un véhicule
              </Button>
            )
          }
        />
      ) : searchQuery ? (
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

      {formOpen && (
        <Modal title={editing ? 'Modifier le véhicule' : 'Ajouter un véhicule'} onClose={() => setFormOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Photos (plusieurs possibles)" hint="La première photo sert de couverture.">
              <MultiImageUpload value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
            </Field>
            <Field label="Nom">
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Modèle">
              <Input required value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Catégorie">
                <Select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as VehicleCategory }))}
                >
                  {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Statut">
                <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as VehicleStatus }))}>
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isCargoForm ? (
                <Field label="Capacité de chargement" hint="ex : 3 tonnes, 12 m³. Laissez vide si non confirmée.">
                  <Input
                    value={form.cargoCapacityLabel ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, cargoCapacityLabel: e.target.value || null }))}
                    placeholder="ex : 3 tonnes"
                  />
                </Field>
              ) : (
                <Field label="Capacité (places)" hint="Laissez vide si non confirmée — jamais un chiffre approximatif.">
                  <Input
                    type="number"
                    min={0}
                    value={form.capacity ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: numberOrNull(e.target.value) }))}
                  />
                </Field>
              )}
              <Field label="Nombre d'unités dans la flotte" hint="Laissez vide si non confirmé.">
                <Input
                  type="number"
                  min={0}
                  value={form.unitCount ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, unitCount: numberOrNull(e.target.value) }))}
                />
              </Field>
            </div>

            {!isCargoForm && (
              <>
                <Field label="Plan des sièges" hint="Modèle de plan schématique généré. Ignoré si une image de plan est ajoutée ci-dessous.">
                  <Select
                    value={form.seatPlanKey ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, seatPlanKey: (e.target.value || null) as VehicleSeatPlanKey | null }))}
                  >
                    <option value="">Aucun plan</option>
                    {Object.entries(SEAT_PLAN_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  label="Plan des sièges (image)"
                  hint="Facultatif. Ajoutez une photo ou un plan réel du véhicule : il remplacera le plan schématique ci-dessus sur la page Notre Flotte."
                >
                  <ImageUpload
                    value={form.seatPlanImageUrl}
                    onChange={(url) => setForm((f) => ({ ...f, seatPlanImageUrl: url }))}
                  />
                </Field>
              </>
            )}

            <Field label="Équipements à bord">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITY_KEYS.map((key) => {
                  const Icon = AMENITY_ICON[key];
                  const checked = form.amenities.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleAmenity(key)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                        checked
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-dark'
                          : 'border-line text-gray-500 hover:border-brand-primary/40'
                      }`}
                    >
                      <Icon size={15} />
                      {AMENITY_LABEL[key]}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Trajets / lignes desservis" hint="Ajoutez un trajet puis appuyez sur Entrée">
              <TagListInput
                value={form.routes}
                onChange={(routes) => setForm((f) => ({ ...f, routes }))}
                placeholder="ex : Lomé → Kara"
              />
            </Field>

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
              <Button type="submit" loading={saving}>
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
