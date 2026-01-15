<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-bleu-france to-bleu-ciel text-white py-12 md:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 font-marianne">
          (RE)SOURCES RELATIONNELLES
        </h1>
        <p class="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-white opacity-90 max-w-3xl mx-auto">
          Améliorez vos relations grâce à des ressources et des activités dédiées
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
          <RouterLink to="/ressources" class="btn btn-primary !bg-white !text-bleu-france hover:!bg-gris-bg text-base sm:text-lg w-full sm:w-auto">
            Explorer les ressources
          </RouterLink>
          <RouterLink to="/activites" class="btn !bg-transparent !text-white !border-2 !border-white hover:!bg-white hover:!text-bleu-france text-base sm:text-lg w-full sm:w-auto">
            Voir les activités
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Types de relations -->
    <section class="py-12 md:py-16 bg-gris-bg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-bleu-france font-marianne">
          Types de relations
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <div 
            v-for="type in typesRelations" 
            :key="type.id"
            class="card-dsfr text-center hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToRessources(type.value)"
          >
            <div class="w-12 h-12 md:w-16 md:h-16 bg-bleu-france bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 border-2 border-bleu-france">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-bleu-france" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-2 text-bleu-france">{{ type.label }}</h3>
            <p class="text-sm md:text-base text-gris-neutre">{{ type.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ressources récentes -->
    <section class="py-12 md:py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 sm:gap-0">
          <h2 class="text-2xl sm:text-3xl font-bold text-bleu-france font-marianne">
            Ressources récentes
          </h2>
          <RouterLink to="/ressources" class="text-bleu-france hover:text-bleu-ciel font-semibold no-underline text-sm sm:text-base">
            Voir tout →
          </RouterLink>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-bleu-france border-t-transparent"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <RessourceCard 
            v-for="ressource in recentRessources" 
            :key="ressource.id"
            :ressource="ressource"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-bleu-france text-white py-12 md:py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4 font-marianne">
          Prêt à améliorer vos relations ?
        </h2>
        <p class="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
          Rejoignez notre communauté et accédez à des centaines de ressources
        </p>
        <RouterLink 
          v-if="!authStore.isAuthenticated"
          to="/register" 
          class="btn !bg-white !text-bleu-france hover:!bg-gris-bg text-base md:text-lg inline-block w-full sm:w-auto max-w-xs sm:max-w-none"
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
