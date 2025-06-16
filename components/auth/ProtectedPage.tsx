
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth-service'
import type { AuthUser } from '@/lib/services/auth-service'

interface ProtectedPageProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export function ProtectedPage({ 
  children, 
  requiredRoles = [], 
  fallback = <div>Chargement...</div> 
}: ProtectedPageProps): JSX.Element | null {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await authService.getCurrentUser()
        
        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
          router.push('/')
          return
        }

        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRoles])

  if (loading) {
    return fallback as JSX.Element
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
