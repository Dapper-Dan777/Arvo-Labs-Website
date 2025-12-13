/**
 * Starter Dashboard
 * 
 * Einfaches Dashboard für Starter-Plan-User.
 * Fokus: Minimal, clean, klare Call-to-Action zum Upgrade.
 */

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/src/components/dashboard/DashboardLayout';
import DashboardChat from '@/src/components/dashboard/DashboardChat';
import { getUserPlan, isAdmin as checkIsAdmin } from '@/lib/plan-utils';

export default function StarterDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useState<HTMLTextAreaElement | null>(null);

  // Guard: Prüfe, ob User Starter-Plan hat (oder Admin ist)
  useEffect(() => {
    if (isLoaded && user) {
      const plan = getUserPlan(user);
      const userIsAdmin = checkIsAdmin(user);
      
      // Admins haben Zugriff auf alle Dashboards
      if (userIsAdmin) {
        return; // Admin kann bleiben
      }
      
      if (plan !== 'starter') {
        // User hat nicht den Starter-Plan → Redirect zu seinem Dashboard
        if (plan === 'pro') {
          router.push('/dashboard/pro');
        } else if (plan === 'individual') {
          router.push('/dashboard/individual');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <div>Laden...</div>;
  }

  if (!user) {
    return null;
  }

  /**
   * Chat-Handler: Sendet Nachricht an OpenAI API Route
   * 
   * Verwendet die neue /api/chat Route.
   * Zeigt Loading-State und Fehlerbehandlung.
   */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsThinking(true);

    try {
      console.log('[Chat] Sende Nachricht an OpenAI API:', { prompt: userMessage });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          action: 'default',
        }),
      });

      console.log('[Chat] API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error('[Chat] API Fehler:', {
          status: response.status,
          error: errorMessage,
        });

        setMessages((prev) => [
          ...prev,
          { 
            text: `Fehler: ${errorMessage}`, 
            isUser: false 
          },
        ]);
        return;
      }

      const data = await response.json();
      console.log('[Chat] API Antwort erhalten:', {
        success: data.success,
        responseLength: data.response?.length,
      });

      if (!data.success) {
        const errorMessage = data.error || 'Keine Antwort erhalten.';
        console.error('[Chat] API Fehler in Response:', errorMessage);
        
        setMessages((prev) => [
          ...prev,
          { text: `Fehler: ${errorMessage}`, isUser: false },
        ]);
        return;
      }

      if (!data.response) {
        console.error('[Chat] Keine Antwort in Response-Daten');
        setMessages((prev) => [
          ...prev,
          { text: 'Keine Antwort erhalten. Bitte versuche es erneut.', isUser: false },
        ]);
        return;
      }

      // Erfolgreiche Antwort hinzufügen
      setMessages((prev) => [
        ...prev,
        { text: data.response, isUser: false },
      ]);
    } catch (err) {
      console.error('[Chat] Netzwerkfehler:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Netzwerkfehler beim Senden der Nachricht.';
      
      setMessages((prev) => [
        ...prev,
        { text: `Fehler: ${errorMessage}`, isUser: false },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <DashboardLayout
      user={user}
      activeMenu="Chat"
      setActiveMenu={() => {}}
      onLogout={() => router.push('/sign-in')}
      onManageCards={() => {}}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
        {/* Chat-Bereich */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>
            Chat
          </h2>
          <DashboardChat
            input={input}
            setInput={setInput}
            inputRef={inputRef[0]}
            messages={messages}
            isThinking={isThinking}
            onSend={handleSend}
            formatMessage={(text: string) => text}
          />
        </div>

        {/* Upgrade-Teaser */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
            Mehr Funktionen mit Pro oder Individuell
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            Upgrade auf Pro für Dokumente, Mail, Ziele, Timesheets und mehr.
            Oder wähle Individuell für das vollständige Feature-Set.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              href="/preise"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-block',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
