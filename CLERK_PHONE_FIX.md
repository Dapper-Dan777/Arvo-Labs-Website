# Clerk: Telefonnummer-Problem beheben

## Problem
Clerk zeigt die Warnung: "Phone numbers from this country (Germany) are currently not supported."

## Lösung: Telefonnummern optional machen

### Option 1: Telefonnummern optional machen (Empfohlen)

1. **Gehe zum Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Wähle dein Projekt "awaited-werewolf-70"

2. **Navigiere zu:**
   - **"User & Authentication"** → **"Email, Phone, Username"**

3. **Konfiguration:**
   - **Phone number**: Wähle **"Optional"** (nicht "Required")
   - Oder: Deaktiviere Phone number komplett, wenn du es nicht brauchst

4. **Speichern** und die Seite neu laden

### Option 2: Nur E-Mail-Registrierung erlauben

1. **Im Clerk Dashboard:**
   - **"User & Authentication"** → **"Email, Phone, Username"**
   - **Phone number**: Auf **"Off"** setzen
   - **Email address**: Auf **"Required"** setzen

### Option 3: Deutschland als unterstütztes Land aktivieren

1. **Im Clerk Dashboard:**
   - **"User & Authentication"** → **"Phone numbers"**
   - Prüfe, ob Deutschland (DE) in der Liste der unterstützten Länder ist
   - Falls nicht, kontaktiere Clerk Support oder verwende Option 1/2

## Nach der Änderung

1. **Seite neu laden** (Hard Refresh: Cmd+Shift+R)
2. **Erneut registrieren** - Telefonnummer sollte jetzt optional sein
3. Du kannst die Registrierung mit nur E-Mail und Passwort abschließen

## Alternative: Vorläufige Lösung

Du kannst auch einfach die Telefonnummer leer lassen (falls optional) und nur mit E-Mail registrieren.

