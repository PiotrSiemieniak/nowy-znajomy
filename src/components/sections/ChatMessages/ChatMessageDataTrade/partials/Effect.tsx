"use client";
import { animate, motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  IceCreamCone,
  PersonStanding,
  Shirt,
  Smile,
  Tag,
  User,
} from "lucide-react";
import { useChatState } from "@/components/providers/ChatProvider";

export function Effect() {
  return (
    <Wrapper>
      <Skeleton />
    </Wrapper>
  );
}

// TODO: Dodać losowanie ikonek z obiektu, który ma wszystkie ikony pod tytuły
const Skeleton = () => {
  const { bgColors } = useChatState();
  const RANDOM_BG_COLORS = useMemo(
    () =>
      bgColors ? [...bgColors].sort(() => 0.5 - Math.random()).slice(0, 5) : [],
    [bgColors]
  );
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    animate(sequence, {
      // @ts-ignore
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <Tag
            className="h-4 w-4 brightness-75 dark:brightness-125"
            style={{ color: RANDOM_BG_COLORS[0] }}
          />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <IceCreamCone
            className="h-6 w-6 brightness-75 dark:brightness-125"
            style={{ color: RANDOM_BG_COLORS[1] }}
          />
        </Container>
        <Container className="circle-3">
          <User
            className="h-8 w-8 brightness-75 dark:brightness-125"
            style={{ color: RANDOM_BG_COLORS[2] }}
          />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <Shirt
            className="h-6 w-6 brightness-75 dark:brightness-125"
            style={{ color: RANDOM_BG_COLORS[3] }}
          />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <Smile
            className="h-4 w-4 brightness-75 dark:brightness-125"
            style={{ color: RANDOM_BG_COLORS[4] }}
          />
        </Container>
      </div>

      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-3/4 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};
const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

const Wrapper = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};
