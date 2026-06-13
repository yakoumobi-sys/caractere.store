import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 0

async function getStats() {
  const [commandesRes, produitsRes] = await Promise.all([
    supabaseAdmin.from('commandes').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('produits').select('*').eq('actif', true),
  ])
  const commandes = commandesRes.data ?? []
  const total_ca = commandes.reduce((sum, c) => sum + (c.prix_total || 0), 0)
  const nouvelles = commandes.filter(c => c.statut === 'nouveau').length
  const en_cours = commandes.filter(c => c.statut === 'en_cours').length
  return {
    total_commandes: commandes.length,
    nouvelles,
    en_cours,
    total_ca,
    total_produits: produitsRes.data?.length ?? 0,
    dernieres: commandes.slice(0, 8),
  }
}

const STATUT_COLORS: Record<string, string> = {
  nouveau:  'bg-blue-50 text-blue-700',
  en_cours: 'bg-orange-50 text-orange-700',
  termine:  'bg-green-50 text-green-700',
  annule:   'bg-red-50 text-red-700',
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <h1 className="text-[24px] font-bold tracking-tight mb-2">Dashboard</h1>
      <p className="text-[14px] text-brand-gray mb-8">Vue d'ensemble de Caractère Store</p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Commandes totales', value: stats.total_commandes, icon: '📦', color: 'text-brand-dark' },
          { label: 'Nouvelles',         value: stats.nouvelles,       icon: '🆕', color: 'text-blue-600'  },
          { label: 'En cours',          value: stats.en_cours,        icon: '⚙️', color: 'text-orange-600'},
          { label: 'CA total (DA)',     value: stats.total_ca.toLocaleString('fr-FR'), icon: '💰', color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[20px] p-6 border border-black/[0.06]">
            <div className="text-[28px] mb-1">{s.icon}</div>
            <div className={`text-[28px] font-bold tracking-tight ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-brand-gray mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-[20px] border border-black/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-black/[0.06]">
          <h2 className="text-[16px] font-semibold tracking-tight">Dernières commandes</h2>
          <a href="/admin/commandes" className="text-[13px] text-blue-600 no-underline hover:underline">Voir tout →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {['Référence','Client','Produit','Qté','Total','Statut','Date'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold tracking-widest uppercase text-brand-gray px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.dernieres.map((c: any) => (
                <tr key={c.id} className="border-b border-black/[0.04] hover:bg-brand-light/50">
                  <td className="px-6 py-4 text-[13px] font-mono font-medium">{c.reference}</td>
                  <td className="px-6 py-4 text-[13px]">{c.nom_client}</td>
                  <td className="px-6 py-4 text-[13px]">{c.produit}</td>
                  <td className="px-6 py-4 text-[13px]">{c.quantite}</td>
                  <td className="px-6 py-4 text-[13px] font-medium">{(c.prix_total||0).toLocaleString('fr-FR')} DA</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUT_COLORS[c.statut] ?? 'bg-gray-50 text-gray-600'}`}>
                      {c.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-brand-gray">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
              {stats.dernieres.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-brand-gray text-[14px]">Aucune commande pour l'instant</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
