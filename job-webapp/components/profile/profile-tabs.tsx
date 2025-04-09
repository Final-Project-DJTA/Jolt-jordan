"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download } from "lucide-react";

interface ProfileTabsProps {
  user: UserType | null;
}

export default function ProfileTabs({ user }: ProfileTabsProps) {
  // Add null checks to prevent errors
  if (!user) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500 text-center">Loading profile data...</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-primary mb-4">Resume</h2>

            {user.profile?.resume ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  <span>resume.pdf</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Link href="/profile/cv/check">
                    <Button variant="outline" size="sm">
                      Check CV
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-gray-500">
                  You haven&apos;t uploaded a resume yet. Upload one to apply
                  for jobs more quickly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/profile/create-resume">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Check CV
                    </Button>
                  </Link>
                  <Link href="/profile/cv/generate">
                    <Button
                      variant="outline"
                      className="border-secondary text-secondary hover:bg-secondary/10"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate CV
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              {user.profile?.location && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{user.profile.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="applications" className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Job Applications
          </h2>
          {user.profile && user.profile.appliedJobs && user.profile.appliedJobs.length > 0 ? (
            <div>
              {/* Job applications list would go here */}
              <p>You have applied to {user.profile.appliedJobs.length} jobs.</p>
            </div>
          ) : (
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
          )}
        </div>
      </TabsContent>

      <TabsContent value="saved" className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Saved Jobs
          </h2>
          {user.profile && user.profile.savedJobs && user.profile.savedJobs.length > 0 ? (
            <div>
              {/* Saved jobs list would go here */}
              <p>You have saved {user.profile.savedJobs.length} jobs.</p>
            </div>
          ) : (
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
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
