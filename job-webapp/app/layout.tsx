import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import CursorEffect from "@/components/ui/cursor-effect"
import JobAlert from "@/components/ui/job-alert"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jolt Jordan - Find Your Dream Job",
  description: "A platform to find and apply for jobs",
    generator: 'v0.dev'
}

// Add this script to the head
const cacheControlScript = `
  window.purgeImageCache = function(url) {
    // Create a new image element with cache-busting
    const img = new Image();
    const bustCache = url.includes('?') ? '&' : '?';
    img.src = url + bustCache + '_=' + Date.now();
    
    // Force fetch
    fetch(url, {cache: 'reload', mode: 'no-cors'})
      .catch(() => console.log('Cache invalidation attempted'));
      
    return img;
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en"
    suppressHydrationWarning={true}>
      <head>
        {/* Add the cache purging script */}
        <script dangerouslySetInnerHTML={{ __html: cacheControlScript }} />
        {/* Other head content */}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CursorEffect />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <JobAlert />
        </ThemeProvider>
      </body>
    </html>
  )
}