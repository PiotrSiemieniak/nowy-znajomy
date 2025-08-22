import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/DropdownMenu";
import { signOut } from "next-auth/react";
import React from "react";
import { useTranslations } from "next-intl";

export function DropdownContent() {
  const t = useTranslations("account.dropdown");

  return (
    <DropdownMenuContent className="w-56" align="start">
      <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          {t("edit")}
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {t("friends")}
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {t("messageHistory")}
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {t("upgradeToPro")}
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>{t("shareApp")}</DropdownMenuItem>
      <DropdownMenuItem>{t("downloadApp")}</DropdownMenuItem>
      <DropdownMenuItem disabled>{t("api")}</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="hover:bg-red-200 dark:bg-red-900 hover:dark:bg-red-800"
        onClick={() => signOut({ redirect: false })}
      >
        {t("logout")}
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
