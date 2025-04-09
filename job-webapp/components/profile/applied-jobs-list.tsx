"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/jobs/job-card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { JobType } from "@/types";

interface AppliedJobsListProps {
  appliedJobIds: string[];
}

export default function AppliedJobsList({ appliedJobIds = [] }: AppliedJobsListProps) {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!appliedJobIds.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch job data for all applied jobs
        const response = await fetch("/api/jobs/applied", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobIds: appliedJobIds }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applied jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load your applied jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [appliedJobIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!appliedJobIds.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          You haven&apos;t applied to any jobs yet.
        </p>
        <Link href="/jobs">
          <Button className="bg-primary hover:bg-primary/90">
            Browse Jobs
          </Button>
        </Link>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          We couldn&apos;t find details for your applied jobs. Some jobs may have been removed.
        </p>
        <Link href="/jobs">
          <Button className="bg-primary hover:bg-primary/90">
            Browse Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobCard 
          key={job._id} 
          job={job} 
          isInBookmarkPage={false} // Not in bookmark page
        />
      ))}
    </div>
  );
}