import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
const allowedOrigins = {
    admin: 'http://localhost:4000',
    store: 'http://localhost:3000',
}
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/:path*'])

export default clerkMiddleware((auth, request) => {
    const response = NextResponse.next();
    const origin = response.headers.get('origin');
    // check origin, otherwise it will be blocked by CORS
    if (request.nextUrl.pathname.startsWith("/api") && !request.nextUrl.pathname.startsWith("/api")) {
        if (origin !== allowedOrigins.admin) {
            return  NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
        }
        // config CORS for admin (private API)
        response.headers.set("Access-Control-Allow-Origin", allowedOrigins.admin);
        response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    // config CORS for store (public API)
    if (request.nextUrl.pathname.startsWith("/api")) {
        response.headers.set("Access-Control-Allow-Origin", allowedOrigins.store);
        response.headers.set("Access-Control-Allow-Methods", "GET");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    // handle preflight request for CORS
    if (request.method === "OPTIONS") {
        return NextResponse.json(null, { status: 204, headers: response.headers });
    }
    // protect private routes with Clerk
    if (!isPublicRoute(request)) {
        auth().protect();
    }
    return response;
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