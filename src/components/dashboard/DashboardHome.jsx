// src/components/dashboard/DashboardHome.jsx
function DashboardHome({ user, workflows }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1.1fr',
        gap: '16px',
        width: '100%',
        maxWidth: '980px',
      }}
    >
      {/* Heute-Widget */}
      <div
        className="dashboard-card"
        style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '20px 22px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>Heute bei Arvo</h2>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          Willkommen zurück, {user?.publicMetadata?.company_name || user?.fullName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Nutzer'}. Hier ist deine heutige Übersicht.
        </p>
        <div
          style={{
            marginTop: '14px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div
            className="dashboard-interactive"
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--card-bg)',
              fontSize: '12px',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Aktive Workflows</span>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {workflows.length}
            </div>
          </div>
          <div
            className="dashboard-interactive"
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--card-bg)',
              fontSize: '12px',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Heutiger Fokus</span>
            <div style={{ fontSize: '13px' }}>
              Starte mit deinen wichtigsten Tasks.
            </div>
          </div>
        </div>
      </div>

      {/* Rechte Spalte: Aufgaben + zuletzt genutzt */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Aufgaben */}
        <div
          className="dashboard-card"
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid var(--border-subtle)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              margin: 0,
              marginBottom: '6px',
              color: 'var(--text-primary)',
            }}
          >
            Offene Aufgaben
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: 0,
              marginBottom: '8px',
            }}
          >
            Später kannst du hier echte Tasks aus deinen Workflows sehen.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            <li className="dashboard-item" style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-primary)' }}>
              <span>Onboarding-Workflow fertig konfigurieren</span>
              <span
                style={{
                  marginLeft: '6px',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: 'rgba(102, 252, 241, 0.15)',
                  color: 'var(--primary)',
                }}
              >
                Heute
              </span>
            </li>
            <li className="dashboard-item" style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-primary)' }}>
              <span>Erste E-Mail-Automation testen</span>
            </li>
            <li className="dashboard-item" style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-primary)' }}>
              <span>Dokumenten-KI mit Beispiel-PDF prüfen</span>
            </li>
          </ul>
        </div>

        {/* Zuletzt genutzt */}
        <div
          className="dashboard-card"
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid var(--border-subtle)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              margin: 0,
              marginBottom: '6px',
              color: 'var(--text-primary)',
            }}
          >
            Zuletzt genutzt
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: 0,
              marginBottom: '8px',
            }}
          >
            Schneller Zugriff auf Bereiche, die du häufig aufrufst.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            <li className="dashboard-item" style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-primary)' }}>Chat · Arvo Assistant</li>
            <li className="dashboard-item" style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-primary)' }}>Dokumente · KI-Analyse</li>
            <li className="dashboard-item" style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-primary)' }}>Dashboards · Workflow-Übersicht</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
