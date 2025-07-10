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

export function DropdownContent() {
  return (
    <DropdownMenuContent className="w-56" align="start">
      <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Edytuj
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Znajomi
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Historia wiadomości
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Ulepsz do Pro
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Udostępnij aplikację</DropdownMenuItem>
      <DropdownMenuItem>Pobierz aplikację</DropdownMenuItem>
      <DropdownMenuItem disabled>API</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="hover:bg-red-200 dark:bg-red-900 hover:dark:bg-red-800"
        onClick={() => signOut()}
      >
        Wyloguj
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
