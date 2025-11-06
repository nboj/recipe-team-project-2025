// ---------- Types ----------
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: number;
  title: string;
  summary: string;
  totalTime: number; // minutes
  difficulty: Difficulty;
  tags: string[];
}

// ---------- Sample Data ----------
export const initialRecipes: Recipe[] = [
  {
    id: 101,
    title: "Nonna's Lasagna",
    summary: "Layered pasta with rich meat sauce and creamy béchamel.",
    totalTime: 150,
    difficulty: "Hard",
    tags: ["Italian", "Pasta", "Comfort Food"],
  },
  {
    id: 102,
    title: "Weeknight Aglio e Olio",
    summary: "Quick spaghetti with garlic, olive oil, and chili flakes.",
    totalTime: 20,
    difficulty: "Easy",
    tags: ["Italian", "Pasta", "Quick"],
  },
  {
    id: 103,
    title: "Vegan Lemon Bars",
    summary: "Tangy lemon bars with a crumbly vegan crust.",
    totalTime: 60,
    difficulty: "Medium",
    tags: ["Vegan", "Dessert", "Lemon"],
  },
];

