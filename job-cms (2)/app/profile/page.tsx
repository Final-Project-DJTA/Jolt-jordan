"use client"

import Link from "next/link"
import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
// import { useAuth } from "@/hooks/use-auth"


import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  console.log(user, loading , "<<<<<<");
  
  const router = useRouter()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?from=/profile')
    }
  }, [user, loading, router])

  // Show loading state or return null if user not loaded yet
  if (loading || !user) {
    return <div className="flex items-center justify-center h-96">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
              {user.profile?.avatar ? (
                <img
                  src={user.profile?.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
              )}
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.profile?.bio || "No bio provided"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.user.phoneNumber || "Not provided"}</span>
            </div>
            {user.profile?.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.profile.location}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 font-medium">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.user?.profile?.skills?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {!user.profile?.skills?.length && <p className="text-sm text-muted-foreground">No skills added yet</p>}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-medium">Resume</h3>
              {user.profile?.resume ? (
                <Link href={user.profile.resume} className="text-sm text-primary hover:underline">
                  View Resume
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-medium">Job Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Applied Jobs</span>
                  <Badge variant="outline">{user.profile?.appliedJobs?.length || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Saved Jobs</span>
                  <Badge variant="outline">{user.profile?.savedJobs?.length || 0}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}