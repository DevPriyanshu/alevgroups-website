import { useEffect, useState } from "react";
import {
  ArrowRight,
  Globe2,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import "./App.css";
import Home from "./component/Home";
import About from "./component/About";
import Ridsmart from "./component/Ridsmart";
import Verticals from "./component/Verticals";
import WhyAlev from "./component/WhyAlev";
import Contact from "./component/Contact";
import type { Page } from "./type/Page";


function App() {
  const [page, setPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("ridsmart-theme") === "dark",
  );
  const go = (next: Page) => () => {
    setPage(next);
    setMobileOpen(false);
  };
  const navigation: [Page, string][] = [
    ["home", "Home"],
    ["about", "About"],
    ["verticals", "Services"],
    ["why", "Why ALEV"],
    ["ridsmart", "RIDSMART"],
    // ["contact", "Contact"],
  ];

  useEffect(() => {
    localStorage.setItem("ridsmart-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const translateWindow = window as typeof window & {
      google?: {
        translate?: {
          TranslateElement: new (
            options: { pageLanguage: string; autoDisplay: boolean },
            elementId: string,
          ) => unknown;
        };
      };
      googleTranslateElementInit?: () => void;
    };
    const applyBrowserLanguage = () => {
      const languageSelect = document.querySelector<HTMLSelectElement>(
        "#google_translate_element select.goog-te-combo",
      );
      if (!languageSelect) return false;

      const preferredLanguages = [
        ...(navigator.languages ?? []),
        navigator.language,
      ]
        .filter(Boolean)
        .flatMap((language) => [
          language.toLowerCase(),
          language.split("-")[0].toLowerCase(),
        ]);
      const matchingOption = Array.from(languageSelect.options).find((option) =>
        preferredLanguages.includes(option.value.toLowerCase()),
      );

      if (matchingOption && languageSelect.value !== matchingOption.value) {
        languageSelect.value = matchingOption.value;
        languageSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return true;
    };
    const translateElement = document.querySelector(
      "#google_translate_element",
    );
    let languageObserver: MutationObserver | undefined;
    if (translateElement) {
      languageObserver = new MutationObserver(() => {
        if (applyBrowserLanguage()) languageObserver?.disconnect();
      });
      languageObserver.observe(translateElement, {
        childList: true,
        subtree: true,
      });
    }
    translateWindow.googleTranslateElementInit = () => {
      if (
        translateWindow.google?.translate &&
        !document.querySelector("#google_translate_element .goog-te-gadget")
      ) {
        new translateWindow.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element",
        );
        applyBrowserLanguage();
      }
    };
    if (translateWindow.google?.translate) {
      translateWindow.googleTranslateElementInit();
      return () => languageObserver?.disconnect();
    }
    if (!document.querySelector("script[data-google-translate]")) {
      const script = document.createElement("script");
      script.dataset.googleTranslate = "true";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
    return () => languageObserver?.disconnect();
  }, []);

  return (
    <main className="app-shell" data-theme={darkMode ? "dark" : "light"}>
      <header className="site-header">
        <button
          className="brand brand-button"
          onClick={go("home")}
          aria-label="RIDSMART home"
        >
          <span className="ridsmart-logo">
            <i></i>
            <strong>RID</strong>
            <b>SMART</b>
          </span>
          <small>A UNIT OF ALEV GROUPS</small>
        </button>
        <nav
          id="primary-navigation"
          className={`desktop-nav ${mobileOpen ? "mobile-open" : ""}`}
          aria-label="Primary navigation"
        >
          {navigation.map(([id, label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={go(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="header-tools">
          <div className="language-wrapper">
            <Globe2 size={16} />
            <div id="google_translate_element" className="translate-widget" />
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((mode) => !mode)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="header-cta" onClick={go("contact")}>
            Connect with us <ArrowRight size={15} />
          </button>
          <button
            className="menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="primary-navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <section className={`page-stage page-${page}`} aria-live="polite">
        {page === "home" && <Home go={go} />}
        {page === "about" && <About go={go} />}
        {page === "verticals" && <Verticals go={go} />}
        {page === "why" && <WhyAlev go={go} />}
        {page === "ridsmart" && <Ridsmart go={go} />}
        {page === "contact" && <Contact />}
      </section>
      <footer className="site-footer">
        <div className="footer-brand">
          <span className="ridsmart-logo">
            <i></i>
            <strong>RID</strong>
            <b>SMART</b>
          </span>
          <p>RIDSmart Services — one-stop solutions across essential services.</p>
        </div>
        <address className="footer-info">
          <span className="footer-label">REGISTERED OFFICE</span>
          12, Maa Padmawati Residency, Rau, Indore, M.P. – 453331.
        </address>
        <div className="footer-info footer-identity">
          <span className="footer-label">CORPORATE IDENTITY</span>CIN:
          U85499MP2026PTC084982
          <span className="footer-copyright">© 2026 ALEV</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
