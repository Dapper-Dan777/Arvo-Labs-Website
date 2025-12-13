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

  // Mail States
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendingMail, setSendingMail] = useState(false);
  const [mailResult, setMailResult] = useState('');
  const [mailError, setMailError] = useState(false);

  // Goals States
  const [goals, setGoals] = useState<any[]>([]);

  // Timesheets States
  const [timesheetEntries, setTimesheetEntries] = useState<any[]>([]);

  // Guard: Prüfe, ob User Pro-Plan hat (oder Admin ist)
  useEffect(() => {
    if (isLoaded && user) {
      const plan = getUserPlan(user);
      const userIsAdmin = checkIsAdmin(user);
      
      // Admins haben Zugriff auf alle Dashboards
      if (userIsAdmin) {
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

  const handleChatSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsThinking(true);

    // TODO: Hier Chat-Logik einbinden
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'Dies ist eine Beispiel-Antwort. Die Chat-Funktion wird noch implementiert.', isUser: false },
      ]);
      setIsThinking(false);
    }, 1000);
  };

  const handleDocRequest = async () => {
    // TODO: Implementiere Dokumenten-Logik
    setDocThinking(true);
    setTimeout(() => {
      setDocAnswer('Dokumenten-Funktion wird noch implementiert.');
      setDocThinking(false);
    }, 1000);
  };

  const handleSendMail = async () => {
    // TODO: Implementiere Mail-Logik
    setSendingMail(true);
    setTimeout(() => {
      setMailResult('Mail-Funktion wird noch implementiert.');
      setSendingMail(false);
    }, 1000);
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
          onFileChange={() => {}}
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
          goals={goals}
          onAddGoal={() => {}}
          onDeleteGoal={() => {}}
          onToggleStatus={() => {}}
          user={user}
        />
      ) : activeMenu === MENUS.TIMESHEETS ? (
        <DashboardTimesheets
          entries={timesheetEntries}
          onAddEntry={() => {}}
          onDeleteEntry={() => {}}
          onToggleStatus={() => {}}
          user={user}
        />
      ) : activeMenu === MENUS.MORE ? (
        <DashboardMore user={user} onUserUpdate={() => {}} />
      ) : (
        <div>Bereich wird geladen...</div>
      )}
    </DashboardLayout>
  );
}
