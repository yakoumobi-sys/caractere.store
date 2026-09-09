import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.caracteredz.com'

const DISALLOW = ['/admin', '/api', '/dashboard', '/auth']

// Les moteurs de réponse IA (ChatGPT, Claude, Gemini, Perplexity, Copilot) ne
// passent pas par Googlebot : chacun a son propre robot, et plusieurs
// n'explorent que ce qui les autorise explicitement. On les nomme un par un
// pour être citable dans leurs réponses, tout en gardant l'admin fermé.
const AI_CRAWLERS = [
  'GPTBot',            // OpenAI — entraînement et index
  'OAI-SearchBot',     // OpenAI — index de ChatGPT Search
  'ChatGPT-User',      // OpenAI — navigation déclenchée par un utilisateur
  'ClaudeBot',         // Anthropic — index
  'Claude-User',       // Anthropic — navigation déclenchée par un utilisateur
  'Claude-SearchBot',  // Anthropic — recherche
  'anthropic-ai',
  'PerplexityBot',     // Perplexity — index
  'Perplexity-User',   // Perplexity — navigation déclenchée par un utilisateur
  'Google-Extended',   // Google — Gemini / AI Overviews
  'Applebot',          // Apple — Siri / Spotlight
  'Applebot-Extended',
  'Bingbot',           // Microsoft — Bing et Copilot
  'meta-externalagent',// Meta AI
  'Amazonbot',
  'DuckAssistBot',
  'cohere-ai',
  'YouBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_CRAWLERS.map(userAgent => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
