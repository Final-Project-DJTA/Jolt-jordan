"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddJobFAB() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button asChild size="lg" className="rounded-full h-14 w-14 shadow-lg">
        <Link href="/jobs/new">
          <PlusCircle className="h-6 w-6" />
          <span className="sr-only">Add New Job</span>
        </Link>
      </Button>
    </div>
  )
}

