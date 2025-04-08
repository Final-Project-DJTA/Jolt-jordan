import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import CursorEffect from "@/components/ui/cursor-effect"
import JobAlert from "@/components/ui/job-alert"
import { BookmarkProvider } from "@/context/BookmarkContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jolt Jordan - Find Your Dream Job",
  description: "A platform to find and apply for jobs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en"
    suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <BookmarkProvider>
          <CursorEffect />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <JobAlert />
          <ToastContainer/>
          </BookmarkProvider>
        </ThemeProvider>
        
      </body>
    </html>
  )
}



import './globals.css'
import { ToastContainer } from "react-toastify"

