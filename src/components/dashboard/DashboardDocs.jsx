// src/components/dashboard/DashboardDocs.jsx
function DashboardDocs({
  docAction,
  docPrompt,
  docAnswer,
  docThinking,
  onChangeAction,
  onChangePrompt,
  onSendRequest,
  onFileChange,
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
        gap: '16px',
        boxShadow: '0 24px 60px rgba(15,23,42,0.9)',
      }}
    >
      {/* Upload-Block */}
      <div
        style={{
          borderRadius: '16px',
          padding: '14px 16px',
          background: '#020617',
          border: '1px solid rgba(148,163,184,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Dokument hochladen
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#9ca3af',
            }}
          >
            Lade ein PDF oder Textdokument hoch, um es von der KI auswerten zu
            lassen.
          </p>
        </div>
        <input
          type="file"
          onChange={onFileChange}
          style={{
            fontSize: '12px',
            color: '#e5e7eb',
          }}
        />
      </div>

      {/* Optionen + Freitext-Anforderung */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '12px',
        }}
      >
        {/* Auswahlbox */}
        <div
          style={{
            borderRadius: '16px',
            padding: '14px 16px',
            background: '#020617',
            border: '1px solid rgba(148,163,184,0.4)',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px',
            }}
          >
            Was möchtest du wissen?
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            <button
              onClick={() => onChangeAction('summary')}
              style={{
                padding: '8px 10px',
                borderRadius: '999px',
                border: 'none',
                background: 'rgba(55,65,81,0.7)',
                color: '#e5e7eb',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              Datei zusammenfassen
            </button>

            <button
              onClick={() => onChangeAction('keypoints')}
              style={{
                padding: '8px 10px',
                borderRadius: '999px',
                border: 'none',
                background: 'rgba(55,65,81,0.7)',
                color: '#e5e7eb',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              Wichtige Punkte extrahieren
            </button>

            <button
              onClick={() => onChangeAction('qa')}
              style={{
                padding: '8px 10px',
                borderRadius: '999px',
                border: 'none',
                background: 'rgba(55,65,81,0.7)',
                color: '#e5e7eb',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              Fragen zur Datei beantworten
            </button>
          </div>
        </div>

        {/* Eigene Anforderung */}
        <div
          style={{
            borderRadius: '16px',
            padding: '14px 16px',
            background: '#020617',
            border: '1px solid rgba(148,163,184,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Eigene Anforderung
          </h3>
          <textarea
            value={docPrompt}
            onChange={(e) => onChangePrompt(e.target.value)}
            placeholder="Beschreibe hier genau, was die KI mit dem Dokument machen soll..."
            style={{
              flex: 1,
              marginTop: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(148,163,184,0.4)',
              background: 'rgba(15,23,42,0.95)',
              color: '#e5e7eb',
              fontSize: '13px',
              padding: '8px 10px',
              resize: 'none',
              outline: 'none',
              minHeight: '70px',
            }}
          />
          <button
            onClick={onSendRequest}
            style={{
              alignSelf: 'flex-end',
              padding: '8px 14px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg,#22d3ee,#6366f1)',
              color: '#0f172a',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Anforderung senden
          </button>
        </div>
      </div>

      {/* Antwort-Box */}
      <div
        style={{
          borderRadius: '16px',
          padding: '14px 16px',
          background: '#020617',
          border: '1px solid rgba(148,163,184,0.4)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Antwort
        </h3>
        <div
          style={{
            flex: 1,
            fontSize: '13px',
            color: '#e5e7eb',
            whiteSpace: 'pre-wrap',
          }}
        >
          {docThinking
            ? 'Dokument wird analysiert...'
            : docAnswer || 'Noch keine Analyse durchgeführt.'}
        </div>
      </div>
    </div>
  );
}

export default DashboardDocs;
