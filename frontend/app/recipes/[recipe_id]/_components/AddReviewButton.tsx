"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import styles from "./AddReviewButton.module.css";
import { FormEvent, useState } from "react";
import Rating from "@/app/_components/Rating";
import { stackClientApp } from "@/stack/client";
import { revalidate } from "@/app/_actions/revalidate";

interface Props {
  recipe_id: string;
}
export default function AddReviewButton({ recipe_id }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    onClose: () => void,
  ) => {
    e.preventDefault();
    setLoading(true);
    let comment = e.currentTarget.elements.namedItem("comment")?.value;
    let rating = e.currentTarget.elements.namedItem("rating")?.value;
    console.log(comment, rating);
    const user = await stackClientApp.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const {accessToken} = await user.getAuthJson();
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/reviews/${recipe_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
          rating: rating,
        }),
      },
    );
    let data = await res.json();
    if (!res.ok) {
      if (data.detail.error.message) {
        setMessage(data.detail.error.message);
      } else {
        setMessage("Internal Error Occurred");
      }
    } else {
      await revalidate(`/recipes/${recipe_id}`)
      onClose();
    }
    setLoading(false);
  };
  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Add Review
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalBody>
                <Rating
                  className={styles.rating}
                  name="rating"
                  rating={0}
                  disabled={false}
                />
                <Textarea
                  label="Comment"
                  name="comment"
                  placeholder="Write down your thoughts..."
                />
                {message}
              </ModalBody>
              <ModalFooter>
                <Button disabled={loading} onPress={onClose} variant="bordered">
                  Cancel
                </Button>
                <Button disabled={loading} color="primary" type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
