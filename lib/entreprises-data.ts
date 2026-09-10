// Contenu éditorial de l'univers B2B (/entreprises et ses pages secteur).
// Centralisé ici pour que la page hub, les pages secteur, le sitemap et
// public/llms.txt racontent exactement la même chose — la cohérence est ce que
// les moteurs de réponse IA vérifient avant de citer une source.

export type Secteur = {
  /** Segment d'URL : /entreprises/<slug> */
  slug: string
  /** Nom court affiché dans les grilles et le fil d'Ariane. */
  nom: string
  emoji: string
  /** <title> de la page secteur (sans le suffixe du template). */
  title: string
  /** <meta description> — 150-160 caractères, avec le bénéfice + la géo. */
  description: string
  /** <h1> de la page secteur. */
  h1: string
  /** Chapô : 2-3 phrases citables telles quelles par un assistant IA. */
  intro: string
  /** Tenues typiques du secteur. */
  tenues: { nom: string; detail: string; prix: string }[]
  /** Pourquoi ce secteur a des contraintes particulières. */
  specificites: string[]
  /** Questions réellement posées par les clients de ce secteur. */
  faq: { q: string; r: string }[]
  /** Requêtes visées — sert aussi de meta keywords. */
  motsCles: string[]
}

export const SECTEURS: Secteur[] = [
  {
    slug: 'restauration-hotellerie',
    nom: 'Restauration & Hôtellerie',
    emoji: '🍽️',
    title: 'Uniformes restaurant & hôtel personnalisés — Alger',
    description:
      "Tabliers, polos et vestes de service brodés à votre logo pour restaurants, cafés et hôtels en Algérie. Devis en 2h, production 3–5 jours, livraison 58 wilayas.",
    h1: 'Uniformes personnalisés pour la restauration et l\'hôtellerie',
    intro:
      "Une salle bien habillée se remarque avant la carte. Caractère Store équipe restaurants, cafés, pizzerias et hôtels d'Alger et de toute l'Algérie en tabliers, polos et vestes de service brodés au logo de l'établissement. Tissus qui supportent le lavage quotidien à 60 °C, broderie qui ne se décolle pas au bout de trois services.",
    tenues: [
      { nom: 'Tablier de service brodé', detail: 'Coton épais, poche ventrale, logo brodé cœur', prix: 'à partir de 1 500 DA' },
      { nom: 'Polo salle', detail: 'Piqué coton premium, tenue de couleur après lavages', prix: 'à partir de 2 300 DA' },
      { nom: 'T-shirt cuisine', detail: '100% coton, DTF ou broderie', prix: 'à partir de 1 950 DA' },
      { nom: 'Casquette équipe', detail: 'Broderie structurée, réglable', prix: 'à partir de 1 200 DA' },
    ],
    specificites: [
      'Lavage intensif : nous privilégions les mailles et fils qui tiennent le lavage quotidien à haute température.',
      'Distinction des postes : couleurs différentes pour la salle, la cuisine et la direction, sur le même logo.',
      'Renfort rapide : réassort à l\'unité possible quand une nouvelle recrue arrive en pleine saison.',
    ],
    faq: [
      { q: 'Combien de tabliers personnalisés minimum pour un restaurant ?', r: "Aucun minimum : nous produisons à partir d'une seule pièce. Les remises volume démarrent à 50 pièces (−5%) puis 100 pièces (−10%)." },
      { q: 'La broderie résiste-t-elle au lavage en machine professionnelle ?', r: "Oui. La broderie machine est réalisée avec des fils polyester résistants au lavage à 60 °C et au séchage industriel — c'est la technique que nous recommandons pour la restauration, plutôt que le flex." },
      { q: 'Pouvez-vous livrer des uniformes de restaurant hors d\'Alger ?', r: "Oui, nous livrons dans les 58 wilayas d'Algérie via nos partenaires logistiques, avec paiement à la livraison possible." },
    ],
    motsCles: ['tablier personnalisé Alger', 'uniforme restaurant Algérie', 'polo serveur brodé', 'tenue hôtel personnalisée'],
  },
  {
    slug: 'sante-cliniques',
    nom: 'Santé & Cliniques',
    emoji: '🏥',
    title: 'Blouses médicales brodées pour cliniques — Algérie',
    description:
      "Blouses, tuniques et tenues médicales brodées au nom et au logo de votre clinique ou cabinet. Production à Alger, 3–5 jours, livraison dans toute l'Algérie.",
    h1: 'Blouses et tenues médicales personnalisées pour cliniques et cabinets',
    intro:
      "Dans un cabinet ou une clinique, la tenue est le premier signe de sérieux que perçoit le patient. Nous brodons blouses, tuniques et casaques au logo de l'établissement, avec le nom et la fonction du praticien sur demande. Broderie fine, lisible même en petite taille, réalisée dans notre atelier d'Alger.",
    tenues: [
      { nom: 'Blouse médicale brodée', detail: 'Logo établissement + nom du praticien', prix: 'sur devis' },
      { nom: 'Tunique de soin', detail: 'Coton/polyester, lavage haute température', prix: 'sur devis' },
      { nom: 'Polo accueil & administratif', detail: 'Piqué coton, broderie discrète', prix: 'à partir de 2 300 DA' },
      { nom: 'Blouse d\'accueil brodée', detail: 'Tenue du personnel non soignant', prix: 'sur devis' },
    ],
    specificites: [
      'Nom et fonction individualisés : chaque pièce peut porter un prénom différent sans surcoût de fichier.',
      'Broderie plutôt qu\'impression : elle supporte les lavages à haute température imposés par l\'hygiène hospitalière.',
      'Réassort nominatif : nous conservons votre fichier de broderie pour les recrutements suivants.',
    ],
    faq: [
      { q: 'Pouvez-vous broder le nom de chaque praticien sur sa blouse ?', r: "Oui. Nous personnalisons chaque pièce individuellement (nom, fonction, service) tout en gardant le même logo d'établissement. Il suffit de nous transmettre la liste avec la commande." },
      { q: 'Quel délai pour équiper une clinique entière ?', r: "3 à 5 jours ouvrés pour une commande standard. Pour une ouverture ou une inspection, une production urgente en 48h est possible sur demande." },
      { q: 'Fournissez-vous les blouses ou brodez-vous les nôtres ?', r: "Les deux. Nous pouvons fournir les tenues et les broder, ou personnaliser des blouses que vous possédez déjà." },
    ],
    motsCles: ['blouse médicale personnalisée Algérie', 'blouse brodée clinique', 'tenue médicale Alger', 'broderie nom blouse'],
  },
  {
    slug: 'btp-construction',
    nom: 'BTP & Construction',
    emoji: '🏗️',
    title: 'Vêtements de travail et gilets de chantier personnalisés',
    description:
      "Gilets haute visibilité, t-shirts et combinaisons de chantier floqués à votre logo. Production à Alger, grandes séries, livraison dans les 58 wilayas.",
    h1: 'Vêtements de travail et gilets de chantier personnalisés',
    intro:
      "Sur un chantier, le vêtement remplit deux rôles : il protège et il identifie. Caractère Store équipe les entreprises de BTP algériennes en gilets haute visibilité, t-shirts, vestes et combinaisons marqués au logo — lisibles à distance, résistants à la poussière et aux lavages répétés.",
    tenues: [
      { nom: 'Gilet de sécurité haute visibilité', detail: 'Bandes rétroréfléchissantes, logo sérigraphié ou DTF', prix: 'à partir de 1 600 DA' },
      { nom: 'Gilet de travail multipoches', detail: 'Toile résistante, logo brodé', prix: 'à partir de 2 500 DA' },
      { nom: 'Combinaison de travail', detail: 'Combinaison professionnelle multipoches', prix: 'à partir de 5 900 DA' },
      { nom: 'T-shirt chantier', detail: '100% coton, marquage dos + cœur', prix: 'à partir de 1 950 DA' },
    ],
    specificites: [
      'Lisibilité à distance : logo grand format dans le dos, en plus du marquage poitrine.',
      'Grandes séries : les commandes de 100 pièces et plus bénéficient d\'une remise de 10%.',
      'Marquage adapté au support : DTF ou sérigraphie sur les matières techniques, où la broderie fragiliserait le tissu.',
    ],
    faq: [
      { q: 'Pouvez-vous produire 100 gilets de chantier rapidement ?', r: "Oui. Les commandes de 100 pièces et plus sont notre volume courant : comptez 3 à 5 jours ouvrés, et une remise de 10% s'applique automatiquement à ce palier." },
      { q: 'Peut-on imprimer sur un gilet haute visibilité sans réduire sa visibilité ?', r: "Oui. Nous positionnons le marquage entre les bandes rétroréfléchissantes, sans jamais les recouvrir, pour que le gilet conserve sa fonction de sécurité." },
      { q: 'Le logo tient-il sur un vêtement de chantier ?', r: "Le DTF et la sérigraphie résistent aux lavages répétés et à la poussière. Pour les vestes et gilets épais, la broderie reste la solution la plus durable." },
    ],
    motsCles: ['gilet de chantier personnalisé', 'vêtement de travail Algérie', 'gilet haute visibilité logo', 'tenue BTP Alger'],
  },
  {
    slug: 'commerce-retail',
    nom: 'Commerce & Retail',
    emoji: '🏪',
    title: 'Uniformes vendeurs et tenues de magasin personnalisées',
    description:
      "Polos, t-shirts et tabliers brodés pour équipes de vente, boutiques et grandes surfaces en Algérie. Devis en 2h, livraison 58 wilayas.",
    h1: 'Uniformes personnalisés pour commerces et points de vente',
    intro:
      "Un client doit repérer un vendeur en trois secondes. Nous habillons boutiques, supérettes, magasins de détail et grandes surfaces avec des polos, t-shirts et tabliers aux couleurs de l'enseigne, logo brodé ou imprimé, dans un rendu homogène d'un point de vente à l'autre.",
    tenues: [
      { nom: 'Polo vendeur brodé', detail: 'Piqué coton, logo cœur, couleur enseigne', prix: 'à partir de 2 300 DA' },
      { nom: 'T-shirt équipe', detail: 'DTF full color, marquage dos possible', prix: 'à partir de 1 950 DA' },
      { nom: 'Tablier caisse & rayon', detail: 'Coton, poche ventrale', prix: 'à partir de 1 500 DA' },
      { nom: 'Totebag enseigne', detail: 'Coton canvas imprimé — sac client ou goodie', prix: 'à partir de 950 DA' },
    ],
    specificites: [
      'Cohérence multi-magasins : nous archivons vos couleurs et votre fichier logo pour que la 2ᵉ commande soit identique à la 1ʳᵉ.',
      'Rotation du personnel : réassort à l\'unité, sans repasser par un minimum de commande.',
      'Opérations commerciales : t-shirts événementiels pour les soldes ou une ouverture, produits en quelques jours.',
    ],
    faq: [
      { q: 'Puis-je recommander exactement les mêmes polos dans six mois ?', r: "Oui. Nous conservons votre fichier de broderie, la référence produit et le code couleur exact, ce qui garantit un réassort identique à la commande d'origine." },
      { q: 'Faites-vous des tenues différentes selon les postes ?', r: "Oui : couleur ou modèle différent pour la caisse, le rayon et les responsables, avec le même logo pour garder l'identité de l'enseigne." },
      { q: 'Produisez-vous aussi des sacs et goodies à notre logo ?', r: "Oui — totebags, casquettes et tabliers imprimés, souvent commandés avec les uniformes dans la même livraison." },
    ],
    motsCles: ['uniforme magasin Algérie', 'polo vendeur personnalisé', 'tenue boutique brodée', 'totebag logo Alger'],
  },
  {
    slug: 'education-ecoles',
    nom: 'Éducation & Écoles',
    emoji: '🎓',
    title: 'Tenues scolaires et t-shirts d\'école personnalisés',
    description:
      "Tabliers, t-shirts et sweats brodés au logo de votre école, université ou club étudiant. Production à Alger, tarifs dégressifs, livraison nationale.",
    h1: 'Tenues et textiles personnalisés pour écoles et établissements',
    intro:
      "Écoles privées, universités, clubs étudiants et associations : nous personnalisons tabliers, t-shirts, sweats et casquettes au logo de l'établissement. Les volumes de rentrée sont notre spécialité — plus la série est grande, plus le prix unitaire baisse.",
    tenues: [
      { nom: 'Tablier scolaire brodé', detail: 'Logo école brodé, tailles enfants et adultes', prix: 'à partir de 1 500 DA' },
      { nom: 'T-shirt école / club', detail: 'DTF full color, promotions et sorties', prix: 'à partir de 1 950 DA' },
      { nom: 'Sweat université', detail: 'Molleton, logo brodé ou imprimé', prix: 'sur devis' },
      { nom: 'Casquette club étudiant', detail: 'Broderie structurée', prix: 'à partir de 1 200 DA' },
    ],
    specificites: [
      'Volumes de rentrée : nous planifions les grosses séries en amont de septembre pour tenir les délais.',
      'Gamme de tailles complète, des tailles enfants aux tailles adultes, sur le même modèle.',
      'Budget associatif : les paliers 50 et 100 pièces font baisser sensiblement le coût par élève.',
    ],
    faq: [
      { q: 'Faites-vous des tabliers scolaires en taille enfant ?', r: "Oui, nous couvrons les tailles enfants et adultes sur les mêmes modèles, avec le logo de l'établissement brodé au même emplacement." },
      { q: 'Quel est le prix pour 200 t-shirts d\'école ?', r: "À partir de 200 pièces, la remise volume maximale de 10% s'applique et un devis personnalisé vous est envoyé sous 2h via WhatsApp." },
      { q: 'Quand faut-il commander pour la rentrée ?', r: "Comptez 3 à 5 jours ouvrés de production, mais pour les commandes de rentrée nous recommandons de lancer 2 à 3 semaines avant, la demande étant concentrée sur août et septembre." },
    ],
    motsCles: ['tablier scolaire personnalisé', 't-shirt école Algérie', 'sweat université brodé', 'tenue club étudiant'],
  },
  {
    slug: 'sport-evenements',
    nom: 'Sport & Événements',
    emoji: '⚽',
    title: 'Maillots et t-shirts d\'événement personnalisés — Algérie',
    description:
      "Maillots d'équipe, t-shirts de séminaire et kits événementiels floqués avec numéros et noms. Production 3–5 jours à Alger, urgent 48h possible.",
    h1: 'Maillots de sport et textiles événementiels personnalisés',
    intro:
      "Clubs, tournois, séminaires, salons : nous produisons les maillots numérotés, t-shirts d'équipe et casquettes qui portent votre identité le jour J. Numéros et noms individuels sur chaque pièce, sans surcoût de fichier, et une option urgente à 48h quand la date est déjà fixée.",
    tenues: [
      { nom: 'Maillot d\'équipe numéroté', detail: 'Numéro dos + nom joueur + sponsors', prix: 'sur devis' },
      { nom: 'T-shirt événement', detail: 'DTF full color, séminaires et salons', prix: 'à partir de 1 950 DA' },
      { nom: 'Casquette supporter', detail: 'Broderie logo club', prix: 'à partir de 1 200 DA' },
      { nom: 'Totebag salon', detail: 'Sac participant imprimé', prix: 'à partir de 950 DA' },
    ],
    specificites: [
      'Numérotation et noms individuels gérés pièce par pièce sur toute la série.',
      'Option urgente 48h quand la date de l\'événement ne bouge pas.',
      'Multi-sponsors : plusieurs logos positionnés sur une même pièce (poitrine, dos, manches).',
    ],
    faq: [
      { q: 'Pouvez-vous floquer les noms et numéros des joueurs ?', r: "Oui, chaque maillot reçoit son numéro et son nom, avec les logos de club et de sponsors positionnés selon vos indications." },
      { q: 'Mon événement est dans une semaine, c\'est jouable ?', r: "Oui dans la plupart des cas : la production standard est de 3 à 5 jours ouvrés, et une option urgente en 48h est disponible sur demande via WhatsApp." },
      { q: 'Peut-on mettre plusieurs sponsors sur un maillot ?', r: "Oui — poitrine, dos, manches et bas de dos sont des emplacements couramment utilisés pour des logos multiples." },
    ],
    motsCles: ['maillot personnalisé Algérie', 't-shirt événement Alger', 'flocage maillot club', 'kit séminaire personnalisé'],
  },
  {
    slug: 'industrie',
    nom: 'Industrie',
    emoji: '🏭',
    title: 'Vêtements de travail industriels personnalisés — Algérie',
    description:
      "Tenues d'atelier, combinaisons et t-shirts marqués avec logo et signalétique de poste pour sites industriels. Grandes séries, livraison 58 wilayas.",
    h1: 'Vêtements de travail personnalisés pour l\'industrie',
    intro:
      "Sur un site industriel, la tenue identifie l'entreprise, le service et parfois le poste. Nous produisons combinaisons, t-shirts d'atelier et gilets marqués au logo, avec la signalétique de service quand l'organisation le demande — en séries de plusieurs centaines de pièces.",
    tenues: [
      { nom: 'Combinaison de travail', detail: 'Multipoches, logo dos et poitrine', prix: 'à partir de 5 900 DA' },
      { nom: 'T-shirt atelier', detail: 'Coton résistant, marquage service', prix: 'à partir de 1 950 DA' },
      { nom: 'Gilet de travail', detail: 'Toile multipoches brodée', prix: 'à partir de 2 500 DA' },
      { nom: 'Gilet haute visibilité', detail: 'Zones de circulation et logistique', prix: 'à partir de 1 600 DA' },
    ],
    specificites: [
      'Signalétique de service : maintenance, production, qualité et logistique différenciés par la couleur ou le marquage.',
      'Séries importantes : remise de 10% au-delà de 100 pièces, devis dédié au-delà de 500.',
      'Réassort planifié : votre fichier reste en atelier pour les commandes de renouvellement annuelles.',
    ],
    faq: [
      { q: 'Gérez-vous des commandes de plusieurs centaines de pièces ?', r: "Oui. Au-delà de 100 pièces la remise de 10% s'applique, et au-delà de 500 pièces nous établissons un devis dédié avec un planning de production échelonné." },
      { q: 'Peut-on distinguer les services sur les tenues ?', r: "Oui : couleur de vêtement différente par service, ou marquage textuel (Maintenance, Production, Qualité) ajouté sous le logo." },
      { q: 'Livrez-vous sur site industriel hors Alger ?', r: "Oui, nous livrons dans les 58 wilayas via nos partenaires logistiques, directement à l'adresse du site." },
    ],
    motsCles: ['vêtement de travail industriel Algérie', 'combinaison personnalisée logo', 'tenue atelier Alger', 'workwear entreprise DZ'],
  },
  {
    slug: 'corporate-bureaux',
    nom: 'Corporate & Bureaux',
    emoji: '💼',
    title: 'Polos et goodies corporate personnalisés — Alger',
    description:
      "Polos premium, chemises et goodies brodés pour équipes commerciales, sièges et startups en Algérie. Devis en 2h, production 3–5 jours.",
    h1: 'Polos et textiles corporate personnalisés pour vos équipes',
    intro:
      "Équipes commerciales, sièges, startups et agences : le polo brodé reste le vêtement d'entreprise le plus polyvalent — assez sobre pour un rendez-vous client, assez identifiable pour un salon. Nous travaillons la broderie fine sur piqué premium, dans les couleurs exactes de votre charte.",
    tenues: [
      { nom: 'Polo premium brodé', detail: 'Piqué coton, broderie cœur, couleur charte', prix: 'à partir de 2 300 DA' },
      { nom: 'T-shirt équipe / onboarding', detail: 'Kit de bienvenue nouvelles recrues', prix: 'à partir de 1 950 DA' },
      { nom: 'Totebag corporate', detail: 'Goodie salon et séminaire', prix: 'à partir de 950 DA' },
      { nom: 'Casquette entreprise', detail: 'Broderie structurée', prix: 'à partir de 1 200 DA' },
    ],
    specificites: [
      'Respect de la charte graphique : nous calons les couleurs de fil au plus près de vos références de marque.',
      'Vectorisation offerte : un logo en JPG ou PNG est retravaillé gratuitement pour la broderie.',
      'Petites séries acceptées : une équipe de 8 personnes est une commande normale chez nous.',
    ],
    faq: [
      { q: 'Faites-vous des commandes pour une petite équipe de 10 personnes ?', r: "Oui, il n'y a pas de minimum de commande : nous produisons à partir d'une pièce. Les remises volume commencent à 50 pièces." },
      { q: 'Mon logo est en JPG, est-ce suffisant ?', r: "Oui. La vectorisation est offerte pour toute commande : nous reconstruisons votre logo en fichier vectoriel exploitable en broderie ou en impression." },
      { q: 'Pouvez-vous respecter les couleurs exactes de notre charte ?', r: "Nous calons les fils de broderie et les encres au plus près de vos références Pantone ou hexadécimales, et vous validez un visuel avant lancement de la production." },
    ],
    motsCles: ['polo entreprise brodé Alger', 'goodies corporate Algérie', 'textile personnalisé startup', 'polo logo entreprise DZ'],
  },
]

