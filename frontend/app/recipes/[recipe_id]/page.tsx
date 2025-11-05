import Section from "@/app/_components/Section";
import { initialRecipes } from "../../_lib/types";
import Tag from "@/app/_components/Tag";
import Link from "next/link";

const BackLink = () => {
    return (
        <Link
            className="mt-6 inline-flex items-center gap-2 text-slate-900 hover:underline"
            href="/recipes"
        >
            ← Back to recipes
        </Link>
    );
};

interface Props {
    params: Promise<{ recipe_id: number }>;
}

export default async function Recipe({ params }: Props) {
    const id = (await params).recipe_id;
    const recipe = initialRecipes.find((recipe) => recipe.id == id) ?? null;
    if (recipe) {
        return (
            <Section title={recipe.title}>
                <BackLink />
                <div className="text-sm">
                    ⏱ {recipe.totalTime} min • {recipe.difficulty}
                </div>
                <p className="mt-2">{recipe.summary}</p>
                <div className="mt-2">
                    {recipe.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                    ))}
                </div>
            </Section>
        );
    } else {
        return (
            <Section title="Recipe not found">
                <BackLink />
            </Section>
        );
    }
}
