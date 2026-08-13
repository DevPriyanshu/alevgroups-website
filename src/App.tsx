import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleCheck,
  ChevronDown,
  ChevronUp,
  Languages,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import "./App.css";
import Home from "./component/Home";
import About from "./component/About";
import Solutions from "./component/Solutions";
import Verticals, { Applications } from "./component/Verticals";
import WhyAlev from "./component/WhyAlev";
import Contact from "./component/Contact";
import type { Page } from "./type/Page";

const indianLanguages = [
  ["as", "অসমীয়া"],
  ["bn", "বাংলা"],
  ["brx", "बड़ो"],
  ["doi", "डोगरी"],
  ["gu", "ગુજરાતી"],
  ["hi", "हिन्दी"],
  ["kn", "ಕನ್ನಡ"],
  ["ks", "کٲشُر"],
  ["gom", "कोंकणी"],
  ["mai", "मैथिली"],
  ["ml", "മലയാളം"],
  ["mni-Mtei", "মৈতৈলোন্"],
  ["mr", "मराठी"],
  ["ne", "नेपाली"],
  ["or", "ଓଡ଼ିଆ"],
  ["pa", "ਪੰਜਾਬੀ"],
  ["sa", "संस्कृतम्"],
  ["sat", "ᱥᱟᱱᱛᱟᱲᱤ"],
  ["sd", "سنڌي"],
  ["ta", "தமிழ்"],
  ["te", "తెలుగు"],
  ["ur", "اردو"],
] as const;

const languageOptions = [["en", "English"], ...indianLanguages] as const;

const pagePaths: Record<Page, string> = {
  home: "/home",
  about: "/about",
  verticals: "/services",
  why: "/why-alevgroupss",
  solutions: "/solutions",
  contact: "/contact",
};

const pathPages: Record<string, Page> = Object.fromEntries(
  Object.entries(pagePaths).map(([page, path]) => [path, page as Page]),
) as Record<string, Page>;

