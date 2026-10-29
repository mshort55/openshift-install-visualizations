type IconName =
  | "arrow"
  | "chevron"
  | "search"
  | "close"
  | "map"
  | "layers"
  | "server"
  | "flag"
  | "book"
  | "bulb"
  | "warning"
  | "link"
  | "network"
  | "storage"
  | "people"
  | "package"
  | "check"
  | "info"
  | "back";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  back: <path d="M20 12H5m6-6-6 6 6 6" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  map: (
    <>
      <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="3" width="16" height="7" rx="2" />
      <rect x="4" y="14" width="16" height="7" rx="2" />
      <path d="M7 6.5h.1M7 17.5h.1M15 6.5h2m-2 11h2" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0" />
    </>
  ),
  book: (
    <>
      <path d="M12 5c-3-3-7-2-9-1v15c3-2 6-2 9 0 3-2 6-2 9 0V4c-2-1-6-2-9 1Zm0 0v14" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6m-5 3h4M8 14c-6-6-1-12 4-12s10 6 4 12l-1 2H9l-1-2Z" />
    </>
  ),
  warning: (
    <>
      <path d="m12 3 10 18H2L12 3Zm0 6v5m0 3h.01" />
    </>
  ),
  link: (
    <>
      <path
        d="m10 14 4-4m-5 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 0 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"
        transform="translate(1 0)"
      />
    </>
  ),
  network: (
    <>
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <path d="M12 8v4H5v4m7-4h7v4" />
    </>
  ),
  storage: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 4c3 0 4 2 4 5v2" />
    </>
  ),
  package: (
    <>
      <path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5m-9 5L3 7m9 5v10M7.5 4.5l9 5V14" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10h.01" />
    </>
  ),
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/** Decorative phase diagrams echo the journey's preparation, coordination and usable-outcome stages. */
export function PhaseIllustration({ phase }: { phase: number }) {
  return (
    <svg
      className="phase-illustration"
      viewBox="0 0 300 100"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`dots-${phase}`}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".2" />
        </pattern>
      </defs>
      <rect width="300" height="100" fill={`url(#dots-${phase})`} />
      {phase === 0 ? (
        <g stroke="currentColor" strokeWidth="1.4">
          <path d="M70 51h44m72 0h44m-80-28v-7m0 70v-9" strokeDasharray="4 4" />
          <rect
            x="114"
            y="25"
            width="72"
            height="51"
            rx="9"
            fill="var(--phase-soft)"
          />
          <path d="m133 43 17-9 17 9-17 9-17-9Zm0 10 17 9 17-9m-34 10 17 9 17-9" />
          <rect
            x="43"
            y="36"
            width="28"
            height="28"
            rx="6"
            fill="var(--phase-soft)"
          />
          <path d="M51 46h12m-12 8h8" />
          <rect
            x="229"
            y="36"
            width="28"
            height="28"
            rx="6"
            fill="var(--phase-soft)"
          />
          <path d="m236 50 5 5 8-10" />
        </g>
      ) : phase === 1 ? (
        <g stroke="currentColor" strokeWidth="1.4">
          <path d="M71 51h46m66 0h46" strokeDasharray="4 4" />
          <rect
            x="118"
            y="19"
            width="64"
            height="64"
            rx="10"
            fill="var(--phase-soft)"
          />
          <rect x="129" y="30" width="42" height="17" rx="3" />
          <rect x="129" y="54" width="42" height="17" rx="3" />
          <path d="M135 38h.1m0 24h.1m20-24h9m-9 24h9" />
          <circle cx="56" cy="51" r="15" fill="var(--phase-soft)" />
          <path d="m50 51 4 4 8-8" />
          <circle cx="244" cy="51" r="15" fill="var(--phase-soft)" />
          <path d="m238 51 4 4 8-8" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.4">
          <path d="M75 52h43m65 0h42" strokeDasharray="4 4" />
          <rect
            x="118"
            y="22"
            width="65"
            height="58"
            rx="9"
            fill="var(--phase-soft)"
          />
          <path d="M129 62h43m-35 0V48h8v14m9 0V37h8v25" />
          <circle cx="59" cy="52" r="16" fill="var(--phase-soft)" />
          <path d="m53 52 4 4 8-8" />
          <circle cx="241" cy="52" r="16" fill="var(--phase-soft)" />
          <path d="m235 52 4 4 8-8" />
        </g>
      )}
    </svg>
  );
}
