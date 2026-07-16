import {
  ArrowRight,
} from "lucide-react";
import HeroVisual from "./HeroVisual";
import "../App.css";
import type { Page } from "../type/Page";

function WhyAlev({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="why-page page-enter">
      <div className="why-grid-background"></div>
      <div className="why-copy">
        <p className="section-label">03 / WHY ALEV</p>
        <h2>
          One partner.
          <br />
          <em>More possibilities.</em>
        </h2>
        <p>
          ALEV is built for organisations and communities looking beyond a
          single transaction. We bring a focused, collaborative approach to
          services that shape everyday progress.
        </p>
        <button className="button why-cta" onClick={go("contact")}>
          Explore a partnership <ArrowRight size={17} />
        </button>
      </div>
      <HeroVisual />
      <div className="why-grid">
        <article>
          <span>01</span>
          <h3>Connected capability</h3>
          <p>
            Access to complementary service verticals gives partners a more
            joined-up way to plan and deliver.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Built for real operations</h3>
          <p>
            We focus on useful solutions—clear coordination, dependable service
            pathways and practical outcomes.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Room to grow</h3>
          <p>
            Our model is designed to support evolving needs, from targeted
            initiatives to longer-term operating relationships.
          </p>
        </article>
      </div>
      <div className="why-bottom">
        <span>
          IDEAL FOR: INSTITUTIONS · BUSINESSES · SERVICE PARTNERS · COMMUNITY
          INITIATIVES
        </span>
        <span>ONE PARTNER · FOUR CONNECTED VERTICALS</span>
      </div>
    </div>
  );
}

export default WhyAlev;
