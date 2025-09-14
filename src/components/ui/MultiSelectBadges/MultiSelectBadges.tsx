"use client";

import { Badge } from "@/components/ui/Badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectBadgesProps<T> {
  allOptions: T[];
  selectedOptions: T[];
  onToggle: (option: T) => void;
  getLabel: (option: T) => string;
  getKey: (option: T) => string | number;
  className?: string;
  showAddIcon?: boolean;
}

export function MultiSelectBadges<T>({
  allOptions,
  selectedOptions,
  onToggle,
  getLabel,
  getKey,
  className,
  showAddIcon = true,
}: MultiSelectBadgesProps<T>) {
  const selectedSet = new Set(selectedOptions.map(getKey));

  const selectedItems = allOptions.filter((option) =>
    selectedSet.has(getKey(option))
  );
  const availableItems = allOptions.filter(
    (option) => !selectedSet.has(getKey(option))
  );

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* Wybrane elementy - wariant default z X */}
      {selectedItems.map((option) => (
        <Badge
          key={getKey(option)}
          variant="default"
          className="group cursor-pointer"
          onClick={() => onToggle(option)}
        >
          {getLabel(option)}
          <X className="ml-1 h-3 w-3 opacity-50 group-hover:opacity-100" />
        </Badge>
      ))}

      {/* Dostępne do wyboru - wariant outline z Plus */}
      {availableItems.map((option) => (
        <Badge
          key={getKey(option)}
          variant="outline"
          className="group cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={() => onToggle(option)}
        >
          {getLabel(option)}
          {showAddIcon && (
            <Plus className="ml-1 h-3 w-3 opacity-50 group-hover:opacity-100" />
          )}
        </Badge>
      ))}
    </div>
  );
}
