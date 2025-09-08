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
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";

// Typ dla wartości pola AccountDetails
type AccountDetailValue = AccountDetails[keyof AccountDetails];

interface EditDialogProps {
  fieldKey: string | null;
  value?: AccountDetailValue;
  onClose: () => void;
}

export function EditDialog({ fieldKey, value, onClose }: EditDialogProps) {
  const t = useTranslations("account.details");

  // Jeśli nie ma fieldKey, Dialog jest zamknięty
  if (!fieldKey) {
    return null;
  }

  // Dynamicznie pobieraj tłumaczenie na podstawie fieldKey
  const title = t(fieldKey as never);
  const description = t(`${fieldKey}Desc` as never);

  // Sprawdź czy ma wartość
  const hasValue = value !== null && value !== undefined;

  // Renderuj zawartość edytora na podstawie typu wartości
  const renderEditContent = () => {
    // Przypadek 1: Brak wartości - renderuj pusty input
    if (!hasValue) {
      return <Input placeholder="Wprowadź wartość..." className="w-full" />;
    }

    // Przypadek 2: String - renderuj input z wartością
    if (typeof value === "string") {
      return (
        <Input
          defaultValue={value}
          placeholder="Wprowadź wartość..."
          className="w-full"
        />
      );
    }

    // Przypadek 3: Number - renderuj number input
    if (typeof value === "number") {
      return (
        <Input
          type="number"
          defaultValue={value.toString()}
          placeholder="Wprowadź wartość..."
          className="w-full"
        />
      );
    }

    // Przypadek 4: Enum - renderuj jako input (można później podmienić na select)
    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <Input
          defaultValue={String(value)}
          placeholder="Wprowadź wartość..."
          className="w-full"
        />
      );
    }

    // Przypadek 5: Array - renderuj mapowane divy
    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Aktualne wartości:</p>
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => {
              let displayText = "";

              if (typeof item === "string") {
                displayText = item;
              } else if (typeof item === "object") {
                displayText = String(item);
              } else {
                displayText = String(item);
              }

              return (
                <div
                  key={`${fieldKey}-edit-${index}`}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs border"
                >
                  {displayText}
                </div>
              );
            })}
          </div>
          <Input placeholder="Dodaj nową wartość..." className="w-full" />
        </div>
      );
    }

    // Fallback
    return (
      <Input
        defaultValue={String(value)}
        placeholder="Wprowadź wartość..."
        className="w-full"
      />
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj: {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{renderEditContent()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            onClick={() => {
              // TODO: Implementacja zapisu
              onClose();
            }}
          >
            Zastosuj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
