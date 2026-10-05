import { useEffect, useState } from "react";
import {
  type Catalog,
  type DecisionId,
  decodeAnswers,
  encodeAnswers,
  type OptionId,
  type Walk,
  type WalkStep,
  walk,
  withAnswer,
} from "./catalog";

export interface WalkViewProps {
  readonly walk: Walk;
  readonly onAnswer: (decision: DecisionId, option: OptionId) => void;
}

function titles(current: Walk): Map<string, string> {
  return new Map(
    current.steps.map((step) => [step.decision.id, step.decision.title]),
  );
}

function Step({
  step,
  because,
  onAnswer,
}: {
  readonly step: WalkStep;
  readonly because: readonly string[];
  readonly onAnswer: (decision: DecisionId, option: OptionId) => void;
}) {
  const citation = step.decision.citations[0];
  return (
    <li className="step">
      <p className="step-kicker">
        {step.index + 1}.{" "}
        {step.decision.stance === "fact" ? "Environment" : "Choice"}
      </p>
      <h3>{step.decision.title}</h3>
      <p>{step.decision.prompt}</p>
      <div className="options">
        {step.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="option"
            aria-pressed={option.id === step.chosen}
            onClick={() => onAnswer(step.decision.id, option.id)}
          >
            <span className="option-label">{option.label}</span>
            <span className="option-summary">{option.summary}</span>
          </button>
        ))}
      </div>
      <p className="rationale">{step.decision.defaultRationale}</p>
      {because.length > 0 ? (
        <p className="because">Shown because of {because.join(", ")}.</p>
      ) : null}
      <p className="citation">
        <a href={citation.url} rel="noreferrer">
          {citation.locator}
        </a>
      </p>
    </li>
  );
}

export function WalkView({ walk: current, onAnswer }: WalkViewProps) {
  const byId = titles(current);
  return (
    <div className="walk">
      {current.sections.map((section) => (
        <section key={section.id}>
          <h2>{section.title}</h2>
          <ol>
            {current.steps
              .filter((step) => step.decision.section === section.id)
              .map((step) => (
                <Step
                  key={step.decision.id}
                  step={step}
                  because={step.because.map((id) => byId.get(id) ?? id)}
                  onAnswer={onAnswer}
                />
              ))}
          </ol>
        </section>
      ))}
      {current.dormant.length > 0 ? (
        <p className="dormant">
          {current.dormant.length} earlier{" "}
          {current.dormant.length === 1 ? "answer is" : "answers are"} saved and
          return if this path includes them again.
        </p>
      ) : null}
    </div>
  );
}

export function App({ catalog }: { readonly catalog: Catalog }) {
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash.replace(/^#/, ""),
  );
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const answers = decodeAnswers(catalog, hash);
  const current = walk(catalog, answers);
  return (
    <main className="page">
      <header>
        <p className="release">
          OpenShift Container Platform {catalog.release}
        </p>
        <h1>Bare metal install decisions</h1>
        <p className="lede">
          These are the decisions named by the installation overview. Defaults
          are the shortest path. A connected network uses the Assisted
          Installer. Choosing installer-provisioned infrastructure adds the
          ingress load balancer question.
        </p>
        <p>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              window.location.hash = "";
              setHash("");
            }}
          >
            Reset to defaults
          </button>
        </p>
      </header>
      <WalkView
        walk={current}
        onAnswer={(decision, option) => {
          const next = encodeAnswers(
            walk(catalog, withAnswer(answers, decision, option)),
          );
          if (next === hash) return;
          window.location.hash = next;
          setHash(next);
        }}
      />
    </main>
  );
}
