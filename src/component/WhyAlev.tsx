import { ArrowRight } from "lucide-react";
import "../App.css";
import type { Page } from "../type/Page";

function WhyAlev({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="why-page page-enter">
      <div className="why-grid-background"></div>
      <div className="why-intro">
        <div className="why-copy">
          <p className="section-label why-section-label">03 / WHY RIDSMART SERVICES</p>
          <h2>
            One partner.
            <br />
            <em>More possibilities.</em>
          </h2>
        </div>
        <div className="why-story">
          <p className="why-lead">
            Ridsmart Services is built for organisations and communities looking beyond
            a single transaction. We bring a focused, collaborative approach to
            services that shape everyday progress.
          </p>
          <p className="why-detail">
            We make complex service needs easier to navigate by bringing the
            right people, processes and partners into one accountable framework.
            That means less time coordinating and more confidence in the
            outcome.
          </p>
          <button className="button why-cta" onClick={go("contact")}>
            Explore a partnership <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="why-proof" aria-label="Ridsmart Services strengths">
        <span>
          <b>4</b> connected service verticals
        </span>
        <span>
          <b>1</b> accountable point of contact
        </span>
        <span>
          <b>∞</b> room for practical progress
        </span>
      </div>
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
        <article>
          <span>04</span>
          <h3>People-first partnership</h3>
          <p>
            We listen closely, communicate clearly and build service
            relationships that remain useful as needs change.
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
