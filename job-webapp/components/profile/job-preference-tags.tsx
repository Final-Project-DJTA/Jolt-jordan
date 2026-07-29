"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/hooks/use-toast"
import { X, Search } from "lucide-react" 
import { Input } from "@/components/ui/input"

interface JobPreferenceTagsProps {
  userTags: string[]
  onTagsUpdated: (newTags: string[]) => void
}

// Helper function to categorize tags
const categorizeTag = (tag: string): string => {
  tag = tag.toLowerCase();
  
  // Technology categories
  if (tag.includes("react") || tag.includes("vue") || tag.includes("angular") || 
      tag.includes("javascript") || tag.includes("typescript") || tag.includes("html") || 
      tag.includes("css") || tag.includes("frontend") || tag.includes("front-end")) {
    return "Frontend";
  }
  
  if (tag.includes("node") || tag.includes("python") || tag.includes("java") || 
      tag.includes("php") || tag.includes("ruby") || tag.includes("backend") || 
      tag.includes("back-end") || tag.includes("api")) {
    return "Backend";
  }
  
  if (tag.includes("sql") || tag.includes("mongo") || tag.includes("database") || 
      tag.includes("postgres") || tag.includes("mysql") || tag.includes("db")) {
    return "Database";
  }
  
  if (tag.includes("cloud") || tag.includes("aws") || tag.includes("azure") || 
      tag.includes("devops") || tag.includes("docker") || tag.includes("kubernetes")) {
    return "DevOps & Cloud";
  }
  
  // Job types and arrangements
  if (tag.includes("remote") || tag.includes("hybrid") || tag.includes("onsite") || 
      tag.includes("full-time") || tag.includes("part-time") || tag.includes("contract")) {
    return "Work Arrangements";
  }
  
  // Experience levels
  if (tag.includes("junior") || tag.includes("senior") || tag.includes("lead") || 
      tag.includes("manager") || tag.includes("intern") || tag.includes("director")) {
    return "Experience Level";
  }
  
  // Domains and industries
  if (tag.includes("finance") || tag.includes("health") || tag.includes("education") || 
      tag.includes("ecommerce") || tag.includes("gaming") || tag.includes("media")) {
    return "Industries";
  }
  
  // Default category for anything else
  return "Other";
}

export default function JobPreferenceTags({ userTags = [], onTagsUpdated }: JobPreferenceTagsProps) {
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(userTags)
  const [isLoading, setIsLoading] = useState(true)
  const [actionTag, setActionTag] = useState<{tag: string; action: 'adding' | 'removing'} | null>(null)
  const [categorizedTags, setCategorizedTags] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState("")
  
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
        
        // Sort tags alphabetically
        const sortedTags = (data.tags || []).sort();
        setAllTags(sortedTags)
        
        // Organize tags into categories
        const tagsByCategory: Record<string, string[]> = {};
        sortedTags.forEach(tag => {
          const category = categorizeTag(tag);
          if (!tagsByCategory[category]) {
            tagsByCategory[category] = [];
          }
          tagsByCategory[category].push(tag);
        });
        
        // Sort categories alphabetically except for "Other" which should be last
        const sortedCategories = Object.keys(tagsByCategory).sort((a, b) => {
          if (a === "Other") return 1;
          if (b === "Other") return -1;
          return a.localeCompare(b);
        });
        
        // Create a new ordered object with the sorted categories
        const orderedTags: Record<string, string[]> = {};
        sortedCategories.forEach(category => {
          orderedTags[category] = tagsByCategory[category];
        });
        
        setCategorizedTags(orderedTags);
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
          return;
        }
      }
      
      // Use POST with action=remove
      const response = await fetch("/api/profile/tags", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        credentials: "include",
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
  
  // Filter and sort "Others" tags based on search term
  const getFilteredOtherTags = (otherTags: string[]) => {
    if (!searchTerm.trim()) return otherTags;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Filter tags that contain the search term
    const filteredTags = otherTags.filter(tag => 
      tag.toLowerCase().includes(lowerSearchTerm)
    );
    
    // Sort so that tags starting with the search term appear first
    return filteredTags.sort((a, b) => {
      const aStartsWith = a.toLowerCase().startsWith(lowerSearchTerm);
      const bStartsWith = b.toLowerCase().startsWith(lowerSearchTerm);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.localeCompare(b);
    });
  };
  
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
      
      {/* Display tags by category */}
      {Object.keys(categorizedTags).length > 0 ? (
        Object.entries(categorizedTags).map(([category, tags]) => (
          <div key={category} className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">
              {category} 
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({tags.length})
              </span>
            </h4>
            
            {/* Add search input for "Others" category */}
            {category === "Other" && (
              <div className="relative mb-3">
                <Input
                  placeholder="Search other tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {/* Use filtered tags for "Others" category */}
              {(category === "Other" ? getFilteredOtherTags(tags) : tags).map((tag) => {
                const isSelected = selectedTags.includes(tag);
                const isLoading = actionTag?.tag === tag;
                
                // Highlight searched text in tags for "Others" category
                const renderTagText = () => {
                  if (category !== "Other" || !searchTerm.trim()) {
                    return tag;
                  }
                  
                  const lowerTag = tag.toLowerCase();
                  const lowerSearch = searchTerm.toLowerCase();
                  const index = lowerTag.indexOf(lowerSearch);
                  
                  if (index === -1) return tag;
                  
                  return (
                    <>
                      {tag.substring(0, index)}
                      <span className="font-bold underline">
                        {tag.substring(index, index + searchTerm.length)}
                      </span>
                      {tag.substring(index + searchTerm.length)}
                    </>
                  );
                };
                
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
                    
                    {renderTagText()}
                    
                    {isSelected && !isLoading && (
                      <X className="ml-2 h-3 w-3" />
                    )}
                  </Button>
                );
              })}
              
              {category === "Other" && searchTerm && getFilteredOtherTags(tags).length === 0 && (
                <p className="text-sm text-gray-500">No matching tags found</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No job tags available</p>
      )}
      
      {selectedTags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-muted-foreground">
            You have selected {selectedTags.length} job preference tags
            {selectedTags.length > 0 && " — click on a highlighted tag to remove it"}
          </p>
        </div>
      )}
    </div>
  )
}