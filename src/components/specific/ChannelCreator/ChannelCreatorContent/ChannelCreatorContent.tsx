import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { CHANNEL_NAME_EXAMPLES } from "../ChannelCreatorTeaser/data";
import { useState } from "react";
import { InitialStage } from "./partials/InitialStage";
import { DetailsStage } from "./partials/DetailsStage";
import {
  CHANNEL_TAGS_MIN_COUNT,
  CHANNEL_TAGS_MAX_COUNT,
} from "@/configs/channels";

const BlockedSignUp = dynamic(() =>
  import("./partials/BlockedSignUp").then((m) => m.BlockedSignUp)
);

export function ChannelCreatorContent() {
  const { status } = useSession();

  // --- FORM STATE ---
  const [stage, setStage] = useState<"initial" | "details">("initial");
  const [channelType, setChannelType] = useState<"thematic" | "group" | null>(
    null
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    type?: string;
    name?: string;
    description?: string;
    tags?: string;
  }>({});

  if (status !== "authenticated") {
    return <BlockedSignUp />;
  }

  // losowanie przykładowej nazwy kanału do placeholdera
  const randomExample =
    CHANNEL_NAME_EXAMPLES[
      Math.floor(Math.random() * CHANNEL_NAME_EXAMPLES.length)
    ];

  function handleContinue() {
    const newErrors: typeof errors = {};
    if (!channelType) newErrors.type = "Wybierz typ kanału";
    if (!name.trim()) newErrors.name = "Podaj nazwę kanału";
    if (!description.trim()) newErrors.description = "Podaj opis kanału";
    if (tags.length < CHANNEL_TAGS_MIN_COUNT)
      newErrors.tags = `Dodaj co najmniej ${CHANNEL_TAGS_MIN_COUNT} tagi.`;
    if (tags.length > CHANNEL_TAGS_MAX_COUNT)
      newErrors.tags = `Możesz dodać maksymalnie ${CHANNEL_TAGS_MAX_COUNT} tagów.`;
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStage("details");
    }
  }

  return (
    <DialogContent className="overflow-hidden">
      <DialogHeader>
        <DialogTitle className="text-left">Kreator nowego kanału</DialogTitle>
        <DialogDescription className="text-left">
          Utwórz nowy kanał, aby stworzyć przestrzeń skupiającą osoby o podobnym
          zainteresowaniu.
        </DialogDescription>
      </DialogHeader>
      {/* przenieś START */}
      {stage === "initial" && (
        <InitialStage
          channelType={channelType}
          setChannelType={setChannelType}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
          errors={errors}
          randomExample={randomExample}
        />
      )}
      {stage === "details" && (
        <DetailsStage
          name={name}
          channelType={String(channelType)}
          description={description}
        />
      )}
      {/* przenieś END */}
      <Separator />
      <DialogFooter className="flex flex-row justify-end items-end">
        <DialogClose asChild>
          <Button variant={"ghost"}>Anuluj</Button>
        </DialogClose>
        <Button onClick={handleContinue}>Kontynuuj</Button>
      </DialogFooter>
    </DialogContent>
  );
}
