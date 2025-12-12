// src/components/dashboard/DashboardMail.jsx
function DashboardMail({
  to,
  subject,
  body,
  sendingMail,
  mailResult,
  mailError,
  setTo,
  setSubject,
  setBody,
  onSendMail,
}) {
  return (
    <div
      style={{
        background: '#111827',
        borderRadius: '12px',
        padding: '24px 28px',
        maxWidth: '720px',
        width: '100%',
        border: '1px solid #1f2937',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>E-Mail senden</h2>
      <p
        style={{
          fontSize: '13px',
          color: '#9ca3af',
          marginBottom: '8px',
        }}
      >
        Sende eine Nachricht über deinen Arvo Mail-Service.
      </p>

      <input
        type="email"
        placeholder="Empfänger (z.B. kunde@example.com)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #374151',
          background: '#020617',
          color: '#e5e7eb',
          fontSize: '13px',
        }}
      />

      <input
        type="text"
        placeholder="Betreff"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #374151',
          background: '#020617',
          color: '#e5e7eb',
          fontSize: '13px',
        }}
      />

      <textarea
        placeholder="Nachrichtentext..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{
          minHeight: '160px',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #374151',
          background: '#020617',
          color: '#e5e7eb',
          fontSize: '13px',
          resize: 'vertical',
        }}
      />

      <button
        onClick={onSendMail}
        disabled={sendingMail}
        style={{
          alignSelf: 'flex-end',
          marginTop: '4px',
          padding: '10px 18px',
          borderRadius: '999px',
          border: 'none',
          background: sendingMail
            ? 'rgba(156,163,175,0.4)'
            : 'linear-gradient(135deg,#22d3ee,#6366f1)',
          color: '#0f172a',
          fontSize: '13px',
          fontWeight: 600,
          cursor: sendingMail ? 'default' : 'pointer',
        }}
      >
        {sendingMail ? 'Wird gesendet...' : 'E-Mail senden'}
      </button>

      {mailResult && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '12px',
            color: mailError ? '#fecaca' : '#bbf7d0',
            textAlign: 'right',
          }}
        >
          {mailResult}
        </p>
      )}
    </div>
  );
}

export default DashboardMail;
