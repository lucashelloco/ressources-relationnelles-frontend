# Feature: Mes Discussions

## Vue d'ensemble

Nouvelle page permettant aux utilisateurs de voir toutes les discussions auxquelles ils ont participé.

## Fonctionnalités

### Page "Mes discussions" (`/mes-discussions`)

**Affiche:**
- ✅ Toutes les discussions créées par l'utilisateur
- ✅ Toutes les discussions où l'utilisateur a envoyé au moins un message
- ✅ Triées par dernière activité (les plus récentes en premier)

**Pour chaque discussion:**
- Titre et description
- Ressource associée (avec lien cliquable)
- Nombre de messages
- Créateur de la discussion
- Date de dernière activité (format relatif: "Actif il y a X min/h/jours")
- Badge "Créateur" si l'utilisateur est le créateur
- Icône de navigation

**États:**
- Empty state élégant avec icône et CTA vers les ressources
- Loading state avec spinner
- Hover effects sur les cartes

## Backend

### Endpoint API

**Route:** `GET /api/v1/user/discussions`

**Authentification:** Requise

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titre": "Question sur la CNV",
      "description": "...",
      "ressource_id": 5,
      "ressource": {
        "id": 5,
        "titre": "Communication Non-Violente"
      },
      "createur_id": 2,
      "createur": {
        "id": 2,
        "prenom": "Marie",
        "nom": "Martin"
      },
      "messages_count": 12,
      "derniere_activite": "2026-01-17T14:30:00Z"
    }
  ]
}
```

### Logique

La requête récupère les discussions où:
- L'utilisateur est le créateur, OU
- L'utilisateur a envoyé au moins un message

Filtre appliqué:
- Seulement les discussions actives (`est_actif = true`)

Relations chargées:
- `createur` - Informations du créateur
- `ressource` - Ressource associée
- `messages_count` - Nombre total de messages

## Frontend

### Composant créé

**Fichier:** `src/views/user/MesDiscussions.vue`

**Fonctionnalités:**
- Chargement des discussions via API
- Navigation vers la discussion (ouvre la ressource avec query param `?discussion=ID`)
- Formatage des dates relatives
- Gestion des états loading/empty
- Design DSFR cohérent

### Routes

**Route ajoutée:**
```javascript
{
  path: '/mes-discussions',
  name: 'mes-discussions',
  component: () => import('@/views/user/MesDiscussions.vue'),
  meta: { requiresAuth: true }
}
```

### Navigation

Lien ajouté dans **NavBar** (menu utilisateur):
- Desktop: Dropdown menu
- Mobile: Menu mobile
- Icône: 💬
- Label: "Mes discussions"

## Navigation vers une discussion

Quand l'utilisateur clique sur une discussion:

1. Navigation vers `/ressources/{ressource_id}?discussion={discussion_id}`
2. La page RessourceDetailView:
   - Ouvre l'onglet "Discussions"
   - Charge automatiquement la discussion spécifiée
   - Affiche le chat en temps réel

## Utilisation

1. **Accéder à la page:**
   - Menu utilisateur → "💬 Mes discussions"
   - URL directe: `/mes-discussions`

2. **Voir une discussion:**
   - Cliquer sur n'importe quelle carte
   - Redirigé vers la ressource avec la discussion ouverte

3. **Voir la ressource:**
   - Cliquer sur le titre de la ressource dans la carte
   - Ouvre la ressource (sans auto-ouverture de discussion)

## Intégration avec les notifications

Les notifications de type `discussion_message` redirigent vers:
```
/ressources/{ressource_id}?discussion={discussion_id}
```

Ce qui ouvre directement la discussion concernée.

## Fichiers modifiés/créés

### Backend
- ✅ `app/Http/Controllers/API/DiscussionController.php` - Méthode `getUserDiscussions()`
- ✅ `routes/api.php` - Route `GET /user/discussions`

### Frontend
- ✅ `src/views/user/MesDiscussions.vue` (créé)
- ✅ `src/router/index.js` - Route ajoutée
- ✅ `src/components/layout/NavBar.vue` - Liens menu desktop et mobile

## Design

- Style DSFR cohérent
- Cartes interactives avec hover effect
- Icons SVG pour meilleure accessibilité
- Badges colorés pour statuts
- Responsive (mobile-first)
- Empty state engageant
