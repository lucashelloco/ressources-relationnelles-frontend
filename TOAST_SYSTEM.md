# Système de Toast - Documentation

## Vue d'ensemble

Toutes les popups `alert()` et `confirm()` ont été remplacées par un système moderne de toasts et de modals.

## Composants créés

### 1. Toast.vue (`src/components/common/Toast.vue`)
Composant de toast individuel avec 4 types:
- ✅ **success** - Vert avec icône ✓
- ❌ **error** - Rouge avec icône ✕
- ⚠️ **warning** - Orange avec icône ⚠
- ℹ️ **info** - Bleu avec icône ℹ

**Caractéristiques:**
- Animation slide-in depuis la droite
- Auto-fermeture configurable (par défaut 4s)
- Bouton de fermeture manuelle
- Responsive

### 2. ToastContainer.vue (`src/components/common/ToastContainer.vue`)
Conteneur qui gère l'affichage de tous les toasts actifs.
- Positionné en haut à droite de l'écran
- Z-index élevé (9999) pour toujours être visible
- Empile les toasts verticalement avec un espacement

### 3. useToast.js (`src/composables/useToast.js`)
Composable global pour gérer les toasts dans toute l'application.

**API:**
```javascript
import { useToast } from '@/composables/useToast'

const toast = useToast()

// Afficher des toasts
toast.success('Opération réussie')
toast.error('Une erreur est survenue')
toast.warning('Attention!')
toast.info('Information')

// Avec durée personnalisée
toast.success('Message', 6000) // 6 secondes
```

## Intégration

Le système de toast a été intégré dans `App.vue`:

```vue
<template>
  <div id="app">
    <NavBar />
    <main><RouterView /></main>
    <Footer />
    <ToastContainer />
  </div>
</template>
```

## Remplacement des popups

### Avant (alert/confirm)
```javascript
// Alert
alert('Commentaire supprimé avec succès')
alert('Erreur lors de la suppression')

// Confirm
if (!confirm('Êtes-vous sûr de vouloir supprimer ?')) return
```

### Après (toast/modal)
```javascript
// Toast pour informer
toast.success('Commentaire supprimé avec succès')
toast.error('Erreur lors de la suppression')

// Modal pour confirmer
const showDeleteModal = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  // Effectuer l'action
  showDeleteModal.value = false
  toast.success('Supprimé avec succès')
}
```

## Fichiers modifiés

### Components
- ✅ `src/components/discussions/DiscussionList.vue`
  - Alert remplacé par toast pour création de discussion

- ✅ `src/components/discussions/DiscussionRoom.vue`
  - Alerts remplacés par toasts
  - Confirm remplacé par modal de confirmation

- ✅ `src/views/ressources/RessourceDetailView.vue`
  - 8 alerts remplacés par toasts
  - 1 confirm remplacé par modal de confirmation

- ✅ `src/views/admin/AdminDashboard.vue`
  - Alerts remplacés par toasts
  - Modals success/error remplacés par toasts

## Modals de confirmation

Les modals de confirmation suivent le pattern DSFR:

```vue
<div v-if="showModal" class="fr-modal" style="...">
  <div style="...">
    <h3>Titre de confirmation</h3>
    <p>Message de confirmation</p>
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button @click="showModal = false" class="fr-btn fr-btn--secondary">
        Annuler
      </button>
      <button @click="confirmer" class="fr-btn" style="background-color: var(--error);">
        Confirmer
      </button>
    </div>
  </div>
</div>
```

## Statistiques

- **0** `alert()` restants dans le code ✅
- **0** `confirm()` restants dans le code ✅
- **4** types de toasts disponibles
- **100%** des popups natives remplacées

## Avantages

1. **UX améliorée** - Toasts non-bloquants vs popups bloquantes
2. **Design cohérent** - Utilise le DSFR
3. **Personnalisable** - Types, durées, messages
4. **Accessible** - ARIA roles et attributs
5. **Mobile-friendly** - Responsive et adaptatif
6. **Multi-toast** - Plusieurs toasts peuvent s'afficher simultanément
7. **Animations fluides** - Transitions CSS élégantes
