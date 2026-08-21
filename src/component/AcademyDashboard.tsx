import "../App.css";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  LogOut,
  PlayCircle,
  Plus,
  Save,
  Settings,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";
import { useState } from "react";
import type { AuthState } from "./Verticals";
import { AcademyFeedback } from "./AcademyFeedback";

type ProtectedData = {
  message?: string;
  total?: number;
  data?: unknown;
};

type AcademyDashboardProps = {
  auth: AuthState;
  protectedData: ProtectedData | null;
  error: string;
  successMessage: string;
  onLogout: () => void;
};

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

function LearnerDashboard({ auth, error, successMessage, onLogout }: AcademyDashboardProps) {
  type LearnerPanel = "live" | "recordings" | "plan" | "settings";
  const [isEditing, setIsEditing] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [activePanel, setActivePanel] = useState<LearnerPanel | null>(null);
  const [profile, setProfile] = useState({ name: auth.name, email: auth.email, phone: "", notifications: true });
  const recordings = [
    { date: "Today · 12 Aug", items: [{ title: "Quantitative Aptitude", time: "42 min", tutor: "Priya Sharma" }] },
    { date: "Yesterday · 11 Aug", items: [{ title: "English Communication", time: "36 min", tutor: "Rahul Verma" }, { title: "Weekly Doubt Session", time: "58 min", tutor: "Priya Sharma" }] },
    { date: "08 Aug", items: [{ title: "Career Readiness Workshop", time: "47 min", tutor: "Alev Career Team" }] },
  ];

  const saveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
    setSettingsSaved(true);
  };
  const showPanel = (panel: LearnerPanel) => {
    setActivePanel(panel);
    window.requestAnimationFrame(() => scrollToSection("learner-content"));
  };

  return (
    <div className="academy-app-page learner-dashboard">
      <header className="learner-app-header">
        <div>
          <p className="section-label">ACADEMY & COACHING</p>
          <h1>Welcome back, {auth.name.split(" ")[0]}.</h1>
          <p>Pick up where you left off and keep your learning moving.</p>
        </div>
        <div className="academy-header-actions">
          <span className="academy-role-badge user">Learner</span>
          <button className="button button-secondary academy-logout-button" onClick={onLogout} type="button">
            <LogOut size={15} aria-hidden="true" /> Logout
          </button>
        </div>
      </header>

      <AcademyFeedback message={error} tone="error" />
      <AcademyFeedback message={successMessage} tone="success" />

      <section className="learner-hero-card" aria-labelledby="learner-hero-title">
        <div>
          <p className="learner-eyebrow"><span /> YOUR LEARNING SPACE</p>
          <h2 id="learner-hero-title">Your next class is ready when you are.</h2>
          <p>Join your scheduled session, revisit recorded lessons, or review your learning plan.</p>
          <div className="learner-hero-actions">
            <button className="button button-sun" type="button" onClick={() => showPanel("live")}>
              <Video size={17} aria-hidden="true" /> View live classes
            </button>
            <button className="learner-text-button" type="button" onClick={() => showPanel("recordings")}>
              Browse recordings
            </button>
          </div>
        </div>
        <div className="learner-progress" aria-label="This week's learning progress">
          <span className="learner-progress-ring"><strong>68%</strong><small>this week</small></span>
          <div><strong>3 of 4 sessions</strong><span>completed this week</span></div>
        </div>
      </section>

      <nav className="learner-quick-actions" aria-label="Learner dashboard sections">
        <button className={activePanel === "live" ? "active" : ""} type="button" aria-pressed={activePanel === "live"} onClick={() => showPanel("live")}><Video size={18} /><span>Live classes</span></button>
        <button className={activePanel === "recordings" ? "active" : ""} type="button" aria-pressed={activePanel === "recordings"} onClick={() => showPanel("recordings")}><PlayCircle size={18} /><span>Recorded content</span></button>
        <button className={activePanel === "plan" ? "active" : ""} type="button" aria-pressed={activePanel === "plan"} onClick={() => showPanel("plan")}><CreditCard size={18} /><span>Plan & subscription</span></button>
        <button className={activePanel === "settings" ? "active" : ""} type="button" aria-pressed={activePanel === "settings"} onClick={() => showPanel("settings")}><Settings size={18} /><span>Settings</span></button>
      </nav>

      <div className="learner-content-panel" id="learner-content">
      {!activePanel && <section className="learner-empty-state"><BookOpen size={24} aria-hidden="true" /><div><strong>Choose an action to continue</strong><span>Select Live classes, Recorded content, Plan & subscription, or Settings above.</span></div></section>}

      {activePanel === "live" && <section className="learner-section" aria-labelledby="live-classes-title">
        <div className="learner-section-heading"><div><p className="section-label">UP NEXT</p><h2 id="live-classes-title">Live classes</h2></div><button className="learner-text-button" type="button">View calendar <CalendarDays size={15} /></button></div>
        <article className="live-class-card">
          <div className="live-class-time"><span>Today</span><strong>06:30 PM</strong><small>Starts in 2h 15m</small></div>
          <div className="live-class-details"><span className="live-indicator"><i /> LIVE CLASS</span><h3>Mathematics: Problem-solving session</h3><p>With Priya Sharma · Bring your weekly practice questions.</p></div>
          <button className="button button-sun" type="button"><Video size={16} /> Join class</button>
        </article>
      </section>}

      {activePanel === "recordings" && <section className="learner-section" aria-labelledby="recorded-content-title">
        <div className="learner-section-heading"><div><p className="section-label">LEARN ON YOUR TIME</p><h2 id="recorded-content-title">Recorded content</h2></div><span className="learner-section-note">Organised by date</span></div>
        <div className="recording-list">
          {recordings.map((group) => <div className="recording-date-group" key={group.date}><p>{group.date}</p>{group.items.map((item) => <article className="recording-card" key={item.title}><span className="recording-play"><PlayCircle size={21} /></span><div><h3>{item.title}</h3><p>{item.tutor} · {item.time}</p></div><button type="button" aria-label={`Play ${item.title}`}><PlayCircle size={18} /></button></article>)}</div>)}
        </div>
      </section>}

      {activePanel === "plan" && <section className="learner-section learner-plan-section" aria-labelledby="plan-title">
          <div className="learner-section-heading"><div><p className="section-label">YOUR PLAN</p><h2 id="plan-title">Plan & subscription</h2></div></div>
          <article className="subscription-card"><div><span className="subscription-status"><CheckCircle2 size={14} /> Active</span><h3>Academy Plus</h3><p>Full access to live classes, recordings, assessments, and learner support.</p></div><div className="subscription-renewal"><span>Renews on</span><strong>05 Sep 2026</strong><button type="button" className="learner-text-button">Manage plan</button></div></article>
        </section>}

      {activePanel === "settings" && <section className="learner-section learner-settings-section" aria-labelledby="settings-title">
          <div className="learner-section-heading"><div><p className="section-label">ACCOUNT</p><h2 id="settings-title">Your settings</h2></div><UserRound size={20} aria-hidden="true" /></div>
          <form className="learner-settings-form" onSubmit={saveSettings}>
            <label><span>Full name</span><input disabled={!isEditing} value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
            <label><span>Email address</span><input disabled={!isEditing} type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
            <label><span>Phone number</span><input disabled={!isEditing} type="tel" placeholder="Add your phone number" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
            <label className="notification-setting"><span><Bell size={16} /> Class reminders</span><input disabled={!isEditing} type="checkbox" checked={profile.notifications} onChange={(event) => setProfile({ ...profile, notifications: event.target.checked })} /></label>
            {settingsSaved && <p className="learner-save-message">Your changes are saved for this session.</p>}
            <div className="learner-settings-actions">{isEditing ? <><button className="button button-secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button><button className="button button-sun" type="submit"><Save size={15} /> Save changes</button></> : <button className="button button-secondary" type="button" onClick={() => { setIsEditing(true); setSettingsSaved(false); }}>Edit settings</button>}</div>
          </form>
        </section>}
      </div>
    </div>
  );
}

