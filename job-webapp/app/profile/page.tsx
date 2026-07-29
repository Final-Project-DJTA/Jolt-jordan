"use client";

import { useState, useEffect } from "react"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import JobPreferenceTags from "@/components/profile/job-preference-tags"
import { toast } from "@/hooks/use-toast"
import { Suspense } from "react"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setAuthError(false);
        
        console.log("Fetching profile data...");
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Critical for sending cookies
          cache: 'no-store',
        });

        console.log("Profile API response status:", response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log("Auth error - redirecting to login");
            setAuthError(true);
            
            // Show error message before redirect
            toast({
              title: "Authentication Error",
              description: "Please login to view your profile",
              variant: "destructive",
            });
            
            // Delay redirect slightly to allow toast to show
            setTimeout(() => {
              router.push("/login");
            }, 1000);
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data received");
        
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only run fetch on client side
    if (typeof window !== 'undefined') {
      fetchProfile();
    }
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-gray-600 mb-4">Please login to view your profile</p>
        <button 
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {searchParams.get("welcome") === "true" && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 text-primary p-4 mb-8 rounded-lg"
        >
          <motion.div className="flex items-center justify-between">
            <p className="text-lg font-medium">
              Welcome to Jolt Jordan! 🎉 Your profile has been created.
            </p>
            <Image
              src="/assets/welcome.svg"
              alt="Welcome"
              width={80}
              height={80}
              className="object-contain" 
            />
          </motion.div>
        </motion.div>
      )}
      <ProfileHeader user={user} />
      <div className="mt-8">
        <ProfileTabs user={user} />
      </div>
      
      {user && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Job Preferences</h2>
          <JobPreferenceTags 
            userTags={user?.profile?.tags || []} 
            onTagsUpdated={(newTags) => {
              setUser(prevUser => ({
                ...prevUser,
                profile: {
                  ...prevUser.profile,
                  tags: newTags
                }
              }));
            }}
          />
        </div>
      )}
    </div>
  );
}

