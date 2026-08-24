import "../App.css";
import { AcademyFeedback } from "./AcademyFeedback";
import { CheckCircle2, CircleAlert } from "lucide-react";

type AcademyOtpStepProps = {
  verificationPhone: string;
  verificationCode: string;
  isVerified: boolean;
  setVerificationCode: (value: string) => void;
  error: string;
  successMessage: string;
  registerStatus: "idle" | "sending-otp" | "otp-sent" | "verifying-otp" | "verified" | "registering" | "failed";
  resendCooldown: number;
  handleVerifyOtp: () => Promise<void>;
  handleResendOtp: () => Promise<void>;
  handleCompleteRegistration: () => Promise<void>;
  onBack: () => void;
};

export function AcademyOtpStep({
  verificationPhone,
  verificationCode,
  isVerified,
  setVerificationCode,
  error,
  successMessage,
  registerStatus,
  resendCooldown,
  handleVerifyOtp,
  handleResendOtp,
  handleCompleteRegistration,
  onBack,
}: AcademyOtpStepProps) {
  return (
    <div className="academy-auth-screen">
      <div className="academy-auth-card">
        <div className="academy-auth-copy">
          <p className="section-label">{isVerified ? "VERIFICATION COMPLETE" : "VERIFICATION REQUIRED"}</p>
          <h1>{isVerified ? "Your phone number is verified ." : "Enter the code sent to your phone."}</h1>
          <p>
            {isVerified
              ? <>Phone verification was successful for <strong>{verificationPhone}</strong>. Select OK to create your account.</>
              : <>We sent a 6-digit OTP to <strong>{verificationPhone}</strong>. Enter it below to continue and complete your registration.</>}
          </p>
        </div>



        <div className="academy-login-form academy-otp-card">
          <div className="academy-otp-header">
            <h2>{isVerified ? "Verification successful" : "Verify OTP"}</h2>
            <span>{isVerified ? "Ready to register" : "Secure mobile check"}</span>
          </div>

          <div className="academy-access-chip">
            <span className="academy-access-dot" aria-hidden="true" />
            {isVerified ? "Phone verified" : "Phone verification active"}
          </div>

          {isVerified ? (
            <div className="academy-verification-summary">
              <CheckCircle2 aria-hidden="true" size={22} />
              <div>
                <strong>Phone verification successful</strong>
                <span>Your saved registration details are ready to submit.</span>
              </div>
            </div>
          ) : (
            <label>
              <span>OTP code</span>
              <input
                className="academy-otp-input"
                inputMode="numeric"
                maxLength={6}
                minLength={6}
                required
                onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                type="text"
                value={verificationCode}
              />
            </label>
          )}

          {error && (
            <div className="academy-form-message" role="alert">
              <CircleAlert aria-hidden="true" size={16} />
              <span>{error}</span>
            </div>
          )}
          <AcademyFeedback message={error} tone="error" />
          {!isVerified && <AcademyFeedback message={successMessage} tone="success" />}

          <div className="academy-otp-actions">
            {isVerified ? (
              <button className="button button-sun academy-otp-confirm-action" onClick={handleCompleteRegistration} type="button" disabled={registerStatus === "registering"}>
                {registerStatus === "registering" ? "Creating account..." : "OK"}
              </button>
            ) : (
              <>
                <button className="button button-sun" onClick={handleVerifyOtp} type="button" disabled={registerStatus === "verifying-otp"}>
                  {registerStatus === "verifying-otp" ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  className="button button-secondary"
                  disabled={resendCooldown > 0 || registerStatus === "verifying-otp"}
                  onClick={handleResendOtp}
                  type="button"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </>
            )}
          </div>

          {!isVerified && (
            <button
              className="text-link academy-back-link"
              onClick={onBack}
              type="button"
            >
              Back to signup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
