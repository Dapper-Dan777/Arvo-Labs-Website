# Pricing-System Setup Anleitung

## Übersicht

Die neue Pricing-Seite (`/pricing`) zeigt drei Pläne (Starter, Pro, Enterprise) mit einer detaillierten Vergleichstabelle und Checkout-Buttons, die mit Clerk-Billing verbunden sind.

## Plan-Struktur

### Pläne

1. **Starter** - Kostenlos, nur Chat
2. **Pro** - €29/Monat, Chat + Dokumente + Mail + Ziele + Timesheets
3. **Enterprise** - Individuell, alle Features inkl. Teams, Dashboards, Whiteboards, etc.

**WICHTIG:** "Enterprise" wird intern als "individual" gespeichert, um Kompatibilität mit dem bestehenden Dashboard-System zu gewährleisten.

## Setup-Schritte

### 1. Clerk Billing-Pläne erstellen

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigiere zu **Billing** → **Plans**
3. Erstelle drei Pläne:
   - **Starter** (kostenlos)
   - **Pro** (€29/Monat)
   - **Enterprise** (individuell)

4. Kopiere die **Plan-IDs** (beginnen mit `cplan_...`)

### 2. Umgebungsvariablen setzen

Füge in `.env.local` hinzu:

```env
NEXT_PUBLIC_CLERK_STARTER_PLAN_ID=cplan_xxx
NEXT_PUBLIC_CLERK_PRO_PLAN_ID=cplan_xxx
NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID=cplan_xxx
```

**WICHTIG:** Diese IDs findest du im Clerk Dashboard unter:
Billing → Plans → [Plan-Name] → Plan ID

### 3. Webhook konfigurieren (für automatisches Plan-Setting)

1. Gehe zu Clerk Dashboard → **Webhooks**
2. Erstelle einen neuen Webhook
3. Endpoint: `https://yourdomain.com/api/webhooks/clerk`
4. Wähle Events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
5. Kopiere das **Signing Secret**
6. Füge in `.env.local` hinzu:

```env
CLERK_WEBHOOK_SECRET=whsec_xxx
```

**Für lokale Entwicklung:**
- Verwende [ngrok](https://ngrok.com) oder ähnliches, um einen öffentlichen Tunnel zu erstellen
- Oder setze den Plan manuell über `/api/users/set-plan`

## Feature-Zuordnung

Die Features wurden automatisch aus den Dashboard-Implementierungen abgeleitet:

### Starter
- Chat & KI-Assistent
- Basis-Integrationen
- Individueller Workspace
- Community-Support

### Pro
- Alle Starter-Features
- Dokumenten-Verwaltung
- E-Mail-Automatisierung
- Ziele & Zielverfolgung
- Zeiterfassung
- Priority Support

### Enterprise
- Alle Pro-Features
- Startseite & Übersicht
- Posteingang
- Teams & Collaboration
- Custom Dashboards
- Whiteboards
- Formulare
- Custom Cards
- Dedizierter Account Manager
- Custom Integrationen
- Team-Workspace

## Neue Features hinzufügen

1. Öffne `lib/pricing-config.ts`
2. Füge ein neues Feature zur `FEATURES`-Liste hinzu:

```typescript
{
  key: 'neues-feature',
  label: 'Neues Feature',
  description: 'Beschreibung des Features',
  includedIn: ['pro', 'enterprise'], // In welchen Plänen verfügbar
}
```

3. Die Tabelle wird automatisch aktualisiert

## Neue Pläne hinzufügen

1. Erweitere `PlanId` in `lib/pricing-config.ts`:
   ```typescript
   export type PlanId = 'starter' | 'pro' | 'enterprise' | 'new-plan';
   ```

2. Füge Plan zu `PLANS` hinzu:
   ```typescript
   {
     id: 'new-plan',
     name: 'New Plan',
     price: { monthly: 49 },
     // ...
   }
   ```

3. Aktualisiere Feature-Zuordnungen in `FEATURES` (includedIn-Arrays)

4. Erstelle Dashboard-Seite: `app/dashboard/new-plan/page.tsx`

5. Aktualisiere Routing in `app/dashboard/page.tsx`

6. Füge Plan-ID zu `.env.local` hinzu

## Checkout-Flow

1. User klickt auf "Plan wählen" Button
2. Clerk Checkout wird geöffnet
3. Nach erfolgreichem Checkout:
   - Webhook wird an `/api/webhooks/clerk` gesendet
   - Plan wird in `user.publicMetadata.plan` gesetzt
   - User wird zu `/dashboard` weitergeleitet
   - Routing leitet automatisch zum richtigen Dashboard weiter

## Wichtige Dateien

- `app/pricing/page.tsx` - Pricing-Seite mit Vergleichstabelle
- `lib/pricing-config.ts` - Plan- und Feature-Konfiguration
- `lib/billing-utils.ts` - Helper-Funktionen für Billing
- `app/api/webhooks/clerk/route.ts` - Webhook-Handler für automatisches Plan-Setting
- `app/checkout/page.tsx` - Checkout-Seite

## Testing

1. **Plan-ID prüfen:**
   ```bash
   # Prüfe, ob Plan-IDs gesetzt sind
   echo $NEXT_PUBLIC_CLERK_PRO_PLAN_ID
   ```

2. **Checkout testen:**
   - Gehe zu `/pricing`
   - Klicke auf "Pro wählen"
   - Checkout sollte sich öffnen

3. **Webhook testen (lokal):**
   - Verwende ngrok: `ngrok http 3000`
   - Setze Webhook-URL in Clerk Dashboard
   - Führe Test-Event aus

4. **Plan manuell setzen (für Testing):**
   ```bash
   POST /api/users/set-plan
   Body: { "plan": "pro" }
   ```

## Troubleshooting

**Problem:** Checkout-Button funktioniert nicht
- **Lösung:** Prüfe, ob Plan-ID in `.env.local` gesetzt ist
- **Lösung:** Prüfe Browser-Konsole auf Fehler

**Problem:** Plan wird nach Checkout nicht gesetzt
- **Lösung:** Prüfe Webhook-Konfiguration in Clerk Dashboard
- **Lösung:** Prüfe `CLERK_WEBHOOK_SECRET` in `.env.local`
- **Lösung:** Prüfe Server-Logs für Webhook-Fehler

**Problem:** User landet im falschen Dashboard
- **Lösung:** Prüfe `user.publicMetadata.plan` in Clerk Dashboard
- **Lösung:** Prüfe Routing-Logik in `app/dashboard/page.tsx`

