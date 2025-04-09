import { database } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { verifyWithJose } from "@/helpers/jwt";
import { errHandler } from "@/helpers/errHandler";
import { CustomError } from "@/types";

// Fixed: Make cookies correctly awaited
async function getUserIdFromCookies(request: Request) {
  try {
    // First try using the cookies API - need to await this
    const cookieStore = await cookies();
    
    // Try to get the Authorization token first (this is what login sets)
    let token = cookieStore.get("Authorization")?.value;
    
    // If Authorization token exists, extract the actual token part
    if (token && token.startsWith("Bearer ")) {
      token = token.substring(7);
    }
    
    // If no Authorization token, try the token cookie as fallback
    if (!token) {
      token = cookieStore.get("token")?.value;
    }
    
    // If we found a token, verify it
    if (token) {
      try {
        // First try with jose (the method used in middleware)
        const decoded = await verifyWithJose(token);
        return decoded._id || decoded.id;
      } catch (joseError) {
        // Fallback to standard jwt verify
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
          return decoded._id || decoded.id;
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          return null;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting user ID from cookies:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    // Use the robust function to get userId
    const userId = await getUserIdFromCookies(req);
    
    if (!userId) {
      console.log("No user ID found in cookies - unauthorized");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    console.log("User ID extracted successfully:", userId);
    
    // Use aggregation to join User collection with profiles collection
    const usersCollection = database.collection("User");
    
    // Perform aggregation with $lookup
    const aggregatedData = await usersCollection.aggregate([
      { 
        $match: { _id: new ObjectId(userId) } 
      },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "userId",
          as: "profileData"
        }
      },
      {
        $unwind: {
          path: "$profileData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          username: 1,
          role: 1,
          telegramId: 1,
          telegramVerified: 1,
          profile: {
            userId: "$profileData.userId",
            avatar: "$profileData.avatar",
            location: "$profileData.location",
            jobPosition: "$profileData.jobPosition",
            skills: "$profileData.skills",
            tags: "$profileData.tags",
            appliedJobs: "$profileData.appliedJobs",
            savedJobs: "$profileData.savedJobs",
            personalInfo: "$profileData.personalInfo",
            education: "$profileData.education",
            experience: "$profileData.experience",
          }
        }
      }
    ]).toArray();
    
    // Check if user exists
    if (aggregatedData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const userData = aggregatedData[0];
    
    // If no profile was found, create an empty profile structure
    if (!userData.profile || !userData.profile.userId) {
      userData.profile = {
        userId: new ObjectId(userId),
        avatar: "",
        location: "",
        jobPosition: "",
        skills: [],
        tags: [],
        appliedJobs: [],
        savedJobs: [],
        personalInfo: {},
        education: [],
        experience: []
      };
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    console.log("Profile PATCH Request received");
    
    // Extract user ID using the robust function
    const userId = await getUserIdFromCookies(req);
    
    if (!userId) {
      console.log("No user ID found in cookies - unauthorized");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    console.log("User ID extracted successfully:", userId);
    const body = await req.json();
    const res = await database.collection("profiles").updateOne(
      { userId: new ObjectId(userId) },
      { $set: body },
      { upsert: true }
    );
    
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}