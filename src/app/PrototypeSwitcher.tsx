import { useEffect } from "react";
import {
  type PrototypeVariant,
  variants,
} from "../pages/journey/solution-prototype/model";

/** Development-only controls for comparing the throwaway solution compositions. */
export function PrototypeSwitcher({
  variant,
  onVariant,
}: {
  variant: PrototypeVariant;
  onVariant: (variant: PrototypeVariant) => void;
}) {
  const index = variants.findIndex((item) => item.key === variant);
  const cycle = (direction: number) => {
    const next =
      variants[(index + direction + variants.length) % variants.length];
    if (next) onVariant(next.key);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented
      )
        return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(
          "input, textarea, select, [contenteditable], [role=slider], [role=tablist]",
        )
      )
        return;
      if (
        event.target instanceof HTMLElement &&
        event.target.matches(".sp-lane-scroll")
      )
        return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const next =
          variants[
            (index + (event.key === "ArrowLeft" ? -1 : 1) + variants.length) %
              variants.length
          ];
        if (next) onVariant(next.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onVariant]);
  if (!import.meta.env.DEV) return null;
  return (
    <nav className="sp-switcher" aria-label="Prototype alternatives">
      <span className="sp-switcher-label">Compare layouts</span>
      <button
        type="button"
        onClick={() => cycle(-1)}
        aria-label="Previous layout"
      >
        ←
      </button>
      <div>
        {variants.map((item) => (
          <button
            type="button"
            key={item.key}
            aria-pressed={variant === item.key}
            onClick={() => onVariant(item.key)}
          >
            <b>{item.key}</b>
            <span>{item.name}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={() => cycle(1)} aria-label="Next layout">
        →
      </button>
      <small>← → keys</small>
    </nav>
  );
}
