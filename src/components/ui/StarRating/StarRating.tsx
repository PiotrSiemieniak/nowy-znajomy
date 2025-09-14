"use client";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-5, może być ułamkowa np. 4.25
  maxStars?: number; // domyślnie 5
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean; // czy pokazać wartość liczbową obok
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  className,
  showValue = false,
}: StarRatingProps) {
  // Ograniczamy rating do zakresu 0-maxStars
  const clampedRating = Math.max(0, Math.min(maxStars, rating));

  // Rozmiary gwiazdk
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Funkcja do obliczenia wypełnienia pojedynczej gwiazdki
  const getStarFillPercentage = (starIndex: number): number => {
    const starPosition = starIndex + 1; // gwiazdki 1-5

    if (clampedRating >= starPosition) {
      return 100; // pełne wypełnienie
    } else if (clampedRating > starIndex) {
      // częściowe wypełnienie
      const partial = clampedRating - starIndex;
      return partial * 100;
    } else {
      return 0; // brak wypełnienia
    }
  };

  // Komponent pojedynczej gwiazdki z gradientem
  const StarWithGradient = ({
    fillPercentage,
    index,
  }: {
    fillPercentage: number;
    index: number;
  }) => {
    const gradientId = `star-gradient-${index}`;

    return (
      <div className="relative">
        <svg
          className={cn(sizeClasses[size])}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definicja gradientu */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(251 191 36)" />{" "}
              {/* yellow-400 */}
              <stop offset={`${fillPercentage}%`} stopColor="rgb(251 191 36)" />
              <stop
                offset={`${fillPercentage}%`}
                stopColor="rgb(203 213 225)"
              />{" "}
              {/* gray-300 */}
              <stop offset="100%" stopColor="rgb(203 213 225)" />
            </linearGradient>
          </defs>

          {/* Gwiazdka z gradientem */}
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#${gradientId})`}
            stroke="rgb(251 191 36)" /* yellow-400 */
            strokeWidth="1"
            className="drop-shadow-sm"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {/* Gwiazdki */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, index) => (
          <StarWithGradient
            key={index}
            fillPercentage={getStarFillPercentage(index)}
            index={index}
          />
        ))}
      </div>

      {/* Opcjonalna wartość liczbowa */}
      {showValue && (
        <span
          className={cn("text-muted-foreground ml-2", textSizeClasses[size])}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
