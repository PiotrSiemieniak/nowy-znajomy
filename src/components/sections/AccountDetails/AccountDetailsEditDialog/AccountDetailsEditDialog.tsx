"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { BirthDatePicker } from "./partials/BirthDatePicker";
import { accountDetailsDataCardsConfig } from "@/configs/accountDetails";
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";
import { useUpdateAccountDetail } from "../hooks";
import type { AccountDetailsFieldKey } from "@/lib/services/api/accountDetails";
import { Loader } from "lucide-react";
import { MultiSelectBadges } from "@/components/ui/MultiSelectBadges";
import { Slider } from "@/components/ui/Slider";
import { MusicGenre } from "@/lib/globalTypes/personal/musicGenre";
import { SpecialFeatures } from "@/lib/globalTypes/personal/specialFeatures";
import { SportType } from "@/lib/globalTypes/personal/sports";
import { Gender } from "@/lib/globalTypes/personal/gender";
import { formatMonthYear, parseMonthYear } from "@/lib/utils/dateFormatter";
import { useLocale } from "next-intl";

// Typ dla wartości pola AccountDetails
type AccountDetailValue = AccountDetails[keyof AccountDetails];

interface AccountDetailsEditDialogProps {
  fieldKey: string | null;
  value?: AccountDetailValue;
  onClose: () => void;
}

