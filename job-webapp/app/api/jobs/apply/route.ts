import { database } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { verifyWithJose } from "@/helpers/jwt";
import ProfileModel from "@/db/models/profileModel";

// Helper function to get user ID from request with improved token handling
async function getUserIdFromRequest(request) {
  try {
    // Try to get the token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // If no token in Authorization header, try from cookies
    if (!token) {
      // Handle various cookie formats and name patterns
      const cookieStore = cookies();
      token = cookieStore.get('Authorization')?.value || 
              cookieStore.get('token')?.value;
      
      // Clean up token if it has Bearer prefix
      if (token && token.startsWith('Bearer ')) {
        token = token.substring(7);
      }
    }

    // Get token from raw cookie header as fallback
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      
      if (cookieHeader) {
        const cookiePairs = cookieHeader.split(';').map(pair => pair.trim());
        
        for (const pair of cookiePairs) {
          if (pair.startsWith('Authorization=')) {
            token = pair.substring('Authorization='.length);
            if (token.startsWith('Bearer%20')) {
              token = token.substring('Bearer%20'.length);
            } else if (token.startsWith('Bearer ')) {
              token = token.substring('Bearer '.length);
            }
            break;
          }
          if (pair.startsWith('token=')) {
            token = pair.substring('token='.length);
            break;
          }
        }
      }
    }

    if (!token) {
      console.log("No token found in request");
      return null;
    }

    // Decode token for debugging
    try {
      const decoded = jwt.decode(token);
      console.log("Token payload:", decoded);
    } catch (e) {
      console.log("Failed to decode token for inspection");
    }

    // Try to verify with Jose first (which is used in middleware)
    try {
      const decoded = await verifyWithJose(token);
      console.log("Token verified with Jose:", decoded._id || decoded.id);
      return decoded._id || decoded.id;
    } catch (joseError) {
      console.log("Jose verification failed, trying standard JWT");
      
      // Fallback to standard JWT
      try {
        const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "secret_key_for_development";
        const decoded = jwt.verify(token, secret);
        console.log("Token verified with JWT:", decoded.id || decoded._id);
        return decoded.id || decoded._id;
      } catch (jwtError) {
        console.error("Token verification failed:", jwtError);
        return null;
      }
    }
  } catch (error) {
    console.error("Error extracting user ID:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    console.log("Received application request");
    
    // Get the job ID from request body
    const body = await req.json().catch(() => ({}));
    const { jobId } = body;
    
    if (!jobId) {
      console.error("Missing job ID in request body");
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }
    
    console.log("Job ID:", jobId);
    
    // Get the authenticated user
    const userId = await getUserIdFromRequest(req);
    console.log("Extracted user ID:", userId);
    
    if (!userId) {
      console.error("User ID could not be extracted from request");
      return NextResponse.json(
        { message: "You must be logged in to apply for jobs" },
        { status: 401 }
      );
    }

    // Get the user's profile with error handling
    try {
      // First check if user exists in User collection
      const userCollection = database.collection("User");
      const user = await userCollection.findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        console.error(`User with ID ${userId} not found`);
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      
      console.log(`User found: ${user.name || user.email}`);
      
      // Try to find existing profile
      const profilesCollection = database.collection("profiles");
      let profile = await profilesCollection.findOne({ userId: new ObjectId(userId) });
      
      // Create profile if it doesn't exist
      if (!profile) {
        console.log("Profile not found, creating new profile");
        // Create minimal profile instead of throwing an error
        const newProfile = {
          userId: new ObjectId(userId),
          appliedJobs: [jobId],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await profilesCollection.insertOne(newProfile);
        
        return NextResponse.json(
          { message: "Application submitted successfully" },
          { status: 200 }
        );
      }
      
      // Check if user has already applied
      const alreadyApplied = profile.appliedJobs && 
                            Array.isArray(profile.appliedJobs) && 
                            profile.appliedJobs.includes(jobId);
      
      if (alreadyApplied) {
        console.log("User has already applied for this job");
        return NextResponse.json(
          { message: "You have already applied for this job" },
          { status: 409 }
        );
      }
      
      // Skip profile completeness check in production to avoid blocking applications
      // Just add job to appliedJobs array
      const result = await profilesCollection.updateOne(
        { userId: new ObjectId(userId) },
        { $addToSet: { appliedJobs: jobId }, $set: { updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        console.error("Failed to update profile");
        return NextResponse.json(
          { message: "Failed to update profile" },
          { status: 500 }
        );
      }
      
      console.log("Application submitted successfully");
      return NextResponse.json(
        { message: "Application submitted successfully" },
        { status: 200 }
      );
    } catch (profileError) {
      console.error("Error processing profile:", profileError);
      return NextResponse.json(
        { message: "Error processing user profile" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your application", error: error.message },
      { status: 500 }
    );
  }
}