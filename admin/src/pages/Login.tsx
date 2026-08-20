import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { useBranding } from '../lib/useBranding';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const branding = useBranding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const idleNotice = searchParams.get('raison') === 'inactivite';

  if (!loading && admin) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      await login(email, password);
      setStatus('success');
      setTimeout(() => navigate('/', { replace: true }), 500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 500);
    }
  }

  return (
    <div
      className="animate-gradient-flow flex min-h-screen items-center justify-center px-4"
      style={{
        background: 'linear-gradient(120deg, #3b0764, #6F1AAE, #8A2BE2, #4c1d95)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={`animate-fade-in-up w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl ${
          status === 'error' ? 'animate-shake' : ''
        }`}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-white/40">
            <img src={branding.logoUrl} alt={branding.siteName} className="h-full w-full object-contain p-1" />
          </div>
          <h1 className="text-lg font-semibold text-white">Bonjour, Administrateur</h1>
          <p className="text-sm text-white/60">Connectez-vous pour gérer {branding.siteName}</p>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-white/80">Adresse e-mail</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nagodetransfert.com"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-white/50 focus:bg-white/20"
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm font-medium text-white/80">Mot de passe</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-white/50 focus:bg-white/20"
          />
        </label>

        {idleNotice && !error && (
          <p className="mb-4 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/80" role="status">
            Session expirée après une période d'inactivité. Reconnectez-vous.
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg border border-red-400/30 bg-red-500/20 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting' || status === 'success'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-[#6F1AAE] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
        >
          {status === 'submitting' && <Loader2 className="animate-spin" size={16} />}
          {status === 'success' && <Check className="animate-pop-in" size={16} />}
          {status === 'submitting' ? 'Connexion…' : status === 'success' ? 'Connecté' : 'Se connecter'}
        </button>

        <p className="mt-6 text-center text-xs text-white/40">Accès réservé aux administrateurs de {branding.siteName}</p>
      </form>
    </div>
  );
}
