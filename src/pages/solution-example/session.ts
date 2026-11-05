import { useEffect, useState } from "react";
import type { DnsAttempt, DnsRequest, Snapshot } from "./model";

/** Keeps the illustrative journey alive while navigating the app. */
export function useSolutionSession() {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    kind: "draft",
    dns: { kind: "needed" },
  });
  useEffect(() => {
    const dns = snapshot.dns;
    if (dns.kind !== "generating" && dns.kind !== "verifying") return;
    // Brief simulated work makes the request and verification transitions visible.
    const timer = window.setTimeout(
      () => {
        setSnapshot((current) => {
          if (
            current.dns !== dns ||
            (current.kind !== "draft" && current.kind !== "saved")
          )
            return current;
          if (dns.kind === "generating")
            return { ...current, dns: { kind: "requested" } };
          const attempts: DnsAttempt[] = [
            ...dns.attempts,
            dns.mismatch ? "failed" : "passed",
          ];
          return {
            ...current,
            dns: { kind: dns.mismatch ? "failed" : "verified", attempts },
          };
        });
      },
      dns.kind === "generating" ? 600 : 1000,
    );
    return () => window.clearTimeout(timer);
  }, [snapshot.dns]);
  const updateDns = (dns: DnsRequest) => {
    setSnapshot((current) =>
      current.kind === "draft" || current.kind === "saved"
        ? { ...current, dns }
        : current,
    );
  };
  return { snapshot, setSnapshot, updateDns };
}

export type SolutionSession = ReturnType<typeof useSolutionSession>;
