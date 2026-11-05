import { z } from "zod";

const chapterSchema = z.enum([
  "introduction",
  "preparation",
  "installation",
  "readiness",
  "handoff",
  "reuse",
]);
export type Chapter = z.infer<typeof chapterSchema>;
export const chapters = chapterSchema.options;
export const scenes = {
  introduction: {
    title: "One journey, from plan to handoff",
    label: "Introduction",
    phase: "Pre-installation",
    status: "Needs input",
    installation: "Not started",
  },
  preparation: {
    title: "Prepare the plan and coordinate owners",
    label: "Preparation",
    phase: "Pre-installation",
    status: "Needs input",
    installation: "Not started",
  },
  installation: {
    title: "Boot the hosts and observe installation",
    label: "Installation",
    phase: "Installation",
    status: "Ready to run — required post-installation work",
    installation: "Cluster installed successfully",
  },
  readiness: {
    title: "Installed does not yet mean ready",
    label: "Readiness",
    phase: "Post-installation",
    status: "Failed — customer hook",
    installation: "Cluster installed successfully",
  },
  handoff: {
    title: "A scoped infrastructure handoff",
    label: "Sample handoff",
    phase: "Post-installation",
    status: "Complete",
    installation: "Cluster installed successfully",
  },
  reuse: {
    title: "Reuse the plan for the next site",
    label: "Template reuse",
    phase: "Post-installation",
    status: "Complete",
    installation: "Cluster installed successfully",
  },
} satisfies Record<
  Chapter,
  {
    title: string;
    label: string;
    phase: string;
    status: string;
    installation: string;
  }
>;

export function parseChapter(value: string | null): Chapter {
  const parsed = chapterSchema.safeParse(value);
  return parsed.success ? parsed.data : "introduction";
}
