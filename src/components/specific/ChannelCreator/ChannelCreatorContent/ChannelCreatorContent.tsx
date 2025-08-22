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
import { DetailsStage } from "./partials/DetailsStage";
import {
  CHANNEL_TAGS_MIN_COUNT,
  CHANNEL_TAGS_MAX_COUNT,
} from "@/configs/channels";
import {
  validateChannelInitialStage,
  validateChannelInitialStageClient,
} from "@/lib/services/api/channel";
import {
  ChannelSettings,
  Channel,
  ChannelType,
} from "@/lib/globalTypes/channel";
import { createChannel } from "@/lib/services/api/channel";
import { InitialStage } from "./partials/InitialStage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialStageSchema, InitialStageFormValues } from "./utils";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";

const BlockedSignUp = dynamic(() =>
  import("./partials/BlockedSignUp").then((m) => m.BlockedSignUp)
);

export function ChannelCreatorContent() {
  const { status } = useSession();
  const t = useTranslations("channelCreator");

  const detailsStageSchema = z.object({
    maxUsers: z.union([
      z.string().regex(/^\d*$/, t("validation.maxUsers.number")).optional(),
      z.undefined(),
    ]),
    isAdultOnly: z.boolean(),
    isModerated: z.boolean(),
    showNicknames: z.boolean(),
    onlyLoggedIn: z.boolean(),
    timeoutBetweenMessages: z.union([
      z.string().regex(/^\d*$/, t("validation.timeout.number")).optional(),
      z.undefined(),
    ]),
  });
  type DetailsStageFormValues = z.infer<typeof detailsStageSchema>;

  const [stage, setStage] = useState<"initial" | "details" | "success">(
    "initial"
  );
  const [success, setSuccess] = useState<string | null>(null);
  const randomExampleKey =
    CHANNEL_NAME_EXAMPLES[
      Math.floor(Math.random() * CHANNEL_NAME_EXAMPLES.length)
    ];
  const randomExample = t(`examples.${randomExampleKey}`);
  const [initialStageData, setInitialStageData] =
    useState<null | InitialStageFormValues>(null);

  const initialForm = useForm<InitialStageFormValues>({
    resolver: zodResolver(initialStageSchema),
    defaultValues: initialStageData ?? {
      channelType: undefined,
      name: "",
      description: "",
      tags: [],
    },
    mode: "onChange",
  });
  const detailsForm = useForm<DetailsStageFormValues>({
    resolver: zodResolver(detailsStageSchema),
    defaultValues: {
      maxUsers: "",
      isAdultOnly: false,
      isModerated: false,
      showNicknames: false,
      onlyLoggedIn: false,
      timeoutBetweenMessages: "",
    },
    mode: "onChange",
  });

  // --- Handlery ---
  const handleInitialStageSubmit = initialForm.handleSubmit(async (data) => {
    const res = await validateChannelInitialStage({
      name: data.name.trim(),
      description: data.description.trim(),
      tags: data.tags,
    });
    if (res && typeof res === "object" && "ok" in res && !res.ok) {
      // Obsługa błędów backendu w polu Nazwa kanału
      if (
        (res as any).code === "NAME_TAKEN" ||
        (res as any).code === "INVALID_NAME"
      ) {
        initialForm.setError("name", {
          type: "manual",
          message: t("errors.nameTaken"),
        });
        return;
      }
      // Obsługa innych błędów
      initialForm.setError("name", {
        type: "manual",
        message: t("errors.validation"),
      });
      return;
    }
    setSuccess(null);
    setInitialStageData(data);
    setStage("details");
  });

  const handleCreateChannel = async (settings: ChannelSettings) => {
    if (!initialStageData) return;
    const channelData: Partial<Channel> = {
      name: initialStageData.name.trim(),
      type:
        initialStageData.channelType === "thematic"
          ? ChannelType.THEMATIC
          : ChannelType.GROUP,
      description: initialStageData.description.trim(),
      tags: initialStageData.tags,
      settings,
      isActive: true,
    };
    const res = await createChannel(channelData);
    if (res && typeof res === "object" && "id" in res) {
      setSuccess((res as { id: string }).id);
      setStage("success");
    } else {
      alert(t("errors.createFailed"));
    }
  };

  const handleDetailsStageSubmit = detailsForm.handleSubmit((data) => {
    if (!initialStageData) return;

    const settings: ChannelSettings = {
      maxUsers: data.maxUsers ? Number(data.maxUsers) : undefined,
      isAdultOnly: data.isAdultOnly,
      isModerated: data.isModerated,
      showNicknames: data.showNicknames,
      onlyLoggedIn: data.onlyLoggedIn,
      timeoutBetweenMessages: data.timeoutBetweenMessages
        ? Number(data.timeoutBetweenMessages)
        : undefined,
    };
    handleCreateChannel(settings);
  });

  const handleSetInitialStage = setStage.bind(null, "initial");

  if (status !== "authenticated") {
    return <BlockedSignUp />;
  }

  return (
    <DialogContent className="overflow-hidden">
      <DialogHeader>
        <DialogTitle className="text-left">{t("title")}</DialogTitle>
        <DialogDescription className="text-left">
          {t("description")}
        </DialogDescription>
      </DialogHeader>
      <AnimatePresence mode="wait" initial={false}>
        {stage === "initial" && (
          <motion.div
            key={"initial-stage"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <InitialStage
              form={initialForm}
              onSubmit={handleInitialStageSubmit}
              randomExample={randomExample}
            />
          </motion.div>
        )}
        {stage === "details" && (
          <motion.div
            key="details-stage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <DetailsStage
              form={detailsForm}
              onSubmit={handleDetailsStageSubmit}
              onPrevStage={handleSetInitialStage}
              name={initialStageData?.name || ""}
              channelType={String(initialStageData?.channelType || "")}
              description={initialStageData?.description || ""}
            />
          </motion.div>
        )}
        {stage === "success" && (
          <div className="flex flex-col items-center justify-center py-8 border rounded-lg">
            <h2 className="text-lg font-bold mb-2">{t("success.title")}</h2>
            <div className="mb-4">
              <p className="text-muted-foreground text-center">
                {t("success.message", { name: initialForm.getValues("name") })}
              </p>
              <p className="text-muted-foreground text-center">
                {t("success.nextStep")}
              </p>
            </div>
            {/* TODO: zrobić kopiowanie linku */}
            <Button
              onClick={() => {
                setSuccess(null);
                setInitialStageData(null);
                setStage("initial");
              }}
            >
              {t("success.copyLink")} <Copy />
            </Button>
          </div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
}
