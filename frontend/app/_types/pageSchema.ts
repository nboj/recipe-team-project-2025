export type RecipeLite = { id: number; title: string; description?: string };

export type SectionBlock =
  | { type: "hero"; title?: string; subtitle?: string }
  | { type: "row"; title?: string; items?: RecipeLite[] }
  | { type: "text"; markdown?: string };

export interface PageSchema {
  sections: SectionBlock[]; // blanks allowed
}
