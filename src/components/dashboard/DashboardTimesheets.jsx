import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function DashboardTimesheets({ entries = [], onAddEntry, onDeleteEntry, onToggleStatus, user, isAdmin = false, onToggleAdmin }) {
  const [timeRange, setTimeRange] = useState('weekly'); // daily, weekly, monthly, yearly
  const [chartData, setChartData] = useState([]);
  const [allUsersEntries, setAllUsersEntries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      loadAllUsersEntries();
      loadUsers();
    } else {
      calculateChartData();
    }
  }, [entries, timeRange, isAdmin, selectedUser]);

  const loadAllUsersEntries = async () => {
    try {
      // Lade alle Zeiterfassungen aus Supabase (wenn Tabelle existiert)
      // Fallback: Nutze lokale Daten
      const data = selectedUser 
        ? entries.filter(e => e.userId === selectedUser)
        : entries;
      setAllUsersEntries(data);
      calculateChartDataForEntries(data);
    } catch (err) {
      console.error('Fehler beim Laden der Zeiterfassungen:', err);
    }
  };

  const loadUsers = async () => {
    try {
      // Lade alle Nutzer für Admin-Ansicht
      // In einer echten App würde man das aus Supabase laden
      setUsers([
        { id: user?.id, name: user?.user_metadata?.full_name || user?.email, email: user?.email },
      ]);
    } catch (err) {
      console.error('Fehler beim Laden der Nutzer:', err);
    }
  };

  const calculateChartData = () => {
    calculateChartDataForEntries(entries);
  };

  const calculateChartDataForEntries = (entriesToProcess) => {
    const now = new Date();
    let data = [];

    switch (timeRange) {
      case 'daily':
        // Letzte 7 Tage
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
          const dayEntries = entriesToProcess.filter(e => {
            const entryDate = new Date(e.date || e.created_at);
            return entryDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) === dateStr;
          });
          const totalHours = dayEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
          data.push({ label: dateStr, value: totalHours, date: dateStr });
        }
        break;

      case 'weekly':
        // Letzte 8 Wochen
        for (let i = 7; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - (i * 7));
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekLabel = `KW ${getWeekNumber(weekStart)}`;
          const weekEntries = entriesToProcess.filter(e => {
            const entryDate = new Date(e.date || e.created_at);
            return isInWeek(entryDate, weekStart);
          });
          const totalHours = weekEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
          data.push({ label: weekLabel, value: totalHours });
        }
        break;

      case 'monthly':
        // Letzte 12 Monate
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthLabel = date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
          const monthEntries = entriesToProcess.filter(e => {
            const entryDate = new Date(e.date || e.created_at);
            return entryDate.getMonth() === date.getMonth() && entryDate.getFullYear() === date.getFullYear();
          });
          const totalHours = monthEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
          data.push({ label: monthLabel, value: totalHours });
        }
        break;

      case 'yearly':
        // Letzte 5 Jahre
        for (let i = 4; i >= 0; i--) {
          const year = now.getFullYear() - i;
          const yearEntries = entriesToProcess.filter(e => {
            const entryDate = new Date(e.date || e.created_at);
            return entryDate.getFullYear() === year;
          });
          const totalHours = yearEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
          data.push({ label: year.toString(), value: totalHours });
        }
        break;
    }

    setChartData(data);
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  const isInWeek = (date, weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
  };

  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const weeklyTotal = entries.reduce((sum, entry) => sum + (parseFloat(entry.hours) || 0), 0);
  const todayTotal = entries
    .filter((e) => {
      const today = new Date().toLocaleDateString('de-DE');
      const entryDate = new Date(e.date || e.created_at).toLocaleDateString('de-DE');
      return entryDate === today;
    })
    .reduce((sum, entry) => sum + (parseFloat(entry.hours) || 0), 0);

  const displayEntries = isAdmin && selectedUser 
    ? allUsersEntries.filter(e => e.userId === selectedUser)
    : isAdmin 
    ? allUsersEntries 
    : entries;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
      }}
    >
      {/* Admin Header */}
      {isAdmin && (
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            marginBottom: '20px',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>Admin-Ansicht: Zeiterfassung</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Nutzer auswählen:</label>
            <select
              value={selectedUser || ''}
              onChange={(e) => setSelectedUser(e.target.value || null)}
              style={{
                padding: '8px 12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
              }}
            >
              <option value="">Alle Nutzer</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Statistik-Karten */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '8px',
            }}
          >
            Heute
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {todayTotal.toFixed(1)}h
          </div>
        </div>
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '8px',
            }}
          >
            Diese Woche
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {weeklyTotal.toFixed(1)}h
          </div>
        </div>
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '8px',
            }}
          >
            Durchschnitt/Tag
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {(weeklyTotal / 5).toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          marginBottom: '20px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>Zeit-Übersicht</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: timeRange === range ? 'var(--primary)' : 'transparent',
                  color: timeRange === range ? 'var(--bg-body)' : 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {range === 'daily' ? 'Täglich' : range === 'weekly' ? 'Wöchentlich' : range === 'monthly' ? 'Monatlich' : 'Jährlich'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Visualization */}
        <div
          style={{
            height: '250px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            padding: '20px 0 40px 0',
            position: 'relative',
          }}
        >
          {chartData.length === 0 ? (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '14px',
                padding: '40px',
              }}
            >
              Noch keine Daten für diesen Zeitraum
            </div>
          ) : (
            chartData.map((item, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  const tooltip = e.currentTarget.querySelector('.chart-tooltip');
                  if (tooltip) tooltip.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.querySelector('.chart-tooltip');
                  if (tooltip) tooltip.style.opacity = '0';
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max((item.value / maxValue) * 180, item.value > 0 ? 4 : 0)}px`,
                    background: 'linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s ease-out',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  title={`${item.label}: ${item.value.toFixed(1)}h`}
                >
                  {item.value > 0 && (
                    <div
                      className="chart-tooltip"
                      style={{
                        position: 'absolute',
                        top: '-32px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--card-bg)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        border: '1px solid var(--border-subtle)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }}
                    >
                      {item.value.toFixed(1)}h
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    writingMode: timeRange === 'yearly' ? 'horizontal-tb' : 'horizontal-tb',
                    transform: timeRange === 'yearly' ? 'none' : 'none',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Einträge */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>
            {isAdmin ? 'Alle Zeiterfassungen' : 'Meine Zeiterfassung'}
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {user?.user_metadata?.is_admin && onToggleAdmin && (
              <button
                onClick={onToggleAdmin}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: isAdmin ? 'var(--accent)' : 'transparent',
                  color: isAdmin ? 'var(--bg-body)' : 'var(--primary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isAdmin) {
                    e.target.style.background = 'var(--primary-soft)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAdmin) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {isAdmin ? '← Normale Ansicht' : '🔐 Admin-Ansicht'}
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={onAddEntry}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--primary)',
                  color: 'var(--bg-body)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                + Neuer Eintrag
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {displayEntries.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}
            >
              Noch keine Einträge. {!isAdmin && 'Füge deinen ersten Eintrag hinzu!'}
            </div>
          ) : (
            displayEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}
                  >
                    {entry.task}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {entry.project} · {entry.date || new Date(entry.created_at).toLocaleDateString('de-DE')}
                    {isAdmin && entry.userName && (
                      <span style={{ marginLeft: '8px', color: 'var(--primary)' }}>
                        · {entry.userName}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {entry.hours}h
                  </div>
                  <span
                    onClick={() => onToggleStatus && onToggleStatus(entry.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      background:
                        entry.status === 'laufend'
                          ? 'rgba(102, 252, 241, 0.15)'
                          : 'rgba(69, 162, 158, 0.15)',
                      color:
                        entry.status === 'laufend' ? 'var(--primary)' : 'var(--accent)',
                      cursor: onToggleStatus ? 'pointer' : 'default',
                    }}
                  >
                    {entry.status === 'laufend' ? 'Laufend' : 'Abgeschlossen'}
                  </span>
                  {onDeleteEntry && (
                    <span
                      onClick={() => onDeleteEntry(entry.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(239,68,68,0.15)',
                        color: '#fecaca',
                        fontSize: '11px',
                        cursor: 'pointer',
                        marginLeft: '8px',
                      }}
                    >
                      ×
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardTimesheets;
