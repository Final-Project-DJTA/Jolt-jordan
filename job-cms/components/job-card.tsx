import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Building, MapPin } from "lucide-react"

import type { JobType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface JobCardProps {
  job: JobType
  showActions?: boolean
}

export function JobCard({ job, showActions = false }: JobCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-4">
          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
            {job.company.logo ? (
              <img
                src={job.company.logo || "/placeholder.svg"}
                alt={job.company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">
                  <Link href={`/jobs/${job._id}`} className="hover:text-primary">
                    {job.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{job.company.name}</p>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary">
                {job.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {job.location}
              </div>
              <span>•</span>
              <div>{job.salary}</div>
            </div>
            <p className="text-sm line-clamp-2">{job.excerpt}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 px-4 py-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
          {showActions && (
            <div className="flex gap-2">
              <Link href={`/jobs/${job._id}/edit`} className="text-xs text-primary hover:underline">
                Edit
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href={`/jobs/${job._id}`} className="text-xs text-primary hover:underline">
                View
              </Link>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

