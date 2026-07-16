import {
  ArrowRight,
} from "lucide-react";
import "../App.css";
import type { Page } from "../type/Page";

function Ridsmart({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="ridsmart-page page-enter">
      <div className="ridsmart-note">
        <span className="r-dot"></span> A UNIT OF ASHA LOGISTICS & EDUCATIONAL VENTURES PVT. LTD.
      </div>
      <div className="ridsmart-grid">
        <div>
          <p className="section-label">03 / RIDSMART SERVICES</p>
          <h2>
            Smart service,
            <br />
            <em>made simple.</em>
          </h2>
          <p className="ridsmart-tagline">
            One-stop solutions for academy & coaching, travels & transport,
            healthcare, facility management and utility services.
          </p>
        </div>
        <div className="ridsmart-copy">
          <p>
            Ridsmart Services is our operational vertical for convenient,
            responsive, and reliable everyday service delivery. It brings
            technology, capable people and trusted partners together for a
            better service experience.
          </p>
          <p className="ridsmart-promise">
            Built for homes, businesses and institutions that value timely
            support, transparent coordination and a single point of service.
          </p>
          <button className="button button-light" onClick={go("contact")}>
            Partner with Ridsmart <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="ridsmart-tags">
        <span>Academy & coaching</span>
        <span>Travels & transport</span>
        <span>Healthcare</span>
        <span>Facility & utility services</span>
      </div>
    </div>
  );
}

export default Ridsmart;
