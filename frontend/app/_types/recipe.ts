export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: number;
  title: string;
  summary?: string;
  image: string;        // URL or /public path
  totalTime?: number;
  difficulty?: Difficulty;
  myRating?: number;    // 1-5
  categories?: string[];
}
