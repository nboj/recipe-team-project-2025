import Section from "../_components/Section";
import { Recipe } from "../_lib/types";
import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default async function Recipes() {
  const app = stackServerApp;

  const user = await app.getUser();
  if (!user) {
    redirect(app.urls.signIn);
  }
  const { accessToken } = await user.getAuthJson();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND!}/recipes`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const recipes = await res.json();

  return (
    <Section title="Recipes">
      <p className="mb-4">Below is generated from a TypeScript array.</p>
      <ul className="space-y-4">
        {recipes.map((recipe: Recipe) => (
          <li
            key={recipe.id}
            className="flex justify-between align-center bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <div>
              <div className="font-semibold">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="text-slate-900 hover:underline"
                >
                  {recipe.title}
                </Link>
              </div>
              <div className="text-sm mt-1">{recipe.description}</div>
              <div className="text-sm mt-1">⏱ {recipe.cook_time/60} min</div>
              <div className="mt-2"></div>
            </div>
            <div className={styles.image_container}>
              <Image src={recipe.image} alt="pizza" fill />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
