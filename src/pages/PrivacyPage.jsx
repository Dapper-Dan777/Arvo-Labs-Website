import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css';
import Navigation from '../components/Navigation';

function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <Navigation />

      <section className="hero" style={{ paddingTop: '120px' }}>
        <div className="hero-text">
          <h1>Datenschutzerklärung</h1>
          <p>
            Der Schutz deiner persönlichen Daten ist uns wichtig. Hier erfährst du,
            wie wir deine Daten erheben, verwenden und schützen.
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
            <h3 style={{ marginBottom: '16px' }}>1. Verantwortlicher</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              <br />
              Adrian Thome
              <br />
              Sofienstrasse 7a
              <br />
              69115 Heidelberg
              <br />
              <br />
              E-Mail: support@arvolabs.com
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>2. Erhebung und Speicherung personenbezogener Daten</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              Beim Besuch unserer Website werden automatisch Informationen an den
              Server unserer Website gesendet. Diese Informationen werden temporär in
              einem sogenannten Logfile gespeichert. Folgende Informationen werden
              dabei ohne dein Zutun erfasst und bis zur automatisierten Löschung
              gespeichert:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '16px',
                lineHeight: '1.8',
              }}
            >
              <li style={{ marginBottom: '12px' }}>• IP-Adresse des anfragenden Rechners</li>
              <li style={{ marginBottom: '12px' }}>• Datum und Uhrzeit des Zugriffs</li>
              <li style={{ marginBottom: '12px' }}>• Name und URL der abgerufenen Datei</li>
              <li style={{ marginBottom: '12px' }}>• Website, von der aus der Zugriff erfolgt</li>
              <li style={{ marginBottom: '12px' }}>• verwendeter Browser und ggf. das Betriebssystem</li>
            </ul>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>3. Verwendung von Cookies</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um
              kleine Dateien, die dein Browser automatisch erstellt und die auf deinem
              Endgerät gespeichert werden, wenn du unsere Seite besuchst. Cookies
              richten auf deinem Endgerät keinen Schaden an, enthalten keine Viren,
              Trojaner oder sonstige Schadsoftware. Wir setzen Cookies ein, um
              unsere Website nutzerfreundlicher zu gestalten und die Funktionalität
              sicherzustellen.
            </p>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>4. Weitergabe von Daten</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Eine Übermittlung deiner persönlichen Daten an Dritte zu anderen als den
              im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben deine
              persönlichen Daten nur an Dritte weiter, wenn:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '16px',
                lineHeight: '1.8',
                marginTop: '16px',
              }}
            >
              <li style={{ marginBottom: '12px' }}>• du deine ausdrückliche Einwilligung dazu erteilt hast</li>
              <li style={{ marginBottom: '12px' }}>• die Weitergabe zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist</li>
              <li style={{ marginBottom: '12px' }}>• die Weitergabe zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist</li>
            </ul>
          </div>

          <div className="feature-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>5. Betroffenenrechte</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              Du hast das Recht:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '16px',
                lineHeight: '1.8',
              }}
            >
              <li style={{ marginBottom: '12px' }}>• Auskunft über deine bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
              <li style={{ marginBottom: '12px' }}>• Berichtigung unrichtiger Daten zu verlangen</li>
              <li style={{ marginBottom: '12px' }}>• Löschung deiner bei uns gespeicherten Daten zu verlangen</li>
              <li style={{ marginBottom: '12px' }}>• Einschränkung der Datenverarbeitung zu verlangen</li>
              <li style={{ marginBottom: '12px' }}>• Widerspruch gegen die Verarbeitung deiner Daten einzulegen</li>
              <li style={{ marginBottom: '12px' }}>• Datenübertragbarkeit zu verlangen</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3 style={{ marginBottom: '16px' }}>6. Datensicherheit</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren
              (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe,
              die von deinem Browser unterstützt wird. In der Regel handelt es sich dabei um
              eine 256 Bit Verschlüsselung. Falls dein Browser keine 256-Bit Verschlüsselung
              unterstützt, greifen wir auf 128-Bit v3 Technologie zurück.
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

export default PrivacyPage;
