import Section from "@/app/_components/Section";
import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Recipe, Step } from "@/app/_lib/types";
import styles from "./page.module.css";
import Rating from "../../_components/Rating";
import Reviews from "./_components/Reviews";

const BackLink = () => {
  return (
    <Link
      className="mt-6 inline-flex items-center gap-2 text-slate-200 hover:underline"
      href="/"
    >
      ← Back
    </Link>
  );
};

interface Props {
  params: Promise<{ recipe_id: string }>;
}

export default async function RecipePage({ params }: Props) {
  const id = (await params).recipe_id;
  const app = stackServerApp;
  const user = await app.getUser();
  if (!user) {
    redirect(app.urls.signIn);
  }

  const { accessToken } = await user.getAuthJson();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND!}/recipes/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return <p>Error loading page, please try again at a later time.</p>
  }

  const recipe: null | Recipe = await res.json();
  console.log(recipe)

  if (recipe) {
    return (
      <main className="bg-slate-900 text-slate-100 h-full">
        <div className="relative">
          <div className="relative w-full">
            <div className="relative h-[60vh] w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            <div className="absolute bottom-10 left-8 right-8 max-w-2xl text-white">
              <h1 className="text-3xl md:text-5xl font-bold drop-shadow">
                {recipe.title}
              </h1>
              <Rating className="text-3xl" rating={recipe.rating}/>
              {recipe.description && (
                <p className="mt-3 text-sm md:text-base line-clamp-3 md:line-clamp-4">
                  {recipe.description}
                </p>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
        <section className={styles.main}>
          <div>
            <BackLink />
            <div className="text-sm">⏱ {recipe.cook_time / 60} min</div>
            <p className="mt-2">{recipe.description}</p>
            <div className="mt-2"></div>
            <div className="flex flex-col gap-[1rem] max-w-[900px] mx-auto my-10 px-10">
              {recipe.steps?.map((step) => {
                return (
                  <div key={`recipe-step-${step.step_no}`} className="flex flex-col">
                    <p className="font-bold flex w-full justify-between items-center">Step {step.step_no}<span>{step.est_minutes/60} minutes</span></p>
                    <p>{step.instruction_text}</p>
                  </div>
                )
              })}
            </div>
            <Reviews recipe_id={id}/>
          </div>
        </section>
      </main>
    );
  } else {
    return (
      <Section title="Recipe not found">
        <BackLink />
      </Section>
    );
  }
}
