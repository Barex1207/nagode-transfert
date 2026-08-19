import React, { useEffect, useState } from 'react';
import { Key, Loader2, Plus, ShieldCheck, ShieldOff, Trash2, UserCog } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { AdminAccount, AdminRole } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Field, Input, Select } from '../components/ui/Field';

const ROLE_LABEL: Record<AdminRole, string> = { SUPER_ADMIN: 'Super-administrateur', EDITOR: 'Éditeur' };

export default function AdminUsers() {
  const { admin: currentAdmin } = useAuth();
  const [items, setItems] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'EDITOR' as AdminRole });
  const [createError, setCreateError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [resetTarget, setResetTarget] = useState<AdminAccount | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function reload() {
    setLoading(true);
    api
      .get<AdminAccount[]>('/admin-users')
      .then(setItems)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setCreateError(null);
    try {
      const created = await api.post<AdminAccount>('/admin-users', createForm);
      setItems((prev) => [...prev, created]);
      setCreateForm({ name: '', email: '', password: '', role: 'EDITOR' });
      setCreateOpen(false);
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : 'Échec de la création');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: AdminAccount) {
    try {
      const updated = await api.patch<AdminAccount>(`/admin-users/${item.id}`, { isActive: !item.isActive });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Échec de la mise à jour');
    }
  }

  async function toggleRole(item: AdminAccount) {
    const nextRole: AdminRole = item.role === 'SUPER_ADMIN' ? 'EDITOR' : 'SUPER_ADMIN';
    try {
      const updated = await api.patch<AdminAccount>(`/admin-users/${item.id}`, { role: nextRole });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Échec de la mise à jour');
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetTarget) return;
    setResetError(null);
    try {
      await api.post(`/admin-users/${resetTarget.id}/reset-password`, { newPassword: resetPassword });
      setResetTarget(null);
      setResetPassword('');
    } catch (err) {
      setResetError(err instanceof ApiError ? err.message : 'Échec de la réinitialisation');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin-users/${deleteTarget.id}`);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Échec de la suppression');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Administrateurs</h1>
          <p className="text-sm text-gray-400">Gérez les comptes ayant accès au dashboard.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Ajouter un administrateur
        </Button>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-black uppercase tracking-wider text-gray-400">
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">E-mail</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 font-bold text-gray-900">
                  {item.name} {item.id === currentAdmin?.id && <span className="text-xs text-gray-400">(vous)</span>}
                </td>
                <td className="px-5 py-3 text-gray-500">{item.email}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleRole(item)}
                    disabled={item.id === currentAdmin?.id}
                    className="rounded-full bg-brand-dark/10 px-3 py-1 text-xs font-bold text-brand-dark disabled:opacity-50"
                    title={item.id === currentAdmin?.id ? 'Vous ne pouvez pas changer votre propre rôle' : 'Changer le rôle'}
                  >
                    {ROLE_LABEL[item.role]}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {item.isActive ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setResetTarget(item)}
                      className="text-gray-400 hover:text-brand-primary"
                      title="Réinitialiser le mot de passe"
                    >
                      <Key size={16} />
                    </button>
                    <button
                      onClick={() => toggleActive(item)}
                      disabled={item.id === currentAdmin?.id}
                      className="text-gray-400 hover:text-brand-primary disabled:opacity-30"
                      title={item.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {item.isActive ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      disabled={item.id === currentAdmin?.id}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-30"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <Modal title="Ajouter un administrateur" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate}>
            <Field label="Nom complet">
              <Input required value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="E-mail">
              <Input
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            <Field label="Mot de passe">
              <Input
                type="password"
                required
                minLength={8}
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              />
            </Field>
            <Field label="Rôle">
              <Select
                value={createForm.role}
                onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value as AdminRole }))}
              >
                <option value="EDITOR">Éditeur</option>
                <option value="SUPER_ADMIN">Super-administrateur</option>
              </Select>
            </Field>

            {createError && <p className="mb-4 text-sm text-red-600">{createError}</p>}

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Création…' : 'Créer'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {resetTarget && (
        <Modal title={`Réinitialiser le mot de passe de ${resetTarget.name}`} onClose={() => setResetTarget(null)}>
          <form onSubmit={handleResetPassword}>
            <Field label="Nouveau mot de passe">
              <Input
                type="password"
                required
                minLength={8}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </Field>
            {resetError && <p className="mb-4 text-sm text-red-600">{resetError}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setResetTarget(null)}>
                Annuler
              </Button>
              <Button type="submit">
                <UserCog size={16} />
                Réinitialiser
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Supprimer l'administrateur"
          message={`Voulez-vous vraiment supprimer le compte de "${deleteTarget.name}" ?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
