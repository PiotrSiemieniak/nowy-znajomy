import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { TradeDataPopoverOpen } from "@/components/providers/ChatProvider/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { appNotification } from "@/components/ui/Sonner/appNotification";
import { ArrowDownToDot, ArrowUpFromDot } from "lucide-react";
import { useSession } from "next-auth/react";
import { LABEL_TRANSLATIONS } from "../consts";
import { useInterlocutorInfoActions } from "./hook";

// TODO: zrobić zabezpieczenie w postaci sprawdzenia, czy jesteśmy zalogowani
export function InterlocutorInfoDialog() {
  const { tradeDataPopoverOpen } = useChatState();
  const { changeTradeDataPopoverOpen } = useChatAction();
  const { status } = useSession();
  const { sendTradeData } = useInterlocutorInfoActions();

  // Early returns validations
  if (status !== "authenticated") {
    appNotification(
      "Zaloguj się",
      "Wysyłaj oraz wymieniaj informacje ze swoim rozmówcą. Do tego potrzebujesz konta. Zaloguj się, albo zarejestruj się, aby kontynuować.",
      {}
    );

    return null;
  }
  if (!tradeDataPopoverOpen) {
    return null;
  }
  // end

  const label =
    (tradeDataPopoverOpen && LABEL_TRANSLATIONS[tradeDataPopoverOpen]) ||
    "Odkryj informację";

  const handleClose = changeTradeDataPopoverOpen.bind(null, null);
  const handleOfferTradeData = () => {
    sendTradeData("trade", tradeDataPopoverOpen);
  };

  return (
    <Dialog onOpenChange={handleClose} open={!!tradeDataPopoverOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-left">{label}</DialogTitle>
            <DialogDescription className="text-left">
              Odkryjcie informacje i pozwólcie poznać się lepiej.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 border bg-muted rounded p-4 relative">
            <p className="text-sm font-medium">Wyślij informację</p>
            <p className="text-xs text-muted-foreground">
              Opcja{" "}
              <Badge>
                <ArrowUpFromDot className="size-3 mr-1 my-auto" />
                Wyślij
              </Badge>{" "}
              odkrywa informację, jednak nie działa to w drugą stronę. Nie
              zobaczysz tej samej informacji od rozmówcy, dopóki sam nie wyrazi
              takiej woli.
            </p>
            <div className="grid gap-3">
              <p className="text-sm font-medium">Wymień informację</p>
              <p className="text-xs text-muted-foreground">
                Opcja{" "}
                <Badge>
                  <span className="inline-flex">
                    <ArrowUpFromDot className="size-3" />
                    <ArrowDownToDot className="size-3 mr-1" />
                  </span>
                  Wymień
                </Badge>{" "}
                wysyła rozmówcy ofertę wymiany informacji. Jeśli rozmówca
                zaakceptuje, obie strony wzajemnie zobaczą swoje informacje.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <div className="flex w-full">
              <Button
                onClick={handleOfferTradeData}
                type="submit"
                className="w-1/2 rounded-r-none"
              >
                <span className="inline-flex">
                  <ArrowUpFromDot />
                  <ArrowDownToDot />
                </span>
                Wymień
              </Button>
              <Button type="submit" className="w-1/2 rounded-l-none border-l">
                <ArrowUpFromDot />
                Wyślij
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
