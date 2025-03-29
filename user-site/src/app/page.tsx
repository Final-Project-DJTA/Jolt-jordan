import { Button } from "@/components/ui/button"
import Link from "next/link"
import JobListings from "@/components/jobs/job-listings"

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <section className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Find Your Dream Job Today</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8">
          Connect with top employers and discover opportunities that match your skills and career goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg"
            >
              Browse Jobs
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold text-primary mb-8">Latest Job Opportunities</h2>
        <JobListings />
      </section>
    </div>
  )
}

