import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validierung
    if (!email || !password || !firstName || !lastName) {
      setError('Bitte fülle alle Pflichtfelder aus.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.');
      setLoading(false);
      return;
    }

    // Supabase Registrierung mit user_metadata
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          company_name: companyName || null,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError('Registrierung fehlgeschlagen: ' + signUpError.message);
    } else {
      // Erfolgreich registriert
      if (data.user && !data.user.identities.length) {
        // User existiert bereits
        setError('Diese E-Mail ist bereits registriert. Bitte melde dich an.');
      } else if (data.session) {
        // Session existiert -> Bestätigung ist deaktiviert -> direkt zum Dashboard
        navigate('/dashboard');
      } else {
        // Bestätigungs-E-Mail wurde gesendet
        alert(
          'Registrierung erfolgreich! Bitte überprüfe deine E-Mail zur Bestätigung.'
        );
        navigate('/login');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '48px',
          background: 'rgba(2, 6, 23, 0.8)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1
            style={{
              color: '#fff',
              marginBottom: '8px',
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            Registrieren bei Arvo Labs
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Erstelle dein Konto und starte mit der Automatisierung
          </p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Name und Nachname in einer Zeile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <label
                style={{
                  color: '#e5e7eb',
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Vorname <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Max"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>
            <div>
              <label
                style={{
                  color: '#e5e7eb',
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Nachname <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mustermann"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>
          </div>

          {/* E-Mail */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                color: '#e5e7eb',
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              E-Mail-Adresse <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.background = 'rgba(255,255,255,0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
            />
          </div>

          {/* Firmenname (optional) */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                color: '#e5e7eb',
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Firmenname <span style={{ color: '#9ca3af', fontSize: '11px' }}>(optional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Meine Firma GmbH"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.background = 'rgba(255,255,255,0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
            />
          </div>

          {/* Passwort */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                color: '#e5e7eb',
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Passwort <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.background = 'rgba(255,255,255,0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
            />
            <p
              style={{
                marginTop: '6px',
                color: '#6b7280',
                fontSize: '12px',
              }}
            >
              Mindestens 6 Zeichen
            </p>
          </div>

          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '14px',
                background: 'rgba(239,68,68,0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading
                ? '#4b5563'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading
                ? 'none'
                : '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
              }
            }}
          >
            {loading ? 'Registriere...' : 'Konto erstellen'}
          </button>

          <p
            style={{
              marginTop: '16px',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '12px',
              lineHeight: '1.5',
            }}
          >
            Mit der Registrierung stimmst du unseren{' '}
            <Link
              to="/agb"
              style={{ color: '#6366f1', textDecoration: 'none' }}
            >
              AGB
            </Link>{' '}
            und der{' '}
            <Link
              to="/datenschutz"
              style={{ color: '#6366f1', textDecoration: 'none' }}
            >
              Datenschutzerklärung
            </Link>{' '}
            zu.
          </p>
        </form>

        <div
          style={{
            marginTop: '32px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
            Bereits registriert?
          </p>
          <Link
            to="/login"
            style={{
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#818cf8';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6366f1';
            }}
          >
            Jetzt anmelden →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
