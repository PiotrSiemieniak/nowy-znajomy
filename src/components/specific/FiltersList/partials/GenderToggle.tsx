import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { Gender } from "@/lib/globalTypes/personal/gender";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import { useState } from "react";

export function GenderToggle() {
  const [gender, setGender] = useState<Gender>(Gender.undefined);

  const handleClick = (v: Gender | "") => {
    if (v === "") setGender(Gender.undefined);
    else setGender(v);
  };

  return (
    <div>
      <h6>Płeć</h6>
      <p className="muted text-center mb-2">{gender}</p>
      <div className="mx-auto border border-accent w-fit rounded-lg">
        <ToggleGroup
          value={gender}
          onValueChange={handleClick}
          defaultValue={gender}
          type="single"
        >
          <ToggleGroupItem value={Gender.female} aria-label={Gender.female}>
            <Mars className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value={Gender.male} aria-label={Gender.male}>
            <Venus className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value={Gender.undefined}
            aria-label="Toggle strikethrough"
          >
            <VenusAndMars className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
