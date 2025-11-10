// ---------- Types ----------
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  cook_time: number;
}

// ---------- Sample Data ----------
export const initialRecipes: Recipe[] = [
  {
    id: 101,
    title: "Nonna's Lasagna",
    description: "Layered pasta with rich meat sauce and creamy béchamel.",
    cook_time: 150,
  },
  {
    id: 102,
    title: "Weeknight Aglio e Olio",
    description: "Quick spaghetti with garlic, olive oil, and chili flakes.",
    cook_time: 20,
  },
  {
    id: 103,
    title: "Vegan Lemon Bars",
    description: "Tangy lemon bars with a crumbly vegan crust.",
    cook_time: 60,
  },
];

