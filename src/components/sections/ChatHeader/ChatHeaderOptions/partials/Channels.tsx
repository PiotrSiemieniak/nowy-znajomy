"use client";

import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { SlidersHorizontal } from "lucide-react";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/Command";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/Carousel";
import { useState } from "react";
import { useChatAction } from "@/components/providers/ChatProvider";

export function ChannelsContent() {
  return (
    <Command className="rounded-lg border shadow-md h-full md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Groups">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function Channels() {
  const { handlePopoverOpen } = useChatAction();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = (condition: boolean) => {
    console.log("handleOpen", condition);
    handlePopoverOpen(condition);
    setIsOpen(condition);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>
        <Button size={"sm"} className="rounded-xl inline-flex">
          Filtry i kanały <SlidersHorizontal className="ml-1" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-1 w-full max-h-3/4">
        <Carousel className="w-full bg-amber-950">
          <CarouselContent className="h-full bg-red-900">
            <CarouselItem className="w-full h-96 bg-amber-200"></CarouselItem>
            <CarouselItem className="w-full h-96 bg-amber-300"></CarouselItem>
          </CarouselContent>
        </Carousel>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose className="w-full">
            <Button variant="outline" className="w-full mt-2">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
