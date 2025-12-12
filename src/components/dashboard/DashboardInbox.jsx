// src/components/dashboard/DashboardInbox.jsx
import { useState } from 'react';

function DashboardInbox() {
  const [selectedEmail, setSelectedEmail] = useState(null);

  const emails = [
    {
      id: 1,
      from: 'Max Mustermann',
      subject: 'Projekt-Update: Q1 Ziele erreicht',
      preview: 'Wir haben alle geplanten Meilensteine für Q1 erfolgreich abgeschlossen...',
      date: 'Heute, 14:32',
      unread: true,
    },
    {
      id: 2,
      from: 'Sarah Schmidt',
      subject: 'Meeting-Einladung: Automatisierungsstrategie',
      preview: 'Hi, könnten wir nächste Woche einen Termin finden, um über...',
      date: 'Heute, 11:15',
      unread: true,
    },
    {
      id: 3,
      from: 'Arvo Labs',
      subject: 'Willkommen bei Arvo Labs!',
      preview: 'Vielen Dank für deine Registrierung. Hier sind die ersten Schritte...',
      date: 'Gestern, 16:45',
      unread: false,
    },
    {
      id: 4,
      from: 'Thomas Weber',
      subject: 'Re: Workflow-Anfrage',
      preview: 'Perfekt, das sieht genau nach dem aus, was wir brauchen...',
      date: 'Gestern, 09:22',
      unread: false,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '16px',
        width: '100%',
        maxWidth: '1000px',
        height: '600px',
      }}
    >
      {/* E-Mail-Liste */}
      <div
        style={{
          background: '#111827',
          borderRadius: '12px',
          border: '1px solid #1f2937',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #1f2937',
          }}
        >
          <h2 style={{ fontSize: '16px', margin: 0 }}>Posteingang</h2>
          <p
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '4px 0 0 0',
            }}
          >
            {emails.filter((e) => e.unread).length} ungelesen
          </p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #1f2937',
                cursor: 'pointer',
                background:
                  selectedEmail?.id === email.id
                    ? 'rgba(99,102,241,0.12)'
                    : email.unread
                    ? '#020617'
                    : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: email.unread ? 600 : 400,
                    color: '#e5e7eb',
                  }}
                >
                  {email.from}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#6b7280',
                  }}
                >
                  {email.date}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: email.unread ? 500 : 400,
                  color: email.unread ? '#e5e7eb' : '#9ca3af',
                  marginBottom: '4px',
                }}
              >
                {email.subject}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E-Mail-Detail */}
      <div
        style={{
          background: '#111827',
          borderRadius: '12px',
          border: '1px solid #1f2937',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {selectedEmail ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  margin: '0 0 8px 0',
                  color: '#e5e7eb',
                }}
              >
                {selectedEmail.subject}
              </h2>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '13px',
                  color: '#9ca3af',
                }}
              >
                <span>
                  <strong style={{ color: '#e5e7eb' }}>Von:</strong> {selectedEmail.from}
                </span>
                <span>
                  <strong style={{ color: '#e5e7eb' }}>Datum:</strong> {selectedEmail.date}
                </span>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: '16px',
                background: '#020617',
                borderRadius: '8px',
                border: '1px solid #1f2937',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#e5e7eb',
              }}
            >
              <p>
                {selectedEmail.preview}
              </p>
              <p style={{ marginTop: '16px' }}>
                Dies ist eine Beispiel-E-Mail. In der vollständigen Version würdest du
                hier den vollständigen E-Mail-Inhalt sehen. Du kannst E-Mails direkt
                über die Mail-Funktion von Arvo Labs verwalten und automatisieren.
              </p>
            </div>
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Antworten
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Weiterleiten
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Wähle eine E-Mail aus, um sie zu lesen
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardInbox;
