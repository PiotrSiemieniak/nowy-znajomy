import { GlowingEffect } from "@/components/ui/GlowingEffect";
import { UserRoundSearch, Users, X } from "lucide-react";
import { FormElement } from "@/components/ui/FormElement/FormElement";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useState, KeyboardEvent } from "react";
import {
  CHANNEL_TAGS_MIN_COUNT,
  CHANNEL_TAGS_MAX_COUNT,
} from "@/configs/channels";
import { Button } from "@/components/ui/Button";

interface InitialStageProps {
  channelType: "thematic" | "group" | null;
  setChannelType: (type: "thematic" | "group") => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  errors: {
    type?: string;
    name?: string;
    description?: string;
    tags?: string;
  };
  randomExample: string;
}

export function InitialStage({
  channelType,
  setChannelType,
  name,
  setName,
  description,
  setDescription,
  tags,
  setTags,
  errors,
  randomExample,
}: InitialStageProps) {
  const [tagInput, setTagInput] = useState("");

  function handleAddTag() {
    const value = tagInput.trim();
    if (
      value &&
      !tags.includes(value) &&
      tags.length < CHANNEL_TAGS_MAX_COUNT
    ) {
      setTags([...tags, value]);
      setTagInput("");
    }
  }

  function handleTagInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <>
      {/* typ */}
      <div className="flex flex-row space-x-4">
        <button
          type="button"
          className={`relative p-4 rounded-2xl flex-1 bg-accent flex flex-col gap-1 border-2 ${
            channelType === "thematic" ? "border-primary" : "border-transparent"
          }`}
          onClick={() => setChannelType("thematic")}
        >
          <UserRoundSearch className="size-8 rounded-lg border dark:bg-background p-2" />
          <GlowingEffect
            blur={0}
            borderWidth={3}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <p className="text-left">Tematyczny</p>
          <p className="text-sm text-left font-normal text-muted-foreground">
            Utwórz kanał, w którym rozmówcy losują się nawzajem do rozmowy 1 na
            1.
          </p>
        </button>
        <button
          type="button"
          className={`relative p-4 rounded-2xl flex-1 bg-accent flex flex-col gap-1 border-2 ${
            channelType === "group" ? "border-primary" : "border-transparent"
          }`}
          onClick={() => setChannelType("group")}
        >
          <Users className="size-8 rounded-lg border dark:bg-background p-2" />
          <GlowingEffect
            blur={0}
            borderWidth={3}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <p className="text-left">Grupowy</p>
          <p className="text-sm text-left font-normal text-muted-foreground">
            Utwórz kanał, w którym wszyscy rozmówcy rozmawiają razem na czacie
            grupowym.
          </p>
        </button>
      </div>

      {/* nazwa */}
      <FormElement
        label="Nazwa kanału"
        desc="Wprowadź wyświetlaną nazwę kanału"
        errorLabel={errors.name}
      >
        <Input
          clearable
          placeholder={`np. ${randomExample}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormElement>

      {/* opis */}
      <FormElement
        label="Opis kanału"
        desc="Wprowadź opis kanału"
        errorLabel={errors.description}
      >
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormElement>

      {/* tagi kanału */}
      <div>
        <FormElement
          label="Tagi kanału"
          desc={`Wprowadź od ${CHANNEL_TAGS_MIN_COUNT} do ${CHANNEL_TAGS_MAX_COUNT} wyrazów kluczowych związanych z tematyką kanału`}
          errorLabel={errors.tags}
        >
          <div className="flex gap-2 w-full">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1"
              disabled={tags.length >= CHANNEL_TAGS_MAX_COUNT}
            />
            <Button
              type="button"
              variant={"outline"}
              className="rounded-lg h-full"
              onClick={handleAddTag}
              disabled={
                tags.length >= CHANNEL_TAGS_MAX_COUNT || !tagInput.trim()
              }
            >
              Dodaj
            </Button>
          </div>
        </FormElement>

        <div className="pt-1 flex flex-row gap-2 flex-wrap">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-muted"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag} <X className="inline size-3 ml-1" />
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
