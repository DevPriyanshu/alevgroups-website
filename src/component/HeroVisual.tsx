import {
  GraduationCap,
  HeartPulse,
  Truck,
} from "lucide-react";
import "../App.css";


function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="globe">
        <div className="globe-ring ring-one"></div>
        <div className="globe-ring ring-two"></div>
        <div className="globe-core">A</div>
      </div>
      <div className="floating-card card-education">
        <GraduationCap size={19} />
        <span>Education</span>
      </div>
      <div className="floating-card card-logistics">
        <Truck size={19} />
        <span>Logistics</span>
      </div>
      <div className="floating-card card-health">
        <HeartPulse size={19} />
        <span>Healthcare</span>
      </div>
    </div>
  );
}

export default HeroVisual;