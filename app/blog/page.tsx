'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: '5 Wege, wie KI-Automatisierung dein Unternehmen transformiert',
      excerpt:
        'Entdecke, wie intelligente Automatisierung nicht nur Zeit spart, sondern auch neue Möglichkeiten für Wachstum und Innovation eröffnet.',
      date: '15. Januar 2025',
      category: 'Automatisierung',
    },
    {
      id: 2,
      title: 'E-Mail-Management im Zeitalter der KI',
      excerpt:
        'Wie moderne Unternehmen ihre E-Mail-Flut bewältigen und dabei produktiver werden – ein praktischer Leitfaden.',
      date: '8. Januar 2025',
      category: 'Best Practices',
    },
    {
      id: 3,
      title: 'Von Start-up zu Scale-up: Automatisierung als Wachstumsmotor',
      excerpt:
        'Erfahre, wie erfolgreiche Start-ups Automatisierung nutzen, um zu skalieren, ohne ihre Agilität zu verlieren.',
      date: '2. Januar 2025',
      category: 'Unternehmen',
    },
    {
      id: 4,
      title: 'DSGVO-konforme Automatisierung: Was du wissen musst',
      excerpt:
        'Ein Überblick über die wichtigsten Datenschutzaspekte bei der Automatisierung von Geschäftsprozessen.',
      date: '28. Dezember 2024',
      category: 'Compliance',
    },
    {
      id: 5,
      title: 'Workflow-Automatisierung ohne Programmierkenntnisse',
      excerpt:
        'Lerne, wie du auch ohne technisches Know-how komplexe Workflows automatisieren kannst – Schritt für Schritt.',
      date: '20. Dezember 2024',
      category: 'Tutorial',
    },
    {
      id: 6,
      title: 'Die Zukunft der Arbeit: Mensch und KI im Einklang',
      excerpt:
        'Ein Blick darauf, wie KI und Automatisierung die Arbeitswelt verändern und welche Chancen sich daraus ergeben.',
      date: '12. Dezember 2024',
      category: 'Zukunft',
    },
  ];

  return (
    <main className="page">
      <section className="hero" style={{ paddingTop: '120px' }}>
        <div className="hero-text">
          <h1>Blog</h1>
          <p>
            Erfahre mehr über Automatisierung, KI-Technologien und Best Practices
            für moderne Unternehmen. Tipps, Tutorials und Einblicke von unserem
            Team.
          </p>
        </div>
      </section>

      <section className="features" style={{ paddingTop: '40px' }}>
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div className="features-grid" style={{ gridTemplateColumns: '1fr' }}>
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="feature-card"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--primary)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {post.category}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {post.date}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '24px',
                    marginBottom: '12px',
                    color: 'var(--text)',
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                  }}
                >
                  {post.excerpt}
                </p>
                <div
                  style={{
                    color: 'var(--primary)',
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                >
                  Weiterlesen →
                </div>
              </div>
            ))}
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

