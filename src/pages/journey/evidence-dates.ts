import type { OccurrenceDate, ReportedDate } from "./model";

/** Labels the source date without presenting a report as the event itself. */
export function reportedDateLabel(date: ReportedDate): string {
  switch (date.kind) {
    case "reported":
      return `Reported ${date.date}`;
    case "study":
      return `Study report ${date.date}`;
    case "disputed":
      return `Call date disputed: ${date.dates.join(" or ")}`;
    case "unknown":
      return "Reported date unknown";
  }
}

/** Preserves whether an event is dated, ongoing at the report, or undated. */
export function occurrenceDateLabel(date: OccurrenceDate): string {
  switch (date.kind) {
    case "dated":
      return date.period;
    case "ongoing":
      return `Ongoing when reported; ${date.detail}`;
    case "unknown":
      return `Exact date unknown; ${date.detail}`;
  }
}
