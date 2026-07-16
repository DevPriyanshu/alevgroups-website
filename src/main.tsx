import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const redirectedPath = new URLSearchParams(window.location.search).get("redirect");

if (redirectedPath?.startsWith("/")) {
  window.history.replaceState(null, "", redirectedPath);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
