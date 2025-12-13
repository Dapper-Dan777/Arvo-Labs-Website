/**
 * Pricing-Konfiguration mit User/Team-Unterstützung
 * 
 * Diese Datei enthält die zentrale Konfiguration für Pläne, Features und Billing.
 * 
 * WICHTIG: Plan-IDs müssen im Clerk Dashboard konfiguriert werden.
 * Siehe Kommentare unten, wo die Plan-IDs gepflegt werden.
 * 
 * Um neue Features hinzuzufügen:
 * 1. Füge das Feature zur FEATURES-Liste hinzu
 * 2. Aktualisiere die includedIn-Arrays für jeden Plan
 * 
 * Um neue Pläne hinzuzufügen:
 * 1. Erweitere den PlanId-Type
 * 2. Füge den Plan zu PLAN_CONFIGS hinzu
 * 3. Aktualisiere die Feature-Zuordnungen
 * 
 * Um weitere Billing-Modi hinzuzufügen (z.B. jährlich/monatlich):
 * 1. Erweitere den BillingMode-Type
 * 2. Füge entsprechende Felder zur PlanConfig hinzu
 * 3. Aktualisiere die getPlanForMode-Funktion
 */

export type PlanId = 'starter' | 'pro' | 'enterprise' | 'individual';
export type BillingMode = 'user' | 'team';

/**
 * Plan-Konfiguration mit separaten User/Team-Varianten
 * 
 * WICHTIG: Alle Preise und Plan-IDs werden hier zentral gepflegt.
 * Keine hart codierten Werte in Komponenten!
 */
export interface PlanConfig {
  id: PlanId;
  name: string;
  descriptionUser: string;
  descriptionTeam: string;
  priceUser: {
    monthly: number | 'custom';
    yearly?: number | 'custom';
  };
  priceTeam: {
    monthly: number | 'custom';
    yearly?: number | 'custom';
  };
  features: string[]; // Kurze Bulletpoints für die Karte
  clerkPlanUserId?: string; // User Plan-ID aus Clerk Dashboard (siehe .env.local)
  clerkPlanTeamId?: string; // Team Plan-ID (direkt im Code definiert)
  highlighted?: boolean; // Für "Beliebt"-Badge
  isContactOnly?: boolean; // Immer zu Kontakt weiterleiten (z.B. Individuell)
}

export interface Feature {
  key: string;
  label: string;
  description?: string;
  includedIn: PlanId[]; // In welchen Plänen ist dieses Feature verfügbar
}

/**
 * Plan-Konfiguration mit User/Team-Varianten
 * 
 * WICHTIG: Clerk Plan-IDs müssen in .env.local gesetzt werden:
 * - NEXT_PUBLIC_CLERK_STARTER_PLAN_ID (User)
 * - NEXT_PUBLIC_CLERK_PRO_PLAN_ID (User)
 * - NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID (User)
 * 
 * Team Plan-IDs sind direkt hier im Code definiert:
 * - Starter (Team): cplan_36jkgky6qmyh8PQHFwfAiNUazwZ
 * - Pro (Team): cplan_36jkljbhoLb7AvJihZVGs2aJCz9
 * - Enterprise (Team): cplan_36jks6IaQDVu1qykEUfToWIuehF
 * 
 * Diese IDs findest du im Clerk Dashboard unter:
 * Billing → Plans → [Plan-Name] → Plan ID
 */
