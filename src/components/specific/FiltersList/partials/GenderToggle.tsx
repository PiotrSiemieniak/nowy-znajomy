import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { Gender } from "@/lib/globalTypes/personal/gender";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function GenderToggle() {
  const [gender, setGender] = useState<Gender>(Gender.undefined);
  const t = useTranslations("filters.gender");

  const handleClick = (v: Gender | "") => {
    if (v === "") setGender(Gender.undefined);
    else setGender(v);
  };

  const getGenderLabel = (gender: Gender) => {
    switch (gender) {
      case Gender.male:
        return t("male");
      case Gender.female:
        return t("female");
      case Gender.undefined:
        return t("any");
      default:
        return t("any");
    }
  };

  return (
    <div>
      <h6>{t("label")}</h6>
      <p className="muted text-center mb-2">{getGenderLabel(gender)}</p>
      <div className="mx-auto border border-accent w-fit rounded-lg">
        <ToggleGroup
          value={gender}
          onValueChange={handleClick}
          defaultValue={gender}
          type="single"
        >
          <ToggleGroupItem value={Gender.female} aria-label={t("female")}>
            <Venus className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value={Gender.male} aria-label={t("male")}>
            <Mars className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value={Gender.undefined} aria-label={t("any")}>
            <VenusAndMars className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
