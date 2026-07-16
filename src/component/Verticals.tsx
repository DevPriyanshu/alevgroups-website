import {
  ArrowRight,
  Settings,
  HeartPulse,
  GraduationCap,
  Truck,
} from "lucide-react";
import "../App.css";
import type { Page } from "../type/Page";

const services = [
  {
    icon: GraduationCap,
    number: "01",
    title: "Academy & Coaching",
    text: "Learning ecosystems that help institutions and individuals move forward with clarity.",
    detail:
      "We support schools, colleges and coaching centres with vocational training, skill development, digital learning pathways and career guidance designed around real learner needs.",
  },
  {
    icon: Truck,
    number: "02",
    title: "Travels & Transport",
    text: "Connected movement for people, goods and businesses across local and wider networks.",
    detail:
      "From passenger fleet aggregation and travel operations to freight forwarding, cargo handling and booking support, our focus is on practical, coordinated movement.",
  },
  {
    icon: HeartPulse,
    number: "03",
    title: "Healthcare",
    text: "Patient-centred healthcare support enabled by dependable diagnostic and care networks.",
    detail:
      "Our healthcare framework covers hospitals, clinics, pathology, advanced radiology and telemedicine—helping make quality care pathways easier to coordinate.",
  },
  {
    icon: Settings,
    number: "04",
    title: "Facility Management & Utility Services",
    text: "Practical on-ground support that keeps residential and commercial spaces running smoothly.",
    detail:
      "We bring utility, maintenance and workforce services into a convenient support model, including electrical, plumbing, civil maintenance and housekeeping solutions.",
  },
];

function Verticals({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="content-page verticals-page page-enter">
      <div className="section-top">
        <p className="section-label">02 / WHAT WE DO</p>
        <p className="section-summary">
          Four connected verticals.
          <br />
          One standard of care.
        </p>
      </div>
      <p className="verticals-intro">
        Our verticals are designed to stand strongly on their own—and work
        intelligently together whenever a more complete solution is needed. This
        gives partners a simpler route to specialised support with a connected
        operating mindset.
      </p>
      <div className="service-list">
        {services.map(({ icon: Icon, number, title, text, detail }) => (
          <article className="service-card" key={title}>
            <div className="service-card-top">
              <span>{number}</span>
              <Icon size={27} strokeWidth={1.55} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <p className="service-detail">{detail}</p>
          </article>
        ))}
      </div>
      <button className="page-corner-cta" onClick={go("contact")}>
        Talk to our team <ArrowRight size={16} />
      </button>
    </div>
  );
}

export default Verticals;
