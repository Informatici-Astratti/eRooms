import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
 
type Session = typeof auth.$Infer.Session;

const authRoutes = ["/login", "/signup"];
const protectedRoutes = ["/dashboard"];
 
export default async function authMiddleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const isAuthRoute = authRoutes.includes(pathName);
    const isProtectedRoute = protectedRoutes.includes(pathName);

    // PRENDO LA SESSIONE

	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: process.env.BETTER_AUTH_URL,
			headers: {
				//get the cookie from the request
				cookie: request.headers.get("cookie") || "",
			},
		},
	);

    // CONTROLLI PER LE ROUTE
	if (!session) {
        if(isProtectedRoute){
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next()
    }

    if (isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}
 
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};