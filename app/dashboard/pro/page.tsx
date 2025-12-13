/**
 * Pro Dashboard
 * 
 * Modernes Dashboard für Pro-Plan-User mit folgenden Bereichen:
 * - Chat
 * - Dokumente
 * - Mail
 * - Ziele
 * - Timesheets
 * - Mehr
 */

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/src/components/dashboard/DashboardLayout';
import DashboardChat from '@/src/components/dashboard/DashboardChat';
import DashboardDocs from '@/src/components/dashboard/DashboardDocs';
import DashboardMail from '@/src/components/dashboard/DashboardMail';
import DashboardGoals from '@/src/components/dashboard/DashboardGoals';
import DashboardTimesheets from '@/src/components/dashboard/DashboardTimesheets';
import DashboardMore from '@/src/components/dashboard/DashboardMore';
import { getUserPlan, isAdmin as checkIsAdmin } from '@/lib/plan-utils';

const MENUS = {
  CHAT: 'Chat',
  DOCS: 'Dokumente',
  MAIL: 'Mail',
  GOALS: 'Ziele',
  TIMESHEETS: 'Timesheets',
  MORE: 'Mehr',
};

export default function ProDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(MENUS.CHAT);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Chat States
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useState<HTMLTextAreaElement | null>(null);

  // Docs States
  const [docAction, setDocAction] = useState('summary');
  const [docPrompt, setDocPrompt] = useState('');
  const [docAnswer, setDocAnswer] = useState('');
  const [docThinking, setDocThinking] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docFileText, setDocFileText] = useState<string>('');

  // Mail States
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendingMail, setSendingMail] = useState(false);
  const [mailResult, setMailResult] = useState('');
  const [mailError, setMailError] = useState(false);

  // Goals States
  const [goals, setGoals] = useState<Array<{
    id: number;
    title: string;
    progress: number;
    deadline: string;
    status: string;
    tasks: Array<{ name: string; completed: boolean }>;
  }>>([]);

  // Timesheets States
  const [timesheetEntries, setTimesheetEntries] = useState<Array<{
    id: number;
    project: string;
    task: string;
    date: string;
    hours: number;
    status: string;
    userId: string | undefined;
    userName: string;
    created_at: string;
  }>>([]);

  // Guard: Prüfe, ob User Pro-Plan hat (oder Admin ist)
  useEffect(() => {
    if (isLoaded && user) {
      const plan = getUserPlan(user);
      const userIsAdminValue = checkIsAdmin(user);
      setUserIsAdmin(userIsAdminValue);
      
      // Admins haben Zugriff auf alle Dashboards
      if (userIsAdminValue) {
        return; // Admin kann bleiben
      }
      
      if (plan !== 'pro' && plan !== 'individual') {
        // User hat nicht den Pro-Plan → Redirect
        if (plan === 'starter') {
          router.push('/dashboard/starter');
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
  const handleChatSend = async () => {
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

  /**
   * Dokumente-Handler: Sendet Dokument und Anfrage an OpenAI API Route
   * 
   * Unterstützt Text-Dateien (.txt, .md). PDFs müssen zuerst konvertiert werden.
   */
  const handleDocRequest = async () => {
    if (!docAction && !docPrompt.trim() && !docFileText.trim()) {
      setDocAnswer('Bitte wähle eine Aktion, gib eine Anfrage ein oder lade ein Dokument hoch.');
      return;
    }

    setDocThinking(true);
    setDocAnswer('');

    try {
      // Bestimme die Action für die API
      let apiAction = docAction;
      if (docAction === 'qa' && !docFileText.trim()) {
        apiAction = 'default'; // Fallback wenn kein Dokument vorhanden
      }

      console.log('[Docs] Sende Anfrage an OpenAI API:', {
        action: apiAction,
        hasDocument: !!docFileText,
        promptLength: docPrompt.length,
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: docPrompt || 'Analysiere das Dokument.',
          action: apiAction,
          documentText: docFileText || undefined,
        }),
      });

      console.log('[Docs] API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error('[Docs] API Fehler:', {
          status: response.status,
          error: errorMessage,
        });

        setDocAnswer(`Fehler: ${errorMessage}`);
        return;
      }

      const data = await response.json();
      console.log('[Docs] API Antwort erhalten:', {
        success: data.success,
        responseLength: data.response?.length,
      });

      if (!data.success) {
        const errorMessage = data.error || 'Keine Antwort erhalten.';
        console.error('[Docs] API Fehler in Response:', errorMessage);
        setDocAnswer(`Fehler: ${errorMessage}`);
        return;
      }

      if (!data.response) {
        console.error('[Docs] Keine Antwort in Response-Daten');
        setDocAnswer('Keine Antwort erhalten. Bitte versuche es erneut.');
        return;
      }

      // Erfolgreiche Antwort setzen
      setDocAnswer(data.response);
    } catch (err) {
      console.error('[Docs] Netzwerkfehler:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Netzwerkfehler beim Verarbeiten des Dokuments.';
      setDocAnswer(`Fehler: ${errorMessage}`);
    } finally {
      setDocThinking(false);
    }
  };

  /**
   * File Change Handler: Liest Text-Dateien ein
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setDocFile(null);
      setDocFileText('');
      return;
    }

    setDocFile(file);

    // Nur Text-Dateien unterstützen (.txt, .md, .json, etc.)
    if (file.type.startsWith('text/') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.json')) {
      try {
        const text = await file.text();
        setDocFileText(text);
        console.log('[Docs] Datei eingelesen:', {
          fileName: file.name,
          fileSize: file.size,
          textLength: text.length,
        });
      } catch (err) {
        console.error('[Docs] Fehler beim Lesen der Datei:', err);
        setDocFileText('');
        alert('Fehler beim Lesen der Datei. Bitte verwende eine Text-Datei (.txt, .md, etc.).');
      }
    } else {
      setDocFileText('');
      alert('Bitte lade eine Text-Datei hoch (.txt, .md, .json). PDF-Unterstützung kommt bald.');
    }
  };

  /**
   * Mail-Handler: Generiert E-Mail mit OpenAI
   * 
   * Der Benutzer gibt Betreff und Inhalt ein, und die AI generiert eine professionelle E-Mail.
   */
  const handleSendMail = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setMailResult('Bitte fülle alle Felder aus.');
      setMailError(true);
      return;
    }

    setSendingMail(true);
    setMailResult('');
    setMailError(false);

    try {
      // Erstelle Prompt für Mail-Generierung
      const mailPrompt = `Erstelle eine professionelle E-Mail mit folgenden Details:
- An: ${to}
- Betreff: ${subject}
- Inhalt/Anfrage: ${body}

Die E-Mail sollte professionell, höflich und klar formuliert sein.`;

      console.log('[Mail] Sende Mail-Generierungsanfrage an OpenAI API');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: mailPrompt,
          action: 'mail',
        }),
      });

      console.log('[Mail] API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error('[Mail] API Fehler:', {
          status: response.status,
          error: errorMessage,
        });

        setMailResult(`Fehler: ${errorMessage}`);
        setMailError(true);
        return;
      }

      const data = await response.json();
      console.log('[Mail] API Antwort erhalten:', {
        success: data.success,
        responseLength: data.response?.length,
      });

      if (!data.success) {
        const errorMessage = data.error || 'Keine Antwort erhalten.';
        console.error('[Mail] API Fehler in Response:', errorMessage);
        setMailResult(`Fehler: ${errorMessage}`);
        setMailError(true);
        return;
      }

      if (!data.response) {
        console.error('[Mail] Keine Antwort in Response-Daten');
        setMailResult('Keine Antwort erhalten. Bitte versuche es erneut.');
        setMailError(true);
        return;
      }

      // Erfolgreiche Mail-Generierung
      setMailResult(`E-Mail generiert:\n\n${data.response}\n\nHinweis: Die E-Mail wurde generiert, aber noch nicht gesendet. Kopiere den Text und sende ihn manuell.`);
      setMailError(false);
      
      // Optional: Felder leeren
      // setTo('');
      // setSubject('');
      // setBody('');
    } catch (err) {
      console.error('[Mail] Netzwerkfehler:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Netzwerkfehler beim Generieren der E-Mail.';
      setMailResult(`Fehler: ${errorMessage}`);
      setMailError(true);
    } finally {
      setSendingMail(false);
    }
  };

  // Handler für Karten-Management (wird im Pro-Dashboard nicht verwendet, aber für Layout erforderlich)
  const handleManageCards = () => {
    // Pro-Dashboard hat kein Karten-Management
  };

  return (
    <DashboardLayout
      user={user}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      onLogout={() => router.push('/sign-in')}
      onManageCards={handleManageCards}
    >
      {activeMenu === MENUS.CHAT ? (
        <DashboardChat
          input={input}
          setInput={setInput}
          inputRef={inputRef[0]}
          messages={messages}
          isThinking={isThinking}
          onSend={handleChatSend}
          formatMessage={(text: string) => text}
        />
      ) : activeMenu === MENUS.DOCS ? (
        <DashboardDocs
          docAction={docAction}
          docPrompt={docPrompt}
          docAnswer={docAnswer}
          docThinking={docThinking}
          onChangeAction={setDocAction}
          onChangePrompt={setDocPrompt}
          onSendRequest={handleDocRequest}
          onFileChange={handleFileChange}
        />
      ) : activeMenu === MENUS.MAIL ? (
        <DashboardMail
          to={to}
          subject={subject}
          body={body}
          sendingMail={sendingMail}
          mailResult={mailResult}
          mailError={mailError}
          setTo={setTo}
          setSubject={setSubject}
          setBody={setBody}
          onSendMail={handleSendMail}
        />
      ) : activeMenu === MENUS.GOALS ? (
        <DashboardGoals
          goals={goals as any}
          onAddGoal={() => {}}
          onDeleteGoal={() => {}}
          onToggleTask={() => {}}
        />
      ) : activeMenu === MENUS.TIMESHEETS ? (
        <DashboardTimesheets
          entries={timesheetEntries as any}
          onAddEntry={() => {}}
          onDeleteEntry={() => {}}
          onToggleStatus={() => {}}
          user={user}
          isAdmin={userIsAdmin}
          onToggleAdmin={() => {}}
        />
      ) : activeMenu === MENUS.MORE ? (
        <DashboardMore user={user} onUserUpdate={() => {}} />
      ) : (
        <div>Bereich wird geladen...</div>
      )}
    </DashboardLayout>
  );
}

