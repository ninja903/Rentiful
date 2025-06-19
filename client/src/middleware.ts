import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware((auth, req: NextRequest) => {
  const { clerkUserId, publicMetadata } = auth();
  const url = req.nextUrl.clone();
  const pathname = url.pathname.toLowerCase();
  const role = publicMetadata?.role as string | undefined;

  // Allow unauthenticated access to public paths
  if (!clerkUserId) return NextResponse.next();

  // Redirect signed-in users away from /signup or /signin
  if (['/signin', '/signup', '/select-role'].includes(pathname)) {
    if (!role) {
      url.pathname = '/select-role';
    } else if (role === 'tenant') {
      url.pathname = '/tenants';
    } else if (role === 'manager') {
      url.pathname = '/manager';
    } else {
      url.pathname = '/select-role';
    }

    return NextResponse.redirect(url);
  }

  // Require role to access tenant/manager dashboards
  if (!role && (pathname.startsWith('/tenants') || pathname.startsWith('/manager'))) {
    url.pathname = '/select-role';
    return NextResponse.redirect(url);
  }

  // Role-based route restriction
  if (pathname.startsWith('/tenants') && role !== 'tenant') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/manager') && role !== 'manager') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
