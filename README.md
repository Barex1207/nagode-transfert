# Nagode Transfert

Site vitrine, API et back-office pour Nagode Transfert (transport de voyageurs, envoi de colis, transfert d'argent en Afrique de l'Ouest).

## Architecture

Le projet est un monorepo composé de trois applications indépendantes :

| Dossier | Rôle | Stack |
|---|---|---|
| `/frontend` | Landing page publique | React 19 + Vite + TypeScript + Tailwind |
| `/backend` | API REST + base de données | Node.js + Express + Prisma + PostgreSQL |
| `/admin` | Dashboard d'administration | React 19 + Vite + TypeScript + Tailwind |

La landing page et le dashboard admin consomment tous les deux l'API du dossier `backend`. Tout le contenu autrefois codé en dur (véhicules, agences, actualités, tarifs, horaires, destinations, services, branding/contact, numéros d'assistance) est géré depuis le dashboard admin et s'affiche dynamiquement sur la landing page.

## Prérequis

- Node.js 20+
- PostgreSQL 14+ (local ou distant)

## Installation locale

### 1. Base de données

Créez une base PostgreSQL dédiée (exemple avec `psql`) :

```bash
psql -U postgres -c "CREATE ROLE nagode_app LOGIN PASSWORD 'votre_mot_de_passe' CREATEDB;"
psql -U postgres -c "CREATE DATABASE nagode_transfert OWNER nagode_app;"
```

### 2. Backend (API)

```bash
cd backend
npm install
cp .env.example .env   # puis renseignez DATABASE_URL, JWT_SECRET, etc.
npm run prisma:migrate  # crée les tables
npm run seed             # crée le premier compte administrateur (super-admin)
npm run seed:content     # réimporte le contenu d'origine du site (agences, tarifs, horaires, destinations, numéros, services)
npm run dev               # démarre l'API sur http://localhost:4000
```

Variables d'environnement (`backend/.env.example`) :

