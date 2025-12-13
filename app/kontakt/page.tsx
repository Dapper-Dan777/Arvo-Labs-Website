'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Danke für deine Nachricht! Wir melden uns in Kürze.');
  };

  return (
    <main className="page">
      <section className="hero contact-hero">
        <div className="hero-text">
          <h1>Kontakt</h1>
          <p>
            Fragen zu Arvo Labs, Preisen oder Partnerschaften? Schreib uns eine
            Nachricht – wir melden uns in der Regel innerhalb von 24 Stunden.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-form-card">
          <h2>Nachricht senden</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-row">
              <label>
                Name
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dein Name"
                  required
                />
              </label>
              <label>
                E-Mail
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="du@beispiel.de"
                  required
                />
              </label>
            </div>

            <label>
              Betreff
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="Worum geht es?"
              />
            </label>

            <label>
              Nachricht
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Beschreibe kurz dein Anliegen..."
                required
              />
            </label>

            <button type="submit" className="btn-primary">
              Nachricht senden
            </button>
          </form>
        </div>

        <div className="contact-details">
          <h3>Direkter Kontakt</h3>
          <p>
            E-Mail:{' '}
            <a href="mailto:info@arvo-labs.de">info@arvo-labs.de</a>
          </p>
          <p>Wir antworten in der Regel innerhalb von 24 Stunden.</p>
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

