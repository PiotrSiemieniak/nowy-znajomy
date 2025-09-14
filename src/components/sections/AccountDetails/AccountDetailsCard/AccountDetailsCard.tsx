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
import { formatMonthYear } from "@/lib/utils/dateFormatter";
import { useLocale } from "next-intl";
import { Gender } from "@/lib/globalTypes/personal/gender";
import { motion } from "framer-motion";

// Typ dla wartości pola AccountDetails
type AccountDetailValue = AccountDetails[keyof AccountDetails];

interface AccountDetailsCardProps {
  fieldKey: string;
  config: {
    canBeEdited?: boolean;
    isVisible?: boolean;
    minValue?: number;
    maxValue?: number;
    contentType: string;
  };
  value?: AccountDetailValue; // Wartość pola z API
  onEdit?: () => void; // Callback gdy kliknięto Edit/Uzupełnij
}

export function AccountDetailsCard({
  fieldKey,
  config,
  value,
  onEdit,
}: AccountDetailsCardProps) {
  const t = useTranslations("account.details");
  const tGender = useTranslations("filters.gender");
  const tSpecialFeatures = useTranslations("specialFeatures");
  const locale = useLocale();

  // Funkcja do formatowania wartości Gender
  const formatGenderValue = (genderValue: Gender): string => {
    switch (genderValue) {
      case Gender.undefined:
        return tGender("undefined");
      case Gender.female:
        return tGender("female");
      case Gender.male:
        return tGender("male");
      default:
        return tGender("undefined");
    }
  };

  // Dynamicznie pobieraj tłumaczenie na podstawie fieldKey
  const title = t(fieldKey as never);
  const description = t(`${fieldKey}Desc` as never);

  // Sprawdź czy ma wartość
  const hasValue = value !== null && value !== undefined;

  // Sprawdź czy można edytować - tylko jeśli nie ma wartości I pole jest edytowalne
  const canEdit = config.canBeEdited && !hasValue;

  // Renderuj zawartość na podstawie typu wartości
  const renderContent = () => {
    // Przypadek 1: Brak wartości
    if (!hasValue) {
      return (
        <p className="text-sm text-muted-foreground italic">Nie ustawiono</p>
      );
    }

    // Przypadek 2: String - renderuj disabled input lub sformatowaną datę
    if (typeof value === "string") {
      // Jeśli to data urodzenia, formatuj ją
      if (fieldKey === "birthDate" && config.contentType === "date") {
        const formattedDate = formatMonthYear(value, locale);
        return (
          <Input
            value={formattedDate}
            disabled
            className="w-full"
            placeholder="Nie ustawiono"
          />
        );
      }

      return (
        <Input
          value={value}
          disabled
          className="w-full"
          placeholder="Nie ustawiono"
        />
      );
    }

    // Przypadek 2a: Number dla Gender enum (sprawdzamy PRZED innymi number cases)
    if (typeof value === "number" && fieldKey === "gender") {
      return (
        <p className="text-sm font-medium">
          {formatGenderValue(value as Gender)}
        </p>
      );
    }

    // Przypadek 3: Number - renderuj z jednostkami dla wzrostu i wagi
    if (typeof value === "number") {
      // Dla wzrostu i wagi pokazuj z jednostkami
      if (fieldKey === "height" || fieldKey === "weight") {
        const unit = fieldKey === "height" ? "cm" : "kg";
        return (
          <div className="text-center py-2">
            <span className="text-2xl font-semibold">
              {value} {unit}
            </span>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>
                {config.minValue} {unit}
              </span>
              <span>
                {config.maxValue} {unit}
              </span>
            </div>
          </div>
        );
      } else {
        // Dla innych liczb zwykły input
        return (
          <Input
            type="number"
            value={value.toString()}
            disabled
            className="w-full"
            placeholder="Nie ustawiono"
            min={config.minValue}
            max={config.maxValue}
          />
        );
      }
    }

    // Przypadek 4: Enum - renderuj jako tekst z tłumaczeniem (Gender)
    if (typeof value === "object" && !Array.isArray(value)) {
      return <p className="text-sm font-medium">{String(value)}</p>;
    }

    // Przypadek 5: Array - renderuj jako Badges
    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => {
            // Sprawdź typ array i wyświetl odpowiednio z tłumaczeniami
            let displayText = "";

            if (typeof item === "string") {
              // SpecialFeatures - tłumacz
              if (fieldKey === "specialFeatures") {
                displayText = tSpecialFeatures(item as never);
              } else {
                // Sports, MusicGenre mają string values bez tłumaczenia
                displayText = item;
              }
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Card className="max-w-96 min-w-72 h-full">
        <CardHeader className="w-full">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="w-full space-y-2">
          {renderContent()}
        </CardContent>
        <CardFooter>
          {canEdit && (
            <Button className="w-full" variant="default" onClick={onEdit}>
              Uzupełnij
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
