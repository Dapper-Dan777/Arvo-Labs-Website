// src/components/dashboard/DashboardForms.jsx
function DashboardForms({ forms = [], onAddForm, onDeleteForm }) {

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1000px',
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
          <h2 style={{ fontSize: '20px', margin: 0 }}>Formulare</h2>
          <p
            style={{
              fontSize: '13px',
              color: '#9ca3af',
              margin: '4px 0 0 0',
            }}
          >
            Erstelle und verwalte Umfragen und Formulare
          </p>
        </div>
        <button
          onClick={onAddForm}
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
          + Neues Formular
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {forms.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            Noch keine Formulare. Erstelle dein erstes Formular!
          </div>
        ) : (
          forms.map((form) => (
          <div
            key={form.id}
            style={{
              background: '#111827',
              borderRadius: '12px',
              border: '1px solid #1f2937',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.borderColor = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = '#1f2937';
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '6px',
                }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    margin: 0,
                    color: '#e5e7eb',
                  }}
                >
                  {form.name}
                </h3>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    background:
                      form.status === 'aktiv'
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(107,114,128,0.15)',
                    color:
                      form.status === 'aktiv' ? '#10b981' : '#9ca3af',
                  }}
                >
                  {form.status}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                }}
              >
                {form.responses} Antworten · Letzte: {form.lastResponse}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Bearbeiten
              </button>
              {onDeleteForm && (
                <button
                  onClick={() => onDeleteForm(form.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #374151',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#fecaca',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Löschen
                </button>
              )}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardForms;
