'use client';

import { use } from 'react';
import { PricingTable } from '@clerk/nextjs';

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Unwrap searchParams using React.use()
  use(searchParams);

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

