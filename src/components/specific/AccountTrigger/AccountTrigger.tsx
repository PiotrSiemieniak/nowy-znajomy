import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { DropdownContent } from "./partials/DropdownContent";

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
      <DropdownContent />
    </DropdownMenu>
  );
}
