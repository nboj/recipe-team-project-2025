import Section from "../_components/Section";
import { initialRecipes } from "../_lib/types";
import Tag from "../_components/Tag";
import Link from "next/link";

export default function Recipes() {
    return (
        <Section title="Recipes">
            <p className="mb-4">Below is generated from a TypeScript array.</p>
            <ul className="space-y-4">
                {initialRecipes.map((recipe) => (
                    <li
                        key={recipe.id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                    >
                        <div className="font-semibold">
                            <Link
                                href={`/recipes/${recipe.id}`}
                                className="text-slate-900 hover:underline"
                            >
                                {recipe.title}
                            </Link>
                        </div>
                        <div className="text-sm mt-1">{recipe.summary}</div>
                        <div className="text-sm mt-1">
                            ⏱ {recipe.totalTime} min • {recipe.difficulty}
                        </div>
                        <div className="mt-2">
                            {recipe.tags.map((t) => (
                                <Tag key={t}>{t}</Tag>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
