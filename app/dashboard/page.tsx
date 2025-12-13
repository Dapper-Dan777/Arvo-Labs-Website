/**
 * Dashboard Root Route
 * 
 * Diese Route leitet User basierend auf ihrem Plan automatisch weiter:
 * - starter → /dashboard/starter
 * - pro → /dashboard/pro
 * - individual → /dashboard/individual
 * - kein Plan → /pricing (oder /onboarding)
 * 
 * WICHTIG: Diese Route wird nach Login/SignUp aufgerufen (siehe app/layout.tsx:
 * afterSignInUrl="/dashboard" und afterSignUpUrl="/dashboard")
 */

import { redirect } from 'next/navigation';
import { getCurrentUserPlan } from '@/lib/plan-utils-server';
import { isAdmin as checkIsAdmin } from '@/lib/plan-utils';

export default async function DashboardPage() {
  const { user, plan } = await getCurrentUserPlan();

  // Wenn kein User eingeloggt ist, sollte die Middleware das abfangen
  // Aber zur Sicherheit: Redirect zu Sign-In
  if (!user) {
    redirect('/sign-in');
  }

  // Admins werden immer zum Individual-Dashboard weitergeleitet (hat alle Features)
  if (checkIsAdmin(user)) {
    redirect('/dashboard/individual');
  }

  // Plan-basierte Weiterleitung
  if (plan === 'starter') {
    redirect('/dashboard/starter');
  } else if (plan === 'pro') {
    redirect('/dashboard/pro');
  } else if (plan === 'enterprise') {
    redirect('/dashboard/individual'); // Enterprise nutzt Individual-Dashboard
  } else if (plan === 'individual') {
    redirect('/dashboard/individual');
  } else {
    // Kein Plan zugewiesen → Weiterleitung zu Pricing oder Onboarding
    // TODO: Später kann hier eine Onboarding-Seite erstellt werden
    redirect('/preise');
  }
}
