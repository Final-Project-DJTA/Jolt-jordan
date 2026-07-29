import { database } from "../config/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Define schema validation with the updated fields
const PersonalInfoSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
});

const EducationSchema = z.object({
  degree: z.string().optional(),
  institution: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const ExperienceSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const ProfileSchema = z.object({
  userId: z.string(),
  avatar: z.string().optional(),
  location: z.string().optional(),
  jobPosition: z.string().optional(), // Changed from bio to jobPosition
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  appliedJobs: z.array(z.string()).optional(),
  savedJobs: z.array(z.string()).optional(),
  personalInfo: PersonalInfoSchema.optional(),
  education: z.array(EducationSchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
});

type ProfileType = {
  userId: string | ObjectId;
  avatar?: string;
  location?: string;
  jobPosition?: string; // Changed from bio to jobPosition
  skills?: string[];
  tags?: string[];
  appliedJobs?: string[];
  savedJobs?: string[];
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
};

class ProfileModel {
  static collection() {
    return database.collection("profiles");
  }

  static async create(userId: string) {
    try {
      // Check if profile already exists to prevent duplicates
      const existingProfile = await this.collection().findOne({ 
        userId: new ObjectId(userId) 
      });
      
      if (existingProfile) {
        console.log(`Profile already exists for user ${userId}`);
        return existingProfile;
      }
      
      const profile = {
        userId: new ObjectId(userId),
        avatar: "",
        location: "",
        jobPosition: "", // Changed from bio to jobPosition
        skills: [],
        tags: [],
        appliedJobs: [],
        savedJobs: [],
        // Initialize the new fields
        personalInfo: {},
        education: [],
        experience: [],
      };
  
      await this.collection().insertOne(profile);
      console.log(`New profile created for user ${userId}`);
      return profile;
    } catch (error) {
      console.error(`Error creating profile for user ${userId}:`, error);
      throw error; 
    }
  }

  static async findByUserId(userId: string) {
    const profile = await this.collection().findOne({ userId: new ObjectId(userId) });
    return profile;
  }

  static async update(userId: string, profileData: Partial<ProfileType>) {
    ProfileSchema.partial().parse(profileData);

    const result = await this.collection().updateOne(
      { userId: new ObjectId(userId) },
      { $set: profileData }
    );

    if (result.matchedCount === 0) {
      // Profile doesn't exist yet, create it
      const profile = {
        userId: new ObjectId(userId),
        ...profileData
      };
      await this.collection().insertOne(profile);
      return "Profile created successfully";
    }

    return "Profile updated successfully";
  }

  // Method to update CV data
  static async updateCVData(userId: string, cvData: {
    personalInfo?: any,
    education?: any[],
    experience?: any[],
    skills?: string[]
  }) {
    const result = await this.collection().updateOne(
      { userId: new ObjectId(userId) },
      { 
        $set: {
          personalInfo: cvData.personalInfo || {},
          education: cvData.education || [],
          experience: cvData.experience || [],
          skills: cvData.skills || []
        } 
      }
    );

    if (result.matchedCount === 0) {
      // Profile doesn't exist yet, create it with CV data
      const profile = {
        userId: new ObjectId(userId),
        avatar: "",
        location: "",
        jobPosition: "", // Changed from bio to jobPosition
        tags: [],
        appliedJobs: [],
        savedJobs: [],
        personalInfo: cvData.personalInfo || {},
        education: cvData.education || [],
        experience: cvData.experience || [],
        skills: cvData.skills || []
      };
      await this.collection().insertOne(profile);
      return "Profile with CV data created successfully";
    }

    return "CV data updated successfully";
  }

  // Keep existing methods
  static async addAppliedJob(userId: string, jobId: string) {
    const result = await this.collection().updateOne(
      { userId: new ObjectId(userId) },
      { $addToSet: { appliedJobs: jobId } }
    );

    if (result.matchedCount === 0) {
      throw { message: "Profile not found", status: 404 };
    }

    return "Job application recorded successfully";
  }

  static async addSavedJob(userId: string, jobId: string) {
    const result = await this.collection().updateOne(
      { userId: new ObjectId(userId) },
      { $addToSet: { savedJobs: jobId } }
    );

    if (result.matchedCount === 0) {
      throw { message: "Profile not found", status: 404 };
    }

    return "Job saved successfully";
  }

  static async removeSavedJob(userId: string, jobId: string) {
    const result = await this.collection().updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { savedJobs: jobId } }
    );

    if (result.matchedCount === 0) {
      throw { message: "Profile not found", status: 404 };
    }

    return "Job removed from saved jobs successfully";
  }
}

export default ProfileModel;