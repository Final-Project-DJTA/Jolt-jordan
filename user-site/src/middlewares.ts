import { cookies } from "next/headers";
import { errHandler } from "./app/helpers/errorHandler";
import { CustomError } from "./types";
import { verifyWithJose } from "./app/helpers/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies()
    const auth = cookieStore.get("Authorization")?.value

    if(request.nextUrl.pathname.startsWith("/api/bookmarks")){
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

    if(request.nextUrl.pathname.startsWith("/bookmarks")){
        if(!auth){
            return NextResponse.redirect(new URL ("/login", request.nextUrl))
        }
    }
}

export const config = {
    matcher: ["/api/bookmarks/:path*", "/bookmarks"]
}