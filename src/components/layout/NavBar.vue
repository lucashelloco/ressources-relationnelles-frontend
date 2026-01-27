<template>
  <nav class="bg-white border-b-4 border-bleu-france sticky top-0 z-50 shadow-sm">
    <div class="container-dsfr">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo DSFR -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center space-x-2 md:space-x-3 no-underline">
            <div class="w-10 h-10 md:w-14 md:h-14 bg-bleu-france rounded-lg flex items-center justify-center shadow-md">
              <span class="text-white font-bold text-lg md:text-2xl font-marianne">RE</span>
            </div>
            <span class="text-sm md:text-xl font-bold text-bleu-france font-marianne hidden sm:block">
              (RE)SOURCES RELATIONNELLES
            </span>
          </RouterLink>
        </div>

        <!-- Navigation desktop -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            to="/ressources"
            class="text-gris-neutre hover:text-bleu-france transition-colors font-medium no-underline py-2"
            :class="{ 'text-bleu-france font-semibold border-b-2 border-bleu-france': $route.path.startsWith('/ressources') }"
          >
            Ressources
          </RouterLink>
          <RouterLink
            to="/activites"
            class="text-gris-neutre hover:text-bleu-france transition-colors font-medium no-underline py-2"
            :class="{ 'text-bleu-france font-semibold border-b-2 border-bleu-france': $route.path.startsWith('/activites') }"
          >
            Activités
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/mes-discussions"
            class="text-gris-neutre hover:text-bleu-france transition-colors font-medium no-underline py-2"
            :class="{ 'text-bleu-france font-semibold border-b-2 border-bleu-france': $route.path.startsWith('/mes-discussions') }"
          >
            Mes discussions
          </RouterLink>
        </div>

        <!-- Menu utilisateur desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 text-gris-neutre hover:text-bleu-france transition-colors rounded-dsfr hover:bg-gris-bg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="hasNotifications" class="absolute top-1 right-1 w-2.5 h-2.5 bg-rouge-marianne rounded-full"></span>
              </button>

              <!-- Notifications dropdown -->
              <div
                v-if="showNotifications"
                v-click-outside="() => showNotifications = false"
                class="absolute right-0 mt-2 w-96 bg-white rounded-dsfr shadow-lg border border-gris-clair z-50"
              >
                <div class="px-4 py-3 border-b border-gris-clair" style="display: flex; justify-content: space-between; align-items: center;">
                  <p class="text-sm font-semibold text-bleu-france" style="margin: 0;">
                    Notifications
                    <span v-if="notificationStore.unreadCount > 0" class="fr-badge fr-badge--sm" style="margin-left: 0.5rem;">
                      {{ notificationStore.unreadCount }}
                    </span>
                  </p>
                  <button
                    v-if="notificationStore.notifications.length > 0"
                    @click="notificationStore.markAllAsRead()"
                    class="text-xs text-bleu-france hover:underline"
                    style="background: none; border: none; cursor: pointer;"
                  >
                    Tout marquer comme lu
                  </button>
                </div>

                <div class="max-h-96 overflow-y-auto">
                  <div v-if="notificationStore.loading" class="px-4 py-8 text-center">
                    <div class="fr-spinner" style="width: 2rem; height: 2rem; margin: 0 auto;"></div>
                  </div>

                  <div v-else-if="notificationStore.notifications.length === 0" class="px-4 py-8 text-center text-gris-neutre">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p class="text-sm">Aucune notification</p>
                  </div>

                  <div v-else>
                    <div
                      v-for="notification in notificationStore.notifications"
                      :key="notification.id"
                      class="px-4 py-3 border-b border-gris-clair hover:bg-gris-bg cursor-pointer"
                      :class="{ 'bg-blue-50': !notification.est_lue }"
                      @click="handleNotificationClick(notification)"
                    >
                      <div style="display: flex; justify-content: space-between; gap: 0.5rem;">
                        <div style="flex: 1;">
                          <p class="text-sm font-medium" style="margin: 0 0 0.25rem 0;">{{ notification.message }}</p>
                          <p class="text-xs text-gris-neutre" style="margin: 0;">
                            {{ formatNotificationTime(notification.created_at) }}
                          </p>
                        </div>
                        <button
                          @click.stop="notificationStore.deleteNotification(notification.id)"
                          class="text-gris-neutre hover:text-rouge-marianne"
                          style="background: none; border: none; cursor: pointer; padding: 0; width: 20px; height: 20px;"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
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
                <RouterLink
                  to="/mes-discussions"
                  class="block px-4 py-2 text-sm text-gris-fonce hover:bg-gris-bg no-underline"
                  @click="showUserMenu = false"
                >
                  💬 Mes discussions
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
              class="text-gris-neutre hover:text-bleu-france transition-colors font-medium no-underline"
            >
              Connexion
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="btn btn-primary text-sm px-4 py-2"
            >
              S'inscrire
            </RouterLink>
          </template>
        </div>

        <!-- Bouton menu mobile -->
        <div class="flex md:hidden items-center space-x-2">
          <template v-if="authStore.isAuthenticated">
            <!-- Avatar mobile -->
            <button 
              @click="showMobileMenu = !showMobileMenu"
              class="w-10 h-10 bg-bleu-france bg-opacity-10 rounded-full flex items-center justify-center border-2 border-bleu-france"
            >
              <span class="text-bleu-france font-semibold text-sm font-marianne">
                {{ authStore.user?.prenom?.[0] }}{{ authStore.user?.nom?.[0] }}
              </span>
            </button>
          </template>
          
          <!-- Hamburger menu -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 text-gris-neutre hover:text-bleu-france transition-colors"
          >
            <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <div 
        v-if="showMobileMenu"
        class="md:hidden border-t border-gris-clair bg-white"
      >
        <div class="px-4 py-2 space-y-2">
          <RouterLink 
            to="/ressources" 
            class="block py-3 text-gris-neutre hover:text-bleu-france font-medium no-underline"
            :class="{ 'text-bleu-france font-semibold': $route.path.startsWith('/ressources') }"
            @click="showMobileMenu = false"
          >
            📚 Ressources
          </RouterLink>
          <RouterLink 
            to="/activites" 
            class="block py-3 text-gris-neutre hover:text-bleu-france font-medium no-underline"
            :class="{ 'text-bleu-france font-semibold': $route.path.startsWith('/activites') }"
            @click="showMobileMenu = false"
          >
            📅 Activités
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <div class="border-t border-gris-clair my-2 pt-2">
              <p class="text-xs text-gris-neutre mb-2 font-semibold">Mon compte</p>
              <RouterLink 
                to="/profil" 
                class="block py-2 text-gris-neutre hover:text-bleu-france no-underline"
                @click="showMobileMenu = false"
              >
                👤 Mon profil
              </RouterLink>
              <RouterLink 
                to="/user/mes-ressources" 
                class="block py-2 text-gris-neutre hover:text-bleu-france no-underline"
                @click="showMobileMenu = false"
              >
                📚 Mes ressources
              </RouterLink>
              <RouterLink 
                to="/user/mes-favoris" 
                class="block py-2 text-gris-neutre hover:text-bleu-france no-underline"
                @click="showMobileMenu = false"
              >
                ❤️ Mes favoris
              </RouterLink>
              <RouterLink
                to="/user/mes-activites"
                class="block py-2 text-gris-neutre hover:text-bleu-france no-underline"
                @click="showMobileMenu = false"
              >
                📅 Mes activités
              </RouterLink>
              <RouterLink
                to="/mes-discussions"
                class="block py-2 text-gris-neutre hover:text-bleu-france no-underline"
                @click="showMobileMenu = false"
              >
                💬 Mes discussions
              </RouterLink>
            </div>

            <div v-if="authStore.isAdmin" class="border-t border-gris-clair my-2 pt-2">
              <RouterLink 
                to="/admin" 
                class="block py-2 text-gris-neutre hover:text-bleu-france no-underline"
                @click="showMobileMenu = false"
              >
                ⚙️ Administration
              </RouterLink>
            </div>
            
            <div class="border-t border-gris-clair my-2 pt-2">
              <button 
                @click="handleLogout"
                class="block w-full text-left py-2 text-rouge-marianne font-medium"
              >
                🚪 Déconnexion
              </button>
            </div>
          </template>

          <template v-else>
            <div class="border-t border-gris-clair my-2 pt-2 space-y-2">
              <RouterLink 
                to="/login" 
                class="block py-2 text-gris-neutre hover:text-bleu-france font-medium no-underline"
                @click="showMobileMenu = false"
              >
                Connexion
              </RouterLink>
              <RouterLink 
                to="/register" 
                class="block btn btn-primary text-center"
                @click="showMobileMenu = false"
              >
                S'inscrire
              </RouterLink>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showMobileMenu = ref(false)

const hasNotifications = computed(() => notificationStore.hasUnread)

// Watch for notification dropdown opening to refetch notifications
watch(showNotifications, (newValue) => {
  if (newValue && authStore.isAuthenticated) {
    notificationStore.fetchNotifications()
  }
})

// Watch route changes to ensure user data is fresh
watch(() => route.path, () => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})

const handleLogout = async () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  await authStore.logout()
  notificationStore.reset()
  router.push('/')
}

const handleNotificationClick = async (notification) => {
  // Mark as read
  if (!notification.est_lue) {
    await notificationStore.markAsRead(notification.id)
  }

  // Close dropdown
  showNotifications.value = false

  // Navigate to action URL if provided
  if (notification.action_url) {
    router.push(notification.action_url)
  }
}

const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'À l\'instant'
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

// Load notifications on mount
onMounted(() => {
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications()

    // Poll for new notifications every 30 seconds
    setInterval(() => {
      if (authStore.isAuthenticated) {
        notificationStore.fetchUnreadCount()
      }
    }, 30000)
  }
})

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
