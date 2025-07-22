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

const BlockedSignUp = dynamic(() =>
  import("./partials/BlockedSignUp").then((m) => m.BlockedSignUp)
);

const detailsStageSchema = z.object({
  maxUsers: z.union([
    z.string().regex(/^\d*$/, "Podaj liczbę lub zostaw puste").optional(),
    z.undefined(),
  ]),
  isAdultOnly: z.boolean(),
  isModerated: z.boolean(),
  showNicknames: z.boolean(),
  onlyLoggedIn: z.boolean(),
  timeoutBetweenMessages: z.union([
    z.string().regex(/^\d*$/, "Podaj liczbę lub zostaw puste").optional(),
    z.undefined(),
  ]),
});
type DetailsStageFormValues = z.infer<typeof detailsStageSchema>;

export function ChannelCreatorContent() {
  const { status } = useSession();
  const [stage, setStage] = useState<"initial" | "details" | "success">(
    "initial"
  );
  const [success, setSuccess] = useState<string | null>(null);
  const randomExample =
    CHANNEL_NAME_EXAMPLES[
      Math.floor(Math.random() * CHANNEL_NAME_EXAMPLES.length)
    ];
  const [initialStageData, setInitialStageData] = useState<
    null | import("./partials/initialStageSchema").InitialStageFormValues
  >(null);

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
      if (res.code === "NAME_TAKEN" || res.code === "INVALID_NAME") {
        initialForm.setError("name", {
          type: "manual",
          message: "Nazwa kanału jest zajęta lub nieprawidłowa.",
        });
        return;
      }
      // Obsługa innych błędów
      initialForm.setError("name", {
        type: "manual",
        message: "Błąd walidacji.",
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
      alert("Nie udało się utworzyć kanału. Spróbuj ponownie.");
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
        <DialogTitle className="text-left">Kreator nowego kanału</DialogTitle>
        <DialogDescription className="text-left">
          Utwórz nowy kanał, aby stworzyć przestrzeń skupiającą osoby o podobnym
          zainteresowaniu.
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
              name={initialStageData.name}
              channelType={String(initialStageData.channelType)}
              description={initialStageData.description}
            />
          </motion.div>
        )}
        {stage === "success" && (
          <div className="flex flex-col items-center justify-center py-8 border rounded-lg">
            <h2 className="text-lg font-bold mb-2">Kanał został utworzony!</h2>
            <div className="mb-4">
              <p className="text-muted-foreground text-center">
                Kanał o nazwie {initialForm.getValues("name")} został utworzony
              </p>
              <p className="text-muted-foreground text-center">
                Możesz teraz przejść do swojego kanału.
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
              Kopiuj link <Copy />
            </Button>
          </div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
}
