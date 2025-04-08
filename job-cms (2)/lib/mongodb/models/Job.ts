import mongoose, { type Document, Schema, type Model } from "mongoose"
import type { JobType, Company, Detail } from "../../types"

// Interface for the Job document
export interface IJob extends Omit<JobType, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date
  updatedAt: Date
}

// Company Schema
const CompanySchema = new Schema<Company>({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  size: { type: String, required: true },
  website: { type: String, required: true },
  headquarters: { type: String, required: true },
  logo: { type: String, default: "/placeholder.svg" },
})

// Detail Schema
const DetailSchema = new Schema<Detail>({
  responsibilities: [{ type: String, required: true }],
  requirements: [{ type: String, required: true }],
  benefits: [{ type: String, required: true }],
})

// Job Schema
const JobSchema = new mongoose.Schema<IJob>(
  {
    name: { type: String, required: true },
    slug: { type: String, index: true},
    location: { type: String, required: true },
    category: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    excerpt: { type: String, required: true },
    company: { type: CompanySchema, required: true },
    detail: { type: DetailSchema, required: true },
  },
  {
    timestamps: true,
  },
)

// Create indexes for frequently queried fields
JobSchema.index({ slug: 1 })
JobSchema.index({ category: 1 })
JobSchema.index({ "company.name": 1 })
JobSchema.index({ createdAt: -1 })

// Create the Job model
const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)

export default Job

