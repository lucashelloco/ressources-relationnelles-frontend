<template>
  <!-- ── Barre du haut ─────────────────────────── -->
  <nav style="background:#fff;border-bottom:4px solid #000091;position:sticky;top:0;z-index:40;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div class="container-app">
      <div style="display:flex;align-items:center;height:60px;gap:1rem;">

        <!-- Logo -->
        <RouterLink to="/" style="display:flex;align-items:center;gap:.625rem;text-decoration:none;flex-shrink:0;">
          <div style="width:40px;height:40px;background:#000091;border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,145,.3);">
            <span style="color:#fff;font-weight:800;font-size:.875rem;">RE</span>
          </div>
          <span style="color:#000091;font-weight:700;font-size:.85rem;letter-spacing:-.2px;line-height:1.2;" class="hidden sm:block">
            (RE)SOURCES<br><span style="font-size:.7rem;font-weight:500;color:#4A4A4A;">RELATIONNELLES</span>
          </span>
        </RouterLink>

        <!-- Nav desktop -->
        <div class="hidden md:flex flex-1 items-center gap-1 ml-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="isActive(link.to) ? 'nav-link-active' : 'nav-link'"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Actions droite -->
        <div style="margin-left:auto;display:flex;align-items:center;gap:.375rem;">

          <!-- === Connecté === -->
          <template v-if="authStore.isAuthenticated">

            <!-- Notifications -->
            <div style="position:relative;">
              <button
                @click="showNotifs = !showNotifs"
                style="position:relative;padding:.5rem;border-radius:4px;background:transparent;border:1px solid transparent;cursor:pointer;color:#4A4A4A;display:flex;align-items:center;transition:all .15s;"
                @mouseover="e=>{ e.currentTarget.style.borderColor='#DDDDDD'; e.currentTarget.style.background='#F5F5F5'; }"
                @mouseleave="e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }"
              >
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span v-if="notifStore.hasUnread" style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:#E1000F;border-radius:50%;border:2px solid #fff;"></span>
              </button>

              <!-- Dropdown notifs -->
              <div
                v-if="showNotifs"
                v-click-outside="() => showNotifs = false"
                style="position:absolute;right:0;top:calc(100% + 8px);width:300px;background:#fff;border:1px solid #DDDDDD;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:50;overflow:hidden;"
              >
                <div style="padding:.625rem 1rem;border-bottom:1px solid #DDDDDD;display:flex;justify-content:space-between;align-items:center;background:#F5F5F5;">
                  <span style="color:#000091;font-weight:700;font-size:.8rem;">Notifications</span>
                  <button v-if="notifStore.unreadCount > 0" @click="notifStore.markAllAsRead()" style="background:none;border:none;color:#000091;cursor:pointer;font-size:.7rem;padding:0;text-decoration:underline;">Tout lire</button>
                </div>
                <div style="max-height:280px;overflow-y:auto;">
                  <div v-if="notifStore.loading" style="padding:1.5rem;text-align:center;">
                    <div class="spinner" style="width:1.25rem;height:1.25rem;margin:0 auto;"></div>
                  </div>
                  <div v-else-if="!notifStore.notifications.length" style="padding:1.5rem;text-align:center;color:#666;font-size:.8rem;">Aucune notification</div>
                  <div v-else>
                    <div
                      v-for="n in notifStore.notifications"
                      :key="n.id"
                      @click="handleNotifClick(n)"
                      :style="n.est_lue ? '' : 'background:rgba(0,0,145,.04);'"
                      style="padding:.625rem 1rem;border-bottom:1px solid #F5F5F5;cursor:pointer;transition:background .15s;"
                      @mouseover="e=>e.currentTarget.style.background='#F5F5F5'"
                      @mouseleave="e=>e.currentTarget.style.background=n.est_lue?'':'rgba(0,0,145,.04)'"
                    >
                      <div style="display:flex;justify-content:space-between;gap:.5rem;">
                        <p style="margin:0;font-size:.8rem;color:#161616;line-height:1.4;">{{ n.message }}</p>
                        <button @click.stop="notifStore.deleteNotification(n.id)" style="background:none;border:none;color:#929292;cursor:pointer;padding:0;flex-shrink:0;font-size:.75rem;">✕</button>
                      </div>
                      <p style="margin:.2rem 0 0;font-size:.65rem;color:#666;">{{ formatTime(n.created_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avatar / menu -->
            <div style="position:relative;">
              <button
                @click="showUser = !showUser"
                style="display:flex;align-items:center;gap:.4rem;padding:.3rem .5rem;border-radius:4px;border:1px solid transparent;background:transparent;cursor:pointer;transition:all .15s;"
                @mouseover="e=>{ e.currentTarget.style.borderColor='#DDDDDD'; e.currentTarget.style.background='#F5F5F5'; }"
                @mouseleave="e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }"
              >
                <div style="width:32px;height:32px;background:rgba(0,0,145,.1);border:2px solid #000091;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <span style="color:#000091;font-weight:700;font-size:.65rem;">{{ initials }}</span>
                </div>
                <svg class="hidden md:block" style="width:12px;height:12px;color:#666;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown user -->
              <div
                v-if="showUser"
                v-click-outside="() => showUser = false"
                style="position:absolute;right:0;top:calc(100% + 8px);width:220px;background:#fff;border:1px solid #DDDDDD;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:50;overflow:hidden;"
              >
                <div style="padding:.625rem .875rem;border-bottom:1px solid #DDDDDD;background:#F5F5F5;">
                  <p style="margin:0;color:#000091;font-weight:700;font-size:.8rem;">{{ authStore.user?.prenom }} {{ authStore.user?.nom }}</p>
                  <p style="margin:.125rem 0 0;color:#666;font-size:.7rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ authStore.user?.email }}</p>
                </div>
                <div style="padding:.375rem;">
                  <RouterLink to="/profil"          @click="showUser=false" class="dropdown-item">Mon profil</RouterLink>
                  <RouterLink to="/mes-ressources"   @click="showUser=false" class="dropdown-item">Mes ressources</RouterLink>
                  <RouterLink to="/mes-favoris"      @click="showUser=false" class="dropdown-item">Mes favoris</RouterLink>
                  <RouterLink to="/mes-activites"    @click="showUser=false" class="dropdown-item">Mes activités</RouterLink>
                  <RouterLink to="/mes-discussions"  @click="showUser=false" class="dropdown-item">Discussions</RouterLink>
                  <template v-if="authStore.isAdmin">
                    <div style="height:1px;background:#DDDDDD;margin:.375rem 0;"></div>
                    <RouterLink to="/admin" @click="showUser=false" class="dropdown-item" style="color:#000091;font-weight:700;">Administration</RouterLink>
                  </template>
                  <div style="height:1px;background:#DDDDDD;margin:.375rem 0;"></div>
                  <button @click="handleLogout" class="dropdown-item" style="color:#E1000F;background:none;border:none;">Déconnexion</button>
                </div>
              </div>
            </div>

          </template>

          <!-- === Visiteur === -->
          <template v-else>
            <RouterLink to="/login" class="hidden md:block nav-link" style="padding:.4rem .75rem;">Connexion</RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm">S'inscrire</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <!-- ── Bottom Navigation (mobile uniquement) ─── -->
  <nav
    class="md:hidden"
    style="position:fixed;bottom:0;left:0;right:0;z-index:40;background:#fff;border-top:3px solid #000091;box-shadow:0 -2px 8px rgba(0,0,0,.08);"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }"
  >
    <div style="display:flex;align-items:stretch;height:56px;">

      <RouterLink to="/" class="bottom-nav-item" :class="{ active: route.path === '/' }">
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>Accueil</span>
      </RouterLink>

      <RouterLink to="/ressources" class="bottom-nav-item" :class="{ active: route.path.startsWith('/ressources') }">
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <span>Ressources</span>
      </RouterLink>

      <RouterLink to="/activites" class="bottom-nav-item" :class="{ active: route.path.startsWith('/activites') }">
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span>Activités</span>
      </RouterLink>

      <RouterLink
        v-if="authStore.isAuthenticated"
        to="/profil"
        class="bottom-nav-item"
        :class="{ active: route.path.startsWith('/profil') || route.path.startsWith('/mes-') }"
      >
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span>Mon espace</span>
      </RouterLink>

      <RouterLink v-else to="/login" class="bottom-nav-item" :class="{ active: route.path === '/login' }">
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
        </svg>
        <span>Connexion</span>
      </RouterLink>

    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const route  = useRoute()
const authStore = useAuthStore()
const notifStore = useNotificationStore()

const showNotifs = ref(false)
const showUser   = ref(false)

const navLinks = computed(() => {
  const links = [
    { to: '/ressources', label: 'Ressources' },
    { to: '/activites',  label: 'Activités'  },
  ]
  if (authStore.isAuthenticated) {
    links.push({ to: '/mes-discussions', label: 'Discussions' })
  }
  return links
})

const initials = computed(() => {
  return ((authStore.user?.prenom?.[0] ?? '') + (authStore.user?.nom?.[0] ?? '')).toUpperCase()
})

const isActive = (path) => route.path.startsWith(path)

watch(showNotifs, (v) => {
  if (v && authStore.isAuthenticated) notifStore.fetchNotifications()
})

watch(() => route.path, () => {
  showUser.value   = false
  showNotifs.value = false
})

const handleLogout = async () => {
  showUser.value = false
  await authStore.logout()
  notifStore.reset()
  router.push('/')
}

const handleNotifClick = async (n) => {
  if (!n.est_lue) await notifStore.markAsRead(n.id)
  showNotifs.value = false
  if (n.action_url) router.push(n.action_url)
}

const formatTime = (ts) => {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60)    return 'À l\'instant'
  if (diff < 3600)  return `${Math.floor(diff/60)} min`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    notifStore.fetchNotifications()
    setInterval(() => {
      if (authStore.isAuthenticated) notifStore.fetchUnreadCount()
    }, 30000)
  }
})

const vClickOutside = {
  mounted(el, binding) {
    el.handler = (e) => {
      if (!el.contains(e.target) && !el.previousElementSibling?.contains(e.target)) {
        binding.value()
      }
    }
    setTimeout(() => document.addEventListener('click', el.handler), 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el.handler)
  }
}
</script>

<style scoped>
.nav-link {
  padding: .4rem .75rem; border-radius: 4px; font-size: .875rem; font-weight: 500;
  color: #4A4A4A; text-decoration: none; transition: all .15s; display: block;
  border-bottom: 2px solid transparent;
}
.nav-link:hover { color: #000091; background: rgba(0,0,145,.05); }
.nav-link-active {
  padding: .4rem .75rem; border-radius: 4px; font-size: .875rem; font-weight: 700;
  color: #000091; text-decoration: none; display: block;
  border-bottom: 2px solid #000091;
}
</style>
