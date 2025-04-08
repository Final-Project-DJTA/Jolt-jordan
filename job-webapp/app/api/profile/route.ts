import { cookies } from "next/headers";
import { errHandler } from "@/helpers/errHandler";
import { verifyWithJose } from "@/helpers/jwt";
import { CustomError } from "@/types";
import UserModel from "@/db/models/userModel";
import ProfileModel from "@/db/models/profileModel";

export async function GET(req: Request) {
    try {
        // Debug info
        console.log("Profile API Request received");
        
        // Extract user ID from headers (set by middleware)
        const userId = req.headers.get("x-user-id");
        console.log("User ID from header:", userId);

        if (!userId) {
            console.log("No user ID in header - checking cookies directly");
            
            // Fallback: Check cookies directly
            const cookieHeader = req.headers.get("cookie");
            console.log("Cookie header present:", !!cookieHeader);
            
            if (!cookieHeader) {
                console.log("No cookies in request");
                return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
            
            const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);
            
            const authCookie = cookies["Authorization"];
            console.log("Auth cookie found:", !!authCookie);
            
            if (!authCookie) {
                return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
            
            try {
                const [type, token] = authCookie.split(" ");
                if (type !== "Bearer") {
                    throw new Error("Invalid token type");
                }
                
                const decoded = await verifyWithJose<{_id: string}>(token);
                console.log("Token verified manually - user ID:", decoded._id);
                
                // Get user info - using aggregated approach
                const user = await UserModel.getProfile(decoded._id);
                const profile = await ProfileModel.findByUserId(decoded._id);
                
                // Return aggregated structure
                return Response.json({
                    ...user,
                    profile: profile || {
                        userId: decoded._id,
                        avatar: "",
                        location: "",
                        bio: "",
                        skills: [],
                        tags: [],
                        appliedJobs: [],
                        savedJobs: [],
                        personalInfo: {},
                        education: [],
                        experience: []
                    }
                });
            } catch (error) {
                console.error("Token verification failed:", error);
                return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
        }

        // If middleware successfully provided the user ID, proceed normally
        const user = await UserModel.getProfile(userId);
        const profile = await ProfileModel.findByUserId(userId);
        
        // Return aggregated structure consistently
        return Response.json({
            ...user,
            profile: profile || {
                userId,
                avatar: "",
                location: "",
                bio: "",
                skills: [],
                tags: [],
                appliedJobs: [],
                savedJobs: [],
                personalInfo: {},
                education: [],
                experience: []
            }
        });
    } catch (error) {
        console.error("Profile API error:", error);
        return errHandler(error as CustomError);
    }
}

export async function PATCH(req: Request) {
    try {
        console.log("Profile PATCH Request received");
        
        // Extract user ID from headers (set by middleware)
        const userId = req.headers.get("x-user-id");
        console.log("User ID from header:", userId);

        // If no user ID in header, try to get from cookies (same as GET)
        if (!userId) {
            console.log("No user ID in header for PATCH - checking cookies");
            
            // Fallback: Check cookies directly
            const cookieHeader = req.headers.get("cookie");
            console.log("Cookie header present:", !!cookieHeader);
            
            if (!cookieHeader) {
                console.log("No cookies in request");
                return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
            
            const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);
            
            const authCookie = cookies["Authorization"];
            console.log("Auth cookie found:", !!authCookie);
            
            if (!authCookie) {
                return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
            
            try {
                const [type, token] = authCookie.split(" ");
                if (type !== "Bearer") {
                    throw new Error("Invalid token type");
                }
                
                const decoded = await verifyWithJose<{_id: string}>(token);
                console.log("Token verified manually for PATCH - user ID:", decoded._id);
                
                // Get the data from the request body
                const body = await req.json();
                
                // Update the profile with the verified user ID
                const res = await ProfileModel.update(decoded._id, body);
                return Response.json({ message: res });
                
            } catch (error) {
                console.error("Token verification failed:", error);
                return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
        }

        // If middleware successfully provided the user ID, proceed normally
        const body = await req.json();
        const res = await ProfileModel.update(userId, body);
        return Response.json({ message: res });
    } catch (error) {
        console.error("Profile PATCH error:", error);
        return errHandler(error as CustomError);
    }
}