<template>
  <div class="fr-card">
    <div class="fr-card__body">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
        <div>
          <strong class="fr-text">{{ commentaire.auteur.prenom }} {{ commentaire.auteur.nom }}</strong>
          <span class="fr-text fr-text--sm fr-text--mention" style="margin-left: 0.5rem;">
            {{ formatDate(commentaire.created_at) }}
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span v-if="commentaire.statut === 'en_attente'" class="fr-badge" style="font-size: 0.625rem; background-color: #FEE7FC;">
            En attente de modération
          </span>
          <button
            v-if="peutModifier"
            @click="$emit('modifier', commentaire)"
            class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
            title="Modifier"
          >
            Modifier
          </button>
          <button
            v-if="peutSupprimer"
            @click="$emit('supprimer', commentaire.id)"
            class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
            title="Supprimer"
          >
            Supprimer
          </button>
        </div>
      </div>

      <p class="fr-text" style="white-space: pre-wrap;">{{ commentaire.contenu }}</p>

      <div style="margin-top: 0.75rem; display: flex; gap: 1rem; align-items: center;">
        <button
          v-if="commentaire.nb_reponses > 0"
          @click="toggleReponses"
          style="display: flex; align-items: center; gap: 0.25rem; background: none; border: none; cursor: pointer; color: var(--blue-france); font-size: 0.875rem;"
        >
          {{ showReponses ? '▼' : '▶' }} {{ commentaire.nb_reponses }} réponse{{ commentaire.nb_reponses > 1 ? 's' : '' }}
        </button>
        <button
          @click="$emit('repondre', commentaire)"
          style="background: none; border: none; cursor: pointer; color: var(--text-mention-grey); font-size: 0.875rem;"
        >
          Répondre
        </button>
      </div>

      <!-- Réponses imbriquées -->
      <div v-if="showReponses && commentaire.reponses_approuvees?.length > 0" style="margin-top: 1rem; margin-left: 2rem; border-left: 2px solid var(--border-default-grey); padding-left: 1rem;">
        <CommentaireItem
          v-for="reponse in commentaire.reponses_approuvees"
          :key="reponse.id"
          :commentaire="reponse"
          :user-id="userId"
          :style="{ marginBottom: '1rem' }"
          @modifier="$emit('modifier', $event)"
          @supprimer="$emit('supprimer', $event)"
          @repondre="$emit('repondre', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  commentaire: {
    type: Object,
    required: true
  },
  userId: {
    type: Number,
    default: null
  }
})

defineEmits(['modifier', 'supprimer', 'repondre'])

const showReponses = ref(false)

const peutModifier = computed(() => {
  return props.userId &&
         props.commentaire.auteur.id === props.userId &&
         props.commentaire.statut === 'en_attente'
})

const peutSupprimer = computed(() => {
  return props.userId && props.commentaire.auteur.id === props.userId
})

const toggleReponses = () => {
  showReponses.value = !showReponses.value
}

const formatDate = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInSeconds = Math.floor((now - commentDate) / 1000)

  if (diffInSeconds < 60) return 'À l\'instant'
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`

  return commentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
