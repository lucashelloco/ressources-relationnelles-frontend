<template>
  <div id="app" style="min-height:100vh;display:flex;flex-direction:column;background:#fff;">
    <NavBar />
    <main class="flex-grow page-content">
      <RouterView />
    </main>
    <Footer />
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})
</script>
