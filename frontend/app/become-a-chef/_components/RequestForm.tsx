"use client";

import { Button, Form, Textarea } from "@heroui/react";
import styles from "./RequestForm.module.css";
import { useState } from "react";
import { stackClientApp } from "@/stack/client";

export default function RequestForm() {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleAction = async (data: FormData) => {
        setPending(true);
        const user = await stackClientApp.getUser();
        const message = data.get("message");
        if (!message) {
            setPending(false);
            setMessage("Message required.");
            return;
        }
        if (!user) {
            setPending(false);
            setMessage("You have to sign in to submit a request");
            return;
        }
        const { accessToken } = await user.getAuthJson();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND!}/requests/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message?.toString(),
                    type: "become_chef",
                }),
            });
            if (!res.ok) {
                setMessage("Error processing your request. Try again.");
                setPending(false);
                return;
            }
        } catch (e: any) {
            setMessage("Error processing your request. Try again.");
            setPending(false);
            return;
        }
        setPending(false);
        setSubmitted(true);
    };
    if (submitted) {
        return <h4>Submitted :)</h4>;
    }
    return (
        <Form className={styles.form} action={handleAction}>
            <h4>Request Chef Role</h4>
            <Textarea
                label="Message"
                labelPlacement="outside"
                name="message"
                isDisabled={pending}
                placeholder="Tell us your qualifications..."
                type="text"
                isRequired
                onChange={() => setMessage("")}
            />
            {message && <p className={styles.error_message}>{message}</p>}
            <Button
                isDisabled={pending}
                type="submit"
                className="ml-auto"
                color="primary"
            >
                Submit
            </Button>
        </Form>
    );
}