export function getSecteur(slug: string) {
  return SECTEURS.find(s => s.slug === slug)
}

/** Grille tarifaire publique — reprise du calcul du configurateur. */
export const PALIERS = [
  { volume: '1 – 49 pièces', remise: 'Prix catalogue', detail: 'Aucun minimum de commande' },
  { volume: '50 – 99 pièces', remise: '−5%', detail: 'Remise appliquée automatiquement' },
  { volume: '100 pièces et +', remise: '−10%', detail: 'Tarif équipe complète' },
  { volume: '500 pièces et +', remise: 'Devis dédié', detail: 'Planning de production échelonné' },
]

export const PRODUITS_B2B = [
  { nom: 'T-shirt', prix: 1950, detail: '100% coton — broderie ou DTF' },
  { nom: 'Polo', prix: 2300, detail: 'Piqué coton premium' },
  { nom: 'Gilet de travail', prix: 2500, detail: 'Multipoches, toile résistante' },
  { nom: 'Gilet de sécurité', prix: 1600, detail: 'Haute visibilité rétroréfléchissant' },
  { nom: 'Casquette', prix: 1200, detail: 'Broderie structurée' },
  { nom: 'Totebag', prix: 950, detail: 'Coton canvas, impression DTF' },
  { nom: 'Tablier', prix: 1500, detail: 'Cuisine, commerce et atelier' },
  { nom: 'Combinaison de travail', prix: 5900, detail: 'Professionnelle multipoches' },
]

