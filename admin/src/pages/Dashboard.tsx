import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Bus,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  HelpCircle,
  History,
  Mail,
  MessageSquareHeart,
  Newspaper,
  Plus,
  RefreshCw,
  Star,
  Tag,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { StatCard } from '../components/ui/StatCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import type {
  Agency,
  AuditLogEntry,
  ContactMessage,
  Destination,
  FaqItem,
  Fare,
  NewsItem,
  Schedule,
  Suggestion,
  TeamMember,
  Testimonial,
  Vehicle,
} from '../types';

const FRONTEND_URL = (import.meta as any).env?.VITE_FRONTEND_URL ?? 'http://localhost:3000';

const RESOURCE_LABEL: Record<string, string> = {
  Vehicle: 'un véhicule',
  Agency: 'une agence',
  Destination: 'une destination',
  Schedule: 'un horaire',
  Fare: 'un tarif',
  Service: 'un service',
  SupportNumber: "un numéro d'assistance",
  News: 'une actualité',
  Suggestion: 'une suggestion',
  ContactMessage: 'un message de contact',
  AdminUser: 'un compte administrateur',
  SiteSettings: 'les réglages du site',
  FaqItem: 'une question FAQ',
  Testimonial: 'un avis client',
  TeamMember: "un membre d'équipe",
};

const ACTION_LABEL: Record<string, string> = {
  CREATE: 'a créé',
  UPDATE: 'a modifié',
  DELETE: 'a supprimé',
};

