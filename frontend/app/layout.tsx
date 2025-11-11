import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./_components/Providers";
import Navbar from "./_components/Navbar";

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
            className="h-full bg-slate-50 text-gray-900 light text-foreground bg-background"
        >
            <body
                className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <StackProvider app={stackClientApp}>
                    <StackTheme>
                        <Providers>
                            <Navbar />
                            {children}
                        </Providers>
                    </StackTheme>
                </StackProvider>
            </body>
        </html>
    );
}
