import dbConnect from "../connection"
import { Application } from "../models"

// Create a new application
export async function createApplication(
  jobId: string,
  userId: string,
  data: {
    coverLetter?: string
    resumeUrl?: string
  },
) {
  await dbConnect()

  // Check if user already applied to this job
  const existingApplication = await Application.findOne({ jobId, userId })
  if (existingApplication) {
    throw new Error("You have already applied to this job")
  }

  const newApplication = new Application({
    jobId,
    userId,
    ...data,
    status: "pending",
  })

  return newApplication.save()
}

// Get applications by job ID
export async function getApplicationsByJob(jobId: string) {
  await dbConnect()
  return Application.find({ jobId }).populate("userId", "name email profile.avatar").sort({ appliedAt: -1 })
}

// Get applications by user ID
export async function getApplicationsByUser(userId: string) {
  await dbConnect()
  return Application.find({ userId }).populate("jobId", "name company.name location").sort({ appliedAt: -1 })
}

// Update application status
export async function updateApplicationStatus(id: string, status: "pending" | "reviewed" | "rejected" | "accepted") {
  await dbConnect()
  return Application.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })
}

// Add notes to application
export async function addNotesToApplication(id: string, notes: string) {
  await dbConnect()
  return Application.findByIdAndUpdate(id, { notes, updatedAt: new Date() }, { new: true })
}

// Delete application
export async function deleteApplication(id: string) {
  await dbConnect()
  return Application.findByIdAndDelete(id)
}

