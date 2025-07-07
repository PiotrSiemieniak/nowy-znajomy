import React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
};

const headingVariants: Record<string, string> = {
  h1: "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-xl font-semibold tracking-tight",
  h6: "text-muted-foreground text-sm mx-4 mb-2 font-medium",
};

export function Heading({ as = "h1", className = "", children }: HeadingProps) {
  const Tag = as;
  const variantClass = headingVariants[as] || "";
  return <Tag className={cn(variantClass, className)}>{children}</Tag>;
}
