import {
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Maximize2,
  Minimize2,
  Settings,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import type { Page } from "../type/Page";

type Service = {
  icon: LucideIcon;
  number: string;
  title: string;
  text: string;
  detail: string;
  appSummary: string;
  appFeatures: string[];
  slug: string;
  appUrl?: string;
};

type UserRole = "ADMIN" | "USER";

type AuthState = {
  role: UserRole;
  token: string;
  email: string;
  name: string;
};

type AuthResponse = {
  token: string;
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  message: string;
  type?: string;
};

const API_BASE_URL = "http://localhost:8080";
const AUTH_KEY = "ridsmart-academy-auth";

const getStoredAuth = (): AuthState | null => {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    const role = parsed.role === "ADMIN" ? "ADMIN" : "USER";

    return {
      role,
      token: parsed.token || (role === "ADMIN" ? "demo-admin-token" : "demo-user-token"),
      email: parsed.email || `${role.toLowerCase()}@ridsmart.local`,
      name: parsed.name || (role === "ADMIN" ? "Admin User" : "Learner User"),
    };
  } catch {
    return null;
  }
};

const setStoredAuth = (auth: AuthState | null) => {
  if (!auth) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

const normalizeAuthResponse = (response: AuthResponse): AuthState => ({
  role: response.role === "ADMIN" ? "ADMIN" : "USER",
  token: response.token,
  email: response.email,
  name: response.fullName || response.email,
});

const services: Service[] = [
  {
    icon: GraduationCap,
    number: "01",
    title: "Academy & Coaching",
    text: "Learning ecosystems that help institutions and individuals move forward with clarity.",
    detail:
      "We support schools, colleges and coaching centres with vocational training, skill development, digital learning pathways and career guidance designed around real learner needs.",
    appSummary: "One place for learners, educators and institutions to manage every step of the learning journey.",
    appFeatures: ["Discover courses and programmes", "Track enrolment and learner progress", "Access learning resources and support"],
    slug: "academy-coaching",
    appUrl: "/ridsmart-services-app/academy-coaching",
  },
  {
    icon: Truck,
    number: "02",
    title: "Travels & Transport",
    text: "Connected movement for people, goods and businesses across local and wider networks.",
    detail:
      "From passenger fleet aggregation and travel operations to freight forwarding, cargo handling and booking support, our focus is on practical, coordinated movement.",
    appSummary: "A simpler way to plan journeys, make bookings and stay informed while things are moving.",
    appFeatures: ["Search routes and request bookings", "Get journey and shipment updates", "Manage travel support in one place"],
    slug: "travels-transport",
    appUrl: "/ridsmart-services-app/travels-transport",
  },
  {
    icon: HeartPulse,
    number: "03",
    title: "Healthcare",
    text: "Patient-centred healthcare support enabled by dependable diagnostic and care networks.",
    detail:
      "Our healthcare framework covers hospitals, clinics, pathology, advanced radiology and telemedicine—helping make quality care pathways easier to coordinate.",
    appSummary: "A connected care companion that helps patients access the right support with less friction.",
    appFeatures: ["Book appointments and care services", "View diagnostic reports securely", "Connect with care teams remotely"],
    slug: "healthcare",
    appUrl: "/ridsmart-services-app/healthcare",
  },
  {
    icon: Settings,
    number: "04",
    title: "Facility Management & Utility Services",
    text: "Practical on-ground support that keeps residential and commercial spaces running smoothly.",
    detail:
      "We bring utility, maintenance and workforce services into a convenient support model, including electrical, plumbing, civil maintenance and housekeeping solutions.",
    appSummary: "A straightforward service desk for homes and businesses to request, track and manage essential work.",
    appFeatures: ["Raise a service request in minutes", "Track technician visits and updates", "Keep service history in one place"],
    slug: "facility-management-utility-services",
    appUrl: "/ridsmart-services-app/facility-management-utility-services",
  },
];

async function postAuthJson<T>(path: string, body: Record<string, string>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function fetchWithToken<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function Verticals({ go }: { go: (page: Page) => () => void }) {
  const navigate = useNavigate();
  const [selectedServiceNumber, setSelectedServiceNumber] = useState(services[0].number);
  const [isAppShowcaseHighlighted, setIsAppShowcaseHighlighted] = useState(false);
  const [appWindowState, setAppWindowState] = useState<"normal" | "minimized" | "maximized">("normal");
  const appShowcaseRef = useRef<HTMLElement>(null);
  const appWindowRef = useRef<HTMLDivElement>(null);
  const selectedService = services.find(({ number }) => number === selectedServiceNumber) ?? services[0];
  const SelectedIcon = selectedService.icon;

  useEffect(() => {
    if (appWindowState !== "maximized") return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAppWindowState("normal");
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [appWindowState]);

  useEffect(() => {
    if (appWindowState !== "maximized") return;

    const pageStage = document.querySelector(".page-stage");
    pageStage?.classList.add("app-window-open");
    return () => pageStage?.classList.remove("app-window-open");
  }, [appWindowState]);

  const showAppExperience = (serviceNumber: string) => () => {
    setSelectedServiceNumber(serviceNumber);
    const targetService = services.find(({ number }) => number === serviceNumber) ?? services[0];
    if (targetService.appUrl) {
      navigate(targetService.appUrl);
    }
    setIsAppShowcaseHighlighted(false);
    window.requestAnimationFrame(() => setIsAppShowcaseHighlighted(true));
    appShowcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleAppWindowSize = () => {
    if (appWindowState === "maximized") {
      setAppWindowState("normal");
      return;
    }
    setAppWindowState("maximized");
    window.requestAnimationFrame(() => appWindowRef.current?.focus());
  };

  return (
    <div className="content-page verticals-page page-enter">
      <div className="page-grid" aria-hidden="true" />
      <div className="section-top">
        <p className="section-label">02 / WHAT WE DO</p>
        <p className="section-summary">
          Four connected verticals.
          <br />
          <em>One standard of care.</em>
        </p>
      </div>
      <div className="service-app-intro">
        <div>
          <p className="section-label">THE RIDSMART SERVICES APP</p>
          <h2 id="app-experience-title">One service journey, <em>made simpler.</em></h2>
        </div>
        <p>
          Each Ridsmart Services app will give customers a clearer way to access support,
          follow progress and stay connected to their service.
        </p>
      </div>
      <p className="verticals-intro">
        Our verticals are designed to stand strongly on their own—and work
        intelligently together whenever a more complete solution is needed. This
        gives partners a simpler route to specialised support with a connected
        operating mindset.
      </p>
      <div className="service-list">
        {services.map(({ icon: Icon, number, title, text, detail, appUrl }) => (
          <article
            className={`service-card${selectedServiceNumber === number ? " is-selected" : ""}`}
            key={title}
          >
            {appUrl ? (
              <Link className="service-card-link" to={appUrl} aria-label={`Open ${title} application`}>
                <ServiceCardContent Icon={Icon} number={number} title={title} text={text} detail={detail} live />
              </Link>
            ) : (
              <button className="service-card-link" type="button" onClick={showAppExperience(number)}>
                <ServiceCardContent Icon={Icon} number={number} title={title} text={text} detail={detail} />
              </button>
            )}
          </article>
        ))}
      </div>
      <section
        aria-labelledby="app-experience-title"
        className={`service-app-showcase${isAppShowcaseHighlighted ? " service-app-showcase-highlighted" : ""}`}
        ref={appShowcaseRef}
      >
        <div className={`service-app-window is-${appWindowState}`} ref={appWindowRef} tabIndex={-1}>
          <header className="service-app-window-bar">
            <div className="service-app-window-title">
              <span aria-hidden="true" /> <span>Ridsmart Services app</span>
            </div>
            <div className="service-app-window-controls" aria-label="Application window controls">
              {appWindowState === "minimized" ? (
                <button aria-label="Restore application window" data-tooltip="Restore" onClick={() => setAppWindowState("normal")} type="button">
                  <Maximize2 size={14} aria-hidden="true" />
                </button>
              ) : (
                <button
                  aria-label={appWindowState === "maximized" ? "Restore application window" : "Maximize application window"}
                  data-tooltip={appWindowState === "maximized" ? "Restore" : "Expand"}
                  onClick={toggleAppWindowSize}
                  type="button"
                >
                  {appWindowState === "maximized" ? <Minimize2 size={14} aria-hidden="true" /> : <Maximize2 size={14} aria-hidden="true" />}
                </button>
              )}
            </div>
          </header>
          {appWindowState !== "minimized" && (
            <div className="service-app-showcase-content">
              <div className="service-app-tabs" role="tablist" aria-label="Service app experiences">
                {services.map(({ icon: Icon, number, title, appUrl }) => (
                  <button
                    aria-controls={`service-app-panel-${number}`}
                    aria-selected={selectedServiceNumber === number}
                    className={selectedServiceNumber === number ? "active" : ""}
                    id={`service-app-tab-${number}`}
                    key={number}
                    onClick={() => {
                      setSelectedServiceNumber(number);
                      if (appUrl) {
                        navigate(appUrl);
                      }
                    }}
                    role="tab"
                    type="button"
                  >
                    <Icon size={16} aria-hidden="true" /> {title}
                  </button>
                ))}
              </div>
              <div
                aria-labelledby={`service-app-tab-${selectedService.number}`}
                className="service-app-panel"
                id={`service-app-panel-${selectedService.number}`}
                role="tabpanel"
              >
                <span className={`service-icon service-icon-${selectedService.number}`}>
                  <SelectedIcon size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="service-app-eyebrow">{selectedService.number} / APP EXPERIENCE</p>
                  <h3>{selectedService.title}</h3>
                  <p>{selectedService.appSummary}</p>
                </div>
                <ul>
                  {selectedService.appFeatures.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="service-team-cta" aria-labelledby="service-team-cta-title">
        <div>
          <p className="section-label">LET’S BUILD WHAT’S NEXT</p>
          <h2 id="service-team-cta-title">Looking for the right <em>service partner?</em></h2>
          <p>
            Tell us what you need and our team will help shape the most practical next step.
          </p>
        </div>
        <button className="button button-sun" onClick={go("contact")}>
          Talk to Our Team <ArrowRight size={17} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export function Applications() {
  const navigate = useNavigate();
  const { service } = useParams();
  const activeService = services.find((item) => item.slug === service) ?? services[0];

  if (service && activeService.slug !== "academy-coaching") {
    return (
      <div className="academy-auth-screen">
        <div className="academy-auth-card">
          <div className="academy-auth-copy">
            <p className="section-label">{activeService.number} / SERVICE ROUTE</p>
            <h1>{activeService.title}</h1>
            <p>{activeService.appSummary}</p>
          </div>

          <div className="academy-login-form" style={{ gap: "1rem" }}>
            <div className="form-header">
              <h2>Service app coming soon</h2>
              <span>{activeService.title} is routed and ready for its dedicated experience.</span>
            </div>

            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#dfe7f5", lineHeight: 1.8 }}>
              {activeService.appFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <Link className="button button-sun" to="/services">
              Back to services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [error, setError] = useState("");
  const [auth, setAuth] = useState<AuthState | null>(() => getStoredAuth());
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ fullName: "", email: "", password: "" });
  const [protectedData, setProtectedData] = useState<{ message?: string; total?: number; data?: unknown } | null>(null);

  useEffect(() => {
    if (!auth?.token) {
      setProtectedData(null);
      return;
    }

    let ignore = false;

    const loadProtectedData = async () => {
      try {
        const data = await fetchWithToken<{ message?: string; total?: number; data?: unknown }>(
          auth.role === "ADMIN" ? "/api/academies" : "/api/user/profile",
          auth.token,
          { method: "GET" },
        );

        if (!ignore) {
          setProtectedData(data);
        }
      } catch {
        if (!ignore) {
          setProtectedData({ message: "Protected session is active. Token-based request is ready." });
        }
      }
    };

    loadProtectedData();

    return () => {
      ignore = true;
    };
  }, [auth?.token, auth?.role]);

  const persistAuth = (nextAuth: AuthState) => {
    setAuth(nextAuth);
    setStoredAuth(nextAuth);
    setLoginForm({ email: nextAuth.email, password: loginForm.password });
    setError("");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password.trim();

    if (!email || !password) {
      setError("Email and password are required to continue.");
      return;
    }

    try {
      const response = await postAuthJson<AuthResponse>("/api/auth/login", {
        email,
        password,
      });

      const nextAuth = normalizeAuthResponse(response);
      persistAuth(nextAuth);
      navigate(
        nextAuth.role === "ADMIN"
          ? "/ridsmart-services-app/academy-coaching/admin"
          : "/ridsmart-services-app/academy-coaching/user",
        { replace: true },
      );
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Login failed.";
      setError(message || "Invalid email or password. Please try again.");
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = registerForm.fullName.trim();
    const email = registerForm.email.trim().toLowerCase();
    const password = registerForm.password.trim();

    if (!fullName || !email || !password) {
      setError("Full name, email and password are required to create an account.");
      return;
    }

    try {
      const registrationResponse = await postAuthJson<{ message?: string; token?: string; role?: UserRole; fullName?: string; email?: string }>(
        "/api/auth/register",
        {
          fullName,
          email,
          password,
        },
      );

      if (registrationResponse.token && registrationResponse.role) {
        const nextAuth = normalizeAuthResponse({
          token: registrationResponse.token,
          id: 0,
          fullName: registrationResponse.fullName || fullName,
          email: registrationResponse.email || email,
          role: registrationResponse.role,
          message: registrationResponse.message || "Registration successful",
        });
        persistAuth(nextAuth);
        setRegisterForm({ fullName: "", email: "", password: "" });
        navigate(
          nextAuth.role === "ADMIN"
            ? "/ridsmart-services-app/academy-coaching/admin"
            : "/ridsmart-services-app/academy-coaching/user",
          { replace: true },
        );
        return;
      }

      const response = await postAuthJson<AuthResponse>("/api/auth/login", {
        email,
        password,
      });

      const nextAuth = normalizeAuthResponse(response);
      persistAuth(nextAuth);
      setRegisterForm({ fullName: "", email: "", password: "" });
      setAuthMode("login");
      navigate(
        nextAuth.role === "ADMIN"
          ? "/ridsmart-services-app/academy-coaching/admin"
          : "/ridsmart-services-app/academy-coaching/user",
        { replace: true },
      );
    } catch (registerError) {
      const message = registerError instanceof Error ? registerError.message : "Registration failed.";
      setError(message || "Unable to create your account right now. Please try again.");
    }
  };

  const displayedServiceName = service ? service.replace(/-/g, " ") : "academy coaching";

  if (!auth) {
    return (
      <div className="academy-auth-screen">
        <div className="academy-auth-card">
          <div className="academy-auth-copy">
            <p className="section-label">ACADEMY & COACHING</p>
            <h1>Smart learning operations for institutions and learners.</h1>
            <p>
              Manage academies, coaching programs, and learner journeys from a single role-aware dashboard.
            </p>
          </div>

          <div className="academy-login-form">
            <div className="auth-mode-switcher" role="tablist" aria-label="Authentication mode selector">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => {
                  setAuthMode("login");
                  setError("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => {
                  setAuthMode("register");
                  setError("");
                }}
              >
                Register
              </button>
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="academy-auth-form">
                <div className="form-header">
                  <h2>Welcome back</h2>
                  <span>Sign in with your account</span>
                </div>

                <div className="academy-access-chip">
                  <span className="academy-access-dot" aria-hidden="true" />
                  Secure access portal
                </div>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Enter password"
                  />
                </label>

                {error && <div className="academy-app-alert">{error}</div>}

                <button className="button button-sun" type="submit">
                  Login
                </button>

                <div className="demo-credentials">
                  <small>Role-based access</small>
                  <span>Admin and User roles are returned by the backend login response.</span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="academy-auth-form">
                <div className="form-header">
                  <h2>Create account</h2>
                  <span>Register to continue</span>
                </div>

                <div className="academy-access-chip">
                  <span className="academy-access-dot" aria-hidden="true" />
                  New account setup
                </div>

                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={registerForm.fullName}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="Priyanshu Yadav"
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Create a strong password"
                  />
                </label>

                {error && <div className="academy-app-alert">{error}</div>}

                <button className="button button-sun" type="submit">
                  Register
                </button>

                <div className="demo-credentials">
                  <small>Registration flow</small>
                  <span>Your account is created and then signed in automatically.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="academy-app-page">
      <header className="academy-shell-header">
        <div>
          <p className="section-label">ACADEMY & COACHING</p>
          <h1>{displayedServiceName}</h1>
        </div>

        {/* <div className="academy-header-actions">
          <span className={`academy-role-badge ${auth.role.toLowerCase()}`}>
            {auth.role}
          </span>
        </div> */}
      </header>

      {error && <div className="academy-app-alert">{error}</div>}

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
            {/* <span>Access level </span> */}
          </div>
          <div className="academy-access-pill">
            <span className="academy-access-dot" aria-hidden="true" />
            {auth.role === "ADMIN" ? "Full administrative access" : "Standard user access"}
          </div>
        </div>

        <div className="academy-protected-status">
          {/* <span>Protected fetch </span> */}
          <strong>{protectedData?.message ?? "Token-based request is ready."}</strong>
        </div>

        <code>{auth.token}</code>
      </div>
    </div>
  );
}

type ServiceCardContentProps = {
  Icon: LucideIcon;
  number: string;
  title: string;
  text: string;
  detail: string;
  live?: boolean;
};

function ServiceCardContent({
  Icon,
  number,
  title,
  text,
  detail,
  live = false,
}: ServiceCardContentProps) {
  return (
    <>
      <div className="service-card-top">
        <span>{number}</span>
        <span className={`service-icon service-icon-${number}`}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <p className="service-detail">{detail}</p>
      <span className="service-card-action">
        {live ? "Open service app" : "Explore app experience"} <ArrowRight size={15} aria-hidden="true" />
      </span>
    </>
  );
}

export default Verticals;
