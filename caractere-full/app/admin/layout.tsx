'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col py-6 px-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-[16px] font-bold text-white">C</div>
          <div>
            <div className="text-[14px] font-bold text-slate-900 dark:text-white">CARACTÈRE</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">ERP SYSTEM</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {/* General Section */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-4 mb-2 uppercase tracking-wider">Général</div>

            {/* Add Alert Button - Prominent */}
            <Link href="/admin/alerts/new" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-[13px] hover:shadow-lg transition-all no-underline mb-2">
              <span>➕</span>
              <span>Ajouter une alerte</span>
            </Link>

            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[13px] no-underline">
              <span>📊</span>
              <span>Tableau de bord</span>
            </Link>
          </div>

          {/* Production Section */}
          <div className="mb-6">
            <button
              onClick={() => setExpandedSection(expandedSection === 'production' ? null : 'production')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span>🏭</span>
                <span>Production</span>
              </div>
              <span className={`transition-transform ${expandedSection === 'production' ? 'rotate-180' : ''}`}>
                ^
              </span>
            </button>

            {expandedSection === 'production' && (
              <div className="mt-1 ml-4 flex flex-col gap-1 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                <Link href="/admin/production/vue-ensemble" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  Vue d'ensemble
                </Link>
                <Link href="/admin/production/new" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  + Nouvelle commande
                </Link>
                <Link href="/admin/queues/dtf" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  File DTF
                </Link>
                <Link href="/admin/queues/flocage" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  Flocage
                </Link>
                <Link href="/admin/queues/broderie" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  File Broderie
                </Link>
                <Link href="/admin/production/commande-gros" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  Commande gros
                </Link>
                <Link href="/admin/production/pret" className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 no-underline">
                  Commandes prêtes
                </Link>
              </div>
            )}
          </div>

          {/* CRM Section */}
          <div className="mb-6">
            <Link href="/admin/clients" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>👤</span>
              <span>CRM</span>
            </Link>
          </div>

          {/* Sales Section */}
          <div className="mb-6">
            <Link href="/admin/ventes" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>🛒</span>
              <span>Ventes</span>
            </Link>
          </div>

          {/* Service Client Section */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-4 mb-2 uppercase tracking-wider">Service Client</div>
            <Link href="/admin/reclamations" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>📝</span>
              <span>Réclamations</span>
            </Link>
          </div>

          {/* Purchases Section */}
          <div className="mb-6">
            <Link href="/admin/achats" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>🔒</span>
              <span>Achats</span>
            </Link>
          </div>

          {/* Stock Section */}
          <div className="mb-6">
            <Link href="/admin/stock" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>📦</span>
              <span>Stock</span>
            </Link>
          </div>

          {/* Accounting Section */}
          <div className="mb-6">
            <Link href="/admin/comptabilite" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>📊</span>
              <span>Comptabilité</span>
            </Link>
          </div>

          {/* Analytics Section */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-4 mb-2 uppercase tracking-wider">Analytics</div>
            <Link href="/admin/rapports" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors no-underline">
              <span>📈</span>
              <span>Rapports & Prévisions</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-[12px] text-slate-600 dark:text-slate-400">U</span>
            <button className="text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
