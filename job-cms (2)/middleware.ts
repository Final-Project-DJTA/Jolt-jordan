import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const url = request.nextUrl.clone()
  
  // Protected routes
  const protectedRoutes = ['/', '/jobs', '/jobs/new', '/profile', '/profile/edit']
  const currentPath = url.pathname
  
  // Check if the path is protected and no token exists
  if (protectedRoutes.some(route => currentPath === route || currentPath.startsWith(`${route}/`)) && !token) {
    url.pathname = '/login'
    url.searchParams.set('from', currentPath)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/jobs/:path*', '/profile/:path*'],
}