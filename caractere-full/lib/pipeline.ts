// Parcours de la commande chez Caractère :
// Le commercial configure la commande (client, articles, technique) -> elle
// part dans la file de l'atelier concerné -> chaque prise en charge change
// son statut -> une fois prête, retour au commercial pour livraison.

export type Technique = "dtf" | "broderie" | "flocage" | "aucune";

export type OrderStatus =
  | "attente_dtf"
  | "impression_dtf"
  | "attente_flocage"
  | "en_flocage"
  | "attente_broderie"
  | "en_broderie"
  | "attente_gros"
  | "en_preparation_gros"
  | "prete"
  | "livree"
  | "attente_yalidine"
  | "payee";

export type QueueName = "dtf" | "flocage" | "broderie" | "gros" | "ready" | "delivery";

export const TECHNIQUES: { value: Technique; label: string }[] = [
  { value: "dtf", label: "DTF" },
  { value: "flocage", label: "Flocage" },
  { value: "broderie", label: "Broderie" },
  { value: "aucune", label: "Rien (commande gros)" },
];

export const LOGO_PLACEMENTS: { value: string; label: string }[] = [
  { value: "coeur", label: "Coeur" },
  { value: "coeur_dos", label: "Coeur + dos" },
  { value: "dos", label: "Dos" },
  { value: "poitrine", label: "Poitrine" },
  { value: "special", label: "Spécial (préciser)" },
];

export const LOGO_SOURCES: { value: string; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "viber", label: "Viber" },
  { value: "email", label: "Email" },
];

/** Statut de départ dès que le commercial valide la technique choisie */
export function initialStatus(technique: Technique): OrderStatus {
  if (technique === "dtf") return "attente_dtf";
  if (technique === "flocage") return "attente_flocage";
  if (technique === "broderie") return "attente_broderie";
  return "attente_gros";
}

interface StatusDef {
  value: OrderStatus;
  label: string;
  /** File dans laquelle la commande apparaît, ou null si terminée */
  queue: QueueName | null;
  /** Département RH suggéré pour l'assignation à cette étape */
  department: string | null;
  /** Statut suivant quand on clique sur le bouton d'action */
  next: OrderStatus | null;
  /** Libellé du bouton d'action ("Prendre la commande", "Marquer imprimée"...) */
  action: string | null;
}

export const STATUS_DEFS: Record<OrderStatus, StatusDef> = {
  attente_dtf: {
    value: "attente_dtf",
    label: "En attente (DTF)",
    queue: "dtf",
    department: "Atelier DTF",
    next: "impression_dtf",
    action: "Prendre la commande",
  },
  impression_dtf: {
    value: "impression_dtf",
    label: "Impression en cours",
    queue: "dtf",
    department: "Atelier DTF",
    next: null, // Déterminé dynamiquement selon requires_flocage
    action: "Marquer terminée",
  },
  attente_flocage: {
    value: "attente_flocage",
    label: "En attente (Flocage)",
    queue: "flocage",
    department: "Atelier Flocage",
    next: "en_flocage",
    action: "Prendre la commande",
  },
  en_flocage: {
    value: "en_flocage",
    label: "En flocage",
    queue: "flocage",
    department: "Atelier Flocage",
    next: "prete",
    action: "Marquer terminée",
  },
  attente_broderie: {
    value: "attente_broderie",
    label: "En attente (Broderie)",
    queue: "broderie",
    department: "Atelier Broderie",
    next: "en_broderie",
    action: "Prendre la commande",
  },
  en_broderie: {
    value: "en_broderie",
    label: "En broderie",
    queue: "broderie",
    department: "Atelier Broderie",
    next: "prete",
    action: "Marquer terminée",
  },
  attente_gros: {
    value: "attente_gros",
    label: "En attente (commande gros)",
    queue: "gros",
    department: null,
    next: "en_preparation_gros",
    action: "Prendre la commande",
  },
  en_preparation_gros: {
    value: "en_preparation_gros",
    label: "En préparation",
    queue: "gros",
    department: null,
    next: "prete",
    action: "Marquer terminée",
  },
  prete: {
    value: "prete",
    label: "Prête à livrer",
    queue: "ready",
    department: "Commercial",
    next: "livree",
    action: "Envoyer à Yalidine/Alger",
  },
  livree: {
    value: "livree",
    label: "Chez Yalidine/Alger",
    queue: "delivery",
    department: "Commercial",
    next: "attente_yalidine",
    action: "En attente de récupération",
  },
  attente_yalidine: {
    value: "attente_yalidine",
    label: "En attente (client récupère)",
    queue: "delivery",
    department: "Commercial",
    next: "payee",
    action: "Confirmer récupération + paiement",
  },
  payee: {
    value: "payee",
    label: "Livrée et payée ✓",
    queue: null,
    department: null,
    next: null,
    action: null,
  },
};

export const ALL_STATUSES = Object.values(STATUS_DEFS);

export function statusLabel(status: string) {
  return STATUS_DEFS[status as OrderStatus]?.label ?? status;
}

export function statusesForQueue(queue: QueueName): OrderStatus[] {
  return ALL_STATUSES.filter((s) => s.queue === queue).map((s) => s.value);
}

export const QUEUE_TITLES: Record<QueueName, string> = {
  dtf: "File DTF",
  flocage: "File Flocage",
  broderie: "File Broderie",
  gros: "Commande gros",
  ready: "Commandes prêtes",
  delivery: "Livraison Yalidine/Alger",
};

/**
 * Calcule le prochain statut en tenant compte du contexte (ex: flocage optionnel après DTF)
 *
 * @param currentStatus - Statut actuel
 * @param order - Données de la commande (pour require_flocage, etc.)
 * @returns Le statut suivant, ou null si terminal
 */
export function getNextStatus(
  currentStatus: OrderStatus,
  order?: { requires_flocage?: boolean }
): OrderStatus | null {
  // Si on est en impression_dtf et pas de flocage requis, aller directement à prete
  if (currentStatus === "impression_dtf" && order && !order.requires_flocage) {
    return "prete";
  }

  // Sinon, utiliser le next statut par défaut
  const statusDef = STATUS_DEFS[currentStatus];
  return statusDef?.next ?? null;
}
