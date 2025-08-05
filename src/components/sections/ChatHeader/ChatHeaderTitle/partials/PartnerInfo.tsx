"use client";

import { InterlocutorInfo } from "@/components/specific/InterlocutorInfo";
import { InterlocutorInfoNickname } from "@/components/specific/InterlocutorInfo/InterlocutorInfoNickname";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

const NICKNAME_SX = "text-xs font-medium my-auto";

export function PartnerInfo() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger>
        <div className="flex flex-row items-center justify-center flex-1">
          <InterlocutorInfoNickname />
          <ChevronUp
            className={cn(
              "text-foreground size-3 ml-1 my-auto transition-transform",
              {
                "rotate-180": isOpen,
              }
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-cardGlass backdrop-blur-lg max-sm:w-[97vw] w-fit">
        <InterlocutorInfo />
      </PopoverContent>
    </Popover>
  );
}
