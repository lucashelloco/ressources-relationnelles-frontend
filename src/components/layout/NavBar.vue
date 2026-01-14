<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">RR</span>
            </div>
            <span class="text-xl font-bold text-gray-900 hidden sm:block">
              (RE)SOURCES RELATIONNELLES
            </span>
          </RouterLink>
        </div>

        <!-- Navigation principale -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink 
            to="/ressources" 
            class="text-gray-600 hover:text-primary-600 transition-colors"
            active-class="text-primary-600 font-semibold"
          >
            Ressources
          </RouterLink>
          <RouterLink 
            to="/activites" 
            class="text-gray-600 hover:text-primary-600 transition-colors"
            active-class="text-primary-600 font-semibold"
          >
            Activités
          </RouterLink>
        </div>

        <!-- Menu utilisateur -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Menu dropdown -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              >
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-700 font-semibold text-sm">
                    {{ authStore.user?.prenom?.[0] }}{{ authStore.user?.nom?.[0] }}
                  </span>
                </div>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div 
                v-if="showUserMenu"
                v-click-outside="() => showUserMenu = false"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
              >
                <RouterLink 
                  to="/profil" 
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Mon profil
                </RouterLink>
                <RouterLink 
                  to="/mes-ressources" 
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Mes ressources
                </RouterLink>
                <RouterLink 
                  to="/mes-favoris" 
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Mes favoris
                </RouterLink>
                <RouterLink 
                  to="/mes-activites" 
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Mes activités
                </RouterLink>
                <div v-if="authStore.isAdmin" class="border-t my-1"></div>
                <RouterLink 
                  v-if="authStore.isAdmin"
                  to="/admin" 
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Administration
                </RouterLink>
                <div class="border-t my-1"></div>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <RouterLink 
              to="/login" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Connexion
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="btn-primary"
            >
              S'inscrire
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/')
}

// Directive personnalisée pour fermer le menu en cliquant à l'extérieur
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      // Ne pas fermer si on clique sur le bouton qui ouvre le menu
      const toggleButton = el.previousElementSibling
      if (toggleButton && (toggleButton === event.target || toggleButton.contains(event.target))) {
        return
      }
      // Fermer si on clique à l'extérieur du menu
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    // Ajouter un délai pour éviter le conflit avec le @click du bouton
    setTimeout(() => {
      document.body.addEventListener('click', el.clickOutsideEvent)
    }, 0)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>
