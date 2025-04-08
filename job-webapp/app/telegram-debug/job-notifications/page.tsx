"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"

export default function JobNotificationsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendJobRecommendations = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch("/api/telegram/send-job-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send job recommendations")
      }

      setResults(data.results)
      toast({
        title: "Success",
        description: data.message || "Job recommendations sent successfully",
      })
    } catch (error) {
      console.error("Error sending job recommendations:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send job recommendations",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Job Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send Job Recommendations</CardTitle>
          <CardDescription>
            Send job recommendations to users via Telegram based on their tag preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will find all users with verified Telegram accounts, match their tags with jobs,
            and send them personalized job recommendations. Users will not receive duplicate 
            recommendations for jobs they have already interacted with.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <Alert variant={results.messagesSent > 0 ? "default" : "warning"} className={`mb-4 ${results.messagesSent > 0 ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
              {results.messagesSent > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Info className="h-4 w-4 text-yellow-500" />
              )}
              <AlertTitle>
                {results.messagesSent > 0 ? 'Results' : 'No messages sent'}
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1">
                  <p>Total users: {results.users}</p>
                  <p>Users with Telegram: {results.usersWithTelegram}</p>
                  <p>Messages sent: {results.messagesSent}</p>
                  <p>Jobs found: {results.jobsFound}</p>
                  <p>Already interacted jobs: {results.alreadyInteracted || 0}</p>
                  <p>Filtered duplicates: {results.filteredDuplicates || 0}</p>
                  <p>Errors: {results.errors}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSendJobRecommendations} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {isLoading ? "Sending..." : "Send Job Recommendations"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}