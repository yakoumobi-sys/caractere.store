'use client'

import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase'

export function AdminLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut()
      localStorage.removeItem('admin_token')
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 14px',
        background: '#FEF2F2',
        border: '1.5px solid #FECACA',
        color: '#DC2626',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#FEE2E2'
        e.currentTarget.style.borderColor = '#FCA5A5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#FEF2F2'
        e.currentTarget.style.borderColor = '#FECACA'
      }}
    >
      🚪 Déconnexion
    </button>
  )
}