export const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    descriptionUser: 'Perfekt für den Einstieg',
    descriptionTeam: 'Ideal für kleine Teams',
    priceUser: {
      monthly: 0,
    },
    priceTeam: {
      monthly: 19.99,
      yearly: 199.9, // 10 Monate bezahlen, 2 Monate geschenkt
    },
    features: [
      'Chat-Funktion',
      'Basis-Automatisierung',
      'Community-Support',
    ],
    clerkPlanUserId: process.env.NEXT_PUBLIC_CLERK_STARTER_PLAN_ID,
    clerkPlanTeamId: 'cplan_36jkgky6qmyh8PQHFwfAiNUazwZ', // Starter Team Plan-ID
  },
  {
    id: 'pro',
    name: 'Pro',
    descriptionUser: 'Für professionelle Nutzer',
    descriptionTeam: 'Für Teams bis zu 5 Nutzer',
    priceUser: {
      monthly: 29,
      yearly: 290, // 10 Monate bezahlen, 2 Monate geschenkt
    },
    priceTeam: {
      monthly: 49.99,
      yearly: 499.9, // 10 Monate bezahlen, 2 Monate geschenkt
    },
    features: [
      'Alle Starter-Features',
      'Dokumenten-Verwaltung',
      'E-Mail-Automatisierung',
      'Ziele & Timesheets',
      'Priority Support',
    ],
    clerkPlanUserId: process.env.NEXT_PUBLIC_CLERK_PRO_PLAN_ID,
    clerkPlanTeamId: 'cplan_36jkljbhoLb7AvJihZVGs2aJCz9', // Pro Team Plan-ID
    highlighted: true, // "Beliebt"-Badge
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    descriptionUser: 'Für wachsende Unternehmen',
    descriptionTeam: 'Für Teams bis zu 20 Nutzer',
    priceUser: {
      monthly: 150,
      yearly: 1500, // 10 Monate bezahlen, 2 Monate geschenkt
    },
    priceTeam: {
      monthly: 120,
      yearly: 1200, // 10 Monate bezahlen, 2 Monate geschenkt
    },
    features: [
      'Alle Pro-Features',
      'Teams & Collaboration',
      'Custom Dashboards',
      'Whiteboards & Formulare',
      'Dedizierter Account Manager',
      'Custom Integrationen',
    ],
    clerkPlanUserId: process.env.NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID,
    clerkPlanTeamId: 'cplan_36jks6IaQDVu1qykEUfToWIuehF', // Enterprise Team Plan-ID
  },
  {
    id: 'individual',
    name: 'Individuell',
    descriptionUser: 'Maßgeschneiderte Lösungen',
    descriptionTeam: 'Maßgeschneiderte Lösungen für Ihr Team',
    priceUser: {
      monthly: 'custom',
    },
    priceTeam: {
      monthly: 'custom',
    },
    features: [
      'Alle Enterprise-Features',
      'Eigene Software & Custom Apps',
      'Individualisierte Workflows',
      'Persönlicher Account Manager',
      'On-Premise möglich',
      'Custom Integrationen',
    ],
    clerkPlanUserId: undefined, // Kein direkter Billing-Plan, führt zu Kontakt
    clerkPlanTeamId: undefined, // Kein direkter Billing-Plan, führt zu Kontakt
    isContactOnly: true, // Immer zu Kontakt weiterleiten
  },
];

/**
 * Helper: Gibt die Plan-Konfiguration für einen bestimmten Billing-Modus zurück
 * 
 * Diese Funktion wird von allen Komponenten verwendet, um Plan-Daten abzurufen.
 * Keine direkten Zugriffe auf PLAN_CONFIGS in Komponenten!
 */
export function getPlanConfig(planId: PlanId, billingMode: BillingMode) {
  const config = PLAN_CONFIGS.find((p) => p.id === planId);
  if (!config) return null;

  return {
    id: config.id,
    name: config.name,
    description: billingMode === 'team' ? config.descriptionTeam : config.descriptionUser,
    price: billingMode === 'team' ? config.priceTeam : config.priceUser,
    features: config.features,
    clerkPlanId: billingMode === 'team' ? config.clerkPlanTeamId : config.clerkPlanUserId,
    highlighted: config.highlighted,
    isContactOnly: config.isContactOnly,
  };
}

/**
 * Helper: Gibt alle Pläne für einen bestimmten Billing-Modus zurück
 */
export function getPlansForMode(billingMode: BillingMode) {
  return PLAN_CONFIGS.map((config) => getPlanConfig(config.id, billingMode)!);
}

