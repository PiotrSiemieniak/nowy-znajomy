import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function AccountTrigger({ className }: { className?: string }) {
  const { data: session } = useSession();

  if (!session) return null;

  const { user } = session;

  return (
    <div
      className={cn(
        "rounded-xl flex gap-2 p-4 w-full max-w-96 bg-card hover:bg-accent transition-colors",
        className
      )}
    >
      <div className="relative size-10 min-w-10 rounded-full overflow-hidden bg-black">
        <Image
          src={user?.image || ""}
          alt="Avatar"
          className="object-cover"
          fill
        />
      </div>
      <div className="my-auto">
        <p className="text-sm text-foreground font-medium">
          Witaj, {user?.name}
        </p>
        <p className="text-xs text-muted-foreground">
          Kliknij, aby przejść do ustawień konta
        </p>
      </div>
    </div>
  );
}
