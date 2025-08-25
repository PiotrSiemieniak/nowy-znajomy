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
import {
  useContextSelector,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { cn } from "@/lib/utils";
import { ChannelsList } from "@/components/specific/ChannelsList";
import { FiltersList } from "@/components/specific/FiltersList";
import { ActiveChannelBadges } from "@/components/specific/ActiveChannelBadges/ActiveChannelBadges";
import { ChannelCreator } from "@/components/specific/ChannelCreator";
import { useTranslations } from "next-intl";

function ChannelsTrigger() {
  const t = useTranslations("channels");

  return (
    <DrawerTrigger asChild>
      <Button size={"sm"} className="rounded-xl inline-flex">
        {t("title")} <SlidersHorizontal className="ml-1" />
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
  const t = useTranslations("channels");
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
        {t("channels")}
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
        {t("filters")}
        <ChevronRight className="size-4 my-auto" />
      </Button>
    </div>
  );
}

function ChannelsFooter() {
  const t = useTranslations("channels");

  return (
    <DrawerFooter className="pt-0">
      <Button>{t("submit")}</Button>
      <DrawerClose className="w-full">
        <Button variant="outline" className="w-full mt-2">
          {t("cancel")}
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );
}

export function Channels() {
  const handlePopoverOpen = useContextSelector(
    ChatActionCtx,
    (actions) => actions.handlePopoverOpen
  );
  const t = useTranslations("channels");
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
                <DrawerHeader className="space-y-2">
                  <div className="inline-flex items-center justify-between w-full">
                    <DrawerTitle>{t("channels")}</DrawerTitle>
                    <ChannelCreator />
                  </div>
                  <ChannelsList />
                  <ActiveChannelBadges />
                  <DrawerDescription>
                    {t.rich("channelsDescription", {
                      b: (chunks) => <b>{chunks}</b>,
                    })}
                  </DrawerDescription>
                </DrawerHeader>
              </CarouselItem>
              <CarouselItem className="w-full">
                <DrawerHeader className="space-y-2">
                  <DrawerTitle>{t("filters")}</DrawerTitle>
                  <FiltersList />
                  <DrawerDescription>
                    {t("filtersDescription")}
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
