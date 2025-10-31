import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./_components/Providers";
import Link from "next/link";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Recipe Database",
    description: "2025 project",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="min-h-screen bg-slate-50 text-gray-900 light text-foreground bg-background"
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <nav className="bg-slate-900 text-slate-50">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
                        <span className="font-bold tracking-wide">RecipeForge</span>
                        <Link href="/" className="hover:underline">Home</Link>
                        <Link href="/recipes" className="hover:underline">Recipes</Link>
                        <Link href="/create" className="hover:underline">Create</Link>
                    </div>
                </nav>

                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
