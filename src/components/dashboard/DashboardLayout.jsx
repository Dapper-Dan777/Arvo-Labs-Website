// src/components/dashboard/DashboardLayout.jsx
import ThemeToggle from '@/components/ThemeToggle';

function DashboardLayout({
  user,
  activeMenu,
  setActiveMenu,
  onLogout,
  children,
  onManageCards,
  isCardsPage = false,
}) {
  const MENUS = {
    HOME: 'Startseite',
    INBOX: 'Posteingang',
    CHAT: 'Chat',
    TEAMS: 'Teams',
    DOCS: 'Dokumente',
    DASHBOARDS: 'Dashboards',
    WHITEBOARDS: 'Whiteboards',
    FORMS: 'Formulare',
    MAIL: 'Mail',
    GOALS: 'Ziele',
    TIMESHEETS: 'Timesheets',
    MORE: 'Mehr',
  };
  return (
    <div
      style={{
        height: '100vh',
        background: 'var(--bg-body)',
        color: 'var(--text-primary)',
        display: 'flex',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          borderRight: '1px solid var(--border-subtle)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          background: 'var(--bg-surface)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          flexShrink: 0,
          overflowY: 'auto',
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            fontFamily: "var(--font-arvo), 'Arvo', serif",
            fontWeight: 700,
            fontSize: '20px',
            padding: '8px 12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Arvo Labs
        </div>

        {/* Hauptnavigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.values(MENUS).map((item) => (
            <button
              key={item}
              onClick={() => setActiveMenu(item)}
              className="dashboard-btn"
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                background:
                  activeMenu === item
                    ? 'rgba(102, 252, 241, 0.15)'
                    : 'transparent',
                color: activeMenu === item ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: activeMenu === item ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                borderLeft: activeMenu === item ? '3px solid var(--primary)' : '3px solid transparent',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item) {
                  e.target.style.background = 'rgba(99,102,241,0.08)';
                  e.target.style.color = '#c7d2fe';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#9ca3af';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = activeMenu === item ? 'translateX(0)' : 'translateX(4px)';
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User Info & Logout */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {user?.publicMetadata?.company_name && (
            <div
              style={{
                padding: '10px 12px',
                background: 'rgba(99,102,241,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Unternehmen
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                }}
              >
                {String(user.publicMetadata.company_name)}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ThemeToggle />
            <button
              className="dashboard-btn"
              onClick={onLogout}
              style={{
                border: 'none',
                background: 'rgba(239,68,68,0.15)',
                color: '#fca5a5',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239,68,68,0.25)';
              e.target.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239,68,68,0.15)';
              e.target.style.color = '#fca5a5';
            }}
          >
            Abmelden
          </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Header oben */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            flexShrink: 0,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
              Hallo, {user?.publicMetadata?.company_name || user?.fullName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Nutzer'}
            </h1>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              {user?.publicMetadata?.company_name 
                ? `Willkommen bei ${user.publicMetadata.company_name}`
                : user?.fullName
                ? `Willkommen zurück, ${user.fullName}`
                : 'Deine Übersicht über aktuelle Arbeit und Agenda.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {onManageCards && !isCardsPage && (
              <button
                className="dashboard-btn"
                onClick={onManageCards}
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  border: 'none',
                  color: 'var(--bg-body)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(102, 252, 241, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 252, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 252, 241, 0.3)';
                }}
              >
                Karten verwalten
              </button>
            )}
          </div>
        </header>

        {/* Hauptbereich mit dynamischem Inhalt */}
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {children}
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
