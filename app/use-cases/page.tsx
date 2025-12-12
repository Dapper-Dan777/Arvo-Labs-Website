'use client';

import Link from 'next/link';

export default function UseCasesPage() {
  return (
    <main className="page">
      <section className="features" style={{ paddingTop: '120px' }}>
        <h2>Für jede Branche geeignet</h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            margin: '0 auto 64px',
          }}
        >
          Egal ob Agentur, Coach oder Online-Shop – Arvo Labs passt sich deinen
          Bedürfnissen an.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Agentur</h3>
            <p>
              Reduziere manuellen E-Mail- und Reporting-Aufwand um bis zu 50 %
              und gewinne mehr abrechenbare Projektzeit.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Coach & Berater</h3>
            <p>
              Automatisiere Terminbestätigungen und Follow-ups – so kannst du
              mehr Sessions pro Woche ohne Extra-Organisation durchführen.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>Online Shop</h3>
            <p>
              Automatisiere Kundenkommunikation, Versand-Updates und
              Warenkorbabbrüche, um Umsatz zu steigern und Support zu entlasten.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Freelancer</h3>
            <p>
              Lasse Rechnungen, Angebote und Statusmails automatisch erstellen,
              damit du deine Zeit vor allem in Kundenprojekte steckst.
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

