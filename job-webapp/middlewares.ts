import { cookies } from "next/headers";
import { errHandler } from "./helpers/errHandler";
import { CustomError } from "./types";
import { verifyWithJose } from "./helpers/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400",
            },
        });
    }

    const cookieStore = request.cookies; // Note: Using NextRequest cookies directly
    const auth = cookieStore.get("Authorization")?.value;

    // Debug info
    console.log("Request path:", request.nextUrl.pathname);
    console.log("Auth cookie present:", !!auth);
    if (auth) console.log("Auth cookie prefix:", auth.substring(0, 10) + "...");

    const isBookmarkAPI = request.nextUrl.pathname.startsWith("/api/bookmarks");
    const isBookmarkPage = request.nextUrl.pathname.startsWith("/bookmarks");
    const isApplyJob = request.nextUrl.pathname === "/api/jobs" && request.method === "POST";
    const isProfileAPI = request.nextUrl.pathname === "/api/profile";

    const needsAuth = isBookmarkAPI || isBookmarkPage || isApplyJob || isProfileAPI;
    console.log("Needs auth:", needsAuth);

    if(needsAuth){
        try{
            if(!auth) {
                console.log("No auth cookie found");
                throw {message: "Please login first", status: 401};
            }

            const [type, token] = auth?.split(" ");
            console.log("Token type:", type);
            
            if(type !== "Bearer") {
                console.log("Invalid token type");
                throw {message: "Invalid token", status: 401};
            }

            try {
                const decoded = await verifyWithJose<{_id: string}>(token);
                console.log("Token successfully verified for user:", decoded._id);
                
                const requestHeaders = new Headers(request.headers);
                requestHeaders.set("x-user-id", decoded._id);

                const response = NextResponse.next({
                    request: {
                        headers: requestHeaders
                    },
                });

                response.headers.set("Access-Control-Allow-Origin", "*");
                response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
                
                return response;
            } catch (joseError) {
                console.log("Token verification failed:", joseError);
                throw {message: "Invalid token", status: 401};
            }
        } catch(error){
            console.log("Auth error:", error);
            const errorResponse = errHandler(error as CustomError);
            errorResponse.headers.set("Access-Control-Allow-Origin", "*");
            return errorResponse;
        }
    }

    // For all other requests, add CORS headers
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    return response;
}

export const config = {
    matcher: [
        "/api/profile",
        "/api/profile/tags", // Add this line to protect the tags API
        "/api/bookmarks/:path*",
        "/api/jobs", 
        "/bookmarks",
        "/profile/:path*"
    ]
}

