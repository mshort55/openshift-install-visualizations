import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  type PrerequisitesTarget,
  type PrerequisitesView,
  prerequisitesHref,
  prerequisitesTarget,
  referenceDisclosures,
} from "./model";

/** Keeps disclosures open across page switches without adding them all to the URL. */
export function usePrerequisitesSession() {
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  return { opened, setOpened };
}

export type PrerequisitesProps = {
  view: PrerequisitesView;
  onChange: (view: PrerequisitesView, behavior: "new" | "retain") => void;
  session: ReturnType<typeof usePrerequisitesSession>;
};

const PageContext = createContext<PrerequisitesProps | null>(null);

function usePage() {
  const page = useContext(PageContext);
  if (!page) throw new Error("Prerequisite controls need their page provider.");
  return page;
}

export function PrerequisitesProvider({
  children,
  ...page
}: PrerequisitesProps & { children: ReactNode }) {
  const {
    view,
    session: { setOpened },
  } = page;
  useLayoutEffect(() => {
    if (!referenceDisclosures.has(view.target)) return;
    setOpened((current) =>
      current.has(view.target) ? current : new Set([...current, view.target]),
    );
  }, [view.target, setOpened]);
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>;
}

/** Uses the app's navigation callback so section links preserve history and scenarios. */
export function PrerequisiteLink({
  target,
  children,
  className,
  focusId,
  current,
}: {
  target: PrerequisitesTarget;
  children: ReactNode;
  className?: string;
  focusId?: string;
  current?: boolean;
}) {
  const { view, onChange, session } = usePage();
  const next = { ...view, target };
  return (
    <a
      href={prerequisitesHref(next)}
      className={className}
      data-focus={`prerequisites-link-${focusId ?? target}`}
      aria-current={current ? "location" : undefined}
      onClick={(event) => {
        if (
          event.button ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        if (referenceDisclosures.has(target))
          session.setOpened((current) => new Set([...current, target]));
        if (target === view.target) {
          requestAnimationFrame(() => {
            const heading = document.getElementById(prerequisitesTarget(next));
            heading?.focus({ preventScroll: true });
            heading?.scrollIntoView({ block: "start" });
          });
        } else onChange(next, "new");
      }}
    >
      {children}
    </a>
  );
}

export function Disclosure({
  id,
  summary,
  children,
}: {
  id: string;
  summary: ReactNode;
  children: ReactNode;
}) {
  const { session } = usePage();
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
      <summary
        id={`prerequisites-${id.replaceAll("/", "-")}`}
        data-focus={`prerequisites-${id}`}
        tabIndex={0}
      >
        {summary}
      </summary>
      {children}
    </details>
  );
}
