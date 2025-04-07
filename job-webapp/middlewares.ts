import { cookies } from "next/headers";
import { errHandler } from "./helpers/errHandler";
import { CustomError } from "./types";
import { verifyWithJose } from "./helpers/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies()
    const auth = cookieStore.get("Authorization")?.value

    const isBookmarkAPI = request.nextUrl.pathname.startsWith("/api/bookmarks")
    const isBookmarkPage = request.nextUrl.pathname.startsWith("/bookmarks")
    const isApplyJob = request.nextUrl.pathname === "/api/jobs" && request.method === "POST"

    const needsAuth = isBookmarkAPI || isBookmarkPage || isApplyJob

    if(needsAuth){
        try{
            if(!auth) throw {message: "Please login first", status: 401}

            const [type, token] = auth?.split(" ")
            if(type !== "Bearer") throw {message: "Invalid token", status: 401}

            const decoded = await verifyWithJose<{_id: string}>(token)

            const requstHeaders = new Headers(request.headers)
            requstHeaders.set("x-user-id", decoded._id)

            const response = NextResponse.next({
                request: {
                    headers: requstHeaders
                },
            })
            return response
        }catch(error){
            return errHandler(error as CustomError)
        }
    }

    if(isBookmarkPage && !auth){
            return NextResponse.redirect(new URL ("/login", request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/api/bookmarks/:path*", "/bookmarks", "/api/jobs", "/api/users/profile"]
}

