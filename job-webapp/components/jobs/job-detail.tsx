"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CheckCircle,
  Briefcase,
  ListChecks,
  Gift,
  Building,
  MapPin,
  Globe,
  Users,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useBookmark } from "@/context/BookmarkContext";
import Confetti from "@/components/ui/confetti";
import { toast } from "@/hooks/use-toast";
import type { JobType } from "@/types";
import { useRouter } from "next/navigation";

interface JobDetailProps {
  job: JobType;
}

export default function JobDetail({ job }: JobDetailProps) {
  const { isBookmarked, addBookmark } = useBookmark();
  const bookmarked = isBookmarked(job._id);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [applied, setApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const response = await fetch(`/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.profile && data.profile.appliedJobs) {
            setApplied(data.profile.appliedJobs.includes(job._id));
          }
        }
      } catch (error) {
        console.error("Failed to check application status:", error);
      }
    };

    checkApplicationStatus();
  }, [job._id]);

  const handleApply = async () => {
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
        
        if (res.status === 400 && data.message.includes("complete your profile")) {
          toast({
            title: "Profile Incomplete",
            description: data.message,
            variant: "destructive",
          });
          router.push("/profile/edit");
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
      
      const applyButton = document.getElementById("apply-button");
      if (applyButton) {
        const rect = applyButton.getBoundingClientRect();
        setConfettiPos({ 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        });
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

  const handleBookmark = async (e: React.MouseEvent) => {
    if (bookmarked) return;
    const success = await addBookmark(job._id);
    if (success) {
      setConfettiPos({ x: e.clientX, y: e.clientY });
      setShowConfetti(true);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container mx-auto py-12">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={job.company.logo || "/placeholder.svg"}
                    alt={job.company.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">{job.name}</h1>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{job.company.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={bookmarked}
                  onClick={handleBookmark}
                  className={`${bookmarked
                      ? "text-yellow-600 bg-yellow-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <Badge variant="outline" className="bg-primary/5 text-primary">
                {job.category}
              </Badge>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ListChecks className="h-4 w-4 mr-1" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6 space-y-4">
                <p className="text-gray-700">{job.description}</p>
                <h3 className="text-lg font-semibold text-primary mt-6 flex items-center">
                  <ListChecks className="h-5 w-5 mr-2" />
                  Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.detail.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center">
                  <ListChecks className="h-5 w-5 mr-2" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {job.detail.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="benefits" className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {job.detail.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
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
              disabled={applied || isApplying}
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

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={job.company.logo || "/placeholder.svg"}
                  alt={job.company.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{job.company.name}</h3>
                <p className="text-sm text-gray-500">{job.company.industry}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-start">
                <Users className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm font-medium">Company Size</p>
                  <p className="text-sm text-gray-600">{job.company.size}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm font-medium">Headquarters</p>
                  <p className="text-sm text-gray-600">{job.company.headquarters}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary hover:underline"
                  >
                    {job.company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            </div>
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

