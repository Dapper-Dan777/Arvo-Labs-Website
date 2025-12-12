// src/components/dashboard/DashboardDashboards.jsx
function DashboardDashboards({ dashboards = [], onAddDashboard, onDeleteDashboard }) {

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Dashboards</h2>
          <p
            style={{
              fontSize: '13px',
              color: '#9ca3af',
              margin: '4px 0 0 0',
            }}
          >
            Übersicht über deine wichtigsten Metriken und KPIs
          </p>
        </div>
        <button
          onClick={onAddDashboard}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #374151',
            background: '#6366f1',
            color: '#fff',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          + Neues Dashboard
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        {dashboards.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            Noch keine Dashboards. Erstelle dein erstes Dashboard!
          </div>
        ) : (
          dashboards.map((dashboard) => (
          <div
            key={dashboard.id}
            style={{
              background: '#111827',
              borderRadius: '12px',
              border: '1px solid #1f2937',
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#1f2937';
            }}
          >
            {onDeleteDashboard && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(239,68,68,0.15)',
                  color: '#fecaca',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDashboard(dashboard.id);
                }}
              >
                ×
              </div>
            )}
            <h3
              style={{
                fontSize: '16px',
                margin: '0 0 4px 0',
                color: '#e5e7eb',
              }}
            >
              {dashboard.name}
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 16px 0',
              }}
            >
              {dashboard.description}
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {dashboard.metrics.map((metric, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#020617',
                    border: '1px solid #1f2937',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginBottom: '4px',
                    }}
                  >
                    {metric.label}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#e5e7eb',
                      }}
                    >
                      {metric.value}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: metric.change.startsWith('+') ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: '12px',
                fontSize: '11px',
                color: '#6b7280',
              }}
            >
              Aktualisiert {dashboard.lastUpdated}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardDashboards;
