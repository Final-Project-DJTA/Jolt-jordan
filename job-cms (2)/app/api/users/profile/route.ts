import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import User from '@/lib/mongodb/models/User';
import { getAuthUserId } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    // Get user ID from the token
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    console.log('Received profile update data:', body);

    // Get current user first to have access to existing profile
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update basic user fields
    currentUser.name = body.name;
    currentUser.email = body.email;
    currentUser.phoneNumber = body.phoneNumber;

    // Handle profile data if present
    if (body.profile) {
      // Initialize profile if it doesn't exist
      if (!currentUser.profile) {
        currentUser.profile = {};
      }

      // Update profile fields
      if (body.profile.location !== undefined) {
        currentUser.profile.location = body.profile.location;
      }

      if (body.profile.bio !== undefined) {
        currentUser.profile.bio = body.profile.bio;
      }

      // IMPORTANT: Handle skills array properly
      if (Array.isArray(body.profile.skills)) {
        // Create skills array if it doesn't exist
        if (!currentUser.profile.skills) {
          currentUser.profile.skills = [];
        }

        // Set skills directly
        currentUser.profile.skills = [...body.profile.skills];
        console.log('Updating skills array to:', body.profile.skills);
      }

      // Important: Mark profile as modified to ensure Mongoose updates it
      currentUser.markModified('profile');
    }

    // Save the updated user - this is more reliable than findByIdAndUpdate
    // for nested documents in MongoDB
    await currentUser.save();

    // Fetch fresh user data to return to client
    const updatedUser = await User.findById(userId).select('-password');

    console.log('Updated user:', updatedUser);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({
      error: "An error occurred while updating profile",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}