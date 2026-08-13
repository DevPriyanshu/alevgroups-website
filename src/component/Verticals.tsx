import {
  ArrowRight,
  Settings,
  HeartPulse,
  GraduationCap,
  Maximize2,
  Truck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const services: Service[] = [
  {
    icon: GraduationCap,
    number: "01",
    slug: "academy-coaching",
    title: "Academy & Coaching",
    text: "Learning ecosystems that help institutions and individuals move forward with clarity.",
    detail:
      "We support schools, colleges and coaching centres with vocational training, skill development, digital learning pathways and career guidance designed around real learner needs.",
    appSummary: "One place for learners, educators and institutions to manage every step of the learning journey.",
    appFeatures: ["Discover courses and programmes", "Track enrolment and learner progress", "Access learning resources and support"],
  },
  {
    icon: Truck,
    number: "02",
    slug: "travels-transport",
    title: "Travels & Transport",
    text: "Connected movement for people, goods and businesses across local and wider networks.",
    detail:
      "From passenger fleet aggregation and travel operations to freight forwarding, cargo handling and booking support, our focus is on practical, coordinated movement.",
    appSummary: "A simpler way to plan journeys, make bookings and stay informed while things are moving.",
    appFeatures: ["Search routes and request bookings", "Get journey and shipment updates", "Manage travel support in one place"],
  },
  {
    icon: HeartPulse,
    number: "03",
    slug: "healthcare",
    title: "Healthcare",
    text: "Patient-centred healthcare support enabled by dependable diagnostic and care networks.",
    detail:
      "Our healthcare framework covers hospitals, clinics, pathology, advanced radiology and telemedicine—helping make quality care pathways easier to coordinate.",
    appSummary: "A connected care companion that helps patients access the right support with less friction.",
    appFeatures: ["Book appointments and care services", "View diagnostic reports securely", "Connect with care teams remotely"],
  },
  {
    icon: Settings,
    number: "04",
    slug: "facility-management",
    title: "Facility Management & Utility Services",
    text: "Practical on-ground support that keeps residential and commercial spaces running smoothly.",
    detail:
      "We bring utility, maintenance and workforce services into a convenient support model, including electrical, plumbing, civil maintenance and housekeeping solutions.",
    appSummary: "A straightforward service desk for homes and businesses to request, track and manage essential work.",
    appFeatures: ["Raise a service request in minutes", "Track technician visits and updates", "Keep service history in one place"],
  },
];

function Verticals({ go }: { go: (page: Page) => () => void }) {
  const navigate = useNavigate();
  const [selectedServiceNumber, setSelectedServiceNumber] = useState(services[0].number);
  const [appWindowState, setAppWindowState] = useState<"normal" | "minimized" | "maximized">("normal");
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
    const appShell = document.querySelector(".app-shell");
    pageStage?.classList.add("app-window-open");
    appShell?.classList.add("app-window-open");
    return () => {
      pageStage?.classList.remove("app-window-open");
      appShell?.classList.remove("app-window-open");
    };
  }, [appWindowState]);

  const toggleAppWindowSize = () => {
    navigate(`/ridsmart-services-app/${selectedService.slug}`);
  };
  const exitApp = () => setAppWindowState("normal");

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
        {services.map(({ icon: Icon, number, title, text, detail, appUrl, slug }) => (
          <article
            className={`service-card${selectedServiceNumber === number ? " is-selected" : ""}`}
            key={title}
          >
            {appUrl ? (
              <a className="service-card-link" href={appUrl} aria-label={`Open ${title} application`}>
                <ServiceCardContent Icon={Icon} number={number} title={title} text={text} detail={detail} live />
              </a>
            ) : (
              <button className="service-card-link" type="button" onClick={() => navigate(`/ridsmart-services-app/${slug}`)}>
                <ServiceCardContent Icon={Icon} number={number} title={title} text={text} detail={detail} />
              </button>
            )}
          </article>
        ))}
      </div>
      <section
        aria-labelledby="app-experience-title"
        className="service-app-showcase"
      >
        <div className={`service-app-window is-${appWindowState}`} ref={appWindowRef} tabIndex={-1}>
          <header className="service-app-window-bar">
            <div className="service-app-window-title">
              <span aria-hidden="true" /> <span>Ridsmart Services app</span>
            </div>
            <div className="service-app-window-controls" aria-label="Application window controls">
              {/* {appWindowState !== "minimized" && (
                <button aria-label="Minimize application window" data-tooltip="Minimize" onClick={() => setAppWindowState("minimized")} type="button">
                  <Minus size={15} aria-hidden="true" />
                </button>
              )} */}
              {appWindowState === "maximized" ? (
                <button aria-label="Exit application" data-tooltip="Exit app" onClick={exitApp} type="button">
                  <X size={16} aria-hidden="true" />
                </button>
              ) : appWindowState === "minimized" ? (
                <button aria-label="Restore application window" data-tooltip="Restore" onClick={() => setAppWindowState("normal")} type="button">
                  <Maximize2 size={14} aria-hidden="true" />
                </button>
              ) : (
                <button
                  aria-label="Open application in full screen"
                  data-tooltip="Open full screen"
                  onClick={toggleAppWindowSize}
                  type="button"
                >
                  <Maximize2 size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </header>
          {appWindowState !== "minimized" && (
            <div className="service-app-showcase-content">
              <div className="service-app-tabs" role="tablist" aria-label="Service app experiences">
                {services.map(({ icon: Icon, number, title }) => (
                  <button
                    aria-controls={`service-app-panel-${number}`}
                    aria-selected={selectedServiceNumber === number}
                    className={selectedServiceNumber === number ? "active" : ""}
                    id={`service-app-tab-${number}`}
                    key={number}
                    onClick={() => setSelectedServiceNumber(number)}
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

export function Applications() {
  const navigate = useNavigate();
  const { service: serviceSlug } = useParams();
  const selectedService = services.find(({ slug }) => slug === serviceSlug) ?? services[0];
  const SelectedIcon = selectedService.icon;

  useEffect(() => {
    const pageStage = document.querySelector(".page-stage");
    const appShell = document.querySelector(".app-shell");
    pageStage?.classList.add("app-window-open");
    appShell?.classList.add("app-window-open");
    return () => {
      pageStage?.classList.remove("app-window-open");
      appShell?.classList.remove("app-window-open");
    };
  }, []);

  return (
    <main className="applications-page">
      <section className="service-app-window is-maximized" aria-label="Ridsmart Services application">
        <header className="service-app-window-bar">
          <div className="service-app-window-title">
            <span aria-hidden="true" /> <span>Ridsmart Services app</span>
          </div>
          <div className="service-app-window-controls">
            <button aria-label="Exit application" data-tooltip="Exit app" onClick={() => navigate("/services")} type="button">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </header>
        <div className="service-app-showcase-content">
          <nav className="service-app-tabs" aria-label="Service applications">
            {services.map(({ icon: Icon, number, slug, title }) => (
              <button
                aria-current={selectedService.slug === slug ? "page" : undefined}
                className={selectedService.slug === slug ? "active" : ""}
                key={slug}
                onClick={() => navigate(`/ridsmart-services-app/${slug}`)}
                type="button"
              >
                <Icon size={16} aria-hidden="true" /> {number} · {title}
              </button>
            ))}
          </nav>
          <article className="service-app-panel">
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
            <p className="service-app-coming-soon">
              <strong>Coming soon</strong>
              We’re preparing these app features to make every service journey simpler from day one.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Verticals;
