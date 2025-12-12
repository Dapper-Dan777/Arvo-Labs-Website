// src/components/dashboard/DashboardWhiteboards.jsx
function DashboardWhiteboards({ whiteboards = [], onAddWhiteboard, onDeleteWhiteboard }) {

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
          <h2 style={{ fontSize: '20px', margin: 0 }}>Whiteboards</h2>
          <p
            style={{
              fontSize: '13px',
              color: '#9ca3af',
              margin: '4px 0 0 0',
            }}
          >
            Kollaborative Whiteboards für Ideen und Planung
          </p>
        </div>
        <button
          onClick={onAddWhiteboard}
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
          + Neues Whiteboard
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        {whiteboards.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            Noch keine Whiteboards. Erstelle dein erstes Whiteboard!
          </div>
        ) : (
          whiteboards.map((board) => (
          <div
            key={board.id}
            style={{
              background: '#111827',
              borderRadius: '12px',
              border: '1px solid #1f2937',
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = board.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#1f2937';
            }}
          >
            {onDeleteWhiteboard && (
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
                  onDeleteWhiteboard(board.id);
                }}
              >
                ×
              </div>
            )}
            <div
              style={{
                width: '100%',
                height: '120px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${board.color}20, ${board.color}10)`,
                border: `1px solid ${board.color}40`,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: board.color,
              }}
            >
              📋
            </div>
            <h3
              style={{
                fontSize: '15px',
                margin: '0 0 4px 0',
                color: '#e5e7eb',
              }}
            >
              {board.name}
            </h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                }}
              >
                {board.collaborators} Mitwirkende
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                }}
              >
                {board.lastEdited}
              </span>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardWhiteboards;
