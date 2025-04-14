"use client";
import { generateCustomBorderRadius } from "@/lib/generateCustomBorderRadius";
import { getRandomNum } from "@/lib/getRandomNum";
import { motion } from "motion/react";

export function AuroraElement({
  bgColor,
  index,
}: {
  index: number;
  bgColor: string;
}) {
  const randomLeft = getRandomNum(-75, 75);
  const randomTop = getRandomNum(-75, 75);
  const randomTransform = `rotate(${getRandomNum(0, 360)}deg)`;

  return (
    <div key={index} className="relative">
      <motion.div
        className="absolute size-[200%] blur-[100px] -z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          backgroundColor: bgColor,
          borderRadius: generateCustomBorderRadius(),
          transform: randomTransform,
          top: randomTop,
          left: randomLeft,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}

        // style={{
        //   backgroundColor: bgColor,
        //   borderRadius: generateCustomBorderRadius(),
        //   transform: randomTransform,
        //   top: randomTop,
        //   left: randomLeft,
        // }}
      />
    </div>
  );
}
