"use client";

import { stackClientApp } from "@/stack/client";
import Link from "next/link";

export default function Navbar() {
    const app = stackClientApp.urls
    return (
        <nav className="bg-slate-900 text-slate-50">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
                <span className="font-bold tracking-wide">RecipeForge</span>
                <Link href="/" className="hover:underline">
                    Home
                </Link>
                <Link href="/recipes" className="hover:underline">
                    Recipes
                </Link>
                <Link href="/create" className="hover:underline">
                    Create
                </Link>
                <Link href={app.signUp}>Sign Up</Link>
            </div>
        </nav>
    );
}
