"use client";

import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { setTheme } from "@/lib/appOptions/setTheme";
import { ComputerIcon, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeSwitcher({ className }: { className?: string }) {
  const theme = localStorage.theme;
  const t = useTranslations("theme");

  return (
    <>
      <h6>{t("title")}</h6>

      <ToggleGroup
        className={cn(
          "w-full border bg-slate-200 dark:bg-slate-700",
          className
        )}
        value={theme}
        onValueChange={setTheme}
        defaultValue={theme}
        type="single"
      >
        <ToggleGroupItem
          className="flex-1 hover:bg-accent/75"
          value={"light"}
          aria-label={"light theme"}
        >
          <Sun />
        </ToggleGroupItem>
        <ToggleGroupItem
          className="flex-1 hover:bg-accent/75"
          value={"dark"}
          aria-label={"dark theme"}
        >
          <Moon />
        </ToggleGroupItem>
        <ToggleGroupItem
          className="flex-1 hover:bg-accent/75"
          value={"system"}
          aria-label="system theme"
        >
          <ComputerIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
