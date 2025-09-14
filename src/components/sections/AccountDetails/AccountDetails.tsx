"use client";

import { accountDetailsDataCardsConfig } from "@/configs/accountDetails";
import { useAllAccountDetails } from "./hooks";
import { cn } from "@/lib/utils";
import { Skeleton } from "./partials/Skeleton";
import { useState } from "react";
import type { AccountDetailsFieldKey } from "@/lib/services/api/accountDetails";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";

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
  const t = useTranslations("account.details");
  const configEntries = Object.entries(accountDetailsDataCardsConfig);

  // Filtruj tylko widoczne pola
  const visibleConfigEntries = configEntries.filter(
    ([, config]) => config.isVisible !== false
  );

  // State dla edycji - null lub fieldKey
  const [editingField, setEditingField] = useState<string | null>(null);

  // State dla sortowania
  const [sortType, setSortType] = useState<
    "toComplete" | "alphabetical" | "completed"
  >("toComplete");

  // Funkcja sortowania
  const getSortedEntries = () => {
    if (!data) return visibleConfigEntries;

    switch (sortType) {
      case "toComplete":
        // Bez wartości na początku
        return [...visibleConfigEntries].sort(([fieldKeyA], [fieldKeyB]) => {
          const valueA = data[fieldKeyA as keyof typeof data];
          const valueBb = data[fieldKeyB as keyof typeof data];
          const hasValueA = valueA !== null && valueA !== undefined;
          const hasValueB = valueBb !== null && valueBb !== undefined;

          // Pola bez wartości pierwsze
          if (!hasValueA && hasValueB) return -1;
          if (hasValueA && !hasValueB) return 1;

          // Jeśli oba mają lub nie mają wartości, sortuj alfabetycznie po tłumaczeniu
          const titleA = t(fieldKeyA as never);
          const titleB = t(fieldKeyB as never);
          return titleA.localeCompare(titleB);
        });

      case "alphabetical":
        // Sortowanie alfabetyczne po tytule
        return [...visibleConfigEntries].sort(([fieldKeyA], [fieldKeyB]) => {
          const titleA = t(fieldKeyA as never);
          const titleB = t(fieldKeyB as never);
          return titleA.localeCompare(titleB);
        });

      case "completed":
        // Z wartościami na początku
        return [...visibleConfigEntries].sort(([fieldKeyA], [fieldKeyB]) => {
          const valueA = data[fieldKeyA as keyof typeof data];
          const valueB = data[fieldKeyB as keyof typeof data];
          const hasValueA = valueA !== null && valueA !== undefined;
          const hasValueB = valueB !== null && valueB !== undefined;

          // Pola z wartościami pierwsze
          if (hasValueA && !hasValueB) return -1;
          if (!hasValueA && hasValueB) return 1;

          // Jeśli oba mają lub nie mają wartości, sortuj alfabetycznie
          const titleA = t(fieldKeyA as never);
          const titleB = t(fieldKeyB as never);
          return titleA.localeCompare(titleB);
        });

      default:
        return visibleConfigEntries;
    }
  };

  const sortedEntries = getSortedEntries();

  const isSkeletonCond = isLoading && !data && !error;
  const isErrorCond = !isLoading && !!error && !data;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-col md:flex-row space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-lg">Więcej o Tobie</p>
          </div>
          <p className="text-sm text-foreground">
            Bądź atrakcyjniejszym rozmówcą. Znajdź osoby, z którymi masz więcej
            wspólnego!
          </p>
        </div>
      </div>
      <div
        className={cn("flex flex-row gap-2 overflow-x-hidden", {
          "overflow-x-scroll": data,
        })}
      >
        <AnimatePresence mode="wait">
          {isSkeletonCond && <Skeleton />}
          {isErrorCond && <Error refetch={() => refetch()} />}
          {data &&
            sortedEntries.map(([fieldKey, config]) => (
              <AccountDetailsCard
                key={fieldKey}
                fieldKey={fieldKey}
                config={config}
                value={data[fieldKey as keyof typeof data]}
                onEdit={() => setEditingField(fieldKey)}
              />
            ))}
        </AnimatePresence>
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

      <Tabs
        value={sortType}
        onValueChange={(value) => setSortType(value as typeof sortType)}
        className="w-fit mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="toComplete">Brakujące</TabsTrigger>
          <TabsTrigger value="alphabetical">Alfabetycznie</TabsTrigger>
          <TabsTrigger value="completed">Wypełnione</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
