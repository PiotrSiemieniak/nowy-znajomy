"use client";

import { accountDetailsDataCardsConfig } from "@/configs/accountDetails";
import { DetailsCard } from "./partials/DetailsCard";
import { useAllAccountDetails } from "./hooks";
import { cn } from "@/lib/utils";
import { Skeleton } from "./partials/Skeleton";
import { Error } from "./partials/Error";

export function ChatAccountPageDetails() {
  const { data, loading, error, refetch } = useAllAccountDetails();
  const configEntries = Object.entries(accountDetailsDataCardsConfig);

  const isSkeletonCond = loading && !data && !error;
  const isErrorCond = !loading && !!error && !data;

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
        {isErrorCond && <Error refetch={refetch} />}
        {data &&
          configEntries.map(([fieldKey, config]) => (
            <DetailsCard
              key={fieldKey}
              fieldKey={fieldKey}
              config={config}
              value={data[fieldKey as keyof typeof data]}
            />
          ))}
      </div>
    </div>
  );
}
