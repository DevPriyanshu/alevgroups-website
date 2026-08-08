import {
  ArrowRight,
  Settings,
  HeartPulse,
  GraduationCap,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
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
  appUrl?: string;
};

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
  },
];

function Verticals({ go }: { go: (page: Page) => () => void }) {
  const [selectedServiceNumber, setSelectedServiceNumber] = useState(services[0].number);
  const [isAppShowcaseHighlighted, setIsAppShowcaseHighlighted] = useState(false);
  const appShowcaseRef = useRef<HTMLElement>(null);
  const selectedService = services.find(({ number }) => number === selectedServiceNumber) ?? services[0];
  const SelectedIcon = selectedService.icon;
  const showAppExperience = (serviceNumber: string) => () => {
    setSelectedServiceNumber(serviceNumber);
    setIsAppShowcaseHighlighted(false);
    window.requestAnimationFrame(() => setIsAppShowcaseHighlighted(true));
    appShowcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
              <a className="service-card-link" href={appUrl} aria-label={`Open ${title} application`}>
                <ServiceCardContent Icon={Icon} number={number} title={title} text={text} detail={detail} live />
              </a>
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

export default Verticals;
