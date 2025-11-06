// frontend/app/_types/recipe.ts
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: number;
  title: string;
  summary?: string;
  image: string;        // URL or /public path used by <Image />
  totalTime?: number;   // minutes
  difficulty?: Difficulty;
  myRating?: number;    // 1–5
  categories?: string[];
}
