"use client";

import { useState, useMemo, useEffect } from "react";

// new imports for the schema renderer + fetcher
import SchemaRenderer from "./_components/SchemaRenderer";
import { getPageSchema } from "./_lib/api";
import type { PageSchema } from "./_types/pageSchema";

// --- types & backend base URL ---
type Recipe = {
  id: number;
  title: string;
  description: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function Home() {
  // your existing state
  const [variable, setVariable] = useState<number>(0);

  // recipes now come from the backend
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // search + sorting state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "id">("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // state for schema
  const [schema, setSchema] = useState<PageSchema | null>(null);

  // fetch the schema (from mock route now / real backend later)
  useEffect(() => {
    getPageSchema().then(setSchema).catch(() => setSchema(null));
  }, []);

  // helper to fetch recipes from FastAPI
  const fetchRecipes = async (opts?: {
    q?: string;
    sortBy?: "title" | "id";
  }) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const effectiveSort = opts?.sortBy ?? sortBy;

      if (opts?.q && opts.q.trim() !== "") {
        params.set("q", opts.q.trim());
      }
      params.set("sort_by", effectiveSort);

      const res = await fetch(
        `${API_BASE_URL}/recipes?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: Recipe[] = await res.json();
      setRecipes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  // initial load + refetch when sort changes
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const increaseNumber = () => setVariable((previous) => previous + 1);
  const decreaseNumber = () => setVariable((previous) => previous - 1);

  // add demo recipe (client-side only)
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

  const isEmpty = useMemo(
    () => recipes.length === 0 && !loading && !error,
    [recipes.length, loading, error]
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRecipes({ q: search });
  };

  const clearSearch = () => {
    setSearch("");
    fetchRecipes();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-wide">
            Recipe Forge
          </span>
          <nav className="text-xs text-slate-300">
            Home • Recipes • About
          </nav>
        </div>
      </header>

      {/* Hero / Counter */}
      <section className="border-b border-slate-800/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">
              Cook smarter, not harder.
            </h1>
            <p className="text-slate-400">
              Welcome to Recipe Forge, your go-to app for crafting and
              managing delicious recipes with ease. This homepage now pulls
              recipe data and search results from the FastAPI backend.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-sm">
            <p className="mb-2 text-sm text-slate-300">
              Demo counter (your existing state):
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseNumber}
                className="rounded-xl border border-slate-700/70 px-3 py-2 text-sm transition hover:scale-[1.02] hover:border-slate-500"
                aria-label="decrease"
              >
                – Decrease
              </button>
              <span className="text-3xl font-semibold tabular-nums">
                {variable}
              </span>
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

      {/* schema-driven blocks (skips blanks automatically) */}
      {schema && <SchemaRenderer schema={schema} />}

      {/* Recipes section (backend-powered list) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {/* header row */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Recipes</h2>
            <p className="text-xs text-slate-400">
              Data loaded from{" "}
              <code className="rounded bg-slate-800/70 px-1 py-0.5 text-[10px]">
                GET /recipes
              </code>{" "}
              on the FastAPI backend with search and sorting.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400">
              {recipes.length} item(s)
            </span>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              Sort by
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "title" | "id")
                }
                className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-2 py-1 text-xs"
              >
                <option value="title">Title</option>
                <option value="id">ID</option>
              </select>
            </label>
          </div>
        </div>

        {/* search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            placeholder="Search recipes by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl border border-slate-600 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:scale-[1.01] hover:bg-white"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-sm transition hover:scale-[1.01] hover:border-slate-400"
            >
              Clear
            </button>
          </div>
        </form>

        {/* status + list */}
        {loading && (
          <p className="mb-4 text-sm text-slate-300">
            Loading recipes…
          </p>
        )}
        {error && (
          <p className="mb-4 text-sm text-rose-300">
            {error}
          </p>
        )}

        {isEmpty ? (
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-10 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-medium">
              No recipes yet
            </h3>
            <p className="mb-6 text-slate-400">
              This area is powered by the backend. When the database is
              wired in, search and results will come directly from it.
              For now, you can add demo recipes below.
            </p>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl bg-slate-800/60"
                />
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
                  <h5 className="mb-1 line-clamp-1 text-lg font-semibold">
                    {recipe.title}
                  </h5>
                  <p className="line-clamp-2 text-sm text-slate-300">
                    {recipe.description}
                  </p>
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

      {/* Add recipe form (styled, still client-side only) */}
      <section className="border-t border-slate-800/60 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h3 className="mb-4 text-xl font-medium">
            Add a demo recipe
          </h3>
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
              <button className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-sm transition hover:scale-[1.01] hover:border-slate-400">
                Add recipe
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
          {new Date().getFullYear()} Recipe Forge • UI flared, data
          wired to backend
        </div>
      </footer>
    </main>
  );
}
