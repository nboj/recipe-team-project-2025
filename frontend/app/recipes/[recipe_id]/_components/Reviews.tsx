import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import styles from "./Reviews.module.css";
import Rating from "@/app/_components/Rating";
import AddReviewButton from "./AddReviewButton";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

interface Props {
    recipe_id: string;
}
export default async function Reviews({ recipe_id }: Props) {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect(stackServerApp.urls.signIn);
    }

    const { accessToken } = await user.getAuthJson();
    let res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/reviews/${recipe_id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
    let reviews: any[] = await res.json();
    return (
        <section>
            <h1 className={styles.reviews_title}>
                Reviews
                <AddReviewButton disabled={!!reviews.find((item) => item.user_id == user.id)} recipe_id={recipe_id} />
            </h1>
            <div className={styles.reviews}>
                {reviews.map((review, index) => {
                    return (
                        <div
                            key={`${review.user_id}-${review.recipe_id}-${index}`}
                            className={`${styles.review_container} ${review.user_id == user.id && styles.current_user}`}
                        >
                            <div className={styles.user_profile}>
                                {review.profile_image_url ? (
                                    <Image
                                        src={review.profile_image_url}
                                        alt="User Profile"
                                        fill
                                    />
                                ) : (
                                    <FaUserCircle className={styles.anonymous_profile} />
                                )}
                            </div>
                            <div className={styles.review_content}>
                                <h4 className={styles.review_name}>
                                    {user.id == review.user_id
                                        ? "You"
                                        : (review.display_name ?? "Anonymous")}
                                    <Rating rating={review.rating} />
                                </h4>
                                <p>{review.comment}</p>
                            </div>
                        </div>
                    );
                })}
                {reviews.length <= 0 && <p>No reviews yet.</p>}
            </div>
        </section>
    );
}
