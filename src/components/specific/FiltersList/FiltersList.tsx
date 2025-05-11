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
import { FiltersSelect } from "./partials/FiltersSelect";

const Separator = () => <div className="my-4 px-4 w-full h-px bg-muted" />;

export function FiltersList() {
  return (
    <>
      <FiltersSlider min={MIN_AGE} max={MAX_AGE} label="Wiek" unit="lat" />
      <Separator />
      <GenderToggle />
      <Separator />
      <FiltersSlider
        min={MIN_HEIGHT}
        max={MAX_HEIGHT}
        label="Wzrost"
        unit="cm"
      />
      <Separator />
      <FiltersSlider min={MIN_WAGE} max={MAX_WAGE} label="Waga" unit="kg" />
      <Separator />
    </>
  );
}