function AdminWorkspace({ auth, error, successMessage, onLogout }: AcademyDashboardProps) {
  type AdminPanel = "learners" | "classes" | "recordings" | "live" | "stats";
  const [activePanel, setActivePanel] = useState<AdminPanel | null>(null);
  const isSystemAdmin = auth.role === "SYSTEM_ADMIN";
  const showPanel = (panel: AdminPanel) => {
    setActivePanel(panel);
    window.requestAnimationFrame(() => scrollToSection("admin-workspace-content"));
  };
  const learners = [
    ["Aarav Singh", "aarav.s@example.com", "Academy Plus", "Active"],
    ["Meera Nair", "meera.n@example.com", "Academy Plus", "Active"],
    ["Rohan Das", "rohan.d@example.com", "Foundation", "Pending"],
  ];
  const classes = [
    ["Mathematics: Problem-solving", "Today · 06:30 PM", "Priya Sharma", "42 learners"],
    ["English Communication", "Tomorrow · 05:00 PM", "Rahul Verma", "36 learners"],
    ["Career Readiness Workshop", "Fri · 04:00 PM", "Alev Career Team", "58 learners"],
  ];

  return (
    <div className="academy-app-page academy-management-dashboard">
      <header className="learner-app-header">
        <div>
          <p className="section-label">ACADEMY & COACHING</p>
          <h1>{isSystemAdmin ? "Platform overview" : "Academy workspace"}</h1>
          <p>{isSystemAdmin ? "Monitor every academy, learner, and learning operation from one place." : "Manage learners, classes, and learning content for your academy."}</p>
        </div>
        <div className="academy-header-actions">
          <span className={`academy-role-badge ${auth.role.toLowerCase()}`}>{isSystemAdmin ? "System Admin" : "Admin"}</span>
          <button className="button button-secondary academy-logout-button" onClick={onLogout} type="button"><LogOut size={15} /> Logout</button>
        </div>
      </header>
      <AcademyFeedback message={error} tone="error" />
      <AcademyFeedback message={successMessage} tone="success" />

      <section className="admin-overview-card">
        <div><p className="learner-eyebrow"><span /> {isSystemAdmin ? "PLATFORM-WIDE ACCESS" : "ACADEMY MANAGEMENT"}</p><h2>Everything your learning team needs, in one workspace.</h2><p>Choose an action below to view learner information, manage class schedules, and review learning content.</p></div>
        <div className="admin-overview-stats"><span><strong>{isSystemAdmin ? "1,248" : "248"}</strong><small>active learners</small></span><span><strong>12</strong><small>live classes this week</small></span></div>
      </section>

      <nav className="learner-quick-actions admin-quick-actions" aria-label="Academy management actions">
        <button className={activePanel === "learners" ? "active" : ""} aria-pressed={activePanel === "learners"} type="button" onClick={() => showPanel("learners")}><UsersRound size={18} /><span>All learners</span></button>
        <button className={activePanel === "classes" ? "active" : ""} aria-pressed={activePanel === "classes"} type="button" onClick={() => showPanel("classes")}><CalendarCheck size={18} /><span>Manage classes</span></button>
        <button className={activePanel === "recordings" ? "active" : ""} aria-pressed={activePanel === "recordings"} type="button" onClick={() => showPanel("recordings")}><PlayCircle size={18} /><span>Recordings</span></button>
        <button className={activePanel === "live" ? "active" : ""} aria-pressed={activePanel === "live"} type="button" onClick={() => showPanel("live")}><Video size={18} /><span>All live classes</span></button>
        {isSystemAdmin && <button className={activePanel === "stats" ? "active" : ""} aria-pressed={activePanel === "stats"} type="button" onClick={() => showPanel("stats")}><CalendarDays size={18} /><span>App statistics</span></button>}
      </nav>

      <div className="admin-workspace-content" id="admin-workspace-content">
        {!activePanel && <section className="learner-empty-state"><BookOpen size={24} /><div><strong>Select a management action</strong><span>Open learner details, manage classes, view recordings, or see every live class.</span></div></section>}
        {activePanel === "learners" && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="section-label">LEARNERS</p><h2>All users in the academy</h2></div><button className="button button-sun" type="button"><Plus size={16} /> Add learner</button></div><div className="admin-table"><div className="admin-table-row admin-table-head"><span>Learner</span><span>Plan</span><span>Status</span><span /></div>{learners.map(([name, email, plan, status]) => <div className="admin-table-row" key={email}><div><strong>{name}</strong><small>{email}</small></div><span>{plan}</span><span className={`admin-status ${status.toLowerCase()}`}>{status}</span><button type="button">View</button></div>)}</div></section>}
        {activePanel === "classes" && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="section-label">SCHEDULE</p><h2>Manage classes</h2></div><button className="button button-sun" type="button"><Plus size={16} /> Create class</button></div><div className="admin-class-list">{classes.map(([title, time, tutor, count]) => <article key={title}><span className="admin-class-icon"><CalendarCheck size={20} /></span><div><h3>{title}</h3><p>{time} · {tutor}</p></div><span>{count}</span><button type="button">Manage</button></article>)}</div></section>}
        {activePanel === "recordings" && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="section-label">CONTENT LIBRARY</p><h2>Class recordings</h2></div><button className="button button-sun" type="button"><Plus size={16} /> Upload recording</button></div><div className="admin-class-list">{classes.map(([title, time, tutor]) => <article key={title}><span className="admin-class-icon"><PlayCircle size={20} /></span><div><h3>{title}</h3><p>{tutor} · Recorded {time}</p></div><span>Available</span><button type="button">View</button></article>)}</div></section>}
        {activePanel === "live" && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="section-label">LIVE SCHEDULE</p><h2>All live classes</h2></div><button className="learner-text-button" type="button">Open full calendar <CalendarDays size={15} /></button></div><div className="admin-class-list">{classes.map(([title, time, tutor, count], index) => <article key={title}><span className="admin-class-icon"><Video size={20} /></span><div><span className={index === 0 ? "live-indicator" : "admin-upcoming"}>{index === 0 ? <><i /> Starting soon</> : "Upcoming"}</span><h3>{title}</h3><p>{time} · {tutor}</p></div><span>{count}</span><button type="button">Open</button></article>)}</div></section>}
        {activePanel === "stats" && isSystemAdmin && <section className="admin-panel" aria-labelledby="app-statistics-title"><div className="admin-panel-heading"><div><p className="section-label">PLATFORM INSIGHTS</p><h2 id="app-statistics-title">App statistics</h2></div><span className="learner-section-note">Updated today</span></div><div className="admin-stats-grid"><article><span>Visitors today</span><strong>2,864</strong><small>+14.2% from yesterday</small></article><article><span>Total visitors</span><strong>48.6K</strong><small>All-time app visits</small></article><article><span>Total users</span><strong>1,248</strong><small>+86 this month</small></article><article><span>Active academies</span><strong>24</strong><small>+3 this quarter</small></article><article><span>Active subscriptions</span><strong>986</strong><small>79% of users</small></article><article><span>Live classes</span><strong>12</strong><small>Scheduled this week</small></article><article><span>Recording views</span><strong>4,382</strong><small>Last 30 days</small></article><article><span>Completion rate</span><strong>68%</strong><small>Across active learners</small></article></div></section>}
      </div>
    </div>
  );
}

export function AcademyDashboard({ auth, protectedData, error, successMessage, onLogout }: AcademyDashboardProps) {
  if (auth.role === "USER") {
    return <LearnerDashboard auth={auth} protectedData={protectedData} error={error} successMessage={successMessage} onLogout={onLogout} />;
  }

  if (auth.role === "ADMIN" || auth.role === "SYSTEM_ADMIN") {
    return <AdminWorkspace auth={auth} protectedData={protectedData} error={error} successMessage={successMessage} onLogout={onLogout} />;
  }

  return null;
}
