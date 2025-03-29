import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"

export default function ProfilePage() {
  // Mock user data - in a real app, this would come from your database
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    username: "johndoe",
    password: "securepassword123", // Added password property
    profile: {
      avatar: "/placeholder.svg?height=100&width=100",
      location: "New York, NY",
      bio: "Experienced software developer with a passion for creating user-friendly applications.",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      appliedJobs: [],
      savedJobs: [],
    },
  }

  return (
    <div className="container mx-auto py-12">
      <ProfileHeader user={user} />
      <div className="mt-8">
        <ProfileTabs user={user} />
      </div>
    </div>
  )
}

