"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";

// --- types & backend base URL ---
type Recipe = {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "id">("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // trending slider index
  const [trendingIndex, setTrendingIndex] = useState(0);

  // ---- Fetch recipes from backend ----
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

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // ---- Derived: trending + newest ----
  const hasRecipes = recipes.length > 0;

  const trendingRecipe = useMemo(() => {
    if (!hasRecipes) return null;
    const index = ((trendingIndex % recipes.length) + recipes.length) % recipes.length;
    return recipes[index];
  }, [recipes, hasRecipes, trendingIndex]);

  const newestRecipe = useMemo(() => {
    if (!hasRecipes) return null;
    return recipes.reduce((latest, r) =>
      (latest?.id ?? 0) > (r.id ?? 0) ? latest : r
    );
  }, [recipes, hasRecipes]);

  // ---- Handlers ----
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRecipes({ q: search });
  };

  const clearSearch = () => {
    setSearch("");
    fetchRecipes();
  };

  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const image_url = (formData.get("image_url") as string)?.trim();

    if (!title || !description) return;

    try {
      const res = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          image_url: image_url || null,
        }),
      });

      if (!res.ok) {
        console.error("Failed to create recipe", res.status);
        return;
      }

      const saved = (await res.json()) as Recipe;
      setRecipes((prev) => [...prev, saved]);
      event.currentTarget.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const removeRecipe = (id: number) =>
    setRecipes((previous) => previous.filter((item) => item.id !== id));

  const isEmpty = useMemo(
    () => recipes.length === 0 && !loading && !error,
    [recipes.length, loading, error]
  );

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

      {/* Hero */}
      <section className="border-b border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div>
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">
              Cook Smarter, Not Harder.
            </h1>
            <p className="text-slate-400">
              Welcome to Recipe Forge, your go-to app for crafting and
              managing delicious recipes with ease. This homepage now pulls
              recipe data and search results from the FastAPI + SQLite
              backend.
            </p>
          </div>
        </div>
      </section>

      {/* Trending banner (single rotating) */}
      {hasRecipes && trendingRecipe && (
        <section className="border-b border-slate-800/60 bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-wide">
                Trending
              </h3>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setTrendingIndex((prev) => prev - 1)
                  }
                  className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-1 hover:border-slate-400"
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTrendingIndex((prev) => prev + 1)
                  }
                  className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-1 hover:border-slate-400"
                >
                  Next ▶
                </button>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4 md:grid-cols-[2fr,3fr]">
              <div className="h-44 overflow-hidden rounded-xl bg-slate-800/70">
                {trendingRecipe.image_url ? (
                  <img
                    src={trendingRecipe.image_url}
                    alt={trendingRecipe.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="mb-1 text-xs uppercase tracking-wide text-amber-300">
                  Trending recipe
                </p>
                <h4 className="mb-2 text-xl font-semibold">
                  {trendingRecipe.title}
                </h4>
                <p className="mb-3 text-sm text-slate-300 line-clamp-3">
                  {trendingRecipe.description}
                </p>
                <p className="text-xs text-slate-500">
                  Cycling through {recipes.length} total recipes.
                  Use the arrows to explore.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Create recipe form */}
      <section className="border-t border-slate-800/60 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h3 className="mb-4 text-xl font-medium">Create a recipe</h3>
          <p className="mb-4 text-sm text-slate-400">
            Use this form to add recipes directly into the backend database via{" "}
            <code className="rounded bg-slate-800/70 px-1 py-0.5 text-[10px]">
              POST /recipes
            </code>
            . New recipes will appear in the list below and will be available to
            any homepage sections powered by the backend.
          </p>
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-5"
            onSubmit={handleForm}
          >
            <input
              name="title"
              type="text"
              placeholder="Title"
              className="sm:col-span-2 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-slate-400"
              required
            />
            <input
              name="description"
              type="text"
              placeholder="Description"
              className="sm:col-span-3 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-slate-400"
              required
            />
            <input
              name="image_url"
              type="text"
              placeholder="Image URL (optional, e.g. /images/new-dish.jpg)"
              className="sm:col-span-5 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <div className="sm:col-span-5">
              <button className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-sm transition hover:scale-[1.01] hover:border-slate-400">
                Save recipe
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* New Arrivals banner */}
      {hasRecipes && newestRecipe && (
        <section className="border-t border-slate-800/60 bg-slate-900/50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h3 className="mb-3 text-lg font-semibold tracking-wide">
              New Arrivals
            </h3>
            <div className="grid gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4 md:grid-cols-[3fr,2fr]">
              <div className="flex flex-col justify-center">
                <p className="mb-1 text-xs uppercase tracking-wide text-emerald-300">
                  Latest recipe added
                </p>
                <h4 className="mb-2 text-xl font-semibold">
                  {newestRecipe.title}
                </h4>
                <p className="mb-3 text-sm text-slate-300 line-clamp-3">
                  {newestRecipe.description}
                </p>
                <p className="text-xs text-slate-500">
                  This is the most recently created recipe in the database.
                </p>
              </div>
              <div className="h-40 overflow-hidden rounded-xl bg-slate-800/70">
                {newestRecipe.image_url ? (
                  <img
                    src={newestRecipe.image_url}
                    alt={newestRecipe.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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
              This area is powered by the backend. Add a recipe using the form
              above to see it appear here and in the banners.
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
                <div className="h-36 overflow-hidden bg-slate-800/60 transition group-hover:brightness-110">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No image
                    </div>
                  )}
                </div>
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

      {/* Footer */}
      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
          {new Date().getFullYear()} Recipe Forge • Fully DB-backed homepage
        </div>
      </footer>
    </main>
  );
}
