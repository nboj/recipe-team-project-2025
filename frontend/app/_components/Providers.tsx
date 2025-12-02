"use client"

import { HeroUIProvider } from "@heroui/react"
import { useRouter } from "next/navigation";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

interface ProviderProps {
    children: React.ReactNode
}
export default function Providers({children}: ProviderProps) {
    const router = useRouter();
    return (
        <HeroUIProvider navigate={router.push} className="h-fit min-h-full">
            {children}
        </HeroUIProvider>
    )
}
