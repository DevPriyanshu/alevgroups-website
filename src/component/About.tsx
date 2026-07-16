import {
  ArrowRight,
  Building2,
  CircleCheck,
  ShieldCheck,
} from "lucide-react";
import "../App.css";
import type { Page } from "../type/Page";


function About({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="content-page about-page page-enter">
      <p className="section-label">01 / WHO WE ARE</p>
      <div className="intro-content">
        <h2>A thoughtful foundation for services that matter.</h2>
        <div>
          <p>
            Asha Logistics and Educational Ventures Private Limited brings
            high-value, modern service solutions into one purposeful ecosystem.
            From academy and coaching initiatives to transport frameworks,
            diagnostics and smart facility services, we build practical pathways
            to progress.
          </p>
          <button className="text-link" onClick={go("contact")}>
            Start a conversation <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="purpose-row">
        <article>
          <span>OUR PURPOSE</span>
          <p>
            To make essential services more accessible, responsive and connected
            for people, institutions and growing communities.
          </p>
        </article>
        <article>
          <span>OUR APPROACH</span>
          <p>
            We combine practical operations, capable partnerships and
            digital-first thinking to turn everyday needs into dependable
            solutions.
          </p>
        </article>
      </div>
      <div className="company-strip">
        <div>
          <Building2 size={21} />
          <span>Incorporated under the Companies Act, 2013</span>
        </div>
        <div>
          <ShieldCheck size={21} />
          <span>CIN: U85499MP2026PTC084982</span>
        </div>
        <div>
          <CircleCheck size={21} />
          <span>Company limited by shares</span>
        </div>
      </div>
    </div>
  );
}

export default About;