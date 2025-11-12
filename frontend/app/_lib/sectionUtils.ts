import { SectionBlock } from "../_types/pageSchema";

export function isEmptySection(s: SectionBlock) {
  if (s.type === "hero") return !s.title && !s.subtitle;
  if (s.type === "row")  return !s.title && !(s.items?.length);
  if (s.type === "text") return !s.markdown;
  return true;
}
