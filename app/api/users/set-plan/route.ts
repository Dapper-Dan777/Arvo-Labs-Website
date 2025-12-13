/**
 * API Route: Set User Plan
 * 
 * Diese Route ermöglicht es, den Plan eines Users zu setzen.
 * 
 * WICHTIG: Diese Route sollte idealerweise nur von:
 * - Stripe Webhooks (nach erfolgreichem Checkout)
 * - Admin-Panels
 * - Internen Systemen
 * 
 * aufgerufen werden. Für Produktion sollte zusätzliche Authentifizierung
 * hinzugefügt werden (z.B. Webhook-Secret-Verification).
 * 
 * Verwendung:
 * POST /api/users/set-plan
 * Body: { userId: string, plan: 'starter' | 'pro' | 'individual' | null }
 */

import { NextRequest, NextResponse } from 'next/server';
import { setUserPlan } from '@/lib/plan-utils-server';
import { PlanType, isAdmin } from '@/lib/plan-utils';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Prüfe, ob der User eingeloggt ist
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId: targetUserId, plan } = body;

    // Validiere, dass der Plan ein gültiger Wert ist
    if (plan !== null && plan !== 'starter' && plan !== 'pro' && plan !== 'individual') {
      return NextResponse.json(
        { error: 'Ungültiger Plan. Erlaubte Werte: starter, pro, individual, null' },
        { status: 400 }
      );
    }

    // Prüfe, ob der User Admin ist oder seinen eigenen Plan setzt
    const user = await currentUser();
    const requestingUserIsAdmin = user ? isAdmin(user) : false;
    const isSettingOwnPlan = !targetUserId || targetUserId === userId;

    // Nur Admins können andere User's Pläne setzen
    if (targetUserId && targetUserId !== userId && !requestingUserIsAdmin) {
      return NextResponse.json(
        { error: 'Nicht autorisiert. Nur Admins können Pläne anderer User setzen.' },
        { status: 403 }
      );
    }

    const userIdToUpdate = targetUserId || userId;
    
    await setUserPlan(userIdToUpdate, plan as PlanType);

    return NextResponse.json({ 
      success: true, 
      message: `Plan wurde auf ${plan || 'null'} gesetzt` 
    });
  } catch (error: any) {
    console.error('Fehler beim Setzen des Plans:', error);
    return NextResponse.json(
      { error: error.message || 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
