import { useCallback, useEffect, useState } from "react";
import {
  type Event,
  type Journey,
  journeySchema,
  newJourney,
  storageKey,
  updateJourney,
} from "./model";

function restore() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return { journey: newJourney(), error: "" };
    const parsed = journeySchema.safeParse(JSON.parse(stored));
    if (parsed.success) return { journey: parsed.data, error: "" };
    return {
      journey: newJourney(),
      error:
        "The saved example could not be read. Reset example to start a new saved copy.",
    };
  } catch {
    return {
      journey: newJourney(),
      error:
        "Browser storage is unavailable. Changes may not survive a refresh.",
    };
  }
}

export function useSolutionSession() {
  const [loaded] = useState(restore);
  const [journey, setJourney] = useState(loaded.journey);
  const [persistence, setPersistence] = useState<{
    kind: string;
    message: string;
    journey: Journey | null;
  }>({
    journey: null,
    kind: "pending",
    message: loaded.error || "Saving in this browser…",
  });
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const dispatch = useCallback(
    (event: Event) => setJourney((current) => updateJourney(current, event)),
    [],
  );
  useEffect(() => {
    if (journey === loaded.journey && loaded.error) {
      setPersistence({ kind: "error", message: loaded.error, journey });
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(journey));
      setPersistence({
        kind: "saved",
        message: "Saved in this browser",
        journey,
      });
    } catch {
      setPersistence({
        kind: "error",
        journey,
        message:
          "Not saved — browser storage is unavailable or full. Keep this tab open; use Retry saving.",
      });
    }
  }, [journey, loaded]);
  useEffect(() => {
    if (
      !["preparing-media", "booting", "observing"].includes(
        journey.installation,
      )
    )
      return;
    const timer = window.setTimeout(
      () => dispatch({ kind: "tick-installation" }),
      1100,
    );
    return () => window.clearTimeout(timer);
  }, [journey.installation, dispatch]);
  return {
    journey,
    dispatch,
    opened,
    setOpened,
    persistence:
      persistence.journey === journey
        ? persistence
        : { kind: "pending", message: "Saving in this browser…" },
    retrySave: () => setJourney((current) => structuredClone(current)),
    reset: () => {
      setJourney(newJourney());
      setOpened(new Set());
    },
  };
}
export type Session = ReturnType<typeof useSolutionSession>;
