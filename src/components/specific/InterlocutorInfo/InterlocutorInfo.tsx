import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button";
import { FormElement } from "@/components/ui/FormElement";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  LucideMessageCircleQuestion,
  UserRound,
  UserRoundPen,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";

const NICKNAME_SX = "text-xs font-medium my-auto";

export function InterlocutorInfo() {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Nick */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex space-x-2">
          <Avatar>
            <AvatarImage />
            <AvatarFallback className="bg-black">
              <UserRound className="dark:text-muted text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <p className={NICKNAME_SX}>Nieznajomy</p>
        </div>
        <div className="inline-flex w-full space-x-2">
          <Button className="flex-1" variant={"outline"}>
            <UserRoundPen />
            Zapytaj o nazwę
          </Button>
          <Button className="flex-1" variant={"outline"}>
            <UserRoundPlus />
            Dodaj do znajomych
          </Button>
        </div>
      </div>
      {/* Wiek, płeć, wzrost, waga */}
      <div className="flex flex-col gap-2 rounded-md bg-card p-4 border">
        <FormElement label="Wiek">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">21 lat</p>
            <Button variant={"outline"} size={"sm"}>
              Zapytaj
            </Button>
          </div>
        </FormElement>
        <Separator />
        <FormElement label="Płeć">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Kobieta</p>
            <Button variant={"outline"} size={"sm"}>
              Zapytaj
            </Button>
          </div>
        </FormElement>
        <Separator />
        <FormElement label="Wzrost">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Kobieta</p>
            <Button variant={"outline"} size={"sm"}>
              Zapytaj
            </Button>
          </div>
        </FormElement>
        <Separator />
        <FormElement label="Waga">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Kobieta</p>
            <Button variant={"outline"} size={"sm"}>
              Zapytaj
            </Button>
          </div>
        </FormElement>
      </div>
    </div>
  );
}
