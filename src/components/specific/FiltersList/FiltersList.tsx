import {
  MAX_AGE,
  MAX_HEIGHT,
  MAX_WAGE,
  MIN_AGE,
  MIN_HEIGHT,
  MIN_WAGE,
} from "@/configs/filters";
import { FiltersSlider } from "./partials/FiltersSlider";
import { GenderToggle } from "./partials/GenderToggle";
import { useTranslations } from "next-intl";

const Separator = () => <div className="my-4 px-4 w-full h-px bg-muted" />;

export function FiltersList() {
  const t = useTranslations("filters");

  return (
    <>
      <FiltersSlider
        filterKeyName="ageRange"
        min={MIN_AGE}
        max={MAX_AGE}
        label={t("age.label")}
        unit={t("age.unit")}
      />
      <Separator />
      <GenderToggle />
      <Separator />
      <FiltersSlider
        filterKeyName="heightRange"
        min={MIN_HEIGHT}
        max={MAX_HEIGHT}
        label={t("height.label")}
        unit={t("height.unit")}
      />
      <Separator />
      <FiltersSlider
        filterKeyName="weightRange"
        min={MIN_WAGE}
        max={MAX_WAGE}
        label={t("weight.label")}
        unit={t("weight.unit")}
      />
      <Separator />
    </>
  );
}
