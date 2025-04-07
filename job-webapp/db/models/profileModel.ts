import { database } from "../config/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Define schema validation
const ProfileSchema = z.object({
  userId: z.string(),
  avatar: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(), // Make sure this is included
  appliedJobs: z.array(z.string()).optional(),
  savedJobs: z.array(z.string()).optional(),
});

type ProfileType = {
  userId: string | ObjectId;
  avatar?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  tags?: string[];
  appliedJobs?: string[];
  savedJobs?: string[];
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
        bio: "",
        skills: [],
        tags: [],
        appliedJobs: [],
        savedJobs: [],
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