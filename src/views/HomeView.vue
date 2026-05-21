<template>
  <div>
    <!-- ── Hero ─────────────────────────────────── -->
    <section style="background:#000091;padding:4rem 0 3rem;position:relative;overflow:hidden;">
      <!-- Halo décoratif -->
      <div style="position:absolute;top:-80px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(255,255,255,.06) 0%,transparent 70%);pointer-events:none;"></div>
      <div style="position:absolute;bottom:-60px;left:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(225,0,15,.08) 0%,transparent 70%);pointer-events:none;"></div>

      <div class="container-app" style="position:relative;text-align:center;">
        <div style="display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:9999px;padding:.3rem .875rem;margin-bottom:1.5rem;">
          <div style="width:6px;height:6px;background:#00A95F;border-radius:50%;animation:pulse 2s infinite;"></div>
          <span style="font-size:.75rem;color:rgba(255,255,255,.9);font-weight:500;">Plateforme disponible en PWA</span>
        </div>

        <h1 style="font-size:clamp(1.75rem,5vw,3rem);font-weight:800;color:#FFFFFF;line-height:1.2;margin-bottom:1.25rem;">
          (RE)SOURCES<br>
          <span style="color:rgba(255,255,255,.85);font-weight:400;">RELATIONNELLES</span>
        </h1>
        <p style="font-size:clamp(.9rem,2.5vw,1.15rem);color:rgba(255,255,255,.75);margin-bottom:2rem;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.7;">
          Améliorez vos relations grâce à des ressources expertes et une communauté bienveillante
        </p>

        <div v-if="!authStore.isAuthenticated" style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <RouterLink to="/register" style="display:inline-flex;align-items:center;padding:.7rem 1.5rem;background:#E1000F;color:#fff;border-radius:4px;font-weight:600;font-size:.9rem;text-decoration:none;transition:background .2s;" @mouseover="e=>e.currentTarget.style.background='#C9000D'" @mouseleave="e=>e.currentTarget.style.background='#E1000F'">
            Créer un compte gratuit
          </RouterLink>
          <RouterLink to="/ressources" style="display:inline-flex;align-items:center;padding:.7rem 1.5rem;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.6);border-radius:4px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .2s;" @mouseover="e=>e.currentTarget.style.borderColor='#fff'" @mouseleave="e=>e.currentTarget.style.borderColor='rgba(255,255,255,.6)'">
            Explorer les ressources
          </RouterLink>
        </div>
        <div v-else style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <RouterLink to="/ressources" style="display:inline-flex;align-items:center;padding:.7rem 1.5rem;background:#E1000F;color:#fff;border-radius:4px;font-weight:600;font-size:.9rem;text-decoration:none;transition:background .2s;" @mouseover="e=>e.currentTarget.style.background='#C9000D'" @mouseleave="e=>e.currentTarget.style.background='#E1000F'">
            Parcourir les ressources
          </RouterLink>
          <RouterLink to="/activites" style="display:inline-flex;align-items:center;padding:.7rem 1.5rem;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.6);border-radius:4px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .2s;" @mouseover="e=>e.currentTarget.style.borderColor='#fff'" @mouseleave="e=>e.currentTarget.style.borderColor='rgba(255,255,255,.6)'">
            Voir les activités
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Stats ─────────────────────────────────── -->
    <section style="background:#F5F5F5;border-top:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;padding:2rem 0;">
      <div class="container-app">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;" class="md:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" style="text-align:center;padding:1rem;">
            <div style="font-size:2rem;font-weight:800;color:#000091;line-height:1;">
              {{ stat.value }}+
            </div>
            <div style="font-size:.8rem;color:#666666;margin-top:.375rem;">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Catégories ───────────────────────────── -->
    <section style="padding:3rem 0;background:#FFFFFF;">
      <div class="container-app">
        <div style="text-align:center;margin-bottom:2.5rem;">
          <h2 style="font-size:1.5rem;font-weight:700;color:#161616;margin-bottom:.5rem;">Explorez par thématique</h2>
          <p style="color:#666666;font-size:.875rem;">Des ressources organisées pour chaque besoin</p>
        </div>

        <div v-if="categorieStore.loading" style="display:flex;justify-content:center;padding:3rem;">
          <div class="fr-spinner"></div>
        </div>

        <div v-else-if="categorieStore.categories.length" style="display:grid;grid-template-columns:repeat(2,1fr);gap:.875rem;" class="sm:grid-cols-3 lg:grid-cols-4">
          <button
            v-for="cat in categorieStore.categories.slice(0,8)"
            :key="cat.id"
            @click="naviguerCategorie(cat.slug)"
            style="background:#F5F5F5;border:1px solid #DDDDDD;border-radius:4px;padding:1.25rem 1rem;cursor:pointer;text-align:center;transition:all .2s;"
            @mouseover="e=>{ e.currentTarget.style.borderColor='#000091'; e.currentTarget.style.background='rgba(0,0,145,.05)'; }"
            @mouseleave="e=>{ e.currentTarget.style.borderColor='#DDDDDD'; e.currentTarget.style.background='#F5F5F5'; }"
          >
            <div v-if="cat.icone" style="font-size:1.75rem;margin-bottom:.5rem;">{{ cat.icone }}</div>
            <div style="font-size:.8rem;font-weight:600;color:#161616;">{{ cat.nom }}</div>
            <div v-if="cat.nb_ressources !== undefined" style="font-size:.7rem;color:#666666;margin-top:.25rem;">{{ cat.nb_ressources }} ressources</div>
          </button>
        </div>

        <div v-else style="text-align:center;padding:3rem;color:#666666;font-size:.875rem;">
          Aucune catégorie disponible.
        </div>
      </div>
    </section>

    <!-- ── Ressources récentes ─────────────────── -->
    <section style="padding:0 0 3rem;background:#FFFFFF;">
      <div class="container-app">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem;flex-wrap:wrap;gap:.75rem;">
          <h2 style="font-size:1.5rem;font-weight:700;color:#161616;margin:0;">Ressources récentes</h2>
          <RouterLink to="/ressources" style="font-size:.8rem;color:#000091;text-decoration:none;display:flex;align-items:center;gap:.25rem;" @mouseover="e=>e.currentTarget.style.color='#1212FF'" @mouseleave="e=>e.currentTarget.style.color='#000091'">
            Voir tout
            <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>

        <div v-if="loadingRessources" style="display:flex;justify-content:center;padding:3rem;">
          <div class="fr-spinner"></div>
        </div>

        <div v-else-if="ressourcesRecentes.length" style="display:grid;grid-template-columns:1fr;gap:1rem;" class="sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="r in ressourcesRecentes"
            :key="r.id"
            :to="`/ressources/${r.id}`"
            style="background:#FFFFFF;border:1px solid #DDDDDD;border-radius:4px;overflow:hidden;text-decoration:none;transition:all .2s;display:block;"
            @mouseover="e=>{ e.currentTarget.style.borderColor='#000091'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,145,.1)'; }"
            @mouseleave="e=>{ e.currentTarget.style.borderColor='#DDDDDD'; e.currentTarget.style.boxShadow='none'; }"
          >
            <div v-if="r.url_image_couverture" style="height:10rem;overflow:hidden;">
              <img :src="r.url_image_couverture" :alt="r.titre" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div v-else style="height:7rem;background:linear-gradient(135deg,rgba(0,0,145,.08),rgba(0,0,145,.04));display:flex;align-items:center;justify-content:center;">
              <svg style="width:2rem;height:2rem;color:#000091;opacity:.35;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div style="padding:1rem;">
              <div style="display:flex;gap:.375rem;flex-wrap:wrap;margin-bottom:.625rem;">
                <span style="display:inline-flex;align-items:center;padding:.2rem .5rem;background:#E3E8F7;color:#000091;border-radius:3px;font-size:.7rem;font-weight:500;">{{ formatType(r.type_ressource) }}</span>
                <span style="display:inline-flex;align-items:center;padding:.2rem .5rem;background:#C3FAE8;color:#009081;border-radius:3px;font-size:.7rem;font-weight:500;">{{ formatNiveau(r.niveau) }}</span>
              </div>
              <h3 style="font-size:.9rem;font-weight:600;color:#161616;margin:0 0 .375rem;line-height:1.4;">{{ r.titre }}</h3>
              <p style="font-size:.8rem;color:#666666;margin:0;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{ r.description }}</p>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.75rem;padding-top:.75rem;border-top:1px solid #EEEEEE;">
                <span style="font-size:.7rem;color:#666666;">{{ r.duree_estimee }} min</span>
                <span style="font-size:.7rem;color:#666666;">{{ r.nb_vues || 0 }} vues</span>
              </div>
            </div>
          </RouterLink>
        </div>

        <div v-else style="text-align:center;padding:3rem;color:#666666;font-size:.875rem;">
          Aucune ressource disponible pour le moment.
        </div>
      </div>
    </section>

    <!-- ── CTA ─────────────────────────────────── -->
    <section v-if="!authStore.isAuthenticated" style="background:#F5F5F5;border-top:4px solid #000091;padding:3rem 0;text-align:center;">
      <div class="container-app" style="max-width:600px;">
        <h2 style="font-size:1.5rem;font-weight:700;color:#161616;margin-bottom:.75rem;">Rejoignez la communauté</h2>
        <p style="color:#666666;font-size:.9rem;margin-bottom:1.75rem;line-height:1.6;">
          Accédez à des centaines de ressources, participez à des activités et échangez avec la communauté.
        </p>
        <RouterLink to="/register" style="display:inline-flex;align-items:center;padding:.7rem 2rem;background:#000091;color:#fff;border-radius:4px;font-weight:600;font-size:.9rem;text-decoration:none;transition:background .2s;" @mouseover="e=>e.currentTarget.style.background='#1212FF'" @mouseleave="e=>e.currentTarget.style.background='#000091'">
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
import { useCategorieStore } from '@/stores/categorieStore'
import { useRessourceStore } from '@/stores/ressourceStore'
import { formatType, formatNiveau } from '@/utils/formatters'
import statsService from '@/services/statsService'

