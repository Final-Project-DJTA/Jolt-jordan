import dbConnect from "../connection"
import { Job } from "../models"
import type { JobType } from "../../types"

// Get all jobs
export async function getJobs() {
  await dbConnect()
  return Job.find({}).sort({ createdAt: -1 })
}

// Get job by ID
export async function getJobById(id: string) {
  await dbConnect()
  return Job.findById(id)
}

// Get job by slug
export async function getJobBySlug(slug: string) {
  await dbConnect()
  return Job.findOne({ slug })
}

// Get jobs by category
export async function getJobsByCategory(category: string) {
  await dbConnect()
  return Job.find({ category }).sort({ createdAt: -1 })
}

// Create a new job
export async function createJob(jobData: Omit<JobType, "_id" | "createdAt" | "updatedAt">) {
  await dbConnect()
  const newJob = new Job(jobData)
  return newJob.save()
}

// Update job
export async function updateJob(id: string, jobData: Partial<JobType>) {
  await dbConnect()
  return Job.findByIdAndUpdate(id, { ...jobData, updatedAt: new Date() }, { new: true })
}

// Delete job
export async function deleteJob(id: string) {
  await dbConnect()
  return Job.findByIdAndDelete(id)
}

// Search jobs
export async function searchJobs(query: string) {
  await dbConnect()
  return Job.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { excerpt: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { "company.name": { $regex: query, $options: "i" } },
    ],
  }).sort({ createdAt: -1 })
}

// Get dashboard stats
export async function getDashboardStats() {
  await dbConnect()

  const totalJobs = await Job.countDocuments()

  // Jobs created in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const activeJobs = await Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

  // Get popular categories
  const popularCategories = await Job.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 },
    { $project: { name: "$_id", count: 1, _id: 0 } },
  ])

  return {
    totalJobs,
    activeJobs,
    newApplications: 12, // This would come from Applications collection in a real app
    viewsToday: 156, // This would come from analytics in a real app
    popularCategories,
  }
}

