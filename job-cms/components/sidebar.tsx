"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Briefcase, LogOut, PlusCircle, LogIn } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/data"

export function Sidebar() {
  const pathname = usePathname()
  // For demo purposes, we'll assume the user is logged in
  const isLoggedIn = true

  const routes = [
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
    },
  ]

  return (
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
            <span className="text-lg font-bold text-white">Jojo</span>
            <span className="text-lg font-bold text-secondary"> Jobs</span>
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
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="relative h-8 w-8 rounded-full bg-primary-foreground/10">
                {currentUser.profile?.avatar && (
                  <img
                    src={currentUser.profile.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-primary-foreground">{currentUser.name}</p>
                <p className="text-xs text-primary-foreground/70">{currentUser.email}</p>
              </div>
            </div>
            <Button variant="ghost" className="mt-2 w-full justify-start text-primary-foreground hover:text-secondary">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </>
        ) : (
          <Button asChild variant="ghost" className="w-full justify-start text-primary-foreground hover:text-secondary">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Log in
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

