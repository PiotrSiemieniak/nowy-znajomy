"use client";

import { Button } from "@/components/ui/Button/Button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";

// Typ dla wartości pola AccountDetails
type AccountDetailValue = AccountDetails[keyof AccountDetails];

interface DetailsCardProps {
  fieldKey: string;
  config: {
    canBeEdited?: boolean;
    maxValue?: number;
    contentType: string;
  };
  value?: AccountDetailValue; // Wartość pola z API
  onEdit?: () => void; // Callback gdy kliknięto Edit/Uzupełnij
}

export function DetailsCard({
  fieldKey,
  config,
  value,
  onEdit,
}: DetailsCardProps) {
  const t = useTranslations("account.details");

  // Dynamicznie pobieraj tłumaczenie na podstawie fieldKey
  const title = t(fieldKey as never);
  const description = t(`${fieldKey}Desc` as never);

  // Sprawdź czy ma wartość
  const hasValue = value !== null && value !== undefined;

  // Renderuj zawartość na podstawie typu wartości
  const renderContent = () => {
    // Przypadek 1: Brak wartości
    if (!hasValue) {
      return (
        <p className="text-sm text-muted-foreground italic">Nie ustawiono</p>
      );
    }

    // Przypadek 2: String - renderuj disabled input
    if (typeof value === "string") {
      return (
        <Input
          value={value}
          disabled
          className="w-full"
          placeholder="Nie ustawiono"
        />
      );
    }

    // Przypadek 3: Number - renderuj disabled input
    if (typeof value === "number") {
      return (
        <Input
          type="number"
          value={value.toString()}
          disabled
          className="w-full"
          placeholder="Nie ustawiono"
          max={config.maxValue}
        />
      );
    }

    // Przypadek 4: Enum - renderuj jako tekst (Gender)
    if (typeof value === "object" && !Array.isArray(value)) {
      return <p className="text-sm font-medium">{String(value)}</p>;
    }

    // Przypadek 5: Array - renderuj jako Badges
    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => {
            // Sprawdź typ array i wyświetl odpowiednio
            let displayText = "";

            if (typeof item === "string") {
              // Sports, MusicGenre, SpecialFeatures mają string values
              displayText = item;
            } else if (typeof item === "object") {
              // Jeśli to enum object
              displayText = String(item);
            } else {
              displayText = String(item);
            }

            return (
              <Badge
                key={`${fieldKey}-${index}`}
                variant="secondary"
                className="text-xs"
              >
                {displayText}
              </Badge>
            );
          })}
        </div>
      );
    }

    // Fallback
    return <p className="text-sm font-medium">{String(value)}</p>;
  };

  return (
    <Card className="max-w-96 min-w-72">
      <CardHeader className="w-full">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {config.canBeEdited && <CardAction>Edit</CardAction>}
      </CardHeader>
      <CardContent className="w-full space-y-2">{renderContent()}</CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={hasValue ? "outline" : "default"}
          onClick={onEdit}
        >
          {hasValue ? "Edytuj" : "Uzupełnij"}
        </Button>
      </CardFooter>
    </Card>
  );
}
