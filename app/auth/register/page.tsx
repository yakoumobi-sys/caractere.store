import { redirect } from 'next/navigation'

// /auth/register et /auth/signup étaient deux formulaires d'inscription quasi
// identiques, tous deux branchés en direct sur Supabase — /auth/signup est
// devenu la version canonique (même thème visuel que /auth/login, et route
// désormais aussi vers l'onboarding). On garde cette route en redirection
// plutôt que de la supprimer, pour ne pas casser un lien externe/marque-page
// existant vers /auth/register.
export default function RegisterRedirect() {
  redirect('/auth/signup')
}
