// src/components/dashboard/DashboardGoals.jsx
function DashboardGoals({ goals = [], onAddGoal, onToggleTask, onDeleteGoal }) {

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
          <h2 style={{ fontSize: '20px', margin: 0 }}>Ziele</h2>
          <p
            style={{
              fontSize: '13px',
              color: '#9ca3af',
              margin: '4px 0 0 0',
            }}
          >
            Verfolge deine Ziele und Meilensteine
          </p>
        </div>
        <button
          onClick={onAddGoal}
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
          + Neues Ziel
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {goals.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            Noch keine Ziele. Erstelle dein erstes Ziel!
          </div>
        ) : (
          goals.map((goal) => (
          <div
            key={goal.id}
            style={{
              background: '#111827',
              borderRadius: '12px',
              border: '1px solid #1f2937',
              padding: '20px',
              position: 'relative',
            }}
          >
            {onDeleteGoal && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(239,68,68,0.15)',
                  color: '#fecaca',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
                onClick={() => onDeleteGoal(goal.id)}
              >
                ×
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '16px',
                    margin: '0 0 4px 0',
                    color: '#e5e7eb',
                  }}
                >
                  {goal.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  <span>Frist: {goal.deadline}</span>
                  <span
                    style={{
                      color:
                        goal.status === 'on-track'
                          ? '#10b981'
                          : goal.status === 'at-risk'
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  >
                    {goal.status === 'on-track'
                      ? '✓ Auf Kurs'
                      : goal.status === 'at-risk'
                      ? '⚠ Risiko'
                      : '✗ Verzögert'}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                }}
              >
                {goal.progress}%
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                background: '#020617',
                marginBottom: '16px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${goal.progress}%`,
                  height: '100%',
                  background:
                    goal.status === 'on-track'
                      ? '#10b981'
                      : goal.status === 'at-risk'
                      ? '#f59e0b'
                      : '#ef4444',
                  transition: 'width 0.3s',
                }}
              />
            </div>

            {/* Tasks */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {goal.tasks.map((task, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    padding: '6px 0',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask && onToggleTask(goal.id, index)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    style={{
                      color: task.completed ? '#6b7280' : '#e5e7eb',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardGoals;
