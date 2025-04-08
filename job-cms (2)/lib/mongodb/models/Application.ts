import mongoose, { type Document, Schema, type Model } from "mongoose"

// Interface for the Application document
export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  status: "pending" | "reviewed" | "rejected" | "accepted"
  coverLetter?: string
  resumeUrl?: string
  appliedAt: Date
  updatedAt: Date
  notes?: string
}

// Application Schema
const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected", "accepted"],
      default: "pending",
    },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    notes: { type: String },
  },
  {
    timestamps: { createdAt: "appliedAt", updatedAt: "updatedAt" },
  },
)

// Create indexes for frequently queried fields
ApplicationSchema.index({ jobId: 1 })
ApplicationSchema.index({ userId: 1 })
ApplicationSchema.index({ status: 1 })
ApplicationSchema.index({ appliedAt: -1 })

// Create a compound index for unique applications per user per job
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true })

// Create the Application model
const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)

export default Application

