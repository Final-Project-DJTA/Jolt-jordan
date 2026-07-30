import { cookies } from "next/headers";
import { errHandler } from "./helpers/errHandler";
import { CustomError } from "./types";
import { verifyWithJose } from "./helpers/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // Completely skip middleware during build phase to avoid errors
    if (process.env.NEXT_PHASE === 'build') {
      return NextResponse.next();
    }

    console.log("🌐 Middleware HIT:", request.method)

    // Handle CORS preflight requests early to avoid accessing request properties
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

    const cookieStore = request.cookies;
    const auth = cookieStore.get("Authorization")?.value;

    // Get pathname from URL
    let pathname = "";
    try {
      const url = new URL(request.url);
      pathname = url.pathname || "";
    } catch (e) {
      console.log("Error parsing URL:", e);
    }
    console.log("Request path:", pathname || "(empty)");
    console.log("Auth cookie present:", !!auth);
    if (auth) console.log("Auth cookie prefix:", auth.substring(0, 10) + "...");

    const isBookmarkAPI = pathname.startsWith("/api/bookmarks");
    const isBookmarkPage = pathname.startsWith("/bookmarks");
    const isApplyJob = pathname.endsWith("/apply") && request.method === "POST";
    const isProfileAPI = pathname === "/api/profile";

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
                console.log("Auth cookie value:", auth);
                console.log("Middleware decoded userId:", decoded._id);

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

// Add the new route to your middleware config
export const config = {
    matcher: [
        "/api/profile",
        "/api/profile/tags",
        "/api/telegram/send-job-recommendations",
        "/api/bookmarks/:path*",
        "/api/jobs/:path*",
        "/bookmarks",
        "/profile/:path*",
        "/telegram-debug/job-notifications"
    ]
}

