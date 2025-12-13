/**
 * Checkout-Seite
 * 
 * Zeigt die Clerk Pricing Table oder leitet zu einem spezifischen Plan weiter.
 * 
 * Query-Parameter:
 * - planId: Clerk Plan-ID (optional)
 * - period: 'month' oder 'year' (optional)
 */

'use client';

import { use } from 'react';
import { PricingTable } from '@clerk/nextjs';
import { CheckoutButton } from '@clerk/nextjs/experimental';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const planId = typeof params.planId === 'string' ? params.planId : undefined;
  const period = (typeof params.period === 'string' ? params.period : 'month') as 'month' | 'year';

  // Wenn eine spezifische Plan-ID übergeben wurde, zeige Checkout-Button
  if (planId) {
    return (
      <main className="page">
        <section className="pricing" style={{ paddingTop: '120px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '24px' }}>Plan auswählen</h2>
            <p
              style={{
                color: 'var(--text-muted)',
                marginBottom: '32px',
                lineHeight: '1.6',
              }}
            >
              Du wirst zum Checkout weitergeleitet.
            </p>
            <CheckoutButton
              planId={planId}
              planPeriod={period}
              newSubscriptionRedirectUrl="/dashboard"
            >
              <button className="btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
                Zum Checkout
              </button>
            </CheckoutButton>
          </div>
        </section>
      </main>
    );
  }

  // Ansonsten zeige die vollständige Pricing Table
  return (
    <main className="page">
      <section className="pricing" style={{ paddingTop: '120px' }}>
        <h2>Wähle deinen Plan</h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            margin: '0 auto 64px',
          }}
        >
          Wähle den Plan, der am besten zu dir passt. Alle Pläne können
          jederzeit angepasst werden.
        </p>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <PricingTable
            newSubscriptionRedirectUrl="/dashboard"
          />
        </div>
      </section>
    </main>
  );
}

