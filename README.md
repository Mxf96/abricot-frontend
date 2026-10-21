# Abricot — Frontend

Frontend de **Abricot**, une application SaaS de gestion de projets et de tâches développée avec **Next.js**, **React** et **TypeScript**.

L'application permet à un utilisateur de gérer ses projets, ses tâches, ses contributeurs et son compte depuis une interface connectée à une API Express.

---

## Fonctionnalités

### Authentification

- Inscription avec nom, email et mot de passe
- Connexion utilisateur
- Déconnexion
- Récupération du profil utilisateur connecté
- Protection des pages privées
- Conservation de la session après actualisation
- Modification du nom et de l'adresse email
- Modification du mot de passe

Le JWT n'est pas stocké dans le `localStorage`.

L'authentification utilise un **cookie HttpOnly** avec :

- `HttpOnly`
- `SameSite=Strict`
- `Secure` en production

Les requêtes authentifiées passent par des Route Handlers Next.js qui récupèrent le cookie côté serveur puis transmettent le JWT au backend dans le header `Authorization`.

---

## Gestion des projets

L'utilisateur peut :

- consulter les projets auxquels il appartient ;
- créer un projet ;
- consulter le détail d'un projet ;
- modifier un projet selon ses permissions ;
- supprimer un projet selon ses permissions ;
- ajouter des contributeurs ;
- retirer des contributeurs.

Le créateur du projet possède les droits d'administration du projet.

---

## Gestion des tâches

Dans un projet, il est possible de :

- créer une tâche ;
- renseigner un titre ;
- ajouter une description ;
- définir une date d'échéance ;
- définir une priorité ;
- définir un statut ;
- assigner une tâche à un ou plusieurs utilisateurs ;
- modifier une tâche selon les permissions ;
- supprimer une tâche ;
- ajouter des commentaires.

Statuts principaux :

- `TODO` — À faire
- `IN_PROGRESS` — En cours
- `DONE` — Terminée

Priorités :

- `URGENT`
- `HIGH`
- `MEDIUM`
- `LOW`

Les tâches sont affichées selon leur niveau d'urgence, puis selon leur échéance.

---

## Tableau de bord

### Vue Liste

Affiche toutes les tâches assignées à l'utilisateur.

Ordre de priorité :

1. Urgente
2. Haute
3. Moyenne
4. Basse

À priorité identique, l'échéance la plus proche est affichée en premier.

Une recherche permet également de filtrer les tâches.

### Vue Kanban

Affiche uniquement les **tâches du mois courant** assignées à l'utilisateur.

Les tâches sont réparties en trois colonnes :

- À faire
- En cours
- Terminées

Les tâches sans date d'échéance restent disponibles dans la vue Liste mais ne sont pas affichées dans le Kanban mensuel.

---

## Permissions projet

| Action | Admin | Contributeur |
| --- | :---: | :---: |
| Consulter le projet | ✅ | ✅ |
| Modifier le projet | ✅ | ❌ |
| Supprimer le projet | ✅ | ❌ |
| Gérer les contributeurs | ✅ | ❌ |
| Créer une tâche | ✅ | ✅ |
| Modifier une tâche | ✅ | ❌ |
| Supprimer une tâche | ✅ | ✅ |
| Ajouter un commentaire | ✅ | ✅ |

Un utilisateur qui n'appartient pas au projet ne doit pas pouvoir y accéder.

Les permissions sont reflétées dans l'interface mais sont également contrôlées côté backend.

---

## Technologies

- Next.js 16
- React
- TypeScript
- App Router
- Context API
- Sass / SCSS
- Fetch API
- ESLint
- Prettier

---

## Prérequis

- Node.js
- npm
- Backend Abricot lancé sur `http://localhost:8000`

Le frontend utilise par défaut :

```text
http://localhost:3000
```

---

## Installation

Cloner le dépôt puis se placer dans le dossier frontend :

```bash
git clone <URL_DU_DEPOT_FRONTEND>
cd abricot-frontend
```

Installer les dépendances :

```bash
npm install
```

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
API_URL=http://localhost:8000
```

`API_URL` est volontairement une variable serveur.

Elle ne doit pas être remplacée par `NEXT_PUBLIC_API_URL` avec l'architecture d'authentification actuelle.

---

## Lancement en développement

Démarrer d'abord le backend sur le port `8000`.

Puis lancer le frontend :

```bash
npm run dev
```

Ouvrir :

```text
http://localhost:3000
```

---

## Build de production

```bash
npm run build
npm start
```

---

## Vérifications

ESLint :

```bash
npm run lint
```

Audit des dépendances :

```bash
npm audit
```

Éviter d'utiliser directement :

```bash
npm audit fix --force
```

sans vérifier les éventuels changements de versions majeures.

---

## Routes principales

| Route | Description | Accès |
| --- | --- | --- |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/forgot-password` | Page mot de passe oublié | Public |
| `/dashboard` | Tableau de bord | Protégé |
| `/projects` | Liste des projets | Protégé |
| `/projects/[id]` | Détail d'un projet | Protégé |
| `/account` | Gestion du compte | Protégé |

---

## Architecture de l'authentification

```text
Navigateur
   │
   │ Cookie HttpOnly
   ▼
Next.js
   │
   │ Authorization: Bearer <JWT>
   ▼
API Express
```

Le navigateur ne manipule plus directement le JWT.

Les principales routes intermédiaires Next.js sont situées dans :

```text
src/app/api/
├── auth/
│   ├── login/
│   │   └── route.ts
│   ├── logout/
│   │   └── route.ts
│   └── register/
│       └── route.ts
└── backend/
    └── [...path]/
        └── route.ts
```

Le proxy `/api/backend/[...path]` transmet les requêtes au backend sans exposer le JWT au JavaScript exécuté dans le navigateur.

---

## Structure principale

```text
src/
├── app/
│   ├── account/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── projects/
│   └── register/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── modals/
│   └── projects/
├── context/
├── services/
├── styles/
└── types/
```

### `app`

Pages de l'application et Route Handlers Next.js.

### `components`

Composants réutilisables de l'interface.

### `context`

Contexte global, notamment l'authentification.

### `services`

Centralise les appels API pour séparer la logique HTTP des composants React.

### `styles`

Styles SCSS organisés par partie de l'application.

### `types`

Types TypeScript partagés.

---

## Backend

Le frontend dépend de l'API Abricot.

Principales familles de routes utilisées :

```text
/auth/*
/dashboard/*
/projects/*
/users/*
```

En développement, l'API doit être disponible sur :

```text
http://localhost:8000
```

---

## Sécurité

Mesures mises en place :

- JWT stocké dans un cookie `HttpOnly`
- `SameSite=Strict`
- cookie `Secure` en production
- absence du JWT dans le `localStorage`
- routes privées protégées
- contrôles de permissions selon le rôle
- validation des formulaires
- appels API centralisés
- autorisations également vérifiées côté backend

Le masquage d'un bouton dans l'interface ne constitue pas à lui seul une mesure de sécurité : les permissions sont également contrôlées par l'API.

---

## Projet OpenClassrooms

Ce frontend a été développé dans le cadre du projet **Abricot**, un SaaS de gestion de projets et de tâches.

Le projet met notamment en œuvre :

- une application React / Next.js structurée ;
- une authentification JWT ;
- une gestion d'état globale avec Context API ;
- une communication avec une API REST ;
- une gestion des rôles et permissions ;
- une interface responsive ;
- une attention portée à l'accessibilité et à la qualité du code.

---

## Auteur

Projet réalisé dans le cadre de la formation OpenClassrooms.
