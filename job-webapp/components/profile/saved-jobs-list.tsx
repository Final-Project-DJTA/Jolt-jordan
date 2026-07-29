"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/jobs/job-card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { JobType } from "@/types";

interface SavedJobsListProps {
  savedJobIds: string[];
}

export default function SavedJobsList({ savedJobIds = [] }: SavedJobsListProps) {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!savedJobIds.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch job data for all saved jobs
        const response = await fetch("/api/jobs/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobIds: savedJobIds }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch saved jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [savedJobIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!savedJobIds.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          You haven&apos;t saved any jobs yet.
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
          We couldn&apos;t find details for your saved jobs. Some jobs may have been removed.
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
        <JobCard key={job._id} job={job} isInBookmarkPage={true} />
      ))}
    </div>
  );
}