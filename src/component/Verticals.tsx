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
import { API_BASE_URL } from "../config/api";
import { AcademyAuthSection } from "./AcademyAuthSection";
import { AcademyDashboard } from "./AcademyDashboard";
import { AcademyOtpStep } from "./AcademyOtpStep";
import { AcademyRequestLoader } from "./AcademyRequestLoader";
import { ServiceCardContent } from "./ServiceCardContent";

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

export type AuthState = {
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

type VerificationType = "EMAIL" | "PHONE";

type VerificationCodeResponse = {
  success?: boolean;
  verified?: boolean;
  status?: string;
  message?: string;
};

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const AUTH_KEY = "ridsmart-academy-auth";

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};

const isValidPhone = (phone: string) => {
  const digitCount = phone.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
};

const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

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

async function postAuthJson<T>(path: string, body: Record<string, string | boolean>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `Request failed with ${response.status}`;

    try {
      const errorBody = JSON.parse(errorText) as { message?: string };
      message = errorBody.message || message;
    } catch {
      // Keep a non-JSON error response as the message.
    }

    throw new ApiError(response.status, message);
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

async function sendVerificationCode(target: string, verificationType: VerificationType = "PHONE"): Promise<void> {
  const payload: Record<string, string | boolean> = verificationType === "PHONE"
    ? { phone: normalizePhone(target), verificationType }
    : { email: target.trim().toLowerCase(), verificationType };

  await postAuthJson<{ message?: string }>("/api/auth/send-code", payload);
}

async function verifyCode(target: string, code: string, verificationType: VerificationType = "PHONE"): Promise<VerificationCodeResponse> {
  const payload: Record<string, string | boolean> = verificationType === "PHONE"
    ? { phone: normalizePhone(target), code }
    : { email: target.trim().toLowerCase(), code };

  return postAuthJson<VerificationCodeResponse>("/api/auth/verify-code", payload);
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

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [auth, setAuth] = useState<AuthState | null>(() => getStoredAuth());
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ fullName: "",countryCode: "+91", phone: "", email: "", password: "" });
  const [protectedData, setProtectedData] = useState<{ message?: string; total?: number; data?: unknown } | null>(null);
  const [registerStep, setRegisterStep] = useState<"phone" | "otp" | "verified">("phone");
  const [verificationPhone, setVerificationPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [registerStatus, setRegisterStatus] = useState<"idle" | "sending-otp" | "otp-sent" | "verifying-otp" | "verified" | "registering" | "failed">("idle");

  const runRequest = async <T,>(request: () => Promise<T>): Promise<T> => {
    setPendingRequestCount((count) => count + 1);

    try {
      return await request();
    } finally {
      setPendingRequestCount((count) => Math.max(0, count - 1));
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendCooldown]);

  useEffect(() => {
    if (!auth?.token) {
      return;
    }

    let ignore = false;

    const loadProtectedData = async () => {
      try {
        const data = await runRequest(() => fetchWithToken<{ message?: string; total?: number; data?: unknown }>(
          auth.role === "ADMIN" ? "/api/academies" : "/api/user/profile",
          auth.token,
          { method: "GET" },
        ));

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
    setLoginForm({ identifier: nextAuth.email, password: loginForm.password });
    setError("");
    setSuccessMessage(`Welcome, ${nextAuth.name}. You are signed in successfully.`);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const identifier = loginForm.identifier.trim();
    const password = loginForm.password.trim();

    if (!identifier || !password) {
      setError("Phone or email and password are required to continue.");
      return;
    }

    if (identifier.includes("@") ? !isValidEmail(identifier) : !isValidPhone(identifier)) {
      setError("Enter a valid email address or phone number, including the country code.");
      return;
    }

    try {
      const isPhone = identifier.includes("@") === false;
      const payload: Record<string, string | boolean> = isPhone
        ? { phone: normalizePhone(identifier), password }
        : { email: identifier.toLowerCase(), password };

      const response = await runRequest(() => postAuthJson<AuthResponse>("/api/auth/login", payload));
      const nextAuth = normalizeAuthResponse(response);
      persistAuth(nextAuth);
      navigate(
        nextAuth.role === "ADMIN"
          ? "/ridsmart-services-app/academy-coaching/admin"
          : "/ridsmart-services-app/academy-coaching/user",
        { replace: true },
      );
    } catch (loginError) {
      const message = loginError instanceof ApiError && (loginError.status === 401 || loginError.status === 403)
        ? "Invalid phone/email or password. Please try again."
        : loginError instanceof Error ? loginError.message : "Login failed.";
      setError(message || "Invalid credentials. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    const fullName = registerForm.fullName.trim();
    const phone = normalizePhone(`${registerForm.countryCode}${registerForm.phone}`);
    const email = registerForm.email.trim().toLowerCase();
    const password = registerForm.password.trim();

    if (!fullName || !phone || !password) {
      setError("Full name, phone and password are required before sending the OTP.");
      return;
    }

    if (fullName.length < 2) {
      setError("Please enter your full name using at least 2 characters.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Enter a valid phone number. It must contain 7 to 15 digits.");
      return;
    }

    if (email && !isValidEmail(email)) {
      setError("Enter a valid email address or leave the email field empty.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    try {
      setRegisterStatus("sending-otp");
      setError("");
      setSuccessMessage("");
      await runRequest(() => sendVerificationCode(phone, "PHONE"));
      setVerificationPhone(phone);
      setVerificationCode("");
      setPhoneVerified(false);
      setRegisterStatus("otp-sent");
      setSuccessMessage(`OTP sent successfully to ${phone}.`);
      setRegisterStep("otp");
      setResendCooldown(60);
      setRegisterForm((current) => ({ ...current, email: email || current.email }));
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : "Unable to send verification code.";
      setError(message || "Unable to send OTP right now. Please try again.");
      setRegisterStatus("failed");
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedCode = verificationCode.trim();

    if (!verificationPhone) {
      setError("No phone number is ready for verification.");
      return;
    }

    if (trimmedCode.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your phone.");
      return;
    }

    try {
      setRegisterStatus("verifying-otp");
      setError("");
      setSuccessMessage("");
      const verificationResponse = await runRequest(() => verifyCode(verificationPhone, trimmedCode, "PHONE"));
      // The endpoint has already returned HTTP 2xx here. Some backend versions
      // return only a message (rather than `success` / `verified`), so treat
      // that successful response as verified unless it explicitly says false.
      const success = verificationResponse.verified
        ?? verificationResponse.success
        ?? (verificationResponse.status?.toLowerCase() === "failed" ? false : true);

      if (!success) {
        throw new Error(verificationResponse.message || "The OTP is invalid or expired.");
      }

      setRegisterStatus("verified");
      setPhoneVerified(true);
      setSuccessMessage("Phone verification successful.");
      setVerificationCode("");
    } catch (verifyError) {
      const message = verifyError instanceof Error ? verifyError.message : "Verification failed.";
      setError(message || "Unable to verify OTP right now. Please try again.");
      setRegisterStatus("failed");
    }
  };

  const handleResendOtp = async () => {
    if (!verificationPhone || resendCooldown > 0) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await runRequest(() => sendVerificationCode(verificationPhone, "PHONE"));
      setVerificationCode("");
      setPhoneVerified(false);
      setResendCooldown(60);
      setRegisterStatus("otp-sent");
      setSuccessMessage(`A new OTP was sent successfully to ${verificationPhone}.`);
    } catch (resendError) {
      const message = resendError instanceof Error ? resendError.message : "Resend failed.";
      setError(message || "The OTP could not be resent right now.");
    }
  };

  const completeRegistration = async () => {
    const fullName = registerForm.fullName.trim();
    // Use the same international number that was verified before registering.
    const phone = normalizePhone(`${registerForm.countryCode}${registerForm.phone}`);
    const email = registerForm.email.trim().toLowerCase();
    const password = registerForm.password.trim();

    if (!fullName || !phone || !password) {
      setError("Full name, phone and password are required to register.");
      return;
    }

    if (fullName.length < 2 || !isValidPhone(phone) || (email && !isValidEmail(email)) || password.length < 8) {
      setError("Your registration details are no longer valid. Please return to signup and correct them.");
      return;
    }

    if (!phoneVerified) {
      setError("Please verify your phone number before completing registration.");
      return;
    }

    try {
      setRegisterStatus("registering");
      setError("");
      setSuccessMessage("");

      const registrationPayload = {
        fullName,
        phone,
        email: email || "",
        password,
        phoneVerified: true,
      };

      const loginResponse = await runRequest(async () => {
        await postAuthJson<{ message?: string }>("/api/auth/register", registrationPayload);
        return postAuthJson<AuthResponse>("/api/auth/login", { phone, password });
      });

      const nextAuth = normalizeAuthResponse(loginResponse);
      persistAuth(nextAuth);
      setRegisterForm({
        fullName: "",
        countryCode: "+91",
        phone: "",
        email: "",
        password: "",
      });
      setRegisterStep("phone");
      setPhoneVerified(false);
      setRegisterStatus("verified");
      navigate(
        nextAuth.role === "ADMIN"
          ? "/ridsmart-services-app/academy-coaching/admin"
          : "/ridsmart-services-app/academy-coaching/user",
        { replace: true },
      );
    } catch (registerError) {
      if (registerError instanceof ApiError && registerError.status === 409) {
        setRegisterStatus("idle");
        setPhoneVerified(false);
        setRegisterStep("phone");
        setAuthMode("login");
        setLoginForm({ identifier: phone, password: "" });
        setError("An account already exists with this phone number. Please log in to continue.");
        return;
      }

      const message = registerError instanceof Error ? registerError.message : "Registration failed.";
      setError(message || "Unable to complete registration. Please try again.");
      setRegisterStatus("failed");
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await completeRegistration();
  };

  const handleLogout = () => {
    setAuth(null);
    setStoredAuth(null);
    setError("");
    setSuccessMessage("You have been logged out successfully.");
    navigate("/ridsmart-services-app/academy-coaching", { replace: true });
  };

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

  if (!auth) {
    if (registerStep === "otp") {
      return (
        <>
          <AcademyRequestLoader isLoading={pendingRequestCount > 0} />
          <AcademyOtpStep
          error={error}
          successMessage={successMessage}
          handleCompleteRegistration={completeRegistration}
          handleResendOtp={handleResendOtp}
          handleVerifyOtp={handleVerifyOtp}
          onBack={() => {
            setRegisterStep("phone");
            setVerificationPhone("");
            setVerificationCode("");
            setPhoneVerified(false);
            setRegisterStatus("idle");
            setError("");
            setSuccessMessage("");
          }}
          registerStatus={registerStatus}
          resendCooldown={resendCooldown}
          isVerified={phoneVerified}
          setVerificationCode={(value) => setVerificationCode(value)}
          verificationCode={verificationCode}
          verificationPhone={verificationPhone}
          />
        </>
      );
    }

    return (
      <>
        <AcademyRequestLoader isLoading={pendingRequestCount > 0} />
        <AcademyAuthSection
        authMode={authMode}
        error={error}
        successMessage={successMessage}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleSendOtp={handleSendOtp}
        loginForm={loginForm}
        registerForm={registerForm}
        registerStatus={registerStatus}
        registerStep={registerStep}
        setAuthMode={(mode) => {
          setAuthMode(mode);
          setError("");
          if (mode === "register") {
            setRegisterStep("phone");
          }
        }}
        setLoginForm={setLoginForm}
        setRegisterForm={setRegisterForm}
        />
      </>
    );
  }

  return (
    <>
      <AcademyRequestLoader isLoading={pendingRequestCount > 0} />
      <AcademyDashboard
      auth={auth}
      error={error}
      onLogout={handleLogout}
      protectedData={protectedData}
      successMessage={successMessage}
      />
    </>
  );
}

export default Verticals;
