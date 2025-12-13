/**
 * Pricing-Seite im Iconsax-Stil mit User/Team-Toggle
 * 
 * Zeigt vier Pläne (Starter, Pro, Enterprise, Individuell) mit Vergleichstabelle
 * und Checkout-Buttons, die mit Clerk-Billing verbunden sind.
 * 
 * Layout orientiert sich an Iconsax, verwendet aber das bestehende Farbschema.
 * 
 * WICHTIG: Plan-IDs müssen in .env.local konfiguriert werden:
 * - NEXT_PUBLIC_CLERK_STARTER_PLAN_ID (User)
 * - NEXT_PUBLIC_CLERK_PRO_PLAN_ID (User)
 * - NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID (User)
 * 
 * Team Plan-IDs sind direkt im Code definiert (siehe lib/pricing-config.ts).
 * 
 * Individuell hat keinen direkten Billing-Plan und leitet zu /kontakt weiter.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PLAN_CONFIGS, BillingMode, getPlansForMode } from '@/lib/pricing-config';
import PricingCard from '@/components/PricingCard';
import PricingTable from '@/components/PricingTable';
import PricingToggle from '@/components/PricingToggle';
import './page.css';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [billingMode, setBillingMode] = useState<BillingMode>('user');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const plans = getPlansForMode(billingMode);

  return (
    <main className="page">
      <section className="pricing" style={{ paddingTop: '120px' }}>
        {/* Header mit Toggle */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: '32px',
              paddingRight: isMobile ? '24px' : '0',
            }}
          >
            <PricingToggle billingMode={billingMode} onModeChange={setBillingMode} />
          </div>

          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Funktionsvergleich
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-muted)',
              maxWidth: '600px',
              margin: '0 auto 32px',
              lineHeight: '1.6',
            }}
          >
            Vergleiche alle Features unserer Pläne und finde den passenden für dich.
          </p>
        </div>

        {/* Pricing-Karten im Iconsax-Stil */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              Wähle deinen Plan
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'var(--text-muted)',
                maxWidth: '600px',
                margin: '0 auto 32px',
                lineHeight: '1.6',
              }}
            >
              Alle Pläne können jederzeit angepasst werden. Kein Risiko, kein Kleingedrucktes.
            </p>

            {/* Billing Period Toggle */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--bg-surface)',
                borderRadius: '12px',
                padding: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => setBillingPeriod('month')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: billingPeriod === 'month' ? 'var(--primary)' : 'transparent',
                  color: billingPeriod === 'month' ? '#ffffff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                Monatlich
              </button>
              <button
                onClick={() => setBillingPeriod('year')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: billingPeriod === 'year' ? 'var(--primary)' : 'transparent',
                  color: billingPeriod === 'year' ? '#ffffff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                Jährlich
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '12px',
                    opacity: 0.9,
                  }}
                >
                  (2 Monate geschenkt)
                </span>
              </button>
            </div>
          </div>

          {/* Karten-Grid */}
          <div
            className="pricing-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '24px',
              maxWidth: '1400px',
              margin: '0 auto',
              padding: isMobile ? '0 24px' : '0',
            }}
          >
            {PLAN_CONFIGS.map((planConfig) => (
              <PricingCard
                key={planConfig.id}
                planId={planConfig.id}
                billingPeriod={billingPeriod}
                billingMode={billingMode}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Vergleichstabelle im Iconsax-Stil */}
        <PricingTable billingMode={billingMode} />

        {/* CTA Section */}
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            marginTop: '80px',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Noch Fragen?
          </h3>
          <p
            style={{
              color: 'var(--text-muted)',
              marginBottom: '24px',
              fontSize: '16px',
            }}
          >
            Kontaktiere uns für eine individuelle Beratung oder einen Demo-Termin.
          </p>
          <Link
            href="/kontakt"
            style={{
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            <button className="btn-primary">Kontakt aufnehmen</button>
          </Link>
        </div>

        {/* Footer Note */}
        <p
          style={{
            marginTop: '48px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        >
          Alle Pläne sind monatlich kündbar. Kein Risiko, kein Kleingedrucktes.
          {billingPeriod === 'year' && ' Jährliche Pläne: 2 Monate geschenkt.'}
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Arvo Labs</h4>
            <p>Automatisierung, die funktioniert.</p>
          </div>
          <div className="footer-section">
            <h4>Produkt</h4>
            <Link href="/funktionen">Funktionen</Link>
            <a href="#">Dokumentation</a>
          </div>
          <div className="footer-section">
            <h4>Unternehmen</h4>
            <Link href="/ueber-uns">Über uns</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/kontakt">Kontakt</Link>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/agb">AGB</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Arvo Labs. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </main>
  );
}
