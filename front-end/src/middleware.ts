import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['kk', 'ru', 'en'];
const DEFAULT_LOCALE = 'kk';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass internal requests, static assets, APIs, and dashboard routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/swagger') ||
    pathname.includes('.') // static files: .pdf, .png, .jpg, .svg, .ico, etc.
  ) {
    return NextResponse.next();
  }

  const pathnameSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameSegments[0];
  const isLocalePrefix = LOCALES.includes(firstSegment);

  // 2. If URL has a supported locale prefix (e.g., /kk/courses/1 or /ru)
  if (isLocalePrefix) {
    const locale = firstSegment;
    // Strip locale segment for the internal Next.js rewrite
    const strippedPath = '/' + pathnameSegments.slice(1).join('/');
    const url = request.nextUrl.clone();
    url.pathname = strippedPath === '/' ? '/' : strippedPath;

    const response = NextResponse.rewrite(url);
    response.headers.set('x-locale', locale);
    response.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // 3. If URL has NO locale prefix (e.g. "/" or "/courses/math-trigonometry-80h" or "/pricing")
  const cookieLocale = request.cookies.get('locale')?.value;
  const preferredLocale = LOCALES.includes(cookieLocale || '') ? cookieLocale! : DEFAULT_LOCALE;

  // Redirect to localized URL for consistent SEO indexing
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${preferredLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
