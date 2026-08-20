import { useState } from "react";
import type { FormEvent } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import "../App.css";
import { AcademyFeedback } from "./AcademyFeedback";

type AuthMode = "login" | "register";

type RegisterStatus =
  | "idle"
  | "sending-otp"
  | "otp-sent"
  | "verifying-otp"
  | "verified"
  | "registering"
  | "failed";

type AcademyAuthSectionProps = {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;

  loginForm: {
    identifier: string;
    password: string;
  };

  setLoginForm: React.Dispatch<
    React.SetStateAction<{
      identifier: string;
      password: string;
    }>
  >;

  registerForm: {
    fullName: string;
    countryCode: string;
    phone: string;
    email: string;
    password: string;
  };

  setRegisterForm: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      countryCode: string;
      phone: string;
      email: string;
      password: string;
    }>
  >;

  error: string;
  successMessage: string;

  handleLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;

  handleSendOtp: () => Promise<void>;

  handleRegister: (event: FormEvent<HTMLFormElement>) => Promise<void>;

  registerStep: "phone" | "otp" | "verified";

  registerStatus: RegisterStatus;
};

export function AcademyAuthSection({
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  error,
  successMessage,
  handleLogin,
  handleSendOtp,
  handleRegister,
  registerStep,
  registerStatus,
}: AcademyAuthSectionProps) {
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);

  return (
    <div className="academy-auth-screen">
      <div className="academy-auth-card">
        <div className="academy-auth-copy">
          <p className="section-label">ACADEMY & COACHING</p>

          <h1>
            Smart learning operations for institutions and learners.
          </h1>

          <p>
            Manage academies, coaching programs, and learner journeys from a
            single role-aware dashboard.
          </p>
        </div>

        <div className="academy-login-form">
          {/* LOGIN / REGISTER SWITCH */}
          <div
            className="auth-mode-switcher"
            role="tablist"
            aria-label="Authentication mode selector"
          >
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          {/* LOGIN */}
          {authMode === "login" ? (
            <form
              onSubmit={handleLogin}
              className="academy-auth-form"
            >
              <div className="form-header">
                <h2>Welcome back</h2>
                <span>Sign in with your account</span>
              </div>

              <div className="academy-access-chip">
                <span
                  className="academy-access-dot"
                  aria-hidden="true"
                />
                Secure access portal
              </div>

              <label>
                <span>Phone or Email</span>

                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={loginForm.identifier}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      identifier: event.target.value,
                    }))
                  }
                  placeholder="+919876543210 or you@example.com"
                />
              </label>

              <label>
                <span>Password</span>
                <span className="password-field">
                  <input
                    type={isLoginPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Enter password"
                  />
                  <button
                    aria-label={isLoginPasswordVisible ? "Hide password" : "Show password"}
                    className="password-visibility-toggle"
                    onClick={() => setIsLoginPasswordVisible((visible) => !visible)}
                    type="button"
                  >
                    {isLoginPasswordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {error && (
                <div className="academy-form-message" role="alert">
                  <CircleAlert aria-hidden="true" size={16} />
                  <span>{error}</span>
                </div>
              )}
              <AcademyFeedback message={error} tone="error" />
              <AcademyFeedback message={successMessage} tone="success" />

              <button
                className="button button-sun"
                type="submit"
              >
                Login
              </button>

              <div className="demo-credentials">
                <small>Role-based access</small>

                <span>
                  Admin and User roles are returned by the backend
                  login response.
                </span>
              </div>
            </form>
          ) : (
            /* REGISTER */
            <form
              onSubmit={handleRegister}
              className="academy-auth-form"
            >
              <div className="form-header">
                <h2>
                  {registerStep === "verified"
                    ? "Complete registration"
                    : "Create account"}
                </h2>

                <span>
                  {registerStep === "verified"
                    ? "Verify complete"
                    : "Phone verification first"}
                </span>
              </div>

              <div className="academy-access-chip">
                <span
                  className="academy-access-dot"
                  aria-hidden="true"
                />

                {registerStep === "verified"
                  ? "Phone verified"
                  : "Verify phone first"}
              </div>

              {/* FULL NAME */}
              <label>
                <span>Full name</span>

                <input
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  required
                  value={registerForm.fullName}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Priyanshu Yadav"
                />
              </label>

              {/* COUNTRY CODE + PHONE */}
              <div className="phone-input-group">
                <label className="country-code-field">
                  <span>Country Code</span>

                  <select
                    value={registerForm.countryCode}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        countryCode: event.target.value,
                      }))
                    }
                  >
                    <option value="+91">
                      🇮🇳 +91 India
                    </option>

                    <option value="+1">
                      🇺🇸 +1 USA
                    </option>

                    <option value="+44">
                      🇬🇧 +44 UK
                    </option>

                    <option value="+61">
                      🇦🇺 +61 Australia
                    </option>

                    <option value="+971">
                      🇦🇪 +971 UAE
                    </option>

                    <option value="+65">
                      🇸🇬 +65 Singapore
                    </option>

                    <option value="+49">
                      🇩🇪 +49 Germany
                    </option>

                    <option value="+33">
                      🇫🇷 +33 France
                    </option>

                    <option value="+81">
                      🇯🇵 +81 Japan
                    </option>

                    <option value="+82">
                      🇰🇷 +82 South Korea
                    </option>
                  </select>
                </label>

                <label className="phone-number-field">
                  <span>Phone</span>

                  <input
                    type="tel"
                    autoComplete="tel-national"
                    maxLength={15}
                    minLength={7}
                    required
                    value={registerForm.phone}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,

                        // Only allow numbers
                        phone: event.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="9876543210"
                    inputMode="numeric"
                  />
                </label>
              </div>

              {/* EMAIL */}
              <label>
                <span>Email (optional)</span>

                <input
                  type="email"
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                />
              </label>

              {/* PASSWORD */}
              <label>
                <span>Password</span>
                <span className="password-field">
                  <input
                    type={isRegisterPasswordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Create a strong password"
                  />
                  <button
                    aria-label={isRegisterPasswordVisible ? "Hide password" : "Show password"}
                    className="password-visibility-toggle"
                    onClick={() => setIsRegisterPasswordVisible((visible) => !visible)}
                    type="button"
                  >
                    {isRegisterPasswordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {/* ERROR */}
              {error && (
                <div className="academy-form-message" role="alert">
                  <CircleAlert aria-hidden="true" size={16} />
                  <span>{error}</span>
                </div>
              )}
              <AcademyFeedback message={error} tone="error" />
              <AcademyFeedback message={successMessage} tone="success" />

              {/* SEND OTP / COMPLETE REGISTRATION */}
              {registerStep === "verified" ? (
                <button
                  className="button button-sun"
                  type="submit"
                  disabled={registerStatus === "registering"}
                >
                  {registerStatus === "registering"
                    ? "Creating account..."
                    : "Complete registration"}
                </button>
              ) : (
                <button
                  className="button button-sun"
                  type="button"
                  onClick={handleSendOtp}
                  disabled={registerStatus === "sending-otp"}
                >
                  {registerStatus === "sending-otp"
                    ? "Sending OTP..."
                    : "Send OTP"}
                </button>
              )}

              {/* INFO */}
              <div className="demo-credentials">
                <small>Verification flow</small>

                <span>
                  OTP is sent to{" "}
                  {registerForm.countryCode}
                  {registerForm.phone
                    ? registerForm.phone
                    : "your phone number"}
                  , verified, and only then the registration request
                  is submitted.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