/**
 * Helper: Formatiert einen Preis als String
 * 
 * @param price - Preis (number oder 'custom')
 * @param period - 'month' oder 'year'
 * @param billingMode - 'user' oder 'team'
 * @returns Formatierter Preis-String (z.B. "0 € / Monat", "29 € / Monat / Team")
 */
export function formatPrice(
  price: number | 'custom',
  period: 'month' | 'year',
  billingMode: BillingMode
): string {
  if (price === 'custom') {
    return 'Auf Anfrage';
  }

  const periodLabel = period === 'year' ? 'Jahr' : 'Monat';
  const teamSuffix = billingMode === 'team' ? ' / Team' : '';

  return `€${price} / ${periodLabel}${teamSuffix}`;
}

/**
 * Helper: Gibt Plan-Daten für einen bestimmten Modus zurück
 * 
 * Diese Funktion wird von Buttons verwendet, um die richtige Plan-ID und andere Daten zu erhalten.
 */
export function getPlanForMode(planId: PlanId, mode: BillingMode): {
  price: string;
  description: string;
  clerkPlanId?: string;
  isContactOnly?: boolean;
} | null {
  const config = PLAN_CONFIGS.find((p) => p.id === planId);
  if (!config) return null;

  const priceObj = mode === 'team' ? config.priceTeam : config.priceUser;
  const price = priceObj.monthly; // Standard: monatlich

  return {
    price: formatPrice(price, 'month', mode),
    description: mode === 'team' ? config.descriptionTeam : config.descriptionUser,
    clerkPlanId: mode === 'team' ? config.clerkPlanTeamId : config.clerkPlanUserId,
    isContactOnly: config.isContactOnly,
  };
}

/**
 * Feature-Liste basierend auf Dashboard-Analyse
 * 
 * Diese Liste wurde automatisch aus den Dashboard-Implementierungen abgeleitet:
 * - Starter: Chat
 * - Pro: Chat, Dokumente, Mail, Ziele, Timesheets, Mehr
 * - Enterprise: Alle Pro-Features + Startseite, Posteingang, Teams, Dashboards, Whiteboards, Formulare, Karten
 * 
 * Um neue Features hinzuzufügen:
 * 1. Füge ein neues Feature-Objekt zur FEATURES-Liste hinzu
 * 2. Setze includedIn auf die Pläne, die dieses Feature haben sollen
 */
