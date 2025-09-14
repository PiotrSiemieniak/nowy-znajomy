"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingIconsProps {
  rating: number; // 0-5, może być ułamkowa np. 4.25
  maxStars?: number; // domyślnie 5
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
  interactive?: boolean; // czy gwiazdki są klikalne
  onRatingChange?: (rating: number) => void; // callback po kliknięciu
  precision?: "full" | "half"; // pełne gwiazdki lub połówki
}

export function StarRatingIcons({
  rating,
  maxStars = 5,
  size = "md",
  className,
  showValue = false,
  interactive = false,
  onRatingChange,
  precision = "full",
}: StarRatingIconsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const clampedRating = Math.max(0, Math.min(maxStars, rating));
  const displayRating = hoveredRating ?? clampedRating;

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

  const handleStarClick = (starIndex: number) => {
    if (!interactive || !onRatingChange) return;

    let newRating;
    if (precision === "half") {
      // Dla połówek - sprawdź czy klik był na lewej czy prawej połowie
      newRating = starIndex + 0.5; // Dla uproszczenia zawsze dodajemy 0.5
    } else {
      newRating = starIndex + 1; // Pełne gwiazdki
    }

    onRatingChange(newRating);
  };

  const handleStarHover = (starIndex: number) => {
    if (!interactive) return;
    setHoveredRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoveredRating(null);
  };

  // Generowanie gwiazdek
  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starPosition = index + 1;
    const isFilled = displayRating >= starPosition;
    const isPartial = displayRating > index && displayRating < starPosition;
    const partialAmount = isPartial ? displayRating - index : 0;

    const starElement = (() => {
      if (isFilled) {
        // Pełna gwiazdka
        return (
          <Star
            className={cn(
              sizeClasses[size],
              "text-yellow-400 fill-yellow-400",
              interactive && "transition-all duration-150"
            )}
          />
        );
      } else if (isPartial) {
        // Częściowo wypełniona gwiazdka
        return (
          <div className="relative">
            {/* Tło - pusta gwiazdka */}
            <Star
              className={cn(sizeClasses[size], "text-gray-300 stroke-current")}
            />
            {/* Wypełnienie */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${partialAmount * 100}%` }}
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
      } else {
        // Pusta gwiazdka
        return (
          <Star
            className={cn(
              sizeClasses[size],
              "text-gray-300 stroke-current",
              interactive && "hover:text-yellow-200 transition-all duration-150"
            )}
          />
        );
      }
    })();

    if (interactive) {
      return (
        <button
          key={index}
          type="button"
          className={cn(
            "outline-none focus:outline-none transition-transform duration-150",
            "hover:scale-110 focus:scale-110 active:scale-95"
          )}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleMouseLeave}
          aria-label={`Rate ${index + 1} star${index > 0 ? "s" : ""}`}
        >
          {starElement}
        </button>
      );
    }

    return <div key={index}>{starElement}</div>;
  });

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {/* Gwiazdki */}
      <div
        className={cn(
          "flex items-center gap-0.5",
          interactive && "cursor-pointer"
        )}
        onMouseLeave={handleMouseLeave}
      >
        {stars}
      </div>

      {/* Opcjonalna wartość liczbowa */}
      {showValue && (
        <span
          className={cn("text-muted-foreground ml-2", textSizeClasses[size])}
        >
          {(hoveredRating ?? rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}
