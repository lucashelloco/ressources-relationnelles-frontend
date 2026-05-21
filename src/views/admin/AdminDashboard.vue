<template>
  <div class="admin-layout">
    <!-- Sidebar desktop / tab bar mobile -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div style="width:32px;height:32px;background:#000091;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:#fff;font-weight:800;font-size:.75rem;">AD</span>
        </div>
        <span class="sidebar-title">Administration</span>
      </div>
      <nav class="sidebar-nav">
        <button v-for="tab in tabs" :key="tab.id"
          class="sidebar-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          <span class="sidebar-label">{{ tab.label }}</span>
          <span v-if="tab.badge" class="sidebar-badge">{{ tab.badge }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <!-- Header -->
      <div class="admin-header">
        <div>
          <h1 class="admin-title">{{ currentTab?.label }}</h1>
          <p class="admin-subtitle">{{ currentTab?.desc }}</p>
        </div>
        <div class="admin-user">
          <span class="role-badge" :class="authStore.isSuperAdmin ? 'super' : 'admin'">
            {{ authStore.isSuperAdmin ? 'Super Admin' : 'Admin' }}
          </span>
        </div>
      </div>

      <!-- ── TAB : STATS ─────────────────────────── -->
      <div v-if="activeTab === 'stats'" class="tab-content">
        <div v-if="loadingStats" class="loading-center"><div class="spinner"></div></div>
        <template v-else>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-body">
                <div class="stat-num">{{ stats.ressources?.total ?? 0 }}</div>
                <div class="stat-label">Ressources totales</div>
                <div class="stat-sub">
                  <span class="chip green">{{ stats.ressources?.publiees }} publiées</span>
                  <span class="chip amber">{{ stats.ressources?.en_attente }} brouillon</span>
                  <span class="chip gray">{{ stats.ressources?.archivees }} archivées</span>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-body">
                <div class="stat-num">{{ stats.utilisateurs?.total ?? 0 }}</div>
                <div class="stat-label">Utilisateurs</div>
                <div class="stat-sub">
                  <span class="chip green">{{ stats.utilisateurs?.actifs }} actifs</span>
                  <span class="chip red">{{ stats.utilisateurs?.inactifs }} inactifs</span>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-body">
                <div class="stat-num">{{ stats.activites?.total ?? 0 }}</div>
                <div class="stat-label">Activités</div>
                <div class="stat-sub">
                  <span class="chip blue">{{ stats.activites?.planifies }} planifiées</span>
                  <span class="chip green">{{ stats.activites?.en_cours }} en cours</span>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-body">
                <div class="stat-num">{{ stats.commentaires?.total ?? 0 }}</div>
                <div class="stat-label">Commentaires</div>
                <div class="stat-sub">
                  <span class="chip amber">{{ stats.commentaires?.en_attente }} en attente</span>
                  <span class="chip green">{{ stats.commentaires?.approuves }} approuvés</span>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-body">
                <div class="stat-num">{{ stats.categories ?? 0 }}</div>
                <div class="stat-label">Catégories</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-body">
                <div class="stat-num">{{ stats.tags ?? 0 }}</div>
                <div class="stat-label">Tags</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ── TAB : MODÉRATION ───────────────────── -->
      <div v-if="activeTab === 'moderation'" class="tab-content">
        <div v-if="loadingModeration" class="loading-center"><div class="spinner"></div></div>
        <div v-else-if="commentairesEnAttente.length === 0" class="empty-state">
          <p style="font-size:1.5rem;color:#CECECE;margin-bottom:.5rem;">—</p>
          <p>Aucun commentaire en attente</p>
        </div>
        <div v-else class="comment-list">
          <div v-for="c in commentairesEnAttente" :key="c.id" class="comment-card">
            <div class="comment-header">
              <div class="comment-meta">
                <strong>{{ c.auteur?.prenom }} {{ c.auteur?.nom }}</strong>
                <span class="meta-sep">·</span>
                <span class="comment-date">{{ formatDate(c.created_at) }}</span>
                <span v-if="c.parent_id" class="chip amber" style="margin-left:8px">Réponse</span>
              </div>
              <span class="status-badge pending">En attente</span>
            </div>
            <p class="comment-body">{{ c.contenu }}</p>
            <div class="comment-ressource">
              Ressource : <router-link :to="`/ressources/${c.ressource?.id}`">{{ c.ressource?.titre }}</router-link>
            </div>
            <div class="comment-actions">
              <button class="btn btn-danger-outline" @click="ouvrirModalRejet(c)">Rejeter</button>
              <button class="btn btn-success" @click="confirmerApprobation(c)">Approuver</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB : UTILISATEURS ─────────────────── -->
      <div v-if="activeTab === 'utilisateurs'" class="tab-content">
        <div class="toolbar">
          <input v-model="userSearch" class="search-input" placeholder="Rechercher par nom, email…" @input="debouncedLoadUsers"/>
          <select v-model="userRoleFilter" class="select-input" @change="loadUtilisateurs">
            <option value="">Tous les rôles</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.nom }}</option>
          </select>
        </div>
        <div v-if="loadingUsers" class="loading-center"><div class="spinner"></div></div>
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead><tr>
              <th>Utilisateur</th><th>Rôle</th><th>Ville</th><th>Inscrit le</th><th>Statut</th><th>Actions</th>
            </tr></thead>
            <tbody>
              <tr v-for="u in utilisateurs" :key="u.id">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ u.prenom?.[0] }}{{ u.nom?.[0] }}</div>
                    <div>
                      <div class="user-name">{{ u.prenom }} {{ u.nom }}</div>
                      <div class="user-email">{{ u.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select v-if="authStore.isSuperAdmin" class="role-select"
                    :value="u.role_id"
                    @change="updateUserRole(u.id, $event.target.value)">
                    <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.nom }}</option>
                  </select>
                  <span v-else class="chip gray">{{ u.role?.nom }}</span>
                </td>
                <td>{{ u.ville || '—' }}</td>
                <td>{{ formatDate(u.created_at) }}</td>
                <td>
                  <span class="status-badge" :class="u.est_actif ? 'active' : 'inactive'">
                    {{ u.est_actif ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm" :class="u.est_actif ? 'btn-danger-outline' : 'btn-success-outline'"
                    @click="toggleActifUser(u)">
                    {{ u.est_actif ? 'Désactiver' : 'Activer' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination" v-if="usersMeta">
            <button class="btn btn-sm btn-outline" :disabled="usersMeta.current_page <= 1" @click="loadUtilisateurs(usersMeta.current_page - 1)">←</button>
            <span>{{ usersMeta.current_page }} / {{ usersMeta.last_page }}</span>
            <button class="btn btn-sm btn-outline" :disabled="usersMeta.current_page >= usersMeta.last_page" @click="loadUtilisateurs(usersMeta.current_page + 1)">→</button>
          </div>
        </div>
      </div>

      <!-- ── TAB : RESSOURCES ───────────────────── -->
      <div v-if="activeTab === 'ressources'" class="tab-content">
        <div class="toolbar">
          <input v-model="ressourceSearch" class="search-input" placeholder="Rechercher par titre…" @input="debouncedLoadRessources"/>
          <select v-model="ressourceStatutFilter" class="select-input" @change="loadRessources">
            <option value="">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
            <option value="archive">Archivé</option>
          </select>
          <select v-model="ressourceTypeFilter" class="select-input" @change="loadRessources">
            <option value="">Tous les types</option>
            <option value="article">Article</option>
            <option value="video">Vidéo</option>
            <option value="podcast">Podcast</option>
            <option value="infographie">Infographie</option>
            <option value="guide">Guide</option>
            <option value="etude">Étude</option>
          </select>
        </div>
        <div v-if="loadingRessources" class="loading-center"><div class="spinner"></div></div>
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead><tr>
              <th>Titre</th><th>Type</th><th>Auteur</th><th>Statut</th><th>Vues</th><th>Date</th><th>Actions</th>
            </tr></thead>
            <tbody>
              <tr v-for="r in ressources" :key="r.id">
                <td>
                  <router-link :to="`/ressources/${r.id}`" class="ressource-link">{{ r.titre }}</router-link>
                </td>
                <td><span class="type-badge">{{ r.type_ressource }}</span></td>
                <td>{{ r.auteur?.prenom }} {{ r.auteur?.nom }}</td>
                <td>
                  <select class="status-select" :value="r.statut" @change="updateRessourceStatut(r.id, $event.target.value)">
                    <option value="brouillon">Brouillon</option>
                    <option value="publie">Publié</option>
                    <option value="archive">Archivé</option>
                  </select>
                </td>
                <td>{{ r.nb_vues }}</td>
                <td>{{ formatDate(r.created_at) }}</td>
                <td>
                  <button class="btn btn-sm btn-danger-outline" @click="deleteRessource(r)">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination" v-if="ressourcesMeta">
            <button class="btn btn-sm btn-outline" :disabled="ressourcesMeta.current_page <= 1" @click="loadRessources(ressourcesMeta.current_page - 1)">←</button>
            <span>{{ ressourcesMeta.current_page }} / {{ ressourcesMeta.last_page }}</span>
            <button class="btn btn-sm btn-outline" :disabled="ressourcesMeta.current_page >= ressourcesMeta.last_page" @click="loadRessources(ressourcesMeta.current_page + 1)">→</button>
          </div>
        </div>
      </div>

      <!-- ── TAB : CATÉGORIES ───────────────────── -->
      <div v-if="activeTab === 'categories'" class="tab-content">
        <div class="toolbar">
          <button class="btn btn-primary" @click="openCategorieModal()">+ Nouvelle catégorie</button>
        </div>
        <div v-if="loadingCategories" class="loading-center"><div class="spinner"></div></div>
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nom</th><th>Icône</th><th>Couleur</th><th>Ressources</th><th>Ordre</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="c in categories" :key="c.id">
                <td><strong>{{ c.nom }}</strong><div class="text-muted text-sm">{{ c.description }}</div></td>
                <td>{{ c.icone || '—' }}</td>
                <td><span class="color-dot" :style="`background:${c.couleur || '#CECECE'}`"></span> {{ c.couleur || '—' }}</td>
                <td>{{ c.ressources_count }}</td>
                <td>{{ c.ordre }}</td>
                <td><span class="status-badge" :class="c.est_active ? 'active' : 'inactive'">{{ c.est_active ? 'Active' : 'Inactive' }}</span></td>
                <td style="display:flex;gap:6px">
                  <button class="btn btn-sm btn-outline" @click="openCategorieModal(c)">Éditer</button>
                  <button class="btn btn-sm btn-danger-outline" @click="deleteCategorie(c)">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── TAB : TAGS ─────────────────────────── -->
      <div v-if="activeTab === 'tags'" class="tab-content">
        <div class="toolbar">
          <div style="display:flex;gap:8px">
            <input v-model="newTagNom" class="search-input" placeholder="Nom du nouveau tag…" @keyup.enter="createTag"/>
            <button class="btn btn-primary" @click="createTag">+ Ajouter</button>
          </div>
        </div>
        <div v-if="loadingTags" class="loading-center"><div class="spinner"></div></div>
        <div v-else class="tags-grid">
          <div v-for="t in tags" :key="t.id" class="tag-item">
            <span class="tag-name">{{ t.nom }}</span>
            <span class="tag-count">{{ t.ressources_count }} ressource{{ t.ressources_count > 1 ? 's' : '' }}</span>
            <button class="tag-delete" @click="deleteTag(t)" title="Supprimer">×</button>
          </div>
        </div>
      </div>
    </main>

    <!-- ── MODAL REJET ────────────────────────────── -->
    <div v-if="commentaireARejeter" class="modal-overlay" @click.self="commentaireARejeter = null">
      <div class="modal">
        <h3>Rejeter le commentaire</h3>
        <p class="modal-excerpt">{{ commentaireARejeter.contenu }}</p>
        <textarea v-model="raisonRejet" class="modal-textarea" rows="3" placeholder="Raison du rejet (obligatoire)…"></textarea>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="commentaireARejeter = null">Annuler</button>
          <button class="btn btn-danger" :disabled="!raisonRejet.trim()" @click="confirmerRejet">Confirmer le rejet</button>
        </div>
      </div>
    </div>

    <!-- ── MODAL CATÉGORIE ────────────────────────── -->
    <div v-if="showCategorieModal" class="modal-overlay" @click.self="showCategorieModal = false">
      <div class="modal" style="max-width:480px">
        <h3>{{ categorieForm.id ? 'Éditer la catégorie' : 'Nouvelle catégorie' }}</h3>
        <div class="form-group">
          <label>Nom *</label>
          <input v-model="categorieForm.nom" class="search-input" placeholder="Nom de la catégorie"/>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="categorieForm.description" class="modal-textarea" rows="2" placeholder="Description courte…"></textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Icône (emoji)</label>
            <input v-model="categorieForm.icone" class="search-input" placeholder="ex: 💬"/>
          </div>
          <div class="form-group">
            <label>Couleur (hex)</label>
            <input v-model="categorieForm.couleur" class="search-input" placeholder="#000091"/>
          </div>
        </div>
        <div class="form-group">
          <label>Ordre d'affichage</label>
          <input v-model.number="categorieForm.ordre" type="number" class="search-input"/>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showCategorieModal = false">Annuler</button>
          <button class="btn btn-primary" @click="saveCategorie">{{ categorieForm.id ? 'Enregistrer' : 'Créer' }}</button>
        </div>
      </div>
    </div>

    <!-- ── MODAL CONFIRMATION SUPPRESSION ─────────── -->
    <div v-if="confirmDelete" class="modal-overlay" @click.self="confirmDelete = null">
      <div class="modal" style="max-width:420px">
        <h3>Confirmer la suppression</h3>
        <p style="color:#666666;margin:12px 0">{{ confirmDelete.message }}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="confirmDelete = null">Annuler</button>
          <button class="btn btn-danger" @click="confirmDelete.action">Supprimer définitivement</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

const authStore = useAuthStore()

// ── TABS ─────────────────────────────────────────────────────────────────
const activeTab = ref('stats')
const commentaireEnAttenteCount = ref(0)

const tabs = computed(() => [
  { id: 'stats',        label: 'Statistiques',  desc: 'Vue d\'ensemble de la plateforme' },
  { id: 'moderation',   label: 'Modération',    desc: 'Commentaires en attente d\'approbation', badge: commentaireEnAttenteCount.value || null },
  { id: 'utilisateurs', label: 'Utilisateurs',  desc: 'Gestion des comptes utilisateurs' },
  { id: 'ressources',   label: 'Ressources',    desc: 'Gestion de toutes les ressources' },
  { id: 'categories',   label: 'Catégories',    desc: 'Gestion des catégories de ressources' },
  { id: 'tags',         label: 'Tags',          desc: 'Gestion des tags' },
])

const currentTab = computed(() => tabs.value.find(t => t.id === activeTab.value))

// ── TOAST ─────────────────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
  clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

// ── STATS ─────────────────────────────────────────────────────────────────
const stats = ref({})
const loadingStats = ref(false)
async function loadStats() {
  loadingStats.value = true
  try {
    const { data } = await api.get('/admin/stats')
    stats.value = data.data
    commentaireEnAttenteCount.value = data.data.commentaires?.en_attente ?? 0
  } catch { showToast('Erreur chargement stats', 'error') }
  finally { loadingStats.value = false }
}

// ── MODÉRATION ────────────────────────────────────────────────────────────
const commentairesEnAttente = ref([])
const loadingModeration = ref(false)
const commentaireARejeter = ref(null)
const raisonRejet = ref('')

async function loadModeration() {
  loadingModeration.value = true
  try {
    const { data } = await api.get('/commentaires/en-attente')
    commentairesEnAttente.value = data.data
    commentaireEnAttenteCount.value = data.data.length
  } catch { showToast('Erreur chargement modération', 'error') }
  finally { loadingModeration.value = false }
}

async function confirmerApprobation(c) {
  try {
    await api.post(`/commentaires/${c.id}/approuver`)
    showToast('Commentaire approuvé')
    loadModeration()
    loadStats()
  } catch { showToast('Erreur approbation', 'error') }
}

function ouvrirModalRejet(c) { commentaireARejeter.value = c; raisonRejet.value = '' }

async function confirmerRejet() {
  if (!raisonRejet.value.trim()) return
  try {
    await api.post(`/commentaires/${commentaireARejeter.value.id}/rejeter`, { raison: raisonRejet.value })
    showToast('Commentaire rejeté')
    commentaireARejeter.value = null
    loadModeration()
    loadStats()
  } catch { showToast('Erreur rejet', 'error') }
}

// ── UTILISATEURS ──────────────────────────────────────────────────────────
const utilisateurs = ref([])
const usersMeta = ref(null)
const loadingUsers = ref(false)
const userSearch = ref('')
const userRoleFilter = ref('')
const roles = ref([])

let userDebounce = null
function debouncedLoadUsers() { clearTimeout(userDebounce); userDebounce = setTimeout(loadUtilisateurs, 350) }

async function loadUtilisateurs(page = 1) {
  loadingUsers.value = true
  try {
    const { data } = await api.get('/admin/utilisateurs', {
      params: { page, search: userSearch.value, role_id: userRoleFilter.value }
    })
    utilisateurs.value = data.data.data
    usersMeta.value = data.data
  } catch { showToast('Erreur chargement utilisateurs', 'error') }
  finally { loadingUsers.value = false }
}

async function toggleActifUser(u) {
  try {
    const { data } = await api.put(`/admin/utilisateurs/${u.id}/toggle-actif`)
    u.est_actif = data.data.est_actif
    showToast(data.message)
    loadStats()
  } catch { showToast('Erreur', 'error') }
}

async function updateUserRole(userId, roleId) {
  try {
    const { data } = await api.put(`/admin/utilisateurs/${userId}/role`, { role_id: roleId })
    const u = utilisateurs.value.find(u => u.id === userId)
    if (u) { u.role = data.data.role; u.role_id = data.data.role_id }
    showToast('Rôle mis à jour')
  } catch { showToast('Erreur mise à jour rôle', 'error') }
}

async function loadRoles() {
  try {
    const { data } = await api.get('/admin/roles')
    roles.value = data.data
  } catch {}
}

// ── RESSOURCES ────────────────────────────────────────────────────────────
const ressources = ref([])
const ressourcesMeta = ref(null)
const loadingRessources = ref(false)
const ressourceSearch = ref('')
const ressourceStatutFilter = ref('')
const ressourceTypeFilter = ref('')
const confirmDelete = ref(null)

let ressourceDebounce = null
function debouncedLoadRessources() { clearTimeout(ressourceDebounce); ressourceDebounce = setTimeout(loadRessources, 350) }

async function loadRessources(page = 1) {
  loadingRessources.value = true
  try {
    const { data } = await api.get('/admin/ressources', {
      params: { page, search: ressourceSearch.value, statut: ressourceStatutFilter.value, type: ressourceTypeFilter.value }
    })
    ressources.value = data.data.data
    ressourcesMeta.value = data.data
  } catch { showToast('Erreur chargement ressources', 'error') }
  finally { loadingRessources.value = false }
}

async function updateRessourceStatut(id, statut) {
  try {
    await api.put(`/admin/ressources/${id}/statut`, { statut })
    showToast('Statut mis à jour')
    loadStats()
  } catch { showToast('Erreur mise à jour statut', 'error') }
}

function deleteRessource(r) {
  confirmDelete.value = {
    message: `Supprimer définitivement "${r.titre}" ? Cette action est irréversible.`,
    action: async () => {
      try {
        await api.delete(`/admin/ressources/${r.id}`)
        ressources.value = ressources.value.filter(x => x.id !== r.id)
        confirmDelete.value = null
        showToast('Ressource supprimée')
        loadStats()
      } catch { showToast('Erreur suppression', 'error') }
    }
  }
}

// ── CATÉGORIES ────────────────────────────────────────────────────────────
const categories = ref([])
const loadingCategories = ref(false)
const showCategorieModal = ref(false)
const categorieForm = ref({})

async function loadCategories() {
  loadingCategories.value = true
  try {
    const { data } = await api.get('/admin/categories')
    categories.value = data.data
  } catch { showToast('Erreur chargement catégories', 'error') }
  finally { loadingCategories.value = false }
}

function openCategorieModal(c = null) {
  categorieForm.value = c ? { ...c } : { nom: '', description: '', icone: '', couleur: '', ordre: 0 }
  showCategorieModal.value = true
}

async function saveCategorie() {
  if (!categorieForm.value.nom?.trim()) return showToast('Le nom est obligatoire', 'error')
  try {
    if (categorieForm.value.id) {
      const { data } = await api.put(`/admin/categories/${categorieForm.value.id}`, categorieForm.value)
      const idx = categories.value.findIndex(c => c.id === categorieForm.value.id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...data.data }
      showToast('Catégorie mise à jour')
    } else {
      const { data } = await api.post('/admin/categories', categorieForm.value)
      categories.value.push({ ...data.data, ressources_count: 0 })
      showToast('Catégorie créée')
    }
    showCategorieModal.value = false
    loadStats()
  } catch (e) {
    showToast(e.response?.data?.message || 'Erreur', 'error')
  }
}

function deleteCategorie(c) {
  confirmDelete.value = {
    message: `Supprimer la catégorie "${c.nom}" ?`,
    action: async () => {
      try {
        await api.delete(`/admin/categories/${c.id}`)
        categories.value = categories.value.filter(x => x.id !== c.id)
        confirmDelete.value = null
        showToast('Catégorie supprimée')
        loadStats()
      } catch { showToast('Erreur suppression', 'error') }
    }
  }
}

// ── TAGS ──────────────────────────────────────────────────────────────────
const tags = ref([])
const loadingTags = ref(false)
const newTagNom = ref('')

async function loadTags() {
  loadingTags.value = true
  try {
    const { data } = await api.get('/admin/tags')
    tags.value = data.data
  } catch { showToast('Erreur chargement tags', 'error') }
  finally { loadingTags.value = false }
}

async function createTag() {
  if (!newTagNom.value.trim()) return
  try {
    const { data } = await api.post('/admin/tags', { nom: newTagNom.value.trim() })
    tags.value.unshift({ ...data.data, ressources_count: 0 })
    newTagNom.value = ''
    showToast('Tag créé')
    loadStats()
  } catch (e) {
    showToast(e.response?.data?.message || 'Erreur', 'error')
  }
}

function deleteTag(t) {
  confirmDelete.value = {
    message: `Supprimer le tag "${t.nom}" ?`,
    action: async () => {
      try {
        await api.delete(`/admin/tags/${t.id}`)
        tags.value = tags.value.filter(x => x.id !== t.id)
        confirmDelete.value = null
        showToast('Tag supprimé')
        loadStats()
      } catch { showToast('Erreur suppression', 'error') }
    }
  }
}

// ── UTILS ─────────────────────────────────────────────────────────────────
function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── INIT ─────────────────────────────────────────────────────────────────
watch(activeTab, (tab) => {
  if (tab === 'stats')        loadStats()
  if (tab === 'moderation')   loadModeration()
  if (tab === 'utilisateurs') { loadUtilisateurs(); loadRoles() }
  if (tab === 'ressources')   loadRessources()
  if (tab === 'categories')   loadCategories()
  if (tab === 'tags')         loadTags()
})

onMounted(async () => {
  await loadStats()
  await loadModeration()
  await loadRoles()
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #F5F5F5;
  color: #161616;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── SIDEBAR (desktop) ── */
.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #FFFFFF;
  border-right: 1px solid #DDDDDD;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px;
  border-bottom: 1px solid #DDDDDD;
  font-weight: 800;
  font-size: .9rem;
}
.sidebar-title { color: #161616; }
.sidebar-nav { padding: 8px 6px; display: flex; flex-direction: column; gap: 2px; }
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #4A4A4A;
  font-size: .85rem;
  cursor: pointer;
  transition: all .15s;
  text-align: left;
}
.sidebar-item:hover { background: #F5F5F5; color: #161616; }
.sidebar-item.active { background: rgba(0,0,145,.07); color: #000091; font-weight: 600; border-left: 3px solid #000091; }
.sidebar-label { flex: 1; }
.sidebar-badge {
  margin-left: auto;
  background: #E1000F;
  color: #fff;
  font-size: .68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
}

/* ── MAIN ── */
.admin-main { flex: 1; overflow-y: auto; min-width: 0; }
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .75rem;
  padding: 20px 28px 16px;
  border-bottom: 1px solid #DDDDDD;
  background: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 10;
}
.admin-title { font-size: 1.3rem; font-weight: 700; color: #161616; }
.admin-subtitle { font-size: .8rem; color: #666666; margin-top: 2px; }
.role-badge { font-size: .75rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; }
.role-badge.super { background: rgba(225,0,15,.1); color: #C9191E; border: 1px solid rgba(225,0,15,.3); }
.role-badge.admin  { background: rgba(0,0,145,.08); color: #000091; border: 1px solid rgba(0,0,145,.25); }

.tab-content { padding: 24px 28px; }

/* ── STATS ── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.stat-card {
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-top: 3px solid #000091;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.stat-num { font-size: 2rem; font-weight: 800; color: #000091; }
.stat-label { font-size: .8rem; color: #666666; margin-top: 2px; }
.stat-sub { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }

/* ── CHIPS ── */
.chip {
  display: inline-block;
  font-size: .7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
}
.chip.green  { background: #C3FAE8; color: #006B3C; }
.chip.amber  { background: #FFF3CD; color: #7A5C00; }
.chip.red    { background: #FFE9E9; color: #C9191E; }
.chip.blue   { background: #E3E8F7; color: #000091; }
.chip.gray   { background: #F5F5F5; color: #666666; }

/* ── TOOLBAR ── */
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.search-input {
  padding: 8px 12px;
  background: #FFFFFF;
  border: 1px solid #CECECE;
  border-radius: 4px;
  color: #161616;
  font-size: .85rem;
  outline: none;
  min-width: 180px;
  flex: 1;
}
.search-input:focus { border-color: #000091; box-shadow: 0 0 0 2px rgba(0,0,145,.1); }
.select-input {
  padding: 8px 12px;
  background: #FFFFFF;
  border: 1px solid #CECECE;
  border-radius: 4px;
  color: #4A4A4A;
  font-size: .85rem;
  cursor: pointer;
}

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: .84rem; background: #FFFFFF; border-radius: 4px; overflow: hidden; border: 1px solid #DDDDDD; }
.data-table th {
  background: #F5F5F5;
  color: #4A4A4A;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  padding: 10px 14px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 2px solid #DDDDDD;
}
.data-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #EEEEEE;
  color: #4A4A4A;
  vertical-align: middle;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #F9F9F9; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(0,0,145,.1); color: #000091;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .75rem; flex-shrink: 0;
}
.user-name { font-weight: 600; color: #161616; }
.user-email { font-size: .75rem; color: #666666; }
.text-muted { color: #666666; }
.text-sm { font-size: .75rem; }
.ressource-link { color: #000091; text-decoration: none; font-weight: 500; }
.ressource-link:hover { text-decoration: underline; }
.type-badge {
  font-size: .72rem; font-weight: 600; padding: 2px 8px;
  border-radius: 99px; background: #E3E8F7; color: #000091;
  text-transform: capitalize;
}
.role-select, .status-select {
  background: #FFFFFF;
  border: 1px solid #CECECE;
  border-radius: 4px;
  color: #4A4A4A;
  font-size: .8rem;
  padding: 4px 8px;
  cursor: pointer;
}

/* ── STATUS BADGES ── */
.status-badge {
  display: inline-block;
  font-size: .72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
}
.status-badge.active   { background: #C3FAE8; color: #006B3C; }
.status-badge.inactive { background: #FFE9E9; color: #C9191E; }
.status-badge.pending  { background: #FFF3CD; color: #7A5C00; }

/* ── BUTTONS ── */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn-primary        { background: #000091; color: #fff; }
.btn-primary:hover  { background: #1212FF; }
.btn-success        { background: #C3FAE8; color: #006B3C; border: 1px solid rgba(0,107,60,.3); }
.btn-success:hover  { background: #A8F5D8; }
.btn-success-outline { background: transparent; color: #006B3C; border: 1px solid rgba(0,107,60,.4); }
.btn-danger         { background: #FFE9E9; color: #C9191E; border: 1px solid rgba(225,0,15,.3); }
.btn-danger:hover   { background: #FFD5D5; }
.btn-danger-outline { background: transparent; color: #C9191E; border: 1px solid rgba(225,0,15,.3); }
.btn-danger-outline:hover { background: #FFE9E9; }
.btn-outline        { background: transparent; color: #4A4A4A; border: 1px solid #CECECE; }
.btn-outline:hover  { border-color: #000091; color: #000091; }
.btn-sm { padding: 5px 12px; font-size: .78rem; }

/* ── COMMENT CARDS ── */
.comment-list { display: flex; flex-direction: column; gap: 14px; }
.comment-card { background: #FFFFFF; border: 1px solid #DDDDDD; border-radius: 4px; padding: 18px; }
.comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: .5rem; }
.comment-meta { display: flex; align-items: center; gap: 6px; font-size: .85rem; }
.meta-sep { color: #CECECE; }
.comment-date { color: #666666; font-size: .8rem; }
.comment-body { color: #161616; line-height: 1.6; margin: 10px 0; white-space: pre-wrap; }
.comment-ressource { font-size: .8rem; color: #666666; margin-bottom: 12px; }
.comment-ressource a { color: #000091; text-decoration: none; }
.comment-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }

/* ── CATEGORIES ── */
.color-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; vertical-align: middle; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: .8rem; color: #4A4A4A; font-weight: 500; margin-bottom: 5px; }

/* ── TAGS ── */
.tags-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #E3E8F7;
  border: 1px solid rgba(0,0,145,.2);
  border-radius: 99px;
  padding: 5px 8px 5px 14px;
}
.tag-name { font-size: .84rem; color: #000091; font-weight: 600; }
.tag-count { font-size: .72rem; color: #666666; }
.tag-delete {
  background: transparent;
  border: none;
  color: #666666;
  cursor: pointer;
  font-size: .9rem;
  padding: 2px 5px;
  border-radius: 50%;
  transition: all .15s;
  line-height: 1;
}
.tag-delete:hover { background: rgba(225,0,15,.1); color: #C9191E; }

/* ── PAGINATION ── */
.pagination { display: flex; align-items: center; gap: 12px; justify-content: center; padding: 16px 0; color: #666666; font-size: .84rem; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 1rem;
}
.modal {
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  padding: 28px;
  width: 90%;
  max-width: 560px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}
.modal h3 { font-size: 1.1rem; color: #161616; margin-bottom: 14px; }
.modal-excerpt { color: #4A4A4A; font-size: .85rem; padding: 10px 14px; background: #F5F5F5; border-radius: 4px; margin-bottom: 14px; }
.modal-textarea {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #CECECE;
  border-radius: 4px;
  color: #161616;
  padding: 10px 14px;
  font-size: .85rem;
  resize: vertical;
  outline: none;
  font-family: inherit;
}
.modal-textarea:focus { border-color: #000091; box-shadow: 0 0 0 2px rgba(0,0,145,.1); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; flex-wrap: wrap; }

/* ── EMPTY / LOADING ── */
.empty-state { text-align: center; padding: 60px 0; color: #666666; }
.loading-center { display: flex; justify-content: center; padding: 60px 0; }
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #DDDDDD;
  border-top-color: #000091;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 24px; right: 24px;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: .85rem;
  font-weight: 600;
  z-index: 200;
  animation: slideIn .2s ease;
}
.toast.success { background: #006B3C; color: #fff; }
.toast.error   { background: #C9191E; color: #fff; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: none; opacity: 1; } }

/* ── RESPONSIVE ── */
@media (max-width: 767px) {
  .admin-layout { flex-direction: column; }

  .admin-sidebar {
    width: 100%;
    height: auto;
    position: sticky;
    top: 0;
    border-right: none;
    border-bottom: 2px solid #000091;
    z-index: 20;
  }

  .sidebar-header { display: none; }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0;
    gap: 0;
    scrollbar-width: none;
  }
  .sidebar-nav::-webkit-scrollbar { display: none; }

  .sidebar-item {
    flex-shrink: 0;
    padding: 12px 16px;
    border-radius: 0;
    border-bottom: 3px solid transparent;
    border-left: none !important;
    white-space: nowrap;
    justify-content: center;
  }
  .sidebar-item.active {
    border-bottom-color: #000091;
    border-left: none !important;
    background: rgba(0,0,145,.05);
  }

  .tab-content { padding: 16px; }

  .admin-header { padding: 14px 16px; }
  .admin-title { font-size: 1.1rem; }

  .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }

  .toolbar { flex-direction: column; }
  .search-input { min-width: 100%; }

  .modal { padding: 20px; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .data-table th:nth-child(3),
  .data-table td:nth-child(3),
  .data-table th:nth-child(4),
  .data-table td:nth-child(4) { display: none; }
}
</style>
