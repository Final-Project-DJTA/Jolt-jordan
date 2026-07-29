import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import ClientLayout from "../layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jolt Jordan",
  description: "A job board for developers",
  generator: 'vo.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}