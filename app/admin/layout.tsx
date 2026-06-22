'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin',           icon: '📊', label: 'Dashboard'  },
  { href: '/admin/commandes', icon: '📦', label: 'Commandes'  },
  { href: '/admin/produits',  icon: '👕', label: 'Produits'   },
  { href: '/admin/couleurs',  icon: '🎨', label: 'Couleurs'   },
  { href: '/admin/tailles',   icon: '📏', label: 'Tailles'    },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-brand-light flex">

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-brand-dark flex-shrink-0 flex flex-col py-8 px-4 z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-3 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[14px] font-bold text-brand-dark">C</div>
            <div>
              <div className="text-[13px] font-bold text-white">Caractere</div>
              <div className="text-[11px] text-white/40">Admin</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white/40 hover:text-white text-[18px]"
          >
            x
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all no-underline ${active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/40 hover:text-white/60 no-underline transition-colors">
            Voir le site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Topbar mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-black/[0.06] sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col gap-[5px] p-1"
          >
            <span className="w-5 h-[2px] bg-brand-dark block" />
            <span className="w-5 h-[2px] bg-brand-dark block" />
            <span className="w-5 h-[2px] bg-brand-dark block" />
          </button>
          <span className="text-[14px] font-bold text-brand-dark">Admin</span>
        </div>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
