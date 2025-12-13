/**
 * PricingCard-Komponente im Iconsax-Stil
 * 
 * Zeigt eine einzelne Pricing-Karte mit Plan-Name, Preis, Features und CTA-Button.
 * Unterstützt User- und Team-Modus mit unterschiedlichen Preisen und Plan-IDs.
 * Layout orientiert sich an Iconsax, verwendet aber das bestehende Farbschema.
 * 
 * WICHTIG: Alle Daten kommen aus lib/pricing-config.ts - keine hart codierten Werte!
 */

'use client';

import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { CheckoutButton } from '@clerk/nextjs/experimental';
import { Check } from 'lucide-react';
import { BillingMode, getPlanConfig, getTeamInfo, formatPrice } from '@/lib/pricing-config';

interface PricingCardProps {
  planId: 'starter' | 'pro' | 'enterprise' | 'individual';
  billingPeriod: 'month' | 'year';
  billingMode: BillingMode;
  isMobile: boolean;
}

export default function PricingCard({
  planId,
  billingPeriod,
  billingMode,
  isMobile,
}: PricingCardProps) {
  const plan = getPlanConfig(planId, billingMode);
  if (!plan) return null;

  const price =
    billingPeriod === 'year' && plan.price.yearly !== undefined
      ? plan.price.yearly
      : plan.price.monthly;

  const teamInfo = getTeamInfo(planId, billingMode);
  const formattedPrice = formatPrice(price, billingPeriod, billingMode);

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s ease',
        boxShadow: plan.highlighted
          ? '0 8px 24px rgba(99, 102, 241, 0.15)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        if (!plan.highlighted) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!plan.highlighted) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {/* Badge für "Most Popular" */}
      {plan.highlighted && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--primary)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Beliebt
        </div>
      )}

      {/* Plan-Name */}
      <h3
        style={{
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '12px',
          color: 'var(--text-primary)',
        }}
      >
        {plan.name}
      </h3>

      {/* Preis */}
      <div style={{ marginBottom: '16px' }}>
        {price === 'custom' ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Auf Anfrage
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)' }}>
              €{typeof price === 'number' ? price.toFixed(2).replace('.', ',') : price}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-muted)',
                fontWeight: 400,
              }}
            >
              /{billingPeriod === 'year' ? 'Jahr' : 'Monat'}
              {billingMode === 'team' && ' / Team'}
            </span>
          </div>
        )}
      </div>

      {/* Beschreibung */}
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '12px',
          minHeight: '44px',
        }}
      >
        {plan.description}
      </p>

      {/* Team-Information */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          padding: '8px 12px',
          background: 'var(--bg-surface)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--text-primary)',
        }}
      >
        <span style={{ fontWeight: 600 }}>👥</span>
        <span>{teamInfo}</span>
      </div>

      {/* Trennlinie */}
      <div
        style={{
          height: '1px',
          background: 'var(--border-subtle)',
          marginBottom: '24px',
        }}
      />

      {/* Features-Liste */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          marginBottom: '32px',
          flex: 1,
        }}
      >
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '16px',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            <Check
              size={18}
              style={{
                color: 'var(--primary)',
                flexShrink: 0,
                marginTop: '2px',
              }}
            />
            <span style={{ color: 'var(--text-primary)' }}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA-Button */}
      <div style={{ marginTop: 'auto' }}>
        <SignedIn>
          {plan.isContactOnly || planId === 'individual' ? (
            // Individuell: Immer zu Kontakt
            <Link
              href="/kontakt"
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none',
              }}
            >
              <button
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Kontakt aufnehmen
              </button>
            </Link>
          ) : plan.clerkPlanId ? (
            // Starter/Pro/Enterprise: CheckoutButton mit korrekter Plan-ID (User oder Team)
            <CheckoutButton
              planId={plan.clerkPlanId}
              planPeriod={billingPeriod === 'year' ? 'yearly' : 'monthly'}
              newSubscriptionRedirectUrl="/dashboard"
              onSubscriptionComplete={() => {
                console.log(`${plan.name}-Abonnement erfolgreich abgeschlossen! (${billingMode})`);
              }}
            >
              <button
                className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: plan.highlighted ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                {planId === 'starter' ? 'Kostenlos starten' : `${plan.name} wählen`}
              </button>
            </CheckoutButton>
          ) : (
            // Fallback: Link zu Checkout-Seite
            <Link
              href="/checkout"
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none',
              }}
            >
              <button
                className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: plan.highlighted ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                {plan.name} wählen
              </button>
            </Link>
          )}
        </SignedIn>
        <SignedOut>
          {plan.isContactOnly || planId === 'individual' ? (
            // Individuell: Immer zu Kontakt
            <Link
              href="/kontakt"
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none',
              }}
            >
              <button
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Kontakt aufnehmen
              </button>
            </Link>
          ) : (
            // Nicht eingeloggt: Link zu Sign-Up
            <Link
              href="/sign-up"
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none',
              }}
            >
              <button
                className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: plan.highlighted ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                {planId === 'starter' ? 'Kostenlos starten' : `${plan.name} wählen`}
              </button>
            </Link>
          )}
        </SignedOut>
      </div>
    </div>
  );
}
