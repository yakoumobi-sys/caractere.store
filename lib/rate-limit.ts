import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Rate limiter pour les endpoints publics (anti-spam)
export const publicApiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1h'), // 5 requêtes par heure
})

// Rate limiter pour les emails marketing (anti-abuse)
export const marketingLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1d'), // 10 campagnes par jour
})

export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}
