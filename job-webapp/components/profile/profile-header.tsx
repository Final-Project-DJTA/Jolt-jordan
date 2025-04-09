import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { UserType } from "@/types"
import { Edit } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import NextImage from "next/image"  // Rename to avoid collision

interface ProfileHeaderProps {
  user: UserType | null // Mark as potentially null
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // Keep track of whether image successfully loaded
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Add null check to prevent error
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  
  // Reset image loaded state whenever user changes
  useEffect(() => {
    setImageLoaded(false);
    
    // Preload image to check if it works - add null check
    if (user?.profile?.avatar) {
      // Use the browser's native Image constructor
      const img = new window.Image();  // Use window.Image instead of Image
      const timestamp = Date.now();
      img.src = `${user.profile.avatar}${user.profile.avatar.includes('?') ? '&' : '?'}t=${timestamp}`;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false);
    }
  }, [user?.profile?.avatar]);

  // If user is null, show a loading state or placeholder
  if (!user) {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="h-24 w-24 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
          <span className="text-2xl font-medium text-gray-400">...</span>
        </div>
        <div className="flex-1">
          <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Avatar section */}
      <div className="h-24 w-24 relative rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-foreground">
        {user?.profile?.avatar && imageLoaded ? (
          // Direct img tag with proper error handling
          <img 
            src={`${user.profile.avatar}${user.profile.avatar.includes('?') ? '&' : '?'}t=${Date.now()}`}
            alt={user.name || "User avatar"}
            className="h-full w-full object-cover"
            onLoad={() => console.log("Avatar loaded successfully")}
            onError={() => {
              console.log("Avatar failed to load");
              setImageLoaded(false);
            }}
          />
        ) : (
          // Fallback to initials
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-2xl font-medium">{initials}</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Add optional chaining to prevent null errors */}
            <h1 className="text-2xl font-bold text-primary">{user?.name || "Unknown User"}</h1>
            <p className="text-gray-500">@{user?.username || "username"}</p>
            {user?.profile?.location && <p className="text-gray-600 mt-1">{user.profile.location}</p>}
          </div>

          <Link href="/profile/edit">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
        
        {/* Display job position instead of bio */}
        {user?.profile?.jobPosition && <p className="mt-4 text-gray-700">{user.profile.jobPosition}</p>}

        {/* Skills section */}
        {user?.profile?.skills && user.profile.skills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
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

