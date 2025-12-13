/**
 * Plan-Management Utilities (Client-Safe)
 * 
 * Diese Datei enthält Client-kompatible Helper-Funktionen für das Plan-/Role-System.
 * Der Plan wird in Clerk's publicMetadata.plan gespeichert.
 * 
 * Mögliche Plan-Werte:
 * - "starter" - Starter-Plan
 * - "pro" - Pro-Plan
 * - "individual" - Individuell-Plan
 * - null - Kein Plan zugewiesen
 * 
 * WICHTIG: Diese Datei enthält nur Client-kompatible Funktionen.
 * Server-only Funktionen sind in lib/plan-utils-server.ts
 */

export type PlanType = 'starter' | 'pro' | 'enterprise' | 'individual' | null;

/**
 * Liest den Plan eines Users aus Clerk's publicMetadata
 * 
 * @param user - Clerk User Object (kann null sein)
 * @returns PlanType - Der Plan des Users oder null
 */
export function getUserPlan(user: any): PlanType {
  if (!user || !user.publicMetadata) {
    return null;
  }

  const plan = user.publicMetadata.plan as string | undefined;
  
  if (!plan) {
    return null;
  }

  // Validiere, dass der Plan ein gültiger Wert ist
  if (plan === 'starter' || plan === 'pro' || plan === 'enterprise' || plan === 'individual') {
    return plan;
  }

  return null;
}


/**
 * Prüft, ob ein User Zugriff auf einen bestimmten Plan hat
 * 
 * @param userPlan - Der Plan des Users
 * @param requiredPlan - Der erforderliche Plan
 * @returns boolean - true wenn der User Zugriff hat
 */
export function hasPlanAccess(userPlan: PlanType, requiredPlan: 'starter' | 'pro' | 'enterprise' | 'individual'): boolean {
  if (!userPlan) {
    return false;
  }

  // Plan-Hierarchie: individual > enterprise > pro > starter
  const planHierarchy: Record<string, number> = {
    starter: 1,
    pro: 2,
    enterprise: 3,
    individual: 4,
  };

  const userPlanLevel = planHierarchy[userPlan] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

  // Ein User mit einem höheren Plan hat Zugriff auf niedrigere Pläne
  // (z.B. Pro-User kann Starter-Features nutzen)
  // ABER: Ein Starter-User darf NICHT auf Pro/Individual zugreifen
  return userPlanLevel >= requiredPlanLevel;
}


/**
 * Prüft, ob ein User Zugriff auf eine bestimmte Route hat
 * 
 * @param userPlan - Der Plan des Users
 * @param routePlan - Der erforderliche Plan für die Route
 * @returns boolean - true wenn Zugriff erlaubt
 */
export function requirePlan(userPlan: PlanType, routePlan: 'starter' | 'pro' | 'enterprise' | 'individual'): boolean {
  return hasPlanAccess(userPlan, routePlan);
}

/**
 * Prüft, ob ein User Admin ist
 * 
 * Admin-Status wird in Clerk's publicMetadata.is_admin gespeichert.
 * 
 * @param user - Clerk User Object (kann null sein)
 * @returns boolean - true wenn der User Admin ist
 */
export function isAdmin(user: any): boolean {
  if (!user || !user.publicMetadata) {
    return false;
  }

  // Prüfe publicMetadata.is_admin
  if (user.publicMetadata.is_admin === true) {
    return true;
  }

  // Fallback: Prüfe E-Mail (für Migration/Backwards-Kompatibilität)
  const email = user.emailAddresses?.[0]?.emailAddress || '';
  if (email.includes('admin') || email === 'admin@arvo-labs.com') {
    return true;
  }

  return false;
}


/**
 * Prüft, ob ein User Zugriff auf eine Route hat (berücksichtigt Admin-Status)
 * 
 * Admins haben immer Zugriff, unabhängig vom Plan.
 * 
 * @param user - Clerk User Object
 * @param routePlan - Der erforderliche Plan für die Route
 * @returns boolean - true wenn Zugriff erlaubt
 */
export function hasRouteAccess(user: any, routePlan: 'starter' | 'pro' | 'enterprise' | 'individual'): boolean {
  // Admins haben immer Zugriff
  if (isAdmin(user)) {
    return true;
  }

  const userPlan = getUserPlan(user);
  return hasPlanAccess(userPlan, routePlan);
}
