import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import Navigation from '../components/Navigation';

function ImprintPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <Navigation />

      <section className="hero" style={{ paddingTop: '120px' }}>
        <div className="hero-text">
          <h1>Impressum</h1>
          <p>
            Angaben gemäß § 5 TMG. Informationen zu Verantwortlichen und Kontakt.
          </p>
        </div>
      </section>

      <section className="features" style={{ paddingTop: '40px' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Verantwortlich für den Inhalt</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Adrian Thome
              <br />
              Sofienstrasse 7a
              <br />
              69115 Heidelberg
              <br />
              Deutschland
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Kontakt</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              E-Mail: support@arvolabs.com
              <br />
              <br />
              Bei Fragen, Anregungen oder Beschwerden kannst du uns jederzeit
              kontaktieren. Wir bemühen uns, deine Anfrage schnellstmöglich zu
              beantworten.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Haftungsausschluss</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>Haftung für Inhalte</strong>
              <br />
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
              die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
              jedoch keine Gewähr übernehmen.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>Haftung für Links</strong>
              <br />
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten
              ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              <strong>Urheberrecht</strong>
              <br />
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
              Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
              jeweiligen Autors bzw. Erstellers.
            </p>
          </div>

          <div className="feature-card">
            <h3 style={{ marginBottom: '16px' }}>Streitschlichtung</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'none' }}
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <br />
              <br />
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
            <Link to="/funktionen">Funktionen</Link>
            <a href="#">Dokumentation</a>
          </div>
          <div className="footer-section">
            <h4>Unternehmen</h4>
            <Link to="/ueber-uns">Über uns</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/use-cases">Use Cases</Link>
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
    </main>
  );
}

export default ImprintPage;
