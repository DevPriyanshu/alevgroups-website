import {
  ArrowRight,
} from "lucide-react";
import HeroVisual from "./HeroVisual";
import "../App.css";

type Page = "home" | "about" | "verticals" | "why" | "ridsmart" | "contact";

function Home({ go }: { go: (page: Page) => () => void }) {
  return (
    <div className="hero-page page-enter">
      <div className="hero-grid"></div>
      <div className="hero-copy">
        <p className="eyebrow company-name">
          <span></span>Asha Logistics and Educational Ventures
        </p>
        <h1>
          Built to move
          <br />
          <em>possibility</em> forward.
        </h1>
        <p className="hero-text">
          One-stop solutions for academy & coaching, travels & transport,
          healthcare, facility management and utility services.
        </p>
        <p className="audience-line">
          For institutions · enterprises · communities · everyday life
        </p>
        <div className="hero-actions">
          <button className="button button-dark" onClick={go("verticals")}>
            Explore our verticals <ArrowRight size={17} />
          </button>
          <button className="text-link" onClick={go("about")}>
            Discover ALEV <ArrowRight size={17} />
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
        <span>ONE COMPANY. MULTIPLE POSSIBILITIES.</span>
        <span>
          INDIA <b>•</b> 2026
        </span>
      </div>
    </div>
  );
}

export default Home;
