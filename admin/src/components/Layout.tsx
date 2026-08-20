import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bus,
  Building2,
  ChevronDown,
  Clock,
  Compass,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareHeart,
  Newspaper,
  Phone,
  Settings as SettingsIcon,
  Sparkles,
  Star,
  Tag,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { useBranding } from '../lib/useBranding';
import type { ContactMessage, Suggestion, Testimonial } from '../types';

type BadgeKey = 'suggestions' | 'contact' | 'testimonials';
type Role = 'SUPER_ADMIN';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  end?: boolean;
  badgeKey?: BadgeKey;
  roleOnly?: Role;
}

const dashboardLink: NavItem = { to: '/', label: 'Vue d’ensemble', icon: LayoutDashboard, end: true };

const groups: { title: string; links: NavItem[] }[] = [
  {
    title: 'Contact & Appels',
    links: [
      { to: '/support-numbers', label: "Numéros d'assistance", icon: Phone },
      { to: '/agencies', label: 'Agences', icon: Building2 },
      { to: '/contact-messages', label: 'Messages de contact', icon: Mail, badgeKey: 'contact' },
      { to: '/suggestions', label: 'Suggestions', icon: MessageSquareHeart, badgeKey: 'suggestions' },
    ],
  },
  {
    title: 'Gestion du contenu',
    links: [
      { to: '/vehicles', label: 'Flotte / Véhicules', icon: Bus },
      { to: '/destinations', label: 'Destinations', icon: Compass },
      { to: '/fares', label: 'Tarifs', icon: Tag },
      { to: '/schedules', label: 'Horaires', icon: Clock },
      { to: '/services', label: 'Nos Services', icon: Sparkles },
      { to: '/news', label: 'Actualités', icon: Newspaper },
    ],
  },
  {
    title: 'Confiance',
    links: [
      { to: '/testimonials', label: 'Avis clients', icon: Star, badgeKey: 'testimonials' },
      { to: '/faq', label: 'Questions fréquentes', icon: HelpCircle },
      { to: '/team-members', label: 'Notre Équipe', icon: Users },
    ],
  },
  {
    title: 'Paramètres',
    links: [
      { to: '/settings', label: 'Branding & Contact', icon: SettingsIcon },
      { to: '/account', label: 'Mon compte', icon: User },
      { to: '/admin-users', label: 'Administrateurs', icon: Users, roleOnly: 'SUPER_ADMIN' },
      { to: '/audit-log', label: "Journal d'activité", icon: History, roleOnly: 'SUPER_ADMIN' },
    ],
  },
];

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super-administrateur',
  EDITOR: 'Éditeur',
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { admin, logout } = useAuth();
  const branding = useBranding();
  const navigate = useNavigate();
  const [badges, setBadges] = useState<Record<BadgeKey, number>>({ suggestions: 0, contact: 0, testimonials: 0 });
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      api.get<Suggestion[]>('/suggestions'),
      api.get<ContactMessage[]>('/contact-messages'),
      api.get<Testimonial[]>('/testimonials'),
    ])
      .then(([suggestions, contact, testimonials]) => {
        setBadges({
          suggestions: suggestions.filter((s) => !s.isRead).length,
          contact: contact.filter((c) => !c.isRead).length,
          testimonials: testimonials.filter((t) => !t.approved).length,
        });
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  function renderLink({ to, label, icon: Icon, end, badgeKey, roleOnly }: NavItem) {
    if (roleOnly && admin?.role !== roleOnly) return null;
    const count = badgeKey ? badges[badgeKey] : 0;
    return (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={() => setMobileNavOpen(false)}
        className={({ isActive }) =>
          `group relative flex items-center justify-between gap-3 rounded-xl py-2.5 pr-3 pl-4 text-sm font-semibold transition-all duration-150 ${
            isActive
              ? 'bg-brand-dark text-white shadow-sm shadow-brand-dark/25'
              : 'text-gray-500 hover:bg-brand-primary/5 hover:text-ink'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 animate-pop-in rounded-full bg-white" />
            )}
            <span className="flex items-center gap-3">
              <Icon size={18} />
              {label}
            </span>
            {count > 0 && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                  isActive ? 'bg-white text-brand-dark' : 'bg-red-500 text-white'
                }`}
              >
                {count}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface lg:overflow-hidden">
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-shrink-0 transform flex-col border-r border-line bg-white transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-line">
              <img src={branding.logoUrl} alt={branding.siteName} className="h-full w-full object-contain p-0.5" />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-brand-dark">
                Nagode
              </p>
              <p className="text-xs font-medium text-gray-400">Espace Administrateur</p>
            </div>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            aria-label="Fermer le menu"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="relative flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          <div aria-hidden className="pointer-events-none absolute bottom-4 left-[19px] top-1 w-px border-l border-dashed border-line" />
          <div className="space-y-1">{renderLink(dashboardLink)}</div>
          {groups.map((group) => {
            const visibleLinks = group.links.filter((l) => !l.roleOnly || admin?.role === l.roleOnly);
            if (visibleLinks.length === 0) return null;
            return (
              <div key={group.title} className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{group.title}</p>
                {visibleLinks.map(renderLink)}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-line bg-white/80 px-4 py-3 backdrop-blur-sm sm:px-8">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Ouvrir le menu"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="relative ml-auto">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors sm:gap-3"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-dark/10 text-brand-dark">
                <User size={18} />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{admin?.name}</p>
                <p className="mt-0.5 text-xs text-gray-400 leading-none">
                  {admin?.role ? ROLE_LABEL[admin.role] ?? admin.role : ''}
                </p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-bold text-gray-900">{admin?.name}</p>
                    <p className="truncate text-xs text-gray-400">{admin?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div key={location.pathname} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
