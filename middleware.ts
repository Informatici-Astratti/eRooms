import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import getUser from './app/lib/user'
import { NextResponse } from 'next/server'
import { ruolo } from '@prisma/client'

const isProtectedRoute = createRouteMatcher(['/admin(.*)', "/signup/continue", "/account(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {

    const user = await getUser()

    if (user?.ruolo !== ruolo.PROPRIETARIO) {
      return NextResponse.redirect("/")
    }
    
    await auth.protect()
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