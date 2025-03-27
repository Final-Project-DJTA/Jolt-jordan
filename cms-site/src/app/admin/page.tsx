import Link from "next/link"
import {
  BarChart3,
  Users,
  Briefcase,
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col bg-gray-900 text-white">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Briefcase className="h-6 w-6" />
            <span>JobPortal</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <div className="py-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Dashboard</h4>
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/admin/jobs"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
              </Link>
              <Link
                href="/admin/applications"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                <Users className="h-4 w-4" />
                Applications
              </Link>
              <Link
                href="/admin/companies"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                <Building2 className="h-4 w-4" />
                Companies
              </Link>
            </div>
          </div>
          <div className="py-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Settings</h4>
            <div className="space-y-1">
              <Link
                href="/admin/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                Profile
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                Settings
              </Link>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <div>
              <div className="font-medium">Admin User</div>
              <div className="text-xs text-gray-400">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search..." className="w-full rounded-md border pl-8" />
            </div>
            <Button variant="outline">
              <span className="sr-only">Toggle menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Job
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                    <h3 className="text-2xl font-bold">1,234</h3>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>12% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Applications</p>
                    <h3 className="text-2xl font-bold">5,678</h3>
                  </div>
                  <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>8% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Companies</p>
                    <h3 className="text-2xl font-bold">432</h3>
                  </div>
                  <div className="rounded-full bg-yellow-500/10 p-3 text-yellow-500">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>5% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <h3 className="text-2xl font-bold">12.5%</h3>
                  </div>
                  <div className="rounded-full bg-red-500/10 p-3 text-red-500">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-600">
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                  <span>3% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent-jobs">
            <TabsList className="mb-4">
              <TabsTrigger value="recent-jobs">Recent Jobs</TabsTrigger>
              <TabsTrigger value="recent-applications">Recent Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="recent-jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Postings</CardTitle>
                  <CardDescription>You have posted 12 jobs in the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>
                            <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                          </TableCell>
                          <TableCell>{job.postedDate}</TableCell>
                          <TableCell>{job.applications}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="recent-applications">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>You have received 48 applications in the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.applicant}</TableCell>
                          <TableCell>{application.jobTitle}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                application.status === "Reviewed"
                                  ? "default"
                                  : application.status === "Pending"
                                    ? "secondary"
                                    : application.status === "Rejected"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{application.appliedDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

// Sample data
const recentJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    status: "Active",
    postedDate: "Mar 15, 2023",
    applications: 24,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    status: "Active",
    postedDate: "Mar 14, 2023",
    applications: 18,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignHub",
    status: "Active",
    postedDate: "Mar 12, 2023",
    applications: 32,
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "GrowthLabs",
    status: "Paused",
    postedDate: "Mar 10, 2023",
    applications: 15,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudSystems",
    status: "Active",
    postedDate: "Mar 8, 2023",
    applications: 12,
  },
]

const recentApplications = [
  {
    id: 1,
    applicant: "John Smith",
    jobTitle: "Senior Frontend Developer",
    status: "Reviewed",
    appliedDate: "Mar 16, 2023",
  },
  {
    id: 2,
    applicant: "Emily Johnson",
    jobTitle: "Product Manager",
    status: "Pending",
    appliedDate: "Mar 15, 2023",
  },
  {
    id: 3,
    applicant: "Michael Brown",
    jobTitle: "UX/UI Designer",
    status: "Interviewed",
    appliedDate: "Mar 14, 2023",
  },
  {
    id: 4,
    applicant: "Sarah Davis",
    jobTitle: "Marketing Specialist",
    status: "Rejected",
    appliedDate: "Mar 13, 2023",
  },
  {
    id: 5,
    applicant: "David Wilson",
    jobTitle: "DevOps Engineer",
    status: "Pending",
    appliedDate: "Mar 12, 2023",
  },
]

