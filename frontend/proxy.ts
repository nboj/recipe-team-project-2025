import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "./stack/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const user = await stackServerApp.getUser();
    const inAuth =
        request.nextUrl.pathname == stackServerApp.urls.signUp ||
        request.nextUrl.pathname == stackServerApp.urls.signIn;
    if (user && inAuth) {
        return NextResponse.redirect(new URL("/", request.url));
    } else if (!user && inAuth) {
        return NextResponse.next();
    } else if (!user) {
        return NextResponse.redirect(
            new URL(stackServerApp.urls.signIn, request.url),
        );
    } else {
        return NextResponse.next();
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/((?!_next/static|_next/image|.*\\.png$|handler/.*).*)",
};
