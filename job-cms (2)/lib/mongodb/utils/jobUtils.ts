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

// Update job function with fixed tags handling
export async function updateJob(identifier: string, jobData: Partial<JobType>) {
  await dbConnect();
  console.log("🔄 Starting update with identifier:", identifier);
  
  try {
    // Create a clean update object
    const updateData = { ...jobData };
    
    // Explicitly preserve tags
    const tagsToSave = Array.isArray(jobData.tags) ? [...jobData.tags] : [];
    console.log("🏷️ Tags before MongoDB operation:", tagsToSave);
    
    // Make sure _id is removed
    if (updateData._id) {
      delete updateData._id;
    }
    
    // CRITICAL: Explicitly set tags in the update
    updateData.tags = tagsToSave;
    
    // Add timestamp
    updateData.updatedAt = new Date();
    
    // Log the final update data
    console.log("📦 Data being sent to MongoDB:", JSON.stringify(updateData, null, 2));

    // Try to find by MongoDB _id first, then by slug
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    
    let query;
    if (isValidObjectId) {
      console.log("🔍 Using ObjectId for lookup");
      query = { _id: identifier };
    } else {
      console.log("🔍 Using slug for lookup");
      query = { slug: identifier };
    }
    
    console.log("🔎 Query:", query);
    
    // Direct document replacement approach - more reliable for arrays
    const result = await Job.findOneAndUpdate(
      query,
      // Use $set for all fields individually to ensure arrays are handled correctly
      {
        $set: {
          name: updateData.name,
          slug: updateData.slug,
          location: updateData.location,
          category: updateData.category,
          salary: updateData.salary,
          description: updateData.description,
          excerpt: updateData.excerpt,
          company: updateData.company,
          detail: updateData.detail,
          tags: tagsToSave,  // Explicitly set tags
          updatedAt: updateData.updatedAt
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );
    
    console.log("✅ MongoDB operation result:", result ? "Document updated" : "No document found");
    if (result) {
      console.log("🏷️ Tags after update:", result.tags);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error in updateJob:", error);
    throw error;
  }
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

