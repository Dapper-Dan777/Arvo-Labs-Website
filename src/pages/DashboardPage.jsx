import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../App.css';
import DashboardChat from '../components/dashboard/DashboardChat';
import DashboardDocs from '../components/dashboard/DashboardDocs';
import DashboardMail from '../components/dashboard/DashboardMail';
import DashboardHome from '../components/dashboard/DashboardHome';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardInbox from '../components/dashboard/DashboardInbox';
import DashboardTeams from '../components/dashboard/DashboardTeams';
import DashboardDashboards from '../components/dashboard/DashboardDashboards';
import DashboardWhiteboards from '../components/dashboard/DashboardWhiteboards';
import DashboardForms from '../components/dashboard/DashboardForms';
import DashboardGoals from '../components/dashboard/DashboardGoals';
import DashboardTimesheets from '../components/dashboard/DashboardTimesheets';
import DashboardMore from '../components/dashboard/DashboardMore';
import DashboardCards from '../components/dashboard/DashboardCards';

function DashboardPage() {
  const navigate = useNavigate();
  const MENUS = {
    HOME: 'Startseite',
    INBOX: 'Posteingang',
    CHAT: 'Chat',
    TEAMS: 'Teams',
    DOCS: 'Dokumente',
    DASHBOARDS: 'Dashboards',
    WHITEBOARDS: 'Whiteboards',
    FORMS: 'Formulare',
    MAIL: 'Mail',
    GOALS: 'Ziele',
    TIMESHEETS: 'Timesheets',
    MORE: 'Mehr',
  };
  // 🔹 States für Dokumente
  const [docAction, setDocAction] = useState('summary');
  const [docPrompt, setDocPrompt] = useState('');
  const [docAnswer, setDocAnswer] = useState('');
  const [docThinking, setDocThinking] = useState(false);
  const [docFilePath, setDocFilePath] = useState(null);

  // 🔹 States für normalen Chat / Dashboard
  const [isThinking, setIsThinking] = useState(false);
  const [user, setUser] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(MENUS.HOME); // NEU, einzige Zeile
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showCardsManager, setShowCardsManager] = useState(false);

  const inputRef = useRef(null);

  // 🔹 States für Mail
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendingMail, setSendingMail] = useState(false);
  const [mailResult, setMailResult] = useState('');
  const [mailError, setMailError] = useState(false);

  // 🔹 States für Goals
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Q1 Automatisierungsziele erreichen',
      progress: 85,
      deadline: '31. März 2025',
      status: 'on-track',
      tasks: [
        { name: 'E-Mail-Automatisierung implementieren', completed: true },
        { name: 'Workflow-Templates erstellen', completed: true },
        { name: 'Team-Schulungen durchführen', completed: false },
      ],
    },
    {
      id: 2,
      title: 'Kundenzufriedenheit steigern',
      progress: 62,
      deadline: '15. April 2025',
      status: 'on-track',
      tasks: [
        { name: 'Feedback-System einführen', completed: true },
        { name: 'Response-Zeit optimieren', completed: false },
        { name: 'Support-Prozesse automatisieren', completed: false },
      ],
    },
  ]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  // 🔹 States für Teams
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Entwicklung',
      members: 8,
      color: '#6366f1',
      recentActivity: 'Vor 2 Stunden',
    },
    {
      id: 2,
      name: 'Marketing',
      members: 5,
      color: '#10b981',
      recentActivity: 'Vor 5 Stunden',
    },
  ]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminTimesheets, setShowAdminTimesheets] = useState(false);

  // 🔹 States für Dashboards
  const [dashboards, setDashboards] = useState([
    {
      id: 1,
      name: 'Workflow-Übersicht',
      description: 'Alle aktiven Workflows im Überblick',
      metrics: [
        { label: 'Aktive Workflows', value: '12', change: '+3' },
        { label: 'Tasks heute', value: '47', change: '+12' },
        { label: 'Erfolgsrate', value: '98%', change: '+2%' },
      ],
      lastUpdated: 'Vor 5 Minuten',
    },
    {
      id: 2,
      name: 'Team-Performance',
      description: 'Produktivitäts-Metriken deines Teams',
      metrics: [
        { label: 'Automatisierte Tasks', value: '1.2k', change: '+156' },
        { label: 'Zeitersparnis', value: '42h', change: '+8h' },
        { label: 'Aktivität', value: '87%', change: '+5%' },
      ],
      lastUpdated: 'Vor 15 Minuten',
    },
  ]);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardDesc, setNewDashboardDesc] = useState('');

  // 🔹 States für Whiteboards
  const [whiteboards, setWhiteboards] = useState([
    {
      id: 1,
      name: 'Produkt-Roadmap Q2',
      lastEdited: 'Vor 2 Stunden',
      collaborators: 3,
      color: '#6366f1',
    },
    {
      id: 2,
      name: 'Workflow-Ideen',
      lastEdited: 'Gestern',
      collaborators: 5,
      color: '#10b981',
    },
  ]);
  const [showWhiteboardModal, setShowWhiteboardModal] = useState(false);
  const [newWhiteboardName, setNewWhiteboardName] = useState('');

  // 🔹 States für Forms
  const [forms, setForms] = useState([
    {
      id: 1,
      name: 'Kunden-Feedback',
      responses: 47,
      status: 'aktiv',
      lastResponse: 'Vor 2 Stunden',
    },
    {
      id: 2,
      name: 'Onboarding-Umfrage',
      responses: 23,
      status: 'aktiv',
      lastResponse: 'Gestern',
    },
  ]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [newFormName, setNewFormName] = useState('');

  // 🔹 States für Timesheets
  const [timesheetEntries, setTimesheetEntries] = useState([
    {
      id: 1,
      project: 'Workflow-Automatisierung',
      task: 'E-Mail-Integration entwickeln',
      date: new Date().toLocaleDateString('de-DE'),
      hours: 4.5,
      status: 'laufend',
      userId: user?.id,
      userName: user?.user_metadata?.full_name || user?.email,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      project: 'Kunden-Support',
      task: 'Onboarding neuer Kunden',
      date: new Date().toLocaleDateString('de-DE'),
      hours: 2.0,
      status: 'abgeschlossen',
      userId: user?.id,
      userName: user?.user_metadata?.full_name || user?.email,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [newEntryProject, setNewEntryProject] = useState('');
  const [newEntryTask, setNewEntryTask] = useState('');
  const [newEntryHours, setNewEntryHours] = useState('');
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);

  const formatMessage = (text) => {
    let t = text.replace(/^\s*\*\s+/gm, '• ');
    t = t.replace(/\*\*(.+?)\*\*/g, '$1');
    return t;
  };

  const handleDocRequest = async () => {
    if (!docAction && !docPrompt.trim()) return;
    setDocThinking(true);
    setDocAnswer('');

    try {
      const response = await fetch(SUPABASE_DOCS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: docAction, // 'summary' | 'keypoints' | 'qa'
          prompt: docPrompt, // deine eigene Anforderung
          filePath: docFilePath,
        }),
      }); // ⬅ genau EINE schließende Klammer + Semikolon hier

      if (!response.ok) {
        const errorText = await response.text();
        setDocAnswer(`Fehler von der API: ${errorText}`);
        return;
      }

      const data = await response.json();
      setDocAnswer(data.answer || 'Keine Antwort erhalten.');
    } catch (err) {
      setDocAnswer(`Netzwerkfehler: ${String(err)}`);
    } finally {
      setDocThinking(false);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('documents') // Bucket-Name
      .upload(fileName, file);

    if (error) {
      setDocAnswer(`Upload-Fehler: ${error.message}`);
      return;
    }

    setDocFilePath(data.path); // Pfad für Edge Function merken
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const response = await supabase.auth.getSession();
    const session = response.data.session;
    if (!session) {
      navigate('/');
      return;
    }
    setUser(session.user);
    
    // Prüfe ob User Admin ist (aus user_metadata)
    const userIsAdmin = session.user.user_metadata?.is_admin === true || 
                       session.user.email?.includes('admin') ||
                       session.user.email === 'admin@arvo-labs.com';
    setIsAdmin(userIsAdmin);
    
    // Lade alle Zeiterfassungen für Admin
    if (userIsAdmin) {
      // Hier könntest du alle Einträge aus Supabase laden
    }
    
    await loadWorkflows(session.user.id);
    setLoading(false);
  };

  const loadWorkflows = async (userId) => {
    const { data } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setWorkflows(data || []);
  };

  const addWorkflow = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await supabase
      .from('workflows')
      .insert([{ user_id: user.id, title, status: 'active' }])
      .select();
    if (data) {
      setWorkflows([data[0], ...workflows]);
      setTitle('');
    }
  };

  const SUPABASE_CHAT_URL =
    'https://cywpgkrahaioosmewpms.supabase.co/functions/v1/openai-chat';

  const SUPABASE_DOCS_URL =
    'https://cywpgkrahaioosmewpms.supabase.co/functions/v1/openai-docs';

  const SUPABASE_MAIL_URL =
    'https://cywpgkrahaioosmewpms.supabase.co/functions/v1/send-mail';

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    const message = input;
    setInput('');

    try {
      setIsThinking(true);

      const response = await fetch(SUPABASE_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessages((prev) => [
          ...prev,
          { text: `Fehler von der API: ${errorText}`, isUser: false },
        ]);
        return;
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: data.message || 'Keine Antwort erhalten.', isUser: false },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: `Netzwerkfehler: ${String(err)}`, isUser: false },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMail = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) return;

    setSendingMail(true);
    setMailResult('');
    setMailError(false);

    try {
      const res = await fetch(SUPABASE_MAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMailResult(`Fehler beim Senden: ${text}`);
        setMailError(true);
        return;
      }

      setMailResult('E-Mail erfolgreich gesendet.');
      setTo('');
      setSubject('');
      setBody('');
    } catch (err) {
      setMailResult(`Netzwerkfehler: ${String(err)}`);
      setMailError(true);
    } finally {
      setSendingMail(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // 🔹 CRUD-Funktionen für Goals
  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      progress: 0,
      deadline: newGoalDeadline || 'Keine Frist',
      status: 'on-track',
      tasks: [],
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDeadline('');
    setShowGoalModal(false);
  };

  const updateGoalProgress = (goalId, progress) => {
    setGoals(goals.map((g) => (g.id === goalId ? { ...g, progress } : g)));
  };

  const toggleGoalTask = (goalId, taskIndex) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = [...goal.tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            completed: !updatedTasks[taskIndex].completed,
          };
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const progress = updatedTasks.length > 0
            ? Math.round((completedCount / updatedTasks.length) * 100)
            : 0;
          return { ...goal, tasks: updatedTasks, progress };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  // 🔹 CRUD-Funktionen für Teams
  const addTeam = () => {
    if (!newTeamName.trim()) return;
    if (selectedTeamMembers.length === 0) {
      alert('Bitte wähle mindestens ein Teammitglied aus.');
      return;
    }
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const newTeam = {
      id: Date.now(),
      name: newTeamName,
      members: selectedTeamMembers.length,
      memberIds: selectedTeamMembers,
      color: colors[teams.length % colors.length],
      recentActivity: 'Gerade eben',
    };
    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setSelectedTeamMembers([]);
    setShowTeamModal(false);
  };

  const deleteTeam = (teamId) => {
    setTeams(teams.filter((t) => t.id !== teamId));
  };

  // 🔹 CRUD-Funktionen für Dashboards
  const addDashboard = () => {
    if (!newDashboardName.trim()) return;
    const newDashboard = {
      id: Date.now(),
      name: newDashboardName,
      description: newDashboardDesc || 'Neues Dashboard',
      metrics: [
        { label: 'Metrik 1', value: '0', change: '+0' },
        { label: 'Metrik 2', value: '0', change: '+0' },
        { label: 'Metrik 3', value: '0', change: '+0' },
      ],
      lastUpdated: 'Gerade eben',
    };
    setDashboards([...dashboards, newDashboard]);
    setNewDashboardName('');
    setNewDashboardDesc('');
    setShowDashboardModal(false);
  };

  const deleteDashboard = (dashboardId) => {
    setDashboards(dashboards.filter((d) => d.id !== dashboardId));
  };

  // 🔹 CRUD-Funktionen für Whiteboards
  const addWhiteboard = () => {
    if (!newWhiteboardName.trim()) return;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
    const newWhiteboard = {
      id: Date.now(),
      name: newWhiteboardName,
      lastEdited: 'Gerade eben',
      collaborators: 1,
      color: colors[whiteboards.length % colors.length],
    };
    setWhiteboards([...whiteboards, newWhiteboard]);
    setNewWhiteboardName('');
    setShowWhiteboardModal(false);
  };

  const deleteWhiteboard = (whiteboardId) => {
    setWhiteboards(whiteboards.filter((w) => w.id !== whiteboardId));
  };

  // 🔹 CRUD-Funktionen für Forms
  const addForm = () => {
    if (!newFormName.trim()) return;
    const newForm = {
      id: Date.now(),
      name: newFormName,
      responses: 0,
      status: 'aktiv',
      lastResponse: 'Noch keine Antworten',
    };
    setForms([...forms, newForm]);
    setNewFormName('');
    setShowFormModal(false);
  };

  const deleteForm = (formId) => {
    setForms(forms.filter((f) => f.id !== formId));
  };

  // 🔹 CRUD-Funktionen für Timesheets
  const addTimesheetEntry = () => {
    if (!newEntryProject.trim() || !newEntryTask.trim() || !newEntryHours) return;
    const entryDate = new Date(newEntryDate);
    const newEntry = {
      id: Date.now(),
      project: newEntryProject,
      task: newEntryTask,
      date: entryDate.toLocaleDateString('de-DE'),
      hours: parseFloat(newEntryHours) || 0,
      status: 'laufend',
      userId: user?.id,
      userName: user?.user_metadata?.full_name || user?.email,
      created_at: entryDate.toISOString(),
    };
    setTimesheetEntries([...timesheetEntries, newEntry]);
    setNewEntryProject('');
    setNewEntryTask('');
    setNewEntryHours('');
    setNewEntryDate(new Date().toISOString().split('T')[0]);
    setShowTimesheetModal(false);
  };

  const deleteTimesheetEntry = (entryId) => {
    setTimesheetEntries(timesheetEntries.filter((e) => e.id !== entryId));
  };

  const toggleTimesheetStatus = (entryId) => {
    setTimesheetEntries(
      timesheetEntries.map((e) =>
        e.id === entryId
          ? { ...e, status: e.status === 'laufend' ? 'abgeschlossen' : 'laufend' }
          : e
      )
    );
  };

  if (loading)
    return <div style={{ padding: '40px', color: '#fff' }}>Laden...</div>;

  const handleCardClick = (link) => {
    // Konvertiere Link zu Menu-Name
    const menuMap = {
      'Startseite': MENUS.HOME,
      'Dashboards': MENUS.DASHBOARDS,
      'Posteingang': MENUS.INBOX,
      'Teams': MENUS.TEAMS,
      'Ziele': MENUS.GOALS,
      'Dokumente': MENUS.DOCS,
      'Chat': MENUS.CHAT,
      'Timesheets': MENUS.TIMESHEETS,
    };
    if (menuMap[link]) {
      setActiveMenu(menuMap[link]);
      setShowCardsManager(false);
    }
  };

  const handleManageCards = () => {
    setShowCardsManager(true);
    setActiveMenu('Karten');
  };

  return (
    <DashboardLayout
      user={user}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      onLogout={logout}
      onManageCards={handleManageCards}
    >
      {activeMenu === 'Chat' ? (
        <DashboardChat
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          messages={messages}
          isThinking={isThinking}
          onSend={handleSend}
          formatMessage={formatMessage}
        />
      ) : activeMenu === 'Mail' ? (
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
      ) : activeMenu === 'Dokumente' ? (
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
      ) : activeMenu === 'Startseite' ? (
        <DashboardHome user={user} workflows={workflows} />
      ) : activeMenu === 'Posteingang' ? (
        <DashboardInbox />
      ) : activeMenu === 'Teams' ? (
        <DashboardTeams
          teams={teams}
          onAddTeam={() => setShowTeamModal(true)}
          onDeleteTeam={deleteTeam}
          user={user}
          allUsers={[
            { id: user?.id, name: user?.user_metadata?.full_name || user?.email, email: user?.email },
            { id: 'user2', name: 'Max Mustermann', email: 'max@example.com' },
            { id: 'user3', name: 'Sarah Schmidt', email: 'sarah@example.com' },
            { id: 'user4', name: 'Thomas Weber', email: 'thomas@example.com' },
          ]}
        />
      ) : activeMenu === 'Dashboards' ? (
        <DashboardDashboards
          dashboards={dashboards}
          onAddDashboard={() => setShowDashboardModal(true)}
          onDeleteDashboard={deleteDashboard}
        />
      ) : activeMenu === 'Whiteboards' ? (
        <DashboardWhiteboards
          whiteboards={whiteboards}
          onAddWhiteboard={() => setShowWhiteboardModal(true)}
          onDeleteWhiteboard={deleteWhiteboard}
        />
      ) : activeMenu === 'Formulare' ? (
        <DashboardForms
          forms={forms}
          onAddForm={() => setShowFormModal(true)}
          onDeleteForm={deleteForm}
        />
      ) : activeMenu === 'Ziele' ? (
        <DashboardGoals
          goals={goals}
          onAddGoal={() => setShowGoalModal(true)}
          onToggleTask={toggleGoalTask}
          onDeleteGoal={deleteGoal}
        />
      ) : activeMenu === 'Timesheets' ? (
        <DashboardTimesheets
          entries={timesheetEntries}
          onAddEntry={() => setShowTimesheetModal(true)}
          onDeleteEntry={deleteTimesheetEntry}
          onToggleStatus={toggleTimesheetStatus}
          user={user}
          isAdmin={isAdmin && showAdminTimesheets}
          onToggleAdmin={() => setShowAdminTimesheets(!showAdminTimesheets)}
        />
      ) : activeMenu === 'Mehr' ? (
        <DashboardMore user={user} onUserUpdate={checkUser} />
      ) : activeMenu === 'Karten' || showCardsManager ? (
        <DashboardCards user={user} onCardClick={handleCardClick} />
      ) : (
        <div
          style={{
            background: '#111827',
            borderRadius: '12px',
            padding: '32px 40px',
            maxWidth: '640px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid #1f2937',
          }}
        >
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
            {activeMenu}
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '16px',
            }}
          >
            {`Dieser Bereich ist aktuell ein Platzhalter für "${activeMenu}". Hier kannst du später eigene Widgets und Daten einfügen.`}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            Du kannst die Inhalte für jeden Menüpunkt Schritt für Schritt
            individuell gestalten.
          </p>
        </div>
      )}

      {/* Modals */}
      {/* Goal Modal */}
      {showGoalModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowGoalModal(false)}
        >
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #1f2937',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Neues Ziel erstellen</h2>
            <input
              type="text"
              placeholder="Ziel-Titel"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                marginBottom: '12px',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Frist (z.B. 31. März 2025)"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowGoalModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={addGoal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowTeamModal(false)}
        >
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #1f2937',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Neues Team erstellen</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                Team-Name
              </label>
              <input
                type="text"
                placeholder="z.B. Entwicklung, Marketing, Support"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', color: '#9ca3af', fontSize: '14px' }}>
                Teammitglieder auswählen
              </label>
              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #1f2937',
                  borderRadius: '8px',
                  padding: '8px',
                  background: '#020617',
                }}
              >
                {[
                  { id: user?.id, name: user?.user_metadata?.full_name || user?.email, email: user?.email },
                  { id: 'user2', name: 'Max Mustermann', email: 'max@example.com' },
                  { id: 'user3', name: 'Sarah Schmidt', email: 'sarah@example.com' },
                  { id: 'user4', name: 'Thomas Weber', email: 'thomas@example.com' },
                  { id: 'user5', name: 'Lisa Müller', email: 'lisa@example.com' },
                ].map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      if (selectedTeamMembers.includes(member.id)) {
                        setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== member.id));
                      } else {
                        setSelectedTeamMembers([...selectedTeamMembers, member.id]);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: selectedTeamMembers.includes(member.id) ? 'rgba(99,102,241,0.1)' : 'transparent',
                      border: selectedTeamMembers.includes(member.id) ? '1px solid #6366f1' : '1px solid transparent',
                      marginBottom: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: '2px solid #374151',
                        background: selectedTeamMembers.includes(member.id) ? '#6366f1' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    >
                      {selectedTeamMembers.includes(member.id) && '✓'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#e5e7eb' }}>{member.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{member.email}</div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedTeamMembers.length > 0 && (
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                  {selectedTeamMembers.length} Mitglieder ausgewählt
                </p>
              )}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowTeamModal(false);
                  setSelectedTeamMembers([]);
                  setNewTeamName('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={addTeam}
                disabled={selectedTeamMembers.length === 0}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedTeamMembers.length === 0 ? '#374151' : '#6366f1',
                  color: '#fff',
                  cursor: selectedTeamMembers.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: selectedTeamMembers.length === 0 ? 0.5 : 1,
                }}
              >
                Team erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Modal */}
      {showDashboardModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowDashboardModal(false)}
        >
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #1f2937',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Neues Dashboard erstellen</h2>
            <input
              type="text"
              placeholder="Dashboard-Name"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                marginBottom: '12px',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Beschreibung"
              value={newDashboardDesc}
              onChange={(e) => setNewDashboardDesc(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDashboardModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={addDashboard}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Whiteboard Modal */}
      {showWhiteboardModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowWhiteboardModal(false)}
        >
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #1f2937',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Neues Whiteboard erstellen</h2>
            <input
              type="text"
              placeholder="Whiteboard-Name"
              value={newWhiteboardName}
              onChange={(e) => setNewWhiteboardName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowWhiteboardModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={addWhiteboard}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowFormModal(false)}
        >
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #1f2937',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Neues Formular erstellen</h2>
            <input
              type="text"
              placeholder="Formular-Name"
              value={newFormName}
              onChange={(e) => setNewFormName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowFormModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={addForm}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Modal */}
      {showTimesheetModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowTimesheetModal(false)}
        >
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #1f2937',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Neuer Zeiterfassungs-Eintrag</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                Datum
              </label>
              <input
                type="date"
                value={newEntryDate}
                onChange={(e) => setNewEntryDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                Projekt
              </label>
              <input
                type="text"
                placeholder="z.B. Workflow-Automatisierung"
                value={newEntryProject}
                onChange={(e) => setNewEntryProject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                Aufgabe
              </label>
              <input
                type="text"
                placeholder="z.B. E-Mail-Integration entwickeln"
                value={newEntryTask}
                onChange={(e) => setNewEntryTask(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                Stunden
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="z.B. 4.5"
                value={newEntryHours}
                onChange={(e) => setNewEntryHours(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTimesheetModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #374151',
                  background: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={addTimesheetEntry}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
