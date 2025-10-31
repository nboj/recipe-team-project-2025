"use client";

import React, { useMemo, useState } from "react";

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

// ---------- View Type ----------
type View = "home" | "recipes" | "create" | { detailId: number };

// ---------- Type Guard (lets TS know when view has detailId) ----------
function isDetailView(v: View): v is { detailId: number } {  // NEW
  return typeof v === "object" && v !== null && "detailId" in v;
}

// ---------- Sample Data ----------
const initialRecipes: Recipe[] = [
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

// ---------- Local UI Pieces ----------
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="inline-block text-xs bg-gray-200 text-gray-800 rounded px-2 py-0.5 mr-1 mt-1">
      {children}
    </span>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <div className="text-gray-700">{children}</div>
    </section>
  );
};

// ---------- Main Component ----------
export default function RecipeForgeIndex() {
  const [view, setView] = useState<View>("home");
  const [recipes] = useState<Recipe[]>(() => initialRecipes);

  // Use the type guard so TS knows view has detailId here
  const currentDetail = useMemo(() => {                          // NEW
    if (isDetailView(view)) {
      return recipes.find((r) => r.id === view.detailId) ?? null;
    }
    return null;
  }, [view, recipes]);                                           // NEW

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* Top Nav */}
      <nav className="bg-slate-900 text-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
          <span className="font-bold tracking-wide">RecipeForge</span>
          <a
            href="#"
            className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setView("home");
            }}
          >
            Home
          </a>
          <a
            href="#"
            className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setView("recipes");
            }}
          >
            Recipes
          </a>
          <a
            href="#"
            className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setView("create");
            }}
          >
            Create
          </a>
        </div>
      </nav>

      {/* Home */}
      {typeof view === "string" && view === "home" && (
        <Section title="Welcome to RecipeForge">
          <p>Discover and create amazing recipes.</p>
        </Section>
      )}

      {/* Recipes List */}
      {typeof view === "string" && view === "recipes" && (
        <Section title="Recipes">
          <p className="mb-4">Below is generated from a TypeScript array.</p>
          <ul className="space-y-4">
            {recipes.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
              >
                <div className="font-semibold">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setView({ detailId: r.id });
                    }}
                    className="text-slate-900 hover:underline"
                  >
                    {r.title}
                  </a>
                </div>
                <div className="text-sm mt-1">{r.summary}</div>
                <div className="text-sm mt-1">
                  ⏱ {r.totalTime} min • {r.difficulty}
                </div>
                <div className="mt-2">
                  {r.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Create (placeholder) */}
      {typeof view === "string" && view === "create" && (
        <Section title="Create Recipe">
          <p className="mb-4">We’ll wire this form up next.</p>
          <form className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <label className="block text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              placeholder="e.g., Spicy Peanut Noodles"
            />
            <button
              className="mt-4 bg-slate-900 text-white rounded px-4 py-2 opacity-60 cursor-not-allowed"
              disabled
            >
              Save (not wired yet)
            </button>
          </form>
        </Section>
      )}

      {/* Detail */}
      {typeof view === "object" && currentDetail && (
        <Section title={currentDetail.title}>
          <div className="text-sm">
            ⏱ {currentDetail.totalTime} min • {currentDetail.difficulty}
          </div>
          <p className="mt-2">{currentDetail.summary}</p>
          <div className="mt-2">
            {currentDetail.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <button
            className="mt-6 inline-flex items-center gap-2 text-slate-900 hover:underline"
            onClick={() => setView("recipes")}
          >
            ← Back to recipes
          </button>
        </Section>
      )}

      {/* Detail — not found */}
      {typeof view === "object" && !currentDetail && (
        <Section title="Recipe not found">
          <button
            className="mt-2 text-slate-900 hover:underline"
            onClick={() => setView("recipes")}
          >
            ← Back to recipes
          </button>
        </Section>
      )}
    </div>
  );
}
