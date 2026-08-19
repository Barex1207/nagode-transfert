import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import type { SiteSettings } from '../types';
import { Button } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Field';
import { ImageUpload } from '../components/ui/ImageUpload';
import { BrandPreview } from '../components/BrandPreview';

type FormState = Omit<SiteSettings, 'id' | 'updatedAt'>;

export default function Settings() {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get<SiteSettings>('/settings').then(({ id, updatedAt, ...rest }) => setForm(rest));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put<SiteSettings>('/settings', form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Échec de l’enregistrement');
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return <Loader2 className="animate-spin text-brand-primary" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900">Branding & Contact</h1>
      <p className="mb-6 text-sm text-gray-400">Identité visuelle et coordonnées affichées sur la landing page.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-brand-primary">Identité visuelle</h2>
        <Field label="Logo">
          <ImageUpload value={form.logoUrl} onChange={(url) => setForm((f) => f && { ...f, logoUrl: url })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Couleur principale">
            <Input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm((f) => f && { ...f, primaryColor: e.target.value })}
              className="h-10 p-1"
            />
          </Field>
          <Field label="Couleur secondaire">
            <Input
              type="color"
              value={form.secondaryColor}
              onChange={(e) => setForm((f) => f && { ...f, secondaryColor: e.target.value })}
              className="h-10 p-1"
            />
          </Field>
        </div>

        <h2 className="mb-4 mt-6 text-sm font-black uppercase tracking-wide text-brand-primary">Textes</h2>
        <Field label="Nom du site">
          <Input value={form.siteName} onChange={(e) => setForm((f) => f && { ...f, siteName: e.target.value })} />
        </Field>
        <Field label="Slogan">
          <Input value={form.slogan} onChange={(e) => setForm((f) => f && { ...f, slogan: e.target.value })} />
        </Field>
        <Field label="Texte de présentation">
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
          />
        </Field>

        <h2 className="mb-4 mt-6 text-sm font-black uppercase tracking-wide text-brand-primary">Contact</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Téléphone">
            <Input value={form.phone} onChange={(e) => setForm((f) => f && { ...f, phone: e.target.value })} />
          </Field>
          <Field label="WhatsApp">
            <Input
              value={form.whatsapp ?? ''}
              onChange={(e) => setForm((f) => f && { ...f, whatsapp: e.target.value || null })}
            />
          </Field>
        </div>
        <Field label="E-mail">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => f && { ...f, email: e.target.value })}
          />
        </Field>
        <Field label="Adresse">
          <Input value={form.address} onChange={(e) => setForm((f) => f && { ...f, address: e.target.value })} />
        </Field>

        <h2 className="mb-4 mt-6 text-sm font-black uppercase tracking-wide text-brand-primary">Réseaux sociaux</h2>
        <Field label="Facebook">
          <Input
            type="url"
            value={form.facebookUrl ?? ''}
            onChange={(e) => setForm((f) => f && { ...f, facebookUrl: e.target.value || null })}
          />
        </Field>
        <Field label="Instagram">
          <Input
            type="url"
            value={form.instagramUrl ?? ''}
            onChange={(e) => setForm((f) => f && { ...f, instagramUrl: e.target.value || null })}
          />
        </Field>
        <Field label="Twitter / X">
          <Input
            type="url"
            value={form.twitterUrl ?? ''}
            onChange={(e) => setForm((f) => f && { ...f, twitterUrl: e.target.value || null })}
          />
        </Field>

        <h2 className="mb-4 mt-6 text-sm font-black uppercase tracking-wide text-brand-primary">Section d'accueil</h2>
        <Field label="Image de fond (Hero)">
          <ImageUpload
            value={form.heroImageUrl}
            onChange={(url) => setForm((f) => f && { ...f, heroImageUrl: url })}
          />
        </Field>
        <Field label="Texte statistique (ex: +50,000)">
          <Input
            value={form.heroUsersLabel}
            onChange={(e) => setForm((f) => f && { ...f, heroUsersLabel: e.target.value })}
          />
        </Field>

        <h2 className="mb-4 mt-6 text-sm font-black uppercase tracking-wide text-brand-primary">Application mobile</h2>
        <Field label="Lien App Store">
          <Input
            type="url"
            value={form.appStoreUrl ?? ''}
            onChange={(e) => setForm((f) => f && { ...f, appStoreUrl: e.target.value || null })}
          />
        </Field>
        <Field label="Lien Google Play">
          <Input
            type="url"
            value={form.playStoreUrl ?? ''}
            onChange={(e) => setForm((f) => f && { ...f, playStoreUrl: e.target.value || null })}
          />
        </Field>
        <Field label="Aperçu de l'application (capture d'écran)">
          <ImageUpload
            value={form.appPreviewImageUrl}
            onChange={(url) => setForm((f) => f && { ...f, appPreviewImageUrl: url })}
          />
        </Field>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-600">Modifications enregistrées.</p>}

        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Enregistrer
        </Button>
      </form>

      <BrandPreview
        siteName={form.siteName}
        slogan={form.slogan}
        logoUrl={form.logoUrl}
        primaryColor={form.primaryColor}
        secondaryColor={form.secondaryColor}
        heroImageUrl={form.heroImageUrl}
        heroUsersLabel={form.heroUsersLabel}
      />
      </div>
    </div>
  );
}
