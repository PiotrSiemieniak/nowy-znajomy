import { GlowingEffect } from "@/components/ui/GlowingEffect";
import { UserRoundSearch, Users, X } from "lucide-react";
import { FormElement } from "@/components/ui/FormElement/FormElement";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InitialStageFormValues, initialStageSchema } from "../utils";
import { DialogFooter, DialogClose } from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { CHANNEL_TAGS_MAX_COUNT } from "@/configs/channels";

interface InitialStageProps {
  form: ReturnType<typeof useForm<InitialStageFormValues>>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  randomExample: string;
}

export function InitialStage({
  form,
  onSubmit,
  randomExample,
}: InitialStageProps) {
  const [tagInput, setTagInput] = useState("");
  const tags = form.watch("tags");

  // Tag management
  const handleAddTag = () => {
    const value = tagInput.trim();
    if (
      value &&
      !tags.includes(value) &&
      tags.length <= CHANNEL_TAGS_MAX_COUNT
    ) {
      form.setValue("tags", [...tags, value], { shouldValidate: true });
      setTagInput("");
    }
  };
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleRemoveTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Typ kanału */}
      <FormElement errorLabel={form.formState.errors.channelType?.message}>
        <div className="flex flex-row space-x-4">
          <button
            type="button"
            className={`relative p-4 rounded-2xl flex-1 bg-accent flex flex-col gap-1 border-2 ${
              form.watch("channelType") === "thematic"
                ? "border-primary"
                : "border-transparent"
            }`}
            onClick={() =>
              form.setValue("channelType", "thematic", { shouldValidate: true })
            }
          >
            <UserRoundSearch className="size-8 rounded-lg border dark:bg-background p-2" />
            <p className="text-left">Tematyczny</p>
            <p className="text-sm text-left font-normal text-muted-foreground">
              Utwórz kanał, w którym rozmówcy losują się nawzajem do rozmowy 1
              na 1.
            </p>
          </button>
          <button
            type="button"
            className={`relative p-4 rounded-2xl flex-1 bg-accent flex flex-col gap-1 border-2 ${
              form.watch("channelType") === "group"
                ? "border-primary"
                : "border-transparent"
            }`}
            onClick={() =>
              form.setValue("channelType", "group", { shouldValidate: true })
            }
          >
            <Users className="size-8 rounded-lg border dark:bg-background p-2" />
            <p className="text-left">Grupowy</p>
            <p className="text-sm text-left font-normal text-muted-foreground">
              Utwórz kanał, w którym wszyscy rozmówcy rozmawiają razem na czacie
              grupowym.
            </p>
          </button>
        </div>
      </FormElement>

      {/* Nazwa kanału */}
      <FormElement
        label="Nazwa kanału"
        desc="Wprowadź wyświetlaną nazwę kanału"
        errorLabel={form.formState.errors.name?.message}
      >
        <Input
          clearable
          placeholder={`np. ${randomExample}`}
          {...form.register("name")}
        />
      </FormElement>

      {/* Opis kanału */}
      <FormElement
        label="Opis kanału"
        desc="Wprowadź opis kanału"
        errorLabel={form.formState.errors.description?.message}
      >
        <Input {...form.register("description")} />
      </FormElement>

      {/* Tagi kanału */}
      <FormElement
        label="Tagi kanału"
        desc={`Wprowadź od 2 do 5 wyrazów kluczowych związanych z tematyką kanału`}
        errorLabel={form.formState.errors.tags?.message}
      >
        <div className="flex gap-2 w-full">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            className="flex-1"
            disabled={tags.length >= 5}
          />
          <Button
            type="button"
            variant={"outline"}
            className="rounded-lg h-full"
            onClick={handleAddTag}
            disabled={tags.length >= 5 || !tagInput.trim()}
          >
            Dodaj
          </Button>
        </div>
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
      </FormElement>
      <Separator />
      <DialogFooter className="flex flex-row justify-end">
        <DialogClose asChild>
          <Button variant={"ghost"}>Anuluj</Button>
        </DialogClose>
        <div className="flex flex-row justify-end">
          <Button type="submit">Kontynuuj</Button>
        </div>
      </DialogFooter>
    </form>
  );
}
