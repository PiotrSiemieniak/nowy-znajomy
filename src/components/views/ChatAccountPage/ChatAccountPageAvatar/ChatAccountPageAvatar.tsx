"use client";

import { Typography } from "@/components/ui/Typography";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

export function ChatAccountPageAvatar() {
  const t = useTranslations("account");
  const { data: session } = useSession();
  const user = session?.user;

  // Funkcja do tworzenia fallback inicjałów
  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-4 border rounded-xl border-border">
      <div className="flex items-center gap-2">
        <Avatar className="h-16 w-16 border border-background">
          <AvatarImage src={user?.image || ""} alt={user?.name || "Avatar"} />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Typography
            variant="small"
            className="text-left text-2xl font-medium"
          >
            {user?.name || t("noName")}
          </Typography>
          <Typography variant="muted" className="text-left">
            {user?.email || t("noEmail")}
          </Typography>
        </div>
      </div>
      <Button variant={"outline"}>
        <Pencil />
        Edytuj
      </Button>
    </div>
  );
}
