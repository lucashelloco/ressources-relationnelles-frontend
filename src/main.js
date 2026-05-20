import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './assets/dsfr-styles.css'

// Enregistre le Service Worker et recharge silencieusement en cas de mise à jour
registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
