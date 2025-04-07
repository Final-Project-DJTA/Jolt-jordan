"use client"

import { useEffect, useState } from "react"
// Import your UI components
import CursorEffect from "@/components/ui/cursor-effect"
import JobAlert from "@/components/ui/job-alert"

export default function ClientComponents() {
  // Only render after component mounts on client
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render nothing during SSR
  if (!mounted) {
    return null
  }

  return (
    <>
      <CursorEffect />
      <JobAlert />
    </>
  )
}