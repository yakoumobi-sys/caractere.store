import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
 try {
   const [leadsRes, commandesRes] = await Promise.all([
     supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false }),
     supabaseAdmin.from('commandes').select('nom_client, telephone, email, entreprise, created_at').order('created_at', { ascending: false }),
   ])

   const leads = leadsRes.data ?? []

   const fromCommandes = (commandesRes.data ?? []).map((c: any) => ({
     id: `cmd-${c.telephone}-${c.created_at}`,
     nom: c.nom_client,
     telephone: c.telephone,
     email: c.email || null,
     entreprise: c.entreprise || null,
     wilaya: null,
     source: 'Commande',
     created_at: c.created_at,
     tags: ['client'],
   }))

   const seen = new Set<string>()
   const all = [...leads, ...fromCommandes].filter(c => {
     const key = c.telephone?.replace(/\D/g, '')
     if (!key || seen.has(key)) return false
     seen.add(key)
     return true
   })

   const stats = {
     total: all.length,
     avec_email: all.filter(c => c.email).length,
     avec_entreprise: all.filter(c => c.entreprise).length,
     clients: fromCommandes.length,
     leads: leads.length,
   }

   return NextResponse.json({ contacts: all, stats })
 } catch (err) {
   console.error(err)
   return NextResponse.json({ contacts: [], stats: {} }, { status: 500 })
 }
}
