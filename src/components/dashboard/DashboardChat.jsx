// src/components/dashboard/DashboardChat.jsx
function DashboardChat({
  input,
  setInput,
  inputRef,
  messages,
  isThinking,
  onSend,
  formatMessage,
}) {
  return (
    <div
      style={{
        background:
          'radial-gradient(circle at top,#020617,#020617 40%,#020617)',
        borderRadius: '20px',
        padding: '20px 20px',
        maxWidth: '820px',
        width: '100%',
        border: '1px solid rgba(148,163,184,0.25)',
        display: 'flex',
        flexDirection: 'column',
        height: '540px',
        boxShadow: '0 24px 60px rgba(15,23,42,0.9)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h2 style={{ fontSize: '18px', margin: 0 }}>Arvo Assistant</h2>
        <span
          style={{
            fontSize: '11px',
            color: '#22d3ee',
          }}
        >
          Beta · powered by OpenAI
        </span>
      </div>

      {/* Nachrichtenbereich */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          marginBottom: '12px',
          borderRadius: '12px',
          background: '#020617',
          border: '1px solid #1f2937',
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              fontSize: '13px',
              color: '#6b7280',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            Starte eine Unterhaltung, indem du unten eine Nachricht eingibst.
          </p>
        ) : (
          messages.map((m, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: m.isUser ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: m.isUser
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  background: m.isUser
                    ? 'linear-gradient(135deg,#22d3ee,#6366f1)'
                    : '#020617',
                  color: '#e5e7eb',
                  border: m.isUser
                    ? '1px solid rgba(34,211,238,0.5)'
                    : '1px solid rgba(75,85,99,0.8)',
                  boxShadow: m.isUser
                    ? '0 10px 30px rgba(56,189,248,0.35)'
                    : '0 8px 24px rgba(15,23,42,0.9)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.isUser ? m.text : formatMessage(m.text)}
              </div>
            </div>
          ))
        )}

        {isThinking && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '6px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '999px',
                background:
                  'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(56,189,248,0.12))',
                border: '1px solid rgba(129,140,248,0.45)',
                boxShadow: '0 12px 32px rgba(15,23,42,0.8)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg,#38bdf8,#60a5fa)',
                  animation: 'pulseDotSoft 1.4s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg,#38bdf8,#6366f1)',
                  animation: 'pulseDotSoft 1.4s ease-in-out infinite 0.25s',
                }}
              />
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg,#38bdf8,#4f46e5)',
                  animation: 'pulseDotSoft 1.4s ease-in-out infinite 0.5s',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Eingabezeile */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Stelle eine Frage oder beschreibe deine Aufgabe..."
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(148,163,184,0.6)',
            background: 'rgba(15,23,42,0.95)',
            color: '#e5e7eb',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={onSend}
          style={{
            padding: '12px 20px',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg,#22d3ee,#6366f1)',
            color: '#0f172a',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(56,189,248,0.5)',
          }}
        >
          Senden
        </button>
      </div>
    </div>
  );
}

export default DashboardChat;
