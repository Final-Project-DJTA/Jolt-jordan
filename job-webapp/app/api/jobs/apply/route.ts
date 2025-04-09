import { database } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { verifyWithJose } from "@/helpers/jwt";
import ProfileModel from "@/db/models/profileModel";

// Helper function to get user ID from cookies or auth header
async function getUserIdFromRequest(request) {
  try {
    // Try multiple ways to get cookies/tokens
    const cookieHeader = request.headers.get('cookie');
    let token = null;
    
    if (cookieHeader) {
      // Handle different cookie formats
      const cookiePairs = cookieHeader.split(';').map(pair => pair.trim());
      
      for (const pair of cookiePairs) {
        if (pair.startsWith('token=')) {
          token = pair.substring('token='.length);
          break;
        }
        if (pair.startsWith('Authorization=')) {
          token = pair.substring('Authorization='.length);
          if (token.startsWith('Bearer%20')) {
            token = token.substring('Bearer%20'.length);
          } else if (token.startsWith('Bearer ')) {
            token = token.substring('Bearer '.length);
          }
          break;
        }
      }
    }

    // Try from Authorization header if not found in cookies
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    // Try to verify with Jose first (which is used in middleware)
    try {
      const decoded = await verifyWithJose(token);
      return decoded._id || decoded.id;
    } catch (joseError) {
      // Fallback to standard JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_for_development");
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
    // Get the authenticated user
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in to apply for jobs" },
        { status: 401 }
      );
    }

    // Get the job ID from request body
    const { jobId } = await req.json();
    
    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Get the user's profile
    const profilesCollection = database.collection("profiles");
    const profile = await profilesCollection.findOne({ userId: new ObjectId(userId) });
    
    if (!profile) {
      // Create profile if it doesn't exist
      await ProfileModel.create(userId);
    } else {
      // Check if user has already applied
      const alreadyApplied = profile.appliedJobs && profile.appliedJobs.includes(jobId);
      
      if (alreadyApplied) {
        return NextResponse.json(
          { message: "You have already applied for this job" },
          { status: 409 }
        );
      }
      
      // Verify profile completeness
      const isIncomplete =
        !profile.jobPosition || 
        !profile.skills || 
        profile.skills.length === 0;
      
      if (isIncomplete) {
        return NextResponse.json(
          { message: "Please complete your profile before applying" },
          { status: 400 }
        );
      }
    }
    
    // Add job to appliedJobs array
    const result = await profilesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $addToSet: { appliedJobs: jobId } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your application" },
      { status: 500 }
    );
  }
}