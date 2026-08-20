import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import "../App.css";

type AcademyFeedbackProps = {
  message: string;
  tone: "error" | "success";
  duration?: number;
};

export function AcademyFeedback({ message, tone, duration = 4500 }: AcademyFeedbackProps) {
  if (!message) return null;

  return <TimedAcademyFeedback key={`${tone}-${message}`} duration={duration} message={message} tone={tone} />;
}

function TimedAcademyFeedback({ message, tone, duration }: Required<AcademyFeedbackProps>) {
  const [isVisible, setIsVisible] = useState(Boolean(message));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsVisible(false), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration]);

  if (!isVisible) return null;

  const Icon = tone === "success" ? CheckCircle2 : CircleAlert;

  return (
    <div className={`academy-feedback academy-feedback-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" size={18} />
      <span>{message}</span>
      <button aria-label="Dismiss notification" className="academy-feedback-close" onClick={() => setIsVisible(false)} type="button">
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
