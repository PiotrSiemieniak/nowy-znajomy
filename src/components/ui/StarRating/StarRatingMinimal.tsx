"use client";

import { cn } from "@/lib/utils";

interface StarRatingMinimalProps {
  rating: number; // 0-5, może być ułamkowa np. 4.25
  maxStars?: number; // domyślnie 5
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function StarRatingMinimal({
  rating,
  maxStars = 5,
  size = "md",
  className,
  showValue = false,
}: StarRatingMinimalProps) {
  const clampedRating = Math.max(0, Math.min(maxStars, rating));
  const percentage = (clampedRating / maxStars) * 100;

  const sizeClasses = {
    sm: "text-lg", // ~18px
    md: "text-xl", // ~20px
    lg: "text-2xl", // ~24px
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {/* Kontener gwiazdek */}
      <div className="relative inline-block">
        {/* Tło - puste gwiazdki */}
        <div
          className={cn("text-gray-300 select-none", sizeClasses[size])}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {"★".repeat(maxStars)}
        </div>

        {/* Wypełnienie - pełne gwiazdki */}
        <div
          className={cn(
            "absolute top-0 left-0 overflow-hidden text-yellow-400 select-none",
            sizeClasses[size]
          )}
          style={{
            width: `${percentage}%`,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {"★".repeat(maxStars)}
        </div>
      </div>

      {/* Opcjonalna wartość liczbowa */}
      {showValue && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
