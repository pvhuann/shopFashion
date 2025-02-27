import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)','/api/:path*'])

export default clerkMiddleware((auth, request) => {
    const response = NextResponse.next();
    const origin = response.headers.get('origin');
    if(request.nextUrl.pathname.startsWith("/api")){
        
    }
    if (!isPublicRoute(request)) {
        auth().protect()
    }
})

// export default clerkMiddleware()
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}