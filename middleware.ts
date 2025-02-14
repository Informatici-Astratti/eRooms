import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import getUser from './app/lib/user'
import { NextResponse } from 'next/server'
import { ruolo } from '@prisma/client'

const isProtectedRoute = createRouteMatcher(['/admin(.*)', "/signup/continue", "/account(.*)"])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isGovernanteRoute = createRouteMatcher(['/admin/pulizie(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect()
  }

  if (isAdminRoute(request)) {
    const { sessionClaims } = await auth();

    if (sessionClaims?.ruolo === ruolo.PROPRIETARIO) {
      return NextResponse.next();
    }

    if (isGovernanteRoute(request) && sessionClaims?.ruolo === ruolo.GOVERNANTE) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/v", process.env.NEXT_PUBLIC_APP_URL));
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};