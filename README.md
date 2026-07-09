# 🇨🇬 Congo Soldes - Plateforme de Promotions

**La qualité au petit prix** - Plateforme web marketplace de gestion, publication et suivi des promotions des boutiques à Brazzaville.

## Stack Technique

| Technologie | Usage |
|---|---|
| **Next.js 14** (App Router) | Framework full-stack React |
| **TypeScript** | Typage strict |
| **Tailwind CSS** | Design system utility-first |
| **Prisma** | ORM TypeScript |
| **PostgreSQL** | Base de données relationnelle |
| **NextAuth.js** | Authentification JWT |
| **Recharts** | Graphiques statistiques |
| **Leaflet** | Cartes et géolocalisation |
| **Lucide React** | Icônes modernes |
| **Sonner** | Notifications toast |
| **Zod** | Validation de schémas |
| **React Hook Form** | Gestion de formulaires |

## Architecture

```
congo-soldes/
├── prisma/
│   ├── schema.prisma          # Modèle de données complet
│   └── seed.ts                # Données de démonstration Brazzaville
├── src/
│   ├── app/                   # Routes Next.js 14 App Router
│   │   ├── api/               # API Routes
│   │   ├── admin/             # Back-office administrateur
│   │   ├── auth/              # Pages d'authentification
│   │   ├── boutiques/         # Pages boutiques publiques
│   │   ├── categories/        # Pages catégories
│   │   ├── client/            # Espace client
│   │   ├── commercant/        # Espace commerçant
│   │   └── promotions/        # Pages promotions publiques
│   ├── components/
│   │   ├── layout/            # Header, Footer, Sidebar
│   │   ├── promotions/        # Cartes promotionnelles
│   │   ├── categories/        # Cartes catégories
│   │   ├── boutiques/         # Cartes boutiques
│   │   ├── ui/                # Composants réutilisables
│   │   └── map/               # Composants cartographiques
│   └── lib/
│       ├── auth.ts            # Configuration NextAuth
│       ├── prisma.ts          # Client Prisma singleton
│       ├── utils.ts           # Fonctions utilitaires
│       ├── constants.ts       # Constantes (plans, sections, etc.)
│       └── notifications.ts   # Système de notification
├── types/                     # Types TypeScript
└── docker/                    # Configuration Docker
```

## Modèle de Données (26 tables)

- **Users** - Comptes utilisateurs (7 rôles)
- **Roles / Permissions / RolePermissions** - RBAC complet
- **Shops** - Boutiques avec géolocalisation
- **Categories / SubCategories** - Hiérarchie de catégories
- **Arrondissements / Districts** - Localisations Brazzaville
- **Promotions / PromotionMedia** - Offres avec images/vidéos
- **Favorites / ShopFollowers** - Engagements utilisateurs
- **Reviews** - Avis et notes détaillés
- **Reports** - Signalements
- **SubscriptionPlans / ShopSubscriptions** - Abonnements
- **Payments** - Paiements (Mobile Money, Visa, etc.)
- **SponsoredCampaigns** - Campagnes publicitaires
- **AnalyticsEvents** - Analytics détaillés
- **Notifications** - Notifications push/email/WhatsApp
- **CMSPages / Banners** - Contenu éditable
- **AuditLogs** - Journalisation des actions

## Fonctionnalités Principales

### Clients
- ✅ Recherche avancée (catégorie, prix, réduction, localisation)
- ✅ Fiches promotion détaillées (images, prix, conditions, compteur)
- ✅ Contact direct WhatsApp / Appel / Itinéraire
- ✅ Favoris et suivi de boutiques
- ✅ Avis et notation des boutiques
- ✅ QR code et partage promotion
- ✅ Géolocalisation des promotions

### Commerçants
- ✅ Tableau de bord avec statistiques en temps réel
- ✅ Gestion des promotions (CRUD, duplication, planification)
- ✅ Campagnes sponsorisées
- ✅ Abonnements (Gratuit, Standard, Premium, Enterprise)
- ✅ Suivi des vues, clics, appels, favoris
- ✅ Gestion multi-utilisateurs (propriétaire + gestionnaires)

### Administrateurs
- ✅ Dashboard global (CA, utilisateurs, boutiques, promotions)
- ✅ Validation des boutiques et promotions
- ✅ Gestion des utilisateurs et rôles
- ✅ Gestion des catégories et localisations
- ✅ Modération des signalements et avis
- ✅ Gestion des paiements et abonnements
- ✅ CMS (pages, bannières)
- ✅ Logs d'activité complets

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou pnpm

### 1. Cloner et installer

```bash
git clone <repo-url>
cd congo-soldes
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos credentials PostgreSQL :

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/congo_soldes"
DIRECT_URL="postgresql://postgres:password@localhost:5432/congo_soldes"
NEXTAUTH_SECRET="votre-secret-aleatoire-64-caracteres"
```

### 3. Initialiser la base de données

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Lancer l'application

```bash
npm run dev
```

Accès : [http://localhost:3000](http://localhost:3000)

## Comptes de Démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Super Admin | admin@congosoldes.cg | Admin@123 |
| Client test | client@test.cg | Client@123 |
| Boutique Élégance | marie@elegance.cg | Commercant@123 |
| Market Plus | jean@marketplus.cg | Commercant@123 |

## Données de Démonstration

Le seed crée automatiquement :

- **9 arrondissements** de Brazzaville avec leurs quartiers
- **16 catégories** avec sous-catégories
- **6 boutiques** avec promotions actives
- **12 promotions** réparties dans différentes catégories
- **4 plans d'abonnement** (Gratuit, Standard, Premium, Enterprise)
- **Pages CMS** (À propos, FAQ, CGU, Confidentialité)
- **Comptes utilisateurs** de test

## Règles Métier

- ✅ Réduction calculée automatiquement du prix
- ✅ Promotions expirées passent automatiquement en statut "EXPIRED"
- ✅ Boutiques non validées ne peuvent pas publier
- ✅ Signalement > 5 fois masque automatiquement la promotion
- ✅ Promotions sponsorisées clairement identifiées
- ✅ Actions sensibles journalisées dans AuditLogs
- ✅ Limites de promotions selon abonnement
- ✅ Protection CSRF, XSS, validation entrées
- ✅ Tentatives de connexion limitées

## Scripts Disponibles

```bash
npm run dev           # Développement
npm run build          # Build production
npm run start          # Démarrage production
npm run lint           # Linting
npm run db:generate    # Générer client Prisma
npm run db:push        # Push schema to DB
npm run db:migrate     # Créer migration
npm run db:studio      # Prisma Studio
npm run db:seed        # Données démo
```

## License

Propriétaire - Congo Soldes © 2026