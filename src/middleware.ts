import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret" });
    const { pathname } = request.nextUrl;

    // Allow public access to auth APIs, debug APIs, Next.js internal routes, and static files
    if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/debug') ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        pathname.includes('.') // like logo.png
    ) {
        return NextResponse.next();
    }

    // Auth Routes logic
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    if (isAuthRoute) {
        if (token) {
            // Already logged in, redirect to dashboard or pending
            if (token.status === 'PENDING') {
                return NextResponse.redirect(new URL('/pending', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Protected Routes logic
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check Approval Status
    if (token.status === 'PENDING' && pathname !== '/pending') {
        return NextResponse.redirect(new URL('/pending', request.url));
    }

    if (token.status === 'BANNED' && pathname !== '/banned') {
        return NextResponse.redirect(new URL('/banned', request.url));
    }

    // If approved, prevent access to pending/banned
    if (token.status === 'APPROVED' && (pathname === '/pending' || pathname === '/banned')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Admin Routes logic
    if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
