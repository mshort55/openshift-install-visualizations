import type { ReactNode } from "react";
import { actionName, actionOwner, type Journey } from "./model";
import type { Session } from "./session";

export function Detail({
  id,
  title,
  children,
  session,
}: {
  id: string;
  title: string;
  children: ReactNode;
  session: Session;
}) {
  return (
    <details
      open={session.opened.has(id)}
      onToggle={(event) => {
        const open = event.currentTarget.open;
        session.setOpened((current) => {
          if (current.has(id) === open) return current;
          const next = new Set(current);
          if (open) next.add(id);
          else next.delete(id);
          return next;
        });
      }}
    >
      <summary data-focus={`solution-detail-${id}`}>{title}</summary>
      <div className="solution-detail">{children}</div>
    </details>
  );
}
export function Action({
  id,
  children,
  disabled = false,
  onClick,
  secondary = false,
}: {
  id: string;
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <button
      className={secondary ? "solution-button secondary" : "solution-button"}
      type="button"
      data-focus={`solution-${id}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function History({
  journey,
  actions,
}: {
  journey: Journey;
  actions: string[];
}) {
  const attempts = journey.attempts
    .map((attempt, index) => ({ ...attempt, number: index + 1 }))
    .filter((attempt) => actions.includes(attempt.action));
  return attempts.length ? (
    <ol className="solution-evidence" aria-label="Execution attempt history">
      {attempts.map((attempt) => (
        <li key={attempt.number} data-result={attempt.kind}>
          <div className="solution-row">
            <strong>{actionName(attempt.action)}</strong>
            <span
              className="solution-badge"
              data-tone={attempt.kind === "failed" ? "danger" : "success"}
            >
              {attempt.kind === "failed" ? "Failed" : "Passed"}
            </span>
          </div>
          <p>{attempt.evidence}</p>
          <small>
            Simulated attempt {attempt.number} · {actionOwner(attempt.action)} ·{" "}
            <time dateTime={attempt.at}>
              {new Date(attempt.at).toLocaleTimeString()}
            </time>
          </small>
        </li>
      ))}
    </ol>
  ) : (
    <p className="solution-muted">
      No execution evidence yet. These actions are planned.
    </p>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return <p className="solution-notice">{children}</p>;
}
