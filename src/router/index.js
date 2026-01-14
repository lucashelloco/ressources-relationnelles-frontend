import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/ressources',
      name: 'ressources',
      component: () => import('@/views/ressources/RessourcesListView.vue')
    },
    {
      path: '/ressources/:id',
      name: 'ressource-detail',
      component: () => import('@/views/ressources/RessourceDetailView.vue')
    },
    {
      path: '/ressources/create',
      name: 'ressource-create',
      component: () => import('@/views/ressources/RessourceFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ressources/:id/edit',
      name: 'ressource-edit',
      component: () => import('@/views/ressources/RessourceFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activites',
      name: 'activites',
      component: () => import('@/views/activites/ActivitesListView.vue')
    },
    {
      path: '/activites/:id',
      name: 'activite-detail',
      component: () => import('@/views/activites/ActiviteDetailView.vue')
    },
    {
      path: '/activites/create',
      name: 'activite-create',
      component: () => import('@/views/activites/ActiviteFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('@/views/user/ProfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-ressources',
      name: 'mes-ressources',
      component: () => import('@/views/user/MesRessourcesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-favoris',
      name: 'mes-favoris',
      component: () => import('@/views/user/MesFavorisView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-activites',
      name: 'mes-activites',
      component: () => import('@/views/user/MesActivitesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Routes nécessitant l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // Routes réservées aux visiteurs (login, register)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }
  
  // Routes réservées aux administrateurs
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router
