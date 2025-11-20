"use client";

import { stackClientApp } from "@/stack/client";
import {
    Avatar,
    Button,
    Popover,
    PopoverContent,
    Link as HeroLink,
    PopoverTrigger,
} from "@heroui/react";
import { CurrentUser } from "@stackframe/stack";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './Navbar.module.css'

interface ProfileProps {
    user: CurrentUser;
}
const Profile = ({ user }: ProfileProps) => {
    const app = stackClientApp.urls;
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <Avatar
                        name={user.displayName ?? "Anonymous"}
                        size="sm"
                        src={user.profileImageUrl ?? undefined}
                    />
                </PopoverTrigger>

                <PopoverContent>
                    <div className="px-1 py-2 flex flex-col gap-[.5rem]">
                        <p className={styles.popover_title}>{user.displayName??"Anonymous"}</p>
                        <div className={styles.popover_content}>
                            {
                                user.primaryEmail && <p>{user.primaryEmail}</p>
                            }
                            <HeroLink href="/become-a-chef" className="text-xs">Become a chef?</HeroLink>
                        </div>
                            <Button as={Link} size="sm" href={app.signOut} className="w-fit ml-auto">Sign out</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default function Navbar() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    useEffect(() => {
        const init = async () => {
            return await stackClientApp.getUser();
        };
        init().then((user) => {
            setUser(user);
        });
    }, []);
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
                {user && <Profile user={user} />}
            </div>
        </nav>
    );
}