type GoToPage = (page: Page) => () => void;
type PageComponent = ComponentType<{ go: GoToPage }>;

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string,
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function PageLoader() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const loaderTimeout = window.setTimeout(() => setIsPageLoading(false), 420);
    return () => window.clearTimeout(loaderTimeout);
  }, []);

  if (!isPageLoading) return null;

  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader-mark" aria-hidden="true">A</span>
      <span className="page-loader-spinner" aria-hidden="true" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function RoutedPage({ Component }: { Component: PageComponent }) {
  const go = useOutletContext<GoToPage>();
  return <Component go={go} />;
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = pathPages[location.pathname] ?? "home";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [translatorReady, setTranslatorReady] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showContactToast, setShowContactToast] = useState(false);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(
    () => sessionStorage.getItem("alevgroupss-welcome-seen") !== "true",
  );
  const languageControlRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("alevgroupss-theme") === "dark",
  );
  const go = (next: Page) => () => {
    if (next === page) {
      setMobileOpen(false);
      return;
    }
    navigate(pagePaths[next]);
    setMobileOpen(false);
  };
  const handleContactClick = () => {
    if (page === "contact") {
      setShowContactToast(true);
      return;
    }

    go("contact")();
  };
  const closeWelcomePrompt = () => {
    sessionStorage.setItem("alevgroupss-welcome-seen", "true");
    setShowWelcomePrompt(false);
  };
  const navigation: [Page, string][] = [
    ["home", "Home"],
    ["about", "About"],
    ["verticals", "Services"],
    ["why", "Why Ridsmart Services"],
    ["solutions", "Solutions"],
    ["contact", "Contact"],
  ];

  useEffect(() => {
    localStorage.setItem("alevgroupss-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!showContactToast) return;

    const toastTimeout = window.setTimeout(() => setShowContactToast(false), 4000);
    return () => window.clearTimeout(toastTimeout);
  }, [showContactToast]);

  useEffect(() => {
    const initializeTranslator = () => {
      if (!window.google?.translate || document.querySelector("#google_translate_element select")) {
        setTranslatorReady(Boolean(document.querySelector("#google_translate_element select")));
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: indianLanguages.map(([code]) => code).join(","),
          autoDisplay: false,
        },
        "google_translate_element",
      );
      setTranslatorReady(true);
    };

    window.googleTranslateElementInit = initializeTranslator;

    if (window.google?.translate) {
      initializeTranslator();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-translate="true"]',
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.dataset.googleTranslate = "true";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const closeLanguageMenu = (event: MouseEvent) => {
      if (!languageControlRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };

    document.addEventListener("mousedown", closeLanguageMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeLanguageMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const translatePage = (language: string) => {
    const googleSelect = document.querySelector<HTMLSelectElement>(
      "#google_translate_element select.goog-te-combo",
    );
    if (!googleSelect) return;

    // An empty Google Translate value restores the original English content.
    googleSelect.value = language === "en" ? "" : language;
    googleSelect.dispatchEvent(new Event("change"));
    setSelectedLanguage(language);
    setLanguageOpen(false);
  };

  const selectedLanguageLabel = languageOptions.find(([code]) => code === selectedLanguage)?.[1] ?? "English";

  return (
    <main
      className={`app-shell page-${page}`}
      data-theme={darkMode ? "dark" : "light"}
    >
      <PageLoader key={location.key} />
      {showWelcomePrompt && (
        <div className="welcome-prompt" role="presentation">
          <section
            className="welcome-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            aria-describedby="welcome-description"
          >
            <span className="welcome-icon" aria-hidden="true"><Sparkles size={19} /></span>
            <p className="welcome-kicker">
              RIDSMART SERVICES · ASHA LOGISTICS AND EDUCATIONAL VENTURES
            </p>
            <h2 id="welcome-title">We’re building what’s next.</h2>
            <p id="welcome-description">
              Ridsmart Services is building an application to make service journeys
              simpler, more connected and more useful for every community we serve.
            </p>
            <p className="welcome-note">
              We’re excited to share more soon. Please close this message once
              you’ve read it and explore Ridsmart Services at your own pace.
            </p>
            <button className="welcome-close" type="button" onClick={closeWelcomePrompt}>
              I’ve read this <Check size={16} aria-hidden="true" />
            </button>
          </section>
        </div>
      )}
      {showContactToast && (
        <div className="contact-toast" role="status" aria-live="polite">
          <CircleCheck size={20} aria-hidden="true" />
          <div>
            <strong>You’re already on the Connect with us page.</strong>
            <span>Choose an option below and our team will be happy to hear from you.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowContactToast(false)}
            aria-label="Dismiss message"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      <header className="site-header">
        <button
          className="brand brand-button"
          onClick={go("home")}
          aria-label="Ridsmart Services home"
        >
          <img className="brand-logo" src="/brand/ridsmart-services-alevgroupss-logo-blue-orange.png" alt="Ridsmart Services, an alevgroupss company" />
        </button>
        <nav
          id="primary-navigation"
          className={`desktop-nav ${mobileOpen ? "mobile-open" : ""}`}
          aria-label="Primary navigation"
        >
          {navigation.map(([id, label]) => (
            <NavLink
              key={id}
              to={pagePaths[id]}
              end={id === "home"}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
          <div className="header-tools">
            <div className="language-control" ref={languageControlRef}>
              <button
                className="language-trigger"
                type="button"
                disabled={!translatorReady}
                onClick={() => setLanguageOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={languageOpen}
                aria-controls="language-options"
              >
                <Languages size={15} aria-hidden="true" />
                <span className="language-trigger-copy">
                  <small>{translatorReady ? "Language" : "Loading languages"}</small>
                  <strong>{selectedLanguageLabel}</strong>
                </span>
                <ChevronDown className={languageOpen ? "language-chevron-open" : ""} size={14} aria-hidden="true" />
              </button>
              {languageOpen && (
                <div className="language-menu" id="language-options" role="listbox" aria-label="Choose language">
                  <div className="language-menu-heading">Choose your language</div>
                  <div className="language-options">
                    {languageOptions.map(([code, label]) => (
                      <button
                        key={code}
                        type="button"
                        role="option"
                        aria-selected={selectedLanguage === code}
                        className={selectedLanguage === code ? "selected" : ""}
                        onClick={() => translatePage(code)}
                      >
                        <span>{label}</span>
                        {selectedLanguage === code && <Check size={14} aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
          <button
            className="header-cta"
            onClick={handleContactClick}
            aria-label="Contact us"
          >
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
        <Outlet context={go} />
      </section>
      <footer className={`site-footer ${footerOpen ? "footer-open" : "footer-closed"}`}>
        <button
          className="footer-toggle"
          type="button"
          onClick={() => setFooterOpen((open) => !open)}
          aria-expanded={footerOpen}
          aria-controls="site-footer-content"
        >
          {footerOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          {footerOpen ? "Hide footer" : "Show footer"}
        </button>
        <div id="site-footer-content" className="footer-content">
          <div className="footer-brand">
            <img className="footer-logo" src="/brand/ridsmart-services-alevgroupss-logo-blue-orange.png" alt="Ridsmart Services, an alevgroupss company" />
            <p>Ridsmart Services — connected solutions for essential services.</p>
          </div>
          <address className="footer-info">
            <span className="footer-label">REGISTERED OFFICE</span>
            12, Maa Padmawati Residency, Rau, Indore, M.P. – 453331.
          </address>
          <div className="footer-info footer-identity">
            <span className="footer-label">CORPORATE IDENTITY</span>CIN:
            U85499MP2026PTC084982
            <span className="footer-copyright">© 2026 Ridsmart Services</span>
          </div>
        </div>
      </footer>
      <div id="google_translate_element" className="google-translate-element" aria-hidden="true" />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<RoutedPage Component={Home} />} />
          <Route path="/about" element={<RoutedPage Component={About} />} />
          <Route path="/services" element={<RoutedPage Component={Verticals} />} />
          <Route path="/ridsmart-services-app" element={<Navigate to="/ridsmart-services-app/academy-coaching" replace />} />
          <Route path="/ridsmart-services-app/:service" element={<Applications />} />
          <Route path="/applications" element={<Navigate to="/ridsmart-services-app" replace />} />
          <Route path="/applications/*" element={<Navigate to="/ridsmart-services-app" replace />} />
          <Route path="/why-alevgroupss" element={<RoutedPage Component={WhyAlev} />} />
          <Route path="/solutions" element={<RoutedPage Component={Solutions} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
