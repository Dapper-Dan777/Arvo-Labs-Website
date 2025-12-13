/**
 * Middleware für Authentication und Plan-basierte Route-Guards
 * 
 * Diese Middleware:
 * 1. Schützt Dashboard-Routen vor unauthentifizierten Usern
 * 2. Leitet User basierend auf ihrem Plan zu den richtigen Dashboard-Routen weiter
 * 3. Verhindert, dass User auf Dashboard-Routen zugreifen, für die sie keinen Plan haben
 * 
 * WICHTIG: Plan-basierte Redirects werden primär in app/dashboard/page.tsx
 * (Server Component) durchgeführt. Diese Middleware ist eine zusätzliche Sicherheitsebene.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// Definiere geschützte Routen
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Sign-In und Sign-Up Routen explizit erlauben (muss vor anderen Checks kommen)
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return NextResponse.next();
  }

  // Wenn User eingeloggt ist und auf Homepage geht → Dashboard
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Dashboard schützen: Prüfe, ob User eingeloggt ist
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Plan-basierte Route-Guards (zusätzliche Sicherheitsebene)
  // Die Haupt-Redirect-Logik ist in app/dashboard/page.tsx (Server Component),
  // aber hier prüfen wir auch, ob User auf falsche Routen zugreifen
  // WICHTIG: Admins haben immer Zugriff auf alle Dashboards
  if (userId && pathname.startsWith('/dashboard/')) {
    try {
      const user = await currentUser();
      if (user && user.publicMetadata) {
        // Prüfe, ob User Admin ist
        const userIsAdmin = user.publicMetadata.is_admin === true ||
                           user.emailAddresses?.[0]?.emailAddress?.includes('admin') ||
                           user.emailAddresses?.[0]?.emailAddress === 'admin@arvo-labs.com';

        // Admins haben immer Zugriff - keine weiteren Checks nötig
        if (userIsAdmin) {
          return NextResponse.next();
        }

        const plan = user.publicMetadata.plan as string | undefined;

        // Prüfe spezifische Dashboard-Routen
        if (pathname.startsWith('/dashboard/starter') && plan !== 'starter') {
          // User versucht auf Starter-Dashboard zuzugreifen, hat aber nicht den Plan
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (pathname.startsWith('/dashboard/pro') && plan !== 'pro' && plan !== 'individual') {
          // User versucht auf Pro-Dashboard zuzugreifen, hat aber nicht den Plan
          // Individual-User haben auch Zugriff auf Pro-Features
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (pathname.startsWith('/dashboard/individual') && plan !== 'individual') {
          // User versucht auf Individual-Dashboard zuzugreifen, hat aber nicht den Plan
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    } catch (error) {
      // Bei Fehler einfach weiterleiten (app/dashboard/page.tsx wird es korrigieren)
      console.error('Fehler bei Plan-Prüfung in Middleware:', error);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

