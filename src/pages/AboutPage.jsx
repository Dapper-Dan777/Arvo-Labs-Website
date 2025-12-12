import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import Navigation from '../components/Navigation';

function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <Navigation />

      <section className="hero" style={{ paddingTop: '120px' }}>
        <div className="hero-text">
          <h1>Über uns</h1>
          <p>
            Wir sind Arvo Labs – ein Team von Entwicklern, Designern und
            Automatisierungsexperten, die daran glauben, dass Technologie das
            Arbeiten einfacher machen sollte.
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
            <h3 style={{ marginBottom: '16px' }}>Unsere Mission</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Arvo Labs wurde mit dem Ziel gegründet, Unternehmen dabei zu helfen,
              ihre Arbeitsprozesse zu optimieren und Zeit für das Wesentliche zu
              gewinnen. Wir glauben daran, dass Automatisierung nicht kompliziert
              sein muss – deshalb haben wir eine Plattform entwickelt, die
              intuitiv, leistungsstark und für jeden zugänglich ist.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Was uns auszeichnet</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              Unser Team kombiniert jahrelange Erfahrung in der Softwareentwicklung
              mit einem tiefen Verständnis für die Herausforderungen moderner
              Unternehmen. Wir setzen auf:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '16px',
                lineHeight: '1.8',
              }}
            >
              <li style={{ marginBottom: '12px' }}>
                ✓ <strong>Innovation:</strong> Wir nutzen die neuesten KI-Technologien
                für intelligente Automatisierung
              </li>
              <li style={{ marginBottom: '12px' }}>
                ✓ <strong>Einfachheit:</strong> Komplexe Prozesse werden durch
                intuitive Bedienung zugänglich gemacht
              </li>
              <li style={{ marginBottom: '12px' }}>
                ✓ <strong>Zuverlässigkeit:</strong> Unsere Lösungen sind stabil,
                sicher und DSGVO-konform
              </li>
              <li style={{ marginBottom: '12px' }}>
                ✓ <strong>Kundennähe:</strong> Wir hören zu und entwickeln unsere
                Produkte kontinuierlich weiter
              </li>
            </ul>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Unsere Vision</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Wir träumen von einer Zukunft, in der sich Unternehmen nicht mehr mit
              repetitiven Aufgaben beschäftigen müssen. Stattdessen können sie sich
              auf Wachstum, Innovation und das konzentrieren, was wirklich zählt.
              Arvo Labs ist unser Beitrag zu dieser Vision – eine Plattform, die
              Automatisierung für alle zugänglich macht.
            </p>
          </div>

          <div className="feature-card">
            <h3 style={{ marginBottom: '16px' }}>Kontakt</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Hast du Fragen zu Arvo Labs oder möchtest du Teil unseres Teams werden?
              Wir freuen uns auf deine Nachricht!{' '}
              <Link
                to="/kontakt"
                style={{ color: 'var(--primary)', textDecoration: 'none' }}
              >
                Kontaktiere uns
              </Link>
              .
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

export default AboutPage;
