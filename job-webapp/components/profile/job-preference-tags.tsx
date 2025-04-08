"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/hooks/use-toast"
import { X } from "lucide-react" 

interface JobPreferenceTagsProps {
  userTags: string[]
  onTagsUpdated: (newTags: string[]) => void
}

export default function JobPreferenceTags({ userTags = [], onTagsUpdated }: JobPreferenceTagsProps) {
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(userTags)
  const [isLoading, setIsLoading] = useState(true)
  const [actionTag, setActionTag] = useState<{tag: string; action: 'adding' | 'removing'} | null>(null)
  
  // Fetch all unique tags from jobs collection
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags", {
          credentials: "include",
          cache: "no-store"
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tags: ${response.status}`)
        }
        
        const data = await response.json()
        setAllTags(data.tags || [])
      } catch (error) {
        console.error("Error fetching tags:", error)
        toast({
          title: "Error",
          description: "Failed to load job tags. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTags()
  }, [])
  
  // Update selected tags when userTags prop changes
  useEffect(() => {
    setSelectedTags(userTags)
  }, [userTags])

  const handleTagSelect = async (tag: string) => {
    if (selectedTags.includes(tag)) return // Tag already selected
    
    // Show loading state for this specific tag
    setActionTag({ tag, action: 'adding' })
    
    try {
      const response = await fetch("/api/profile/tags", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ tag }),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to update tags")
      }
      
      // Update the local state
      const updatedTags = [...selectedTags, tag]
      setSelectedTags(updatedTags)
      onTagsUpdated(updatedTags)
      
      toast({
        title: "Success",
        description: `Added "${tag}" to your job preferences`,
      })
    } catch (error) {
      console.error("Error updating tags:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update job preferences",
        variant: "destructive"
      })
    } finally {
      setActionTag(null)
    }
  }

  // Updated to handle authentication issues more gracefully
  const handleTagRemove = async (tag: string) => {
    // Show loading state for this specific tag
    setActionTag({ tag, action: 'removing' })
    
    try {
      // First check if we're logged in by making a simple request
      const authCheckResponse = await fetch("/api/profile", {
        method: "GET",
        credentials: "include"
      });
      
      if (!authCheckResponse.ok) {
        // If not authenticated, show appropriate message
        if (authCheckResponse.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          });
          
          // You might want to redirect to login here
          // window.location.href = "/login";
          return;
        }
      }
      
      // Use POST with action=remove
      const response = await fetch("/api/profile/tags", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add cache control to prevent caching issues
          "Cache-Control": "no-cache"
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ tag, action: 'remove' }),
        cache: "no-store"
      });
      
      let errorMessage = "Failed to remove tag";
      
      // Handle various response scenarios
      if (response.status === 401) {
        errorMessage = "You need to be logged in to update preferences";
      } else if (response.status === 404) {
        errorMessage = "User profile not found";
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error:", errorData);
        errorMessage = errorData.error || errorData.details || "Failed to remove tag";
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        throw new Error(errorMessage);
      }
      
      // Update the local state by filtering out the removed tag
      const updatedTags = selectedTags.filter(t => t !== tag);
      setSelectedTags(updatedTags);
      onTagsUpdated(updatedTags);
      
      toast({
        title: "Success",
        description: `Removed "${tag}" from your job preferences`,
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove job preference",
        variant: "destructive"
      });
    } finally {
      setActionTag(null);
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-3">Job Preference Tags</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          const isLoading = actionTag?.tag === tag;
          
          return (
            <Button
              key={tag}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => isSelected ? handleTagRemove(tag) : handleTagSelect(tag)}
              disabled={isLoading}
              className={`${isSelected 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-primary hover:text-primary-foreground"} 
                transition-all`}
            >
              {isLoading && (
                <Spinner size="sm" className="mr-2" />
              )}
              
              {tag}
              
              {isSelected && !isLoading && (
                <X className="ml-2 h-3 w-3" />
              )}
            </Button>
          );
        })}
        
        {allTags.length === 0 && (
          <p className="text-sm text-muted-foreground">No job tags available</p>
        )}
      </div>
      
      {selectedTags.length > 0 && (
        <p className="text-sm text-muted-foreground">
          You have selected {selectedTags.length} job preference tags
          {selectedTags.length > 0 && " — click on a highlighted tag to remove it"}
        </p>
      )}
    </div>
  )
}