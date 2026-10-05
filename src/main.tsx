import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import rawCatalog from "../data/bare-metal-4.22.json";
import { parseCatalog } from "./catalog";
import "./styles.css";
import { App } from "./ui";

const root = document.querySelector("#root");
if (!root) throw new Error("missing #root");

const parsed = parseCatalog(rawCatalog);
if (!parsed.ok) {
  root.textContent = parsed.issues
    .map((issue) => `${issue.kind} ${issue.path}`)
    .join("\n");
} else {
  createRoot(root).render(
    <StrictMode>
      <App catalog={parsed.value} />
    </StrictMode>,
  );
}
