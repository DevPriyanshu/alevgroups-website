import { ArrowRight } from "lucide-react";
import HeroVisual from "./HeroVisual";
import "../App.css";
import type { Page } from "../type/Page";

function Home({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="hero-page page-enter">
      <div className="hero-grid"></div>
      <div className="hero-copy">
        <p className="section-label company-name">
          <span aria-hidden="true" />
          00 / RIDSMART SERVICES · ASHA LOGISTICS AND EDUCATIONAL VENTURES
        </p>
        <h1>
          Built to move
          <br />
          <em>possibility</em> forward.
        </h1>
        <p className="hero-text">
          One connected partner for essential services that move everyday life
          forward.
        </p>
        <div
          className="audience-line"
          aria-label="Built for institutions, enterprises, communities, and everyday life"
        >
          <span className="audience-label">Built for</span>
          <span>Institutions</span>
          <span>Enterprises</span>
          <span>Communities</span>
          <span>Everyday life</span>
        </div>
        <div className="hero-actions">
          <button className="button button-dark" onClick={go("verticals")}>
            Explore Our Verticals <ArrowRight size={17} />
          </button>
          <button className="text-link" onClick={go("about")}>
            Discover Ridsmart Services <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <HeroVisual />
      <div className="home-proof">
        <span>
          <b>4</b> integrated service verticals
        </span>
        <span>
          <b>1</b> committed partner ecosystem
        </span>
        <span>
          <b>∞</b> possibilities to build
        </span>
      </div>
      <div className="hero-footer">
        <span>RIDSMART SERVICES · CONNECTED POSSIBILITIES.</span>
        <span>
          INDIA <b>•</b> 2026
        </span>
      </div>
    </div>
  );
}

export default Home;