export const FEATURES: Feature[] = [
  // Core Features
  {
    key: 'chat',
    label: 'Chat & KI-Assistent',
    description: 'Intelligenter Chat mit KI-Unterstützung',
    includedIn: ['starter', 'pro', 'enterprise', 'individual'],
  },
  {
    key: 'home-dashboard',
    label: 'Startseite & Übersicht',
    description: 'Persönliches Dashboard mit Workflows',
    includedIn: ['enterprise', 'individual'],
  },
  {
    key: 'inbox',
    label: 'Posteingang',
    description: 'Zentralisierter Posteingang',
    includedIn: ['enterprise', 'individual'],
  },
  
  // Dokumente & Dateien
  {
    key: 'documents',
    label: 'Dokumenten-Verwaltung',
    description: 'Dokumente hochladen, analysieren und verwalten',
    includedIn: ['pro', 'enterprise', 'individual'],
  },
  
  // Kommunikation
  {
    key: 'mail',
    label: 'E-Mail-Automatisierung',
    description: 'E-Mails senden und automatisieren',
    includedIn: ['pro', 'enterprise', 'individual'],
  },
  
  // Projektmanagement
  {
    key: 'goals',
    label: 'Ziele & Zielverfolgung',
    description: 'Ziele setzen und Fortschritt tracken',
    includedIn: ['pro', 'enterprise', 'individual'],
  },
  {
    key: 'timesheets',
    label: 'Zeiterfassung',
    description: 'Zeiten erfassen und verwalten',
    includedIn: ['pro', 'enterprise', 'individual'],
  },
  
  // Collaboration (Enterprise & Individuell)
  {
    key: 'teams',
    label: 'Teams & Collaboration',
    description: 'Teams erstellen und zusammenarbeiten',
    includedIn: ['enterprise', 'individual'],
  },
  {
    key: 'dashboards',
    label: 'Custom Dashboards',
    description: 'Individuelle Dashboards erstellen',
    includedIn: ['enterprise', 'individual'],
  },
  {
    key: 'whiteboards',
    label: 'Whiteboards',
    description: 'Kollaborative Whiteboards',
    includedIn: ['enterprise', 'individual'],
  },
  {
    key: 'forms',
    label: 'Formulare',
    description: 'Formulare erstellen und verwalten',
    includedIn: ['enterprise', 'individual'],
  },
  {
    key: 'cards',
    label: 'Custom Cards',
    description: 'Eigene Karten und Widgets erstellen',
    includedIn: ['enterprise', 'individual'],
  },
  
  // Support & Extras
  {
    key: 'support-community',
    label: 'Community-Support',
    description: 'Support über Community-Forum',
    includedIn: ['starter'],
  },
  {
    key: 'support-priority',
    label: 'Priority Support',
    description: 'Priorisierter E-Mail-Support',
    includedIn: ['pro', 'enterprise', 'individual'],
  },
  {
    key: 'support-dedicated',
    label: 'Dedizierter Account Manager',
    description: 'Persönlicher Ansprechpartner',
    includedIn: ['enterprise', 'individual'],
  },
  
  // Integrationen & API
  {
    key: 'integrations-basic',
    label: 'Basis-Integrationen',
    description: 'Standard-Integrationen (Supabase, etc.)',
    includedIn: ['starter', 'pro', 'enterprise', 'individual'],
  },
  {
    key: 'integrations-custom',
    label: 'Custom Integrationen',
    description: 'Maßgeschneiderte Integrationen',
    includedIn: ['enterprise', 'individual'],
  },
  
  // Workspace & Admin
  {
    key: 'workspace-individual',
    label: 'Individueller Workspace',
    description: 'Persönlicher Arbeitsbereich',
    includedIn: ['starter', 'pro', 'enterprise', 'individual'],
  },
  {
    key: 'workspace-team',
    label: 'Team-Workspace',
    description: 'Geteilter Team-Arbeitsbereich',
    includedIn: ['enterprise', 'individual'],
  },
  
  // Individuell-spezifische Features
  {
    key: 'custom-software',
    label: 'Eigene Software & Custom Apps',
    description: 'Maßgeschneiderte Software-Lösungen',
    includedIn: ['individual'],
  },
  {
    key: 'custom-workflows',
    label: 'Individualisierte Workflows',
    description: 'Komplett auf Ihr Team angepasste Prozesse',
    includedIn: ['individual'],
  },
  {
    key: 'on-premise',
    label: 'On-Premise Deployment',
    description: 'Installation in Ihrer eigenen Infrastruktur',
    includedIn: ['individual'],
  },
];

/**
 * Helper: Prüft, ob ein Feature in einem Plan enthalten ist
 */
export function hasFeature(planId: PlanId, featureKey: string): boolean {
  const feature = FEATURES.find((f) => f.key === featureKey);
  return feature ? feature.includedIn.includes(planId) : false;
}

/**
 * Helper: Gibt alle Features für einen Plan zurück
 */
export function getPlanFeatures(planId: PlanId): Feature[] {
  return FEATURES.filter((feature) => feature.includedIn.includes(planId));
}

/**
 * Team-Informationen für jeden Plan und Billing-Modus
 * 
 * WICHTIG: Diese Funktion wird von Karten und Tabelle verwendet.
 * Keine hart codierten Team-Infos in Komponenten!
 */
export function getTeamInfo(planId: PlanId, billingMode: BillingMode): string {
  if (billingMode === 'user') {
    return '1 Nutzer';
  }

  // Team-Modus
  switch (planId) {
    case 'starter':
      return 'Bis zu 5 Nutzer';
    case 'pro':
      return 'Bis zu 5 Nutzer';
    case 'enterprise':
      return 'Bis zu 20 Nutzer';
    case 'individual':
      return 'Unbegrenzte Nutzer / nach Absprache';
    default:
      return '1 Nutzer';
  }
}
