"use client";
import { useMemo, useState } from "react";
import styles from "./Rating.module.css";
import { FaRegStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
interface RatingProps {
  rating: number;
  name?: string;
  disabled?: boolean;
  className?: string;
}
const Rating = ({
  rating: _rating,
  name,
  disabled = true,
  className,
}: RatingProps) => {
  const [rating, setRating] = useState(_rating);
  const [hoverRating, setHoverRating] = useState(rating);
  const stars = useMemo(() => {
    return Math.floor(hoverRating);
  }, [hoverRating]);
  const addHalf = useMemo(() => {
    return (hoverRating - Math.floor(hoverRating)) * 100 >= 50;
  }, [hoverRating]);
  const starsLeft = useMemo(() => {
    if (addHalf) {
      return 5 - Math.ceil(hoverRating);
    } else {
      return 5 - Math.floor(hoverRating);
    }
  }, [hoverRating, addHalf]);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;

    const raw = percent * 5;

    if (raw >= 5) {
      setHoverRating(5);
      return;
    }

    const starIndex = Math.floor(raw);
    const inStar = raw - starIndex;
    let ratingValue: number;

    if (raw <= 0) {
      ratingValue = 0.5;
    } else if (inStar < 0.5) {
      ratingValue = starIndex + 0.5;
    } else {
      ratingValue = starIndex + 1;
    }

    ratingValue = Math.min(5, ratingValue);
    setHoverRating(ratingValue);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverRating(rating);
  };

  const handleClick = () => {
    if (disabled) return;
    if (hoverRating == rating) return;
    console.log(hoverRating);
    setRating(hoverRating);
  };

  return (
    <div
      className={`${styles.main} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {name && <input type="hidden" name={name} value={rating} />}
      {Array.from({ length: stars }).map((_, index) => (
        <FaStar key={`star-${index}`} />
      ))}
      {addHalf && <FaRegStarHalfStroke />}
      {Array.from({ length: starsLeft }).map((_, index) => (
        <FaRegStar key={`${5 - starsLeft + index}`} />
      ))}
    </div>
  );
};

export default Rating;
