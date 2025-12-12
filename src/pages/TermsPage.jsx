import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import Navigation from '../components/Navigation';

function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <Navigation />

      <section className="hero" style={{ paddingTop: '120px' }}>
        <div className="hero-text">
          <h1>Allgemeine Geschäftsbedingungen</h1>
          <p>
            Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung der Dienste
            von Arvo Labs. Bitte lies sie sorgfältig durch.
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
            <h3 style={{ marginBottom: '16px' }}>1. Geltungsbereich</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
              Leistungen der Arvo Labs, die über die Website arvolabs.com angeboten
              werden. Mit der Nutzung unserer Dienste akzeptierst du diese AGB.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>2. Vertragspartner</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Vertragspartner ist:
              <br />
              <br />
              Adrian Thome
              <br />
              Sofienstrasse 7a
              <br />
              69115 Heidelberg
              <br />
              Deutschland
              <br />
              <br />
              E-Mail: support@arvolabs.com
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>3. Leistungsbeschreibung</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Arvo Labs bietet eine Plattform für die Automatisierung von
              Geschäftsprozessen an. Die genauen Leistungen richten sich nach dem
              gewählten Tarif. Wir behalten uns vor, die Leistungen weiterzuentwickeln
              und anzupassen, solange die Kernfunktionalität erhalten bleibt.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>4. Registrierung und Nutzerkonto</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              Für die Nutzung unserer Dienste ist eine Registrierung erforderlich.
              Du verpflichtest dich:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '16px',
                lineHeight: '1.8',
              }}
            >
              <li style={{ marginBottom: '12px' }}>• wahrheitsgemäße Angaben zu machen</li>
              <li style={{ marginBottom: '12px' }}>• deine Zugangsdaten geheim zu halten</li>
              <li style={{ marginBottom: '12px' }}>• uns über Änderungen zu informieren</li>
              <li style={{ marginBottom: '12px' }}>• für alle Aktivitäten unter deinem Konto verantwortlich zu sein</li>
            </ul>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>5. Preise und Zahlung</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Die Preise für unsere Dienste findest du auf unserer Preisseite. Alle
              Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die
              Zahlung erfolgt im Voraus für den jeweiligen Abrechnungszeitraum. Wir
              behalten uns vor, die Preise anzupassen. Bestehende Verträge bleiben
              von Preiserhöhungen unberührt, es sei denn, du stimmst einer Änderung
              zu.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>6. Kündigung</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Du kannst dein Konto jederzeit kündigen. Die Kündigung erfolgt über
              dein Nutzerkonto oder per E-Mail an support@arvolabs.com. Bei
              kostenpflichtigen Tarifen endet der Vertrag zum Ende des bereits
              bezahlten Abrechnungszeitraums. Wir behalten uns vor, Verträge bei
              Verstößen gegen diese AGB fristlos zu kündigen.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>7. Haftung</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei
              leichter Fahrlässigkeit haften wir nur bei Verletzung einer
              wesentlichen Vertragspflicht, deren Erfüllung die ordnungsgemäße
              Durchführung des Vertrages überhaupt erst ermöglicht. Die Haftung ist
              auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden
              begrenzt.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>8. Datenschutz</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Der Schutz deiner Daten ist uns wichtig. Informationen zur
              Datenverarbeitung findest du in unserer{' '}
              <Link
                to="/datenschutz"
                style={{ color: 'var(--primary)', textDecoration: 'none' }}
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>9. Änderungen der AGB</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Wir behalten uns vor, diese AGB zu ändern. Änderungen werden dir per
              E-Mail oder über eine Mitteilung in deinem Nutzerkonto mitgeteilt. Wenn
              du den Änderungen nicht widersprichst, gelten sie als genehmigt.
            </p>
          </div>

          <div className="feature-card">
            <h3 style={{ marginBottom: '16px' }}>10. Schlussbestimmungen</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Sollten
              einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
              Wirksamkeit der übrigen Bestimmungen unberührt.
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

export default TermsPage;
