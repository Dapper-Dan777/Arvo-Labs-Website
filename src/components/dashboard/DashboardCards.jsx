import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function DashboardCards({ user, onCardClick, isCardsPage = false }) {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableCards, setAvailableCards] = useState([
    {
      id: 'workflow-overview',
      title: 'Workflow-Übersicht',
      description: 'Schneller Zugriff auf alle deine aktiven Workflows',
      icon: '⚡',
      color: '#6366f1',
      link: 'Startseite',
      category: 'Produktivität',
    },
    {
      id: 'quick-stats',
      title: 'Schnellstatistiken',
      description: 'Wichtige Kennzahlen auf einen Blick',
      icon: '📊',
      color: '#10b981',
      link: 'Dashboards',
      category: 'Analytics',
    },
    {
      id: 'recent-activity',
      title: 'Letzte Aktivitäten',
      description: 'Übersicht über deine letzten Aktionen',
      icon: '🕐',
      color: '#f59e0b',
      link: 'Posteingang',
      category: 'Übersicht',
    },
    {
      id: 'team-collaboration',
      title: 'Team-Zusammenarbeit',
      description: 'Direkter Zugriff auf Teams und Kollaboration',
      icon: '👥',
      color: '#8b5cf6',
      link: 'Teams',
      category: 'Kollaboration',
    },
    {
      id: 'automation-insights',
      title: 'Automatisierungs-Insights',
      description: 'Zeitersparnis und Effizienz-Metriken',
      icon: '🤖',
      color: '#ec4899',
      link: 'Dashboards',
      category: 'Analytics',
    },
    {
      id: 'quick-actions',
      title: 'Schnellaktionen',
      description: 'Häufig genutzte Funktionen schnell erreichen',
      icon: '🚀',
      color: '#06b6d4',
      link: 'Startseite',
      category: 'Produktivität',
    },
    {
      id: 'goals-progress',
      title: 'Ziele & Fortschritt',
      description: 'Verfolge deine Ziele und Meilensteine',
      icon: '🎯',
      color: '#14b8a6',
      link: 'Ziele',
      category: 'Ziele',
    },
    {
      id: 'document-center',
      title: 'Dokumenten-Center',
      description: 'Zugriff auf wichtige Dokumente und Analysen',
      icon: '📄',
      color: '#f97316',
      link: 'Dokumente',
      category: 'Dokumente',
    },
    {
      id: 'ai-assistant',
      title: 'KI-Assistent',
      description: 'Direkter Zugriff auf den Arvo Assistant',
      icon: '💬',
      color: '#6366f1',
      link: 'Chat',
      category: 'KI',
    },
    {
      id: 'time-tracking',
      title: 'Zeiterfassung',
      description: 'Übersicht über deine Zeiterfassung',
      icon: '⏱️',
      color: '#3b82f6',
      link: 'Timesheets',
      category: 'Zeit',
    },
  ]);

  useEffect(() => {
    loadCards();
  }, [user]);

  const loadCards = async () => {
    if (!user) return;
    
    try {
      // Versuche aus Supabase zu laden
      const { data, error } = await supabase
        .from('user_dashboard_cards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Falls Tabelle nicht existiert, nutze localStorage
        const saved = localStorage.getItem(`dashboard_cards_${user.id}`);
        if (saved) {
          setCards(JSON.parse(saved));
        } else {
          // Standard-Karten
          setCards([
            availableCards[0], // Workflow-Übersicht
            availableCards[1], // Schnellstatistiken
            availableCards[2], // Letzte Aktivitäten
          ]);
        }
      } else if (data && data.cards) {
        setCards(data.cards);
      } else {
        // Standard-Karten
        const defaultCards = [
          availableCards[0],
          availableCards[1],
          availableCards[2],
        ];
        setCards(defaultCards);
        saveCards(defaultCards);
      }
    } catch (err) {
      // Fallback zu localStorage
      const saved = localStorage.getItem(`dashboard_cards_${user?.id}`);
      if (saved) {
        setCards(JSON.parse(saved));
      } else {
        setCards([
          availableCards[0],
          availableCards[1],
          availableCards[2],
        ]);
      }
    }
  };

  const saveCards = async (cardsToSave) => {
    if (!user) return;
    
    try {
      // Versuche in Supabase zu speichern
      const { error } = await supabase
        .from('user_dashboard_cards')
        .upsert({
          user_id: user.id,
          cards: cardsToSave,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        // Fallback zu localStorage
        localStorage.setItem(`dashboard_cards_${user.id}`, JSON.stringify(cardsToSave));
      }
    } catch (err) {
      // Fallback zu localStorage
      localStorage.setItem(`dashboard_cards_${user.id}`, JSON.stringify(cardsToSave));
    }
  };

  const addCard = (card) => {
    if (cards.find((c) => c.id === card.id)) {
      return; // Karte bereits vorhanden
    }
    const newCards = [...cards, card];
    setCards(newCards);
    saveCards(newCards);
  };

  const removeCard = (cardId) => {
    const newCards = cards.filter((c) => c.id !== cardId);
    setCards(newCards);
    saveCards(newCards);
  };

  const handleCardClick = (card) => {
    if (onCardClick) {
      onCardClick(card.link);
    }
  };

  if (showModal) {
    const unusedCards = availableCards.filter(
      (card) => !cards.find((c) => c.id === card.id)
    );

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
        onClick={() => setShowModal(false)}
      >
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '24px', margin: 0, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Dashboard-Karten verwalten
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                Passe dein Dashboard an, indem du Karten hinzufügst oder entfernst
              </p>
            </div>
            <button
              className="dashboard-btn"
              onClick={() => setShowModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-soft)';
                e.target.style.color = 'var(--primary)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--text-muted)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          </div>

          {/* Aktive Karten */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Aktive Karten ({cards.length})
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <button
                    className="dashboard-btn"
                    onClick={() => removeCard(card.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239,68,68,0.2)',
                      border: 'none',
                      color: '#f87171',
                      borderRadius: '6px',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Karte entfernen"
                  >
                    ×
                  </button>
                  <div
                    style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}
                  >
                    {card.icon}
                  </div>
                  <h4 style={{ fontSize: '14px', margin: '0 0 4px 0', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {card.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: '1.4',
                    }}
                  >
                    {card.description}
                  </p>
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '4px 8px',
                      background: `rgba(${card.color === '#6366f1' ? '99,102,241' : card.color === '#10b981' ? '16,185,129' : '245,158,11'},0.1)`,
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: card.color,
                      display: 'inline-block',
                    }}
                  >
                    → {card.link}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verfügbare Karten */}
          {unusedCards.length > 0 && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Verfügbare Karten hinzufügen
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                {unusedCards.map((card) => (
                  <div
                    key={card.id}
                    className="dashboard-card"
                    onClick={() => addCard(card)}
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = card.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        fontSize: '32px',
                        marginBottom: '8px',
                      }}
                    >
                      {card.icon}
                    </div>
                    <h4 style={{ fontSize: '14px', margin: '0 0 4px 0', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {card.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        margin: 0,
                        lineHeight: '1.4',
                      }}
                    >
                      {card.description}
                    </p>
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        background: `rgba(${card.color === '#6366f1' ? '99,102,241' : card.color === '#10b981' ? '16,185,129' : '245,158,11'},0.1)`,
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: card.color,
                        display: 'inline-block',
                      }}
                    >
                      + Hinzufügen
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unusedCards.length === 0 && (
            <div
              style={{
                padding: '24px',
                background: 'var(--primary-soft)',
                borderRadius: '12px',
                border: '1px solid var(--primary)',
                textAlign: 'center',
                transition: 'background-color 0.3s ease, border-color 0.3s ease',
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                Alle verfügbaren Karten sind bereits zu deinem Dashboard hinzugefügt.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Fixierter Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexShrink: 0,
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)' }}>Meine Dashboard-Karten</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Schneller Zugriff auf deine wichtigsten Bereiche
          </p>
        </div>
        <button
          className="dashboard-btn"
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            border: 'none',
            color: 'var(--bg-body)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
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
      </div>

      {/* Scrollbarer Container für Karten */}
      <div
        className="dashboard-cards-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          minHeight: 0,
        }}
      >
        {cards.length === 0 ? (
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Noch keine Karten hinzugefügt
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Füge Karten hinzu, um schnellen Zugriff auf wichtige Bereiche zu haben.
            </p>
            <button
              className="dashboard-btn"
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                border: 'none',
                color: 'var(--bg-body)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              Erste Karte hinzufügen
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              paddingBottom: '20px',
            }}
          >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="dashboard-card"
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = card.color;
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(${card.color === '#6366f1' ? '99,102,241' : card.color === '#10b981' ? '16,185,129' : '245,158,11'},0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${card.color}20, transparent)`,
                  borderRadius: '50%',
                  transform: 'translate(30%, -30%)',
                }}
              />
              
              <div
                style={{
                  fontSize: '40px',
                  marginBottom: '12px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  margin: '0 0 8px 0',
                  fontWeight: 600,
                  position: 'relative',
                  zIndex: 1,
                  color: 'var(--text-primary)',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  margin: '0 0 16px 0',
                  lineHeight: '1.6',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {card.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: card.color,
                  fontSize: '13px',
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span>Zu {card.link} →</span>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCards;

