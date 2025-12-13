/**
 * PricingToggle-Komponente
 * 
 * Toggle zwischen User- und Team-Modus für Pricing.
 * Layout orientiert sich an Iconsax "Personal / Team" Toggle.
 */

'use client';

import { BillingMode } from '@/lib/pricing-config';

interface PricingToggleProps {
  billingMode: BillingMode;
  onModeChange: (mode: BillingMode) => void;
}

export default function PricingToggle({ billingMode, onModeChange }: PricingToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '4px',
        border: '1px solid var(--border-subtle)',
        gap: '4px',
      }}
    >
      <button
        onClick={() => onModeChange('user')}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          background: billingMode === 'user' ? 'var(--primary)' : 'transparent',
          color: billingMode === 'user' ? '#ffffff' : 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        User
      </button>
      <button
        onClick={() => onModeChange('team')}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          background: billingMode === 'team' ? 'var(--primary)' : 'transparent',
          color: billingMode === 'team' ? '#ffffff' : 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        Team
      </button>
    </div>
  );
}

