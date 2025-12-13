/**
 * Pricing-Seite (Legacy Route: /preise)
 * 
 * Diese Route leitet zur neuen Pricing-Seite weiter.
 * Die neue Pricing-Seite mit Vergleichstabelle ist unter /pricing verfügbar.
 */

import { redirect } from 'next/navigation';

export default function PreisePage() {
  // Weiterleitung zur neuen Pricing-Seite
  redirect('/pricing');
}
