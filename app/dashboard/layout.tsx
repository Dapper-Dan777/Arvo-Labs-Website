/**
 * Dashboard Layout
 * 
 * Gemeinsames Layout für alle Dashboard-Routen.
 * Stellt sicher, dass nur eingeloggte User Zugriff haben.
 */

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Wenn kein User eingeloggt ist, redirect zu Sign-In
  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
