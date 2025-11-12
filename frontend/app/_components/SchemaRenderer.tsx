"use client";
import { PageSchema, SectionBlock } from "../_types/pageSchema";
import { isEmptySection } from "../_lib/sectionUtils";

function Hero({ title, subtitle }: { title?: string; subtitle?: string }) {
  if (!title && !subtitle) return null;
  return (
    <section className="border-b border-slate-800/60">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        {title && <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>}
        {subtitle && <p className="text-slate-400 text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}

function Row({
  title,
  items = [],
}: {
  title?: string;
  items?: Array<{ id: number; title: string; description?: string }>;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      {items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((r) => (
            <article key={r.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 shadow-sm p-4">
              <div className="h-32 bg-slate-800/60 mb-4 rounded-lg" />
              <h5 className="font-semibold line-clamp-1">{r.title}</h5>
              {r.description && <p className="text-sm text-slate-300 line-clamp-2">{r.description}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Text({ markdown = "" }: { markdown?: string }) {
  if (!markdown?.trim()) return null;
  return (
    <section className="border-t border-slate-800/60 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-slate-300">{markdown}</p>
      </div>
    </section>
  );
}

export default function SchemaRenderer({ schema }: { schema: PageSchema }) {
  const blocks = (schema?.sections ?? []).filter((s) => !isEmptySection(s));
  if (!blocks.length) return null;

  return (
    <>
      {blocks.map((s: SectionBlock, i) => {
        if (s.type === "hero") return <Hero key={i} title={s.title} subtitle={s.subtitle} />;
        if (s.type === "row")  return <Row key={i} title={s.title} items={s.items ?? []} />;
        if (s.type === "text") return <Text key={i} markdown={s.markdown ?? ""} />;
        return null;
      })}
    </>
  );
}