- `DATABASE_URL` — chaîne de connexion PostgreSQL
- `JWT_SECRET` — secret aléatoire long (ex: `openssl rand -hex 48`)
- `CORS_ORIGIN` — origines autorisées (landing page + admin), séparées par des virgules
- `PUBLIC_URL` — URL publique du backend (sert à construire les liens d'images uploadées en local)
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — identifiants du premier compte admin créé par `npm run seed`
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — optionnel ; si les trois sont renseignés, les images uploadées partent sur Cloudinary au lieu du disque local (recommandé en production, voir section Déploiement)

Après le premier lancement, connectez-vous au dashboard avec ces identifiants **et changez le mot de passe** depuis "Mon compte" avant toute mise en production.

### 3. Dashboard admin

```bash
cd admin
npm install
cp .env.example .env.local   # VITE_API_URL doit pointer vers l'API backend
npm run dev                    # démarre le dashboard sur http://localhost:5173
```

### 4. Landing page

```bash
cd frontend
npm install
cp .env.example .env.local   # VITE_API_URL doit pointer vers l'API backend
npm run dev                    # démarre le site sur http://localhost:3000
```

Une fois les trois services lancés, toute donnée créée/modifiée dans le dashboard admin (`http://localhost:5173`) apparaît sur la landing page (`http://localhost:3000`) après rafraîchissement.

### 5. Tests backend

```bash
cd backend
npm test
```

Suite d'intégration (vitest + supertest) : authentification, protection CSRF, contrôle des rôles, CRUD protégé/public, validation des entrées. Tourne contre la base configurée dans `DATABASE_URL` — n'utilisez pas votre base de production.

## Fonctionnalités du dashboard admin

- **Connexion sécurisée** : JWT en cookie `httpOnly`, protection CSRF (double-submit cookie) sur toutes les requêtes de modification, mots de passe hachés (bcrypt), rate limiting sur `/auth/login` et sur les formulaires publics, validation stricte des entrées (zod), CORS restreint aux origines connues.
- **Rôles & gestion des administrateurs** : deux rôles (Super-administrateur / Éditeur). Un super-admin peut créer d'autres comptes, changer leur rôle, réinitialiser leur mot de passe, les désactiver ou les supprimer, depuis "Administrateurs".
- **Mon compte** : chaque administrateur peut changer son propre mot de passe.
- **Journal d'activité** : historique des créations/modifications/suppressions et connexions (qui a fait quoi et quand), visible par les super-admins.
- **Branding & Contact** : logo, couleurs (appliquées dynamiquement sur toute la landing page), slogan, texte de présentation, téléphone/WhatsApp/e-mail/adresse, réseaux sociaux, image et statistique de la section d'accueil, liens App Store/Google Play.
- **Flotte / Véhicules** : CRUD complet (nom, modèle, image, capacité, statut, description), réordonnable par glisser-déposer.
- **Nos Services** : CRUD complet (titre, description, icône), réordonnable par glisser-déposer.
- **Destinations** : CRUD complet (pays, site touristique, image, drapeau), réordonnable par glisser-déposer.
- **Agences** : CRUD complet — ville, pays, indicatif téléphonique, adresse, horaires, **plusieurs numéros ticket et plusieurs numéros colis par agence**, e-mail, lien carte. Recherche par ville/pays.
- **Horaires de départ** : CRUD complet, chaque horaire peut être rattaché à une agence, avec liste des heures de départ et fréquence. Filtrable par agence, recherche par trajet, réordonnable par glisser-déposer.
- **Tarifs** : grille tarifaire Bus (trajet + prix) et Colis (libellé + prix + description), recherche, réordonnable par glisser-déposer.
- **Actualités** : CRUD complet avec **plusieurs photos par publication** (galerie), contenu, résumé, date de publication, **statut brouillon/publié** (aperçu avant mise en ligne), recherche par titre.
- **Numéros d'assistance** : numéros de téléphone par catégorie (ticket / colis / transfert d'argent) utilisés par le module d'assistance rapide et le formulaire de réservation du site.
- **Suggestions & Messages de contact** : boîtes de réception recevant en temps réel les formulaires soumis publiquement sur le site (badge de messages non lus dans le menu, marquer lu/non lu, suppression).
- **Notre Équipe** : CRUD complet (nom, rôle, photo) pour la section "Notre Équipe" de la page d'accueil, réordonnable par glisser-déposer.
- **Avis clients** : les visiteurs soumettent un avis (note + message) depuis `/avis` ; il n'apparaît publiquement qu'après validation par un administrateur depuis "Avis clients" (badge d'avis en attente dans le menu).
- **Questions fréquentes** : CRUD complet (question, réponse, catégorie), réordonnable par glisser-déposer, regroupé par catégorie sur la page `/faq` publique.
- **Upload d'images** : local par défaut (`backend/uploads`) ou Cloudinary si configuré, types de fichiers restreints (jpg/png/webp/gif), taille limitée à 5 Mo.

## SEO & Référencement

- **Vraies URLs par page** (`react-router-dom`) : chaque page a son URL, son titre et sa meta description propres (`/agences`, `/tarifs`, `/contact`, etc.), au lieu d'un état interne à une seule URL.
- `robots.txt` et `sitemap.xml` dans `frontend/public/`.
- Balises Open Graph / Twitter Card générées dynamiquement par page (`frontend/lib/useDocumentHead.ts`).
- Schema.org `LocalBusiness` (JSON-LD) injecté automatiquement à partir des réglages du site.
- Page 404 personnalisée, pages de remerciement dédiées (`/merci?type=...`) après chaque formulaire, pages Confidentialité et Conditions d'utilisation.
- CTA sticky sur mobile, découpage du code par page (`React.lazy`) pour réduire le poids du chargement initial.
- `vercel.json` (frontend et admin) redirige toutes les routes vers `index.html` — nécessaire pour que les URLs directes (ex: `/agences`) fonctionnent une fois déployé sur Vercel.

## API

Toutes les routes sont préfixées par `/api`. Les listes (`GET`) sont publiques ; la création/modification/suppression nécessite d'être authentifié **et** d'envoyer un jeton CSRF valide (voir section Sécurité) — sauf la soumission des formulaires publics, qui est un `POST` ouvert mais limité en fréquence.

| Ressource | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/change-password` |
| Administrateurs (super-admin) | `GET/POST /admin-users`, `PATCH/DELETE /admin-users/:id`, `POST /admin-users/:id/reset-password` |
| Journal d'activité (super-admin) | `GET /audit-log` |
| Véhicules | `GET/POST /vehicles`, `GET/PUT/DELETE /vehicles/:id`, `PATCH /vehicles/reorder` |
| Services | `GET/POST /services`, `GET/PUT/DELETE /services/:id`, `PATCH /services/reorder` |
| Destinations | `GET/POST /destinations`, `GET/PUT/DELETE /destinations/:id`, `PATCH /destinations/reorder` |
| Agences | `GET/POST /agencies`, `GET/PUT/DELETE /agencies/:id`, `PATCH /agencies/reorder` |
| Horaires | `GET/POST /schedules` (filtrable par `?agencyId=`), `GET/PUT/DELETE /schedules/:id`, `PATCH /schedules/reorder` |
| Tarifs | `GET/POST /fares`, `GET/PUT/DELETE /fares/:id`, `PATCH /fares/reorder` |
| Actualités | `GET/POST /news`, `GET/PUT/DELETE /news/:id` (champs `images: string[]`, `published: boolean`) |
| Numéros d'assistance | `GET/POST /support-numbers`, `GET/PUT/DELETE /support-numbers/:id` |
| Suggestions | `POST /suggestions` (public), `GET /suggestions`, `PATCH/DELETE /suggestions/:id` (admin) |
| Messages de contact | `POST /contact-messages` (public), `GET /contact-messages`, `PATCH/DELETE /contact-messages/:id` (admin) |
| Réglages | `GET /settings`, `PUT /settings` |
| FAQ | `GET/POST /faq`, `GET/PUT/DELETE /faq/:id`, `PATCH /faq/reorder` |
| Avis clients | `POST /testimonials` (public), `GET /testimonials` (public = approuvés uniquement), `PATCH/DELETE /testimonials/:id` (admin) |
| Notre Équipe | `GET/POST /team-members`, `GET/PUT/DELETE /team-members/:id`, `PATCH /team-members/reorder` |
| Upload | `POST /uploads` (multipart, champ `file`) |

## Déploiement

### Backend + base de données → Render

1. Créez une base **PostgreSQL** sur Render (onglet "New > PostgreSQL"), copiez l'`Internal Database URL`.
2. Créez un **Web Service** Render pointant sur le dossier `backend` :
   - Build command : `npm install && npm run build && npm run prisma:deploy`
   - Start command : `npm start`
3. Renseignez les variables d'environnement du service (mêmes clés que `backend/.env.example`) :
   - `DATABASE_URL` = l'URL Render Postgres
   - `JWT_SECRET` = un secret long généré aléatoirement
   - `CORS_ORIGIN` = les URLs Vercel de la landing page et de l'admin (séparées par des virgules)
   - `PUBLIC_URL` = l'URL publique du service Render
   - `COOKIE_SECURE` = `true`
   - `NODE_ENV` = `production`
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — **fortement recommandé** : le disque local d'un Web Service Render n'est pas persistant entre les déploiements, donc les images uploadées sans Cloudinary seraient perdues au prochain déploiement. Créez un compte gratuit sur [cloudinary.com](https://cloudinary.com) et renseignez ces trois valeurs (visibles sur le tableau de bord Cloudinary) pour activer le stockage cloud.
4. Une fois déployé, exécutez `npm run seed` (crée le compte admin) puis `npm run seed:content` (réimporte le contenu d'origine) une fois — via le shell Render, ou en local avec `DATABASE_URL` pointant sur la base de prod.

### Landing page + Dashboard admin → Vercel

Déployez `/frontend` et `/admin` comme **deux projets Vercel distincts** (même repo GitHub, "Root Directory" différent pour chacun) :

- Landing page : Root Directory = `frontend`, Build command = `npm run build`, Output = `dist`
- Dashboard admin : Root Directory = `admin`, Build command = `npm run build`, Output = `dist`

Pour chaque projet, définissez la variable d'environnement `VITE_API_URL` = URL publique du backend Render (ex: `https://nagode-api.onrender.com/api`).

Pensez ensuite à mettre à jour `CORS_ORIGIN` sur le backend Render avec les URLs Vercel définitives.

## Contenu

Toutes les données autrefois codées en dur dans le frontend (contacts, numéros, agences, tarifs, horaires, destinations, services, textes de la section d'accueil, liens des stores) ont été supprimées du code et vivent maintenant en base de données, éditables depuis le dashboard admin.

Le script `backend/prisma/seedContent.ts` (exécuté via `npm run seed:content`) réimporte l'intégralité du contenu historique du site : les 32 agences (Togo, Ghana, Côte d'Ivoire) avec leurs numéros ticket et colis complets et leur e-mail, les 5 destinations touristiques, la grille tarifaire bus complète (31 trajets) et colis (4 paliers), les 13 horaires de départ (liés à leur agence quand elle existe), et les 13 numéros d'assistance. **Ce script réinitialise ces tables avant de les repeupler** — ne le relancez pas après avoir personnalisé ce contenu depuis le dashboard, sous peine d'écraser vos modifications.

## Sécurité

- Authentification par cookie JWT `httpOnly` + `secure` en production, mots de passe hachés avec bcrypt (12 rounds).
- **Protection CSRF** : à la connexion, un jeton aléatoire est posé dans un cookie `csrf_token` (non `httpOnly`, lisible par le dashboard) ; toute requête de modification (`POST`/`PUT`/`PATCH`/`DELETE`) authentifiée doit renvoyer ce jeton dans l'en-tête `x-csrf-token`, sans quoi elle est rejetée (403).
- **Rôles** : `SUPER_ADMIN` (accès complet, gestion des autres comptes et du journal d'activité) et `EDITOR` (gestion du contenu, sans accès à la gestion des comptes).
- **Journal d'activité** : chaque création/modification/suppression et chaque tentative de connexion (réussie ou non) est enregistrée avec l'auteur, la ressource et la date.
- Rate limiting dédié sur `/auth/login` et les formulaires publics (10 tentatives / 15 min) et global sur l'API.
- CORS restreint à une liste blanche d'origines.
- Validation stricte de toutes les entrées utilisateur avec zod.
- Upload d'images limité en taille et en type MIME, noms de fichiers générés aléatoirement (pas d'exécution possible), stockage Cloudinary optionnel pour la persistance en production.
- `helmet` activé sur l'API pour les en-têtes de sécurité HTTP standards.
- Suite de tests d'intégration (`npm test` dans `backend/`) couvrant l'authentification, le CSRF, les rôles et le CRUD.

## Limites connues / pistes d'amélioration

- **Réinitialisation de mot de passe "mot de passe oublié"** : non implémentée par e-mail (aucun fournisseur d'envoi d'e-mails n'est configuré). En attendant, un super-admin peut réinitialiser le mot de passe de n'importe quel compte depuis "Administrateurs".
- Le glisser-déposer réordonne au sein d'une même liste ; il se désactive automatiquement quand une recherche ou un filtre est actif (pour éviter toute confusion sur les positions).
- Le statut brouillon/publié n'existe actuellement que pour les Actualités ; les autres contenus sont publiés immédiatement.
- **Google Analytics** n'est pas installé — nécessite un compte GA côté client (identifiant de suivi à fournir).
- `frontend/public/sitemap.xml` liste les URLs avec le domaine `https://nagodetransfert.com` codé en dur — à mettre à jour si le domaine final diffère, et à régénérer si de nouvelles pages sont ajoutées.
- Pas de section "Études de cas" — jugée moins prioritaire que les avis clients pour ce type d'activité ; peut être ajoutée sur le même modèle que les Actualités si besoin.
