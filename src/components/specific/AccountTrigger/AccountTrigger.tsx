import { Button } from "@/components/ui/Button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
} from "@/components/ui/DropdownMenu";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function AccountTrigger({ className }: { className?: string }) {
  const { data: session } = useSession();

  if (!session) return null;

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-xl flex gap-2 p-2 w-full max-w-96 h-fit hover:bg-accent transition-colors",
            className
          )}
        >
          <div className="relative h-full aspect-square min-w-10 rounded-2xl overflow-hidden bg-muted">
            {user?.image && (
              <Image
                src={user?.image || ""}
                alt="Avatar"
                className="object-cover"
                fill
              />
            )}
          </div>
          <div className="my-auto">
            <Typography variant={"small"} className="text-left">
              {user?.name}
            </Typography>
            <Typography variant={"muted"}>
              {user?.email || "Brak adresu e-mail"}
            </Typography>
          </div>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="ml-auto p-0  h-8 w-8"
          >
            <MoreVertical />
          </Button>
        </Button>
      </DropdownMenuTrigger>
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
        <DropdownMenuItem className="hover:bg-red-200 dark:bg-red-900 hover:dark:bg-red-800">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
