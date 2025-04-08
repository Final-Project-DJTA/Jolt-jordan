import mongoose, { type Document, Schema, type Model } from "mongoose"
import type { UserType, Profile } from "../../types"
import bcrypt from "bcryptjs"

// Interface for the User document
export interface IUser extends UserType, Document {
  createdAt: Date
  updatedAt: Date
}
// Profile Schema
const ProfileSchema = new Schema<Profile>({
  avatar: { type: String },
  location: { type: String },
  bio: { type: String },
  resume: { type: String },
  skills: [{ type: String }],
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
})


// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: ProfileSchema, default: {} },
  },
  {
    timestamps: true,
  },
)

// Add password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User;

// Create indexes for frequently queried fields
// UserSchema.index({ email: 1 })
// UserSchema.index({ username: 1 })

// Create the User model
