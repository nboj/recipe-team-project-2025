"use client";
import { Button } from "@heroui/react";
import styles from "./RequestActionComponent.module.css";
import { stackClientApp } from "@/stack/client";
import { useEffect, useState } from "react";
import { revalidate } from "@/app/_actions/revalidate";

interface Props {
  request_id: string;
}
export default function RequestActionComponent({ request_id }: Props) {
  const [pending, setPending] = useState<boolean>(true);
  const [loadingApproval, setLoadingApproval] = useState<boolean>(false);
  const [loadingRejection, setLoadingRejection] = useState<boolean>(false);
  useEffect(() => {
    setPending(false);
  }, []);
  const handleApprove = async () => {
    setLoadingApproval(true);
    setPending(true);
    const user = await stackClientApp.getUser();
    if (!user) {
      setPending(false);
      setLoadingApproval(false);
      return;
    }
    const { accessToken } = await user.getAuthJson();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND!}/requests/${request_id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        setLoadingApproval(false);
        setPending(false);
        return;
      }
    } catch (e: any) {
      setPending(false);
      setLoadingApproval(false);
      return;
    }
    await revalidate("/admin");
    setLoadingApproval(false);
    setPending(false);
  };
  const handleReject = async () => {
    setLoadingRejection(true);
    setPending(true);
    const user = await stackClientApp.getUser();
    if (!user) {
      setLoadingRejection(false);
      setPending(false);
      return;
    }
    const { accessToken } = await user.getAuthJson();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND!}/requests/${request_id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        setLoadingRejection(false);
        setPending(false);
        return;
      }
    } catch (e: any) {
      setLoadingRejection(false);
      setPending(false);
      return;
    }
    await revalidate("/admin");
    setLoadingRejection(false);
    setPending(false);
  };

  return (
    <div className={styles.container}>
      <Button
        isLoading={loadingApproval}
        isDisabled={pending}
        variant="flat"
        color="success"
        onPress={handleApprove}
      >
        Approve
      </Button>
      <Button
        isLoading={loadingRejection}
        isDisabled={pending}
        variant="flat"
        color="danger"
        onPress={handleReject}
      >
        Deny
      </Button>
    </div>
  );
}
