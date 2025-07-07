import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      muted: "text-muted-foreground text-sm",
      small: "text-sm leading-none font-medium",
      large: "text-lg font-semibold",
      lead: "text-muted-foreground text-xl",
      default: "leading-7 [&:not(:first-child)]:mt-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean;
    as?: React.ElementType;
  };

export function Typography({
  className,
  variant,
  as: Tag = "p",
  asChild,
  ...props
}: TypographyProps) {
  const Comp = asChild ? React.Fragment : Tag;
  return (
    <Comp className={cn(typographyVariants({ variant }), className)} {...props}>
      {props.children}
    </Comp>
  );
}
