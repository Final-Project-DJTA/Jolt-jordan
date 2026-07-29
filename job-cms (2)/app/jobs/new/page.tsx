import { ProtectedRoute } from "@/components/add-protected-route"
import { JobForm } from "@/components/job-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewJobPage() {
  return (
    <ProtectedRoute>
    <div className="space-y-6">
      <Card className="bg-secondary/10 border-secondary">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Create New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add a new job vacancy to your listings. Fill out the form below with all the required information.
          </p>
        </CardContent>
      </Card>

      <JobForm />
    </div>
    </ProtectedRoute>
  )
}

