import {
  useContextSelector,
  ChatStateCtx,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { Filters } from "@/components/providers/ChatProvider/types";
import { Slider } from "@/components/ui/Slider/Slider";

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
  filterKeyName,
}: {
  min: number;
  max: number;
  label: string;
  unit: string;
  filterKeyName: keyof Filters;
}) {
  const filters = useContextSelector(
    ChatStateCtx,
    (state) => state.filters || {}
  );
  const updateFilters = useContextSelector(
    ChatActionCtx,
    (actions) => actions.updateFilters
  );
  const filterValue = filters[filterKeyName];
  const range = Array.isArray(filterValue) // Check czy wartość jest tablicą [0, 1].
    ? [filterValue[0], filterValue[1]]
    : [min, max];

  const handleSliderChange = (newValue: number[]) => {
    updateFilters({
      [filterKeyName]: [newValue[0], newValue[1]],
    });
  };

  // const handleResetRange = () =>
  //   updateFilters({
  //     [filterKeyName]: [min, max],
  //   });

  return (
    <div>
      <h6>{label}</h6>
      <div className="w-full flex items-center flex-row mb-2">
        <span className="muted text-left w-full ml-4">
          {getLabel(range, unit, min, max)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        value={range}
        onValueChange={handleSliderChange}
      />
    </div>
  );
}
