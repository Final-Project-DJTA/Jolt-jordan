import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyWithJose } from "@/helpers/jwt";
import ProfileModel from "@/db/models/profileModel";

export async function POST(req: NextRequest) {
  try {
    // Get the user from cookie JWT instead of next-auth
    const cookieStore = cookies();
    const auth = cookieStore.get("Authorization")?.value;

    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const [type, token] = auth.split(" ");

    if (type !== "Bearer") {
      return NextResponse.json(
        { error: "Invalid authentication format" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = await verifyWithJose<{ _id: string }>(token);
    const userId = decoded._id;

    const data = await req.json();

    // Extract CV data from the request
    const { personalInfo, education, experience, skills } = data;

    // Update the user's profile with the CV data
    const result = await ProfileModel.updateCVData(userId, {
      personalInfo,
      education,
      experience,
      skills,
    });

    return NextResponse.json({ message: result }, { status: 200 });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      { error: "Failed to save CV data" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user with JWT from cookies
    const cookieStore = cookies();
    const auth = cookieStore.get("Authorization")?.value;

    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const [type, token] = auth.split(" ");

    if (type !== "Bearer") {
      return NextResponse.json(
        { error: "Invalid authentication format" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = await verifyWithJose<{ _id: string }>(token);
    const userId = decoded._id;

    // Retrieve the user's profile with CV data
    const profile = await ProfileModel.findByUserId(userId);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Extract CV data
    const { personalInfo, education, experience, skills } = profile;

    // Return CV data for preview
    return NextResponse.json(
      {
        cv: {
          personalInfo,
          education,
          experience,
          skills,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving CV:", error);
    return NextResponse.json(
      { error: "Failed to retrieve CV data" },
      { status: 500 }
    );
  }
}
