"use client";
import { useState, useMemo, useEffect } from "react";

//new imports for the schema renderer + fetcher
import SchemaRenderer from "./_components/SchemaRenderer";
import { getPageSchema } from "./_lib/api";
import type { PageSchema } from "./_types/pageSchema";

// --- local demo data (unchanged) ---
const _recipes = [
  { id: 1, title: "title goes here", description: "description here" },
  { id: 2, title: "Recipe #2", description: "tasty noodles" },
  { id: 3, title: "Apple Pie", description: "apples and yummyness" },
  { id: 4, title: "Pumpkin Pie", description: "pumpkins" },
];

export default function Home() {
  // your existing state
  const [variable, setVariable] = useState<number>(0);
  const [recipes, setRecipes] = useState(_recipes);

  //state for schema
  const [schema, setSchema] = useState<PageSchema | null>(null);

  //fetch the schema (from mock route now / real backend later)
  useEffect(() => {
    getPageSchema().then(setSchema).catch(() => setSchema(null));
  }, []);

  const increaseNumber = () => setVariable((previous) => previous + 1);
  const decreaseNumber = () => setVariable((previous) => previous - 1);

  const handleForm = (data: FormData) => {
    const title = (data.get("title") as string)?.trim();
    const description = (data.get("description") as string)?.trim();
    if (!title || !description) return;
    setRecipes((previous) => [
      ...previous,
      { id: previous.length + 1, title, description },
    ]);
  };

  const removeRecipe = (id: number) =>
    setRecipes((previous) => previous.filter((item) => item.id !== id));

  const isEmpty = useMemo(() => recipes.length === 0, [recipes.length]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-wide">Recipe Forge</span>
          <nav className="text-xs text-slate-300">Home • Recipes • About</nav>
        </div>
      </header>

      {/* Hero / Counter */}
      <section className="border-b border-slate-800/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">Cook smarter, not harder.</h1>
            <p className="text-slate-400">
              Welcome to Recipe Forge, your go-to app for crafting and managing delicious recipes with ease.
              Start by adding a recipe below and see how simple it is to keep track of your culinary creations!
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-sm">
            <p className="mb-2 text-sm text-slate-300">Demo counter (your existing state):</p>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseNumber}
                className="rounded-xl border border-slate-700/70 px-3 py-2 text-sm transition hover:scale-[1.02] hover:border-slate-500"
                aria-label="decrease"
              >
                – Decrease
              </button>
              <span className="text-3xl font-semibold tabular-nums">{variable}</span>
              <button
                onClick={increaseNumber}
                className="rounded-xl border border-slate-700/70 px-3 py-2 text-sm transition hover:scale-[1.02] hover:border-slate-500"
                aria-label="increase"
              >
                + Increase
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*schema-driven blocks (skips blanks automatically) */}
      {schema && <SchemaRenderer schema={schema} />}

      {/* Recipes section (your existing demo list) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recipes</h2>
          <span className="text-xs text-slate-400">{recipes.length} item(s)</span>
        </div>

        {isEmpty ? (
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-10 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-medium">No recipes yet</h3>
            <p className="mb-6 text-slate-400">
              This area will fill with database results later. Add a demo recipe below to preview the layout.
            </p>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-800/60" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md"
              >
                <div className="h-36 bg-slate-800/60 transition group-hover:brightness-110" />
                <div className="p-4">
                  <h5 className="mb-1 line-clamp-1 text-lg font-semibold">{recipe.title}</h5>
                  <p className="line-clamp-2 text-sm text-slate-300">{recipe.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        Easy
                      </span>
                      <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        20 min
                      </span>
                    </div>
                    <button
                      onClick={() => removeRecipe(recipe.id)}
                      className="rounded-lg border border-rose-800/60 px-3 py-1.5 text-xs text-rose-200/90 hover:border-rose-500 hover:text-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Add recipe form (styled) */}
      <section className="border-t border-slate-800/60 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h3 className="mb-4 text-xl font-medium">Add a demo recipe</h3>
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-5"
            action={handleForm}
          >
            <input
              name="title"
              type="text"
              placeholder="Title"
              className="sm:col-span-2 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <input
              name="description"
              type="text"
              placeholder="Description"
              className="sm:col-span-3 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <div className="sm:col-span-5">
              <button
                className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-sm transition hover:scale-[1.01] hover:border-slate-400"
              >
                Add recipe
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
           {new Date().getFullYear()} Recipe Forge • UI flared, data wires later
        </div>
      </footer>
    </main>
  );
}
