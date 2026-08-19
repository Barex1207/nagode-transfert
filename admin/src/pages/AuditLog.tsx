import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import type { AuditLogEntry } from '../types';

const ACTION_LABEL: Record<string, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  LOGIN: 'Connexion',
  LOGIN_FAILED: 'Échec de connexion',
};

const ACTION_COLOR: Record<string, string> = {
  CREATE: 'bg-green-50 text-green-600',
  UPDATE: 'bg-blue-50 text-blue-600',
  DELETE: 'bg-red-50 text-red-600',
  LOGIN: 'bg-gray-100 text-gray-600',
  LOGIN_FAILED: 'bg-orange-50 text-orange-600',
};

export default function AuditLog() {
  const [items, setItems] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<AuditLogEntry[]>('/audit-log')
      .then(setItems)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900">Journal d'activité</h1>
      <p className="mb-6 text-sm text-gray-400">Historique des actions effectuées dans le dashboard (200 dernières).</p>

      {loading && <Loader2 className="animate-spin text-brand-primary" />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-black uppercase tracking-wider text-gray-400">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Administrateur</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Ressource</th>
            </tr>
          </thead>
          <tbody>
            {items.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                <td className="px-5 py-3 font-bold text-gray-900">{log.adminEmail}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${ACTION_COLOR[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ACTION_LABEL[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {log.resourceType}
                  {log.resourceId && <span className="text-gray-300"> · {log.resourceId.slice(0, 8)}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Aucune activité enregistrée.</p>
        )}
      </div>
    </div>
  );
}
