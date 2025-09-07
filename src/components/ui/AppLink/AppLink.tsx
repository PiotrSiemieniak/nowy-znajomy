"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useState, MouseEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import {
  ChatStateCtx,
  useContextSelector,
  useChatAction,
} from "@/components/providers/ChatProvider/ChatProvider";

interface AppLinkProps extends Omit<LinkProps, "onClick"> {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function AppLink({
  children,
  href,
  className,
  onClick,
  ...props
}: AppLinkProps) {
  const t = useTranslations("navigation.leaveChat");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { changeChatState } = useChatAction();

  // Pobieramy chatId do rozłączenia
  const chatId = useContextSelector(ChatStateCtx, (state) => state.chatId);
  const chatStage = useContextSelector(
    ChatStateCtx,
    (state) => state.chatStage
  );

  if (!href) throw new Error("<AppLink /> wymaga href");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Jeśli użytkownik jest podłączony do chatu, zatrzymaj nawigację i pokaż dialog
    if (chatStage === ChatStage.Connected) {
      e.preventDefault();
      setDialogOpen(true);
      return;
    }

    // W przeciwnym razie pozwól na normalną nawigację
    if (onClick) {
      onClick(e);
    }
  };

  const handleConfirmLeave = async () => {
    // Rozłącz od chatu jeśli jesteśmy połączeni
    if (chatStage === ChatStage.Connected && chatId) {
      try {
        // Zmień stan na rozłączony
        changeChatState(ChatStage.Disconnected);
      } catch (error) {
        console.error("Błąd podczas rozłączania:", error);
      }
    }

    setDialogOpen(false);
    // Wykonaj nawigację programatically
    router.push(href.toString());
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Link href={href} className={className} onClick={handleClick} {...props}>
        {children}
      </Link>

      {chatStage === ChatStage.Connected && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[90vw] w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t("cancel")}
              </Button>
              <Button variant="destructive" onClick={handleConfirmLeave}>
                {t("confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
