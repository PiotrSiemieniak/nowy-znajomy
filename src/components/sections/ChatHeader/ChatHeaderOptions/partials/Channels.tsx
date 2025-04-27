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
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/Carousel";
import { useEffect, useState } from "react";
import { useChatAction } from "@/components/providers/ChatProvider";
import { cn } from "@/lib/utils";
import { ChannelsList } from "@/components/specific/ChannelsList";
import { FiltersList } from "@/components/specific/FiltersList";

function ChannelsTrigger() {
  return (
    <DrawerTrigger asChild>
      <Button size={"sm"} className="rounded-xl inline-flex">
        Filtry i kanały <SlidersHorizontal className="ml-1" />
      </Button>
    </DrawerTrigger>
  );
}

function ChannelsPagination({
  onNextClick,
  onPrevClick,
  count,
  current,
}: {
  onPrevClick: () => void;
  onNextClick: () => void;
  count: number;
  current: number;
}) {
  const basicBtnSx =
    "inline-flex space-x-1 text-xs transition-opacity opacity-100 hover:bg-transparent";

  return (
    <div className="flex flex-row items-center relative w-full transition-all duration-1000">
      <Button
        variant={"ghost"}
        className={cn(basicBtnSx, "mr-auto", {
          "opacity-0": current === 1,
        })}
        onClick={onPrevClick}
      >
        <ChevronLeft className="size-4 my-auto" />
        Kanały
      </Button>
      {/* Dots */}
      <div className="flex flex-row gap-2 flex-1 absolute left-1/2 -translate-x-1/2">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={cn("size-2 bg-gray-500 rounded-full", {
              "bg-gray-100": i === current - 1,
            })}
          />
        ))}
      </div>
      <Button
        variant={"ghost"}
        className={cn(basicBtnSx, "ml-auto", {
          "opacity-0": current === 2,
        })}
        onClick={onNextClick}
      >
        Filtry
        <ChevronRight className="size-4 my-auto" />
      </Button>
    </div>
  );
}

function ChannelsFooter() {
  return (
    <DrawerFooter className="pt-0">
      <Button>Submit</Button>
      <DrawerClose className="w-full">
        <Button variant="outline" className="w-full mt-2">
          Cancel
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );
}

export function Channels() {
  const { handlePopoverOpen } = useChatAction();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Handlers

  const handleNextSlide = () => {
    if (!api) return;
    api.scrollNext();
  };

  const handlePrevSlide = () => {
    if (!api) return;
    api.scrollPrev();
  };

  const handleOpen = (condition: boolean) => {
    handlePopoverOpen(condition);
    setIsOpen(condition);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Drawer open={isOpen} onOpenChange={handleOpen}>
      <ChannelsTrigger />
      <DrawerContent className="px-1 w-full max-h-full flex flex-col">
        <div className="relative min-h-0 w-full grow overflow-y-auto">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent className="h-full">
              <CarouselItem className="w-full h-full max-h-[75vh]">
                <DrawerHeader>
                  <DrawerTitle className="mb-2">Kanały</DrawerTitle>
                  <ChannelsList />
                  <DrawerDescription className="my-2">
                    Wybierz <b>kanał tematyczny</b> 1 na 1, by połączyć się z
                    osobą o podobnych zainteresowaniach. Skorzystaj z{" "}
                    <b>kanałów regionalnych</b>, jeśli chcesz porozmawiać z kimś
                    z Twojej okolicy. Dołącz do <b>kanałów grupowych</b>, aby
                    pisać wspólnie z większą liczbą użytkowników w luźniejszej
                    atmosferze.
                  </DrawerDescription>
                </DrawerHeader>
              </CarouselItem>
              <CarouselItem className="w-full">
                <DrawerHeader>
                  <DrawerTitle>Filtry</DrawerTitle>
                  <FiltersList />
                  <DrawerDescription className="mb-2">
                    Filtry pozwalają Ci określić preferencje wobec rozmówcy w
                    kanałach 1 na 1 – od wieku i płci, po zainteresowania i inne
                    cechy. Dzięki temu trafiasz na osoby, z którymi łatwiej
                    złapiesz wspólny język. Podczas losowania rozmówcy Twoje
                    preferencje będą priorytetowe.
                  </DrawerDescription>
                </DrawerHeader>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          {/* <div className="absolute bottom-0 w-full h-7">
            <div className="size-full relative z-10 touch-none flex flex-col">
              <div className="flex-1 w-full backdrop-blur-sm" />
              <div className="flex-1 w-full backdrop-blur-md" />
              <div className="flex-1 w-full backdrop-blur-lg" />
            </div>
          </div> */}
        </div>

        <ChannelsPagination
          count={count}
          current={current}
          onNextClick={handleNextSlide}
          onPrevClick={handlePrevSlide}
        />
        <ChannelsFooter />
      </DrawerContent>
    </Drawer>
  );
}
