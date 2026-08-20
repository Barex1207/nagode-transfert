import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from './api';
import { toast } from './toast';

export function useResource<T extends { id: string }>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<T[]>(path);
      setItems(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function create(payload: Partial<T>) {
    const created = await api.post<T>(path, payload);
    setItems((prev) => [...prev, created]);
    toast.success('Enregistré avec succès');
    return created;
  }

  async function update(id: string, payload: Partial<T>) {
    const updated = await api.put<T>(`${path}/${id}`, payload);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    toast.success('Modifications enregistrées');
    return updated;
  }

  async function remove(id: string) {
    await api.delete(`${path}/${id}`);
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Supprimé avec succès');
  }

  async function reorder(newItems: T[]) {
    setItems(newItems);
    const payload = { items: newItems.map((item, index) => ({ id: item.id, order: index })) };
    await api.patch(`${path}/reorder`, payload);
  }

  return { items, setItems, loading, error, reload, create, update, remove, reorder };
}
