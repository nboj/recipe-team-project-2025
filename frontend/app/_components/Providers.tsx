"use client"

import { HeroUIProvider } from "@heroui/react"

interface ProviderProps {
    children: React.ReactNode
}
export default function Providers({children}: ProviderProps) {
    return (
        <HeroUIProvider>
            {children}
        </HeroUIProvider>
    )
}
