import ProfileForm from "@/components/profile/profile-form"

export default function EditProfilePage() {
  // Mock user data - in a real app, this would come from your database
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    username: "johndoe",
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Edit Profile</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

