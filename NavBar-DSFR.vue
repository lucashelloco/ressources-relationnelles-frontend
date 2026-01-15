<template>
  <nav class="bg-white border-b-4 border-bleu-france sticky top-0 z-50 shadow-sm">
    <div class="container-dsfr">
      <div class="flex justify-between items-center h-20">
        <!-- Logo DSFR -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center space-x-3 no-underline">
            <div class="w-14 h-14 bg-bleu-france rounded-lg flex items-center justify-center shadow-md">
              <span class="text-white font-bold text-2xl font-marianne">RE</span>
            </div>
            <span class="text-xl font-bold text-bleu-france font-marianne hidden sm:block">
              (RE)SOURCES RELATIONNELLES
            </span>
          </RouterLink>
        </div>

        <!-- Navigation principale -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink 
            to="/ressources" 
            class="nav-link"
            active-class="nav-link-active"
          >
            Ressources
          </RouterLink>
          <RouterLink 
            to="/activites" 
            class="nav-link"
            active-class="nav-link-active"
          >
            Activités
          </RouterLink>
        </div>

        <!-- Menu utilisateur -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <!-- Notifications -->
            <button 
              @click="showNotifications = !showNotifications"
              class="relative p-2 text-gris-neutre hover:text-bleu-france transition-colors rounded-dsfr hover:bg-gris-bg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="hasNotifications" class="absolute top-1 right-1 w-2.5 h-2.5 bg-rouge-marianne rounded-full"></span>
            </button>

            <!-- Dropdown notifications -->
            <div 
              v-if="showNotifications"
              v-click-outside="() => showNotifications = false"
              class="absolute right-0 mt-2 w-80 bg-white rounded-dsfr shadow-lg border border-gris-clair py-2 z-50"
              style="top: 4.5rem;"
            >
              <div class="px-4 py-2 border-b border-gris-clair">
                <h3 class="text-sm font-semibold text-bleu-france">Notifications</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div class="px-4 py-3 text-sm text-gris-neutre text-center">
                  Aucune notification
                </div>
              </div>
            </div>

            <!-- Menu dropdown utilisateur -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gris-fonce hover:text-bleu-france transition-colors rounded-dsfr hover:bg-gris-bg p-2"
              >
                <div class="w-10 h-10 bg-bleu-france bg-opacity-10 rounded-full flex items-center justify-center border-2 border-bleu-france">
                  <span class="text-bleu-france font-semibold text-sm font-marianne">
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
                class="absolute right-0 mt-2 w-56 bg-white rounded-dsfr shadow-lg border border-gris-clair py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-gris-clair">
                  <p class="text-sm font-semibold text-bleu-france">{{ authStore.user?.prenom }} {{ authStore.user?.nom }}</p>
                  <p class="text-xs text-gris-neutre">{{ authStore.user?.email }}</p>
                </div>
                
                <RouterLink 
                  to="/profil" 
                  class="block px-4 py-2 text-sm text-gris-fonce hover:bg-gris-bg no-underline"
                  @click="showUserMenu = false"
                >
                  👤 Mon profil
                </RouterLink>
                <RouterLink 
                  to="/user/mes-ressources" 
                  class="block px-4 py-2 text-sm text-gris-fonce hover:bg-gris-bg no-underline"
                  @click="showUserMenu = false"
                >
                  📚 Mes ressources
                </RouterLink>
                <RouterLink 
                  to="/user/mes-favoris" 
                  class="block px-4 py-2 text-sm text-gris-fonce hover:bg-gris-bg no-underline"
                  @click="showUserMenu = false"
                >
                  ❤️ Mes favoris
                </RouterLink>
                <RouterLink 
                  to="/user/mes-activites" 
                  class="block px-4 py-2 text-sm text-gris-fonce hover:bg-gris-bg no-underline"
                  @click="showUserMenu = false"
                >
                  📅 Mes activités
                </RouterLink>
                
                <div v-if="authStore.isAdmin" class="border-t border-gris-clair my-1"></div>
                <RouterLink 
                  v-if="authStore.isAdmin"
                  to="/admin" 
                  class="block px-4 py-2 text-sm text-gris-fonce hover:bg-gris-bg no-underline"
                  @click="showUserMenu = false"
                >
                  ⚙️ Administration
                </RouterLink>
                
                <div class="border-t border-gris-clair my-1"></div>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-rouge-marianne hover:bg-gris-bg"
                >
                  🚪 Déconnexion
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <RouterLink 
              to="/login" 
              class="nav-link"
            >
              Connexion
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="btn btn-primary text-sm"
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
const showNotifications = ref(false)
const hasNotifications = ref(false) // TODO: lier avec l'API

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/')
}

// Directive personnalisée pour fermer le menu en cliquant à l'extérieur
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      const toggleButton = el.previousElementSibling
      if (toggleButton && (toggleButton === event.target || toggleButton.contains(event.target))) {
        return
      }
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    setTimeout(() => {
      document.body.addEventListener('click', el.clickOutsideEvent)
    }, 0)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>