const router = useRouter()
const authStore = useAuthStore()
const categorieStore = useCategorieStore()
const ressourceStore = useRessourceStore()

const loadingRessources = ref(true)
const ressourcesRecentes = ref([])

const stats = ref([
  { label: 'Ressources',  value: 0 },
  { label: 'Membres',     value: 0 },
  { label: 'Activités',   value: 0 },
  { label: 'Échanges',    value: 0 },
])

const naviguerCategorie = (slug) => router.push(`/ressources?categorie=${slug}`)

const animateCount = (target, index) => {
  const steps = 40
  const increment = target / steps
  let current = 0
  const timer = setInterval(() => {
    current = Math.min(current + increment, target)
    stats.value[index].value = Math.floor(current)
    if (current >= target) clearInterval(timer)
  }, 40)
}

onMounted(async () => {
  try {
    await categorieStore.fetchCategories()

    loadingRessources.value = true
    await ressourceStore.fetchRessources({ per_page: 6, order_by: 'date_publication', order: 'desc' })
    ressourcesRecentes.value = ressourceStore.ressources.slice(0, 6)
  } catch (e) {
    console.error(e)
  } finally {
    loadingRessources.value = false
  }

  try {
    const data = await statsService.getStats()
    const keys = ['ressources', 'utilisateurs', 'activites', 'commentaires']
    keys.forEach((k, i) => {
      if (data.data?.[k] !== undefined) animateCount(data.data[k], i)
    })
  } catch (e) { /* silencieux */ }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .4; }
}

@media (min-width:768px) {
  .md\:grid-cols-4 { grid-template-columns: repeat(4,1fr) !important; }
}
@media (min-width:640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2,1fr) !important; }
  .sm\:grid-cols-3 { grid-template-columns: repeat(3,1fr) !important; }
}
@media (min-width:1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3,1fr) !important; }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4,1fr) !important; }
}
</style>
