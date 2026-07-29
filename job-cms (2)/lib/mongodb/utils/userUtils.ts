import dbConnect from "../connection"
import { User } from "../models"
import type { UserType } from "../../types"
import bcrypt from "bcryptjs"

// Get all users
export async function getUsers() {
  await dbConnect()
  return User.find({}).select("-password")
}

// Get user by ID
export async function getUserById(id: string) {
  await dbConnect()
  return User.findById(id).select("-password")
}

// Get user by email
export async function getUserByEmail(email: string) {
  await dbConnect()
  return User.findOne({ email })
}

// Get user by username
export async function getUserByUsername(username: string) {
  await dbConnect()
  return User.findOne({ username })
}

// Create a new user
export async function createUser(userData: Omit<UserType, "profile">) {
  await dbConnect()

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(userData.password, salt)

  const newUser = new User({
    ...userData,
    password: hashedPassword,
    profile: {
      avatar: "/placeholder.svg?height=40&width=40",
      location: "",
      bio: "",
      skills: [],
      appliedJobs: [],
      savedJobs: [],
    },
  })

  return newUser.save()
}

// Update user
export async function updateUser(id: string, userData: Partial<UserType>) {
  await dbConnect()

  // If updating password, hash it
  if (userData.password) {
    const salt = await bcrypt.genSalt(10)
    userData.password = await bcrypt.hash(userData.password, salt)
  }

  return User.findByIdAndUpdate(id, { ...userData, updatedAt: new Date() }, { new: true }).select("-password")
}

// Delete user
export async function deleteUser(id: string) {
  await dbConnect()
  return User.findByIdAndDelete(id)
}

// Login user
export async function loginUser(email: string, password: string) {
  await dbConnect()

  // Find user by email
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  // Return user without password
  return user.toObject({
    getters: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.password
      return ret
    },
  })
}

// Add job to saved jobs
export async function addToSavedJobs(userId: string, jobId: string) {
  await dbConnect()
  return User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { "profile.savedJobs": jobId },
      updatedAt: new Date(),
    },
    { new: true },
  ).select("-password")
}

// Remove job from saved jobs
export async function removeFromSavedJobs(userId: string, jobId: string) {
  await dbConnect()
  return User.findByIdAndUpdate(
    userId,
    {
      $pull: { "profile.savedJobs": jobId },
      updatedAt: new Date(),
    },
    { new: true },
  ).select("-password")
}

