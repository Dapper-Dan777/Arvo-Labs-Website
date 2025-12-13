/**
 * Clerk Webhook Handler
 * 
 * Diese Route verarbeitet Webhooks von Clerk, insbesondere für Billing-Events.
 * 
 * WICHTIG: Diese Route muss im Clerk Dashboard konfiguriert werden:
 * 1. Gehe zu Clerk Dashboard → Webhooks
 * 2. Erstelle einen neuen Webhook
 * 3. Endpoint: https://yourdomain.com/api/webhooks/clerk
 * 4. Wähle Events: subscription.created, subscription.updated, subscription.deleted
 * 5. Kopiere das Signing Secret und setze es in .env.local als CLERK_WEBHOOK_SECRET
 * 
 * Nach erfolgreichem Checkout wird der Plan automatisch in user.publicMetadata.plan gesetzt.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { setUserPlan } from '@/lib/plan-utils-server';
import { mapClerkPlanIdToPlanId } from '@/lib/billing-utils';

export async function POST(request: NextRequest) {
  // Webhook Secret aus Umgebungsvariablen
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET ist nicht gesetzt');
    return NextResponse.json(
      { error: 'Webhook Secret nicht konfiguriert' },
      { status: 500 }
    );
  }

  // Hole Headers für Signature-Verification
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Fehlende Webhook-Header' },
      { status: 400 }
    );
  }

  // Hole Body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Erstelle Webhook-Instanz für Verifikation
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    // Verifiziere Webhook-Signatur
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error('Webhook-Verifikation fehlgeschlagen:', err);
    return NextResponse.json(
      { error: 'Webhook-Verifikation fehlgeschlagen' },
      { status: 400 }
    );
  }

  const eventType = evt.type;
  const { data } = evt;

  // Verarbeite verschiedene Event-Typen
  if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
    try {
      const userId = data.user_id || data.userId;
      const planId = data.plan_id || data.planId;

      if (!userId || !planId) {
        console.error('Fehlende userId oder planId im Webhook:', data);
        return NextResponse.json(
          { error: 'Fehlende Daten im Webhook' },
          { status: 400 }
        );
      }

      // Mappe Clerk Plan-ID zu unserer Plan-ID
      const plan = mapClerkPlanIdToPlanId(planId);

      if (!plan) {
        console.warn(`Unbekannte Clerk Plan-ID: ${planId}`);
        return NextResponse.json(
          { error: 'Unbekannte Plan-ID' },
          { status: 400 }
        );
      }

      // Setze Plan in user.publicMetadata
      await setUserPlan(userId, plan);

      console.log(`Plan für User ${userId} auf ${plan} gesetzt`);

      return NextResponse.json({ received: true, plan });
    } catch (error: any) {
      console.error('Fehler beim Verarbeiten des Webhooks:', error);
      return NextResponse.json(
        { error: error.message || 'Interner Serverfehler' },
        { status: 500 }
      );
    }
  }

  if (eventType === 'subscription.deleted') {
    try {
      const userId = data.user_id || data.userId;

      if (!userId) {
        console.error('Fehlende userId im Webhook:', data);
        return NextResponse.json(
          { error: 'Fehlende userId' },
          { status: 400 }
        );
      }

      // Setze Plan auf null (kein Plan)
      await setUserPlan(userId, null);

      console.log(`Plan für User ${userId} entfernt`);

      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error('Fehler beim Verarbeiten des Webhooks:', error);
      return NextResponse.json(
        { error: error.message || 'Interner Serverfehler' },
        { status: 500 }
      );
    }
  }

  // Andere Event-Typen werden ignoriert (aber bestätigt)
  return NextResponse.json({ received: true });
}

