'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase'

export function useProtected(redirectTo = '/auth/login') {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // N'exclure que /auth/* de la protection
    if (pathname.startsWith('/auth')) {
      return
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo, pathname])
}
