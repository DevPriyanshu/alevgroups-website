import { ArrowRight } from "lucide-react";
import "../App.css";
import type { Page } from "../type/Page";

function Solutions({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="solutions-page page-enter">
      <div className="page-grid" aria-hidden="true" />
      <div className="solutions-note">
        <span className="solution-dot"></span> AlevGroups service ecosystem
      </div>
      <div className="solutions-grid">
        <div>
          <p className="section-label">04 / OUR SOLUTIONS</p>
          <h2>
            Smart service,
            <br />
            <em>made simple.</em>
          </h2>
          <p className="solutions-tagline">
            One-stop solutions for academy & coaching, travels & transport,
            healthcare, facility management and utility services.
          </p>
        </div>
        <div className="solutions-copy">
          <p>
            AlevGroups is built for convenient, responsive, and reliable
            everyday service delivery. It brings technology, capable people and
            trusted partners together for a better service experience.
          </p>
          <p className="solutions-promise">
            Built for homes, businesses and institutions that value timely
            support, transparent coordination and a single point of service.
          </p>
          <button className="button button-light" onClick={go("contact")}>
            Partner with AlevGroups <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="solutions-tags">
        <span>Academy & coaching</span>
        <span>Travels & transport</span>
        <span>Healthcare</span>
        <span>Facility & utility services</span>
      </div>
    </div>
  );
}

export default Solutions;
