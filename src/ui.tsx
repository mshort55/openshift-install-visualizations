import { useEffect, useState } from "react";
import {
  type Catalog,
  type DecisionId,
  decodeAnswers,
  encodeAnswers,
  type OptionId,
  walk,
  withAnswer,
} from "./catalog";
import { decisionTree, type TreeDecision, type TreeOption } from "./tree";

function OptionBranch({
  option,
  onAnswer,
  decision,
}: {
  readonly option: TreeOption;
  readonly decision: DecisionId;
  readonly onAnswer: (decision: DecisionId, option: OptionId) => void;
}) {
  return (
    <div className={option.selected ? "branch" : "branch branch-idle"}>
      <button
        type="button"
        className="option"
        aria-pressed={option.selected}
        aria-label={option.label}
        data-decision={decision}
        data-option={option.id}
        onClick={() => onAnswer(decision, option.id)}
      >
        <span className="option-label">{option.label}</span>
        <span className="option-summary">{option.summary}</span>
      </button>
      {option.children.length > 0 ? (
        <div className="children">
          <p className="leads">Leads to</p>
          {option.children.map((child) => (
            <DecisionNode key={child.id} node={child} onAnswer={onAnswer} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DecisionNode({
  node,
  onAnswer,
}: {
  readonly node: TreeDecision;
  readonly onAnswer: (decision: DecisionId, option: OptionId) => void;
}) {
  return (
    <article
      className={node.active ? "decision" : "decision decision-idle"}
      data-decision={node.id}
      data-active={node.active ? "true" : "false"}
    >
      <h3>{node.title}</h3>
      <p>{node.prompt}</p>
      <div className="options">
        {node.options.map((option) => (
          <OptionBranch
            key={option.id}
            option={option}
            decision={node.id}
            onAnswer={onAnswer}
          />
        ))}
      </div>
      <p className="rationale">{node.rationale}</p>
      <p className="citation">
        <a href={node.url} rel="noreferrer">
          {node.locator}
        </a>
      </p>
    </article>
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
  const tree = decisionTree(catalog, answers);
  return (
    <main className="page">
      <header>
        <p className="release">
          OpenShift Container Platform {catalog.release}
        </p>
        <h1>Agent-based bare metal decisions</h1>
        <p className="lede">
          Every branch is an Agent-based Installer choice. A choice that opens
          more work shows those decisions underneath it. Defaults are the
          shortest path: platform baremetal, DHCP, a full ISO, and the default
          br-ex bridge.
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
      <div className="tree">
        {tree.roots.map((node) => (
          <DecisionNode
            key={node.id}
            node={node}
            onAnswer={(decision, option) => {
              const next = encodeAnswers(
                walk(catalog, withAnswer(answers, decision, option)),
              );
              if (next === hash) return;
              window.location.hash = next;
              setHash(next);
            }}
          />
        ))}
      </div>
    </main>
  );
}
