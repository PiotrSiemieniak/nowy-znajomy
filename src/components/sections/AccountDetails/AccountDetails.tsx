"use client";

import { accountDetailsDataCardsConfig } from "@/configs/accountDetails";
import { useAllAccountDetails } from "./hooks";
import { cn } from "@/lib/utils";
import { Skeleton } from "./partials/Skeleton";
import { useState } from "react";
import type { AccountDetailsFieldKey } from "@/lib/services/api/accountDetails";
import dynamic from "next/dynamic";

// Dynamic imports
const AccountDetailsCard = dynamic(
  () =>
    import("./AccountDetailsCard").then((mod) => ({
      default: mod.AccountDetailsCard,
    })),
  {
    loading: () => (
      <div className="h-32 w-48 bg-muted animate-pulse rounded-lg" />
    ),
  }
);

const AccountDetailsEditDialog = dynamic(
  () =>
    import("./AccountDetailsEditDialog").then((mod) => ({
      default: mod.AccountDetailsEditDialog,
    })),
  {
    ssr: false,
  }
);

const Error = dynamic(
  () => import("./partials/Error").then((mod) => ({ default: mod.Error })),
  {
    loading: () => <div className="p-4 text-red-500">Ładowanie...</div>,
  }
);

export function AccountDetails() {
  const { data, isLoading, error, refetch } = useAllAccountDetails();
  const configEntries = Object.entries(accountDetailsDataCardsConfig);

  // Filtruj tylko widoczne pola
  const visibleConfigEntries = configEntries.filter(
    ([, config]) => config.isVisible !== false
  );

  // State dla edycji - null lub fieldKey
  const [editingField, setEditingField] = useState<string | null>(null);

  const isSkeletonCond = isLoading && !data && !error;
  const isErrorCond = !isLoading && !!error && !data;

  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-lg">Więcej o Tobie</p>
        <p className="text-sm text-foreground">
          Bądź atrakcyjniejszym rozmówcą. Znajdź osoby, z którymi masz więcej
          wspólnego!
        </p>
      </div>
      <div
        className={cn("flex flex-row gap-2 overflow-x-hidden", {
          "overflow-x-scroll": data,
        })}
      >
        {isSkeletonCond && <Skeleton />}
        {isErrorCond && <Error refetch={() => refetch()} />}
        {data &&
          visibleConfigEntries.map(([fieldKey, config]) => (
            <AccountDetailsCard
              key={fieldKey}
              fieldKey={fieldKey}
              config={config}
              value={data[fieldKey as keyof typeof data]}
              onEdit={() => setEditingField(fieldKey)}
            />
          ))}
      </div>

      {data && (
        <AccountDetailsEditDialog
          fieldKey={editingField}
          value={
            editingField
              ? data?.[editingField as AccountDetailsFieldKey]
              : undefined
          }
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  );
}
