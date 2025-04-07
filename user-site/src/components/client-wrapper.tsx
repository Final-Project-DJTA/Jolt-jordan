"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Move the dynamic import to this client component
const ClientComponents = dynamic(
  () => import("./client-components"),
  { ssr: false }
)

export default function ClientWrapper() {
  return (
    <Suspense fallback={null}>
      <ClientComponents />
    </Suspense>
  )
}