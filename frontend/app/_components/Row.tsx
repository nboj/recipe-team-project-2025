// frontend/app/_components/Row.tsx
"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type { Recipe } from "../_types/recipe";
import { Button } from "@heroui/react";

type Props = { title: string; items: Recipe[] };

export default function Row({ title, items }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative max-w-7xl mx-auto px-6 mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      </div>

      <div className="relative group">

        <Button
          onClick={prev}
          className="absolute left-0 z-10 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
          isIconOnly
        >
          ‹
        </Button>

        <div className="overflow-hidden" ref={emblaRef}>
          <ul className="flex gap-4">
            {items.map((r) => (
              <li key={r.id} className="min-w-[160px] md:min-w-[200px]">
                <article className="bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-white/30 transition">
                  <div className="relative h-[90px] md:h-[120px]">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white line-clamp-2">
                      {r.title}
                    </h3>
                    {r.myRating && (
                      <div className="mt-1 text-xs text-amber-300">
                        ★ {r.myRating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={next}
          className="absolute right-0 z-10 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
          isIconOnly
        >
          ›
        </Button>
      </div>
    </section>
  );
}
