import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AddJobFAB } from "@/components/add-job-fab"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jojo CMS - Job Vacancy Management",
  description: "A comprehensive CMS for managing job vacancies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
    lang="en"
    suppressHydrationWarning={true}
    >
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-background p-6">
              {children}
              <AddJobFAB />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'