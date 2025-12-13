/**
 * PricingTable-Komponente im Iconsax-Stil
 * 
 * Zeigt eine detaillierte Vergleichstabelle mit Features, Tools und Team-Informationen.
 * Layout orientiert sich an Iconsax mit Row-Cards.
 */

'use client';

import { FEATURES, PLAN_CONFIGS, BillingMode, getTeamInfo } from '@/lib/pricing-config';
import FeatureRow from './FeatureRow';

interface PricingTableProps {
  billingMode: BillingMode;
}

// Feature-Kategorien für bessere Gruppierung
const FEATURE_CATEGORIES = {
  features: FEATURES.filter(
    (f) =>
      !f.key.includes('support-') &&
      !f.key.includes('integrations-') &&
      !f.key.includes('workspace-') &&
      !f.key.includes('custom-') &&
      !f.key.includes('on-premise')
  ),
  tools: FEATURES.filter(
    (f) =>
      f.key.includes('dashboards') ||
      f.key.includes('whiteboards') ||
      f.key.includes('forms') ||
      f.key.includes('cards') ||
      f.key.includes('custom-software') ||
      f.key.includes('custom-workflows')
  ),
  support: FEATURES.filter((f) => f.key.includes('support-')),
  integrations: FEATURES.filter((f) => f.key.includes('integrations-')),
  workspace: FEATURES.filter((f) => f.key.includes('workspace-')),
  custom: FEATURES.filter(
    (f) => f.key.includes('custom-') || f.key.includes('on-premise')
  ),
};

export default function PricingTable({ billingMode }: PricingTableProps) {
  return (
    <div
      style={{
        marginTop: '80px',
        marginBottom: '80px',
      }}
    >
      {/* Features-Bereich */}
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '32px',
            color: 'var(--text-primary)',
          }}
        >
          Features
        </h2>

        {/* Header-Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(4, 1fr)',
              gap: '16px',
              padding: '20px 24px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              marginBottom: '12px',
              fontWeight: 600,
              fontSize: '15px',
              color: 'var(--text-primary)',
            }}
          >
            <div>Funktionen</div>
            {PLAN_CONFIGS.map((plan) => (
              <div key={plan.id} style={{ textAlign: 'center' }}>
                {plan.name}
              </div>
            ))}
          </div>

        {/* Feature-Rows */}
        <div>
          {FEATURE_CATEGORIES.features.map((feature, idx) => (
            <FeatureRow
              key={feature.key}
              feature={feature}
              isLast={idx === FEATURE_CATEGORIES.features.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Tools-Bereich */}
      {FEATURE_CATEGORIES.tools.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '32px',
              color: 'var(--text-primary)',
            }}
          >
            Tools & Erweiterungen
          </h2>

          {/* Header-Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(4, 1fr)',
              gap: '16px',
              padding: '20px 24px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              marginBottom: '12px',
              fontWeight: 600,
              fontSize: '15px',
              color: 'var(--text-primary)',
            }}
          >
            <div>Tools</div>
            {PLAN_CONFIGS.map((plan) => (
              <div key={plan.id} style={{ textAlign: 'center' }}>
                {plan.name}
              </div>
            ))}
          </div>

          {/* Tool-Rows */}
          <div>
            {FEATURE_CATEGORIES.tools.map((feature, idx) => (
              <FeatureRow
                key={feature.key}
                feature={feature}
                isLast={idx === FEATURE_CATEGORIES.tools.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Team-Bereich */}
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '32px',
            color: 'var(--text-primary)',
          }}
        >
          Team & Support
        </h2>

        {/* Header-Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(4, 1fr)',
            gap: '16px',
            padding: '20px 24px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            marginBottom: '12px',
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--text-primary)',
          }}
        >
          <div>Team & Support</div>
          {PLAN_CONFIGS.map((plan) => (
            <div key={plan.id} style={{ textAlign: 'center' }}>
              {plan.name}
            </div>
          ))}
        </div>

        {/* Team-Größe Row */}
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
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: '15px',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              Team-Größe
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}
            >
              Anzahl der Nutzer, die gleichzeitig arbeiten können
            </div>
          </div>
          {PLAN_CONFIGS.map((plan) => (
            <div
              key={plan.id}
              style={{
                textAlign: 'center',
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              {getTeamInfo(plan.id, billingMode)}
            </div>
          ))}
        </div>

        {/* Support-Rows */}
        <div>
          {FEATURE_CATEGORIES.support.map((feature, idx) => (
            <FeatureRow
              key={feature.key}
              feature={feature}
              isLast={idx === FEATURE_CATEGORIES.support.length - 1}
            />
          ))}
        </div>

        {/* Integration-Rows */}
        {FEATURE_CATEGORIES.integrations.length > 0 && (
          <div>
            {FEATURE_CATEGORIES.integrations.map((feature, idx) => (
              <FeatureRow
                key={feature.key}
                feature={feature}
                isLast={idx === FEATURE_CATEGORIES.integrations.length - 1}
              />
            ))}
          </div>
        )}

        {/* Workspace-Rows */}
        {FEATURE_CATEGORIES.workspace.length > 0 && (
          <div>
            {FEATURE_CATEGORIES.workspace.map((feature, idx) => (
              <FeatureRow
                key={feature.key}
                feature={feature}
                isLast={idx === FEATURE_CATEGORIES.workspace.length - 1}
              />
            ))}
          </div>
        )}

        {/* Custom-Rows (nur für Individuell relevant) */}
        {FEATURE_CATEGORIES.custom.length > 0 && (
          <div>
            {FEATURE_CATEGORIES.custom.map((feature, idx) => (
              <FeatureRow
                key={feature.key}
                feature={feature}
                isLast={idx === FEATURE_CATEGORIES.custom.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

