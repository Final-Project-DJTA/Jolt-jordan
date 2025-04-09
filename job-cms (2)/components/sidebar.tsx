"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { BarChart, Briefcase, LogOut, PlusCircle, LogIn, User, Settings, ChevronDown, ChevronUp, UserPlus, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Automatically open sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    
    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [pathname])

  // Define routes based on authentication status
  const routes = user 
  ? [
      // Routes for authenticated users
      {
        href: "/",
        icon: BarChart,
        title: "Dashboard",
      },
      {
        href: "/jobs",
        icon: Briefcase,
        title: "Jobs",
      },
      {
        href: "/jobs/new",
        icon: PlusCircle,
        title: "Add Job",
        highlight: true,
      }
    ]
  : [
      // Only show public routes for unauthenticated users
      {
        href: "/public",
        icon: BarChart,
        title: "Welcome",
      }
    ]

  // Render sidebar content function to avoid duplication
  const renderSidebarContent = () => (
    <div className="flex h-full w-64 flex-col border-r bg-primary">
      <div className="flex h-20 items-center border-b border-primary-foreground/10 px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: [0, -5, 5, -5, 5, 0], transition: { duration: 0.5 } }}
            className="h-12 w-12 relative"
          >
            <img src="/jojo-logo.svg" alt="Jojo Jobs" className="h-full w-full object-contain" />
          </motion.div>
          <div>
            <span className="text-lg font-bold text-white">Jolt</span>
            <span className="text-lg font-bold text-secondary"> Jordan</span>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {routes.map((route) => (
            <motion.div key={route.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground transition-all hover:text-secondary",
                  pathname === route.href && "bg-primary-foreground/10 text-secondary font-medium",
                  route.highlight &&
                    "bg-secondary text-primary font-medium mt-2 mb-2 hover:bg-secondary/90 hover:text-primary",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.title}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-primary-foreground/10 p-4">
        {user ? (
          <>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-full bg-primary-foreground/10 overflow-hidden">
                  {(user as any).profile?.avatar ? (
                    <img
                      src={(user as any).profile.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground/70" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-foreground">{user.name}</p>
                  <p className="text-xs text-primary-foreground/70">{user.email}</p>
                </div>
              </div>
              {isProfileOpen ? (
                <ChevronUp className="h-4 w-4 text-primary-foreground/70" />
              ) : (
                <ChevronDown className="h-4 w-4 text-primary-foreground/70" />
              )}
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pl-4 space-y-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-primary-foreground hover:text-secondary"
                    >
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-primary-foreground hover:text-secondary"
                    >
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-primary-foreground hover:text-secondary"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          // Enhanced logged-out state with login and register buttons
          <div className="space-y-2">
            <div className="px-3 py-2">
              <p className="text-sm text-primary-foreground/70 mb-2">Sign in to access more features</p>
            </div>
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Log in
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-secondary">
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary rounded-md text-white focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile sidebar with animation */}
      <div className="lg:hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 z-40 h-full w-64 overflow-hidden"
            >
              {renderSidebarContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Desktop sidebar - always visible */}
      <div className="hidden lg:block sticky top-0 left-0 h-screen w-64 overflow-hidden">
        {renderSidebarContent()}
      </div>
    </>
  )
}