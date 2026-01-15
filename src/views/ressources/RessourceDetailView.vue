<template>
  <div class="fr-container fr-py-6">
    <!-- État de chargement -->
    <div v-if="loading" style="display: flex; justify-content: center; padding: 3rem 0;">
      <div class="fr-spinner" style="width: 3rem; height: 3rem;"></div>
    </div>

    <!-- Contenu de la ressource -->
    <div v-else-if="ressource" style="max-width: 56rem; margin: 0 auto;">
      <!-- Fil d'Ariane -->
      <nav role="navigation" aria-label="Fil d'Ariane" class="fr-mb-4">
        <ol style="display: flex; flex-wrap: wrap; list-style: none; padding: 0; margin: 0; gap: 0.5rem; font-size: 0.875rem; color: var(--text-mention-grey);">
          <li>
            <router-link to="/" style="color: var(--blue-france); text-decoration: none;">Accueil</router-link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <router-link to="/ressources" style="color: var(--blue-france); text-decoration: none;">Ressources</router-link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{{ ressource.titre }}</li>
        </ol>
      </nav>

      <!-- Carte principale -->
      <article class="fr-card">
        <!-- Image de couverture -->
        <div v-if="ressource.url_image" style="width: 100%; height: 24rem; overflow: hidden; background-color: var(--grey-100);">
          <img 
            :src="ressource.url_image" 
            :alt="ressource.titre"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
        <div v-else style="width: 100%; height: 24rem; background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%);"></div>

        <!-- Contenu -->
        <div class="fr-card__body" style="padding: var(--space-6);">
          <!-- Badges -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <span class="fr-badge fr-badge--info">
              {{ formatType(ressource.type_ressource) }}
            </span>
            <span class="fr-badge fr-badge--success">
              {{ formatNiveau(ressource.niveau) }}
            </span>
            <span v-if="ressource.type_relation" class="fr-badge" style="background-color: #FEE7FC; color: #6E445A;">
              {{ formatTypeRelation(ressource.type_relation) }}
            </span>
            <span v-if="ressource.statut === 'publie'" class="fr-badge" style="background-color: #C3FAE8; color: var(--green-menthe);">
              Publié
            </span>
          </div>

          <!-- Titre -->
          <h1 class="fr-h1">{{ ressource.titre }}</h1>

          <!-- Métadonnées -->
          <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 1.5rem; color: var(--text-mention-grey);">
            <span style="display: flex; align-items: center; gap: 0.375rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {{ ressource.nb_vues || 0 }} vues
            </span>
            <span style="display: flex; align-items: center; gap: 0.375rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {{ ressource.nb_favoris || 0 }} favoris
            </span>
            <span v-if="ressource.duree_lecture" style="display: flex; align-items: center; gap: 0.375rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ ressource.duree_lecture }} min de lecture
            </span>
          </div>

          <!-- Description -->
          <div class="fr-mb-6">
            <p class="fr-text fr-text--lg" style="line-height: 1.6;">
              {{ ressource.description }}
            </p>
          </div>

          <!-- Contenu -->
          <div v-if="ressource.contenu" class="fr-mb-6" style="line-height: 1.8; font-size: 1.0625rem;">
            <div v-html="ressource.contenu"></div>
          </div>

          <!-- Lien externe -->
          <div v-if="ressource.url_externe" class="fr-mb-6">
            <a
              :href="ressource.url_externe"
              target="_blank"
              rel="noopener noreferrer"
              class="fr-btn fr-btn--icon-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Voir la ressource externe
            </a>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button
              @click="toggleFavori"
              class="fr-btn"
              :class="isFavori ? '' : 'fr-btn--secondary'"
              :style="isFavori ? 'background-color: var(--red-marianne); border-color: var(--red-marianne);' : ''"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" :fill="isFavori ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {{ isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
            </button>
            
            <button
              @click="partager"
              class="fr-btn fr-btn--secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Partager
            </button>
          </div>
        </div>
      </article>

      <!-- Section commentaires -->
      <div class="fr-mt-8">
        <h2 class="fr-h2 fr-mb-4">Commentaires</h2>
        
        <!-- Formulaire de commentaire -->
        <div class="fr-card fr-mb-6">
          <div class="fr-card__body">
            <div class="fr-input-group">
              <label class="fr-label" for="commentaire">Ajouter un commentaire</label>
              <textarea
                id="commentaire"
                v-model="nouveauCommentaire"
                class="fr-input"
                rows="4"
                placeholder="Partagez votre avis, vos questions..."
                style="resize: vertical;"
              ></textarea>
            </div>
            <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
              <button
                @click="ajouterCommentaire"
                class="fr-btn"
                :disabled="!nouveauCommentaire.trim()"
              >
                Publier
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des commentaires -->
        <div v-if="commentaires.length === 0" class="fr-text fr-text--mention" style="text-align: center; padding: 2rem 0;">
          Aucun commentaire pour le moment. Soyez le premier à partager votre avis !
        </div>
        
        <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
          <div v-for="commentaire in commentaires" :key="commentaire.id" class="fr-card">
            <div class="fr-card__body">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <div>
                  <strong class="fr-text">{{ commentaire.auteur }}</strong>
                  <span class="fr-text fr-text--sm fr-text--mention" style="margin-left: 0.5rem;">
                    {{ commentaire.date }}
                  </span>
                </div>
                <span v-if="commentaire.statut === 'approuve'" class="fr-badge fr-badge--success" style="font-size: 0.625rem;">
                  Approuvé
                </span>
              </div>
              <p class="fr-text">{{ commentaire.contenu }}</p>
              <div style="margin-top: 0.75rem; display: flex; gap: 1rem; align-items: center;">
                <button
                  @click="likeCommentaire(commentaire.id)"
                  style="display: flex; align-items: center; gap: 0.25rem; background: none; border: none; cursor: pointer; color: var(--text-mention-grey); font-size: 0.875rem;"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  {{ commentaire.nb_likes || 0 }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'alerte si succès -->
    <div v-if="showAlert" class="fr-alert fr-alert--success" style="position: fixed; top: 2rem; right: 2rem; max-width: 20rem; z-index: 1000; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const ressource = ref(null)
const isFavori = ref(false)
const commentaires = ref([])
const nouveauCommentaire = ref('')
const showAlert = ref(false)
const alertMessage = ref('')

const formatType = (type) => {
  const types = {
    article: 'Article',
    video: 'Vidéo',
    podcast: 'Podcast',
    audio: 'Audio',
    document: 'Document',
    lien: 'Lien',
    infographie: 'Infographie',
    guide: 'Guide',
    etude: 'Étude'
  }
  return types[type] || type
}

const formatNiveau = (niveau) => {
  const niveaux = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé'
  }
  return niveaux[niveau] || niveau
}

const formatTypeRelation = (type) => {
  const types = {
    familiale: 'Relation familiale',
    amicale: 'Relation amicale',
    amoureuse: 'Relation amoureuse',
    professionnelle: 'Relation professionnelle',
    therapeutique: 'Relation thérapeutique'
  }
  return types[type] || type
}

const toggleFavori = () => {
  isFavori.value = !isFavori.value
  afficherAlert(isFavori.value ? 'Ajouté aux favoris' : 'Retiré des favoris')
}

const partager = () => {
  if (navigator.share) {
    navigator.share({
      title: ressource.value.titre,
      text: ressource.value.description,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    afficherAlert('Lien copié dans le presse-papier')
  }
}

const ajouterCommentaire = () => {
  if (!nouveauCommentaire.value.trim()) return
  
  commentaires.value.unshift({
    id: Date.now(),
    auteur: 'Vous',
    date: 'À l\'instant',
    contenu: nouveauCommentaire.value,
    statut: 'en_attente',
    nb_likes: 0
  })
  
  nouveauCommentaire.value = ''
  afficherAlert('Commentaire publié avec succès')
}

const likeCommentaire = (id) => {
  const commentaire = commentaires.value.find(c => c.id === id)
  if (commentaire) {
    commentaire.nb_likes = (commentaire.nb_likes || 0) + 1
  }
}

const afficherAlert = (message) => {
  alertMessage.value = message
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Données d'exemple
    ressource.value = {
      id: route.params.id,
      titre: 'Guide de la communication bienveillante',
      description: 'Découvrez les principes de base de la communication non-violente et comment les appliquer au quotidien dans vos relations.',
      contenu: `
        <h3>Introduction</h3>
        <p>La communication bienveillante, également appelée Communication Non-Violente (CNV), est une approche développée par Marshall Rosenberg. Elle vise à créer des liens authentiques et à résoudre les conflits de manière constructive.</p>
        
        <h3>Les 4 étapes de la CNV</h3>
        <p><strong>1. Observer sans juger</strong><br>Décrivez les faits de manière objective, sans interprétation ni jugement.</p>
        <p><strong>2. Identifier ses sentiments</strong><br>Exprimez ce que vous ressentez face à la situation.</p>
        <p><strong>3. Exprimer ses besoins</strong><br>Identifiez les besoins sous-jacents à vos sentiments.</p>
        <p><strong>4. Formuler une demande claire</strong><br>Proposez une action concrète qui pourrait satisfaire vos besoins.</p>
        
        <h3>Mise en pratique</h3>
        <p>La pratique régulière de la CNV permet de développer une écoute empathique et de créer des relations plus authentiques et satisfaisantes.</p>
      `,
      type_ressource: 'guide',
      type_relation: 'familiale',
      niveau: 'debutant',
      statut: 'publie',
      nb_vues: 1245,
      nb_favoris: 89,
      duree_lecture: 15,
      url_image: null,
      url_externe: null
    }
    
    commentaires.value = [
      {
        id: 1,
        auteur: 'Marie Dupont',
        date: 'Il y a 2 jours',
        contenu: 'Excellent guide ! J\'ai pu appliquer ces principes avec mes enfants et cela a vraiment amélioré notre communication.',
        statut: 'approuve',
        nb_likes: 12
      },
      {
        id: 2,
        auteur: 'Jean Martin',
        date: 'Il y a 1 semaine',
        contenu: 'Merci pour ces explications claires. Les 4 étapes sont faciles à mémoriser et à mettre en pratique.',
        statut: 'approuve',
        nb_likes: 8
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement de la ressource:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Styles spécifiques pour le contenu HTML */
:deep(h3) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text-default-grey);
}

:deep(p) {
  margin-bottom: 1rem;
}

:deep(strong) {
  font-weight: 600;
  color: var(--blue-france);
}
</style>