import Link from 'next/link'

const navItems = [
  { href: '/admin',           icon: '📊', label: 'Dashboard'  },
  { href: '/admin/commandes', icon: '📦', label: 'Commandes'  },
  { href: '/admin/produits',  icon: '👕', label: 'Produits'   },
  { href: '/admin/couleurs',  icon: '🎨', label: 'Couleurs'   },
  { href: '/admin/tailles',   icon: '📏', label: 'Tailles'    },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-dark flex-shrink-0 flex flex-col py-8 px-4">
        <div className="flex items-center gap-3 px-3 mb-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[14px] font-bold text-brand-dark">C</div>
          <div>
            <div className="text-[13px] font-bold text-white">Caractère</div>
            <div className="text-[11px] text-white/40">Admin</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all no-underline">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/40 hover:text-white/60 no-underline transition-colors">
            ← Voir le site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
