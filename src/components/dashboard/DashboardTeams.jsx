import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function DashboardTeams({ teams = [], onAddTeam, onDeleteTeam, user, allUsers = [] }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamChatMessages, setTeamChatMessages] = useState({});
  const [chatInput, setChatInput] = useState({});
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    // Lade verfügbare Mitglieder (alle Nutzer der Firma)
    if (allUsers.length > 0) {
      setAvailableMembers(allUsers);
    } else {
      // Fallback: Demo-Mitglieder
      setAvailableMembers([
        { id: user?.id, name: user?.user_metadata?.full_name || user?.email, email: user?.email },
        { id: 'user2', name: 'Max Mustermann', email: 'max@example.com' },
        { id: 'user3', name: 'Sarah Schmidt', email: 'sarah@example.com' },
        { id: 'user4', name: 'Thomas Weber', email: 'thomas@example.com' },
      ]);
    }
  }, [allUsers, user]);

  useEffect(() => {
    // Lade Chat-Nachrichten für ausgewähltes Team
    if (selectedTeam) {
      loadTeamChat(selectedTeam.id);
      subscribeToTeamChat(selectedTeam.id);
    }
  }, [selectedTeam]);

  const loadTeamChat = async (teamId) => {
    try {
      // Lade Chat-Nachrichten aus Supabase (wenn Tabelle existiert)
      // Fallback: Nutze lokale Daten
      const existingMessages = teamChatMessages[teamId] || [];
      setTeamChatMessages(prev => ({
        ...prev,
        [teamId]: existingMessages,
      }));
    } catch (err) {
      console.error('Fehler beim Laden des Chats:', err);
    }
  };

  const subscribeToTeamChat = (teamId) => {
    // Supabase Realtime Subscription für Live-Updates
    const channel = supabase
      .channel(`team-chat-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_messages',
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          setTeamChatMessages(prev => ({
            ...prev,
            [teamId]: [...(prev[teamId] || []), newMessage],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendTeamMessage = async (teamId, message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      teamId: teamId,
      userId: user?.id,
      userName: user?.user_metadata?.full_name || user?.email,
      message: message,
      timestamp: new Date().toISOString(),
    };

    try {
      // Speichere in Supabase (wenn Tabelle existiert)
      const { error } = await supabase
        .from('team_messages')
        .insert([{
          team_id: teamId,
          user_id: user?.id,
          user_name: newMessage.userName,
          message: message,
          created_at: new Date().toISOString(),
        }]);

      if (error) {
        // Fallback: Lokale Speicherung
        setTeamChatMessages(prev => ({
          ...prev,
          [teamId]: [...(prev[teamId] || []), newMessage],
        }));
      } else {
        // Nachricht wird über Realtime automatisch hinzugefügt
      }
    } catch (err) {
      // Fallback: Lokale Speicherung
      setTeamChatMessages(prev => ({
        ...prev,
        [teamId]: [...(prev[teamId] || []), newMessage],
      }));
    }

    setChatInput(prev => ({ ...prev, [teamId]: '' }));
  };

  if (selectedTeam) {
    const messages = teamChatMessages[selectedTeam.id] || [];
    
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '20px',
        }}
      >
        {/* Team-Liste */}
        <div
          style={{
            background: '#111827',
            borderRadius: '12px',
            border: '1px solid #1f2937',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => setSelectedTeam(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
              }}
            >
              ←
            </button>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Teams</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #1f2937',
                  background: selectedTeam?.id === team.id ? 'rgba(99,102,241,0.1)' : '#020617',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = team.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                  {team.name}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {team.memberIds?.length || team.members} Mitglieder
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onAddTeam}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #374151',
              background: '#020617',
              color: '#e5e7eb',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Neues Team
          </button>
        </div>

        {/* Team-Chat */}
        <div
          style={{
            background: '#111827',
            borderRadius: '12px',
            border: '1px solid #1f2937',
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid #1f2937',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', margin: 0 }}>{selectedTeam.name}</h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                {selectedTeam.memberIds?.length || selectedTeam.members} Mitglieder
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {selectedTeam.memberIds?.map((memberId) => {
                const member = availableMembers.find(m => m.id === memberId);
                return member ? (
                  <div
                    key={memberId}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(99,102,241,0.1)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#6366f1',
                    }}
                  >
                    {member.name.split(' ')[0]}
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '14px',
                  marginTop: '40px',
                }}
              >
                Noch keine Nachrichten. Starte die Unterhaltung!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignSelf: msg.userId === user?.id ? 'flex-end' : 'flex-start',
                    flexDirection: msg.userId === user?.id ? 'row-reverse' : 'row',
                    maxWidth: '70%',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: msg.userId === user?.id ? '#6366f1' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {msg.userName?.charAt(0) || 'U'}
                  </div>
                  <div
                    style={{
                      background: msg.userId === user?.id ? '#6366f1' : '#020617',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: msg.userId === user?.id ? 'none' : '1px solid #1f2937',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: msg.userId === user?.id ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                        marginBottom: '4px',
                      }}
                    >
                      {msg.userName}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: msg.userId === user?.id ? '#fff' : '#e5e7eb',
                      }}
                    >
                      {msg.message}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: msg.userId === user?.id ? 'rgba(255,255,255,0.6)' : '#6b7280',
                        marginTop: '4px',
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid #1f2937',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={chatInput[selectedTeam.id] || ''}
                onChange={(e) =>
                  setChatInput(prev => ({ ...prev, [selectedTeam.id]: e.target.value }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendTeamMessage(selectedTeam.id, chatInput[selectedTeam.id] || '');
                  }
                }}
                placeholder="Nachricht schreiben..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#020617',
                  border: '1px solid #1f2937',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              />
              <button
                onClick={() => sendTeamMessage(selectedTeam.id, chatInput[selectedTeam.id] || '')}
                style={{
                  padding: '12px 24px',
                  background: '#6366f1',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Senden
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        width: '100%',
        maxWidth: '1000px',
      }}
    >
      {/* Teams-Übersicht */}
      <div
        style={{
          background: '#111827',
          borderRadius: '12px',
          border: '1px solid #1f2937',
          padding: '20px',
        }}
      >
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>Meine Teams</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {teams.length === 0 ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              Noch keine Teams. Erstelle dein erstes Team!
            </div>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #1f2937',
                  background: '#020617',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = team.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                }}
              >
                {onDeleteTeam && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'rgba(239,68,68,0.15)',
                      color: '#fecaca',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTeam(team.id);
                    }}
                  >
                    ×
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: team.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#e5e7eb',
                        marginBottom: '2px',
                      }}
                    >
                      {team.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                      }}
                    >
                      {team.memberIds?.length || team.members} Mitglieder
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    marginTop: '4px',
                  }}
                >
                  Letzte Aktivität: {team.recentActivity}
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={onAddTeam}
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #374151',
            background: '#020617',
            color: '#e5e7eb',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          + Neues Team erstellen
        </button>
      </div>

      {/* Team-Mitglieder Übersicht */}
      <div
        style={{
          background: '#111827',
          borderRadius: '12px',
          border: '1px solid #1f2937',
          padding: '20px',
        }}
      >
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>Verfügbare Mitglieder</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {availableMembers.map((member) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #1f2937',
                background: '#020617',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  position: 'relative',
                }}
              >
                {member.name.charAt(0)}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid #020617',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#e5e7eb',
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  {member.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardTeams;
