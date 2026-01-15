export const formatType = (type) => {
  const types = {
    article: 'Article',
    video: 'Vidéo',
    podcast: 'Podcast',
    audio: 'Audio',
    guide: 'Guide',
    document: 'Document',
    lien: 'Lien',
    infographie: 'Infographie',
    etude: 'Étude'
  }
  return types[type] || type
}

export const formatNiveau = (niveau) => {
  const niveaux = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
    tous: 'Tous niveaux'
  }
  return niveaux[niveau] || niveau
}

export const formatTypeRelation = (type) => {
  const types = {
    familiale: 'Relation familiale',
    amicale: 'Relation amicale',
    amoureuse: 'Relation amoureuse',
    professionnelle: 'Relation professionnelle',
    therapeutique: 'Relation thérapeutique'
  }
  return types[type] || type
}

export const formatTypeActivite = (type) => {
  const types = {
    discussion: 'Discussion',
    evenement: 'Événement',
    atelier: 'Atelier',
    groupe_echange: 'Groupe d\'échange',
    conference: 'Conférence'
  }
  return types[type] || type
}

export const formatStatutActivite = (statut) => {
  const statuts = {
    a_venir: 'À venir',
    en_cours: 'En cours',
    termine: 'Terminé',
    annule: 'Annulé'
  }
  return statuts[statut] || statut
}
