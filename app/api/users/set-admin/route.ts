/**
 * API Route: Set User Admin Status
 * 
 * Diese Route ermöglicht es, den Admin-Status eines Users zu setzen.
 * 
 * WICHTIG: Diese Route sollte nur von anderen Admins aufgerufen werden.
 * 
 * Verwendung:
 * POST /api/users/set-admin
 * Body: { userId: string, isAdmin: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/plan-utils';
import { setUserAdmin } from '@/lib/plan-utils-server';
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

    // Prüfe, ob der anfragende User Admin ist
    const user = await currentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Nicht autorisiert. Nur Admins können Admin-Status setzen.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId: targetUserId, isAdmin: shouldBeAdmin } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID ist erforderlich' },
        { status: 400 }
      );
    }

    if (typeof shouldBeAdmin !== 'boolean') {
      return NextResponse.json(
        { error: 'isAdmin muss ein boolean sein' },
        { status: 400 }
      );
    }

    await setUserAdmin(targetUserId, shouldBeAdmin);

    return NextResponse.json({ 
      success: true, 
      message: `Admin-Status wurde auf ${shouldBeAdmin} gesetzt` 
    });
  } catch (error: any) {
    console.error('Fehler beim Setzen des Admin-Status:', error);
    return NextResponse.json(
      { error: error.message || 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
