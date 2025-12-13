# OpenAI API Key Setup

Diese Anleitung zeigt dir, wie du den OpenAI API Key für die Chat-Funktion einrichtest.

## Schritt 1: OpenAI API Key erstellen

1. Gehe zu https://platform.openai.com/api-keys
2. Logge dich ein (oder erstelle einen Account)
3. Klicke auf **"Create new secret key"**
4. Gib einen Namen ein (z.B. "Arvo Labs Chat")
5. **Kopiere den Key sofort** - er wird nur einmal angezeigt!
   - Der Key beginnt mit `sk-` und ist ca. 50 Zeichen lang
   - Beispiel: `sk-proj-abc123...xyz789`

## Schritt 2: Key in .env.local eintragen

1. Öffne die Datei `.env.local` im Projekt-Root
2. Finde die Zeile:
   ```
   OPENAI_API_KEY=sk-dein-api-key-hier
   ```
3. Ersetze `sk-dein-api-key-hier` mit deinem echten Key:
   ```
   OPENAI_API_KEY=sk-proj-abc123...xyz789
   ```
4. **Wichtig:** Keine Anführungszeichen um den Key!

## Schritt 3: Dev-Server neu starten

Nach dem Hinzufügen des Keys **muss** der Next.js Dev-Server neu gestartet werden:

```bash
# Stoppe den Server (Ctrl+C im Terminal)
# Dann starte neu:
npm run dev
```

## Schritt 4: Testen

1. Öffne dein Dashboard (z.B. `/dashboard/individual`)
2. Gehe zum Chat-Bereich
3. Sende eine Test-Nachricht
4. Du solltest eine Antwort von Arvo (OpenAI) erhalten

## Für Production (Vercel)

Wenn du auf Vercel deployst, musst du die Environment-Variable auch dort setzen:

1. Gehe zu https://vercel.com/dashboard
2. Wähle dein Projekt aus
3. Gehe zu **Settings** → **Environment Variables**
4. Klicke auf **Add New**
5. Füge hinzu:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Dein OpenAI API Key
   - **Environment:** Wähle alle aus (Production, Preview, Development)
6. Klicke auf **Save**
7. **Redeploy** deine App (gehe zu Deployments → ... → Redeploy)

## Kosten

- GPT-4o-mini ist sehr günstig (~$0.15 pro 1M Input-Tokens, ~$0.60 pro 1M Output-Tokens)
- Für Tests und kleine Projekte fallen meist nur Cent-Beträge an
- Du kannst Limits in deinem OpenAI Account setzen

## Troubleshooting

### Fehler: "OpenAI API Key nicht konfiguriert"

- ✅ Prüfe, ob der Key in `.env.local` steht
- ✅ Prüfe, ob der Key korrekt ist (beginnt mit `sk-`)
- ✅ Prüfe, ob keine Anführungszeichen um den Key sind
- ✅ **Wichtig:** Dev-Server neu gestartet?

### Fehler: "Invalid API Key"

- ✅ Prüfe, ob der Key korrekt kopiert wurde (keine Leerzeichen)
- ✅ Prüfe, ob der Key in deinem OpenAI Account aktiv ist
- ✅ Prüfe, ob du genug Credits hast

### Chat funktioniert lokal, aber nicht auf Vercel

- ✅ Prüfe, ob `OPENAI_API_KEY` in Vercel Environment Variables gesetzt ist
- ✅ Prüfe, ob alle Environments ausgewählt sind
- ✅ Redeploy die App nach dem Hinzufügen der Variable

## Sicherheit

- ⚠️ **NIEMALS** den API Key in Git committen
- ✅ `.env.local` ist bereits in `.gitignore`
- ✅ Verwende für Production einen separaten Key mit Limits
- ✅ Rotiere Keys regelmäßig