const STANDALONE_ACTION_LABEL: Record<string, string> = {
  LOGIN: "s'est connecté",
  LOGIN_FAILED: 'a échoué une tentative de connexion',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

interface Counts {
  vehicles: number;
  agencies: number;
  destinations: number;
  schedules: number;
  fares: number;
  news: number;
  faq: number;
  team: number;
}

const EMPTY_COUNTS: Counts = {
  vehicles: 0,
  agencies: 0,
  destinations: 0,
  schedules: 0,
  fares: 0,
  news: 0,
  faq: 0,
  team: 0,
};

const quickActions = [
  { label: 'Véhicule', to: '/vehicles', icon: Bus },
  { label: 'Actualité', to: '/news', icon: Newspaper },
  { label: 'Agence', to: '/agencies', icon: Building2 },
  { label: "Membre d'équipe", to: '/team-members', icon: Users },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const [counts, setCounts] = useState<Counts>(EMPTY_COUNTS);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pending, setPending] = useState({ messages: 0, suggestions: 0, testimonials: 0 });
  const [activity, setActivity] = useState<AuditLogEntry[]>([]);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Vehicle[]>('/vehicles'),
      api.get<Agency[]>('/agencies'),
      api.get<Destination[]>('/destinations'),
      api.get<Schedule[]>('/schedules'),
      api.get<Fare[]>('/fares'),
      api.get<NewsItem[]>('/news'),
      api.get<FaqItem[]>('/faq'),
      api.get<TeamMember[]>('/team-members'),
      api.get<ContactMessage[]>('/contact-messages'),
      api.get<Suggestion[]>('/suggestions'),
      api.get<Testimonial[]>('/testimonials'),
    ])
      .then(([vehicles, agencies, destinations, schedules, fares, news, faq, team, messages, suggestions, testimonials]) => {
        setCounts({
          vehicles: vehicles.length,
          agencies: agencies.length,
          destinations: destinations.length,
          schedules: schedules.length,
          fares: fares.length,
          news: news.length,
          faq: faq.length,
          team: team.length,
        });
        setPending({
          messages: messages.filter((m) => !m.isRead).length,
          suggestions: suggestions.filter((s) => !s.isRead).length,
          testimonials: testimonials.filter((t) => !t.approved).length,
        });
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    if (admin?.role !== 'SUPER_ADMIN') return;
    api
      .get<AuditLogEntry[]>('/audit-log?limit=6')
      .then(setActivity)
      .catch(() => {});
  }, [admin?.role]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const firstName = admin?.name?.split(' ')[0] ?? '';

  const pendingItems = [
    { label: 'Messages de contact non lus', count: pending.messages, to: '/contact-messages', icon: Mail },
    { label: 'Suggestions non lues', count: pending.suggestions, to: '/suggestions', icon: MessageSquareHeart },
    { label: 'Avis clients en attente', count: pending.testimonials, to: '/testimonials', icon: Star },
  ].filter((item) => item.count > 0);

  const statCards = [
    { label: 'Véhicules', value: counts.vehicles, icon: Bus, to: '/vehicles' },
    { label: 'Agences', value: counts.agencies, icon: Building2, to: '/agencies' },
    { label: 'Destinations', value: counts.destinations, icon: Compass, to: '/destinations' },
    { label: 'Horaires', value: counts.schedules, icon: Clock, to: '/schedules' },
    { label: 'Tarifs', value: counts.fares, icon: Tag, to: '/fares' },
    { label: 'Actualités', value: counts.news, icon: Newspaper, to: '/news' },
    { label: 'Questions FAQ', value: counts.faq, icon: HelpCircle, to: '/faq' },
    { label: 'Équipe', value: counts.team, icon: Users, to: '/team-members' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {greeting}{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-sm text-gray-400">Voici l'état actuel du site Nagode Transfert.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-primary hover:text-brand-primary hover:shadow-md"
            >
              <Plus size={14} />
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px] xl:items-start">
        {/* Colonne principale : aperçu en direct */}
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Aperçu du site en direct</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setPreviewLoading(true);
                    setPreviewKey((k) => k + 1);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  <RefreshCw size={13} />
                  Actualiser
                </button>
                <a
                  href={FRONTEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  <ExternalLink size={13} />
                  Ouvrir
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
                <span className="ml-2 truncate rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-400">
                  {FRONTEND_URL}
                </span>
              </div>
              <div className="relative h-[560px] w-full bg-gray-50">
                {previewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-300">
                    Chargement de l'aperçu…
                  </div>
                )}
                <iframe
                  key={previewKey}
                  src={FRONTEND_URL}
                  title="Aperçu du site en direct"
                  className="relative z-10 h-full w-full"
                  onLoad={() => setPreviewLoading(false)}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Contenu publié</p>
            {statsLoading ? (
              <SkeletonGrid count={statCards.length} />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {statCards.map(({ label, value, icon: Icon, to }, i) => (
                  <StatCard key={label} label={label} value={value} icon={Icon} to={to} delay={i * 40} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne latérale : à faire + activité */}
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">À faire</p>
            {pendingItems.length > 0 ? (
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between gap-3 rounded-xl border border-warning/25 bg-warning-soft p-3.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      <item.icon size={16} className="text-warning" />
                      {item.label}
                    </span>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-warning px-1.5 text-xs font-black text-white">
                      {item.count}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success-soft px-4 py-3.5 text-sm font-semibold text-success">
                <CheckCircle2 size={18} />
                Tout est à jour.
              </div>
            )}
          </div>

          {admin?.role === 'SUPER_ADMIN' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Activité récente</p>
                <Link to="/audit-log" className="text-[11px] font-bold text-brand-primary hover:underline">
                  Tout voir
                </Link>
              </div>
              <div className="rounded-2xl border border-line bg-white shadow-sm">
                {activity.length > 0 ? (
                  <ul className="divide-y divide-line/70">
                    {activity.map((entry) => (
                      <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                          <History size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-relaxed text-gray-600">
                            <span className="font-bold text-ink">{entry.adminEmail.split('@')[0]}</span>{' '}
                            {STANDALONE_ACTION_LABEL[entry.action] ?? (
                              <>
                                {ACTION_LABEL[entry.action] ?? entry.action.toLowerCase()}{' '}
                                {RESOURCE_LABEL[entry.resourceType] ?? entry.resourceType}
                              </>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">{timeAgo(entry.createdAt)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-6 text-center text-xs text-gray-400">Aucune activité récente.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
