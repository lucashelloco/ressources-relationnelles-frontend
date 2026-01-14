<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold mb-6">
          (RE)SOURCES RELATIONNELLES
        </h1>
        <p class="text-xl mb-8 text-primary-50">
          Améliorez vos relations grâce à des ressources et des activités dédiées
        </p>
        <div class="flex justify-center space-x-4">
          <RouterLink to="/ressources" class="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Explorer les ressources
          </RouterLink>
          <RouterLink to="/activites" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
            Voir les activités
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Types de relations -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Types de relations</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="type in typesRelations" 
            :key="type.id"
            class="card text-center hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToRessources(type.value)"
          >
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ type.label }}</h3>
            <p class="text-gray-600">{{ type.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ressources récentes -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Ressources récentes</h2>
          <RouterLink to="/ressources" class="text-primary-600 hover:text-primary-700 font-semibold">
            Voir tout →
          </RouterLink>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RessourceCard 
            v-for="ressource in recentRessources" 
            :key="ressource.id"
            :ressource="ressource"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-600 text-white py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Prêt à améliorer vos relations ?</h2>
        <p class="text-xl mb-8 text-primary-50">
          Rejoignez notre communauté et accédez à des centaines de ressources
        </p>
        <RouterLink 
          v-if="!authStore.isAuthenticated"
          to="/register" 
          class="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-block"
        >
          Créer un compte gratuitement
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useRessourceStore } from '@/stores/ressourceStore'
import RessourceCard from '@/components/ressources/RessourceCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const ressourceStore = useRessourceStore()

const loading = ref(false)
const recentRessources = ref([])

const typesRelations = [
  {
    id: 1,
    value: 'familiale',
    label: 'Relations familiales',
    description: 'Parents, enfants, fratrie...'
  },
  {
    id: 2,
    value: 'amicale',
    label: 'Relations amicales',
    description: 'Amitiés, camaraderie...'
  },
  {
    id: 3,
    value: 'amoureuse',
    label: 'Relations amoureuses',
    description: 'Couple, intimité...'
  },
  {
    id: 4,
    value: 'professionnelle',
    label: 'Relations professionnelles',
    description: 'Collègues, hiérarchie...'
  },
  {
    id: 5,
    value: 'therapeutique',
    label: 'Relations thérapeutiques',
    description: 'Accompagnement, soin...'
  },
  {
    id: 6,
    value: 'autre',
    label: 'Autres relations',
    description: 'Toutes les autres formes'
  }
]

const goToRessources = (typeRelation) => {
  router.push({ name: 'ressources', query: { type_relation: typeRelation } })
}

onMounted(async () => {
  loading.value = true
  try {
    await ressourceStore.fetchRessources({ per_page: 6, order_by: 'date_publication', order: 'desc' })
    recentRessources.value = ressourceStore.ressources.slice(0, 6)
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
  } finally {
    loading.value = false
  }
})
</script>
