"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollDetection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;
      setIsAtBottom((prev) => {
        // tylko aktualizuj, gdy zmiana stanu
        if (prev !== atBottom) return atBottom;
        return prev;
      });
    };

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollRef, isAtBottom, scrollToBottom };
}
