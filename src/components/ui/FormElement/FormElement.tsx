import * as React from "react";
import { Label } from "../Label";
import { Desc } from "./partials/Desc";

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
    <div className="w-full space-y-1">
      {label && <Label>{label}</Label>}
      {children}
      <Desc desc={desc} errorLabel={errorLabel} />
    </div>
  );
}
