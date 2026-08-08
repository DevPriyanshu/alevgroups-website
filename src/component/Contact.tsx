import {
  ArrowRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import "../App.css";


function Contact() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service");
  const enquiryLink = service
    ? `mailto:office.alev@gmail.com?subject=${encodeURIComponent(`Service enquiry: ${service}`)}`
    : "mailto:office.alev@gmail.com";

  return (
    <div className="contact-page page-enter">
      <div className="page-grid" aria-hidden="true" />
      <div>
        <p className="section-label">05 / LET'S CONNECT</p>
        <h2>
          Let’s build
          <br />
          what’s <em>next.</em>
        </h2>
        <p className="contact-lead">
          Whether you are seeking a service solution, looking for an operating
          partner, or exploring a collaboration, our team would be glad to hear
          from you.
        </p>
        <p className="contact-note">
          Tell us what you need. We will help identify the right Ridsmart Services solution
          and the next practical step—an easy starting point for a purposeful
          conversation.
        </p>
        {service && <p className="contact-service-selection">Service selected: <strong>{service}</strong></p>}
        <a className="button button-sun" href={enquiryLink}>
          Start a conversation <ArrowRight size={17} />
        </a>
      </div>
      <div className="contact-details">
        <a href="mailto:office.alev@gmail.com">
          <Mail size={19} />
          <span>
            <small>EMAIL</small>office.alev@gmail.com
          </span>
        </a>
        <a href="https://alevgroups.in" target="_blank" rel="noreferrer">
          <Globe2 size={19} />
          <span>
            <small>WEBSITE</small>alevgroups.in
          </span>
        </a>
        <a href="tel:+919123166632">
          <Phone size={19} />
          <span>
            <small>CALL US</small>+91 91231 66632 · +91 72790 77807
            <br />
            +91 99344 91029 · +91 95162 83648
          </span>
        </a>
        <div>
          <MapPin size={19} />
          <span>
            <small>ADMINISTRATIVE OFFICE</small>Gali No. 1, Prithwipur,
            Chirayatand
            <br />
            Patna, Bihar – 800001
          </span>
        </div>
        <div>
          <MapPin size={19} />
          <span>
            <small>REGISTERED OFFICE</small>12, Maa Padmawati Residency, Rau
            <br />
            Indore, M.P. – 453331
          </span>
        </div>
      </div>
    </div>
  );
}

export default Contact;
