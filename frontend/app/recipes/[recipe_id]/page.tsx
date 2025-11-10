import Section from "@/app/_components/Section";
import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

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
    const app = stackServerApp
    const user = await app.getUser()
    if (!user) {
        redirect(app.urls.signIn)
    }

    const { accessToken } = await user.getAuthJson()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND!}/recipes/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    const recipe = await res.json()
    console.log(recipe)

    if (recipe) {
        return (
            <Section title={recipe.title}>
                <BackLink />
                <div className="text-sm">
                    ⏱ {recipe.cook_time} min
                </div>
                <p className="mt-2">{recipe.description}</p>
                <div className="mt-2">
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
