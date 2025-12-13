/**
 * Billing Utilities
 * 
 * Helper-Funktionen für Clerk-Billing-Integration
 * 
 * WICHTIG: Plan-IDs müssen im Clerk Dashboard konfiguriert werden
 * und in .env.local als Umgebungsvariablen gesetzt werden.
 * 
 * Team Plan-IDs sind direkt im Code definiert (siehe lib/pricing-config.ts).
 */

import { PlanId, BillingMode, getPlanConfig } from './pricing-config';

/**
 * Erstellt einen Checkout-Link für einen Plan
 * 
 * @param planId - Der Plan-ID ('starter' | 'pro' | 'enterprise' | 'individual')
 * @param period - 'month' oder 'year'
 * @param billingMode - 'user' oder 'team'
 * @returns URL für den Checkout oder null, falls Plan-ID nicht konfiguriert ist
 */
export function getCheckoutUrl(
  planId: PlanId,
  period: 'month' | 'year' = 'month',
  billingMode: BillingMode = 'user'
): string | null {
  const plan = getPlanConfig(planId, billingMode);
  if (!plan) return null;

  const clerkPlanId = plan.clerkPlanId;

  if (!clerkPlanId || clerkPlanId === 'cplan_xxx') {
    console.warn(`Plan-ID für ${planId} (${billingMode}) nicht konfiguriert.`);
    return null;
  }

  // Clerk Checkout URL
  // Format: /checkout?planId=xxx&period=month
  const params = new URLSearchParams({
    planId: clerkPlanId,
    period: period,
  });

  return `/checkout?${params.toString()}`;
}

/**
 * Mappt Plan-ID zu Clerk Plan-ID
 * 
 * WICHTIG: Diese Funktion wird verwendet, um nach erfolgreichem Checkout
 * den Plan in user.publicMetadata.plan zu setzen.
 * 
 * Unterstützt sowohl User- als auch Team-Plan-IDs.
 * 
 * @param clerkPlanId - Die Clerk Plan-ID (z.B. 'cplan_xxx')
 * @returns PlanId oder null, falls nicht gefunden
 */
export function mapClerkPlanIdToPlanId(clerkPlanId: string): PlanId | null {
  // Prüfe User Plan-IDs (aus .env.local)
  const starterUserId = process.env.NEXT_PUBLIC_CLERK_STARTER_PLAN_ID;
  const proUserId = process.env.NEXT_PUBLIC_CLERK_PRO_PLAN_ID;
  const enterpriseUserId = process.env.NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID;

  if (clerkPlanId === starterUserId) return 'starter';
  if (clerkPlanId === proUserId) return 'pro';
  if (clerkPlanId === enterpriseUserId) return 'enterprise';

  // Prüfe Team Plan-IDs (direkt im Code definiert)
  const starterTeamId = 'cplan_36jkgky6qmyh8PQHFwfAiNUazwZ';
  const proTeamId = 'cplan_36jkljbhoLb7AvJihZVGs2aJCz9';
  const enterpriseTeamId = 'cplan_36jks6IaQDVu1qykEUfToWIuehF';

  if (clerkPlanId === starterTeamId) return 'starter';
  if (clerkPlanId === proTeamId) return 'pro';
  if (clerkPlanId === enterpriseTeamId) return 'enterprise';

  return null;
}

/**
 * Mappt Plan-ID zu Clerk Plan-ID (umgekehrt)
 * 
 * @param planId - Die Plan-ID
 * @param billingMode - 'user' oder 'team'
 * @returns Clerk Plan-ID oder null, falls nicht gefunden
 */
export function mapPlanIdToClerkPlanId(planId: PlanId, billingMode: BillingMode = 'user'): string | null {
  const plan = getPlanConfig(planId, billingMode);
  if (!plan) return null;

  const clerkPlanId = plan.clerkPlanId;
  return clerkPlanId && clerkPlanId !== 'cplan_xxx' ? clerkPlanId : null;
}
