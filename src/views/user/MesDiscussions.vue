<template>
  <div class="fr-container fr-py-6">
    <h1 class="fr-h2" style="margin-bottom: 2rem;">Mes discussions</h1>

    <!-- Loading State -->
    <div v-if="loading" style="display: flex; justify-content: center; padding: 3rem 0;">
      <div class="fr-spinner" style="width: 3rem; height: 3rem;"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="discussions.length === 0" class="fr-card fr-p-4" style="text-align: center;">
      <svg class="w-16 h-16 mx-auto mb-4" style="width: 4rem; height: 4rem; margin: 0 auto 1rem; opacity: 0.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p style="color: var(--text-mention-grey); margin: 0;">
        Vous n'avez participé à aucune discussion pour le moment.
      </p>
      <p class="fr-text--sm" style="color: var(--text-mention-grey); margin: 0.5rem 0 0 0;">
        Visitez les ressources et rejoignez les conversations !
      </p>
      <router-link to="/ressources" class="fr-btn" style="margin-top: 1.5rem;">
        Parcourir les ressources
      </router-link>
    </div>

    <!-- Discussions List -->
    <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
      <div
        v-for="discussion in discussions"
        :key="discussion.id"
        class="fr-card fr-p-4"
        style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
        @click="navigateToDiscussion(discussion)"
        @mouseenter="$event.currentTarget.style.transform = 'translateY(-2px)'"
        @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'"
      >
        <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
          <div style="flex: 1; min-width: 0;">
            <!-- Discussion Title -->
            <h3 class="fr-h6" style="margin: 0 0 0.5rem 0;">{{ discussion.titre }}</h3>

            <!-- Discussion Description -->
            <p v-if="discussion.description" class="fr-text fr-text--sm" style="margin: 0 0 0.75rem 0; color: var(--text-mention-grey);">
              {{ discussion.description }}
            </p>

            <!-- Resource Info -->
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <svg class="w-4 h-4" style="width: 1rem; height: 1rem; color: var(--blue-france);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <router-link
                :to="`/ressources/${discussion.ressource?.id}`"
                @click.stop
                class="fr-text fr-text--sm"
                style="color: var(--blue-france); text-decoration: none;"
              >
                {{ discussion.ressource?.titre }}
              </router-link>
            </div>

            <!-- Stats and Info -->
            <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
              <span class="fr-badge fr-badge--sm" style="background-color: var(--blue-france-sun-113-625); color: white;">
                {{ discussion.messages_count || 0 }} message{{ discussion.messages_count > 1 ? 's' : '' }}
              </span>

              <span class="fr-text fr-text--xs" style="color: var(--text-mention-grey); display: flex; align-items: center; gap: 0.25rem;">
                <svg class="w-4 h-4" style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Par {{ discussion.createur?.prenom }} {{ discussion.createur?.nom }}
              </span>

              <span v-if="discussion.derniere_activite" class="fr-text fr-text--xs" style="color: var(--text-mention-grey); display: flex; align-items: center; gap: 0.25rem;">
                <svg class="w-4 h-4" style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatLastActivity(discussion.derniere_activite) }}
              </span>

              <!-- Your role badge -->
              <span
                v-if="discussion.createur_id === authStore.user?.id"
                class="fr-badge fr-badge--sm fr-badge--success"
              >
                Créateur
              </span>
            </div>
          </div>

          <!-- Arrow Icon -->
          <svg class="w-5 h-5" style="flex-shrink: 0; width: 1.25rem; height: 1.25rem; color: var(--text-mention-grey);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const discussions = ref([])
const loading = ref(true)

const loadMyDiscussions = async () => {
  try {
    loading.value = true
    const response = await api.get('/user/discussions')
    discussions.value = response.data.data || []
  } catch (error) {
    console.error('Error loading my discussions:', error)
    toast.error('Erreur lors du chargement de vos discussions')
  } finally {
    loading.value = false
  }
}

const navigateToDiscussion = (discussion) => {
  router.push(`/ressources/${discussion.ressource_id}?discussion=${discussion.id}`)
}

const formatLastActivity = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Actif à l\'instant'
  if (diffInSeconds < 3600) return `Actif il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Actif il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Actif il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`

  return `Actif le ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
}

onMounted(() => {
  loadMyDiscussions()
})
</script>

<style scoped>
.fr-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
