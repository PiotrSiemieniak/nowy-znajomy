import { Badge } from "@/components/ui/Badge";
import { FormElement } from "@/components/ui/FormElement";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { ArrowLeft, UserRoundSearch, Users } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChannelType, ChannelSettings } from "@/lib/globalTypes/channel";
import { Separator } from "@/components/ui/Separator";
import { DialogClose, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const isPremiumUser = false; // Zmień na true by przetestować wersję premium

const detailsStageSchema = z.object({
  maxUsers: z.union([z.string().regex(/^\d*$/).optional(), z.undefined()]),
  isAdultOnly: z.boolean(),
  isModerated: z.boolean(),
  showNicknames: z.boolean(),
  onlyLoggedIn: z.boolean(),
  timeoutBetweenMessages: z.union([
    z.string().regex(/^\d*$/).optional(),
    z.undefined(),
  ]),
});

type DetailsStageFormValues = z.infer<typeof detailsStageSchema>;

interface DetailsStageProps {
  form: ReturnType<typeof useForm<DetailsStageFormValues>>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onPrevStage: () => void;
  name: string;
  description: string;
  channelType: string;
}

export function DetailsStage({
  form,
  onSubmit,
  name,
  description,
  channelType,
  onPrevStage,
}: DetailsStageProps) {
  const t = useTranslations("channelCreator.detailsStage");

  const channelTypeIcon =
    channelType === "thematic" ? (
      <UserRoundSearch className="text-muted-foreground size-4 ml-1" />
    ) : (
      <Users className="text-muted-foreground size-4 ml-1" />
    );

  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-col">
        <p className="text-xs text-muted-foreground inline-flex">
          {t("header.newChannel")} <b className="ml-1">{channelType}</b>{" "}
          {channelTypeIcon}
        </p>
        <p className="inline-flex font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <FormElement
          label={t("maxUsers.label")}
          desc={t("maxUsers.description")}
          errorLabel={form.formState.errors.maxUsers?.message}
        >
          <Input
            placeholder={t("maxUsers.placeholder")}
            type="number"
            min={2}
            {...form.register("maxUsers")}
            clearable
          />
        </FormElement>
        <FormElement
          label={t("adultOnly.label")}
          desc={t("adultOnly.description")}
          errorLabel={form.formState.errors.isAdultOnly?.message}
        >
          <Controller
            control={form.control}
            name="isAdultOnly"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label={t("moderation.label")}
          desc={t("moderation.description")}
          errorLabel={form.formState.errors.isModerated?.message}
        >
          <Controller
            control={form.control}
            name="isModerated"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label={t("showNicknames.label")}
          desc={t("showNicknames.description")}
          errorLabel={form.formState.errors.showNicknames?.message}
        >
          <Controller
            control={form.control}
            name="showNicknames"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label={t("onlyLoggedIn.label")}
          desc={t("onlyLoggedIn.description")}
          errorLabel={form.formState.errors.onlyLoggedIn?.message}
        >
          <Controller
            control={form.control}
            name="onlyLoggedIn"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label={t("messageTimeout.label")}
          desc={t("messageTimeout.description")}
          errorLabel={form.formState.errors.timeoutBetweenMessages?.message}
        >
          <Input
            placeholder={t("messageTimeout.placeholder")}
            type="number"
            min={1}
            {...form.register("timeoutBetweenMessages")}
          />
        </FormElement>
      </div>
      <Separator />
      <DialogFooter className="flex flex-row justify-between items-center">
        <Button type="button" onClick={onPrevStage} variant={"ghost"}>
          <ArrowLeft />
          {t("buttons.back")}
        </Button>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant={"ghost"}>
              {t("buttons.cancel")}
            </Button>
          </DialogClose>
          <div className="flex flex-row justify-end">
            <Button type="submit">{t("buttons.create")}</Button>
          </div>
        </div>
      </DialogFooter>
    </form>
  );
}
