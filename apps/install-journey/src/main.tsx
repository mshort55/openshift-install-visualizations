import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("The journey app needs a root element.");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
