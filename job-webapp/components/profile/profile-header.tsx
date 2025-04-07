import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { UserType } from "@/types"
import { Edit } from "lucide-react"
import Link from "next/link"

interface ProfileHeaderProps {
  user: UserType
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.profile?.avatar} alt={user.name} />
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{user.name}</h1>
            <p className="text-gray-500">@{user.username}</p>
            {user.profile?.location && <p className="text-gray-600 mt-1">{user.profile.location}</p>}
          </div>

          <Link href="/profile/edit">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {user.profile?.bio && <p className="mt-4 text-gray-700">{user.profile.bio}</p>}

        {user.profile?.skills && user.profile.skills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

