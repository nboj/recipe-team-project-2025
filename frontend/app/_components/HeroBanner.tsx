// frontend/app/_components/HeroBanner.tsx
"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type { Recipe } from "../_types/recipe";

type Props = { slides: Recipe[]; autoPlayMs?: number };

export default function HeroBanner({ slides, autoPlayMs = 4500 }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), autoPlayMs);
    return () => window.clearInterval(id);
  }, [emblaApi, autoPlayMs]);

  return (
    <div className="relative overflow-hidden">
      <div ref={emblaRef}>
        <div className="flex">
          {slides.map((r) => (
            <div key={r.id} className="relative min-w-full">
              <div className="relative h-[60vh] w-full">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-10 left-8 right-8 max-w-2xl text-white">
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow">
                  {r.title}
                </h1>
                {r.summary && (
                  <p className="mt-3 text-sm md:text-base line-clamp-3 md:line-clamp-4">
                    {r.summary}
                  </p>
                )}
                <div className="mt-5 flex gap-3">
                  <button className="bg-white text-black rounded-lg px-4 py-2 font-medium">
                    View Recipe
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white backdrop-blur rounded-lg px-4 py-2 font-medium">
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
    </div>
  );
}
