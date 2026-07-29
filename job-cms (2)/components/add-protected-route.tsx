"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const isAdmin = () => user !== null && 'role' in user && user.role === 'admin'
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (adminOnly && !isAdmin()) {
        router.push("/unauthorized")
      }
    }
  }, [user, loading, adminOnly, router, isAdmin])
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  if (!user || (adminOnly && !isAdmin())) {
    return null
  }
  
  return <>{children}</>
}