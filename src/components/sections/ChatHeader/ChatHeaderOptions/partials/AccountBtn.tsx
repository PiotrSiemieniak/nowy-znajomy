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
import { Separator } from "@/components/ui/Separator";

export function AccountBtn() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} className="inline-flex">
          Konto <UserCog className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-card/75 w-80 backdrop-blur-lg">
        <div className={cn("grid gap-4")}>
          <div className="flex space-x-4">
            <AccountTrigger />
            {/* <LoginContent />
            <Button size={"sm"} className="flex-1">
              Zarejestruj
            </Button> */}
          </div>
          <Separator />
          <div className="space-y-2">
            <h5 className="font-medium">Opcje</h5>
            <ThemeSwitcher />
            <h6>Automatyczne połączenia</h6>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
