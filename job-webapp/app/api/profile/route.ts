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
                
                // Get user info
                const user = await UserModel.getProfile(decoded._id);
                const profile = await ProfileModel.findByUserId(decoded._id);
                
                return Response.json({
                    ...user,
                    profile: profile || {
                        avatar: "",
                        location: "",
                        bio: "",
                        skills: [],
                        tags: [],
                        appliedJobs: [],
                        savedJobs: [],
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
        
        return Response.json({
            ...user,
            profile: profile || {
                avatar: "",
                location: "",
                bio: "",
                skills: [],
                tags: [],
                appliedJobs: [],
                savedJobs: [],
            }
        });
    } catch (error) {
        console.error("Profile API error:", error);
        return errHandler(error as CustomError);
    }
}

export async function PATCH(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const res = await ProfileModel.update(userId, body);
        return Response.json({ message: res });
    } catch (error) {
        return errHandler(error as CustomError);
    }
}