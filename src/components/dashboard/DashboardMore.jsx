import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function DashboardMore({ user, onUserUpdate }) {
  const [activeView, setActiveView] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    feedback: '',
    contactSubject: '',
    contactMessage: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyDigest: true,
  });
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [integrations, setIntegrations] = useState([
    { name: 'Gmail', connected: true, icon: '📧' },
    { name: 'Slack', connected: true, icon: '💬' },
    { name: 'Notion', connected: false, icon: '📝' },
    { name: 'Trello', connected: false, icon: '📋' },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Lade aktuelle User-Daten beim Öffnen der Profil-Ansicht
  useEffect(() => {
    if (activeView === 'profile' && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        companyName: user.user_metadata?.company_name || '',
        email: user.email || '',
      }));
    }
  }, [activeView, user]);

  const settings = [
    {
      category: 'Konto',
      items: [
        { id: 'profile', name: 'Profil bearbeiten', icon: '👤' },
        { id: 'password', name: 'Passwort ändern', icon: '🔒' },
        { id: 'subscription', name: 'Abonnement verwalten', icon: '💳' },
        { id: 'invoices', name: 'Rechnungen', icon: '📄' },
      ],
    },
    {
      category: 'Einstellungen',
      items: [
        { id: 'notifications', name: 'Benachrichtigungen', icon: '🔔' },
        { id: 'privacy', name: 'Datenschutz', icon: '🛡️' },
        { id: 'api', name: 'API-Schlüssel', icon: '🔑' },
        { id: 'integrations', name: 'Integrationen', icon: '🔌' },
      ],
    },
    {
      category: 'Support',
      items: [
        { id: 'help', name: 'Hilfe-Center', icon: '❓' },
        { id: 'docs', name: 'Dokumentation', icon: '📚' },
        { id: 'feedback', name: 'Feedback senden', icon: '💬' },
        { id: 'contact', name: 'Kontakt', icon: '📧' },
      ],
    },
  ];

  const handleItemClick = (itemId) => {
    setActiveView(itemId);
    setMessage({ type: '', text: '' });
  };

  const handleBack = () => {
    setActiveView(null);
    setMessage({ type: '', text: '' });
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Nicht angemeldet');

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          company_name: formData.companyName || null,
        },
      });

      if (error) throw error;

      // Update email if changed
      if (formData.email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });
        if (emailError) throw emailError;
      }

      setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert!' });
      
      // Benachrichtige Parent-Komponente über Update
      if (onUserUpdate) {
        await onUserUpdate();
      }
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        handleBack();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Fehler beim Aktualisieren' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwörter stimmen nicht überein' });
      return;
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Passwort muss mindestens 6 Zeichen lang sein' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Passwort erfolgreich geändert!' });
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        handleBack();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Fehler beim Ändern des Passworts' });
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const key = 'arv_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(key);
    setShowApiKey(true);
    setMessage({ type: 'success', text: 'API-Schlüssel generiert!' });
  };

  const toggleIntegration = (index) => {
    const updated = [...integrations];
    updated[index].connected = !updated[index].connected;
    setIntegrations(updated);
    setMessage({ type: 'success', text: `${updated[index].name} ${updated[index].connected ? 'verbunden' : 'getrennt'}` });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleFeedbackSubmit = () => {
    if (!formData.feedback.trim()) {
      setMessage({ type: 'error', text: 'Bitte gib dein Feedback ein' });
      return;
    }
    setMessage({ type: 'success', text: 'Vielen Dank für dein Feedback!' });
    setFormData({ ...formData, feedback: '' });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
      handleBack();
    }, 2000);
  };

  const handleContactSubmit = () => {
    if (!formData.contactSubject.trim() || !formData.contactMessage.trim()) {
      setMessage({ type: 'error', text: 'Bitte fülle alle Felder aus' });
      return;
    }
    setMessage({ type: 'success', text: 'Nachricht gesendet! Wir melden uns in Kürze.' });
    setFormData({ ...formData, contactSubject: '', contactMessage: '' });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
      handleBack();
    }, 2000);
  };

  const renderView = () => {
    if (!activeView) return null;

    switch (activeView) {
      case 'profile':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Profil bearbeiten</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Vorname</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '8px',
                      color: '#e5e7eb',
                      fontSize: '14px',
                    }}
                    placeholder="Dein Vorname"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Nachname</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '8px',
                      color: '#e5e7eb',
                      fontSize: '14px',
                    }}
                    placeholder="Dein Nachname"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>E-Mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                  }}
                  placeholder="deine@email.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                  Firmenname <span style={{ color: '#6b7280', fontSize: '12px' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                  }}
                  placeholder="Meine Firma GmbH"
                />
              </div>
              {message.text && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '14px',
                  }}
                >
                  {message.text}
                </div>
              )}
              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
              </button>
            </div>
          </div>
        );

      case 'password':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Passwort ändern</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Neues Passwort</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                  }}
                  placeholder="Mindestens 6 Zeichen"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Passwort bestätigen</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                  }}
                  placeholder="Passwort wiederholen"
                />
              </div>
              {message.text && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '14px',
                  }}
                >
                  {message.text}
                </div>
              )}
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Wird geändert...' : 'Passwort ändern'}
              </button>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Abonnement verwalten</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Pro Plan</h4>
                    <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>€29/Monat</p>
                  </div>
                  <span style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.1)', color: '#4ade80', borderRadius: '999px', fontSize: '12px' }}>Aktiv</span>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Plan ändern
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      color: '#f87171',
                      border: '1px solid #f87171',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Kündigen
                  </button>
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)' }}>
                <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                  Nächste Zahlung: <strong style={{ color: '#e5e7eb' }}>1. Februar 2025</strong>
                </p>
              </div>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Rechnungen</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'INV-2025-001', date: '1. Januar 2025', amount: '€29,00', status: 'Bezahlt' },
                { id: 'INV-2024-012', date: '1. Dezember 2024', amount: '€29,00', status: 'Bezahlt' },
                { id: 'INV-2024-011', date: '1. November 2024', amount: '€29,00', status: 'Bezahlt' },
              ].map((invoice) => (
                <div
                  key={invoice.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#020617',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{invoice.id}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{invoice.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{invoice.amount}</div>
                    <span style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.1)', color: '#4ade80', borderRadius: '999px', fontSize: '12px' }}>
                      {invoice.status}
                    </span>
                    <button
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: '#6366f1',
                        border: '1px solid #6366f1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Benachrichtigungen</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#020617',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      {key === 'email' ? 'E-Mail-Benachrichtigungen' : key === 'push' ? 'Push-Benachrichtigungen' : key === 'sms' ? 'SMS-Benachrichtigungen' : 'Wöchentlicher Digest'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {key === 'email' ? 'Erhalte wichtige Updates per E-Mail' : key === 'push' ? 'Erhalte sofortige Benachrichtigungen' : key === 'sms' ? 'Erhalte SMS-Benachrichtigungen' : 'Wöchentliche Zusammenfassung'}
                    </div>
                  </div>
                  <label
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '44px',
                      height: '24px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: value ? '#6366f1' : '#374151',
                        borderRadius: '24px',
                        transition: '0.3s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: value ? '22px' : '3px',
                          bottom: '3px',
                          background: '#fff',
                          borderRadius: '50%',
                          transition: '0.3s',
                        }}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Datenschutz</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <h4 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Datenschutzeinstellungen</h4>
                <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '16px' }}>
                  Deine Daten sind bei uns sicher. Wir verwenden deine Daten nur zur Bereitstellung unserer Dienste und verbessern deine Erfahrung.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      color: '#6366f1',
                      border: '1px solid #6366f1',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'left',
                    }}
                  >
                    Daten exportieren
                  </button>
                  <button
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      color: '#f87171',
                      border: '1px solid #f87171',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'left',
                    }}
                  >
                    Konto löschen
                  </button>
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)' }}>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                  Weitere Informationen findest du in unserer <a href="/datenschutz" style={{ color: '#6366f1' }}>Datenschutzerklärung</a>.
                </p>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>API-Schlüssel</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {apiKey && showApiKey ? (
                <div style={{ background: '#020617', padding: '16px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Dein API-Schlüssel</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={apiKey}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#0a0a0a',
                        border: '1px solid #1f2937',
                        borderRadius: '8px',
                        color: '#e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        setMessage({ type: 'success', text: 'Kopiert!' });
                        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
                      }}
                      style={{
                        padding: '12px 16px',
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Kopieren
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>
                    ⚠️ Speichere diesen Schlüssel sicher. Er wird nicht erneut angezeigt.
                  </p>
                </div>
              ) : (
                <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                  <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>
                    Generiere einen API-Schlüssel, um auf die Arvo Labs API zuzugreifen.
                  </p>
                  <button
                    onClick={generateApiKey}
                    style={{
                      padding: '12px 24px',
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    API-Schlüssel generieren
                  </button>
                </div>
              )}
              {message.text && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '14px',
                  }}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Integrationen</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#020617',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{integration.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{integration.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {integration.connected ? 'Verbunden' : 'Nicht verbunden'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration(index)}
                    style={{
                      padding: '8px 16px',
                      background: integration.connected ? 'transparent' : '#6366f1',
                      color: integration.connected ? '#f87171' : '#fff',
                      border: `1px solid ${integration.connected ? '#f87171' : '#6366f1'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {integration.connected ? 'Trennen' : 'Verbinden'}
                  </button>
                </div>
              ))}
            </div>
            {message.text && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: message.type === 'success' ? '#4ade80' : '#f87171',
                  fontSize: '14px',
                }}
              >
                {message.text}
              </div>
            )}
          </div>
        );

      case 'help':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Hilfe-Center</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Erste Schritte', description: 'Lerne die Grundlagen von Arvo Labs kennen' },
                { title: 'Workflows erstellen', description: 'Wie du deine ersten Automationen erstellst' },
                { title: 'Integrationen einrichten', description: 'Verbinde Arvo Labs mit deinen Tools' },
                { title: 'Häufige Fragen', description: 'Antworten auf die häufigsten Fragen' },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: '#020617',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1f2937')}
                >
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'docs':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Dokumentation</h3>
            </div>
            <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid #1f2937' }}>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>
                Unsere vollständige Dokumentation findest du unter:
              </p>
              <a
                href="#"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#6366f1',
                  color: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Dokumentation öffnen →
              </a>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Feedback senden</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Dein Feedback</label>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Teile uns deine Gedanken mit..."
                />
              </div>
              {message.text && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '14px',
                  }}
                >
                  {message.text}
                </div>
              )}
              <button
                onClick={handleFeedbackSubmit}
                style={{
                  padding: '12px 24px',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Feedback senden
              </button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 8px',
                }}
              >
                ←
              </button>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Kontakt</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Betreff</label>
                <input
                  type="text"
                  value={formData.contactSubject}
                  onChange={(e) => setFormData({ ...formData, contactSubject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                  }}
                  placeholder="Worum geht es?"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>Nachricht</label>
                <textarea
                  value={formData.contactMessage}
                  onChange={(e) => setFormData({ ...formData, contactMessage: e.target.value })}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Deine Nachricht..."
                />
              </div>
              {message.text && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '14px',
                  }}
                >
                  {message.text}
                </div>
              )}
              <button
                onClick={handleContactSubmit}
                style={{
                  padding: '12px 24px',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Nachricht senden
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (activeView) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {renderView()}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
      }}
    >
      <h2 style={{ fontSize: '20px', margin: '0 0 20px 0' }}>Einstellungen & Mehr</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {settings.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            style={{
              background: '#111827',
              borderRadius: '12px',
              border: '1px solid #1f2937',
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#9ca3af',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {section.category}
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#020617';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#e5e7eb',
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardMore;
