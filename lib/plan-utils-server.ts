/**
 * Plan-Management Utilities (Server-Only)
 * 
 * Diese Datei enthält Server-only Helper-Funktionen für das Plan-/Role-System.
 * Diese Funktionen können NUR in Server Components, API Routes oder Server Actions verwendet werden.
 * 
 * WICHTIG: Diese Datei importiert 'server-only' Funktionen von Clerk.
 * Verwende lib/plan-utils.ts für Client Components.
 */

import 'server-only';
import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { PlanType, getUserPlan, isAdmin as isAdminClient } from './plan-utils';

/**
 * Setzt den Plan eines Users in Clerk's publicMetadata
 * 
 * WICHTIG: Diese Funktion sollte idealerweise in einem API-Route-Handler
 * oder einer Server Action aufgerufen werden, nicht direkt im Client.
 * 
 * Verwendung nach erfolgreichem Checkout:
 * - Stripe Webhook → API Route (z.B. /api/webhooks/stripe)
 * - In der Webhook-Handler-Funktion: await setUserPlan(userId, 'pro')
 * 
 * @param userId - Clerk User ID
 * @param plan - Der zu setzende Plan
 * @returns Promise<void>
 */
export async function setUserPlan(userId: string, plan: PlanType): Promise<void> {
  if (!userId) {
    throw new Error('User ID ist erforderlich');
  }

  if (plan && plan !== 'starter' && plan !== 'pro' && plan !== 'individual') {
    throw new Error(`Ungültiger Plan: ${plan}. Erlaubte Werte: starter, pro, individual, null`);
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan: plan || null,
      },
    });
  } catch (error) {
    console.error('Fehler beim Setzen des Plans:', error);
    throw error;
  }
}

/**
 * Setzt den Admin-Status eines Users in Clerk's publicMetadata
 * 
 * WICHTIG: Diese Funktion sollte idealerweise nur von Admins oder
 * in einem API-Route-Handler mit entsprechender Authentifizierung aufgerufen werden.
 * 
 * @param userId - Clerk User ID
 * @param isAdmin - true um Admin zu setzen, false um zu entfernen
 * @returns Promise<void>
 */
export async function setUserAdmin(userId: string, isAdmin: boolean): Promise<void> {
  if (!userId) {
    throw new Error('User ID ist erforderlich');
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};
    
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        is_admin: isAdmin,
      },
    });
  } catch (error) {
    console.error('Fehler beim Setzen des Admin-Status:', error);
    throw error;
  }
}

/**
 * Server-side Helper: Holt den aktuellen User und seinen Plan
 * 
 * @returns Promise<{ user: any, plan: PlanType }>
 */
export async function getCurrentUserPlan() {
  const user = await currentUser();
  const plan = getUserPlan(user);
  return { user, plan };
}

/**
 * Server-side Helper: Prüft, ob der aktuelle User Admin ist
 * 
 * @returns Promise<boolean>
 */
export async function getCurrentUserIsAdmin() {
  const user = await currentUser();
  return isAdminClient(user);
}
