"use client";

import { stackClientApp } from "@/stack/client";
import {
    Avatar,
    Button,
    Popover,
    PopoverContent,
    Link as HeroLink,
    PopoverTrigger,
    Badge,
} from "@heroui/react";
import { CurrentUser } from "@stackframe/stack";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./Navbar.module.css";
import { PiChefHatDuotone } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";

interface ProfileItemProps {
    href: string;
    description: string;
    onClose?: () => void;
}
const ProfileItem = ({ href, description, onClose }: ProfileItemProps) => {
    return (
        <HeroLink href={href} className="text-xs" onPress={onClose}>
            {description}
        </HeroLink>
    );
};

interface ProfileProps {
    user: CurrentUser;
    role: string;
}
const Profile = ({ user, role }: ProfileProps) => {
    const app = stackClientApp.urls;
    const canCreate = useMemo(() => role == "chef" || role == "admin", [role]);
    const hasAdmin = useMemo(() => role == "admin", [role]);
    const badgeIcon = useMemo(() => {
        if (role == "chef") {
            return <PiChefHatDuotone />;
        } else if (role == "admin") {
            return <FaShieldAlt />;
        }
    }, [role]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    return (
        <>
            <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <Badge
                    content={badgeIcon}
                    color="primary"
                    variant="faded"
                    isInvisible={!canCreate}
                    isOneChar
                >
                    <PopoverTrigger className="cursor-pointer">
                        <Avatar
                            name={user.displayName ?? "Anonymous"}
                            size="sm"
                            src={user.profileImageUrl ?? undefined}
                        />
                    </PopoverTrigger>
                </Badge>

                <PopoverContent>
                    <div className="px-1 py-2 flex flex-col gap-[.5rem]">
                        <p className={styles.popover_title}>
                            {user.displayName ?? "Anonymous"}
                        </p>
                        {
                            hasAdmin && (
                                <p><em>Admin</em></p>
                            )
                        }
                        {
                            !hasAdmin && canCreate && (
                                <p><em>Chef</em></p>
                            )
                        }
                        <div className={styles.popover_content}>
                            {user.primaryEmail && <p>{user.primaryEmail}</p>}
                            {canCreate ? (
                                <ProfileItem href="/create" description="Create Recipe" onClose={handleClose} />
                            ) : (
                                <ProfileItem href="/become-a-chef" description="Become a chef?" onClose={handleClose} />
                            )}
                            {hasAdmin && (
                                <ProfileItem href="/admin" description="Admin Dashboard" onClose={handleClose} />
                            )}
                        </div>
                        <Button
                            as={Link}
                            size="sm"
                            href={app.signOut}
                            className="w-fit ml-auto"
                        >
                            Sign out
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default function Navbar() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [role, setRole] = useState<null | string>(null);
    useEffect(() => {
        const init = async () => {
            let user = await stackClientApp.getUser();
            if (user) {
                const { accessToken } = await user.getAuthJson();
                let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/user`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                let data = await res.json();
                setRole(data.role);
            }
            setUser(user);
        };
        init();
    }, []);
    return (
        <nav className="bg-slate-900 text-slate-50 sticky top-0 left-0 z-[100]">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-between">
                <div className="w-full flex items-center gap-6">
                    <span className="font-bold tracking-wide">RecipeForge</span>
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                </div>
                {user && role && <Profile user={user} role={role} />}
            </div>
        </nav>
    );
}
