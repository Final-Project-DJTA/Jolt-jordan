import { database } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// More robust cookie extraction function
async function getUserIdFromRequest(request) {
  try {
    // Try multiple ways to get cookies/tokens
    // 1. Try direct cookie header access
    const cookieHeader = request.headers.get('cookie');
    
    if (cookieHeader) {
      console.log("Cookie header found:", cookieHeader);

      // Handle different cookie formats
      const cookiePairs = cookieHeader.split(';').map(pair => pair.trim());
      let token = null;

      // Try to find token in various formats
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

      if (token) {
        console.log("Token found in request headers");
        try {
          // Verify the token
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_for_development");
          console.log("Token successfully decoded:", decoded);
          return decoded.id || decoded._id;
        } catch (error) {
          console.error("Token verification failed:", error);
        }
      }
    }

    // 2. Try request headers for Authorization
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log("Auth header token found");
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_for_development");
        console.log("Auth header token decoded:", decoded);
        return decoded.id || decoded._id;
      } catch (error) {
        console.error("Auth header token verification failed:", error);
      }
    }

    // Log if all attempts fail
    console.log("No valid authentication token found in request");
    return null;
  } catch (error) {
    console.error("Error in getUserIdFromRequest:", error);
    return null;
  }
}

// PATCH handler to add tags
export async function PATCH(req: Request) {
  try {
    console.log("PATCH request received for tags API");
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      console.log("No user ID found in the request, returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    console.log("User ID extracted:", userId);
    const { tag } = await req.json();
    
    if (!tag) {
      return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    }
    
    const profilesCollection = database.collection("profiles");
    console.log(`Adding tag "${tag}" for user ${userId}`);
    
    // Add the tag to the user's profile
    const result = await profilesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $addToSet: { tags: tag } }
    );
    
    console.log("MongoDB update result:", result);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/profile/tags:", error);
    return NextResponse.json(
      { error: "Failed to update profile tags", details: error.message },
      { status: 500 }
    );
  }
}

// POST handler for tag removal
export async function POST(req: Request) {
  try {
    console.log("POST request received for tags API");
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      console.log("No user ID found in the request, returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    console.log("User ID extracted:", userId);
    const { tag, action } = await req.json();
    
    if (!tag || action !== 'remove') {
      return NextResponse.json({ error: "Tag and action are required" }, { status: 400 });
    }
    
    const profilesCollection = database.collection("profiles");
    console.log(`Removing tag "${tag}" for user ${userId}`);
    
    // Remove the tag from the user's profile
    const result = await profilesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { tags: tag } }
    );
    
    console.log("MongoDB update result:", result);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/profile/tags:", error);
    return NextResponse.json(
      { error: "Failed to remove profile tag", details: error.message },
      { status: 500 }
    );
  }
}