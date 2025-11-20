import { stackServerApp } from "@/stack/server";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import RequestActionComponent from "./_components/RequestActionComponent";

export default async function Admin() {
  const app = stackServerApp;

  const user = await app.getUser();
  if (!user) {
    redirect(app.urls.signIn);
  }
  const { accessToken } = await user.getAuthJson();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND!}/requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  let requests: any[] = await res.json();

  if (!res.ok) {
    console.error(requests, (requests as any).detail.error.details);
    return redirect("/");
  }

  console.log(requests);
  const pending = requests.filter((request) => request.status == "pending");
  const rejected = requests.filter((request) => request.status == "rejected");
  const approved = requests.filter((request) => request.status == "approved");

  return (
    <main className={styles.main}>
      <div className={styles.inner_main}>
        <h2 className={styles.title}>Admin Dashboard</h2>
        <div className={styles.requests_container}>
          {pending.map((request: any, index: number) => {
            return (
              <div
                key={`pending-request-${index}`}
                className={styles.request_container}
              >
                <div>
                  <p className={styles.name}>{request.name ?? "Anonymous"}</p>
                  <p>{request.email}</p>
                  <p>{request.type}</p>
                  <p>{request.message}</p>
                </div>
                <RequestActionComponent request_id={request.id} />
              </div>
            );
          })}
        </div>
        <div className={styles.requests_container}>
          {approved.map((request: any, index: number) => {
            return (
              <div
                key={`approved-request-${index}`}
                className={styles.request_container}
              >
                <div>
                  <p className={styles.name}>{request.name ?? "Anonymous"}</p>
                  <p>{request.email}</p>
                  <p>{request.type}</p>
                  <p>{request.message}</p>
                </div>
                <p className={styles.approved}>Approved</p>
              </div>
            );
          })}
        </div>
        <div className={styles.requests_container}>
          {rejected.map((request: any, index: number) => {
            return (
              <div
                key={`rejected-request-${index}`}
                className={styles.request_container}
              >
                <div>
                  <p className={styles.name}>{request.name ?? "Anonymous"}</p>
                  <p>{request.email}</p>
                  <p>{request.type}</p>
                  <p>{request.message}</p>
                </div>
                <p className={styles.denied}>Denied</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
