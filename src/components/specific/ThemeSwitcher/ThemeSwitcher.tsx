"use client";

import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { setTheme } from "@/lib/appOptions/setTheme";
import { ComputerIcon, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ThemeSwitcher({ className }: { className?: string }) {
  const theme = localStorage.theme;

  return (
    <div className={cn("grid gap-4", className)}>
      {/* <h4 className="font-medium leading-none">Niezalogowany</h4>
          <div className="bg-muted h-px w-full" /> */}
      <div className="flex space-x-4">
        <Button size={"sm"} className="flex-1">
          Zaloguj
        </Button>
        <Button size={"sm"} className="flex-1">
          Zarejestruj
        </Button>
      </div>
      <div className="bg-muted h-px w-full" />
      <div>
        <h5 className="font-medium">Opcje</h5>
        <h6>Tryb UI</h6>

        <ToggleGroup
          className="w-full border bg-slate-200 dark:bg-slate-700"
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
      </div>
    </div>
  );
}
