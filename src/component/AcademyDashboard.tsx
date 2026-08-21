import "../App.css";
import { LogOut } from "lucide-react";
import type { AuthState } from "./Verticals";
import { AcademyFeedback } from "./AcademyFeedback";

const ROLE_DETAILS = {
  SYSTEM_ADMIN: {
    label: "SYSTEM ADMINISTRATION",
    access: "Full platform access",
    description: "Manage every academy, administrator, learner, and platform setting.",
    permissions: ["All academies and users", "Administrator access", "Platform configuration"],
  },
  ADMIN: {
    label: "ACADEMY ADMINISTRATION",
    access: "Academy management access",
    description: "Manage the academy's learners, courses, enrolments, and day-to-day operations.",
    permissions: ["Academy learners", "Courses and enrolments", "Academy reports"],
  },
  USER: {
    label: "LEARNER PORTAL",
    access: "Learner access",
    description: "Access your courses, learning resources, enrolments, and personal profile.",
    permissions: ["My courses", "Learning resources", "My profile"],
  },
} as const;

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

export function AcademyDashboard({ auth, protectedData, error, successMessage, onLogout }: AcademyDashboardProps) {
  const roleDetails = ROLE_DETAILS[auth.role];

  return (
    <div className="academy-app-page">
      <header className="academy-shell-header">
        <div>
          <p className="section-label">ACADEMY & COACHING</p>
        </div>
      </header>

      <AcademyFeedback message={error} tone="error" />
      <AcademyFeedback message={successMessage} tone="success" />

      <div className="academy-token-card">
        <div className="academy-card-header">
          <div>
            <p className="section-label">{roleDetails.label}</p>
            <h2>{auth.name}</h2>
          </div>
          <span className={`academy-role-badge ${auth.role.toLowerCase()}`}>
            {auth.role}
          </span>
        </div>

        <div className="academy-token-copy">
          <div className="academy-user-meta">
            <strong>{auth.email}</strong>
          </div>
          <div className="academy-access-pill">
            <span className="academy-access-dot" aria-hidden="true" />
            {roleDetails.access}
          </div>
        </div>

        <p className="academy-role-description">{roleDetails.description}</p>

        <div className="academy-permission-list" aria-label="Available access">
          {roleDetails.permissions.map((permission) => (
            <span key={permission}>{permission}</span>
          ))}
        </div>

        <div className="academy-protected-status">
          <strong>{protectedData?.message ?? "Token-based request is ready."}</strong>
        </div>

        <button className="button button-secondary academy-logout-button" onClick={onLogout} type="button">
          <LogOut size={15} aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
