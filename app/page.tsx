'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Wenn eingeloggt, zeige nichts (wird umgeleitet)
  if (isLoaded && isSignedIn) {
    return null;
  }
  return (
    <main className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Automatisiere deine Routineaufgaben mit KI.</h1>
          <p>
            Arvo Labs hilft dir, wiederkehrende Tasks zu delegieren – von
            E-Mails bis Reportings, damit du dich auf das Wesentliche
            konzentrieren kannst.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Kostenlos starten</button>
            <button className="btn-secondary">Demo ansehen</button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-number">500k+</div>
              <div className="stat-label">Tasks automatisiert</div>
            </div>
            <div>
              <div className="stat-number">98%</div>
              <div className="stat-label">Zufriedenheit</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-card">
          <h2>Über Arvo Labs</h2>
          <p>
            Arvo Labs ist das All-in-One-Tool für Unternehmen, Start-ups und lokale
            Betriebe, die ihre Arbeitsprozesse auf das nächste Level bringen möchten.
            Unsere integrierte KI erledigt Aufgaben – von E-Mails bis hin zur
            Teamplanung – automatisch und effizient. So bleibt mehr Zeit für das
            Wesentliche: Wachstum, Kreativität und Erfolg. Arvo Labs verbindet
            innovative Technologie mit smarter Automatisierung, damit moderne
            Unternehmen produktiver und zukunftsfähiger arbeiten können.
          </p>
        </div>
      </section>

      {/* Page Previews Section */}
      <section className="features" style={{ paddingTop: '80px' }}>
        <h2>Entdecke mehr</h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            margin: '0 auto 64px',
            fontSize: '18px',
          }}
        >
          Erfahre mehr über unsere Funktionen, Preise, Use Cases und wie du uns
          kontaktieren kannst.
        </p>
        <div className="features-grid">
          <Link
            href="/funktionen"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="feature-card page-preview-card">
              <div className="feature-icon">⚙️</div>
              <h3>Funktionen</h3>
              <p>
                Entdecke alle leistungsstarken Automationen, die deine
                Produktivität steigern – von E-Mail-Management bis zu individuellen
                Workflows.
              </p>
              <div
                className="preview-link"
                style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  color: 'var(--primary)',
                  fontWeight: '500',
                }}
              >
                Funktionen ansehen →
              </div>
            </div>
          </Link>

          <Link
            href="/preise"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="feature-card page-preview-card">
              <div className="feature-icon">💰</div>
              <h3>Preise</h3>
              <p>
                Transparente Preise für jeden Bedarf – vom kostenlosen Starter-Plan
                bis hin zu individuellen Enterprise-Lösungen.
              </p>
              <div
                className="preview-link"
                style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  color: 'var(--primary)',
                  fontWeight: '500',
                }}
              >
                Preise ansehen →
              </div>
            </div>
          </Link>

          <Link
            href="/use-cases"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="feature-card page-preview-card">
              <div className="feature-icon">🎯</div>
              <h3>Use Cases</h3>
              <p>
                Sieh dir an, wie Arvo Labs in verschiedenen Bereichen Zeit spart
                und die Produktivität steigert.
              </p>
              <div
                className="preview-link"
                style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  color: 'var(--primary)',
                  fontWeight: '500',
                }}
              >
                Use Cases ansehen →
              </div>
            </div>
          </Link>

          <Link
            href="/kontakt"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="feature-card page-preview-card">
              <div className="feature-icon">📧</div>
              <h3>Kontakt</h3>
              <p>
                Hast du Fragen? Schreib uns eine Nachricht – wir melden uns in der
                Regel innerhalb von 24 Stunden.
              </p>
              <div
                className="preview-link"
                style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  color: 'var(--primary)',
                  fontWeight: '500',
                }}
              >
                Kontakt aufnehmen →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Arvo Labs</h4>
            <p>Automatisierung, die funktioniert.</p>
          </div>
          <div className="footer-section">
            <h4>Produkt</h4>
            <Link href="/funktionen">Funktionen</Link>
            <a href="#">Dokumentation</a>
          </div>
          <div className="footer-section">
            <h4>Unternehmen</h4>
            <Link href="/ueber-uns">Über uns</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/use-cases">Use Cases</Link>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/agb">AGB</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Arvo Labs. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </main>
  );
}


