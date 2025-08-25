"use client";

import {
  SessionProvider as OriginSessionProvider,
  SessionProviderProps,
  useSession,
} from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { appNotification } from "@/components/ui/Sonner/appNotification";

// Komponent do monitorowania sesji i obsługi notyfikacji
function SessionMonitor() {
  const { data: session, status } = useSession();
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [prevStatus, setPrevStatus] = useState<string>("loading");
  const tAuth = useTranslations("auth.login");
  const tAccount = useTranslations("account.dropdown");

  useEffect(() => {
    // Obsługa logowania
    if (
      status === "authenticated" &&
      prevStatus === "unauthenticated" &&
      session?.user?.name
    ) {
      appNotification(
        tAuth("successTitle"),
        tAuth.rich("successDescription", {
          username: session.user.name,
          b: (chunks) => <strong>{chunks}</strong>,
        }),
        {
          duration: 4000,
        }
      );
    }

    // Obsługa wylogowania
    if (status === "authenticated") {
      setWasAuthenticated(true);
    } else if (status === "unauthenticated" && wasAuthenticated) {
      appNotification(
        tAccount("logoutSuccessTitle"),
        tAccount("logoutSuccessDescription"),
        {
          duration: 3000,
        }
      );
      setWasAuthenticated(false);
    }

    // Aktualizuj poprzedni status
    setPrevStatus(status);
  }, [
    status,
    session?.user?.name,
    wasAuthenticated,
    prevStatus,
    tAuth,
    tAccount,
  ]);

  return null; // Ten komponent nie renderuje niczego
}

export default function SessionProvider(props: SessionProviderProps) {
  return (
    <OriginSessionProvider {...props}>
      {props.children}
      <SessionMonitor />
    </OriginSessionProvider>
  );
}
