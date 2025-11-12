import type { PageSchema } from "../_types/pageSchema";

// If NEXT_PUBLIC_API is set, use backend; else use our mock route.
const base = process.env.NEXT_PUBLIC_API?.trim();

export async function getPageSchema(): Promise<PageSchema | null> {
  const url = base ? `${base}/page/home` : "/api/page/home";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("bad response");
    return (await res.json()) as PageSchema;
  } catch {
    return null;
  }
}
