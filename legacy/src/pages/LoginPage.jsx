import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Bitte fülle alle Felder aus');
      setLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Login fehlgeschlagen: ' + loginError.message);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          background: '#1a1a1a',
          borderRadius: '12px',
        }}
      >
        <h1
          style={{ color: '#fff', marginBottom: '30px', textAlign: 'center' }}
        >
          Login zu Arvo Labs
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                color: '#999',
                fontSize: '14px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                color: '#999',
                fontSize: '14px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '20px',
                padding: '10px',
                background: '#2a0a0a',
                borderRadius: '6px',
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
              padding: '14px',
              background: loading ? '#555' : '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>

        <p
          style={{
            color: '#999',
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
          }}
        >
          Noch kein Account?{' '}
          <Link
            to="/register"
            style={{ color: '#6366f1', textDecoration: 'none' }}
          >
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
