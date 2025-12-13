# Admin-Setup Anleitung

## Übersicht

Admins haben Zugriff auf **alle Dashboards**, unabhängig vom Plan. Der Admin-Status wird in Clerk's `publicMetadata.is_admin` gespeichert.

## Admin erstellen

### Methode 1: Über Clerk Dashboard (Empfohlen)

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com)
2. Wähle deine Anwendung
3. Gehe zu **Users** → Wähle den User aus
4. Scrolle zu **Public Metadata**
5. Füge hinzu:
   ```json
   {
     "is_admin": true
   }
   ```
6. Speichere

### Methode 2: Über API Route

**WICHTIG:** Du musst bereits als Admin eingeloggt sein, um andere User zu Admins zu machen.

```bash
POST /api/users/set-admin
Content-Type: application/json

{
  "userId": "user_xxx",
  "isAdmin": true
}
```

**Beispiel mit curl:**
```bash
curl -X POST http://localhost:3000/api/users/set-admin \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=your_session_cookie" \
  -d '{"userId": "user_xxx", "isAdmin": true}'
```

### Methode 3: Ersten Admin manuell setzen

Falls noch kein Admin existiert, kannst du den ersten Admin direkt in Clerk setzen:

1. Gehe zu Clerk Dashboard → Users
2. Wähle deinen User
3. Setze `publicMetadata.is_admin = true`

Oder verwende die Clerk API direkt (mit deinem Secret Key):

```bash
curl -X PATCH https://api.clerk.com/v1/users/user_xxx/metadata \
  -H "Authorization: Bearer sk_test_your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{"public_metadata": {"is_admin": true}}'
```

## Admin-Funktionen

### Zugriff auf alle Dashboards

Admins können auf alle drei Dashboards zugreifen:
- `/dashboard/starter`
- `/dashboard/pro`
- `/dashboard/individual`

Nach Login werden Admins automatisch zum Individual-Dashboard weitergeleitet (hat alle Features).

### Admin-Prüfung im Code

```typescript
import { isAdmin } from '@/lib/plan-utils';

// In einer Komponente
const userIsAdmin = isAdmin(user);

if (userIsAdmin) {
  // Admin-spezifische Logik
}
```

### Admin-Status setzen (Programmatisch)

```typescript
import { setUserAdmin } from '@/lib/plan-utils';

// Nur Admins können andere User zu Admins machen
await setUserAdmin(userId, true);  // Admin setzen
await setUserAdmin(userId, false); // Admin entfernen
```

## Sicherheit

### API Route Schutz

Die Route `/api/users/set-admin` ist geschützt:
- Nur eingeloggte User können sie aufrufen
- Nur Admins können andere User zu Admins machen
- User können sich nicht selbst zu Admins machen (außer über Clerk Dashboard)

### Middleware Schutz

Die Middleware prüft Admin-Status und erlaubt Admins Zugriff auf alle Dashboard-Routen.

### Client-side Guards

Jede Dashboard-Seite prüft zusätzlich den Admin-Status und erlaubt Admins den Zugriff.

## Fallback-Admin-Prüfung

Für Backwards-Kompatibilität wird auch die E-Mail-Adresse geprüft:
- E-Mail enthält "admin" → Admin
- E-Mail ist "admin@arvo-labs.com" → Admin

**WICHTIG:** Diese Fallback-Prüfung ist nur für Migration gedacht. Für neue Admins sollte immer `publicMetadata.is_admin` verwendet werden.

## Testing

1. **Admin setzen:**
   - Über Clerk Dashboard: `publicMetadata.is_admin = true`
   - Oder API Route (wenn bereits Admin)

2. **Login testen:**
   - Admin sollte automatisch zum Individual-Dashboard weitergeleitet werden
   - Admin sollte Zugriff auf alle drei Dashboards haben

3. **Zugriff testen:**
   - Direkter Zugriff auf `/dashboard/starter` → sollte funktionieren
   - Direkter Zugriff auf `/dashboard/pro` → sollte funktionieren
   - Direkter Zugriff auf `/dashboard/individual` → sollte funktionieren

## Wichtige Dateien

- `lib/plan-utils.ts` - `isAdmin()`, `setUserAdmin()`, `hasRouteAccess()`
- `app/api/users/set-admin/route.ts` - API Route zum Setzen des Admin-Status
- `middleware.ts` - Admin-Prüfung in Middleware
- `app/dashboard/page.tsx` - Admin-Redirect-Logik
- `app/dashboard/*/page.tsx` - Admin-Guards in Dashboard-Seiten

## Troubleshooting

**Problem:** Admin hat keinen Zugriff auf Dashboards
- **Lösung:** Prüfe, ob `publicMetadata.is_admin = true` in Clerk gesetzt ist
- **Lösung:** Prüfe Browser-Konsole auf Fehler
- **Lösung:** Logge aus und prüfe `isAdmin(user)` Rückgabewert

**Problem:** API Route gibt 403 zurück
- **Lösung:** Stelle sicher, dass der anfragende User Admin ist
- **Lösung:** Prüfe, ob die Session korrekt ist

**Problem:** Admin wird nicht erkannt
- **Lösung:** Prüfe `publicMetadata.is_admin` in Clerk Dashboard
- **Lösung:** Stelle sicher, dass die E-Mail nicht als Fallback verwendet wird (nur für Migration)
