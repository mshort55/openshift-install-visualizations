import { parseCatalog } from "./catalog";
import rawCatalog from "./data/bare-metal-4.22.json";

const parsed = parseCatalog(rawCatalog);
if (!parsed.ok) throw new Error("The installation choices catalog is invalid.");

export const choicesCatalog = parsed.value;
