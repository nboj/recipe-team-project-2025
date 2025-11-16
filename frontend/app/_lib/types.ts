// ---------- Types ----------
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  cook_time: number;
  image: string;
  rating: number;
}

