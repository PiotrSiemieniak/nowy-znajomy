import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider/Slider";
import { useState } from "react";

const getLabel = (
  wageState: number[],
  unit: string,
  min: number,
  max: number
) => {
  const isMinWageNotDefault = wageState[0] !== min;
  const isMaxWageNotDefault = wageState[1] !== max;

  switch (true) {
    case isMinWageNotDefault && isMaxWageNotDefault:
      return (
        <>
          Od <b>{wageState[0]}</b> do <b>{wageState[1]}</b> {unit}.
        </>
      );
    case isMinWageNotDefault:
      return (
        <>
          Od <b>{wageState[0]}</b> {unit}.
        </>
      );
    case isMaxWageNotDefault:
      return (
        <>
          Do <b>{wageState[1]}</b> {unit}.
        </>
      );

    default:
      return <>Dowolnie</>;
  }
};

export function FiltersSlider({
  min,
  max,
  label,
  unit,
}: {
  min: number;
  max: number;
  label: string;
  unit: string;
}) {
  const [range, setRange] = useState([min, max]);

  const handleSliderChange = (newValue: number[]) => {
    setRange(newValue);
  };

  const handleResetRange = () => setRange([min, max]);

  return (
    <div>
      <h6>{label}</h6>
      <div className="w-full flex items-center flex-row mb-2">
        <span className="muted text-center w-full">
          {getLabel(range, unit, min, max)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        value={[range[0], range[1]]}
        onValueChange={handleSliderChange}
      />
      <div className="w-full flex items-center flex-row mt-2">
        <Button variant={"link"} className="mx-auto" onClick={handleResetRange}>
          Ustaw dowolny
        </Button>
      </div>
    </div>
  );
}
