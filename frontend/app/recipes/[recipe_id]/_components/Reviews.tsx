import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import styles from "./Reviews.module.css";
import Rating from "@/app/_components/Rating";
import AddReviewButton from "./AddReviewButton";
import Image from 'next/image';
import { FaUserCircle } from "react-icons/fa";

interface Props {
  recipe_id: string;
}
export default async function Reviews({ recipe_id }: Props) {
  const user = await stackServerApp.getUser();
  console.log(user)
  if (!user) {
    redirect(stackServerApp.urls.signIn);
  }

  const { accessToken } = await user.getAuthJson();
  let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/reviews/${recipe_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  let reviews: any[] = await res.json();
  console.log(reviews);
  return (
    <section>
      <h1 className={styles.reviews_title}>Reviews<AddReviewButton recipe_id={recipe_id}/></h1>
      <div className={styles.reviews}>
        {
          reviews.map((review, index) => (
            <div key={`${review.user_id}-${review.recipe_id}-${index}`} className={styles.review_container}>
              <div className={styles.user_profile}>
                <Image src={review.profile_image_url ?? <FaUserCircle/>} alt="User Profile" fill/>
              </div>
              <div className={styles.review_content}>
                <h4 className={styles.review_name}>{review.display_name}<Rating rating={review.rating}/></h4>
                <p>{review.comment}</p>
              </div>
            </div> 
          ))
        }
        {reviews.length <= 0 && (
          <p>No reviews yet.</p> 
        )}
      </div>
    </section>
  );
}
