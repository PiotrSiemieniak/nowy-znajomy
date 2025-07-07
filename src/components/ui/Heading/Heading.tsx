import React from "react";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
};

export function Heading({ as = "h1", className = "", children }: HeadingProps) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
