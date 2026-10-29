import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  type Catalog,
  type DecisionId,
  decodeAnswers,
  encodeSelection,
  type OptionId,
  pruneAnswers,
  withAnswer,
} from "./catalog";
import {
  decisionTree,
  type TreeDecision,
  type TreeMode,
  type TreeOption,
} from "./tree";

interface ScrollAnchor {
  readonly decision: string;
  readonly option: string;
  readonly top: number;
  readonly scrollY: number;
}

function readMode(): TreeMode {
  if (typeof window === "undefined") return "path";
  return new URLSearchParams(window.location.search).get("view") === "map"
    ? "map"
    : "path";
}

function readHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.replace(/^#/, "");
}

function writeLocation(hash: string, mode: TreeMode, replace: boolean) {
  const params = new URLSearchParams(window.location.search);
  if (mode === "map") params.set("view", "map");
  else params.delete("view");
  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
}

function OptionBranch({
  option,
  onAnswer,
  onClear,
  decision,
}: {
  readonly option: TreeOption;
  readonly decision: DecisionId;
  readonly onAnswer: (
    decision: DecisionId,
    option: OptionId,
    button: HTMLButtonElement,
  ) => void;
  readonly onClear: (decision: DecisionId) => void;
}) {
  return (
    <div
      className={
        option.muted
          ? "branch branch-idle branch-muted"
          : option.selected
            ? "branch"
            : "branch branch-idle"
      }
    >
      <button
        type="button"
        className={option.muted ? "option option-muted" : "option"}
        aria-pressed={option.selected}
        aria-label={option.label}
        data-decision={decision}
        data-option={option.id}
        disabled={!option.enabled}
        onClick={(event) => onAnswer(decision, option.id, event.currentTarget)}
      >
        <span className="option-label">{option.label}</span>
        <span className="option-summary">{option.summary}</span>
      </button>
      {option.selected ? (
        <p className="example">
          <span className="example-label">Example</span>
          <code>{option.example}</code>
        </p>
      ) : null}
      {option.children.length > 0 ? (
        <div className="children">
          <p className="leads">Leads to</p>
          {option.children.map((child) => (
            <DecisionNode
              key={child.id}
              node={child}
              onAnswer={onAnswer}
              onClear={onClear}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DecisionNode({
  node,
  onAnswer,
  onClear,
}: {
  readonly node: TreeDecision;
  readonly onAnswer: (
    decision: DecisionId,
    option: OptionId,
    button: HTMLButtonElement,
  ) => void;
  readonly onClear: (decision: DecisionId) => void;
}) {
  return (
    <article
      className={node.active ? "decision" : "decision decision-idle"}
      data-decision={node.id}
      data-active={node.active ? "true" : "false"}
    >
      <h3>{node.title}</h3>
      {node.nmstate === "networkConfig" ? (
        <p className="nmstate">
          <span className="nmstate-mark">NMState</span> Written in the host
          networkConfig.
        </p>
      ) : null}
      {node.nmstate === "nncp" ? (
        <p className="nmstate">
          <span className="nmstate-mark">NMState</span> Written in a
          NodeNetworkConfigurationPolicy after installation.
        </p>
      ) : null}
      <p>{node.prompt}</p>
      <div className="options">
        {node.options.map((option) => (
          <OptionBranch
            key={option.id}
            option={option}
            decision={node.id}
            onAnswer={onAnswer}
            onClear={onClear}
          />
        ))}
      </div>
      {node.answered ? (
        <p>
          <button
            type="button"
            className="text-button"
            aria-label={`Clear ${node.title} selection`}
            onClick={() => onClear(node.id)}
          >
            Clear selection
          </button>
        </p>
      ) : null}
      {node.options.some((option) => option.selected && option.isDefault) ? (
        <p className="rationale">{node.rationale}</p>
      ) : null}
      <p className="citation">
        <a href={node.url} rel="noreferrer">
          {node.locator}
        </a>
      </p>
    </article>
  );
}

export function App({
  catalog,
  initialView,
  initialHash,
}: {
  readonly catalog: Catalog;
  readonly initialView?: TreeMode;
  readonly initialHash?: string;
}) {
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? (initialHash ?? "") : readHash(),
  );
  const [mode, setMode] = useState<TreeMode>(initialView ?? readMode);
  const anchorRef = useRef<ScrollAnchor | null>(null);
  useEffect(() => {
    const sync = () => {
      setHash(readHash());
      setMode(readMode());
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);
  const answers = useMemo(
    () => pruneAnswers(catalog, decodeAnswers(catalog, hash)),
    [catalog, hash],
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = encodeSelection(catalog, answers);
    if (next === hash) return;
    writeLocation(next, mode, true);
    setHash(next);
  }, [answers, catalog, hash, mode]);
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || typeof window === "undefined") return;
    anchorRef.current = null;
    const apply = () => {
      const button = document.querySelector(
        `button[data-decision="${CSS.escape(anchor.decision)}"][data-option="${CSS.escape(anchor.option)}"]`,
      );
      if (!button) {
        window.scrollTo(0, anchor.scrollY);
        return;
      }
      const top = button.getBoundingClientRect().top;
      if (Math.abs(top - anchor.top) > 1) window.scrollBy(0, top - anchor.top);
    };
    apply();
    requestAnimationFrame(apply);
  });
  const tree = decisionTree(catalog, answers, mode);
  const remember = (
    decision: DecisionId,
    option: OptionId,
    button: HTMLButtonElement,
  ) => {
    anchorRef.current = {
      decision,
      option,
      top: button.getBoundingClientRect().top,
      scrollY: window.scrollY,
    };
  };
  const publish = (nextHash: string, nextMode: TreeMode) => {
    writeLocation(nextHash, nextMode, false);
    setHash(nextHash);
    setMode(nextMode);
  };
  return (
    <main className="page">
      <header>
        <p className="release">
          OpenShift Container Platform {catalog.release}
        </p>
        <h1>Agent-based bare metal decisions</h1>
        <p className="lede">
          Nothing starts selected. Step through reveals the next decision after
          you choose. See every option keeps the other choices on the page.
          After you pick one answer, the other answers to that question are
          greyed. A choice that no longer fits is removed. A question marked
          NMState is configuration you write as NMState. A selected answer shows
          one example value from the Red Hat documentation.
        </p>
        <fieldset className="modes">
          <legend>How to show options</legend>
          <button
            type="button"
            className="mode"
            aria-pressed={mode === "path"}
            onClick={() => {
              anchorRef.current = {
                decision: "",
                option: "",
                top: 0,
                scrollY: window.scrollY,
              };
              publish(encodeSelection(catalog, answers), "path");
            }}
          >
            Step through
          </button>
          <button
            type="button"
            className="mode"
            aria-pressed={mode === "map"}
            onClick={() => {
              anchorRef.current = {
                decision: "",
                option: "",
                top: 0,
                scrollY: window.scrollY,
              };
              publish(encodeSelection(catalog, answers), "map");
            }}
          >
            See every option
          </button>
        </fieldset>
        <p>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              anchorRef.current = {
                decision: "",
                option: "",
                top: 0,
                scrollY: window.scrollY,
              };
              publish("", mode);
            }}
          >
            Clear choices
          </button>
        </p>
      </header>
      <div className="tree" data-view={mode}>
        {tree.roots.map((node) => (
          <DecisionNode
            key={node.id}
            node={node}
            onAnswer={(decision, option, button) => {
              if (answers.get(decision) === option) return;
              remember(decision, option, button);
              const next = pruneAnswers(
                catalog,
                new Map(answers).set(decision, option),
              );
              publish(encodeSelection(catalog, next), mode);
            }}
            onClear={(decision) => {
              anchorRef.current = {
                decision: "",
                option: "",
                top: 0,
                scrollY: window.scrollY,
              };
              const next = pruneAnswers(
                catalog,
                withAnswer(answers, decision, null),
              );
              publish(encodeSelection(catalog, next), mode);
            }}
          />
        ))}
      </div>
    </main>
  );
}
