import { Link } from 'react-router-dom';
import '../App.css';
import '../Pricing.css';
import Navigation from '../components/Navigation';

function PricingPage() {
  return (
    <main className="page">
      <div className="page">
        <Navigation />

        <section className="pricing" style={{ paddingTop: '120px' }}>
          <h2>Transparente Preise</h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              maxWidth: '800px',
              margin: '0 auto 64px',
            }}
          >
            Wähle den Plan, der am besten zu dir passt. Alle Pläne können
            jederzeit angepasst werden.
          </p>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">
                €0<span>/Monat</span>
              </div>
              <ul>
                <li>✓ Bis zu 100 Tasks/Monat</li>
                <li>✓ E-Mail-Automatisierung</li>
                <li>✓ Basic Support</li>
              </ul>
              <button className="btn-secondary">
                <Link to="/register">Kostenlos starten</Link>
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="badge">Beliebt</div>
              <h3>Pro</h3>
              <div className="price">
                €29<span>/Monat</span>
              </div>
              <ul>
                <li>✓ Unbegrenzte Tasks</li>
                <li>✓ Alle Automationen</li>
                <li>✓ Priority Support</li>
                <li>✓ Custom Workflows</li>
              </ul>
              <button className="btn-primary">
                <Link to="/register">Jetzt starten</Link>
              </button>
            </div>

            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price">Individuell</div>
              <ul>
                <li>✓ Alles aus Pro</li>
                <li>✓ Dedizierter Account Manager</li>
                <li>✓ On-Premise möglich</li>
                <li>✓ Custom Integrationen</li>
              </ul>
              <button className="btn-secondary">
                <Link to="/kontakt">Kontakt aufnehmen</Link>
              </button>
            </div>
          </div>

          <p
            style={{
              marginTop: '32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '14px',
            }}
          >
            Alle Pläne sind monatlich kündbar. Kein Risiko, kein Kleingedrucktes
            – Starter ganz ohne Kreditkarte.
          </p>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Arvo Labs</h4>
              <p>Automatisierung, die funktioniert.</p>
            </div>
            <div className="footer-section">
              <h4>Produkt</h4>
              <a href="/funktionen">Funktionen</a>
              <a href="#">Dokumentation</a>
            </div>
            <div className="footer-section">
              <h4>Unternehmen</h4>
              <Link to="/ueber-uns">Über uns</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/kontakt">Kontakt</Link>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <Link to="/datenschutz">Datenschutz</Link>
              <Link to="/impressum">Impressum</Link>
              <Link to="/agb">AGB</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Arvo Labs. Alle Rechte vorbehalten.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default PricingPage;
