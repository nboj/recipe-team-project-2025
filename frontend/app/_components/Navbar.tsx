"use client";

import { stackClientApp } from "@/stack/client";
import { CurrentUser } from "@stackframe/stack";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
    const app = stackClientApp.urls
    const [user, setUser] = useState<CurrentUser | null>(null)
    useEffect(() => {
        const init = async () => {
            return await stackClientApp.getUser()
        }
        init().then(user => {
            setUser(user)
        })
    }, [])
    return (
        <nav className="bg-slate-900 text-slate-50 sticky top-0 left-0 z-[100]">
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
                {
                    user ? (
                        <Link href={app.signOut}>Sign out</Link>
                    ) : (
                        <Link href={app.signUp}>Sign Up</Link>
                    )
                }
            </div>
        </nav>
    );
}
