# Plan-System Dokumentation

## Übersicht

Das Plan-System ermöglicht es, drei getrennte Dashboards für verschiedene Pricing-Pläne bereitzustellen:
- **Starter** (`/dashboard/starter`) - Minimales Dashboard mit Chat
- **Pro** (`/dashboard/pro`) - Erweitertes Dashboard mit Chat, Dokumente, Mail, Ziele, Timesheets
- **Individual** (`/dashboard/individual`) - Vollständiges Dashboard mit allen Features

## Architektur

### 1. Plan-Speicherung

Der Plan wird in **Clerk's `publicMetadata.plan`** gespeichert:
- Mögliche Werte: `"starter"`, `"pro"`, `"individual"`, oder `null`
- Keine separate Datenbank erforderlich
- Zugriff über `user.publicMetadata.plan`

### 2. Helper-Funktionen

**Datei:** `lib/plan-utils.ts`

- `getUserPlan(user)` - Liest den Plan eines Users
- `setUserPlan(userId, plan)` - Setzt den Plan eines Users
- `hasPlanAccess(userPlan, requiredPlan)` - Prüft Plan-Zugriff
- `getCurrentUserPlan()` - Server-side Helper für aktuellen User
- `requirePlan(userPlan, routePlan)` - Prüft Route-Zugriff

### 3. Routing-Logik

**Datei:** `app/dashboard/page.tsx` (Server Component)

Diese Route leitet User automatisch weiter:
- `starter` → `/dashboard/starter`
- `pro` → `/dashboard/pro`
- `individual` → `/dashboard/individual`
- `null` → `/preise` (kein Plan zugewiesen)

**WICHTIG:** Diese Route wird nach Login/SignUp aufgerufen (siehe `app/layout.tsx`:
- `afterSignInUrl="/dashboard"`
- `afterSignUpUrl="/dashboard"`

### 4. Route-Guards

**Middleware:** `middleware.ts`

- Schützt alle Dashboard-Routen vor unauthentifizierten Usern
- Prüft zusätzlich, ob User auf die richtige Dashboard-Route zugreift
- Redirects bei falschem Plan-Zugriff

**Client-side Guards:** In jeder Dashboard-Seite (`starter/page.tsx`, `pro/page.tsx`, `individual/page.tsx`)

- Prüft den Plan des Users
- Redirects bei falschem Plan

### 5. Dashboard-Struktur

```
app/dashboard/
├── page.tsx              # Root-Route (Server Component) - leitet weiter
├── layout.tsx            # Gemeinsames Layout für alle Dashboards
├── starter/
│   └── page.tsx          # Starter-Dashboard (Client Component)
├── pro/
│   └── page.tsx          # Pro-Dashboard (Client Component)
└── individual/
    └── page.tsx          # Individual-Dashboard (Client Component)
```

## Plan setzen

### Nach erfolgreichem Checkout

**WICHTIG:** Der Plan sollte nach erfolgreichem Checkout (z.B. Stripe Webhook) gesetzt werden.

**Beispiel für Stripe Webhook:**

```typescript
// app/api/webhooks/stripe/route.ts
import { setUserPlan } from '@/lib/plan-utils';

export async function POST(request: Request) {
  const event = await request.json();
  
  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.client_reference_id; // Clerk User ID
    const plan = event.data.object.metadata.plan; // 'starter', 'pro', 'individual'
    
    await setUserPlan(userId, plan);
  }
  
  return Response.json({ received: true });
}
```

### Manuell setzen (für Testing)

**API Route:** `POST /api/users/set-plan`

```typescript
const response = await fetch('/api/users/set-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_xxx', // Optional, falls Admin
    plan: 'pro' // 'starter' | 'pro' | 'individual' | null
  })
});
```

**Oder direkt in Clerk Dashboard:**
1. Gehe zu User → Public Metadata
2. Füge hinzu: `{ "plan": "pro" }`

## Neue Pläne hinzufügen

Um einen neuen Plan hinzuzufügen:

1. **Plan-Typ erweitern** in `lib/plan-utils.ts`:
   ```typescript
   export type PlanType = 'starter' | 'pro' | 'individual' | 'enterprise' | null;
   ```

2. **Routing erweitern** in `app/dashboard/page.tsx`:
   ```typescript
   } else if (plan === 'enterprise') {
     redirect('/dashboard/enterprise');
   }
   ```

3. **Neue Dashboard-Seite erstellen** `app/dashboard/enterprise/page.tsx`

4. **Middleware erweitern** in `middleware.ts`:
   ```typescript
   if (pathname.startsWith('/dashboard/enterprise') && plan !== 'enterprise') {
     return NextResponse.redirect(new URL("/dashboard", req.url));
   }
   ```

5. **Guard in Dashboard-Seite** hinzufügen (siehe `starter/page.tsx` als Beispiel)

## Supabase Integration

Supabase wird weiterhin für alle bestehenden Daten verwendet. Der Plan kann später in Supabase-Queries einfließen:

```typescript
// Beispiel: Plan-basierte Datenfilterung
const { data } = await supabase
  .from('workflows')
  .select('*')
  .eq('user_id', userId)
  .eq('plan', userPlan); // Optional: Plan-Filter
```

**Aktuelle Supabase-Nutzung:**
- Siehe `app/dashboard/individual/page.tsx` für Beispiele
- Supabase Client wird mit Clerk-Token erstellt (siehe `supabase` useMemo)

## Wichtige Dateien

- `lib/plan-utils.ts` - Plan-Helper-Funktionen
- `app/api/users/set-plan/route.ts` - API Route zum Setzen des Plans
- `app/dashboard/page.tsx` - Root-Route mit Plan-basierten Redirects
- `app/dashboard/layout.tsx` - Gemeinsames Dashboard-Layout
- `app/dashboard/starter/page.tsx` - Starter-Dashboard
- `app/dashboard/pro/page.tsx` - Pro-Dashboard
- `app/dashboard/individual/page.tsx` - Individual-Dashboard (vollständig)
- `middleware.ts` - Route-Guards und Plan-Prüfungen

## Testing

1. **Plan setzen:**
   ```bash
   curl -X POST http://localhost:3000/api/users/set-plan \
     -H "Content-Type: application/json" \
     -d '{"plan": "starter"}'
   ```

2. **Login testen:**
   - Nach Login sollte automatisch zum richtigen Dashboard weitergeleitet werden
   - Direkter Zugriff auf falsche Dashboard-Route sollte redirecten

3. **Plan wechseln:**
   - Plan in Clerk Dashboard ändern
   - Oder API Route verwenden
   - Nach Reload sollte zum neuen Dashboard weitergeleitet werden

## Sicherheit

- ✅ Alle Dashboard-Routen sind durch Middleware geschützt
- ✅ Plan-Prüfung sowohl in Middleware als auch Client-side
- ✅ Server-side Redirects verhindern direkten Zugriff
- ⚠️ API Route `/api/users/set-plan` sollte für Produktion zusätzlich gesichert werden (Webhook-Secret, Admin-Check)
