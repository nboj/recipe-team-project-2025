import { stackServerApp } from "@/stack/server";
import RequestForm from "./_components/RequestForm";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

export default async function BecomeAChef() {
    const app = stackServerApp;

    const user = await app.getUser();
    if (!user) {
        redirect(app.urls.signIn);
    }
    const { accessToken } = await user.getAuthJson();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND!}/requests/user/become_chef`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    let requests = await res.json();

    if (!res.ok) {
        console.error(requests);
        return <>Error fetching data</>;
    }

    if (requests.length) {
        return (
            <main className={styles.main}>
                <h4>Request Already Submitted, and awaiting review.</h4>
            </main>
        )

    }

    return (
        <main className={styles.main}>
            <RequestForm />
        </main>
    );
}
