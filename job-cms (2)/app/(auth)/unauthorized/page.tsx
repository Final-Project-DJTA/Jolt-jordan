"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function UnauthorizedPage() {
  const { logout } = useAuth()
  
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
        <AlertTriangle className="h-10 w-10 text-yellow-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Access Denied</h1>
      <p className="mt-2 max-w-md text-center text-muted-foreground">
        You don&apos;t have permission to access this page. Please contact an administrator if you believe this is a
        mistake.
      </p>
      <div className="mt-6 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="default" onClick={logout}>
          Log Out
        </Button>
      </div>
    </div>
  )
}