# Clerk Setup Anleitung

## Schritt 1: Clerk Keys holen

1. **Im Clerk Dashboard** (wo du gerade bist):
   - Klicke auf **"Next.js"** (nicht JavaScript, da wir Next.js verwenden)
   - Oder gehe zu: **"Configure"** → **"API Keys"**
   
2. **Kopiere diese Keys:**
   - **Publishable Key** (beginnt mit `pk_test_...`)
   - **Secret Key** (beginnt mit `sk_test_...`)

## Schritt 2: .env.local Datei erstellen

1. Erstelle eine Datei `.env.local` im Root-Verzeichnis
2. Füge die Keys ein:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dein_key_hier
CLERK_SECRET_KEY=sk_test_dein_secret_key_hier
```

## Schritt 3: Dev-Server starten

```bash
npm run dev
```

## Schritt 4: Ersten User registrieren

1. Öffne http://localhost:3000
2. Klicke auf "Login" in der Navigation
3. Registriere dich mit deiner E-Mail
4. **Fertig!** Clerk erkennt jetzt deinen ersten User

## Schritt 5: Organizations aktivieren (optional, später)

1. Im Clerk Dashboard: **"Organizations"** Tab
2. **"Enable Organizations"** aktivieren
3. Standard-Flow: User kann beim Registrieren eine Organization anlegen

## Schritt 6: Supabase Integration (später)

1. **Clerk JWT Template erstellen:**
   - Clerk Dashboard → **"JWT Templates"** → Create Template
   - Name: `supabase`
   - Claims: `{ "role": "authenticated", "sub": "{{user.id}}" }`

2. **Supabase konfigurieren:**
   - Supabase Dashboard → **Authentication** → **Providers**
   - Clerk als Provider hinzufügen
   - Clerk Domain eintragen


