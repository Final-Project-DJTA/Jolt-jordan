"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Make sure to import from navigation, not router
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Building,
  Wallet,
  Bookmark,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Confetti from "@/components/ui/confetti";
import { JobType } from "@/types";
import { useBookmark } from "@/context/BookmarkContext";
import { toast } from "@/hooks/use-toast";

interface JobDetailProps {
  job: JobType;
}

export default function JobDetail({ job }: JobDetailProps) {
  const { isBookmarked, addBookmark } = useBookmark();
  const [bookmarked, setBookmarked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [applied, setApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const router = useRouter();
  
  // Initialize state after mount to avoid hydration issues
  useEffect(() => {
    // Check bookmark status after component mounts
    setBookmarked(isBookmarked(job._id));
    // Mark router as ready after component mounts
    setRouterReady(true);
    
    // Check if user already applied
    const checkApplicationStatus = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.profile?.appliedJobs) {
            setApplied(data.profile.appliedJobs.includes(job._id));
          }
        }
      } catch (error) {
        console.error("Failed to check application status:", error);
      }
    };

    checkApplicationStatus();
  }, [job._id, isBookmarked]);

  const handleApply = async () => {
    if (!routerReady) return; // Don't proceed if router isn't ready
    
    try {
      setIsApplying(true);
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobId: job._id }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please log in to apply for this job",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }
        throw new Error(data.message);
      }
      
      setApplied(true);
      toast({
        title: "Application Submitted",
        description: "Your job application has been successfully submitted!",
        variant: "default",
      });
      
      // Set confetti position
      const applyButton = document.getElementById("apply-button");
      if (applyButton) {
        const rect = applyButton.getBoundingClientRect();
        setConfettiPos({ x: rect.x + rect.width/2, y: rect.y + rect.height/2 });
        setShowConfetti(true);
      }
    } catch (err: any) {
      toast({
        title: "Application Failed",
        description: err.message || "Failed to apply for this job",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Rest of your component code...
  // Return your JSX with the proper handling for the apply button

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{job.name}</CardTitle>
                <div className="flex items-center text-gray-500 mt-1">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{job.company.name}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Job details */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="h-4 w-4 text-gray-500 mr-2" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </TabsContent>
              
              <TabsContent value="requirements" className="mt-4">
                <ul className="list-disc pl-5 space-y-2">
                  {job.detail?.requirements?.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="responsibilities" className="mt-4">
                <ul className="list-disc pl-5 space-y-2">
                  {job.detail?.responsibilities?.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Apply for this job</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              id="apply-button"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleApply}
              disabled={applied || isApplying || !routerReady}
            >
              {isApplying ? "Applying..." : applied ? "Applied" : "Apply Now"}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              {applied 
                ? "Your application has been submitted." 
                : "This will add your profile to the company's applicant list."}
            </p>
          </CardContent>
        </Card>

        {/* Company info card or other side content */}
        <Card>
          <CardHeader>
            <CardTitle>About {job.company.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{job.company.description || "Company information not available"}</p>
          </CardContent>
        </Card>
      </div>

      <Confetti
        isActive={showConfetti}
        x={confettiPos.x}
        y={confettiPos.y}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
}

