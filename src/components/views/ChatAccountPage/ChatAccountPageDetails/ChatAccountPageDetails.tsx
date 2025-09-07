"use client";

import { accountDetailsDataCardsConfig } from "@/configs/accountDetails";
import { DetailsCard } from "./partials/DetailsCard";
import { useAllAccountDetails } from "./hooks";

export function ChatAccountPageDetails() {
  const { data } = useAllAccountDetails();
  const configEntries = Object.entries(accountDetailsDataCardsConfig);

  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-lg">Więcej o Tobie</p>
        <p className="text-sm text-foreground">
          Bądź atrakcyjniejszym rozmówcą. Znajdź osoby, z którymi masz więcej
          wspólnego!
        </p>
      </div>
      <div className="flex flex-row gap-2 overflow-x-scroll">
        {configEntries.map(([fieldKey, config]) => (
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
