import { useEffect, useRef, useState } from "react";
import { type DnsAttempt, type DnsRequest, dnsStatus } from "./model";

const records = [
  {
    name: "api.ocp5.dc.example.com",
    lookup: "api.ocp5.dc.example.com",
    address: "10.20.30.10",
  },
  {
    name: "api-int.ocp5.dc.example.com",
    lookup: "api-int.ocp5.dc.example.com",
    address: "10.20.30.10",
  },
  {
    name: "*.apps.ocp5.dc.example.com",
    lookup: "smoke.apps.ocp5.dc.example.com",
    address: "10.20.30.11",
  },
];

const requestText = [
  "Sample request DNS-1042 · Journey J-042",
  "To: DNS team",
  "Publish cluster access records for ocp5.dc.example.com",
  ...records.map((record) => `${record.name} → ${record.address}`),
  "Acceptance: from admin-probe-01, resolve the API, internal API and smoke.apps names through 10.20.10.53 over UDP and TCP. Answers must match the addresses above.",
  "Illustrative request only; no external ticket has been created.",
].join("\n");

function Evidence({ result }: { result: DnsAttempt }) {
  return (
    <table className="sp-dns-evidence">
      <caption>Sample lookups · UDP and TCP have the same result</caption>
      <thead>
        <tr>
          <th>Lookup</th>
          <th>Expected</th>
          <th>Observed</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => {
          const failed = result === "failed" && record.name.startsWith("*");
          return (
            <tr key={record.name}>
              <th scope="row">
                <code>{record.lookup}</code>
              </th>
              <td>
                <span className="sp-dns-mobile-label">Expected</span>
                <code>{record.address}</code>
              </td>
              <td>
                <span className="sp-dns-mobile-label">Observed</span>
                <code>{failed ? "10.20.30.99" : record.address}</code>
                <span
                  className={`sp-dns-check ${failed ? "sp-failed" : "sp-success"}`}
                >
                  {failed ? "! Mismatch" : "✓ Match"}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function DnsHandoff({
  dns,
  update,
  saved,
  save,
  bootPending,
}: {
  dns: DnsRequest;
  update: (dns: DnsRequest) => void;
  saved: boolean;
  save: () => void;
  bootPending: boolean;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const previousKind = useRef(dns.kind);
  const generated = dns.kind !== "needed" && dns.kind !== "generating";
  const fulfilled = generated && dns.kind !== "requested";
  const attempts = "attempts" in dns ? dns.attempts : [];
  const latest = attempts.at(-1);
  const corrected = attempts.includes("failed") && dns.kind !== "failed";
  const stage = !generated ? 0 : !fulfilled ? 1 : 2;

  useEffect(() => {
    if (previousKind.current === dns.kind) return;
    previousKind.current = dns.kind;
    if (dns.kind === "generating" || dns.kind === "verifying") return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [dns.kind]);

  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopyStatus("Request copied.");
    } catch {
      setCopyStatus(
        "Copy is unavailable here. Select the request text below to copy it.",
      );
    }
  };

  return (
    <section
      className="sp-dns"
      aria-labelledby="sp-dns-title"
      data-state={dns.kind}
    >
      <header className="sp-dns-header">
        <span className="sp-label">Prerequisite handoff · DNS team</span>
        <h3 id="sp-dns-title" ref={heading} tabIndex={-1}>
          {!generated
            ? "Turn the cluster plan into a DNS request."
            : dns.kind === "requested"
              ? "A request the DNS team can act on."
              : dns.kind === "fulfilled"
                ? "Publication reported. Now check the answers."
                : dns.kind === "verifying"
                  ? "Check the answers from the client network."
                  : dns.kind === "failed"
                    ? "The report is complete. One answer is wrong."
                    : bootPending
                      ? "DNS verified. One prerequisite remains."
                      : "DNS verified. Evidence stays with the journey."}
        </h3>
        <p>
          Generate the request, record the team’s response, then verify the
          result.
        </p>
      </header>
      <ol className="sp-dns-stages" aria-label="DNS handoff stages">
        {["Generate", "Fulfill", "Verify"].map((label, index) => {
          const done = index < stage || dns.kind === "verified";
          return (
            <li
              key={label}
              data-done={done}
              aria-current={index === stage && !done ? "step" : undefined}
            >
              <span aria-hidden="true">{done ? "✓" : index + 1}</span>
              {label}
            </li>
          );
        })}
      </ol>
      <p className="sp-dns-state" role="status">
        {dnsStatus(dns)}
      </p>

      {!generated ? (
        <div className="sp-dns-body" aria-busy={dns.kind === "generating"}>
          <strong>
            Three records needed for <code>ocp5.dc.example.com</code>
          </strong>
          <p>
            The plan supplies the API address, application address and DNS
            owner. Generate a sample handoff with the requested records and
            acceptance criteria.
          </p>
          <button
            type="button"
            className="sp-primary"
            disabled={dns.kind === "generating"}
            onClick={() => update({ kind: "generating" })}
          >
            {dns.kind === "generating"
              ? "Generating sample request…"
              : "Generate sample DNS request"}
          </button>
        </div>
      ) : (
        <div className="sp-dns-body">
          <details className="sp-dns-artifact" open={dns.kind === "requested"}>
            <summary>
              <span className="sp-label">1 · Generated request</span>
              <strong>DNS-1042 · Publish cluster access records</strong>
            </summary>
            <div className="sp-dns-artifact-body">
              <pre>{requestText}</pre>
              <div className="sp-actions">
                <button type="button" onClick={copyRequest}>
                  Copy request
                </button>
                <span className="sp-muted" role="status">
                  {copyStatus}
                </span>
              </div>
            </div>
          </details>

          {dns.kind === "requested" && (
            <div className="sp-dns-next">
              <strong>The next move belongs to the DNS team.</strong>
              <p>
                The generated request is ready to share. You can leave this
                prerequisite unfinished and return to it within this preview.
              </p>
              <div className="sp-actions">
                <button
                  type="button"
                  className="sp-primary"
                  onClick={() =>
                    update({ kind: "fulfilled", mismatch: false, attempts: [] })
                  }
                >
                  Simulate team fulfillment
                </button>
                {!saved && (
                  <button type="button" onClick={save}>
                    Save incomplete journey
                  </button>
                )}
              </div>
              {saved && (
                <p className="sp-dns-saved">
                  ✓ Saved for later · DNS-1042 and its waiting state stay with
                  the journey as you read other chapters.
                </p>
              )}
            </div>
          )}

          {fulfilled && (
            <details
              className="sp-dns-artifact"
              open={dns.kind === "fulfilled"}
            >
              <summary>
                <span className="sp-label">2 · Fulfillment report</span>
                <strong>
                  DNS team ·{" "}
                  {corrected
                    ? "Correction reported"
                    : "Records reported published"}
                </strong>
              </summary>
              <div className="sp-dns-artifact-body">
                <blockquote>
                  {corrected
                    ? "“The application record has been corrected to 10.20.30.11. Please repeat your checks.”"
                    : "“The API, internal API and application records have been published. Request DNS-1042 is fulfilled.”"}
                </blockquote>
                <p>
                  Illustrative team response. Publication is reported;
                  verification establishes whether the requested answers are
                  available from the selected network.
                </p>
              </div>
            </details>
          )}

          {dns.kind === "fulfilled" && (
            <div className="sp-dns-next">
              <strong>Fulfilled does not yet mean verified.</strong>
              <p>
                Look up the three names from <code>admin-probe-01</code> using
                resolver <code>10.20.10.53</code>.
              </p>
              <label className="sp-checkbox">
                <input
                  type="checkbox"
                  checked={dns.mismatch}
                  onChange={(event) =>
                    update({ ...dns, mismatch: event.target.checked })
                  }
                />
                Try a mismatched application record
              </label>
              <button
                type="button"
                className="sp-primary"
                onClick={() => update({ ...dns, kind: "verifying" })}
              >
                {attempts.length
                  ? "Run sample verification again"
                  : "Run sample DNS verification"}
              </button>
            </div>
          )}

          {(dns.kind === "verifying" ||
            dns.kind === "failed" ||
            dns.kind === "verified") && (
            <div
              className="sp-dns-verification"
              aria-busy={dns.kind === "verifying"}
            >
              <span className="sp-label">3 · Verification evidence</span>
              <h4>
                {dns.kind === "verifying"
                  ? "Running sample verification…"
                  : `Attempt ${attempts.length} · ${dns.kind === "verified" ? "All three lookups matched" : "Application lookup failed"}`}
              </h4>
              <p>
                Probe <code>admin-probe-01</code> → resolver{" "}
                <code>10.20.10.53</code> · admin/client network
              </p>
              {dns.kind === "verifying" ? (
                <div className="sp-dns-checking">
                  <span aria-hidden="true" />
                  Checking API, internal API and application answers over UDP
                  and TCP…
                </div>
              ) : (
                latest && <Evidence result={latest} />
              )}
              <p className="sp-muted">
                Sample evidence only. This scope does not establish target-host
                DNS, BMC connectivity or application readiness.
              </p>
            </div>
          )}

          {dns.kind === "failed" && (
            <div className="sp-dns-next sp-dns-failure">
              <strong>Next owner: DNS team</strong>
              <p>
                The application lookup returned <code>10.20.30.99</code>; the
                request requires <code>10.20.30.11</code>. DNS remains
                incomplete and the journey needs attention.
              </p>
              <button
                type="button"
                className="sp-primary"
                onClick={() =>
                  update({ kind: "fulfilled", mismatch: false, attempts })
                }
              >
                Simulate DNS correction
              </button>
            </div>
          )}
          {dns.kind === "verified" && (
            <div className="sp-result sp-success">
              <strong>✓ External DNS complete</strong>
              <p>
                The requested answers matched within the sample check’s scope.{" "}
                {bootPending
                  ? "Resolve boot access below to finish preparation."
                  : "This evidence is retained through installation and post-installation."}
              </p>
            </div>
          )}
          {attempts.length > 0 && (
            <details className="sp-disclosure">
              <summary>
                Verification history · {attempts.length}{" "}
                {attempts.length === 1 ? "attempt" : "attempts"}
              </summary>
              {attempts.map((attempt, index) => (
                // Attempts are append-only within this illustrative request.
                // biome-ignore lint/suspicious/noArrayIndexKey: The ordinal is the stable attempt identity.
                <div className="sp-dns-attempt" key={index}>
                  <strong>
                    Attempt {index + 1} ·{" "}
                    {attempt === "passed" ? "Passed" : "Failed"}
                  </strong>
                  <Evidence result={attempt} />
                </div>
              ))}
            </details>
          )}
        </div>
      )}
      <footer className="sp-dns-footer">
        Simulation only · no ticket is sent and no live DNS query runs.
      </footer>
    </section>
  );
}
