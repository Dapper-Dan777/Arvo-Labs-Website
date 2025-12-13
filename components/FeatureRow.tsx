/**
 * FeatureRow-Komponente für Vergleichstabelle
 * 
 * Zeigt eine einzelne Feature-Zeile mit Haken/Kreuzen für jeden Plan.
 * Layout orientiert sich an Iconsax mit Row-Card-Style.
 */

'use client';

import { Check, X } from 'lucide-react';
import { Feature, PlanId, hasFeature } from '@/lib/pricing-config';
import { PLAN_CONFIGS } from '@/lib/pricing-config';

interface FeatureRowProps {
  feature: Feature;
  isLast: boolean;
}

export default function FeatureRow({ feature, isLast }: FeatureRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr repeat(4, 1fr)',
        gap: '16px',
        padding: '20px 24px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        marginBottom: '12px',
        transition: 'all 0.2s ease',
        alignItems: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-surface)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--card-bg)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Feature-Name und Beschreibung */}
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          {feature.label}
        </div>
        {feature.description && (
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: '1.4',
            }}
          >
            {feature.description}
          </div>
        )}
      </div>

      {/* Plan-Spalten */}
      {PLAN_CONFIGS.map((plan) => {
        const hasAccess = hasFeature(plan.id, feature.key);
        return (
          <div
            key={plan.id}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {hasAccess ? (
              <Check
                size={20}
                style={{
                  color: 'var(--primary)',
                }}
              />
            ) : (
              <X
                size={18}
                style={{
                  color: 'var(--text-muted)',
                  opacity: 0.4,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
