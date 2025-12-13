# Clerk Plan-ID Setup Anleitung

## Problem: "Enter plan id" wird angezeigt

Wenn beim Klick auf den Pro-Button (oder andere Plan-Buttons) "Enter plan id" angezeigt wird, bedeutet das, dass die Plan-ID noch nicht in `.env.local` konfiguriert ist.

## Lösung: Plan-IDs in Clerk finden und setzen

### Schritt 1: Plan-IDs im Clerk Dashboard finden

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com)
2. Wähle deine Anwendung aus
3. Navigiere zu **Billing** → **Plans**
4. Klicke auf den Plan, den du konfigurieren möchtest (z.B. "Pro")
5. In den Plan-Details findest du die **Plan ID** (beginnt mit `cplan_...`)
   - Beispiel: `cplan_2abc3def4ghi5jkl`

### Schritt 2: Plan-IDs in .env.local setzen

1. Öffne die Datei `.env.local` im Root-Verzeichnis deines Projekts
2. Füge die folgenden Zeilen hinzu (ersetze `cplan_xxx` mit deinen echten Plan-IDs):

```env
# Clerk Billing Plan-IDs
# Diese IDs findest du im Clerk Dashboard unter Billing → Plans → [Plan-Name] → Plan ID

NEXT_PUBLIC_CLERK_STARTER_PLAN_ID=cplan_xxx
NEXT_PUBLIC_CLERK_PRO_PLAN_ID=cplan_xxx
NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID=cplan_xxx
```

**Beispiel:**
```env
NEXT_PUBLIC_CLERK_STARTER_PLAN_ID=cplan_2abc3def4ghi5jkl
NEXT_PUBLIC_CLERK_PRO_PLAN_ID=cplan_3def4ghi5jkl6mno
NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID=cplan_4ghi5jkl6mno7pqr
```

### Schritt 3: Pläne im Clerk Dashboard erstellen (falls noch nicht vorhanden)

Falls du noch keine Pläne erstellt hast:

1. Gehe zu Clerk Dashboard → **Billing** → **Plans**
2. Klicke auf **"Create Plan"**
3. Fülle die Details aus:
   - **Name**: z.B. "Starter", "Pro", "Enterprise"
   - **Price**: z.B. €0 (Starter), €29 (Pro), Custom (Enterprise)
   - **Billing Period**: Monthly oder Yearly
4. Speichere den Plan
5. Kopiere die **Plan ID** und füge sie in `.env.local` ein

### Schritt 4: Dev-Server neu starten

Nach dem Setzen der Umgebungsvariablen:

1. Stoppe den Dev-Server (Ctrl+C)
2. Starte ihn neu: `npm run dev`
3. Die Plan-IDs werden jetzt geladen

### Schritt 5: Testen

1. Gehe zu `/pricing`
2. Klicke auf "Pro wählen" (oder einen anderen Plan-Button)
3. Der Checkout sollte sich jetzt öffnen, ohne "Enter plan id" zu zeigen

## Troubleshooting

### Problem: Plan-ID wird immer noch nicht erkannt

**Lösung 1:** Prüfe, ob die Datei `.env.local` im Root-Verzeichnis liegt (nicht in `app/` oder `src/`)

**Lösung 2:** Stelle sicher, dass die Variablennamen exakt so sind:
- `NEXT_PUBLIC_CLERK_STARTER_PLAN_ID` (nicht `CLERK_STARTER_PLAN_ID`)
- `NEXT_PUBLIC_CLERK_PRO_PLAN_ID` (nicht `CLERK_PRO_PLAN_ID`)
- `NEXT_PUBLIC_CLERK_ENTERPRISE_PLAN_ID` (nicht `CLERK_ENTERPRISE_PLAN_ID`)

**Lösung 3:** Prüfe, ob die Plan-ID mit `cplan_` beginnt (nicht `plan_` oder etwas anderes)

**Lösung 4:** Lösche den `.next` Ordner und starte neu:
```bash
rm -rf .next
npm run dev
```

### Problem: "Plan-ID für pro nicht konfiguriert" in der Konsole

Das bedeutet, dass die Umgebungsvariable nicht geladen wurde. Prüfe:
1. Ist `.env.local` im Root-Verzeichnis?
2. Beginnt die Variable mit `NEXT_PUBLIC_`?
3. Wurde der Dev-Server nach dem Hinzufügen der Variablen neu gestartet?

## Wichtige Hinweise

- **NEXT_PUBLIC_** Präfix ist wichtig: Nur Variablen mit diesem Präfix sind im Browser verfügbar
- **Keine Leerzeichen**: Stelle sicher, dass nach dem `=` kein Leerzeichen ist
- **Keine Anführungszeichen**: Die Plan-ID sollte direkt nach dem `=` stehen, ohne `"` oder `'`
- **.env.local nicht committen**: Diese Datei sollte in `.gitignore` sein (ist sie normalerweise bereits)

## Alternative: Manueller Checkout-Link

Falls du die Plan-IDs noch nicht konfiguriert hast, kannst du auch direkt zur Checkout-Seite weiterleiten:

```typescript
// In app/pricing/page.tsx wird automatisch zu /checkout weitergeleitet,
// wenn die Plan-ID nicht gesetzt ist
```

Die Checkout-Seite zeigt dann die vollständige Pricing Table von Clerk an, wo der User den Plan auswählen kann.

