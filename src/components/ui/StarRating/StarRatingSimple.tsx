"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingSimpleProps {
  rating: number; // 0-5, może być ułamkowa np. 4.25
  maxStars?: number; // domyślnie 5
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean; // czy pokazać wartość liczbową obok
  interactive?: boolean; // czy gwiazdki są klikalne (do przyszłego rozwoju)
}

export function StarRatingSimple({
  rating,
  maxStars = 5,
  size = "md",
  className,
  showValue = false,
  interactive = false,
}: StarRatingSimpleProps) {
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

  // Komponent pojedynczej gwiazdki
  const StarIcon = ({
    filled,
    partial,
  }: {
    filled: boolean;
    partial?: number; // 0-1 dla częściowego wypełnienia
  }) => {
    if (filled) {
      return (
        <Star
          className={cn(
            sizeClasses[size],
            "text-yellow-400 fill-yellow-400",
            interactive && "cursor-pointer hover:scale-110 transition-transform"
          )}
        />
      );
    }

    if (partial && partial > 0) {
      return (
        <div className="relative">
          {/* Tło - pusta gwiazdka */}
          <Star
            className={cn(
              sizeClasses[size],
              "text-yellow-400 stroke-2 fill-transparent absolute inset-0"
            )}
          />
          {/* Wypełnienie - przez clip-path */}
          <div
            className="relative overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - partial * 100}% 0 0)` }}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "text-yellow-400 fill-yellow-400"
              )}
            />
          </div>
        </div>
      );
    }

    // Pusta gwiazdka
    return (
      <Star
        className={cn(
          sizeClasses[size],
          "text-gray-300 stroke-2 fill-transparent",
          interactive &&
            "cursor-pointer hover:text-yellow-200 hover:scale-110 transition-all"
        )}
      />
    );
  };

  // Generowanie gwiazdek
  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starPosition = index + 1;
    const isFilled = clampedRating >= starPosition;
    const partial =
      clampedRating > index && clampedRating < starPosition
        ? clampedRating - index
        : 0;

    return <StarIcon key={index} filled={isFilled} partial={partial} />;
  });

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {/* Gwiazdki */}
      <div className="flex items-center gap-0.5">{stars}</div>

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