export function AccountDetailsEditDialog({
  fieldKey,
  value,
  onClose,
}: AccountDetailsEditDialogProps) {
  const t = useTranslations("account.details");
  const tGender = useTranslations("filters.gender");
  const tSpecialFeatures = useTranslations("specialFeatures");
  const locale = useLocale();
  const [formData, setFormData] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Mutation do aktualizacji pola
  const updateAccountDetail = useUpdateAccountDetail();

  // Aktualizuj formData gdy value się zmieni (np. przy przełączaniu między polami)
  React.useEffect(() => {
    setFormData(value);
    setValidationError(null);
    setServerError(null);
  }, [value, fieldKey]);

  // Jeśli nie ma fieldKey, Dialog jest zamknięty
  if (!fieldKey) {
    return null;
  }

  // Pobierz config dla tego pola
  const config =
    accountDetailsDataCardsConfig[
      fieldKey as keyof typeof accountDetailsDataCardsConfig
    ];

  // Dynamicznie pobieraj tłumaczenie na podstawie fieldKey
  const title = t(fieldKey as never);
  const description = t(`${fieldKey}Desc` as never);

  // Funkcja walidacji po stronie klienta
  const validateFormData = (data: AccountDetailValue): string | null => {
    if (!config) return null;
    if (data === null || data === undefined) return null;

    switch (config.contentType) {
      case "number":
        if (typeof data !== "number" || isNaN(data)) {
          return "Wartość musi być liczbą";
        }
        if (config.minValue !== undefined && data < config.minValue) {
          return `Wartość nie może być mniejsza niż ${config.minValue}`;
        }
        if (config.maxValue !== undefined && data > config.maxValue) {
          return `Wartość nie może być większa niż ${config.maxValue}`;
        }
        break;

      case "text":
        if (typeof data !== "string" || data.trim().length === 0) {
          return "Pole nie może być puste";
        }
        break;

      case "date":
        if (typeof data !== "string" || !/^\d{4}-\d{2}$/.test(data)) {
          return "Data musi być w formacie YYYY-MM";
        }
        break;
    }

    return null;
  };

  // Funkcja zapisu
  const handleSave = () => {
    if (fieldKey && formData !== undefined) {
      // Walidacja po stronie klienta
      const clientValidationError = validateFormData(formData);
      if (clientValidationError) {
        setValidationError(clientValidationError);
        setServerError(null);
        return;
      }

      // Wyczyść błędy przed wysłaniem
      setValidationError(null);
      setServerError(null);

      updateAccountDetail.mutate(
        {
          field: fieldKey as AccountDetailsFieldKey,
          value: formData,
        },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            console.error("Błąd podczas zapisywania:", error);
            setServerError(error.message || "Wystąpił nieznany błąd");
          },
        }
      );
    } else {
      onClose();
    }
  };

  // Renderuj zawartość edytora na podstawie contentType z config
  const renderEditContent = () => {
    if (!config) return null;

    const commonInputProps = {
      className: "w-full",
      value: formData ? String(formData) : "",
      placeholder: "Wprowadź wartość...",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(e.target.value);
        // Wyczyść błędy podczas pisania
        setValidationError(null);
        setServerError(null);
      },
    };

    // Helper dla formatowania daty w inputach
    const getDateInputProps = () => {
      if (fieldKey === "birthDate" && config.contentType === "date") {
        const formattedValue = formatMonthYear(formData as string, locale);
        return {
          ...commonInputProps,
          value: formattedValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const parsed = parseMonthYear(e.target.value, locale);
            setFormData(parsed);
          },
        };
      }
      return commonInputProps;
    };

    switch (config.contentType) {
      case "date":
        return (
          <BirthDatePicker
            value={formData as string | Date}
            onChange={(monthYear) => setFormData(monthYear)}
          />
        );

      case "number":
        // Dla wzrostu i wagi używamy Slider, dla innych pól Input
        if (fieldKey === "height" || fieldKey === "weight") {
          const currentValue =
            typeof formData === "number" ? formData : config.minValue || 0;
          const unit = fieldKey === "height" ? "cm" : "kg";

          return (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-2xl font-semibold">
                  {currentValue} {unit}
                </span>
              </div>
              <Slider
                min={config.minValue || 0}
                max={config.maxValue || 100}
                value={[currentValue]}
                onValueChange={(values) => {
                  setFormData(values[0]);
                  // Wyczyść błędy podczas zmiany
                  setValidationError(null);
                  setServerError(null);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
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
          // Dla innych number pól używamy zwykłego Input
          return (
            <Input
              type="number"
              {...commonInputProps}
              min={config.minValue}
              max={config.maxValue}
              onChange={(e) => setFormData(Number(e.target.value))}
            />
          );
        }

      case "array":
        // Obsługa różnych typów tablic
        let allOptions: (string | MusicGenre | SpecialFeatures | SportType)[] =
          [];
        const selectedOptions = Array.isArray(formData) ? formData : [];

        if (fieldKey === "musicGenres") {
          allOptions = Object.values(MusicGenre);
        } else if (fieldKey === "specialFeatures") {
          allOptions = Object.values(SpecialFeatures);
        } else if (fieldKey === "sports") {
          allOptions = Object.values(SportType);
        }

        if (allOptions.length > 0) {
          return (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Kliknij aby dodać/usunąć:
              </p>
              <MultiSelectBadges
                allOptions={allOptions}
                selectedOptions={selectedOptions}
                onToggle={(option) => {
                  const currentSelection = Array.isArray(formData)
                    ? formData
                    : [];
                  const isSelected = currentSelection.some(
                    (item) => String(item) === String(option)
                  );

                  if (isSelected) {
                    setFormData(
                      currentSelection.filter(
                        (item) => String(item) !== String(option)
                      ) as typeof formData
                    );
                  } else {
                    setFormData([
                      ...currentSelection,
                      option,
                    ] as typeof formData);
                  }
                }}
                getLabel={(option) => {
                  // Tłumacz SpecialFeatures
                  if (fieldKey === "specialFeatures") {
                    return tSpecialFeatures(String(option) as never);
                  }
                  // Dla innych pól zwróć string
                  return String(option);
                }}
                getKey={(option) => String(option)}
              />
            </div>
          );
        }

        // Fallback dla nieznanych typów tablic
        return (
          <div className="space-y-2">
            {Array.isArray(value) && value.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Aktualne wartości:
                </p>
                <div className="flex flex-wrap gap-1">
                  {value.map((item, index) => (
                    <div
                      key={`${fieldKey}-edit-${index}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs border"
                    >
                      {String(item)}
                    </div>
                  ))}
                </div>
              </>
            )}
            <Input
              {...commonInputProps}
              value={typeof formData === "string" ? formData : ""}
              placeholder={
                Array.isArray(value) && value.length > 0
                  ? "Dodaj nową wartość..."
                  : "Dodaj wartości..."
              }
            />
          </div>
        );

      case "enum":
        // Obsługa Gender enum
        if (fieldKey === "gender") {
          const currentGender =
            typeof formData === "number" ? formData : Gender.undefined;

          return (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wybierz płeć:</p>
              <div className="space-y-2">
                {Object.values(Gender)
                  .filter((g) => typeof g === "number")
                  .map((genderValue) => (
                    <Button
                      key={genderValue}
                      variant={
                        currentGender === genderValue ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => {
                        setFormData(genderValue as number);
                        setValidationError(null);
                        setServerError(null);
                      }}
                    >
                      {genderValue === Gender.undefined && tGender("undefined")}
                      {genderValue === Gender.female && tGender("female")}
                      {genderValue === Gender.male && tGender("male")}
                    </Button>
                  ))}
              </div>
            </div>
          );
        }
        // Fallback dla innych enum types
        return <Input {...getDateInputProps()} />;

      case "text":
      default:
        return <Input {...getDateInputProps()} />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj: {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{renderEditContent()}</div>

        {/* Wyświetl błędy walidacji */}
        {(validationError || serverError) && (
          <div className="space-y-2">
            {validationError && (
              <div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">
                  {validationError}
                </p>
              </div>
            )}
            {serverError && (
              <div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">
                  {serverError}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={handleSave} disabled={updateAccountDetail.isPending}>
            {updateAccountDetail.isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              "Zastosuj"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
