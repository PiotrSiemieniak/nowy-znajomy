"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTranslations } from "next-intl";

export function SearchStageButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("chat");
  const controls = useAnimation();
  const [shakeTrigger, setShakeTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShakeTrigger((v) => v + 1);
    }, 10000); // co 10 sekund
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({
      x: [0, -10, 10, -10, 10, 0], // dwukrotne bujanie
      transition: { duration: 0.6, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    });
  }, [shakeTrigger, controls]);

  return (
    <motion.div className="w-full h-fit" animate={controls}>
      <Button onClick={onClick} className="w-full">
        {t("searchNewFriend")}
      </Button>
    </motion.div>
  );
}