export const TECHNIQUES = [
  {
    nom: 'Broderie machine',
    ideal: 'Polos, casquettes, blouses, gilets',
    detail:
      "Fil polyester piqué directement dans le textile. C'est la technique la plus durable : elle résiste au lavage à 60 °C et ne se décolle pas. Rendu haut de gamme, idéal pour un logo d'entreprise en petite taille.",
  },
  {
    nom: 'Impression DTF',
    ideal: 'T-shirts, totebags, visuels multicolores',
    detail:
      "Transfert numérique full color : dégradés, photos et logos complexes sont reproduits fidèlement, sans surcoût lié au nombre de couleurs. Souple au toucher et résistant aux lavages courants.",
  },
  {
    nom: 'Sérigraphie',
    ideal: 'Grandes séries, logos 1 à 3 couleurs',
    detail:
      "Encre appliquée à travers un écran. Le coût par pièce chute sur les grands volumes : c'est la technique la plus économique au-delà de quelques centaines de pièces avec un logo simple.",
  },
]

/** FAQ de la page hub — utilisée à l'écran ET dans le JSON-LD FAQPage. */
export const FAQ_ENTREPRISES = [
  {
    q: 'Quel est le minimum de commande pour une entreprise ?',
    r: "Il n'y a aucun minimum : nous produisons à partir d'une seule pièce. Les tarifs deviennent dégressifs à 50 pièces (−5%) et à 100 pièces (−10%).",
  },
  {
    q: 'Quel est le délai de production pour des uniformes personnalisés ?',
    r: "3 à 5 jours ouvrés pour une commande standard, à compter de la validation du visuel. Une production urgente en 48h est possible sur demande.",
  },
  {
    q: 'Combien coûte un polo brodé au logo de mon entreprise en Algérie ?',
    r: "Un polo brodé démarre à 2 300 DA l'unité, un t-shirt à 1 950 DA et une casquette brodée à 1 200 DA. Le prix baisse de 5% dès 50 pièces et de 10% dès 100 pièces.",
  },
  {
    q: 'Livrez-vous les uniformes dans toute l\'Algérie ?',
    r: "Oui, nous livrons dans les 58 wilayas via nos partenaires logistiques, avec paiement à la livraison, BaridiMob ou CCP. L'atelier est basé à Alger.",
  },
  {
    q: 'Quels formats de logo acceptez-vous ?',
    r: "AI, EPS, SVG et PDF vectoriel de préférence. Si vous n'avez qu'un JPG ou un PNG, la vectorisation est offerte pour toute commande.",
  },
  {
    q: 'Broderie ou impression DTF : que choisir pour une entreprise ?',
    r: "La broderie pour les polos, casquettes, blouses et gilets — elle dure et donne un rendu haut de gamme. Le DTF pour les t-shirts et les visuels multicolores ou photographiques. Nous vous conseillons gratuitement avant la commande.",
  },
  {
    q: 'Peut-on recevoir un échantillon avant la production complète ?',
    r: "Oui, nous produisons une pièce test que vous validez avant de lancer la série entière. C'est recommandé pour les commandes de plus de 100 pièces.",
  },
  {
    q: 'Comment obtenir un devis pour équiper mon équipe ?',
    r: "Passez par le configurateur en ligne (produit, quantité, technique, logo) ou envoyez votre besoin sur WhatsApp au +213 557 440 522. Le devis chiffré est renvoyé sous 2 heures ouvrées.",
  },
  {
    q: 'Quels moyens de paiement acceptez-vous pour une commande professionnelle ?',
    r: "Paiement à la livraison, BaridiMob et CCP. Un devis écrit est confirmé avant tout lancement de production.",
  },
  {
    q: 'Peut-on commander des tailles différentes dans une même série ?',
    r: "Oui. Vous indiquez la répartition des tailles (S, M, L, XL, XXL…) dans le configurateur ou dans votre message, sans surcoût.",
  },
]

/** Preuve locale : les grandes wilayas où nous livrons le plus. */
export const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna', 'Tizi Ouzou',
  'Béjaïa', 'Tlemcen', 'Ouargla', 'Ghardaïa', 'Djelfa', 'Sidi Bel Abbès', 'Skikda', 'Béchar',
]

export const ETAPES = [
  { titre: 'Vous décrivez votre besoin', detail: 'Configurateur en ligne ou message WhatsApp : produit, quantité, technique, logo.' },
  { titre: 'Devis chiffré sous 2h', detail: 'Prix unitaire, remise volume et délai confirmés par écrit avant tout engagement.' },
  { titre: 'Validation du visuel', detail: 'Nous vectorisons votre logo gratuitement et vous envoyons un aperçu à valider.' },
  { titre: 'Production 3 à 5 jours', detail: 'Broderie, DTF ou sérigraphie dans notre atelier à Alger. Option urgente 48h.' },
  { titre: 'Livraison 58 wilayas', detail: 'Paiement à la livraison, BaridiMob ou CCP. Suivi de commande en ligne.' },
]
