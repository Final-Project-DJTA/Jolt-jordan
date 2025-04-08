"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { deleteJob } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteJobDialogProps {
  jobId: string
  jobName: string
}

interface Company {
  name: string;
  logo?: string;
  industry: string;
  size: string;
  headquarters: string;
  website: string;
}

interface JobDetail {
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

interface Job {
  _id: string;
  name: string;
  company: Company;
  location: string;
  description: string;
  salary: string;
  category: string;
  createdAt: string;
  detail: JobDetail;
}

export function DeleteJobDialog({ jobId, jobName }: DeleteJobDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [job, setJob] = useState<Job | null>(null)

  const handleDelete = async () => {

    try {
      const response = await fetch (`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      setOpen(false)
      router.push("/jobs")
      router.refresh();
    } catch (error) {
      console.error('Error deleting the job:', error)
    }
    // deleteJob(jobId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the job "{jobName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

