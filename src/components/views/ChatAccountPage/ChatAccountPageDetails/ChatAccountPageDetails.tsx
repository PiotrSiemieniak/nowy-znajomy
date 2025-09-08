"use client";

import { accountDetailsDataCardsConfig } from "@/configs/accountDetails";
import { DetailsCard } from "./partials/DetailsCard";
import { EditDialog } from "./partials/EditDialog";
import { useAllAccountDetails } from "./hooks";
import { cn } from "@/lib/utils";
import { Skeleton } from "./partials/Skeleton";
import { Error } from "./partials/Error";
import { useState } from "react";
import type { AccountDetailsFieldKey } from "@/lib/services/api/accountDetails";

export function ChatAccountPageDetails() {
  const { data, isLoading, error, refetch } = useAllAccountDetails();
  const configEntries = Object.entries(accountDetailsDataCardsConfig);

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
          configEntries.map(([fieldKey, config]) => (
            <DetailsCard
              key={fieldKey}
              fieldKey={fieldKey}
              config={config}
              value={data[fieldKey as keyof typeof data]}
              onEdit={() => setEditingField(fieldKey)}
            />
          ))}
      </div>

      <EditDialog
        fieldKey={editingField}
        value={
          editingField
            ? data?.[editingField as AccountDetailsFieldKey]
            : undefined
        }
        onClose={() => setEditingField(null)}
      />
    </div>
  );
}
