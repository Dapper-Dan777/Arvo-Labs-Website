'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page features-page">
      <section className="features" style={{ paddingTop: '120px' }}>
        <h2>Unsere Funktionen im Detail</h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            margin: '0 auto 64px',
          }}
        >
          Arvo Labs bietet dir leistungsstarke Automationen, die deine
          Produktivität steigern.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>E-Mail-Automatisierung</h3>
            <p>
              Lass Arvo deine E-Mails kategorisieren, beantworten und
              priorisieren – spare dir jeden Tag 2–3 Stunden Postfach-Zeit.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Reporting & Analytics</h3>
            <p>
              Erhalte automatisch fertige Reports direkt in dein Dashboard –
              ohne Excels, ohne Copy-Paste.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Individuelle Workflows</h3>
            <p>
              Baue dir in Minuten eigene Automationen statt Wochen mit
              Custom-Code – komplett per Chat-Steuerung.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Sichere Datenverarbeitung</h3>
            <p>
              Verarbeite sensible Daten DSGVO-konform mit Hosting in der EU und
              fein-granularen Berechtigungen.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <h3>Integrationen</h3>
            <p>
              Verbinde Arvo mit Gmail, Slack, Notion, Trello und mehr – ohne
              Integrationsprojekt.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile App</h3>
            <p>
              Behalte deine Automationen auch mobil im Griff – inkl.
              Push-Benachrichtigungen bei wichtigen Ereignissen.
            </p>
          </div>
        </div>
      </section>

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

