import { ThemeSwitcher } from "@/components/specific/ThemeSwitcher";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { LoginContent } from "@/components/specific/LoginContent/LoginContent";
import { UserCog } from "lucide-react";
import { AccountTrigger } from "@/components/specific/AccountTrigger";
import { RegisterContent } from "@/components/specific/RegisterContent";
import { useSession } from "next-auth/react";

export function AccountBtn() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && session?.user;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} className="inline-flex">
          Konto <UserCog className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-cardGlass w-80 backdrop-blur-lg">
        <div className={cn("grid gap-4")}>
          <div className="flex space-x-4 min-h-[56px] items-center justify-center">
            {isLoading ? (
              <div className="w-full flex justify-center items-center animate-pulse bg-muted rounded-xl h-[72px]"></div>
            ) : isAuthenticated ? (
              <AccountTrigger />
            ) : (
              <>
                <LoginContent />
                <RegisterContent />
              </>
            )}
          </div>
          <div className="space-y-2 px-2">
            <h5 className="font-medium">Opcje</h5>
            <ThemeSwitcher />
            <h6>Automatyczne połączenia</h6>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
