import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Limitation des soumissions.
//
// `Redis.fromEnv()` lève une exception quand les variables Upstash manquent.
// Construire les limiteurs au chargement du module faisait donc échouer
// l'import entier de la route — et, sur la route de commande, aurait bloqué
// toutes les ventes parce qu'un cache n'est pas configuré. Les limiteurs sont
// donc créés à la demande, une seule fois, et leur absence est signalée sans
// interrompre la requête.
//
// Un garde-fou mémoire prend le relais quand Upstash n'est pas configuré : il
// ne couvre qu'une instance, mais il arrête un envoi en boucle depuis un même
// navigateur, ce qui est le cas le plus courant.

type Limiteur = { limit: (cle: string) => Promise<{ success: boolean }> }

function creerLimiteurUpstash(requetes: number, fenetre: `${number} ${'s' | 'm' | 'h' | 'd'}`): Limiteur | null {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(requetes, fenetre),
    })
  } catch {
    return null
  }
}

/** Fenêtre glissante en mémoire — repli quand Upstash n'est pas configuré. */
function creerLimiteurMemoire(requetes: number, fenetreMs: number): Limiteur {
  const passages = new Map<string, number[]>()
  return {
    async limit(cle: string) {
      const maintenant = Date.now()
      const recents = (passages.get(cle) ?? []).filter(t => maintenant - t < fenetreMs)
      // Purge opportuniste : la carte ne doit pas grossir indéfiniment.
      if (passages.size > 5000) passages.clear()
      if (recents.length >= requetes) {
        passages.set(cle, recents)
        return { success: false }
      }
      recents.push(maintenant)
      passages.set(cle, recents)
      return { success: true }
    },
  }
}

function limiteurParesseux(
  requetes: number,
  fenetre: `${number} ${'s' | 'm' | 'h' | 'd'}`,
  fenetreMs: number,
): Limiteur {
  let instance: Limiteur | null = null
  return {
    async limit(cle: string) {
      if (!instance) instance = creerLimiteurUpstash(requetes, fenetre) ?? creerLimiteurMemoire(requetes, fenetreMs)
      try {
        return await instance.limit(cle)
      } catch {
        // Le cache est indisponible : on laisse passer plutôt que de bloquer
        // une vraie commande, l'incident est tracé côté serveur.
        console.error('[rate-limit] limiteur indisponible, requête laissée passer')
        return { success: true }
      }
    },
  }
}

/** Endpoints publics généraux (formulaire de contact). */
export const publicApiLimiter = limiteurParesseux(5, '1 h', 60 * 60 * 1000)

/** Commandes : plus permissif qu'un formulaire de contact, mais borné. */
export const commandeLimiter = limiteurParesseux(10, '1 h', 60 * 60 * 1000)

/** Emails marketing (anti-abus). */
export const marketingLimiter = limiteurParesseux(10, '1 d', 24 * 60 * 60 * 1000)

export function getIP(request: Request): string {
  const transfere = request.headers.get('x-forwarded-for')
  // `x-forwarded-for` peut contenir une chaîne de proxys : la première entrée
  // est le client d'origine.
  if (transfere) return transfere.split(',')[0].trim()
  return request.headers.get('x-real-ip') || '127.0.0.1'
}
