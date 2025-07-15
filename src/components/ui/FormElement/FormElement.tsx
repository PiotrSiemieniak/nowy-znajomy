"use client";

import * as React from "react";
import { Label } from "../Label";
import { Desc } from "./partials/Desc";
import { motion } from "motion/react";

interface FormElementProps {
  label?: string;
  desc?: string;
  errorLabel?: string;
  children: React.ReactNode;
}

export function FormElement({
  label,
  desc,
  errorLabel,
  children,
}: FormElementProps) {
  return (
    <motion.div
      layout
      initial={false}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
      className="w-full space-y-1"
    >
      {label && <Label>{label}</Label>}
      {children}
      <Desc desc={desc} errorLabel={errorLabel} />
    </motion.div>
  );
}
