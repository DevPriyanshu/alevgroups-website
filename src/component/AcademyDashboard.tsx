import "../App.css";
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

export function AcademyDashboard({ auth, protectedData, error, successMessage, onLogout }: AcademyDashboardProps) {
  return (
    <div className="academy-app-page">
      <header className="academy-shell-header">
        <div>
          <p className="section-label">ACADEMY & COACHING</p>
          <h1>{auth.name}</h1>
        </div>

        <div className="academy-header-actions">
          <span className={`academy-role-badge ${auth.role.toLowerCase()}`}>
            {auth.role}
          </span>
          <button type="button" className="button button-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <AcademyFeedback message={error} tone="error" />
      <AcademyFeedback message={successMessage} tone="success" />

      <div className="academy-token-card">
        <div className="academy-card-header">
          <div>
            <p className="section-label">SYSTEM ADMIN</p>
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
            {auth.role === "ADMIN" ? "Full administrative access" : "Standard user access"}
          </div>
        </div>

        <div className="academy-protected-status">
          <strong>{protectedData?.message ?? "Token-based request is ready."}</strong>
        </div>

        <code>{auth.token}</code>
      </div>
    </div>
  );
}
