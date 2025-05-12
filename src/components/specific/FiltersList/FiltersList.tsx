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

const Separator = () => <div className="my-4 px-4 w-full h-px bg-muted" />;

export function FiltersList() {
  return (
    <>
      <FiltersSlider
        filterKeyName="ageRange"
        min={MIN_AGE}
        max={MAX_AGE}
        label="Wiek"
        unit="lat"
      />
      <Separator />
      <GenderToggle />
      <Separator />
      <FiltersSlider
        filterKeyName="heightRange"
        min={MIN_HEIGHT}
        max={MAX_HEIGHT}
        label="Wzrost"
        unit="cm"
      />
      <Separator />
      <FiltersSlider
        filterKeyName="weightRange"
        min={MIN_WAGE}
        max={MAX_WAGE}
        label="Waga"
        unit="kg"
      />
      <Separator />
    </>
  );
}
