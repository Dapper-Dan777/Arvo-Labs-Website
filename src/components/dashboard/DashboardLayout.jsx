// src/components/dashboard/DashboardLayout.jsx
import ThemeToggle from '@/components/ThemeToggle';
import {
  Home,
  Inbox,
  MessageCircle,
  Users,
  FileText,
  LayoutDashboard,
  Square,
  FileEdit,
  Mail,
  Target,
  Clock,
  MoreHorizontal,
} from 'lucide-react';

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

  // Icon-Mapping für Menüpunkte
  const menuIcons = {
    'Startseite': Home,
    'Posteingang': Inbox,
    'Chat': MessageCircle,
    'Teams': Users,
    'Dokumente': FileText,
    'Dashboards': LayoutDashboard,
    'Whiteboards': Square,
    'Formulare': FileEdit,
    'Mail': Mail,
    'Ziele': Target,
    'Timesheets': Clock,
    'Mehr': MoreHorizontal,
  };

  // Badge-Mapping (kann später dynamisch gemacht werden)
  const menuBadges = {
    'Posteingang': 3, // Beispiel-Badge
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
      {/* Sidebar - Modernes Design mit dunklem Gradient und magenta-violettem Neon-Glow */}
      <aside
        style={{
          width: '260px',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          background: 'linear-gradient(to bottom, #000000, #0a0a0a, #000000)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          flexShrink: 0,
          overflowY: 'auto',
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#ffffff',
            }}
          >
            Arvo Labs
          </span>
        </div>

        {/* Hauptnavigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.values(MENUS).map((item) => {
            const Icon = menuIcons[item];
            const badge = menuBadges[item];
            const isActive = activeMenu === item;

            return (
              <button
                key={item}
                onClick={() => setActiveMenu(item)}
                className="dashboard-btn"
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: isActive
                    ? 'linear-gradient(to right, rgba(99, 102, 241, 0.7), rgba(99, 102, 241, 0.4), transparent)'
                    : 'rgba(255, 255, 255, 0)',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: isActive
                    ? '0 0 25px rgba(99, 102, 241, 0.55)'
                    : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  }
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      style={{
                        color: isActive
                          ? '#ffffff'
                          : 'rgba(255, 255, 255, 0.5)',
                        filter: isActive
                          ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.7))'
                          : 'none',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  )}
                  <span>{item}</span>
                </span>

                {badge && (
                  <span
                    style={{
                      display: 'flex',
                      height: '20px',
                      minWidth: '24px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '0 6px',
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 500,
                    }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User Info & Logout */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
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
                  background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
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
